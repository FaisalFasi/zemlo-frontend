import type { NextConfig } from "next";

import { ALLOWED_IMAGE_HOSTS } from "./src/shared/config/image-hosts";

const nextConfig: NextConfig = {
  images: {
    // Only hosts we actually serve product/demo images from.
    // Add your CDN (e.g. res.cloudinary.com) here when image uploads land.
    remotePatterns: ALLOWED_IMAGE_HOSTS.map((hostname) => ({
      protocol: "https" as const,
      hostname,
    })),
  },
};

export default nextConfig;
