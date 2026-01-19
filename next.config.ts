//next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.cloudinary.com', // إذا كنت تستخدم Cloudinary
      },
    ],
    formats: ['image/avif', 'image/webp'], // تحسين الصور
  },

  compress: true, 
};


export default nextConfig;
