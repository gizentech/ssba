/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  reactStrictMode: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'ssba.e3.valueserver.jp',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'ssba.e3.valueserver.jp',
        pathname: '/**',
      },
    ],
  },
};

module.exports = nextConfig;
