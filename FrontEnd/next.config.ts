import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    // Catch bugs early without causing extra API calls in production
    reactStrictMode: false,  // keep false to avoid double-mount API calls in dev

    experimental: {
        optimizePackageImports: ["lucide-react", "framer-motion", "recharts"],
    },

    // Skip build-time type errors (CI validates separately)
    typescript: {
        ignoreBuildErrors: true,
    },

    // Compress HTTP responses
    compress: true,
    poweredByHeader: false,

    // Whitelist S3 and GitHub avatar domains for next/image
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "bharat-ai-profile-pictures.s3.ap-south-1.amazonaws.com",
            },
            {
                protocol: "https",
                hostname: "avatars.githubusercontent.com",
            },
            {
                protocol: "https",
                hostname: "github.com",
            },
        ],
        formats: ["image/avif", "image/webp"],
        minimumCacheTTL: 60,
    },
};

export default nextConfig;
