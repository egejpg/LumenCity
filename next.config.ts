import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // leaflet ve leaflet.heat SSR'dan muaf tutulur (dynamic import ile halledilir)
  webpack: (config) => {
    config.resolve.fallback = { fs: false };
    return config;
  },
};

export default nextConfig;
