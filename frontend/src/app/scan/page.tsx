// Fichier: src/app/scan/page.tsx
'use client';

import { useTheme } from '../../context/ThemeContext';

export default function ScanPage() {
  const { theme } = useTheme();

  const textColor = theme === 'dark' ? '#E0E0E0' : '#333';
  const mutedTextColor = theme === 'dark' ? '#A0A0A0' : '#666';

  return (
    <div style={{
      padding: '2rem 2.5rem',
      color: textColor
    }}>
      <h1 style={{ fontFamily: 'var(--font-special-elite), serif', fontSize: '2.5rem', textTransform: 'uppercase' }}>
        Centre d'Écoute
      </h1>
      <p style={{ fontFamily: 'var(--font-courier-prime), monospace', fontSize: '1.1rem', color: mutedTextColor, marginTop: '1rem' }}>
        Lancement des balayages de transmissions et analyse des signaux interceptés.
      </p>
      
      <div style={{ marginTop: '3rem' }}>
        {/* C'est ici que l'interface de chat / scan principale sera intégrée */}
        <p style={{ fontStyle: 'italic', color: mutedTextColor }}>
          Interface principale d'interaction avec les agents IA en cours de développement...
        </p>
      </div>
    </div>
  );
}