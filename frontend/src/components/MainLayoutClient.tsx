// Fichier : src/app/MainLayoutClient.tsx
'use client'; // TRÈS IMPORTANT : Ce composant est un Client Component

import React, { useState, useCallback, useEffect } from 'react';
import Sidebar from '@/components/Sidebar'; // Utilise l'alias configuré
import { LanguageProvider } from '@/contexts/LanguageContext'; // Importe le LanguageProvider
import styles from './MainLayoutClient.module.css'; // Importe le CSS Module spécifique à ce layout (anciennement layoutStyles)

export default function MainLayoutClient({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setSidebarOpen] = useState(true); // État de la sidebar
  const [isDarkMode, setDarkMode] = useState(false); // État du thème

  // Effet pour charger le thème depuis localStorage au premier rendu
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setDarkMode(true);
    } else {
      setDarkMode(false);
    }
  }, []);

  // Effet pour sauvegarder le thème dans localStorage et appliquer/retirer la classe 'dark' sur <html>
  useEffect(() => {
    const root = document.documentElement; // Cible la balise <html>
    if (isDarkMode) {
      root.classList.add('dark');
      root.classList.remove('light'); // Retirez 'light' si vous l'ajoutez ailleurs dans votre CSS
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.add('light'); // Ajoutez 'light' si vous la gérez spécifiquement dans votre CSS
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleSidebar = useCallback(() => setSidebarOpen(prev => !prev), []);
  const toggleTheme = useCallback(() => setDarkMode(prev => !prev), []);

  return (
    // Le LanguageProvider DOIT ENVELOPPER tous les composants qui utilisent useLanguage()
    // (ici, la Sidebar et les `children` qui sont les pages)
    <LanguageProvider>
      <div className={styles.layoutContainer}> {/* Ce conteneur gère la disposition flex */}
        <Sidebar
          isOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
          isDarkMode={isDarkMode}
          toggleTheme={toggleTheme}
          // <<< TRÈS IMPORTANT : language={language} et setLanguage={setLanguage} NE SONT PAS PASSÉS ICI.
          // La Sidebar les récupère directement du contexte via useLanguage().
        />
        {/* main est ici pour gérer le décalage de la page lorsque la sidebar est ouverte/fermée */}
        {/* La classe `content-area` est dans globals.css, `mainContentOpen` est dans MainLayoutClient.module.css */}
        <main className={`content-area ${isSidebarOpen ? styles.mainContentOpen : ''}`}>
          {children} {/* Ceci rendra votre page.tsx */}
        </main>
      </div>
    </LanguageProvider>
  );
}