// src/app/contact-sales/page.tsx

'use client';

import React, { useState } from 'react';
import { FaPaperPlane } from 'react-icons/fa';
import { useLanguage } from '@/contexts/LanguageContext'; // Assurez-vous que le chemin est correct
import { LanguageCode } from '@/types'; // Assurez-vous que le chemin est correct
import styles from './contact-sales.module.css';

// --- Section des Traductions ---
const translations = {
  title: {
    en: 'Talk to a Sales Rep',
    fr: 'Parler à un Commercial',
    mi: 'Kōrero ki tētahi Kaihoko',
    ga: 'Labhair le hIonadaí Díolacháin',
  },
  subtitle: {
    en: 'Have a question about our offers, a specific project? Fill out this form to get in direct contact with our team.',
    fr: 'Une question sur nos offres, un projet spécifique ? Remplissez ce formulaire pour entrer en contact direct avec notre équipe.',
    mi: 'He pātai mō ā mātou tuku, he kaupapa motuhake? Whakakīia tēnei puka kia whakapā tōtika atu ki tā mātou tīma.',
    ga: 'Ceist agat faoinár dtairiscintí, tionscadal ar leith? Líon an fhoirm seo chun teagmháil dhíreach a dhéanamh lenár bhfoireann.',
  },
  firstNameLabel: { en: 'First Name', fr: 'Prénom', mi: 'Ingoa Tuatahi', ga: 'Ainm' },
  lastNameLabel: { en: 'Last Name', fr: 'Nom', mi: 'Ingoa Whānau', ga: 'Sloinne' },
  emailLabel: { en: 'Email Address', fr: 'Adresse E-mail', mi: 'Wāhitau Īmēra', ga: 'Seoladh Ríomhphoist' },
  roleLabel: { en: 'Your Role', fr: 'Votre Rôle', mi: 'Tō Tūranga', ga: 'Do Ról' },
  companyLabel: { en: 'Company', fr: 'Entreprise', mi: 'Kamupene', ga: 'Cuideachta' },
  messageLabel: { en: 'Your Message', fr: 'Votre Message', mi: 'Tō Karere', ga: 'Do Theachtaireacht' },
  submitButton: { en: 'Send', fr: 'Envoyer', mi: 'Tukua', ga: 'Seol' },
  statusSending: { en: 'Sending...', fr: 'Envoi en cours...', mi: 'E tuku ana...', ga: 'Á sheoladh...' },
  statusSuccess: {
    en: 'Message sent! Our team will contact you soon.',
    fr: 'Message envoyé ! Notre équipe vous contactera bientôt.',
    mi: 'Kua tukuna te karere! Ka whakapā atu tā mātou tīma ki a koe ākuanei.',
    ga: 'Teachtaireacht seolta! Rachaidh ár bhfoireann i dteagmháil leat go luath.',
  },
  statusError: {
    en: 'Error sending message. Please try again.',
    fr: 'Erreur lors de l\'envoi. Veuillez réessayer.',
    mi: 'Hapa i te tuku karere. Ngana anō koa.',
    ga: 'Earráid ag seoladh. Bain triail eile as le do thoil.',
  },
};
// --- Fin de la Section des Traductions ---

export default function ContactSalesPage() {
  const [status, setStatus] = useState({ message: '', type: '' });
  const { language } = useLanguage(); // Récupère la langue actuelle

  // Fonction pour obtenir la bonne traduction, avec fallback sur l'anglais
  const getTranslation = (key: keyof typeof translations, lang: LanguageCode): string => {
    return translations[key]?.[lang] || translations[key]?.['en'] || `[${key}]`;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus({ message: getTranslation('statusSending', language), type: '' });

    // Simule un appel API
    setTimeout(() => {
      setStatus({ message: getTranslation('statusSuccess', language), type: 'success' });
      // setStatus({ message: getTranslation('statusError', language), type: 'error' }); // Pour tester l'erreur
      (event.target as HTMLFormElement).reset();
    }, 2000);
  };

  return (
    <main className={styles.pageContainer}>
      <h1 className={styles.title}>{getTranslation('title', language)}</h1>
      <p className={styles.subtitle}>
        {getTranslation('subtitle', language)}
      </p>

      <form onSubmit={handleSubmit} className={styles.formContainer}>
        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label htmlFor="firstName" className={styles.formLabel}>{getTranslation('firstNameLabel', language)}</label>
            <input type="text" id="firstName" name="firstName" required className={styles.formInput} />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="lastName" className={styles.formLabel}>{getTranslation('lastNameLabel', language)}</label>
            <input type="text" id="lastName" name="lastName" required className={styles.formInput} />
          </div>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="email" className={styles.formLabel}>{getTranslation('emailLabel', language)}</label>
          <input type="email" id="email" name="email" required className={styles.formInput} />
        </div>

        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label htmlFor="role" className={styles.formLabel}>{getTranslation('roleLabel', language)}</label>
            <input type="text" id="role" name="role" className={styles.formInput} />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="company" className={styles.formLabel}>{getTranslation('companyLabel', language)}</label>
            <input type="text" id="company" name="company" required className={styles.formInput} />
          </div>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="message" className={styles.formLabel}>{getTranslation('messageLabel', language)}</label>
          <textarea id="message" name="message" rows={5} required className={styles.formTextarea}></textarea>
        </div>

        <button type="submit" className={styles.submitButton}>
          <FaPaperPlane />
          <span>{getTranslation('submitButton', language)}</span>
        </button>
      </form>

      {status.message && (
        <p className={`${styles.statusMessage} ${status.type === 'success' ? styles.statusSuccess : styles.statusError}`}>
          {status.message}
        </p>
      )}
    </main>
  );
}
    


