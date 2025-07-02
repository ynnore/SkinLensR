// src/app/layout.tsx
import { Inter } from 'next/font/google'; // Si vous utilisez Inter, sinon retirez cette ligne
import { LanguageProvider } from '../contexts/LanguageContext';
import { ThemeProvider } from '../context/ThemeContext'; // Assurez-vous que le chemin est correct
import MainLayoutClient from './MainLayoutClient'; // Ce composant est probablement déjà un "Client Component"
import './globals.css';

const inter = Inter({ subsets: ['latin'] }); // Si vous utilisez Inter, sinon retirez cette ligne

export const metadata = {
  title: 'SkinLensR',
  description: 'Votre application de diagnostic SkinLensR',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // L'élément <html> ne doit pas avoir directement les classes 'light' ou 'dark' ici.
    // C'est le ThemeProvider (qui est un Client Component) qui va gérer cela
    // en manipulant le document.documentElement.className une fois le client hydraté.
    <html lang="fr">
      {/* Applique la classe de la police sur le body si nécessaire */}
      <body className={inter.className}>
        {/*
          Le ThemeProvider doit envelopper tout ce qui a besoin d'accéder au contexte du thème.
          Il doit aussi être dans une "boundary" de client component car il utilise 'useState' et 'useEffect'.
          Votre MainLayoutClient est l'endroit logique pour cette boundary si c'est un Client Component.
        */}
        <ThemeProvider>
          {/*
            Ensuite, vous pouvez nicher vos autres providers comme LanguageProvider.
            L'ordre des providers peut parfois importer, mais pour le thème et la langue,
            généralement il n'y a pas de problème majeur.
          */}
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