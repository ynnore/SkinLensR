// app/pages/terms/page.tsx (ou le chemin approprié pour votre composant client)
'use client';

import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageCode } from '@/types';
import styles from './terms.module.css'; // Assurez-vous que ce chemin est correct

// --- DÉBUT : Translations ---
// Si getTranslation est dans un fichier séparé, importez-le et retirez ce bloc.
// Sinon, laissez-le ici pour l'autonomie du fichier.

const allTranslations = {
  termsPageBeta: {
    mainTitleLine1: {
      en: 'Service Protocols', fr: 'Protocoles de Service', mi: 'Ngā Tikanga Ratonga', ga: 'Prótacail Seirbhíse', hi: 'सेवा प्रोटोकॉल', gd: 'Protocolan Seirbheis', 'en-AU': 'Service Protocols', 'en-NZ': 'Service Protocols', 'en-CA': 'Service Protocols', 'fr-CA': 'Protocoles de Service', 'en-ZA': 'Service Protocols', af: 'Diensprotokolle'
    },
    mainTitleLine2: {
      en: '— Terms & Conditions —', fr: '— Conditions Générales —', mi: '— Tikanga Whānui —', ga: '— Coinníollacha Ginearálta —', hi: '— सामान्य शर्तें —', gd: '— Cumhaichean Coitcheann —', 'en-AU': '— Terms & Conditions —', 'en-NZ': '— Terms & Conditions —', 'en-CA': '— Terms & Conditions —', 'fr-CA': '— Conditions Générales —', 'en-ZA': '— Terms & Conditions —', af: '— Algemene Voorwaardes —'
    },
    subtitle: {
      en: '"Important legal directives for using Kiwi-Ops services."', fr: '"Directives légales importantes pour l\'utilisation des services Kiwi-Ops."', mi: '"Ngā aratohu ture nui mō te whakamahi i ngā ratonga Kiwi-Ops."', ga: '"Treoracha dlíthiúla tábhachtacha maidir le seirbhísí Kiwi-Ops a úsáid."', hi: '"कीवी-ऑप्स सेवाओं का उपयोग करने के लिए महत्वपूर्ण कानूनी निर्देश."', gd: '"Stiùiridhean laghail cudromach airson seirbheisean Kiwi-Ops a chleachdadh."', 'en-AU': '"Important legal directives for using Kiwi-Ops services."', 'en-NZ': '"Important legal directives for using Kiwi-Ops services."', 'en-CA': '"Important legal directives for using Kiwi-Ops services."', 'fr-CA': '"Directives légales importantes pour l\'utilisation des services Kiwi-Ops."', 'en-ZA': '"Important legal directives for using Kiwi-Ops services."', af: '"Belangrike regsriglyne vir die gebruik van Kiwi-Ops dienste."'
    },
    developmentTitle: {
      en: 'Section Under Review', fr: 'Section en Cours de Révision', mi: 'Wāhanga kei te Arotake', ga: 'Rannán Faoi Athbhreithniú', hi: 'अनुभाग समीक्षाधीन है', gd: 'Earrann fo Ath-bhreithneachadh', 'en-AU': 'Section Under Review', 'en-NZ': 'Section Under Review', 'en-CA': 'Section Under Review', 'fr-CA': 'Section en Cours de Révision', 'en-ZA': 'Section Under Review', af: 'Afdeling Onder Hersiening'
    },
    betaTag: {
      en: 'Beta Version', fr: 'Version Bêta', mi: 'Putanga Bêta', ga: 'Leagan Béite', hi: 'बीटा संस्करण', gd: 'Tionndadh Beta', 'en-AU': 'Beta Version', 'en-NZ': 'Beta Version', 'en-CA': 'Beta Version', 'fr-CA': 'Version Bêta', 'en-ZA': 'Beta Version', af: 'Beta Weergawe'
    },
    developmentMessage: {
      en: 'Our comprehensive Terms & Conditions are currently being updated to reflect the latest operational directives and legal frameworks. Thank you for your patience.', fr: 'Nos Conditions Générales complètes sont actuellement mises à jour pour refléter les dernières directives opérationnelles et cadres légaux. Merci de votre patience.', mi: 'Kei te whakahōungia ngā Tikanga Whānui o mātou ki te whakaatu i ngā aratohu whakahaere me ngā anga ture hou. Ngā mihi ki a koe mō tō manawanui.', ga: 'Tá ár dTéarmaí & Coinníollacha cuimsitheacha á nuashonrú faoi láthair chun na treoracha oibriúcháin agus na creataí dlíthiúla is déanaí a léiriú. Go raibh maith agat as do fhoighne.', hi: 'हमारी व्यापक शर्तें और नियम वर्तमान में नवीनतम परिचालन निर्देशों और कानूनी ढाँचे को दर्शाने के लिए अपडेट किए जा रहे हैं। आपके धैर्य के लिए धन्यवाद।', gd: 'Tha ar Teirmichean is Cumhaichean coileanta gan ùrachadh an-dràsta gus sealltainn air na stiùiridhean obrachaidh agus frèam laghail as ùire. Tapadh leibh airson ur foighidinn.', 'en-AU': 'Our comprehensive Terms & Conditions are currently being updated to reflect the latest operational directives and legal frameworks. Thank you for your patience.', 'en-NZ': 'Our comprehensive Terms & Conditions are currently being updated to reflect the latest operational directives and legal frameworks. Thank you for your patience.', 'en-CA': 'Our comprehensive Terms & Conditions are currently being updated to reflect the latest operational directives and legal frameworks. Thank you for your patience.', 'fr-CA': 'Nos Conditions Générales complètes sont actuellement mises à jour pour refléter les dernières directives opérationnelles et cadres légaux. Merci de votre patience.', 'en-ZA': 'Our comprehensive Terms & Conditions are currently being updated to reflect the latest operational directives and legal frameworks. Thank you for your patience.', af: 'Ons omvattende Bepalings en Voorwaardes word tans bygewerk om die nuutste operasionele riglyne en regsfraamwerke te weerspieël. Dankie vir u geduld.'
    },
    stayTuned: {
      en: 'Please check back soon for the full release.', fr: 'Veuillez revenir bientôt pour la version complète.', mi: 'Tēnā hoki mai anō kia wātea te putanga katoa.', ga: 'Fill ar ais go luath le haghaidh an leagan iomlán.', hi: 'पूर्ण रिलीज के लिए कृपया जल्द ही वापस देखें।', gd: 'Thig air ais a dh\'aithghearr airson an tionndadh làn.', 'en-AU': 'Please check back soon for the full release.', 'en-NZ': 'Please check back soon for the full release.', 'en-CA': 'Please check back soon for the full release.', 'fr-CA': 'Veuillez revenir bientôt pour la version complète.', 'en-ZA': 'Please check back soon for the full release.', af: 'Kom binnekort weer vir die volle vrystelling.'
    },
    copyright: {
      en: 'Kiwi-Ops – Provisional Protocols.', fr: 'Kiwi-Ops – Protocoles Provisoires.', mi: 'Kiwi-Ops – Tikanga Wāhanga.', ga: 'Kiwi-Ops – Prótacail Sealadacha.', hi: 'कीवी-ऑप्स – अनंतिम प्रोटोकॉल।', gd: 'Kiwi-Ops – Protocolan Sealach.', 'en-AU': 'Kiwi-Ops – Provisional Protocols.', 'en-NZ': 'Kiwi-Ops – Provisional Protocols.', 'en-CA': 'Kiwi-Ops – Provisional Protocols.', 'fr-CA': 'Kiwi-Ops – Protocoles Provisoires.', 'en-ZA': 'Kiwi-Ops – Provisional Protocols.', af: 'Kiwi-Ops – Voorlopige Protokolle.'
    },
  },
};

// Fonction de traduction générique (si elle n'est pas importée ailleurs)
const getTranslation = <S extends keyof typeof allTranslations, K extends keyof typeof allTranslations[S]>(
  section: S,
  key: K,
  lang: LanguageCode
): string => {
  const sectionTranslations = allTranslations[section];
  if (!sectionTranslations) {
    console.warn(`Translation section missing: ${String(section)}`);
    return `[Missing Section: ${String(section)}]`;
  }
  const specificTranslations = sectionTranslations[key];
  if (typeof specificTranslations !== 'object' || specificTranslations === null || !('en' in specificTranslations)) {
    console.warn(`Translation key missing or invalid for: ${String(section)}.${String(key)} in language ${lang}`);
    return `[Invalid Translation: ${String(section)}.${String(key)}]`;
  }
  return (specificTranslations as { [l: string]: string })[lang] || (specificTranslations as { [l: string]: string }).en;
};

// --- FIN : Translations ---


export default function TermsPage() {
  const { theme } = useTheme();
  const { language } = useLanguage();

  const currentYear = new Date().getFullYear();

  // Helper pour obtenir les variables de thème CSS
  const getThemeColors = () => {
    if (theme === 'dark') {
      return {
        textPrimary: 'var(--kiwi-text-primary-dark, #E0E0E0)',
        textSecondary: 'var(--kiwi-text-secondary-dark, #A0A0A0)',
        borderColor: 'var(--kiwi-border-color-dark, #555555)',
        highlightColor: 'var(--kiwi-highlight-color-dark, #8BC4FF)',
        textShadow: 'var(--kiwi-text-shadow-dark, rgba(0,0,0,0.6))',
        bgColorPage: 'var(--kiwi-bg-page-dark, #1A1A2E)',
        bgColorSection: 'var(--kiwi-bg-section-dark, #2A2A3A)',
        warningBg: 'var(--kiwi-warning-bg-dark, #3A2A2A)',
        warningText: 'var(--kiwi-warning-text-dark, #FFCACA)',
        warningBorder: 'var(--kiwi-warning-border-dark, #FFCACA)',
        shadowCard: 'var(--kiwi-shadow-card-dark, rgba(0,0,0,0.5))',
      };
    } else { // Light theme
      return {
        textPrimary: 'var(--kiwi-text-primary-light, #333333)',
        textSecondary: 'var(--kiwi-text-secondary-light, #666666)',
        borderColor: 'var(--kiwi-border-color-light, #AAAAAA)',
        highlightColor: 'var(--kiwi-highlight-color-light, #4A90E2)',
        textShadow: 'var(--kiwi-text-shadow-light, rgba(150,150,150,0.4))',
        bgColorPage: 'var(--kiwi-bg-page-light, #FFFFFF)',
        bgColorSection: 'var(--kiwi-bg-section-light, #F8F8F8)',
        warningBg: 'var(--kiwi-warning-bg-light, #FFF3F3)',
        warningText: 'var(--kiwi-warning-text-light, #CC0000)',
        warningBorder: 'var(--kiwi-warning-border-light, #CC0000)',
        shadowCard: 'var(--kiwi-shadow-card-light, rgba(0,0,0,0.2))',
      };
    }
  };

  const themeColors = getThemeColors();

  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.title}>
        {getTranslation('termsPageBeta', 'mainTitleLine1', language)}<br />
        {getTranslation('termsPageBeta', 'mainTitleLine2', language)}
      </h1>
      <p className={styles.subtitle}>
        {getTranslation('termsPageBeta', 'subtitle', language)}
      </p>

      {/* Section d'information "En cours de développement" */}
      {/* La carte d'avertissement utilise maintenant des styles conditionnels basés sur le thème */}
      <section className={styles.section} style={{
        borderColor: themeColors.warningBorder,
        backgroundColor: themeColors.warningBg,
        boxShadow: `4px 4px 0px ${themeColors.shadowCard}`,
        // Pas de padding latéral pour la section elle-même, sauf si nécessaire
        padding: '1.5rem 0', 
      }}>
        <h2 className={styles.sectionTitle} style={{ color: themeColors.warningText }}>
          {getTranslation('termsPageBeta', 'developmentTitle', language)}
        </h2>
        <p className={styles.sectionText} style={{ color: themeColors.textSecondary }}>
          {getTranslation('termsPageBeta', 'developmentMessage', language)}
        </p>
        <p className={styles.betaInfo} style={{ color: themeColors.warningText }}>
          {getTranslation('termsPageBeta', 'betaTag', language)} – {getTranslation('termsPageBeta', 'stayTuned', language)}
        </p>
      </section>

      {/* Contenu des documents légaux (à dynamiser avec les données du backend) */}
      <div className={styles.section} style={{ borderBottom: `1px dashed ${themeColors.borderColor}` }}>
        {/* Utilisation des titres et sous-titres des traductions pour le contenu réel */}
        <h2 className={styles.sectionTitle}>
          {getTranslation('termsPageBeta', 'mainTitleLine1', language)} {/* Placeholder */}
        </h2>
        <p className={styles.sectionText}>
          {getTranslation('termsPageBeta', 'subtitle', language)} {/* Placeholder */}
        </p>
        <ul className={styles.sectionList}>
          <li className={styles.sectionListItem}>
            {getTranslation('termsPageBeta', 'copyright', language)} {/* Placeholder */}
          </li>
          <li className={styles.sectionListItem}>
            <a href="#" className={styles.infoLink} style={{ color: themeColors.highlightColor }}>
              Clause 1.1: Definition of Terms
            </a>
          </li>
          <li className={styles.sectionListItem}>
            <a href="#" className={styles.infoLink} style={{ color: themeColors.highlightColor }}>
              Clause 1.2: Acceptance of Terms
            </a>
          </li>
        </ul>
        <p className={styles.sectionText}>
            {getTranslation('termsPageBeta', 'developmentMessage', language)} {/* Placeholder */}
        </p>
      </div>
      {/* Ajoutez d'autres sections ici si nécessaire */}


      <footer className={styles.globalFooter}>
        © {currentYear} {getTranslation('termsPageBeta', 'copyright', language)}
      </footer>
    </div>
  );
}
