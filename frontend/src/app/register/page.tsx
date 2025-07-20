// Fichier: src/app/register/page.tsx
'use client'; // This component needs to be a client component for interactivity

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTheme } from '../../context/ThemeContext'; // Ajustez le chemin si nécessaire
import styles from './register.module.css'; // Importez le CSS module spécifique à 'register'

export default function RegisterPage() {
  const { theme } = useTheme();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const router = useRouter();

  // Définition des couleurs à injecter comme variables CSS dans le style du div principal
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

  // Nouvelles variables pour le message de succès
  const successBackground = theme === 'dark' ? '#2E5C2D' : '#DAFFDA';
  const successText = theme === 'dark' ? '#CACAFF' : '#00CC00';
  const successBorder = theme === 'dark' ? '#00CC00' : '#00FF00';


  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    if (password !== confirmPassword) {
      setError('Les Codes Secrets ne correspondent pas.');
      setIsLoading(false);
      return;
    }

    if (password.length < 8) { // Une longueur minimale plus sécurisée
      setError('Le Code Secret doit contenir au moins 8 caractères.');
      setIsLoading(false);
      return;
    }

    // --- Simulation d'appel API pour l'Enrôlement du Fondateur ---
    console.log('Tentative d\'enrôlement Fondateur avec :', { username, email });
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simuler un délai réseau

    // Simuler un enrôlement réussi ou une erreur courante
    if (email === 'taken@example.com') {
      setError('Cette Adresse de Transmission est déjà enregistrée.');
    } else {
      setSuccessMessage('Enrôlement en tant que Fondateur réussi ! Bienvenue à bord.');
      // Optionnel : rediriger après un délai ou laisser l'utilisateur cliquer un lien
      // setTimeout(() => router.push('/'), 3000); // Redirige vers la page de connexion
    }
    setIsLoading(false);
    // --- Fin de l'implémentation simulée ---
  };

  return (
    <div
      className={styles.pageContainer}
      style={{
        // Définition des variables CSS passées au module CSS
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
        '--kiwi-error-background': errorBackground,
        '--kiwi-error-text': errorText,
        '--kiwi-error-border': errorBorder,
        '--kiwi-error-shadow': errorShadow,
        '--kiwi-success-background': successBackground, // Nouvelle variable succès
        '--kiwi-success-text': successText, // Nouvelle variable succès
        '--kiwi-success-border': successBorder, // Nouvelle variable succès
        '--font-special-elite': "'Playfair Display', serif",
        '--font-courier-prime': "'Georgia', serif",
      } as React.CSSProperties}
    >
      <div className={styles.formWrapper}>
        <h1 className={styles.title}>
          Enrôlement Fighter
        </h1>

        {error && (
          <div className={styles.errorBox} role="alert">
            <p>{error}</p>
          </div>
        )}

        {successMessage && (
          <div className={styles.successBox} role="alert">
            <p>{successMessage}</p>
          </div>
        )}

        {!successMessage && (
          <form onSubmit={handleSubmit} className={styles.form}>
            {/* Champ Nom d'Utilisateur (Optionnel) */}
            <div>
              <label
                htmlFor="username"
                className={styles.label}
              >
                Nom de Code Fighter (Optionnel)
              </label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={styles.inputField}
                disabled={isLoading}
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className={styles.label}
              >
                Camp de Base Fighter
              </label>
              <input
                id="email"
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

            <div>
              <label
                htmlFor="password"
                className={styles.label}
              >
                Code Secret Fighter
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={styles.inputField}
                disabled={isLoading}
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className={styles.label}
              >
                Confirmer Code Secret
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
                {isLoading ? 'Enrôlement en cours...' : 'ENRÔLER EN TANT QUE KIWI-OPS FIGHTER'}
              </button>
            </div>
          </form>
        )}

        <p className={styles.footerText}>
          Déjà un Fighter?{' '}
          <Link
            href="/" // Redirige vers la page de connexion principale (qui est '/')
            className={styles.link}
          >
            Accéder au Poste de Commandement.
          </Link>
        </p>
      </div>
    </div>
  );
}