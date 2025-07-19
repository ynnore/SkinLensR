// Fichier: src/app/pay/page.tsx
'use client';

import { useTheme } from '../../context/ThemeContext';

export default function PayPage() {
  const { theme } = useTheme();

  const textColor = theme === 'dark' ? '#E0E0E0' : '#333';
  const mutedTextColor = theme === 'dark' ? '#A0A0A0' : '#666';
  
  return (
    <div style={{
      padding: '2rem 2.5rem',
      color: textColor
    }}>
      <h1 style={{ fontFamily: 'var(--font-special-elite), serif', fontSize: '2.5rem', textTransform: 'uppercase' }}>
        Intendance
      </h1>
      <p style={{ fontFamily: 'var(--font-courier-prime), monospace', fontSize: '1.1rem', color: mutedTextColor, marginTop: '1rem' }}>
        Gestion de votre contribution à l'effort des opérations et accès aux ressources premium.
      </p>

      <div style={{ marginTop: '3rem' }}>
        {/* Ici viendront les options d'abonnement */}
        <p style={{ fontStyle: 'italic', color: mutedTextColor }}>
          Module de gestion des contributions en cours de développement...
        </p>
      </div>
    </div>
  );
}