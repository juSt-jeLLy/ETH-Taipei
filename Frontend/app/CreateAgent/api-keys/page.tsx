"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import {
  ArrowLeft,
  Key,
  Shield,
  Layers,
  Check,
  Lock,
  Copy,
  AlertCircle,
  Eye,
  EyeOff,
  ChevronRight,
  Database,
  Cloud,
} from "lucide-react";
import NavBar from "../../components/NavBar";

interface AgentData {
  name: string;
  invocationType: string;
  mcps: {
    id: number;
    name: string;
    description: string;
    color: string;
    apiKeys: {
      [keyName: string]: string;
    };
  }[];
  createdAt: string;
}
interface KeyInfo {
  name: string;
  label: string;
}
interface McpOption {
  id: number;
  name: string;
  icon: string;
  description: string;
  color: string;
}
// Import the same MCP options to get their details
const mcpOptions: McpOption[] = [
  {
    id: 1,
    name: "1inch",
    icon: "/download.png",
    description: "DeFi integration",
    color: "green",
  },

  {
    id: 2,
    name: "claude-code-mcp",
    icon: "/images.png",
    description: "Code generation and analysis",
    color: "purple",
  },
  {
    id: 3,
    name: "google-maps",
    icon: "/download.jpeg",
    description: "Location and mapping services",
    color: "indigo",
  },
  {
    id: 4,
    name: "desktop-commander",
    icon: "/image1.jpeg",
    description: "Desktop automation",
    color: "red",
  },
  {
    id: 5,
    name: "twitter",
    icon: "/Artboard-1twitter.webp",
    description: "Twitter integration",
    color: "green",
  },
  {
    id: 6,
    name: "hyperbrowser",
    icon: "/images.png",
    description: "Web browsing capabilities",
    color: "blue",
  },
];

// Define the required API keys for each MCP
const mcpRequiredKeys: { [key: number]: KeyInfo[] } = {
  1: [
    { name: "1INCH_API_KEY", label: "API Key" },
    { name: "1INCH_SECRET_KEY", label: "Secret Key" },
  ],
  2: [{ name: "CLAUDE_CODE_MCP_API_KEY", label: "API Key" }],
  3: [{ name: "GOOGLE_MAPS_API_KEY", label: "API Key" }],
  4: [], // No keys required for desktop-commander
  5: [
    { name: "API_KEY", label: "API Key" },
    { name: "API_SECRET", label: "API Secret" },
    { name: "ACCESS_TOKEN", label: "Access Token" },
    { name: "ACCESS_TOKEN_SECRET", label: "Access Token Secret" },
  ],
  6: [{ name: "HYPERBROWSER_API_KEY", label: "API Key" }],
};
// Function to upload data to Pinata
const uploadToPinata = async (data: AgentData) => {
  try {
    const formData = new FormData();
    const blob = new Blob([JSON.stringify(data)], { type: "application/json" });
    formData.append("file", blob);

    const response = await axios.post(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          pinata_api_key: process.env.NEXT_PUBLIC_PINATA_API_KEY,
          pinata_secret_api_key: process.env.NEXT_PUBLIC_PINATA_SECRET_API_KEY,
        },
      }
    );

    return response.data.IpfsHash;
  } catch (error) {
    console.error("Error uploading to Pinata:", error);
    throw error;
  }
};

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

export default function ApiKeys() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const agentName = searchParams.get("name") || "";
  const invocationType = searchParams.get("type") || "ping";
  const selectedMCPIds = searchParams.get("mcps")?.split(",").map(Number) || [];

  const [apiKeys, setApiKeys] = useState<
    Record<number, Record<string, string>>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedKey, setCopiedKey] = useState<{
    mcpId: number;
    keyName: string;
  } | null>(null);
  const [visibleKeys, setVisibleKeys] = useState<
    Record<number, Record<string, boolean>>
  >({});
  const [hoveringMCP, setHoveringMCP] = useState<number | null>(null);
  const [validationErrors, setValidationErrors] = useState<
    Record<number, Record<string, boolean>>
  >({});
  const [progress, setProgress] = useState(0);
  const [ipfsHash, setIpfsHash] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Filter to only show selected MCPs
  const selectedMCPs = mcpOptions.filter((mcp) =>
    selectedMCPIds.includes(mcp.id)
  );

  // Retrieve stored agent data on component mount
  useEffect(() => {
    // Retrieve the stored agent data
    const storedAgentData = localStorage.getItem("agentCreationData");

    if (storedAgentData) {
      try {
        const parsedData = JSON.parse(storedAgentData);

        // You can use this data as a fallback if URL parameters are missing
        if (!agentName && parsedData.agentName) {
          // If URL param is missing but we have stored data, use it
          router.replace(
            `/CreateAgent/api-keys?name=${encodeURIComponent(
              parsedData.agentName
            )}&type=${parsedData.invocationType}&mcps=${parsedData.selectedMCPs
              .map((mcp) => mcp.id)
              .join(",")}`
          );
        }

        // You can also use the detailed MCP data from localStorage
        // instead of just the IDs from the URL
        console.log("Retrieved complete agent data:", parsedData);
      } catch (error) {
        console.error("Error parsing stored agent data:", error);
      }
    }
  }, [agentName, router]);

  // Handle API key change
  const handleApiKeyChange = (
    mcpId: number,
    keyName: string,
    value: string
  ) => {
    setApiKeys((prev) => ({
      ...prev,
      [mcpId]: {
        ...(prev[mcpId] || {}),
        [keyName]: value,
      },
    }));

    // Clear validation error when user types
    if (validationErrors[mcpId]?.[keyName]) {
      setValidationErrors((prev) => ({
        ...prev,
        [mcpId]: {
          ...(prev[mcpId] || {}),
          [keyName]: false,
        },
      }));
    }
  };

  // Toggle key visibility
  const toggleKeyVisibility = (mcpId: number, keyName: string) => {
    setVisibleKeys((prev) => ({
      ...prev,
      [mcpId]: {
        ...(prev[mcpId] || {}),
        [keyName]: !(prev[mcpId]?.[keyName] || false),
      },
    }));
  };

  // Copy key to clipboard
  const copyToClipboard = (mcpId: number, keyName: string, value: string) => {
    navigator.clipboard.writeText(value);
    setCopiedKey({ mcpId, keyName });

    // Reset copied status after 2 seconds
    setTimeout(() => {
      setCopiedKey(null);
    }, 2000);
  };

  // Handle form submission
  // Update the handleSubmit function to include the API call
  const handleSubmit = async () => {
    // Reset any previous errors
    setUploadError(null);

    // Validate that all required API keys are provided
    const newValidationErrors: Record<number, Record<string, boolean>> = {};
    let hasError = false;

    selectedMCPs.forEach((mcp: McpOption) => {
      const requiredKeys = mcpRequiredKeys[mcp.id] || [];

      // Skip validation for MCPs that don't require keys (like desktop-commander)
      if (requiredKeys.length === 0) return;

      newValidationErrors[mcp.id] = {};

      requiredKeys.forEach((key) => {
        if (!apiKeys[mcp.id]?.[key.name]?.trim()) {
          newValidationErrors[mcp.id][key.name] = true;
          hasError = true;
        }
      });
    });

    if (hasError) {
      setValidationErrors(newValidationErrors);

      // Shake the form to indicate error
      const form = document.getElementById("api-keys-form");
      if (form) {
        form.classList.add("shake-animation");
        setTimeout(() => {
          form.classList.remove("shake-animation");
        }, 500);
      }

      return;
    }

    setIsSubmitting(true);

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) {
          return 95; // Hold at 95% until IPFS upload completes
        }
        return prev + 5;
      });
    }, 50);

    try {
      // Prepare data for IPFS
      const agentData = {
        name: agentName,
        invocationType: invocationType,
        mcps: selectedMCPs.map((mcp: McpOption) => {
          // Get the API keys for this MCP
          const keys = apiKeys[mcp.id] || {};

          return {
            id: mcp.id,
            name: mcp.name,
            description: mcp.description,
            color: mcp.color,
            apiKeys: mcp.id === 4 ? {} : keys, // No keys for desktop-commander
          };
        }),
        createdAt: new Date().toISOString(),
      };

      // Upload to Pinata
      const hash = await uploadToPinata(agentData);
      setIpfsHash(hash);
      console.log("Agent data uploaded to IPFS with hash:", hash);

      // Store the IPFS hash in localStorage for later use
      localStorage.setItem("agentIpfsHash", hash);

      // Clear the progress interval since we're done with the upload
      clearInterval(progressInterval);
      setProgress(100);

      // Send the IPFS hash to the API
      try {
        const apiResponse = await axios.post(
          `${process.env.NEXT_PUBLIC_MCP_API_ENDPOINT}/update_mcp_config`,
          { ipfs_hash: hash },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        console.log("API response:", apiResponse.data);
      } catch (apiError) {
        console.error("Error sending IPFS hash to API:", apiError);
        setUploadError(
          "Successfully uploaded to IPFS, but failed to update MCP config. Please try again."
        );
        setIsSubmitting(false);
        return;
      }

      // Wait a moment to show the 100% progress
      setTimeout(() => {
        // Clear the temporary storage since we're done with the creation process
        localStorage.removeItem("agentCreationData");

        setIsSubmitting(false);
        // Navigate to FindAgent page with the agent name and IPFS hash as query parameters
        router.push(
          `/FindAgent?name=${encodeURIComponent(agentName)}&ipfsHash=${hash}`
        );
      }, 500);
    } catch (error) {
      console.error("Error uploading to IPFS:", error);

      // Clear the progress interval
      clearInterval(progressInterval);

      // Show an error message
      setUploadError(
        "Failed to upload agent data to IPFS. Please check your network connection and try again."
      );

      setProgress(0);
      setIsSubmitting(false);
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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

          <div className="relative z-10" id="api-keys-form">
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
                <Key size={24} className="text-gray-700 dark:text-gray-300" />
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
                API Keys for{" "}
                <span className="text-blue-600 dark:text-blue-400">
                  {agentName}
                </span>
              </motion.h2>
            </motion.div>

            <motion.div
              className="space-y-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div
                className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800 flex items-start gap-3"
                variants={itemVariants}
                whileHover={{ scale: 1.01, y: -2 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <motion.div
                  animate={{ rotate: [0, 10, 0] }}
                  transition={{ duration: 1, repeat: Infinity, repeatDelay: 3 }}
                >
                  <Lock
                    className="text-blue-600 dark:text-blue-400 mt-0.5"
                    size={18}
                  />
                </motion.div>
                <div>
                  <p className="text-blue-800 dark:text-blue-300 font-medium mb-1">
                    Secure API Keys Required
                  </p>
                  <p className="text-blue-600 dark:text-blue-400 text-sm">
                    Please provide API keys for each of the selected MCPs to
                    complete your agent setup. Your keys are encrypted and
                    stored securely on IPFS.
                  </p>
                </div>
              </motion.div>

              {/* Display upload error if any */}
              <AnimatePresence>
                {uploadError && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800 flex items-start gap-3"
                  >
                    <AlertCircle
                      className="text-red-600 dark:text-red-400 mt-0.5"
                      size={18}
                    />
                    <div>
                      <p className="text-red-800 dark:text-red-300 font-medium">
                        Upload Error
                      </p>
                      <p className="text-red-600 dark:text-red-400 text-sm">
                        {uploadError}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {selectedMCPs.map((mcp: McpOption) => (
                <motion.div
                  key={mcp.id}
                  variants={itemVariants}
                  whileHover={{
                    scale: 1.02,
                    y: -2,
                    boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
                  }}
                  onHoverStart={() => setHoveringMCP(mcp.id)}
                  onHoverEnd={() => setHoveringMCP(null)}
                  className={`p-4 border rounded-lg transition-all duration-300 ${
                    Object.values(validationErrors[mcp.id] || {}).some(
                      (error) => error
                    )
                      ? "border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/10"
                      : `border-${
                          mcp.color === "blue"
                            ? "blue"
                            : mcp.color === "purple"
                            ? "purple"
                            : mcp.color === "green"
                            ? "green"
                            : mcp.color === "red"
                            ? "red"
                            : "indigo"
                        }-200 
                          dark:border-${
                            mcp.color === "blue"
                              ? "blue"
                              : mcp.color === "purple"
                              ? "purple"
                              : mcp.color === "green"
                              ? "green"
                              : mcp.color === "red"
                              ? "red"
                              : "indigo"
                          }-700 
                          bg-white dark:bg-gray-800`
                  }`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <motion.div
                      className={`w-10 h-10 flex-shrink-0 rounded-full flex items-center justify-center bg-${
                        mcp.color === "blue"
                          ? "blue"
                          : mcp.color === "purple"
                          ? "purple"
                          : mcp.color === "green"
                          ? "green"
                          : mcp.color === "red"
                          ? "red"
                          : "indigo"
                      }-100 
                                     dark:bg-${
                                       mcp.color === "blue"
                                         ? "blue"
                                         : mcp.color === "purple"
                                         ? "purple"
                                         : mcp.color === "green"
                                         ? "green"
                                         : mcp.color === "red"
                                         ? "red"
                                         : "indigo"
                                     }-900/30 p-1`}
                      animate={
                        hoveringMCP === mcp.id
                          ? {
                              rotate: [0, 10, 0],
                              scale: [1, 1.1, 1],
                            }
                          : {}
                      }
                      transition={{ duration: 0.5 }}
                    >
                      <Image
                        src={mcp.icon}
                        alt={mcp.name}
                        width={32}
                        height={32}
                      />
                    </motion.div>
                    <div>
                      <motion.div
                        className={`font-medium text-base text-${
                          mcp.color === "blue"
                            ? "blue"
                            : mcp.color === "purple"
                            ? "purple"
                            : mcp.color === "green"
                            ? "green"
                            : mcp.color === "red"
                            ? "red"
                            : "indigo"
                        }-600 
                                       dark:text-${
                                         mcp.color === "blue"
                                           ? "blue"
                                           : mcp.color === "purple"
                                           ? "purple"
                                           : mcp.color === "green"
                                           ? "green"
                                           : mcp.color === "red"
                                           ? "red"
                                           : "indigo"
                                       }-400`}
                        animate={
                          hoveringMCP === mcp.id ? { scale: [1, 1.03, 1] } : {}
                        }
                        transition={{ duration: 0.5 }}
                      >
                        {mcp.name}
                      </motion.div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                        <Database size={12} />
                        {mcp.description}
                      </div>
                    </div>
                  </div>

                  <div className="mt-2 space-y-3">
                    {/* If this is desktop-commander, show a message that no API keys are needed */}
                    {mcp.id === 4 ? (
                      <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-800 text-green-700 dark:text-green-300 flex items-center gap-2">
                        <Check size={16} />
                        <span>No API keys required for this MCP</span>
                      </div>
                    ) : (
                      // For all other MCPs, show the required inputs
                      (mcpRequiredKeys[mcp.id] || []).map((keyInfo) => (
                        <div key={keyInfo.name} className="space-y-1">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1">
                            <Key size={14} />
                            {keyInfo.label}
                          </label>
                          <div className="relative">
                            <motion.input
                              type={
                                visibleKeys[mcp.id]?.[keyInfo.name]
                                  ? "text"
                                  : "password"
                              }
                              value={apiKeys[mcp.id]?.[keyInfo.name] || ""}
                              onChange={(e) =>
                                handleApiKeyChange(
                                  mcp.id,
                                  keyInfo.name,
                                  e.target.value
                                )
                              }
                              placeholder={`Enter ${keyInfo.label}`}
                              className={`w-full px-4 py-3 pr-20 rounded-lg border transition-all duration-200 ${
                                validationErrors[mcp.id]?.[keyInfo.name]
                                  ? "border-red-300 dark:border-red-700 focus:ring-red-400 dark:focus:ring-red-600"
                                  : `border-${
                                      mcp.color === "blue"
                                        ? "blue"
                                        : mcp.color === "purple"
                                        ? "purple"
                                        : mcp.color === "green"
                                        ? "green"
                                        : mcp.color === "red"
                                        ? "red"
                                        : "indigo"
                                    }-300 
                                                    dark:border-${
                                                      mcp.color === "blue"
                                                        ? "blue"
                                                        : mcp.color === "purple"
                                                        ? "purple"
                                                        : mcp.color === "green"
                                                        ? "green"
                                                        : mcp.color === "red"
                                                        ? "red"
                                                        : "indigo"
                                                    }-700 
                                                    focus:ring-${
                                                      mcp.color === "blue"
                                                        ? "blue"
                                                        : mcp.color === "purple"
                                                        ? "purple"
                                                        : mcp.color === "green"
                                                        ? "green"
                                                        : mcp.color === "red"
                                                        ? "red"
                                                        : "indigo"
                                                    }-400 
                                                    dark:focus:ring-${
                                                      mcp.color === "blue"
                                                        ? "blue"
                                                        : mcp.color === "purple"
                                                        ? "purple"
                                                        : mcp.color === "green"
                                                        ? "green"
                                                        : mcp.color === "red"
                                                        ? "red"
                                                        : "indigo"
                                                    }-600`
                              } bg-white dark:bg-gray-900 focus:outline-none focus:ring-1`}
                              whileFocus={{ scale: 1.01 }}
                            />
                            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                              <motion.button
                                type="button"
                                onClick={() =>
                                  toggleKeyVisibility(mcp.id, keyInfo.name)
                                }
                                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                {visibleKeys[mcp.id]?.[keyInfo.name] ? (
                                  <EyeOff size={16} />
                                ) : (
                                  <Eye size={16} />
                                )}
                              </motion.button>

                              {apiKeys[mcp.id]?.[keyInfo.name] && (
                                <motion.button
                                  type="button"
                                  onClick={() =>
                                    copyToClipboard(
                                      mcp.id,
                                      keyInfo.name,
                                      apiKeys[mcp.id][keyInfo.name]
                                    )
                                  }
                                  className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                >
                                  {copiedKey?.mcpId === mcp.id &&
                                  copiedKey?.keyName === keyInfo.name ? (
                                    <Check
                                      size={16}
                                      className="text-green-500"
                                    />
                                  ) : (
                                    <Copy size={16} />
                                  )}
                                </motion.button>
                              )}
                            </div>
                          </div>

                          <AnimatePresence>
                            {validationErrors[mcp.id]?.[keyInfo.name] && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.2 }}
                                className="flex items-center gap-1 text-sm text-red-500 dark:text-red-400 mt-1"
                              >
                                <AlertCircle size={14} />
                                <span>{keyInfo.label} is required</span>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              ))}

              {/* Button row with back and submit buttons side by side with space between */}
              <motion.div
                className="flex justify-between items-center gap-8 mt-6"
                variants={itemVariants}
              >
                <Link href="/CreateAgent" className="w-1/4">
                  <motion.button
                    whileHover={{ scale: 1.02, x: -3 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    className="w-full py-4 rounded-lg flex items-center justify-center gap-2 font-medium border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                  >
                    <motion.div
                      animate={{ x: [0, -3, 0] }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        repeatDelay: 2,
                      }}
                    >
                      <ArrowLeft size={18} />
                    </motion.div>
                    <span>Back</span>
                  </motion.button>
                </Link>

                <motion.button
                  whileHover={{
                    scale: isSubmitting ? 1 : 1.02,
                    boxShadow: isSubmitting
                      ? "none"
                      : "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                  }}
                  whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className={`w-1/4 py-4 rounded-lg flex items-center justify-center gap-2 font-medium transition-all duration-300 ${
                    isSubmitting
                      ? "bg-gray-200 dark:bg-gray-800 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-md"
                  }`}
                >
                  {isSubmitting ? (
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
                        <span>
                          {progress < 100
                            ? "Uploading to IPFS..."
                            : "Creating..."}
                        </span>
                      </div>
                      <div className="w-full h-1 bg-gray-300 dark:bg-gray-600 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-blue-500 dark:bg-blue-400 rounded-full"
                          initial={{ width: "0%" }}
                          animate={{ width: `${progress}%` }}
                          transition={{ duration: 0.2 }}
                        />
                      </div>
                    </div>
                  ) : (
                    <>
                      <Cloud size={18} />
                      <span>Create & Upload</span>
                      <motion.div
                        animate={{ x: [0, 3, 0] }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          repeatDelay: 2,
                        }}
                      >
                        <ChevronRight size={18} />
                      </motion.div>
                    </>
                  )}
                </motion.button>
              </motion.div>

              {/* Show IPFS hash if available */}
              <AnimatePresence>
                {ipfsHash && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-800"
                  >
                    <div className="flex items-center gap-2 text-green-700 dark:text-green-300 font-medium mb-1">
                      <Check size={16} />
                      <span>Successfully uploaded to IPFS!</span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <code className="text-xs bg-green-100 dark:bg-green-800/50 p-2 rounded font-mono text-green-800 dark:text-green-200 flex-1 overflow-x-auto">
                        {ipfsHash}
                      </code>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() =>
                          copyToClipboard(-1, "ipfsHash", ipfsHash)
                        }
                        className="p-1 text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-200"
                      >
                        {copiedKey?.mcpId === -1 &&
                        copiedKey?.keyName === "ipfsHash" ? (
                          <Check size={16} />
                        ) : (
                          <Copy size={16} />
                        )}
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
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

      <style jsx global>{`
        .shake-animation {
          animation: shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
        }

        @keyframes shake {
          10%,
          90% {
            transform: translate3d(-1px, 0, 0);
          }
          20%,
          80% {
            transform: translate3d(2px, 0, 0);
          }
          30%,
          50%,
          70% {
            transform: translate3d(-3px, 0, 0);
          }
          40%,
          60% {
            transform: translate3d(3px, 0, 0);
          }
        }
      `}</style>
    </div>
  );
}
