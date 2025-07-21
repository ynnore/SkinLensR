// i18n.js (votre configuration de i18next)
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: {
          welcome: "Welcome",
        },
      },
      fr: {
        translation: {
          welcome: "Bienvenue",
        },
      },
      mi: {
        translation: {
          welcome: "Haere mai",
        },
      },
    },
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
