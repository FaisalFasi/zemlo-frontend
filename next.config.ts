import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Only hosts we actually serve product/demo images from.
    // Add your CDN (e.g. res.cloudinary.com) here when image uploads land.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "swiperjs.com",
      },
    ],
  },
};

export default nextConfig;
