// Fichier: src/app/inscription/page.tsx
'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTheme } from '../../context/ThemeContext'; // Importez le hook useTheme
import styles from './inscription.module.css'; // Importez le CSS module

export default function InscriptionPage() {
  const { theme } = useTheme(); // Accédez au thème actuel

  const [nomDeCode, setNomDeCode] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Définissez les couleurs et autres propriétés en fonction du thème
  const textColor = theme === 'dark' ? '#E0E0E0' : '#333333';
  const mutedTextColor = theme === 'dark' ? '#A0A0A0' : '#666666';
  const borderColor = theme === 'dark' ? '#555555' : '#AAAAAA';
  const backgroundColorPage = theme === 'dark' ? '#1A1A2E' : '#FFF8E1'; // Fond de page légèrement crème
  const sectionBgColor = theme === 'dark' ? '#2A2A3A' : '#F5F0E1'; // Fond du formulaire/carte
  const highlightColor = theme === 'dark' ? '#8BC4FF' : '#4A90E2'; // Couleur d'accent
  const textShadowColor = theme === 'dark' ? 'rgba(0,0,0,0.6)' : 'rgba(150,150,150,0.4)';
  const shadowColorCard = theme === 'dark' ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.2)';
  const shadowColorButton = theme === 'dark' ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.15)';

  const inputBgColor = theme === 'dark' ? '#1F1F2A' : '#FFFFFF';
  const inputBorderColor = theme === 'dark' ? '#444444' : '#CCCCCC';
  const highlightColorLight = theme === 'dark' ? 'rgba(139, 196, 255, 0.3)' : 'rgba(74, 144, 226, 0.2)'; // Pour le focus input

  // Couleurs des boutons
  const buttonPrimaryBg = theme === 'dark' ? '#005bb5' : '#0070f3';
  const buttonPrimaryHoverBg = theme === 'dark' ? '#004a99' : '#005edb';
  const buttonPrimaryText = theme === 'dark' ? '#E0E0E0' : 'white';

  // Couleurs pour les boutons sociaux (exemple, tu peux les ajuster)
  const socialButtonBg = theme === 'dark' ? '#424242' : '#E0E0E0';
  const socialButtonHoverBg = theme === 'dark' ? '#555555' : '#D0D0D0';
  const socialButtonText = theme === 'dark' ? '#E0E0E0' : '#333333';
  const socialButtonBorder = theme === 'dark' ? '#666666' : '#BBBBBB';


  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    // Ici, tu intégreras ta logique d'authentification réelle
    console.log('Tentative d\'enrôlement avec :', { nomDeCode, email });
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulation de délai
    setIsLoading(false);
    // Après authentification réussie, rediriger
    router.push('/dashboard'); // Ou toute autre page après inscription
  };

  return (
    <div
      className={styles.pageContainer}
      style={{
        backgroundColor: backgroundColorPage,
        // Définition des variables CSS consommées par inscription.module.css
        '--kiwi-text-primary': textColor,
        '--kiwi-text-secondary': mutedTextColor,
        '--kiwi-border-color': borderColor,
        '--kiwi-border-color-muted': mutedTextColor, // Pour la ligne du séparateur
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
        // Assurez-vous que --font-special-elite et --font-courier-prime sont définis globalement
        // ou utilisez les fallbacks définis dans le CSS module.
      } as React.CSSProperties} // Cast pour permettre les CSS variables
    >
      <div className={styles.formWrapper}>
        <h1 className={styles.title}>Bureau d'Inscription</h1>
        <p className={styles.preamble}>
          Les agents désirant prendre part aux opérations sont priés de remplir la fiche ci-dessous. La discrétion est de rigueur.
        </p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}> {/* Ajout de classe pour grouper */}
            <label htmlFor="nomdecode" className={styles.label}>NOM DE CODE</label>
            <input id="nomdecode" type="text" required value={nomDeCode} onChange={(e) => setNomDeCode(e.target.value)} className={styles.inputField} disabled={isLoading} />
          </div>
          <div className={styles.formGroup}> {/* Ajout de classe pour grouper */}
            <label htmlFor="transmission" className={styles.label}>ADRESSE DE TRANSMISSION (E-mail)</label>
            <input id="transmission" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={styles.inputField} disabled={isLoading} />
          </div>
          <div className={styles.formGroup}> {/* Ajout de classe pour grouper */}
            <label htmlFor="secret" className={styles.label}>CODE SECRET (Mot de passe)</label>
            <input id="secret" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className={styles.inputField} disabled={isLoading} />
          </div>

          <div>
            <button type="submit" disabled={isLoading} className={styles.submitButton}>
              {isLoading ? 'Enregistrement...' : 'VALIDER L\'ENRÔLEMENT'}
            </button>
          </div>
        </form>

        {/* --- Séparateur thématique --- */}
        <div className={styles.separator}>
          <span className={styles.separatorLine}></span>
          <span className={styles.separatorText}>OU</span>
          <span className={styles.separatorLine}></span>
        </div>

        {/* --- Boutons des tiers de confiance --- */}
        <div className={styles.socialButtonsContainer}>
          <button className={styles.socialButton}>
            ENRÔLEMENT AVEC GOOGLE
          </button>
          <button className={styles.socialButton}>
            ENRÔLEMENT AVEC GITHUB
          </button>
        </div>

        <p className={styles.footerText}>
          Déjà un matricule ?{' '}
          <Link href="/" className={styles.link}>
            Accéder au Poste de Commandement.
          </Link>
        </p>
      </div>
    </div>
  );
}