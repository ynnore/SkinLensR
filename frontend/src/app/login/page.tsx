'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/contexts/ThemeContext'; // Importez le hook useTheme
import { useLanguage } from '@/contexts/LanguageContext'; // Importez useLanguage
import { LanguageCode } from '@/types'; // Importez LanguageCode
import styles from './login.module.css';
 // Importez le CSS module

// ✅ OBJET ALLTRANSLATIONS COMPLET ET VÉRIFIÉ AVEC TOUTES LES LANGUES
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
      'en-AU': 'ENROLL WITH GITHUB', 'en-NZ': 'ENROLL WITH GITHUB', 'en-CA': 'ENROLL WITH GITHUB', 'fr-CA': 'ENRÔLEMENT AVEC GOOGLE', 'en-ZA': 'SKRYF IN MET GITHUB', af: 'SKRYF IN MET GITHUB'
    },
    // Footer Text
    alreadyMatricule: {
      en: 'Already registered?',
      fr: 'Déjà un matricule ?',
      mi: 'Kua rehita kē?',
      ga: 'Cláraithe cheana?',
      hi: 'पहले से ही पंजीकृत हैं?',
      gd: 'Clàraichte mar-thà?',
      cy: 'Heb gofrestru eto?',
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
    // ✅ Messages d'erreur spécifiques à l'inscription et de succès
    errorEmailExists: {
      en: 'This transmission address is already registered. Please use another.',
      fr: 'Cette adresse de transmission est déjà enregistrée. Veuillez en utiliser une autre.',
      mi: 'Kua rehita kē tēnei wāhitau whakawhiti. Whakamahia tētahi atu.',
      ga: 'Tá an seoladh tarchurtha seo cláraithe cheana. Bain úsáid as ceann eile le do thoil.',
      hi: 'यह संचरण पता पहले से पंजीकृत है। कृपया दूसरा उपयोग करें।',
      gd: 'Tha an seòladh sgaoilidh seo clàraichte mar-thà. Cleachd fear eile, mas e do thoil e.',
      'en-AU': 'This transmission address is already registered. Please use another.',
      'en-NZ': 'This transmission address is already registered. Please use another.',
      'en-CA': 'This transmission address is already registered. Please use another.',
      'fr-CA': 'Cette adresse de transmission est déjà enregistrée. Veuillez en utiliser une autre.',
      'en-ZA': "Hierdie transmissieadres is reeds geregistreer. Gebruik asseblief 'n ander een.", // Correction de l'apostrophe
      af: "Hierdie transmissieadres is reeds geregistreer. Gebruik asseblief 'n ander een.", // Correction de l'apostrophe
    },
    errorGeneric: {
      en: 'An anomaly occurred during registration. Please retry later.',
      fr: 'Une anomalie est survenue lors de l\'enregistrement. Veuillez réessayer plus tard.',
      mi: 'He hapa i te wā o te rēhitatanga. Whakamātauria anō ā muri ake.',
      ga: 'Tharla aimhrialtacht le linn clárúcháin. Bain triail eile as níos déanaí le do thoil.',
      hi: 'पंजीकरण के दौरान एक विसंगति हुई। कृपया बाद में पुनः प्रयास करें।',
      gd: 'Thachair ana-riaghailt ri linn clàraidh. Feuch a-rithist nas fhaide air adhart, mas e do thoil e.',
      'en-AU': 'An anomaly occurred during registration. Please retry later.',
      'en-NZ': 'An anomaly occurred during registration. Please retry later.',
      'en-CA': 'An anomaly occurred during registration. Please retry later.',
      'fr-CA': 'Une anomalie est survenue lors de l\'enregistrement. Veuillez réessayer plus tard.',
      'en-ZA': "An anomaly occurred during registration. Please retry later.", // Correction de l'apostrophe
      af: "An anomaly occurred during registration. Please retry later.", // Correction de l'apostrophe
    },
    successMessage: {
      en: 'Enrollment successful! Redirecting to Command Post...',
      fr: 'Enrôlement réussi ! Redirection vers le Poste de Commandement...',
      mi: 'I angitu te whakaurunga! Kei te whakatere ki te Pou Whakahau...',
      ga: 'Clárú rathúil! Ag atreorú chuig an Ionad Ceannais...',
      hi: 'नामांकन सफल रहा! कमांड पोस्ट पर रीडirect कर रहा है...',
      gd: 'Clàradh soirbheachail! Ag ath-stiùireadh gu Ionad-Command...',
      'en-AU': 'Enrollment successful! Redirecting to Command Post...', 'en-NZ': 'Enrollment successful! Redirecting to Command Post...', 'en-CA': 'Enrollment successful! Redirecting to Command Post...', 'fr-CA': 'Enrôlement réussi ! Redirection vers le Poste de Commandement...', 'en-ZA': 'Inskrywing suksesvol! Herlei na Bevelspos...', af: 'Inskrywing suksesvol! Herlei na Bevelspos...',
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

  // Note: Le champ nomDeCode n'est pas directement mappé à votre backend Register API (schemas.UserCreate)
  // Il est inclus ici pour l'interface utilisateur, mais ne sera pas envoyé dans la requête actuelle.
  // Si vous souhaitez l'inclure, il faudra modifier le schéma UserCreate dans votre backend.
  const [nomDeCode, setNomDeCode] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null); // ✅ Ajout de l'état d'erreur
  const [success, setSuccess] = useState<string | null>(null); // ✅ Ajout de l'état de succès
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

  // ✅ Styles pour les messages d'erreur et de succès
  const errorBackground = theme === 'dark' ? '#5C2D2D' : '#FFDADA';
  const errorText = theme === 'dark' ? '#FFCACA' : '#CC0000';
  const errorBorder = theme === 'dark' ? '#CC0000' : '#FF0000';
  const errorShadow = theme === 'dark' ? 'rgba(204,0,0,0.4)' : 'rgba(255,0,0,0.2)';

  const successBackground = theme === 'dark' ? '#2D5C2D' : '#DAFFDA';
  const successText = theme === 'dark' ? '#CAFFCA' : '#00CC00';
  const successBorder = theme === 'dark' ? '#00CC00' : '#00FF00';
  const successShadow = theme === 'dark' ? 'rgba(0,204,0,0.4)' : 'rgba(0,255,0,0.2)';


  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null); // Réinitialise les erreurs
    setSuccess(null); // Réinitialise les messages de succès

    try {
      const response = await fetch('http://localhost:8000/register', { // ✅ Endpoint de votre backend pour l'inscription
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // ✅ Le backend attend du JSON pour /register
        },
        body: JSON.stringify({ // ✅ Envoie email et password au backend
          email,
          password,
          // role: "user" // Si votre backend attend un rôle explicite à l'inscription, ajoutez-le ici
                       // Sinon, il est probablement géré par défaut côté backend (recommandé)
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Enrôlement réussi !', data);
        setSuccess(getTranslation('inscriptionPage', 'successMessage', language));
        // Optionnel: vider les champs après succès
        setEmail('');
        setPassword('');
        setNomDeCode('');
        // Rediriger vers la page de connexion après un court délai pour que l'utilisateur lise le message
        setTimeout(() => {
          router.push('/'); // Redirige vers la page de connexion
        }, 2000);
      } else {
        const errorData = await response.json();
        if (errorData.detail === "Email already registered") { // Message spécifique du backend
          setError(getTranslation('inscriptionPage', 'errorEmailExists', language));
        } else {
          // Message d'erreur générique ou celui fourni par le backend
          setError(errorData.detail || getTranslation('inscriptionPage', 'errorGeneric', language));
        }
        console.error('Échec de l\'enrôlement:', errorData);
      }
    } catch (err) {
      console.error('Erreur réseau ou inattendue lors de l\'enrôlement:', err);
      setError(getTranslation('inscriptionPage', 'errorGeneric', language)); // Message d'erreur générique
    } finally {
      setIsLoading(false);
    }
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
        '--kiwi-text-shadow': `2px 2px 0px ${textShadowColor}`,
        // ✅ Ajout des variables CSS pour les couleurs d'erreur/succès
        '--kiwi-error-background': errorBackground,
        '--kiwi-error-text': errorText,
        '--kiwi-error-border': errorBorder,
        '--kiwi-error-shadow': errorShadow,
        '--kiwi-success-background': successBackground,
        '--kiwi-success-text': successText,
        '--kiwi-success-border': successBorder,
        '--kiwi-success-shadow': successShadow,
      } as React.CSSProperties}
    >
      <div className={styles.formWrapper}>
        <h1 className={styles.title}>{getTranslation('inscriptionPage', 'mainTitle', language)}</h1>
        <p className={styles.preamble}>
          {getTranslation('inscriptionPage', 'preamble', language)}
        </p>

        {/* ✅ Affichage des messages d'erreur ou de succès */}
        {error && (
          <div className={styles.errorBox} role="alert" style={{
            backgroundColor: 'var(--kiwi-error-background)',
            color: 'var(--kiwi-error-text)',
            border: `1px solid var(--kiwi-error-border)`,
            boxShadow: `0 2px 8px var(--kiwi-error-shadow)`,
          }}>
            <p>{error}</p>
          </div>
        )}
        {success && (
          <div className={styles.successBox} role="status" style={{
            backgroundColor: 'var(--kiwi-success-background)',
            color: 'var(--kiwi-success-text)',
            border: `1px solid var(--kiwi-success-border)`,
            boxShadow: `0 2px 8px var(--kiwi-success-shadow)`,
          }}>
            <p>{success}</p>
          </div>
        )}

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
