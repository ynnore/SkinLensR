'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/contexts/ThemeContext'; // Importez le hook useTheme
import { useLanguage } from '@/contexts/LanguageContext'; // Importez useLanguage
import { LanguageCode } from '@/types'; // Importez LanguageCode
import styles from './inscription.module.css'; // Importez le CSS module

// Définitions des traductions pour cette page
const allTranslations = {
  inscriptionPage: {
    mainTitle: {
      en: 'Registration Bureau',
      fr: 'Bureau d\'Inscription',
      mi: 'Tari Whakarēhita',
      ga: 'Biúró Clárúcháin',
      hi: 'पंजीकरण ब्यूरो',
      gd: 'Biùro Clàraidh',
      'en-AU': 'Registration Bureau', 'en-NZ': 'Registration Bureau', 'en-CA': 'Registration Bureau', 'fr-CA': 'Bureau d\'Inscription', 'en-ZA': 'Registration Bureau', af: 'Registrasiekantoor'
    },
    preamble: {
      en: 'Agents wishing to participate in operations are requested to complete the form below. Discretion is required.',
      fr: 'Les agents désirant prendre part aux opérations sont priés de remplir la fiche ci-dessous. La discrétion est de rigueur.',
      mi: 'Me whakakī e ngā āpiha e hiahia ana ki te whai wāhi ki ngā mahi te puka i raro nei. Me huna tonu.',
      ga: 'Iarrtar ar ghníomhairí ar mian leo páirt a ghlacadh in oibríochtaí an fhoirm thíos a chomhlánú. Tá discréid ag teastáil.',
      hi: 'ऑपरेशन में भाग लेने के इच्छुक एजेंटों से अनुरोध है कि वे नीचे दिया गया फॉर्म भरें। विवेक की आवश्यकता है।',
      gd: 'Feuch an lìon na riochdairean a tha ag iarraidh pàirt a ghabhail ann an gnìomhachdan am foirm gu h-ìosal. Tha dìomhaireachd riatanach.',
      'en-AU': 'Agents wishing to participate in operations are requested to complete the form below. Discretion is required.', 'en-NZ': 'Agents wishing to participate in operations are requested to complete the form below. Discretion is required.', 'en-CA': 'Agents wishing to participate in operations are requested to complete the form below. Discretion is required.', 'fr-CA': 'Les agents désirant prendre part aux opérations sont priés de remplir la fiche ci-dessous. La discrétion est de rigueur.', 'en-ZA': 'Agente wat aan operasies wil deelneem, word versoek om die onderstaande vorm te voltooi. Diskresie word vereis.', af: 'Agente wat aan operasies wil deelneem, word versoek om die onderstaande vorm te voltooi. Diskresie word vereis.'
    },
    // Form Labels
    codeNameLabel: {
      en: 'CODE NAME',
      fr: 'NOM DE CODE',
      mi: 'INGOA WAEHERE',
      ga: 'AINM CÓD',
      hi: 'कोड नाम',
      gd: 'AINM CÒD',
      'en-AU': 'CODE NAME', 'en-NZ': 'CODE NAME', 'en-CA': 'CODE NAME', 'fr-CA': 'NOM DE CODE', 'en-ZA': 'KODENAAM', af: 'KODENAAM'
    },
    transmissionAddressLabel: {
      en: 'TRANSMISSION ADDRESS (E-mail)',
      fr: 'ADRESSE DE TRANSMISSION (E-mail)',
      mi: 'WĀHITAU WHAKAWITI (Īmēra)',
      ga: 'SEOLADH TARCHURTHA (Ríomhphost)',
      hi: 'संचरण पता (ईमेल)',
      gd: 'SEÒLADH Sgaoilidh (Post-d)',
      'en-AU': 'TRANSMISSION ADDRESS (E-mail)', 'en-NZ': 'TRANSMISSION ADDRESS (E-mail)', 'en-CA': 'TRANSMISSION ADDRESS (E-mail)', 'fr-CA': 'ADRESSE DE TRANSMISSION (E-mail)', 'en-ZA': 'VERSENDINGSADRES (E-pos)', af: 'VERSENDINGSADRES (E-pos)'
    },
    secretCodeLabel: {
      en: 'SECRET CODE (Password)',
      fr: 'CODE SECRET (Mot de passe)',
      mi: 'WAEHERE NGaro (Kupuhipa)',
      ga: 'CÓD RÚNDA (Pasfhocal)',
      hi: 'गुप्त कोड (पासवर्ड)',
      gd: 'CÒD DÌOMHAIR (Facal-faire)',
      'en-AU': 'SECRET CODE (Password)', 'en-NZ': 'SECRET CODE (Password)', 'en-CA': 'SECRET CODE (Password)', 'fr-CA': 'CODE SECRET (Mot de passe)', 'en-ZA': 'GEHEIME KODE (Wagwoord)', af: 'GEHEIME KODE (Wagwoord)'
    },
    // Button Texts
    loadingButtonText: {
      en: 'Registering...',
      fr: 'Enregistrement...',
      mi: 'Kei te Whakarēhita...',
      ga: 'Ag Clárú...',
      hi: 'पंजीकरण हो रहा है...',
      gd: 'A’ Clàradh...',
      'en-AU': 'Registering...', 'en-NZ': 'Registering...', 'en-CA': 'Registering...', 'fr-CA': 'Enregistrement...', 'en-ZA': 'Registrasie...', af: 'Registrasie...'
    },
    submitButtonText: {
      en: 'VALIDATE ENROLLMENT',
      fr: 'VALIDER L\'ENRÔLEMENT',
      mi: 'WHAKAMANA I TE WHAKARĒHITA',
      ga: 'BAILIÓCHTAIGH AN CLÁRÚ',
      hi: 'नामांकन मान्य करें',
      gd: 'DEARBH AITHISG',
      'en-AU': 'VALIDATE ENROLLMENT', 'en-NZ': 'VALIDATE ENROLLMENT', 'en-CA': 'VALIDATE ENROLLMENT', 'fr-CA': 'VALIDER L\'ENRÔLEMENT', 'en-ZA': 'VALIDER INSKRYWING', af: 'VALIDER INSKRYWING'
    },
    orSeparator: {
      en: 'OR',
      fr: 'OU',
      mi: 'RĀNEI',
      ga: 'NÓ',
      hi: 'या',
      gd: 'NO',
      'en-AU': 'OR', 'en-NZ': 'OR', 'en-CA': 'OR', 'fr-CA': 'OU', 'en-ZA': 'OF', af: 'OF'
    },
    enrollWithGoogle: {
      en: 'ENROLL WITH GOOGLE',
      fr: 'ENRÔLEMENT AVEC GOOGLE',
      mi: 'WHAKARĒHITA MĀ GOOGLE',
      ga: 'CLÁRAIGH LE GOOGLE',
      hi: 'गूगल से नामांकन करें',
      gd: 'CLÀRAICH LE GOOGLE',
      'en-AU': 'ENROLL WITH GOOGLE', 'en-NZ': 'ENROLL WITH GOOGLE', 'en-CA': 'ENROLL WITH GOOGLE', 'fr-CA': 'ENRÔLEMENT AVEC GOOGLE', 'en-ZA': 'SKRYF IN MET GOOGLE', af: 'SKRYF IN MET GOOGLE'
    },
    enrollWithGithub: {
      en: 'ENROLL WITH GITHUB',
      fr: 'ENRÔLEMENT AVEC GITHUB',
      mi: 'WHAKARĒHITA MĀ GITHUB',
      ga: 'CLÁRAIGH LE GITHUB',
      hi: 'गिटहब से नामांकन करें',
      gd: 'CLÀRAICH LE GITHUB',
      'en-AU': 'ENROLL WITH GITHUB', 'en-NZ': 'ENROLL WITH GITHUB', 'en-CA': 'ENROLL WITH GITHUB', 'fr-CA': 'ENRÔLEMENT AVEC GITHUB', 'en-ZA': 'SKRYF IN MET GITHUB', af: 'SKRYF IN MET GITHUB'
    },
    // Footer Text
    alreadyMatricule: {
      en: 'Already registered?',
      fr: 'Déjà un matricule ?',
      mi: 'Kua rehita kē?',
      ga: 'Cláraithe cheana?',
      hi: 'पहले से ही पंजीकृत हैं?',
      gd: 'Clàraichte mar-thà?',
      'en-AU': 'Already registered?', 'en-NZ': 'Already registered?', 'en-CA': 'Already registered?', 'fr-CA': 'Déjà un matricule ?', 'en-ZA': 'Reeds geregistreer?', af: 'Reeds geregistreer?'
    },
    accessCommandPost: {
      en: 'Access Command Post.',
      fr: 'Accéder au Poste de Commandement.',
      mi: 'Uru ki te Pou Whakahau.',
      ga: 'Rochtain ar an Ionad Ceannais.',
      hi: 'कमांड पोस्ट तक पहुंचें।',
      gd: 'Faigh Cothrom air an Ionad-Command.',
      'en-AU': 'Access Command Post.', 'en-NZ': 'Access Command Post.', 'en-CA': 'Access Command Post.', 'fr-CA': 'Accéder au Poste de Commandement.', 'en-ZA': 'Kry toegang tot Bevelspos.', af: 'Toegang tot Bevelspos.'
    },
  },
};

// Fonction de traduction générique
const getTranslation = <S extends keyof typeof allTranslations, K extends keyof typeof allTranslations[S]>(
  section: S,
  key: K,
  lang: LanguageCode
): string => {
  const sectionTranslations = allTranslations[section];
  if (!sectionTranslations) {
    console.warn(`Translation section not found: ${String(section)}`);
    return `[Missing Section: ${String(section)}]`;
  }
  const specificTranslations = sectionTranslations[key];
  if (typeof specificTranslations !== 'object' || specificTranslations === null || !('en' in specificTranslations)) {
    console.warn(`Translation missing or invalid for: ${String(section)}.${String(key)} in language ${lang}`);
    return `[Invalid Translation: ${String(section)}.${String(key)}]`;
  }
  return (specificTranslations as { [l: string]: string })[lang] || (specificTranslations as { [l: string]: string }).en;
};


export default function InscriptionPage() {
  const { theme } = useTheme();
  const { language } = useLanguage(); // Obtenez la langue courante

  const [nomDeCode, setNomDeCode] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Définissez les couleurs et autres propriétés en fonction du thème
  const textColor = theme === 'dark' ? '#E0E0E0' : '#333333';
  const mutedTextColor = theme === 'dark' ? '#A0A0A0' : '#666666';
  const borderColor = theme === 'dark' ? '#555555' : '#AAAAAA';
  const backgroundColorPage = theme === 'dark' ? '#1A1A2E' : '#f9fafb';
  const sectionBgColor = theme === 'dark' ? '#2A2A3A' : '#F5F0E1';
  const highlightColor = theme === 'dark' ? '#8BC4FF' : '#4A90E2';
  const textShadowColor = theme === 'dark' ? 'rgba(0,0,0,0.6)' : 'rgba(150,150,150,0.4)';
  const shadowColorCard = theme === 'dark' ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.2)';
  const shadowColorButton = theme === 'dark' ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.15)';

  const inputBgColor = theme === 'dark' ? '#1F1F2A' : '#FFFFFF';
  const inputBorderColor = theme === 'dark' ? '#444444' : '#CCCCCC';
  const highlightColorLight = theme === 'dark' ? 'rgba(139, 196, 255, 0.3)' : 'rgba(74, 144, 226, 0.2)';

  const buttonPrimaryBg = theme === 'dark' ? '#005bb5' : '#0070f3';
  const buttonPrimaryHoverBg = theme === 'dark' ? '#004a99' : '#005edb';
  const buttonPrimaryText = theme === 'dark' ? '#E0E0E0' : 'white';

  const socialButtonBg = theme === 'dark' ? '#424242' : '#E0E0E0';
  const socialButtonHoverBg = theme === 'dark' ? '#555555' : '#D0D0D0';
  const socialButtonText = theme === 'dark' ? '#E0E0E0' : '#333333';
  const socialButtonBorder = theme === 'dark' ? '#666666' : '#BBBBBB';


  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    console.log('Tentative d\'enrôlement avec :', { nomDeCode, email });
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    router.push('/dashboard');
  };

  return (
    <div
      className={styles.pageContainer}
      style={{
        backgroundColor: backgroundColorPage,
        '--kiwi-text-primary': textColor,
        '--kiwi-text-secondary': mutedTextColor,
        '--kiwi-border-color': borderColor,
        '--kiwi-border-color-muted': mutedTextColor,
        '--kiwi-background-section': sectionBgColor,
        '--kiwi-highlight-color': highlightColor,
        '--kiwi-highlight-color-light': highlightColorLight,
        '--kiwi-input-background-color': inputBgColor,
        '--kiwi-input-border-color': inputBorderColor,
        '--kiwi-button-primary-bg': buttonPrimaryBg,
        '--kiwi-button-primary-hover-bg': buttonPrimaryHoverBg,
        '--kiwi-button-primary-text': buttonPrimaryText,
        '--kiwi-social-button-bg': socialButtonBg,
        '--kiwi-social-button-hover-bg': socialButtonHoverBg,
        '--kiwi-social-button-text': socialButtonText,
        '--kiwi-social-button-border': socialButtonBorder,
        '--kiwi-shadow-color-card': shadowColorCard,
        '--kiwi-shadow-color-button': shadowColorButton,
        '--kiwi-text-shadow': `2px 2px 0px ${textShadowColor}`
      } as React.CSSProperties}
    >
      <div className={styles.formWrapper}>
        <h1 className={styles.title}>{getTranslation('inscriptionPage', 'mainTitle', language)}</h1>
        <p className={styles.preamble}>
          {getTranslation('inscriptionPage', 'preamble', language)}
        </p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="nomdecode" className={styles.label}>{getTranslation('inscriptionPage', 'codeNameLabel', language)}</label>
            <input id="nomdecode" type="text" required value={nomDeCode} onChange={(e) => setNomDeCode(e.target.value)} className={styles.inputField} disabled={isLoading} />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="transmission" className={styles.label}>{getTranslation('inscriptionPage', 'transmissionAddressLabel', language)}</label>
            <input id="transmission" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={styles.inputField} disabled={isLoading} />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="secret" className={styles.label}>{getTranslation('inscriptionPage', 'secretCodeLabel', language)}</label>
            <input id="secret" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className={styles.inputField} disabled={isLoading} />
          </div>

          <div>
            <button type="submit" disabled={isLoading} className={styles.submitButton}>
              {isLoading ? getTranslation('inscriptionPage', 'loadingButtonText', language) : getTranslation('inscriptionPage', 'submitButtonText', language)}
            </button>
          </div>
        </form>

        <div className={styles.separator}>
          <span className={styles.separatorLine}></span>
          <span className={styles.separatorText}>{getTranslation('inscriptionPage', 'orSeparator', language)}</span>
          <span className={styles.separatorLine}></span>
        </div>

        <div className={styles.socialButtonsContainer}>
          <button className={styles.socialButton}>
            {getTranslation('inscriptionPage', 'enrollWithGoogle', language)}
          </button>
          <button className={styles.socialButton}>
            {getTranslation('inscriptionPage', 'enrollWithGithub', language)}
          </button>
        </div>

        <p className={styles.footerText}>
          {getTranslation('inscriptionPage', 'alreadyMatricule', language)}{' '}
          <Link href="/" className={styles.link}>
            {getTranslation('inscriptionPage', 'accessCommandPost', language)}
          </Link>
        </p>
      </div>
    </div>
  );
}