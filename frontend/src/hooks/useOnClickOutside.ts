// Fichier : src/hooks/useOnClickOutside.ts

import { useEffect, RefObject } from 'react';

// Définit les types d'événements que nous écouterons (clic de souris ou toucher sur mobile)
type Event = MouseEvent | TouchEvent;

// Le hook personnalisé
export function useOnClickOutside<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T>, // La référence à l'élément que nous surveillons (le menu)
  handler: (event: Event) => void // La fonction à exécuter quand on clique dehors (fermer le menu)
) {
  useEffect(() => {
    // La fonction qui écoute les clics
    const listener = (event: Event) => {
      const el = ref?.current;

      // Si l'élément n'existe pas ou si on a cliqué à l'intérieur de l'élément, on ne fait rien.
      if (!el || el.contains(event.target as Node)) {
        return;
      }

      // Sinon, on exécute la fonction 'handler' (qui fermera le menu).
      handler(event);
    };

    // On attache l'écouteur d'événements au document entier.
    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    // Fonction de nettoyage : quand le composant est détruit, on retire l'écouteur.
    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]); // On ne relance cet effet que si la référence ou le handler changent.
}
