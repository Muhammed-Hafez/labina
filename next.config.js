/** @type {import('next').NextConfig} */

const { i18n } = require("./next-i18next.config");

const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  i18n,
  rewrites: async () => {
    return [
      {
        source: "/api/:path*",
        destination: "https://hajarafa.triangles-eg.com/api/:path*", // Proxy to Backend
        // destination: "http://localhost:8500/api/:path*", // Proxy to Backend
      },
    ];
  },
};

module.exports = nextConfig;
