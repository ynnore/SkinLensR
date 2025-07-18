// Fichier: src/app/inscription/page.tsx
'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './inscription.module.css';

export default function InscriptionPage() {
  const [nomDeCode, setNomDeCode] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    console.log('Tentative d\'enrôlement avec :', { nomDeCode, email });
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    router.push('/');
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.formWrapper}>
        <h1 className={styles.title}>Bureau d'Inscription</h1>
        <p className={styles.preamble}>
          Les agents désirant prendre part aux opérations sont priés de remplir la fiche ci-dessous. La discrétion est de rigueur.
        </p>

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* ... Les champs de saisie restent les mêmes ... */}
          <div>
            <label htmlFor="nomdecode" className={styles.label}>NOM DE CODE</label>
            <input id="nomdecode" type="text" required value={nomDeCode} onChange={(e) => setNomDeCode(e.target.value)} className={styles.inputField} disabled={isLoading} />
          </div>
          <div>
            <label htmlFor="transmission" className={styles.label}>ADRESSE DE TRANSMISSION (E-mail)</label>
            <input id="transmission" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={styles.inputField} disabled={isLoading} />
          </div>
          <div>
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