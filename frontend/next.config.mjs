/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsHmrCache: false, // default to true
  },
  images : {
    remotePatterns: [
      {
        protocol:"https",
        hostname: "www.themealdb.com"
      },
      {
        protocol:"https",
        hostname: "images.unsplash.com"
      },
      {
        protocol:"https",
        hostname: "localhost"
      },
    ]
  }
};

export default nextConfig;
