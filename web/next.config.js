/** @type {import('next').NextConfig} */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const nextConfig = {
    experimental: {
        appDir: true,
    },
    images: {
        domains: ["servcy.com", "amazonaws.com"],
        remotePatterns: [
            {
                protocol: "https",
                hostname: "avatars.githubusercontent.com",
            },
            {
                protocol: "https",
                hostname: "secure.gravatar.com",
            },
            {
                protocol: "https",
                hostname: "images.unsplash.com",
            },
        ],
    },
    reactStrictMode: false,
    swcMinify: true,
}
