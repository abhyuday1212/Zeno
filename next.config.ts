/** @type {import('next').NextConfig} */
// const nextConfig = {
//   reactStrictMode: false,
//   output: 'export',
//   eslint: {
//     ignoreDuringBuilds: true,
//   },
//   images: { unoptimized: true },
// };

// export default nextConfig;

// const nextConfig = {
//   reactStrictMode: false,
//   images: {
//     domains: ["images.pexels.com"]
//   }
// };

// export default nextConfig;

// const nextConfig = {
//   reactStrictMode: false,
//   experimental: {
//     reactCompiler: true,
//   },
// };

// module.exports = nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
