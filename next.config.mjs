/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
  },
  // Vercel-এর cacheComponents বন্ধ করা
  experimental: {
    cacheComponents: false,
  },
};

export default nextConfig;
