//next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/sitemap.xml',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'noindex, follow',
          },
        ],
      },
    ]
  },
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


