'use client'; // Indique que ce composant est un Client Component

import React, { useState, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext'; // Assurez-vous que ce chemin est correct
import { useLanguage } from '@/contexts/LanguageContext'; // Importez useLanguage
import { LanguageCode } from '@/types'; // Importez LanguageCode
import styles from './connections.module.css'; // Importez le CSS module

// Définir un type pour les données de connexion (ex: "nations")
interface ConnectionNation {
  id: string;
  name: string;
  group: string; // Cette valeur peut être une clé de traduction si les groupes sont fixes
  status: 'online' | 'offline' | 'restricted';
  lastActivity: string; // Le format de date/heure peut nécessiter une internationalisation plus poussée si non standard
  description: string; // La description pourrait être une clé de traduction si elle est fixe
  // Ajoutez d'autres champs pertinents
}

// Définitions des traductions pour cette page
const allTranslations = {
  connectionsPage: {
    mainTitleLine1: {
      en: "Operations Network",
      fr: "Réseau d'Opérations",
      mi: "Whatunga Mahi",
      ga: "Líonra Oibríochtaí",
      hi: "संचालन नेटवर्क",
      gd: "Lìonra Gnìomhachd",
      'en-AU': "Operations Network", 'en-NZ': "Operations Network", 'en-CA': "Operations Network", 'fr-CA': "Réseau d'Opérations", 'en-ZA': "Operations Network", af: "Operasies Netwerk"
    },
    mainTitleLine2: {
      en: "— Global Connections —",
      fr: "— Connexions Globales —",
      mi: "— Hononga Ao —",
      ga: "— Naisc Dhomhanda —",
      hi: "— वैश्विक कनेक्शन —",
      gd: "— Ceanglaichean Cruinneil —",
      'en-AU': "— Global Connections —", 'en-NZ': "— Global Connections —", 'en-CA': "— Global Connections —", 'fr-CA': "— Connexions Globales —", 'en-ZA': "— Global Connections —", af: "— Globale Verbindings —"
    },
    subtitle: {
      en: '"Monitoring and managing contact points with partner agencies and strategic infrastructures across the globe."',
      fr: '"Surveillance et gestion des points de contact avec les agences partenaires et les infrastructures stratégiques à travers le globe."',
      mi: '"Te tirotiro me te whakahaere i ngā wāhi whakapā ki ngā tari hoa me ngā hanganga rautaki puta noa i te ao."',
      ga: '"Monatóireacht agus bainistiú pointí teagmhála le gníomhaireachtaí comhpháirtíochta agus bonneagair straitéiseacha ar fud an domhain."',
      hi: '"दुनिया भर में भागीदार एजेंसियों और रणनीतिक बुनियादी ढांचों के साथ संपर्क बिंदुओं की निगरानी और प्रबंधन।"',
      gd: '"A’ cumail sùil air agus a’ stiùireadh phuingean conaltraidh le buidhnean com-pàirteach is bun-structair ro-innleachdail air feadh na cruinne."',
      'en-AU': '"Monitoring and managing contact points with partner agencies and strategic infrastructures across the globe."', 'en-NZ': '"Monitoring and managing contact points with partner agencies and strategic infrastructures across the globe."', 'en-CA': '"Monitoring and managing contact points with partner agencies and strategic infrastructures across the globe."', 'fr-CA': '"Surveillance et gestion des points de contact avec les agences partenaires et les infrastructures stratégiques à travers le globe."', 'en-ZA': '"Monitoring and managing contact points with partner agencies and strategic infrastructures across the globe."', af: '"Monitering en bestuur van kontakpunte met vennootagentskappe en strategiese infrastrukture oor die hele wêreld."'
    },
    // Messages d'état de chargement/erreur/vide
    loadingMessage: {
      en: 'Loading connection statuses... Please wait.',
      fr: 'Chargement des statuts de connexion... Veuillez patienter.',
      mi: 'Te uta i ngā tūnga hononga... Tēnā tatari.',
      ga: 'Ag lódáil stádas ceangail... Fan le do thoil.',
      hi: 'कनेक्शन स्थितियाँ लोड हो रही हैं... कृपया प्रतीक्षा करें।',
      gd: 'A’ luchdadh inbhean ceangail... Fuirichibh, mas e do thoil e.',
      'en-AU': 'Loading connection statuses... Please wait.', 'en-NZ': 'Loading connection statuses... Please wait.', 'en-CA': 'Loading connection statuses... Please wait.', 'fr-CA': 'Chargement des statuts de connexion... Veuillez patienter.', 'en-ZA': 'Loading connection statuses... Please wait.', af: 'Laai verbindingstatusse... Wag asseblief.'
    },
    fetchErrorMessage: { // Message d'erreur général de la fonction fetch
      en: 'Cannot load connection statuses. Check HQ network.',
      fr: 'Impossible de charger les statuts des connexions. Vérifiez le réseau du QG.',
      mi: 'Kāore e taea te uta i ngā tūnga hononga. Tirohia te whatunga QG.',
      ga: 'Ní féidir stádas ceangail a lódáil. Seiceáil líonra HQ.',
      hi: 'कनेक्शन स्थितियाँ लोड नहीं की जा सकतीं। मुख्यालय नेटवर्क जांचें।',
      gd: 'Cha ghabh inbhean ceangail a luchdadh. Thoir sùil air lìonra HQ.',
      'en-AU': 'Cannot load connection statuses. Check HQ network.', 'en-NZ': 'Cannot load connection statuses. Check HQ network.', 'en-CA': 'Cannot load connection statuses. Check HQ network.', 'fr-CA': 'Impossible de charger les statuts des connexions. Vérifiez le réseau du QG.', 'en-ZA': 'Cannot load connection statuses. Check HQ network.', af: 'Kan nie verbindingstatusse laai nie. Gaan HK-netwerk na.'
    },
    communicationErrorPrefix: { // Texte à ajouter avant le message d'erreur spécifique si `error` est défini
      en: 'Communication Error: ',
      fr: 'Erreur de communication : ',
      mi: 'Hapa Whakawhitiwhiti: ',
      ga: 'Earráid Cumarsáide: ',
      hi: 'संचार त्रुटि: ',
      gd: 'Mearachd Conaltraidh: ',
      'en-AU': 'Communication Error: ', 'en-NZ': 'Communication Error: ', 'en-CA': 'Communication Error: ', 'fr-CA': 'Erreur de communication : ', 'en-ZA': 'Communication Error: ', af: 'Kommunikasiefout: '
    },
    emptyMessage: {
      en: 'No active connections have been listed.',
      fr: 'Aucune connexion active n\'a été répertoriée.',
      mi: 'Kāore he hononga hohe i rārangi.',
      ga: 'Níor liostáladh aon cheangail ghníomhacha.',
      hi: 'कोई सक्रिय कनेक्शन सूचीबद्ध नहीं किया गया है।',
      gd: 'Cha deach ceanglaichean gnìomhach a liostadh.',
      'en-AU': 'No active connections have been listed.', 'en-NZ': 'No active connections have been listed.', 'en-CA': 'No active connections have been listed.', 'fr-CA': 'Aucune connexion active n\'a été répertoriée.', 'en-ZA': 'No active connections have been listed.', af: 'Geen aktiewe verbindings is gelys nie.'
    },
    // Textes pour chaque carte de nation
    groupLabel: {
      en: 'Group:',
      fr: 'Groupe :',
      mi: 'Rōpū:',
      ga: 'Grúpa:',
      hi: 'समूह:',
      gd: 'Buidheann:',
      'en-AU': 'Group:', 'en-NZ': 'Group:', 'en-CA': 'Group:', 'fr-CA': 'Groupe :', 'en-ZA': 'Group:', af: 'Groep:'
    },
    lastActivityLabel: {
      en: 'Last activity:',
      fr: 'Dernière activité :',
      mi: 'Mahi whakamutunga:',
      ga: 'Gníomhaíocht dheireanach:',
      hi: 'अंतिम गतिविधि:',
      gd: 'Gnìomhachd mu dheireadh:',
      'en-AU': 'Last activity:', 'en-NZ': 'Last activity:', 'en-CA': 'Last activity:', 'fr-CA': 'Dernière activité :', 'en-ZA': 'Last activity:', af: 'Laaste aktiwiteit:'
    },
    accessFileButton: {
      en: 'Access File {id}', // Placeholder for ID
      fr: 'Accéder au Dossier {id}',
      mi: 'Uru ki te Kōnae {id}',
      ga: 'Rochtain ar Chomhad {id}',
      hi: 'फ़ाइल {id} तक पहुंचें',
      gd: 'Faigh Cothrom air Faidhle {id}',
      'en-AU': 'Access File {id}', 'en-NZ': 'Access File {id}', 'en-CA': 'Access File {id}', 'fr-CA': 'Accéder au Dossier {id}', 'en-ZA': 'Access File {id}', af: 'Toegang tot Lêer {id}'
    },
    // Statuts de connexion
    statusOnline: {
      en: 'Online',
      fr: 'En Ligne',
      mi: 'I Runga I te Ipurangi',
      ga: 'Ar Líne',
      hi: 'ऑनलाइन',
      gd: 'Air-loidhne',
      'en-AU': 'Online', 'en-NZ': 'Online', 'en-CA': 'Online', 'fr-CA': 'En Ligne', 'en-ZA': 'Online', af: 'Aanlyn'
    },
    statusOffline: {
      en: 'Offline',
      fr: 'Hors Ligne',
      mi: 'Tuimotu',
      ga: 'As Líne',
      hi: 'ऑफ़लाइन',
      gd: 'Far-loidhne',
      'en-AU': 'Offline', 'en-NZ': 'Offline', 'en-CA': 'Offline', 'fr-CA': 'Hors Ligne', 'en-ZA': 'Offline', af: 'Vanlyn'
    },
    statusRestricted: {
      en: 'Restricted',
      fr: 'Restreint',
      mi: 'Raihana',
      ga: 'Srianta',
      hi: 'प्रतिबंधित',
      gd: 'Cuingealaichte',
      'en-AU': 'Restricted', 'en-NZ': 'Restricted', 'en-CA': 'Restricted', 'fr-CA': 'Restreint', 'en-ZA': 'Restricted', af: 'Beperk'
    },
    // Texte du pied de page
    copyright: {
      en: 'Kiwi-Ops – International Command Network.',
      fr: 'Kiwi-Ops – Réseau de Commandement International.',
      mi: 'Kiwi-Ops – Whatunga Whakahau o te Ao.',
      ga: 'Kiwi-Ops – Líonra Ordaithe Idirnáisiúnta.',
      hi: 'कीवी-ऑप्स – अंतर्राष्ट्रीय कमांड नेटवर्क।',
      gd: 'Kiwi-Ops – Lìonra Àithne Eadar-nàiseanta.',
      'en-AU': 'Kiwi-Ops – International Command Network.', 'en-NZ': 'Kiwi-Ops – International Command Network.', 'en-CA': 'Kiwi-Ops – International Command Network.', 'fr-CA': 'Kiwi-Ops – Réseau de Commandement International.', 'en-ZA': 'Kiwi-Ops – International Command Network.', af: 'Kiwi-Ops – Internasionale Bevelsnetwerk.'
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


export default function ConnectionsPage() {
  const { theme } = useTheme();
  const { language } = useLanguage(); // Obtenez la langue courante

  // Définissez les couleurs en fonction du thème
  const textColor = theme === 'dark' ? '#E0E0E0' : '#333333';
  const mutedTextColor = theme === 'dark' ? '#A0A0A0' : '#666666';
  const borderColor = theme === 'dark' ? '#555555' : '#AAAAAA';
  const backgroundColorPage = theme === 'dark' ? '#1A1A2E' : '#f9fafb';
  const cardBackgroundColor = theme === 'dark' ? '#2A2A3A' : '#F5F0E1';
  const highlightColor = theme === 'dark' ? '#8BC4FF' : '#4A90E2';
  const shadowColorCard = theme === 'dark' ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.2)';
  const shadowColorHover = theme === 'dark' ? 'rgba(0,0,0,0.7)' : 'rgba(0,0,0,0.3)';
  const textShadowColor = theme === 'dark' ? 'rgba(0,0,0,0.6)' : 'rgba(150,150,150,0.4)';

  // État pour simuler les données des nations (viendraient du backend)
  const [nations, setNations] = useState<ConnectionNation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNations = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // SIMULATION DE DONNÉES DE CONNEXIONS (à remplacer par un appel API réel)
        // Note: Les champs 'title' et 'description' de ConnectionNation sont en dur ici,
        // s'ils devaient être traduits, ils devraient venir du backend déjà traduits
        // ou vous devriez avoir une logique de traduction pour ces données dynamiques.
        const simulatedData: ConnectionNation[] = [
          {
            id: 'FR-NDL',
            name: 'Notre Dame de Lorette',
            group: 'Europe Opérations', // Pourrait être traduit si les groupes sont prédéfinis
            status: 'online',
            lastActivity: 'Il y a 5 minutes', // Devrait être formaté avec Intl.DateTimeFormat
            description: 'Point de contact principal pour les opérations historiques et culturelles en France.'
          },
          {
            id: 'UK-WLT',
            name: 'Wellington Central',
            group: 'Alliance Transatlantique',
            status: 'online',
            lastActivity: 'Il y a 10 minutes',
            description: 'Centre névralgique pour la coordination des opérations stratégiques entre les continents.'
          },
          {
            id: 'JP-TKY',
            name: 'Tokyo Nexus',
            group: 'Pacifique Orient',
            status: 'restricted',
            lastActivity: 'Il y a 3 heures',
            description: 'Accès restreint aux données de surveillance des flux maritimes. Attente validation protocole Alpha.'
          },
          {
            id: 'BR-AMZ',
            name: 'Amazonia Watch',
            group: 'Sud Amérique Veille',
            status: 'offline',
            lastActivity: 'Il y a 2 jours',
            description: 'Mise à jour des systèmes en cours. Contact perdu avec l\'agent local. Urgence niveau 3.'
          },
        ];

        await new Promise(resolve => setTimeout(resolve, 1000));
        setNations(simulatedData);
      } catch (err) {
        console.error("Erreur lors du chargement des connexions:", err);
        setError(getTranslation('connectionsPage', 'fetchErrorMessage', language));
      } finally {
        setIsLoading(false);
      }
    };

    fetchNations();
  }, [language]); // Ajoutez 'language' pour recharger si la langue change

  // Helper pour traduire le statut de connexion
  const getConnectionStatusTranslation = (status: ConnectionNation['status']): string => {
    switch (status) {
      case 'online': return getTranslation('connectionsPage', 'statusOnline', language);
      case 'offline': return getTranslation('connectionsPage', 'statusOffline', language);
      case 'restricted': return getTranslation('connectionsPage', 'statusRestricted', language);
      default: return status; // Fallback
    }
  };

  return (
    <div
      className={styles.pageContainer}
      style={{
        backgroundColor: backgroundColorPage,
        // Définition des variables CSS consommées par connections.module.css
        '--kiwi-text-primary': textColor,
        '--kiwi-text-secondary': mutedTextColor,
        '--kiwi-border-color': borderColor,
        '--kiwi-background-card': cardBackgroundColor,
        '--kiwi-highlight-color': highlightColor,
        '--kiwi-shadow-color-card': shadowColorCard,
        '--kiwi-shadow-color-hover': shadowColorHover,
        '--kiwi-text-shadow': `2px 2px 0px ${textShadowColor}`
      } as React.CSSProperties}
    >
      <h1 className={styles.title}>
        {getTranslation('connectionsPage', 'mainTitleLine1', language)}<br />
        {getTranslation('connectionsPage', 'mainTitleLine2', language)}
      </h1>
      <p className={styles.subtitle}>
        {getTranslation('connectionsPage', 'subtitle', language)}
      </p>

      {/* Zone de contenu des Connexions */}
      <section className={styles.nationsGrid}>
        {isLoading ? (
          <p className={styles.loadingMessage}>
            {getTranslation('connectionsPage', 'loadingMessage', language)}
          </p>
        ) : error ? (
          <p className={styles.errorMessage}>
            {getTranslation('connectionsPage', 'communicationErrorPrefix', language)}{error}
          </p>
        ) : nations.length === 0 ? (
          <p className={styles.emptyMessage}>
            {getTranslation('connectionsPage', 'emptyMessage', language)}
          </p>
        ) : (
          nations.map((nation) => (
            <div key={nation.id} className={styles.nationCard}>
              <div className={styles.cardHeader}>
                <h3 className={styles.nationName}>{nation.name}</h3>
                <span
                  className={styles.statusDot}
                  style={{
                    backgroundColor:
                      nation.status === 'online'
                        ? '#4CAF50'
                        : nation.status === 'offline'
                        ? '#F44336'
                        : '#FFC107',
                  }}
                  title={getConnectionStatusTranslation(nation.status)} // Ajoute le statut traduit au title pour accessibilité
                ></span>
              </div>
              <p className={styles.nationGroup}>{getTranslation('connectionsPage', 'groupLabel', language)} {nation.group}</p>
              <p className={styles.cardDescription}>{nation.description}</p>
              <div className={styles.cardFooter}>
                <p style={{ color: mutedTextColor, fontSize: '0.85rem', fontStyle: 'italic', marginBottom: '0.5rem' }}>
                    {getTranslation('connectionsPage', 'lastActivityLabel', language)} {nation.lastActivity}
                </p>
                <a href={`/connections/${nation.id}`} className={styles.cardLink}>
                  {getTranslation('connectionsPage', 'accessFileButton', language).replace('{id}', nation.id)}
                </a>
              </div>
            </div>
          ))
        )}
      </section>

      <p className={styles.globalFooter}>
        © <span suppressHydrationWarning>{new Date().getFullYear()}</span> {getTranslation('connectionsPage', 'copyright', language)}
      </p>
    </div>
  );
}