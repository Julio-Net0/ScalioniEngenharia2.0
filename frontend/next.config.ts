import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
    output: 'standalone',
    images: {
        remotePatterns: [
            { protocol: 'http', hostname: 'localhost' },
            { protocol: 'http', hostname: 'backend' },
            { protocol: 'https', hostname: '**' },
        ],
    },
    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: `${process.env.INTERNAL_API_URL ?? 'http://backend:8000'}/api/:path*`,
            },
            {
                source: '/uploads/:path*',
                destination: `${process.env.INTERNAL_API_URL ?? 'http://backend:8000'}/uploads/:path*`,
            },
        ]
    },
}

export default nextConfig
