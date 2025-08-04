'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation'; // Importer usePathname pour obtenir le chemin actuel
import { useRouter } from 'next/navigation'; // Importez useRouter pour la navigation
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageCode } from '@/types'; // Assurez-vous que ce type est bien défini
import { CheckCircle, XCircle, Circle } from 'lucide-react'; // Icônes pour les étapes

import styles from './register.module.css'; // Assurez-vous que le chemin du CSS module est correct

// --- Traductions ---
const allTranslations = {
  onboarding: {
    // ... (les autres étapes inchangées)

    stepProfile: {
      en: 'Profile',
      fr: 'Profil',
      mi: 'Kōtaha',
      ga: 'Próifíl',
      hi: 'प्रोफ़ाइल',
      gd: 'Pròifìl',
      'en-AU': 'Profile',
      'en-NZ': 'Profile',
      'en-CA': 'Profile',
      'fr-CA': 'Profil',
      'en-ZA': 'Profiel',
      af: 'Profiel'
    },
    stepSecurity: {
      en: 'Security',
      fr: 'Sécurité',
      mi: 'Haumarutanga',
      ga: 'Slándáil',
      hi: 'सुरक्षा',
      gd: 'Tèarainteachd',
      'en-AU': 'Security',
      'en-NZ': 'Security',
      'en-CA': 'Security',
      'fr-CA': 'Sécurité',
      'en-ZA': 'Sekuriteit',
      af: 'Sekuriteit'
    },
    stepNotifications: { // Clé corrigée pour correspondre à l'utilisation
      en: 'Notifications',
      fr: 'Notifications',
      mi: 'Whakamōhiotanga',
      ga: 'Fógraí',
      hi: 'सूचनाएं',
      gd: 'Brathan',
      'en-AU': 'Notifications',
      'en-NZ': 'Notifications',
      'en-CA': 'Notifications',
      'fr-CA': 'Notifications',
      'en-ZA': 'Kennisgewings',
      af: 'Kennisgewings'
    },
    stepPrivacyPrefs: { // Clé corrigée
      en: 'Privacy Preferences',
      fr: 'Préférences de confidentialité',
      mi: 'Ngā Manakohanga Tūmataiti',
      ga: 'Sainroghanna Príobháideachta',
      hi: 'गोपनीयता वरीयताएँ',
      gd: 'Roghainnean Prìobhaideachd',
      'en-AU': 'Privacy Preferences',
      'en-NZ': 'Privacy Preferences',
      'en-CA': 'Privacy Preferences',
      'fr-CA': 'Préférences de confidentialité',
      'en-ZA': 'Privaatheidsvoorkeure',
      af: 'Privaatheidsvoorkeure'
    },
    stepSubscription: { // Clé corrigée
      en: 'Subscription / Payment',
      fr: 'Abonnement / Paiement',
      mi: 'Ohaurunga / Utu',
      ga: 'Síntiús / Íocaíocht',
      hi: 'सदस्यता / भुगतान',
      gd: 'Ballrachd / Pàigheadh',
      'en-AU': 'Subscription / Payment',
      'en-NZ': 'Subscription / Payment',
      'en-CA': 'Subscription / Payment',
      'fr-CA': 'Abonnement / Paiement',
      'en-ZA': 'Intekening / Betaling',
      af: 'Intekening / Betaling'
    },
    stepDataMgmt: { // Clé corrigée
      en: 'Data Download / Deletion',
      fr: 'Téléchargement / suppression des données',
      mi: 'Tikiake / Muku Raraunga',
      ga: 'Íoslódáil / Scriosadh Sonraí',
      hi: 'डेटा डाउनलोड / हटाना',
      gd: 'Luchdaich a-nuas / Sguab às dàta',
      'en-AU': 'Data Download / Deletion',
      'en-NZ': 'Data Download / Deletion',
      'en-CA': 'Data Download / Deletion',
      'fr-CA': 'Téléchargement / suppression des données',
      'en-ZA': 'Data-aflaai / Verwydering',
      af: 'Data-aflaai / Verwydering'
    },
    stepSupport: { // Clé corrigée
      en: 'Support / Contact',
      fr: 'Support / contact',
      mi: 'Tautoko / Whakapā',
      ga: 'Tacaíocht / Teagmháil',
      hi: 'सहायता / संपर्क',
      gd: 'Taic / Fios',
      'en-AU': 'Support / Contact',
      'en-NZ': 'Support / Contact',
      'en-CA': 'Support / Contact',
      'fr-CA': 'Support / contact',
      'en-ZA': 'Ondersteuning / Kontak',
      af: 'Ondersteuning / Kontak'
    },

    // Tu peux aussi conserver l’ancien stepSettings s’il est utilisé ailleurs
    stepSettings: {
      en: 'Settings',
      fr: 'Paramètres',
      mi: 'Tautuhinga',
      ga: 'Suíomhanna',
      hi: 'सेटिंग्स',
      gd: 'Rèiteachaidhean',
      'en-AU': 'Settings',
      'en-NZ': 'Settings',
      'en-CA': 'Settings',
      'fr-CA': 'Paramètres',
      'en-ZA': 'Instellings',
      af: 'Instellings'
    },

    // Ajout des traductions manquantes utilisées dans getStepStatus
    statusPending: {
      en: 'Pending',
      fr: 'En attente',
      mi: 'Tāria',
      ga: 'Ag fanacht',
      hi: 'लंबित',
      gd: 'A’ feitheamh',
      'en-AU': 'Pending',
      'en-NZ': 'Pending',
      'en-CA': 'Pending',
      'fr-CA': 'En attente',
      'en-ZA': 'Hangende',
      af: 'Hangende'
    },
    statusCurrent: {
      en: 'Current',
      fr: 'Actuelle',
      mi: 'I tēnei wā',
      ga: 'Reatha',
      hi: 'वर्तमान',
      gd: 'An-dràsta',
      'en-AU': 'Current',
      'en-NZ': 'Current',
      'en-CA': 'Current',
      'fr-CA': 'Actuelle',
      'en-ZA': 'Huidige',
      af: 'Huidige'
    },
    statusCompleted: {
      en: 'Completed',
      fr: 'Terminée',
      mi: 'Kua oti',
      ga: 'Críochnaithe',
      hi: 'पूर्ण',
      gd: 'Crìochnaichte',
      'en-AU': 'Completed',
      'en-NZ': 'Completed',
      'en-CA': 'Completed',
      'fr-CA': 'Terminée',
      'en-ZA': 'Voltooid',
      af: 'Voltooid'
    },
    
    // Traductions pour le bloc de développement
    developmentTitle: {
      en: 'Under Development',
      fr: 'En cours de développement',
      mi: 'Kei te whakawhanakehia',
      ga: 'Faoi Fhorbairt',
      hi: 'विकास के अधीन',
      gd: 'Fo leasachadh',
      'en-AU': 'Under Development',
      'en-NZ': 'Under Development',
      'en-CA': 'Under Development',
      'fr-CA': 'En cours de développement',
      'en-ZA': 'Onder Ontwikkeling',
      af: 'Onder Ontwikkeling'
    },
    developmentMessage: {
      en: 'This section is currently under construction. We are working hard to bring you new features!',
      fr: 'Cette section est actuellement en cours de construction. Nous travaillons dur pour vous apporter de nouvelles fonctionnalités !',
      mi: 'Kei te hangaia tonu tenei waahanga. Kei te kaha taatau ki te kawe mai i nga ahuatanga hou ki a koe!',
      ga: 'Tá an chuid seo á thógáil suas faoi láthair. Táimid ag obair go crua chun gnéithe nua a thabhairt chugat!',
      hi: 'यह अनुभाग वर्तमान में निर्माण के अधीन है। हम आपको नई सुविधाएँ लाने के लिए कड़ी मेहनत कर रहे हैं!',
      gd: 'Tha an roinn seo fo thogail an-dràsta. Tha sinn ag obair gu cruaidh gus feartan ùra a thoirt thugad!',
      'en-AU': 'This section is currently under construction. We are working hard to bring you new features!',
      'en-NZ': 'This section is currently under construction. We are working hard to bring you new features!',
      'en-CA': 'This section is currently under construction. We are working hard to bring you new features!',
      'fr-CA': 'Cette section est actuellement en cours de construction. Nous travaillons dur pour vous apporter de nouvelles fonctionnalités !',
      'en-ZA': 'Hierdie afdeling is tans onder konstruksie. Ons werk hard om nuwe funksies aan te bied!',
      af: 'Hierdie afdeling is tans onder konstruksie. Ons werk hard om nuwe funksies aan te bied!'
    },
    betaTag: {
      en: 'Beta Version',
      fr: 'Version Bêta',
      mi: 'Putanga Beta',
      ga: 'Leagan Beta',
      hi: 'बीटा संस्करण',
      gd: 'Tionndadh Beta',
      'en-AU': 'Beta Version',
      'en-NZ': 'Beta Version',
      'en-CA': 'Beta Version',
      'fr-CA': 'Version Bêta',
      'en-ZA': 'Beta Weergawe',
      af: 'Beta Weergawe'
    },
    stayTuned: {
      en: 'Stay tuned for updates!',
      fr: 'Restez à l\'écoute pour les mises à jour !',
      mi: 'Noho hei kaikōrero mo nga whakahoutanga!',
      ga: 'Fan tiúnta le haghaidh nuashonruithe!',
      hi: 'अद्यतनों के लिए ट्यून रहें!',
      gd: 'Fuirich airson ùrachaidhean!',
      'en-AU': 'Stay tuned for updates!',
      'en-NZ': 'Stay tuned for updates!',
      'en-CA': 'Stay tuned for updates!',
      'fr-CA': 'Restez à l\'écoute pour les mises à jour !',
      'en-ZA': 'Bly ingeskakel vir opdaterings!',
      af: 'Bly ingeskakel vir opdaterings!'
    },
    copyright: {
      en: 'Your Company Name. All rights reserved.',
      fr: 'Nom de votre entreprise. Tous droits réservés.',
      mi: 'Ingoa Kamupene Kai. Pānga katoa te mana.',
      ga: 'Ainm do Chuideachta. Gach ceart ar cosaint.',
      hi: 'आपकी कंपनी का नाम। सर्वाधिकार सुरक्षित।',
      gd: 'Ainm do Chompanaidh. Gach còir glèidhte.',
      'en-AU': 'Your Company Name. All rights reserved.',
      'en-NZ': 'Your Company Name. All rights reserved.',
      'en-CA': 'Your Company Name. All rights reserved.',
      'fr-CA': 'Nom de votre entreprise. Tous droits réservés.',
      'en-ZA': 'UJou Maatskappy Naam. Alle regte voorbehou.',
      af: 'Jou Maatskappy Naam. Alle regte voorbehou.'
    }
  }
};

function getTranslation(section: keyof typeof allTranslations, keyPath: string, lang: LanguageCode): string {
  const keys = keyPath.split('.');
  let value: any = allTranslations[section];

  for (const key of keys) {
    if (!value || typeof value !== 'object') {
      console.warn(`Translation path not found for: ${section}.${keyPath}`);
      return `[${keyPath} not found]`;
    }
    value = value[key];
  }

  if (typeof value !== 'object' || value === null || !('en' in value)) {
    console.warn(`Translation structure invalid for: ${section}.${keyPath}`);
    return `[Invalid structure for ${keyPath}]`;
  }

  // Retourne la traduction pour la langue demandée, sinon la version anglaise, ou une chaîne vide si rien n'est trouvé.
  return (value as { [l: string]: string })[lang] || (value as { [l: string]: string }).en || '';
};

interface Step {
  path: string;
  labelKey: keyof typeof allTranslations.onboarding; // Utilisation d'un type pour les clés de traduction
  icon?: React.ElementType; // L'icône peut être optionnelle
  iconColor?: string;
  statusKey?: keyof typeof allTranslations.onboarding; // Clé pour le statut (ex: statusPending)
  isCurrent?: boolean;
  isDisabled?: boolean;
}

export default function RegisterPage() {
  const { language } = useLanguage();
  const { theme } = useTheme();
  const router = useRouter();

  // Utilise usePathname pour obtenir le chemin actuel
  const currentPath = usePathname();
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  // Définition des étapes du flux
  const onboardingSteps: Step[] = [
    { path: '/login', labelKey: 'stepProfile', icon: Circle }, // Étape Login (accessible) - Correction chemin
    { path: '/register', labelKey: 'stepSecurity', icon: Circle }, // Étape Register (actuellement informative) - Correction chemin
    { path: '/notifications', labelKey: 'stepNotifications', icon: Circle }, // Maintenant accessible - Correction clé
    { path: '/privacy-policy', labelKey: 'stepPrivacyPrefs', icon: Circle, isDisabled: true }, // Désactivé pour l'instant - Correction chemin et clé
    { path: '/subscription', labelKey: 'stepSubscription', icon: Circle, isDisabled: true }, // Correction chemin et clé
    { path: '/pricing', labelKey: 'stepProfile', icon: Circle, isDisabled: true }, // Correction clé
    { path: '/pay', labelKey: 'stepSubscription', icon: Circle, isDisabled: true }, // Correction clé
    // { path: '/profile', labelKey: 'stepProfile', icon: Circle, isDisabled: true }, // Doublon du chemin '/login' avec label 'stepProfile', suppression pour éviter confusion
  ];

  // Mettre à jour l'état de l'étape active lorsque le chemin change
  useEffect(() => {
    if (!currentPath) return;

    const currentIndex = onboardingSteps.findIndex(step => step.path === currentPath);
    if (currentIndex !== -1) {
      setActiveStepIndex(currentIndex);
    } else {
      // Si le chemin actuel n'est pas une étape définie, on ne change pas l'index.
      // Cela maintient l'indicateur sur la dernière étape atteinte.
      // Si vous voulez que l'indicateur revienne à 0 ou à la première étape
      // lorsque le chemin n'est pas reconnu, décommentez la ligne suivante :
      // setActiveStepIndex(0);
    }
  }, [currentPath, onboardingSteps]);


  // Fonction pour déterminer l'état de l'étape (icône, couleur, statut)
  const getStepStatus = (step: Step, index: number) => {
    // L'étape est complétée si son index est inférieur à l'index actif ET qu'elle n'est pas désactivée.
    const isCompleted = index < activeStepIndex && !step.isDisabled;
    // L'étape est actuelle si son index correspond à l'index actif ET qu'elle n'est pas désactivée.
    const isCurrent = index === activeStepIndex && !step.isDisabled;

    if (step.isDisabled) {
      // Si l'étape est désactivée
      return { icon: XCircle, color: 'gray', status: getTranslation('onboarding', 'statusPending', language) };
    }
    if (isCurrent) {
      // Pour l'étape actuelle, on utilise la couleur bleue (ou la couleur définie pour l'étape actuelle)
      return { icon: Circle, color: 'blue', status: getTranslation('onboarding', 'statusCurrent', language) };
    }
    if (isCompleted) {
      // Si l'étape est complétée
      return { icon: CheckCircle, color: 'green', status: getTranslation('onboarding', 'statusCompleted', language) };
    }
    // Sinon, l'étape est en attente (rouge)
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

  // Ceci est le contenu qui sera affiché pour chaque étape, basé sur currentPath
  const renderStepContent = () => {
    switch (currentPath) {
      case '/login': // Assurez-vous que ce chemin correspond à une étape définie
        return (
          <div style={{ width: '100%', marginTop: '3rem' }}>
            <h2 style={{ fontSize: '2rem', textAlign: 'center', marginBottom: '2rem' }}>Bienvenue sur la page de connexion</h2>
            <p style={{ textAlign: 'center', color: mutedTextColor }}>Contenu de la page de connexion...</p>
            {/* Intégrer ici le formulaire de connexion */}
          </div>
        );
      case '/register': // Assurez-vous que ce chemin correspond à une étape définie
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
      case '/privacy-policy': // Assurez-vous que ce chemin correspond à une étape définie
        return (
          <div style={{ width: '100%', marginTop: '3rem' }}>
            <h2 style={{ fontSize: '2rem', textAlign: 'center', marginBottom: '2rem' }}>Politique de Confidentialité</h2>
            <p style={{ color: mutedTextColor }}>Contenu de la politique de confidentialité...</p>
            {/* Intégrer ici le composant PrivacyPolicyPage */}
          </div>
        );
      case '/terms': // Assurez-vous que ce chemin correspond à une étape définie
        return (
          <div style={{ width: '100%', marginTop: '3rem' }}>
            <h2 style={{ fontSize: '2rem', textAlign: 'center', marginBottom: '2rem' }}>Conditions d'Utilisation</h2>
            <p style={{ color: mutedTextColor }}>Contenu des conditions d'utilisation...</p>
            {/* Intégrer ici le composant TermsPage */}
          </div>
        );
      // Ajoutez des cas similaires pour /settings, /pricing, /pay, /profile si nécessaire et s'ils sont dans onboardingSteps
      default:
        // Si le chemin actuel ne correspond à aucune étape définie, on peut afficher un contenu par défaut
        // ou le laisser vide. Ici, on affiche un message simple.
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
          // Détermine si l'étape actuelle est celle du lien
          const isCurrentLink = step.path === currentPath;

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
                    router.push(step.path);
                  }
                }}
              >
                <div style={{
                  width: '40px', height: '40px', borderRadius: '50%',
                  backgroundColor: color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: '0.5rem',
                  border: `2px solid ${theme === 'dark' ? '#FFFFFF' : '#000000'}`,
                  position: 'relative',
                }}>
                  {IconComponent && <IconComponent size={24} color={theme === 'dark' ? '#1A1A2E' : '#FFFFFF'} />}
                  <span style={{
                    position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                    fontSize: '0.8rem', color: theme === 'dark' ? '#1A1A2E' : '#FFFFFF', fontWeight: 'bold'
                  }}>{index + 1}</span>
                </div>
                <span style={{
                  fontSize: '0.9rem',
                  // Applique le style de l'étape actuelle uniquement si c'est le lien actuel et qu'elle n'est pas désactivée
                  color: isCurrentLink && !step.isDisabled ? progressTrackColor : mutedTextColor,
                  fontWeight: isCurrentLink && !step.isDisabled ? 'bold' : 'normal',
                  whiteSpace: 'nowrap',
                }}>
                  {getTranslation('onboarding', step.labelKey, language)}
                </span>
                {stepStatus && <span style={{ fontSize: '0.7rem', color: mutedTextColor }}>({stepStatus})</span>}
              </div>

              {!isLastStep && (
                <div style={{
                  flexGrow: 1,
                  height: '2px',
                  backgroundColor: separatorColor,
                  marginLeft: '0.5rem', marginRight: '0.5rem',
                  position: 'relative',
                }}>
                  <div style={{
                    position: 'absolute', top: '-4px', left: '0', height: '100%',
                    // La largeur de la barre de progression est basée sur l'index actif moins l'index actuel,
                    // garantissant que la progression est visible jusqu'à l'étape précédente.
                    width: (index < activeStepIndex) ? '100%' : '0%',
                    backgroundColor: progressTrackColor,
                    transition: 'width 0.3s ease-in-out',
                  }}></div>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

  

      <p style={{ textAlign: 'center', marginTop: '4rem', fontSize: '0.8rem', color: mutedTextColor }}>
        © <span suppressHydrationWarning>{new Date().getFullYear()}</span> {getTranslation('onboarding', 'copyright', language)}
      </p>
    </div>
  );
}