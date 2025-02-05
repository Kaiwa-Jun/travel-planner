/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  swcMinify: true,
  compiler: {
    styledComponents: true,
  },
};

module.exports = nextConfig;
