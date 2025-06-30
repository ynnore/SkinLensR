// Fichier : src/app/layout.tsx
import './globals.css';
import { LanguageProvider } from '@/contexts/LanguageContext';
import MainLayoutClient from './MainLayoutClient';

export const metadata = {
  title: 'Mon Application',
  description: 'Générée par SkinLensR',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <LanguageProvider>
          <MainLayoutClient>{children}</MainLayoutClient>
        </LanguageProvider>
      </body>
    </html>
  );
}