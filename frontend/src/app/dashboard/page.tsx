'use client'; // Indique que ce composant est un Client Component

import React from 'react';
import { useTheme } from '@/contexts/ThemeContext'; // Assurez-vous que ce chemin est correct
import { useLanguage } from '@/contexts/LanguageContext'; // Assurez-vous que ce chemin est correct
import { LanguageCode } from '@/types';

// Définitions des traductions pour cette page
const allTranslations = {
  dashboardPage: {
    mainTitle: {
      en: 'COMMAND CENTER',
      fr: 'ÉTAT-MAJOR',
      mi: 'Whare Matua Whakahaere',
      ga: 'Lárionad Ordaithe',
      hi: 'कमांड सेंटर',
      gd: 'Ionad Command',
      'en-AU': 'Command Center', 'en-NZ': 'Command Center', 'en-CA': 'Command Center', 'fr-CA': 'Centre de Commandement', 'en-ZA': 'Command Center', af: 'Bevelsentrum'
    },
    subtitle: {
      en: '"Synthesis of operations and key intelligence in real-time."',
      fr: '"Synthèse des opérations et renseignements importants en temps réel."',
      mi: '"Whakarāpopototanga o ngā mahi me ngā mōhiohio matua i te wā tūturu."',
      ga: '"Sintéis oibríochtaí agus faisnéise ríthábhachtach i bhfíor-am."',
      hi: '"ऑपरेशंस और महत्वपूर्ण खुफिया जानकारी का वास्तविक समय में संश्लेषण।"',
      gd: '"Co-chur gnìomhachdan agus fiosrachaidh cudromach ann an tìm fìor."',
      'en-AU': '"Synthesis of operations and key intelligence in real-time."', 'en-NZ': '"Synthesis of operations and key intelligence in real-time."', 'en-CA': '"Synthesis of operations and key intelligence in real-time."', 'fr-CA': '"Synthèse des opérations et renseignements importants en temps réel."', 'en-ZA': '"Synthesis of operations and key intelligence in reële tyd."', af: '"Sintese van operasies en sleutelinligting in reële tyd."'
    },
    accessTitle: {
      en: 'Dashboard Access',
      fr: 'Accès au Tableau de Bord',
      mi: 'Whakaaetanga Papapātuhi',
      ga: 'Rochtain ar an bPainéal',
      hi: 'डैशबोर्ड एक्सेस',
      gd: 'Ruigsinneachd Deas-bhòrd',
      'en-AU': 'Dashboard Access', 'en-NZ': 'Dashboard Access', 'en-CA': 'Dashboard Access', 'fr-CA': 'Accès au Tableau de Bord', 'en-ZA': 'Dashboard Access', af: 'Dashboard Toegang'
    },
    developmentMessage: {
      en: 'Content area for dashboard widgets. Operational visualization and strategic data presentation systems are currently being calibrated and deployed.',
      fr: 'Zone de contenu pour les widgets du tableau de bord. Les systèmes de visualisation des opérations et de présentation des données stratégiques sont en cours de calibrage et de déploiement.',
      mi: 'Wāhi ihirangi mō ngā widget papapātuhi. Kei te whakatika me te tūhura ngā pūnaha tirohanga mahi me te whakaaturanga raraunga rautaki.',
      ga: 'Limistéar ábhair do ghiuirléidí painéil. Tá córais amhairc oibríochtúla agus cur i láthair sonraí straitéiseacha á gcalabrú agus á n-imscaradh faoi láthair.',
      hi: 'डैशबोर्ड विजेट के लिए सामग्री क्षेत्र। परिचालन विज़ुअलाइज़ेशन और रणनीतिक डेटा प्रस्तुति प्रणाली वर्तमान में कैलिब्रेट और तैनात की जा रही हैं।',
      gd: 'Sgìre susbainn airson widgetan deas-bhòrd. Tha siostaman lèirsinneachd obrachaidh agus taisbeanaidh dàta ro-innleachdail gan calpachadh agus gan cleachdadh an-dràsta.',
      'en-AU': 'Content area for dashboard widgets. Operational visualization and strategic data presentation systems are currently being calibrated and deployed.', 'en-NZ': 'Content area for dashboard widgets. Operational visualization and strategic data presentation systems are currently being calibrated and deployed.', 'en-CA': 'Content area for dashboard widgets. Operational visualization and strategic data presentation systems are currently being calibrated and deployed.', 'fr-CA': 'Zone de contenu pour les widgets du tableau de bord. Les systèmes de visualisation des opérations et de présentation des données stratégiques sont en cours de calibrage et de déploiement.', 'en-ZA': 'Content area for dashboard widgets. Operational visualization and strategic data presentation systems are currently being calibrated and deployed.', af: 'Inhoudsarea vir dashboard-widgets. Operasionele visualisering en strategiese data-aanbiedingstelsels word tans gekalibreer en ontplooi.'
    },
    stayAlertMessage: {
      en: 'Please stay alert for upcoming Command updates.',
      fr: 'Veuillez rester en alerte pour les prochaines mises à jour du Commandement.',
      mi: 'Tēnā koa kia mataara tonu mō ngā whakahōutanga o te Whare Matua.',
      ga: 'Fan go haireach do nuashonruithe ón Ordú amach romhaint.',
      hi: 'कृपया कमांड के आगामी अपडेट के लिए सतर्क रहें।',
      gd: 'Fuirichibh furachair airson ùrachaidhean Co-mhandaidh a tha ri thighinn.',
      'en-AU': 'Please stay alert for upcoming Command updates.', 'en-NZ': 'Please stay alert for upcoming Command updates.', 'en-CA': 'Please stay alert for upcoming Command updates.', 'fr-CA': 'Veuillez rester en alerte pour les prochaines mises à jour du Commandement.', 'en-ZA': 'Please stay alert for upcoming Command updates.', af: 'Bly asseblief waaksaam vir opkomende Kommandoupdates.'
    },
    copyright: {
      en: 'Kiwi-Ops – Unified Command System.',
      fr: 'Kiwi-Ops – Système du Commandement Unifié.',
      mi: 'Kiwi-Ops – Pūnaha Whakahau Kotahi.',
      ga: 'Kiwi-Ops – Córas Aontaithe Ordaithe.',
      hi: 'कीवी-ऑप्स – एकीकृत कमांड सिस्टम।',
      gd: 'Kiwi-Ops – Siostam Òrdughan Aonaichte.',
      'en-AU': 'Kiwi-Ops – Unified Command System.', 'en-NZ': 'Kiwi-Ops – Unified Command System.', 'en-CA': 'Kiwi-Ops – Unified Command System.', 'fr-CA': 'Kiwi-Ops – Système du Commandement Unifié.', 'en-ZA': 'Kiwi-Ops – Unified Command System.', af: 'Kiwi-Ops – Eenheidskommando Stelsel.'
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
  if (!sectionTranslations) return `[Missing Section: ${String(section)}]`;
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

  // Ajoutez ce log pour voir la valeur de 'language' à chaque rendu
  console.log('DashboardPage est rendu. Langue actuelle:', language);

  // Définissez les couleurs en fonction du thème, cohérentes avec le style "super agent"
  const textColor = theme === 'dark' ? '#E0E0E0' : '#333333';
  const mutedTextColor = theme === 'dark' ? '#A0A0A0' : '#666666';
  const borderColor = theme === 'dark' ? '#555555' : '#AAAAAA';
  const backgroundColor = theme === 'dark' ? '#1A1A2E' : '#FFFFFF'; // Fond blanc pour le mode clair du tableau de bord
  const warningColor = theme === 'dark' ? '#FFCACA' : '#CC0000'; // Rouge pour l'alerte de développement

  return (
    <div style={{
      padding: '2rem',
      maxWidth: '1200px', // Largeur plus grande pour un tableau de bord
      margin: '0 auto',
      lineHeight: '1.6',
      fontSize: '1rem',
      color: textColor,
      fontFamily: "'Arial', sans-serif", // Police moderne pour un tableau de bord
      backgroundColor: backgroundColor,
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start', // Aligner le contenu en haut
    }}>
      <h1 style={{
        marginBottom: '1rem',
        fontSize: '3.8rem', // Plus grand pour le titre principal
        textAlign: 'center',
        fontWeight: 'bold',
        fontFamily: "'Playfair Display', serif", // Police pour les titres très visibles
        textTransform: 'uppercase',
        letterSpacing: '3px', // Plus d'espacement pour l'impact
        color: textColor,
        textShadow: `3px 3px 0px ${theme === 'dark' ? 'rgba(0,0,0,0.6)' : 'rgba(150,150,150,0.4)'}`
      }}>
        {getTranslation('dashboardPage', 'mainTitle', language)}
      </h1>
      <p style={{
        fontStyle: 'italic',
        marginBottom: '3rem',
        textAlign: 'center',
        color: mutedTextColor,
        fontSize: '1.2rem',
        maxWidth: '80%', // Limite la largeur du sous-titre
        borderBottom: `1px solid ${borderColor}`, // Une petite ligne sous le sous-titre
        paddingBottom: '1rem'
      }}>
        {getTranslation('dashboardPage', 'subtitle', language)}
      </p>

      {/* Zone de contenu pour les widgets - Message de développement */}
      <section style={{
        width: '100%',
        marginTop: '3rem',
        padding: '2rem',
        border: `2px dashed ${warningColor}`, // Bordure dash pour signaler le "en cours"
        borderRadius: '8px',
        backgroundColor: theme === 'dark' ? '#3A2A2A' : '#FFF3F3', // Fond léger pour l'alerte
        color: warningColor,
        textAlign: 'center',
        boxShadow: `4px 4px 0px ${theme === 'dark' ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.15)'}`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '200px', // Hauteur minimale pour que la zone soit visible
      }}>
        <h2 style={{
          fontSize: '2rem',
          marginBottom: '1rem',
          color: warningColor,
          fontFamily: "'Playfair Display', serif",
          fontWeight: 'bold',
          textTransform: 'uppercase'
        }}>
          {getTranslation('dashboardPage', 'accessTitle', language)}
        </h2>
        <p style={{
          fontSize: '1.2rem',
          fontStyle: 'italic',
          color: mutedTextColor, // Utiliser mutedTextColor pour le texte de l'alerte
          maxWidth: '700px'
        }}>
          {getTranslation('dashboardPage', 'developmentMessage', language)}
        </p>
        <p style={{
          fontSize: '1.1rem',
          marginTop: '1.5rem',
          fontWeight: 'bold',
          color: warningColor // Revenir au rouge pour l'appel à l'action/message principal
        }}>
          {getTranslation('dashboardPage', 'stayAlertMessage', language)}
        </p>
        {/* Vous pouvez ajouter un spinner ou une icône ici si vous le souhaitez */}
      </section>

      {/* Future Zone des Widgets Réels (masquée pour l'instant) */}
      {/*
      <section style={{
        width: '100%',
        marginTop: '3rem',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', // Grille responsive pour les widgets
        gap: '2rem',
      }}>
        <div style={{
          border: `1px solid ${borderColor}`,
          borderRadius: '5px',
          padding: '1.5rem',
          backgroundColor: theme === 'dark' ? '#2A2A3A' : '#F8F8F8',
          boxShadow: `3px 3px 0px ${theme === 'dark' ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.1)'}`,
          color: textColor,
        }}>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: textColor }}>Widget 1: Résumé des Missions</h3>
          <p>Données clés des missions récentes...</p>
        </div>
        <div style={{
          border: `1px solid ${borderColor}`,
          borderRadius: '5px',
          padding: '1.5rem',
          backgroundColor: theme === 'dark' ? '#2A2A3A' : '#F8F8F8',
          boxShadow: `3px 3px 0px ${theme === 'dark' ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.1)'}`,
          color: textColor,
        }}>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: textColor }}>Widget 2: Alertes Critiques</h3>
          <p>Liste des alertes en temps réel...</p>
        </div>
        {/* ... d'autres widgets ... }
      </section>
      */}

      <p style={{ textAlign: 'center', marginTop: '4rem', fontSize: '0.8rem', color: mutedTextColor }}>
        © <span suppressHydrationWarning>{new Date().getFullYear()}</span> {getTranslation('dashboardPage', 'copyright', language)}
      </p>

      {/* Paragraphe temporaire pour afficher la langue du contexte, à retirer une fois résolu */}
      <p style={{
        marginTop: '2rem',
        fontSize: '1.5rem',
        fontWeight: 'bold',
        color: 'blue', // Pour qu'il soit bien visible
        textAlign: 'center'
      }}>
        
      </p>
    </div>
  );
}