'use client';

import { useState, FormEvent, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageCode } from '@/types';
import { FcGoogle } from 'react-icons/fc';
import { FaMicrosoft, FaLinkedinIn, FaBitcoin } from 'react-icons/fa';
import styles from './login.module.css';

// Define the global window interface to include Bitcoin wallet extensions
declare global {
  interface Window {
    unisat?: {
      requestAccounts: () => Promise<string[]>;
      signMessage: (message: string) => Promise<string>;
      // Add other UniSat methods you might use
    };
    xverse?: {
      // Define Xverse methods here if you intend to use it
      // e.g., connect: () => Promise<any>;
    };
    leather?: {
      // Define Leather methods here if you intend to use it
      // e.g., request: (args: any) => Promise<any>;
    };
    // Add other wallet interfaces as needed
  }
}

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
    loginWithBitcoin: {
      en: 'Login with Bitcoin Wallet', fr: 'Connexion avec Portefeuille Bitcoin', mi: 'Takiuru mā te Pukoro Bitcoin', ga: 'Logáil Isteach le Sparán Bitcoin', hi: 'बिटकॉइन वॉलेट से लॉग इन करें', gd: 'Log a-steach le Sporan Bitcoin', cy: 'Mewngofnodi â Waled Bitcoin',
      'en-AU': 'Login with Bitcoin Wallet', 'en-NZ': 'Login with Bitcoin Wallet', 'en-CA': 'Login with Bitcoin Wallet', 'fr-CA': 'Connexion avec Portefeuille Bitcoin', 'en-ZA': 'Meld aan met Bitcoin-beursie', af: 'Meld aan met Bitcoin-beursie',
    },
    connectingWallet: {
      en: 'Connecting wallet...', fr: 'Connexion du portefeuille...', mi: 'E hono ana te pukoro...', ga: 'Ag Ceangal Sparán...', hi: 'वॉレット कनेक्ट कर रहा है...', gd: 'A’ ceangal spòran...', cy: 'Yn cysylltu waled...',
      'en-AU': 'Connecting wallet...', 'en-NZ': 'Connecting wallet...', 'en-CA': 'Connecting wallet...', 'fr-CA': 'Connexion du portefeuille...', 'en-ZA': 'Koppel beursie...', af: 'Koppel beursie...',
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
    errorNoWallet: {
      en: 'Bitcoin wallet not detected. Please install one (e.g., UniSat, Xverse).', fr: 'Portefeuille Bitcoin non détecté. Veuillez en installer un (ex: UniSat, Xverse).', mi: 'Kāore i kitea te pukoro Bitcoin. Tāutahia tētahi (hei tauira, UniSat, Xverse).', ga: 'Níor aimsíodh sparán Bitcoin. Suiteáil ceann amháin (m.sh. UniSat, Xverse).', hi: 'बिटकॉइन वॉलेट नहीं मिला। कृपया एक इंस्टॉल करें (उदा. UniSat, Xverse)।', gd: 'Sporan Bitcoin gun a lorg. Stàlaich fear (m.e. UniSat, Xverse).', cy: 'Waled Bitcoin heb ei ganfod. Gosodwch un (e.e. UniSat, Xverse).',
      'en-AU': 'Bitcoin wallet not detected. Please install one (e.g., UniSat, Xverse).', 'en-NZ': 'Bitcoin wallet not detected. Please install one (e.g., UniSat, Xverse).', 'en-CA': 'Bitcoin wallet not detected. Please install one (e.g., UniSat, Xverse).', 'fr-CA': 'Portefeuille Bitcoin non détecté. Veuillez en installer un (ex: UniSat, Xverse).', 'en-ZA': 'Bitcoin-beursie nie opgespoor nie. Installeer asseblief een (bv. UniSat, Xverse).', af: 'Bitcoin-beursie nie opgespoor nie. Installeer asseblief een (bv. UniSat, Xverse).',
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
      en: 'Password must be at least 8 characters long.', fr: 'Le mot de passe doit contenir au moins 8 caractères.', mi: 'Me nui ake te 8 tohu o te Waehere Ngaro.', ga: 'Caithfidh an pasfhocal a bhith 8 gcarachtar ar a laghad.', hi: 'पासवर्ड कम से कम 8 वर्ण लंबा होना चाहिए।', gd: 'Feumaidh am facal-faire a bhith co-dhiù 8 caractaran a dh\'fhaid.',
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

// Error class for specific wallet detection
class NoBitcoinWalletDetectedError extends Error {
  constructor(message: string = "No Bitcoin wallet detected") {
    super(message);
    this.name = "NoBitcoinWalletDetectedError";
  }
}

// Fonction simulée pour la connexion et la signature de portefeuille Bitcoin
// !!! IMPORTANT : Vous devrez remplacer cette fonction par une VRAIE implémentation
// qui interagit avec le portefeuille Bitcoin de votre choix (ex: UniSat, Xverse, Leather).
async function connectBitcoinWalletAndSign(message: string): Promise<{ address: string; signature: string } | null> {
  console.log("Attempting to connect to Bitcoin wallet...");

  if (typeof window === 'undefined') {
    throw new NoBitcoinWalletDetectedError("Window object not available.");
  }

  // UniSat Wallet
  if (window.unisat) {
    try {
      console.log("UniSat wallet detected.");
      const accounts = await window.unisat.requestAccounts();
      const address = accounts[0];
      console.log("UniSat wallet connected. Address:", address);

      const signature = await window.unisat.signMessage(message);
      console.log("Message signed. Signature:", signature);

      return { address, signature };
    } catch (error: any) {
      console.error("Error connecting or signing with UniSat:", error);
      // UniSat specific error handling, if any
      if (error.code === 4001) { // User rejected request
        throw new Error("User rejected UniSat connection or signature.");
      }
      throw new Error(`Failed to connect or sign with UniSat wallet: ${error.message || error}`);
    }
  }

  // Xverse Wallet (Placeholder - Needs actual implementation)
  if (window.xverse) {
    console.log("Xverse wallet detected. (Implementation pending)");
    try {
      // Example for Xverse (might differ based on their SDK)
      // const response = await window.xverse.connect();
      // const address = response.addresses[0].address;
      // const signature = await window.xverse.signMessage({ message });
      // return { address, signature };
      throw new Error("Xverse wallet integration not fully implemented.");
    } catch (error: any) {
      console.error("Error connecting or signing with Xverse:", error);
      throw new Error(`Failed to connect or sign with Xverse wallet: ${error.message || error}`);
    }
  }

  // Leather Wallet (Placeholder - Needs actual implementation)
  if (window.leather) {
    console.log("Leather wallet detected. (Implementation pending)");
    try {
      // Example for Leather (might differ based on their SDK)
      // const accounts = await window.leather.request('getAddresses');
      // const address = accounts[0].address;
      // const signature = await window.leather.request('signMessage', { message });
      // return { address, signature };
      throw new Error("Leather wallet integration not fully implemented.");
    } catch (error: any) {
      console.error("Error connecting or signing with Leather:", error);
      throw new Error(`Failed to connect or sign with Leather wallet: ${error.message || error}`);
    }
  }

  throw new NoBitcoinWalletDetectedError();
}

export default function LoginPage() {
  const { language } = useLanguage();
  const { theme } = useTheme();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isWalletLoading, setIsWalletLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Validation states for real-time feedback
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Helper for email validation
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      return null; // Don't show error if field is empty initially
    }
    if (!emailRegex.test(email)) {
      return getTranslation('loginPage', 'invalidEmail', language);
    }
    return null;
  };

  // Helper for password validation
  const validatePassword = (password: string) => {
    if (!password) {
      return null; // Don't show error if field is empty initially
    }
    if (password.length < 8) {
      return getTranslation('loginPage', 'invalidPassword', language);
    }
    return null;
  };

  // Update validation errors on input change
  useEffect(() => {
    setEmailError(validateEmail(email));
  }, [email, language]);

  useEffect(() => {
    setPasswordError(validatePassword(password));
  }, [password, language]);


  // Styles according to theme
  const textColor = theme === 'dark' ? '#E0E0E0' : '#333333';
  const mutedTextColor = theme === 'dark' ? '#A0A0A0' : '#666666';
  const backgroundColorPage = theme === 'dark' ? '#1A1A2E' : '#f9fafb';
  const highlightColor = theme === 'dark' ? '#8BC4FF' : '#4A90E2';
  const textShadowColor = theme === 'dark' ? 'rgba(0,0,0,0.6)' : 'rgba(150,150,150,0.4)';
  const inputBgColor = theme === 'dark' ? '#1F1F2A' : '#FFFFFF';
  const inputBorderColor = theme === 'dark' ? '#444444' : '#CCCCCC';
  const buttonPrimaryBg = theme === 'dark' ? '#005bb5' : '#0070f3';
  const buttonPrimaryText = theme === 'dark' ? '#E0E0E0' : 'white';
  const buttonBitcoinBg = '#F7931A'; // Bitcoin Orange
  const buttonBitcoinHoverBg = '#E08616';
  const buttonBitcoinText = 'white';
  const errorBackground = theme === 'dark' ? '#402020' : '#fdd';
  const errorText = theme === 'dark' ? '#FFDDDD' : '#A00';
  const errorBorder = theme === 'dark' ? '#802020' : '#CC0000';
  const errorShadow = theme === 'dark' ? 'rgba(255,0,0,0.3)' : 'rgba(255,100,100,0.3)';

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    // Explicitly re-validate on submit to catch any last-minute issues or empty fields
    setEmailError(validateEmail(email));
    setPasswordError(validatePassword(password));

    // If there are any validation errors or empty fields, prevent submission
    if (emailError || passwordError || !email.trim() || !password.trim()) {
      setError(
        emailError
          ? emailError
          : passwordError
            ? passwordError
            : getTranslation('loginPage', 'errorMessageGeneric', language) // Fallback for empty fields on submit
      );
      return;
    }

    setIsLoading(true);

    try {
      const formData = new URLSearchParams();
      formData.append('username', email);
      formData.append('password', password);

      const response = await fetch('http://localhost:8000/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('access_token', data.access_token);
        console.log('Login successful! Token:', data.access_token);
        router.push('/dashboard');
      } else {
        const errorData = await response.json();
        setError(errorData.detail || getTranslation('loginPage', 'errorMessageGeneric', language));
        console.error('Login failed:', errorData);
      }
    } catch (err) {
      console.error('Network or unexpected error during login:', err);
      setError(getTranslation('loginPage', 'errorMessageGeneric', language));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider: 'google' | 'microsoft' | 'linkedin') => {
    const backendBaseUrl = 'https://api.kiwi-ops.com'; // Use a proper environment variable for this
    window.location.href = `${backendBaseUrl}/login/${provider}`;
  };

  const handleBitcoinLogin = async () => {
    setIsWalletLoading(true);
    setError(null); // Clear previous errors

    try {
      // In a real application, the nonce should be fetched from your backend
      // to prevent replay attacks and ensure freshness.
      const messageToSign = `Authenticate to MyDApp. Nonce: ${Date.now()}`;
      const walletData = await connectBitcoinWalletAndSign(messageToSign);

      if (walletData) {
        const { address, signature } = walletData;
        console.log('Wallet connected and message signed:', { address, signature });

        // Send the address and signature to the backend for verification and authentication
        const response = await fetch('http://localhost:8000/auth/bitcoin-wallet', { // Update URL if necessary
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ address, signature, message: messageToSign }),
        });

        if (response.ok) {
          const data = await response.json();
          localStorage.setItem('access_token', data.access_token);
          console.log('Bitcoin login successful! Token:', data.access_token);
          router.push('/dashboard');
        } else {
          const errorData = await response.json();
          setError(errorData.detail || getTranslation('loginPage', 'errorMessageGeneric', language));
          console.error('Bitcoin login failed:', errorData);
        }
      }
    } catch (err: any) {
      console.error('Error during Bitcoin wallet connection:', err);
      if (err instanceof NoBitcoinWalletDetectedError) {
        setError(getTranslation('loginPage', 'errorNoWallet', language));
      } else if (err.message.includes("User rejected")) {
        setError("Wallet connection or signature rejected by user.");
      } else {
        setError(getTranslation('loginPage', 'errorMessageGeneric', language));
      }
    } finally {
      setIsWalletLoading(false);
    }
  };

  // Check form validity based on presence of email/password and absence of validation errors
  const isFormValid = email.trim() !== '' && password.trim() !== '' && !emailError && !passwordError;

  return (
    <div
      className={styles.pageContainer}
      style={{
        backgroundColor: backgroundColorPage,
        color: textColor,
        fontFamily: "'Arial', sans-serif",
      }}
    >
      <div
        className={styles.loginCard}
        style={{
          backgroundColor: inputBgColor,
          borderColor: inputBorderColor,
          boxShadow: `0 8px 30px ${theme === 'dark' ? 'rgba(0,0,0,0.8)' : 'rgba(0,0,0,0.1)'}`,
        }}
      >
        <h1
          className={styles.mainTitle}
          style={{
            color: highlightColor,
            textShadow: `2px 2px 4px ${textShadowColor}`,
          }}
        >
          {getTranslation('loginPage', 'mainTitle', language)}
        </h1>
        <p className={styles.preamble} style={{ color: mutedTextColor }}>
          {getTranslation('loginPage', 'preamble', language)}
        </p>

        {error && (
          <div
            className={styles.errorMessage}
            style={{
              backgroundColor: errorBackground,
              color: errorText,
              borderColor: errorBorder,
              boxShadow: `0 0 8px ${errorShadow}`,
            }}
            role="alert"
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.loginForm}>
          <div className={styles.inputGroup}>
            <label htmlFor="email" style={{ color: mutedTextColor }}>
              {getTranslation('loginPage', 'usernameLabel', language)}
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`${styles.inputField} ${emailError ? styles.inputError : ''}`}
              style={{
                backgroundColor: inputBgColor,
                color: textColor,
                borderColor: emailError ? errorBorder : inputBorderColor,
              }}
              aria-invalid={emailError ? "true" : "false"}
              aria-describedby="email-error"
              required
            />
            {emailError && (
              <p id="email-error" className={styles.validationError} style={{ color: errorText }}>
                {emailError}
              </p>
            )}
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password" style={{ color: mutedTextColor }}>
              {getTranslation('loginPage', 'passwordLabel', language)}
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`${styles.inputField} ${passwordError ? styles.inputError : ''}`}
              style={{
                backgroundColor: inputBgColor,
                color: textColor,
                borderColor: passwordError ? errorBorder : inputBorderColor,
              }}
              aria-invalid={passwordError ? "true" : "false"}
              aria-describedby="password-error"
              required
            />
            {passwordError && (
              <p id="password-error" className={styles.validationError} style={{ color: errorText }}>
                {passwordError}
              </p>
            )}
            <Link href="/forgot-password" className={styles.forgotPasswordLink} style={{ color: highlightColor }}>
              {getTranslation('loginPage', 'forgotPassword', language)}
            </Link>
          </div>

          <button
            type="submit"
            className={styles.submitButton}
            style={{
              backgroundColor: buttonPrimaryBg,
              color: buttonPrimaryText,
              borderColor: buttonPrimaryBg,
            }}
            disabled={isLoading || !isFormValid}
          >
            {isLoading
              ? getTranslation('loginPage', 'loadingButtonText', language)
              : getTranslation('loginPage', 'submitButtonText', language)}
          </button>
        </form>

        <div className={styles.socialLoginContainer}>
          <div className={styles.orSeparator} style={{ color: mutedTextColor }}>
            {getTranslation('loginPage', 'orSeparator', language)}
          </div>

          <button
            onClick={() => handleBitcoinLogin()}
            className={styles.bitcoinLoginButton}
            style={{
              backgroundColor: buttonBitcoinBg,
              color: buttonBitcoinText,
            }}
            disabled={isWalletLoading}
          >
            {isWalletLoading
              ? getTranslation('loginPage', 'connectingWallet', language)
              : (
                <>
                  <FaBitcoin size={20} style={{ marginRight: '10px' }} />
                  {getTranslation('loginPage', 'loginWithBitcoin', language)}
                </>
              )}
          </button>

          <div className={styles.socialButtons}>
            <button
              onClick={() => handleSocialLogin('google')}
              className={styles.socialButton}
              style={{ backgroundColor: inputBgColor, borderColor: inputBorderColor }}
              aria-label="Login with Google"
            >
              <FcGoogle size={24} />
            </button>
            <button
              onClick={() => handleSocialLogin('microsoft')}
              className={styles.socialButton}
              style={{ backgroundColor: inputBgColor, borderColor: inputBorderColor }}
              aria-label="Login with Microsoft"
            >
              <FaMicrosoft size={20} color="#0078D4" />
            </button>
            <button
              onClick={() => handleSocialLogin('linkedin')}
              className={styles.socialButton}
              style={{ backgroundColor: inputBgColor, borderColor: inputBorderColor }}
              aria-label="Login with LinkedIn"
            >
              <FaLinkedinIn size={20} color="#0A66C2" />
            </button>
          </div>
        </div>

        <p className={styles.registerPrompt} style={{ color: mutedTextColor }}>
          {getTranslation('loginPage', 'alreadyMatricule', language)}{' '}
          <Link href="/register" className={styles.registerLink} style={{ color: highlightColor }}>
            {getTranslation('loginPage', 'registerLinkText', language)}
          </Link>
        </p>
      </div>
    </div>
  ); // This closing tag was missing!
}