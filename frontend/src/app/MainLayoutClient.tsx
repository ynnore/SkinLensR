// src/app/MainLayoutClient.tsx
'use client';
import React, { useState, useCallback, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import ChatHeader from '@/components/ChatHeader'; // NOUVEL IMPORT DU CHAT HEADER
import styles from './MainLayoutClient.module.css';

interface MainLayoutClientProps {
  children: React.ReactNode;
}

export default function MainLayoutClient({ children }: MainLayoutClientProps) {
  // L'état de la sidebar. Débute ouverte sur desktop, fermée sur mobile.
  // Initialisez à 'true' (ouvert) car la logique d'ajustement est dans useEffect.
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen(prev => !prev);
  }, []);

  // Ajuste l'état initial de la sidebar en fonction de la taille de l'écran.
  // Ce code s'exécute UNIQUEMENT côté client (dans useEffect).
  useEffect(() => {
    const handleResize = () => {
      // Si la largeur de l'écran est supérieure au breakpoint mobile (768px),
      // la sidebar est ouverte (mode desktop).
      if (window.innerWidth > 768) {
        setIsSidebarOpen(true);
      } else {
        // Sur mobile, la sidebar est fermée par défaut.
        setIsSidebarOpen(false);
      }
    };

    // Exécutez handleResize une première fois au montage du composant client.
    handleResize();

    // Ajoutez un écouteur d'événements pour les changements de taille de fenêtre.
    window.addEventListener('resize', handleResize);

    // Fonction de nettoyage : retirez l'écouteur d'événements lorsque le composant est démonté.
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []); // Le tableau vide [] assure que cet effet ne s'exécute qu'une fois au montage et une fois au démontage.

  // Gère l'overflow du body pour empêcher le défilement du contenu derrière la sidebar sur mobile.
  // Ce code s'exécute UNIQUEMENT côté client (dans useEffect).
  useEffect(() => {
    const isMobileView = window.innerWidth <= 768; // Vérification de la vue mobile ici, côté client.
    if (isSidebarOpen && isMobileView) {
      document.body.style.overflow = 'hidden'; // Empêche le défilement.
    } else {
      document.body.style.overflow = ''; // Rétablit le défilement normal.
    }

    // Fonction de nettoyage : assurez-vous que le style est réinitialisé.
    return () => {
      document.body.style.overflow = '';
    };
  }, [isSidebarOpen]); // Cet effet se réexécute lorsque l'état isSidebarOpen change.


  // Appliquez les classes CSS pour l'overlay et le bouton hamburger
  // Le CSS (dans .module.css) gérera la propriété 'display' via les media queries.
  // Ici, nous nous contentons d'ajouter une classe pour activer/désactiver l'opacité/visibilité
  // si le CSS l'attend.
  const mobileOverlayActive = isSidebarOpen ? styles.mobileOverlayActive : '';


  return (
    <div className={styles.mainLayoutContainer}>
      {/* La Sidebar (position: fixed, gérée par Sidebar.module.css) */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Le calque de superposition (Overlay).
          Il est TOUJOURS rendu ici, mais sa visibilité (display: none/block) est gérée
          par les media queries dans MainLayoutClient.module.css.
          Sa transparence et sa capacité à être cliqué sont gérées par la classe mobileOverlayActive. */}
      <div
        className={`${styles.mobileOverlay} ${mobileOverlayActive}`}
        onClick={toggleSidebar}
        aria-hidden="true"
      />

      {/* Le contenu principal de la page. */}
      <main className={`${styles.mainContent} ${!isSidebarOpen ? styles.sidebarClosed : ''}`}>
        {/* ChatHeader est la barre fixe du haut de l'application sur mobile.
            Il contient le bouton hamburger pour ouvrir la sidebar.
            Son affichage (display: none/block) est géré par ChatHeader.module.css. */}
        <ChatHeader toggleSidebar={toggleSidebar} />

        {/* Note : Le bouton hamburger est maintenant géré DANS ChatHeader.tsx,
            donc vous ne devriez pas avoir un autre bouton hamburger ici.
            Si vous en aviez un, supprimez-le pour éviter les doublons. */}

        {children} {/* C'est ici que votre page.tsx (contenant le chatContainer) sera rendue */}
      </main>
    </div>
  );
}