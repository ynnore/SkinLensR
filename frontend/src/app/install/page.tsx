// Fichier: src/app/install/page.tsx
'use client';

import React from 'react';
import styles from './install.module.css';
import { FaDownload } from 'react-icons/fa';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext'; // Ajouté si useTheme est utilisé pour les styles
import { LanguageCode } from '@/types'; // ✅ TRÈS IMPORTANT : Import de LanguageCode

// Objet de traduction pour la page d'installation
const installTranslations = {
  headline: {
    en: "Install Operation W App",
    fr: "Installer l'Application Opération W",
  },
  cta: {
    en: "Add to Home Screen / Install on Desktop",
    fr: "Ajouter à l'Écran d'Accueil / Installer sur le Bureau",
  },
  instructions: {
    en: "For mobile, open in browser and select 'Add to Home Screen'. For desktop, use the install icon in your browser's address bar.",
    fr: "Sur mobile, ouvrez dans le navigateur et sélectionnez 'Ajouter à l'écran d'accueil'. Sur ordinateur, utilisez l'icône d'installation dans la barre d'adresse de votre navigateur.",
  }
};

function getInstallTranslation<K extends keyof typeof installTranslations>(key: K, lang: LanguageCode): string {
  return installTranslations[key][lang] || installTranslations[key].en;
}


const InstallPage: React.FC = () => {
  const { language } = useLanguage();
  const { theme } = useTheme(); // Pour les couleurs

  const backgroundColor = theme === 'dark' ? '#1f2937' : '#ffffff';
  const textColor = theme === 'dark' ? '#E0E0E0' : '#111827';
  const highlightColor = theme === 'dark' ? '#8BC4FF' : '#4A90E2';

  return (
    <div
      className={styles.container}
      style={{
        '--kiwi-background-page': backgroundColor,
        '--kiwi-text-primary': textColor,
        '--kiwi-highlight-color': highlightColor,
      } as React.CSSProperties}
    >
      <h1>{getInstallTranslation('headline', language)}</h1>
      <p>{getInstallTranslation('instructions', language)}</p>
      
      <button className={styles.installButton} onClick={() => {
        if (typeof window !== 'undefined' && (window as any).deferredPrompt) {
          (window as any).deferredPrompt.prompt();
          (window as any).deferredPrompt.userChoice.then((choiceResult: any) => {
            if (choiceResult.outcome === 'accepted') {
              console.log('User accepted the A2HS prompt');
            } else {
              console.log('User dismissed the A2HS prompt');
            }
            (window as any).deferredPrompt = null;
          });
        } else {
          alert(getInstallTranslation('instructions', language));
        }
      }}>
        <FaDownload /> {getInstallTranslation('cta', language)}
      </button>

      <div className={styles.appStoreLinks}>
        {/* <img src="/images/appstore.png" alt="App Store" /> */}
        {/* <img src="/images/playstore.png" alt="Google Play" */}
      </div>
    </div>
  );
};

// ✅ CORRECTION MAJEURE : Ajout de l'exportation par défaut
export default InstallPage;