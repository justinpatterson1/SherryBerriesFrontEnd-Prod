/** @type {import('next').NextConfig} */
const nextConfig = {
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
