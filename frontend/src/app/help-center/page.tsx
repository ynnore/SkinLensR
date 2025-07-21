'use client'; // Indique que ce composant est un Client Component

import React from 'react';
import { useTheme } from '../../context/ThemeContext'; // Assurez-vous que ce chemin est correct
import { useLanguage } from '@/contexts/LanguageContext'; // Importez useLanguage
import { LanguageCode } from '@/types'; // Importez LanguageCode

// Définitions des traductions pour cette page BETA
const allTranslations = {
  helpCenterPageBeta: { // Section spécifique pour cette page simplifiée
    mainTitleLine1: {
      en: 'Assistance Protocol',
      fr: 'Protocole d\'Assistance',
      mi: 'Tikanga Tautoko',
      ga: 'Prótacal Cúnaimh',
      hi: 'सहायता प्रोटोकॉल',
      gd: 'Protocol Taic',
      'en-AU': 'Assistance Protocol', 'en-NZ': 'Assistance Protocol', 'en-CA': 'Assistance Protocol', 'fr-CA': 'Protocole d\'Assistance', 'en-ZA': 'Bystand Protokol', af: 'Bystand Protokol'
    },
    mainTitleLine2: {
      en: '— Help Center —',
      fr: '— Centre d\'Aide —',
      mi: '— Pokapū Āwhina —',
      ga: '— Ionad Cabhrach —',
      hi: '— सहायता केंद्र —',
      gd: '— Ionad Cobhair —',
      'en-AU': '— Help Center —', 'en-NZ': '— Help Center —', 'en-CA': '— Help Center —', 'fr-CA': '— Centre d\'Aide —', 'en-ZA': '— Hulpsentrum —', af: '— Hulpsentrum —'
    },
    subtitle: {
      en: '"Your guide to operational support and resources."',
      fr: '"Votre guide pour le support opérationnel et les ressources."',
      mi: '"Tō aratohu mō te tautoko mahi me ngā rawa."',
      ga: '"Do threoir chun tacaíocht oibríochtúil agus acmhainní."',
      hi: '"परिचालन सहायता और संसाधनों के लिए आपका मार्गदर्शक।"',
      gd: '"Do stiùireadh gu taic is goireasan obrachaidh."',
      'en-AU': '"Your guide to operational support and resources."', 'en-NZ': '"Your guide to operational support and resources."', 'en-CA': '"Your guide to operational support and resources."', 'fr-CA': '"Votre guide pour le support opérationnel et les ressources."', 'en-ZA': '"U gids vir operasionele ondersteuning en hulpbronne."', af: '"U gids vir operasionele ondersteuning en hulpbronne."'
    },
    developmentTitle: {
      en: 'Help Center Under Construction',
      fr: 'Centre d\'Aide en Construction',
      mi: 'Pokapū Āwhina kei te Hangahanga',
      ga: 'Ionad Cabhrach Faoi Thógáil',
      hi: 'सहायता केंद्र निर्माणाधीन है',
      gd: 'Ionad Cobhair fo Thogail',
      'en-AU': 'Help Center Under Construction', 'en-NZ': 'Help Center Under Construction', 'en-CA': 'Help Center Under Construction', 'fr-CA': 'Centre d\'Aide en Construction', 'en-ZA': 'Hulpsentrum Onder Konstruksie', af: 'Hulpsentrum Onder Konstruksie'
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
      en: 'The comprehensive Help Center and support documentation are currently being compiled and optimized for launch. Your patience is appreciated.',
      fr: 'Le Centre d\'Aide complet et la documentation de support sont actuellement compilés et optimisés pour le lancement. Votre patience est appréciée.',
      mi: 'Kei te whakahōungia te Pokapū Āwhina katoa me ngā tuhinga tautoko mō te whakarewatanga. Ka nui te mihi mō tō manawanui.',
      ga: 'Tá an tIonad Cabhrach cuimsitheach agus an doiciméadú tacaíochta á dtiomsú agus á n-uasmhéadú le haghaidh seolta. Táimid buíoch as d\'fhoighne.',
      hi: 'व्यापक सहायता केंद्र और समर्थन दस्तावेज वर्तमान में संकलित और लॉन्च के लिए अनुकूलित किए जा रहे हैं। आपके धैर्य की सराहना की जाती है।',
      gd: 'Tha an t-Ionad Cobhair farsaing agus an sgrìobhainnean taic gan cur ri chèile agus gan ùrachadh airson cur air bhog. Tha sinn a’ cur luach air ur foighidinn.',
      'en-AU': 'The comprehensive Help Center and support documentation are currently being compiled and optimized for launch. Your patience is appreciated.', 'en-NZ': 'The comprehensive Help Center and support documentation are currently being compiled and optimized for launch. Your patience is appreciated.', 'en-CA': 'The comprehensive Help Center and support documentation are currently being compiled and optimized for launch. Your patience is appreciated.', 'fr-CA': 'Le Centre d\'Aide complet et la documentation de support sont actuellement compilés et optimisés pour le lancement. Votre patience est appréciée.', 'en-ZA': 'Die omvattende Hulpsentrum en ondersteuningsdokumentasie word tans saamgestel en geoptimaliseer vir bekendstelling. U geduld word op prys gestel.', af: 'Die omvattende Hulpsentrum en ondersteuningsdokumentasie word tans saamgestel en geoptimaliseer vir bekendstelling. U geduld word op prys gestel.'
    },
    stayTuned: {
      en: 'Check back soon for full access.',
      fr: 'Revenez bientôt pour un accès complet.',
      mi: 'Tēnā hoki mai anō kia wātea te uru katoa.',
      ga: 'Fill ar ais go luath le haghaidh rochtain iomlán.',
      hi: 'पूर्ण पहुंच के लिए जल्द ही वापस जांचें।',
      gd: 'Thig air ais a dh\'aithghearr airson làn chothrom.',
      'en-AU': 'Check back soon for full access.', 'en-NZ': 'Check back soon for full access.', 'en-CA': 'Check back soon for full access.', 'fr-CA': 'Revenez bientôt pour un accès complet.', 'en-ZA': 'Kom binnekort weer vir volle toegang.', af: 'Kom binnekort weer vir volle toegang.'
    },
    copyright: {
      en: 'Kiwi-Ops – Provisional Help Protocol.',
      fr: 'Kiwi-Ops – Protocole d\'Aide Provisoire.',
      mi: 'Kiwi-Ops – Tikanga Tautoko Wāhanga.',
      ga: 'Kiwi-Ops – Prótacal Cabhrach Sealadach.',
      hi: 'कीवी-ऑप्स – अनंतिम सहायता प्रोटोकॉल।',
      gd: 'Kiwi-Ops – Protocol Cobhair Sealach.',
      'en-AU': 'Kiwi-Ops – Provisional Help Protocol.', 'en-NZ': 'Kiwi-Ops – Provisional Help Protocol.', 'en-CA': 'Kiwi-Ops – Provisional Help Protocol.', 'fr-CA': 'Kiwi-Ops – Protocole d\'Aide Provisoire.', 'en-ZA': 'Kiwi-Ops – Voorlopige Hulp Protokol.', af: 'Kiwi-Ops – Voorlopige Hulp Protokol.'
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


export default function HelpCenterPage() {
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
        {getTranslation('helpCenterPageBeta', 'mainTitleLine1', language)}<br />
        {getTranslation('helpCenterPageBeta', 'mainTitleLine2', language)}
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
        {getTranslation('helpCenterPageBeta', 'subtitle', language)}
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
          {getTranslation('helpCenterPageBeta', 'developmentTitle', language)}
        </h2>
        <p style={{
          fontSize: '1.2rem',
          fontStyle: 'italic',
          color: mutedTextColor,
          maxWidth: '700px'
        }}>
          {getTranslation('helpCenterPageBeta', 'developmentMessage', language)}
        </p>
        <p style={{
          fontSize: '1.1rem',
          marginTop: '1.5rem',
          fontWeight: 'bold',
          color: warningText
        }}>
          {getTranslation('helpCenterPageBeta', 'betaTag', language)} – {getTranslation('helpCenterPageBeta', 'stayTuned', language)}
        </p>
      </section>

      <p style={{ textAlign: 'center', marginTop: '4rem', fontSize: '0.8rem', color: mutedTextColor }}>
        © <span suppressHydrationWarning>{new Date().getFullYear()}</span> {getTranslation('helpCenterPageBeta', 'copyright', language)}
      </p>
    </div>
  );
}