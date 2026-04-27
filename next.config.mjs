/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  eslint: {
    // Many pre-existing ESLint warnings remain across legacy components.
    // Run `npm run lint` separately during development. Production
    // builds shouldn't be blocked by lint until the cleanup is complete.
    ignoreDuringBuilds: true
  },
  images: {
    domains: ['sherryberries-prod-bucket.s3.us-east-2.amazonaws.com'], // Add 'localhost' for development
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '1337',
        pathname: '/uploads/**'
      }
    ]
  }
};

export default nextConfig;
