'use client'; // Indique que ce composant est un Client Component

import React from 'react';
import { useTheme } from '@/contexts/ThemeContext'; // Assurez-vous que ce chemin est correct
import { useLanguage } from '@/contexts/LanguageContext'; // Importez useLanguage
import { LanguageCode } from '@/types'; // Importez LanguageCode

// Définitions des traductions pour cette page BETA
const allTranslations = {
  privacyPolicyPageBeta: { // Section spécifique pour cette page simplifiée
    mainTitleLine1: {
      en: 'Privacy Protocol',
      fr: 'Protocole de Confidentialité',
      mi: 'Tikanga Muna',
      ga: 'Prótacal Príobháideachais',
      hi: 'गोपनीयता प्रोटोकॉल',
      gd: 'Protocol Dìomhaireachd',
      'en-AU': 'Privacy Protocol', 'en-NZ': 'Privacy Protocol', 'en-CA': 'Privacy Protocol', 'fr-CA': 'Protocole de Confidentialité', 'en-ZA': 'Privaatheidsprotokol', af: 'Privaatheidsprotokol'
    },
    mainTitleLine2: {
      en: '— Data Security —',
      fr: '— Sécurité des Données —',
      mi: '— Haumaru Raraunga —',
      ga: '— Slándáil Sonraí —',
      hi: '— डेटा सुरक्षा —',
      gd: '— Tèarainteachd Dàta —',
      'en-AU': '— Data Security —', 'en-NZ': '— Data Security —', 'en-CA': '— Data Security —', 'fr-CA': '— Sécurité des Données —', 'en-ZA': '— Data Veiligheid —', af: '— Data Veiligheid —'
    },
    subtitle: {
      en: '"Important directives on data handling and agent confidentiality."',
      fr: '"Directives importantes sur la gestion des données et la confidentialité des agents."',
      mi: '"Ngā aratohu nui mō te whakahaere raraunga me te muna āpiha."',
      ga: '"Treoracha tábhachtacha maidir le láimhseáil sonraí agus rúndacht gníomhairí."',
      hi: '"डेटा हैंडलिंग और एजेंट गोपनीयता पर महत्वपूर्ण निर्देश।"',
      gd: '"Stiùiridhean cudromach mu làimhseachadh dàta agus dìomhaireachd àidseant."',
      'en-AU': '"Important directives on data handling and agent confidentiality."', 'en-NZ': '"Important directives on data handling and agent confidentiality."', 'en-CA': '"Important directives on data handling and agent confidentiality."', 'fr-CA': '"Directives importantes sur la gestion des données et la confidentialité des agents."', 'en-ZA': '"Belangrike riglyne oor datahantering en agentvertroulikheid."', af: '"Belangrike riglyne oor datahantering en agentvertroulikheid."'
    },
    developmentTitle: {
      en: 'Privacy Protocol Under Review',
      fr: 'Protocole de Confidentialité en Cours de Révision',
      mi: 'Tikanga Muna kei te Arotake',
      ga: 'Prótacal Príobháideachais Faoi Athbhreithniú',
      hi: 'गोपनीयता प्रोटोकॉल समीक्षाधीन है',
      gd: 'Protocol Dìomhaireachd fo Ath-bhreithneachadh',
      'en-AU': 'Privacy Protocol Under Review', 'en-NZ': 'Privacy Protocol Under Review', 'en-CA': 'Privacy Protocol Under Review', 'fr-CA': 'Protocole de Confidentialité en Cours de Révision', 'en-ZA': 'Privaatheidsprotokol Onder Hersiening', af: 'Privaatheidsprotokol Onder Hersiening'
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
      en: 'The full Privacy Protocol is being rigorously updated to ensure compliance with global data protection standards and the latest operational security measures. Thank you for your understanding.',
      fr: 'Le Protocole de Confidentialité complet est en cours de mise à jour rigoureuse pour assurer la conformité avec les normes mondiales de protection des données et les dernières mesures de sécurité opérationnelle. Merci de votre compréhension.',
      mi: 'Kei te whakahōungia te Tikanga Muna katoa kia ū ai ki ngā paerewa tiaki raraunga o te ao, me ngā aratohu haumaru whakahaere hou. Ngā mihi ki a koe mō tō māramatanga.',
      ga: 'Tá an Prótacal Príobháideachais iomlán á nuashonrú go docht chun comhlíonadh le caighdeáin chosanta sonraí domhanda agus na bearta slándála oibríochtúla is déanaí a chinntiú. Go raibh maith agat as do thuiscint.',
      hi: 'वैश्विक डेटा संरक्षण मानकों और नवीनतम परिचालन सुरक्षा उपायों का अनुपालन सुनिश्चित करने के लिए पूर्ण गोपनीयता प्रोटोकॉल को कठोरता से अपडेट किया जा रहा है। आपकी समझ के लिए धन्यवाद।',
      gd: 'Thèid am Protocol Dìomhaireachd làn ùrachadh gu cruaidh gus dèanamh cinnteach gu bheil e a’ gèilleadh ri inbhean dìon dàta cruinneil agus na ceumannan tèarainteachd obrachaidh as ùire. Tapadh leibh airson ur tuigse.',
      'en-AU': 'The full Privacy Protocol is being rigorously updated to ensure compliance with global data protection standards and the latest operational security measures. Thank you for your understanding.', 'en-NZ': 'The full Privacy Protocol is being rigorously updated to ensure compliance with global data protection standards and the latest operational security measures. Thank you for your understanding.', 'en-CA': 'The full Privacy Protocol is being rigorously updated to ensure compliance with global data protection standards and the latest operational security measures. Thank you for your understanding.', 'fr-CA': 'Le Protocole de Confidentialité complet est en cours de mise à jour rigoureuse pour assurer la conformité avec les normes mondiales de protection des données et les dernières mesures de sécurité opérationnelle. Merci de votre compréhension.', 'en-ZA': 'Die volle Privaatheidsprotokol word tans streng bygewerk om voldoening aan globale databeskermingstandaarde en die nuutste operasionele veiligheidsmaatreëls te verseker. Dankie vir u begrip.', af: 'Die volle Privaatheidsprotokol word tans streng bygewerk om voldoening aan globale databeskermingstandaarde en die nuutste operasionele veiligheidsmaatreëls te verseker. Dankie vir u begrip.'
    },
    stayTuned: {
      en: 'Please check back soon for the updated protocol.',
      fr: 'Veuillez revenir bientôt pour le protocole mis à jour.',
      mi: 'Tēnā hoki mai anō kia wātea te tikanga whakahōutia.',
      ga: 'Fill ar ais go luath le haghaidh an phrótacail nuashonraithe.',
      hi: 'अद्यतन प्रोटोकॉल के लिए कृपया जल्द ही वापस देखें।',
      gd: 'Thig air ais a dh\'aithghearr airson a’ protocol ùraichte.',
      'en-AU': 'Please check back soon for the updated protocol.', 'en-NZ': 'Please check back soon for the updated protocol.', 'en-CA': 'Please check back soon for the updated protocol.', 'fr-CA': 'Veuillez revenir bientôt pour le protocole mis à jour.', 'en-ZA': 'Kom binnekort weer vir die bygewerkte protokol.', af: 'Kom binnekort weer vir die bygewerkte protokol.'
    },
    copyright: {
      en: 'Kiwi-Ops – Provisional Privacy Protocol.',
      fr: 'Kiwi-Ops – Protocole de Confidentialité Provisoire.',
      mi: 'Kiwi-Ops – Tikanga Muna Wāhanga.',
      ga: 'Kiwi-Ops – Prótacal Príobháideachais Sealadach.',
      hi: 'कीवी-ऑप्स – अनंतिम गोपनीयता प्रोटोकॉल।',
      gd: 'Kiwi-Ops – Protocol Dìomhaireachd Sealach.',
      'en-AU': 'Kiwi-Ops – Provisional Privacy Protocol.', 'en-NZ': 'Kiwi-Ops – Provisional Privacy Protocol.', 'en-CA': 'Kiwi-Ops – Provisional Privacy Protocol.', 'fr-CA': 'Kiwi-Ops – Protocole de Confidentialité Provisoire.', 'en-ZA': 'Kiwi-Ops – Voorlopige Privaatheidsprotokol.', af: 'Kiwi-Ops – Voorlopige Privaatheidsprotokol.'
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


export default function PrivacyPolicyPage() {
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
        {getTranslation('privacyPolicyPageBeta', 'mainTitleLine1', language)}<br />
        {getTranslation('privacyPolicyPageBeta', 'mainTitleLine2', language)}
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
        {getTranslation('privacyPolicyPageBeta', 'subtitle', language)}
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
          {getTranslation('privacyPolicyPageBeta', 'developmentTitle', language)}
        </h2>
        <p style={{
          fontSize: '1.2rem',
          fontStyle: 'italic',
          color: mutedTextColor,
          maxWidth: '700px'
        }}>
          {getTranslation('privacyPolicyPageBeta', 'developmentMessage', language)}
        </p>
        <p style={{
          fontSize: '1.1rem',
          marginTop: '1.5rem',
          fontWeight: 'bold',
          color: warningText
        }}>
          {getTranslation('privacyPolicyPageBeta', 'betaTag', language)} – {getTranslation('privacyPolicyPageBeta', 'stayTuned', language)}
        </p>
      </section>

      <p style={{ textAlign: 'center', marginTop: '4rem', fontSize: '0.8rem', color: mutedTextColor }}>
        © <span suppressHydrationWarning>{new Date().getFullYear()}</span> {getTranslation('privacyPolicyPageBeta', 'copyright', language)}
      </p>
    </div>
  );
}