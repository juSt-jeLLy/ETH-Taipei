"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Bot,
  Shield,
  Layers,
  ArrowRight,
  Wallet,
  Clock,
  Zap,
  AlertTriangle,
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
  },
  {
    id: 2,
    name: "gasWatcher.eth",
    description: "Alerts when gas prices are low for pending transactions",
    type: "ping",
    networks: ["Ethereum", "Polygon", "Optimism"],
    lastActive: "1 hour ago",
    status: "active",
  },
  {
    id: 3,
    name: "nftSniper.eth",
    description: "Monitors NFT floor prices and executes buys",
    type: "polling",
    networks: ["Ethereum", "Base"],
    lastActive: "3 days ago",
    status: "inactive",
  },
];

export default function MyAgents() {
  const router = useRouter();
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [agents, setAgents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Check if wallet is connected
  useEffect(() => {
    const isConnected = localStorage.getItem("walletConnected") === "true";
    const address = localStorage.getItem("walletAddress");
    
    if (isConnected && address) {
      setWalletConnected(true);
      setWalletAddress(address);
      
      // Simulate loading agents
      setTimeout(() => {
        setAgents(mockAgents);
        setIsLoading(false);
      }, 1500);
    } else {
      setIsLoading(false);
    }
  }, []);

  // Handle chat with agent
  const handleChatWithAgent = (agentName) => {
    router.push(`/FindAgent?name=${encodeURIComponent(agentName)}`);
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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-800 mb-16"
        >
          <div className="flex items-center gap-3 mb-8 pb-6 border-b border-gray-100 dark:border-gray-800">
            <Bot size={24} className="text-gray-700 dark:text-gray-300" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              My Agents
            </h2>
          </div>

          {!walletConnected ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Wallet size={24} className="text-gray-500 dark:text-gray-400" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                Wallet Not Connected
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
              Please connect your wallet to view your agents. You'll
                need to connect your wallet to access this feature.
              </p>
              <Link href="/">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg font-medium inline-flex items-center gap-2"
                >
                  Return to Home
                </motion.button>
              </Link>
            </div>
          ) : isLoading ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 border-4 border-gray-200 dark:border-gray-700 border-t-blue-500 dark:border-t-blue-400 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">
                Loading your agents...
              </p>
            </div>
          ) : agents.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bot size={24} className="text-gray-500 dark:text-gray-400" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                No Agents Found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                You don't have any agents yet. Create your first agent to get started.
              </p>
              <Link href="/CreateAgent">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg font-medium inline-flex items-center gap-2"
                >
                  Create Agent <ArrowRight size={18} />
                </motion.button>
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-4">
                <p className="text-gray-600 dark:text-gray-400">
                  Connected: <span className="font-medium">{walletAddress}</span>
                </p>
                <Link href="/CreateAgent">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg text-sm font-medium inline-flex items-center gap-1"
                  >
                    <Bot size={14} />
                    Create New Agent
                  </motion.button>
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {agents.map((agent) => (
                  <motion.div
                    key={agent.id}
                    initial={{ opacity: 0.9 }}
                    whileHover={{ scale: 1.02, boxShadow: "0 4px 6px rgba(0,0,0,0.05)" }}
                    className="border border-gray-200 dark:border-gray-700 rounded-xl p-6 bg-gray-50 dark:bg-gray-800"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                          <Bot size={20} className="text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-white text-lg">
                            {agent.name}
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                            <span className={`w-2 h-2 rounded-full ${
                              agent.status === 'active' 
                                ? 'bg-green-500' 
                                : 'bg-gray-400 dark:bg-gray-500'
                            }`}></span>
                            <span className="capitalize">{agent.status}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                        {agent.type === 'polling' ? (
                          <Clock size={12} />
                        ) : (
                          <Zap size={12} />
                        )}
                        <span className="capitalize">{agent.type}</span>
                      </div>
                    </div>

                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                      {agent.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {agent.networks.map((network, idx) => (
                        <span 
                          key={idx}
                          className="text-xs px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                        >
                          {network}
                        </span>
                      ))}
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                        <Clock size={12} />
                        <span>Last active: {agent.lastActive}</span>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleChatWithAgent(agent.name)}
                        className="px-3 py-1.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg text-sm font-medium inline-flex items-center gap-1"
                      >
                        Chat <ArrowRight size={14} />
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
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
              <Image
                src="/images.png"
                alt=""
                width={32}
                height={32}
              />
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
