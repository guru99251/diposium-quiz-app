/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Use Next's default webpack config for stability with v15
  async headers() {
    const isDev = process.env.NODE_ENV !== "production"
    return [
      // In development, never cache Next.js build outputs (chunks, dev assets)
      ...(isDev
        ? [
            {
              source: "/_next/static/:path*",
              headers: [{ key: "Cache-Control", value: "no-store" }],
            },
          ]
        : []),
      // Long-cache only static assets (images/fonts). Exclude JS/CSS to avoid stale bundles.
      {
        source: "/:all*(svg|jpg|jpeg|png|gif|webp|ico|woff|woff2)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ]
  },
}

export default nextConfig
