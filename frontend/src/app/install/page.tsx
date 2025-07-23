// Fichier: src/app/install/page.tsx
'use client';

import React from 'react';
import styles from './install.module.css'; // Créez ce fichier CSS
import { FaDownload } from 'react-icons/fa'; // Exemple d'icône pour l'explication
import { useLanguage } from '@/contexts/LanguageContext'; // Assurez-vous du bon chemin

// Votre objet de traduction pour les messages de la page d'installation
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

  return (
    <div className={styles.container}>
      <h1>{getInstallTranslation('headline', language)}</h1>
      <p>{getInstallTranslation('instructions', language)}</p>
      
      {/* Bouton pour déclencher l'installation PWA si le navigateur le supporte */}
      <button className={styles.installButton} onClick={() => {
        if (window.deferredPrompt) { // 'deferredPrompt' est défini par le navigateur pour les PWA
          window.deferredPrompt.prompt();
          window.deferredPrompt.userChoice.then((choiceResult: any) => {
            if (choiceResult.outcome === 'accepted') {
              console.log('User accepted the A2HS prompt');
            } else {
              console.log('User dismissed the A2HS prompt');
            }
            window.deferredPrompt = null;
          });
        } else {
          alert(getInstallTranslation('instructions', language)); // Affiche les instructions si pas de PWA install prompt
        }
      }}>
        <FaDownload /> {getInstallTranslation('cta', language)}
      </button>

      {/* Placeholder pour futures informations (liens App Store, Play Store si natif) */}
      <div className={styles.appStoreLinks}>
        {/* <img src="/images/appstore.png" alt="App Store" /> */}
        {/* <img src="/images/playstore.png" alt="Google Play" /> */}
      </div>
    </div>
  );
};

export default InstallPage;