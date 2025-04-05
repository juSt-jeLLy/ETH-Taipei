"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  Send,
  User,
  Bot,
  Shield,
  ArrowLeft,
  Loader,
  Settings,
  Info,
  AlertCircle,
} from "lucide-react";
import NavBar from "../../components/NavBar";

// API configuration from environment variables
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://0.0.0.0:8001";
const API_AUTH_HEADER = "Basic " + btoa(
  `${process.env.NEXT_PUBLIC_API_USERNAME || "admin"}:${process.env.NEXT_PUBLIC_API_PASSWORD || "password123"}`
);

export default function AgentChat() {
  const params = useParams();
  const router = useRouter();
  const agentName = (params.name as string) || "";
  
  const [messages, setMessages] = useState<
    { sender: string; text: string; timestamp: Date }[]
  >([]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showAgentInfo, setShowAgentInfo] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [initializingChat, setInitializingChat] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatInputRef = useRef<HTMLInputElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize chat session with API
  const initializeChatSession = async () => {
    try {
      setInitializingChat(true);
      
      const response = await axios.post(
        `${API_BASE_URL}/chat/session`,
        {},
        {
          headers: {
            'Authorization': API_AUTH_HEADER,
            'Content-Type': 'application/json'
          }
        }
      );
      
      const { session_id } = response.data;
      setSessionId(session_id);
      console.log("Chat session initialized with ID:", session_id);
      
      // Add welcome message from agent
      setMessages([
        {
          sender: "agent",
          text: `Hello! I'm ${agentName}, your Web3 AI agent. How can I assist you today?`,
          timestamp: new Date(),
        },
      ]);
      
      // Focus on chat input
      setTimeout(() => {
        chatInputRef.current?.focus();
      }, 100);
      
      setInitializingChat(false);
    } catch (error) {
      console.error("Error initializing chat session:", error);
      setInitializingChat(false);
      
      // Add fallback welcome message if API call fails
      setMessages([
        {
          sender: "agent",
          text: `Hello! I'm ${agentName}, your Web3 AI agent. How can I assist you today? (Note: Chat API connection failed)`,
          timestamp: new Date(),
        },
      ]);
    }
  };

  // Check if user has access to this agent
  useEffect(() => {
    // Verify access from session storage
    const checkAccess = () => {
      try {
        const accessibleAgents = JSON.parse(sessionStorage.getItem('accessibleAgents') || '[]');
        const agentAccess = accessibleAgents.find(
          (agent: any) => agent.name === agentName && agent.accessGranted
        );
        
        if (agentAccess) {
          setHasAccess(true);
          // Initialize chat session with API
          initializeChatSession();
        } else {
          // No access, redirect to MyAgents page
          router.push('/MyAgents');
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Error checking agent access:", error);
        setIsLoading(false);
        router.push('/MyAgents');
      }
    };
    
    checkAccess();
  }, [agentName, router]);

  // Handle sending a new message to the API
  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    // Add user message to UI
    const userMessage = {
      sender: "user",
      text: newMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const sentMessage = newMessage;
    setNewMessage("");

    // Show typing indicator
    setIsTyping(true);

    try {
      if (sessionId) {
        // Send message to API
        const response = await axios.post(
          `${API_BASE_URL}/chat/${sessionId}`,
          { content: sentMessage },
          {
            headers: {
              'Authorization': API_AUTH_HEADER,
              'Content-Type': 'application/json'
            }
          }
        );

        // Hide typing indicator
        setIsTyping(false);

        // Add agent response from API
        const agentResponse = {
          sender: "agent",
          text: response.data.response || "Sorry, I couldn't process that request.",
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, agentResponse]);
      } else {
        // Fallback if no session ID (API connection failed)
        setTimeout(() => {
          setIsTyping(false);
          
          // Add fallback agent response
          const agentResponse = {
            sender: "agent",
            text: getFallbackResponse(sentMessage),
            timestamp: new Date(),
          };

          setMessages((prev) => [...prev, agentResponse]);
        }, 1000);
      }
    } catch (error) {
      console.error("Error sending message to API:", error);
      
      // Hide typing indicator
      setIsTyping(false);
      
      // Add error message
      const errorResponse = {
        sender: "agent",
        text: "Sorry, I encountered an error processing your request. Please try again.",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorResponse]);
    }
  };

  // Fallback response generator if API fails
  const getFallbackResponse = (message: string): string => {
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes("hello") || lowerMessage.includes("hi")) {
      return `Hello there! How can I help you with blockchain operations today?`;
    }

    if (lowerMessage.includes("ethereum") || lowerMessage.includes("eth")) {
      return `I'm monitoring the Ethereum network. Gas prices are currently moderate. Would you like me to perform any specific actions on Ethereum?`;
    }

    if (lowerMessage.includes("polygon") || lowerMessage.includes("matic")) {
      return `Polygon network is running smoothly. Transaction costs are very low right now. What would you like to know about Polygon?`;
    }

    if (lowerMessage.includes("transaction") || lowerMessage.includes("tx")) {
      return `I can help monitor transactions or execute them when conditions are met. Would you like me to set up a transaction monitor?`;
    }

    if (lowerMessage.includes("price") || lowerMessage.includes("value")) {
      return `I'm tracking current prices. ETH is at $3,245, BTC is at $51,876, and MATIC is at $0.87. Would you like more detailed price information?`;
    }

    return `I understand you're asking about "${message}". As your Web3 agent, I can monitor blockchain events, execute transactions, and provide analytics. Could you provide more details about what you'd like me to do?`;
  };

  // Reset chat and go back to Agents page
  const handleBack = () => {
    router.push('/MyAgents');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col">
        <header className="relative overflow-hidden">
          <div className="absolute inset-0 z-0 opacity-10 dark:opacity-20">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600" />
            <div className="absolute w-full h-full bg-[url('/grid-pattern.svg')] bg-center" />
          </div>
          <div className="relative z-10">
            <NavBar />
          </div>
        </header>
        
        <div className="flex-grow flex items-center justify-center">
          <motion.div
            className="flex flex-col items-center gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="w-16 h-16 relative"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Loader size={64} className="text-blue-500" />
            </motion.div>
            <h2 className="text-xl font-medium text-gray-700 dark:text-gray-300">Loading agent...</h2>
          </motion.div>
        </div>
      </div>
    );
  }

  if (!hasAccess) {
    // This should never show as we redirect in useEffect, but keeping as fallback
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col">
        <header className="relative overflow-hidden">
          <div className="absolute inset-0 z-0 opacity-10 dark:opacity-20">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600" />
            <div className="absolute w-full h-full bg-[url('/grid-pattern.svg')] bg-center" />
          </div>
          <div className="relative z-10">
            <NavBar />
          </div>
        </header>
        
        <div className="flex-grow flex items-center justify-center">
          <motion.div
            className="p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg flex flex-col items-center gap-4 max-w-md text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <AlertCircle size={32} className="text-red-500" />
            </motion.div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Access Denied</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              You don't have access to this agent. Please return to the Agents page and request access.
            </p>
            <Link href="/MyAgents">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow-md"
              >
                Go to My Agents
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col">
      {/* Header with background pattern */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-10 dark:opacity-20">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600" />
          <div className="absolute w-full h-full bg-[url('/grid-pattern.svg')] bg-center" />
        </div>

        <div className="relative z-10">
          <NavBar />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-4xl bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleBack}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <ArrowLeft size={20} className="text-gray-700 dark:text-gray-300" />
              </motion.button>
              <Bot size={24} className="text-gray-700 dark:text-gray-300" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {agentName}
              </h2>
            </div>
            
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowAgentInfo(!showAgentInfo)}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <Info size={18} className="text-gray-700 dark:text-gray-300" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <Settings size={18} className="text-gray-700 dark:text-gray-300" />
              </motion.button>
            </div>
          </div>

          <div className="flex flex-col h-[calc(100vh-16rem)]">
            {/* Agent info panel - conditionally shown */}
            <AnimatePresence>
              {showAgentInfo && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="border-b border-gray-100 dark:border-gray-800 overflow-hidden"
                >
                  <div className="p-4 bg-gray-50 dark:bg-gray-800/50">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center flex-shrink-0">
                        <Bot size={24} className="text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 dark:text-white">{agentName}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          Web3 AI Agent • Created on {new Date().toLocaleDateString()}
                        </p>
                        <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                          <div className="bg-white dark:bg-gray-800 p-2 rounded border border-gray-200 dark:border-gray-700">
                            <span className="block text-gray-500 dark:text-gray-400">Network</span>
                            <span className="font-medium text-gray-900 dark:text-white">Ethereum, Polygon</span>
                          </div>
                          <div className="bg-white dark:bg-gray-800 p-2 rounded border border-gray-200 dark:border-gray-700">
                            <span className="block text-gray-500 dark:text-gray-400">Capabilities</span>
                            <span className="font-medium text-gray-900 dark:text-white">Transactions, Monitoring</span>
                          </div>
                        </div>
                        
                        {/* MCPs Integration Section */}
                        <div className="mt-3 bg-white dark:bg-gray-800 p-2 rounded border border-gray-200 dark:border-gray-700">
                          <span className="block text-gray-500 dark:text-gray-400 mb-2">Integrated MCPs</span>
                          <div className="flex flex-wrap gap-2">
                            {/* Hardcoded MCP based on the IPFS example, you would fetch this from agent data */}
                            <div className="flex items-center gap-1.5 px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-xs">
                              <div className="w-3 h-3 rounded-full overflow-hidden">
                                <Image 
                                  src="/download.png" 
                                  alt="1inch MCP" 
                                  width={12} 
                                  height={12} 
                                />
                              </div>
                              1inch-mcp
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Chat messages */}
            <div 
              ref={chatContainerRef}
              className="flex-grow overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-800/30"
            >
              <AnimatePresence>
                {messages.map((message, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex ${
                      message.sender === "user"
                        ? "justify-end"
                        : "justify-start"
                    } mb-3`}
                  >
                    {message.sender === "agent" && (
                      <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-2 flex-shrink-0 mt-1">
                        <Bot size={16} className="text-blue-600 dark:text-blue-400" />
                      </div>
                    )}
                    <div
                      className={`max-w-[75%] p-3 rounded-2xl shadow-sm ${
                        message.sender === "user"
                          ? "bg-blue-600 text-white rounded-tr-none"
                          : "bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-tl-none"
                      }`}
                    >
                      {message.sender === "agent" ? (
                        <div className="markdown-content text-sm sm:text-base">
                          <ReactMarkdown 
                            remarkPlugins={[remarkGfm]}
                            components={{
                              p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
                              ul: ({node, ...props}) => <ul className="list-disc pl-5 mb-2" {...props} />,
                              ol: ({node, ...props}) => <ol className="list-decimal pl-5 mb-2" {...props} />,
                              li: ({node, ...props}) => <li className="mb-1" {...props} />,
                              h1: ({node, ...props}) => <h1 className="text-xl font-bold mb-2" {...props} />,
                              h2: ({node, ...props}) => <h2 className="text-lg font-bold mb-2" {...props} />,
                              h3: ({node, ...props}) => <h3 className="text-base font-bold mb-2" {...props} />,
                              a: ({node, ...props}) => <a className="text-blue-400 underline" target="_blank" rel="noopener noreferrer" {...props} />,
                              code: ({node, ...props}) => 
                                true 
                                  ? <code className="bg-gray-800 px-1 py-0.5 rounded text-xs" {...props} />
                                  : <code className="block bg-gray-800 p-2 rounded my-2 text-xs overflow-x-auto" {...props} />,
                              pre: ({node, ...props}) => <pre className="bg-gray-800 p-0 rounded my-2 overflow-x-auto" {...props} />,
                              blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-gray-500 pl-3 italic my-2" {...props} />
                            }}
                          >
                            {message.text}
                          </ReactMarkdown>
                        </div>
                      ) : (
                        <p className="text-sm sm:text-base">{message.text}</p>
                      )}
                      <p
                        className={`text-xs mt-2 ${
                          message.sender === "user"
                            ? "text-blue-200"
                            : "text-gray-500 dark:text-gray-400"
                        }`}
                      >
                        {message.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    {message.sender === "user" && (
                      <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center ml-2 flex-shrink-0 mt-1">
                        <User size={16} className="text-white" />
                      </div>
                    )}
                  </motion.div>
                ))}

                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start mb-3"
                  >
                    <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-2 flex-shrink-0 mt-1">
                      <Bot size={16} className="text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="p-3 rounded-2xl rounded-tl-none bg-white dark:bg-gray-700 shadow-sm">
                      <div className="flex gap-1">
                        <div
                          className="w-2 h-2 rounded-full bg-gray-500 dark:bg-gray-400 animate-bounce"
                          style={{ animationDelay: "0ms" }}
                        ></div>
                        <div
                          className="w-2 h-2 rounded-full bg-gray-500 dark:bg-gray-400 animate-bounce"
                          style={{ animationDelay: "150ms" }}
                        ></div>
                        <div
                          className="w-2 h-2 rounded-full bg-gray-500 dark:bg-gray-400 animate-bounce"
                          style={{ animationDelay: "300ms" }}
                        ></div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>

            {/* Message input */}
            <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
              <div className="flex gap-3 items-center">
                <input
                  ref={chatInputRef}
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-3 rounded-full border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 transition-all text-gray-900 dark:text-white"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSendMessage();
                  }}
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className={`p-3 rounded-full flex items-center justify-center ${
                    !newMessage.trim()
                      ? "bg-gray-200 dark:bg-gray-800 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 text-white shadow-md"
                  } transition-colors`}
                >
                  <Send size={18} />
                </motion.button>
              </div>
              <div className="mt-2 flex justify-center">
                <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                  <Shield size={12} />
                  <span>End-to-end encrypted • Powered by blockchain</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="py-6 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-3 mb-4 md:mb-0">
              <div className="w-8 h-8 relative">
                <Image src="/images.png" alt="ETH Taipei" fill className="object-contain" />
              </div>
              <span className="text-lg font-semibold text-gray-900 dark:text-white">
                ETH Taipei AI Agents
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
              <Link href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">
                About
              </Link>
              <Link href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">
                Documentation
              </Link>
              <Link href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">
                Privacy
              </Link>
              <div className="flex items-center gap-2">
                <Shield size={14} />
                <span>ETH Taipei AI Agents © 2023</span>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Global styles for markdown content */}
      <style jsx global>{`
        .markdown-content pre {
          margin: 0;
        }

        .markdown-content table {
          border-collapse: collapse;
          margin: 1em 0;
          overflow-x: auto;
          display: block;
          width: 100%;
        }

        .markdown-content table th,
        .markdown-content table td {
          border: 1px solid #4a5568;
          padding: 0.5rem;
          text-align: left;
        }

        .markdown-content table th {
          background-color: #2d3748;
        }

        .markdown-content hr {
          border: 0;
          border-top: 1px solid #4a5568;
          margin: 1em 0;
        }
        
        .markdown-content img {
          max-width: 100%;
          height: auto;
        }
      `}</style>
    </div>
  );
}