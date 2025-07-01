// Fichier : next.config.js (Version Finale et Corrigée)

/** @type {import('next').NextConfig} */
const nextConfig = {
  // 1. Pour optimiser les déploiements Docker pour Cloud Run
  output: 'standalone',

  // 2. Pour permettre l'importation de SVGs comme des composants React
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