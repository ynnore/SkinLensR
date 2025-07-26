// Fichier: src/app/drive/page.tsx
'use client';

import React, { useState } from 'react';
import styles from './drive.module.css';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { LanguageCode } from '@/types'; // Import de LanguageCode

// Icônes pour les onglets
import { FaCloudUploadAlt, FaFolderOpen, FaLink } from 'react-icons/fa';

// Objet de traduction pour cette page
const driveTranslations = {
  headline: {
    en: "My Secret Drive",
    fr: "Mon Drive Secret",
    mi: "Tōku Pūmanawa Ngū", // Maori: My Secret Drive
    hi: "मेरी गुप्त ड्राइव", // Hindi: My Secret Drive
    ga: "Mo Dhriofa Rúnda", // Irish: My Secret Drive
    gd: "Mo Dhraibh Dhìomhair", // Scottish Gaelic: My Secret Drive
    'en-AU': "My Secret Drive", // Australian English
    'en-CA': "My Secret Drive", // Canadian English
    'fr-CA': "Mon Drive Secret", // Canadian French
    'en-NZ': "My Secret Drive", // New Zealand English
    'en-ZA': "My Secret Drive", // South African English
    af: "My Geheime Dryf", // Afrikaans
  },
  description: {
    en: "Secure storage for your classified mission files. Upload, save, and delete documents here.",
    fr: "Stockage sécurisé pour vos dossiers de mission classifiés. Téléchargez, sauvegardez et supprimez des documents ici.",
    mi: "He wāhi rongoa haumaru mō ō kōnae misioni huna. Tukuna ake, tiakina, mukua ngā tuhinga ki konei.",
    hi: "आपके वर्गीकृत मिशन फ़ाइलों के लिए सुरक्षित भंडारण। दस्तावेज़ यहां अपलोड करें, सहेजें और हटाएँ।",
    ga: "Stóráil shlán do chomhaid misean aicmithe. Uaslódáil, sábháil, agus scrios doiciméid anseo.",
    gd: "Stòras tèarainte airson do fhaidhlichean misean clasaichte. Luchdaich suas, sàbhail, agus sguab às sgrìobhainnean an seo.",
    'en-AU': "Secure storage for your classified mission files. Upload, save, and delete documents here.",
    'en-CA': "Secure storage for your classified mission files. Upload, save, and delete documents here.",
    'fr-CA': "Stockage sécurisé pour vos dossiers de mission classifiés. Téléchargez, sauvegardez et supprimez des documents ici.",
    'en-NZ': "Secure storage for your classified mission files. Upload, save, and delete documents here.",
    'en-ZA': "Secure storage for your classified mission files. Upload, save, and delete documents here.",
    af: "Veilige stoorplek vir u geklassifiseerde missielêers. Laai, stoor en verwyder dokumente hier.",
  },
  uploadTab: {
    en: "Upload Files",
    fr: "Télécharger des Fichiers",
    mi: "Tukuna Kōnae",
    hi: "फ़ाइलें अपलोड करें",
    ga: "Uaslódáil Comhaid",
    gd: "Luchdaich Suas Faidhlichean",
    'en-AU': "Upload Files",
    'en-CA': "Upload Files",
    'fr-CA': "Télécharger des Fichiers",
    'en-NZ': "Upload Files",
    'en-ZA': "Upload Files",
    af: "Laai Lêers Op",
  },
  myDriveTab: {
    en: "My Drive",
    fr: "Mon Drive",
    mi: "Tōku Pūmanawa",
    hi: "मेरी ड्राइव",
    ga: "Mo Dhriofa",
    gd: "Mo Dhraibh",
    'en-AU': "My Drive",
    'en-CA': "My Drive",
    'fr-CA': "Mon Drive",
    'en-NZ': "My Drive",
    'en-ZA': "My Drive",
    af: "My Skyf",
  },
  connectorsTab: {
    en: "Connectors",
    fr: "Connecteurs",
    mi: "Hononga",
    hi: "कनेक्टर्स",
    ga: "Nascairí",
    gd: "Luchd-Ceangail",
    'en-AU': "Connectors",
    'en-CA': "Connectors",
    'fr-CA': "Connecteurs",
    'en-NZ': "Connectors",
    'en-ZA': "Connectors",
    af: "Konnektors",
  },
  uploadPlaceholder: {
    en: "Drag & drop files here or click to select.",
    fr: "Glissez & déposez vos fichiers ici ou cliquez pour sélectionner.",
    mi: "Tōia ngā kōnae ki konei, pāwhiri rānei hei tīpako.",
    hi: "फ़ाइलों को यहां खींचें और छोड़ें या चुनने के लिए क्लिक करें।",
    ga: "Tarraing & scaoil comhaid anseo nó cliceáil chun roghnú.",
    gd: "Slaod & leig às faidhlichean an seo no cliog gus taghadh.",
    'en-AU': "Drag & drop files here or click to select.",
    'en-CA': "Drag & drop files here or click to select.",
    'fr-CA': "Glissez & déposez vos fichiers ici ou cliquez pour sélectionner.",
    'en-NZ': "Drag & drop files here or click to select.",
    'en-ZA': "Drag & drop files here or click to select.",
    af: "Sleep lêers hierheen of klik om te kies.",
  },
  myDrivePlaceholder: {
    en: "Your classified files will appear here.",
    fr: "Vos dossiers classifiés apparaîtront ici.",
    mi: "Ka puta mai ō kōnae huna ki konei.",
    hi: "आपकी वर्गीकृत फ़ाइलें यहां दिखाई देंगी।",
    ga: "Tiocfaidh do chomhaid aicmithe anseo.",
    gd: "Nochdaidh na faidhlichean clasaichte agad an seo.",
    'en-AU': "Your classified files will appear here.",
    'en-CA': "Your classified files will appear here.",
    'fr-CA': "Vos dossiers classifiés apparaîtront ici.",
    'en-NZ': "Your classified files will appear here.",
    'en-ZA': "Your classified files will appear here.",
    af: "U geklassifiseerde lêers sal hier verskyn.",
  },
  connectorsPlaceholder: {
    en: "Connect your cloud storage or other services.",
    fr: "Connectez vos stockages cloud ou autres services.",
    mi: "Hononga atu i tō rokiroki kapua, i ētahi atu ratonga rānei.",
    hi: "अपनी क्लाउड स्टोरेज या अन्य सेवाओं को कनेक्ट करें।",
    ga: "Ceangail do stóráil scamall nó seirbhísí eile.",
    gd: "Ceangail do stòradh sgòthan no seirbheisean eile.",
    'en-AU': "Connect your cloud storage or other services.",
    'en-CA': "Connect your cloud storage or other services.",
    'fr-CA': "Connectez vos stockages cloud ou autres services.",
    'en-NZ': "Connect your cloud storage or other services.",
    'en-ZA': "Connect your cloud storage or other services.",
    af: "Koppel u wolkberging of ander dienste.",
  },
};

function getDriveTranslation<K extends keyof typeof driveTranslations>(key: K, lang: LanguageCode): string {
  const translations = driveTranslations[key] as Record<string, string>;
  // La logique de fallback est déjà bonne : essaye la langue spécifique, puis l'anglais par défaut, puis vide.
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
  const highlightColor = theme === 'dark' ? '#0070f3' : '#0070f3'; // Couleur de surbrillance
  const highlightColorLight = theme === 'dark' ? 'rgba(0,112,243,0.3)' : 'rgba(0,112,243,0.1)'; // Version plus claire


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