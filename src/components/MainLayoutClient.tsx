// src/components/MainLayoutClient.tsx
"use client";

import { useState, useEffect, ReactNode } from 'react';
import Sidebar from '@/components/Sidebar';
import { FaBars, FaMoon, FaSun } from 'react-icons/fa';
import styles from './MainLayoutClient.module.css'; // Importer le fichier CSS Module

interface MainLayoutClientProps {
  children: ReactNode;
}

export default function MainLayoutClient({ children }: MainLayoutClientProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme === 'dark') {
      setIsDarkMode(true);
    } else if (storedTheme === 'light') {
      setIsDarkMode(false);
    }
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleTheme = () => {
    setIsDarkMode(prevMode => {
      const newMode = !prevMode;
      localStorage.setItem('theme', newMode ? 'dark' : 'light');
      return newMode;
    });
  };

  useEffect(() => {
    if (!isMounted) return;
    const htmlElement = document.documentElement;
    if (isDarkMode) {
      htmlElement.classList.add('dark');
    } else {
      htmlElement.classList.remove('dark');
    }
  }, [isDarkMode, isMounted]);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <div className={styles.pageWrapper}> {/* Utilisation de la classe du module */}
        <Sidebar isOpen={isSidebarOpen} />

        <div className={styles.contentWrapper}> {/* Utilisation de la classe du module */}
          <header className={styles.header}> {/* Utilisation de la classe du module */}
            <div className={styles.headerContent}> {/* Utilisation de la classe du module */}
              <button
                onClick={toggleSidebar}
                className={styles.sidebarToggleButton} // Utilisation de la classe du module
              >
                <FaBars size={24} />
              </button>
              <h1 className={styles.headerTitle}>SkinLensr App</h1> {/* Utilisation de la classe du module */}
            </div>
          </header>

          <main className={styles.mainContentArea}> {/* Utilisation de la classe du module */}
            {children}
          </main>
        </div>
      </div>

      <button
        onClick={toggleTheme}
        className={styles.fixedThemeToggleButton} // Utilisation de la classe du module
        aria-label={isDarkMode ? "Passer en mode clair" : "Passer en mode sombre"}
        title={isDarkMode ? "Passer en mode clair" : "Passer en mode sombre"}
      >
        {isDarkMode ? <FaSun size={20} /> : <FaMoon size={18} />}
      </button>
    </>
  );
}