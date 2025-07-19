// Fichier : src/contexts/LanguageContext.tsx
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { LanguageCode } from '@/types';

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
}

interface LanguageProviderProps {
  children: ReactNode;
  initialLanguage?: LanguageCode; // ✅ Permet de passer la langue depuis [lng]/layout.tsx
}

const validLanguages: LanguageCode[] = [
  'en', 'fr', 'mi', 'ga', 'hi', 'gd',
  'en-AU', 'en-NZ', 'en-CA', 'fr-CA',
  'en-ZA', 'af'
];

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children, initialLanguage = 'en' }: LanguageProviderProps) => {
  const [language, setLanguage] = useState<LanguageCode>(initialLanguage);

  useEffect(() => {
    const savedLang = localStorage.getItem('language') as LanguageCode | null;

    if (savedLang && validLanguages.includes(savedLang)) {
      setLanguage(savedLang);
    } else if (validLanguages.includes(initialLanguage)) {
      // ✅ Si pas de localStorage, on prend la langue venant de la route [lng]
      setLanguage(initialLanguage);
    } else {
      setLanguage('en'); // fallback
    }
  }, [initialLanguage]);

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
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
