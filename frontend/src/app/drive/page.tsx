// Fichier: src/app/drive/page.tsx
'use client';

import React from 'react';
import styles from './drive.module.css';
import { useLanguage } from '@/contexts/LanguageContext'; // Assurez-vous du bon chemin
import { useTheme } from '@/context/ThemeContext';     // Assurez-vous du bon chemin

// Objet de traduction pour cette page
const driveTranslations = {
  headline: {
    en: "My Secret Drive",
    fr: "Mon Drive Secret",
    // Ajoutez d'autres langues si besoin
  },
  description: {
    en: "Secure storage for your classified mission files. Upload, save, and delete documents here.",
    fr: "Stockage sécurisé pour vos dossiers de mission classifiés. Téléchargez, sauvegardez et supprimez des documents ici.",
  },
  // Vous pourrez ajouter d'autres traductions pour les boutons d'upload, etc.
};

function getDriveTranslation<K extends keyof typeof driveTranslations>(key: K, lang: LanguageCode): string {
  return driveTranslations[key][lang] || driveTranslations[key].en;
}

const DrivePage: React.FC = () => {
  const { language } = useLanguage();
  const { theme } = useTheme();

  // Définition des couleurs basée sur le thème
  const backgroundColor = theme === 'dark' ? '#1f2937' : '#ffffff';
  const textColor = theme === 'dark' ? '#E0E0E0' : '#111827';

  return (
    <div
      className={styles.container}
      style={{
        '--kiwi-background-page': backgroundColor,
        '--kiwi-text-primary': textColor,
      } as React.CSSProperties}
    >
      <h1 className={styles.headline}>{getDriveTranslation('headline', language)}</h1>
      <p className={styles.description}>{getDriveTranslation('description', language)}</p>

      {/* Placeholder pour les futurs contrôles d'upload/liste de fichiers */}
      <div className={styles.placeholderSection}>
        {/* Futurs composants ici : UploadForm, FileList, etc. */}
        <p>Section d'upload et de gestion des fichiers (à implémenter)</p>
      </div>
    </div>
  );
};

export default DrivePage;