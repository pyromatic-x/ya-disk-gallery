import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  output: "standalone",
  experimental: {
    serverActions: {
      bodySizeLimit: "20mb",
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.yandex.ru",
      },
      {
        protocol: "https",
        hostname: "t.me*",
      },
    ],
    localPatterns: [
      {
        pathname: "/proxy/image/**",
        search: "**",
      },
      {
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
