import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{protocol: 'https', hostname: "media.giphy.com", pathname: "/media/**"}]
  }
  /* config options here */
};

export default nextConfig;
