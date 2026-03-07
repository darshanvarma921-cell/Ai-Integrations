import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/Ai-Integrations",
  distDir: "docs",
  experimental: {
    turbopackUseSystemTlsCerts: true,
  },
};

export default nextConfig;
