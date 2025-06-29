// src/components/MainLayoutClient.tsx
'use client';

import React, { useState, useCallback, useEffect } from 'react';
import Sidebar from './Sidebar';
import styles from './MainLayoutClient.module.css';

// 1. On définit le type pour la langue ici.
//    Cela garantit que tous les composants utilisent les mêmes codes ('en', 'fr', 'mi').
export type LanguageCode = 'en' | 'fr' | 'mi';

export default function MainLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  // Logique existante pour la sidebar et le thème
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isDarkMode, setDarkMode] = useState(true);

  // 2. ON AJOUTE L'ÉTAT DE LA LANGUE ICI.
  //    C'est maintenant le "chef d'orchestre" de la langue pour toute l'application.
  const [language, setLanguage] = useState<LanguageCode>('en'); // On démarre en anglais par défaut

  // Fonctions existantes
  const toggleSidebar = useCallback(() => setSidebarOpen(prev => !prev), []);
  const toggleTheme = useCallback(() => {
    setDarkMode(prev => {
      const newIsDarkMode = !prev;
      document.documentElement.classList.toggle('dark', newIsDarkMode);
      return newIsDarkMode;
    });
  }, []);
  
  // Effet pour le thème
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  return (
    <div className={styles.layoutContainer}>
      {/* 3. ON PASSE LA LANGUE À LA SIDEBAR */}
      {/*    Maintenant, la Sidebar saura toujours quelle langue afficher. */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        toggleSidebar={toggleSidebar}
        isDarkMode={isDarkMode}
        toggleTheme={toggleTheme}
        language={language} 
      />
      <main className={styles.mainContent}>
        {/* 4. ON PASSE LA LANGUE ET LA FONCTION POUR LA CHANGER À LA PAGE DE CHAT */}
        {/*    React.cloneElement est la magie qui permet de passer de nouvelles props aux enfants. */}
        {React.cloneElement(children as React.ReactElement, { language, setLanguage })}
      </main>
    </div>
  );
}