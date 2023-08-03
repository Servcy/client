/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ["servcy.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "servcy-public.s3.amazonaws.com",
      },
    ],
  },
  reactStrictMode: true,
  swcMinify: true,
};

module.exports = nextConfig;
