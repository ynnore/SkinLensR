      
// src/app/MainLayoutClient.tsx
'use client'; // Indique que c'est un composant côté client

import React, { useState, useCallback } from 'react';
import Sidebar from '@/components/Sidebar'; // Importez votre composant Sidebar

interface MainLayoutClientProps {
  children: React.ReactNode;
}

export default function MainLayoutClient({ children }: MainLayoutClientProps) {
  // L'état de la sidebar est géré ici, au-dessus de Sidebar et du contenu principal
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Commencer avec la sidebar ouverte par défaut

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen(prev => !prev);
  }, []);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', position: 'relative' }}>
      {/* La Sidebar fixe */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Le contenu principal de la page (le chat, etc.) */}
      <main
        style={{
          flexGrow: 1, // Permet au contenu principal de prendre tout l'espace restant
          // Applique un margin-left dynamique en fonction de l'état de la sidebar
          marginLeft: `var(${isSidebarOpen ? '--sidebar-width-open' : '--sidebar-width-closed'})`,
          transition: `margin-left var(--transition-speed) ease`, // Transition douce pour le décalage
          padding: '20px', // Ajoutez un padding pour le contenu si nécessaire
          boxSizing: 'border-box', // Inclut le padding dans la largeur/hauteur
          overflowY: 'auto', // Permet au contenu principal de défiler si nécessaire
          // Pour s'assurer que le contenu ne déborde pas sur la droite quand la sidebar est ouverte
          width: `calc(100% - var(${isSidebarOpen ? '--sidebar-width-open' : '--sidebar-width-closed'}))`,
        }}
      >
        {children} {/* C'est ici que le contenu de votre page (le chat) sera rendu */}
      </main>
    </div>
  );
}

    

