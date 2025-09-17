import path from "path"
import { createRequire } from "module"

const require = createRequire(import.meta.url)

/** @type {import('next').NextConfig} */
const nextConfig = {
    // Optional: gives you a readable build ID you can reuse in markup/assets.
    generateBuildId: () =>
      process.env.VERCEL_GIT_COMMIT_SHA ?? Date.now().toString(),

  async headers() {
    return [
      {
        // All application routes (HTML/SSR). Exclude static asset folders.
        source: '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=0, must-revalidate' },
        ],
      },
      {
        // Next chunk/js/css assets (already hashed).
        source: '/_next/static/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        // Optimized image loader responses.
        source: '/_next/image',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=86400, must-revalidate' },
        ],
      },
      {
        // Fonts or other imported assets emitted by webpack into /_next/static/media.
        source: '/_next/static/media/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        // If you serve anything from /public (logos, etc.), version them.
        source: '/public/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ];
  },
};

export default nextConfig;
