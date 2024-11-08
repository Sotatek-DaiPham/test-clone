/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.externals.push("pino-pretty", "lokijs", "encoding");
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "nft-ticket-the-bucket.s3.ap-southeast-1.amazonaws.com",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/en/rain-pump",
        permanent: true,
      },
    ];
  },
  // basePath: "/en/rain-pump",
};

export default nextConfig;
