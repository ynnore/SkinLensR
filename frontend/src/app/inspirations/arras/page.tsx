'use client';

import React from 'react';
import styles from './arras.module.css'; // Corrected: import du CSS spécifique
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { LanguageCode } from '@/types';

// Objet de traduction pour cette page spécifique : Arras et ses mémoriaux
const arrasTranslations = {
  headline: {
    en: "Arras: A City Forged by Memory and Resilience",
    fr: "Arras : Une Ville Forgée par la Mémoire et la Résilience",
    mi: "Arras: He Tāone i Hangaia e te Mahara me te Manawaroa",
    hi: "अर्रास: स्मृति और लचीलेपन से गढ़ा गया एक शहर",
    ga: "Arras: Cathair a Chumadh le Cuimhne agus Athléimneacht",
    gd: "Arras: Baile air a Chruthachadh le Cuimhne is Seasmhachd",
  },
  description: {
    en: "Beyond the trenches, Arras stands as a testament to historical resilience and a beacon for understanding the complexities of conflict and remembrance.",
    fr: "Au-delà des tranchées, Arras témoigne de la résilience historique et sert de phare pour comprendre les complexités des conflits et du souvenir.",
    mi: "I tua atu i ngā taonga whawhai, ka tū a Arras hei tohu mo te manawaroa o mua, hei rama hoki mo te māramatanga ki ngā raruraru o te pakanga me te mahara.",
    hi: "खाइयों से परे, अर्रास ऐतिहासिक लचीलेपन का एक वसीयतनामा और संघर्ष और स्मरण की जटिलताओं को समझने के लिए एक प्रकाशस्तंभ के रूप में खड़ा है।",
    ga: "Thar na trinsí, seasann Arras mar fhianaise ar athléimneacht stairiúil agus mar sholas chun castachtaí coinbhleachta agus cuimhneacháin a thuiscint.",
    gd: "Seachad air na trainnsichean, tha Arras na theisteanas air seasmhachd eachdraidheil agus na sholas airson tuigse fhaighinn air iom-fhillteachd còmhstri agus cuimhneachaidh.",
  },
  sitesSectionTitle: {
    en: "Key Memorial Sites Around Arras",
    fr: "Sites Mémoriels Clés Autour d'Arras",
    mi: "Ngā Wāhi Mahara Matua A Tawhio noa i Arras",
    hi: "अर्रास के आसपास के प्रमुख स्मारक स्थल",
    ga: "Príomhshuíomhanna Cuimhneacháin Timpeall Arras",
    gd: "Prìomh Làraich Cuimhneachaidh timcheall Arras",
  },
  sitesContent: {
    en: "The Vimy Ridge Memorial, the Carrière Wellington, and the Arras Memorial itself are poignant reminders of the sacrifices made and the lessons learned. Each site offers a unique perspective on the historical events and their human impact.",
    fr: "Le Mémorial de Vimy, la Carrière Wellington, et le Mémorial d'Arras sont autant de rappels poignants des sacrifices consentis et des leçons tirées. Chaque site offre une perspective unique sur les événements historiques et leur impact humain.",
    mi: "Ko te Māmōriana o Te Waimapi, te Carrière Wellington, me te Māmōriana o Arras tonu he whakamaharatanga mamae o ngā patunga i mahia me ngā akoranga i akohia. Ka tuku ia wāhi i tētahi tirohanga ahurei ki ngā kaupapa hītori me ōna pānga ki te tangata.",
    hi: "विमी रिज मेमोरियल, कैरियर वेलिंगटन, और स्वयं अर्रास मेमोरियल किए गए बलिदानों और सीखे गए सबक की मार्मिक याद दिलाते हैं। प्रत्येक स्थल ऐतिहासिक घटनाओं और उनके मानवीय प्रभाव पर एक अनूठा परिप्रेक्ष्य प्रदान करता है।",
    ga: "Is iad Cuimneachán Chnoc Vimy, Carrière Wellington, agus Cuimneachán Arras féin meabhrúcháin ghéara ar na híobairtí a rinneadh agus ar na ceachtanna a foghlaimíodh. Cuireann gach suíomh peirspictíocht uathúil ar fáil ar na himeachtaí stairiúla agus ar a dtionchar daonna.",
    gd: "Tha Carragh-cuimhne Druim Vimy, an Carrière Wellington, agus Carragh-cuimhne Arras fhèin nan cuimhneachain ghòrach air na h-ìobairtean a rinn iad agus na leasanan a dh'ionnsaich iad. Tha gach làrach a' tabhann sealladh sònraichte air na tachartasan eachdraidheil agus an droch bhuaidh daonna.",
  },
  inspirationSectionTitle: {
    en: "Arras's Influence on Kiwi-ops: Resilience and Collective Action",
    fr: "L'Influence d'Arras sur Kiwi-ops : Résilience et Action Collective",
    mi: "Te Pānga o Arras ki Kiwi-ops: Te Manawaroa me te Mahi Ngātahi",
    hi: "किवी-ऑप्स पर अर्रास का प्रभाव: लचीलापन और सामूहिक कार्रवाई",
    ga: "Tionchar Arras ar Kiwi-ops: Athléimneacht agus Gníomh Comhchoiteann",
    gd: "Buaidh Arras air Kiwi-ops: Seasmhachd is Gnìomh Coitcheann",
  },
  inspirationContent: {
    en: "The spirit of unity and determination shown in Arras underscores Kiwi-ops' commitment to fostering collaborative environments. Our platform aims to facilitate shared understanding and collective problem-solving, much like the coordinated efforts required in complex historical contexts.",
    fr: "L'esprit d'unité et de détermination manifesté à Arras souligne l'engagement de Kiwi-ops à favoriser les environnements collaboratifs. Notre plateforme vise à faciliter la compréhension partagée et la résolution collective des problèmes, à l'image des efforts coordonnés nécessaires dans des contextes historiques complexes.",
    mi: "Ko te wairua o te kotahitanga me te kaha i whakaatuhia i Arras e whakanui ana i te kaha o Kiwi-ops ki te poipoi i ngā taiao mahi tahi. Ko tā mātou papa mahi ko te whakangāwari i te māramatanga tahi me te whakaoti rapanga ngātahi, pērā anō me ngā mahi tahi e hiahiatia ana i roto i ngā horopaki hītori uaua.",
    hi: "अर्रास में प्रदर्शित एकता और दृढ़ संकल्प की भावना किवी-ऑप्स की सहयोगी वातावरण को बढ़ावा देने की प्रतिबद्धता को रेखांकित करती है। हमारा मंच साझा समझ और सामूहिक समस्या-समाधान की सुविधा प्रदान करना चाहता है, जैसे जटिल ऐतिहासिक संदर्भों में आवश्यक समन्वित प्रयास।",
    ga: "Cuireann spiorad an aontais agus na diongbháilteachta a léiríodh in Arras béim ar thiomantas Kiwi-ops do thimpeallachtaí comhoibríocha a chothú. Tá sé mar aidhm ag ár n-ardán tuiscint chomhroinnte agus réiteach fadhbanna comhchoiteann a éascú, cosúil leis na hiarrachtaí comhordaithe a theastaíonn i gcomhthéacsanna stairiúla casta.",
    gd: "Tha spiorad aonachd is diongmhaltas a chaidh a shealltainn ann an Arras a' daingneachadh dealas Kiwi-ops a thaobh àrainneachdan co-obrachaidh a bhrosnachadh. Tha an àrd-ùrlar againn ag amas air tuigse cho-roinnte agus fuasgladh trioblaid choitcheann a dhèanamh comasach, coltach ri na h-oidhirpean co-òrdanaichte a tha a dhìth ann an co-theacsan eachdraidheil iom-fhillte.",
  },
};

function getArrasTranslation<K extends keyof typeof arrasTranslations>(key: K, lang: LanguageCode): string {
  const translations = arrasTranslations[key] as Record<string, string>;
  return translations?.[lang] || translations?.en || '';
}

const ArrasInspirationPage: React.FC = () => {
  const { language } = useLanguage();
  const { theme } = useTheme();

  // Définition des couleurs basée sur le thème
  const backgroundColor = theme === 'dark' ? '#1f2937' : '#ffffff';
  const textColor = theme === 'dark' ? '#E0E0E0' : '#111827';
  const cardBgColor = theme === 'dark' ? '#2A2A3A' : '#F8F8F8';
  const borderColor = theme === 'dark' ? '#555555' : '#e5e7eb';
  const highlightColor = theme === 'dark' ? '#CD7F32' : '#B87333'; // Bronze/terre pour Arras (général)
  const highlightColorLight = theme === 'dark' ? 'rgba(205,127,50,0.3)' : 'rgba(184,115,51,0.2)';

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
      <h1 className={styles.headline}>{getArrasTranslation('headline', language)}</h1>
      <p className={styles.description}>{getArrasTranslation('description', language)}</p>

      <section className={styles.contentSection}>
        <h2>{getArrasTranslation('sitesSectionTitle', language)}</h2>
        <p>{getArrasTranslation('sitesContent', language)}</p>
      </section>

      <section className={styles.contentSection}>
        <h2>{getArrasTranslation('inspirationSectionTitle', language)}</h2>
        <p>{getArrasTranslation('inspirationContent', language)}</p>
      </section>

      {/* Tu pourrais ajouter plus de contenu ici, des images, des schémas, etc. */}
    </div>
  );
};

export default ArrasInspirationPage;