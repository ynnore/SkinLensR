// src/i18n-client.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// On n'importe plus 'Backend' car on ne charge plus de fichiers externes
// import Backend from 'i18next-http-backend';

i18n
  // On n'utilise plus .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: process.env.NODE_ENV === 'development',
    fallbackLng: 'en',
    
    // --- LA SOLUTION EST ICI : ON MET LES TRADUCTIONS DIRECTEMENT DANS LE CODE ---
    resources: {
      en: {
        translation: {
          sidebar: { beta: "Beta", scan: "Scan", dashboard: "Dashboard", files: "Files", connections: "Connections", pay: "Pay", settings: "Settings", terms: "Terms", privacy: "Privacy Policy" },
          chat: { placeholder: "Type your message..." }
        }
      },
      fr: {
        translation: {
          sidebar: { beta: "Bêta", scan: "Scanner", dashboard: "Tableau de Bord", files: "Fichiers", connections: "Connexions", pay: "Paiements", settings: "Paramètres", terms: "Conditions", privacy: "Confidentialité" },
          chat: { placeholder: "Écrivez votre message..." }
        }
      },
      mi: {
        translation: {
          sidebar: { beta: "Pēta", scan: "Matawai", dashboard: "Papātohu", files: "Kōnae", connections: "Hononga", pay: "Utu", settings: "Tautuhinga", terms: "Ture", privacy: "Tūmataitinga" },
          chat: { placeholder: "Tuhia tō karere..." }
        }
      }
    },
    
    interpolation: {
      escapeValue: false, 
    },
  });

export default i18n;