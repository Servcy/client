/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ["servcy.com"],
  },
  reactStrictMode: true,
  swcMinify: true,
};

module.exports = nextConfig;
