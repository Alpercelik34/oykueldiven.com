import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Docker imajını küçük tutmak için bağımsız (standalone) çıktı.
  output: "standalone",
};

export default nextConfig;
