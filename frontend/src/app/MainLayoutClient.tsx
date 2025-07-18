'use client';

import React, { useState } from 'react';
import styles from './MainLayoutClient.module.css';
import Sidebar from '@/components/Sidebar';
import { FaBars } from 'react-icons/fa';

interface MainLayoutClientProps {
  children: React.ReactNode;
}

export default function MainLayoutClient({ children }: MainLayoutClientProps) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(prev => !prev);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className={styles.mainLayoutContainer}>
      {/* ✅ Sidebar → toujours présente en desktop, slide-in/out en mobile */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* ✅ Overlay uniquement mobile quand la sidebar est ouverte */}
      {isSidebarOpen && (
        <div
          className={`${styles.mobileOverlay} ${isSidebarOpen ? styles.mobileOverlayActive : ''}`}
          onClick={closeSidebar}
        />
      )}

      {/* ✅ Bouton burger → toujours visible sur mobile, masqué en desktop */}
      <button className={styles.mobileBurgerButton} onClick={toggleSidebar}>
        <FaBars />
      </button>

      {/* ✅ Contenu principal */}
      <main className={`${styles.mainContent} ${!isSidebarOpen ? styles.sidebarClosed : ''}`}>
        {children}
      </main>
    </div>
  );
}
