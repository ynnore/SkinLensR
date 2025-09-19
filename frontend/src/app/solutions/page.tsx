'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaBars, FaDownload } from 'react-icons/fa';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageCode } from '@/types';
import styles from './solutions.module.css';

// --- DÉBUT DES TRADUCTIONS ET FONCTION getTranslation ---
const allTranslations = {
  header: {
    missionStatement: {
      en: "Inspired by the Wellington Tunnelers of Arras, our mission is to build in the shadows what will, tomorrow, break through to the surface.",
      fr: "Inspirés des tunneliers de Wellington à Arras, notre mission est de bâtir dans l’ombre ce qui, demain, percera la surface.",
      mi: "He mea whakahihiri mai i ngā kaikeri o raro o Te Whanganui-a-Tara ki Arras, ko tā mātou kaupapa he hanga i roto i te atarangi i ngā mea ka puta ki te mata āpōpopo.",
      ga: "Ar an taobh istigh de tholláin Wellington in Arras, is é ár misean tógáil sa scáth a bhrisfidh an dromchla amárach.",
      hi: "एरास में वेलिंगटन टनलर्स से प्रेरित होकर, हमारा मिशन छाया में वह निर्माण करना है जो कल सतह को भेद देगा।",
      gd: "Air a bhrosnachadh le Tunnelairean Wellington ann an Arras, is e ar misneachd togail anns an dubhar na nì, a-màireach, briseadh tro uachdar.",
      cy: "Wedi'u hysbrydoli gan Dwnelwyr Wellington yn Arras, ein cenhadaeth yw adeiladu yn y cysgodion yr hyn, yfory, a fydd yn torri trwy'r wyneb.",
      'en-AU': "Inspired by the Wellington Tunnelers of Arras, our mission is to build in the shadows what will, tomorrow, break through to the surface.",
      'en-NZ': "Inspired by the Wellington Tunnelers of Arras, our mission is to build in the shadows what will, tomorrow, break through to the surface.",
      'en-CA': "Inspired by the Wellington Tunnelers of Arras, our mission is to build in the shadows what will, tomorrow, break through to the surface.",
      'fr-CA': "Inspirés des tunneliers de Wellington à Arras, notre mission est de bâtir dans l’ombre ce qui, demain, percera la surface.",
      'en-ZA': "Inspired by the Wellington Tunneliers of Arras, our mission is to build in the shadows what will, tomorrow, break through to the surface.",
      af: "Geïnspireer deur die Wellington Tunneliers van Arras, is ons missie om in die skaduwees te bou wat môre deur die oppervlak sal breek.",
    },
    beta: {
      en: "Beta", fr: "Bêta", mi: "Beta", ga: "Béite", hi: "बीटा", gd: "Beta", cy: "Beta",
      'en-AU': "Beta", 'en-NZ': "Beta", 'en-CA': "Beta", 'fr-CA': "Bêta", 'en-ZA': "Beta", af: "Beta",
    }
  },
  chat: {
    welcomeMessage: { en: "Hello! I'm A.L.A.N...", fr: "Bonjour ! Je suis l'Agent L.I.O.N..." },
    thinking: { en: 'Agent is thinking...', fr: "Agent L.I.O.N. réfléchit..." },
    placeholder: { en: 'Type your message...', fr: 'Tapez votre message...' },
    militaryPackages: { en: 'Military Packages', fr: 'Paquetages Militaires' },
  },
  loginPage: {
    title: { en: 'Building in the shadows. Emerging for tomorrow.', fr: "Construire dans l’ombre. Émerger pour demain." },
    subtitle: { en: 'Kiwi-Ops. Intelligence that adapts to you', fr: "Kiwi-Ops. L’intelligence qui s’adapte à vous" },
    chatButton: { en: 'Get Started', fr: 'Démarrer' },
    chatTitle: { en: 'Chat with AI', fr: "Chat avec l'IA" },
    chatInputPlaceholder: { en: 'Write your message here...', fr: 'Écrivez votre message ici...' },
    installAppLabel: { en: 'Install App', fr: "Installer l'Application" },
    product: {
      en: 'Our Products',
      fr: 'Nos Produits',
      mi: 'Ā Mātou Hua',
      ga: 'Ár dTáirgí',
      hi: 'हमारे उत्पाद',
      gd: 'Ar Bathar',
      cy: 'Ein Cynhyrchion',
      af: 'Ons Produkte',
    },
    features: {
      en: 'The Platform',
      fr: 'La plateforme',
      mi: 'Te Paparanga',
      ga: 'An tArdán',
      hi: 'प्लेटफ़ॉर्म',
      gd: 'Am Plaicform',
      cy: 'Y Llwyfan',
      af: 'Die Platform',
    },
    story: {
      en: 'Our Story',
      fr: 'Notre Histoire',
      mi: 'Tō Mātou Kōrero',
      ga: 'Ár Scéal',
      hi: 'हमारी कहानी',
      gd: 'Ar Sgeulachd',
      cy: 'Ein Stori',
      af: 'Ons Verhaal',
    },
    search: {
      en: 'Our Solutions',
      fr: 'Nos solutions',
      mi: 'Ā Mātou Rongoā',
      ga: 'Ár Réitigh',
      hi: 'हमारे समाधान',
      gd: 'Ar Fuasglaidhean',
      cy: 'Ein Datrysiadau',
      af: 'Ons Oplossings',
    },
    team: {
      en: 'Our Team',
      fr: 'Notre Équipe',
      mi: 'Tō Mātou Kapa',
      ga: 'Ár bhFoireann',
      hi: 'हमारी टीम',
      gd: 'Ar Sgioba',
      cy: 'Ein Tîm',
      af: 'Ons Span',
    },
  },
  productPage: {
    hero: {
      title: { en: 'The Legacy of the Depths, The Intelligence of Tomorrow.', fr: 'L\'Héritage des Profondeurs, L\'Intelligence de Demain.' },
      subtitle: { en: 'Kiwi-Ops: The AI and Web3 platform that transforms raw data from your TBMs into operational certainty.', fr: 'Kiwi-Ops : La plateforme d\'IA et de Web3 qui transforme les données brutes de vos tunneliers en certitude opérationnelle.' },
      ctaButton: { en: 'Join the Beta Program', fr: 'Participez au Programme Bêta' },
    },
    challenge: {
      title: { en: 'Every Meter Counts. Every Hour of Downtime Costs.', fr: 'Chaque Mètre Compte. Chaque Heure d\'Arrêt Coûte.' },
      point1: { en: 'The nightmare of a stalled TBM: Millions lost in penalties and costs for a failure that could have been anticipated.', fr: 'Le cauchemar d\'un tunnelier à l\'arrêt : Des millions perdus en pénalités pour une panne qui aurait pu être anticipée.' },
      point2: { en: 'Opacity that erodes trust: How to prove progress and ensure total transparency to stakeholders and citizens?', fr: 'L\'opacité qui érode la confiance : Comment garantir une transparence totale aux investisseurs et aux citoyens ?' },
      point3: { en: 'The invisible risk: How to ensure maximum team safety in a constantly evolving underground environment?', fr: 'Le risque invisible : Comment assurer la sécurité maximale des équipes à des dizaines de mètres sous terre ?' },
    },
    solution: {
      title: { en: 'We don’t give you data. We give you Control.', fr: 'Nous ne vous donnons pas des données. Nous vous offrons la Maîtrise.' },
      pillar1Title: { en: 'Kiwi-Edge: Intelligence at the Frontline', fr: 'Kiwi-Edge : L\'Intelligence au Front' },
      pillar1Text: { en: 'Our NVIDIA Jetson-powered device installs directly on your TBM, analyzing data in real-time for instant anomaly detection and predictive maintenance, even offline.', fr: 'Notre boîtier, équipé NVIDIA Jetson, s\'installe sur votre tunnelier pour une détection d\'anomalies et une maintenance prédictive instantanées, même sans connexion.' },
      pillar2Title: { en: 'Kiwi-Cloud: The Strategic Vision', fr: 'Kiwi-Cloud : La Vision Stratégique' },
      pillar2Text: { en: 'Relevant data is synced to our secure GCP cloud platform. Our advanced Vertex AI models compare fleet-wide performance and continuously refine predictions.', fr: 'Les données pertinentes sont synchronisées sur notre plateforme cloud (GCP). Nos modèles d\'IA (Vertex AI) comparent les performances de toute votre flotte.' },
      pillar3Title: { en: 'Kiwi-Ledger: The Ledger of Trust', fr: 'Kiwi-Ledger : Le Registre de Confiance' },
      pillar3Text: { en: 'Every key event is certified by Kiwi-Edge and recorded on a Web3 ledger. It’s your immutable logbook, the irrefutable proof of your project’s progress.', fr: 'Chaque événement clé est certifié par le Kiwi-Edge et inscrit sur un registre Web3. C\'est votre journal de bord immuable et la preuve irréfutable de l\'avancement.' },
    },
    features: {
      title: {
        en: 'A Platform Designed for Performance and Simplicity',
        fr: 'Une Plateforme Conçue pour la Performance et la Simplicité',
        hi: 'प्रदर्शन और सरलता के लिए डिज़ाइन किया गया एक प्लेटफ़ॉर्म',
        mi: 'He Paparanga i Hangaia mo te Mahi me te Maamaa',
        ga: 'Ardán Deartha le haghaidh Feidhmíochta agus Simplíochta',
        gd: 'Àrd-ùrlar air a dhealbhadh airson coileanadh agus sìmplidheachd',
        cy: 'Llwyfan Wedi\'i Ddylunio ar gyfer Perfformiad a Symlrwydd',
        af: 'N Platform Ontwerp vir Prestasie en Eenvoud',
      },
      speedTitle: { en: 'Speed: From Data to Decision in Milliseconds', fr: 'Rapidité : De la Donnée à la Décision en Millisecondes' },
      speedText: { en: 'Our Edge AI architecture processes critical information where it happens: directly on the machine, enabling a proactive approach.', fr: 'Notre architecture Edge AI traite les informations critiques là où elles se produisent. Passez d\'un mode réactif à un mode proactif.' },
      securityTitle: { en: 'Security: Trust is Not an Option. It\'s a Guarantee.', fr: 'Sécurité : La Confiance n\'est pas une option. C\'est une garantie.' },
      securityText: { en: 'With cryptographically signed data (Web3) and a state-of-the-art infrastructure (GCP), we ensure the integrity of your data and operations.', fr: 'Avec des données signées cryptographiquement (Web3) et une infrastructure de pointe (GCP), nous garantissons l\'intégrité de vos opérations.' },
      integrationTitle: { en: 'Simple Integration: Designed for Your Reality, Not Ours.', fr: 'Intégration Simple : Conçu pour votre Réalité, pas pour la nôtre.' },
      integrationText: { en: 'Our Kiwi-Edge device is designed to connect to your existing sensor systems in a non-intrusive, plug & play approach.', fr: 'Notre boîtier Kiwi-Edge est conçu pour se connecter à vos systèmes de capteurs existants, via une approche non-intrusive et "plug & play".' },
    },
    search: {
      title: {
        en: 'Don\'t look for information. Get the answer.',
        fr: 'Ne cherchez plus l\'information. Obtenez la réponse.',
        hi: 'जानकारी न खोजें। उत्तर प्राप्त करें।',
        mi: 'Kaua e rapu mōhiohio. Tikina te whakautu.',
        ga: 'Ná lorg eolas. Faigh an freagra.',
        gd: 'Na seall airson fiosrachadh. Faigh am freagairt.',
        cy: 'Peidiwch â chwilio am wybodaeth. Cael yr ateb.',
        af: 'Moenie inligting soek nie. Kry die antwoord.',
      },
      subtitle: { en: 'Our Smart Search turns your archives into a 24/7 operational expert.', fr: 'Notre Recherche Intelligente transforme vos archives en un expert opérationnel disponible 24/7.' },
      text: { en: 'Ask a complex question in natural language and get a factual, sourced answer in seconds. Our A2A protocol dynamically routes your query to the best specialized AI models to find the right information, whether it\'s in technical reports, maintenance logs, or geological surveys.', fr: 'Posez une question complexe en langage naturel et obtenez une réponse factuelle et sourcée en secondes. Notre protocole A2A route dynamiquement votre requête vers les meilleurs modèles d\'IA spécialisés pour trouver l\'information, qu\'elle soit dans des rapports techniques, des logs ou des études géologiques.' },
    },
    story: {
      title: {
        en: 'Our Story',
        fr: 'Notre Histoire',
        hi: 'हमारी कहानी',
        mi: 'Tō mātou Kōrero',
        ga: 'Ár Scéal',
        gd: 'Ar Sgeulachd',
        cy: 'Ein Stori',
        af: 'Ons Verhaal',
      },
      subtitle: { en: 'Born from a legacy. Focused on the future.', fr: 'Nés d\'un héritage. Tournés vers l\'avenir.' },
      text: {
        en: 'Our story doesn\'t start with a line of code, but with the sound of a pickaxe in chalk. In Arras, 1917, the ingenuity of the Kiwi tunnellers was to make the invisible, visible. Today, we carry on this legacy. Where they listened to the earth, we apply AI. Kiwi-Ops is the bridge between the heritage of yesterday\'s tunnellers and the technology of tomorrow\'s builders. We believe that under every meter of earth lies a cultural heritage, an educational opportunity, and a form of art that our technology can reveal. We transform raw data from TBMs into operational certainty, integrating the art of anticipation, the richness of operational culture, and the power of data-driven education, extending this intelligence from the depths to critical operations across Air, Land, and Sea.',
        fr: 'Notre histoire ne commence pas avec du code, mais avec le son d\'une pioche dans la craie. Arras, 1917. L\'ingéniosité des sapeurs "Kiwis" était de rendre l\'invisible, visible. Aujourd\'hui, nous perpétuons cet héritage. Là où ils écoutaient la terre, nous appliquons l\'IA. Kiwi-Ops est le pont entre l\'héritage d\'hier et la technologie des bâtisseurs de demain. Nous croyons que sous chaque mètre de terre se cache un héritage culturel, une opportunité d\'éducation et une forme d\'art que notre technologie peut révéler. Nous transformons les données brutes des tunneliers en certitude opérationnelle, intégrant l\'art de l\'anticipation, la richesse de la culture opérationnelle et la puissance de l\'éducation par la donnée, étendant cette intelligence des profondeurs aux opérations critiques sur l\'Air, la Terre et la Mer.',
        hi: 'हमारी कहानी कोड की एक पंक्ति से नहीं, बल्कि चाक में एक कुदाल की आवाज से शुरू होती है। अरास में, 1917 में, कीवी सुरंग बनाने वालों की सरलता अदृश्य को दृश्यमान बनाना था। आज, हम इस विरासत को आगे बढ़ाते हैं। जहां वे पृथ्वी को सुनते थे, हम एआई लागू करते हैं। कीवी-ऑप्स कल के सुरंग बनाने वालों की विरासत और कल के बिल्डरों की तकनीक के बीच एक सेतु है। हम मानते हैं कि पृथ्वी के हर मीटर के नीचे एक सांस्कृतिक विरासत, एक शैक्षिक अवसर, और कला का एक रूप छिपा है जिसे हमारी तकनीक प्रकट कर सकती है। हम टीबीएम से कच्चे डेटा को परिचालन निश्चितता में बदलते हैं, प्रत्याशा की कला, परिचालन संस्कृति की समृद्धि, और डेटा-संचालित शिक्षा की शक्ति को एकीकृत करते हैं, इस बुद्धिमत्ता को गहराई से लेकर वायु, भूमि और समुद्र में महत्वपूर्ण संचालन तक विस्तारित करते हैं।',
        mi: 'Karekau tō mātou kōrero i tīmata i te rārangi waehere, engari ki te tangi a te toki i te tōtō. I Arras, 1917, ko te rawe o ngā kaikeri Kiwi he whakaputa i te mea huna kia kitea. I ēnei rā, kei te kawe tonu mātou i tēnei taonga tuku iho. I a rātou i whakarongo ki te whenua, ka whakamahi mātou i te AI. He piriti a Kiwi-Ops i waenganui i te taonga tuku iho o ngā kaikeri o mua, me te hangarau o ngā kaihanga o anamata. E whakapono ana mātou kei raro i ia mita o te whenua tētahi taonga tuku iho ahurea, tētahi whai wāhi mātauranga, me tētahi momo toi ka taea e tō mātou hangarau te whakaatu. Ka hurihia e mātou ngā raraunga mata mai i ngā TBM ki te tino mōhiotanga whakahaere, e whakauru ana i te toi o te tūponotanga, te taonga o te ahurea whakahaere, me te kaha o te mātauranga raraunga-akiaki, e toroa ana tēnei mātauranga mai i ngā hōhonutanga ki ngā mahi whakahirahira puta noa i te Hau, te Whenua, me te Moana.',
        ga: 'Ní thosaíonn ár scéal le líne cóid, ach le fuaim phiocóide sa chailc. In Arras, 1917, ba é intleacht na dtairní Kiwí an rud dofheicthe a dhéanamh infheicthe. Inniu, leanann muid ar an oidhreacht seo. Nuair a d\'éist siad leis an talamh, cuirimid AI i bhfeididhm. Is é Kiwi-Ops an droichead idir oidhreacht thairní an lae inné agus teicneolaíocht thógálaithe an lae amárach. Creidimid go bhfuil oidhreacht chultúrtha, deis oideachais, agus foirm ealaíne ceilte faoi gach méadar talún ar féidir lenár dteicneolaíocht a nochtadh. Déanaimid amhshonraí ó TBManna a athrú go cinnteacht oibriúcháin, ag comhtháthú ealaín an réamhaistrithe, saibhreas an chultúir oibriúcháin, agus cumhacht an oideachais bunaithe ar shonraí, ag leathnú an intleacht seo ó na doimhneachtaí go hoibríochtaí criticiúla trasna Aer, Talún, agus Mara.',
        gd: 'Cha tòisich ar sgeulachd le sreath de chòd, ach le fuaim pickaxe ann an clach-aoil. Ann an Arras, 1917, b\' e innleachd nan tunail Kiwí an rud do-fhaicsinneach a dhèanamh ri fhaicinn. An-dè, tha sinn a\' leantainn air an dualchas seo. Far an robh iad ag èisteachd ris an talamh, cuiridh sinn an sàs AI. Tha Kiwi-Ops an drochaid eadar dualchas luchd-tunail an-dè agus teicneòlas luchd-togail an-màireach. Tha sinn a\' creidsinn gu bheil dualchas cultarach, cothrom foghlaim, agus cruth ealain falaichte fo gach meatair de thalamh as urrainn don teicneòlas againn fhoillseachadh. Bidh sinn ag atharrachadh dàta amh bho TBMan gu cinnteachd obrachaidh, a\' toirt a-steach ealain an dùil, beairteas cultar obrachaidh, agus cumhachd foghlam stèidhichte air dàta, a\' leudachadh an tuigse seo bho na doimhneachdan gu gnìomhachdan èiginneach thar Adhair, Talmhainn, agus Muir.',
        cy: 'Nid gyda llinell o god y dechreuodd ein stori, ond gyda sŵn picell mewn sialc. Yn Arras, 1917, dyfeisgarwch y twneli Kiwï oedd gwneud y ddirgelwch yn weladwy. Heddiw, rydym yn parhau â\'r etifeddiaeth hon. Lle y gwrandawent ar y ddaear, rydym yn defnyddio AI. Mae Kiwi-Ops yn bont rhwng etifeddiaeth twneli ddoe a thechnoleg adeiladwyr yfory. Credwn fod etifeddiaeth ddiwylliannol, cyfle addysgol, a ffurf celfyddydol wedi\'u cuddio o dan bob metr o ddaear y gall ein technoleg eu datgelu. Rydym yn trawsnewid data crai o DBMau yn sicrwydd gweithredol, gan integreiddio celf ragweld, cyfoeth diwylliant gweithredol, a phŵer addysg a yrrir gan ddata, gan ymestyn y deallusrwydd hwn o\'r dyfnder i weithrediadau critigol ar draws Awyr, Tir, a Môr.',
        af: 'Ons storie begin nie met \'n reël kode nie, but met die geluid van \'n pik in kryt. In Arras, 1917, was die vindingrykheid van die Kiwi-tonnelgrawers om die onsigbare sigbaar te maak. Vandag dra ons hierdie nalatenskap voort. Waar hulle na die aarde geluister het, pas ons KI toe. Kiwi-Ops is die brug tussen die nalatenskap van gister se tonnelgrawers en die tegnologie van môre se bouers. Ons glo dat onder elke meter aarde \'n kulturele erfenis, \'n opvoedkundige geleentheid, en \'n vorm van kuns lê wat ons tegnologie kan openbaar. Ons omskep rou data van TBMs in operasionele sekerheid, deur die kuns van afwagting, die rykdom van operasionele kultuur, en die krag van data-gedrewe onderwys te integreer, en hierdie intelligensie uit die dieptes uit te brei na kritieke operasies oor Lug, Land, en See.',
      },
    },
    finalCta: {
      title: { en: 'Let\'s build the future of underground infrastructure together.', fr: 'Construisons ensemble le futur des infrastructures souterraines.' },
      subtitle: { en: 'Our technology is in beta with selected partners. If you believe innovation is born from audacity, contact us.', fr: 'Notre technologie est en bêta avec des partenaires sélectionnés. Si vous croyez que l\'innovation naît de l\'audace, contactez-nous.' },
      button: { en: 'Request a Strategic Demo', fr: 'Demander une démonstration stratégique' },
    },
    team: {
        title: { en: 'Our Team', fr: 'Notre Équipe' },
        subtitle: { en: 'Innovation driven by expertise and passion.', fr: 'L\'innovation portée par l\'expertise et la passion.' },
        member1Name: { en: '[Your Name]', fr: '[Votre Nom]' },
        member1Title: { en: 'CEO & Co-founder', fr: 'CEO & Co-fondateur' },
        member1Bio: {
            en: 'Visionary leader with X years of experience in underground engineering and project management. Spearheading Kiwi-Ops strategy and business development.',
            fr: 'Leader visionnaire avec X années d\'expérience en ingénierie souterraine et gestion de projet. Il dirige la stratégie et le développement commercial de Kiwi-Ops.'
        },
        member2Name: { en: '[Co-founder/CTO Name]', fr: '[Nom du Co-fondateur/CTO]' },
        member2Title: { en: 'CTO & Co-founder', fr: 'CTO & Co-fondateur' },
        member2Bio: {
            en: 'Tech wizard with a PhD in AI and Y years in software architecture. Drives the innovation behind Kiwi-Ops\' Edge AI, Cloud, and Web3 solutions.',
            fr: 'Génie technique avec un doctorat en IA et Y années en architecture logicielle. Il est le moteur de l\'innovation derrière les solutions Edge AI, Cloud et Web3 de Kiwi-Ops.'
        },
    }
  },
  solutionsPage: {
    title: {
      en: 'Our Solutions: Mastering Every Environment',
      fr: 'Nos Solutions : Maîtriser Chaque Environnement',
      hi: 'हमारे समाधान: हर वातावरण में महारत हासिल करना',
      mi: 'Ā Mātou Rongoā: Te Whakahaere i ia Taiao',
      ga: 'Ár Réitigh: Máistreacht ar Gach Timpeallacht',
      gd: 'Ar Fuasglaidhean: Maighstireachd air gach Àrainneachd',
      cy: 'Ein Datrysiadau: Meistroli Pob Amgylchedd',
      af: 'Ons Oplossings: Beheers Elke Omgewing',
    },
    subtitle: {
      en: 'Intelligent capabilities for Air, Land, and Sea operations.',
      fr: 'Capacités intelligentes pour les opérations aériennes, terrestres et maritimes.',
      hi: 'हवा, भूमि और समुद्री अभियानों के लिए बुद्धिमान क्षमताएं।',
      mi: 'Ngā kaha mō ngā mahi Rererangi, Whenua, me te Moana.',
      ga: 'Cumas cliste d\'oibríochtaí Aeir, Talún, agus Mara.',
      gd: 'Comasan inntleachdail airson gnìomhachasan Adhair, Talmhainn, agus Muir.',
      cy: 'Galluoedd deallus ar gyfer gweithrediadau Awyr, Tir, a Môr.',
      af: 'Intelligente vermoëns vir Lug-, Land- en See-operasies.',
    },
    airTitle: {
      en: 'Air Operations: Precision and Predictive Power',
      fr: 'Opérations Aériennes : Précision et Puissance Prédictive',
      hi: 'हवाई संचालन: सटीकता और पूर्वानुमान क्षमता',
      mi: 'Ngā Mahi Rererangi: Te Tino me te Mana Matapae',
      ga: 'Oibríochtaí Aeir: Cruinneas agus Cumhachd Réamhaisnéise',
      gd: 'Gnìomhachasan Adhair: Cruinneas agus Cumhachd Ro-innse',
      cy: 'Gweithrediadau Awyr: Cywirdeb a Phŵer Rhagfynegiadol',
      af: 'Lugoperasies: Presisie en Voorspellende Krag',
    },
    airText: {
      en: 'From drone fleet management to predictive maintenance of complex airborne systems, Kiwi-Ops ensures critical advantage in the skies.',
      fr: 'De la gestion de flottes de drones à la maintenance prédictive de systèmes aéroportés complexes, Kiwi-Ops assure un avantage critique dans les airs.',
      hi: 'ड्रोन बेड़े प्रबंधन से लेकर जटिल हवाई प्रणालियों के पूर्वानुमानित रखरखाव तक, कीवी-ऑप्स आसमान में महत्वपूर्ण लाभ सुनिश्चित करता है।',
      mi: 'Mai i te whakahaere waka rererangi kore tangata ki te tiaki matapae o ngā pūnaha rererangi matatini, ka whakarite a Kiwi-Ops i te painga nui i te rangi.',
      ga: 'Ó bhainistíocht cabhlach drone go cothabháil thuarthach córas casta aerbheirthe, cinntíonn Kiwi-Ops buntáiste ríthábhachtach sna spéartha.',
      gd: 'Bho rianachd cabhlach drone gu cumail suas ro-innseach siostaman adhair iom-fhillte, bidh Kiwi-Ops a\' dèanamh cinnteach gu bheil buannachd chudromach anns na speuran.',
      cy: 'O reolaeth fflyd dronau i gynnal a chadw rhagfynegol systemau awyr cymhleth, mae Kiwi-Ops yn sicrhau mantais hollbwysig yn yr awyr.',
      af: 'Van dreunvlootbestuur tot voorspellende instandhouding van komplekse lugstelsels, verseker Kiwi-Ops \'n kritieke voordeel in die lug.',
    },
    landTitle: {
      en: 'Land Operations: Groundbreaking Intelligence',
      fr: 'Opérations Terrestres : Intelligence de Terrain Révolutionnaire',
      hi: 'भूमि संचालन: अभूतपूर्व बुद्धिमत्ता',
      mi: 'Ngā Mahi Whenua: Te Mātauranga Whai Tikanga',
      ga: 'Oibríochtaí Talún: Faisnéis Nuálach ar an Talamh',
      gd: 'Gnìomhachasan Talmhainn: Inntleachd ùr-ghnàthach',
      cy: 'Gweithrediadau Tir: Deallusrwydd Arloesol ar y Ddaear',
      af: 'Landoperasies: Grondverskuiwende Intelligensie',
    },
    landText: {
      en: 'Beyond tunneling, our solutions empower terrestrial forces with predictive vehicle maintenance, advanced reconnaissance, and real-time environmental analysis.',
      fr: 'Au-delà du percement de tunnels, nos solutions renforcent les forces terrestres avec la maintenance prédictive des véhicules, la reconnaissance avancée et l\'analyse environnementale en temps réel.',
      hi: 'सुरंग बनाने से परे, हमारे समाधान पूर्वानुमानित वाहन रखरखाव, उन्नत टोही और वास्तविक समय के पर्यावरणीय विश्लेषण के साथ स्थलीय सेनाओं को सशक्त बनाते हैं।',
      mi: 'I tua atu i te keri hūrori, ka whakamanahia e ā mātou rongoā ngā ope whenua ki te tiaki matapae waka, te torotoro matatau, me te tātari taiao wā-tūturu.',
      ga: 'Thar na tairní, cuireann ár réitigh cumhacht ar fáil d\'fhórsaí talún le cothabháil thuarthach feithiclí, athmheasúnú chun cinn, agus anailís chomhshaoil fíor-ama.',
      gd: 'Seachad air tunail, tha na fuasglaidhean againn a\' cur cumhachd aig feachdan talmhainn le cumail suas ro-innseach charbadan, ath-ghnìomhachd adhartach, agus anailis àrainneachdail ann an àm fìor.',
      cy: 'Y tu hwnt i dwneli, mae ein datrysiadau yn grymuso lluoedd daearol gyda chynnal a chadw cerbydau rhagfynegol, archwiliad uwch, a dadansoddiad amgylcheddol amser real.',
      af: 'Behalwe tonnelbou, bemagtig ons oplossings landmagte met voorspellende voertuigonderhoud, gevorderde verkenning, en intydse omgewingsanalise.',
    },
    seaTitle: {
      en: 'Sea Operations: Depths of Data, Surface of Control',
      fr: 'Opérations Maritimes : Profondeurs de Données, Surface de Contrôle',
      hi: 'समुद्री संचालन: डेटा की गहराई, नियंत्रण की सतह',
      mi: 'Ngā Mahi Moana: Te Hōhonutanga o ngā Raraunga, Te Mata o te Mana Whakahaere',
      ga: 'Oibríochtaí Mara: Doimhneachtaí Sonraí, Dromchla Rialaithe',
      gd: 'Gnìomhachasan Muir: Doimhneachd Dàta, Uachdar Smachd',
      cy: 'Gweithrediadau Môr: Dyfnder Data, Wyneb Rheolaeth',
      af: 'See-operasies: Dieptes van Data, Oppervlak van Beheer',
    },
    seaText: {
      en: 'From subsurface monitoring to naval fleet optimization, Kiwi-Ops provides unparalleled situational awareness and operational efficiency for maritime domains.',
      fr: 'De la surveillance sous-marine à l\'optimisation de flottes navales, Kiwi-Ops offre une connaissance situationnelle et une efficacité opérationnelle inégalées pour les domaines maritimes.',
      hi: 'पानी के नीचे की निगरानी से लेकर नौसेना बेड़े के अनुकूलन तक, कीवी-ऑप्स समुद्री डोमेन के लिए अद्वितीय स्थितिजन्य जागरूकता और परिचालन दक्षता प्रदान करता है।',
      mi: 'Mai i te aroturuki i raro i te wai ki te whakatikatika waka moana, ka whakarato a Kiwi-Ops i te mohiotanga ā-horahanga kore e rite, me te whai hua whakahaere mō ngā wāhanga moana.',
      ga: 'Ó fhaireachán fomhuirí go barrfheabhsú cabhlach cabhlaigh, cuireann Kiwi-Ops feasacht staide gan samhail agus éifeachtúlacht oibriúcháin ar fáil do réimsí muirí.',
      gd: 'Bho sgrùdadh fo-mhuir gu optimization cabhlach cabhlaich, bidh Kiwi-Ops a\' toirt seachad tuigse staide gun choimeas agus èifeachdas obrachaidh airson raointean mara.',
      cy: 'O fonitro is-wyneb i optimeiddio fflyd llyngesol, mae Kiwi-Ops yn darparu ymwybyddiaeth sefyllfaol a effeithlonrwydd gweithredol heb ei hail ar gyfer meysydd morwrol.',
      af: 'Van onderwatermonitering tot vlootoptimisering, bied Kiwi-Ops ongeëwenaarde situasionele bewustheid en operasionele doeltreffendheid vir maritieme gebiede.',
    },
    operationalUseCasesTitle: {
      en: 'General Operational Use Cases',
      fr: 'Cas d\'Utilisation Opérationnels Généraux',
      mi: 'Ngā Take Whakamahi Mahi Whānui',
      ga: 'Cásanna Úsáide Oibriúla Ginearálta',
      hi: 'सामान्य परिचालन उपयोग के मामले',
      gd: 'Cùisean Cleachdaidh Obrachaidh Coitcheann',
      cy: 'Achosion Defnydd Gweithredol Cyffredinol',
      af: 'Algemene Operasionele Gebruiksgevalle',
    },
    operationalUseCasesAirTitle: {
      en: 'Air Operations',
      fr: 'Opérations Aériennes',
    },
    operationalUseCasesAirList: {
      en: [
        'Real-time drone mission optimization',
        'Predictive maintenance for aeronautical systems',
      ],
      fr: [
        'Optimisation des missions de drones en temps réel',
        'Prévention des pannes sur les systèmes aéronautiques',
      ],
    },
    operationalUseCasesLandTitle: {
      en: 'Land Operations',
      fr: 'Opérations Terrestres',
    },
    operationalUseCasesLandList: {
      en: [
        'Surveillance and security for underground works',
        'Reduced downtime through predictive maintenance',
      ],
      fr: [
        'Surveillance et sécurité lors de travaux souterrains',
        'Réduction des temps d’arrêt grâce à la maintenance prédictive',
      ],
    },
    operationalUseCasesSeaTitle: {
      en: 'Sea Operations',
      fr: 'Opérations Maritimes',
    },
    operationalUseCasesSeaList: {
      en: [
        'Precise tracking of vessels and maritime fleets',
        'Analysis and interpretation of underwater data for safety and efficiency',
      ],
      fr: [
        'Suivi précis des navires et flottes maritimes',
        'Analyse et interprétation de données sous-marines pour sécurité et efficacité',
      ],
    },
    countryUseCasesSectionTitle: {
      en: 'Global Impact: Solutions Tailored for Every Region',
      fr: 'Impact Global : Des Solutions Adaptées à Chaque Région',
      mi: 'Whakaawe Ao: Ngā Rongoā Motuhake mō ia Rohe',
      ga: 'Tionchar Domhanda: Réitigh Saincheaptha do Gach Réigiún',
      hi: 'वैश्विक प्रभाव: हर क्षेत्र के लिए अनुरूप समाधान',
      gd: 'Buaidh Cruinne: Fuasglaidhean air an dèanamh gu h-àraidh do Gach Roinn',
      cy: 'Effaith Byd-eang: Atebion Wedi\'u Teilwra ar gyfer Pob Rhanbarth',
      af: 'Globale Impak: Oplossings Aangepas vir Elke Streek',
    },
    countryUseCasesSectionSubtitle: {
      en: 'Kiwi-Ops delivers advanced intelligence capabilities designed to meet the unique challenges of diverse operational contexts across the globe.',
      fr: 'Kiwi-Ops fournit des capacités d\'intelligence avancées conçues pour relever les défis uniques des divers contextes opérationnels à travers le monde.',
      mi: 'Ka tukuna e Kiwi-Ops ngā kaha mōhiohio matatau i hangaia hei whakatutuki i ngā wero motuhake o ngā horopaki whakahaere rerekē puta noa i te ao.',
      ga: 'Soláthraíonn Kiwi-Ops cumais faisnéise chun cinn atá deartha chun freastal ar dhúshláin uathúla comhthéacsanna oibriúcháin éagsúla ar fud an domhain.',
      hi: 'कीवी-ऑप्स उन्नत खुफिया क्षमताएं प्रदान करता है जो दुनिया भर में विविध परिचालन संदर्भों की अनूठी चुनौतियों का सामना करने के लिए डिज़ाइन की गई हैं।',
      gd: 'Tha Kiwi-Ops a\' lìbhrigeadh comasan fiosrachaidh adhartach air an dealbhadh gus coinneachadh ri dùbhlachdan sònraichte co-theacsan obrachaidh eadar-dhealaichte air feadh na cruinne.',
      cy: 'Mae ein harbenigwyr ar gael i ddangos i chi sut y gall Kiwi-Ops drawsnewid eich gweithrediadau.',
      af: 'Kiwi-Ops lewer gevorderde intelligensie-vermoëns wat ontwerp is om aan die unieke uitdagings van diverse operasionele kontekste wêreldwyd te voldoen.',
    },
    ctaButtonExperts: {
      en: 'Contact Our Experts',
      fr: 'Contacter nos experts',
      mi: 'Whakapā atu ki Ō Mātou Mātanga',
      ga: 'Déan Teagmháil le hÁr nGairmithe',
      hi: 'हमारे विशेषज्ञों से संपर्क करें',
      gd: 'Cuir Fios gu na h-Eòlaichean againn',
      cy: 'Cysylltwch â\'n Harbenigwyr',
      af: 'Kontak Ons Kundiges',
    },
    ctaTitle: {
      en: 'Ready to take action?',
      fr: 'Prêt à passer à l’action ?',
      mi: 'Kua rite ki te mahi?',
      ga: 'Réidh le gníomhú?',
      hi: 'कार्रवाई करने के लिए तैयार हैं?',
      gd: 'Deiseil airson a dhol an gnìomh?',
      cy: 'Yn barod i weithredu?',
      af: 'Gereed om op te tree?',
    },
    ctaSubtitle: {
      en: 'Our experts are available to show you how Kiwi-Ops can transform your operations.',
      fr: 'Nos experts sont disponibles pour vous montrer comment Kiwi-Ops peut transformer vos opérations.',
      mi: 'E wātea ana ā mātou mātanga ki te whakaatu ki a koe me pēhea te Kiwi-Ops e huri ai i āu mahi.',
      ga: 'Tá ár saineolaithe ar fáil chun a thaispeáint duit conas is féidir le Kiwi-Ops do chuid oibríochtaí a athrú.',
      hi: 'हमारे विशेषज्ञ आपको यह दिखाने के लिए उपलब्ध हैं कि कैसे कीवी-ऑप्स आपके संचालन को बदल सकता है।',
      gd: 'Tha na h-eòlaichean againn rim faighinn gus sealltainn dhut mar as urrainn do Kiwi-Ops na gnìomhachasan agad atharrachadh.',
      cy: 'Mae ein harbenigwyr ar gael i ddangos i chi sut y gall Kiwi-Ops drawsnewid eich gweithrediadau.',
      af: 'Ons kundiges is beskikbaar om jou te wys hoe Kiwi-Ops jou bedrywighede kan transformeer.',
    },
    useCasesByCountry: {
      france: {
        title: { en: 'France: Securing Critical Infrastructure', fr: 'France : Sécurisation des Infrastructures Critiques' },
        description: { en: 'Kiwi-Ops enhances predictive maintenance for complex defense systems and urban surveillance, providing unparalleled precision for national security operations, ensuring resilience and rapid response in critical French infrastructures.', fr: 'Kiwi-Ops renforce la maintenance prédictive des systèmes de défense complexes et la surveillance urbaine, offrant une précision inégalée pour les opérations de sécurité nationale, garantissant résilience et réponse rapide dans les infrastructures critiques françaises.' },
        image: '/images/use-case-france.jpg'
      },
      uk: {
        title: { en: 'United Kingdom: Advancing Naval Intelligence', fr: 'Royaume-Uni : Avancées en Intelligence Navale' },
        description: { en: 'Supporting the Royal Navy with real-time subsurface data analysis for enhanced fleet optimization and maritime domain awareness, crucial for strategic missions in the UK waters.', fr: 'Soutien à la Royal Navy avec l\'analyse de données sous-marines en temps réel pour une optimisation accrue de la flotte et une meilleure connaissance du domaine maritime, essentielle pour les missions stratégiques dans les eaux britanniques.' },
        image: '/images/use-case-uk.jpg'
      },
      canada: {
        title: { en: 'Canada: Arctic Operations and Resource Management', fr: 'Canada : Opérations Arctiques et Gestion des Ressources' },
        description: { en: 'Providing critical environmental analysis and logistical support for remote Arctic operations and responsible resource exploration, vital for northern sovereignty and Canadian territories.', fr: 'Fourniture d\'analyses environnementales critiques et de support logistique pour les opérations arctiques éloignées et l\'exploration responsable des ressources, vital pour la souveraineté du nord et les territoires canadiens.' },
        image: '/images/use-case-canada.jpg'
      },
      southAfrica: {
        title: { en: 'South Africa: Enhancing Land Border Security', fr: 'Afrique du Sud : Renforcement de la Sécurité des Frontières Terrestres' },
        description: { en: 'Deploying advanced reconnaissance and predictive analytics for challenging land environments, improving border surveillance and protection against illicit activities effectively across South Africa.', fr: 'Déploiement de reconnaissance avancée et d\'analyses prédictives pour les environnements terrestres difficiles, améliorant la surveillance et la protection des frontières contre les activités illicites en Afrique du Sud.' },
        image: '/images/use-case-south-africa.jpg'
      },
      india: {
        title: { en: 'India: Modernizing Defense Capabilities', fr: 'Inde : Modernisation des Capacités de Défense' },
        description: { en: 'Empowering Indian forces with AI-driven insights for aerial mission planning, ground vehicle maintenance, and strategic maritime intelligence to ensure regional stability and national defense.', fr: 'Renforcement des forces indiennes avec des informations basées sur l\'AI pour la planification de missions aériennes, la maintenance de véhicules terrestres et l\'intelligence maritime stratégique afin d\'assurer la stabilité régionale et la défense nationale.' },
        image: '/images/use-case-india.jpg'
      },
      australia: {
        title: { en: 'Australia: Coastal Surveillance and Marine Protection', fr: 'Australie : Surveillance Côtière et Protection Marine' },
        description: { en: 'Delivering comprehensive monitoring solutions for extensive coastlines, protecting marine ecosystems and strategic waterways, enhancing environmental stewardship across Australia\'s vast maritime zones.', fr: 'Fourniture de solutions de surveillance complètes pour les vastes côtes, protégeant les écosystèmes marins et les voies navigables stratégiques, renforçant la gestion environnementale à travers les vastes zones maritimes australiennes.' },
        image: '/images/use-case-australia.jpg'
      },
      newZealand: {
        title: { en: 'New Zealand: Innovative Environmental Monitoring', fr: 'Nouvelle-Zélande : Surveillance Environnementale Innovante' },
        description: { en: 'Utilizing drone data for ecological surveys, volcanic activity monitoring, and safeguarding unique natural heritage across land and sea, ensuring long-term conservation of New Zealand\'s distinct ecosystems.', fr: 'Utilisation des données de drones pour les études écologiques, la surveillance de l\'activité volcanique et la protection du patrimoine naturel unique à travers terre et mer, garantissant une conservation à long terme des écosystèmes distincts de la Nouvelle-Zélande.' },
        image: '/images/use-case-new-zealand.jpg'
      }
    }
  },
  footer: {
    copyright: {
      en: '© {currentYear} Kiwi-Ops. All rights reserved.',
      fr: '© {currentYear} Kiwi-Ops. Tous droits réservés.',
      mi: '© {currentYear} Kiwi-Ops. Ka whai mana katoa.',
      ga: '© {currentYear} Kiwi-Ops. Gach ceart ar cosaint.',
      hi: '© {currentYear} कीवी-ऑप्स। सर्वाधिकार सुरक्षित।',
      gd: '© {currentYear} Kiwi-Ops. Gach còir glèidhte.',
      cy: '© {currentYear} Kiwi-Ops. Cedwir pob hawl.',
      af: '© {currentYear} Kiwi-Ops. Alle regte voorbehou.',
    },
    privacyPolicy: {
      en: 'Privacy Policy',
      fr: 'Politique de Confidentialité',
      mi: 'Kaupapahere Tūmataiti',
      ga: 'Polasaí Príobháideachais',
      hi: 'गोपनीयता नीति',
      gd: 'Poileasaidh Prìobhaideachd',
      cy: 'Polisi Preifatrwydd',
      af: 'Privaatheidsbeleid',
    },
    termsOfService: {
      en: 'Terms of Service',
      fr: 'Conditions d\'Utilisation',
      mi: 'Ngā Tikanga o te Ratonga',
      ga: 'Téarmaí Seirbhíse',
      hi: 'सेवा की शर्तें',
      gd: 'Cumhachan Seirbheis',
      cy: 'Telerau Gwasanaeth',
      af: 'Diensbepalings',
    },
    contactUs: {
        en: 'Contact Us',
        fr: 'Nous Contacter',
        mi: 'Whakapā Mai',
        ga: 'Déan Teagmháil Linn',
        hi: 'हमसे संपर्क करें',
        gd: 'Cuir Fios Thugainn',
        cy: 'Cysylltwch â Ni',
        af: 'Kontak Ons',
    }
  },
};

function getTranslation(section: keyof typeof allTranslations, keyPath: string, language: LanguageCode): string {
  const keys = keyPath.split('.');
  let result = (allTranslations as any)[section];
  for (const theKey of keys) {
    if (result === undefined || result === null) return keyPath;
    result = result?.[theKey];
  }
  if (keyPath.includes('copyright')) {
    return (result?.[language] || result?.en || keyPath).replace('{currentYear}', new Date().getFullYear().toString());
  }
  if (Array.isArray(result?.[language])) {
      return (result?.[language] || result?.en || [keyPath]).join('\n');
  }
  return result?.[language] || result?.en || keyPath;
}
// --- FIN DES TRADUCTIONS ET FONCTION getTranslation ---


export default function SolutionsPage() {
  const { theme } = useTheme();
  const { language } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);

  const getLoginNavTranslation = (key: string) => getTranslation('loginPage', key, language);
  const tSolutions = (key: string) => getTranslation('solutionsPage', key, language);
  const tFooter = (key: string) => getTranslation('footer', key, language);

  const getOperationalUseCaseList = (key: string) => {
    const listString = tSolutions(key);
    return typeof listString === 'string' ? listString.split('\n').map((item: string) => item.trim()) : [];
  };

  return (
    <div className={`${styles.pageContainer} ${theme === 'dark' ? styles.darkMode : styles.lightMode}`}>
      {/* Navbar */}
      <nav className={styles.navbar}>
        <div className={styles.navLogo}><Link href="/">Kiwi-Ops</Link></div>
        <button className={styles.menuToggle} onClick={() => setMenuOpen(!menuOpen)}><FaBars /></button>
        <ul className={`${styles.navLinks} ${menuOpen ? styles.open : ''}`}>
           <li><Link href="/product">{getLoginNavTranslation('product')}</Link></li>
           <li><Link href="/product#features-section">{getLoginNavTranslation('features')}</Link></li>
           <li><Link href="/team">{getLoginNavTranslation('team')}</Link></li>
           <li><Link href="/story">{getLoginNavTranslation('story')}</Link></li>
           <li><Link href="/solutions">{getLoginNavTranslation('search')}</Link></li>
        </ul>
        <button className={styles.installButton} aria-label={getLoginNavTranslation('installAppLabel')}><FaDownload /></button>
      </nav>

      {/* Hero Section */}
      <section className={`${styles.section} ${styles.heroSolutionsSection}`} id="solutions-hero">
        <h1 className={styles.sectionTitle}>{tSolutions('title')}</h1>
        <p className={styles.subtitle}>{tSolutions('subtitle')}</p>
      </section>

      {/* Operational Categories Section (Air, Land, Sea cards with images at the bottom) */}
      <section className={`${styles.section} ${styles.solutionCategorySection}`}>
        <div className={styles.solutionCard}>
            <h2>{tSolutions('airTitle')}</h2>
            <p>{tSolutions('airText')}</p>
            <img src="/images/solution-air.jpg" alt="Air Operations" width={300} height={200} />
        </div>

        <div className={styles.solutionCard}>
            <h2>{tSolutions('landTitle')}</h2>
            <p>{tSolutions('landText')}</p>
            <img src="/images/solution-land.jpg" alt="Land Operations" width={300} height={200} />
        </div>

        <div className={styles.solutionCard}>
            <h2>{tSolutions('seaTitle')}</h2>
            <p>{tSolutions('seaText')}</p>
            <img src="/images/solution-sea.jpg" alt="Sea Operations" width={300} height={200} />
        </div>
      </section>

      {/* General Use Cases Section (Air, Land, Sea with bullet points) */}
      <section className={`${styles.section} ${styles.useCasesSection}`}>
        <h2 className={styles.sectionTitle}>{tSolutions('operationalUseCasesTitle')}</h2>

        <div className={styles.useCaseGrid}>
          <div className={styles.useCaseCard}>
            <h3>{tSolutions('operationalUseCasesAirTitle')}</h3>
            <ul>
              {getOperationalUseCaseList('operationalUseCasesAirList').map((item: string, index: number) => (
                <li key={`air-uc-${index}`}>{item}</li>
              ))}
            </ul>
          </div>

          <div className={styles.useCaseCard}>
            <h3>{tSolutions('operationalUseCasesLandTitle')}</h3>
            <ul>
              {getOperationalUseCaseList('operationalUseCasesLandList').map((item: string, index: number) => (
                <li key={`land-uc-${index}`}>{item}</li>
              ))}
            </ul>
          </div>

          <div className={styles.useCaseCard}>
            <h3>{tSolutions('operationalUseCasesSeaTitle')}</h3>
            <ul>
              {getOperationalUseCaseList('operationalUseCasesSeaList').map((item: string, index: number) => (
                <li key={`sea-uc-${index}`}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>


      {/* Country Specific Use Cases Section */}
      <section className={`${styles.section} ${styles.countryUseCasesSection}`}>
        <h2 className={styles.sectionTitle}>{tSolutions('countryUseCasesSectionTitle')}</h2>
        <p className={styles.subtitle}>{tSolutions('countryUseCasesSectionSubtitle')}</p>

        <div className={styles.countryUseCasesGrid}>
          {Object.entries(allTranslations.solutionsPage.useCasesByCountry).map(([countryKey, countryData]) => (
            <div key={countryKey} className={styles.countryUseCaseCard}>
              <div className={styles.useCaseImageContainer}>
                <Image
                  src={countryData.image}
                  alt={countryData.title[language] || countryData.title.en}
                  width={200}
                  height={120}
                  className={styles.useCaseImage}
                />
              </div>
              <div className={styles.useCaseContent}>
                <h3>{countryData.title[language] || countryData.title.en}</h3>
                <p>{countryData.description[language] || countryData.description.en}</p>
              </div>
            </div>
          ))}
        </div>

        <div className={`${styles.ctaContainer} ${styles.sectionCta}`}>
          <Link href="/contact" className={styles.ctaButton}>{tSolutions('ctaButtonExperts')}</Link>
        </div>
      </section>

      {/* Final Call To Action */}
      <div className={`${styles.section} ${styles.ctaContainer} ${styles.finalCta}`}>
        <h2 className={styles.ctaTitle}>{tSolutions('ctaTitle')}</h2>
        <p className={styles.ctaSubtitle}>
          {tSolutions('ctaSubtitle')}
        </p>
        <Link href="mailto:contact@kiwi-ops.com" className={styles.ctaButton}>
          {tSolutions('ctaButtonExperts')}
        </Link>
      </div>


      {/* FOOTER */}
      <footer className={`${styles.footer}`}>
        <div className={styles.footerContent}>
          <div className={styles.footerBrand}>
            <h3>Kiwi-Ops</h3>
            <p>{tFooter('copyright')}</p>
          </div>
          <div className={styles.footerNav}>
            <h4>{getLoginNavTranslation('search')}</h4>
            <ul>
              <li><Link href="/product">{getLoginNavTranslation('product')}</Link></li>
              <li><Link href="/team">{getLoginNavTranslation('team')}</Link></li>
              <li><Link href="/story">{getLoginNavTranslation('story')}</Link></li>
              <li><Link href="/solutions">{getLoginNavTranslation('search')}</Link></li>
            </ul>
          </div>
          <div className={styles.footerLegal}>
            <h4>Legal</h4>
            <ul>
              <li><Link href="/privacy">{tFooter('privacyPolicy')}</Link></li>
              <li><Link href="/terms">{tFooter('termsOfService')}</Link></li>
            </ul>
          </div>
          <div className={styles.footerContact}>
            <h4>{tFooter('contactUs')}</h4>
            <p>Email: <a href="mailto:info@kiwi-ops.com">info@kiwi-ops.com</a></p>
          </div>
        </div>
      </footer>
    </div>
  );
}