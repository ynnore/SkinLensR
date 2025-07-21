'use client'; // Indique que ce composant est un Client Component

import React from 'react';
import { useTheme } from '../../context/ThemeContext'; // Assurez-vous que ce chemin est correct
import { useLanguage } from '@/contexts/LanguageContext'; // Importez useLanguage
import { LanguageCode } from '@/types'; // Importez LanguageCode

// Définitions des traductions pour cette page BETA
const allTranslations = {
  settingsPageBeta: { // Section spécifique pour cette page simplifiée
    mainTitleLine1: {
      en: 'Headquarters',
      fr: 'Quartier Général',
      mi: 'Tari Matua',
      ga: 'Ceanncheathrú',
      hi: 'मुख्यालय',
      gd: 'Prìomh-Oifis',
      'en-AU': 'Headquarters', 'en-NZ': 'Headquarters', 'en-CA': 'Headquarters', 'fr-CA': 'Quartier Général', 'en-ZA': 'Hoofkwartier', af: 'Hoofkwartier'
    },
    mainTitleLine2: {
      en: '— Configuration —',
      fr: '— Configuration —',
      mi: '— Whirihoranga —',
      ga: '— Cumraíocht —',
      hi: '— कॉन्फ़िгураेशन —',
      gd: '— Rèiteachadh —',
      'en-AU': '— Configuration —', 'en-NZ': '— Configuration —', 'en-CA': '— Configuration —', 'fr-CA': '— Configuration —', 'en-ZA': '— Konfigurasie —', af: '— Konfigurasie —'
    },
    subtitle: {
      en: '"Adjust your account settings and operational preferences."',
      fr: '"Ajustez les paramètres de votre compte et les préférences opérationnelles."',
      mi: '"Whakaritea ō tautuhinga pūkete me ō manakohanga whakahaere."',
      ga: '"Coigeartaigh do shocruithe cuntais agus roghanna oibríochtúla."',
      hi: '"अपने खाते की सेटिंग्स और परिचालन वरीयताओं को समायोजित करें।"',
      gd: '"Atharraich roghainnean a’ chunntais agad agus roghainnean obrachaidh."',
      'en-AU': '"Adjust your account settings and operational preferences."', 'en-NZ': '"Adjust your account settings and operational preferences."', 'en-CA': '"Adjust your account settings and operational preferences."', 'fr-CA': '"Ajustez les paramètres de votre compte et les préférences opérationnelles."', 'en-ZA': '"Pas u rekeninginstellings en operasionele voorkeure aan."', af: '"Pas u rekeninginstellings en operasionele voorkeure aan."'
    },
    developmentTitle: {
      en: 'Settings Module Under Review',
      fr: 'Module de Paramètres en Cours de Révision',
      mi: 'Kōwae Tautuhinga kei te Arotake',
      ga: 'Modúl Socruithe Faoi Athbhreithniú',
      hi: 'सेटिंग्स मॉड्यूल समीक्षाधीन है',
      gd: 'Modal Roghainnean fo Ath-bhreithneachadh',
      'en-AU': 'Settings Module Under Review', 'en-NZ': 'Settings Module Under Review', 'en-CA': 'Settings Module Under Review', 'fr-CA': 'Module de Paramètres en Cours de Révision', 'en-ZA': 'Instellings Module Onder Hersiening', af: 'Instellings Module Onder Hersiening'
    },
    betaTag: {
      en: 'Beta Version',
      fr: 'Version Bêta',
      mi: 'Putanga Bêta',
      ga: 'Leagan Béite',
      hi: 'बीटा संस्करण',
      gd: 'Tionndadh Beta',
      'en-AU': 'Beta Version', 'en-NZ': 'Beta Version', 'en-CA': 'Beta Version', 'fr-CA': 'Version Bêta', 'en-ZA': 'Beta Weergawe', af: 'Beta Weergawe'
    },
    developmentMessage: {
      en: 'The detailed settings and customization options are being calibrated for optimal performance and security. Full functionality will be deployed soon.',
      fr: 'Les paramètres détaillés et les options de personnalisation sont en cours de calibrage pour des performances et une sécurité optimales. La fonctionnalité complète sera déployée prochainement.',
      mi: 'Kei te whakatika ngā tautuhinga taipitopito me ngā kōwhiringa whakarite mō te mahi tino pai me te haumarutanga. Ka tukuna kētia te mahi katoa.',
      ga: 'Tá na socruithe mionsonraithe agus na roghanna saincheaptha á gcalabrú faoi láthair le haghaidh feidhmíochta agus slándála optamacha. Imscarfar feidhmíocht iomlán go luath.',
      hi: 'विस्तृत सेटिंग्स और अनुकूलन विकल्प इष्टतम प्रदर्शन और सुरक्षा के लिए कैलिब्रेट किए जा रहे हैं। पूर्ण कार्यक्षमता जल्द ही तैनात की जाएगी।',
      gd: 'Tha na roghainnean mionaideach agus roghainnean gnàthachaidh gan calpachadh airson coileanadh is tèarainteachd as fheàrr. Thèid làn ghnìomhachd a chleachdadh a dh\'aithghearr.',
      'en-AU': 'The detailed settings and customization options are being calibrated for optimal performance and security. Full functionality will be deployed soon.', 'en-NZ': 'The detailed settings and customization options are being calibrated for optimal performance and security. Full functionality will be deployed soon.', 'en-CA': 'The detailed settings and customization options are being calibrated for optimal performance and security. Full functionality will be deployed soon.', 'fr-CA': 'Les paramètres détaillés et les options de personnalisation sont en cours de calibrage pour des performances et une sécurité optimales. La fonctionnalité complète sera déployée prochainement.', 'en-ZA': 'Die gedetailleerde instellings en aanpassingsopsies word tans gekalibreer vir optimale prestasie en sekuriteit. Volle funksionaliteit sal binnekort ontplooi word.', af: 'Die gedetailleerde instellings en aanpassingsopsies word tans gekalibreer vir optimale prestasie en sekuriteit. Volle funksionaliteit sal binnekort ontplooi word.'
    },
    stayTuned: {
      en: 'Stay tuned for Command updates.',
      fr: 'Restez à l\'écoute pour les mises à jour du Commandement.',
      mi: 'Kia mataara tonu mō ngā whakahōutanga mai i te Whakahau.',
      ga: 'Fan tiúnta le haghaidh nuashonruithe ón Ordú.',
      hi: 'कमांड से अपडेट के लिए बने रहें।',
      gd: 'Fuirichibh furachair airson ùrachaidhean bhon Àithne.',
      'en-AU': 'Stay tuned for Command updates.', 'en-NZ': 'Stay tuned for Command updates.', 'en-CA': 'Stay tuned for Command updates.', 'fr-CA': 'Restez à l\'écoute pour les mises à jour du Commandement.', 'en-ZA': 'Bly ingeskakel vir opdaterings van die Bevel.', af: 'Bly ingeskakel vir opdaterings van die Bevel.'
    },
    copyright: {
      en: 'Kiwi-Ops – Provisional Settings Protocol.',
      fr: 'Kiwi-Ops – Protocole de Paramètres Provisoires.',
      mi: 'Kiwi-Ops – Tikanga Tautuhinga Wāhanga.',
      ga: 'Kiwi-Ops – Prótacal Socruithe Sealadacha.',
      hi: 'कीवी-ऑप्स – अनंतिम सेटिंग्स प्रोटोकॉल।',
      gd: 'Kiwi-Ops – Protocol Roghainnean Sealach.',
      'en-AU': 'Kiwi-Ops – Provisional Settings Protocol.', 'en-NZ': 'Kiwi-Ops – Provisional Settings Protocol.', 'en-CA': 'Kiwi-Ops – Provisional Settings Protocol.', 'fr-CA': 'Kiwi-Ops – Protocole de Paramètres Provisoires.', 'en-ZA': 'Kiwi-Ops – Voorlopige Instellings Protokol.', af: 'Kiwi-Ops – Voorlopige Instellings Protokol.'
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


export default function SettingsPage() {
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
        {getTranslation('settingsPageBeta', 'mainTitleLine1', language)}<br />
        {getTranslation('settingsPageBeta', 'mainTitleLine2', language)}
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
        {getTranslation('settingsPageBeta', 'subtitle', language)}
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
          {getTranslation('settingsPageBeta', 'developmentTitle', language)}
        </h2>
        <p style={{
          fontSize: '1.2rem',
          fontStyle: 'italic',
          color: mutedTextColor,
          maxWidth: '700px'
        }}>
          {getTranslation('settingsPageBeta', 'developmentMessage', language)}
        </p>
        <p style={{
          fontSize: '1.1rem',
          marginTop: '1.5rem',
          fontWeight: 'bold',
          color: warningText
        }}>
          {getTranslation('settingsPageBeta', 'betaTag', language)} – {getTranslation('settingsPageBeta', 'stayTuned', language)}
        </p>
      </section>

      <p style={{ textAlign: 'center', marginTop: '4rem', fontSize: '0.8rem', color: mutedTextColor }}>
        © <span suppressHydrationWarning>{new Date().getFullYear()}</span> {getTranslation('settingsPageBeta', 'copyright', language)}
      </p>
    </div>
  );
}