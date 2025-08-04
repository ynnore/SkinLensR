'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageCode } from '@/types'; // Assurez-vous que ce type est correctement défini
import { CheckCircle, XCircle, Circle } from 'lucide-react';
import styles from './register.module.css'; // Assurez-vous que le chemin est correct

// --- Traductions ---
const allTranslations = {
  onboarding: {
    // Labels pour les étapes de navigation
    stepLogin: { en: 'Login', fr: 'Connexion', mi: 'Takiuru', ga: 'Logáil', hi: 'लॉग इन', gd: 'Log a-steach', 'en-AU': 'Login', 'fr-CA': 'Connexion', 'en-ZA': 'Login', af: 'Teken In' },
    stepRegister: { en: 'Register', fr: 'Inscription', mi: 'Rēhita', ga: 'Clárú', hi: 'पंजीकरण', gd: 'Clàradh', 'en-AU': 'Register', 'fr-CA': 'Inscription', 'en-ZA': 'Registrasie', af: 'Registreer' },
    stepPrivacyPolicy: { en: 'Privacy Policy', fr: 'Politique de Confidentialité', mi: 'Kaupapahere Tūmataiti', ga: 'Polasaí Príobháideachta', hi: 'गोपनीयता नीति', gd: 'Poileasaidh Prìobhaideachd', 'en-AU': 'Privacy Policy', 'fr-CA': 'Politique de Confidentialité', 'en-ZA': 'Privaatheidbeleid', af: 'Privaatheidsbeleid' },
    stepTerms: { en: 'Terms of Service', fr: 'Conditions d\'Utilisation', mi: 'Ngā Ture Whakamahi', ga: 'Téarmaí Seirbhís', hi: 'सेवा की शर्तें', gd: 'Teirmichean Seirbheis', 'en-AU': 'Terms of Service', 'en-CA': 'Terms of Service', 'fr-CA': 'Conditions d\'Utilisation', 'en-ZA': 'Diensvoorwaardes', af: 'Diensvoorwaardes' },
    stepSettings: { en: 'Settings', fr: 'Paramètres', mi: 'Tautuhinga', ga: 'Suíomhanna', hi: 'सेटिंग्स', gd: 'Rèiteachaidhean', 'en-AU': 'Settings', 'en-NZ': 'Settings', 'en-CA': 'Settings', 'fr-CA': 'Paramètres', 'en-ZA': 'Instellings', af: 'Instellings' },
    stepPricing: { en: 'Pricing', fr: 'Tarifs', mi: 'Utu', ga: 'Praghsáil', hi: 'मूल्य निर्धारण', gd: 'Prìsean', 'en-AU': 'Pricing', 'en-NZ': 'Pricing', 'en-CA': 'Pricing', 'fr-CA': 'Tarifs', 'en-ZA': 'Prysbelle', af: 'Prysbelle' },
    stepPay: { en: 'Payment', fr: 'Paiement', mi: 'Utu', ga: 'Íocaíocht', hi: 'भुगतान', gd: 'Pàigheadh', 'en-AU': 'Payment', 'en-NZ': 'Payment', 'en-CA': 'Payment', 'fr-CA': 'Paiement', 'en-ZA': 'Betaling', af: 'Betaling' },
    stepProfile: { en: 'Profile', fr: 'Profil', mi: 'Kōtaha', ga: 'Próifíl', hi: 'प्रोफ़ाइल', gd: 'Pròifìl', 'en-AU': 'Profile', 'en-NZ': 'Profile', 'en-CA': 'Profile', 'fr-CA': 'Profil', 'en-ZA': 'Profiel', af: 'Profiel' },
    
    // Statuts des étapes
    statusCompleted: { en: 'Completed', fr: 'Terminé', mi: 'Kua Oti', ga: 'Críochnaithe', hi: 'पूर्ण', gd: 'Crìochnaichte', 'en-AU': 'Completed', 'fr-CA': 'Terminé', 'en-ZA': 'Voltooid', af: 'Voltooid' },
    statusPending: { en: 'Pending', fr: 'En attente', mi: 'Ke Tatari ana', ga: 'Ar Fuireach', hi: 'लंबित', gd: 'A’ feitheamh', 'en-AU': 'Pending', 'fr-CA': 'En attente', 'en-ZA': 'Hangende', af: 'Hangende' },
    statusCurrent: { en: 'Current Step', fr: 'Étape actuelle', mi: 'Te Takiwa o Naianei', ga: 'Céim Reatha', hi: 'वर्तमान चरण', gd: 'An Ceum An-dràsta', 'en-AU': 'Current Step', 'fr-CA': 'Étape actuelle', 'en-ZA': 'Huidige Stap', af: 'Huidige Stap' },
    
    // Traductions pour le bloc de développement (utilisé pour la page /register)
    developmentTitle: { en: 'Under Construction', fr: 'En construction', mi: 'Kei Hangaia', ga: 'Faoin Tógáil', hi: 'निर्माणाधीन', gd: 'Fo Thogail', 'en-AU': 'Under Construction', 'fr-CA': 'En construction', 'en-ZA': 'Onder Konstruksie', af: 'Onder Konstruksie' },
    developmentMessage: { en: 'This page is currently in development. Please check back later!', fr: 'Cette page est en cours de développement. Veuillez revenir plus tard !', mi: 'Kei te whakawhanaketia tēnei whārangi. Tēnā koa hoki mai ā muri atu!', ga: 'Tá an leathanach seo á fhorbairt faoi láthair. Tar ar ais níos déanaí!', hi: 'यह पृष्ठ वर्तमान में विकास के अधीन है। कृपया बाद में पुनः जांचें!', gd: 'Tha an duilleag seo ga leasachadh an-dràsta. Feuch an tilleas tu a-rithist!', 'en-AU': 'This page is currently in development. Please check back later!', 'fr-CA': 'Cette page est en cours de développement. Veuillez revenir plus tard !', 'en-ZA': 'Hierdie bladsy is tans onder ontwikkeling. Kom asseblief later terug!', af: 'Hierdie bladsy is tans onder ontwikkeling. Kom asseblief later terug!' },
    betaTag: { en: 'BETA', fr: 'BÊTA', mi: 'WHAKAMĀTAUTAU', ga: 'BÉITE', hi: 'बीटा', gd: 'BÈTA', 'en-AU': 'BETA', 'fr-CA': 'BÊTA', 'en-ZA': 'BÊTA', af: 'BETA' },
    stayTuned: { en: 'Stay tuned for updates!', fr: 'Restez à l\'écoute pour les mises à jour !', mi: 'Kia mataara mo nga whakahoutanga!', ga: 'Fan socair le nuashonruithe!', hi: 'अद्यतनों के लिए बने रहें!', gd: 'Cùm sùil air ùrachaidhean!', 'en-AU': 'Stay tuned for updates!', 'fr-CA': 'Restez à l\'écoute pour les mises à jour !', 'en-ZA': 'Bly ingeskakel vir opdaterings!', af: 'Bly ingeskakel vir opdaterings!' },
    copyright: { en: 'All rights reserved', fr: 'Tous droits réservés', mi: 'Kua rāhuitia ngā motika katoa', ga: 'Gach ceart ar cosaint', hi: 'सर्वाधिकार सुरक्षित', gd: 'Gach còir glèidhte', 'en-AU': 'All rights reserved', 'fr-CA': 'Tous droits réservés', 'en-ZA': 'Alle regte voorbehou', af: 'Alle regte voorbehou' }
  },
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

export default function RegisterPage() { // Si ce composant sert de layout général, vous pourriez le nommer FlowLayout ou similaire.
  const { language } = useLanguage();
  const { theme } = useTheme();
  const router = useRouter();
  const currentPath = usePathname(); 
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  // Définition des étapes du flux
  const onboardingSteps: Step[] = [
    { path: '/login', labelKey: 'stepLogin', icon: Circle, isDisabled: false },
    { path: '/register', labelKey: 'stepRegister', icon: Circle, isDisabled: false },
    { path: '/privacy-policy', labelKey: 'stepPrivacyPolicy', icon: Circle, isDisabled: true },
    { path: '/terms', labelKey: 'stepTerms', icon: Circle, isDisabled: true },
    { path: '/settings', labelKey: 'stepSettings', icon: Circle, isDisabled: true },
    { path: '/pricing', labelKey: 'stepPricing', icon: Circle, isDisabled: true },
    { path: '/pay', labelKey: 'stepPay', icon: Circle, isDisabled: true },
    { path: '/profile', labelKey: 'stepProfile', icon: Circle, isDisabled: true },
  ];

  useEffect(() => {
    if (!currentPath) return;

    const currentIndex = onboardingSteps.findIndex(step => step.path === currentPath);
    if (currentIndex !== -1) {
      setActiveStepIndex(currentIndex);
    } else {
      // Si le chemin actuel ne correspond à aucune étape définie, on pourrait réinitialiser ou laisser tel quel.
      // Ici, on laisse l'indicateur sur la dernière étape atteinte.
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
      // Utilise la couleur de progression définie dans le thème pour l'étape actuelle
      return { icon: Circle, color: progressTrackColor, status: getTranslation('onboarding', 'statusCurrent', language) };
    }
    if (isCompleted) {
      return { icon: CheckCircle, color: 'green', status: getTranslation('onboarding', 'statusCompleted', language) };
    }
    // Par défaut, si non désactivé, non actuel, non complété, il est en attente (rouge)
    return { icon: XCircle, color: 'red', status: getTranslation('onboarding', 'statusPending', language) };
  };

  // Styles basés sur le thème (utilisés pour les couleurs du conteneur principal et des éléments partagés)
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

  // Fonction pour rendre le contenu spécifique à la page actuelle
  const renderPageContent = () => {
    switch (currentPath) {
      case '/login':
        return (
          <div style={{ width: '100%', marginTop: '3rem' }}>
            <h2 style={{ fontSize: '2rem', textAlign: 'center', marginBottom: '2rem' }}>Bienvenue sur la page de connexion</h2>
            <p style={{ textAlign: 'center', color: mutedTextColor }}>Contenu de la page de connexion...</p>
          </div>
        );
      case '/register':
        // Contenu pour la page "UNDER CONSTRUCTION"
        return (
          <div style={{
            width: '100%', marginTop: '3rem', padding: '2rem', border: `2px dashed ${warningBorder}`,
            borderRadius: '8px', backgroundColor: warningBackground, color: warningText, textAlign: 'center',
            boxShadow: `4px 4px 0px ${shadowColorCard}`, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', minHeight: '200px',
          }}>
            <h2 style={{
              fontSize: '2rem', marginBottom: '1rem', color: warningText,
              fontFamily: "'Playfair Display', serif", fontWeight: 'bold', textTransform: 'uppercase'
            }}>
              {getTranslation('onboarding', 'developmentTitle', language)}
            </h2>
            <p style={{
              fontSize: '1.2rem', fontStyle: 'italic', color: mutedTextColor, maxWidth: '700px'
            }}>
              {getTranslation('onboarding', 'developmentMessage', language)}
            </p>
            <p style={{
              fontSize: '1.1rem', marginTop: '1.5rem', fontWeight: 'bold', color: warningText
            }}>
              {getTranslation('onboarding', 'betaTag', language)} – {getTranslation('onboarding', 'stayTuned', language)}
            </p>
          </div>
        );
      // Ajoutez ici les autres cas pour les chemins de confidentialité, terms, settings, etc.
      // Par exemple :
      case '/privacy-policy':
        return (
          <div style={{ width: '100%', marginTop: '3rem' }}>
            <h2 style={{ fontSize: '2rem', textAlign: 'center', marginBottom: '2rem' }}>
              {getTranslation('onboarding', 'stepPrivacyPolicy', language)}
            </h2>
            <p style={{ color: mutedTextColor }}>Contenu de la politique de confidentialité...</p>
          </div>
        );
      case '/terms':
        return (
          <div style={{ width: '100%', marginTop: '3rem' }}>
            <h2 style={{ fontSize: '2rem', textAlign: 'center', marginBottom: '2rem' }}>
              {getTranslation('onboarding', 'stepTerms', language)}
            </h2>
            <p style={{ color: mutedTextColor }}>Contenu des conditions d'utilisation...</p>
          </div>
        );
      // Ajoutez les cas pour settings, pricing, pay, profile si nécessaire
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
    // Utilisation des classes CSS pour le conteneur principal
    <div className={styles.pageContainer} style={{
      color: textColor,
      backgroundColor: backgroundColorPage,
      fontFamily: "'Arial', sans-serif", // Assurez-vous que cette police est disponible
    }}>
      {/* La barre de progression utilise maintenant les classes CSS */}
      <div className={styles.stepperContainer} style={{ 
        borderBottom: `1px solid ${borderColor}`,
        color: textColor,
      }}>
        {onboardingSteps.map((step, index) => {
          // Récupère les informations de statut (icône, couleur, texte)
          const { icon: IconComponent, color, status: stepStatus } = getStepStatus(step, index);
          const isLastStep = index === onboardingSteps.length - 1;
          // Détermine si l'étape actuelle correspond au chemin affiché
          const isCurrentPath = step.path === currentPath;

          // Détermine la classe pour le conteneur de l'étape
          let stepItemClasses = `${styles.stepItem}`;
          if (step.isDisabled) {
            stepItemClasses += ` ${styles.isDisabled}`;
          }
          if (isCurrentPath && !step.isDisabled) {
             stepItemClasses += ` ${styles.isCurrent}`; // Ajout de la classe isCurrent pour le label
          }
          
          // Détermine la classe pour le conteneur de l'icône
          let iconContainerClasses = `${styles.stepIconContainer}`;
          
          return (
            <React.Fragment key={step.path}>
              {/* L'élément div de l'étape utilise les classes CSS */}
              <div
                className={stepItemClasses} 
                style={{ cursor: step.isDisabled ? 'not-allowed' : 'pointer' }}
                onClick={() => {
                  if (!step.isDisabled) {
                    router.push(step.path); // Utilise le router pour la navigation
                  }
                }}
              >
                {/* Le conteneur de l'icône utilise les classes CSS et les styles inline pour la couleur */}
                <div className={iconContainerClasses} style={{ 
                  backgroundColor: color, // La couleur du cercle est appliquée via style inline
                  border: `2px solid ${theme === 'dark' ? '#FFFFFF' : '#000000'}`, // Bordure de l'icône via style inline
                }}>
                  {IconComponent && <IconComponent size={24} color={theme === 'dark' ? '#1A1A2E' : '#FFFFFF'} />} {/* Rend l'icône si elle existe */}
                  {/* Le numéro d'étape utilise la classe CSS et le style inline pour la couleur */}
                  <span className={styles.stepNumber} style={{ 
                    color: theme === 'dark' ? '#1A1A2E' : '#FFFFFF', 
                  }}>{index + 1}</span>
                </div>
                {/* Le label de l'étape utilise les classes CSS et les styles inline pour la couleur et le gras */}
                <span className={`${styles.stepLabel} ${isCurrentPath && !step.isDisabled ? styles.isCurrent : ''}`} style={{
                  color: isCurrentPath && !step.isDisabled ? progressTrackColor : mutedTextColor,
                  fontWeight: isCurrentPath && !step.isDisabled ? 'bold' : 'normal',
                }}>
                  {getTranslation('onboarding', step.labelKey, language)} {/* Traduction du label */}
                </span>
                {stepStatus && <span className={styles.stepStatus}>({stepStatus})</span>} {/* Statut traduit */}
              </div>

              {!isLastStep && (
                // Le séparateur utilise la classe CSS et le style inline pour la couleur
                <div className={styles.stepSeparator} style={{ backgroundColor: separatorColor }}>
                   {/* La barre de progression utilise la classe CSS et le style inline pour la largeur et la couleur */}
                   <div className={styles.stepProgress} style={{
                    width: (index < activeStepIndex) ? '100%' : '0%',
                    backgroundColor: progressTrackColor,
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