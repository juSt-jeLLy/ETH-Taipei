"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Github,
  Wallet,
  AlertCircle,
  Copy,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { useAccount, useDisconnect } from "wagmi";

export default function NavBar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [showWalletToast, setShowWalletToast] = useState(false);
  const [activeLink, setActiveLink] = useState("/");
  const [walletDropdownOpen, setWalletDropdownOpen] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const dropdownRef = useRef(null);
  const router = useRouter();

  // Use Wagmi's useAccount hook to get connection status and address
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  // Handle clicks outside the dropdown to close it
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setWalletDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Update wallet status when Wagmi connection changes
  useEffect(() => {
    if (isConnected && address) {
      // Check if this is a new connection
      const wasConnectedBefore =
        localStorage.getItem("walletConnected") === "true";

      setWalletConnected(true);
      setWalletAddress(address);

      // Store in localStorage to persist across page refreshes
      localStorage.setItem("walletConnected", "true");
      localStorage.setItem("walletAddress", address);

      // Only show success animation if this was a new connection
      if (!wasConnectedBefore) {
        setShowWalletToast(true);
        setTimeout(() => {
          setShowWalletToast(false);
        }, 3000);
      }
    } else {
      setWalletConnected(false);
      setWalletAddress("");
      localStorage.removeItem("walletConnected");
      localStorage.removeItem("walletAddress");
    }
  }, [isConnected, address]);

  // Function to handle My Agents link click
  const handleMyAgentsClick = (e) => {
    if (!walletConnected) {
      e.preventDefault();
      setShowWalletToast(true);

      // Hide toast after 3 seconds
      setTimeout(() => {
        setShowWalletToast(false);
      }, 3000);
    }
  };

  // Function to copy wallet address to clipboard
  const copyAddressToClipboard = () => {
    navigator.clipboard.writeText(walletAddress);
    setCopySuccess(true);
    setTimeout(() => {
      setCopySuccess(false);
      setWalletDropdownOpen(false);
    }, 1500);
  };

  // Function to disconnect wallet
  const handleDisconnect = () => {
    disconnect();
    setWalletDropdownOpen(false);
  };

  // Check if wallet was previously connected (fallback for initial load)
  useEffect(() => {
    // Set active link based on current path
    const path = window.location.pathname;
    setActiveLink(path);

    // Only use localStorage if Wagmi hasn't initialized yet
    if (!isConnected) {
      const isConnected = localStorage.getItem("walletConnected") === "true";
      const address = localStorage.getItem("walletAddress");

      if (isConnected && address) {
        setWalletConnected(true);
        setWalletAddress(address);
      }
    }
  }, [isConnected]);

  // Format wallet address for display
  const formatWalletAddress = (address) => {
    if (!address) return "";
    return `${address.substring(0, 6)}...${address.substring(
      address.length - 4
    )}`;
  };

  // Animation variants
  const navItemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24,
      },
    },
  };

  const mobileMenuVariants = {
    hidden: { opacity: 0, height: 0, y: -20 },
    visible: {
      opacity: 1,
      height: "auto",
      y: 0,
      transition: {
        duration: 0.3,
        staggerChildren: 0.1,
        when: "beforeChildren",
      },
    },
    exit: {
      opacity: 0,
      height: 0,
      y: -20,
      transition: { duration: 0.2 },
    },
  };

  const dropdownVariants = {
    hidden: { opacity: 0, y: -10, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.2,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      y: -10,
      scale: 0.95,
      transition: {
        duration: 0.15,
        ease: "easeIn",
      },
    },
  };

  return (
    <motion.nav
      className="relative z-20"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          {/* Logo and Brand */}
          <Link href="/" className="flex items-center gap-3">
            <motion.div
              whileHover={{ rotate: 10, scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <Image src="/images.png" alt="" width={40} height={40} />
            </motion.div>
            <motion.h1
              className="text-2xl font-bold text-gray-900 dark:text-white"
              animate={{
                backgroundPosition: ["0% center", "100% center", "0% center"],
              }}
              transition={{
                duration: 8,
                ease: "easeInOut",
                repeat: Infinity,
              }}
            >
              ETH Taipei{" "}
              <motion.span
                className="text-gray-500 dark:text-gray-400"
                whileHover={{
                  color: "#3B82F6",
                  transition: { duration: 0.2 },
                }}
              >
                AI Agents
              </motion.span>
            </motion.h1>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {[
              { href: "/", label: "Home" },
              { href: "/CreateAgent", label: "Create Agent" },
              {
                href: walletConnected ? "/MyAgents" : "#",
                label: "Agents",
                needsWallet: true,
                onClick: handleMyAgentsClick,
              },
              {
                href: "https://github.com/juSt-jeLLy/ETH-Taipei",
                label: "Documentation",
                icon: <Github size={16} />,
                external: true,
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                variants={navItemVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  href={item.href}
                  onClick={item.onClick}
                  target={item.external ? "_blank" : undefined}
                  rel={item.external ? "noopener noreferrer" : undefined}
                  className={`relative text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium flex items-center gap-1 ${
                    !item.needsWallet || walletConnected
                      ? ""
                      : "cursor-not-allowed opacity-80"
                  } ${
                    activeLink === item.href
                      ? "text-blue-600 dark:text-blue-400"
                      : ""
                  }`}
                >
                  {item.icon && item.icon}
                  {item.label}
                  {item.needsWallet && !walletConnected && (
                    <span className="ml-1 text-xs text-amber-500">
                      (Connect wallet)
                    </span>
                  )}

                  {/* Animated underline for active link */}
                  {activeLink === item.href && (
                    <motion.div
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-blue-500 dark:bg-blue-400"
                      layoutId="activeNavIndicator"
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 0.3 }}
                    />
                  )}

                  {/* Hover underline animation */}
                  <motion.div
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gray-300 dark:bg-gray-600"
                    initial={{ width: "0%" }}
                    whileHover={{ width: "100%" }}
                    transition={{ duration: 0.2 }}
                  />
                </Link>
              </motion.div>
            ))}

            {walletConnected ? (
              <div className="relative" ref={dropdownRef}>
                <motion.button
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium flex items-center gap-2 overflow-hidden"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  whileHover={{
                    scale: 1.05,
                    boxShadow:
                      "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                  }}
                  onClick={() => setWalletDropdownOpen(!walletDropdownOpen)}
                >
                  <motion.div
                    animate={{
                      rotate: walletDropdownOpen ? [0, 180] : [180, 0],
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <Wallet size={16} />
                  </motion.div>
                  <motion.span
                    className="truncate max-w-[100px]"
                    initial={{ width: 0 }}
                    animate={{ width: "auto" }}
                    transition={{ duration: 0.3 }}
                  >
                    {formatWalletAddress(walletAddress)}
                  </motion.span>
                  <ChevronDown
                    size={16}
                    className={`transition-transform duration-300 ${
                      walletDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </motion.button>

                <AnimatePresence>
                  {walletDropdownOpen && (
                    <motion.div
                      className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-md shadow-lg overflow-hidden z-30 border border-gray-200 dark:border-gray-700"
                      variants={dropdownVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                    >
                      <div className="py-2">
                        <button
                          onClick={copyAddressToClipboard}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                        >
                          <Copy size={16} />
                          <span>
                            {copySuccess ? "Copied!" : "Copy Address"}
                          </span>
                        </button>
                        <button
                          onClick={handleDisconnect}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                        >
                          <LogOut size={16} />
                          <span>Disconnect Wallet</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="w3m-button-container">
                <w3m-button />
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <motion.div
            className="md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <motion.button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <AnimatePresence mode="wait">
                {mobileMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X size={24} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu size={24} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </motion.div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            variants={mobileMenuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="md:hidden bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-lg"
          >
            <div className="px-4 py-4 space-y-4">
              {[
                { href: "/", label: "Home" },
                { href: "/CreateAgent", label: "Create Agent" },
                {
                  href: walletConnected ? "/MyAgents" : "#",
                  label: "Agents",
                  needsWallet: true,
                  onClick: (e) => {
                    setMobileMenuOpen(false);
                    handleMyAgentsClick(e);
                  },
                },
                {
                  href: "https://github.com/juSt-jeLLy/ETH-Taipei",
                  label: "Documentation",
                  icon: <Github size={16} />,
                  external: true,
                  onClick: () => setMobileMenuOpen(false),
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  variants={navItemVariants}
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Link
                    href={item.href}
                    onClick={item.onClick}
                    target={item.external ? "_blank" : undefined}
                    rel={item.external ? "noopener noreferrer" : undefined}
                    className={`block text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium py-2 flex items-center gap-2 ${
                      !item.needsWallet || walletConnected
                        ? ""
                        : "cursor-not-allowed opacity-80"
                    } ${
                      activeLink === item.href
                        ? "text-blue-600 dark:text-blue-400"
                        : ""
                    }`}
                  >
                    {item.icon && (
                      <motion.div
                        animate={{ rotate: [0, 10, 0] }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          repeatDelay: 2,
                        }}
                      >
                        {item.icon}
                      </motion.div>
                    )}
                    {item.label}
                    {item.needsWallet && !walletConnected && (
                      <span className="ml-1 text-xs text-amber-500">
                        (Connect wallet)
                      </span>
                    )}
                  </Link>
                </motion.div>
              ))}

              {walletConnected ? (
                <div className="space-y-2">
                  <motion.div
                    className="px-4 py-3 bg-blue-500 text-white rounded-lg font-medium flex items-center gap-2 mt-4"
                    variants={navItemVariants}
                    whileHover={{
                      scale: 1.02,
                      boxShadow:
                        "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                    }}
                  >
                    <motion.div
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 2, repeat: 1, repeatDelay: 5 }}
                    >
                      <Wallet size={16} />
                    </motion.div>
                    <motion.span
                      className="truncate max-w-[150px]"
                      initial={{ width: 0 }}
                      animate={{ width: "auto" }}
                      transition={{ duration: 0.3 }}
                    >
                      {formatWalletAddress(walletAddress)}
                    </motion.span>
                  </motion.div>

                  <motion.button
                    variants={navItemVariants}
                    onClick={copyAddressToClipboard}
                    className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg font-medium flex items-center gap-2"
                  >
                    <Copy size={16} />
                    <span>
                      {copySuccess ? "Address copied!" : "Copy Address"}
                    </span>
                  </motion.button>

                  <motion.button
                    variants={navItemVariants}
                    onClick={handleDisconnect}
                    className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 text-red-600 dark:text-red-400 rounded-lg font-medium flex items-center gap-2"
                  >
                    <LogOut size={16} />
                    <span>Disconnect Wallet</span>
                  </motion.button>
                </div>
              ) : (
                <motion.div
                  variants={navItemVariants}
                  className="mt-4 w3m-button-container-mobile"
                >
                  <w3m-button />
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Wallet connection toast */}
      <AnimatePresence>
        {showWalletToast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-900 dark:to-amber-800 border border-amber-200 dark:border-amber-700 text-amber-800 dark:text-amber-200 px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 z-50"
          >
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 10, 0],
              }}
              transition={{ duration: 0.5, repeat: 3, repeatType: "reverse" }}
            >
              <AlertCircle size={20} />
            </motion.div>
            <span>
              {walletConnected
                ? "Wallet connected successfully!"
                : "Please connect your wallet to access My Agents"}
            </span>
            <motion.div
              className="ml-2 w-1.5 h-1.5 bg-amber-500 rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.7, 1, 0.7],
              }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add some custom styles for the Web3Modal button */}
      <style jsx global>{`
        .w3m-button-container w3m-button {
          --w3m-accent-color: #3b82f6;
          --w3m-accent-fill-color: #ffffff;
          --w3m-z-index: 30;
        }

        .w3m-button-container-mobile {
          width: 100%;
        }

        .w3m-button-container-mobile w3m-button {
          --w3m-accent-color: #3b82f6;
          --w3m-accent-fill-color: #ffffff;
          --w3m-z-index: 30;
          width: 100%;
        }
      `}</style>
    </motion.nav>
  );
}
