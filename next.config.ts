import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false, // Leaflet haritasının mobilde çift render yüzünden çökmesini engeller
  outputFileTracingRoot: path.join(__dirname),
  webpack: (config) => {
    config.resolve.fallback = { fs: false };
    return config;
  },
};

export default nextConfig;