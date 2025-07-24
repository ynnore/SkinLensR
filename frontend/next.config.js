// Fichier: next.config.js

const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  // ... autres configurations de votre Next.js
  output: 'standalone', // ✅ IMPORTANT : Active le mode standalone
};

module.exports = withPWA(nextConfig);
    