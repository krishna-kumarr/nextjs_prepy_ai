// next.config.mjs

import bundleAnalyzer from '@next/bundle-analyzer'
import path from 'path'
import { fileURLToPath } from 'url'

// Fix __dirname in ESM
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Setup analyzer plugin
const withBundleAnalyzer = bundleAnalyzer({
    enabled: process.env.ANALYZE === 'true',
})

// Security headers
const securityHeaders = [
    { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
    { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
    { key: 'X-Content-Type-Options', value: 'nosniff' },
    { key: 'X-Permitted-Cross-Domain-Policies', value: 'none' },
    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
    { key: 'Cache-Control', value: 'no-cache, no-store' },
    { key: 'Expires', value: '0' },
    { key: 'Pragma', value: 'no-cache' },
]

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    sassOptions: {
        includePaths: [path.join(__dirname, 'styles')],
    },
    // env: {
    // ENV: process.env.ENV,
    // APP_NAME: process.env.APP_NAME,
    // EMAIL_FROM: process.env.EMAIL_FROM,
    // SUPPORT_EMAIL: process.env.SUPPORT_EMAIL,
    // },
    poweredByHeader: false,
    async headers() {
        return [
            {
                source: '/(.*)',
                headers: securityHeaders,
            },
        ]
    },
}

export default withBundleAnalyzer(nextConfig)
