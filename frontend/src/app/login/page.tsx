'use client';'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageCode } from '@/types';
import { FcGoogle } from 'react-icons/fc';
import { FaMicrosoft, FaLinkedinIn } from 'react-icons/fa';
import styles from './login.module.css';

const allTranslations = {
  loginPage: {
    mainTitle: {
      en: 'Agent Login', fr: 'Connexion Agent', mi: 'Takiuru Ahente', ga: 'Logáil Gníomhaire', hi: 'एजेंट लॉगिन', gd: 'Log a-steach Neach-ionaid',
      'en-AU': 'Agent Login', 'en-NZ': 'Agent Login', 'en-CA': 'Agent Login', 'fr-CA': 'Connexion Agent', 'en-ZA': 'Agent Login', af: 'Agent Teken In'
    },
    preamble: {
      en: 'Access the Command Post. Discretion is required.', fr: 'Accédez au Poste de Commandement. La discrétion est de rigueur.', mi: 'Uru ki te Pou Whakahau. Me huna tonu.', ga: 'Faigh rochtain ar an Ionad Ceannais. Tá discréid ag teastáil.', hi: 'कमांड पोस्ट तक पहुंचें। विवेक की आवश्यकता है।', gd: 'Faigh cothrom air an Ionad-Command. Tha dìomhaireachd riatanach.',
      'en-AU': 'Access Command Post. Discretion is required.', 'en-NZ': 'Access Command Post. Discretion is required.', 'en-CA': 'Access Command Post. Discretion is required.', 'fr-CA': 'Accédez au Poste de Commandement. La discrétion est de rigueur.', 'en-ZA': 'Kry toegang tot Bevelspos. Diskresie word vereis.', af: 'Toegang tot Bevelspos. Diskresie word vereis.'
    },
    usernameLabel: {
      en: 'Agent Identifier (E-mail)', fr: 'Identifiant Agent (E-mail)', mi: 'Kaiwhakahaere Kaihoko (Īmēra)', ga: 'Aitheantóir Gníomhaire (Ríomhphost)', hi: 'एजेंट पहचानकर्ता (ईमेल)', gd: 'Neach-aithneachaidh an Àidseant (Post-d)',
      'en-AU': 'Agent Identifier (E-mail)', 'en-NZ': 'Agent Identifier (E-mail)', 'en-CA': 'Agent Identifier (E-mail)', 'fr-CA': 'Identifiant Agent (E-mail)', 'en-ZA': 'Agent Identifiseerder (E-pos)', af: 'Agent Identifiseerder (E-pos)'
    },
    passwordLabel: {
      en: 'SECRET CODE (Password)', fr: 'CODE SECRET (Mot de passe)', mi: 'WAEHERE NGARO (Kupuhipa)', ga: 'CÓD RÚNDA (Pasfhocal)', hi: 'गुप्त कोड (पासवर्ड)', gd: 'CÒD DÌOMHAIR (Facal-faire)',
      'en-AU': 'SECRET CODE (Password)', 'en-NZ': 'SECRET CODE (Password)', 'en-CA': 'SECRET CODE (Password)', 'fr-CA': 'CODE SECRET (Mot de passe)', 'en-ZA': 'GEHEIME KODE (Wagwoord)', af: 'GEHEIME KODE (Wagwoord)'
    },
    loadingButtonText: {
      en: 'Logging in...', fr: 'Connexion en cours...', mi: 'Kei te takiuru...', ga: 'Ag logáil isteach...', hi: 'लॉग इन हो रहा है...', gd: 'A’ Logadh a-steach...',
      'en-AU': 'Logging in...', 'en-NZ': 'Logging in...', 'en-CA': 'Logging in...', 'fr-CA': 'Connexion en cours...', 'en-ZA': 'Besig om aan te meld...', af: 'Besig om aan te meld...'
    },
    submitButtonText: {
      en: 'ACCESS COMMAND POST', fr: 'ACCÉDER AU POSTE DE COMMANDEMENT', mi: 'URU KI TE POU WHAKAHAU', ga: 'ROCHTAIN AN T-IONAD CEANNAIS', hi: 'कमांड पोस्ट तक पहुंचें', gd: 'FAIGH COTHROM AIR AN IONAD-COMMAND',
      'en-AU': 'ACCESS COMMAND POST', 'en-NZ': 'ACCESS COMMAND POST', 'en-CA': 'ACCESS COMMAND POST', 'fr-CA': 'ACCÉDER AU POSTE DE COMMANDEMENT', 'en-ZA': 'TOEGANG TOT BEVELSPOS', af: 'TOEGANG TOT BEVELSPOS'
    },
    orSeparator: {
      en: 'OR', fr: 'OU', mi: 'RĀNEI', ga: 'NÓ', hi: 'या', gd: 'NO',
      'en-AU': 'OR', 'en-NZ': 'OR', 'en-CA': 'OR', 'fr-CA': 'OU', 'en-ZA': 'OF', af: 'OF'
    },
    forgotPassword: {
      en: 'Forgot password?', fr: 'Mot de passe oublié ?', mi: 'Kua wareware te kupuhipa?', ga: 'An ndearna tú dearmad ar do phasfhocal?', hi: 'पासवर्ड भूल गए?', gd: 'Facal-faire dìochuimhnichte?',
      'en-AU': 'Forgot password?', 'en-NZ': 'Forgot password?', 'en-CA': 'Forgot password?', 'fr-CA': 'Mot de passe oublié ?', 'en-ZA': 'Wagwoord Vergete?', af: 'Wagwoord Vergete?'
    },
    errorMessageGeneric: {
      en: 'An error occurred during login. Please try again later.', fr: 'Une erreur est survenue lors de la connexion. Veuillez réessayer plus tard.', mi: 'I puta he hapa i te takiurunga. Whakamātauria anō ā muri ake nei.', ga: 'Tharla earráid le linn logála isteach. Bain triail eile as níos déanaí le do thoil.', hi: 'लॉग इन के दौरान एक त्रुटि हुई। कृपया बाद में पुनः प्रयास करें।', gd: 'Bha mearachd ann nuair a bha thu a’ logadh a-steach. Feuch a-rithist nas fhaide air adhart.',
      'en-AU': 'An error occurred during login. Please try again later.', 'en-NZ': 'An error occurred during login. Please try again later.', 'en-CA': 'An error occurred during login. Please try again later.', 'fr-CA': 'Une erreur est survenue lors de la connexion. Veuillez réessayer plus tard.', 'en-ZA': 'An anomaly occurred during login. Please try again later.', af: 'An anomaly occurred during login. Please try again later.'
    },
    emailValidated: {
      en: 'Email validated', fr: 'Email validé', mi: 'Īmēra Kua Whakamana', ga: 'Ríomhphost Bailíochtaithe', hi: 'ईमेल सत्यापित', gd: 'Post-d air a dhearbhadh',
      'en-AU': 'Email validated', 'en-NZ': 'Email validated', 'en-CA': 'Email validated', 'fr-CA': 'Email validé', 'en-ZA': 'E-pos Valideer', af: 'E-pos Valideer'
    },
    passwordValidated: {
      en: 'Password validated', fr: 'Mot de passe validé', mi: 'Kupuhipa Kua Whakamana', ga: 'Pasfhocal Bailíochtaithe', hi: 'पासवर्ड सत्यापित', gd: 'Facal-faire air a dhearbhadh',
      'en-AU': 'Password validated', 'en-NZ': 'Password validated', 'en-CA': 'Password validated', 'fr-CA': 'Mot de passe validé', 'en-ZA': 'Wagwoord Valideer', af: 'Wagwoord Valideer'
    },
    invalidEmail: {
      en: 'Invalid email format.', fr: 'Format d\'email invalide.', mi: 'He Hapa te Puka Ïmēra.', ga: 'Droch-fhoirm ríomhphoist.', hi: 'अमान्य ईमेल प्रारूप।', gd: 'Cruth post-d neo-dhligheach.',
      'en-AU': 'Invalid email format.', 'en-NZ': 'Invalid email format.', 'en-CA': 'Invalid email format.', 'fr-CA': 'Format d\'email invalide.', 'en-ZA': 'Ongeldige e-pos formaat.', af: 'Ongeldige e-pos formaat.'
    },
    invalidPassword: {
      en: 'Password must be at least 8 characters long.', fr: 'Le mot de passe doit contenir au moins 8 caractères.', mi: 'Me nui ake te 8 tohu o te Waehere Ngaro.', ga: 'Caithfidh an pasfhocal a bheith 8 gcarachtar ar a laghad.', hi: 'पासवर्ड कम से कम 8 वर्ण लंबा होना चाहिए।', gd: 'Feumaidh am facal-faire a bhith co-dhiù 8 caractaran a dh\'fhaid.',
      'en-AU': 'Password must be at least 8 characters long.', 'en-NZ': 'Password must be at least 8 characters long.', 'en-CA': 'Password must be at least 8 characters long.', 'fr-CA': 'Le mot de passe doit contenir au moins 8 caractères.', 'en-ZA': 'Wagwoord moet ten minste 8 karakters lank wees.', af: 'Wagwoord moet ten minste 8 karakters lank wees.'
    },
    registerLinkText: {
      en: 'Go to Register', fr: 'Aller à l\'inscription', mi: 'Haere ki te Rehita', ga: 'Téigh go dtí Clárú', hi: 'पंजीकरण पर जाएं', gd: 'Rach gu Clàradh',
      'en-AU': 'Go to Register', 'en-NZ': 'Go to Register', 'en-CA': 'Go to Register', 'fr-CA': 'Aller à l\'inscription', 'en-ZA': 'Gaan na Register', af: 'Gaan na Register'
    },
    alreadyMatricule: {
      en: 'Not registered yet?', fr: 'Pas encore inscrit ?', mi: 'Kāore anō i rēhitatia?', ga: 'Gan a bheith cláraithe fós?', hi: 'अभी तक पंजीकृत नहीं?', gd: 'Nach eil clàraichte fhathast?',
      'en-AU': 'Not registered yet?', 'en-NZ': 'Not registered yet?', 'en-CA': 'Not registered yet?', 'fr-CA': 'Pas encore inscrit ?', 'en-ZA': 'Nog nie geregistreer nie?', af: 'Nog nie geregistreer nie?'
    }
  },
};

const getTranslation = <
  S extends keyof typeof allTranslations,
  K extends keyof typeof allTranslations[S]
>(
  section: S,
  key: K,
  lang: LanguageCode
): string => {
  const sectionTranslations = allTranslations[section];
  if (!sectionTranslations) {
    console.warn(`Translation section not found: ${String(section)}`);
    return `[Missing Section: ${String(section)}]`;
  }
  const specificTranslations = sectionTranslations[key] as { [l: string]: string };
  if (!specificTranslations) {
    console.warn(`Translation missing or invalid for: ${String(section)}.${String(key)}`);
    return `[Invalid Translation: ${String(section)}.${String(key)}]`;
  }
  return specificTranslations[lang] || specificTranslations.en || '';
};

export default function LoginPage() {
  const { language } = useLanguage();
  const { theme } = useTheme();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEmailValidated, setIsEmailValidated] = useState(true);
  const [isPasswordValidated, setIsPasswordValidated] = useState(true);

  // Styles selon thème
  const textColor = theme === 'dark' ? '#E0E0E0' : '#333333';
  const mutedTextColor = theme === 'dark' ? '#A0A0A0' : '#666666';
  const backgroundColorPage = theme === 'dark' ? '#1A1A2E' : '#f9fafb';
  const highlightColor = theme === 'dark' ? '#8BC4FF' : '#4A90E2';
  const textShadowColor = theme === 'dark' ? 'rgba(0,0,0,0.6)' : 'rgba(150,150,150,0.4)';
  const inputBgColor = theme === 'dark' ? '#1F1F2A' : '#FFFFFF';
  const inputBorderColor = theme === 'dark' ? '#444444' : '#CCCCCC';
  const buttonPrimaryBg = theme === 'dark' ? '#005bb5' : '#0070f3';
  const buttonPrimaryText = theme === 'dark' ? '#E0E0E0' : 'white';
  const errorBackground = theme === 'dark' ? '#402020' : '#fdd';
  const errorText = theme === 'dark' ? '#FFDDDD' : '#A00';
  const errorBorder = theme === 'dark' ? '#802020' : '#CC0000';
  const errorShadow = theme === 'dark' ? 'rgba(255,0,0,0.3)' : 'rgba(255,100,100,0.3)';

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isEmailValid = emailRegex.test(email);
    const isPasswordValid = password.length >= 8;

    setIsEmailValidated(isEmailValid);
    setIsPasswordValidated(isPasswordValid);

    if (!isEmailValid || !isPasswordValid) {
      setError(
        !isEmailValid
          ? getTranslation('loginPage', 'invalidEmail', language)
          : getTranslation('loginPage', 'invalidPassword', language)
      );
      return;
    }

    setIsLoading(true);

    try {
      // Ici la logique réelle de connexion
      await new Promise(resolve => setTimeout(resolve, 1000));
      router.push('/dashboard');
    } catch (err) {
      setError(getTranslation('loginPage', 'errorMessageGeneric', language));
    } finally {
      setIsLoading(false);
    }
  };

const handleSocialLogin = (provider: 'google' | 'microsoft' | 'linkedin') => {
  // Remplace cette URL par l'URL réelle de ton backend
  const backendBaseUrl = 'https://api.kiwi-ops.com'; 

  // Redirection vers l'URL d'authentification OAuth
  window.location.href = `${backendBaseUrl}/login/${provider}`;
};

  const isFormValid = email.trim() !== '' && password.trim() !== '';

  return (
    <div
      className={styles.pageContainer}
      style={{
        backgroundColor: backgroundColorPage,
        color: textColor,
        fontFamily: "'Arial', sans-serif",
      }}
    >
      <div className={styles.formWrapper}>
        <h1
          className={styles.title}
          style={{ color: highlightColor, textShadow: `2px 2px 0px ${textShadowColor}` }}
        >
          {getTranslation('loginPage', 'mainTitle', language)}
        </h1>
        <p className={styles.preamble} style={{ color: mutedTextColor }}>
          {getTranslation('loginPage', 'preamble', language)}
        </p>

        {error && (
          <div
            className={styles.errorBox}
            role="alert"
            style={{
              backgroundColor: errorBackground,
              color: errorText,
              border: `1px solid ${errorBorder}`,
              boxShadow: `0 2px 8px ${errorShadow}`,
              marginBottom: '1rem',
              padding: '0.5rem 1rem',
              borderRadius: '4px',
            }}
          >
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>
              {getTranslation('loginPage', 'usernameLabel', language)}
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.target.value);
                setIsEmailValidated(isValid);
                if (isValid) setError(null);
              }}
              className={`${styles.inputField} ${!isEmailValidated ? styles.invalidInput : ''}`}
              disabled={isLoading}
              style={{
                backgroundColor: inputBgColor,
                color: textColor,
                borderColor: !isEmailValidated ? errorBorder : inputBorderColor,
              }}
              placeholder="agent@example.com"
            />
            {email && (
              <span
                style={{
                  color: isEmailValidated ? 'green' : 'red',
                  marginLeft: 10,
                  fontSize: '0.8rem',
                }}
              >
                {isEmailValidated
                  ? getTranslation('loginPage', 'emailValidated', language)
                  : getTranslation('loginPage', 'invalidEmail', language)}
              </span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.label}>
              {getTranslation('loginPage', 'passwordLabel', language)}
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                const isValid = e.target.value.length >= 8;
                setIsPasswordValidated(isValid);
                if (isValid) setError(null);
              }}
              className={`${styles.inputField} ${!isPasswordValidated ? styles.invalidInput : ''}`}
              disabled={isLoading}
              style={{
                backgroundColor: inputBgColor,
                color: textColor,
                borderColor: !isPasswordValidated ? errorBorder : inputBorderColor,
              }}
              placeholder="********"
            />
            {password && (
              <span
                style={{
                  color: isPasswordValidated ? 'green' : 'red',
                  marginLeft: 10,
                  fontSize: '0.8rem',
                }}
              >
                {isPasswordValidated
                  ? getTranslation('loginPage', 'passwordValidated', language)
                  : getTranslation('loginPage', 'invalidPassword', language)}
              </span>
            )}
            <Link
              href="/forgot-password"
              className={styles.forgotPasswordLink}
              style={{ color: highlightColor, display: 'inline-block', marginTop: '0.5rem' }}
            >
              {getTranslation('loginPage', 'forgotPassword', language)}
            </Link>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading || !isFormValid}
              className={styles.submitButton}
              style={{
                backgroundColor: buttonPrimaryBg,
                color: buttonPrimaryText,
                opacity: isLoading || !isFormValid ? 0.6 : 1,
                cursor: isLoading || !isFormValid ? 'not-allowed' : 'pointer',
                padding: '0.75rem 1.5rem',
                fontWeight: 'bold',
                borderRadius: '5px',
                border: 'none',
                marginTop: '1rem',
                width: '100%',
                fontSize: '1rem',
              }}
            >
              {isLoading
                ? getTranslation('loginPage', 'loadingButtonText', language)
                : getTranslation('loginPage', 'submitButtonText', language)}
            </button>
          </div>
        </form>

        <div className={styles.separator}>
          <div className={styles.separatorLine}></div>
          <span className={styles.separatorText}>{getTranslation('loginPage', 'orSeparator', language)}</span>
          <div className={styles.separatorLine}></div>
        </div>

        <div className={styles.socialButtonsContainer}>
          <button
            type="button"
            onClick={() => handleSocialLogin('google')}
            className={`${styles.socialButton} ${styles.googleButton}`}
            disabled={isLoading}
            aria-label="Sign in with Google"
          >
            <FcGoogle size={24} style={{ marginRight: 8 }} />
            Google
          </button>
          <button
            type="button"
            onClick={() => handleSocialLogin('microsoft')}
            className={`${styles.socialButton} ${styles.microsoftButton}`}
            disabled={isLoading}
            aria-label="Sign in with Microsoft"
          >
            <FaMicrosoft size={20} style={{ marginRight: 8, color: '#FFFFFF' }} />
            Microsoft
          </button>
          <button
            type="button"
            onClick={() => handleSocialLogin('linkedin')}
            className={`${styles.socialButton} ${styles.linkedinButton}`}
            disabled={isLoading}
            aria-label="Sign in with LinkedIn"
          >
            <FaLinkedinIn size={20} style={{ marginRight: 8 }} />
            LinkedIn
          </button>
        </div>

        <p className={styles.footerText} style={{ marginTop: '1.5rem' }}>
          {getTranslation('loginPage', 'alreadyMatricule', language)}{' '}
          <Link href="/register" className={styles.link} style={{ color: highlightColor }}>
            {getTranslation('loginPage', 'registerLinkText', language)}
          </Link>
        </p>
      </div>
    </div>
  );
}

