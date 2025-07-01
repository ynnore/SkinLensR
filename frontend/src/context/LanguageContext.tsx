// src/contexts/LanguageContext.tsx
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { LanguageCode } from '@/types'; // Importe le type partagé via l'alias

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<LanguageCode>('en'); // Valeur par défaut

  // Charge la langue depuis localStorage au premier rendu
  useEffect(() => {
    const savedLang = localStorage.getItem('language');
    const validLanguages: LanguageCode[] = [
      'en', 'fr', 'mi', 'ga', 'hi', 'gd', 
      'en-AU', 'en-NZ', 'en-CA', 'fr-CA', 
      'en-ZA', 'af'
    ]; // Liste complète des langues valides

    if (savedLang && validLanguages.includes(savedLang as LanguageCode)) {
      setLanguage(savedLang as LanguageCode);
    } else {
      setLanguage('en'); // Fallback à l'anglais si non trouvé ou invalide
    }
  }, []);

  // Sauvegarde la langue dans localStorage chaque fois qu'elle change
  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};