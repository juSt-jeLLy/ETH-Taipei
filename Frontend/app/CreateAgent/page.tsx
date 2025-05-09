"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
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
  AlertCircle,
} from "lucide-react";
import NavBar from "../components/NavBar";

// Mock MCP data
const mcpOptions = [
  {
    id: 1,
    name: "1inch",
    icon: "/download.png",
    description: "DeFi integration",
    color: "green",
  },
  {
    id: 3,
    name: "google-maps",
    icon: "/download.jpeg",
    description: "Location and mapping services",
    color: "indigo",
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
export default function CreateAgent() {
  const router = useRouter();
  const [agentName, setAgentName] = useState("");
  const [invocationType, setInvocationType] = useState("ping");
  const [selectedMCPs, setSelectedMCPs] = useState<number[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [nameError, setNameError] = useState<string | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [hoveringMCP, setHoveringMCP] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

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

  const toggleMCP = (id: number) => {
    if (selectedMCPs.includes(id)) {
      setSelectedMCPs(selectedMCPs.filter((mcpId) => mcpId !== id));
    } else {
      setSelectedMCPs([...selectedMCPs, id]);
    }
  };

  // In the handleCreateAgent function, add localStorage storage before navigation
  const handleCreateAgent = () => {
    // Validate ENS name before proceeding
    const error = validateENSName(agentName);
    if (error) {
      setNameError(error);
      return;
    }

    if (selectedMCPs.length === 0) {
      alert("Please select at least one MCP");
      return;
    }

    // Show loading state
    setIsCreating(true);

    // Store the data in localStorage as JSON
    const agentData = {
      agentName,
      invocationType,
      selectedMCPs: selectedMCPs.map((mcpId) => {
        const mcp = mcpOptions.find((m) => m.id === mcpId);
        return {
          id: mcpId,
          name: mcp?.name || "",
          icon: mcp?.icon || "",
          color: mcp?.color || "",
        };
      }),
    };

    localStorage.setItem("agentCreationData", JSON.stringify(agentData));

    // Simulate loading
    setTimeout(() => {
      // Navigate to the API keys page with the current selections as query parameters
      const selectedMCPsString = selectedMCPs.join(",");
      router.push(
        `/CreateAgent/api-keys?name=${encodeURIComponent(
          agentName
        )}&type=${invocationType}&mcps=${selectedMCPsString}`
      );
    }, 800);
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
                <Server
                  size={24}
                  className="text-gray-700 dark:text-gray-300"
                />
              </motion.div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Create AI Agent
              </h2>
            </motion.div>

            <motion.div
              className="space-y-8"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {/* Agent ENS Name */}
              <motion.div className="relative" variants={itemVariants}>
                <label className="flex items-center gap-2 text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  <User size={16} />
                  Agent ENS Name
                </label>
                <div className="relative">
                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    whileFocus={{ scale: 1.01 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <input
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
                    />
                  </motion.div>

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
                <motion.div
                  className="mt-2 text-xs text-gray-500 dark:text-gray-400"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.8 }}
                  transition={{ delay: 0.3 }}
                >
                  ENS names must end with .eth and be at least 3 characters long
                  (e.g., myagent.eth)
                </motion.div>
              </motion.div>

              {/* Invocation Type */}
              <motion.div variants={itemVariants}>
                <label className="flex items-center gap-2 text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  <Code size={16} />
                  Invocation Type
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <motion.button
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    onClick={() => setInvocationType("ping")}
                    className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border transition-all duration-200 ${
                      invocationType === "ping"
                        ? "bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 shadow-sm"
                        : "border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600"
                    }`}
                  >
                    <motion.div
                      animate={
                        invocationType === "ping"
                          ? {
                              scale: [1, 1.2, 1],
                              rotate: [0, 5, 0],
                            }
                          : {}
                      }
                      transition={{ duration: 0.5 }}
                    >
                      <Zap
                        size={18}
                        className={
                          invocationType === "ping"
                            ? "text-blue-600 dark:text-blue-400"
                            : "text-gray-500 dark:text-gray-400"
                        }
                      />
                    </motion.div>
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
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    onClick={() => setInvocationType("polling")}
                    className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border transition-all duration-200 ${
                      invocationType === "polling"
                        ? "bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 shadow-sm"
                        : "border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600"
                    }`}
                  >
                    <motion.div
                      animate={
                        invocationType === "polling"
                          ? {
                              scale: [1, 1.2, 1],
                              rotate: [0, 5, 0],
                            }
                          : {}
                      }
                      transition={{ duration: 0.5 }}
                    >
                      <Clock
                        size={18}
                        className={
                          invocationType === "polling"
                            ? "text-purple-600 dark:text-purple-400"
                            : "text-gray-500 dark:text-gray-400"
                        }
                      />
                    </motion.div>
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
              </motion.div>

              {/* Select MCPs */}
              <motion.div variants={itemVariants}>
                <label className="flex items-center gap-2 text-sm font-medium mb-4 text-gray-700 dark:text-gray-300">
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      repeatDelay: 5,
                    }}
                  >
                    <Layers size={16} />
                  </motion.div>
                  Select MCPs
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {mcpOptions.map((mcp) => (
                    <motion.div
                      key={mcp.id}
                      initial={{ opacity: 0.9 }}
                      whileHover={{
                        scale: 1.03,
                        y: -3,
                        boxShadow: selectedMCPs.includes(mcp.id)
                          ? `0 8px 16px rgba(${
                              mcp.color === "blue" 
                                ? "59, 130, 246, 0.2"
                                : mcp.color === "purple"
                                ? "139, 92, 246, 0.2"
                                : mcp.color === "green"
                                ? "16, 185, 129, 0.2"
                                : mcp.color === "red"
                                ? "239, 68, 68, 0.2"
                                : "99, 102, 241, 0.2"
                            })`
                          : "0 8px 16px rgba(0, 0, 0, 0.08)",
                        backgroundColor: selectedMCPs.includes(mcp.id)
                          ? mcp.color === "blue"
                            ? "#93C5FD" // Darker blue - bg-blue-300
                            : mcp.color === "purple"
                            ? "#C4B5FD" // Darker purple - bg-purple-300
                            : mcp.color === "green"
                            ? "#6EE7B7" // Darker green - bg-green-300
                            : mcp.color === "red"
                            ? "#FCA5A5" // Darker red - bg-red-300
                            : "#A5B4FC" // Darker indigo - bg-indigo-300
                          : mcp.color === "blue"
                            ? "#60A5FA" // Even darker blue on hover - bg-blue-400
                            : mcp.color === "purple"
                            ? "#A78BFA" // Even darker purple on hover - bg-purple-400
                            : mcp.color === "green"
                            ? "#34D399" // Even darker green on hover - bg-green-400
                            : mcp.color === "red"
                            ? "#F87171" // Even darker red on hover - bg-red-400
                            : "#818CF8", // Even darker indigo on hover - bg-indigo-400
                      }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => toggleMCP(mcp.id)}
                      onMouseEnter={() => setHoveringMCP(mcp.id)}
                      onMouseLeave={() => setHoveringMCP(null)}
                      className={`flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition-all duration-300 backdrop-blur-sm ${
                        selectedMCPs.includes(mcp.id)
                          ? mcp.color === "blue"
                            ? "border-blue-400 dark:border-blue-700 bg-blue-50/40 dark:bg-blue-900/20 shadow-blue-100 dark:shadow-blue-900/30 shadow-md" 
                            : mcp.color === "purple"
                            ? "border-purple-400 dark:border-purple-700 bg-purple-50/40 dark:bg-purple-900/20 shadow-purple-100 dark:shadow-purple-900/30 shadow-md"
                            : mcp.color === "green"
                            ? "border-green-400 dark:border-green-700 bg-green-50/40 dark:bg-green-900/20 shadow-green-100 dark:shadow-green-900/30 shadow-md"
                            : mcp.color === "red"
                            ? "border-red-400 dark:border-red-700 bg-red-50/40 dark:bg-red-900/20 shadow-red-100 dark:shadow-red-900/30 shadow-md"
                            : "border-indigo-400 dark:border-indigo-700 bg-indigo-50/40 dark:bg-indigo-900/20 shadow-indigo-100 dark:shadow-indigo-900/30 shadow-md"
                          : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-500 bg-white dark:bg-gray-800/50 shadow-sm hover:shadow-md"
                      }`}
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <motion.div
                          className={`w-10 h-10 flex-shrink-0 rounded-full flex items-center justify-center p-1 ${
                            selectedMCPs.includes(mcp.id)
                              ? mcp.color === "blue"
                                ? "bg-blue-100 dark:bg-blue-900/50"
                                : mcp.color === "purple"
                                ? "bg-purple-100 dark:bg-purple-900/50"
                                : mcp.color === "green"
                                ? "bg-green-100 dark:bg-green-900/50"
                                : mcp.color === "red"
                                ? "bg-red-100 dark:bg-red-900/50"
                                : "bg-indigo-100 dark:bg-indigo-900/50"
                              : "bg-gray-100 dark:bg-gray-700"
                          }`}
                          animate={{
                            rotate:
                              selectedMCPs.includes(mcp.id) ||
                              hoveringMCP === mcp.id
                                ? [0, 10, 0]
                                : 0,
                            scale: selectedMCPs.includes(mcp.id)
                              ? [1, 1.1, 1]
                              : hoveringMCP === mcp.id
                              ? 1.08
                              : 1,
                            boxShadow: selectedMCPs.includes(mcp.id)
                              ? mcp.color === "blue"
                                ? [
                                    "0 0 0 0 rgba(59, 130, 246, 0)",
                                    "0 0 0 4px rgba(59, 130, 246, 0.2)",
                                    "0 0 0 0 rgba(59, 130, 246, 0)",
                                  ]
                                : mcp.color === "purple"
                                ? [
                                    "0 0 0 0 rgba(139, 92, 246, 0)",
                                    "0 0 0 4px rgba(139, 92, 246, 0.2)",
                                    "0 0 0 0 rgba(139, 92, 246, 0)",
                                  ]
                                : mcp.color === "green"
                                ? [
                                    "0 0 0 0 rgba(16, 185, 129, 0)",
                                    "0 0 0 4px rgba(16, 185, 129, 0.2)",
                                    "0 0 0 0 rgba(16, 185, 129, 0)",
                                  ]
                                : [
                                    "0 0 0 0 rgba(59, 130, 246, 0)",
                                    "0 0 0 4px rgba(59, 130, 246, 0.2)",
                                    "0 0 0 0 rgba(59, 130, 246, 0)",
                                  ]
                              : hoveringMCP === mcp.id
                              ? "0 0 0 2px rgba(209, 213, 219, 0.4)"
                              : "none",
                          }}
                          transition={{
                            duration: 0.5,
                            ease: "easeInOut",
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
                          <motion.div
                            className={`font-semibold text-base ${
                              selectedMCPs.includes(mcp.id)
                                ? mcp.color === "blue"
                                  ? "text-blue-900 dark:text-white"
                                  : mcp.color === "purple"
                                  ? "text-purple-900 dark:text-white"
                                  : mcp.color === "green"
                                  ? "text-green-900 dark:text-white"
                                  : mcp.color === "red"
                                  ? "text-red-900 dark:text-white"
                                  : "text-indigo-900 dark:text-white"
                                : hoveringMCP === mcp.id
                                  ? mcp.color === "blue"
                                    ? "text-blue-950 dark:text-white"
                                    : mcp.color === "purple"
                                    ? "text-purple-950 dark:text-white"
                                    : mcp.color === "green"
                                    ? "text-green-950 dark:text-white"
                                    : mcp.color === "red"
                                    ? "text-red-950 dark:text-white"
                                    : "text-indigo-950 dark:text-white"
                                  : mcp.color === "blue"
                                    ? "text-blue-700 dark:text-blue-300"
                                    : mcp.color === "purple"
                                    ? "text-purple-700 dark:text-purple-300"
                                    : mcp.color === "green"
                                    ? "text-green-700 dark:text-green-300"
                                    : mcp.color === "red"
                                    ? "text-red-700 dark:text-red-300"
                                    : "text-indigo-700 dark:text-indigo-300"
                            }`}
                            animate={{
                              scale: selectedMCPs.includes(mcp.id)
                                ? [1, 1.05, 1]
                                : 1,
                              opacity: selectedMCPs.includes(mcp.id)
                                ? [0.9, 1, 0.9]
                                : 0.9,
                            }}
                            transition={{
                              duration: 2,
                              repeat: selectedMCPs.includes(mcp.id)
                                ? Infinity
                                : 0,
                              repeatType: "reverse",
                            }}
                          >
                            {mcp.name}
                          </motion.div>
                          <div className={`text-sm ${
                            selectedMCPs.includes(mcp.id)
                              ? "text-gray-800 dark:text-gray-100"
                              : hoveringMCP === mcp.id
                                ? "text-gray-900 dark:text-white"
                                : "text-gray-500 dark:text-gray-300"
                          }`}>
                            {mcp.description}
                          </div>
                        </div>
                      </div>

                      {/* Selection indicator */}
                      <AnimatePresence>
                        {selectedMCPs.includes(mcp.id) && (
                          <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            transition={{ duration: 0.2, type: "spring" }}
                            className={`w-6 h-6 rounded-full flex items-center justify-center ${
                              mcp.color === "blue"
                                ? "bg-blue-100 dark:bg-blue-900/50"
                                : mcp.color === "purple"
                                ? "bg-purple-100 dark:bg-purple-900/50"
                                : mcp.color === "green"
                                ? "bg-green-100 dark:bg-green-900/50"
                                : mcp.color === "red"
                                ? "bg-red-100 dark:bg-red-900/50"
                                : "bg-indigo-100 dark:bg-indigo-900/50"
                            }`}
                          >
                            <Check
                              size={14}
                              className={
                                mcp.color === "blue"
                                  ? "text-blue-600 dark:text-blue-400"
                                  : mcp.color === "purple"
                                  ? "text-purple-600 dark:text-purple-400"
                                  : mcp.color === "green"
                                  ? "text-green-600 dark:text-green-400"
                                  : mcp.color === "red"
                                  ? "text-red-600 dark:text-red-400"
                                  : "text-indigo-600 dark:text-indigo-400"
                              }
                            />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </div>
                <AnimatePresence>
                  {selectedMCPs.length === 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="mt-2 text-sm text-amber-500 dark:text-amber-400 flex items-center gap-1.5"
                    >
                      <motion.div
                        animate={{ rotate: [0, 10, 0] }}
                        transition={{ duration: 0.5, repeat: 1 }}
                      >
                        <AlertCircle size={14} />
                      </motion.div>
                      <span>Please select at least one MCP</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Button row with back and next buttons side by side with space between */}
              <motion.div
                className="flex justify-between items-center gap-8 mt-6"
                variants={itemVariants}
              >
                <Link href="/" className="w-1/4">
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
                    scale: 1.02,
                    x: 3,
                    boxShadow:
                      "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                  }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCreateAgent}
                  disabled={
                    !!nameError ||
                    !agentName ||
                    selectedMCPs.length === 0 ||
                    isCreating
                  }
                  className={`w-1/4 py-4 rounded-lg flex items-center justify-center gap-2 font-medium transition-all duration-300 ${
                    !!nameError ||
                    !agentName ||
                    selectedMCPs.length === 0 ||
                    isCreating
                      ? "bg-gray-200 dark:bg-gray-800 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-md"
                  }`}
                >
                  {isCreating ? (
                    <>
                      <motion.div
                        className="w-5 h-5 border-2 border-current border-t-transparent rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      />
                      <span>Loading...</span>
                    </>
                  ) : (
                    <>
                      <span>Next</span>
                      <motion.div
                        animate={{ x: [0, 3, 0] }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          repeatDelay: 2,
                        }}
                      >
                        <Plus size={18} />
                      </motion.div>
                    </>
                  )}
                </motion.button>
              </motion.div>
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
    </div>
  );
}
