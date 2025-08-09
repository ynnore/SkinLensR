'use client';'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageCode } from '@/types';
// Assurez-vous que le chemin du module CSS correspond à l'emplacement réel de votre fichier de styles pour la page de connexion
import styles from './login.module.css';

// --- Traductions ---
const allTranslations = {
  loginPage: { // Section de traduction spécifique à la page de connexion
    mainTitle: {
      en: 'Agent Login', fr: 'Connexion Agent', mi: 'Takiuru Ahente', ga: 'Logáil Gníomhaire', hi: 'एजेंट लॉगिन', gd: 'Log a-steach Neach-ionaid',
      'en-AU': 'Agent Login', 'en-NZ': 'Agent Login', 'en-CA': 'Agent Login', 'fr-CA': 'Connexion Agent', 'en-ZA': 'Agent Login', af: 'Agent Teken In'
    },
    preamble: {
      en: 'Access the Command Post. Discretion is required.', fr: 'Accédez au Poste de Commandement. La discrétion est de rigueur.', mi: 'Uru ki te Pou Whakahau. Me huna tonu.', ga: 'Faigh rochtain ar an Ionad Ceannais. Tá discréid ag teastáil.', hi: 'कमांड पोस्ट तक पहुंचें। विवेक की आवश्यकता है।', gd: 'Faigh cothrom air an Ionad-Command. Tha dìomhaireachd riatanach.',
      'en-AU': 'Access Command Post. Discretion is required.', 'en-NZ': 'Access Command Post. Discretion is required.', 'en-CA': 'Access Command Post. Discretion is required.', 'fr-CA': 'Accédez au Poste de Commandement. La discrétion est de rigueur.', 'en-ZA': 'Kry toegang tot Bevelspos. Diskresie word vereis.', af: 'Toegang tot Bevelspos. Diskresie word vereis.'
    },
    usernameLabel: { // Label pour l'email/identifiant
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
    errorMessagePasswordMismatch: {
      en: 'Incorrect password. Please check and try again.', fr: 'Mot de passe incorrect. Veuillez vérifier et réessayer.', mi: 'He Hapa te Kupuhipa. Tirohia te hapa me te whakamātau anō.', ga: 'Pasfhocal mícheart. Seiceáil le do thoil agus déan iarracht arís.', hi: 'गलत पासवर्ड। कृपया जांचें और पुनः प्रयास करें।', gd: 'Facal-faire ceàrr. Thoir sùil air ais agus feuch a-rithist.',
      'en-AU': 'Incorrect password. Please check and try again.', 'en-NZ': 'Incorrect password. Please check and try again.', 'en-CA': 'Incorrect password. Please check and try again.', 'fr-CA': 'Mot de passe incorrect. Veuillez vérifier et réessayer.', 'en-ZA': 'Verkeerde wagwoord. Kontroleer asseblief en probeer weer.', af: 'Verkeerde wagwoord. Kontroleer asseblief en probeer weer.'
    },
    errorMessageGeneric: { // Message d'erreur générique pour le login
      en: 'An error occurred during login. Please try again later.', fr: 'Une erreur est survenue lors de la connexion. Veuillez réessayer plus tard.', mi: 'I puta he hapa i te takiurunga. Whakamātauria anō ā muri ake nei.', ga: 'Tharla earráid le linn logála isteach. Bain triail eile as níos déanaí le do thoil.', hi: 'लॉग इन के दौरान एक त्रुटि हुई। कृपया बाद में पुनः प्रयास करें।', gd: 'Bha mearachd ann nuair a bha thu a’ logadh a-steach. Feuch a-rithist nas fhaide air adhart.',
      'en-AU': 'An error occurred during login. Please try again later.', 'en-NZ': 'An error occurred during login. Please try again later.', 'en-CA': 'An error occurred during login. Please try again later.', 'fr-CA': 'Une erreur est survenue lors de la connexion. Veuillez réessayer plus tard.', 'en-ZA': 'An anomaly occurred during login. Please try again later.', af: 'An anomaly occurred during login. Please try again later.'
    },
    // Ajout des traductions pour les nouveaux états de validation
    emailValidated: {
      en: 'Email validated', fr: 'Email validé', mi: 'Īmēra Kua Whakamana', ga: 'Ríomhphost Bailíochtaithe', hi: 'ईमेल सत्यापित', gd: 'Post-d air a dhearbhadh',
      'en-AU': 'Email validated', 'en-NZ': 'Email validated', 'en-CA': 'Email validated', 'fr-CA': 'Email validé', 'en-ZA': 'E-pos Valideer', af: 'E-pos Valideer'
    },
    passwordValidated: {
      en: 'Password validated', fr: 'Mot de passe validé', mi: 'Kupuhipa Kua Whakamana', ga: 'Pasfhocal Bailíochtaithe', hi: 'पासवर्ड सत्यापित', gd: 'Facal-faire air a dhearbhadh',
      'en-AU': 'Password validated', 'en-NZ': 'Password validated', 'en-CA': 'Password validated', 'fr-CA': 'Mot de passe validé', 'en-ZA': 'Wagwoord Valideer', af: 'Wagwoord Valideer'
    },
    invalidEmail: { // Clé ajoutée pour un message d'erreur spécifique à l'email
      en: 'Invalid email format.', fr: 'Format d\'email invalide.', mi: 'He Hapa te Puka Ïmēra.', ga: 'Droch-fhoirm ríomhphoist.', hi: 'अमान्य ईमेल प्रारूप।', gd: 'Cruth post-d neo-dhligheach.',
      'en-AU': 'Invalid email format.', 'en-NZ': 'Invalid email format.', 'en-CA': 'Invalid email format.', 'fr-CA': 'Format d\'email invalide.', 'en-ZA': 'Ongeldige e-pos formaat.', af: 'Ongeldige e-pos formaat.'
    },
    invalidPassword: { // Clé ajoutée pour un message d'erreur spécifique au mot de passe
      en: 'Password must be at least 8 characters long.', fr: 'Le mot de passe doit contenir au moins 8 caractères.', mi: 'Me nui ake te 8 tohu o te Waehere Ngaro.', ga: 'Caithfidh an pasfhocal a bheith 8 gcarachtar ar a laghad.', hi: 'पासवर्ड कम से कम 8 वर्ण लंबा होना चाहिए।', gd: 'Feumaidh am facal-faire a bhith co-dhiù 8 caractaran a dh\'fhaid.',
      'en-AU': 'Password must be at least 8 characters long.', 'en-NZ': 'Password must be at least 8 characters long.', 'en-CA': 'Password must be at least 8 characters long.', 'fr-CA': 'Le mot de passe doit contenir au moins 8 caractères.', 'en-ZA': 'Wagwoord moet ten minste 8 karakters lank wees.', af: 'Wagwoord moet ten minste 8 karakters lank wees.'
    },
    registerLinkText: { // Texte pour le lien vers la page d'inscription
      en: 'Go to Register', fr: 'Aller à l\'inscription', mi: 'Haere ki te Rehita', ga: 'Téigh go dtí Clárú', hi: 'पंजीकरण पर जाएं', gd: 'Rach gu Clàradh',
      'en-AU': 'Go to Register', 'en-NZ': 'Go to Register', 'en-CA': 'Go to Register', 'fr-CA': 'Aller à l\'inscription', 'en-ZA': 'Gaan na Register', af: 'Gaan na Register'
    },
    alreadyMatricule: {
      en: 'Already registered?', fr: 'Déjà inscrit ?', mi: 'Kua Rehitatia?', ga: 'Cláraithe cheana féin?', hi: 'पहले से पंजीकृत?', gd: 'Mu thràth clàraichte?',
      'en-AU': 'Already registered?', 'en-NZ': 'Already registered?', 'en-CA': 'Already registered?', 'fr-CA': 'Déjà inscrit ?', 'en-ZA': 'Reeds geregistreer?', af: 'Reeds geregistreer?'
    }
  },
};

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
  // S'assure que la clé de langue existe, sinon utilise l'anglais par défaut
  return (specificTranslations as { [l: string]: string })[lang] || (specificTranslations as { [l: string]: string }).en || '';
};

export default function LoginPage() { // Ce composant est pour la page de connexion
  const { language } = useLanguage();
  const { theme } = useTheme();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEmailValidated, setIsEmailValidated] = useState(true); // Nouvel état pour la validation de l'email
  const [isPasswordValidated, setIsPasswordValidated] = useState(true); // Nouvel état pour la validation du mot de passe

  // Styles basés sur le thème
  const textColor = theme === 'dark' ? '#E0E0E0' : '#333333';
  const mutedTextColor = theme === 'dark' ? '#A0A0A0' : '#666666';
  const borderColor = theme === 'dark' ? '#555555' : '#AAAAAA';
  const backgroundColorPage = theme === 'dark' ? '#1A1A2E' : '#f9fafb';
  const highlightColor = theme === 'dark' ? '#8BC4FF' : '#4A90E2';
  const textShadowColor = theme === 'dark' ? 'rgba(0,0,0,0.6)' : 'rgba(150,150,150,0.4)';
  const shadowColorCard = theme === 'dark' ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.2)';

  const inputBgColor = theme === 'dark' ? '#1F1F2A' : '#FFFFFF';
  const inputBorderColor = theme === 'dark' ? '#444444' : '#CCCCCC';
  const highlightColorLight = theme === 'dark' ? 'rgba(139, 196, 255, 0.3)' : 'rgba(74, 144, 226, 0.2)';

  const buttonPrimaryBg = theme === 'dark' ? '#005bb5' : '#0070f3';
  const buttonPrimaryHoverBg = theme === 'dark' ? '#004a99' : '#005edb';
  const buttonPrimaryText = theme === 'dark' ? '#E0E0E0' : 'white';

  // Styles pour la boîte d'erreur (pourrait être défini dans le module CSS)
  const errorBackground = theme === 'dark' ? '#402020' : '#fdd';
  const errorText = theme === 'dark' ? '#FFDDDD' : '#A00';
  const errorBorder = theme === 'dark' ? '#802020' : '#CC0000';
  const errorShadow = theme === 'dark' ? 'rgba(255,0,0,0.3)' : 'rgba(255,100,100,0.3)';


  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Validation de l'email (simple regex)
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const isEmailValid = emailRegex.test(email);
      setIsEmailValidated(isEmailValid);

      // Validation du mot de passe (exemple: au moins 8 caractères)
      const isPasswordValid = password.length >= 8; // Ajustez cette logique selon vos besoins réels
      setIsPasswordValidated(isPasswordValid);

      if (isEmailValid && isPasswordValid) {
        // Si les deux sont valides, on peut envisager une redirection ou une action spécifique
        console.log('Email et mot de passe valides. Tentative de connexion...');
        // Simulation d'une requête API pour la connexion
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simule un délai réseau
        
        // Dans une application réelle, vous feriez un appel API ici :
        // const response = await fetch('/api/login', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({ email, password }),
        // });
        // const data = await response.json();
        // if (response.ok) {
        //   router.push('/dashboard');
        // } else {
        //   setError(data.message || getTranslation('loginPage', 'errorMessageGeneric', language));
        // }

        // Pour l'instant, redirigeons vers la page d'inscription pour tester le flux.
        // Remplacez par votre page de destination après une connexion réussie (ex: /dashboard)
        router.push('/dashboard'); 

      } else {
        // Afficher des messages d'erreur spécifiques ou génériques si la validation échoue
        let errorMessage = '';
        if (!isEmailValid && !isPasswordValid) {
            errorMessage = getTranslation('loginPage', 'errorMessageGeneric', language);
        } else if (!isEmailValid) {
          errorMessage = getTranslation('loginPage', 'invalidEmail', language);
        } else if (!isPasswordValid) {
          errorMessage = getTranslation('loginPage', 'invalidPassword', language);
        }
        setError(errorMessage);
      }

    } catch (err) {
      console.error('Erreur lors de la soumission du formulaire:', err);
      setError(getTranslation('loginPage', 'errorMessageGeneric', language));
    } finally {
      setIsLoading(false);
    }
  };

  // Déterminer si le bouton de soumission doit être activé. Il faut que les deux champs soient valides et non vides.
  const isFormValid = isEmailValidated && isPasswordValidated && email.trim() !== '' && password.trim() !== '';

  return (
    <div
      className={styles.pageContainer} // Assurez-vous que cette classe existe dans login.module.css
      style={{
        backgroundColor: backgroundColorPage,
        color: textColor,
        fontFamily: "'Arial', sans-serif", // Ou la police de votre thème
      }}
    >
      <div className={styles.formWrapper}> {/* Assurez-vous que cette classe existe dans login.module.css */}
        <h1 className={styles.title} style={{ color: highlightColor, textShadow: `2px 2px 0px ${textShadowColor}` }}>
          {getTranslation('loginPage', 'mainTitle', language)}
        </h1>
        <p className={styles.preamble} style={{ color: mutedTextColor }}>
          {getTranslation('loginPage', 'preamble', language)}
        </p>

        {error && (
          <div className={styles.errorBox} role="alert" style={{
            backgroundColor: errorBackground,
            color: errorText,
            border: `1px solid ${errorBorder}`,
            boxShadow: `0 2px 8px ${errorShadow}`,
          }}>
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
                // Mettre à jour la validation de l'email à chaque changement
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                setIsEmailValidated(emailRegex.test(e.target.value));
                if (error && emailRegex.test(e.target.value)) setError(null); // Réinitialiser l'erreur si l'utilisateur corrige
              }}
              className={`${styles.inputField} ${isEmailValidated ? styles.validInput : styles.invalidInput}`} // Ajout de classes pour les styles de validation (à définir dans login.module.css)
              disabled={isLoading}
              style={{
                backgroundColor: inputBgColor,
                color: textColor,
                borderColor: inputBorderColor,
              }}
              placeholder="agent@example.com"
            />
            {/* Affichage de l'état de validation de l'email */}
            {email && (
              <span style={{ color: isEmailValidated ? 'green' : 'red', marginLeft: '10px' }}>
                {isEmailValidated ? getTranslation('loginPage', 'emailValidated', language) : getTranslation('loginPage', 'invalidEmail', language)}
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
                // Mettre à jour la validation du mot de passe à chaque changement
                setIsPasswordValidated(e.target.value.length >= 8); // Ajustez la logique si nécessaire
                if (error && e.target.value.length >= 8) setError(null); // Réinitialiser l'erreur si l'utilisateur corrige
              }}
              className={`${styles.inputField} ${isPasswordValidated ? styles.validInput : styles.invalidInput}`} // Ajout de classes pour les styles de validation (à définir dans login.module.css)
              disabled={isLoading}
              style={{
                backgroundColor: inputBgColor,
                color: textColor,
                borderColor: inputBorderColor,
              }}
              placeholder="********"
            />
            {/* Affichage de l'état de validation du mot de passe */}
            {password && (
              <span style={{ color: isPasswordValidated ? 'green' : 'red', marginLeft: '10px' }}>
                {isPasswordValidated ? getTranslation('loginPage', 'passwordValidated', language) : getTranslation('loginPage', 'invalidPassword', language)}
              </span>
            )}
            <Link href="/forgot-password" className={styles.forgotPasswordLink} style={{ color: highlightColor }}>
              {getTranslation('loginPage', 'forgotPassword', language)}
            </Link>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading || !isFormValid} // Désactiver le bouton si isLoading ou si le formulaire n'est pas valide
              className={styles.submitButton}
              style={{
                backgroundColor: buttonPrimaryBg,
                color: buttonPrimaryText,
                opacity: isLoading || !isFormValid ? 0.6 : 1, // Ajuster l'opacité si désactivé
                cursor: isLoading || !isFormValid ? 'not-allowed' : 'pointer',
              }}
            >
              {isLoading ? getTranslation('loginPage', 'loadingButtonText', language) : getTranslation('loginPage', 'submitButtonText', language)}
            </button>
          </div>
        </form>

        {/* Le lien vers la page d'inscription est maintenant affiché uniquement s'il n'y a pas d'erreur et que le formulaire n'est pas encore complètement validé */}
        {!error && !isFormValid && (
          <p className={styles.footerText}>
            {getTranslation('loginPage', 'alreadyMatricule', language)}{' '} {/* Utilisation de la clé corrigée */}
            <Link href="/register" className={styles.link} style={{ color: highlightColor }}>
              {getTranslation('loginPage', 'registerLinkText', language)}
            </Link>
          </p>
        )}
        {/* Vous pouvez ajouter des conditions ici pour afficher d'autres éléments si nécessaire */}
      </div>
    </div>
  );
}
