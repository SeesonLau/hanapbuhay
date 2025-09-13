import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Add webpack config to handle Lightning CSS binary
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      // Force binary resolution
      '../lightningcss.linux-x64-gnu.node': '../lightningcss.linux-x64-musl.node'
    };
    return config;
  }
};

export default nextConfig;