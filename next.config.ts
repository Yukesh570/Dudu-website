import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        // protocol: "https",
        // hostname: "dudu-backend.vercel.app",

          protocol: "http",          // your backend is http
        hostname: "192.168.1.151", // remove the port
        port: "3000",              // specify port separately
        pathname: "/**",      
      },
        {
        protocol: "https",
        hostname: "backend.dudusoftware.com",
        port: "", 
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
