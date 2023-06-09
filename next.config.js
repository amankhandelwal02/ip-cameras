/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
}

module.exports = nextConfig

module.exports = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/api/server",
        destination: "http://localhost:3000/api/server",
      },
    ];
  },
};
