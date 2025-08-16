// Fichier : frontend/src/global.d.ts

// On déclare une interface globale qui étend l'interface Window existante
declare global {
  interface Window {
    // On dit à TypeScript que window peut avoir une propriété 'ethereum'
    // Le '?' la rend optionnelle (car elle n'existe que si MetaMask est installé)
    // 'any' est le type le plus simple ici, il dit à TypeScript de ne pas se soucier de la structure interne de l'objet ethereum.
    ethereum?: any;
  }
}

// On ajoute une ligne 'export {}' pour s'assurer que TypeScript traite ce fichier comme un module.
export {};