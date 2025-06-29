import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n
  .use(initReactI18next) // Passer i18next à react-i18next
  .init({
    resources: {
      en: {
        translation: {
          welcome: "Welcome",
          // Ajoute d'autres traductions en anglais ici
        },
      },
      fr: {
        translation: {
          welcome: "Bienvenue",
          // Ajoute d'autres traductions en français ici
        },
      },
      mi: {
        translation: {
          welcome: "Haere mai",
          // Ajoute d'autres traductions en maori ici
        },
      },
    },
    lng: 'en', // Langue par défaut
    fallbackLng: 'en', // Langue de secours
    interpolation: {
      escapeValue: false, // Pas nécessaire pour React
    },
  });

export default i18n;
