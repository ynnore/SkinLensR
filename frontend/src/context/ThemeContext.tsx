// src/context/ThemeContext.tsx
'use client'; // Important pour les composants utilisant des hooks React dans le App Router

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
// Pas besoin de 'next/navigation' (useRouter) pour la gestion du thème

// Définition du type pour le thème ('light' ou 'dark')
type Theme = 'light' | 'dark';

// Définition de l'interface pour le contexte du thème
interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void; // Fonction pour basculer le thème
}

// Création du contexte
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Composant Provider pour le thème
export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  // 1. Gérer l'état du thème
  // Initialise le thème en vérifiant localStorage, puis la préférence système, puis par défaut 'light'.
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined') { // S'assurer que le code s'exécute côté client
      const storedTheme = localStorage.getItem('theme');
      // S'assurer que la valeur stockée est valide
      if (storedTheme === 'light' || storedTheme === 'dark') {
        return storedTheme;
      }
      // Vérifie la préférence système de l'utilisateur (ex: mode sombre activé dans les paramètres du OS)
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
    }
    return 'light'; // Thème par défaut
  });

  // 2. Appliquer la classe CSS au document.documentElement (l'élément <html>)
  // et sauvegarder la préférence dans localStorage à chaque changement de thème.
  useEffect(() => {
    if (typeof document !== 'undefined') { // S'assurer que le code s'exécute côté client
      // Supprime les classes 'light' ou 'dark' existantes pour éviter les doublons
      document.documentElement.classList.remove('light', 'dark');
      // Ajoute la classe correspondant au thème actuel
      document.documentElement.classList.add(theme);
      // Sauvegarde la préférence dans localStorage
      localStorage.setItem('theme', theme);
    }
  }, [theme]); // Cet effet s'exécute chaque fois que 'theme' change

  // 3. Fonction pour basculer le thème
  // Utilisation de useCallback pour optimiser la performance et éviter des recréations inutiles
  const toggleTheme = useCallback(() => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  }, []); // Pas de dépendances car setTheme est stable

  // Valeurs fournies par le contexte à tous les composants enfants
  // Utilisation de useMemo pour optimiser la performance et ne pas recréer l'objet du contexte
  // tant que les valeurs qu'il contient n'ont pas changé.
  const contextValue = useMemo(() => ({
    theme,
    toggleTheme,
  }), [theme, toggleTheme]); // Dépendances : le thème lui-même et la fonction de bascule

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook personnalisé pour accéder facilement au contexte du thème
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};