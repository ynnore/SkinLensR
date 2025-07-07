// next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Vos autres configurations pourraient aller ici à l'avenir
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack'],
    });

    return config;
  },
};

module.exports = nextConfig;
