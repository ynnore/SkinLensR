// src/context/MyContext.tsx
'use client'; // Indique que ce composant est un Client Component, nécessaire pour les hooks React

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
// Pas besoin de 'next/navigation/useRouter' ici à moins que votre contexte générique n'en ait besoin

// 1. Définition de l'interface pour le contexte
// C'est ici que vous définissez les types de données et les signatures de fonctions
// que ce contexte va exposer à ses consommateurs.
interface MyContextType {
  // Exemple de donnée d'état
  data: string;
  // Exemple de fonction pour manipuler l'état
  updateData: (newData: string) => void;
  // Un autre exemple
  counter: number;
  incrementCounter: () => void;
}

// 2. Création du contexte
// On initialise le contexte avec `undefined` et on spécifie son type.
const MyContext = createContext<MyContextType | undefined>(undefined);

// 3. Composant Provider pour le contexte
// Ce composant va encapsuler les parties de votre application qui ont besoin d'accéder
// aux valeurs et fonctions définies dans ce contexte.
export const MyProvider = ({ children }: { children: React.ReactNode }) => {
  // Définissez ici les états gérés par votre contexte
  const [data, setData] = useState<string>("Valeur initiale de mes données");
  const [counter, setCounter] = useState<number>(0);

  // Utilisez useEffect pour les effets secondaires (chargement initial, persistance, etc.)
  // Par exemple, vous pourriez charger des données initiales depuis le localStorage ou une API ici.
  useEffect(() => {
    // console.log("MyProvider a été monté ou 'data'/'counter' ont changé.");
    // Exemple : charger une valeur initiale depuis le localStorage
    // const savedData = localStorage.getItem('my_data');
    // if (savedData) {
    //   setData(savedData);
    // }
  }, []); // [] signifie que cet effet ne s'exécute qu'une seule fois au montage

  // Définissez les fonctions que vous voulez exposer via le contexte.
  // Utilisez `useCallback` pour mémoriser ces fonctions et éviter des recréations inutiles
  // qui pourraient causer des re-renders non désirés des composants enfants.
  const updateData = useCallback((newData: string) => {
    setData(newData);
  }, []); // Pas de dépendances si setData est stable (ce qui est le cas pour les setters de useState)

  const incrementCounter = useCallback(() => {
    setCounter(prevCounter => prevCounter + 1);
  }, []);

  // 4. Mémorisation de la valeur du contexte
  // Utilisez `useMemo` pour mémoriser l'objet de valeur du contexte.
  // Cela garantit que l'objet du contexte ne change que si l'une de ses dépendances change,
  // ce qui empêche des re-renders inutiles des composants consommateurs.
  const contextValue = useMemo(() => ({
    data,
    updateData,
    counter,
    incrementCounter,
  }), [data, updateData, counter, incrementCounter]); // Liste des dépendances

  // Le Provider rend la valeur du contexte disponible à tous les enfants
  return (
    <MyContext.Provider value={contextValue}>
      {children}
    </MyContext.Provider>
  );
};

// 5. Hook personnalisé pour consommer le contexte
// Ce hook rend l'accès au contexte plus propre et plus sûr,
// en vérifiant si le hook est appelé en dehors du Provider.
export const useMyContext = () => {
  const context = useContext(MyContext);
  if (context === undefined) {
    // Lance une erreur si le hook est utilisé sans être enveloppé par MyProvider
    throw new Error('useMyContext must be used within a MyProvider');
  }
  return context;
};