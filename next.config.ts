import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  ignoreDuringBuilds: true,
  typescript: {
    ignoreBuildErrors: true,
  }
};

export default nextConfig;
