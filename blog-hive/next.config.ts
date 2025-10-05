import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Run in server mode (not static export) to support dynamic routes
  experimental: {
    // Disable Lightning CSS to avoid native binary requirement on Alpine/arm64
    optimizeCss: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
