import path from "path"
import { createRequire } from "module"

const require = createRequire(import.meta.url)

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
  webpack(config) {
    const threeEntryPath = require.resolve("three")
    const threeDir = path.dirname(threeEntryPath)
    const threeModulePath = path.join(threeDir, "three.module.js")

    config.resolve = config.resolve || {}
    config.resolve.alias = config.resolve.alias || {}

    if (!config.resolve.alias["three$"]) {
      config.resolve.alias["three$"] = threeModulePath
    }

    return config
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

