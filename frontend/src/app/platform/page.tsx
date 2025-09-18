'use client';

import { useState } from 'react';
import Link from 'next/link';
// import Image from 'next/image'; // Peut être utilisé pour des images spécifiques à la page Platform
import { FaBars, FaDownload } from 'react-icons/fa';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageCode } from '@/types'; // Assurez-vous que LanguageCode est correctement importé ou défini
import styles from './platform.module.css'; // Utilise './page.module.css' pour les styles de cette page

// --- DÉBUT DES TRADUCTIONS ET FONCTION getTranslation (Intégrées directement dans ce fichier) ---
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
    product: { // "Nos Produits"
      en: 'Our Products',
      fr: 'Nos Produits',
      mi: 'Ā Mātou Hua',
      ga: 'Ár dTáirgí',
      hi: 'हमारे उत्पाद',
      gd: 'Ar Bathar',
      cy: 'Ein Cynhyrchion',
      af: 'Ons Produkte',
    },
    features: { // "La plateforme"
      en: 'The Platform',
      fr: 'La plateforme',
      mi: 'Te Paparanga',
      ga: 'An tArdán',
      hi: 'प्लेटफ़ॉर्म',
      gd: 'Am Plaicform',
      cy: 'Y Llwyfan',
      af: 'Die Platform',
    },
    story: { // "Notre Histoire"
      en: 'Our Story',
      fr: 'Notre Histoire',
      mi: 'Tō Mātou Kōrero',
      ga: 'Ár Scéal',
      hi: 'हमारी कहानी',
      gd: 'Ar Sgeulachd',
      cy: 'Ein Stori',
      af: 'Ons Verhaal',
    },
    search: { // "Nos solutions"
      en: 'Our Solutions',
      fr: 'Nos solutions',
      mi: 'Ā Mātou Rongoā',
      ga: 'Ár Réitigh',
      hi: 'हमारे समाधान',
      gd: 'Ar Fuasglaidhean',
      cy: 'Ein Datrysiadau',
      af: 'Ons Oplossings',
    },
    team: { // "Notre Équipe"
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
    solution: { // Cette section va être le corps de la nouvelle page /platform
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
        cy: 'Nid gyda llinell o god y dechreuodd ein stori, ond gyda sŵn picell mewn sialc. Yn Arras, 1917, dyfeisgarwch y twneli Kiwï oedd gwneud y ddirgelwch yn weladwy. Heddiw, rydym yn parhau â\'r etifeddiaeth hon. Lle y gwrandawent ar y ddaear, rydym yn defnyddio AI. Mae Kiwi-Ops yn bont rhwng etifeddiaeth twneli ddoe a thechnoleg adeiladwyr yfory. Credwn fod etifeddiaeth ddiwylliannol, cyfle addysgol, a ffurf gelfyddydol wedi\'u cuddio o dan bob metr o ddaear y gall ein technoleg eu datgelu. Rydym yn trawsnewid data crai o DBMau yn sicrwydd gweithredol, gan integreiddio celf ragweld, cyfoeth diwylliant gweithredol, a phŵer addysg a yrrir gan ddata, gan ymestyn y deallusrwydd hwn o\'r dyfnder i weithrediadau critigol ar draws Awyr, Tir, a Môr.',
        af: 'Ons storie begin nie met \'n reël kode nie, maar met die geluid van \'n pik in kryt. In Arras, 1917, was die vindingrykheid van die Kiwi-tonnelgrawers om die onsigbare sigbaar te maak. Vandag dra ons hierdie nalatenskap voort. Waar hulle na die aarde geluister het, pas ons KI toe. Kiwi-Ops is die brug tussen die nalatenskap van gister se tonnelgrawers en die tegnologie van môre se bouers. Ons glo dat onder elke meter aarde \'n kulturele erfenis, \'n opvoedkundige geleentheid, en \'n vorm van kuns lê wat ons tegnologie kan openbaar. Ons omskep rou data van TBMs in operasionele sekerheid, deur die kuns van afwagting, die rykdom van operasionele kultuur, en die krag van data-gedrewe onderwys te integreer, en hierdie intelligensie uit die dieptes uit te brei na kritieke operasies oor Lug, Land, en See.',
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
        member1Name: { en: '[Your Name]', fr: '[Votre Nom]' }, // REMPLACER
        member1Title: { en: 'CEO & Co-founder', fr: 'CEO & Co-fondateur' },
        member1Bio: {
            en: 'Visionary leader with X years of experience in underground engineering and project management. Spearheading Kiwi-Ops strategy and business development.', // REMPLACER X
            fr: 'Leader visionnaire avec X années d\'expérience en ingénierie souterraine et gestion de projet. Il dirige la stratégie et le développement commercial de Kiwi-Ops.' // REMPLACER X
        },
        member2Name: { en: '[Co-founder/CTO Name]', fr: '[Nom du Co-fondateur/CTO]' }, // REMPLACER
        member2Title: { en: 'CTO & Co-founder', fr: 'CTO & Co-fondateur' },
        member2Bio: {
            en: 'Tech wizard with a PhD in AI and Y years in software architecture. Drives the innovation behind Kiwi-Ops\' Edge AI, Cloud, and Web3 solutions.', // REMPLACER Y
            fr: 'Génie technique avec un doctorat en IA et Y années en architecture logicielle. Il est le moteur de l\'innovation derrière les solutions Edge AI, Cloud et Web3 de Kiwi-Ops.' // REMPLACER Y
        },
    }
  },
  solutionsPage: { // Nouvelle section pour les traductions spécifiques de la page Solutions
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
      ga: 'Oibríochtaí Aeir: Cruinneas agus Cumhacht Réamhaisnéise',
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
  },
  platformPage: { // Nouvelle section pour les traductions spécifiques de la page Platform
    title: {
      en: 'The Kiwi-Ops Platform: Your Operational Command Center',
      fr: 'La Plateforme Kiwi-Ops : Votre Centre de Commande Opérationnel',
      hi: 'कीवी-ऑप्स प्लेटफ़ॉर्म: आपका परिचालन कमान केंद्र',
      mi: 'Te Paparanga Kiwi-Ops: Tō Pokapū Whakahaere Mahi',
      ga: 'Ardán Kiwi-Ops: Ionad Ordú Oibríochta',
      gd: 'Àrd-ùrlar Kiwi-Ops: An t-Ionad Smachd Obrachaidh agad',
      cy: 'Llwyfan Kiwi-Ops: Eich Canolfan Rheoli Gweithredol',
      af: 'Die Kiwi-Ops Platform: Jou Operasionele Beheer Sentrum',
    },
    subtitle: {
      en: 'Unifying Edge AI, Secure Cloud, and Web3 Trust for Unprecedented Control.',
      fr: 'Unifiant l\'IA Edge, le Cloud Sécurisé et la Confiance Web3 pour un Contrôle Inédit.',
      hi: 'अभूतपूर्व नियंत्रण के लिए एज एआई, सुरक्षित क्लाउड और वेब3 ट्रस्ट को एकीकृत करना।',
      mi: 'Te Whakakotahi i te AI Whakamutunga, te Kapua Haumaru, me te Whakawhirinaki Web3 mo te Mana Kore-mua.',
      ga: 'AI Imeall, Cloud Slán, agus Iontaobhas Web3 a Aontú le haghaidh Rialú Gan Réamhshampla.',
      gd: 'Aonachadh AI Iomall, Cloud Tèarainte, agus Urras Web3 airson Smachd Gun Coimeas.',
      cy: 'Uno AI Ymyl, Cwmwl Diogel, ac Ymddiriedaeth Web3 ar gyfer Rheolaeth Ddigyffelyb.',
      af: 'Rand KI, Veilige Wolk, en Web3 Vertroue Verenigde vir Ongekende Beheer.',
    },
    // Les traductions pour les piliers (Kiwi-Edge, Kiwi-Cloud, Kiwi-Ledger) sont déjà dans productPage.solution
  },
};

function getTranslation(section: keyof typeof allTranslations, keyPath: string, language: LanguageCode): string {
  const keys = keyPath.split('.');
  let result = (allTranslations as any)[section];
  for (const theKey of keys) {
    if (result === undefined || result === null) return keyPath;
    result = result?.[theKey];
  }
  return result?.[language] || result?.en || keyPath;
}
// --- FIN DES TRADUCTIONS ET FONCTION getTranslation ---


export default function PlatformPage() {
  const { theme } = useTheme();
  const { language } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);

  // Fonctions utilitaires pour les traductions
  const getLoginNavTranslation = (key: string) => getTranslation('loginPage', key, language);
  const tPlatform = (key: string) => getTranslation('platformPage', key, language);
  const tProductSolution = (key: string) => getTranslation('productPage', `solution.${key}`, language); // Pour les piliers de solution

  return (
    <div className={`${styles.pageContainer} ${theme === 'dark' ? styles.darkMode : styles.lightMode}`}>
      {/* Navbar (cohérente avec les autres pages) */}
      <nav className={styles.navbar}>
        <div className={styles.navLogo}><Link href="/">Kiwi-Ops</Link></div>
        <button className={styles.menuToggle} onClick={() => setMenuOpen(!menuOpen)}><FaBars /></button>
        <ul className={`${styles.navLinks} ${menuOpen ? styles.open : ''}`}>
           <li><Link href="/product">{getLoginNavTranslation('product')}</Link></li>
           <li><Link href="/platform">{getLoginNavTranslation('features')}</Link></li> {/* Lien direct vers cette page Platform */}
           <li><Link href="/team">{getLoginNavTranslation('team')}</Link></li>
           <li><Link href="/story">{getLoginNavTranslation('story')}</Link></li>
           <li><Link href="/solutions">{getLoginNavTranslation('search')}</Link></li>
        </ul>
        <button className={styles.installButton} aria-label={getLoginNavTranslation('installAppLabel')}><FaDownload /></button>
      </nav>

      {/* Contenu de la page Platform */}
      <section className={`${styles.section} ${styles.heroPlatformSection}`} id="platform-hero">
        <h1 className={styles.sectionTitle}>{tPlatform('title')}</h1>
        <p className={styles.subtitle}>{tPlatform('subtitle')}</p>
      </section>

      <section className={`${styles.section} ${styles.platformPillarsSection}`}>
        <div className={styles.pillarCard}>
          <h3>{tProductSolution('pillar1Title')}</h3>
          <p>{tProductSolution('pillar1Text')}</p>
          {/* Optionnel: Ajouter une image ou une icône */}
        </div>

        <div className={styles.pillarCard}>
          <h3>{tProductSolution('pillar2Title')}</h3>
          <p>{tProductSolution('pillar2Text')}</p>
          {/* Optionnel: Ajouter une image ou une icône */}
        </div>

        <div className={styles.pillarCard}>
          <h3>{tProductSolution('pillar3Title')}</h3>
          <p>{tProductSolution('pillar3Text')}</p>
          {/* Optionnel: Ajouter une image ou une icône */}
        </div>
      </section>

      {/* Vous pouvez ajouter un footer ici si vous en avez un */}
    </div>
  );
}