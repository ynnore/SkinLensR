'use client'; // Indique que ce composant est un Client Component

import React from 'react';
import { useTheme } from '../../context/ThemeContext'; // Assurez-vous que ce chemin est correct
import { useLanguage } from '@/contexts/LanguageContext'; // Importez useLanguage
import { LanguageCode } from '@/types'; // Importez LanguageCode

// Définitions des traductions pour cette page BETA
const allTranslations = {
  termsPageBeta: {
    mainTitleLine1: {
      en: 'Service Protocols',
      fr: 'Protocoles de Service',
      mi: 'Ngā Tikanga Ratonga',
      ga: 'Prótacail Seirbhíse',
      hi: 'सेवा प्रोटोकॉल',
      gd: 'Protocolan Seirbheis',
      'en-AU': 'Service Protocols', 'en-NZ': 'Service Protocols', 'en-CA': 'Service Protocols', 'fr-CA': 'Protocoles de Service', 'en-ZA': 'Service Protocols', af: 'Diensprotokolle'
    },
    mainTitleLine2: {
      en: '— Terms & Conditions —',
      fr: '— Conditions Générales —',
      mi: '— Tikanga Whānui —',
      ga: '— Coinníollacha Ginearálta —',
      hi: '— सामान्य शर्तें —',
      gd: '— Cumhaichean Coitcheann —',
      'en-AU': '— Terms & Conditions —', 'en-NZ': '— Terms & Conditions —', 'en-CA': '— Terms & Conditions —', 'fr-CA': '— Conditions Générales —', 'en-ZA': '— Terms & Conditions —', af: '— Algemene Voorwaardes —'
    },
    subtitle: {
      en: '"Important legal directives for using Kiwi-Ops services."',
      fr: '"Directives légales importantes pour l\'utilisation des services Kiwi-Ops."',
      mi: '"Ngā aratohu ture nui mō te whakamahi i ngā ratonga Kiwi-Ops."',
      ga: '"Treoracha dlíthiúla tábhachtacha maidir le seirbhísí Kiwi-Ops a úsáid."',
      hi: '"कीवी-ऑप्स सेवाओं का उपयोग करने के लिए महत्वपूर्ण कानूनी निर्देश।"',
      gd: '"Stiùiridhean laghail cudromach airson seirbheisean Kiwi-Ops a chleachdadh."',
      'en-AU': '"Important legal directives for using Kiwi-Ops services."', 'en-NZ': '"Important legal directives for using Kiwi-Ops services."', 'en-CA': '"Important legal directives for using Kiwi-Ops services."', 'fr-CA': '"Directives légales importantes pour l\'utilisation des services Kiwi-Ops."', 'en-ZA': '"Important legal directives for using Kiwi-Ops services."', af: '"Belangrike regsriglyne vir die gebruik van Kiwi-Ops dienste."'
    },
    developmentTitle: {
      en: 'Section Under Review',
      fr: 'Section en Cours de Révision',
      mi: 'Wāhanga kei te Arotake',
      ga: 'Rannán Faoi Athbhreithniú',
      hi: 'अनुभाग समीक्षाधीन है',
      gd: 'Earrann fo Ath-bhreithneachadh',
      'en-AU': 'Section Under Review', 'en-NZ': 'Section Under Review', 'en-CA': 'Section Under Review', 'fr-CA': 'Section en Cours de Révision', 'en-ZA': 'Section Under Review', af: 'Afdeling Onder Hersiening'
    },
    betaTag: {
      en: 'Beta Version',
      fr: 'Version Bêta',
      mi: 'Putanga Bêta',
      ga: 'Leagan Béite',
      hi: 'बीटा संस्करण',
      gd: 'Tionndadh Beta',
      'en-AU': 'Beta Version', 'en-NZ': 'Beta Version', 'en-CA': 'Beta Version', 'fr-CA': 'Version Bêta', 'en-ZA': 'Beta Version', af: 'Beta Weergawe'
    },
    developmentMessage: {
      en: 'Our comprehensive Terms & Conditions are currently being updated to reflect the latest operational directives and legal frameworks. Thank you for your patience.',
      fr: 'Nos Conditions Générales complètes sont actuellement mises à jour pour refléter les dernières directives opérationnelles et cadres légaux. Merci de votre patience.',
      mi: 'Kei te whakahōungia ngā Tikanga Whānui o mātou ki te whakaatu i ngā aratohu whakahaere me ngā anga ture hou. Ngā mihi ki a koe mō tō manawanui.',
      ga: 'Tá ár dTéarmaí & Coinníollacha cuimsitheacha á nuashonrú faoi láthair chun na treoracha oibriúcháin agus na creataí dlíthiúla is déanaí a léiriú. Go raibh maith agat as do fhoighne.',
      hi: 'हमारी व्यापक शर्तें और नियम वर्तमान में नवीनतम परिचालन निर्देशों और कानूनी ढाँचे को दर्शाने के लिए अपडेट किए जा रहे हैं। आपके धैर्य के लिए धन्यवाद।',
      gd: 'Tha ar Teirmichean is Cumhaichean coileanta gan ùrachadh an-dràsta gus sealltainn air na stiùiridhean obrachaidh agus frèam laghail as ùire. Tapadh leibh airson ur foighidinn.',
      'en-AU': 'Our comprehensive Terms & Conditions are currently being updated to reflect the latest operational directives and legal frameworks. Thank you for your patience.', 'en-NZ': 'Our comprehensive Terms & Conditions are currently being updated to reflect the latest operational directives and legal frameworks. Thank you for your patience.', 'en-CA': 'Our comprehensive Terms & Conditions are currently being updated to reflect the latest operational directives and legal frameworks. Thank you for your patience.', 'fr-CA': 'Nos Conditions Générales complètes sont actuellement mises à jour pour refléter les dernières directives opérationnelles et cadres légaux. Merci de votre patience.', 'en-ZA': 'Our comprehensive Terms & Conditions are currently being updated to reflect the latest operational directives and legal frameworks. Thank you for your patience.', af: 'Ons omvattende Bepalings en Voorwaardes word tans bygewerk om die nuutste operasionele riglyne en regsfraamwerke te weerspieël. Dankie vir u geduld.'
    },
    stayTuned: {
      en: 'Please check back soon for the full release.',
      fr: 'Veuillez revenir bientôt pour la version complète.',
      mi: 'Tēnā hoki mai anō kia wātea te putanga katoa.',
      ga: 'Fill ar ais go luath le haghaidh an leagan iomlán.',
      hi: 'पूर्ण रिलीज के लिए कृपया जल्द ही वापस देखें।',
      gd: 'Thig air ais a dh\'aithghearr airson an tionndadh làn.',
      'en-AU': 'Please check back soon for the full release.', 'en-NZ': 'Please check back soon for the full release.', 'en-CA': 'Please check back soon for the full release.', 'fr-CA': 'Veuillez revenir bientôt pour la version complète.', 'en-ZA': 'Please check back soon for the full release.', af: 'Kom binnekort weer vir die volle vrystelling.'
    },
    copyright: {
      en: 'Kiwi-Ops – Provisional Protocols.',
      fr: 'Kiwi-Ops – Protocoles Provisoires.',
      mi: 'Kiwi-Ops – Tikanga Wāhanga.',
      ga: 'Kiwi-Ops – Prótacail Sealadacha.',
      hi: 'कीवी-ऑप्स – अनंतिम प्रोटोकॉल।',
      gd: 'Kiwi-Ops – Protocolan Sealach.',
      'en-AU': 'Kiwi-Ops – Provisional Protocols.', 'en-NZ': 'Kiwi-Ops – Provisional Protocols.', 'en-CA': 'Kiwi-Ops – Provisional Protocols.', 'fr-CA': 'Kiwi-Ops – Protocoles Provisoires.', 'en-ZA': 'Kiwi-Ops – Provisional Protocols.', af: 'Kiwi-Ops – Voorlopige Protokolle.'
    },
  },
};

// Fonction de traduction générique (copiée pour autonomie du fichier)
const getTranslation = <S extends keyof typeof allTranslations, K extends keyof typeof allTranslations[S]>(
  section: S,
  key: K,
  lang: LanguageCode
): string => {
  const sectionTranslations = allTranslations[section];
  if (!sectionTranslations) return `[Missing Section: ${String(section)}]`;
  const specificTranslations = sectionTranslations[key];
  if (typeof specificTranslations !== 'object' || specificTranslations === null || !('en' in specificTranslations)) {
    console.warn(`Translation missing or invalid for: ${String(section)}.${String(key)} in language ${lang}`);
    return `[Invalid Translation: ${String(section)}.${String(key)}]`;
  }
  return (specificTranslations as { [l: string]: string })[lang] || (specificTranslations as { [l: string]: string }).en;
};


export default function TermsPage() {
  const { theme } = useTheme();
  const { language } = useLanguage(); // Obtenez la langue courante

  // Définissez les couleurs en fonction du thème, cohérentes avec le style "super agent"
  const textColor = theme === 'dark' ? '#E0E0E0' : '#333333';
  const mutedTextColor = theme === 'dark' ? '#A0A0A0' : '#666666';
  const borderColor = theme === 'dark' ? '#555555' : '#AAAAAA';
  const backgroundColorPage = theme === 'dark' ? '#1A1A2E' : '#FFFFFF'; // Fond blanc pour le mode clair
  const sectionBgColor = theme === 'dark' ? '#2A2A3A' : '#F8F8F8'; // Fond des sections/cartes
  const highlightColor = theme === 'dark' ? '#8BC4FF' : '#4A90E2';
  const textShadowColor = theme === 'dark' ? 'rgba(0,0,0,0.6)' : 'rgba(150,150,150,0.4)';
  const shadowColorCard = theme === 'dark' ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.2)';

  const warningBackground = theme === 'dark' ? '#3A2A2A' : '#FFF3F3'; // Fond léger pour l'alerte
  const warningText = theme === 'dark' ? '#FFCACA' : '#CC0000'; // Rouge pour l'alerte de développement
  const warningBorder = theme === 'dark' ? '#FFCACA' : '#CC0000'; // Bordure pour l'alerte de développement

  return (
    <div style={{
      padding: '2rem',
      maxWidth: '1000px', // Largeur adaptée pour le contenu
      margin: '0 auto',
      lineHeight: '1.6',
      fontSize: '1rem',
      color: textColor,
      fontFamily: "'Arial', sans-serif",
      backgroundColor: backgroundColorPage,
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
    }}>
      <h1 style={{
        marginBottom: '1rem',
        fontSize: '3.8rem',
        textAlign: 'center',
        fontWeight: 'bold',
        fontFamily: "'Playfair Display', serif",
        textTransform: 'uppercase',
        letterSpacing: '3px',
        color: textColor,
        textShadow: `3px 3px 0px ${textShadowColor}`
      }}>
        {getTranslation('termsPageBeta', 'mainTitleLine1', language)}<br />
        {getTranslation('termsPageBeta', 'mainTitleLine2', language)}
      </h1>
      <p style={{
        fontStyle: 'italic',
        marginBottom: '3rem',
        textAlign: 'center',
        color: mutedTextColor,
        fontSize: '1.2rem',
        maxWidth: '80%',
        borderBottom: `1px solid ${borderColor}`,
        paddingBottom: '1rem'
      }}>
        {getTranslation('termsPageBeta', 'subtitle', language)}
      </p>

      {/* Carte d'information "En cours de développement" */}
      <section style={{
        width: '100%',
        marginTop: '3rem',
        padding: '2rem',
        border: `2px dashed ${warningBorder}`,
        borderRadius: '8px',
        backgroundColor: warningBackground,
        color: warningText,
        textAlign: 'center',
        boxShadow: `4px 4px 0px ${shadowColorCard}`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '200px',
      }}>
        <h2 style={{
          fontSize: '2rem',
          marginBottom: '1rem',
          color: warningText,
          fontFamily: "'Playfair Display', serif",
          fontWeight: 'bold',
          textTransform: 'uppercase'
        }}>
          {getTranslation('termsPageBeta', 'developmentTitle', language)}
        </h2>
        <p style={{
          fontSize: '1.2rem',
          fontStyle: 'italic',
          color: mutedTextColor,
          maxWidth: '700px'
        }}>
          {getTranslation('termsPageBeta', 'developmentMessage', language)}
        </p>
        <p style={{
          fontSize: '1.1rem',
          marginTop: '1.5rem',
          fontWeight: 'bold',
          color: warningText
        }}>
          {getTranslation('termsPageBeta', 'betaTag', language)} – {getTranslation('termsPageBeta', 'stayTuned', language)}
        </p>
      </section>

      <p style={{ textAlign: 'center', marginTop: '4rem', fontSize: '0.8rem', color: mutedTextColor }}>
        © <span suppressHydrationWarning>{new Date().getFullYear()}</span> {getTranslation('termsPageBeta', 'copyright', language)}
      </p>
    </div>
  );
}