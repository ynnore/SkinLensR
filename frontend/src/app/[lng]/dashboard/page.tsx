// Fichier: src/app/dashboard/page.tsx
'use client';

import { useTheme } from '../../context/ThemeContext';

export default function DashboardPage() {
  const { theme } = useTheme();

  const textColor = theme === 'dark' ? '#E0E0E0' : '#333';
  const mutedTextColor = theme === 'dark' ? '#A0A0A0' : '#666';

  return (
    <div style={{
      padding: '2rem 2.5rem',
      color: textColor
    }}>
      <h1 style={{ fontFamily: 'var(--font-special-elite), serif', fontSize: '2.5rem', textTransform: 'uppercase' }}>
        État-Major
      </h1>
      <p style={{ fontFamily: 'var(--font-courier-prime), monospace', fontSize: '1.1rem', color: mutedTextColor, marginTop: '1rem' }}>
        Synthèse des opérations et renseignements importants en temps réel.
      </p>

      <div style={{ marginTop: '3rem' }}>
        {/* Ici viendront les futurs composants : cartes de stats, graphiques, dernières transmissions... */}
        <p style={{ fontStyle: 'italic', color: mutedTextColor }}>
          Zone de contenu pour les widgets du tableau de bord en cours de développement...
        </p>
      </div>
    </div>
  );
}