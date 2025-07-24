// Fichier: src/app/MainLayoutClient.tsx

'use client'; // ✅ LA LIGNE LA PLUS IMPORTANTE (rend ce composant Client Component)

import React, { useState } from 'react';
import styles from './MainLayoutClient.module.css';
import Sidebar from '@/components/Sidebar';
import { FaBars } from 'react-icons/fa';

// ✅ IMPORTS CRITIQUES : Vos Providers doivent être importés ici
import { LanguageProvider } from '@/contexts/LanguageContext'; // Assurez-vous du bon chemin
import { ThemeProvider } from '@/contexts/ThemeContext';     // Assurez-vous du bon chemin

interface MainLayoutClientProps {
  children: React.ReactNode;
}

// ✅ Exportation nommée (comme nous l'avons corrigé précédemment)
export function MainLayoutClient({ children }: MainLayoutClientProps) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(prev => !prev);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    // ✅ LES PROVIDERS ENVELOPPENT TOUT LE CONTENU DE L'APPLICATION CLIENT
    <ThemeProvider>
      <LanguageProvider>
        <div className={styles.mainLayoutContainer}>
          {/* Sidebar est à l'intérieur des providers */}
          <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

          {isSidebarOpen && (
            <div
              className={`${styles.mobileOverlay} ${isSidebarOpen ? styles.mobileOverlayActive : ''}`}
              onClick={closeSidebar}
            />
          )}

          <button className={styles.mobileBurgerButton} onClick={toggleSidebar}>
            <FaBars />
          </button>

          {/* Le contenu principal de la page est aussi à l'intérieur des providers */}
          <main className={`${styles.mainContent} ${!isSidebarOpen ? styles.sidebarClosed : ''}`}>
            {children}
          </main>
        </div>
      </LanguageProvider>
    </ThemeProvider>
  );
}