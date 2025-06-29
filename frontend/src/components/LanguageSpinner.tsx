// LanguageSpinner.tsx
'use client';

import React from 'react';
import { LanguageCode } from './MainLayoutClient';  // Utilisez cette ligne si vous l'exportez de MainLayoutClient
import styles from './LanguageSpinner.module.css';

// Ordre cyclique des langues
const languageOrder: LanguageCode[] = ['en', 'fr', 'mi'];

// Drapeaux associés
const languageFlags: Record<LanguageCode, string> = {
  en: '/flags/gb.png',
  fr: '/flags/fr.png',
  mi: '/flags/maori.png',
};

interface Props {
  language: LanguageCode;
  setLanguage: React.Dispatch<React.SetStateAction<LanguageCode>>;
}

export default function LanguageSpinner({ language, setLanguage }: Props) {
  const currentIndex = languageOrder.indexOf(language);

  const handleClick = () => {
    // Passe à la langue suivante
    const nextIndex = (currentIndex + 1) % languageOrder.length;
    setLanguage(languageOrder[nextIndex]);
  };

  return (
    <button
      onClick={handleClick}
      className={styles.spinnerButton}
      aria-label="Change language"
    >
      <img
        src={languageFlags[language]}  // Affiche le drapeau de la langue actuelle
        alt={language}
        width={24}
        height={16}
      />
    </button>
  );
}
