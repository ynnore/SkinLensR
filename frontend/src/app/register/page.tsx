'use client'; // Indique que ce composant est un Client Component

import React from 'react';
import { useTheme } from '../../context/ThemeContext'; // Assurez-vous que ce chemin est correct
import { useLanguage } from '@/contexts/LanguageContext'; // Importez useLanguage
import { LanguageCode } from '@/types'; // Importez LanguageCode

// Définitions des traductions pour cette page BETA
const allTranslations = {
  dashboardPageBeta: { // Section spécifique pour cette page simplifiée
    mainTitleLine1: {
      en: 'Command Center',
      fr: 'ÉTAT-MAJOR',
      mi: 'Whare Matua Whakahaere',
      ga: 'Lárionad Ordaithe',
      hi: 'कमांड सेंटर',
      gd: 'Ionad Command',
      'en-AU': 'Command Center', 'en-NZ': 'Command Center', 'en-CA': 'Command Center', 'fr-CA': 'Centre de Commandement', 'en-ZA': 'Command Center', af: 'Bevelsentrum'
    },
    mainTitleLine2: {
      en: '— Operational Overview —',
      fr: '— Aperçu Opérationnel —',
      mi: '— Tirohanga Mahi —',
      ga: '— Forbhreathnú Oibríochtúil —',
      hi: '— परिचालन अवलोकन —',
      gd: '— Sealladh Obrachaidh —',
      'en-AU': '— Operational Overview —', 'en-NZ': '— Operational Overview —', 'en-CA': '— Operational Overview —', 'fr-CA': '— Aperçu Opérationnel —', 'en-ZA': '— Operasionele Oorsig —', af: '— Operasionele Oorsig —'
    },
    subtitle: {
      en: '"Synthesis of operations and key intelligence in real-time."',
      fr: '"Synthèse des opérations et renseignements importants en temps réel."',
      mi: '"Whakarāpopototanga o ngā mahi me ngā mōhiohio matua i te wā tūturu."',
      ga: '"Sintéis oibríochtaí agus faisnéise ríthábhachtaí i bhfíor-am."',
      hi: '"ऑपरेशंस और महत्वपूर्ण खुफिया जानकारी का वास्तविक समय में संश्लेषण।"',
      gd: '"Co-chur gnìomhachdan agus fiosrachaidh cudromach ann an tìm fìor."',
      'en-AU': '"Synthesis of operations and key intelligence in real-time."', 'en-NZ': '"Synthesis of operations and key intelligence in real-time."', 'en-CA': '"Synthesis of operations and key intelligence in real-time."', 'fr-CA': '"Synthèse des opérations et renseignements importants en temps réel."', 'en-ZA': '"Sintese van operasies en sleutelinligting in reële tyd."', af: '"Sintese van operasies en sleutelinligting in reële tyd."'
    },
    developmentTitle: {
      en: 'Dashboard Under Development',
      fr: 'Tableau de Bord en Cours de Développement',
      mi: 'Papapātuhi kei te Whakawhanake',
      ga: 'Painéal Faoi Fhorbairt',
      hi: 'डैशबोर्ड विकास में है',
      gd: 'Deas-bhòrd fo Leasachadh',
      'en-AU': 'Dashboard Under Development', 'en-NZ': 'Dashboard Under Development', 'en-CA': 'Dashboard Under Development', 'fr-CA': 'Tableau de Bord en Cours de Développement', 'en-ZA': 'Dashboard Onder Ontwikkeling', af: 'Dashboard Onder Ontwikkeling'
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
      en: 'The operational visualization and strategic data presentation systems are currently undergoing critical calibration and deployment. Please stay alert for upcoming Command updates.',
      fr: 'Les systèmes de visualisation des opérations et de présentation des données stratégiques sont actuellement en phase de calibrage critique et de déploiement. Veuillez rester en alerte pour les prochaines mises à jour du Commandement.',
      mi: 'Kei te whakatika me te tūhura ngā pūnaha tirohanga mahi me te whakaaturanga raraunga rautaki. Tēnā koa kia mataara tonu mō ngā whakahōutanga o te Whakahau.',
      ga: 'Tá córais amhairc oibríochtúla agus cur i láthair sonraí straitéiseacha á gcalabrú agus á n-imscaradh faoi láthair. Fan go haireach do nuashonruithe ón Ordú amach romhainn.',
      hi: 'परिचालन विज़ुअलाइज़ेशन और रणनीतिक डेटा प्रस्तुति प्रणाली वर्तमान में महत्वपूर्ण अंशांकन और तैनाती के चरण में हैं। कृपया कमांड के आगामी अपडेट के लिए सतर्क रहें।',
      gd: 'Tha siostaman lèirsinneachd obrachaidh agus taisbeanaidh dàta ro-innleachdail gan calpachadh agus gan cleachdadh an-dràsta. Fuirichibh furachair airson ùrachaidhean Co-mhandaidh a tha ri thighinn.',
      'en-AU': 'The operational visualization and strategic data presentation systems are currently undergoing critical calibration and deployment. Please stay alert for upcoming Command updates.', 'en-NZ': 'The operational visualization and strategic data presentation systems are currently undergoing critical calibration and deployment. Please stay alert for upcoming Command updates.', 'en-CA': 'The operational visualization and strategic data presentation systems are currently undergoing critical calibration and deployment. Please stay alert for upcoming Command updates.', 'fr-CA': 'Les systèmes de visualisation des opérations et de présentation des données stratégiques sont actuellement en phase de calibrage critique et de déploiement. Veuillez rester en alerte pour les prochaines mises à jour du Commandement.', 'en-ZA': 'Die operasionele visualisering en strategiese data-aanbiedingstelsels word tans gekalibreer en ontplooi. Bly asseblief waaksaam vir opkomende Kommandoupdates.', af: 'Die operasionele visualisering en strategiese data-aanbiedingstelsels word tans gekalibreer en ontplooi. Bly asseblief waaksaam vir opkomende Kommandoupdates.'
    },
    copyright: {
      en: 'Kiwi-Ops – Provisional Dashboard Protocol.',
      fr: 'Kiwi-Ops – Protocole de Tableau de Bord Provisoire.',
      mi: 'Kiwi-Ops – Tikanga Papapātuhi Wāhanga.',
      ga: 'Kiwi-Ops – Prótacal Painéil Sealadach.',
      hi: 'कीवी-ऑप्स – अनंतिम डैशबोर्ड प्रोटोकॉल।',
      gd: 'Kiwi-Ops – Protocol Deas-bhòrd Sealach.',
      'en-AU': 'Kiwi-Ops – Provisional Dashboard Protocol.', 'en-NZ': 'Kiwi-Ops – Provisional Dashboard Protocol.', 'en-CA': 'Kiwi-Ops – Provisional Dashboard Protocol.', 'fr-CA': 'Kiwi-Ops – Protocole de Tableau de Bord Provisoire.', 'en-ZA': 'Kiwi-Ops – Voorlopige Dashboard Protokol.', af: 'Kiwi-Ops – Voorlopige Dashboard Protokol.'
    },
  },
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


export default function DashboardPage() {
  const { theme } = useTheme();
  const { language } = useLanguage(); // Obtenez la langue courante

  // Définissez les couleurs en fonction du thème, cohérentes avec le style "super agent"
  const textColor = theme === 'dark' ? '#E0E0E0' : '#333333';
  const mutedTextColor = theme === 'dark' ? '#A0A0A0' : '#666666';
  const borderColor = theme === 'dark' ? '#555555' : '#AAAAAA';
  const backgroundColorPage = theme === 'dark' ? '#1A1A2E' : '#FFFFFF'; // Fond blanc pour le mode clair
  const sectionBgColor = theme === 'dark' ? '#2A2A3A' : '#F8F8F8'; // Fond des sections/cartes (pour la carte de développement)
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
        {getTranslation('dashboardPageBeta', 'mainTitleLine1', language)}<br />
        {getTranslation('dashboardPageBeta', 'mainTitleLine2', language)}
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
        {getTranslation('dashboardPageBeta', 'subtitle', language)}
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
          {getTranslation('dashboardPageBeta', 'developmentTitle', language)}
        </h2>
        <p style={{
          fontSize: '1.2rem',
          fontStyle: 'italic',
          color: mutedTextColor,
          maxWidth: '700px'
        }}>
          {getTranslation('dashboardPageBeta', 'developmentMessage', language)}
        </p>
        <p style={{
          fontSize: '1.1rem',
          marginTop: '1.5rem',
          fontWeight: 'bold',
          color: warningText
        }}>
          {getTranslation('dashboardPageBeta', 'betaTag', language)} – {getTranslation('dashboardPageBeta', 'stayTuned', language)}
        </p>
      </section>

      <p style={{ textAlign: 'center', marginTop: '4rem', fontSize: '0.8rem', color: mutedTextColor }}>
        © <span suppressHydrationWarning>{new Date().getFullYear()}</span> {getTranslation('dashboardPageBeta', 'copyright', language)}
      </p>
    </div>
  );
}