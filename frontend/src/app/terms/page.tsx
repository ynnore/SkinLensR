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
    // Traduction pour le titre de la page d'accueil /kiwi-ops
    sectionWelcomeKiwiOps: {
      en: "Welcome to Kiwi-Ops",
      fr: "Bienvenue sur Kiwi-Ops",
      mi: "Nau mai ki Kiwi-Ops",
      ga: "Fáilte go Kiwi-Ops",
      hi: "Kiwi-Ops में आपका स्वागत है",
      gd: "Fàilte gu Kiwi-Ops",
      af: "Welkom by Kiwi-Ops"
    },
    // Sections pour le contenu des "Terms" (politique de confidentialité/conditions)
    sectionIntro: {
      en: "Introduction",
      fr: "Introduction",
      mi: "Kupu Whakataki",
      ga: "Réamhrá",
      hi: "परिचय",
      gd: "Ro-ràdh",
      af: "Inleiding"
    },
    sectionServiceAccess: {
      en: "Access to the Service",
      fr: "Accès au service",
      mi: "Urunga ki te Ratonga",
      ga: "Rochtain ar an tSeirbhís",
      hi: "सेवा तक पहुंच",
      gd: "Cothrom air an t-Seirbheis",
      af: "Toegang tot die Diens"
    },
    sectionUserAccounts: {
      en: "User Accounts",
      fr: "Comptes utilisateur",
      mi: "Ngā Pūkete Kaiwhakamahi",
      ga: "Cuntais Úsáideora",
      hi: "उपयोगकर्ता खाते",
      gd: "Cunntasan Cleachdaiche",
      af: "Gebruikerrekeninge"
    },
    sectionAllowedUse: {
      en: "Permitted Use",
      fr: "Utilisation autorisée",
      mi: "Whakamahi Whakaaetia",
      ga: "Úsáid Ceadaithe",
      hi: "अनुमत उपयोग",
      gd: "Cleachdadh Ceadaichte",
      af: "Toegestane Gebruik"
    },
    sectionPayment: {
      en: "Payment & Subscription",
      fr: "Paiement et abonnement",
      mi: "Utu me te Ohaurunga",
      ga: "Íocaíocht agus Síntiús",
      hi: "भुगतान और सदस्यता",
      gd: "Pàigheadh is Ballrachd",
      af: "Betaling en Intekening"
    },
    sectionLiability: {
      en: "Limitation of Liability",
      fr: "Limitation de responsabilité",
      mi: "Te Whakaitinga o te Kawenga",
      ga: "Teorainn Freagrachta",
      hi: "उत्तरदायित्व की सीमा",
      gd: "Crìochan Uallach",
      af: "Beperking van Aanspreeklikheid"
    },
    sectionTermination: {
      en: "Termination",
      fr: "Résiliation",
      mi: "Whakamutunga",
      ga: "Foiriú",
      hi: "समाप्ति",
      gd: "Crìochnachadh",
      af: "Beëindiging"
    },
    sectionModifications: {
      en: "Changes to Terms",
      fr: "Modifications des conditions",
      mi: "Ngā Panonitanga ki ngā Tikanga",
      ga: "Athruithe ar na Téarmaí",
      hi: "शर्तों में परिवर्तन",
      gd: "Atharrachaidhean air na Cumhachan",
      af: "Veranderinge aan Voorwaardes"
    },
    sectionLaw: {
      en: "Governing Law & Jurisdiction",
      fr: "Loi applicable et juridiction",
      mi: "Ture Whakahaere me te Mana Whakawā",
      ga: "Dlí Rialaithe & Dlínse",
      hi: "प्रासंगिक कानून और क्षेत्राधिकार",
      gd: "Laghan Riaghlaidh & Uachdranas",
      af: "Geldende Reg en Jurisdiksie"
    },
    sectionContact: {
      en: "Contact",
      fr: "Contact",
      mi: "Whakapā",
      ga: "Déan teagmháil",
      hi: "संपर्क करें",
      gd: "Fios",
      af: "Kontak"
    },

    // Clés spécifiques pour les labels des étapes dans la barre de progression.
    stepkiwiops: { en: 'Kiwi-Ops Welcome', fr: 'Bienvenue Kiwi-Ops', mi: 'Nau Mai Kiwi-Ops', ga: 'Fáilte Kiwi-Ops', hi: 'Kiwi-Ops स्वागत', gd: 'Fàilte Kiwi-Ops', af: 'Welkom Kiwi-Ops' },
    stepTerms: { en: 'Terms', fr: 'Conditions', mi: 'Nga Tikanga', ga: 'Telermaí', hi: 'शर्तें', gd: 'Cumhachan', af: 'Voorwaardes' },
    stepPrivacyPolicy: { en: 'Privacy Policy', fr: 'Politique de confidentialité', mi: 'Kaupapahere Tūmataiti', ga: 'Polasaí Príobháideachta', hi: 'गोपनीयता नीति', gd: 'Poileasaidh Prìobhaideachd', af: 'Privaatheidsbeleid' },
    stepSettings: { en: 'Settings', fr: 'Paramètres', mi: 'Tautuhinga', ga: 'Suíomhanna', hi: 'सेटिंग्स', gd: 'Rèiteachaidhean', af: 'Instellings' },
    stepPricing: { en: 'Pricing', fr: 'Tarifs', mi: 'Utu', ga: 'Praghsáil', hi: 'मूल्य निर्धारण', gd: 'Prìsean', af: 'Prysing' },
    stepPay: { en: 'Payment', fr: 'Paiement', mi: 'Utu', ga: 'Íocaíocht', hi: 'भुगतान', gd: 'Pàigheadh', af: 'Betaling' },
    stepProfile: { en: 'Profile', fr: 'Profil', mi: 'Kōtaha', ga: 'Próifíl', hi: 'प्रोफ़ाइल', gd: 'Pròifìl', af: 'Profiel' },
    stepLogin: { en: 'Login', fr: 'Connexion', mi: 'Takiuru', ga: 'Logáil Isteach', hi: 'लॉगिन', gd: 'Log a-steach', af: 'Teken In' }, // Ajouté pour le chemin /login

    // Clés pour les statuts des étapes.
    statusPending: { en: 'Pending', fr: 'En attente', mi: 'Tāria', ga: 'Ag fanacht', hi: 'लंबित', gd: 'A’ feitheamh', af: 'Hangende' },
    statusCurrent: { en: 'Current', fr: 'Actuelle', mi: 'I tēnei wā', ga: 'Reatha', hi: 'वर्तमान', gd: 'An-dràsta', af: 'Huidige' },
    statusCompleted: { en: 'Completed', fr: 'Terminée', mi: 'Kua oti', ga: 'Críochnaithe', hi: 'पूर्ण', gd: 'Crìochnaichte', af: 'Voltooid' },

    // Traductions pour le bloc de développement (utilisé pour la page /register)
    developmentTitle: { en: 'Under Development', fr: 'En cours de développement', mi: 'Kei te whakawhanakehia', ga: 'Faoi Fhorbairt', hi: 'विकास के अधीन', gd: 'Fo leasachadh', af: 'Onder Ontwikkeling' },
    developmentMessage: { en: 'This section is currently under construction. We are working hard to bring you new features!', fr: 'Cette section est actuellement en cours de construction. Nous travaillons dur pour vous apporter de nouvelles fonctionnalités !', mi: 'Kei te hangaia tonu tenei waahanga. Kei te kaha taatau ki te kawe mai i nga ahuatanga hou ki a koe!', ga: 'Tá an chuid seo á thógáil suas faoi láthair. Táimid ag obair go cruaidh chun gnéithe nua a thabhairt chugat!', hi: 'यह अनुभाग वर्तमान में निर्माण के अधीन है। हम आपको नई सुविधाएँ लाने के लिए कड़ी मेहनत कर रहे हैं!', gd: 'Tha an roinn seo fo thogail an-dràsta. Tha sinn ag obair gu cruaidh gus feartan ùra a thoirt thugad!', af: 'Hierdie afdeling is tans onder konstruksie. Ons werk hard om nuwe funksies aan te bied!' },
    betaTag: { en: 'Beta Version', fr: 'Version Bêta', mi: 'Putanga Beta', ga: 'Leagan Beta', hi: 'बीटा संस्करण', gd: 'Tionndadh Beta', af: 'Beta Weergawe' },
    stayTuned: { en: 'Stay tuned for updates!', fr: 'Restez à l\'écoute pour les mises à jour !', mi: 'Noho hei kaikōrero mo nga whakahoutanga!', ga: 'Fan tiúnta le haghaidh nuashonruithe!', hi: 'अद्यतनों के लिए ट्यून रहें!', gd: 'Fuirich airson ùrachaidhean!', af: 'Bly ingeskakel vir opdaterings!' },
    copyright: { en: 'Your Company Name. All rights reserved.', fr: 'Nom de votre entreprise. Tous droits réservés.', mi: 'Ingoa Kamupene Kai. Pānga katoa te mana.', ga: 'Ainm do Chuideachta. Gach ceart ar cosaint.', hi: 'आपकी कंपनी का नाम। सर्वाधिकार सुरक्षित।', gd: 'Ainm do Chompanaidh. Gach còir glèidhte.', af: 'Jou Maatskappy Naam. Alle regte voorbehou.' }
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

  // Définition des étapes du flux. J'ai mappé les chemins à des clés de traduction appropriées.
  const onboardingSteps: Step[] = [
    { path: '/kiwi-ops', labelKey: 'stepkiwiops', icon: Circle },
    { path: '/login', labelKey: 'stepLogin', icon: Circle }, // Chemin pour la page de connexion
    { path: '/terms', labelKey: 'stepTerms', icon: Circle }, // Le premier 'stepTerms' est activé
    { path: '/privacy-policy', labelKey: 'stepPrivacyPolicy', icon: Circle, isDisabled: true }, // Exemple d'étape désactivée
    // Note : J'ai supprimé la duplication de '/terms' ici. Si vous avez besoin de deux étapes 'terms' distinctes, elles doivent avoir des chemins différents.
    { path: '/settings', labelKey: 'stepSettings', icon: Circle },
    { path: '/pricing', labelKey: 'stepPricing', icon: Circle },
    { path: '/pay', labelKey: 'stepPay', icon: Circle },
    { path: '/profile', labelKey: 'stepProfile', icon: Circle },
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
      case '/kiwi-ops': // Chemin pour la page d'accueil / bienvenue
        return (
          <div style={{ width: '100%', marginTop: '3rem' }}>
            <h2 style={{ fontSize: '2rem', textAlign: 'center', marginBottom: '2rem' }}>
              {getTranslation('onboarding', 'sectionWelcomeKiwiOps', language)}
            </h2>
            <p style={{ textAlign: 'center', color: mutedTextColor }}>Contenu de la page d'accueil...</p>
            {/* Vous pouvez ajouter un lien pour continuer ici, par exemple vers /login */}
            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
              <button
                onClick={() => router.push('/login')}
                style={{
                  padding: '10px 20px',
                  fontSize: '1rem',
                  backgroundColor: progressTrackColor,
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                }}
              >
                Commencer
              </button>
            </div>
          </div>
        );
      case '/login': // Chemin pour la page de connexion
        return (
          <div style={{ width: '100%', marginTop: '3rem' }}>
            <h2 style={{ fontSize: '2rem', textAlign: 'center', marginBottom: '2rem' }}>Connexion</h2>
            <p style={{ textAlign: 'center', color: mutedTextColor }}>Contenu de la page de connexion...</p>
            {/* Intégrer ici le formulaire de connexion */}
          </div>
        );
      case '/register': // Ce cas n'est plus dans onboardingSteps, donc ne sera pas affiché par la barre de progression
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
      case '/terms':
        return (
          <div style={{ width: '100%', marginTop: '3rem' }}>
            <h2 style={{ fontSize: '2rem', textAlign: 'center', marginBottom: '2rem' }}>
              {getTranslation('onboarding', 'sectionIntro', language)} {/* Utilisation d'une section de traduction */}
            </h2>
            <p style={{ color: mutedTextColor }}>Contenu des conditions d'utilisation...</p>
            {/* Vous pouvez utiliser des sections spécifiques ici, par exemple : */}
            {/* <p>{getTranslation('onboarding', 'sectionServiceAccess', language)}</p> */}
          </div>
        );
      case '/privacy-policy':
        return (
          <div style={{ width: '100%', marginTop: '3rem' }}>
            <h2 style={{ fontSize: '2rem', textAlign: 'center', marginBottom: '2rem' }}>Politique de Confidentialité</h2>
            <p style={{ color: mutedTextColor }}>Contenu de la politique de confidentialité...</p>
            {/* Intégrer ici le composant PrivacyPolicyPage */}
          </div>
        );
      case '/settings':
        return (
          <div style={{ width: '100%', marginTop: '3rem' }}>
            <h2 style={{ fontSize: '2rem', textAlign: 'center', marginBottom: '2rem' }}>Paramètres</h2>
            <p style={{ color: mutedTextColor }}>Contenu des paramètres...</p>
          </div>
        );
      case '/pricing':
        return (
          <div style={{ width: '100%', marginTop: '3rem' }}>
            <h2 style={{ fontSize: '2rem', textAlign: 'center', marginBottom: '2rem' }}>Tarifs</h2>
            <p style={{ color: mutedTextColor }}>Contenu des tarifs...</p>
          </div>
        );
      case '/pay':
        return (
          <div style={{ width: '100%', marginTop: '3rem' }}>
            <h2 style={{ fontSize: '2rem', textAlign: 'center', marginBottom: '2rem' }}>Paiement</h2>
            <p style={{ color: mutedTextColor }}>Contenu de paiement...</p>
          </div>
        );
      case '/profile':
        return (
          <div style={{ width: '100%', marginTop: '3rem' }}>
            <h2 style={{ fontSize: '2rem', textAlign: 'center', marginBottom: '2rem' }}>Profil</h2>
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