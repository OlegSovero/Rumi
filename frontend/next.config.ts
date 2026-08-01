import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  async rewrites() {
    return [
      {
        source: "/api/ollama/:path*",
        destination: "http://127.0.0.1:11434/:path*",
      },
    ];
  },
};

export default nextConfig;
