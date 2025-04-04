"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Check,
  Plus,
  Zap,
  Clock,
  User,
  Code,
  Server,
  Shield,
  Layers,
  ArrowLeft,
} from "lucide-react";
import NavBar from "../components/NavBar";

// Mock MCP data
const mcpOptions = [
  {
    id: 1,
    name: "Ethereum",
    icon: "/Frontend/images.png",
    description: "Main Ethereum network",
  },
  {
    id: 2,
    name: "Polygon",
    icon: "/Frontend/images.png",
    description: "Scalable Ethereum solution",
  },
  {
    id: 3,
    name: "Arbitrum",
    icon: "/Frontend/images.png",
    description: "Layer 2 scaling solution",
  },
  {
    id: 4,
    name: "Optimism",
    icon: "/Frontend/images.png",
    description: "Optimistic rollup solution",
  },
  {
    id: 5,
    name: "Base",
    icon: "/Frontend/images.png",
    description: "Coinbase L2 solution",
  },
];
export default function CreateAgent() {
  const [agentName, setAgentName] = useState("");
  const [invocationType, setInvocationType] = useState("ping");
  const [selectedMCPs, setSelectedMCPs] = useState<number[]>([]);
  const [isCreating, setIsCreating] = useState(false);

  const toggleMCP = (id: number) => {
    if (selectedMCPs.includes(id)) {
      setSelectedMCPs(selectedMCPs.filter((mcpId) => mcpId !== id));
    } else {
      setSelectedMCPs([...selectedMCPs, id]);
    }
  };

  const handleCreateAgent = () => {
    if (!agentName || selectedMCPs.length === 0) return;

    setIsCreating(true);

    // Simulate creation process
    setTimeout(() => {
      // Reset form
      setAgentName("");
      setInvocationType("ping");
      setSelectedMCPs([]);
      setIsCreating(false);

      // Show success message or notification here
      alert("Agent created successfully!");
    }, 1500);
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
          {/* Replace the old header with NavBar */}
          <NavBar />

          {/* Back button can be added below the navbar if needed */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
            <Link href="/">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              >
                <ArrowLeft size={16} />
                Back to Home
              </motion.button>
            </Link>
          </div>
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
            <Server size={24} className="text-gray-700 dark:text-gray-300" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Create AI Agent
            </h2>
          </div>

          <div className="space-y-8">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                <User size={16} />
                Agent Name
              </label>
              <input
                type="text"
                value={agentName}
                onChange={(e) => setAgentName(e.target.value)}
                placeholder="Enter agent name"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-400 dark:focus:ring-gray-600"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                <Code size={16} />
                Invocation Type
              </label>
              <div className="grid grid-cols-2 gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setInvocationType("ping")}
                  className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border ${
                    invocationType === "ping"
                      ? "bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700"
                      : "border-gray-300 dark:border-gray-700"
                  }`}
                >
                  <Zap
                    size={18}
                    className={
                      invocationType === "ping"
                        ? "text-gray-900 dark:text-white"
                        : "text-gray-500 dark:text-gray-400"
                    }
                  />
                  <span
                    className={
                      invocationType === "ping"
                        ? "font-medium text-gray-900 dark:text-white"
                        : "text-gray-500 dark:text-gray-400"
                    }
                  >
                    Ping
                  </span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setInvocationType("polling")}
                  className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border ${
                    invocationType === "polling"
                      ? "bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700"
                      : "border-gray-300 dark:border-gray-700"
                  }`}
                >
                  <Clock
                    size={18}
                    className={
                      invocationType === "polling"
                        ? "text-gray-900 dark:text-white"
                        : "text-gray-500 dark:text-gray-400"
                    }
                  />
                  <span
                    className={
                      invocationType === "polling"
                        ? "font-medium text-gray-900 dark:text-white"
                        : "text-gray-500 dark:text-gray-400"
                    }
                  >
                    Polling
                  </span>
                </motion.button>
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium mb-4 text-gray-700 dark:text-gray-300">
                Select MCPs
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {mcpOptions.map((mcp) => (
                  <motion.div
                    key={mcp.id}
                    initial={{ opacity: 0.9 }}
                    whileHover={{
                      scale: 1.03,
                      boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
                    }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => toggleMCP(mcp.id)}
                    className={`flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition-all ${
                      selectedMCPs.includes(mcp.id)
                        ? "border-gray-400 dark:border-gray-500 bg-gray-50 dark:bg-gray-800"
                        : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                    }`}
                  >
                    <div className="w-5 h-5 flex-shrink-0">
                      {selectedMCPs.includes(mcp.id) ? (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-5 h-5 bg-gray-800 dark:bg-gray-200 rounded-sm flex items-center justify-center"
                        >
                          <Check
                            size={14}
                            className="text-white dark:text-gray-900"
                          />
                        </motion.div>
                      ) : (
                        <div className="w-5 h-5 border border-gray-300 dark:border-gray-600 rounded-sm" />
                      )}
                    </div>
                    <div className="flex items-center gap-3 flex-1">
                      <motion.div
                        className="w-10 h-10 flex-shrink-0 rounded-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 p-1"
                        animate={{
                          rotate: selectedMCPs.includes(mcp.id)
                            ? [0, 10, 0]
                            : 0,
                          transition: {
                            duration: 0.3,
                            ease: "easeInOut",
                          },
                        }}
                      >
                        <Image
                          src={mcp.icon}
                          alt={mcp.name}
                          width={32}
                          height={32}
                        />
                      </motion.div>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white text-base">
                          {mcp.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {mcp.description}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCreateAgent}
              disabled={!agentName || selectedMCPs.length === 0 || isCreating}
              className={`w-full py-4 rounded-lg flex items-center justify-center gap-2 font-medium mt-6 ${
                !agentName || selectedMCPs.length === 0 || isCreating
                  ? "bg-gray-200 dark:bg-gray-800 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-gray-900 to-black dark:from-gray-100 dark:to-white text-white dark:text-gray-900"
              }`}
            >
              {isCreating ? (
                <>
                  <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  <span>Creating Agent...</span>
                </>
              ) : (
                <>
                  <Plus size={18} />
                  <span>Create Agent</span>
                </>
              )}
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="py-12 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-3 mb-4 md:mb-0">
              <Image
                src="/Frontend/images.png"
                alt="ETH Taipei AI Agents"
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
