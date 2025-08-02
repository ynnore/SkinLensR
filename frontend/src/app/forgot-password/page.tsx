'use client';

import React, { useState } from 'react';
import styles from './forgot-password.module.css';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import Link from 'next/link';
import { LanguageCode } from '@/types';

// Traductions pour cette page
const forgotPasswordTranslations = {
  headline: {
    en: "Lost Secret Code",
    fr: "Code Secret Perdu",
  },
  instructions: {
    en: "Enter your transmission address. A new code will be sent to you.",
    fr: "Saisissez votre adresse de transmission. Un nouveau code vous sera envoyé.",
  },
  emailLabel: {
    en: "TRANSMISSION ADDRESS",
    fr: "ADRESSE DE TRANSMISSION",
  },
  submitButton: {
    en: "SEND NEW CODE",
    fr: "ENVOYER NOUVEAU CODE",
  },
  backToLogin: {
    en: "Return to Mission Access",
    fr: "Retour à l'Accès Mission",
  },
  successMessage: {
    en: "A new code has been sent to your email address.",
    fr: "Un nouveau code a été envoyé à votre adresse de transmission.",
  },
  errorMessage: {
    en: "An error occurred. Please try again.",
    fr: "Une erreur est survenue. Veuillez réessayer.",
  },
};

function getForgotPasswordTranslation<K extends keyof typeof forgotPasswordTranslations>(key: K, lang: LanguageCode): string {
  return forgotPasswordTranslations[key][lang] || forgotPasswordTranslations[key].en;
}

const ForgotPasswordPage: React.FC = () => {
  const { theme } = useTheme();
  const { language } = useLanguage();

  const backgroundColor = theme === 'dark' ? '#1f2937' : '#ffffff';
  const textColor = theme === 'dark' ? '#E0E0E0' : '#111827';
  const sectionBgColor = theme === 'dark' ? '#2A2A3A' : '#F8F8F8';
  const inputBgColor = theme === 'dark' ? '#1F1F2A' : '#FFFFFF';
  const inputBorderColor = theme === 'dark' ? '#444444' : '#CCCCCC';
  const buttonPrimaryBg = theme === 'dark' ? '#005bb5' : '#0070f3';
  const buttonPrimaryText = theme === 'dark' ? '#E0E0E0' : 'white';

  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const email = (e.target as any).email.value;  // Récupère l'email

    try {
      // Envoi de la demande de réinitialisation au backend
      const response = await fetch('/api/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setMessage(getForgotPasswordTranslation('successMessage', language));
      } else {
        setMessage(getForgotPasswordTranslation('errorMessage', language));
      }
    } catch (error) {
      console.error('Erreur:', error);
      setMessage(getForgotPasswordTranslation('errorMessage', language));
    }
  };

  return (
    <div
      className={styles.container}
      style={{
        '--kiwi-background-page': backgroundColor,
        '--kiwi-text-primary': textColor,
        '--kiwi-background-section': sectionBgColor,
        '--kiwi-input-background-color': inputBgColor,
        '--kiwi-input-border-color': inputBorderColor,
        '--kiwi-button-primary-bg': buttonPrimaryBg,
        '--kiwi-button-primary-text': buttonPrimaryText,
      } as React.CSSProperties}
    >
      <div className={styles.formWrapper}>
        <h1 className={styles.title}>{getForgotPasswordTranslation('headline', language)}</h1>
        <p className={styles.instructions}>{getForgotPasswordTranslation('instructions', language)}</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>
              {getForgotPasswordTranslation('emailLabel', language)}
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className={styles.inputField}
            />
          </div>
          <button type="submit" className={styles.submitButton}>
            {getForgotPasswordTranslation('submitButton', language)}
          </button>
        </form>

        {message && <p className={styles.message}>{message}</p>}

        <p className={styles.backLink}>
          <Link href="/" className={styles.link}>
            {getForgotPasswordTranslation('backToLogin', language)}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
