/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: 'utfs.io',
      },
    ],
  },
  output: 'standalone',
};

export default nextConfig;
