'use client';

import React from 'react';
import styles from './lorette.module.css'; // Changement ici : import du CSS spécifique
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { LanguageCode } from '@/types';

// Objet de traduction pour cette page spécifique
const loretteTranslations = {
  headline: {
    en: "Notre-Dame de Lorette: Unity for the Future",
    fr: "Notre-Dame de Lorette : L'Unisson pour l'Avenir",
    mi: "Te Whare Karakia o Te Wahine Tapu o Lorette: Kotahitanga mō te Anamata",
    hi: "नोत्र-दाम डे लोरेट: भविष्य के लिए एकता",
    ga: "Notre-Dame de Lorette: Aontas don Todhchaí",
    gd: "Notre-Dame de Lorette: Aonachd airson an Ama Ri Teachd",
  },
  description: {
    en: "Explore the spirit of peace, unity, and remembrance from Notre-Dame de Lorette, inspiring the cohesion features of Kiwi-ops.",
    fr: "Explorez l'esprit de paix, d'unité et de mémoire de Notre-Dame de Lorette, inspirant les fonctionnalités de cohésion de Kiwi-ops.",
    mi: "Torotoro i te wairua o te rangimārie, te kotahitanga, me te maharatanga mai i te Whare Karakia o Te Wahine Tapu o Lorette, e whakahihiri ana i ngā āhuatanga kotahitanga o Kiwi-ops.",
    hi: "नोत्र-दाम डे लोरेट से शांति, एकता और स्मरण की भावना का अन्वेषण करें, जो किवी-ऑप्स की एकजुटता सुविधाओं को प्रेरित करती है।",
    ga: "Déan iniúchadh ar spiorad na síochána, na haontachta, agus an chuimhne ó Notre-Dame de Lorette, a spreagann gnéithe comhtháthaithe Kiwi-ops.",
    gd: "Rannsaich spiorad sìth, aonachd, agus cuimhneachaidh bho Notre-Dame de Lorette, a' brosnachadh feartan co-leanailteachd Kiwi-ops.",
  },
  unitySectionTitle: {
    en: "Foundations of Unity and Reconciliation",
    fr: "Les Fondements de l'Unité et de la Réconciliation",
    mi: "Ngā Pūtake o te Kotahitanga me te Whakaoranga",
    hi: "एकता और सुलह के आधार",
    ga: "Bunúsacha na hAontachta agus an Athmhuintearais",
    gd: "Bunaitean Aonachd agus Ath-rèiteachaidh",
  },
  unityContent: {
    en: "Notre-Dame de Lorette symbolizes the transformation of past conflicts into a space for dialogue, understanding, and mutual respect. This vision promotes an application where diverse voices can find common ground and build together.",
    fr: "Notre-Dame de Lorette symbolise la transformation des conflits passés en un espace de dialogue, de compréhension et de respect mutuel. Cette vision promeut une application où des voix diverses peuvent trouver un terrain d'entente et construire ensemble.",
    mi: "Ko Te Whare Karakia o Te Wahine Tapu o Lorette te tohu o te hurihanga o ngā pakanga o mua hei wāhi mō te kōrero, te māramatanga, me te whakaute tahi. Ka whakatairanga tēnei tirohanga i tētahi tono ka taea e ngā reo rerekē te kimi i te wāhi tahi me te hanga tahi.",
    hi: "नोत्र-दाम डे लोरेट पिछले संघर्षों को संवाद, समझ और आपसी सम्मान के लिए एक स्थान में बदलने का प्रतीक है। यह दृष्टि एक ऐसे एप्लिकेशन को बढ़ावा देती है जहाँ विभिन्न आवाजें सामान्य आधार पा सकें और एक साथ निर्माण कर सकें।",
    ga: "Siombailíonn Notre-Dame de Lorette claochlú coinbhleachtaí san am atá caite ina spás le haghaidh idirphlé, tuisceana, agus meas frithpháirteach. Cuireann an fhís seo feidhmchlár chun cinn inar féidir le guthanna éagsúla talamh coitianta a aimsiú agus a thógáil le chéile.",
    gd: "Tha Notre-Dame de Lorette a' samhlachadh cruth-atharrachadh còmhstri san àm a dh'fhalbh gu bhith na àite airson còmhradh, tuigse, agus spèis dha chèile. Tha an sealladh seo a' brosnachadh tagradh far am faod guthain eadar-dhealaichte talamh cumanta a lorg agus togail còmhla.",
  },
  symbolismSectionTitle: {
    en: "The Symbolism of the Memorial and its Lessons",
    fr: "Le Symbolisme du Mémorial et ses Leçons",
    mi: "Te Waitohu o te Maharatanga me ōna Akoranga",
    hi: "स्मारक का प्रतीकवाद और उसके सबक",
    ga: "Siombalachas an Chuimhneacháin agus a Cheachtanna",
    gd: "Samhlachadh a' Chuimhneachain agus a Leasanan",
  },
  symbolismContent: {
    en: "The graves and shared spaces at Notre-Dame de Lorette speak of collective memory, resilience, and the enduring hope for a future free from division. This inspires Kiwi-ops to be a platform where past discussions inform future progress and community bonds are strengthened.",
    fr: "Les tombes et les espaces partagés à Notre-Dame de Lorette évoquent la mémoire collective, la résilience et l'espoir durable d'un avenir sans division. Cela inspire Kiwi-ops à être une plateforme où les discussions passées éclairent les progrès futurs et où les liens communautaires sont renforcés.",
    mi: "Ko ngā urupā me ngā wāhi tiri i Te Whare Karakia o Te Wahine Tapu o Lorette e kōrero ana mō te maharatanga tahi, te pakari, me te tūmanako pūmau mō tētahi anamata kore wehewehe. Ka whakahihiri tēnei i a Kiwi-ops kia noho hei papa ka taea e ngā kōrero o mua te whakamōhio i te ahunga whakamua o muri, ka whakakaha hoki i ngā here hapori.",
    hi: "नोत्र-दाम डे लोरेट में कब्रें और साझा स्थान सामूहिक स्मृति, लचीलेपन और विभाजन से मुक्त भविष्य के लिए स्थायी आशा की बात करते हैं। यह किवी-ऑप्स को एक ऐसा मंच बनने के लिए प्रेरित करता है जहाँ पिछली चर्चाएँ भविष्य की प्रगति को सूचित करती हैं और सामुदायिक संबंध मजबूत होते हैं।",
    ga: "Labhraíonn na huaigheanna agus na spásanna comhroinnte ag Notre-Dame de Lorette faoi chuimhne chomhchoiteann, athléimneacht, agus an dóchas marthanach do thodhchaí saor ó roinnt. Spreagann sé seo Kiwi-ops chun a bheith ina ardán ina gcuireann pléití anuas le dul chun cinn sa todhchaí agus ina neartaítear naisc pobail.",
    gd: "Tha uaighean is àiteachan co-roinnte aig Notre-Dame de Lorette a' bruidhinn air cuimhne chruinne, seasmhachd, agus an dòchas maireannach airson àm ri teachd saor bho sgaradh. Tha seo a' brosnachadh Kiwi-ops a bhith na àrd-ùrlar far am bi còmhraidhean san àm a dh'fhalbh a' toirt fiosrachadh do dh'adhartas san àm ri teachd agus far a bheil ceanglaichean coimhearsnachd air an neartachadh.",
  },
  applicationSectionTitle: {
    en: "Kiwi-ops and the Community Spirit",
    fr: "Kiwi-ops et l'Esprit Communautaire",
    mi: "Kiwi-ops me te Wairua Hapori",
    hi: "किवी-ऑप्स और सामुदायिक भावना",
    ga: "Kiwi-ops agus Spiorad an Phobail",
    gd: "Kiwi-ops agus Spiorad na Coimhearsnachd",
  },
  applicationContent: {
    en: "Through 'Support Channels' for mutual aid, 'Collective Memory Archives' to preserve valuable discussions, and 'Recognition Features' to foster positive interactions, Kiwi-ops builds a chat environment where unity and constructive collaboration thrive.",
    fr: "Grâce aux 'Canaux de Soutien' pour l'aide mutuelle, aux 'Archives de Mémoire Collective' pour préserver les discussions précieuses, et aux 'Fonctionnalités de Reconnaissance' pour favoriser les interactions positives, Kiwi-ops construit un environnement de chat où l'unité et la collaboration constructive prospèrent.",
    mi: "Mā ngā 'Hongere Tautoko' mō te āwhina tahi, 'Ngā Putunga Maharatanga Tahi' hei tiaki i ngā kōrero whai hua, me ngā 'Āhuatanga Whakaōrite' hei whakatairanga i ngā taunekeneke pai, ka hangaia e Kiwi-ops he taiao kōrero ka puta te kotahitanga me te mahi tahi tōtika.",
    hi: "आपसी सहायता के लिए 'समर्थन चैनलों', मूल्यवान चर्चाओं को संरक्षित करने के लिए 'सामूहिक स्मृति अभिलेखागार', और सकारात्मक बातचीत को बढ़ावा देने के लिए 'मान्यता सुविधाओं' के माध्यम से, किवी-ऑप्स एक चैट वातावरण का निर्माण करता है जहाँ एकता और रचनात्मक सहयोग पनपता है।",
    ga: "Trí 'Cainéil Tacaíochta' le haghaidh cúnamh frithpháirteach, 'Cartlanna Cuimhne Chomhchoiteann' chun pléití luachmhara a chaomhnú, agus 'Gnéithe Aitheatas' chun idirghníomhaíochtaí dearfacha a chothú, tógann Kiwi-ops timpeallacht comhrá ina n-éiríonn leis an aontas agus leis an gcomhoibriú cuiditheach.",
    gd: "Tro 'Sianalan Taic' airson taic dha chèile, 'Tasglannan Cuimhne Coitcheann' gus còmhraidhean luachmhor a ghlèidheadh, agus 'Feartan Aithneachaidh' gus eadar-obrachaidhean adhartach a bhrosnachadh, tha Kiwi-ops a' togail àrainneachd cabadaich far a bheil aonachd is co-obrachadh torrach a' soirbheachadh.",
  },
};

function getLoretteTranslation<K extends keyof typeof loretteTranslations>(key: K, lang: LanguageCode): string {
  const translations = loretteTranslations[key] as Record<string, string>;
  return translations?.[lang] || translations?.en || '';
}

const LoretteInspirationPage: React.FC = () => {
  const { language } = useLanguage();
  const { theme } = useTheme();

  // Définition des couleurs basée sur le thème
  const backgroundColor = theme === 'dark' ? '#1f2937' : '#ffffff';
  const textColor = theme === 'dark' ? '#E0E0E0' : '#111827';
  const cardBgColor = theme === 'dark' ? '#2A2A3A' : '#F8F8F8';
  const borderColor = theme === 'dark' ? '#555555' : '#e5e7eb';
  const highlightColor = theme === 'dark' ? '#A2A2A2' : '#6A6A6A'; // Gris apaisant pour Lorette
  const highlightColorLight = theme === 'dark' ? 'rgba(162,162,162,0.3)' : 'rgba(106,106,106,0.2)';

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
      <h1 className={styles.headline}>{getLoretteTranslation('headline', language)}</h1>
      <p className={styles.description}>{getLoretteTranslation('description', language)}</p>

      <section className={styles.contentSection}>
        <h2>{getLoretteTranslation('unitySectionTitle', language)}</h2>
        <p>{getLoretteTranslation('unityContent', language)}</p>
      </section>

      <section className={styles.contentSection}>
        <h2>{getLoretteTranslation('symbolismSectionTitle', language)}</h2>
        <p>{getLoretteTranslation('symbolismContent', language)}</p>
      </section>

      <section className={styles.contentSection}>
        <h2>{getLoretteTranslation('applicationSectionTitle', language)}</h2>
        <p>{getLoretteTranslation('applicationContent', language)}</p>
      </section>

      {/* Tu pourrais ajouter des images du site, des citations, etc. */}
    </div>
  );
};

export default LoretteInspirationPage;