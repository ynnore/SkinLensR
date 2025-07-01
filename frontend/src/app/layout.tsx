// src/app/layout.tsx
// Pas de 'use client' ici ! C'est un Server Component par défaut.

import { Inter } from 'next/font/google'; // Exemple d'importation de police, si vous en avez une
import './globals.css'; // <<< CORRECTION IMPORTANTE : Chemin relatif car globals.css est dans le même dossier src/app/

// Importe le composant client qui contient toute la logique client
import MainLayoutClient from './MainLayoutClient'; // Chemin relatif si MainLayoutClient.tsx est à côté de layout.tsx

const inter = Inter({ subsets: ['latin'] }); // Décommentez si vous utilisez Inter

export const metadata = {
  title: 'SkinLensR App',
  description: 'Automatisez tout avec SkinLensR',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // La classe 'dark-mode'/'light-mode' sera appliquée par MainLayoutClient sur l'élément html
    <html lang="fr" className={inter.className}> {/* Ajustez 'lang' si nécessaire, décommentez className si inter est utilisé */}
      <body>
        {/*
          MainLayoutClient est le wrapper client qui gérera la sidebar, le thème et la langue.
          Il prendra 'children' qui seront les pages (ex: page.tsx).
        */}
        <MainLayoutClient>
          {children}
        </MainLayoutClient>
      </body>
    </html>
  );
}