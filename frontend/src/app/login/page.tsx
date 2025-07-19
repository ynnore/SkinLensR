// src/app/login/page.tsx
'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTheme } from '../../context/ThemeContext'; // Importez le hook useTheme
import styles from './login.module.css'; // On importe notre propre style

export default function LoginPage() {
  const { theme } = useTheme(); // Accédez au thème actuel

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
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

  // Couleurs pour les messages d'erreur
  const errorBackground = theme === 'dark' ? '#5C2D2D' : '#FFDADA';
  const errorText = theme === 'dark' ? '#FFCACA' : '#CC0000';
  const errorBorder = theme === 'dark' ? '#CC0000' : '#FF0000';
  const errorShadow = theme === 'dark' ? 'rgba(204,0,0,0.4)' : 'rgba(255,0,0,0.2)';

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    // --- Ta logique de connexion reste ici (l'exemple mock est conservé) ---
    // En production, cette logique ferait un appel à ton backend pour l'authentification.
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (email === 'user@example.com' && password === 'password') {
      console.log('Accès autorisé !');
      router.push('/dashboard'); // Rediriger vers le tableau de bord après succès
    } else {
      setError('Identifiants incorrects. Accès refusé par le QG.');
    }
    setIsLoading(false);
    // --- Fin de la logique de connexion ---
  };

  return (
    <div
      className={styles.pageContainer}
      style={{
        backgroundColor: backgroundColorPage,
        // Définition des variables CSS consommées par login.module.css
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
      } as React.CSSProperties} // Cast pour permettre les CSS variables
    >
      <div className={styles.formWrapper}>
        <h1 className={styles.title}>
          Accès à la Mission
        </h1>

        {error && (
          <div className={styles.errorBox} role="alert">
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}> {/* Ajout de classe pour grouper */}
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

          <div className={styles.formGroup}> {/* Ajout de classe pour grouper */}
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