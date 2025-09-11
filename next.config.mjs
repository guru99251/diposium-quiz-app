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
  async headers() {
    return [
      // Set UTF-8 and language headers for all app routes
      {
        source: "/(.*)",
        headers: [
          { key: "Content-Language", value: "ko" },
        ],
      },
      {
        source: "/:all*(svg|jpg|jpeg|png|gif|webp|ico|css|js|woff|woff2)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ]
  },
}

export default nextConfig
