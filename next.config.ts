import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  output: 'export', // ← Bật static export
  images: {
    unoptimized: true,
    domains: ["image.tmdb.org"] // ← Cần thiết cho S3
  },
};

export default nextConfig;