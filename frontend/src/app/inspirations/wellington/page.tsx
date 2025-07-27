'use client';

import React from 'react';
import styles from './wellington.module.css'; // Import du CSS spécifique
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { LanguageCode } from '@/types';

// Objet de traduction pour cette page spécifique : Wellington Tunnelers
const wellingtonTranslations = {
  headline: {
    en: "Wellington Tunnelers: Mastering Strategic Communication",
    fr: "Tunneliers de Wellington : Maîtriser la Communication Stratégique",
    mi: "Ngā Tunneler o Pōneke: Te Whakamahi i te Whakawhiti Kōrero Rautaki",
    hi: "वेलिंगटन सुरंगकर्मी: रणनीतिक संचार में महारत हासिल करना",
    ga: "Tollánairí Wellington: Máistreacht ar Chumarsáid Straitéiseach",
    gd: "Cladhairean Wellington: Maighstireachd air Conaltradh Ro-innleachdail",
  },
  description: {
    en: "The underground warfare of the Wellington Tunnelers exemplifies precision, coordination, and resilience in extreme communication environments. Their methods inspire Kiwi-ops' approach to efficient intel exchange.",
    fr: "La guerre souterraine des Tunneliers de Wellington illustre la précision, la coordination et la résilience dans des environnements de communication extrêmes. Leurs méthodes inspirent l'approche de Kiwi-ops pour un échange d'informations efficace.",
    mi: "Ko te pakanga o raro whenua o ngā Tunneler o Pōneke e whakaatu ana i te tika, te mahi tahi, me te manawaroa i roto i ngā taiao whakawhiti kōrero tino uaua. Ka whakahihiri ō rātou tikanga i te huarahi o Kiwi-ops ki te whakawhiti mōhiohio pai.",
    hi: "वेलिंगटन सुरंगकर्मियों का भूमिगत युद्ध चरम संचार वातावरण में सटीकता, समन्वय और लचीलेपन का उदाहरण देता है। उनकी विधियाँ प्रभावी इंटेल एक्सचेंज के लिए किवी-ऑप्स के दृष्टिकोण को प्रेरित करती हैं।",
    ga: "Léiríonn cogaíocht faoi thalamh Thollánairí Wellington cruinneas, comhordú, agus athléimneacht i dtimpeallachtaí cumarsáide an-dian. Spreagann a modhanna cur chuige Kiwi-ops maidir le malartú intleachta éifeachtach.",
    gd: "Tha cogadh fon talamh nan Cladhairean Wellington a' sealltainn mionaideachd, co-òrdanachadh, agus seasmhachd ann an àrainneachdan conaltraidh fìor. Tha na dòighean aca a' brosnachadh dòigh-obrach Kiwi-ops a thaobh iomlaid fiosrachaidh èifeachdach.",
  },
  principlesSectionTitle: {
    en: "Lessons in Underground Communication",
    fr: "Leçons de Communication Souterraine",
    mi: "Ngā Akoranga i te Whakawhiti Kōrero o Raro Whenua",
    hi: "भूमिगत संचार में सबक",
    ga: "Ceachtanna sa Chumarsáid Faoi Thalamh",
    gd: "Leasanan ann an Conaltradh fon Talamh",
  },
  principlesContent: {
    en: "Operating in confined, dangerous spaces required clear, concise, and reliable message delivery. Innovations in signaling and message relay were vital. This emphasizes the need for robust, adaptable communication channels within Kiwi-ops.",
    fr: "Opérer dans des espaces confinés et dangereux exigeait une transmission de messages claire, concise et fiable. Les innovations en matière de signalisation et de relais de messages étaient vitales. Cela souligne le besoin de canaux de communication robustes et adaptables au sein de Kiwi-ops.",
    mi: "Ko te mahi i ngā wāhi kuiti, mōrearea i hiahia ki te tuku karere mārama, poto, me te pono. He mea nui ngā auahatanga i roto i te tohu me te tuku karere. Ka whakanuia tēnei i te hiahia mo ngā hongere whakawhiti kōrero pakari, ka taea te urutau i roto i a Kiwi-ops.",
    hi: "संकीर्ण, खतरनाक स्थानों में काम करने के लिए स्पष्ट, संक्षिप्त और विश्वसनीय संदेश वितरण की आवश्यकता थी। सिग्नलिंग और संदेश रिले में नवाचार महत्वपूर्ण थे। यह किवी-ऑप्स के भीतर मजबूत, अनुकूलनीय संचार चैनलों की आवश्यकता पर जोर देता है।",
    ga: "Chun oibriú i spásanna cúnga, contúirteacha bhí gá le teachtaireachtaí soiléire, gonta, agus iontaofa a sheachadadh. Bhí nuálaíochtaí i gcomharthaíocht agus i reilítear teachtaireachtaí ríthábhachtach. Cuireann sé seo béim ar an ngá atá le cainéil chumarsáide láidre, inoiriúnaithe laistigh de Kiwi-ops.",
    gd: "Dh'fheumadh obair ann an àiteachan cuibhrichte, cunnartach lìbhrigeadh teachdaireachd soilleir, goirid, agus earbsach. Bha ùr-ghnàthachadh ann an comharrachadh agus ath-tharraing teachdaireachd deatamach. Tha seo a' cur cuideam air an fheum air sianalan conaltraidh làidir, sùbailte taobh a-staigh Kiwi-ops.",
  },
  applicationSectionTitle: {
    en: "Kiwi-ops: Lessons in Operational Clarity",
    fr: "Kiwi-ops : Leçons de Clarté Opérationnelle",
    mi: "Kiwi-ops: Ngā Akoranga i te Mārama Mahi",
    hi: "किवी-ऑप्स: परिचालन स्पष्टता में सबक",
    ga: "Kiwi-ops: Ceachtanna i Soiléireacht Oibríochtúil",
    gd: "Kiwi-ops: Leasanan ann an Soilleireachd Obrachaidh",
  },
  applicationContent: {
    en: "Inspired by the tunnelers' precision, Kiwi-ops features 'Briefing Channels' for streamlined communication, 'Role-Based Directives' for clear responsibilities, and 'Secure Message Relay' options to ensure mission-critical intel is delivered flawlessly.",
    fr: "Inspiré par la précision des tunneliers, Kiwi-ops propose des 'Canaux de Briefing' pour une communication rationalisée, des 'Directives Basées sur les Rôles' pour des responsabilités claires, et des options de 'Relais de Messages Sécurisés' pour garantir la livraison impeccable des informations cruciales pour la mission.",
    mi: "I whakahihiri e te tika o ngā tunneler, ka whakaratohia e Kiwi-ops ngā 'Hongere Whakamōhio' mō te whakawhiti kōrero pai, 'Ngā Tohutohu e Hāngai ana ki te Tūnga' mō ngā kawenga mārama, me ngā kōwhiringa 'Tuku Karere Haumaru' kia tika ai te tuku o ngā mōhiohio whakahirahira mō te misioni.",
    hi: "सुरंगकर्मियों की सटीकता से प्रेरित होकर, किवी-ऑप्स सुव्यवस्थित संचार के लिए 'ब्रीफिंग चैनलों', स्पष्ट जिम्मेदारियों के लिए 'भूमिका-आधारित निर्देशों', और मिशन-महत्वपूर्ण इंटेल की त्रुटिहीन डिलीवरी सुनिश्चित करने के लिए 'सुरक्षित संदेश रिले' विकल्प प्रदान करता है।",
    ga: "Arna spreagadh ag cruinneas na dtollánairí, cuireann Kiwi-ops 'Cainéil Achomaireachta' ar fáil le haghaidh cumarsáide sruthlínithe, 'Treoracha Bunaithe ar Róil' le haghaidh freagrachtaí soiléire, agus roghanna 'Seachadadh Teachtaireachta Slán' chun a chinntiú go seachadtar intleacht ríthábhachtach don mhisean gan locht.",
    gd: "Air a bhrosnachadh le mionaideachd nan cladhairean, tha Kiwi-ops a' tabhann 'Sianalan Brìofa' airson conaltradh sgiobalta, 'Stiùiridhean Stèidhichte air Dreuchd' airson dleastanasan soilleir, agus roghainnean 'Ath-tharraing Teachdaireachd Tèarainte' gus dèanamh cinnteach gun tèid fiosrachadh deatamach do mhisean a lìbhrigeadh gu h-iomlan.",
  },
};

function getWellingtonTranslation<K extends keyof typeof wellingtonTranslations>(key: K, lang: LanguageCode): string {
  const translations = wellingtonTranslations[key] as Record<string, string>;
  return translations?.[lang] || translations?.en || '';
}

const WellingtonInspirationPage: React.FC = () => {
  const { language } = useLanguage();
  const { theme } = useTheme();

  // Définition des couleurs basée sur le thème
  const backgroundColor = theme === 'dark' ? '#1f2937' : '#ffffff';
  const textColor = theme === 'dark' ? '#E0E0E0' : '#111827';
  const cardBgColor = theme === 'dark' ? '#2A2A3A' : '#F8F8F8';
  const borderColor = theme === 'dark' ? '#555555' : '#e5e7eb';
  const highlightColor = theme === 'dark' ? '#FFD700' : '#DAA520'; // Or ou doré pour Wellington
  const highlightColorLight = theme === 'dark' ? 'rgba(255,215,0,0.3)' : 'rgba(218,165,32,0.2)';

  return (
    <div
      className={styles.container}
      style={{
        '--kiwi-background-page': backgroundColor,
        '--kiwi-text-primary': textColor,
        '--kiwi-background-card': cardBgColor,
        '--kiwi-border-color': borderColor,
        '--kiwi-highlight-color': highlightColor,
        '--kiwi-highlight-color-light': highlightColorLight,
      } as React.CSSProperties}
    >
      <h1 className={styles.headline}>{getWellingtonTranslation('headline', language)}</h1>
      <p className={styles.description}>{getWellingtonTranslation('description', language)}</p>

      <section className={styles.contentSection}>
        <h2>{getWellingtonTranslation('principlesSectionTitle', language)}</h2>
        <p>{getWellingtonTranslation('principlesContent', language)}</p>
      </section>

      <section className={styles.contentSection}>
        <h2>{getWellingtonTranslation('applicationSectionTitle', language)}</h2>
        <p>{getWellingtonTranslation('applicationContent', language)}</p>
      </section>

      {/* Tu pourrais ajouter plus de contenu ici, des images, des schémas, etc. */}
    </div>
  );
};

export default WellingtonInspirationPage;