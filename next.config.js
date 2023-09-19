/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { hostname: 'localhost' },
      { hostname: 'picsum.photos' },
      { hostname: 'lh3.googleusercontent.com' },
    ],
  },
  output: 'standalone',
}

module.exports = nextConfig
