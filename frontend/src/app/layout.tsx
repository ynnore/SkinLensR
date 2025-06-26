'use client';

import './globals.css';
import styles from './layout.module.css';
import { useState, ReactNode, useCallback, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import { MyProvider } from '@/context/MyContext'; // ajuste le chemin si besoin

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL!;

export default function RootLayout({ children }: { children: ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(true);

  const toggleSidebar = useCallback(() => setIsSidebarOpen(prev => !prev), []);

  const toggleTheme = useCallback(() => {
    setIsDarkMode(prev => {
      const newMode = !prev;
      localStorage.setItem('theme', newMode ? 'dark' : 'light');
      return newMode;
    });
  }, []);

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
      setIsDarkMode(storedTheme === 'dark');
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
    document.documentElement.classList.toggle('light', !isDarkMode);
  }, [isDarkMode]);

  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={styles.body}>
        <MyProvider backendUrl={BACKEND_URL}>
          <Sidebar
            isOpen={isSidebarOpen}
            toggleSidebar={toggleSidebar}
            isDarkMode={isDarkMode}
            toggleTheme={toggleTheme}
          />
          <main className={styles.mainContent}>
            {children}
          </main>
        </MyProvider>
      </body>
    </html>
  );
}
