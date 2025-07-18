// src/app/login/page.tsx
'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './login.module.css'; // On importe notre propre style

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    // --- Ta logique de connexion reste ici (l'exemple mock est conservé) ---
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (email === 'user@example.com' && password === 'password') {
      console.log('Accès autorisé !');
      router.push('/dashboard');
    } else {
      setError('Identifiants incorrects. Accès refusé par le QG.');
    }
    setIsLoading(false);
    // --- Fin de la logique de connexion ---
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.formWrapper}>
        <h1 className={styles.title}>
          Accès au Poste de Commandement
        </h1>

        {error && (
          <div className={styles.errorBox} role="alert">
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div>
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

          <div>
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
