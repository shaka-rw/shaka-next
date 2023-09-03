/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: { ignoreBuildErrors: true },
  experimental: {
    serverActions: true,
  },
  reactStrictMode: false,
  images: {
    domains: ['lh3.googleusercontent.com', 'res.cloudinary.com'],
  },
};

module.exports = nextConfig;
