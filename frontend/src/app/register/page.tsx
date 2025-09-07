'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
// Importer usePathname et useRouter
import { usePathname, useRouter } from 'next/navigation';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageCode } from '@/types'; // Assurez-vous que ce type est correctement défini
import { CheckCircle, XCircle, Circle } from 'lucide-react';

import styles from './register.module.css'; // Assurez-vous que le chemin est correct

// --- Traductions ---
const allTranslations = {
  onboarding: {
    stepLogin: { en: 'Login', fr: 'Connexion', mi: 'Takiuru', hi: 'लॉगिन', gd: 'Log a-steach', af: 'Teken In' },
    stepRegister: { en: 'Register', fr: 'Inscription', mi: 'Rēhita', hi: 'पंजीकरण', gd: 'Clàradh', af: 'Registreer' },
    stepTerms: { en: 'Terms', fr: 'Conditions', mi: 'Ngā Tikanga', hi: 'शर्तें', gd: 'Cumhachan', af: 'Voorwaardes' },
    stepPrivacyPolicy: { en: 'Privacy Policy', fr: 'Politique de confidentialité', mi: 'Kaupapahere Tūmataiti', hi: 'गोपनीयता नीति', gd: 'Poileasaidh Prìobhaideachd', af: 'Privaatheidsbeleid' },
    stepSettings: { en: 'Settings', fr: 'Paramètres', mi: 'Tautuhinga', hi: 'सेटिंग्स', gd: 'Rèiteachaidhean', af: 'Instellings' },
    stepPricing: { en: 'Pricing', fr: 'Tarifs', mi: 'Utu', hi: 'मूल्य निर्धारण', gd: 'Prìsean', af: 'Prysing' },
    stepPay: { en: 'Payment', fr: 'Paiement', mi: 'Utu', hi: 'भुगतान', gd: 'Pàigheadh', af: 'Betaling' },
    stepProfile: { en: 'Profile', fr: 'Profil', mi: 'Kōtaha', hi: 'प्रोफ़ाइल', gd: 'Pròifìl', af: 'Profiel' },

    privacyIntro: { en: "Introduction", fr: "Introduction", mi: "Kupu Whakataki", hi: "परिचय", gd: "Ro-ràdh", af: "Inleiding" },
    privacyDataCollected: { en: "Data We Collect", fr: "Données que nous collectons", mi: "Ngā Raraunga Ka Kohia", hi: "हम जो डेटा एकत्र करते हैं", gd: "Dàta a chruinnicheas sinn", af: "Die data wat ons insamel" },
    privacyDataCollectionMethods: { en: "How We Collect Data", fr: "Comment nous collectons ces données", mi: "Me pēhea te Kohikohi Raraunga", hi: "हम डेटा कैसे इकट्ठा करते हैं", gd: "Mar a chruinnicheas sinn dàta", af: "Hoe ons data insamel" },
    privacyUsage: { en: "Why We Use Your Data", fr: "Pourquoi nous utilisons vos données", mi: "Te Take mō te Whakamahi Raraunga", hi: "हम आपके डेटा का उपयोग क्यों करते हैं", gd: "Carson a bhios sinn a’ cleachdadh d’ fhiosrachaidh", af: "Hoekom ons jou data gebruik" },
    privacySharing: { en: "Data Sharing", fr: "Partage de vos données", mi: "Te Tiri Raraunga", hi: "डेटा साझा करना", gd: "Co-roinneadh dàta", af: "Datadeling" },
    privacyRetention: { en: "Data Retention", fr: "Conservation des données", mi: "Te Rokiroki Raraunga", hi: "डेटा का संरक्षण", gd: "Glèidheadh dàta", af: "Dataretensie" },
    privacySecurity: { en: "Data Security", fr: "Sécurité des données", mi: "Te Haumarutanga Raraunga", hi: "डेटा सुरक्षा", gd: "Tèarainteachd dàta", af: "Datasekuriteit" },
    privacyRights: { en: "Your Rights", fr: "Vos droits", mi: "Ō Tika", hi: "आपके अधिकार", gd: "Na còraichean agad", af: "Jou regte" },
    privacyInternational: { en: "International Data Transfers", fr: "Transferts internationaux de données", mi: "Te Whakawhitiwhiti Raraunga ā-Ao", hi: "अंतरराष्ट्रीय डेटा स्थानांतरण", gd: "Gluasad dàta eadar-nàiseanta", af: "Internasionale data-oordragte" },
    privacyCookies: { en: "Use of Cookies", fr: "Utilisation des cookies", mi: "Te Whakamahi Pihikete", hi: "कुकीज़ का उपयोग", gd: "Cleachdadh bhriosgaidean", af: "Gebruik van koekies" },
    privacyThirdParties: { en: "Third-Party Services", fr: "Services tiers", mi: "Ngā Ratonga Tuatoru", hi: "तृतीय-पक्ष सेवाएँ", gd: "Seirbheisean treas-phàrtaidh", af: "Derdedienste" },
    privacyChanges: { en: "Changes to This Policy", fr: "Modifications de cette politique", mi: "Ngā Panonitanga ki tēnei Kaupapahere", hi: "इस नीति में परिवर्तन", gd: "Atharrachaidhean air a’ phoileasaidh seo", af: "Veranderinge aan hierdie beleid" },
    privacyContact: { en: "Contact", fr: "Contact", mi: "Whakapā", hi: "संपर्क", gd: "Cuir fios", af: "Kontak" },

    statusPending: { en: 'Pending', fr: 'En attente', mi: 'Tāria', hi: 'लंबित', gd: 'A’ feitheamh', af: 'Hangende' },
    statusCurrent: { en: 'Current', fr: 'En cours', mi: 'I tēnei wā', hi: 'वर्तमान', gd: 'An-dràsta', af: 'Huidige' },
    statusCompleted: { en: 'Completed', fr: 'Terminé', mi: 'Kua oti', hi: 'पूर्ण', gd: 'Crìochnaichte', af: 'Voltooid' },

    developmentTitle: { en: 'Under Development', fr: 'En cours de développement', mi: 'Kei te whakawhanakehia', hi: 'विकास के अधीन', gd: 'Fo leasachadh', af: 'Onder ontwikkeling' },
    developmentMessage: { en: 'This section is currently under construction. We are working hard to bring you new features!', fr: 'Cette section est actuellement en cours de construction. Nous travaillons dur pour vous apporter de nouvelles fonctionnalités !', mi: 'Kei te hangaia tonu tēnei wāhanga. Kei te kaha mātou ki te kawe mai i ngā āhuatanga hou ki a koe!', hi: 'यह अनुभाग वर्तमान में निर्माण के अधीन है। हम आपको नई सुविधाएँ लाने के लिए कड़ी मेहनत कर रहे हैं!', gd: 'Tha an earrann seo fo thogail an-dràsta. Tha sinn ag obair gu cruaidh gus feartan ùra a thoirt thugad!', af: 'Hierdie afdeling is tans onder konstruksie. Ons werk hard om nuwe funksies te bring!' },
    betaTag: { en: 'Beta Version', fr: 'Version Bêta', mi: 'Putanga Beta', hi: 'बीटा संस्करण', gd: 'Tionndadh Beta', af: 'Beta-weergawe' },
    stayTuned: { en: 'Stay tuned for updates!', fr: 'Restez à l’écoute pour les mises à jour !', mi: 'Noho hei kaikōrero mō ngā whakahōutanga!', hi: 'अद्यतनों के लिए ट्यून रहें!', gd: 'Fuirich airson ùrachaidhean!', af: 'Bly ingeskakel vir opdaterings!' },
    copyright: { en: 'Kiwi-Ops. All rights reserved.', fr: 'Kiwi-Ops. Tous droits réservés.', mi: 'Kiwi-Ops. Katoa ngā motika.', hi: 'Kiwi-Ops. सर्वाधिकार सुरक्षित।', gd: 'Kiwi-Ops. Gach còir glèidhte.', af: 'Kiwi-Ops. Alle regte voorbehou.' }
  }
};


function getTranslation(section: keyof typeof allTranslations, keyPath: string, lang: LanguageCode): string {
  const keys = keyPath.split('.');
  let value: any = allTranslations[section];

  for (const key of keys) {
    if (!value || typeof value !== 'object') {
      console.warn(`Translation path segment not found for: ${section}.${keyPath} (missing key: ${key})`);
      return `[${keyPath} missing]`; // Indique clairement quelle partie manque
    }
    value = value[key];
  }

  // Vérifie si la valeur finale est un objet avec une clé 'en' (pour le fallback)
  if (typeof value !== 'object' || value === null || !('en' in value)) {
    console.warn(`Translation structure invalid or missing fallback for: ${section}.${keyPath}`);
    return `[Invalid structure for ${keyPath}]`;
  }

  // Retourne la traduction pour la langue demandée, sinon la version anglaise, ou une chaîne vide si rien n'est trouvé.
  return (value as { [l: string]: string })[lang] || (value as { [l: string]: string }).en || '';
};

interface Step {
  path: string;
  labelKey: keyof typeof allTranslations.onboarding; // Utilise le type pour les clés de traduction valides
  icon: React.ElementType;
  iconColor?: string;
  statusKey?: keyof typeof allTranslations.onboarding; // Clé pour le statut (ex: statusPending)
  isDisabled?: boolean;
}

export default function RegisterPage() {
  const { language } = useLanguage();
  const { theme } = useTheme();
  const router = useRouter(); // useRouter est nécessaire pour la navigation

  const currentPath = usePathname();
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  // Définition des étapes du flux
  const onboardingSteps: Step[] = [
    { path: '/login', labelKey: 'stepLogin', icon: Circle, isDisabled: false },
    { path: '/register', labelKey: 'stepRegister', icon: Circle, isDisabled: false },
    // Étapes de la politique de confidentialité
    { path: '/privacy-intro', labelKey: 'privacyIntro', icon: Circle, isDisabled: false }, // J'ai mis isDisabled à false pour la première étape
    { path: '/privacy-data-collected', labelKey: 'privacyDataCollected', icon: Circle, isDisabled: false },
    { path: '/privacy-collection-methods', labelKey: 'privacyDataCollectionMethods', icon: Circle, isDisabled: false },
    { path: '/privacy-usage', labelKey: 'privacyUsage', icon: Circle, isDisabled: false },
    { path: '/privacy-sharing', labelKey: 'privacySharing', icon: Circle, isDisabled: false },
    { path: '/privacy-retention', labelKey: 'privacyRetention', icon: Circle, isDisabled: false },
    { path: '/privacy-security', labelKey: 'privacySecurity', icon: Circle, isDisabled: false },
    { path: '/privacy-rights', labelKey: 'privacyRights', icon: Circle, isDisabled: false },
    { path: '/privacy-international', labelKey: 'privacyInternational', icon: Circle, isDisabled: false },
    { path: '/privacy-cookies', labelKey: 'privacyCookies', icon: Circle, isDisabled: false },
    { path: '/privacy-third-parties', labelKey: 'privacyThirdParties', icon: Circle, isDisabled: false },
    { path: '/privacy-changes', labelKey: 'privacyChanges', icon: Circle, isDisabled: false },
    { path: '/privacy-contact', labelKey: 'privacyContact', icon: Circle, isDisabled: false },
    // Autres étapes
    { path: '/terms', labelKey: 'stepTerms', icon: Circle, isDisabled: false }, // Assurez-vous que ce chemin est unique
    { path: '/settings', labelKey: 'stepSettings', icon: Circle, isDisabled: false },
    { path: '/pricing', labelKey: 'stepPricing', icon: Circle, isDisabled: false },
    { path: '/pay', labelKey: 'stepPay', icon: Circle, isDisabled: false },
    { path: '/profile', labelKey: 'stepProfile', icon: Circle, isDisabled: false },
  ];

  // Mettre à jour l'état de l'étape active lorsque le chemin change
  useEffect(() => {
    if (!currentPath) return;

    const currentIndex = onboardingSteps.findIndex(step => step.path === currentPath);
    if (currentIndex !== -1) {
      setActiveStepIndex(currentIndex);
    } else {
      // Si le chemin actuel ne correspond à aucune étape définie, on peut réinitialiser ou laisser tel quel.
      // Pour l'instant, on ne fait rien, l'indicateur reste sur la dernière étape trouvée.
    }
  }, [currentPath, onboardingSteps]);

  // Fonction pour déterminer l'état de l'étape (icône, couleur, statut)
  const getStepStatus = (step: Step, index: number) => {
    const isCompleted = index < activeStepIndex && !step.isDisabled;
    const isCurrent = index === activeStepIndex && !step.isDisabled;

    if (step.isDisabled) {
      return { icon: XCircle, color: 'gray', status: getTranslation('onboarding', 'statusPending', language) };
    }
    if (isCurrent) {
      // Utilise progressTrackColor pour l'étape actuelle, défini en dehors de cette fonction.
      return { icon: Circle, color: progressTrackColor, status: getTranslation('onboarding', 'statusCurrent', language) };
    }
    if (isCompleted) {
      return { icon: CheckCircle, color: 'green', status: getTranslation('onboarding', 'statusCompleted', language) };
    }
    // Par défaut, si non désactivé, non actuel, non complété, il est en attente (rouge)
    return { icon: XCircle, color: 'red', status: getTranslation('onboarding', 'statusPending', language) };
  };

  // Styles basés sur le thème
  const textColor = theme === 'dark' ? '#E0E0E0' : '#333333';
  const mutedTextColor = theme === 'dark' ? '#A0A0A0' : '#666666';
  const borderColor = theme === 'dark' ? '#555555' : '#AAAAAA';
  const backgroundColorPage = theme === 'dark' ? '#1A1A2E' : '#FFFFFF';
  const separatorColor = theme === 'dark' ? '#444444' : '#DDDDDD';
  const progressTrackColor = theme === 'dark' ? '#4A90E2' : '#0070f3'; // Couleur pour la progression

  // Styles pour le bloc de développement
  const warningBackground = theme === 'dark' ? '#3A2A2A' : '#FFF3F3';
  const warningText = theme === 'dark' ? '#FFCACA' : '#CC0000';
  const warningBorder = theme === 'dark' ? '#FFCACA' : '#CC0000';
  const shadowColorCard = theme === 'dark' ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.2)';

  // Rend le contenu spécifique à la page actuelle
  const renderPageContent = () => {
    switch (currentPath) {
      case '/login':
        return (
          <div style={{ width: '100%', marginTop: '3rem' }}>
            <h2 style={{ fontSize: '2rem', textAlign: 'center', marginBottom: '2rem' }}>Bienvenue sur la page de connexion</h2>
            <p style={{ textAlign: 'center', color: mutedTextColor }}>Contenu de la page de connexion...</p>
            {/* Intégrer ici le formulaire de connexion */}
          </div>
        );
      case '/register': // Le chemin '/register' n'est plus dans onboardingSteps, donc il n'aura pas d'indicateur de progression.
        return (
          <div style={{
            width: '100%',
            marginTop: '3rem',
            padding: '2rem',
            border: `2px dashed ${warningBorder}`,
            borderRadius: '8px',
            backgroundColor: warningBackground,
            color: warningText,
            textAlign: 'center',
            boxShadow: `4px 4px 0px ${shadowColorCard}`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '200px',
          }}>
            <h2 style={{
              fontSize: '2rem',
              marginBottom: '1rem',
              color: warningText,
              fontFamily: "'Playfair Display', serif",
              fontWeight: 'bold',
              textTransform: 'uppercase'
            }}>
              {getTranslation('onboarding', 'developmentTitle', language)}
            </h2>
            <p style={{
              fontSize: '1.2rem',
              fontStyle: 'italic',
              color: mutedTextColor,
              maxWidth: '700px'
            }}>
              {getTranslation('onboarding', 'developmentMessage', language)}
            </p>
            <p style={{
              fontSize: '1.1rem',
              marginTop: '1.5rem',
              fontWeight: 'bold',
              color: warningText
            }}>
              {getTranslation('onboarding', 'betaTag', language)} – {getTranslation('onboarding', 'stayTuned', language)}
            </p>
          </div>
        );
      // Les cas pour les étapes de la politique de confidentialité sont ajoutés ici.
      case '/privacy-intro':
        return (
          <div style={{ width: '100%', marginTop: '3rem' }}>
            <h2 style={{ fontSize: '2rem', textAlign: 'center', marginBottom: '2rem' }}>
              {getTranslation('onboarding', 'privacyIntro', language)}
            </h2>
            <p style={{ color: mutedTextColor }}>Contenu pour l'introduction de la politique de confidentialité...</p>
          </div>
        );
      case '/privacy-data-collected':
        return (
          <div style={{ width: '100%', marginTop: '3rem' }}>
            <h2 style={{ fontSize: '2rem', textAlign: 'center', marginBottom: '2rem' }}>
              {getTranslation('onboarding', 'privacyDataCollected', language)}
            </h2>
            <p style={{ color: mutedTextColor }}>Contenu sur les données collectées...</p>
          </div>
        );
      case '/privacy-collection-methods':
        return (
          <div style={{ width: '100%', marginTop: '3rem' }}>
            <h2 style={{ fontSize: '2rem', textAlign: 'center', marginBottom: '2rem' }}>
              {getTranslation('onboarding', 'privacyDataCollectionMethods', language)}
            </h2>
            <p style={{ color: mutedTextColor }}>Contenu sur les méthodes de collecte...</p>
          </div>
        );
      case '/privacy-usage':
        return (
          <div style={{ width: '100%', marginTop: '3rem' }}>
            <h2 style={{ fontSize: '2rem', textAlign: 'center', marginBottom: '2rem' }}>
              {getTranslation('onboarding', 'privacyUsage', language)}
            </h2>
            <p style={{ color: mutedTextColor }}>Contenu sur l'utilisation des données...</p>
          </div>
        );
      case '/privacy-sharing':
        return (
          <div style={{ width: '100%', marginTop: '3rem' }}>
            <h2 style={{ fontSize: '2rem', textAlign: 'center', marginBottom: '2rem' }}>
              {getTranslation('onboarding', 'privacySharing', language)}
            </h2>
            <p style={{ color: mutedTextColor }}>Contenu sur le partage des données...</p>
          </div>
        );
      case '/privacy-retention':
        return (
          <div style={{ width: '100%', marginTop: '3rem' }}>
            <h2 style={{ fontSize: '2rem', textAlign: 'center', marginBottom: '2rem' }}>
              {getTranslation('onboarding', 'privacyRetention', language)}
            </h2>
            <p style={{ color: mutedTextColor }}>Contenu sur la conservation des données...</p>
          </div>
        );
      case '/privacy-security':
        return (
          <div style={{ width: '100%', marginTop: '3rem' }}>
            <h2 style={{ fontSize: '2rem', textAlign: 'center', marginBottom: '2rem' }}>
              {getTranslation('onboarding', 'privacySecurity', language)}
            </h2>
            <p style={{ color: mutedTextColor }}>Contenu sur la sécurité des données...</p>
          </div>
        );
      case '/privacy-rights':
        return (
          <div style={{ width: '100%', marginTop: '3rem' }}>
            <h2 style={{ fontSize: '2rem', textAlign: 'center', marginBottom: '2rem' }}>
              {getTranslation('onboarding', 'privacyRights', language)}
            </h2>
            <p style={{ color: mutedTextColor }}>Contenu sur vos droits...</p>
          </div>
        );
      case '/privacy-international':
        return (
          <div style={{ width: '100%', marginTop: '3rem' }}>
            <h2 style={{ fontSize: '2rem', textAlign: 'center', marginBottom: '2rem' }}>
              {getTranslation('onboarding', 'privacyInternational', language)}
            </h2>
            <p style={{ color: mutedTextColor }}>Contenu sur les transferts internationaux...</p>
          </div>
        );
      case '/privacy-cookies':
        return (
          <div style={{ width: '100%', marginTop: '3rem' }}>
            <h2 style={{ fontSize: '2rem', textAlign: 'center', marginBottom: '2rem' }}>
              {getTranslation('onboarding', 'privacyCookies', language)}
            </h2>
            <p style={{ color: mutedTextColor }}>Contenu sur l'utilisation des cookies...</p>
          </div>
        );
      case '/privacy-third-parties':
        return (
          <div style={{ width: '100%', marginTop: '3rem' }}>
            <h2 style={{ fontSize: '2rem', textAlign: 'center', marginBottom: '2rem' }}>
              {getTranslation('onboarding', 'privacyThirdParties', language)}
            </h2>
            <p style={{ color: mutedTextColor }}>Contenu sur les services tiers...</p>
          </div>
        );
      case '/privacy-changes':
        return (
          <div style={{ width: '100%', marginTop: '3rem' }}>
            <h2 style={{ fontSize: '2rem', textAlign: 'center', marginBottom: '2rem' }}>
              {getTranslation('onboarding', 'privacyChanges', language)}
            </h2>
            <p style={{ color: mutedTextColor }}>Contenu sur les modifications de la politique...</p>
          </div>
        );
      case '/privacy-contact':
        return (
          <div style={{ width: '100%', marginTop: '3rem' }}>
            <h2 style={{ fontSize: '2rem', textAlign: 'center', marginBottom: '2rem' }}>
              {getTranslation('onboarding', 'privacyContact', language)}
            </h2>
            <p style={{ color: mutedTextColor }}>Contenu de contact...</p>
          </div>
        );
      case '/terms':
        return (
          <div style={{ width: '100%', marginTop: '3rem' }}>
            <h2 style={{ fontSize: '2rem', textAlign: 'center', marginBottom: '2rem' }}>
              {getTranslation('onboarding', 'stepTerms', language)} {/* Utilisation du label de l'étape pour le titre */}
            </h2>
            <p style={{ color: mutedTextColor }}>Contenu des conditions d'utilisation...</p>
          </div>
        );
      case '/settings':
        return (
          <div style={{ width: '100%', marginTop: '3rem' }}>
            <h2 style={{ fontSize: '2rem', textAlign: 'center', marginBottom: '2rem' }}>
              {getTranslation('onboarding', 'stepSettings', language)}
            </h2>
            <p style={{ color: mutedTextColor }}>Contenu des paramètres...</p>
          </div>
        );
      case '/pricing':
        return (
          <div style={{ width: '100%', marginTop: '3rem' }}>
            <h2 style={{ fontSize: '2rem', textAlign: 'center', marginBottom: '2rem' }}>
              {getTranslation('onboarding', 'stepPricing', language)}
            </h2>
            <p style={{ color: mutedTextColor }}>Contenu des tarifs...</p>
          </div>
        );
      case '/pay':
        return (
          <div style={{ width: '100%', marginTop: '3rem' }}>
            <h2 style={{ fontSize: '2rem', textAlign: 'center', marginBottom: '2rem' }}>
              {getTranslation('onboarding', 'stepPay', language)}
            </h2>
            <p style={{ color: mutedTextColor }}>Contenu de paiement...</p>
          </div>
        );
      case '/profile':
        return (
          <div style={{ width: '100%', marginTop: '3rem' }}>
            <h2 style={{ fontSize: '2rem', textAlign: 'center', marginBottom: '2rem' }}>
              {getTranslation('onboarding', 'stepProfile', language)}
            </h2>
            <p style={{ color: mutedTextColor }}>Contenu du profil...</p>
          </div>
        );
      default:
        // Si le chemin actuel ne correspond à aucune étape définie, affichez un message par défaut.
        return (
          <div style={{ width: '100%', marginTop: '3rem', textAlign: 'center' }}>
            <p style={{ color: mutedTextColor }}>
              Contenu non défini pour le chemin : {currentPath}
            </p>
          </div>
        );
    }
  };


  return (
    <div style={{
      padding: '2rem',
      maxWidth: '1000px',
      margin: '0 auto',
      backgroundColor: backgroundColorPage,
      color: textColor,
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      fontFamily: "'Arial', sans-serif",
    }}>
      {/* Barre de progression visuelle */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        marginBottom: '3rem',
        padding: '1rem 0',
        borderBottom: `1px solid ${borderColor}`,
        position: 'relative',
      }}>
        {onboardingSteps.map((step, index) => {
          const { icon: IconComponent, color, status: stepStatus } = getStepStatus(step, index);
          const isLastStep = index === onboardingSteps.length - 1;
          // Détermine si l'étape actuelle correspond au chemin affiché
          const isCurrentPath = step.path === currentPath;

          return (
            <React.Fragment key={step.path}>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  flex: 1,
                  textAlign: 'center',
                  cursor: step.isDisabled ? 'not-allowed' : 'pointer',
                  opacity: step.isDisabled ? 0.6 : 1,
                  padding: '0.5rem',
                }}
                onClick={() => {
                  if (!step.isDisabled) {
                    router.push(step.path); // Utilise le router pour la navigation
                  }
                }}
              >
                <div style={{
                  width: '40px', height: '40px', borderRadius: '50%',
                  backgroundColor: color, // La couleur est déterminée par getStepStatus
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: '0.5rem',
                  border: `2px solid ${theme === 'dark' ? '#FFFFFF' : '#000000'}`, // Bordure de l'icône
                  position: 'relative',
                }}>
                  {IconComponent && <IconComponent size={24} color={theme === 'dark' ? '#1A1A2E' : '#FFFFFF'} />} {/* Rend l'icône si elle existe */}
                  <span style={{ // Numéro de l'étape
                    position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                    fontSize: '0.8rem', color: theme === 'dark' ? '#1A1A2E' : '#FFFFFF', fontWeight: 'bold'
                  }}>{index + 1}</span>
                </div>
                <span style={{
                  fontSize: '0.9rem',
                  // Applique le style de l'étape actuelle (couleur et gras) si c'est le chemin actuel et qu'elle n'est pas désactivée
                  color: isCurrentPath && !step.isDisabled ? progressTrackColor : mutedTextColor,
                  fontWeight: isCurrentPath && !step.isDisabled ? 'bold' : 'normal',
                  whiteSpace: 'nowrap',
                }}>
                  {getTranslation('onboarding', step.labelKey, language)} {/* Traduction du label */}
                </span>
                {stepStatus && <span style={{ fontSize: '0.7rem', color: mutedTextColor }}>({stepStatus})</span>} {/* Statut traduit */}
              </div>

              {!isLastStep && (
                <div style={{
                  flexGrow: 1,
                  height: '2px',
                  backgroundColor: separatorColor, // Couleur du séparateur
                  marginLeft: '0.5rem', marginRight: '0.5rem',
                  position: 'relative',
                }}>
                  <div style={{ // Barre de progression remplie
                    position: 'absolute', top: '-4px', left: '0', height: '100%',
                    // La largeur de la barre de progression est basée sur l'index actif moins l'index actuel,
                    // garantissant que la progression est visible jusqu'à l'étape précédente.
                    width: (index < activeStepIndex) ? '100%' : '0%',
                    backgroundColor: progressTrackColor, // Utilise la couleur de progression définie
                    transition: 'width 0.3s ease-in-out', // Animation douce
                  }}></div>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Contenu principal de la page, géré par la fonction renderPageContent */}
      {renderPageContent()}

      <p style={{ textAlign: 'center', marginTop: '4rem', fontSize: '0.8rem', color: mutedTextColor }}>
        © <span suppressHydrationWarning>{new Date().getFullYear()}</span> {getTranslation('onboarding', 'copyright', language)}
      </p>
    </div>
  );
}