import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  allowedDevOrigins: ['192.168.1.132', '192.168.1.251:3000', '191.168.1.251:5000'],

  // Allows importing TypeScript directly from @repo/shared without rebuilding.

  transpilePackages: ["@repo/shared"],
};

export default nextConfig;
