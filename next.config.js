/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { hostname: 'localhost' },
      { hostname: 'picsum.photos' },
      { hostname: 'lh3.googleusercontent.com' },
    ],
  },
}

module.exports = nextConfig
