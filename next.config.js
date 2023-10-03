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
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "*.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "secure.gravatar.com",
      },
    ],
  },
  reactStrictMode: false,
  swcMinify: true,
};
