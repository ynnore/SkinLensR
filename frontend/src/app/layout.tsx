// src/app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';
import MainLayoutClient from '@/components/MainLayoutClient'; // On importe toujours notre layout client

export const metadata: Metadata = {
  title: 'SkinLensR',
  description: "Analyse d'images pour la dermatologie",
};

// C'est un Composant Serveur. Il ne fait que définir la structure de base.
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // La balise <html> avec la langue par défaut et suppressHydrationWarning
    <html lang="fr" suppressHydrationWarning>
      <body>
        {/* On retire le <I18nProvider> qui n'est plus nécessaire */}
        <MainLayoutClient>
          {children}
        </MainLayoutClient>
      </body>
    </html>
  );
}