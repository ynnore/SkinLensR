// src/app/layout.tsx
"use client";

import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import './globals.css'; // Contient probablement les définitions de :root ou des reset/normalize
import { useState, ReactNode, useEffect } from 'react';
import Sidebar from '@/components/Sidebar'; // Ce composant utilisera Sidebar.module.css
import { FaBars } from 'react-icons/fa';
import styles from './layout.module.css'; // Importez les styles du layout

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  // Pour gérer le dark mode (exemple simple, vous pourriez utiliser un contexte/zustand)
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Effet pour appliquer la classe 'dark' sur <html> et la police
  useEffect(() => {
    const htmlElement = document.documentElement;
    if (isDarkMode) {
      htmlElement.classList.add('dark');
    } else {
      htmlElement.classList.remove('dark');
    }
    // Appliquer les classes de police directement ici ou via globals.css
    // Si GeistSans.className et GeistMono.className sont juste des noms de police,
    // vous pouvez les assigner via CSS variables comme montré dans layout.module.css
    // Si ce sont des classes qui injectent des <style>, c'est bon.
    htmlElement.classList.add(GeistSans.variable, GeistMono.variable);
    // Ajoutez le style pour les variables de police dans globals.css
    // :root { --font-geist-sans: ...; --font-geist-mono: ...;}
    // html { font-family: var(--font-geist-sans); }

    // Si vous préférez appliquer les classes directement :
    // htmlElement.classList.add(GeistSans.className, GeistMono.className);

    // Nettoyage si nécessaire
    return () => {
      htmlElement.classList.remove('dark', GeistSans.variable, GeistMono.variable);
      // htmlElement.classList.remove('dark', GeistSans.className, GeistMono.className);
    };
  }, [isDarkMode]);


  // Déterminer la classe pour le wrapper du contenu principal
  // La logique des media queries est maintenant dans le CSS
  let mainContentWrapperClass = styles.mainContentWrapper;
  if (isSidebarOpen) {
    // Sur petits écrans, .mainContentWrapper a déjà le bon margin-left
    // Sur grands écrans, .mainContentWrapperOpen (ou une logique @media dans .mainContentWrapper) s'appliquera
    mainContentWrapperClass = `${styles.mainContentWrapper} ${styles.mainContentWrapperOpen}`;
  } else {
    mainContentWrapperClass = `${styles.mainContentWrapper} ${styles.mainContentWrapperClosed}`;
  }


  return (
    // Les classes GeistSans et GeistMono sont souvent pour des variables CSS de police,
    // assurez-vous qu'elles sont utilisées correctement avec votre globals.css
    // ou appliquez directement les font-family dans .body du module.
    // J'ai changé className en variable pour suivre une convention courante avec geist/font.
    // Vous devrez peut-être ajuster `globals.css` pour utiliser `--font-geist-sans` etc.
    <html lang="fr" suppressHydrationWarning>
      {/* La classe .body est appliquée ici depuis le module CSS */}
      <body className={styles.body}>
        <Sidebar isOpen={isSidebarOpen} />

        <div className={mainContentWrapperClass}>
          <header className={styles.appHeader}>
            <button
              onClick={toggleSidebar}
              className={styles.toggleButton}
              aria-label="Toggle sidebar"
            >
              <FaBars size={20} />
            </button>
            <h1 className={styles.headerTitle}>
              SkinLensr
            </h1>
            {/* Bouton de test pour le dark mode */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              style={{ marginLeft: 'auto', padding: '0.5rem', border:'1px solid' }}
            >
              Toggle Dark Mode
            </button>
          </header>

          <main className={styles.mainArea}>
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}