"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Key,
  Server,
  Shield,
  Layers,
  Check,
} from "lucide-react";
import NavBar from "../../components/NavBar";

// Import the same MCP options to get their details
const mcpOptions = [
  {
    id: 1,
    name: "Ethereum",
    icon: "/images.png",
    description: "Main Ethereum network",
  },
  {
    id: 2,
    name: "Polygon",
    icon: "/images.png",
    description: "Scalable Ethereum solution",
  },
  {
    id: 3,
    name: "Arbitrum",
    icon: "/images.png",
    description: "Layer 2 scaling solution",
  },
  {
    id: 4,
    name: "Optimism",
    icon: "/images.png",
    description: "Optimistic rollup solution",
  },
  {
    id: 5,
    name: "Base",
    icon: "/images.png",
    description: "Coinbase L2 solution",
  },
];

export default function ApiKeys() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const agentName = searchParams.get("name") || "";
  const invocationType = searchParams.get("type") || "ping";
  const selectedMCPIds = searchParams.get("mcps")?.split(",").map(Number) || [];

  const [apiKeys, setApiKeys] = useState<Record<number, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter to only show selected MCPs
  const selectedMCPs = mcpOptions.filter((mcp) =>
    selectedMCPIds.includes(mcp.id)
  );

  const handleApiKeyChange = (mcpId: number, value: string) => {
    setApiKeys((prev) => ({
      ...prev,
      [mcpId]: value,
    }));
  };

  const handleSubmit = () => {
    // Validate that all API keys are provided
    const allKeysProvided = selectedMCPs.every((mcp) =>
      apiKeys[mcp.id]?.trim()
    );
  
    if (!allKeysProvided) {
      alert("Please provide API keys for all selected MCPs");
      return;
    }
  
    setIsSubmitting(true);
  
    // Here you would typically send the data to your backend
    // For now, we'll just simulate a submission
    setTimeout(() => {
      setIsSubmitting(false);
  
      // Navigate to FindAgent page with the agent name as a query parameter
      router.push(`/FindAgent?name=${encodeURIComponent(agentName)}`);
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
          <NavBar />

          {/* Removed the back button from here */}
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
            <Key size={24} className="text-gray-700 dark:text-gray-300" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              API Keys for {agentName}
            </h2>
          </div>

          <div className="space-y-6">
            <p className="text-gray-600 dark:text-gray-400">
              Please provide API keys for each of the selected MCPs to complete
              your agent setup.
            </p>

            {selectedMCPs.map((mcp) => (
              <div
                key={mcp.id}
                className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 flex-shrink-0 rounded-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 p-1">
                    <Image
                      src={mcp.icon}
                      alt={mcp.name}
                      width={32}
                      height={32}
                    />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white text-base">
                      {mcp.name}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {mcp.description}
                    </div>
                  </div>
                </div>

                <div className="mt-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    API Key
                  </label>
                  <input
                    type="text"
                    value={apiKeys[mcp.id] || ""}
                    onChange={(e) => handleApiKeyChange(mcp.id, e.target.value)}
                    placeholder={`Enter ${mcp.name} API Key`}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-400 dark:focus:ring-gray-600"
                  />
                </div>
              </div>
            ))}

            {/* Button row with back and submit buttons side by side with space between */}
            <div className="flex justify-between items-center gap-8 mt-6">
              <Link href="/CreateAgent" className="w-1/4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-4 rounded-lg flex items-center justify-center gap-2 font-medium border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                >
                  <ArrowLeft size={18} />
                  <span>Back</span>
                </motion.button>
              </Link>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`w-1/4 py-4 rounded-lg flex items-center justify-center gap-2 font-medium ${
                  isSubmitting
                    ? "bg-gray-200 dark:bg-gray-800 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-gray-900 to-black dark:from-gray-100 dark:to-white text-white dark:text-gray-900"
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    <span>Creating...</span>
                  </>
                ) : (
                  <>
                    <Check size={18} />
                    <span>Create Agent</span>
                  </>
                )}
              </motion.button>
            </div>
          </div>
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
