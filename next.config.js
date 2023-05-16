/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  // reactStrictMode: true,
  // images: {
  //   unoptimized: true,
  // },
  images: {
    loader: 'custom',
    loaderFile: './src/app/image.ts',
    domains: ['s3.us-east-1.amazonaws.com'],
  },
}

module.exports = nextConfig
