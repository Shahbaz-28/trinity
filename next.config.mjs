/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    serverActions: {
      // Default is 1MB; documents (engagement uploads) need more headroom.
      bodySizeLimit: '11mb',
    },
  },
}

export default nextConfig
