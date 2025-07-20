import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "platform-lookaside.fbsbx.com",
        pathname: "/platform/profilepic/**",
      },
      {
        protocol: "https",
        hostname: "scontent-hkg1-2.xx.fbcdn.net",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "scontent-hkg1-1.xx.fbcdn.net",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "*.net",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "scontent-hkg4-1.xx.fbcdn.net",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "*.facebook.com",
        pathname: "**",
      },
    ],
  },
};

export default nextConfig;
