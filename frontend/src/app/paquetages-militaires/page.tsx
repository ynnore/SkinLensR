'use client';

import React from 'react';
import styles from './paquetages.module.css';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { LanguageCode } from '@/types'; // Assurez-vous d'importer LanguageCode

// Import des icônes si besoin (non utilisés dans cet exemple)
// import { FaTrophy, FaAward } from 'react-icons/fa';

// ---- Objet de traduction ----
const allTranslations = {
  packagesPage: {
    headline: {
      en: "Military Packages",
      fr: "Paquetages Militaires",
      mi: "Ngā Pūtē Whawhai",
      ga: "Pacáistí Míleata",
      hi: "सैन्य पैकेज",
      gd: "Pacaidean Armailteach",
      cy: "Pecynnau Milwrol",
      'en-AU': "Military Packages", 'en-NZ': "Military Packages", 'en-CA': "Military Packages", 'fr-CA': "Paquetages Militaires", 'en-ZA': "Militêre Pakkette", af: "Militêre Pakkette",
    },
    intro: {
      en: "Unlock advanced agent capabilities tailored for your strategic operations.",
      fr: "Débloquez des capacités d'agent avancées, conçues pour vos opérations stratégiques.",
      mi: "Wewete i ngā kaha āpiha matatau i hangaia mō ō mahi rautaki.",
      ga: "Díghlasáil cumais ghníomhaireachta ardleibhéil atá oiriúnaithe do do chuid oibríochtaí straitéiseacha.",
      hi: "अपनी रणनीतिक कार्रवाइयों के लिए विशेष रूप से तैयार उन्नत एजेंट क्षमताओं को अनलॉक करें।",
      gd: "Fosgail comasan àidseant adhartach air an dèanamh freagarrach do dh’obraichean ro-innleachdail.",
      cy: "Datgloi galluoedd asiant uwch wedi'u teilwra ar gyfer eich gweithrediadau strategol.",
      'en-AU': "Unlock advanced agent capabilities tailored for your strategic operations.", 'en-NZ': "Unlock advanced agent capabilities tailored for your strategic operations.", 'en-CA': "Unlock advanced agent capabilities tailored for your strategic operations.", 'fr-CA': "Débloquez des capacités d'agent avancées, conçues pour vos opérations stratégiques.", 'en-ZA': "Ontsluit gevorderde agentvermoëns wat vir u strategiese bedrywighede aangepas is.", af: "Ontsluit gevorderde agentvermoëns wat vir u strategiese bedrywighede aangepas is.",
    },
    packageCadet: {
      name: {
        en: "Cadet Briefing", fr: "Briefing Cadet", mi: "Whakawāhanga Kaitiaki", ga: "Faisnéis Cadet",
        hi: "कैडेट ब्रीफिंग", gd: "Fiosrachadh Coimiseanair", cy: "Briffio Cadet"
      },
      description: {
        en: "Basic social media analysis. Ideal for reconnaissance.", fr: "Analyse de base des réseaux sociaux. Idéal pour la reconnaissance.",
        mi: "Tātari pāpāho pāpori taketake. He pai mō te tirotiro.", ga: "Bun-anailís meán sóisialta. Ideal le haghaidh taiscéalaíochta.",
        hi: "बुनियादी सोशल मीडिया विश्लेषण। टोही के लिए आदर्श।", gd: "Bun-sgrùdadh meadhanan sòisealta. Feumail airson rannsachaidh.",
        cy: "Dadansoddiad cyfryngau cymdeithasol sylfaenol. Delfrydol ar gyfer cydnabod."
      },
      cta: {
        en: "Access Briefing", fr: "Accéder au Briefing", mi: "Tuku Whakawāhanga", ga: "Rochtain ar an Fhaisnéis",
        hi: "ब्रीफिंग तक पहुंच", gd: "Faigh Cothrom air an Fhiosrachadh", cy: "Mynediad i Friffio"
      }
    },
    packageOperative: {
      name: {
        en: "Operative Toolkit", fr: "Kit d'Outils d'Opérateur", mi: "Pouaka Taputapu Kaiwhakahaere", ga: "Trealamh Oibreora",
        hi: "ऑपरेटिव टूलकिट", gd: "Inneal Obrachaidh", cy: "Pecyn Offer Gweithredwr"
      },
      description: {
        en: "Deep dives into social trends, sentiment analysis, tactical content suggestions.",
        fr: "Plongées profondes dans les tendances sociales, analyse de sentiment, suggestions de contenu tactiques.",
        mi: "Rukunga hōhonu ki ngā ia pāpori, tātari kare-ā-roto, whakaaro ihirangi rautaki.",
        ga: "Tumadóireachtaí doimhne isteach i dtreochtaí sóisialta, anailís ar thuairimí, moltaí ábhair thaicticeacha.",
        hi: "सोशल ट्रेंड्स में गहरी डुबकी, भावना विश्लेषण, सामरिक सामग्री सुझाव।",
        gd: "Dàibhidhean domhainn a-steach do ghluasadan sòisealta, mion-sgrùdadh faireachdainn, molaidhean susbaint innleachdach.",
        cy: "Plymio dwfn i dueddiadau cymdeithasol, dadansoddiad teimladau, awgrymiadau cynnwys tactegol."
      },
      cta: {
        en: "Activate Toolkit", fr: "Activer le Kit d'Outils", mi: "Whakahohe Pouaka Taputapu", ga: "Gníomhaigh an Trealamh",
        hi: "टूलकिट सक्रिय करें", gd: "Cuir an Inneal an Gnìomh", cy: "Ysgogi Pecyn Offer"
      }
    },
    packageOfficer: {
      name: {
        en: "Strategic Command", fr: "Commandement Stratégique", mi: "Whakahau Rautaki", ga: "Ceannasaíocht Straitéiseach",
        hi: "रणनीतिक कमांड", gd: "Òrdugh Ro-innleachdail", cy: "Gorchymyn Strategol"
      },
      description: {
        en: "Predictive analytics, full profile audits, AI-driven content generation.",
        fr: "Analyse prédictive, audits de profil complets, génération de contenu par IA.",
        mi: "Tātari matapae, arotake kōtaha katoa, hanga ihirangi nā AI.",
        ga: "Anailís thuarthach, iniúchtaí próifíle iomlána, giniúint ábhair atá tiomáinte ag AI.",
        hi: "भविष्य कहनेवाला विश्लेषण, पूर्ण प्रोफ़ाइल ऑडिट, एआई-संचालित सामग्री निर्माण।",
        gd: "Mion-sgrùdadh ro-innleachdail, sgrùdaidhean làn-phròifil, ginealach susbaint air a stiùireadh le AI.",
        cy: "Dadansoddiadau rhagfynegol, archwiliadau proffil llawn, cynhyrchu cynnwys a yrrir gan AI."
      },
      cta: {
        en: "Request Access", fr: "Demander l'Accès", mi: "Tono Uru", ga: "Iarr Rochtain",
        hi: "पहुंच का अनुरोध करें", gd: "Iarr Cothrom", cy: "Gofyn Mynediad"
      }
    },
  },
};

// -------- La nouvelle fonction de traduction par chemin --------
function getTranslationPath(path: string, lang: LanguageCode): string {
  const keys = path.split('.');
  let curr: any = allTranslations;
  for (const key of keys) curr = curr?.[key];
  // Gestion erreur
  if (!curr || typeof curr !== 'object' || !('en' in curr)) {
    console.warn(`Translation missing or invalid for: ${path} in language ${lang}`);
    return `[Invalid Translation: ${path}]`;
  }
  return curr[lang] || curr.en;
}

// -------- Le composant principal --------
const PaquetagesMilitairesPage: React.FC = () => {
  const { language } = useLanguage();
  const { theme } = useTheme();

  const backgroundColor = theme === 'dark' ? '#1f2937' : '#ffffff';
  const textColor = theme === 'dark' ? '#E0E0E0' : '#111827';
  const cardBgColor = theme === 'dark' ? '#2A2A3A' : '#F8F8F8';
  const borderColor = theme === 'dark' ? '#555555' : '#e5e7eb';
  const highlightColor = theme === 'dark' ? '#0070f3' : '#0070f3';

  return (
    <div
      className={styles.container}
      style={{
        '--kiwi-background-page': backgroundColor,
        '--kiwi-text-primary': textColor,
        '--kiwi-background-card': cardBgColor,
        '--kiwi-border-color': borderColor,
        '--kiwi-highlight-color': highlightColor,
      } as React.CSSProperties}
    >
      <h1 className={styles.headline}>
        {getTranslationPath('packagesPage.headline', language)}
      </h1>
      <p className={styles.intro}>
        {getTranslationPath('packagesPage.intro', language)}
      </p>

      <div className={styles.packagesGrid}>
        {/* Paquetage Cadet */}
        <div className={styles.packageCard}>
          <h2 className={styles.packageName}>
            {getTranslationPath('packagesPage.packageCadet.name', language)}
          </h2>
          <p className={styles.packageDescription}>
            {getTranslationPath('packagesPage.packageCadet.description', language)}
          </p>
          <button className={styles.packageCta}>
            {getTranslationPath('packagesPage.packageCadet.cta', language)}
          </button>
        </div>

        {/* Paquetage Opérateur */}
        <div className={styles.packageCard}>
          <h2 className={styles.packageName}>
            {getTranslationPath('packagesPage.packageOperative.name', language)}
          </h2>
          <p className={styles.packageDescription}>
            {getTranslationPath('packagesPage.packageOperative.description', language)}
          </p>
          <button className={styles.packageCta}>
            {getTranslationPath('packagesPage.packageOperative.cta', language)}
          </button>
        </div>

        {/* Paquetage Officier */}
        <div className={styles.packageCard}>
          <h2 className={styles.packageName}>
            {getTranslationPath('packagesPage.packageOfficer.name', language)}
          </h2>
          <p className={styles.packageDescription}>
            {getTranslationPath('packagesPage.packageOfficer.description', language)}
          </p>
          <button className={styles.packageCta}>
            {getTranslationPath('packagesPage.packageOfficer.cta', language)}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaquetagesMilitairesPage;
