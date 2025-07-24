// Fichier: src/app/logout/page.tsx
'use client';

import React, { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTheme } from '@/context/ThemeContext'; // Assurez-vous du bon chemin
import { useLanguage } from '@/contexts/LanguageContext'; // Assurez-vous du bon chemin
import { LanguageCode } from '@/types';

import { FaBroadcastTower } from 'react-icons/fa'; // Gardons cette icône plus thématique

import styles from './logout.module.css';

// Définitions des traductions complètes
const allTranslations = {
  logoutPage: {
    title: {
      en: 'Permission Request', fr: 'Demande de Permission', mi: 'Tono Whakaaetanga', ga: 'Iarraidh Cead', hi: 'अनु अनुमति अनुरोध', gd: 'Iarrtas Cead', 'en-AU': 'Permission Request', 'en-NZ': 'Permission Request', 'en-CA': 'Permission Request', 'fr-CA': 'Demande de Permission', 'en-ZA': 'Permission Request', af: 'Toestemmingsversoek'
    },
    preamble: {
      en: 'Agent, your permission request has been recorded. Please confirm your departure from the post. Your access will be suspended until your return.', fr: 'Agent, votre demande de permission a été enregistrée. Veuillez confirmer votre départ du poste. Vos accès seront suspendus jusqu\'à votre retour.', mi: 'Āpiha, kua rēhitahia tō tono whakaaetanga. Tēnā whakaū i tō wehenga mai i te pou. Ka whakatārewa tō uru ki te wā ka hoki mai koe.', ga: 'Gníomhaire, tá d\'iarratas ceada taifeadta. Deimhnigh do imeacht ón phost le do thoil. Cuirfear do rochtain ar fionraí go dtí go bhfillfidh tú.', hi: 'एजेंट, आपकी अनुमति का अनुरोध दर्ज कर लिया गया है। कृपया पद से अपना प्रस्थान सुनिश्चित करें। आपकी वापसी तक आपकी पहुंच निलंबित कर दी जाएगी।', gd: 'Àidseant, chaidh an t-iarrtas cead agad a chlàradh. Feuch an dearbhaich thu do fhàgail bhon phost. Thèid do chothrom a chur air fionnar gus an till thu.', 'en-AU': 'Agent, your permission request has been recorded. Please confirm your departure from the post. Your access will be suspended until your return.', 'en-NZ': 'Agent, your permission request has been recorded. Please confirm your departure from the post. Your access will be suspended until your return.', 'en-CA': 'Agent, your permission request has been recorded. Please confirm your departure from the post. Your access will be suspended until your return.', 'fr-CA': 'Agent, votre demande de permission a été enregistrée. Veuillez confirmer votre départ du poste. Vos accès seront suspendus jusqu\'à votre retour.', 'en-ZA': 'U toestemmingsversoek is opgeneem. Bevestig asseblief u vertrek van die pos. U toegang sal opgeskort word totdat u terugkeer.', af: 'U toestemmingsversoek is opgeneem. Bevestig asseblief u vertrek van die pos. U toegang sal opgeskort word totdat u terugkeer.'
    },
    matriculeLabel: {
      en: 'REGISTRATION NUMBER:', fr: 'MATRICULE :', mi: 'NOHO REHITA:', ga: 'UIMHIR CHLÁRÚCHÁIN:', hi: 'पंजीकरण संख्या:', gd: 'ÀIREAMH CLÀRAIDH:', 'en-AU': 'REGISTRATION NUMBER:', 'en-NZ': 'REGISTRATION NUMBER:', 'en-CA': 'REGISTRATION NUMBER:', 'fr-CA': 'MATRICULE :', 'en-ZA': 'REGISTRASIE NOMMER:', af: 'REGISTRASIE NOMMER:'
    },
    codeNameLabel: {
      en: 'CODE NAME:', fr: 'NOM DE CODE :', mi: 'INGOA WAEHERE:', ga: 'AINM CÓD:', hi: 'कोड नाम:', gd: 'AINM CÒD:', 'en-AU': 'CODE NAME:', 'en-NZ': 'CODE NAME:', 'en-CA': 'CODE NAME:', 'fr-CA': 'NOM DE CODE :', 'en-ZA': 'KODE NAAM:', af: 'KODE NAAM:'
    },
    currentPostLabel: {
      en: 'CURRENT POST:', fr: 'POSTE ACTUEL :', mi: 'TŪNGA O NĀIANEi:', ga: 'POST REATHA:', hi: 'वर्तमान पद:', gd: 'POSTA LÀITHREACH:', 'en-AU': 'CURRENT POST:', 'en-NZ': 'CURRENT POST:', 'en-CA': 'CURRENT POST:', 'fr-CA': 'POSTE ACTUEL :', 'en-ZA': 'HUIDIGE POS:', af: 'HUIDIGE POS:'
    },
    confirmMessage: {
      en: 'Permission request approved. Demobilization in progress...', fr: 'Demande de permission approuvée. Démobilisation en cours...', mi: 'Kua whakaaetia te tono whakaaetanga. Kei te haere tonu te whakatārewatanga...', ga: 'Iarratas ceada ceadaithe. Dímhobilú ar siúl...', hi: 'अनुमति अनुरोध स्वीकृत। विमुद्रीकरण प्रगति पर है...', gd: 'Iarrtas cead air aontachadh. A’ dì-mhobilachadh a’ dol air adhart...', 'en-AU': 'Permission request approved. Demobilization in progress...', 'en-NZ': 'Permission request approved. Demobilization in progress...', 'en-CA': 'Permission request approved. Demobilization in progress...', 'fr-CA': 'Demande de permission approuvée. Dímhobilú ar siúl...', 'en-ZA': 'Toestemmingsversoek goedgekeur. Demobilisasie aan die gang...', af: 'Toestemmingsversoek goedgekeur. Demobilisasie aan die gang...'
    },
    cancelButton: {
      en: 'CANCEL AND RESUME SERVICE', fr: 'ANNULER ET REPRENDRE LE SERVICE', mi: 'WHAKAKORE ME TE HAERE TONU KI TE RATONGA', ga: 'CEALAIGH AGUS ATOSAIGH SEIRBHÍS', hi: 'रद्द करें और सेवा फिर se शुरू करें', gd: 'SGUAB AS AGUS TÒISICH SEIRBHEIS', 'en-AU': 'CANCEL AND RESUME SERVICE', 'en-NZ': 'CANCEL AND RESUME SERVICE', 'en-CA': 'CANCEL AND RESUME SERVICE', 'fr-CA': 'ANNULER ET REPRENDRE LE SERVICE', 'en-ZA': 'KANSELLEER EN HERVAT DIENS', af: 'KANSELLEER EN HERVAT DIENS'
    },
    confirmButton: {
      en: 'CONFIRM REQUEST AND LEAVE POST', fr: 'CONFIRMER LA DEMANDE ET QUITTER LE POSTE', mi: 'WHAKAPŪMAU I TE TONO ME TE WEHE I TE POU', ga: 'DEIMHNIGH AN IARRATAS AGUS FÁG AN POST', hi: 'अनुरोध की पुष्टि करें और पद छोड़ें', gd: 'DEARBH AITHISG AGUS FÀG POSTA', 'en-AU': 'CONFIRM REQUEST AND LEAVE POST', 'en-NZ': 'CONFIRM REQUEST AND LEAVE POST', 'en-CA': 'CONFIRM REQUEST AND LEAVE POST', 'fr-CA': 'CONFIRMER LA DEMANDE ET QUITTER LE POSTE', 'en-ZA': 'BEVESTIG VERSOEK EN VERLAAT POS', af: 'BEVESTIG VERSOEK EN VERLAAT POS'
    },
    footerText: {
      en: 'Discretion is required, even on leave.', fr: 'La discrétion est requise, même en permission.', mi: 'Me huna tonu, ahakoa kei te hararei.', ga: 'Tá discréid ag teastáil, fiú amháin air saoire.', hi: 'छुट्टी पर भी विवेक आवश्यक है।', gd: 'Tha dìomhaireachd a dhìth, eadhon air cead.', 'en-AU': 'Discretion is required, even on leave.', 'en-NZ': 'Discretion is required, even on leave.', 'en-CA': 'Discretion is required, even on leave.', 'fr-CA': 'La discrétion est requise, même en permission.', 'en-ZA': 'Diskresie word vereis, selfs op verlof.', af: 'Diskresie word vereis, selfs op verlof.'
    },
  },
  stayTunedButton: {
    label: {
      en: 'Stay Tuned: Coming Soon', fr: 'Restez Connecté : Bientôt Disponible', mi: 'Kia Mau Ki a Mātou: Ka Tata', ga: 'Fan Tiúnta: Ag Teacht Go Luath', hi: 'बने रहें: जल्द आ रहा है', gd: 'Fuirich Tiùnaidh: Ri Teachd', 'en-AU': 'Stay Tuned: Coming Soon', 'en-NZ': 'Stay Tuned: Coming Soon', 'en-CA': 'Stay Tuned: Coming Soon', 'fr-CA': 'Restez Connecté : Bientôt Disponible', 'en-ZA': 'Bly Ingeskakel: Kom Binnekort', af: 'Bly Ingeskakel: Kom Binnekort'
    },
  },
};

// Fonction de traduction générique
function getTranslation<S extends keyof typeof allTranslations, K extends keyof typeof allTranslations[S]>(
  section: S, key: K, lang: LanguageCode
): string {
  const sectionTranslations = allTranslations[section];
  if (!sectionTranslations) {
    console.warn(`Translation section not found: ${String(section)}`);
    return `[Missing Section: ${String(section)}]`;
  }
  
  const specificTranslationsData = (sectionTranslations[key] as Record<string, string> | undefined | null);

  if (typeof specificTranslationsData !== 'object' || specificTranslationsData === null || !('en' in specificTranslationsData)) {
    console.warn(`Translation missing or invalid for: ${String(section)}.${String(key)} in language ${lang}`);
    return `[Invalid Translation: ${String(section)}.${String(key)}]`;
  }

  return specificTranslationsData[lang] || specificTranslationsData.en;
}


export default function LogoutPage() {
  const router = useRouter();
  const { theme } = useTheme();
  const { language } = useLanguage();

  const textColor = theme === 'dark' ? '#E0E0E0' : '#333333';
  const mutedTextColor = theme === 'dark' ? '#A0A0A0' : '#666666';
  const borderColor = theme === 'dark' ? '#555555' : '#AAAAAA';
  const backgroundColorPage = theme === 'dark' ? '#1A1A2E' : '#f9fafb';
  const sectionBgColor = theme === 'dark' ? '#2A2A3A' : '#F8F8F8'; // Corrected to match login page
  const highlightColor = theme === 'dark' ? '#8BC4FF' : '#4A90E2';
  const textShadowColor = theme === 'dark' ? 'rgba(0,0,0,0.6)' : 'rgba(150,150,150,0.4)';
  const shadowColorCard = theme === 'dark' ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.2)';
  const shadowColorCardLight = theme === 'dark' ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.1)';
  const shadowColorButton = theme === 'dark' ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.15)';

  const buttonPrimaryText = theme === 'dark' ? '#E0E0E0' : 'white';

  const buttonDangerBg = theme === 'dark' ? '#B03A2E' : '#dc3545';
  const buttonDangerHoverBg = theme === 'dark' ? '#993026' : '#c82333';

  const buttonSecondaryBg = theme === 'dark' ? '#6c757d' : '#6c757d';
  const buttonSecondaryHoverBg = theme === 'dark' ? '#5a6268' : '#5a6268';

  const infoBackground = theme === 'dark' ? '#3A3A4A' : '#EFEBE9';
  const infoBorder = theme === 'dark' ? '#4A4A4A' : '#D0D0D0';


  const handleConfirmLogout = useCallback(async () => {
    console.log(getTranslation('logoutPage', 'confirmMessage', language));
    router.push('/');
  }, [language, router]);

  const handleCancel = useCallback(() => {
    router.back();
  }, [router]);

  const handleStayTunedClick = useCallback(() => {
    router.push('/stay-tuned-hub');
  }, [router]);

  return (
    <div
      className={styles.pageContainer}
      style={{
        backgroundColor: backgroundColorPage,
        '--kiwi-text-primary': textColor,
        '--kiwi-text-secondary': mutedTextColor,
        '--kiwi-border-color': borderColor,
        '--kiwi-background-section': sectionBgColor,
        '--kiwi-highlight-color': highlightColor,
        '--kiwi-text-shadow': `2px 2px 0px ${textShadowColor}`,
        '--kiwi-shadow-color-card': shadowColorCard,
        '--kiwi-shadow-color-card-light': shadowColorCardLight,
        '--kiwi-shadow-color-button': shadowColorButton,
        '--kiwi-button-primary-text': buttonPrimaryText,
        '--kiwi-button-danger-bg': buttonDangerBg,
        '--kiwi-button-danger-hover-bg': buttonDangerHoverBg,
        '--kiwi-button-secondary-bg': buttonSecondaryBg,
        '--kiwi-button-secondary-hover-bg': buttonSecondaryHoverBg,
        '--kiwi-info-background': infoBackground,
        '--kiwi-info-border': infoBorder,
      } as React.CSSProperties}
    >
      <div className={styles.formWrapper}>
        {/* Bouton "Stay Tuned" en haut à droite */}
        <button 
          className={styles.stayTunedButton} 
          onClick={handleStayTunedClick} 
          aria-label={getTranslation('stayTunedButton', 'label', language)}
        >
          <FaBroadcastTower className={styles.stayTunedIcon} />
          <span className={styles.stayTunedLabel}>{getTranslation('stayTunedButton', 'label', language)}</span>
        </button>

        <h1 className={styles.title}>{getTranslation('logoutPage', 'title', language)}</h1>
        <p className={styles.preamble}>
          {getTranslation('logoutPage', 'preamble', language)}
        </p>

        <div className={styles.infoSection}>
          <p><span>{getTranslation('logoutPage', 'matriculeLabel', language)}</span> KWI-007</p>
          <p><span>{getTranslation('logoutPage', 'codeNameLabel', language)}</span> Ronny</p>
          <p><span>{getTranslation('logoutPage', 'currentPostLabel', language)}</span> État-Major</p>
        </div>

        <div className={styles.buttonContainer}>
          <button onClick={handleCancel} className={`${styles.button} ${styles.cancelButton}`}>
            {getTranslation('logoutPage', 'cancelButton', language)}
          </button>
          <button onClick={handleConfirmLogout} className={`${styles.button} ${styles.confirmButton}`}>
            {getTranslation('logoutPage', 'confirmButton', language)}
          </button>
        </div>

        <p className={styles.footerText}>
          {getTranslation('logoutPage', 'footerText', language)}
        </p>
      </div>
    </div>
  );
}