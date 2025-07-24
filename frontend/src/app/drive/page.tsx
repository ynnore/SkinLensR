// Fichier: src/app/drive/page.tsx
'use client';

import React, { useState } from 'react';
import styles from './drive.module.css';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { LanguageCode } from '@/types'; // ✅ CORRECTION : Import de LanguageCode

// Icônes pour les onglets
import { FaCloudUploadAlt, FaFolderOpen, FaLink } from 'react-icons/fa';

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
  uploadTab: {
    en: "Upload Files",
    fr: "Télécharger des Fichiers",
  },
  myDriveTab: {
    en: "My Drive",
    fr: "Mon Drive",
  },
  connectorsTab: {
    en: "Connectors",
    fr: "Connecteurs",
  },
  uploadPlaceholder: {
    en: "Drag & drop files here or click to select.",
    fr: "Glissez & déposez vos fichiers ici ou cliquez pour sélectionner.",
  },
  myDrivePlaceholder: {
    en: "Your classified files will appear here.",
    fr: "Vos dossiers classifiés apparaîtront ici.",
  },
  connectorsPlaceholder: {
    en: "Connect your cloud storage or other services.",
    fr: "Connectez vos stockages cloud ou autres services.",
  },
};

function getDriveTranslation<K extends keyof typeof driveTranslations>(key: K, lang: LanguageCode): string {
  const translations = driveTranslations[key] as Record<string, string>;
  return translations?.[lang] || translations?.en || '';
}

const DrivePage: React.FC = () => {
  const { language } = useLanguage();
  const { theme } = useTheme();

  const [activeTab, setActiveTab] = useState<'upload' | 'myDrive' | 'connectors'>('myDrive');

  // Définition des couleurs basée sur le thème
  const backgroundColor = theme === 'dark' ? '#1f2937' : '#ffffff';
  const textColor = theme === 'dark' ? '#E0E0E0' : '#111827';
  const cardBgColor = theme === 'dark' ? '#2A2A3A' : '#F8F8F8';
  const borderColor = theme === 'dark' ? '#555555' : '#e5e7eb';
  const highlightColor = theme === 'dark' ? '#0070f3' : '#0070f3';
  const highlightColorLight = theme === 'dark' ? 'rgba(0,112,243,0.3)' : 'rgba(0,112,243,0.1)';


  return (
    <div
      className={styles.container}
      style={{
        '--kiwi-background-page': backgroundColor,
        '--kiwi-text-primary': textColor,
        '--kiwi-background-card': cardBgColor,
        '--kiwi-border-color': borderColor,
        '--kiwi-highlight-color': highlightColor,
        '--kiwi-highlight-color-light': highlightColorLight,
      } as React.CSSProperties}
    >
      <h1 className={styles.headline}>{getDriveTranslation('headline', language)}</h1>

      {/* Barre d'onglets */}
      <div className={styles.tabsContainer}>
        <button 
          className={`${styles.tabButton} ${activeTab === 'myDrive' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('myDrive')}
        >
          <FaFolderOpen className={styles.tabIcon} />
          {getDriveTranslation('myDriveTab', language)}
        </button>
        <button 
          className={`${styles.tabButton} ${activeTab === 'upload' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('upload')}
        >
          <FaCloudUploadAlt className={styles.tabIcon} />
          {getDriveTranslation('uploadTab', language)}
        </button>
        <button 
          className={`${styles.tabButton} ${activeTab === 'connectors' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('connectors')}
        >
          <FaLink className={styles.tabIcon} />
          {getDriveTranslation('connectorsTab', language)}
        </button>
      </div>

      {/* Contenu de l'onglet actif */}
      <div className={styles.tabContent}>
        {activeTab === 'myDrive' && (
          <div className={styles.tabPanel}>
            <p className={styles.placeholderText}>{getDriveTranslation('myDrivePlaceholder', language)}</p>
          </div>
        )}
        {activeTab === 'upload' && (
          <div className={styles.tabPanel}>
            <p className={styles.placeholderText}>{getDriveTranslation('uploadPlaceholder', language)}</p>
          </div>
        )}
        {activeTab === 'connectors' && (
          <div className={styles.tabPanel}>
            <p className={styles.placeholderText}>{getDriveTranslation('connectorsPlaceholder', language)}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DrivePage;