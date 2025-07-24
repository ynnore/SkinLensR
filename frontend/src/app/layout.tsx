// Fichier: src/app/layout.tsx

import { Inter } from 'next/font/google';
import { MainLayoutClient } from './MainLayoutClient'; // Importation nommée
import './globals.css';

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Operation W",
  description: "Votre application de diagnostic",
};

// ✅ CORRECTION : Le composant ThemeScript doit bien RETOURNER une balise JSX
const ThemeScript = () => {
  const script = `
    (function() {
      try {
        var theme = localStorage.getItem('theme');
        if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      } catch (e) {}
    })();
  `;
  return <script dangerouslySetInnerHTML={{ __html: script }} />; // ✅ Le 'return' est crucial ici
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <ThemeScript />
      </head>
      <body>
        {/* MainLayoutClient est le SEUL enfant direct du body. Il contiendra les Providers. */}
        <MainLayoutClient>
          {children}
        </MainLayoutClient>
      </body>
    </html>
  );
}