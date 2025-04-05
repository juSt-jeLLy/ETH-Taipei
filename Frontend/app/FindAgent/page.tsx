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
  ArrowLeft,
  Loader,
  Settings,
  Info,
  AlertCircle,
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
  const [showAgentInfo, setShowAgentInfo] = useState(false);
  const [nameError, setNameError] = useState<string | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatInputRef = useRef<HTMLInputElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // ENS validation function
  const validateENSName = (name: string): string | null => {
    // Check if empty
    if (!name.trim()) {
      return "Agent ENS name is required";
    }

    // Check if ends with .eth
    if (!name.endsWith(".eth")) {
      return "ENS name must end with .eth";
    }

    // Remove .eth for further validation
    const baseName = name.slice(0, -4);

    // Check minimum length (at least 3 chars before .eth)
    if (baseName.length < 3) {
      return "ENS name must be at least 3 characters long (excluding .eth)";
    }

    // Check for valid characters (lowercase letters, numbers, hyphens)
    if (!/^[a-z0-9-]+$/.test(baseName)) {
      return "ENS name can only contain lowercase letters, numbers, and hyphens";
    }

    // Check for starting or ending with hyphen
    if (baseName.startsWith("-") || baseName.endsWith("-")) {
      return "ENS name cannot start or end with a hyphen";
    }

    // Check for consecutive hyphens
    if (baseName.includes("--")) {
      return "ENS name cannot contain consecutive hyphens";
    }

    return null;
  };

  // Handle name change with validation
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setAgentName(newName);

    // Only show validation errors after user has typed something
    if (newName) {
      // Check if the name doesn't end with .eth and has at least 3 characters
      if (
        newName.length >= 3 &&
        !newName.endsWith(".eth") &&
        !newName.includes(".")
      ) {
        // Show suggestions dropdown
        setShowSuggestions(true);
        setNameError(null);
      } else {
        // Regular validation
        setNameError(validateENSName(newName));
        setShowSuggestions(false);
      }
    } else {
      setNameError(null);
      setShowSuggestions(false);
    }
  };

  // Handle suggestion selection
  const handleSelectSuggestion = (suffix: string) => {
    setAgentName(agentName + suffix);
    setShowSuggestions(false);
    // Focus back on the input
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle agent search
  const handleSearch = () => {
    if (!agentName.trim()) return;

    // Validate ENS name before proceeding
    const error = validateENSName(agentName);
    if (error) {
      setNameError(error);
      return;
    }

    setIsSearching(true);

    // Check if user has access to this agent in session storage
    const accessibleAgents = JSON.parse(sessionStorage.getItem('accessibleAgents') || '[]');
    const hasAccess = accessibleAgents.some(
      (agent: any) => agent.name === agentName && agent.accessGranted
    );

    if (hasAccess) {
      // User has access, redirect to agent chat
      window.location.href = `/FindAgent/${agentName}`;
      return;
    }

    // Simulate search delay
    setTimeout(() => {
      setIsSearching(false);
      
      // Check if the agent name exists in our system
      // This is a mock implementation - in a real app you would check against your database
      const agentExists = true; // Mocked as true for demo purposes
      
      if (agentExists) {
        // Agent exists but user doesn't have access
        alert('You need to request access to this agent. Please go to My Agents page and request access.');
        window.location.href = '/MyAgents';
      } else {
        // Agent not found
        setAgentFound(false);
        alert('Agent not found. Please check the name or create a new agent.');
      }
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

  // Reset chat and go back to search
  const handleReset = () => {
    setAgentFound(false);
    setAgentName("");
    setMessages([]);
    setShowAgentInfo(false);
  };

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
              {agentFound && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleReset}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <ArrowLeft size={20} className="text-gray-700 dark:text-gray-300" />
                </motion.button>
              )}
              <Bot size={24} className="text-gray-700 dark:text-gray-300" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {agentFound ? agentName : "Find and Chat with Your Agent"}
              </h2>
            </div>
            
            {agentFound && (
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
            )}
          </div>

          {!agentFound ? (
            <div className="p-8 space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-center max-w-md mx-auto"
              >
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Bot size={28} className="text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Connect with Your Web3 Agent
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Enter the ENS name of your agent to start chatting and managing your Web3 operations.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="max-w-md mx-auto"
              >
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search size={18} className="text-gray-400" />
                  </div>
                  <input
                    ref={inputRef}
                    type="text"
                    value={agentName}
                    onChange={handleNameChange}
                    placeholder="Enter agent ENS name (e.g., myagent.eth)"
                    className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                      nameError
                        ? "border-red-300 dark:border-red-700 focus:ring-red-400 dark:focus:ring-red-600"
                        : "border-gray-300 dark:border-gray-700 focus:ring-blue-400 dark:focus:ring-blue-600"
                    } bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 transition-all`}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !nameError && agentName.trim()) handleSearch();
                    }}
                  />
                  
                  {/* Suggestions dropdown */}
                  <AnimatePresence>
                    {showSuggestions && (
                      <motion.div
                        ref={suggestionsRef}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{
                          duration: 0.2,
                          type: "spring",
                          stiffness: 200,
                        }}
                        className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg overflow-hidden"
                      >
                        <motion.div
                          className="p-2 border-b border-gray-100 dark:border-gray-700 bg-blue-50 dark:bg-blue-900/30"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.1 }}
                        >
                          <p className="text-sm text-blue-600 dark:text-blue-300 font-medium">
                            Recommended ENS formats:
                          </p>
                        </motion.div>
                        <motion.div
                                                  whileHover={{
                                                    backgroundColor: "rgba(243, 244, 246, 0.5)",
                                                  }}
                                                  transition={{ duration: 0.2 }}
                                                >
                                                  <button
                                                    onClick={() => handleSelectSuggestion(".eth")}
                                                    className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                                                  >
                                                    <motion.span
                                                      className="font-medium"
                                                      initial={{ opacity: 0, x: -5 }}
                                                      animate={{ opacity: 1, x: 0 }}
                                                      transition={{ delay: 0.2 }}
                                                    >
                                                      {agentName}.eth
                                                    </motion.span>
                                                    <motion.span
                                                      className="text-xs text-gray-500 dark:text-gray-400"
                                                      initial={{ opacity: 0 }}
                                                      animate={{ opacity: 1 }}
                                                      transition={{ delay: 0.3 }}
                                                    >
                                                      (Standard ENS format)
                                                    </motion.span>
                                                  </button>
                                                </motion.div>
                                              </motion.div>
                                            )}
                                          </AnimatePresence>
                                        </div>
                                        
                                        {/* Error message */}
                                        <AnimatePresence>
                                          {nameError && (
                                            <motion.div
                                              className="mt-2 flex items-center gap-1.5 text-sm text-red-500 dark:text-red-400"
                                              initial={{ opacity: 0, height: 0 }}
                                              animate={{ opacity: 1, height: "auto" }}
                                              exit={{ opacity: 0, height: 0 }}
                                              transition={{ duration: 0.2 }}
                                            >
                                              <motion.div
                                                animate={{ rotate: [0, 10, 0] }}
                                                transition={{ duration: 0.5, repeat: 1 }}
                                              >
                                                <AlertCircle size={14} />
                                              </motion.div>
                                              <span>{nameError}</span>
                                            </motion.div>
                                          )}
                                        </AnimatePresence>
                                        
                                        <motion.button
                                          whileHover={{ scale: 1.02 }}
                                          whileTap={{ scale: 0.98 }}
                                          onClick={handleSearch}
                                          disabled={!agentName.trim() || isSearching || !!nameError}
                                          className={`w-full mt-4 py-3 rounded-lg flex items-center justify-center gap-2 font-medium transition-all ${
                                            !agentName.trim() || isSearching || !!nameError
                                              ? "bg-gray-200 dark:bg-gray-800 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                                              : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md hover:shadow-lg"
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
                                        
                                        <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                                          ENS names must end with .eth and be at least 3 characters long (e.g., myagent.eth)
                                        </div>
                                      </motion.div>
                        
                                      <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3 }}
                                        className="text-center max-w-md mx-auto pt-4 border-t border-gray-100 dark:border-gray-800"
                                      >
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                                          Dont have an agent yet?
                                        </p>
                                        <Link href="/CreateAgent">
                                          <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className="px-6 py-2 rounded-lg text-blue-600 dark:text-blue-400 font-medium border border-blue-200 dark:border-blue-900 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
                                          >
                                            Create a new agent
                                          </motion.button>
                                        </Link>
                                      </motion.div>
                                    </div>
                                  ) : (
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
                                                <p className="text-sm sm:text-base">{message.text}</p>
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
                                  )}
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
                            </div>
                          );
                        }
                        
