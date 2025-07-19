// src/app/login/page.tsx
'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
// 1. IMPORTER LE HOOK DE TRADUCTION
import { useTranslation } from 'react-i18next'; // Ou ton hook équivalent
import styles from './login.module.css';

export default function LoginPage() {
  // 2. INITIALISER LE HOOK POUR AVOIR ACCÈS À LA FONCTION 't'
  const { t } = useTranslation('common'); // 'common' est le nom de ton fichier JSON

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    await new Promise(resolve => setTimeout(resolve, 1000));
    if (email === 'user@example.com' && password === 'password') {
      console.log('Accès autorisé !');
      router.push('/dashboard');
    } else {
      // Tu pourrais aussi traduire ce message d'erreur !
      setError('Identifiants incorrects. Accès refusé par le QG.');
    }
    setIsLoading(false);
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.formWrapper}>
        {/* 3. UTILISER LA FONCTION 't' POUR TRADUIRE CHAQUE TEXTE */}
        <h1 className={styles.title}>
          {t('loginPage.title')}
        </h1>

        {error && (
          <div className={styles.errorBox} role="alert">
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div>
            <label htmlFor="transmission" className={styles.label}>
              {t('loginPage.emailLabel')}
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

          <div>
            <label htmlFor="secret" className={styles.label}>
              {t('loginPage.passwordLabel')}
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
              {isLoading ? 'Transmission...' : t('loginPage.submitButton')}
            </button>
          </div>
        </form>

        <p className={styles.footerText}>
          {t('loginPage.signupPrompt')}{' '}
          <Link href="/inscription" className={styles.link}>
            {t('loginPage.signupLink')}
          </Link>
        </p>
      </div>
    </div>
  );
}