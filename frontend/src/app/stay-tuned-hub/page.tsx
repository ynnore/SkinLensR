'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { LanguageCode } from '@/types';
import styles from './stay-tuned-hub.module.css';

import {
    FaTwitter, FaDiscord, FaYoutube, FaLinkedin, FaGithub, FaInstagram, FaTiktok,
    FaMapMarkerAlt, FaGlobe, FaSearch, FaRocket, FaHandshake, FaLightbulb,
    FaRobot // Ajout de l'icône de robot
} from 'react-icons/fa';

// Import de Link pour la navigation interne de Next.js
import Link from 'next/link';

// SVG minimaliste pour X (inchangé)
const XIcon = ({ size = 18 }: { size?: number }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
        <path d="M18 2h3l-7.5 9 7.5 11h-3l-6-9-6 9H3l7.5-11L3 2h3l6 8z"/>
    </svg>
);

// Objet de traduction COMPLET ET ÉTENDU (TRADUCTIONS AFRIKAANS CORRIGÉES)
const allTranslations = {
    stayTuned: {
        headline: {
            en: 'Kiwi-ops Mission Control: The Strategic Hub',
            fr: 'Centre de Mission Kiwi-ops : Le Hub Stratégique',
            mi: 'Te Pokapū Misioni Kiwi-ops: Te Whare Rautaki',
            hi: 'किवी-ऑप्स मिशन कंट्रोल: रणनीतिक हब',
            ga: 'Ionad Rialaithe Misean Kiwi-ops: An Mol Straitéiseach',
            gd: 'Ionad Smachd Misean Kiwi-ops: An Iomlaid Ro-innleachdail',
            'fr-CA': 'Centre de Mission Kiwi-ops : Le Hub Stratégique',
            'en-AU': 'Kiwi-ops Mission Control: The Strategic Hub',
            'en-CA': 'Kiwi-ops Mission Control: The Strategic Hub',
            'en-NZ': 'Kiwi-ops Mission Control: The Strategic Hub',
            'en-ZA': 'Kiwi-ops Mission Control: The Strategic Hub',
            af: 'Kiwi-ops Sendingbeheer: Die Strategiese Spil',
        },
        intro: {
            en: 'Your direct line to our core vision, operational principles, and future trajectory. Discover how we navigate the ecosystem of users, partners, and investors with AI-driven strategies.',
            fr: 'Notre vision fondamentale, nos principes opérationnels et notre trajectoire future. Découvrez comment nous naviguons dans l\'écosystème des utilisateurs, partenaires et investisseurs avec des stratégies basées sur l\'IA.',
            mi: 'Tō rārangi tika ki te mōhiohio huna, ngā whakahōutanga pāpori, me ō mātou whakahihiri matua.',
            hi: 'हमारे मुख्य दृष्टिकोण, परिचालन सिद्धांतों और भविष्य की दिशा के लिए आपकी सीधी रेखा। जानें कि हम एआई-संचालित रणनीतियों के साथ उपयोगकर्ताओं, भागीदारों और निवेशकों के पारिस्थितिकी तंत्र को कैसे नेविगेट करते हैं।',
            ga: 'Do líne dhíreach lenár bhfís lárnach, prionsabail oibríochta, agus conair amach anseo. Faigh amach conas a nascfaimid éiceachóras na n-úsáideoirí, na gcomhphàirtichean, agus na n-infheisteoirí le straitéisí faoi stiúir AI.',
            gd: 'Do loidhne dhìreach gu ar prìomh lèirsinn, prionnsapalan obrachaidh, agus slighe san àm ri teachd. Faigh a-mach mar a bhios sinn a\' seòladh eag-shiostam luchd-cleachdaidh, com-pàirtichean, agus luchd-tasgaidh le ro-innleachdan air an stiùireadh le AI.',
            'fr-CA': 'Notre vision fondamentale, nos principes opérationnels et notre trajectoire future. Découvrez comment nous naviguons dans l\'écosystème des utilisateurs, partenaires et investisseurs avec des stratégies basées sur l\'IA.',
            'en-AU': 'Your direct line to our core vision, operational principles, and future trajectory. Discover how we navigate the ecosystem of users, partners, and investors with AI-driven strategies.',
            'en-CA': 'Your direct line to our core vision, operational principles, and future trajectory. Discover how we navigate the ecosystem of users, partners, and investors with AI-driven strategies.',
            'en-NZ': 'Your direct line to our core vision, operational principles, and future trajectory. Discover how we navigate the ecosystem of users, partners, and investors with AI-driven strategies.',
            'en-ZA': 'Your direct line to our core vision, operational principles, and future trajectory. Discover how we navigate the ecosystem of users, vennote, en beleggers navigeer met KI-gedrewe strategieë.',
            af: "U direkte lyn na ons kernvisie, operasionele beginsels, en toekomstige trajek. Ontdek hoe ons die ekosisteem van gebruikers, vennote, en beleggers navigeer met KI-gedrewe strategieë.", // CORRECTION ICI
        },
        socialsTab: {
            en: 'Social Intel',
            fr: 'Intel Social',
            mi: 'Intel Hapori',
            hi: 'सामाजिक इंटेल',
            ga: 'Intel Sóisialta',
            gd: 'Intel Sòisealta',
            cy: 'Gwybodaeth Gymdehasol',
            'fr-CA': 'Intel Social',
            af: 'Sosiale Intel',
        },
        inspirationsTab: {
            en: 'Our Inspirations',
            fr: 'Nos Inspirations',
            mi: 'Ō Mātou Whakahihiri',
            hi: 'हमारी प्रेरणाएँ',
            ga: 'Ár nInspioráidí',
            gd: 'Na Brosnachaidhean Againn',
            cy: 'Ein Hysbrydoliaethau',
            'fr-CA': 'Nos Inspirations',
            af: 'Ons Inspirasies',
        },
        rechercheTab: {
            en: 'Search Archives',
            fr: 'Rechercher',
            mi: 'Rapu',
            ga: 'Cuardaigh',
            hi: 'खोजें',
            gd: 'Rannsaich',
            cy: 'Chwilio',
            'fr-CA': 'Rechercher',
            af: 'Soek Argiewe',
        },
        socialSectionTitle: {
            en: 'Mission Social Networks',
            fr: 'Réseaux Sociaux de la Mission',
            mi: 'Ngā Whatunga Pāpori Misioni',
            hi: 'मिशन सोशल नेटवर्क',
            ga: 'Líonraí Sóisealta Misean',
            gd: 'Lìonraidhean Sòisealta Misean',
            'fr-CA': 'Réseaux Sociaux de la Mission',
            af: 'Sending Sosiale Netwerke',
        },
        visionMissionTab: {
            en: 'Our Vision & Mission',
            fr: 'Notre Vision & Mission',
            mi: 'Tō Mātou Tirohanga & Misioni',
            hi: 'हमारी दृष्टि और मिशन',
            ga: 'Ár bhFís & Misean',
            gd: 'Ar Lèirsinn & Misean',
        },
        ecosystemTab: {
            en: 'Ecosystem & Partnerships',
            fr: 'Écosystème & Partenariats',
            mi: 'Pūnaha Rauropi & Ngā Hononga',
            hi: 'पारिस्थितिकी तंत्र और भागीदारी',
            ga: 'Éiceachóras & Comhpháirtíochtaí',
            gd: 'Eag-shiostam & Com-pàirteachasan',
        },
        aiStrategyTab: {
            en: 'AI & Agentic Strategy',
            fr: 'Stratégie IA & Agentique',
            mi: 'IA me te Rautaki Kaiwhakahaere',
            hi: 'एआई और एजेंटिक रणनीति',
            ga: 'AI & Straitéis Ghníomhaíoch',
            gd: 'AI & Ro-innleachd Gnìomhach',
        },
        missionSectionHeadline: {
            en: 'Our Core Mission: Orchestrating Intelligence',
            fr: 'Notre Mission Fondamentale : Orchestrer l\'Intelligence',
            mi: 'Tō Mātou Misioni Matua: Te Whakamahi i te Māramatanga',
            hi: 'हमारा मुख्य मिशन: बुद्धिमत्ता का समन्वय',
            ga: 'Ár gCód Misean: Intleacht a Eagrú',
            gd: 'Ar Prìomh Mhisean: Fiosrachadh a Cho-òrdanachadh',
        },
        missionSectionContent: {
            en: 'Kiwi-ops is dedicated to transforming complex data into actionable intelligence, empowering users, partners, and investors with predictive insights and streamlined operations. We aim to create an autonomous, intelligent agent that drives efficiency and growth.',
            fr: 'Kiwi-ops se consacre à la transformation de données complexes en intelligence actionnable, en dotant les utilisateurs, partenaires et investisseurs d\'informations prédictives et d\'opérations rationalisées. Nous visons à créer un agent autonome et intelligent qui favorise l\'efficacité et la croissance.',
            mi: 'E whakatapua ana a Kiwi-ops ki te huri i ngā raraunga uaua ki te māramatanga ka taea te mahi, e whakamana ana i ngā kaiwhakamahi, ngā hoa mahi, me ngā kaipupuri pūtea me ngā mōhiohio matapae me ngā mahi whakahaere. Ka whai mātou ki te waihanga i tētahi kaihoko motuhake, mārama hoki e whakatairanga ana i te pai o te mahi me te tipu.',
            hi: 'किवी-ऑप्स जटिल डेटा को कार्रवाई योग्य बुद्धिमत्ता में बदलने के लिए समर्पित है, जो उपयोगकर्ताओं, भागीदारों और निवेशकों को भविष्य कहनेवाला अंतर्दृष्टि और सुव्यवस्थित संचालन के साथ सशक्त बनाता है। हमारा लक्ष्य एक स्वायत्त, बुद्धिमान एजेंट बनाना है जो दक्षता और विकास को बढ़ावा देता है।',
            ga: 'Tá Kiwi-ops tiomnaithe do shonraí casta a chlaochlú go hintleacht inghníomhaithe, ag cumhachtú úsáideoirí, comhpháirtithe, agus infheisteoirí le léargais réamhaisnéiseacha agus oibríochtaí sruthlínithe. Tá sé mar aimh againn gníomhaire uathrialach, cliste a chruthú a thiomáineann éifeachtúlacht agus fás.',
            gd: 'Tha Kiwi-ops air a choisrigeadh do dhàta iom-fhillte a thionndadh gu fiosrachadh gnìomhach, a\' toirt cumhachd do luchd-cleachdaidh, com-pàirtichean, agus luchd-tasgaidh le lèirsinn ro-innseach agus gnìomhachd sgiobalta. Tha sinn ag amas air neach-ionaid fèin-riaghlaidh, tuigseach a chruthachadh a tha a\' stiùireadh èifeachdas agus fàs.',
            af: "Kiwi-ops is toegewyd daaraan om komplekse data te omskep in uitvoerbare intelligensie, wat gebruikers, vennote en beleggers bemagtig met voorspellende insigte en vaartbelynde bedrywighede. Ons doel is om 'n outonome, intelligente agent te skep wat doeltreffendheid en groei dryf.", // CORRECTION ICI (guillemets doubles)
        },
        ecosystemSectionHeadline: {
            en: 'Ecosystem & Value Proposition',
            fr: 'Écosystème & Proposition de Valeur',
            mi: 'Pūnaha Rauropi & Tūnga Uara',
            hi: 'पारिस्थितिकी तंत्र और मूल्य प्रस्ताव',
            ga: 'Éiceachóras & Tairiscint Luacha',
            gd: 'Eag-shiostam & Moladh Luach',
        },
        ecosystemSectionContent: {
            en: 'We cultivate a symbiotic relationship where users gain unparalleled insights, partners access innovative tools, and investors see sustained growth. Our AI model acts as the central intelligence, optimizing interactions for all stakeholders.',
            fr: 'Nous cultivons une relation symbiotique où les utilisateurs obtiennent des informations inégalées, les partenaires accèdent à des outils innovants, et les investisseurs constatent une croissance soutenue. Notre modèle d\'IA agit comme l\'intelligence centrale, optimisant les interactions pour toutes les parties prenantes.',
            mi: 'Ka poipoi mātou i tētahi hononga pūnaha rauropi e whiwhi ai ngā kaiwhakamahi i ngā mōhiohio kore rīwhi, ka uru ngā hoa mahi ki ngā taputapu auaha, ka kite ngā kaipupuri pūtea i te tipu tonu. Ka mahi tō mātou tauira IA hei māramatanga matua, e whakapai ake ana i ngā taunekeneke mō ngā rōpū whai pānga katoa.',
            hi: 'हम एक सहजीवी संबंध विकसित करते हैं जहाँ उपयोगकर्ताओं को अद्वितीय अंतर्दृष्टि प्राप्त होती है, भागीदारों को अभिनव उपकरणों तक पहुंच मिलती है, और निवेशक निरंतर विकास देखते हैं। हमारा एआई मॉडल केंद्रीय बुद्धिमत्ता के रूप में कार्य करता है, सभी हितधारकों के लिए बातचीत का अनुकूलन करता है।',
            ga: 'Cothaímid caidreamh siombóiseach ina mbaineann úsáideoirí léargais gan sárú, ina dtugann comhpháirtithe rochtain ar uirlisí nuálacha, agus ina bhfeiceann infheisteoirí fás leanúnach. Feidhmíonn ár múnla AI mar an intleacht lárnach, ag barrfheabhsú idirghníomhaíochtaí do gach geallsealbhóir.',
            gd: 'Tha sinn a\' fàs dàimh shamhlachail far am bi luchd-cleachdaidh a\' faighinn sealladh gun choimeas, far am bi com-pàirtichean a\' faighinn cothrom air innealan ùr-ghnàthach, agus far am bi luchd-tasgaidh a\' faicinn fàs seasmhach. Tha am modail AI againn ag obair mar am fiosrachadh meadhanach, a\' dèanamh an fheum as fheàrr de eadar-obrachaidhean airson a h-uile neach-ùidh.',
            af: "Ons kweek 'n simbiotiese verhouding waar gebruikers ongeëwenaarde insigte verkry, vennote toegang kry tot innoverende gereedskap, en beleggers volgehoue groei sien. Ons KI-model dien as die sentrale intelligensie, wat interaksies vir alle belanghebbendes optimaliseer.", // CORRECTION ICI (guillemets doubles)
        },
        aiStrategySectionHeadline: {
            en: 'AI & Agentic Strategy: From Battlefield to Dataflow',
            fr: 'Stratégie IA & Agentique : Du Champ de Bataille au Flux de Données',
            mi: 'IA me te Rautaki Kaiwhakahaere: Mai i te Papa Pakanga ki te Rere Raraunga',
            hi: 'एआई और एजेंटिक रणनीति: युद्ध के मैदान से डेटाप्रवाह तक',
            ga: 'AI & Straitéis Ghníomhaíoch: Ó Pháirc an Chatha go Sreabhadh Sonraí',
            gd: 'AI & Ro-innleachd Gnìomhach: Bho Raon-catha gu Sruth-dàta',
        },
        aiStrategySectionContent: {
            en: 'Inspired by military "push strategies" – proactive deployment, rapid intelligence synthesis, and decisive action – our AI agents are designed to operate with autonomy. They gather, process, and act upon data with minimal human intervention, ensuring optimal resource allocation and preemptive problem-solving. This agentic behavior allows Kiwi-ops to be not just a tool, but a dynamic, intelligent entity.',
            fr: 'Inspirés par les "stratégies de poussée" militaires – déploiement proactif, synthèse rapide du renseignement et action décisive – nos agents IA sont conçus pour fonctionner avec autonomie. Ils collectent, traitent et agissent sur les données avec une intervention humaine minimale, assurant une allocation optimale des ressources et une résolution préemptive des problèmes. Ce comportement agentique permet à Kiwi-ops d\'être non seulement un outil, mais une entité dynamique et intelligente.',
            mi: 'I whakahihiri e ngā "rautaki pana" a te hoia – te tuku mahi, te whakahiatotanga o te mōhiohio, me te mahi whakatau – kua hoahoatia ā mātou kaihoko IA kia mahi motuhake. Ka kohi, ka tukatuka, ka mahi hoki i runga i ngā raraunga me te iti rawa o te wawaotanga a te tangata, me te whakarite i te tohatoha rauemi tino pai me te whakaoti rapanga i mua. Ka taea e tēnei whanonga kaiwhakahaere a Kiwi-ops kia kore noa hei taputapu, engari hei hinonga hihiri, mārama hoki.',
            hi: 'सैन्य "पुश रणनीतियों" से प्रेरित होकर – सक्रिय परिनियोजन, तीव्र बुद्धिमत्ता संश्लेषण, और निर्णायक कार्रवाई – हमारे एआई एजेंटों को स्वायत्तता के साथ काम करने के लिए डिज़ाइन किया गया है। वे न्यूनतम मानवीय हस्तक्षेप के साथ डेटा एकत्र करते हैं, संसाधित करते हैं और उस पर कार्य करते हैं, जिससे इष्टतम संसाधन आवंटन और पूर्वव्यापी समस्या-समाधान सुनिश्चित होता है। यह एजेंटिक व्यवहार किवी-ऑप्स को न केवल एक उपकरण, बल्कि एक गतिशील, बुद्धिमान इकाई बनने की अनुमति देता है।',
            ga: 'Arna spreagadh ag "straitéisí brú" míleata – imscaradh réamhghníomhach, sintéis tapa faisnéise, agus gníomh cinnte – tá ár ngníomhairí AI deartha chun oibriú le huathriail. Bailíonn, próiseálann, agus gníomhaíonn siad ar shonraí le hidirghabháil íosta dhaonna, ag cinntiú leithdhàileadh acmhainní barrmhaith agus réiteach fadhbanna réamhghníomhach. Ligeann an t-iompar gníomhaíoch seo do Kiwi-ops a bhith ní hamháin mar uirlis, ach mar eintiteas dinimiciúil, cliste.',
            gd: 'Air a bhrosnachadh le "ro-innleachdan putaidh" armailteach – cleachdadh ro-ghnìomhach, co-chur fiosrachaidh luath, agus gnìomh cinnteach – tha na riochdairean AI againn air an dealbhadh gus obrachadh gu fèin-riaghlaidh. Bidh iad a\' cruinneachadh, a\' giullachd, agus a\' gnìomhachadh air dàta le glè bheag de eadar-theachd daonna, a\' dèanamh cinnteach gu bheil cuairteachadh stòrasan as fheàrr agus fuasgladh cheistean ro-ghnìomhach. Tha an giùlan gnìomhach seo a\' leigeil le Kiwi-ops a bhith chan e a-mhàin inneal, ach eintiteas fiùghantach, tuigseach.',
            af: "Geïnspireer deur militêre \"stootstrategieë\" – proaktiewe ontplooiing, vinnige intelligensiesintese en beslissende aksie – is ons KI-agente ontwerp om met outonomie te funksioneer. Hulle versamel, verwerk en tree op data op met minimale menslike ingryping, wat optimale hulpbrontoewysing en voorkomende probleemoplossing verseker. Hierdie agentiese gedrag stel Kiwi-ops in staat om nie net 'n instrument te wees nie, maar 'n dinamiese, intelligente entiteit.", // CORRECTION ICI (guillemets doubles et guillemets échappés pour "stootstrategieë")
        },
        aiPostGenSectionHeadline: {
            en: 'AI-Powered Social Content Generation',
            fr: 'Génération de Contenu Social Assistée par l\'IA',
            mi: 'Te Whakapuakitanga Ihirangi Hapori e Hāpai ana i te IA',
            hi: 'एआई-संचालित सामाजिक सामग्री निर्माण',
            ga: 'Gineadh Ábhar Sóisialta faoi Chumas AI',
            gd: 'Gineadh Susbaint Sòisealta le Cumhachd AI',
        },
        aiPostGenSectionDescription: {
            en: 'Our upcoming AI agent will soon help you craft compelling social media posts, adapting content for each platform (Twitter, LinkedIn, Instagram, etc.) based on your strategic inputs and our core vision. Stay tuned!',
            fr: 'Notre futur agent IA vous aidera bientôt à créer des posts percutants pour les réseaux sociaux, en adaptant le contenu à chaque plateforme (Twitter, LinkedIn, Instagram, etc.) en fonction de vos inputs stratégiques et de notre vision fondamentale. Restez connecté !',
            mi: 'Ka awhina tō mātou kaihoko IA ā muri ake nei ki te hanga i ngā pou pāpori whakahihiri, e urutau ana i te ihirangi mō ia papa (Twitter, LinkedIn, Instagram, me ētahi atu) i runga i ō tātau tāuru rautaki me tō mātou tirohanga matua. Noho tūrei!',
            hi: 'हमारा आगामी एआई एजेंट जल्द ही आपको आकर्षक सोशल media पोस्ट बनाने में मदद करेगा, जो आपके रणनीतिक इनपुट और हमारी मुख्य दृष्टि के आधार पर प्रत्येक प्लेटफॉर्म (ट्विटर, लिंक्डइन, इंस्टाग्राम, आदि) के लिए सामग्री को अनुकूलित करेगा। बने रहें!',
            ga: 'Go luath, cabhróidh ár ngníomhaire AI leat postálacha meán sóisialta láidre a chruthú, ag oiriúint an ábhair do gach ardán (Twitter, LinkedIn, Instagram, srl.) bunaithe ar d\'ionchuir straitéiseacha agus ár bhfís lárnach. Fan tiúin!',
            gd: 'A dh\'aithghearr, cuidichidh an riochdaire AI againn thu a\' cruthachadh puist meadhanan sòisealta tarraingeach, ag atharrachadh susbaint airson gach àrd-ùrlar (Twitter, LinkedIn, Instagram, msaa.) stèidhichte air na cur-a-steach ro-innleachdail agad, et ar prìomh lèirsinn. Fuirichibh deiseil!',
            af: "Ons toekomstige KI-agent sal jou binnekort help om boeiende sosialemediaplasings te skep, wat inhoud vir elke platform (Twitter, LinkedIn, Instagram, ens.) aanpas op grond van jou strategiese insette en ons kernvisie. Bly ingeskakel!", // CORRECTION ICI (guillemets doubles)
        },
        featureOnBuilding: {
            en: 'Feature in Development',
            fr: 'Fonctionnalité en Cours de Développement',
            mi: 'Āhuatanga kei te Whakawhanaketanga',
            hi: 'विकास में सुविधा',
            ga: 'Gnéithe á bhForbú',
            gd: 'Feart fo Leasachadh',
            af: 'Funksie in Ontwikkeling', // CORRECTION ICI (guillemets doubles)
        }
    },
    inspirations: {
        arrasMemorials: {
            en: 'Arras (General Memorials)',
            fr: 'Arras (Mémoriaux Généraux)',
            mi: 'Arras (Ngā Mahara Whānui)',
            hi: 'अर्रास (सामान्य स्मारक)',
            ga: 'Arras (Cuimneacháin Ghinearálta)',
            gd: 'Arras (Carragh-cuimhne Coitcheann)',
            af: 'Arras (Algemene Gedenktekens)', // CORRECTION ICI (guillemets doubles)
        },
        wellingtonTunnelers: {
            en: 'Wellington Tunnelers (Strategic Communication)',
            fr: 'Tunneliers de Wellington (Communication Stratégique)',
            mi: 'Ngā Tunneler o Pōneke (Whakawhiti Kōrero Rautaki)',
            hi: 'वेलिंगटन सुरंगकर्मी (रणनीतिक संचार)',
            ga: 'Tollánairí Wellington (Cumarsáid Straitéiseach)',
            gd: 'Cladhairean Wellington (Conaltradh Ro-innleachdail)',
            af: 'Wellington Tunnelaars (Strategiese Kommunikasie)', // CORRECTION ICI (guillemets doubles)
        },
        notreDameLorette: {
            en: 'Notre-Dame-de-Lorette (French National Necropolis)',
            fr: 'Nécropole Nationale de Notre-Dame-de-Lorette',
            mi: 'Nécropole Nationale de Notre-Dame-de-Lorette',
            hi: 'नोत्र-दाम-डे-लोरेट (फ्रांसीसी राष्ट्रीय कब्रिस्तान)',
            ga: 'Nécropole Nationale de Notre-Dame-de-Lorette',
            gd: 'Nécropole Nationale de Notre-Dame-de-Lorette',
            af: 'Notre-Dame-de-Lorette (Franse Nasionale Nekropolis)', // CORRECTION ICI (guillemets doubles)
        },
        wellingtonUrl: 'https://en.wikipedia.org/wiki/Wellington_Tunnel',
        loretteUrl: 'https://en.wikipedia.org/wiki/Notre-Dame-de-Lorette_French_National_Cemetery',
    },
    recherche: {
        headline: {
            en: 'Search Mission Archives',
            fr: 'Rechercher dans les Archives',
            mi: 'Rapu i ngā Putunga Misioni',
            hi: 'मिशन अभिलेखागार खोजें',
            ga: 'Cuardaigh Cartlanna Misin',
            gd: 'Rannsaich Tasglannan Misean',
            af: 'Soek Missie Argiewe', // CORRECTION ICI (guillemets doubles)
        },
        placeholder: {
            en: 'Enter keyword, agent name, or mission date...',
            fr: 'Entrez un mot-clé, nom d\'agent, ou date de mission...',
            mi: 'Whakauruhia he kupumatua, ingoa kaihoko, rā misioni rānei...',
            hi: 'कीवर्ड, एजेंट का नाम, या मिशन की तारीख दर्ज करें...',
            ga: 'Cuir isteach eochairfhocal, ainm gníomhaire, nó dáta misin...',
            gd: 'Cuir a-steach facal-luirg, ainm riochdaire, no ceann-latha misean...',
            af: 'Voer sleutelwoord, agentnaam, of missiedatum in...', // CORRECTION ICI (guillemets doubles)
        },
        loading: {
            en: 'Searching classified archives...',
            fr: 'Recherche dans les archives classifiées...',
            mi: 'Te rapu i ngā putunga huna...',
            hi: 'वर्गीकृत अभिलेखागार खोज रहा है...',
            ga: 'Ag cuardach cartlann aicmithe...',
            gd: 'A\' rannsachadh tasglannan clasaichte...',
            af: 'Soek geklassifiseerde argiewe...', // CORRECTION ICI (guillemets doubles)
        },
        noResults: {
            en: 'No documents found for',
            fr: 'Aucun document trouvé pour',
            mi: 'Karekau he tuhinga i kitea mo',
            hi: 'के लिए कोई दस्तावेज़ नहीं मिला',
            ga: 'Níor aimsíodh aon doiciméad do',
            gd: 'Cha deach sgrìobhainn sam bith a lorg airson',
            af: 'Geen dokumente gevind vir', // CORRECTION ICI (guillemets doubles)
        },
    },
};

function getTranslation<S extends keyof typeof allTranslations, K extends keyof typeof allTranslations[S]>(
    section: S, key: K, lang: LanguageCode
): string {
    const translations = (allTranslations[section] as any)?.[key];
    // Assurez-vous que l'objet de traduction pour la clé existe et qu'il a la langue demandée ou 'en'
    if (translations && typeof translations === 'object' && translations !== null) {
        return translations[lang] || translations.en || `[${String(section)}.${String(key)}]`;
    }
    // Fallback plus robuste si la traduction est invalide ou manquante
    console.warn(`Traduction manquante ou invalide pour: ${String(section)}.${String(key)} en langue ${lang}`);
    return `[Traduction Invalide: ${String(section)}.${String(key)}]`;
}


const StayTunedHubPage: React.FC = () => {
    const { language } = useLanguage();
    const { theme } = useTheme();

    const [activeTab, setActiveTab] = useState<'socials' | 'inspirations' | 'recherche' | 'visionMission' | 'ecosystem' | 'aiStrategy'>('visionMission');
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);

    const handleSearch = () => {
        if (!searchTerm.trim()) return;
        setIsSearching(true);
        setSearchResults([]);
        setHasSearched(true);
        setTimeout(() => {
            const fakeResults = [
                { id: 1, title: `Rapport de Mission : ${searchTerm}`, snippet: 'Analyse des communications interceptées le 24/07. Agent Wellington a confirmé la cible...' },
                { id: 2, title: 'Fiche Agent : Walter Tull', snippet: 'Recruté pour ses capacités exceptionnelles, spécialisé dans les opérations de reconnaissance en territoire hostile...' },
                { id: 3, title: 'Archive : Tunneliers de Wellington', snippet: 'Plans originaux et journaux de bord relatifs à la construction du réseau souterrain à Arras...' },
            ];
            setSearchResults(fakeResults);
            setIsSearching(false);
        }, 1500);
    };

    const backgroundColor = theme === 'dark' ? '#1f2937' : '#ffffff';
    const textColor = theme === 'dark' ? '#E0E0E0' : '#111827';
    const sectionBgColor = theme === 'dark' ? '#2A2A3A' : '#F8F8F8';
    const borderColor = theme === 'dark' ? '#3e3e4f' : '#e5e7eb';
    const highlightColor = theme === 'dark' ? '#0070f3' : '#0070f3';

    return (
        <div
            className={styles.container}
            style={{
                '--kiwi-background-page': backgroundColor,
                '--kiwi-text-primary': textColor,
                '--kiwi-background-section': sectionBgColor,
                '--kiwi-border-color': borderColor,
                '--kiwi-highlight-color': highlightColor,
            } as React.CSSProperties}
        >
            <div className={styles.contentWrapper}>
                <h1 className={styles.headline}>{getTranslation('stayTuned', 'headline', language)}</h1>
                <p className={styles.intro}>{getTranslation('stayTuned', 'intro', language)}</p>

                <div className={styles.tabsContainer}>
                    <button
                        className={`${styles.tabButton} ${activeTab === 'visionMission' ? styles.activeTab : ''}`}
                        onClick={() => setActiveTab('visionMission')}
                    >
                        {getTranslation('stayTuned', 'visionMissionTab', language)}
                    </button>
                    <button
                        className={`${styles.tabButton} ${activeTab === 'ecosystem' ? styles.activeTab : ''}`}
                        onClick={() => setActiveTab('ecosystem')}
                    >
                        {getTranslation('stayTuned', 'ecosystemTab', language)}
                    </button>
                    <button
                        className={`${styles.tabButton} ${activeTab === 'aiStrategy' ? styles.activeTab : ''}`}
                        onClick={() => setActiveTab('aiStrategy')}
                    >
                        {getTranslation('stayTuned', 'aiStrategyTab', language)}
                    </button>
                    <button
                        className={`${styles.tabButton} ${activeTab === 'socials' ? styles.activeTab : ''}`}
                        onClick={() => setActiveTab('socials')}
                    >
                        {getTranslation('stayTuned', 'socialsTab', language)}
                    </button>
                    <button
                        className={`${styles.tabButton} ${activeTab === 'inspirations' ? styles.activeTab : ''}`}
                        onClick={() => setActiveTab('inspirations')}
                    >
                        {getTranslation('stayTuned', 'inspirationsTab', language)}
                    </button>
                    <button
                        className={`${styles.tabButton} ${activeTab === 'recherche' ? styles.activeTab : ''}`}
                        onClick={() => setActiveTab('recherche')}
                    >
                        {getTranslation('stayTuned', 'rechercheTab', language)}
                    </button>
                </div>

                <div className={styles.tabContent}>
                    {activeTab === 'visionMission' && (
                        <div className={styles.tabPanel}>
                            <h2 className={styles.panelTitle}>{getTranslation('stayTuned', 'missionSectionHeadline', language)}</h2>
                            <p className={styles.panelContentText}>{getTranslation('stayTuned', 'missionSectionContent', language)}</p>
                            <FaRocket className={styles.largeIcon} />
                        </div>
                    )}

                    {activeTab === 'ecosystem' && (
                        <div className={styles.tabPanel}>
                            <h2 className={styles.panelTitle}>{getTranslation('stayTuned', 'ecosystemSectionHeadline', language)}</h2>
                            <p className={styles.panelContentText}>{getTranslation('stayTuned', 'ecosystemSectionContent', language)}</p>
                            <div className={styles.iconGroup}>
                                <FaHandshake className={styles.largeIcon} />
                                <FaLightbulb className={styles.largeIcon} />
                            </div>
                        </div>
                    )}

                    {activeTab === 'aiStrategy' && (
                        <div className={styles.tabPanel}>
                            <h2 className={styles.panelTitle}>{getTranslation('stayTuned', 'aiStrategySectionHeadline', language)}</h2>
                            <p className={styles.panelContentText}>{getTranslation('stayTuned', 'aiStrategySectionContent', language)}</p>
                        </div>
                    )}

                    {activeTab === 'socials' && (
                        <div className={styles.tabPanel}>
                            <h2 className={styles.panelTitle}>{getTranslation('stayTuned', 'socialSectionTitle', language)}</h2>
                            <ul className={styles.socialList}>
                                <li><a href="https://x.com/KiwiOps" target="_blank" rel="noopener noreferrer" className={styles.socialLink}><XIcon /><span>X (Twitter)</span></a></li>
                                <li><a href="https://youtube.com/@KiwiOps" target="_blank" rel="noopener noreferrer" className={styles.socialLink}><FaYoutube /><span>YouTube</span></a></li>
                                <li><a href="https://www.linkedin.com/company/kiwiops" target="_blank" rel="noopener noreferrer" className={styles.socialLink}><FaLinkedin /><span>LinkedIn</span></a></li>
                                <li><a href="https://github.com/KiwiOps" target="_blank" rel="noopener noreferrer" className={styles.socialLink}><FaGithub /><span>GitHub</span></a></li>
                                <li><a href="https://www.instagram.com/KiwiOps" target="_blank" rel="noopener noreferrer" className={styles.socialLink}><FaInstagram /><span>Instagram</span></a></li>
                                <li><a href="https://www.tiktok.com/@KiwiOps" target="_blank" rel="noopener noreferrer" className={styles.socialLink}><FaTiktok /><span>TikTok</span></a></li>
                                <li><a href="https://discord.gg/KiwiOpsCommunity" target="_blank" rel="noopener noreferrer" className={styles.socialLink}><FaDiscord /><span>Discord</span></a></li>
                            </ul>

                            <div className={styles.featureBuildingSection}>
                                <h3 className={styles.featureBuildingTitle}>
                                    <FaRobot className={styles.featureBuildingIcon} />
                                    {getTranslation('stayTuned', 'aiPostGenSectionHeadline', language)}
                                </h3>
                                <p className={styles.featureBuildingDescription}>
                                    {getTranslation('stayTuned', 'aiPostGenSectionDescription', language)}
                                </p>
                                <span className={styles.featureBuildingStatus}>
                                    {getTranslation('stayTuned', 'featureOnBuilding', language)}
                                </span>
                            </div>
                        </div>
                    )}

                    {activeTab === 'inspirations' && (
                        <div className={styles.tabPanel}>
                            <h2 className={styles.panelTitle}>{getTranslation('stayTuned', 'inspirationsTab', language)}</h2>
                            <ul className={styles.inspirationList}>
                                <li>
                                    <Link href="/inspirations/arras" className={styles.inspirationLink}>
                                        <FaMapMarkerAlt />
                                        <span>{getTranslation('inspirations', 'arrasMemorials', language)}</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/inspirations/wellington" className={styles.inspirationLink}>
                                        <FaMapMarkerAlt />
                                        <span>{getTranslation('inspirations', 'wellingtonTunnelers', language)}</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/inspirations/lorette" className={styles.inspirationLink}>
                                        <FaGlobe />
                                        <span>{getTranslation('inspirations', 'notreDameLorette', language)}</span>
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    )}

                    {activeTab === 'recherche' && (
                        <div className={styles.tabPanel}>
                            <h2 className={styles.panelTitle}>{getTranslation('recherche', 'headline', language)}</h2>
                            <div className={styles.searchWrapper}>
                                <input
                                    type="text"
                                    className={styles.searchInput}
                                    placeholder={getTranslation('recherche', 'placeholder', language)}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                />
                                <button className={styles.searchButton} onClick={handleSearch} disabled={isSearching}>
                                    {isSearching ? '...' : <FaSearch />}
                                </button>
                            </div>

                            <div className={styles.searchResults}>
                                {isSearching && <p className={styles.loadingMessage}>{getTranslation('recherche', 'loading', language)}</p>}

                                {!isSearching && searchResults.length > 0 && (
                                    <ul className={styles.resultsList}>
                                        {searchResults.map(result => (
                                            <li key={result.id} className={styles.resultItem}>
                                                <h3 className={styles.resultTitle}>{result.title}</h3>
                                                <p className={styles.resultSnippet}>{result.snippet}</p>
                                            </li>
                                        ))}
                                    </ul>
                                )}

                                {!isSearching && searchResults.length === 0 && hasSearched && (
                                     <p className={styles.noResultsMessage}>{getTranslation('recherche', 'noResults', language)} "{searchTerm}"</p>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StayTunedHubPage;