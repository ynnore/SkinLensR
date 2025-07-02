// Fichier : src/translations/translations.ts
// CE FICHIER CONTIENT TOUTES VOS TRADUCTIONS CENTRALISÉES
// Tous les composants (page.tsx, Sidebar.tsx) importeront cet objet 'translations'.

import { LanguageCode } from '@/types'; // Assurez-vous que le chemin est correct

interface TranslationObject {
  [lang: string]: string; // Clé de langue à chaîne de caractères (ex: en: "Hello")
}

interface SectionTranslations {
  [key: string]: TranslationObject; // Clé de la section à TranslationObject (ex: beta: { en: "Beta", fr: "Bêta" })
}

interface AllTranslations {
  header: SectionTranslations;
  chat: SectionTranslations;
  welcome: SectionTranslations;
  sidebar: SectionTranslations;
  userMenu: SectionTranslations;
}

export const translations: AllTranslations = {
  header: {
    missionStatement: {
      fr: "Inspirés des tunneliers de Wellington à Arras, notre mission est de bâtir dans l’ombre ce qui, demain, percera la surface.",
      en: "Inspired by the Wellington Tunnelers of Arras, our mission is to build in the shadows what will, tomorrow, break through to the surface.",
      mi: "He mea whakahihiri mai i ngā kaikeri o raro o Te Whanganui-a-Tara ki Arras, ko tā mātou kaupapa he hanga i roto i te atarangi i ngā mea ka puta ki te mata āpōpopo.",
      ga: "Ar an taobh istigh de tholláin Wellington in Arras, is é ár misean tógáil sa scáth a bhrisfidh an dromchla amárach.",
      hi: "एरास में वेलिंगटन टनलर्स से प्रेरित होकर, हमारा मिशन छाया में वह निर्माण करना है जो कल सतह को भेद देगा।",
      gd: "Air a bhrosnachadh le Tunnelairean Wellington ann an Arras, is e ar misean togail anns an dubhar na nì, a-màireach, briseadh tro uachdar.",
      'en-AU': "Inspired by the Wellington Tunnelers of Arras, our mission is to build in the shadows what will, tomorrow, break through to the surface.",
      'en-NZ': "Inspired by the Wellington Tunnelers of Arras, our mission is to build in the shadows what will, tomorrow, break through to the surface.",
      'en-CA': "Inspired by the Wellington Tunnelers of Arras, our mission is to build in the shadows what will, tomorrow, break through to the surface.",
      'fr-CA': "Inspirés des tunneliers de Wellington à Arras, notre mission est de bâtir dans l’ombre ce qui, demain, percera la surface.",
      'en-ZA': "Inspired by the Wellington Tunnelers of Arras, our mission is to build in the shadows what will, tomorrow, break through to the surface.",
      af: "Geïnspireer deur die Wellington Tunneliers van Arras, is ons missie om in die skaduwee te bou wat môre sal deurbreek na die oppervlak.",
    },
    beta: {
      en: "Beta", fr: "Bêta", mi: "Beta", ga: "Béite", hi: "बीटा", gd: "Beta",
      'en-AU': "Beta", 'en-NZ': "Beta", 'en-CA': "Beta", 'fr-CA': "Bêta", 'en-ZA': "Beta", af: "Beta",
    }
  },
  chat: {
    welcomeMessage: {
      en: "Hello! I'm SkinLensR. How can I help you today?",
      fr: "Bonjour ! Je suis SkinLensR. Comment puis-je vous aider aujourd'hui ?",
      mi: "Kia ora! Ko SkinLensR ahau. Me pēhea taku āwhina i a koe i tēnei rā?",
      ga: "Dia duit! Is mise SkinLensR. Conas is féidir liom cabhrú leat inniu?", 
      hi: "नमस्ते! मैं स्किनलेंसआर हूँ। आज मैं आपकी कैसे मदद कर सकता हूँ?",       
      gd: "Halo! 'S mise SkinLensR. Ciamar as urrainn dhomh do chuideachadh an-diugh?", 
      'en-AU': "G'day! I'm SkinLensR. How can I help ya today?",                   
      'en-NZ': "Kia ora! I'm SkinLensR. How can I help you today?",                 
      'en-CA': "Hey there! I'm SkinLensR. How can I help you today, eh?",           
      'fr-CA': "Bonjour ! Je suis SkinLensR. Comment puis-je vous aider aujourd'hui ?", 
      'en-ZA': "Howzit! I'm SkinLensR. How can I help you today?",                 
      af: "Goeiedag! Ek is SkinLensR. Hoe kan ek jou vandag help?",                
    },
    thinking: {
      en: 'SkinLensR is thinking...',
      fr: 'SkinLensR réfléchit...',
      mi: 'Ke whakaaro a SkinLensR...',
      ga: 'Tá SkinLensR ag smaoineamh...',
      hi: 'स्किनलेंसआर सोच रहा है...',
      gd: 'Tha SkinLensR a\' smaoineachadh...',
      'en-AU': 'SkinLensR\'s thinkin\'...',
      'en-NZ': 'SkinLensR\'s thinking...',
      'en-CA': 'SkinLensR is thinking...',
      'fr-CA': 'SkinLensR réfléchit...',
      'en-ZA': 'SkinLensR is thinking...',
      af: 'SkinLensR dink...',
    },
    placeholder: {
      en: 'Type your message...',
      fr: 'Tapez votre message...',
      mi: 'Tēnā koa, tāpiri tō karere...',
      ga: 'Clóscríobh do theachtaireacht...',
      hi: 'अपना संदेश टाइप करें...',
      gd: 'Cuir a-steach do teachdaireachd...',
      'en-AU': 'Chuck your message in here...',
      'en-NZ': 'Type your message here...',
      'en-CA': 'Type your message...',
      'fr-CA': 'Écrivez votre message...',
      'en-ZA': 'Type your message...',
      af: 'Tik jou boodskap...',
    }
  },
  welcome: {
    headline: {
      en: 'Automate anything', fr: 'Automatisez tout', mi: 'Rangatira katoa',
      ga: 'Uathoibrigh rud ar bith', hi: 'कुछ भी स्वचालित करें', gd: 'Uatamaich rud sam bith',
      'en-AU': 'Automate anything, mate', 'en-NZ': 'Automate anything', 'en-CA': 'Automate anything',
      'fr-CA': 'Automatisez tout', 'en-ZA': 'Automate anything', af: 'Outomatiseer enigiets',
    },
    watch: {
      en: 'Watch', fr: 'Regarder', mi: 'Mātakitaki',
      ga: 'Féach', hi: 'देखो', gd: 'Coimhead',
      'en-AU': 'Watch', 'en-NZ': 'Watch', 'en-CA': 'Watch', 'fr-CA': 'Regarder',
      'en-ZA': 'Watch', af: 'Kyk',
    },
    intro: {
      en: 'Getting started with SkinLensR', fr: 'Bien démarrer avec SkinLensR', mi: 'Kei te timata ki SkinLensR',
      ga: 'Ag tosú le SkinLensR', hi: 'स्किनलेंसआर के साथ शुरुआत करना', gd: 'A\' tòiseachadh le SkinLensR',
      'en-AU': 'Getting started with SkinLensR', 'en-NZ': 'Getting started with SkinLensR', 'en-CA': 'Getting started with SkinLensR',
      'fr-CA': 'Bien démarrer avec SkinLensR', 'en-ZA': 'Getting started with SkinLensR', af: 'Begin met SkinLensR',
    },
    inputBar: {
      en: 'Type here to give a task to SkinLensR', fr: 'Tapez ici une tâche à confier à SkinLensR', mi: 'Tāpaea tēnei ki SkinLensR',
      ga: 'Clóscríobh anseo chun tasc a thabhairt do SkinLensR', hi: 'यहां स्किनलेंसआर को एक कार्य देने के लिए टाइप करें', gd: 'Sgrìobh an seo gus gnìomh a thoirt do SkinLensR',
      'en-AU': 'Type here to give a task to SkinLensR', 'en-NZ': 'Type here to give a task to SkinLensR', 'en-CA': 'Type here to give a task to SkinLensR',
      'fr-CA': 'Tapez ici une tâche à confier à SkinLensR', 'en-ZA': 'Type here to give a task to SkinLensR', af: 'Tik hier om SkinLensR \'n taak te gee',
    },
  },
  sidebar: {
    scan: { en: "Scan", fr: "Scanner", af: "Skandeer", mi: "Matawai", ga: "Scan (Irish)", hi: "स्कैन", gd: "Scan (Gàidhlig)", 'en-AU': "Scan", 'en-NZ': "Scan", 'en-CA': "Scan", 'fr-CA': "Scanner", 'en-ZA': "Scan" },
    dashboard: { en: "Dashboard", fr: "Tableau de bord", af: "Paneelbord", mi: "Papātohu", ga: "Dashboard (Irish)", hi: "डैशबोर्ड", gd: "Dashboard (Gàidhlig)", 'en-AU': "Dashboard", 'en-NZ': "Dashboard", 'en-CA': "Dashboard", 'fr-CA': "Tableau de Bord", 'en-ZA': "Dashboard" },
    files: { en: "Files", fr: "Fichiers", af: "Lêers", mi: "Kōnae", ga: "Files (Irish)", hi: "फ़ाइलें", gd: "Files (Gàidhlig)", 'en-AU': "Files", 'en-NZ': "Files", 'en-CA': "Files", 'fr-CA': "Fichiers", 'en-ZA': "Files" },
    connections: { en: "Connections", fr: "Connexions", af: "Verbindings", mi: "Hononga", ga: "Connections (Irish)", hi: "कनेक्शन", gd: "Connections (Gàidhlig)", 'en-AU': "Connections", 'en-NZ': "Connections", 'en-CA': "Connections", 'fr-CA': "Connexions", 'en-ZA': "Connections" },
    pay: { en: "Pay", fr: "Paiements", af: "Betaal", mi: "Utu", ga: "Pay (Irish)", hi: "भु भुगतान करें", gd: "Pay (Gàidhlig)", 'en-AU': "Pay", 'en-NZ': "Pay", 'en-CA': "Pay", 'fr-CA': "Paiements", 'en-ZA': "Pay" }, // Correction here
    settings: { en: "Settings", fr: "Paramètres", af: "Instellings", mi: "Tautuhitinga", ga: "Settings (Irish)", hi: "सेटिंग्स", gd: "Settings (Gàidhlig)", 'en-AU': "Settings", 'en-NZ': "Settings", 'en-CA': "Settings", 'fr-CA': "Paramètres", 'en-ZA': "Settings" },
    terms: { en: "Terms", fr: "Conditions", af: "Terme", mi: "Ture", ga: "Terms (Irish)", hi: "शर्तें", gd: "Terms (Gàidhlig)", 'en-AU': "Terms", 'en-NZ': "Terms", 'en-CA': "Terms", 'fr-CA': "Conditions", 'en-ZA': "Terms" },
    privacy: { en: "Privacy Policy", fr: "Politique de confidentialité", af: "Privaatheidsbeleid", mi: "Tūmataitinga", ga: "Privacy Policy (Irish)", hi: "गोपनीयता नीति", gd: "Privacy Policy (Gàidhlig)", 'en-AU': "Privacy Policy", 'en-NZ': "Privacy Policy", 'en-CA': "Privacy Policy", 'fr-CA': "Politique de confidentialité", 'en-ZA': "Privacy Policy" }
  },
  userMenu: {
    profile: { en: 'Profile', fr: 'Profil', af: 'Profiel', mi: 'Kōtaha', ga: 'Próifíl', hi: 'प्रोफ़ाइल', gd: 'Pròifil', 'en-AU': 'Profile', 'en-NZ': 'Profile', 'en-CA': 'Profile', 'fr-CA': 'Profil', 'en-ZA': 'Profile' },
    accountSettings: { en: 'Account Settings', fr: 'Réglages du compte', af: 'Rekeninginstellings', mi: 'Tautuhinga Pūkete', ga: 'Socruithe Cuntais', hi: 'खाता सेटिंग्स', gd: 'Roghainnean Cunntais', 'en-AU': 'Account Settings', 'en-NZ': 'Account Settings', 'en-CA': 'Account Settings', 'fr-CA': 'Réglages du compte', 'en-ZA': 'Account Settings' },
    logout: { en: 'Logout', fr: 'Déconnexion', af: 'Teken uit', mi: 'Takiputa', ga: 'Logáil Amach', hi: 'लॉग आउट', gd: 'Log a-mach', 'en-AU': 'Logout', 'en-NZ': 'Logout', 'en-CA': 'Logout', 'fr-CA': 'Déconnexion', 'en-ZA': 'Logout' }
  }
};