"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Menu, X, Github, Wallet, AlertCircle } from "lucide-react";

export default function NavBar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [showWalletToast, setShowWalletToast] = useState(false);
  const router = useRouter();

  // Function to handle wallet connection
  const connectWallet = async () => {
    // In a real implementation, this would use ethers.js or web3.js to connect
    // For now, we'll simulate a connection
    try {
      // Simulate connection delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful connection
      const mockAddress = "0x" + Math.random().toString(16).slice(2, 12);
      setWalletAddress(mockAddress);
      setWalletConnected(true);
      
      // Store in localStorage to persist across page refreshes
      localStorage.setItem("walletConnected", "true");
      localStorage.setItem("walletAddress", mockAddress);
    } catch (error) {
      console.error("Error connecting wallet:", error);
    }
  };

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

  // Check if wallet was previously connected
  useEffect(() => {
    const isConnected = localStorage.getItem("walletConnected") === "true";
    const address = localStorage.getItem("walletAddress");
    
    if (isConnected && address) {
      setWalletConnected(true);
      setWalletAddress(address);
    }
  }, []);

  return (
    <nav className="relative z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          {/* Logo and Brand */}
          <Link href="/" className="flex items-center gap-3">
            <motion.div
              whileHover={{ rotate: 10 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <Image src="/images.png" alt="" width={40} height={40} />
            </motion.div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              ETH Taipei{" "}
              <span className="text-gray-500 dark:text-gray-400">
                AI Agents
              </span>
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium"
            >
              Home
            </Link>
            <Link
              href="/CreateAgent"
              className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium"
            >
              Create Agent
            </Link>
            <Link
              href={walletConnected ? "/MyAgents" : "#"}
              onClick={handleMyAgentsClick}
              className={`text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium ${
                !walletConnected ? "cursor-not-allowed opacity-80" : ""
              }`}
            >
              My Agents
              {!walletConnected && (
                <span className="ml-1 text-xs text-amber-500">
                  (Connect wallet)
                </span>
              )}
            </Link>
            <Link
              href="https://github.com/juSt-jeLLy/ETH-Taipei"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium flex items-center gap-1"
            >
              <Github size={16} />
              Documentation
            </Link>
            
            {walletConnected ? (
              <div className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg font-medium flex items-center gap-2">
                <Wallet size={16} />
                <span className="truncate max-w-[100px]">{walletAddress}</span>
              </div>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                onClick={connectWallet}
                className="px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg font-medium flex items-center gap-2"
              >
                <Wallet size={16} />
                Connect Wallet
              </motion.button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800"
        >
          <div className="px-4 py-4 space-y-4">
            <Link
              href="/"
              className="block text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/CreateAgent"
              className="block text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Create Agent
            </Link>
            <Link
              href={walletConnected ? "/MyAgents" : "#"}
              onClick={(e) => {
                setMobileMenuOpen(false);
                handleMyAgentsClick(e);
              }}
              className={`block text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium py-2 ${
                !walletConnected ? "cursor-not-allowed opacity-80" : ""
              }`}
            >
              My Agents
              {!walletConnected && (
                <span className="ml-1 text-xs text-amber-500">
                  (Connect wallet)
                </span>
              )}
            </Link>
            <Link
              href="https://github.com/juSt-jeLLy/ETH-Taipei"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium py-2 flex items-center gap-1"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Github size={16} />
              Documentation
            </Link>
            
            {walletConnected ? (
              <div className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg font-medium flex items-center gap-2">
                <Wallet size={16} />
                <span className="truncate max-w-[150px]">{walletAddress}</span>
              </div>
            ) : (
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  connectWallet();
                  setMobileMenuOpen(false);
                }}
                className="w-full px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg font-medium mt-2 flex items-center justify-center gap-2"
              >
                <Wallet size={16} />
                Connect Wallet
              </motion.button>
            )}
          </div>
        </motion.div>
      )}
      
      {/* Wallet connection toast */}
      {showWalletToast && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-amber-50 dark:bg-amber-900 border border-amber-200 dark:border-amber-700 text-amber-800 dark:text-amber-200 px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 z-50"
        >
          <AlertCircle size={16} />
          <span>Please connect your wallet to access My Agents</span>
        </motion.div>
      )}
    </nav>
  );
}
