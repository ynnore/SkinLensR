// src/i18n/settings.js

// ✅ Langue fallback (si une traduction est manquante)
export const fallbackLng = 'en';

// ✅ Langues supportées dans ton app
export const languages = [
  'en',     // Anglais (par défaut)
  'fr',     // Français
  'mi',     // Maori
  'ga',     // Irlandais
  'hi',     // Hindi
  'gd',     // Gaélique écossais
  'en-AU',  // Anglais Australien
  'en-NZ',  // Anglais Néo-Zélandais
  'en-CA',  // Anglais Canadien
  'fr-CA',  // Français Canadien
  'en-ZA',  // Anglais Afrique du Sud
  'af',     // Afrikaans
];

// ✅ Langue par défaut
export const defaultLanguage = 'en';

// ✅ Namespace par défaut (fichier de traduction principal)
export const defaultNS = 'common';

// ✅ Namespace(s) utilisés dans tes fichiers JSON de traduction
export const namespaces = [
  'common',      // Textes communs (header, footer, etc.)
  'termsPage',   // Textes spécifiques à la page des CGU
  'privacyPage', // Textes spécifiques à la privacy-policy
];

// ✅ Où se trouvent tes fichiers de traduction
export const localePath = '/public/locales';

// ✅ Helper : détecte si une langue est valide
export function isValidLanguage(lng) {
  return languages.includes(lng);
}

// ✅ Helper : récupère les options i18next pour une langue donnée
export function getOptions(lng = fallbackLng, ns = defaultNS) {
  return {
    supportedLngs: languages,
    fallbackLng,      // langue fallback si pas trouvée
    lng,              // langue active
    fallbackNS: defaultNS,
    defaultNS,
    ns,               // namespace(s) à charger
  };
}
