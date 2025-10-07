import type { NextConfig } from "next";

/**
 * Next.js configuration
 * - Remove "output: export" because the app uses App Router server routes (/api/*).
 *   Static export would strip server functions and break runtime APIs.
 * - No hard-coded port here; Next CLI respects PORT env.
 */
const nextConfig: NextConfig = {
  // Keep default output to enable server routes and dynamic rendering
  reactStrictMode: true,
  // Enable typed routes if desired in future; leaving minimal for stability
};

export default nextConfig;
