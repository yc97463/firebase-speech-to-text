/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    webpack: (config) => {
      config.externals = [...config.externals, { canvas: 'canvas' }];  // required for firebase
      return config;
    },
  }

export default nextConfig;
