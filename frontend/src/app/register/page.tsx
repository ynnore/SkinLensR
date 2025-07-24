'use client'; // Indique que ce composant est un Client Component

import React from 'react';
import { useTheme } from '@/contexts/ThemeContext'; // Assurez-vous que ce chemin est correct
import { useLanguage } from '@/contexts/LanguageContext'; // Importez useLanguage
import { LanguageCode } from '@/types'; // Importez LanguageCode

// Définitions des traductions pour cette page BETA (inscription/register)
const allTranslations = {
  registerPageBeta: { // Section spécifique pour cette page simplifiée (REGISTER)
    mainTitleLine1: {
      en: 'Registration Bureau',
      fr: 'Bureau d\'Inscription',
      mi: 'Tari Whakarēhita',
      ga: 'Biúró Clárúcháin',
      hi: 'पंजीकरण ब्यूरो',
      gd: 'Biùro Clàraidh',
      'en-AU': 'Registration Bureau', 'en-NZ': 'Registration Bureau', 'en-CA': 'Registration Bureau', 'fr-CA': 'Bureau d\'Inscription', 'en-ZA': 'Registrasiekantoor', af: 'Registrasiekantoor'
    },
    mainTitleLine2: {
      en: '— Enrollment Protocols —',
      fr: '— Protocoles d\'Enrôlement —',
      mi: '— Tikanga Whakarēhita —',
      ga: '— Prótacail Clárúcháin —',
      hi: '— नामांकन प्रोटोकॉल —',
      gd: '— Protocolan Clàraidh —',
      'en-AU': '— Enrollment Protocols —', 'en-NZ': '— Enrollment Protocols —', 'en-CA': '— Enrollment Protocols —', 'fr-CA': '— Protocoles d\'Enrôlement —', 'en-ZA': '— Inskrywing Protokolle —', af: '— Inskrywing Protokolle —'
    },
    subtitle: {
      en: '"Streamlined procedures for agent registration and onboarding."',
      fr: '"Procédures simplifiées pour l\'enregistrement et l\'intégration des agents."',
      mi: '"Ngā tukanga māmā mō te rēhita me te whakauru āpiha."',
      ga: '"Nósanna imeachta simplithe le haghaidh clárúcháin agus ionduchtú gníomhaire."',
      hi: '"एजेंट पंजीकरण और ऑनबोर्डिंग के लिए सुव्यवस्थित प्रक्रियाएं।"',
      gd: '"Modhan sìmplidhe airson clàradh agus tòiseachadh àidseant."',
      'en-AU': '"Streamlined procedures for agent registration and onboarding."', 'en-NZ': '"Streamlined procedures for agent registration and onboarding."', 'en-CA': '"Streamlined procedures for agent registration and onboarding."', 'fr-CA': '"Procédures simplifiées pour l\'enregistrement et l\'intégration des agents."', 'en-ZA': '"Vaartbelynde prosedures vir agentregistrasie en instap."', af: '"Vaartbelynde prosedures vir agentregistrasie en instap."'
    },
    developmentTitle: {
      en: 'Enrollment Module Under Development',
      fr: 'Module d\'Enrôlement en Cours de Développement',
      mi: 'Kōwae Whakarēhita kei te Whakawhanake',
      ga: 'Modúl Clárúcháin Faoi Fhorbairt',
      hi: 'नामांकन मॉड्यूल विकास में है',
      gd: 'Modal Clàraidh fo Leasachadh',
      'en-AU': 'Enrollment Module Under Development', 'en-NZ': 'Enrollment Module Under Development', 'en-CA': 'Enrollment Module Under Development', 'fr-CA': 'Module d\'Enrôlement en Cours de Développement', 'en-ZA': 'Inskrywingsmodule Onder Ontwikkeling', af: 'Inskrywingsmodule Onder Ontwikkeling'
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
      en: 'The agent enrollment and authentication protocols are being finalized for robust and secure onboarding. Full registration functionality will be available soon.',
      fr: 'Les protocoles d\'enrôlement et d\'authentification des agents sont en cours de finalisation pour une intégration robuste et sécurisée. La fonctionnalité d\'inscription complète sera bientôt disponible.',
      mi: 'Kei te whakatika ngā tikanga rēhita me te whakamana āpiha mō te whakauru kaha me te haumaru. Ka wātea kētia te mahi rēhita katoa.',
      ga: 'Tá na prótacail clárúcháin agus fíordheimhnithe gníomhaire á gcríochnú le haghaidh ionduchtú láidir slán. Beidh feidhmchlár clárúcháin iomlán ar fáil go luath.',
      hi: 'एजेंट नामांकन और प्रमाणीकरण प्रोटोकॉल मजबूत और सुरक्षित ऑनबोर्डिंग के लिए अंतिम रूप दिए जा रहे हैं। पूर्ण पंजीकरण कार्यक्षमता जल्द ही उपलब्ध होगी।',
      gd: 'Tha protocolan clàraidh is dearbhaidh àidseant gan cur gu crìch airson bòrd-obrach làidir is tèarainte. Bidh làn ghnìomhachd clàraidh ri fhaighinn a dh’aithghearr.',
      'en-AU': 'The agent enrollment and authentication protocols are being finalized for robust and secure onboarding. Full registration functionality will be available soon.', 'en-NZ': 'The agent enrollment and authentication protocols are being finalized for robust and secure onboarding. Full registration functionality will be available soon.', 'en-CA': 'The agent enrollment and authentication protocols are being finalized for robust and secure onboarding. Full registration functionality will be available soon.', 'fr-CA': 'Les protocoles d\'enrôlement et d\'authentification des agents sont en cours de finalisation pour une intégration robuste et sécurisée. La fonctionnalité d\'inscription complète sera bientôt disponible.', 'en-ZA': 'Die agentinskrywings- en verifikasieprotokolle word gefinaliseer vir robuuste en veilige instap. Volle registrasiefunksionaliteit sal binnekort beskikbaar wees.', af: 'Die agentinskrywings- en verifikasieprotokolle word gefinaliseer vir robuuste en veilige instap. Volle registrasiefunksionaliteit sal binnekort beskikbaar wees.'
    },
    stayTuned: {
      en: 'Please check back soon for full access.',
      fr: 'Veuillez revenir bientôt pour un accès complet.',
      mi: 'Tēnā hoki mai anō kia wātea te uru katoa.',
      ga: 'Fill ar ais go luath le haghaidh rochtain iomlán.',
      hi: 'पूर्ण पहुंच के लिए कृपया जल्द ही वापस देखें।',
      gd: 'Thig air ais a dh\'aithghearr airson làn chothrom.',
      'en-AU': 'Please check back soon for full access.', 'en-NZ': 'Please check back soon for full access.', 'en-CA': 'Please check back soon for full access.', 'fr-CA': 'Veuillez revenir bientôt pour un accès complet.', 'en-ZA': 'Kom binnekort weer vir volle toegang.', af: 'Kom binnekort weer vir volle toegang.'
    },
    copyright: {
      en: 'Kiwi-Ops – Provisional Enrollment Protocol.',
      fr: 'Kiwi-Ops – Protocole d\'Enrôlement Provisoire.',
      mi: 'Kiwi-Ops – Tikanga Whakarēhita Wāhanga.',
      ga: 'Kiwi-Ops – Prótacal Clárúcháin Sealadach.',
      hi: 'कीवी-ऑप्स – अनंतिम नामांकन प्रोटोकॉल।',
      gd: 'Kiwi-Ops – Protocol Clàraidh Sealach.',
      'en-AU': 'Kiwi-Ops – Provisional Enrollment Protocol.', 'en-NZ': 'Kiwi-Ops – Provisional Enrollment Protocol.', 'en-CA': 'Kiwi-Ops – Provisional Enrollment Protocol.', 'fr-CA': 'Kiwi-Ops – Protocole d\'Enrôlement Provisoire.', 'en-ZA': 'Kiwi-Ops – Voorlopige Inskrywing Protokol.', af: 'Kiwi-Ops – Voorlopige Inskrywing Protokol.'
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


export default function RegisterPage() { // Le nom du composant reste RegisterPage
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
        {getTranslation('registerPageBeta', 'mainTitleLine1', language)}<br />
        {getTranslation('registerPageBeta', 'mainTitleLine2', language)}
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
        {getTranslation('registerPageBeta', 'subtitle', language)}
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
          {getTranslation('registerPageBeta', 'developmentTitle', language)}
        </h2>
        <p style={{
          fontSize: '1.2rem',
          fontStyle: 'italic',
          color: mutedTextColor,
          maxWidth: '700px'
        }}>
          {getTranslation('registerPageBeta', 'developmentMessage', language)}
        </p>
        <p style={{
          fontSize: '1.1rem',
          marginTop: '1.5rem',
          fontWeight: 'bold',
          color: warningText
        }}>
          {getTranslation('registerPageBeta', 'betaTag', language)} – {getTranslation('registerPageBeta', 'stayTuned', language)}
        </p>
      </section>

      <p style={{ textAlign: 'center', marginTop: '4rem', fontSize: '0.8rem', color: mutedTextColor }}>
        © <span suppressHydrationWarning>{new Date().getFullYear()}</span> {getTranslation('registerPageBeta', 'copyright', language)}
      </p>
    </div>
  );
}