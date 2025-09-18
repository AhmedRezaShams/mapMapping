import path from "path";

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      html2canvas: path.resolve("./node_modules/html2canvas-pro"),
    };
    return config;
  },
};

export default nextConfig;
