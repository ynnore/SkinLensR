// Fichier : src/app/MainLayoutClient.tsx
'use client';

import React, { useState, useCallback } from 'react';
import Sidebar from '../components/Sidebar';
import ChatHeader from '../components/ChatHeader'; // <-- 1. Importez le nouveau ChatHeader
import styles from './MainLayoutClient.module.css';

// L'import de FaBars n'est plus nécessaire ici
// import { FaBars } from 'react-icons/fa'; 

export default function MainLayoutClient({ children }: { children: React.ReactNode }) {
  // L'état de la sidebar est géré ici.
  // IMPORTANT : On l'initialise à `false` pour que sur mobile, le menu soit fermé par défaut.
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen(prev => !prev);
  }, []);

  return (
    // Ce conteneur ne gère plus la disposition flex.
    <div className={styles.mainLayoutContainer}>
      
      {/* La Sidebar vit sa vie en position: fixed grâce à son propre CSS */}
      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
      />
      
      {/* Le ChatHeader est aussi en position: fixed (sur mobile) et reçoit la fonction pour ouvrir la sidebar */}
      <ChatHeader toggleSidebar={toggleSidebar} />
        
      {/* Le contenu principal est le seul élément qui scrollera */}
      <main className={styles.mainContent}>
        {children}
      </main>

    </div>
  );
}