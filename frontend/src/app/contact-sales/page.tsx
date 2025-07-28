// src/app/contact-sales/page.tsx

'use client';

import React, { useState } from 'react';
import { FaPaperPlane } from 'react-icons/fa';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext'; // Importe useTheme
import { LanguageCode } from '@/types';
import styles from './contact-sales.module.css';

// --- Section des Traductions ---
const translations = {
  title: {
    en: 'Talk to a Sales Rep',
    fr: 'Parler à un Commercial',
    mi: 'Kōrero ki tētahi Kaihoko',
    ga: 'Labhair le hIonadaí Díolacháin',
    hi: 'सेल्स प्रतिनिधि से बात करें',
    gd: 'Bruidhinn ri Riochdaire Reic',
    cy: 'Siaradwch â Chynrychiolydd Gwerthiant',
    'en-AU': 'Talk to a Sales Rep',
    'en-CA': 'Talk to a Sales Rep',
    'fr-CA': 'Parler à un Commercial',
    'en-NZ': 'Talk to a Sales Rep',
    'en-ZA': 'Talk to a Sales Rep',
    af: "Praat met 'n Verkoopsverteenwoordiger",
  },
  subtitle: {
    en: 'Have a question about our offers, a specific project? Fill out this form to get in direct contact with our team.',
    fr: 'Une question sur nos offres, un projet spécifique ? Remplissez ce formulaire pour entrer en contact direct avec notre équipe.',
    mi: 'He pātai mō ā mātou tuku, he kaupapa motuhake? Whakakīia tēnei puka kia whakapā tōtika atu ki tā mātou tīma.',
    ga: 'Ceist agat faoinár dtairiscintí, tionscadal ar leith? Líon an fhoirm seo chun teagmháil dhíreach a dhéanamh lenár bhfoireann.',
    hi: 'हमारे प्रस्तावों, किसी विशिष्ट परियोजना के बारे में कोई प्रश्न है? हमारी टीम से सीधे संपर्क करने के लिए यह फ़ॉर्म भरें।',
    gd: 'A bheil ceist agad mu na tairgsean againn, pròiseact sònraichte? Lìon am foirm seo gus fios a chuir chun sgioba againn gu dìreach.',
    cy: 'Oes gennych chi gwestiwn am ein cynigion, prosiect penodol? Llenwch y ffurflen hon i gysylltu\'n uniongyrchol â\'n tîm.',
    'en-AU': 'Have a question about our offers, a specific project? Fill out this form to get in direct contact with our team.',
    'en-CA': 'Have a question about our offers, a specific project? Fill out this form to get in direct contact with our team.',
    'fr-CA': 'Une question sur nos offres, un projet spécifique ? Remplissez ce formulaire pour entrer en contact direct avec notre équipe.',
    'en-NZ': 'Have a question about our offers, a specific project? Fill out this form to get in direct contact with our team.',
    'en-ZA': 'Have a question about our offers, a specific project? Fill out this form to get in direct contact with our team.',
    af: "'n Vraag oor ons aanbiedinge, 'n spesifieke projek? Vul hierdie vorm in om direk met ons span in verbinding te tree.",
  },
  firstNameLabel: {
    en: 'First Name',
    fr: 'Prénom',
    mi: 'Ingoa Tuatahi',
    ga: 'Ainm',
    hi: 'पहला नाम',
    gd: 'Ciad Ainm',
    cy: 'Enw Cyntaf',
    'en-AU': 'First Name',
    'en-CA': 'First Name',
    'fr-CA': 'Prénom',
    'en-NZ': 'First Name',
    'en-ZA': 'First Name',
    af: 'Voornaam',
  },
  lastNameLabel: {
    en: 'Last Name',
    fr: 'Nom',
    mi: 'Ingoa Whānau',
    ga: 'Sloinne',
    hi: 'अंतिम नाम',
    gd: 'Ainm Mu Dheireadh',
    cy: 'Enw Olaf',
    'en-AU': 'Last Name',
    'en-CA': 'Last Name',
    'fr-CA': 'Nom de famille',
    'en-NZ': 'Last Name',
    'en-ZA': 'Last Name',
    af: 'Van',
  },
  emailLabel: {
    en: 'Email Address',
    fr: 'Adresse E-mail',
    mi: 'Wāhitau Īmēra',
    ga: 'Seoladh Ríomhphoist',
    hi: 'ईमेल पता',
    gd: 'Seòladh Post-d',
    cy: 'Cyfeiriad E-bost',
    'en-AU': 'Email Address',
    'en-CA': 'Email Address',
    'fr-CA': 'Adresse courriel',
    'en-NZ': 'Email Address',
    'en-ZA': 'Email Address',
    af: 'E-posadres',
  },
  roleLabel: {
    en: 'Your Role',
    fr: 'Votre Rôle',
    mi: 'Tō Tūranga',
    ga: 'Do Ról',
    hi: 'आपकी भूमिका',
    gd: 'Do Dhreuchd',
    cy: 'Eich Rôl',
    'en-AU': 'Your Role',
    'en-CA': 'Your Role',
    'fr-CA': 'Votre rôle',
    'en-NZ': 'Your Role',
    'en-ZA': 'Your Role',
    af: 'U Rol',
  },
  companyLabel: {
    en: 'Company',
    fr: 'Entreprise',
    mi: 'Kamupene',
    ga: 'Cuideachta',
    hi: 'कंपनी',
    gd: 'Companaidh',
    cy: 'Cwmni',
    'en-AU': 'Company',
    'en-CA': 'Company',
    'fr-CA': 'Entreprise',
    'en-NZ': 'Company',
    'en-ZA': 'Company',
    af: 'Maatskappy',
  },
  messageLabel: {
    en: 'Your Message',
    fr: 'Votre Message',
    mi: 'Tō Karere',
    ga: 'Do Theachtaireacht',
    hi: 'आपका संदेश',
    gd: 'Do Theachdaireachd',
    cy: 'Eich Neges',
    'en-AU': 'Your Message',
    'en-CA': 'Your Message',
    'fr-CA': 'Votre message',
    'en-NZ': 'Your Message',
    'en-ZA': 'Your Message',
    af: 'U Boodskap',
  },
  submitButton: {
    en: 'Send',
    fr: 'Envoyer',
    mi: 'Tukua',
    ga: 'Seol',
    hi: 'भेजें',
    gd: 'Cuir',
    cy: 'Anfon',
    'en-AU': 'Send',
    'en-CA': 'Send',
    'fr-CA': 'Envoyer',
    'en-NZ': 'Send',
    'en-ZA': 'Send',
    af: 'Stuur',
  },
  statusSending: {
    en: 'Sending...',
    fr: 'Envoi en cours...',
    mi: 'E tuku ana...',
    ga: 'Á sheoladh...',
    hi: 'भेजा जा रहा है...',
    gd: 'A\' cur...',
    cy: 'Yn anfon...',
    'en-AU': 'Sending...',
    'en-CA': 'Sending...',
    'fr-CA': 'Envoi en cours...',
    'en-NZ': 'Sending...',
    'en-ZA': 'Sending...',
    af: 'Besig om te stuur...',
  },
  statusSuccess: {
    en: 'Message sent! Our team will contact you soon.',
    fr: 'Message envoyé ! Notre équipe vous contactera bientôt.',
    mi: 'Kua tukuna te karere! Ka whakapā atu tā mātou tīma ki a koe ākuanei.',
    ga: 'Teachtaireacht seolta! Rachaidh ár bhfoireann i dteagmháil leat go luath.',
    hi: 'संदेश भेजा गया! हमारी टीम जल्द ही आपसे संपर्क करेगी।',
    gd: 'Teachdaireachd air a cur! Cuiridh an sgioba againn fios thugad a dh\'aithghearr.',
    cy: 'Neges wedi\'i hanfon! Bydd ein tîm yn cysylltu â chi cyn bo hir.',
    'en-AU': 'Message sent! Our team will contact you soon.',
    'en-CA': 'Message sent! Our team will contact you soon.',
    'fr-CA': 'Message envoyé ! Notre équipe vous contactera bientôt.',
    'en-NZ': 'Message sent! Our team will contact you soon.',
    'en-ZA': 'Message sent! Our team will contact you soon.',
    af: 'Boodskap gestuur! Ons span sal binnekort met u in verbinding tree.',
  },
  statusError: {
    en: 'Error sending message. Please try again.',
    fr: 'Erreur lors de l\'envoi. Veuillez réessayer.',
    mi: 'Hapa i te tuku karere. Ngana anō koa.',
    ga: 'Earráid ag seoladh. Bain triail eile as le do thoil.',
    hi: 'संदेश भेजने में त्रुटि हुई। कृपया पुन: प्रयास करें।',
    gd: 'Mearachd a\' cur teachdaireachd. Feuch ris a-rithist.',
    cy: 'Gwall wrth anfon neges. Ceisiwch eto, os gwelwch yn dda.',
    'en-AU': 'Error sending message. Please try again.',
    'en-CA': 'Error sending message. Please try again.',
    'fr-CA': 'Erreur lors de l\'envoi. Veuillez réessayer.',
    'en-NZ': 'Error sending message. Please try again.',
    'en-ZA': 'Error sending message. Please try again.',
    af: 'Fout tydens boodskap stuur. Probeer asseblief weer.',
  },
};
// --- Fin de la Section des Traductions ---

export default function ContactSalesPage() {
  const [status, setStatus] = useState({ message: '', type: '' });
  const { language } = useLanguage();
  const { theme } = useTheme(); // <--- AJOUTÉE ICI

  const getTranslation = (key: keyof typeof translations, lang: LanguageCode): string => {
    return translations[key]?.[lang] || translations[key]?.['en'] || `[${key}]`;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus({ message: getTranslation('statusSending', language), type: '' });

    setTimeout(() => {
      setStatus({ message: getTranslation('statusSuccess', language), type: 'success' });
      (event.target as HTMLFormElement).reset();
    }, 2000);
  };

  const backgroundColor = theme === 'dark' ? '#1f2937' : '#ffffff';
  const textColor = theme === 'dark' ? '#E0E0E0' : '#111827';
  const cardBgColor = theme === 'dark' ? '#2A2A3A' : '#F8F8F8';
  const borderColor = theme === 'dark' ? '#3e3e4f' : '#e5e7eb';
  const highlightColor = theme === 'dark' ? '#0070f3' : '#0070f3';
  const highlightColorLight = theme === 'dark' ? 'rgba(0,112,243,0.3)' : 'rgba(0,112,243,0.1)';
  const textShadowColor = theme === 'dark' ? '2px 2px 4px rgba(0,0,0,0.5)' : '2px 2px 4px rgba(0,0,0,0.2)';
  const shadowColorCard = theme === 'dark' ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.2)';
  const inputBgColor = theme === 'dark' ? '#1a222c' : '#f2f2f2'; // Nouveau: Couleur de fond pour les inputs


  return (
    <main
      className={styles.pageContainer}
      style={{
        '--kiwi-background-page': backgroundColor,
        '--kiwi-text-primary': textColor,
        '--kiwi-background-card': cardBgColor,
        '--kiwi-border-color': borderColor,
        '--kiwi-highlight-color': highlightColor,
        '--kiwi-highlight-color-light': highlightColorLight,
        '--kiwi-text-shadow': textShadowColor,
        '--kiwi-shadow-color-card': shadowColorCard,
        '--kiwi-background-input': inputBgColor,
        '--kiwi-button-text-color': '#FFFFFF',
      } as React.CSSProperties}
    >
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