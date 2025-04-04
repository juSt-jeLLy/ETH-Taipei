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
  AlertCircle,
  ChevronDown,
  MessageSquare,
  Zap,
  Clock,
  RefreshCw,
  Info,
  X,
  ChevronRight,
} from "lucide-react";
import NavBar from "../components/NavBar";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 100 },
  },
};

export default function FindAgent() {
  const [agentName, setAgentName] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [agentFound, setAgentFound] = useState(false);
  const [messages, setMessages] = useState<
    { sender: string; text: string; timestamp: Date }[]
  >([]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [nameError, setNameError] = useState<string | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchProgress, setSearchProgress] = useState(0);
  const [agentInfo, setAgentInfo] = useState<{
    networks: string[];
    type: string;
    status: string;
  } | null>(null);
  const [showAgentInfo, setShowAgentInfo] = useState(false);
  const [hoveringButton, setHoveringButton] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatInputRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

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

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle agent search
  const handleSearch = () => {
    // Validate ENS name before proceeding
    const error = validateENSName(agentName);
    if (error) {
      setNameError(error);
      return;
    }

    setIsSearching(true);
    setSearchProgress(0);

    // Simulate search progress
    const progressInterval = setInterval(() => {
      setSearchProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 5;
      });
    }, 50);

    // Simulate search delay
    setTimeout(() => {
      clearInterval(progressInterval);
      setSearchProgress(100);

      setTimeout(() => {
        setIsSearching(false);
        setAgentFound(true);
        setAgentInfo({
          networks: ["Ethereum", "Polygon", "Arbitrum"],
          type: Math.random() > 0.5 ? "polling" : "ping",
          status: "active",
        });

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
      }, 500);
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

  // Toggle agent info panel
  const toggleAgentInfo = () => {
    setShowAgentInfo(!showAgentInfo);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col">
      {/* Header with background pattern */}
      <header className="relative overflow-hidden">
        <motion.div
          className="absolute inset-0 z-0 opacity-10 dark:opacity-20"
          animate={{
            backgroundPosition: ["0% 0%", "100% 100%"],
          }}
          transition={{
            duration: 20,
            ease: "linear",
            repeat: Infinity,
            repeatType: "reverse",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600" />
          <div className="absolute w-full h-full bg-[url('/grid-pattern.svg')] bg-center" />
        </motion.div>

        <div className="relative z-10">
          <NavBar />
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-grow flex flex-col">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
          className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-800 mb-16 relative overflow-hidden"
        >
          {/* Background gradient effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/10 dark:to-purple-900/5 opacity-50 dark:opacity-20 z-0"
            animate={{
              backgroundPosition: ["0% 0%", "100% 100%"],
            }}
            transition={{
              duration: 15,
              ease: "linear",
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />

          <div className="relative z-10">
            <motion.div
              className="flex items-center gap-3 mb-8 pb-6 border-b border-gray-100 dark:border-gray-800"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <motion.div
                whileHover={{ rotate: 10, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <Bot size={24} className="text-gray-700 dark:text-gray-300" />
              </motion.div>
              <motion.h2
                className="text-2xl font-bold text-gray-900 dark:text-white"
                animate={{
                  color: ["#1F2937", "#3B82F6", "#1F2937"],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              >
                Find and Chat with Your Agent
              </motion.h2>
            </motion.div>

            {!agentFound ? (
              <motion.div
                className="space-y-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <motion.p
                  className="text-gray-600 dark:text-gray-400"
                  variants={itemVariants}
                >
                  Enter the ENS name of your agent to start chatting with it.
                </motion.p>

                <motion.div className="relative" variants={itemVariants}>
                  <div className="flex gap-3">
                    <div className="relative flex-1">
                      <motion.input
                        ref={inputRef}
                        type="text"
                        value={agentName}
                        onChange={handleNameChange}
                        placeholder="Enter agent ENS name (e.g., myagent.eth)"
                        className={`w-full px-4 py-3 rounded-lg border ${
                          nameError
                            ? "border-red-300 dark:border-red-700 focus:ring-red-400 dark:focus:ring-red-600"
                            : "border-gray-300 dark:border-gray-700 focus:ring-blue-400 dark:focus:ring-blue-600"
                        } bg-white dark:bg-gray-900 focus:outline-none focus:ring-1 transition-all duration-200`}
                        onKeyDown={(e) => {
                          if (
                            e.key === "Enter" &&
                            !nameError &&
                            agentName.trim()
                          )
                            handleSearch();
                        }}
                        whileFocus={{ scale: 1.01 }}
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

                    <motion.button
                      whileHover={{
                        scale: isSearching ? 1 : 1.05,
                        boxShadow: isSearching
                          ? "none"
                          : "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                      }}
                      whileTap={{ scale: isSearching ? 1 : 0.98 }}
                      onClick={handleSearch}
                      disabled={isSearching || !!nameError || !agentName.trim()}
                      className={`px-6 py-3 rounded-lg flex items-center justify-center gap-2 font-medium transition-all duration-300 ${
                        isSearching || !!nameError || !agentName.trim()
                          ? "bg-gray-200 dark:bg-gray-800 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                          : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-md"
                      }`}
                      onMouseEnter={() => setHoveringButton(true)}
                      onMouseLeave={() => setHoveringButton(false)}
                    >
                      {isSearching ? (
                        <div className="flex flex-col items-center w-full">
                          <div className="flex items-center gap-2 mb-1">
                            <motion.div
                              className="w-5 h-5 border-2 border-current border-t-transparent rounded-full"
                              animate={{ rotate: 360 }}
                              transition={{
                                duration: 1,
                                repeat: Infinity,
                                ease: "linear",
                              }}
                            />
                            <span>Searching...</span>
                          </div>
                          <div className="w-full h-1 bg-gray-300 dark:bg-gray-600 rounded-full overflow-hidden">
                            <motion.div
                              className="h-full bg-blue-500 dark:bg-blue-400 rounded-full"
                              initial={{ width: "0%" }}
                              animate={{ width: `${searchProgress}%` }}
                              transition={{ duration: 0.2 }}
                            />
                          </div>
                        </div>
                      ) : (
                        <>
                          <Search size={18} />
                          <span>Find Agent</span>
                          <motion.div
                            animate={hoveringButton ? { x: [0, 3, 0] } : {}}
                            transition={{
                              duration: 1,
                              repeat: Infinity,
                              repeatDelay: 1,
                            }}
                          >
                            <ChevronRight size={18} />
                          </motion.div>
                        </>
                      )}
                    </motion.button>
                  </div>

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
                </motion.div>

                <motion.div
                  className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mt-4"
                  variants={itemVariants}
                >
                  <Info size={14} />
                  <span>
                    Don't have an agent yet?{" "}
                    <Link
                      href="/CreateAgent"
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Create one
                    </Link>
                  </span>
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                className="space-y-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, type: "spring" }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <motion.div
                      className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center"
                      whileHover={{ rotate: 10, scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <Bot
                        size={20}
                        className="text-blue-600 dark:text-blue-400"
                      />
                    </motion.div>
                    <div>
                      <motion.h3
                        className="font-medium text-blue-600 dark:text-blue-400 text-lg"
                        animate={{ scale: [1, 1.03, 1] }}
                        transition={{ duration: 1, repeat: 1 }}
                      >
                        {agentName}
                      </motion.h3>
                      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <motion.span
                          className="w-2 h-2 rounded-full bg-green-500"
                          animate={{
                            scale: [1, 1.5, 1],
                            opacity: [0.7, 1, 0.7],
                            boxShadow: [
                              "0 0 0 0 rgba(34, 197, 94, 0.4)",
                              "0 0 0 4px rgba(34, 197, 94, 0)",
                              "0 0 0 0 rgba(34, 197, 94, 0.4)",
                            ],
                          }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                        <span>Online</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={toggleAgentInfo}
                      className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
                    >
                      <Info size={18} />
                    </motion.button>
                    <Link href="/MyAgents">
                      <motion.button
                        whileHover={{ scale: 1.05, x: -3 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
                      >
                        <ArrowLeft size={14} />
                        <span>Back</span>
                      </motion.button>
                    </Link>
                  </div>
                </div>

                <AnimatePresence>
                  {showAgentInfo && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700"
                    >
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                          Agent Information
                        </h4>
                        <motion.button
                          whileHover={{ scale: 1.1, rotate: 90 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={toggleAgentInfo}
                          className="text-gray-500 dark:text-gray-400"
                        >
                          <X size={16} />
                        </motion.button>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mt-2">
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                            Type
                          </p>
                          <div className="flex items-center gap-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                            {agentInfo?.type === "polling" ? (
                              <motion.div
                                animate={{ rotate: [0, 360] }}
                                transition={{
                                  duration: 3,
                                  repeat: Infinity,
                                  repeatDelay: 2,
                                }}
                              >
                                <Clock size={14} />
                              </motion.div>
                            ) : (
                              <motion.div
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{
                                  duration: 1,
                                  repeat: Infinity,
                                  repeatDelay: 1,
                                }}
                              >
                                <Zap size={14} />
                              </motion.div>
                            )}
                            <span className="capitalize">
                              {agentInfo?.type}
                            </span>
                          </div>
                        </div>

                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                            Status
                          </p>
                          <div className="flex items-center gap-1 text-sm font-medium text-green-600 dark:text-green-400">
                            <motion.div
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ duration: 1.5, repeat: Infinity }}
                            >
                              <RefreshCw size={14} />
                            </motion.div>
                            <span>Running</span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-3">
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                          Networks
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {agentInfo?.networks.map((network, idx) => (
                            <motion.span
                              key={idx}
                              className={`text-xs px-2 py-1 rounded-full ${
                                network === "Ethereum"
                                  ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                                  : network === "Polygon"
                                  ? "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300"
                                  : "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300"
                              }`}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              {network}
                            </motion.span>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.div
                  className="h-[400px] border border-gray-200 dark:border-gray-700 rounded-lg flex flex-col bg-gray-50 dark:bg-gray-800 overflow-hidden"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  <div className="flex-1 p-4 overflow-y-auto">
                    <div className="space-y-4">
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
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            className={`max-w-[80%] px-4 py-3 rounded-lg ${
                              message.sender === "user"
                                ? "bg-blue-600 text-white"
                                : "bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                            }`}
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <div className="w-6 h-6 rounded-full flex items-center justify-center bg-opacity-20 bg-white">
                                {message.sender === "user" ? (
                                  <User size={12} className="text-white" />
                                ) : (
                                  <Bot
                                    size={12}
                                    className="text-blue-500 dark:text-blue-400"
                                  />
                                )}
                              </div>
                              <span className="text-xs opacity-80">
                                {message.sender === "user" ? "You" : agentName}
                              </span>
                              <span className="text-xs opacity-50 ml-auto">
                                {message.timestamp.toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                            </div>
                            <p className="text-sm">{message.text}</p>
                          </motion.div>
                        </motion.div>
                      ))}

                      {isTyping && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                          className="flex justify-start"
                        >
                          <div className="max-w-[80%] px-4 py-3 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full flex items-center justify-center bg-opacity-20 bg-blue-100 dark:bg-blue-900">
                                <Bot
                                  size={12}
                                  className="text-blue-500 dark:text-blue-400"
                                />
                              </div>
                              <span className="text-xs opacity-80">
                                {agentName}
                              </span>
                            </div>
                            <div className="flex gap-1 mt-2">
                              <motion.div
                                className="w-2 h-2 rounded-full bg-blue-500 dark:bg-blue-400"
                                animate={{ y: [0, -5, 0] }}
                                transition={{
                                  duration: 0.5,
                                  repeat: Infinity,
                                  repeatType: "loop",
                                  delay: 0,
                                }}
                              />
                              <motion.div
                                className="w-2 h-2 rounded-full bg-blue-500 dark:bg-blue-400"
                                animate={{ y: [0, -5, 0] }}
                                transition={{
                                  duration: 0.5,
                                  repeat: Infinity,
                                  repeatType: "loop",
                                  delay: 0.15,
                                }}
                              />
                              <motion.div
                                className="w-2 h-2 rounded-full bg-blue-500 dark:bg-blue-400"
                                animate={{ y: [0, -5, 0] }}
                                transition={{
                                  duration: 0.5,
                                  repeat: Infinity,
                                  repeatType: "loop",
                                  delay: 0.3,
                                }}
                              />
                            </div>
                          </div>
                        </motion.div>
                      )}

                      <div ref={messagesEndRef} />
                    </div>
                  </div>

                  <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                    <div className="flex gap-2">
                      <motion.input
                        ref={chatInputRef}
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-1 focus:ring-blue-400 dark:focus:ring-blue-600"
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && newMessage.trim())
                            handleSendMessage();
                        }}
                        whileFocus={{ scale: 1.01 }}
                      />
                      <motion.button
                        whileHover={{ scale: 1.05, rotate: 5 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim()}
                        className={`px-4 py-2 rounded-lg flex items-center justify-center ${
                          !newMessage.trim()
                            ? "bg-gray-200 dark:bg-gray-800 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                            : "bg-blue-600 text-white shadow-md"
                        }`}
                      >
                        <Send size={18} />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Add spacer div to push footer down */}
        <div className="mt-auto pb-8"></div>
      </div>

      {/* Footer */}
      <footer className="py-12 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="flex flex-col md:flex-row justify-between items-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <motion.div
              className="flex items-center gap-3 mb-4 md:mb-0"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <motion.div
                whileHover={{ rotate: 10 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Image src="/images.png" alt="" width={32} height={32} />
              </motion.div>
              <motion.span
                className="text-lg font-semibold text-gray-900 dark:text-white"
                animate={{
                  color: ["#1F2937", "#3B82F6", "#1F2937"],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              >
                ETH Taipei AI Agents
              </motion.span>
            </motion.div>
            <div className="flex items-center gap-6 text-gray-500 dark:text-gray-400">
              <motion.div
                className="flex items-center gap-2"
                whileHover={{ scale: 1.05, color: "#3B82F6" }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Shield size={14} />
                <span>ETH Taipei AI Agents © 2023</span>
              </motion.div>
              <motion.div
                className="flex items-center gap-2"
                whileHover={{ scale: 1.05, color: "#8B5CF6" }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Layers size={14} />
                <span>Powered by blockchain technology</span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </footer>

      <style jsx global>{`
        /* Custom scrollbar for chat */
        .overflow-y-auto::-webkit-scrollbar {
          width: 6px;
        }

        .overflow-y-auto::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.05);
          border-radius: 10px;
        }

        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.1);
          border-radius: 10px;
        }

        .dark .overflow-y-auto::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
        }

        .dark .overflow-y-auto::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
        }
      `}</style>
    </div>
  );
}
