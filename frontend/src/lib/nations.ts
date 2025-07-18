// Fichier: src/lib/nations.ts

// Définition du type pour chaque nation
export interface Nation {
  id: string; // ex: 'ca', 'de', 'fr' (utilisé pour les clés, les URLs, etc.)
  name: string; // Le nom complet affiché à l'utilisateur
  group: 'Commonwealth' | 'Europe' | 'Afrique' | 'Asie' | 'Amériques' | 'Puissances Centrales';
}

// La liste complète de toutes les nations impliquées dans le projet
export const allNations: Nation[] = [
  // COMMONWEALTH
  { id: 'gb', name: 'Royaume-Uni', group: 'Commonwealth' },
  { id: 'ca', name: 'Canada', group: 'Commonwealth' },
  { id: 'au', name: 'Australie', group: 'Commonwealth' },
  { id: 'nz', name: 'Nouvelle-Zélande', group: 'Commonwealth' },
  { id: 'za', name: 'Afrique du Sud', group: 'Commonwealth' },
  
  // EUROPE
  { id: 'fr', name: 'France', group: 'Europe' },
  { id: 'be', name: 'Belgique', group: 'Europe' },
  { id: 'pt', name: 'Portugal', group: 'Europe' },
  { id: 'es', name: 'Espagne', group: 'Europe' },
  
  // AMÉRIQUES
  { id: 'us', name: 'États-Unis', group: 'Amériques' },
  
  // AFRIQUE (Historiquement rattachés à d'autres nations, mais listés pour leur participation)
  { id: 'dz', name: 'Algérie', group: 'Afrique' },
  { id: 'ma', name: 'Maroc', group: 'Afrique' },
  { id: 'sn', name: 'Sénégal', group: 'Afrique' },
  
  // ASIE
  { id: 'cn', name: 'Chine', group: 'Asie' },

  // PUISSANCES CENTRALES (Pour la vision de réconciliation et de mémoire complète)
  { id: 'de', name: 'Allemagne', group: 'Puissances Centrales' },
];