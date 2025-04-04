from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Depends, HTTPException, status
from fastapi.security import HTTPBasic, HTTPBasicCredentials
from fastapi.responses import HTMLResponse
from pydantic import BaseModel
import asyncio
import secrets
import uvicorn
from typing import List, Dict, Optional
from mcp_agent.core.fastagent import FastAgent

# Create FastAPI app
app = FastAPI(title="AI Agent Chat API")
security = HTTPBasic()

# Create the FastAgent
fast_agent = FastAgent("FastAgent Example")

# Simple in-memory user storage (replace with a database in production)
users = {
    "admin": "password123"  # username: password (use proper hashing in production)
}

# Chat history storage (replace with a database in production)
chat_sessions: Dict[str, List[Dict[str, str]]] = {}

# Models
class Message(BaseModel):
    content: str

class ChatResponse(BaseModel):
    response: str
    
class ChatSession(BaseModel):
    session_id: str
    messages: List[Dict[str, str]]

# Authentication dependency
def verify_credentials(credentials: HTTPBasicCredentials = Depends(security)):
    username = credentials.username
    password = credentials.password
    
    if username in users and secrets.compare_digest(users[username], password):
        return username
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid credentials",
        headers={"WWW-Authenticate": "Basic"},
    )

# Create new chat session
@app.post("/chat/session", response_model=ChatSession)
async def create_chat_session(username: str = Depends(verify_credentials)):
    session_id = secrets.token_urlsafe(16)
    chat_sessions[session_id] = []
    return {"session_id": session_id, "messages": []}

# Get existing chat session
@app.get("/chat/session/{session_id}", response_model=ChatSession)
async def get_chat_session(session_id: str, username: str = Depends(verify_credentials)):
    if session_id not in chat_sessions:
        raise HTTPException(status_code=404, detail="Chat session not found")
    return {"session_id": session_id, "messages": chat_sessions[session_id]}

# Send a message to the AI and get a response
@app.post("/chat/{session_id}", response_model=ChatResponse)
async def send_message(session_id: str, message: Message, username: str = Depends(verify_credentials)):
    if session_id not in chat_sessions:
        raise HTTPException(status_code=404, detail="Chat session not found")
    
    # Store user message
    chat_sessions[session_id].append({"role": "user", "content": message.content})
    
    # Process message with FastAgent
    response = await process_with_agent(message.content)
    
    # Store AI response
    chat_sessions[session_id].append({"role": "assistant", "content": response})
    
    return {"response": response}

# FastAgent processing function
async def process_with_agent(message: str) -> str:
    response_text = ""
    
    # Define the agent function that will handle the message
    @fast_agent.agent(instruction="You are a helpful AI Agent", servers=["fetch"])
    async def chat_agent():
        nonlocal response_text
        async with fast_agent.run() as agent:
            response = await agent(message)
            response_text = str(response)
    
    # Run the agent
    await chat_agent()
    return response_text

# WebSocket endpoint for real-time chat
@app.websocket("/ws/{session_id}")
async def websocket_endpoint(websocket: WebSocket, session_id: str):
    await websocket.accept()
    
    # Create session if it doesn't exist
    if session_id not in chat_sessions:
        chat_sessions[session_id] = []
    
    try:
        while True:
            # Receive message from client
            message = await websocket.receive_text()
            
            # Store user message
            chat_sessions[session_id].append({"role": "user", "content": message})
            
            # Process with FastAgent
            response = await process_with_agent(message)
            
            # Store AI response
            chat_sessions[session_id].append({"role": "assistant", "content": response})
            
            # Send response back to client
            await websocket.send_text(response)
    except WebSocketDisconnect:
        print(f"Client disconnected from session {session_id}")

# Simple HTML client for testing
@app.get("/", response_class=HTMLResponse)
async def get_html():
    return """
    <!DOCTYPE html>
    <html>
        <head>
            <title>AI Agent Chat</title>
            <style>
                body { max-width: 800px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif; }
                #chat { height: 400px; border: 1px solid #ddd; overflow-y: scroll; padding: 10px; margin-bottom: 10px; }
                #message { width: 80%; padding: 8px; }
                .user { color: blue; }
                .assistant { color: green; }
            </style>
        </head>
        <body>
            <h1>AI Agent Chat</h1>
            <div id="chat"></div>
            <input type="text" id="message" placeholder="Type your message...">
            <button onclick="sendMessage()">Send</button>
            
            <script>
                // Create a random session ID for this demo
                const sessionId = Math.random().toString(36).substring(2, 15);
                let wsConnected = false;
                let ws;
                
                // Function to initialize WebSocket connection
                function connectWebSocket() {
                    ws = new WebSocket(`ws://${window.location.host}/ws/${sessionId}`);
                    
                    ws.onopen = function() {
                        wsConnected = true;
                        console.log("WebSocket connected");
                        // Notify the user
                        const chat = document.getElementById('chat');
                        chat.innerHTML += `<p class="system"><em>Connected to chat session: ${sessionId}</em></p>`;
                    };
                    
                    ws.onmessage = function(event) {
                        const chat = document.getElementById('chat');
                        chat.innerHTML += `<p class="assistant"><strong>Assistant:</strong> ${event.data}</p>`;
                        chat.scrollTop = chat.scrollHeight;
                    };
                    
                    ws.onclose = function() {
                        wsConnected = false;
                        console.log("WebSocket disconnected");
                        // Try to reconnect
                        setTimeout(connectWebSocket, 3000);
                    };
                    
                    ws.onerror = function(error) {
                        console.error("WebSocket error:", error);
                        const chat = document.getElementById('chat');
                        chat.innerHTML += `<p class="system" style="color:red;"><em>Error connecting to server. Will retry in 3 seconds...</em></p>`;
                    };
                }
                
                // Initialize connection
                connectWebSocket();
                
                function sendMessage() {
                    const messageInput = document.getElementById('message');
                    const message = messageInput.value;
                    if (message) {
                        const chat = document.getElementById('chat');
                        chat.innerHTML += `<p class="user"><strong>You:</strong> ${message}</p>`;
                        chat.scrollTop = chat.scrollHeight;
                        
                        if (wsConnected) {
                            ws.send(message);
                        } else {
                            chat.innerHTML += `<p class="system" style="color:red;"><em>Not connected to server. Trying to reconnect...</em></p>`;
                            connectWebSocket();
                        }
                        
                        messageInput.value = '';
                    }
                }
                
                // Allow Enter key to send messages
                document.getElementById('message').addEventListener('keypress', function(e) {
                    if (e.key === 'Enter') {
                        sendMessage();
                    }
                });
            </script>
        </body>
    </html>
    """

# Main entry point
if __name__ == "__main__":
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)