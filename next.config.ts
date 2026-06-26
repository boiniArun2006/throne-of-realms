import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Use static export for Capacitor Android APK
  // When building for web, this generates static HTML files
  output: "export",
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  // Disable image optimization for static export (doesn't work with export mode)
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
