import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    ignoreDuringBuilds: true,
  },

  async headers() {
    return [
      {
        // 为所有路由应用这些头
        source: "/:path*",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "http://localhost:3000", // Restrict to localhost for development; update for production
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, POST, PUT, DELETE, OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "Content-Type, Authorization",
          },
          {
            key: "Access-Control-Max-Age",
            value: "86400",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN", // Allow only same-origin iframes
          },
          {
            key: "Content-Security-Policy",
            value: "frame-ancestors 'self'", // Allow only same-origin iframes
          },
        ],
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        hostname: "images.pexels.com",
      },
      {
        hostname: "images.unsplash.com",
      },
      {
        hostname: "chat2db-cdn.oss-us-west-1.aliyuncs.com",
      },
      {
        hostname: "cdn.chat2db-ai.com",
      }
    ],
  },
};

export default nextConfig;
