'use client'; // Indique que ce composant est un Client Component

import React from 'react';
import { useTheme } from '../../context/ThemeContext'; // Assurez-vous que ce chemin est correct
import { useLanguage } from '@/contexts/LanguageContext'; // Importez useLanguage
import { LanguageCode } from '@/types'; // Importez LanguageCode

// Définitions des traductions pour cette page "En cours de développement"
const allTranslations = {
  filesPageBeta: { // Section spécifique pour cette page simplifiée
    mainTitleLine1: {
      en: 'File System',
      fr: 'Système de Fichiers',
      mi: 'Pūnaha Kōnae',
      ga: 'Córas Comhad',
      hi: 'फ़ाइल सिस्टम',
      gd: 'Siostam Faidhlichean',
      'en-AU': 'File System', 'en-NZ': 'File System', 'en-CA': 'File System', 'fr-CA': 'Système de Fichiers', 'en-ZA': 'File System', af: 'Lêerstelsel'
    },
    mainTitleLine2: {
      en: '— Central Storage —',
      fr: '— Stockage Central —',
      mi: '— Rokiroki Matua —',
      ga: '— Stóráil Láir —',
      hi: '— केंद्रीय भंडारण —',
      gd: '— Stòradh Meadhanach —',
      'en-AU': '— Central Storage —', 'en-NZ': '— Central Storage —', 'en-CA': '— Central Storage —', 'fr-CA': '— Stockage Central —', 'en-ZA': '— Central Storage —', af: '— Sentrale Berging —'
    },
    subtitle: {
      en: '"Secure access to all operational documents and data archives."',
      fr: '"Accès sécurisé à tous les documents opérationnels et archives de données."',
      mi: '"Uru haumaru ki ngā tuhinga mahi katoa me ngā pūmahara raraunga."',
      ga: '"Rochtain shlán ar gach doiciméad oibríochtúil agus cartlann sonraí."',
      hi: '"सभी परिचालन दस्तावेजों और डेटा अभिलेखागार तक सुरक्षित पहुंच।"',
      gd: '"Faigh cothrom tèarainte air a h-uile sgrìobhainn obrachaidh agus tasglannan dàta."',
      'en-AU': '"Secure access to all operational documents and data archives."', 'en-NZ': '"Secure access to all operational documents and data archives."', 'en-CA': '"Secure access to all operational documents and data archives."', 'fr-CA': '"Accès sécurisé à tous les documents opérationnels et archives de données."', 'en-ZA': '"Secure access to all operational documents and data archives."', af: '"Veilige toegang tot alle operasionele dokumente en data-argiewe."'
    },
    developmentTitle: {
      en: 'Module Under Development',
      fr: 'Module en Cours de Développement',
      mi: 'Kōwae kei te Whakawhanake',
      ga: 'Modúl Faoi Fhorbairt',
      hi: 'मॉड्यूल विकास में है',
      gd: 'Modal fo Leasachadh',
      'en-AU': 'Module Under Development', 'en-NZ': 'Module Under Development', 'en-CA': 'Module Under Development', 'fr-CA': 'Module en Cours de Développement', 'en-ZA': 'Module Under Development', af: 'Module Onder Ontwikkeling'
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
      en: 'The Central File Management System is currently undergoing rigorous calibration and security enhancements. Full access will be available upon completion of final beta testing.',
      fr: 'Le système central de gestion des Fichiers est actuellement soumis à des calibrations rigoureuses et des améliorations de sécurité. L\'accès complet sera disponible après la finalisation des tests bêta finaux.',
      mi: 'Kei te haere tonu te Pūnaha Whakahaere Kōnae Matua i ngā tukanga whakatika kaha me ngā whakapainga haumarutanga. Ka wātea te uru katoa i muri i te oti o ngā whakamātautau beta whakamutunga.',
      ga: 'Tá an Córas Bainistíochta Comhad Láir faoi láthair ag dul faoi chalabrú docht agus feabhsúcháin slándála. Beidh rochtain iomlán ar fáil tar éis tástáil béite deiridh a chríochnú.',
      hi: 'केंद्रीय फ़ाइल प्रबंधन प्रणाली वर्तमान में कठोर अंशांकन और सुरक्षा वृद्धि प्रक्रियाओं से गुजर रही है। अंतिम बीटा परीक्षण के सफल समापन पर पूर्ण पहुंच उपलब्ध होगी।',
      gd: 'Tha an Siostam Riaghlaidh Faidhlichean Mheadhanach an-dràsta fo calibration teann agus leasachaidhean tèarainteachd. Bheirear làn chothrom nuair a bhios deuchainn beta deireannach deiseil.',
      'en-AU': 'The Central File Management System is currently undergoing rigorous calibration and security enhancements. Full access will be available upon completion of final beta testing.', 'en-NZ': 'The Central File Management System is currently undergoing rigorous calibration and security enhancements. Full access will be available upon completion of final beta testing.', 'en-CA': 'The Central File Management System is currently undergoing rigorous calibration and security enhancements. Full access will be available upon completion of final beta testing.', 'fr-CA': 'Le système central de gestion des Fichiers est actuellement soumis à des calibrations rigoureuses et des améliorations de sécurité. L\'accès complet sera disponible après la finalisation des tests bêta finaux.', 'en-ZA': 'The Central File Management System is currently undergoing rigorous calibration and security enhancements. Full access will be available upon completion of final beta testing.', af: 'Die Sentrale Lêerbestuurstelsel ondergaan tans streng kalibrasie en sekuriteitsverbeteringe. Volle toegang sal beskikbaar wees na voltooiing van finale beta-toetse.'
    },
    stayTuned: {
      en: 'Stay tuned for updates from Command.',
      fr: 'Restez à l\'écoute pour les mises à jour du Commandement.',
      mi: 'Kia mataara tonu mō ngā whakahōutanga mai i te Whakahau.',
      ga: 'Fan tiúnta le haghaidh nuashonruithe ón Ordú.',
      hi: 'कमांड से अपडेट के लिए बने रहें।',
      gd: 'Fuirichibh furachair airson ùrachaidhean bhon Àithne.',
      'en-AU': 'Stay tuned for updates from Command.', 'en-NZ': 'Stay tuned for updates from Command.', 'en-CA': 'Stay tuned for updates from Command.', 'fr-CA': 'Restez à l\'écoute pour les mises à jour du Commandement.', 'en-ZA': 'Stay tuned for updates from Command.', af: 'Bly ingeskakel vir opdaterings van die Bevel.'
    },
    copyright: {
      en: 'Kiwi-Ops – Secure File Systems.',
      fr: 'Kiwi-Ops – Systèmes de Fichiers Sécurisés.',
      mi: 'Kiwi-Ops – Ngā Pūnaha Kōnae Haumaru.',
      ga: 'Kiwi-Ops – Córais Chomhad Slána.',
      hi: 'कीवी-ऑप्स – सुरक्षित फ़ाइल सिस्टम।',
      gd: 'Kiwi-Ops – Siostaman Faidhlichean Tèarainte.',
      'en-AU': 'Kiwi-Ops – Secure File Systems.', 'en-NZ': 'Kiwi-Ops – Secure File Systems.', 'en-CA': 'Kiwi-Ops – Secure File Systems.', 'fr-CA': 'Kiwi-Ops – Systèmes de Fichiers Sécurisés.', 'en-ZA': 'Kiwi-Ops – Secure File Systems.', af: 'Kiwi-Ops – Veilige Lêerstelsels.'
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


export default function FilesPage() { // Renommée de ArchivesPage à FilesPage
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
        {getTranslation('filesPageBeta', 'mainTitleLine1', language)}<br />
        {getTranslation('filesPageBeta', 'mainTitleLine2', language)}
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
        {getTranslation('filesPageBeta', 'subtitle', language)}
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
          {getTranslation('filesPageBeta', 'developmentTitle', language)}
        </h2>
        <p style={{
          fontSize: '1.2rem',
          fontStyle: 'italic',
          color: mutedTextColor,
          maxWidth: '700px'
        }}>
          {getTranslation('filesPageBeta', 'developmentMessage', language)}
        </p>
        <p style={{
          fontSize: '1.1rem',
          marginTop: '1.5rem',
          fontWeight: 'bold',
          color: warningText
        }}>
          {getTranslation('filesPageBeta', 'betaTag', language)} – {getTranslation('filesPageBeta', 'stayTuned', language)}
        </p>
      </section>

      <p style={{ textAlign: 'center', marginTop: '4rem', fontSize: '0.8rem', color: mutedTextColor }}>
        © <span suppressHydrationWarning>{new Date().getFullYear()}</span> {getTranslation('filesPageBeta', 'copyright', language)}
      </p>
    </div>
  );
}