'use client'; // Indique que ce composant est un Client Component

import React, { useState, useRef } from 'react'; // Ajout de useState et useRef
import { useTheme } from '@/contexts/ThemeContext'; // Assurez-vous que ce chemin est correct
import { useLanguage } from '@/contexts/LanguageContext'; // Assurez-vous que ce chemin est correct
import { LanguageCode } from '@/types';
import Papa from 'papaparse'; // Importer papaparse pour le CSV

// Définitions des traductions pour cette page (inchangées)
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
    fileUploadLabel: {
      en: 'Import Data (CSV Format)',
      fr: 'Importer des Données (Format CSV)',
      mi: 'Kawemai Raraunga (CSV Puka)',
      ga: 'Iompórtáil Sonraí (Formáid CSV)',
      hi: 'डेटा आयात करें (CSV प्रारूप)',
      gd: 'In-phortail Dàta (Cruth CSV)',
      'en-AU': 'Import Data (CSV Format)', 'en-NZ': 'Import Data (CSV Format)', 'en-CA': 'Import Data (CSV Format)', 'fr-CA': 'Importer des Données (Format CSV)', 'en-ZA': 'Data Invoer (CSV Formaat)', af: 'Data Invoer (CSV Formaat)'
    },
    uploadButton: {
      en: 'Choose File',
      fr: 'Choisir le Fichier',
      mi: 'Tīpakohia te Kōnae',
      ga: 'Roghnaigh Comhad',
      hi: 'फ़ाइल चुनें',
      gd: 'Tagh am Faidhle',
      'en-AU': 'Choose File', 'en-NZ': 'Choose File', 'en-CA': 'Choose File', 'fr-CA': 'Choisir le Fichier', 'en-ZA': 'Kies Lêer', af: 'Kies Lêer'
    },
    importSuccess: {
      en: 'Data imported successfully!',
      fr: 'Données importées avec succès !',
      mi: 'Kua kawemai ngā raraunga!',
      ga: 'Dátaí iompórtáilte go rathúil!',
      hi: 'डेटा सफलतापूर्वक आयात किया गया!',
      gd: 'Chaidh dàta a thoirt a-steach gu soirbheachail!',
      'en-AU': 'Data imported successfully!', 'en-NZ': 'Data imported successfully!', 'en-CA': 'Data imported successfully!', 'fr-CA': 'Données importées avec succès !', 'en-ZA': 'Data sukses ingevoer!', af: 'Data sukses ingevoer!'
    },
    importError: {
      en: 'Error importing data: ',
      fr: 'Erreur lors de l\'importation des données : ',
      mi: 'Hapa kawemai raraunga: ',
      ga: 'Earráid ag iompórtáil sonraí: ',
      hi: 'डेटा आयात करने में त्रुटि: ',
      gd: 'Mearachd ann an in-phortail dàta: ',
      'en-AU': 'Error importing data: ', 'en-NZ': 'Error importing data: ', 'en-CA': 'Error importing data: ', 'fr-CA': 'Erreur lors de l\'importation des données : ', 'en-ZA': 'Fout met data invoer: ', af: 'Fout met data invoer: '
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

// Fonction de traduction générique (inchangée)
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
  const { language } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null); // Référence pour l'input file
  const [importStatus, setImportStatus] = useState(''); // État pour le message d'importation
  const [importedData, setImportedData] = useState<any[]>([]); // Pour stocker les données importées

  // Définissez les couleurs en fonction du thème, cohérentes avec le style "super agent"
  const textColor = theme === 'dark' ? '#E0E0E0' : '#333333';
  const mutedTextColor = theme === 'dark' ? '#A0A0A0' : '#666666';
  const borderColor = theme === 'dark' ? '#555555' : '#AAAAAA';
  const backgroundColor = theme === 'dark' ? '#1A1A2E' : '#FFFFFF';
  const warningColor = theme === 'dark' ? '#FFCACA' : '#CC0000';
  const successColor = theme === 'dark' ? '#ACFFAC' : '#00CC00'; // Couleur verte pour le succès

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    // Vérifier le type de fichier (ici, on accepte CSV)
    if (file.type !== 'text/csv') {
      setImportStatus(`[${language}] ${getTranslation('dashboardPage', 'importError', language)} Incorrect file format. Please upload a CSV file.`);
      return;
    }

    Papa.parse(file, {
      header: true, // Considérer la première ligne comme en-tête
      skipEmptyLines: true,
      complete: (results) => {
        console.log('Données parsées:', results.data);
        setImportedData(results.data); // Stocker les données parsées
        setImportStatus(`[${language}] ${getTranslation('dashboardPage', 'importSuccess', language)}`); // Message de succès
        // Ici, vous pourriez appeler une fonction pour sauvegarder les données dans votre base de données ou un état global
      },
      error: (error) => {
        console.error('Erreur lors du parsing:', error);
        setImportStatus(`[${language}] ${getTranslation('dashboardPage', 'importError', language)} ${error.message}`);
        setImportedData([]); // Vider les données en cas d'erreur
      },
    });
  };

  const handleChooseFileClick = () => {
    fileInputRef.current?.click(); // Simuler le clic sur l'input file caché
  };

  return (
    <div style={{
      padding: '2rem',
      maxWidth: '1200px',
      margin: '0 auto',
      lineHeight: '1.6',
      fontSize: '1rem',
      color: textColor,
      fontFamily: "'Arial', sans-serif",
      backgroundColor: backgroundColor,
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
        maxWidth: '80%',
        borderBottom: `1px solid ${borderColor}`,
        paddingBottom: '1rem'
      }}>
        {getTranslation('dashboardPage', 'subtitle', language)}
      </p>

      {/* Zone d'Importation de Données */}
      <section style={{
        width: '100%',
        marginTop: '3rem',
        padding: '2rem',
        border: `2px solid ${borderColor}`,
        borderRadius: '8px',
        backgroundColor: theme === 'dark' ? '#2A2A3A' : '#F8F8F8',
        boxShadow: `4px 4px 0px ${theme === 'dark' ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.15)'}`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '200px',
      }}>
        <h2 style={{
          fontSize: '2rem',
          marginBottom: '1.5rem',
          color: textColor,
          fontFamily: "'Playfair Display', serif",
          fontWeight: 'bold',
          textTransform: 'uppercase'
        }}>
          {getTranslation('dashboardPage', 'fileUploadLabel', language)}
        </h2>
        <input
          type="file"
          accept=".csv" // Accepte seulement les fichiers CSV
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: 'none' }} // Cache l'input file par défaut
        />
        <button
          onClick={handleChooseFileClick}
          style={{
            padding: '0.8rem 1.5rem',
            fontSize: '1.1rem',
            backgroundColor: theme === 'dark' ? '#5A5A7A' : '#4CAF50', // Couleur verte pour l'upload
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            transition: 'background-color 0.3s ease',
            marginBottom: '1rem',
            fontFamily: "'Arial', sans-serif",
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = theme === 'dark' ? '#7A7AA0' : '#45a049'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = theme === 'dark' ? '#5A5A7A' : '#4CAF50'}
        >
          {getTranslation('dashboardPage', 'uploadButton', language)}
        </button>
        {importStatus && (
          <p style={{
            marginTop: '1rem',
            fontSize: '1rem',
            fontWeight: 'bold',
            color: importStatus.includes('Error') ? warningColor : successColor,
          }}>
            {importStatus}
          </p>
        )}
      </section>

      {/* Message de développement (maintenu) */}
      <section style={{
        width: '100%',
        marginTop: '3rem',
        padding: '2rem',
        border: `2px dashed ${warningColor}`,
        borderRadius: '8px',
        backgroundColor: theme === 'dark' ? '#3A2A2A' : '#FFF3F3',
        color: warningColor,
        textAlign: 'center',
        boxShadow: `4px 4px 0px ${theme === 'dark' ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.15)'}`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '200px',
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
          color: mutedTextColor,
          maxWidth: '700px'
        }}>
          {getTranslation('dashboardPage', 'developmentMessage', language)}
        </p>
        <p style={{
          fontSize: '1.1rem',
          marginTop: '1.5rem',
          fontWeight: 'bold',
          color: warningColor
        }}>
          {getTranslation('dashboardPage', 'stayAlertMessage', language)}
        </p>
      </section>

      {/* Affichage des données importées (pour prévisualisation) */}
      {importedData.length > 0 && (
        <section style={{
          width: '100%',
          marginTop: '3rem',
          padding: '2rem',
          border: `1px solid ${borderColor}`,
          borderRadius: '8px',
          backgroundColor: theme === 'dark' ? '#2A2A3A' : '#F8F8F8',
          boxShadow: `3px 3px 0px ${theme === 'dark' ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.1)'}`,
          color: textColor,
          overflowX: 'auto', // Permet de scroller si le tableau est trop large
        }}>
          <h2 style={{
            fontSize: '1.8rem',
            marginBottom: '1.5rem',
            color: textColor,
            fontFamily: "'Playfair Display', serif",
            fontWeight: 'bold',
            textAlign: 'center'
          }}>
            Prévisualisation des Données Importées
          </h2>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {Object.keys(importedData[0]).map((header) => (
                  <th key={header} style={{
                    borderBottom: `2px solid ${borderColor}`,
                    padding: '0.8rem',
                    textAlign: 'left',
                    color: textColor,
                    backgroundColor: theme === 'dark' ? '#3A3A5A' : '#EFEFEF',
                    textTransform: 'uppercase',
                    fontSize: '0.9rem'
                  }}>
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {importedData.map((row, rowIndex) => (
                <tr key={rowIndex} style={{
                  borderBottom: `1px solid ${theme === 'dark' ? '#444466' : '#DDD'}`,
                }}>
                  {Object.values(row).map((cell, cellIndex) => (
                    <td key={cellIndex} style={{
                      padding: '0.8rem',
                      color: mutedTextColor, // Utiliser muted pour le contenu
                      fontSize: '0.95rem'
                    }}>
                      {String(cell)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      <p style={{ textAlign: 'center', marginTop: '4rem', fontSize: '0.8rem', color: mutedTextColor }}>
        © <span suppressHydrationWarning>{new Date().getFullYear()}</span> {getTranslation('dashboardPage', 'copyright', language)}
      </p>
    </div>
  );
}