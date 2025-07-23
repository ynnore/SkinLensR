      
// src/app/page.tsx (Contient maintenant le code de la page de connexion)
'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTheme } from '@/context/ThemeContext'; // Chemin d'importation correct
import styles from './page.module.css';

// ✅ NOUVEAU : Import de l'icône d'installation et de FaDownload comme alternative
import { FaDownload } from 'react-icons/fa'; // Une icône de téléchargement standard
// import { GrInstallOption } from 'react-icons/gr'; // Décommentez si vous avez 'react-icons/gr' installé

export default function LoginPage() {
  const { theme } = useTheme();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Définition des couleurs à injecter comme variables CSS dans le style du div principal
  // ... (vos définitions de couleurs restent inchangées)
  const textColor = theme === 'dark' ? '#E0E0E0' : '#111827';
  const mutedTextColor = theme === 'dark' ? '#A0A0A0' : '#6b7280';
  const borderColor = theme === 'dark' ? '#555555' : '#e5e7eb';
  const highlightColor = theme === 'dark' ? '#8BC4FF' : '#4A90E2';

  const backgroundColorPage = theme === 'dark' ? '#1f2937' : '#ffffff'; // Fond blanc pur
  const sectionBgColor = theme === 'dark' ? '#2A2A3A' : '#F8F8F8'; // Gris très très clair pour les cartes

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
      setError('Identifiants incorrects. Accès refusé par le QG.');
    }
    setIsLoading(false);
  };

  // ✅ Nouvelle fonction pour gérer le clic sur l'icône d'installation
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
        {/* ✅ NOUVEAU : Le bouton/icône d'installation */}
        <button className={styles.installButton} onClick={handleInstallClick} aria-label="Installer l'application">
          {/* Utilisez GrInstallOption si disponible, sinon FaDownload */}
          {/* {typeof GrInstallOption !== 'undefined' ? <GrInstallOption /> : <FaDownload />} */}
          <FaDownload /> {/* Pour l'exemple, utilisons FaDownload par défaut */}
        </button>

        <h1 className={styles.title}>
          Accès à la Mission
        </h1>

        {error && (
          <div className={styles.errorBox} role="alert">
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="transmission" className={styles.label}>
              ADRESSE DE TRANSMISSION
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
              CODE SECRET
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
              {isLoading ? 'Transmission...' : 'TRANSMETTRE'}
            </button>
          </div>
        </form>

        <p className={styles.footerText}>
          Pas encore enrôlé ?{' '}
          <Link href="/inscription" className={styles.link}>
            S'inscrire au bureau.
          </Link>
        </p>
      </div>
    </div>
  );
}

    


