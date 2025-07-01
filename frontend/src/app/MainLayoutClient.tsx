// Fichier : src/app/MainLayoutClient.tsx
'use client';

import React, { useState, useCallback, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import { LanguageProvider } from '@/contexts/LanguageContext'; // Utilisez LanguageProvider ici
import styles from './MainLayoutClient.module.css';

export default function MainLayoutClient({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isDarkMode, setDarkMode] = useState(false);
  // Pas besoin de 'language' et 'setLanguage' ici, car ils sont gérés par LanguageProvider

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setDarkMode(true);
    } else {
      setDarkMode(false);
    }
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      root.classList.remove('light');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleSidebar = useCallback(() => setSidebarOpen(prev => !prev), []);
  const toggleTheme = useCallback(() => setDarkMode(prev => !prev), []);

  return (
    <LanguageProvider> {/* LanguageProvider doit envelopper la Sidebar et les children */}
      <div className={styles.layoutContainer}>
        <Sidebar
          isOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
          isDarkMode={isDarkMode}
          toggleTheme={toggleTheme}
          // language et setLanguage ne sont plus passés en props ici
        />
        <main className={`${styles.mainContent} ${isSidebarOpen ? styles.mainContentOpen : ''}`}>
          {children}
        </main>
      </div>
    </LanguageProvider>
  );
}
