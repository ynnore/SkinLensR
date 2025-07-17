// src/app/layout.tsx
import { Inter } from 'next/font/google';
import { LanguageProvider } from '../contexts/LanguageContext';
import { ThemeProvider } from '../context/ThemeContext';
import MainLayoutClient from './MainLayoutClient'; // Importé ici
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Operation W',
  description: 'Votre application de diagnostic ',
};

// Ce script est crucial pour éviter le FOUC (Flash Of Unstyled Content) lors du changement de thème
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
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        {/* LA BALISE META VIEWPORT CORRECTEMENT PLACÉE ICI */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        {/* Le script pour gérer le thème avant le rendu du corps */}
        <ThemeScript />
      </head>
      <body className={inter.className}>
        <ThemeProvider>
          <LanguageProvider>
            {/* MainLayoutClient est le composant parent qui gérera le layout avec la sidebar */}
            <MainLayoutClient>
              {children}
            </MainLayoutClient>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}