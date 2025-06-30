// Fichier : src/app/MainLayoutClient.tsx
'use client';

import React, { useState, useCallback, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import { useLanguage } from '@/contexts/LanguageContext';
import styles from './MainLayoutClient.module.css';

export default function MainLayoutClient({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isDarkMode, setDarkMode] = useState(false);
  const { language, setLanguage } = useLanguage();

  // CORRECTION MAJEURE : On applique les classes sur <html>
  useEffect(() => {
    const root = document.documentElement; // Cible la balise <html>
    if (isDarkMode) {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleSidebar = useCallback(() => setSidebarOpen(prev => !prev), []);
  const toggleTheme = useCallback(() => setDarkMode(prev => !prev), []);

  return (
    <div className={styles.layoutContainer}>
      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        isDarkMode={isDarkMode}
        toggleTheme={toggleTheme}
        language={language}
        setLanguage={setLanguage}
      />
      <main className={styles.mainContent}>
        {children}
      </main>
    </div>
  );
}