// Fichier: src/app/forgot-password/page.tsx
'use client';

import React from 'react';
import styles from './forgot-password.module.css';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import Link from 'next/link';
import { LanguageCode } from '@/types'; // ✅ CORRECTION : Import de LanguageCode

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
  }
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


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Logique d\'envoi du nouveau code à implémenter sur le backend !');
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