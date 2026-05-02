import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false, // Leaflet haritasının mobilde çift render yüzünden çökmesini engeller
  outputFileTracingRoot: path.join(__dirname),
  webpack: (config) => {
    config.resolve.fallback = { fs: false };
    config.externals = config.externals || [];
    if (Array.isArray(config.externals)) {
      config.externals.push({ "globe.gl": "globe.gl" });
    }
    return config;
  },
  transpilePackages: ["globe.gl"],
};

export default nextConfig;