'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation'; 
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageCode } from '@/types';
import { CheckCircle, XCircle, Circle } from 'lucide-react';
import styles from './register.module.css'; 

// --- Traductions ---
const allTranslations = {
  onboarding: {
    stepLogin: { en: 'Login', fr: 'Connexion', mi: 'Takiuru', ga: 'Logáil', hi: 'लॉग इन', gd: 'Log a-steach', 'en-AU': 'Login', 'fr-CA': 'Connexion', 'en-ZA': 'Login' },
    stepRegister: { en: 'Register', fr: 'Inscription', mi: 'Rēhita', ga: 'Clárú', hi: 'पंजीकरण', gd: 'Clàradh', 'en-AU': 'Register', 'fr-CA': 'Inscription', 'en-ZA': 'Registrasie' },
    stepPrivacyPolicy: { en: 'Privacy Policy', fr: 'Politique de Confidentialité', mi: 'Kaupapahere Tūmataiti', ga: 'Polasaí Príobháideachta', hi: 'गोपनीयता नीति', gd: 'Poileasaidh Prìobhaideachd', 'en-AU': 'Privacy Policy', 'fr-CA': 'Politique de Confidentialité', 'en-ZA': 'Privaatheidbeleid' },
    stepTerms: { en: 'Terms of Service', fr: 'Conditions d\'Utilisation', mi: 'Ngā Ture Whakamahi', ga: 'Téarmaí Seirbhís', hi: 'सेवा की शर्तें', gd: 'Teirmichean Seirbheis', 'en-AU': 'Terms of Service', 'en-CA': 'Terms of Service', 'fr-CA': 'Conditions d\'Utilisation', 'en-ZA': 'Diensvoorwaardes', af: 'Diensvoorwaardes' },
    stepSettings: { en: 'Settings', fr: 'Paramètres', mi: 'Tautuhinga', ga: 'Suíomhanna', hi: 'सेटिंग्स', gd: 'Rèiteachaidhean', 'en-AU': 'Settings', 'en-NZ': 'Settings', 'en-CA': 'Settings', 'fr-CA': 'Paramètres', 'en-ZA': 'Instellings', af: 'Instellings' },
    stepPricing: { en: 'Pricing', fr: 'Tarifs', mi: 'Utu', ga: 'Praghsáil', hi: 'मूल्य निर्धारण', gd: 'Prìsean', 'en-AU': 'Pricing', 'en-NZ': 'Pricing', 'en-CA': 'Pricing', 'fr-CA': 'Tarifs', 'en-ZA': 'Prysbelle', af: 'Prysbelle' },
    stepPay: { en: 'Payment', fr: 'Paiement', mi: 'Utu', ga: 'Íocaíocht', hi: 'भुगतान', gd: 'Pàigheadh', 'en-AU': 'Payment', 'en-NZ': 'Payment', 'en-CA': 'Payment', 'fr-CA': 'Paiement', 'en-ZA': 'Betaling', af: 'Betaling' },
    stepProfile: { en: 'Profile', fr: 'Profil', mi: 'Kōtaha', ga: 'Próifíl', hi: 'प्रोफ़ाइल', gd: 'Pròifìl', 'en-AU': 'Profile', 'en-NZ': 'Profile', 'en-CA': 'Profile', 'fr-CA': 'Profil', 'en-ZA': 'Profiel', af: 'Profiel' },
    statusCompleted: { en: 'Completed', fr: 'Terminé', mi: 'Kua Oti', ga: 'Críochnaithe', hi: 'पूर्ण', gd: 'Crìochnaichte', 'en-AU': 'Completed', 'fr-CA': 'Terminé', 'en-ZA': 'Voltooid', af: 'Voltooid' },
    statusPending: { en: 'Pending', fr: 'En attente', mi: 'Ke Tatari ana', ga: 'Ar Fuireach', hi: 'लंबित', gd: 'A’ feitheamh', 'en-AU': 'Pending', 'fr-CA': 'En attente', 'en-ZA': 'Hangende', af: 'Hangende' },
    statusCurrent: { en: 'Current Step', fr: 'Étape actuelle', mi: 'Te Takiwa o Naianei', ga: 'Céim Reatha', hi: 'वर्तमान चरण', gd: 'An Ceum An-dràsta', 'en-AU': 'Current Step', 'fr-CA': 'Étape actuelle', 'en-ZA': 'Huidige Stap', af: 'Huidige Stap' },
    // Ajout des nouvelles traductions manquantes
    developmentTitle: { en: 'Under Construction', fr: 'En construction', mi: 'Kei Hangaia', ga: 'Faoin Tógáil', hi: 'निर्माणाधीन', gd: 'Fo Thogail', 'en-AU': 'Under Construction', 'fr-CA': 'En construction', 'en-ZA': 'Onder Konstruksie' },
    developmentMessage: { en: 'This page is currently in development. Please check back later!', fr: 'Cette page est en cours de développement. Veuillez revenir plus tard !', mi: 'Kei te whakawhanaketia tēnei whārangi. Tēnā koa hoki mai ā muri atu!', ga: 'Tá an leathanach seo á fhorbairt faoi láthair. Tar ar ais níos déanaí!', hi: 'यह पृष्ठ वर्तमान में विकास के अधीन है। कृपया बाद में पुनः जांचें!', gd: 'Tha an duilleag seo ga leasachadh an-dràsta. Feuch an tilleas tu a-rithist!', 'en-AU': 'This page is currently in development. Please check back later!', 'fr-CA': 'Cette page est en cours de développement. Veuillez revenir plus tard !', 'en-ZA': 'Hierdie bladsy is tans onder ontwikkeling. Kom asseblief later terug!' },
    betaTag: { en: 'BETA', fr: 'BÊTA', mi: 'WHAKAMĀTAUTAU', ga: 'BÉITE', hi: 'बीटा', gd: 'BÈTA', 'en-AU': 'BETA', 'fr-CA': 'BÊTA', 'en-ZA': 'BÊTA' },
    stayTuned: { en: 'Stay tuned for updates!', fr: 'Restez à l\'écoute pour les mises à jour !', mi: 'Kia mataara mo nga whakahoutanga!', ga: 'Fan socair le nuashonruithe!', hi: 'अद्यतनों के लिए बने रहें!', gd: 'Cùm sùil air ùrachaidhean!', 'en-AU': 'Stay tuned for updates!', 'fr-CA': 'Restez à l\'écoute pour les mises à jour !', 'en-ZA': 'Bly ingeskakel vir opdaterings!' },
    copyright: { en: 'All rights reserved', fr: 'Tous droits réservés', mi: 'Kua rāhuitia ngā motika katoa', ga: 'Gach ceart ar cosaint', hi: 'सर्वाधिकार सुरक्षित', gd: 'Gach còir glèidhte', 'en-AU': 'All rights reserved', 'fr-CA': 'Tous droits réservés', 'en-ZA': 'Alle regte voorbehou' }
  },
};

function getTranslation(section: keyof typeof allTranslations, keyPath: string, lang: LanguageCode): string {
  const keys = keyPath.split('.');
  let value: any = allTranslations[section];
  
  for (const key of keys) {
    if (!value || typeof value !== 'object') break;
    value = value[key];
  }

  if (typeof value !== 'object' || value === null || !('en' in value)) {
    console.warn(`Translation missing or invalid for: ${section}.${keyPath} in language ${lang}`);
    return `[Invalid Translation: ${section}.${keyPath}]`;
  }

  return (value as { [l: string]: string })[lang] || (value as { [l: string]: string }).en || '';
};

interface Step {
  path: string;
  labelKey: string;
  icon: React.ElementType;
  iconColor?: string;
  statusKey?: string;
  isCurrent?: boolean;
  isDisabled?: boolean;
}

export default function RegisterPage() {
  const { language } = useLanguage();
  const { theme } = useTheme();
  const router = useRouter();
  const currentPath = usePathname(); 
  const [activeStepIndex, setActiveStepIndex] = useState(0);

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
    }
  }, [currentPath, onboardingSteps]);

  const getStepStatus = (step: Step, index: number) => {
    const isCompleted = index < activeStepIndex && !step.isDisabled;
    const isCurrent = index === activeStepIndex && !step.isDisabled;

    if (step.isDisabled) {
      return { icon: XCircle, color: 'gray', status: getTranslation('onboarding', 'statusPending', language) };
    }
    if (isCurrent) {
      return { icon: Circle, color: 'blue', status: getTranslation('onboarding', 'statusCurrent', language) };
    }
    if (isCompleted) {
      return { icon: CheckCircle, color: 'green', status: getTranslation('onboarding', 'statusCompleted', language) };
    }
    return { icon: XCircle, color: 'red', status: getTranslation('onboarding', 'statusPending', language) };
  };

  // Styles basés sur le thème
  const textColor = theme === 'dark' ? '#E0E0E0' : '#333333';
  const mutedTextColor = theme === 'dark' ? '#A0A0A0' : '#666666';
  const borderColor = theme === 'dark' ? '#555555' : '#AAAAAA';
  const backgroundColorPage = theme === 'dark' ? '#1A1A2E' : '#FFFFFF';
  const separatorColor = theme === 'dark' ? '#444444' : '#DDDDDD';
  const progressTrackColor = theme === 'dark' ? '#4A90E2' : '#0070f3';
  
  // Correction: Utilisation de progressTrackColor comme highlightColor
  const highlightColor = progressTrackColor; 

  const warningBackground = theme === 'dark' ? '#3A2A2A' : '#FFF3F3';
  const warningText = theme === 'dark' ? '#FFCACA' : '#CC0000';
  const warningBorder = theme === 'dark' ? '#FFCACA' : '#CC0000';
  const shadowColorCard = theme === 'dark' ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.2)';

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
                  <IconComponent size={24} color={theme === 'dark' ? '#1A1A2E' : '#FFFFFF'} />
                  <span style={{
                    position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                    fontSize: '0.8rem', color: theme === 'dark' ? '#1A1A2E' : '#FFFFFF', fontWeight: 'bold'
                  }}>{index + 1}</span>
                </div>
                <span style={{
                  fontSize: '0.9rem',
                  // Correction: Utilisation de highlightColor définie plus haut
                  color: step.isCurrent ? highlightColor : mutedTextColor, 
                  fontWeight: step.isCurrent ? 'bold' : 'normal',
                  whiteSpace: 'nowrap',
                }}>
                  {getTranslation('onboarding', step.labelKey as any, language)}
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

      {/* Contenu principal de la page */}
      {currentPath === '/register' && (
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
      )}
      
      {currentPath === '/login' && (
        <div style={{ width: '100%', marginTop: '3rem' }}>
          <h2 style={{ fontSize: '2rem', textAlign: 'center', marginBottom: '2rem' }}>Bienvenue sur la page de connexion</h2>
          <p style={{ textAlign: 'center', color: mutedTextColor }}>Contenu de la page de connexion...</p>
        </div>
      )}

      <p style={{ textAlign: 'center', marginTop: '4rem', fontSize: '0.8rem', color: mutedTextColor }}>
        © <span suppressHydrationWarning>{new Date().getFullYear()}</span> {getTranslation('onboarding', 'copyright', language)}
      </p>
    </div>
  );
}