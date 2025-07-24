// src/app/page.tsx (Contient maintenant le code de la page de connexion)
'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTheme } from '@/contexts/ThemeContext'; // Chemin d'importation correct
// ✅ NOUVEAU : Import de useLanguage et LanguageCode
import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageCode } from '@/types';
import styles from './page.module.css';
import { FaDownload } from 'react-icons/fa'; // Icône de téléchargement

// ✅ OBJET ALLTRANSLATIONS COMPLET ET VÉRIFIÉ AVEC TOUTES LES LANGUES
const allTranslations = {
  loginPage: {
    title: {
      en: 'Access to Mission',
      fr: 'Accès à la Mission',
      mi: 'Te Urunga ki te Mihana',
      ga: 'Rochtain ar an Misean',
      hi: 'मिशन तक पहुंच',
      gd: 'Cothrom air a’ Mhisean',
      cy: 'Mynediad i Genhadaeth',
      'en-AU': 'Access to Mission', 'en-NZ': 'Access to Mission', 'en-CA': 'Access to Mission', 'fr-CA': 'Accès à la Mission', 'en-ZA': 'Access to Mission', af: 'Toegang tot Missie',
    },
    emailLabel: {
      en: 'TRANSMISSION ADDRESS',
      fr: 'ADRESSE DE TRANSMISSION',
      mi: 'Wāhi Tukunga',
      ga: 'SEOLADH TARCHURTHA',
      hi: 'प्रेषण पता',
      gd: 'SEÒLADH TAR-CHUR',
      cy: 'CYFEIRIAD TRAWSGYSTIAD',
      'en-AU': 'TRANSMISSION ADDRESS', 'en-NZ': 'TRANSMISSION ADDRESS', 'en-CA': 'TRANSMISSION ADDRESS', 'fr-CA': 'ADRESSE DE TRANSMISSION', 'en-ZA': 'TRANSMISSIE ADRES', af: 'TRANSMISSIE ADRES',
    },
    passwordLabel: {
      en: 'SECRET CODE',
      fr: 'CODE SECRET',
      mi: 'Waehere Huna',
      ga: 'CÓD RÚNACH',
      hi: 'गुप्त कोड',
      gd: 'CÔD DÌOMHAIR',
      cy: 'CÔD CYFRINACH',
      'en-AU': 'SECRET CODE', 'en-NZ': 'SECRET CODE', 'en-CA': 'SECRET CODE', 'fr-CA': 'CODE SECRET', 'en-ZA': 'GEHEIM KODE', af: 'GEHEIM KODE',
    },
    submitButton: {
      en: 'TRANSMIT',
      fr: 'TRANSMETTRE',
      mi: 'Tuku',
      ga: 'TARCHUR',
      hi: 'प्रेषित करें',
      gd: 'TAR-CHUR',
      cy: 'TRAWSGYSTIAD',
      'en-AU': 'TRANSMIT', 'en-NZ': 'TRANSMIT', 'en-CA': 'TRANSMIT', 'fr-CA': 'TRANSMETTRE', 'en-ZA': 'VERSEND', af: 'VERSEND',
    },
    submitting: {
      en: 'Transmitting...',
      fr: 'Transmission...',
      mi: 'E tuku ana...',
      ga: 'Ag Tarchur...',
      hi: 'प्रेषित कर रहा है...',
      gd: 'A’ tar-chur...',
      cy: 'Yn Trawsgyrru...',
      'en-AU': 'Transmitting...', 'en-NZ': 'Transmitting...', 'en-CA': 'Transmitting...', 'fr-CA': 'Transmission...', 'en-ZA': 'Besig om te stuur...', af: 'Besig om te stuur...',
    },
    errorInvalid: {
      en: 'Incorrect credentials. Access denied by HQ.',
      fr: 'Identifiants incorrects. Accès refusé par le QG.',
      mi: 'He he ngā tohu. Kua kore te uru e te HQ.',
      ga: 'Dintiúirí míchearta. Rochtain diúltaithe ag an Cheanncheathrú.',
      hi: 'गलत क्रेडेंशियल। मुख्यालय द्वारा पहुंच अस्वीकृत।',
      gd: 'Teisteanasan ceàrr. Cha deach cead a thoirt seachad le HQ.',
      cy: 'Manylion anghywir. Gwrthodir mynediad gan y Pencadlys.',
      'en-AU': 'Incorrect credentials. Access denied by HQ.', 'en-NZ': 'Incorrect credentials. Access denied by HQ.', 'en-CA': 'Incorrect credentials. Access denied by HQ.', 'fr-CA': 'Identifiants incorrects. Accès refusé par le QG.', 'en-ZA': 'Verkeerde geloofsbriewe. Toegang geweier deur HQ.', af: 'Verkeerde geloofsbriewe. Toegang geweier deur HQ.',
    },
    footerNewUser: {
      en: 'Not yet enrolled?',
      fr: 'Pas encore enrôlé ?',
      mi: 'Kāore anō kia rēhita?',
      ga: 'Nach bhfuil cláraithe fós?',
      hi: 'अभी तक नामांकित नहीं हैं?',
      gd: 'Gun a bhith clàraichte fhathast?',
      cy: 'Heb gofrestru eto?',
      'en-AU': 'Not yet enrolled?', 'en-NZ': 'Not yet enrolled?', 'en-CA': 'Not yet enrolled?', 'fr-CA': 'Pas encore enrôlé ?', 'en-ZA': 'Nog nie ingeskryf nie?', af: 'Nog nie ingeskryf nie?',
    },
    footerRegisterLink: {
      en: "Register at the office.",
      fr: "S'inscrire au bureau.",
      mi: 'Rēhita ki te tari.',
      ga: 'Cláraigh ag an oifig.',
      hi: 'कार्यालय में पंजीकरण करें।',
      gd: 'Clàraich aig an oifis.',
      cy: 'Cofrestrwch yn y swyddfa.',
      'en-AU': "Register at the office.", 'en-NZ': "Register at the office.", 'en-CA': "Register at the office.", 'fr-CA': "S'inscrire au bureau.", 'en-ZA': "Registreer by die kantoor.", af: "Registreer by die kantoor.",
    },
    footerForgotPassword: {
      en: 'Lost secret code?',
      fr: 'Code secret perdu?',
      mi: 'Waehere huna ngaro?',
      ga: 'Cód rúnda caillte?',
      hi: 'गुप्त कोड भूल गए?',
      gd: 'Còd dìomhair air chall?',
      cy: 'Cod cyfrinachol ar goll?',
      'en-AU': 'Lost secret code?', 'en-NZ': 'Lost secret code?', 'en-CA': 'Lost secret code?', 'fr-CA': 'Code secret perdu?', 'en-ZA': 'Verlore geheime kode?', af: 'Verlore geheime kode?',
    },
    installAppLabel: {
      en: 'Install App',
      fr: 'Installer l\'Application',
      mi: 'Tāuta Taupānga',
      ga: 'Suiteáil Feidhmchlár',
      hi: 'ऐप इंस्टॉल करें',
      gd: 'Stàlaich Aplacaid',
      cy: 'Gosod Ap',
      'en-AU': 'Install App', 'en-NZ': 'Install App', 'en-CA': 'Install App', 'fr-CA': 'Installer l\'Application', 'en-ZA': 'Installeer App', af: 'Installeer App',
    },
  },
};

// ✅ NOUVEAU : Fonction de traduction
function getTranslation<S extends keyof typeof allTranslations, K extends keyof typeof allTranslations[S]>(
  section: S,
  key: K,
  lang: LanguageCode
): string {
  const translations = (allTranslations[section] as any)?.[key];
  return translations?.[lang] || translations?.en || '';
}

export default function LoginPage() {
  const { theme } = useTheme();
  // ✅ NOUVEAU : Obtenir la langue
  const { language } = useLanguage();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Définition des couleurs à injecter comme variables CSS dans le style du div principal
  const textColor = theme === 'dark' ? '#E0E0E0' : '#111827';
  const mutedTextColor = theme === 'dark' ? '#A0A0A0' : '#6b7280';
  const borderColor = theme === 'dark' ? '#555555' : '#e5e7eb';
  const highlightColor = theme === 'dark' ? '#8BC4FF' : '#4A90E2';

  const backgroundColorPage = theme === 'dark' ? '#1f2937' : '#ffffff';
  const sectionBgColor = theme === 'dark' ? '#2A2A3A' : '#F8F8F8';

  const textShadowColor = theme === 'dark' ? 'rgba(0,0,0,0.6)' : 'rgba(0,0,0,0.1)';
  const shadowColorCard = theme === 'dark' ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.1)';
  const shadowColorButton = theme === 'dark' ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.1)';

  const inputBgColor = theme === 'dark' ? '#1F1F2A' : '#FFFFFF';
  const inputBorderColor = theme === 'dark' ? '#444444' : '#CCCCCC';
  const highlightColorLight = theme === 'dark' ? 'rgba(139, 196, 255, 0.3)' : 'rgba(74, 144, 226, 0.2)';

  const buttonPrimaryBg = theme === 'dark' ? '#005bb5' : '#0070f3';
  const buttonPrimaryHoverBg = theme === 'dark' ? '#004a99' : '#005edb';
  const buttonPrimaryText = theme === 'dark' ? '#E0E0E0' : 'white';

  const errorBackground = theme === 'dark' ? '#5C2D2D' : '#FFDADA';
  const errorText = theme === 'dark' ? '#FFCACA' : '#CC0000';
  const errorBorder = theme === 'dark' ? '#CC0000' : '#FF0000';
  const errorShadow = theme === 'dark' ? 'rgba(204,0,0,0.4)' : 'rgba(255,0,0,0.2)';


  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    await new Promise(resolve => setTimeout(resolve, 1000));
    if (email === 'user@example.com' && password === 'password') {
      console.log('Accès autorisé !');
      router.push('/dashboard');
    } else {
      // ✅ Utilisation de la traduction pour le message d'erreur
      setError(getTranslation('loginPage', 'errorInvalid', language));
    }
    setIsLoading(false);
  };

  const handleInstallClick = () => {
    router.push('/install'); // Redirige vers la page d'installation
  };

  return (
    <div
      className={styles.pageContainer}
      style={{
        '--kiwi-background-page': backgroundColorPage,
        '--kiwi-text-primary': textColor,
        '--kiwi-text-secondary': mutedTextColor,
        '--kiwi-border-color': borderColor,
        '--kiwi-background-section': sectionBgColor,
        '--kiwi-highlight-color': highlightColor,
        '--kiwi-highlight-color-light': highlightColorLight,
        '--kiwi-input-background-color': inputBgColor,
        '--kiwi-input-border-color': inputBorderColor,
        '--kiwi-button-primary-bg': buttonPrimaryBg,
        '--kiwi-button-primary-hover-bg': buttonPrimaryHoverBg,
        '--kiwi-button-primary-text': buttonPrimaryText,
        '--kiwi-shadow-color-card': shadowColorCard,
        '--kiwi-shadow-color-button': shadowColorButton,
        '--kiwi-text-shadow': `2px 2px 0px ${textShadowColor}`,
        '--kiwi-error-background': errorBackground,
        '--kiwi-error-text': errorText,
        '--kiwi-error-border': errorBorder,
        '--kiwi-error-shadow': errorShadow,
        '--font-special-elite': "'Playfair Display', serif",
        '--font-courier-prime': "'Georgia', serif",
      } as React.CSSProperties}
    >
      <div className={styles.formWrapper}>
        <button className={styles.installButton} onClick={handleInstallClick} aria-label={getTranslation('loginPage', 'installAppLabel', language)}>
          <FaDownload />
        </button>

        <h1 className={styles.title}>
          {getTranslation('loginPage', 'title', language)}
        </h1>

        {error && (
          <div className={styles.errorBox} role="alert">
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="transmission" className={styles.label}>
              {getTranslation('loginPage', 'emailLabel', language)}
            </label>
            <input
              id="transmission"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.inputField}
              disabled={isLoading}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="secret" className={styles.label}>
              {getTranslation('loginPage', 'passwordLabel', language)}
            </label>
            <input
              id="secret"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.inputField}
              disabled={isLoading}
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={styles.submitButton}
            >
              {isLoading ? getTranslation('loginPage', 'submitting', language) : getTranslation('loginPage', 'submitButton', language)}
            </button>
          </div>
        </form>

        <p className={styles.footerText}>
          {getTranslation('loginPage', 'footerNewUser', language)}{' '}
          <Link href="/inscription" className={styles.link}>
            {getTranslation('loginPage', 'footerRegisterLink', language)}
          </Link>
        </p>
        
        <p className={styles.forgotPasswordText}>
          <Link href="/forgot-password" className={styles.link}>
            {getTranslation('loginPage', 'footerForgotPassword', language)}
          </Link>
        </p>
      </div>
    </div>
  );
}