import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: true,
  turbopack: { root: process.cwd() },
  images: { formats: ["image/avif", "image/webp"] },
};

export default nextConfig;
