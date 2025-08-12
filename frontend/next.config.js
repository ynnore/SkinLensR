// Fichier: next.config.js

const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', // Active le mode standalone

  // Autoriser ton IP locale en dev pour les ressources _next/*
  allowedDevOrigins: [
    'http://192.168.1.20:3000',
  ],

  // Tu peux ajouter d'autres options ici si besoin
};

module.exports = withPWA(nextConfig);

