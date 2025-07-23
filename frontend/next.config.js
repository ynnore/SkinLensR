      
// Fichier: next.config.js

const withPWA = require('next-pwa')({
  dest: 'public',
  register: true, // Enregistre le service worker
  skipWaiting: true, // Force le nouveau service worker à prendre le contrôle immédiatement
  disable: process.env.NODE_ENV === 'development', // Désactive le PWA en mode dev pour faciliter le debug
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  // ... autres configurations de votre Next.js
};

module.exports = withPWA(nextConfig);


    