// Fichier: src/app/files/page.tsx
'use client';

import { useTheme } from '../../context/ThemeContext';

export default function FilesPage() {
  const { theme } = useTheme();

  const textColor = theme === 'dark' ? '#E0E0E0' : '#333';
  const mutedTextColor = theme === 'dark' ? '#A0A0A0' : '#666';

  return (
    <div style={{
      padding: '2rem 2.5rem',
      color: textColor
    }}>
      <h1 style={{ fontFamily: 'var(--font-special-elite), serif', fontSize: '2.5rem', textTransform: 'uppercase' }}>
        Archives
      </h1>
      <p style={{ fontFamily: 'var(--font-courier-prime), monospace', fontSize: '1.1rem', color: mutedTextColor, marginTop: '1rem' }}>
        Consultation des dossiers, rapports de mission et documents classifiés.
      </p>

      <div style={{ marginTop: '3rem' }}>
        {/* Ici viendra le futur gestionnaire de fichiers */}
        <p style={{ fontStyle: 'italic', color: mutedTextColor }}>
          Système de gestion des archives en cours de développement...
        </p>
      </div>
    </div>
  );
}