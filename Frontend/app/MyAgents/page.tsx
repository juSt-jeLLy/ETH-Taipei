"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bot,
  Shield,
  Layers,
  ArrowRight,
  Wallet,
  Clock,
  Zap,
  AlertTriangle,
  ChevronRight,
  Activity,
  Settings,
  ExternalLink,
} from "lucide-react";
import NavBar from "../components/NavBar";

// Mock agent data
const mockAgents = [
  {
    id: 1,
    name: "ethTrader.eth",
    description: "Monitors ETH price and executes trades based on conditions",
    type: "polling",
    networks: ["Ethereum", "Arbitrum"],
    lastActive: "2 minutes ago",
    status: "active",
    color: "blue",
  },
  {
    id: 2,
    name: "gasWatcher.eth",
    description: "Alerts when gas prices are low for pending transactions",
    type: "ping",
    networks: ["Ethereum", "Polygon", "Optimism"],
    lastActive: "1 hour ago",
    status: "active",
    color: "purple",
  },
  {
    id: 3,
    name: "nftSniper.eth",
    description: "Monitors NFT floor prices and executes buys",
    type: "polling",
    networks: ["Ethereum", "Base"],
    lastActive: "3 days ago",
    status: "inactive",
    color: "green",
  },
];

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

export default function MyAgents() {
  const router = useRouter();
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [agents, setAgents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hoveringAgent, setHoveringAgent] = useState<number | null>(null);
  const [expandedAgent, setExpandedAgent] = useState<number | null>(null);

  // Check if wallet is connected
  useEffect(() => {
    const isConnected = localStorage.getItem("walletConnected") === "true";
    const address = localStorage.getItem("walletAddress");

    if (isConnected && address) {
      setWalletConnected(true);
      setWalletAddress(address);

      // Simulate loading agents with a progress effect
      const loadingTimer = setTimeout(() => {
        setAgents(mockAgents);
        setIsLoading(false);
      }, 1500);

      return () => clearTimeout(loadingTimer);
    } else {
      setIsLoading(false);
    }
  }, []);

  // Handle chat with agent
  const handleChatWithAgent = (agentName) => {
    router.push(`/FindAgent?name=${encodeURIComponent(agentName)}`);
  };

  // Toggle expanded agent view
  const toggleExpandAgent = (id: number) => {
    setExpandedAgent(expandedAgent === id ? null : id);
  };

  // Get network color
  const getNetworkColor = (network: string) => {
    switch (network) {
      case "Ethereum":
        return "blue";
      case "Polygon":
        return "purple";
      case "Arbitrum":
        return "indigo";
      case "Optimism":
        return "red";
      case "Base":
        return "green";
      default:
        return "gray";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                My Agents
              </h2>
            </motion.div>

            {!walletConnected ? (
              <motion.div
                className="text-center py-12"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <motion.div
                  className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4"
                  variants={itemVariants}
                  whileHover={{
                    scale: 1.1,
                    boxShadow: "0 0 0 8px rgba(59, 130, 246, 0.1)",
                  }}
                  animate={{
                    y: [0, -5, 0],
                  }}
                  transition={{
                    y: { repeat: Infinity, duration: 2, repeatType: "reverse" },
                    scale: { type: "spring", stiffness: 400 },
                  }}
                >
                  <Wallet
                    size={24}
                    className="text-gray-500 dark:text-gray-400"
                  />
                </motion.div>
                <motion.h3
                  className="text-xl font-medium text-gray-900 dark:text-white mb-2"
                  variants={itemVariants}
                >
                  Wallet Not Connected
                </motion.h3>
                <motion.p
                  className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto"
                  variants={itemVariants}
                >
                  Please connect your wallet to view your agents. You'll need to
                  connect your wallet to access this feature.
                </motion.p>
                <Link href="/">
                  <motion.button
                    variants={itemVariants}
                    whileHover={{
                      scale: 1.05,
                      boxShadow:
                        "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                    }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 400 }}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium inline-flex items-center gap-2 shadow-md"
                  >
                    Return to Home
                    <motion.div
                      animate={{ x: [0, 3, 0] }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        repeatDelay: 1,
                      }}
                    >
                      <ArrowRight size={18} />
                    </motion.div>
                  </motion.button>
                </Link>
              </motion.div>
            ) : isLoading ? (
              <motion.div
                className="text-center py-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <motion.div
                  className="w-12 h-12 mx-auto mb-4 relative"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <motion.div
                    className="absolute inset-0 rounded-full border-4 border-gray-200 dark:border-gray-700"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  />
                  <motion.div
                    className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500 dark:border-t-blue-400"
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                  <motion.div
                    className="absolute inset-2 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: "spring" }}
                  >
                    <Bot
                      size={16}
                      className="text-blue-600 dark:text-blue-400"
                    />
                  </motion.div>
                </motion.div>
                <motion.p
                  className="text-gray-600 dark:text-gray-400"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  Loading your agents...
                </motion.p>
                <motion.div
                  className="mt-4 w-48 h-2 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto overflow-hidden"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <motion.div
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                  />
                </motion.div>
              </motion.div>
            ) : agents.length === 0 ? (
              <motion.div
                className="text-center py-12"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <motion.div
                  className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4"
                  variants={itemVariants}
                  whileHover={{
                    scale: 1.1,
                    rotate: 10,
                    boxShadow: "0 0 0 8px rgba(59, 130, 246, 0.1)",
                  }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <Bot size={24} className="text-gray-500 dark:text-gray-400" />
                </motion.div>
                <motion.h3
                  className="text-xl font-medium text-gray-900 dark:text-white mb-2"
                  variants={itemVariants}
                >
                  No Agents Found
                </motion.h3>
                <motion.p
                  className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto"
                  variants={itemVariants}
                >
                  You don't have any agents yet. Create your first agent to get
                  started.
                </motion.p>
                <Link href="/CreateAgent">
                  <motion.button
                    variants={itemVariants}
                    whileHover={{
                      scale: 1.05,
                      boxShadow:
                        "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                    }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 400 }}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium inline-flex items-center gap-2 shadow-md"
                  >
                    Create Agent
                    <motion.div
                      animate={{ x: [0, 3, 0] }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        repeatDelay: 1,
                      }}
                    >
                      <ArrowRight size={18} />
                    </motion.div>
                  </motion.button>
                </Link>
              </motion.div>
            ) : (
              <motion.div
                className="space-y-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <motion.div
                  className="flex items-center justify-between mb-4"
                  variants={itemVariants}
                >
                  <motion.p
                    className="text-gray-600 dark:text-gray-400 flex items-center gap-2"
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <Wallet
                      size={16}
                      className="text-blue-500 dark:text-blue-400"
                    />
                    Connected:{" "}
                    <span className="font-medium truncate max-w-[200px]">
                      {walletAddress}
                    </span>
                  </motion.p>
                  <Link href="/CreateAgent">
                    <motion.button
                      whileHover={{
                        scale: 1.05,
                        boxShadow:
                          "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                      }}
                      whileTap={{ scale: 0.98 }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 10,
                      }}
                      className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg text-sm font-medium inline-flex items-center gap-1 shadow-md"
                    >
                      <Bot size={14} />
                      <span>Create New Agent</span>
                    </motion.button>
                  </Link>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {agents.map((agent, index) => (
                    <motion.div
                      key={agent.id}
                      variants={itemVariants}
                      initial={{ opacity: 0.9 }}
                      whileHover={{
                        scale: 1.02,
                        boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
                        y: -2,
                      }}
                      onHoverStart={() => setHoveringAgent(agent.id)}
                      onHoverEnd={() => setHoveringAgent(null)}
                      onClick={() => toggleExpandAgent(agent.id)}
                      className={`border border-gray-200 dark:border-gray-700 rounded-xl p-6 bg-white dark:bg-gray-800 transition-all duration-300 cursor-pointer ${
                        expandedAgent === agent.id
                          ? "ring-2 ring-blue-500 dark:ring-blue-400 ring-opacity-50"
                          : ""
                      }`}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                          <motion.div
                            className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              agent.color === "blue"
                                ? "bg-blue-100 dark:bg-blue-900/50"
                                : agent.color === "purple"
                                ? "bg-purple-100 dark:bg-purple-900/50"
                                : "bg-green-100 dark:bg-green-900/50"
                            }`}
                            whileHover={{ rotate: 10, scale: 1.1 }}
                            animate={
                              hoveringAgent === agent.id
                                ? {
                                    y: [0, -3, 0],
                                    scale: [1, 1.1, 1],
                                  }
                                : {}
                            }
                            transition={{ duration: 0.5 }}
                          >
                            <Bot
                              size={20}
                              className={
                                agent.color === "blue"
                                  ? "text-blue-600 dark:text-blue-400"
                                  : agent.color === "purple"
                                  ? "text-purple-600 dark:text-purple-400"
                                  : "text-green-600 dark:text-green-400"
                              }
                            />
                          </motion.div>
                          <div>
                            <motion.h3
                              className={`font-medium text-gray-900 dark:text-white text-lg ${
                                agent.color === "blue"
                                  ? "text-blue-600 dark:text-blue-400"
                                  : agent.color === "purple"
                                  ? "text-purple-600 dark:text-purple-400"
                                  : "text-green-600 dark:text-green-400"
                              }`}
                              animate={
                                hoveringAgent === agent.id
                                  ? { scale: [1, 1.03, 1] }
                                  : {}
                              }
                              transition={{ duration: 0.5 }}
                            >
                              {agent.name}
                            </motion.h3>
                            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                              <motion.span
                                className={`w-2 h-2 rounded-full ${
                                  agent.status === "active"
                                    ? "bg-green-500"
                                    : "bg-gray-400 dark:bg-gray-500"
                                }`}
                                animate={
                                  agent.status === "active"
                                    ? {
                                        scale: [1, 1.5, 1],
                                        opacity: [0.7, 1, 0.7],
                                        boxShadow: [
                                          "0 0 0 0 rgba(34, 197, 94, 0.4)",
                                          "0 0 0 4px rgba(34, 197, 94, 0)",
                                          "0 0 0 0 rgba(34, 197, 94, 0.4)",
                                        ],
                                      }
                                    : {}
                                }
                                transition={{ duration: 2, repeat: Infinity }}
                              />
                              <span className="capitalize">{agent.status}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                          {agent.type === "polling" ? (
                            <motion.div
                              animate={{ rotate: [0, 360] }}
                              transition={{
                                duration: 3,
                                repeat: Infinity,
                                repeatDelay: 2,
                              }}
                            >
                              <Clock size={12} />
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
                              <Zap size={12} />
                            </motion.div>
                          )}
                          <span className="capitalize">{agent.type}</span>
                        </div>
                      </div>

                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                        {agent.description}
                      </p>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {agent.networks.map((network, idx) => (
                          <motion.span
                            key={idx}
                            className={`text-xs px-2 py-1 rounded-full ${
                              getNetworkColor(network) === "blue"
                                ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                                : getNetworkColor(network) === "purple"
                                ? "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300"
                                : getNetworkColor(network) === "green"
                                ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                                : getNetworkColor(network) === "red"
                                ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300"
                                : "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300"
                            }`}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ type: "spring", stiffness: 400 }}
                          >
                            {network}
                          </motion.span>
                        ))}
                      </div>

                      {/* Expanded view */}
                      <AnimatePresence>
                        {expandedAgent === agent.id && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700"
                          >
                            <div className="grid grid-cols-2 gap-4 mb-4">
                              <div className="flex flex-col">
                                <span className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                                  Status
                                </span>
                                <span
                                  className={`text-sm font-medium flex items-center gap-1 ${
                                    agent.status === "active"
                                      ? "text-green-600 dark:text-green-400"
                                      : "text-gray-600 dark:text-gray-400"
                                  }`}
                                >
                                  {agent.status === "active" ? (
                                    <motion.div
                                      animate={{ scale: [1, 1.2, 1] }}
                                      transition={{
                                        duration: 1.5,
                                        repeat: Infinity,
                                      }}
                                    >
                                      <Activity size={14} />
                                    </motion.div>
                                  ) : (
                                    <AlertTriangle size={14} />
                                  )}
                                  {agent.status === "active"
                                    ? "Running"
                                    : "Stopped"}
                                </span>
                              </div>
                              <div className="flex flex-col">
                                <span className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                                  Last Activity
                                </span>
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1">
                                  <Clock size={14} />
                                  {agent.lastActive}
                                </span>
                              </div>
                            </div>

                            <div className="flex justify-between items-center mt-2">
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="text-xs flex items-center gap-1 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                              >
                                <Settings size={12} />
                                Configure
                              </motion.button>

                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="text-xs flex items-center gap-1 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                              >
                                <ExternalLink size={12} />
                                View Logs
                              </motion.button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <div className="flex justify-between items-center">
                        <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                          <Clock size={12} />
                          <span>Last active: {agent.lastActive}</span>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.05, x: 2 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleChatWithAgent(agent.name);
                          }}
                          className={`px-3 py-1.5 rounded-lg text-sm font-medium inline-flex items-center gap-1 shadow-sm ${
                            agent.color === "blue"
                              ? "bg-blue-600 text-white"
                              : agent.color === "purple"
                              ? "bg-purple-600 text-white"
                              : "bg-green-600 text-white"
                          }`}
                        >
                          Chat
                          <motion.div
                            animate={{ x: [0, 3, 0] }}
                            transition={{
                              duration: 1,
                              repeat: Infinity,
                              repeatDelay: 1,
                            }}
                          >
                            <ArrowRight size={14} />
                          </motion.div>
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
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
    </div>
  );
}
