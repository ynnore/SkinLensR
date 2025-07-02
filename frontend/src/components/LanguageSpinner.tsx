// src/components/LanguageSpinner.tsx
// (Conserver le contenu existant de votre fichier, en ne changeant que la ligne d'importation de LanguageCode)

// Exemple de structure si vous avez un composant LanguageSpinner
import React from 'react';
import { LanguageCode } from '@/types'; // <<< CORRECTION ICI
import styles from './LanguageSpinner.module.css';

// Assurez-vous que le reste du composant est correct et complet
interface LanguageSpinnerProps {
  currentLanguage: LanguageCode;
  // ... autres props si le spinner les utilise
}

const LanguageSpinner = ({ currentLanguage }: LanguageSpinnerProps) => {
  // Logique et rendu de votre spinner
  return (
    <div className={styles.spinnerContainer}>
      {/* Affiche la langue actuelle ou une icône */}
      <span>{currentLanguage.toUpperCase()}</span>
      {/* ... autres éléments du spinner */}
    </div>
  );
};

export default LanguageSpinner;
