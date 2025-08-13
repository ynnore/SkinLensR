'use client';

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageCode } from '@/types';
import { CheckCircle, XCircle, Circle } from 'lucide-react';
import styles from './register.module.css';

// --- Traductions ---
const allTranslations = {
  onboarding: {
    // ... (Autres traductions) ...
    stepRegister: { en: 'Register', fr: 'Inscription' },

    // TRADUCTIONS POUR LE FORMULAIRE MISES À JOUR
    registerTitle: { en: 'Create your Kiwi-Ops account', fr: 'Créez votre compte Kiwi-Ops' },
    labelEmail: { en: 'Email Address', fr: 'Adresse e-mail' },
    labelPassword: { en: 'Password', en: 'Password', fr: 'Mot de passe' },
    labelPasswordConfirm: { en: 'Confirm Password', fr: 'Confirmez le mot de passe' }, // NOUVEAU
    labelFullName: { en: 'Full Name', fr: 'Nom complet' },
    buttonRegister: { en: 'Create Account', fr: 'Créer le compte' },
    successMessage: { en: '✅ Registration successful! Redirecting to login...', fr: '✅ Inscription réussie ! Redirection vers la connexion...' },
    errorMessageDefault: { en: 'Registration failed. Please check the details.', fr: 'L\'inscription a échoué. Veuillez vérifier les informations.' },
    errorMessageNetwork: { en: '❌ Network error — please try again.', fr: '❌ Erreur réseau — veuillez réessayer.' },
    errorPasswordMismatch: { en: 'Passwords do not match!', fr: 'Les mots de passe ne correspondent pas !' }, // NOUVEAU

    copyright: { en: 'All rights reserved', fr: 'Tous droits réservés' }
  },
};

function getTranslation(section: keyof typeof allTranslations, keyPath: string, lang: LanguageCode): string {
    const keys = keyPath.split('.');
    let value: any = allTranslations[section];
    for (const key of keys) {
        if (!value || typeof value !== 'object') return `[${keyPath}]`;
        value = value[key];
    }
    if (typeof value !== 'object' || value === null || !('en' in value)) return `[${keyPath}]`;
    return (value as { [l: string]: string })[lang] || (value as { [l: string]: string }).en || '';
};

interface Step {
  path: string;
  labelKey: keyof typeof allTranslations.onboarding;
  icon: React.ElementType;
  isDisabled?: boolean;
}

export default function RegisterPage() {
  const { language } = useLanguage();
  const { theme } = useTheme();
  const router = useRouter();
  const currentPath = usePathname();
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  // --- LOGIQUE DU FORMULAIRE D'INSCRIPTION MISE À JOUR ---
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState(''); // NOUVEL ÉTAT
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // **NOUVELLE VALIDATION CÔTÉ CLIENT**
    if (password !== passwordConfirm) {
      setError(getTranslation('onboarding', 'errorPasswordMismatch', language));
      return; // Arrête l'exécution si les mots de passe ne correspondent pas
    }

    try {
      // **REQUÊTE MISE À JOUR AVEC `password_confirm`**
      const res = await fetch('http://0.0.0.0:8000/auth/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          password: password.trim(),
          password_confirm: passwordConfirm.trim(), // CHAMP AJOUTÉ
          full_name: fullName.trim()
        })
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.detail || getTranslation('onboarding', 'errorMessageDefault', language));
      } else {
        setSuccess(getTranslation('onboarding', 'successMessage', language));
        setTimeout(() => router.push('/login'), 2500);
      }
    } catch (err) {
      setError(getTranslation('onboarding', 'errorMessageNetwork', language));
    }
  };
  // --- FIN DE LA LOGIQUE DU FORMULAIRE ---

  const onboardingSteps: Step[] = [
    // ...votre tableau `onboardingSteps` reste inchangé...
  ];

  useEffect(() => {
    // ...votre `useEffect` reste inchangé...
  });

  // Styles basés sur le thème
  const textColor = theme === 'dark' ? '#E0E0E0' : '#333333';
  const mutedTextColor = theme === 'dark' ? '#A0A0A0' : '#666666';
  const borderColor = theme === 'dark' ? '#555555' : '#D1D1D1';
  const backgroundColorPage = theme === 'dark' ? '#1A1A2E' : '#F4F7FC';
  const cardBgColor = theme === 'dark' ? '#212133' : '#FFFFFF';
  const inputBgColor = theme === 'dark' ? '#2A2A3E' : '#F9F9F9';
  const progressTrackColor = theme === 'dark' ? '#4A90E2' : '#0070f3';
  const buttonColor = theme === 'dark' ? '#4A90E2' : '#0070f3';

  const getStepStatus = (step: Step, index: number) => {
    // ...votre fonction `getStepStatus` reste inchangée...
  };

  const renderPageContent = () => {
    switch (currentPath) {
      case '/login':
        return <div>Contenu de la page de connexion...</div>;

      case '/register':
        return (
          <div className={styles.registerContainer} style={{ backgroundColor: cardBgColor, boxShadow: `0 4px 15px ${theme === 'dark' ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.08)'}` }}>
            <h2 style={{ color: textColor }}>{getTranslation('onboarding', 'registerTitle', language)}</h2>
            
            <form onSubmit={handleRegister} className={styles.registerForm}>
              {/* Email */}
              <div>
                <label style={{ color: mutedTextColor, display: 'block', marginBottom: '8px' }}>
                    {getTranslation('onboarding', 'labelEmail', language)}
                </label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required style={{ backgroundColor: inputBgColor, color: textColor, borderColor: borderColor }} />
              </div>

              {/* Password */}
              <div>
                <label style={{ color: mutedTextColor, display: 'block', marginBottom: '8px' }}>
                    {getTranslation('onboarding', 'labelPassword', language)}
                </label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} required style={{ backgroundColor: inputBgColor, color: textColor, borderColor: borderColor }} />
              </div>

              {/* **NOUVEAU CHAMP : Confirm Password** */}
              <div>
                <label style={{ color: mutedTextColor, display: 'block', marginBottom: '8px' }}>
                    {getTranslation('onboarding', 'labelPasswordConfirm', language)}
                </label>
                <input type="password" value={passwordConfirm} onChange={e => setPasswordConfirm(e.target.value)} required style={{ backgroundColor: inputBgColor, color: textColor, borderColor: borderColor }} />
              </div>

              {/* Full Name */}
              <div>
                <label style={{ color: mutedTextColor, display: 'block', marginBottom: '8px' }}>
                    {getTranslation('onboarding', 'labelFullName', language)}
                </label>
                <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} required style={{ backgroundColor: inputBgColor, color: textColor, borderColor: borderColor }} />
              </div>

              <button type="submit" style={{ backgroundColor: buttonColor }}>
                {getTranslation('onboarding', 'buttonRegister', language)}
              </button>
            </form>

            {error && <p className={styles.errorMessage}>{error}</p>}
            {success && <p className={styles.successMessage}>{success}</p>}
          </div>
        );

      default:
        return <div style={{ marginTop: '3rem', color: mutedTextColor }}>Contenu non défini pour : {currentPath}</div>;
    }
  };

  return (
    <div className={styles.pageContainer} style={{ color: textColor, backgroundColor: backgroundColorPage }}>
      {/* ... Votre stepper et footer restent inchangés ... */}
      <main style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'flex-start', width: '100%', padding: '0 1rem' }}>
          {renderPageContent()}
      </main>
    </div>
  );
}