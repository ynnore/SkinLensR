      
'use client';

import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageCode } from '@/types';
import styles from './pricing.module.css';
import { FaCheckCircle, FaTimesCircle, FaStar } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

// Définitions des traductions pour cette page
const allTranslations = {
  pricingPage: {
    mainTitleLine1: {
      en: "Accreditation Protocols",
      fr: "Protocoles d'Accréditation",
      mi: "Ngā Tikanga Whakaaetanga",
      ga: "Prótacail Chreidiúnaithe",
      hi: "प्रत्यायन प्रोटोकॉल",
      gd: "Protocolan Barrantachd",
      'en-AU': "Accreditation Protocols", 'en-NZ': "Accreditation Protocols", 'en-CA': "Accreditation Protocols", 'fr-CA': "Protocoles d'Accréditation", 'en-ZA': "Accreditation Protocols", af: "Akkreditasie Protokolle"
    },
    mainTitleLine2: {
      en: "— Mission Rates —",
      fr: "— Tarifs des Missions —",
      mi: "— Utu Misioni —",
      ga: "— Rátaí Misean —",
      hi: "— मिशन दरें —",
      gd: "— Ratanan Misean —",
      'en-AU': "— Mission Rates —", 'en-NZ': "— Mission Rates —", 'en-CA': "— Mission Rates —", 'fr-CA': "— Tarifs des Missions —", 'en-ZA': "— Mission Rates —", af: "— Sending Tariewe —"
    },
    subtitle: {
      en: '"Choose the level of accreditation that best suits your operations and strategic needs."',
      fr: '"Choisissez le niveau d\'accréditation qui correspond le mieux à vos opérations et à vos besoins stratégiques."',
      mi: '"Kōwhiria te taumata o te whakamana e pai ana kiō mahi meō hiahia rautaki."',
      ga: '"Roghnaigh an leibhéal creidiúnaithe is fearr a oireann do d\'oibríochtaí agus do riachtanais straitéiseacha."',
      hi: '"अपनी संचालन और रणनीतिक आवश्यकताओं के लिए सबसे उपयुक्त प्रत्यायन स्तर चुनें।"',
      gd: '"Tagh an ìre barantachd as fheàrr a fhreagras air do ghnìomhachdan agus do fheumalachdan ro-innleachdail."',
      'en-AU': '"Choose the level of accreditation that best suits your operations and strategic needs."', 'en-NZ': '"Choose the level of accreditation that best suits your operations and strategic needs."', 'en-CA': '"Choose the level of accreditation that best suits your operations and strategic needs."', 'fr-CA': '"Choisissez le niveau d\'accréditation qui correspond le mieux à vos opérations et à vos besoins stratégiques."', 'en-ZA': '"Choose the level of accreditation that best suits your operations and strategic needs."', af: '"Kies die akkreditasievlak wat die beste by u bedrywighede en strategiese behoeftes pas."'
    },
    // Plan Basique
    planBasicName: {
      en: 'AGENT OPS',
      fr: 'AGENT OPS',
      mi: 'ĀPIHA OPS',
      ga: 'GNÍOMHAIRE OPS',
      hi: 'एजेंट ऑप्स',
      gd: 'Àidseant OPS',
      'en-AU': 'AGENT OPS', 'en-NZ': 'AGENT OPS', 'en-CA': 'AGENT OPS', 'fr-CA': 'AGENT OPS', 'en-ZA': 'AGENT OPS', af: 'AGENT OPS'
    },
    planBasicDescription: {
      en: 'For independent agents on discreet missions.',
      fr: 'Pour les agents indépendants en mission discrète.',
      mi: 'Mō ngā āpiha motuhake e mahi ana i ngā misioni huna.',
      ga: 'Do ghníomhairí neamhspleácha ar mhisin discréideacha.',
      hi: 'गुप्त मिशनों पर स्वतंत्र एजेंटों के लिए।',
      gd: 'Airson àidseantan neo-eisimeileach air miseanan dìomhair.',
      'en-AU': 'For independent agents on discreet missions.', 'en-NZ': 'For independent agents on discreet missions.', 'en-CA': 'For independent agents on discreet missions.', 'fr-CA': 'Pour les agents indépendants en mission discrète.', 'en-ZA': 'For independent agents on discreet missions.', af: 'Vir onafhanklike agente op diskrete sendings.'
    },
    basicFeature1: {
      en: 'Essential Tool Access',
      fr: 'Accès Essentiel aux Outils',
      mi: 'Uru Utauta Whakahirahira',
      ga: 'Rochtain Riachtanach ar Uirlisí',
      hi: 'आवश्यक उपकरण पहुंच',
      gd: 'Ruigsinneachd Innealan Riatanach',
      'en-AU': 'Essential Tool Access', 'en-NZ': 'Essential Tool Access', 'en-CA': 'Essential Tool Access', 'fr-CA': 'Accès Essentiel aux Outils', 'en-ZA': 'Noodsaaklike Gereedskap Toegang', af: 'Noodsaaklike Gereedskap Toegang'
    },
    basicFeature2: {
      en: '1 Active Mission',
      fr: '1 Mission Active',
      mi: '1 Misioni Hohe',
      ga: '1 Misean Gníomhach',
      hi: '1 सक्रिय मिशन',
      gd: '1 Misean Gnìomhach',
      'en-AU': '1 Active Mission', 'en-NZ': '1 Active Mission', 'en-CA': '1 Active Mission', 'fr-CA': '1 Mission Active', 'en-ZA': '1 Aktiewe Sending', af: '1 Aktiewe Sending'
    },
    basicFeature3: {
      en: 'Standard Support',
      fr: 'Support Standard',
      mi: 'Tautoko Paerewa',
      ga: 'Tacaíocht Chaighdeánach',
      hi: 'मानक समर्थन',
      gd: 'Taic Cunbhalach',
      'en-AU': 'Standard Support', 'en-NZ': 'Standard Support', 'en-CA': 'Standard Support', 'fr-CA': 'Support Standard', 'en-ZA': 'Standaard Ondersteuning', af: 'Standaard Ondersteuning'
    },
    basicFeature4: {
      en: 'Advanced Analysis Reports',
      fr: 'Rapports d\'Analyse Avancée',
      mi: 'Ngā Pūrongo Tātaritanga Matatau',
      ga: 'Tuarascálacha Anailíse Casta',
      hi: 'उन्नत विश्लेषण रिपोर्ट',
      gd: 'Aithisgean Mion-sgrùdaidh Adhartach',
      'en-AU': 'Advanced Analysis Reports', 'en-NZ': 'Advanced Analysis Reports', 'en-CA': 'Advanced Analysis Reports', 'fr-CA': 'Rapports d\'Analyse Avancée', 'en-ZA': 'Gevorderde Analise Verslae', af: 'Gevorderde Analise Verslae'
    },
    basicFeature5: {
      en: 'Full Archives Access',
      fr: 'Accès aux Archives Complètes',
      mi: 'Uru Pūmahara Katoa',
      ga: 'Rochtain Iomlán ar Chartlanna',
      hi: 'पूर्ण अभिलेखागार पहुंच',
      gd: 'Ruigsinneachd Tasglannan Làn',
      'en-AU': 'Full Archives Access', 'en-NZ': 'Full Archives Access', 'en-CA': 'Full Archives Access', 'fr-CA': 'Accès aux Archives Complètes', 'en-ZA': 'Volle Argief Toegang', af: 'Volle Argief Toegang'
    },
    basicCta: {
      en: 'Accredit (Free)',
      fr: 'S\'Accréditer (Gratuit)',
      mi: 'Whakaaetia (Kore Utu)',
      ga: 'Creidiúnaigh (Saor in Aisce)',
      hi: 'प्रत्यायन करें (मुफ़्त)',
      gd: 'Barrantachd (Saor)',
      'en-AU': 'Accredit (Free)', 'en-NZ': 'Accredit (Free)', 'en-CA': 'Accredit (Free)', 'fr-CA': 'S\'Accréditer (Gratuit)', 'en-ZA': 'Akkrediteer (Gratis)', af: 'Akkrediteer (Gratis)'
    },
    // Plan Standard
    planStandardName: {
      en: 'TEAM OPS',
      fr: 'ÉQUIPE OPS',
      mi: 'KAPA OPS',
      ga: 'Foireann OPS',
      hi: 'टीम ऑप्स',
      gd: 'Sgioba OPS',
      'en-AU': 'TEAM OPS', 'en-NZ': 'TEAM OPS', 'en-CA': 'TEAM OPS', 'fr-CA': 'ÉQUIPE OPS', 'en-ZA': 'SPAN OPS', af: 'SPAN OPS'
    },
    planStandardDescription: {
      en: 'For teams requiring increased coordination.',
      fr: 'Pour les équipes nécessitant une coordination accrue.',
      mi: 'Mō ngā rōpū e hiahia ana kia kaha ake te mahi tahi.',
      ga: 'Do fhoirne a dteastaíonn comhordú méadaithe uathu.',
      hi: 'बढ़े हुए समन्वय की आवश्यकता वाली टीमों के लिए।',
      gd: 'Airson sgiobaidhean a tha feumach air barrachd co-òrdanachaidh.',
      'en-AU': 'For teams requiring increased coordination.', 'en-NZ': 'For teams requiring increased coordination.', 'en-CA': 'For teams requiring increased coordination.', 'fr-CA': 'Pour les équipes nécessitant une coordination accrue.', 'en-ZA': 'Vir spanne wat verhoogde koördinering benodig.', af: 'Vir spanne wat verhoogde koördinering benodig.'
    },
    standardFeature1: {
      en: 'Full Tool Access',
      fr: 'Accès Complet aux Outils',
      mi: 'Uru Utauta Katoa',
      ga: 'Rochtain Iomlán ar Uirlisí',
      hi: 'पूर्ण उपकरण पहुंच',
      gd: 'Ruigsinneachd Innealan Làn',
      'en-AU': 'Full Tool Access', 'en-NZ': 'Full Tool Access', 'en-CA': 'Full Tool Access', 'fr-CA': 'Accès Complet aux Outils', 'en-ZA': 'Volledige Gereedskap Toegang', af: 'Volledige Gereedskap Toegang'
    },
    standardFeature2: {
      en: 'Unlimited Missions',
      fr: 'Missions Illimitées',
      mi: 'Ngā Misioni Kore Mutunga',
      ga: 'Misin Gan Teorainn',
      hi: 'असीमित मिशन',
      gd: 'Miseanan Neo-chuingealaichte',
      'en-AU': 'Unlimited Missions', 'en-NZ': 'Unlimited Missions', 'en-CA': 'Unlimited Missions', 'fr-CA': 'Missions Illimitées', 'en-ZA': 'Onbeperkte Sendings', af: 'Onbeperkte Sendings'
    },
    standardFeature3: {
      en: 'Priority Support',
      fr: 'Support Prioritaire',
      mi: 'Tautoko Matua',
      ga: 'Tacaíocht Tosaíochta',
      hi: 'प्राथमिकता समर्थन',
      gd: 'Taic Prìomhach',
      'en-AU': 'Priority Support', 'en-NZ': 'Priority Support', 'en-CA': 'Priority Support', 'fr-CA': 'Support Prioritaire', 'en-ZA': 'Prioriteit Ondersteuning', af: 'Prioriteit Ondersteuning'
    },
    standardCta: {
      en: 'Choose this Protocol',
      fr: 'Choisir ce Protocole',
      mi: 'Kōwhiria tēnei Tikanga',
      ga: 'Roghnaigh an Prótacal seo',
      hi: 'यह प्रोटोकॉल चुनें',
      gd: 'Tagh an Protocol seo',
      'en-AU': 'Choose this Protocol', 'en-NZ': 'Choose this Protocol', 'en-CA': 'Choose this Protocol', 'fr-CA': 'Choisir ce Protocole', 'en-ZA': 'Kies hierdie Protokol', af: 'Kies hierdie Protokol'
    },
    // Plan Premium
    planPremiumName: {
      en: 'HQ OPS',
      fr: 'QG OPS',
      mi: 'QG OPS',
      ga: 'Ceanncheathrú OPS',
      hi: 'मुख्यालय ऑप्स',
      gd: 'Ceannard-Oifis OPS',
      'en-AU': 'HQ OPS', 'en-NZ': 'HQ OPS', 'en-CA': 'HQ OPS', 'fr-CA': 'QG OPS', 'en-ZA': 'HQ OPS', af: 'HQ OPS'
    },
    planPremiumDescription: {
      en: 'The highest level of authority and resources.',
      fr: 'Le plus haut niveau d\'autorité et de ressources.',
      mi: 'Ko te taumata teitei o te mana me ngā rawa.',
      ga: 'An leibhéal is airde údaráis agus acmhainní.',
      hi: 'अधिकार और संसाधनों का उच्चतम स्तर।',
      gd: 'An ìre as àirde de dh\'ùghdarras agus goireasan.',
      'en-AU': 'The highest level of authority and resources.', 'en-NZ': 'The highest level of authority and resources.', 'en-CA': 'The highest level of authority and resources.', 'fr-CA': 'Le plus haut niveau d\'autorité et de ressources.', 'en-ZA': 'Die hoogste vlak van gesag en hulpbronne.', af: 'Die hoogste vlak van gesag en hulpbronne.'
    },
    premiumFeature1: {
      en: 'Ultra Full Access',
      fr: 'Accès Ultra Complet',
      mi: 'Uru Ultra Katoa',
      ga: 'Rochtain Ultra Iomlán',
      hi: 'अल्ट्रा पूर्ण पहुंच',
      gd: 'Ruigsinneachd Ultra Làn',
      'en-AU': 'Ultra Full Access', 'en-NZ': 'Ultra Full Access', 'en-CA': 'Ultra Full Access', 'fr-CA': 'Accès Ultra Complet', 'en-ZA': 'Ultra Volledige Toegang', af: 'Ultra Volledige Toegang'
    },
    premiumFeature2: {
      en: 'Dedicated 24/7 Support',
      fr: 'Support Dédié 24/7',
      mi: 'Tautoko Whaiaro 24/7',
      ga: 'Tacaíocht Tiomnaithe 24/7',
      hi: 'समर्पित 24/7 समर्थन',
      gd: 'Taic Coisrigte 24/7',
      'en-AU': 'Dedicated 24/7 Support', 'en-NZ': 'Dedicated 24/7 Support', 'en-CA': 'Dedicated 24/7 Support', 'fr-CA': 'Support Dédié 24/7', 'en-ZA': 'Toegewyde 24/7 Ondersteuning', af: 'Toegewyde 24/7 Ondersteuning'
    },
    premiumCta: {
      en: 'Become Commander',
      fr: 'Devenir Commandant',
      mi: 'Kia Kāwana',
      ga: 'Bí i do Cheannasaí',
      hi: 'कमांडर बनें',
      gd: 'Biodh na Chomanndair',
      'en-AU': 'Become Commander', 'en-NZ': 'Become Commander', 'en-CA': 'Become Commander', 'fr-CA': 'Devenir Commandant', 'en-ZA': 'Word Kommandant', af: 'Word Kommandant'
    },
    footer: {
      en: 'Kiwi-Ops – Secure Financial Protocols.',
      fr: 'Kiwi-Ops – Protocoles Financiers Sécurisés.',
      mi: 'Kiwi-Ops – Tikanga Pūtea Haumaru.',
      ga: 'Kiwi-Ops – Prótacail Airgeadais Slána.',
      hi: 'कीवी-ऑप्स – सुरक्षित वित्तीय प्रोटोकॉल।',
      gd: 'Kiwi-Ops – Protocolan Ionmhasail Tèarainte.',
      'en-AU': 'Kiwi-Ops – Secure Financial Protocols.', 'en-NZ': 'Kiwi-Ops – Secure Financial Protocols.', 'en-CA': 'Kiwi-Ops – Secure Financial Protocols.', 'fr-CA': 'Kiwi-Ops – Protocoles Financiers Sécurisés.', 'en-ZA': 'Kiwi-Ops – Veilige Finansiële Protokolle.', af: 'Kiwi-Ops – Veilige Finansiële Protokolle.'
    },
    // Ajout de la traduction pour 'month' pour la page pricing elle-même
    month: {
        en: 'month',
        fr: 'mois',
        mi: 'marama',
        ga: 'mí',
        hi: 'महीना',
        gd: 'mìos',
        'en-AU': 'month', 'en-NZ': 'month', 'en-CA': 'month', 'fr-CA': 'mois', 'en-ZA': 'month', af: 'maand'
    }
  }
};

// Fonction de traduction générique
const getTranslation = <S extends keyof typeof allTranslations, K extends keyof typeof allTranslations[S]>(
  section: S,
  key: K,
  lang: LanguageCode
): string => {
  const sectionTranslations = allTranslations[section];
  if (!sectionTranslations) {
    console.warn(`Translation section not found: ${String(section)}`);
    return `[Missing Section: ${String(section)}]`;
  }
  const specificTranslations = sectionTranslations[key];
  if (typeof specificTranslations !== 'object' || specificTranslations === null || !('en' in specificTranslations)) {
    console.warn(`Translation missing or invalid for: ${String(section)}.${String(key)} in language ${lang}`);
    return `[Invalid Translation: ${String(section)}.${String(key)}]`;
  }
  return (specificTranslations as { [l: string]: string })[lang] || (specificTranslations as { [l: string]: string }).en;
};


export default function PricingPage() {
  const { theme } = useTheme();
  const { language } = useLanguage();
  const router = useRouter();

  const textColor = theme === 'dark' ? '#E0E0E0' : '#111827';
  const mutedTextColor = theme === 'dark' ? '#A0A0A0' : '#6b7280';
  const borderColor = theme === 'dark' ? '#555555' : '#e5e7eb';
  const highlightColor = theme === 'dark' ? '#8BC4FF' : '#4A90E2';

  const backgroundColorPage = theme === 'dark' ? '#1f2937' : '#ffffff';
  const sectionBgColor = theme === 'dark' ? '#2A2A3A' : '#F8F8F8';

  const textShadowColor = theme === 'dark' ? 'rgba(0,0,0,0.6)' : 'rgba(0,0,0,0.1)';
  const shadowColorCard = theme === 'dark' ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.1)';
  const shadowColorHover = theme === 'dark' ? 'rgba(0,0,0,0.7)' : 'rgba(0,0,0,0.2)';
  const shadowColorButton = theme === 'dark' ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.1)';

  const buttonPrimaryBg = theme === 'dark' ? '#005bb5' : '#0070f3';
  const buttonPrimaryHoverBg = theme === 'dark' ? '#004a99' : '#005edb';
  const buttonPrimaryText = theme === 'dark' ? '#E0E0E0' : 'white';


  return (
    <div
      className={styles.pageContainer}
      style={{
        '--kiwi-background-page': backgroundColorPage,
        '--kiwi-text-primary': textColor,
        '--kiwi-text-secondary': mutedTextColor,
        '--kiwi-border-color': borderColor,
        '--kiwi-background-section': sectionBgColor,
        '--kiwi-highlight-color': highlightColor,
        '--kiwi-text-shadow': `2px 2px 0px ${textShadowColor}`,
        '--kiwi-shadow-color-card': shadowColorCard,
        '--kiwi-shadow-color-hover': shadowColorHover,
        '--kiwi-shadow-color-button': shadowColorButton,
        '--kiwi-button-primary-bg': buttonPrimaryBg,
        '--kiwi-button-primary-hover-bg': buttonPrimaryHoverBg,
        '--kiwi-button-primary-text': buttonPrimaryText,
        '--font-special-elite': "'Playfair Display', serif",
        '--font-courier-prime': "'Georgia', serif",
      } as React.CSSProperties}
    >
      <h1 className={styles.title}>
        {getTranslation('pricingPage', 'mainTitleLine1', language)}<br />
        {getTranslation('pricingPage', 'mainTitleLine2', language)}
      </h1>
      <p className={styles.subtitle}>
        {getTranslation('pricingPage', 'subtitle', language)}
      </p>

      <div className={styles.pricingGrid}>
        {/* Carte de Plan Basique */}
        <div className={styles.pricingCard}>
          <div className={styles.cardHeader}>
            <h2 className={styles.planName}>{getTranslation('pricingPage', 'planBasicName', language)}</h2>
            <p className={styles.planDescription}>{getTranslation('pricingPage', 'planBasicDescription', language)}</p>
          </div>
          <p className={styles.price}>
            €0<span>/{getTranslation('pricingPage', 'month', language)}</span> {/* <-- CORRECTION ICI */}
          </p>
          <ul className={styles.featuresList}>
            <li><FaCheckCircle className={styles.featureIcon} /> {getTranslation('pricingPage', 'basicFeature1', language)}</li>
            <li><FaCheckCircle className={styles.featureIcon} /> {getTranslation('pricingPage', 'basicFeature2', language)}</li>
            <li><FaCheckCircle className={styles.featureIcon} /> {getTranslation('pricingPage', 'basicFeature3', language)}</li>
            <li><FaTimesCircle className={styles.featureIcon} style={{ color: mutedTextColor }} /> {getTranslation('pricingPage', 'basicFeature4', language)}</li>
            <li><FaTimesCircle className={styles.featureIcon} style={{ color: mutedTextColor }} /> {getTranslation('pricingPage', 'basicFeature5', language)}</li>
          </ul>
          <button
            className={styles.callToAction}
            onClick={() => router.push('/inscription')}
          >
            {getTranslation('pricingPage', 'basicCta', language)}
          </button>
        </div>

        {/* Carte de Plan Standard */}
        <div className={styles.pricingCard}>
          <div className={styles.cardHeader}>
            <h2 className={styles.planName}>{getTranslation('pricingPage', 'planStandardName', language)}</h2>
            <p className={styles.planDescription}>{getTranslation('pricingPage', 'planStandardDescription', language)}</p>
          </div>
          <p className={styles.price}>
            €29<span>/{getTranslation('pricingPage', 'month', language)}</span> {/* <-- CORRECTION ICI */}
          </p>
          <ul className={styles.featuresList}>
            <li><FaCheckCircle className={styles.featureIcon} /> {getTranslation('pricingPage', 'standardFeature1', language)}</li>
            <li><FaCheckCircle className={styles.featureIcon} /> {getTranslation('pricingPage', 'standardFeature2', language)}</li>
            <li><FaCheckCircle className={styles.featureIcon} /> {getTranslation('pricingPage', 'standardFeature3', language)}</li>
            <li><FaCheckCircle className={styles.featureIcon} /> {getTranslation('pricingPage', 'basicFeature4', language)}</li>
            <li><FaTimesCircle className={styles.featureIcon} style={{ color: mutedTextColor }} /> {getTranslation('pricingPage', 'basicFeature5', language)}</li>
          </ul>
          <button
            className={styles.callToAction}
            onClick={() => router.push('/pay')}
          >
            {getTranslation('pricingPage', 'standardCta', language)}
          </button>
        </div>

        {/* Carte de Plan Premium */}
        <div className={styles.pricingCard}>
          <div className={styles.cardHeader}>
            <h2 className={styles.planName}>
              <FaStar style={{marginRight: '0.5rem', color: highlightColor}}/>
              {getTranslation('pricingPage', 'planPremiumName', language)}
            </h2>
            <p className={styles.planDescription}>{getTranslation('pricingPage', 'planPremiumDescription', language)}</p>
          </div>
          <p className={styles.price}>
            €79<span>/{getTranslation('pricingPage', 'month', language)}</span> {/* <-- CORRECTION ICI */}
          </p>
          <ul className={styles.featuresList}>
            <li><FaCheckCircle className={styles.featureIcon} /> {getTranslation('pricingPage', 'premiumFeature1', language)}</li>
            <li><FaCheckCircle className={styles.featureIcon} /> {getTranslation('pricingPage', 'standardFeature2', language)}</li>
            <li><FaCheckCircle className={styles.featureIcon} /> {getTranslation('pricingPage', 'premiumFeature2', language)}</li>
            <li><FaCheckCircle className={styles.featureIcon} /> {getTranslation('pricingPage', 'basicFeature4', language)}</li>
            <li><FaCheckCircle className={styles.featureIcon} /> {getTranslation('pricingPage', 'basicFeature5', language)}</li>
          </ul>
          <button
            className={styles.callToAction}
            onClick={() => router.push('/pay')}
          >
            {getTranslation('pricingPage', 'premiumCta', language)}
          </button>
        </div>
      </div>

      <p className={styles.globalFooter}>
        © <span suppressHydrationWarning>{new Date().getFullYear()}</span> {getTranslation('pricingPage', 'footer', language)}
      </p>
    </div>
  );
}

    
