"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
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
  ChevronRight,
} from "lucide-react";
import NavBar from "./components/NavBar";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Hero Section */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-10 dark:opacity-20">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600" />
          <div className="absolute w-full h-full bg-[url('/grid-pattern.svg')] bg-center" />
        </div>

        <div className="relative z-10">
          {/* Replace the old header with NavBar */}
          <NavBar />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-24 md:pt-12 md:pb-32">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
                  Create AI Agents for{" "}
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                    Web3 Automation
                  </span>
                </h1>
                <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-lg">
                  Deploy intelligent agents that can monitor, analyze, and
                  interact with blockchain networks automatically.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/CreateAgent">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-8 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg font-medium flex items-center justify-center gap-2 w-full sm:w-auto"
                    >
                      Create Agent <ArrowRight size={18} />
                    </motion.button>
                  </Link>
                  <Link
                    href="https://github.com/juSt-jeLLy/ETH-Taipei"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-8 py-4 border border-gray-300 dark:border-gray-700 rounded-lg font-medium text-gray-700 dark:text-gray-300 flex items-center justify-center gap-2 w-full sm:w-auto"
                    >
                      Learn More <Github size={18} className="ml-1" />
                    </motion.button>
                  </Link>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="relative"
              >
                <div className="relative z-10 bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-gray-700">
                  <div className="absolute -top-6 -right-6 bg-blue-500 rounded-full w-20 h-20 flex items-center justify-center">
                    <Bot size={32} className="text-white" />
                  </div>
                  <div className="space-y-6">
                    {/* Replace empty div with agent dashboard visualization */}
                    <div className="h-40 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden relative">
                      {/* Network visualization */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-24 h-24 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
                          <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-800/50 flex items-center justify-center">
                            <Cpu size={24} className="text-blue-500 dark:text-blue-400" />
                          </div>
                        </div>
                        
                        {/* Connection lines */}
                        {[45, 90, 135, 180, 225, 270, 315, 360].map((angle, i) => (
                          <div 
                            key={i}
                            className="absolute w-20 h-1 bg-gray-200 dark:bg-gray-600 origin-left"
                            style={{ 
                              transform: `rotate(${angle}deg)`, 
                              left: '50%', 
                              top: '50%',
                              opacity: i % 2 === 0 ? 0.8 : 0.4
                            }}
                          />
                        ))}
                        
                        {/* Blockchain nodes */}
                        {[45, 90, 135, 180, 225, 270, 315, 360].map((angle, i) => (
                          <div 
                            key={i}
                            className="absolute w-6 h-6 rounded-full flex items-center justify-center"
                            style={{ 
                              transform: `rotate(${angle}deg) translateX(72px)`, 
                              left: '50%', 
                              top: '50%',
                              background: i % 3 === 0 ? 'rgba(59, 130, 246, 0.2)' : 
                                        i % 3 === 1 ? 'rgba(139, 92, 246, 0.2)' : 'rgba(16, 185, 129, 0.2)'
                            }}
                          >
                            {i % 4 === 0 ? <Zap size={12} className="text-blue-500" /> : 
                            i % 4 === 1 ? <Globe size={12} className="text-purple-500" /> :
                            i % 4 === 2 ? <Code size={12} className="text-green-500" /> :
                                          <Shield size={12} className="text-red-500" />}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Agent status indicators */}
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded-full w-3/4 relative overflow-hidden">
                        <div className="absolute left-0 top-0 h-full w-2/3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                      </div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded-full w-1/2 relative overflow-hidden">
                        <div className="absolute left-0 top-0 h-full w-4/5 bg-gradient-to-r from-green-500 to-blue-500 rounded-full"></div>
                      </div>
                    </div>
                    
                    {/* Agent controls */}
                    <div className="flex justify-between items-center">
                      <div className="flex space-x-2">
                        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                          <Zap size={14} className="text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                          <Globe size={14} className="text-purple-600 dark:text-purple-400" />
                        </div>
                        <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                          <Code size={14} className="text-green-600 dark:text-green-400" />
                        </div>
                      </div>
                      <div className="h-8 w-20 bg-gray-200 dark:bg-gray-600 rounded-md relative overflow-hidden flex items-center justify-center">
                        <span className="text-xs font-medium text-gray-600 dark:text-gray-300">ACTIVE</span>
                        <div className="absolute right-1 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gray-100 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 rotate-6 shadow-lg flex items-center justify-center p-4">
                  <div className="w-full h-full bg-white dark:bg-gray-700 rounded-lg flex flex-col items-center justify-center p-2">
                    <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center mb-2">
                      <Bot size={16} className="text-purple-600 dark:text-purple-400" />
                    </div>
                    <div className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-full mb-1"></div>
                    <div className="w-3/4 h-2 bg-gray-200 dark:bg-gray-600 rounded-full"></div>
                  </div>
                </div>
                
                <div className="absolute top-1/4 -right-8 w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 -rotate-6 shadow-lg flex items-center justify-center p-3">
                  <div className="w-full h-full rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <div className="text-white font-bold text-xl">ETH</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Powerful Features for Web3 Automation
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Create intelligent agents that monitor and interact with
              blockchain networks automatically.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: (
                  <Zap size={24} className="text-blue-600 dark:text-blue-400" />
                ),
                title: "Real-time Monitoring",
                description:
                  "Monitor blockchain events, transactions, and smart contract activities in real-time.",
              },
              {
                icon: (
                  <Globe
                    size={24}
                    className="text-purple-600 dark:text-purple-400"
                  />
                ),
                title: "Multi-chain Support",
                description:
                  "Deploy agents across multiple blockchains including Ethereum, Polygon, Arbitrum and more.",
              },
              {
                icon: (
                  <Code
                    size={24}
                    className="text-green-600 dark:text-green-400"
                  />
                ),
                title: "Custom Logic",
                description:
                  "Define custom conditions and actions for your agents to execute automatically.",
              },
              {
                icon: (
                  <Shield
                    size={24}
                    className="text-red-600 dark:text-red-400"
                  />
                ),
                title: "Secure Execution",
                description:
                  "All agent operations are executed securely with robust error handling.",
              },
              {
                icon: (
                  <Bot
                    size={24}
                    className="text-indigo-600 dark:text-indigo-400"
                  />
                ),
                title: "AI-Powered Analysis",
                description:
                  "Leverage AI to analyze on-chain data and make intelligent decisions.",
              },
              {
                icon: (
                  <Cpu
                    size={24}
                    className="text-orange-600 dark:text-orange-400"
                  />
                ),
                title: "No-Code Interface",
                description:
                  "Create and manage agents through an intuitive interface without coding.",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-50 dark:bg-gray-800 p-8 rounded-xl border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 bg-white dark:bg-gray-700 rounded-lg flex items-center justify-center mb-6 shadow-sm">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </motion.div>
            ))}
            </div>
          </div>
        </section>
  
        {/* CTA Section */}
        <section className="py-20 bg-gray-50 dark:bg-gray-950">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="bg-gradient-to-r from-gray-900 to-gray-800 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-8 md:p-12 shadow-xl relative overflow-hidden"
            >
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-center" />
              </div>
              <div className="relative z-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                  <div>
                    <h2 className="text-3xl font-bold text-white mb-4">
                      Ready to create your first AI agent?
                    </h2>
                    <p className="text-gray-300 mb-6 md:mb-0 max-w-lg">
                      Start automating your blockchain interactions with
                      intelligent agents that work 24/7.
                    </p>
                  </div>
                  <Link href="/CreateAgent">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-8 py-4 bg-white text-gray-900 rounded-lg font-medium flex items-center justify-center gap-2 whitespace-nowrap"
                    >
                      Create Agent <ArrowRight size={18} />
                    </motion.button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
  
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
  