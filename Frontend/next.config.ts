import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  distDir: "dist", // Output build files in the 'dist' folder
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  }
};

export default nextConfig;
