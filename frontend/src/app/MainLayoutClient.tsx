// Fichier : src/app/MainLayoutClient.tsx
'use client';

import React, { useState, useCallback } from 'react';
import Sidebar from '../components/Sidebar';
import ChatHeader from '../components/ChatHeader'; // <-- 1. On importe le nouveau ChatHeader
import styles from './MainLayoutClient.module.css';

// L'import de FaBars n'est plus nécessaire ici

export default function MainLayoutClient({ children }: { children: React.ReactNode }) {
  // 2. L'état est initialisé à `false` pour que le menu soit fermé par défaut sur mobile
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // 3. Toute la logique de thème (isDarkMode, toggleTheme, useEffect) a été SUPPRIMÉE
  // car elle est maintenant gérée par ThemeContext. C'est plus propre.

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen(prev => !prev);
  }, []);

  return (
    // Ce conteneur ne gère plus la disposition, il sert juste de wrapper
    <div className={styles.mainLayoutContainer}>
      
      {/* 4. La Sidebar ne reçoit plus les props de thème */}
      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
      />
      
      {/* 5. Le ChatHeader est maintenant un composant de premier niveau */}
      <ChatHeader toggleSidebar={toggleSidebar} />
        
      {/* 6. Le <main> est simplifié et n'a plus le bouton à l'intérieur */}
      <main className={styles.mainContent}>
        {children}
      </main>

    </div>
  );
}