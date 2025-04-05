"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion} from "framer-motion";
import {
  ArrowRight,
  Bot,
  Cpu,
  Shield,
  Layers,
  Zap,
  Globe,
  Code,
  Github,
} from "lucide-react";
import NavBar from "./components/NavBar";

export default function Home() {
  // State for animation triggers
  const [isHovering, setIsHovering] = useState<number | null>(null);
  const [animateNetwork, setAnimateNetwork] = useState(false);

  // Start network animation after component mounts
  useEffect(() => {
    setAnimateNetwork(true);
    
    // Simulate network activity with interval
    const interval = setInterval(() => {
      setAnimateNetwork(prev => !prev);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Hero Section */}
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
            repeatType: "reverse" 
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600" />
          <div className="absolute w-full h-full bg-[url('/grid-pattern.svg')] bg-center" />
        </motion.div>

        <div className="relative z-10">
          <NavBar />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-24 md:pt-12 md:pb-32">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
              >
                <motion.h1 
                  className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.2 }}
                >
                  Create AI Agents for{" "}
                  <motion.span 
                    className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600"
                    animate={{ 
                      backgroundPosition: ["0% center", "100% center", "0% center"],
                    }}
                    transition={{ 
                      duration: 8, 
                      ease: "easeInOut", 
                      repeat: Infinity,
                    }}
                  >
                    Web3 Automation
                  </motion.span>
                </motion.h1>
                <motion.p 
                  className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-lg"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.7, delay: 0.4 }}
                >
                  Deploy intelligent agents that can monitor, analyze, and
                  interact with blockchain networks automatically.
                </motion.p>
                <motion.div 
                  className="flex flex-col sm:flex-row gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.6 }}
                >
                  <Link href="/CreateAgent">
                    <motion.button
                      whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.5)" }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-medium flex items-center justify-center gap-2 w-full sm:w-auto shadow-lg"
                    >
                      Create Agent 
                      <motion.div
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 1, repeat: Infinity, repeatDelay: 1 }}
                      >
                        <ArrowRight size={18} />
                      </motion.div>
                    </motion.button>
                  </Link>
                  <Link
                    href="https://github.com/juSt-jeLLy/ETH-Taipei"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <motion.button
                      whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      className="px-8 py-4 border border-gray-300 dark:border-gray-700 rounded-lg font-medium text-gray-700 dark:text-gray-300 flex items-center justify-center gap-2 w-full sm:w-auto backdrop-blur-sm hover:bg-white/5"
                    >
                      Learn More <Github size={18} className="ml-1" />
                    </motion.button>
                  </Link>
                </motion.div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.3, type: "spring" }}
                className="relative"
              >
                <motion.div 
                  className="relative z-10 bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-gray-700"
                  whileHover={{ 
                    y: -5,
                    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                  }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <motion.div 
                    className="absolute -top-6 -right-6 bg-blue-500 rounded-full w-20 h-20 flex items-center justify-center"
                    whileHover={{ scale: 1.1, rotate: 10 }}
                    animate={{ 
                      boxShadow: ["0 0 0 0px rgba(59, 130, 246, 0.5)", "0 0 0 10px rgba(59, 130, 246, 0)"],
                    }}
                    transition={{ 
                      boxShadow: { repeat: Infinity, duration: 1.5 },
                      scale: { type: "spring", stiffness: 400 }
                    }}
                  >
                    <Bot size={32} className="text-white" />
                  </motion.div>
                  <div className="space-y-6">
                    {/* Agent dashboard visualization */}
                    <div className="h-40 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden relative">
                      {/* Network visualization */}
                      <motion.div 
                        className="absolute inset-0 flex items-center justify-center"
                        animate={{ rotate: animateNetwork ? 360 : 0 }}
                        transition={{ duration: 60, ease: "linear", repeat: Infinity }}
                      >
                        <motion.div 
                          className="w-24 h-24 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center"
                          animate={{ scale: [1, 1.05, 1] }}
                          transition={{ duration: 3, repeat: Infinity }}
                        >
                          <motion.div 
                            className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-800/50 flex items-center justify-center"
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                          >
                            <Cpu size={24} className="text-blue-500 dark:text-blue-400" />
                          </motion.div>
                        </motion.div>
                        
                        {/* Connection lines */}
                        {[45, 90, 135, 180, 225, 270, 315, 360].map((angle, i) => (
                          <motion.div 
                            key={i}
                            className="absolute w-20 h-1 bg-gray-200 dark:bg-gray-600 origin-left"
                            style={{ 
                              transform: `rotate(${angle}deg)`, 
                              left: '50%', 
                              top: '50%',
                              opacity: i % 2 === 0 ? 0.8 : 0.4
                            }}
                            animate={{ 
                              opacity: animateNetwork ? [0.4, 0.8, 0.4] : [0.4, 0.4, 0.4],
                              scaleX: animateNetwork ? [1, 1.1, 1] : 1
                            }}
                            transition={{ 
                              duration: 2, 
                              delay: i * 0.1,
                              repeat: Infinity,
                              repeatType: "reverse"
                            }}
                          />
                        ))}
                        
                        {/* Blockchain nodes */}
                        {[45, 90, 135, 180, 225, 270, 315, 360].map((angle, i) => (
                          <motion.div 
                            key={i}
                            className="absolute w-6 h-6 rounded-full flex items-center justify-center"
                            style={{ 
                              transform: `rotate(${angle}deg) translateX(72px)`, 
                              left: '50%', 
                              top: '50%',
                              background: i % 3 === 0 ? 'rgba(59, 130, 246, 0.2)' : 
                                        i % 3 === 1 ? 'rgba(139, 92, 246, 0.2)' : 'rgba(16, 185, 129, 0.2)'
                            }}
                            animate={{ 
                              scale: [1, i % 3 === 0 ? 1.3 : 1.1, 1],
                              opacity: [0.7, 1, 0.7]
                            }}
                            transition={{ 
                              duration: 3, 
                              delay: i * 0.2, 
                              repeat: Infinity,
                              repeatType: "reverse"
                            }}
                          >
                            {i % 4 === 0 ? <Zap size={12} className="text-blue-500" /> : 
                            i % 4 === 1 ? <Globe size={12} className="text-purple-500" /> :
                            i % 4 === 2 ? <Code size={12} className="text-green-500" /> :
                                          <Shield size={12} className="text-red-500" />}
                          </motion.div>
                        ))}
                      </motion.div>
                    </div>
                    
                    {/* Agent status indicators */}
                    <div className="space-y-2">
                      <motion.div 
                        className="h-4 bg-gray-200 dark:bg-gray-600 rounded-full w-3/4 relative overflow-hidden"
                        whileHover={{ scale: 1.02 }}
                      >
                        <motion.div 
                          className="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                          initial={{ width: "0%" }}
                          animate={{ width: "66%" }}
                          transition={{ 
                            duration: 1.5, 
                            ease: "easeOut",
                            delay: 0.5
                          }}
                        ></motion.div>
                      </motion.div>
                      <motion.div 
                        className="h-4 bg-gray-200 dark:bg-gray-600 rounded-full w-1/2 relative overflow-hidden"
                        whileHover={{ scale: 1.02 }}
                      >
                        <motion.div 
                          className="absolute left-0 top-0 h-full bg-gradient-to-r from-green-500 to-blue-500 rounded-full"
                          initial={{ width: "0%" }}
                          animate={{ width: "80%" }}
                          transition={{ 
                            duration: 1.8, 
                            ease: "easeOut",
                            delay: 0.7
                          }}
                        ></motion.div>
                      </motion.div>
                    </div>
                    
                    {/* Agent controls */}
                    <div className="flex justify-between items-center">
                      <div className="flex space-x-2">
                        {[
                          { icon: <Zap size={14} />, color: "blue" },
                          { icon: <Globe size={14} />, color: "purple" },
                          { icon: <Code size={14} />, color: "green" }
                        ].map((item, index) => (
                          <motion.div
                            key={index}
                            className={`w-8 h-8 rounded-full bg-${item.color}-100 dark:bg-${item.color}-900 flex items-center justify-center`}
                            whileHover={{ scale: 1.2, rotate: 10 }}
                            whileTap={{ scale: 0.9 }}
                            transition={{ type: "spring", stiffness: 400, damping: 10 }}
                          >
                            <motion.div
                              className={`text-${item.color}-600 dark:text-${item.color}-400`}
                              animate={{ rotate: [0, 360] }}
                              transition={{ duration: 3, repeat: Infinity, delay: index * 0.5, repeatDelay: 5 }}
                            >
                              {item.icon}
                            </motion.div>
                          </motion.div>
                        ))}
                      </div>
                      <motion.div 
                        className="h-8 w-20 bg-gray-200 dark:bg-gray-600 rounded-md relative overflow-hidden flex items-center justify-center"
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 400 }}
                      >
                        <span className="text-xs font-medium text-gray-600 dark:text-gray-300 z-10">ACTIVE</span>
                        <motion.div 
                          className="absolute right-1 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-green-500"
                          animate={{ 
                            scale: [1, 1.5, 1],
                            opacity: [0.7, 1, 0.7],
                            boxShadow: [
                              "0 0 0 0 rgba(34, 197, 94, 0.7)",
                              "0 0 0 4px rgba(34, 197, 94, 0)",
                              "0 0 0 0 rgba(34, 197, 94, 0.7)"
                            ]
                          }}
                          transition={{ duration: 2, repeat: Infinity }}
                        ></motion.div>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  className="absolute -bottom-6 -left-6 w-32 h-32 bg-gray-100 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 rotate-6 shadow-lg flex items-center justify-center p-4"
                  whileHover={{ rotate: 0, scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  <motion.div 
                    className="w-full h-full bg-white dark:bg-gray-700 rounded-lg flex flex-col items-center justify-center p-2"
                    whileHover={{ y: -2 }}
                  >
                    <motion.div 
                      className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center mb-2"
                      animate={{ y: [0, -3, 0] }}
                      transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                    >
                      <Bot size={16} className="text-purple-600 dark:text-purple-400" />
                    </motion.div>
                    <motion.div 
                      className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-full mb-1"
                      animate={{ width: ["60%", "100%", "80%"] }}
                      transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
                    ></motion.div>
                    <motion.div 
                      className="w-3/4 h-2 bg-gray-200 dark:bg-gray-600 rounded-full"
                      animate={{ width: ["40%", "70%", "50%"] }}
                      transition={{ duration: 4, repeat: Infinity, repeatType: "reverse", delay: 0.5 }}
                    ></motion.div>
                  </motion.div>
                </motion.div>
                
                <motion.div
                  className="absolute top-1/4 -right-8 w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 -rotate-6 shadow-lg flex items-center justify-center p-3"
                  whileHover={{ rotate: 0, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  <motion.div 
                    className="w-full h-full rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center"
                    animate={{ 
                      backgroundPosition: ["0% 0%", "100% 100%"],
                      boxShadow: ["0 0 15px 0 rgba(59, 130, 246, 0.3)", "0 0 15px 0 rgba(139, 92, 246, 0.3)"]
                    }}
                    transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
                  >
                    <motion.div 
                      className="text-white font-bold text-xl"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      ETH
                    </motion.div>
                  </motion.div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-gray-900 relative overflow-hidden">
        <motion.div 
          className="absolute inset-0 opacity-5 dark:opacity-10"
          animate={{ 
            backgroundPosition: ["0% 0%", "100% 100%"],
          }}
          transition={{ 
            duration: 30, 
            ease: "linear", 
            repeat: Infinity, 
            repeatType: "reverse" 
          }}
        >
          <div className="absolute w-full h-full bg-[url('/grid-pattern.svg')] bg-center" />
        </motion.div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <motion.h2 
              className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4"
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Powerful Features for Web3 Automation
            </motion.h2>
            <motion.p 
              className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              viewport={{ once: true }}
            >
              Create intelligent agents that monitor and interact with
              blockchain networks automatically.
            </motion.p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              {
                icon: <Zap size={24} className="text-blue-600 dark:text-blue-400" />,
                title: "Real-time Monitoring",
                description: "Monitor blockchain events, transactions, and smart contract activities in real-time.",
              },
              {
                icon: <Globe size={24} className="text-purple-600 dark:text-purple-400" />,
                title: "Multi-chain Support",
                description: "Deploy agents across multiple blockchains including Ethereum, Polygon, Arbitrum and more.",
              },
              {
                icon: <Code size={24} className="text-green-600 dark:text-green-400" />,
                title: "Custom Logic",
                description: "Define custom conditions and actions for your agents to execute automatically.",
              },
              {
                icon: <Shield size={24} className="text-red-600 dark:text-red-400" />,
                title: "Secure Execution",
                description: "All agent operations are executed securely with robust error handling.",
              },
              {
                icon: <Bot size={24} className="text-indigo-600 dark:text-indigo-400" />,
                title: "AI-Powered Analysis",
                description: "Leverage AI to analyze on-chain data and make intelligent decisions.",
              },
              {
                icon: <Cpu size={24} className="text-orange-600 dark:text-orange-400" />,
                title: "No-Code Interface",
                description: "Create and manage agents through an intuitive interface without coding.",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ 
                  y: -10, 
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                  backgroundColor: "var(--hover-bg, rgba(249, 250, 251, 1))",
                  borderColor: "var(--hover-border, rgba(229, 231, 235, 1))"
                }}
                className="bg-gray-50 dark:bg-gray-800 p-8 rounded-xl border border-gray-100 dark:border-gray-700 transition-all duration-300 transform hover:scale-105"
                style={{
                  "--hover-bg": "rgba(249, 250, 251, 1)",
                  "--hover-border": "rgba(229, 231, 235, 1)"
                } as React.CSSProperties}
                
                onMouseEnter={() => setIsHovering(index)}
                onMouseLeave={() => setIsHovering(null)}
              >
                <motion.div 
                  className="w-12 h-12 bg-white dark:bg-gray-700 rounded-lg flex items-center justify-center mb-6 shadow-sm"
                  whileHover={{ rotate: 5, scale: 1.1 }}
                  animate={isHovering === index ? { 
                    y: [0, -5, 0],
                    rotate: [0, 5, 0]
                  } : {}}
                  transition={{ duration: 0.5 }}
                >
                  <motion.div
                    animate={isHovering === index ? { scale: [1, 1.2, 1] } : {}}
                    transition={{ duration: 0.5 }}
                  >
                    {feature.icon}
                  </motion.div>
                </motion.div>
                <motion.h3 
                  className="text-xl font-semibold text-gray-900 dark:text-white mb-3"
                  animate={isHovering === index ? { 
                    color: index % 2 === 0 ? "#3B82F6" : "#8B5CF6"
                  } : {}}
                  transition={{ duration: 0.3 }}
                >
                  {feature.title}
                </motion.h3>
                <motion.p 
                  className="text-gray-600 dark:text-gray-400"
                  animate={isHovering === index ? { opacity: [0.8, 1] } : {}}
                  transition={{ duration: 0.3 }}
                >
                  {feature.description}
                </motion.p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
  
      {/* CTA Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-950">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-gray-900 to-gray-800 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-8 md:p-12 shadow-xl relative overflow-hidden"
            whileHover={{ 
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
              y: -5
            }}
          >
            <motion.div 
              className="absolute inset-0 opacity-10"
              animate={{ 
                backgroundPosition: ["0% 0%", "100% 100%"],
              }}
              transition={{ 
                duration: 15, 
                ease: "linear", 
                repeat: Infinity, 
                repeatType: "reverse" 
              }}
            >
              <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-center" />
            </motion.div>
            <div className="relative z-10">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.7, delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  <h2 className="text-3xl font-bold text-white mb-4">
                    Ready to create your first AI agent?
                  </h2>
                  <p className="text-gray-300 mb-6 md:mb-0 max-w-lg">
                    Start automating your blockchain interactions with
                    intelligent agents that work 24/7.
                  </p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.7, delay: 0.4 }}
                  viewport={{ once: true }}
                >
                  <Link href="/CreateAgent">
                    <motion.button
                                           whileHover={{ 
                                            scale: 1.05, 
                                            boxShadow: "0 10px 25px -5px rgba(255, 255, 255, 0.3)"
                                          }}
                                          whileTap={{ scale: 0.98 }}
                                          transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                          className="px-8 py-4 bg-white text-gray-900 rounded-lg font-medium flex items-center justify-center gap-2 whitespace-nowrap shadow-lg"
                                        >
                                          Create Agent 
                                          <motion.div
                                            animate={{ x: [0, 5, 0] }}
                                            transition={{ duration: 1, repeat: Infinity, repeatDelay: 1 }}
                                          >
                                            <ArrowRight size={18} />
                                          </motion.div>
                                        </motion.button>
                                      </Link>
                                    </motion.div>
                                  </div>
                                </div>
                              </motion.div>
                            </div>
                          </section>
                      
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
                                      color: ["#1F2937", "#3B82F6", "#1F2937"]
                                    }}
                                    transition={{ duration: 5, repeat: Infinity, repeatType: "reverse" }}
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
                    