/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["img-s-msn-com.akamaized.net", "haitrieu.com", "picsum.photos"],
    unoptimized: process.env.NODE_ENV === 'development',
  },
};

module.exports = nextConfig;
