// src/app/layout.tsx
import { Inter } from 'next/font/google';
import { LanguageProvider } from '../contexts/LanguageContext';
import { ThemeProvider } from '../context/ThemeContext';
import MainLayoutClient from './MainLayoutClient';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'SkinLensR',
  description: 'Votre application de diagnostic SkinLensR',
};

// Ce petit script sera injecté dans le <head> pour éviter le flash de thème.
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
    // La langue est importante ici. La classe 'dark' sera ajoutée par le script.
    <html lang="fr" suppressHydrationWarning>
      <head>
        {/* Le script est placé ici, dans le <head> */}
        <ThemeScript />
      </head>
      <body className={inter.className}>
        <ThemeProvider>
          <LanguageProvider>
            <MainLayoutClient>
              {children}
            </MainLayoutClient>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}