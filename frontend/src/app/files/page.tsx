'use client'; // Indique que ce composant est un Client Component

import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';// Assurez-vous que ce chemin est correct
import { useLanguage } from '@/contexts/LanguageContext'; // Importez useLanguage
import { LanguageCode } from '@/types'; // Importez LanguageCode

// Définitions des traductions pour cette page
const allTranslations = {
  filesPageBeta: { // Section spécifique pour cette page
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
      en: 'The Central File Management System is currently undergoing rigorous calibration and security enhancements. Full access and functionality will be available upon completion of final beta testing.',
      fr: 'Le système central de gestion des Fichiers est actuellement soumis à des calibrations rigoureuses et des améliorations de sécurité. L\'accès complet et les fonctionnalités seront disponibles après la finalisation des tests bêta finaux.',
      mi: 'Kei te haere tonu te Pūnaha Whakahaere Kōnae Matua i ngā tukanga whakatika kaha me ngā whakapainga haumarutanga. Ka wātea te uru me ngā mahi katoa i muri i te oti o ngā whakamātautau beta whakamutunga.',
      ga: 'Tá an Córas Bainistíochta Comhad Láir faoi láthair ag dul faoi chalabrú docht agus feabhsúcháin slándála. Beidh rochtain agus feidhmiúlacht iomlán ar fáil tar éis tástáil béite deiridh a chríochnú.',
      hi: 'केंद्रीय फ़ाइल प्रबंधन प्रणाली वर्तमान में कठोर अंशांकन और सुरक्षा वृद्धि प्रक्रियाओं से गुजर रही है। अंतिम बीटा परीक्षण के सफल समापन पर पूर्ण पहुंच और कार्यक्षमता उपलब्ध होगी।',
      gd: 'Tha an Siostam Riaghlaidh Faidhlichean Mheadhanach an-dràsta fo calibration teann agus leasachaidhean tèarainteachd. Bheirear làn chothrom agus gnìomhachd nuair a bhios deuchainn beta deireannach deiseil.',
      'en-AU': 'The Central File Management System is currently undergoing rigorous calibration and security enhancements. Full access and functionality will be available upon completion of final beta testing.', 'en-NZ': 'The Central File Management System is currently undergoing rigorous calibration and security enhancements. Full access and functionality will be available upon completion of final beta testing.', 'en-CA': 'The Central File Management System is currently undergoing rigorous calibration and security enhancements. Full access and functionality will be available upon completion of final beta testing.', 'fr-CA': 'Le système central de gestion des Fichiers est actuellement soumis à des calibrations rigoureuses et des améliorations de sécurité. L\'accès complet et les fonctionnalités seront disponibles après la finalisation des tests bêta finaux.', 'en-ZA': 'The Central File Management System is currently undergoing rigorous calibration and security enhancements. Full access and functionality will be available upon completion of final beta testing.', af: 'Die Sentrale Lêerbestuurstelsel ondergaan tans streng kalibrasie en sekuriteitsverbeteringe. Volle toegang en funksionaliteit sal beskikbaar wees na voltooiing van finale beta-toetse.'
    },
    stayTuned: {
      en: 'Stay tuned for updates from Command regarding file access.',
      fr: 'Restez à l\'écoute pour les mises à jour du Commandement concernant l\'accès aux fichiers.',
      mi: 'Kia mataara tonu mō ngā whakahōutanga mai i te Whakahau mō te uru ki ngā kōnae.',
      ga: 'Fan tiúnta le haghaidh nuashonruithe ón Ordú maidir le rochtain comhad.',
      hi: 'फ़ाइल एक्सेस के संबंध में कमांड से अपडेट के लिए बने रहें।',
      gd: 'Fuirichibh furachair airson ùrachaidhean bhon Àithne a thaobh faighinn gu faidhlichean.',
      'en-AU': 'Stay tuned for updates from Command regarding file access.', 'en-NZ': 'Stay tuned for updates from Command regarding file access.', 'en-CA': 'Stay tuned for updates from Command regarding file access.', 'fr-CA': 'Restez à l\'écoute pour les mises à jour du Commandement concernant l\'accès aux fichiers.', 'en-ZA': 'Stay tuned for updates from Command regarding file access.', af: 'Bly ingeskakel vir opdaterings van die Bevel oor lêertoegang.'
    },
    fileUploadInstruction: {
        en: 'Upload new files directly or manage existing ones below.',
        fr: 'Téléversez de nouveaux fichiers directement ou gérez ceux existants ci-dessous.',
        mi: 'Kawemai ngā kōnae hou tika atu, ā, whakahaerehia ngā mea kei raro nei.',
        ga: 'Uaslódáil comhaid nua go díreach nó bainistigh iad siúd atá ann cheana thíos.',
        hi: 'नई फाइलें सीधे अपलोड करें या नीचे वाली फ़ाइलों को प्रबंधित करें।',
        gd: 'Luchdaich suas faidhlichean ùra gu dìreach no stiuirich an fheadhainn a th\' ann gu h-ìosal.',
        'en-AU': 'Upload new files directly or manage existing ones below.', 'en-NZ': 'Upload new files directly or manage existing ones below.', 'en-CA': 'Upload new files directly or manage existing ones below.', 'fr-CA': 'Téléversez de nouveaux fichiers directement ou gérez ceux existants ci-dessous.', 'en-ZA': 'Laai nuwe lêers direk op of bestuur bestaande lêers hieronder.', af: 'Laai nuwe lêers direk op of bestuur bestaande lêers hieronder.'
    },
    noFilesMessage: {
        en: 'No files found. Please upload some to get started.',
        fr: 'Aucun fichier trouvé. Veuillez en télécharger pour commencer.',
        mi: 'Kāore he kōnae i kitea. Tēnā koa kawemai ētahi kia tīmata ai.',
        ga: 'Ní bhfuarthas aon chomhad. Uaslódáil roinnt le tosú le do thoil.',
        hi: 'कोई फ़ाइल नहीं मिली। शुरू करने के लिए कुछ अपलोड करें।',
        gd: 'Chan fhaighear faidhlichean. Feuch an luchdaich thu suas gus tòiseachadh.',
        'en-AU': 'No files found. Please upload some to get started.', 'en-NZ': 'No files found. Please upload some to get started.', 'en-CA': 'No files found. Please upload some to get started.', 'fr-CA': 'Aucun fichier trouvé. Veuillez en télécharger pour commencer.', 'en-ZA': 'Geen lêers gevind nie. Laai asseblief enkeles op om te begin.', af: 'Geen lêers gevind nie. Laai asseblief enkeles op om te begin.'
    },
    fileNameHeader: {
        en: 'File Name',
        fr: 'Nom du Fichier',
        mi: 'Ingoa Kōnae',
        ga: 'Ainm an Chomhaid',
        hi: 'फ़ाइल का नाम',
        gd: 'Ainm an Fhaidhle',
        'en-AU': 'File Name', 'en-NZ': 'File Name', 'en-CA': 'File Name', 'fr-CA': 'Nom du Fichier', 'en-ZA': 'Lêernaam', af: 'Lêernaam'
    },
    fileSizeHeader: {
        en: 'File Size',
        fr: 'Taille du Fichier',
        mi: 'Rahi Kōnae',
        ga: 'Méid an Chomhaid',
        hi: 'फ़ाइल का आकार',
        gd: 'Meud an Fhaidhle',
        'en-AU': 'File Size', 'en-NZ': 'File Size', 'en-CA': 'File Size', 'fr-CA': 'Taille du Fichier', 'en-ZA': 'Lêergrootte', af: 'Lêergrootte'
    },
    lastModifiedHeader: {
        en: 'Last Modified',
        fr: 'Dernière Modification',
        mi: 'Whakamutunga Whakapaunga',
        ga: 'Mionathraithe go Deireanach',
        hi: 'अंतिम बार संशोधित',
        gd: 'Mu dheireadh air atharrachadh',
        'en-AU': 'Last Modified', 'en-NZ': 'Last Modified', 'en-CA': 'Last Modified', 'fr-CA': 'Dernière Modification', 'en-ZA': 'Laaste Gewysig', af: 'Laaste Gewysig'
    },
    downloadAction: {
        en: 'Download',
        fr: 'Télécharger',
        mi: 'Tikiake',
        ga: 'Íoslódáil',
        hi: 'डाउनलोड',
        gd: 'Luchdaich sìos',
        'en-AU': 'Download', 'en-NZ': 'Download', 'en-CA': 'Download', 'fr-CA': 'Télécharger', 'en-ZA': 'Laai af', af: 'Laai af'
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


export default function FilesPage() {
  const { theme } = useTheme();
  const { language } = useLanguage();

  // Définissez les couleurs en fonction du thème, cohérentes avec le style "super agent"
  const textColor = theme === 'dark' ? '#E0E0E0' : '#333333';
  const mutedTextColor = theme === 'dark' ? '#A0A0A0' : '#666666';
  const borderColor = theme === 'dark' ? '#555555' : '#AAAAAA';
  const backgroundColorPage = theme === 'dark' ? '#1A1A2E' : '#FFFFFF'; // Fond blanc pour le mode clair
  const textShadowColor = theme === 'dark' ? 'rgba(0,0,0,0.6)' : 'rgba(150,150,150,0.4)';
  const warningBackground = theme === 'dark' ? '#3A2A2A' : '#FFF3F3'; // Fond léger pour l'alerte
  const warningText = theme === 'dark' ? '#FFCACA' : '#CC0000'; // Rouge pour l'alerte de développement
  const warningBorder = theme === 'dark' ? '#FFCACA' : '#CC0000'; // Bordure pour l'alerte de développement
  const shadowColorCard = theme === 'dark' ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.2)';
  const highlightColor = theme === 'dark' ? '#8BC4FF' : '#4A90E2'; // Couleur pour les éléments interactifs

  // Ici, vous auriez besoin de récupérer la liste des fichiers depuis votre backend
  // Pour l'instant, nous utilisons des données fictives pour illustrer la structure
  const dummyFiles = [
    { id: 'f1', name: 'mission_report_q3_2023.pdf', size: '1.2 MB', lastModified: '2023-09-15', url: '#' },
    { id: 'f2', name: 'strategic_plan_v2.docx', size: '450 KB', lastModified: '2023-08-20', url: '#' },
    { id: 'f3', name: 'intel_brief_08_aug.txt', size: '55 KB', lastModified: '2023-08-08', url: '#' },
  ];

  return (
    <div style={{
      padding: '2rem',
      maxWidth: '1000px',
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

      {/* Section Principale : Gestion des Fichiers (en Beta) */}
      <section style={{
        width: '100%',
        marginTop: '3rem',
        padding: '2rem',
        border: `2px dashed ${warningBorder}`, // Bordure distinctive pour la section bêta
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

        {/* Instructions pour l'upload / Gestion */}
        <div style={{ marginTop: '2rem', width: '100%', maxWidth: '700px', color: textColor }}>
          <p style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>
            {getTranslation('filesPageBeta', 'fileUploadInstruction', language)}
          </p>

          {/* Ici, vous pourriez intégrer un composant d'upload de fichier (type <input type="file">) */}
          {/* et une logique pour lister les fichiers (voir ci-dessous) */}

          {dummyFiles.length > 0 ? (
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              marginTop: '2rem',
              textAlign: 'left',
              backgroundColor: theme === 'dark' ? '#2A2A3A' : '#F8F8F8', // Fond de tableau
              borderRadius: '5px',
              overflow: 'hidden' // Pour que les bords arrondis soient pris en compte
            }}>
              <thead>
                <tr>
                  <th style={{ padding: '0.8rem', borderBottom: `1px solid ${borderColor}`, color: textColor, fontSize: '0.9rem', textTransform: 'uppercase' }}>
                    {getTranslation('filesPageBeta', 'fileNameHeader', language)}
                  </th>
                  <th style={{ padding: '0.8rem', borderBottom: `1px solid ${borderColor}`, color: textColor, fontSize: '0.9rem', textTransform: 'uppercase' }}>
                    {getTranslation('filesPageBeta', 'fileSizeHeader', language)}
                  </th>
                  <th style={{ padding: '0.8rem', borderBottom: `1px solid ${borderColor}`, color: textColor, fontSize: '0.9rem', textTransform: 'uppercase' }}>
                    {getTranslation('filesPageBeta', 'lastModifiedHeader', language)}
                  </th>
                  <th style={{ padding: '0.8rem', borderBottom: `1px solid ${borderColor}`, color: textColor, fontSize: '0.9rem', textTransform: 'uppercase', textAlign: 'right' }}>
                    {getTranslation('filesPageBeta', 'downloadAction', language)}
                  </th>
                </tr>
              </thead>
              <tbody>
                {dummyFiles.map((file) => (
                  <tr key={file.id} style={{ borderBottom: `1px solid ${theme === 'dark' ? '#444466' : '#DDD'}` }}>
                    <td style={{ padding: '0.8rem', color: textColor, fontSize: '0.95rem' }}>{file.name}</td>
                    <td style={{ padding: '0.8rem', color: mutedTextColor, fontSize: '0.95rem' }}>{file.size}</td>
                    <td style={{ padding: '0.8rem', color: mutedTextColor, fontSize: '0.95rem' }}>{file.lastModified}</td>
                    <td style={{ padding: '0.8rem', color: highlightColor, fontSize: '0.95rem', textAlign: 'right', fontWeight: 'bold' }}>
                      <a href={file.url} style={{ textDecoration: 'none', color: highlightColor, cursor: 'pointer' }}>
                        {getTranslation('filesPageBeta', 'downloadAction', language)}
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p style={{ marginTop: '1.5rem', color: mutedTextColor }}>
              {getTranslation('filesPageBeta', 'noFilesMessage', language)}
            </p>
          )}
        </div>
      </section>

      <p style={{ textAlign: 'center', marginTop: '4rem', fontSize: '0.8rem', color: mutedTextColor }}>
        © <span suppressHydrationWarning>{new Date().getFullYear()}</span> {getTranslation('filesPageBeta', 'copyright', language)}
      </p>
    </div>
  );
}