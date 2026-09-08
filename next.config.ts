import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["*.sandbox.revolte.io"],
  output: "standalone",
};

export default nextConfig;
