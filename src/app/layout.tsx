"use client";

import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import './globals.css'; // Assurez-vous que ce fichier est à jour avec les variables de thème
import { useState, ReactNode, useEffect } from 'react';
import Sidebar from '@/components/Sidebar'; // Assurez-vous que Sidebar.module.css est à jour
import { FaBars } from 'react-icons/fa';
import styles from './layout.module.css';

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false); // Thème clair par défaut

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  useEffect(() => {
    const htmlElement = document.documentElement;
    if (isDarkMode) {
      htmlElement.classList.add('dark');
    } else {
      htmlElement.classList.remove('dark');
    }

    // Ajoute les classes de variables de police à l'élément HTML
    // Assurez-vous que globals.css définit :root { --font-geist-sans: ...; --font-geist-mono: ...; }
    // et applique font-family: var(--font-geist-sans); sur body ou html.
    htmlElement.classList.add(GeistSans.variable, GeistMono.variable);

    // Nettoyage au démontage (moins critique pour RootLayout mais bonne pratique)
    return () => {
      htmlElement.classList.remove(GeistSans.variable, GeistMono.variable);
      // Ne pas retirer 'dark' ici pour que le choix de l'utilisateur persiste entre les navigations
    };
  }, [isDarkMode]);


  // Classes pour le wrapper du contenu principal
  const mainContentWrapperClass = `${styles.mainContentWrapper} ${
    isSidebarOpen ? styles.mainContentWrapperOpen : styles.mainContentWrapperClosed
  }`;

  return (
    // La classe `dark` sera appliquée ici dynamiquement par useEffect
    // suppressHydrationWarning est utile quand on modifie des classes sur <html>/<body> côté client
    <html lang="fr" suppressHydrationWarning>
      <body className={styles.body}> {/* styles.body doit utiliser les variables de police */}
        <Sidebar isOpen={isSidebarOpen} />

        <div className={mainContentWrapperClass}>
          <header className={styles.appHeader}>
            <button
              onClick={toggleSidebar}
              className={styles.toggleSidebarButton}
              aria-label="Toggle sidebar"
            >
              <FaBars /> {/* La taille de l'icône peut être gérée par CSS si besoin */}
            </button>
            <h1 className={styles.headerTitle}>
              SkinLensr
            </h1>
            <button
              onClick={toggleTheme}
              className={styles.toggleThemeButton}
            >
              {isDarkMode ? 'Passer en Mode Clair' : 'Passer en Mode Sombre'}
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