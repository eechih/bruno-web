/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname:
          'bruno-bucket83908e77-1kbjojz6gr7ho.s3.us-east-1.amazonaws.com',
        pathname: '**'
      }
    ]
  }
}

module.exports = nextConfig
