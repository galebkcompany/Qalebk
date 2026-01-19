//next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['qalebk.com'], // النطاقات المسموحة للصور
    formats: ['image/avif', 'image/webp'], // تحسين الصور
  },

  compress: true, 
};


export default nextConfig;
