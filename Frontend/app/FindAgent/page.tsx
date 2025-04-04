"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Send,
  User,
  Bot,
  Shield,
  Layers,
  ArrowLeft,
  Loader,
} from "lucide-react";
import NavBar from "../components/NavBar";

export default function FindAgent() {
  const [agentName, setAgentName] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [agentFound, setAgentFound] = useState(false);
  const [messages, setMessages] = useState<
    { sender: string; text: string; timestamp: Date }[]
  >([]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatInputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle agent search
  const handleSearch = () => {
    if (!agentName.trim()) return;

    setIsSearching(true);

    // Simulate search delay
    setTimeout(() => {
      setIsSearching(false);
      setAgentFound(true);

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
    }, 1500);
  };

  // Handle sending a new message
  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    // Add user message
    const userMessage = {
      sender: "user",
      text: newMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setNewMessage("");

    // Simulate agent typing
    setIsTyping(true);

    // Simulate agent response after delay
    setTimeout(() => {
      setIsTyping(false);

      // Add agent response
      const agentResponse = {
        sender: "agent",
        text: getAgentResponse(newMessage),
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, agentResponse]);
    }, 1500 + Math.random() * 1000);
  };

  // Simple response generator
  const getAgentResponse = (message: string): string => {
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-800 mb-16"
        >
          <div className="flex items-center gap-3 mb-8 pb-6 border-b border-gray-100 dark:border-gray-800">
            <Bot size={24} className="text-gray-700 dark:text-gray-300" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Find and Chat with Your Agent
            </h2>
          </div>

          {!agentFound ? (
            <div className="space-y-6">
              <p className="text-gray-600 dark:text-gray-400">
                Enter the ENS name of your agent to start chatting with it.
              </p>

              <div className="flex gap-3">
                <input
                  type="text"
                  value={agentName}
                  onChange={(e) => setAgentName(e.target.value)}
                  placeholder="Enter agent ENS name (e.g., myagent.eth)"
                  className="flex-1 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-400 dark:focus:ring-gray-600"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSearch();
                  }}
                />
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSearch}
                  disabled={!agentName.trim() || isSearching}
                  className={`px-6 py-3 rounded-lg flex items-center justify-center gap-2 font-medium ${
                    !agentName.trim() || isSearching
                      ? "bg-gray-200 dark:bg-gray-800 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-gray-900 to-black dark:from-gray-100 dark:to-white text-white dark:text-gray-900"
                  }`}
                >
                  {isSearching ? (
                    <>
                      <Loader size={18} className="animate-spin" />
                      <span>Searching...</span>
                    </>
                  ) : (
                    <>
                      <Search size={18} />
                      <span>Find Agent</span>
                    </>
                  )}
                </motion.button>
              </div>

              <div className="mt-8 text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Don't have an agent yet?
                </p>
                <Link href="/CreateAgent">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="mt-2 px-4 py-2 text-blue-600 dark:text-blue-400 font-medium"
                  >
                    Create a new agent
                  </motion.button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-gray-100 dark:border-gray-800">
                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                  <Bot size={20} className="text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {agentName}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Web3 AI Agent
                  </p>
                </div>
              </div>

              {/* Chat messages */}
              <div className="h-96 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
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
                      }`}
                    >
                      <div
                        className={`max-w-[80%] p-3 rounded-lg ${
                          message.sender === "user"
                            ? "bg-blue-600 text-white"
                            : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white"
                        }`}
                      >
                        <p>{message.text}</p>
                        <p
                          className={`text-xs mt-1 ${
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
                    </motion.div>
                  ))}

                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex justify-start"
                    >
                      <div className="max-w-[80%] p-3 rounded-lg bg-gray-200 dark:bg-gray-700">
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
              <div className="flex gap-3">
                <input
                  ref={chatInputRef}
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-400 dark:focus:ring-gray-600"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSendMessage();
                  }}
                />
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className={`px-6 py-3 rounded-lg flex items-center justify-center gap-2 font-medium ${
                    !newMessage.trim()
                      ? "bg-gray-200 dark:bg-gray-800 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-gray-900 to-black dark:from-gray-100 dark:to-white text-white dark:text-gray-900"
                  }`}
                >
                  <Send size={18} />
                  <span>Send</span>
                </motion.button>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="py-12 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-3 mb-4 md:mb-0">
              <Image src="/images.png" alt="" width={32} height={32} />
              <span className="text-lg font-semibold text-gray-900 dark:text-white">
                ETH Taipei AI Agents
              </span>
            </div>
            <div className="flex items-center gap-6 text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <Shield size={14} />
                <span>ETH Taipei AI Agents © 2023</span>
              </div>
              <div className="flex items-center gap-2">
                <Layers size={14} />
                <span>Powered by blockchain technology</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
