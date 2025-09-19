'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaBars, FaDownload } from 'react-icons/fa';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageCode } from '@/types';
import styles from './product.module.css';

// --- DÉBUT DES TRADUCTIONS ET FONCTION getTranslation (Intégrées directement dans ce fichier) ---
// ATTENTION: Cet objet DOIT être identique dans TOUS les fichiers .tsx utilisant les traductions.
const allTranslations = {
  header: {
    missionStatement: {
      en: "Inspired by the Wellington Tunnelers of Arras, our mission is to build in the shadows what will, tomorrow, break through to the surface.",
      fr: "Inspirés des tunneliers de Wellington à Arras, notre mission est de bâtir dans l’ombre ce qui, demain, percera la surface.",
      mi: "He mea whakahihiri mai i ngā kaikeri o raro o Te Whanganui-a-Tara ki Arras, ko tā mātou kaupapa he hanga i roto i te atarangi i ngā mea ka puta ki te mata āpōpopo.",
      ga: "Ar an taobh istigh de tholláin Wellington in Arras, is é ár misean tógáil sa scáth a bhrisfidh an dromchla amárach.",
      hi: "एरास में वेलिंगटन टनलर्स से प्रेरित होकर, हमारा मिशन छाया में वह निर्माण करना है जो कल सतह को भेद देगा।",
      gd: "Air a bhrosnachadh le Tunnelairean Wellington ann an Arras, is e ar misneachd togail anns an dubhar na nì, a-màireach, briseadh tro uachdar.",
      cy: "Wedi'u hysbrydoli gan Dwnelwyr Wellington yn Arras, ein cenhadaeth yw adeiladu yn y cysgodion yr hyn, yfory, a fydd yn torri trwy'y wyneb.",
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
    chatTitle: { en: "Chat with AI", fr: "Chat avec l'IA" },
    chatInputPlaceholder: { en: 'Write your message here...', fr: 'Écrivez votre message ici...' },
    installAppLabel: {
      en: 'Install App', fr: "Installer l'Application", hi: 'ऐप इंस्टॉल करें', mi: 'Tāuta Taupānga', ga: 'Suiteáil Aip', gd: 'Stàlaich App', cy: 'Gosod Ap', af: 'Installeer Toep',
    },
    product: { // "Nos Produits"
      en: 'Our Products', fr: "Nos Produits", hi: 'हमारे उत्पाद', mi: 'Ā Mātou Hua', ga: 'Ár dTáirgí', gd: 'Ar Bathar', cy: 'Ein Cynhyrchion', af: 'Ons Produkte',
    },
    features: { // "La plateforme"
      en: 'The Platform', fr: "La plateforme", hi: 'प्लेटफ़ॉर्म', mi: 'Te Paparanga', ga: 'An tArdán', gd: 'Am Plaicform', cy: 'Y Llwyfan', af: 'Die Platform',
    },
    story: { // "Notre Histoire"
      en: 'Our Story', fr: "Notre Histoire", hi: 'हमारी कहानी', mi: 'Tō Mātou Kōrero', ga: 'Ár Scéal', gd: 'Ar Sgeulachd', cy: 'Ein Stori', af: 'Ons Verhaal', },
    search: { // "Nos solutions"
      en: 'Our Solutions', fr: "Nos solutions", hi: 'हमारे समाधान', mi: 'Ā Mātou Rongoā', ga: 'Ár Réitigh', gd: 'Ar Fuasglaidhean', cy: 'Ein Datrysiadau', af: 'Ons Oplossings', },
    team: { // "Notre Équipe"
      en: 'Our Team', fr: "Notre Équipe", hi: 'हमारी टीम', mi: 'Tō Mātou Kapa', ga: 'Ár bhFoireann', gd: 'Ar Sgioba', cy: 'Ein Tîm', af: 'Ons Span', },
  },
  
  productPage: {
    hero: {
      title: {
        en: 'The Legacy of the Depths, The Intelligence of Tomorrow.',
        fr: 'L\'Héritage des Profondeurs, L\'Intelligence de Demain.',
        hi: 'गहराइयों की विरासत, कल की बुद्धिमत्ता।',
        mi: 'Te Tuku Iho o ngā Hohonu, Te Mātauranga o Āpōpō.',
        ga: 'Oidhreacht na nDoimhneachtaí, Faisnéis an Lae Amárach.',
        gd: 'Dualchas nan Doimhneachdan, Eòlas an Latha Màireach.',
        cy: 'Etifeddiaeth y Dyfnderoedd, Deallusrwydd Yfory.',
        af: 'Die Erfenis van die Dieptes, Die Intelligensie van Môre.',
      },
      subtitle: {
        en: 'Kiwi-Ops: The AI and Web3 platform that transforms raw data from your TBMs into operational certainty.',
        fr: 'Kiwi-Ops : La plateforme d\'IA et de Web3 qui transforme les données brutes de vos tunneliers en certitude opérationnelle.',
        hi: 'कीवी-ऑप्स: एआई और वेब3 प्लेटफॉर्म जो आपके टीबीएम से कच्चे डेटा को परिचालन निश्चितता में बदलता है।',
        mi: 'Kiwi-Ops: Te papanga AI me Web3 e huri ana i ngā raraunga mata mai i ō TBM ki te tino mōhiotanga whakahaere.',
        ga: 'Kiwi-Ops: An t-ardán AI agus Web3 a athraíonn amhshonraí ó do TBManna go cinnteacht oibriúcháin.',
        gd: 'Kiwi-Ops: Am plàtaform AI agus Web3 a dh’atharraicheas dàta amh bho na TBMan agad gu cinnteachd obrachaidh.',
        cy: 'Kiwi-Ops: Y llwyfan AI a Web3 sy\'n trawsnewid data crai o\'ch TBMau yn sicrwydd gweithredol.',
        af: 'Kiwi-Ops: Die KI en Web3 platform wat rou data van jou TBMs omskakel in operasionele sekerheid.',
      },
      ctaButton: {
        en: 'Join the Beta Program',
        fr: 'Participez au Programme Bêta',
        hi: 'बीटा प्रोग्राम में शामिल हों',
        mi: 'Hono atu ki te Hōtaka Beta',
        ga: 'Glac Páirt sa Chlár Béite',
        gd: 'Thig a-steach don Phrògram Beta',
        cy: 'Ymunwch â\'r Rhaglen Beta',
        af: 'Sluit aan by die Beta Program',
      },
    },
    challenge: {
      title: {
        en: 'Every Meter Counts. Every Hour of Downtime Costs.',
        fr: 'Chaque Mètre Compte. Chaque Heure d\'Arrêt Coûte.',
        hi: 'हर मीटर मायने रखता है। हर घंटे का डाउनटाइम महंगा होता है।',
        mi: 'He mea nui ia mita. He utu nui ia haora o te wā kore mahi.',
        ga: 'Tá gach Meadar Tábhachtach. Cosnaíonn Gach Uair an Chloig Gan Obair.',
        gd: 'Tha gach Meatair Cudromach. Tha gach Uair a-thìde de Shìos-ùine a’ Cosg.',
        cy: 'Mae Pob Mesurydd yn Cyfrif. Mae Pob Awr o Amser Segur yn Costio.',
        af: 'Elke Meter Tel. Elke Uur Stilstand Kos Geld.',
      },
      point1: {
        en: 'The nightmare of a stalled TBM: Millions lost in penalties and costs for a failure that could have been anticipated.',
        fr: 'Le cauchemar d\'un tunnelier à l\'arrêt : Des millions perdus en pénalités pour une panne qui aurait pu être anticipée.',
        hi: 'एक रुके हुए टीबीएम का दुःस्वप्न: एक ऐसी विफलता के लिए लाखों का नुकसान जो पहले से अनुमानित की जा सकती थी।',
        mi: 'Te moemoeā o te TBM kua mutu: He miriona kua ngaro i roto i ngā whiu me ngā utu mō te korenga i taea te matapae.',
        ga: 'An tromluí a bhaineann le TBM stoptha: Na milliúin caillte i bpionóis agus costais mar gheall ar theip a d\'fhéadfaí a thuar.',
        gd: 'An trom-laighe a thig le TBM air stad: Milleanan air chall ann am peanasan agus cosgaisean airson fàilligeadh a dh’fhaodadh a bhith air a ro-innse.',
        cy: 'Hunllef TBM sydd wedi stopio: Miliynau ar goll mewn cosbau a chostau am fethiant a allai fod wedi\'i ragweld.',
        af: 'Die nagmerrie van \'n stilstaande TBM: Miljoene verloor in boetes en koste vir \'n mislukking wat voorkom kon word.',
      },
      point2: {
        en: 'Opacity that erodes trust: How to prove progress and ensure total transparency to stakeholders and citizens?',
        fr: 'L\'opacité qui érode la confiance : Comment garantir une transparence totale aux investisseurs et aux citoyens ?',
        hi: 'अस्पष्टता जो विश्वास को खत्म करती है: हितधारकों और नागरिकों को प्रगति कैसे साबित करें और पूर्ण पारदर्शिता कैसे सुनिश्चित करें?',
        mi: 'Te ngaro o te mārama e patu ana i te whakawhirinaki: Me pēhea te whakaatu i te ahunga whakamua me te whakarite i te mārama katoa ki ngā kaipupuri me ngā tāngata whenua?',
        ga: 'Doiléire a chreimeann muinín: Conas dul chun cinn a chruthú agus trédhearcacht iomlán a chinntiú do pháirtithe leasmhara agus do shaoránaigh?',
        gd: 'Neo-fhaicsinneachd a chriomaicheas earbsa: Ciamar a dhearbhas tu adhartas agus a nì thu cinnteach gu bheil follaiseachd iomlan do luchd-ùidh agus saoranaich?',
        cy: 'Tryloywder sy\'n erydu ymddiriedaeth: Sut i brofi cynnydd a sicrhau tryloywder llawn i randdeiliaid a dinasyddion?',
        af: 'Ondeursigtigheid wat vertroue erodeer: Hoe om vordering te bewys en totale deursigtigheid aan belanghebbendes en burgers te verseker?',
      },
      point3: {
        en: 'The invisible risk: How to ensure maximum team safety in a constantly evolving underground environment?',
        fr: 'Le risque invisible : Comment assurer la sécurité maximale des équipes à des dizaines de mètres sous terre ?',
        hi: 'अदृश्य जोखिम: लगातार विकसित हो रहे भूमिगत वातावरण में टीम की अधिकतम सुरक्षा कैसे सुनिश्चित करें?',
        mi: 'Te mōrearea kore e kitea: Me pēhea te whakarite i te tino haumaru o te tīma i roto i te taiao o raro e huri haere tonu ana?',
        ga: 'An riosca dofheicthe: Conas an tsábháilteacht foirne uasta a chinntiú i dtimpeallacht faoi thalamh atá ag athrú go leanúnach?',
        gd: 'An cunnart neo-fhaicsinneach: Ciamar a nì thu cinnteach gu bheil an sàbhailteachd sgioba as àirde ann an àrainneachd fon talamh a tha a’ sìor atharrachadh?',
        cy: 'Y risg anweledig: Sut i sicrhau diogelwch tîm mwyaf posibl mewn amgylchedd tanddaearol sy\'n datblygu\'n gyson?',
        af: 'Die onsigbare risiko: Hoe om maksimum spanveiligheid te verseker in \'n voortdurend veranderende ondergrondse omgewing?',
      },
    },
    solution: {
      title: {
        en: 'We don’t give you data. We give you Control.',
        fr: 'Nous ne vous donnons pas des données. Nous vous offrons la Maîtrise.',
        hi: 'हम आपको डेटा नहीं देते। हम आपको नियंत्रण देते हैं।',
        mi: 'Kare mātou e hoatu raraunga ki a koe. Ka hoatu e mātou te Mana ki a koe.',
        ga: 'Ní thugaimid sonraí duit. Tugaimid Rialú duit.',
        gd: 'Cha toir sinn dhut dàta. Bheir sinn dhut Smachd.',
        cy: 'Nid ydym yn rhoi data i chi. Rydym yn rhoi Rheolaeth i chi.',
        af: 'Ons gee jou nie data nie. Ons gee jou Beheer.',
      },
      pillar1Title: {
        en: 'Kiwi-Edge: Intelligence at the Frontline',
        fr: 'Kiwi-Edge : L\'Intelligence au Front',
        hi: 'कीवी-एज: अग्रिम पंक्ति पर बुद्धिमत्ता',
        mi: 'Kiwi-Edge: Te Mātauranga i te Rārangi Ope.',
        ga: 'Kiwi-Edge: Faisnéis ag an Líne Tosaigh',
        gd: 'Kiwi-Edge: Eòlas aig an Aghaidh',
        cy: 'Kiwi-Edge: Deallusrwydd ar y Rheng Flaen',
        af: 'Kiwi-Edge: Intelligensie aan die Voorkant',
      },
      pillar1Text: {
        en: 'Our NVIDIA Jetson-powered device installs directly on your TBM, analyzing data in real-time for instant anomaly detection and predictive maintenance, even offline.',
        fr: 'Notre boîtier, équipé NVIDIA Jetson, s\'installe sur votre tunnelier pour une détection d\'anomalies et une maintenance prédictive instantanées, même sans connexion.',
        hi: 'हमारा एनवीडिया जेटसन-संचालित उपकरण आपके टीबीएम पर सीधे स्थापित होता है, जो वास्तविक समय में डेटा का विश्लेषण करता है ताकि तत्काल विसंगति का पता लगाया जा सके और भविष्य कहनेवाला रखरखाव किया जा सके, यहां तक कि ऑफ़लाइन भी।',
        mi: 'Ka tāuta tika tō mātou pūrere NVIDIA Jetson ki runga i tō TBM, ka tātari i ngā raraunga i te wā tūturu mō te kitenga hē tere me te tiaki matapae, ahakoa kāore he hononga ipurangi.',
        ga: 'Suiteálann ár bhfeiste atá faoi thiomáint ag NVIDIA Jetson go díreach ar do TBM, ag anailísiú sonraí i bhfíor-am le haghaidh braite neamhrialtachtaí láithreach agus cothabháil thuarthach, fiú as líne.',
        gd: 'Bidh an t-inneal againn le cumhachd NVIDIA Jetson a’ stàladh gu dìreach air do TBM, a’ dèanamh anailis air dàta ann an àm fìor airson lorg neo-riaghailteachdan sa bhad agus cumail suas ro-innseach, eadhon far-loidhne.',
        cy: 'Mae ein dyfais a bwerir gan NVIDIA Jetson yn gosod yn uniongyrchol ar eich TBM, gan ddadansoddi data mewn amser real ar gyfer canfod annormaleddau ar unwaith a chynnal a chadw rhagfynegol, hyd yn oed all-lein.',
        af: 'Ons NVIDIA Jetson-aangedrewe toestel installeer direk op jou TBM, en ontleed data in reële tyd vir onmiddellike afwykingopsporing en voorspellende instandhouding, selfs vanlyn.',
      },
      pillar2Title: {
        en: 'Kiwi-Cloud: The Strategic Vision',
        fr: 'Kiwi-Cloud : La Vision Stratégique',
        hi: 'कीवी-क्लाउड: रणनीतिक दृष्टि',
        mi: 'Kiwi-Cloud: Te Tirohanga Rautaki.',
        ga: 'Kiwi-Cloud: An Fís Straitéiseach',
        gd: 'Kiwi-Cloud: An Lèirsinn Ro-innleachdail',
        cy: 'Kiwi-Cloud: Y Weledigaeth Strategol',
        af: 'Kiwi-Cloud: Die Strategiese Visie',
      },
      pillar2Text: {
        en: 'Relevant data is synced to our secure GCP cloud platform. Our advanced Vertex AI models compare fleet-wide performance and continuously refine predictions.',
        fr: 'Les données pertinentes sont synchronisées sur notre plateforme cloud (GCP). Nos modèles d\'IA (Vertex AI) comparent les performances de toute votre flotte.',
        hi: 'प्रासंगिक डेटा हमारे सुरक्षित GCP क्लाउड प्लेटफॉर्म पर सिंक्रनाइज़ होता है। हमारे उन्नत वर्टेक्स एआई मॉडल बेड़े-व्यापी प्रदर्शन की तुलना करते हैं और लगातार भविष्यवाणियों को परिष्कृत करते हैं।',
        mi: 'Ka tukutahia ngā raraunga whai take ki tō mātou papanga kapua GCP haumaru. Ka whakatauritehia e a mātou tauira Vertex AI te mahi o te katoa o te waka, ā, ka whakapai tonu i ngā matapae.',
        ga: 'Déantar sonraí ábhartha a shioncronú lenár n-ardán scamall slán GCP. Déanann ár múnlaí ardfhorbartha Vertex AI comparáid idir feidhmíocht an chabhlaigh ar fad agus leanann siad ar aghaidh ag feabhsú tuar.',
        gd: 'Bidh dàta buntainneach air a shioncronachadh ris an àrd-ùrlar sgòth GCP tèarainte againn. Bidh na modalan Vertex AI adhartach againn a’ dèanamh coimeas eadar coileanadh air feadh an cabhlaich agus a’ leantainn air adhart ag ath-leasachadh ro-innsean.',
        cy: 'Mae data perthnasol yn cael ei gysoni i\'n platfform cwmwl GCP diogel. Mae ein modelau Vertex AI datblygedig yn cymharu perfformiad ar draws y fflyd ac yn mireinio rhagfynegiadau yn barhaus.',
        af: 'Relevante data word gesinkroniseer met ons veilige GCP-wolkplatform. Ons gevorderde Vertex AI-modelle vergelyk vlootwye prestasie en verfyn voorspellings voortdurend.',
      },
      pillar3Title: {
        en: 'Kiwi-Ledger: The Ledger of Trust',
        fr: 'Kiwi-Ledger : Le Registre de Confiance',
        hi: 'कीवी-लेजर: विश्वास का खाता',
        mi: 'Kiwi-Ledger: Te Rehita Whakawhirinaki.',
        ga: 'Kiwi-Ledger: Leabhar Iontaobhais',
        gd: 'Kiwi-Ledger: An Leabhar-cunntais Earbsa',
        cy: 'Kiwi-Ledger: Y Llyfr Ymddiriedaeth',
        af: 'Kiwi-Ledger: Die Grootboek van Vertroue',
      },
      pillar3Text: {
        en: 'Every key event is certified by Kiwi-Edge and recorded on a Web3 ledger. It’s your immutable logbook, the irrefutable proof of your project’s progress.',
        fr: 'Chaque événement clé est certifié par le Kiwi-Edge et inscrit sur un registre Web3. C\'est votre journal de bord immuable et la preuve irréfutable de l\'avancement.',
        hi: 'प्रत्येक प्रमुख घटना कीवी-एज द्वारा प्रमाणित होती है और एक वेब3 लेजर पर दर्ज की जाती है। यह आपकी अपरिवर्तनीय लॉगबुक है, आपकी परियोजना की प्रगति का अकाट्य प्रमाण।',
        mi: 'Ka whakamanahia ia kaupapa matua e Kiwi-Edge, ka tuhia ki runga i te rehita Web3. Ko tō rārangi puka kore e taea te whakarereke, te tohu mārama o te ahunga whakamua o tō kaupapa.',
        ga: 'Déanann Kiwi-Edge gach príomhimeacht a dheimhniú agus a thaifeadadh ar leabhar Web3. Is é do leabhar logála dho-athraithe é, an fhianaise dho-chiallaí ar dhul chun cinn do thionscadail.',
        gd: 'Tha gach prìomh thachartas air a dhearbhadh le Kiwi-Edge agus air a chlàradh air leabhar-cunntais Web3. Is e seo an leabhar-latha neo-atharraichte agad, an dearbhadh do-sheachanta air adhartas do phròiseict.',
        cy: 'Mae pob digwyddiad allweddol yn cael ei ardystio gan Kiwi-Edge ac wedi\'i gofnodi ar lyfr Web3. Eich loglyfr anffaeledig ydyw, y prawf diamheuol o gynnydd eich prosiect.',
        af: 'Elke sleutelgebeurtenis word deur Kiwi-Edge gesertifiseer en op \'n Web3-grootboek aangeteken. Dit is jou onveranderlike logboek, die onweerlegbare bewys van jou projek se vordering.',
      },
    },
    features: {
      title: {
        en: 'A Platform Designed for Performance and Simplicity',
        fr: 'Une Plateforme Conçue pour la Performance et la Simplicité',
        hi: 'प्रदर्शन और सरलता के लिए डिज़ाइन किया गया एक प्लेटफ़orm',
        mi: 'He Paparanga i Hangaia mo te Mahi me te Maamaa',
        ga: 'Ardán Deartha le haghaidh Feidhmíochta agus Simplíochta',
        gd: 'Àrd-ùrlar air a dhealbhadh airson coileanadh agus sìmplidheachd',
        cy: 'Llwyfan Wedi\'i Ddylunio ar gyfer Perfformiad a Symlrwydd',
        af: 'N Platform Ontwerp vir Prestasie en Eenvoud',
      },
      speedTitle: {
        en: 'Speed: From Data to Decision in Milliseconds',
        fr: 'Rapidité : De la Donnée à la Décision en Millisecondes',
        hi: 'गति: मिलीसेकंड में डेटा से निर्णय तक',
        mi: 'Tere: Mai i te Raraunga ki te Whakatau i roto i ngā Millihēkona.',
        ga: 'Luas: Ó Shonraí go Cinneadh i Milliseicindí',
        gd: 'Luas: Bho Dàta gu Co-dhùnadh ann an Milliseconds',
        cy: 'Cyflymder: O Ddata i Benderfyniad mewn Miliseiliadau',
        af: 'Spoed: Van Data na Besluit in Millisekondes',
      },
      speedText: {
        en: 'Our Edge AI architecture processes critical information where it happens: directly on the machine, enabling a proactive approach.',
        fr: 'Notre architecture Edge AI traite les informations critiques là où elles se produisent. Passez d\'un mode réactif à un mode proactif.',
        hi: 'हमारी एज एआई वास्तुकला महत्वपूर्ण जानकारी को वहीं संसाधित करती है जहां यह होता है: सीधे मशीन पर, एक सक्रिय दृष्टिकोण को सक्षम करती है।',
        mi: 'Ka tukatukahia e tō mātou hoahoanga Edge AI ngā pārongo whakahirahira i te wāhi e puta ai: tika i runga i te mihini, ka taea he huarahi whakatika.',
        ga: 'Próiseálann ár n-ailtireacht Edge AI faisnéis ríthábhachtach san áit a dtarlaíonn sé: go díreach ar an meaisín, ag cumasú cur chuige réamhghníomhach.',
        gd: 'Bidh an ailtireachd Edge AI againn a’ giullachd fiosrachadh èiginneach far a bheil e a’ tachairt: gu dìreach air an inneal, a’ comasachadh dòigh-obrach for-ghnìomhach.',
        cy: 'Mae ein penseiri AI Ymyl yn prosesu gwybodaeth hollbwysig lle mae\'n digwydd: yn uniongyrchol ar y peiriant, gan alluogi dull rhagweithiol.',
        af: 'Ons Edge KI-argitektuur verwerk kritieke inligting waar dit plaasvind: direk op die masjien, wat \'n proaktiewe benadering moontlik maak.',
      },
      securityTitle: {
        en: 'Security: Trust is Not an Option. It\'s a Guarantee.',
        fr: 'Sécurité : La Confiance n\'est pas une option. C\'est une garantie.',
        hi: 'सुरक्षा: विश्वास एक विकल्प नहीं है। यह एक गारंटी है।',
        mi: 'Haumaru: Ehara te Whakawhirinaki i te Kōwhiringa. He Whakaū.',
        ga: 'Slándáil: Ní Rogha é Iontaobhas. Is Ráthaíocht é.',
        gd: 'Tèarainteachd: Chan e Roghainn a th’ ann an earbsa. Is e Gealltanas a th’ ann.',
        cy: 'Diogelwch: Nid yw Ymddiriedaeth yn Opsiwn. Mae\'n Warant.',
        af: 'Sekuriteit: Vertroue is Nie \'n Opsie Nie. Dit is \'n Waarborg.',
      },
      securityText: {
        en: 'With cryptographically signed data (Web3) and a state-of-the-art infrastructure (GCP), we ensure the integrity of your data and operations.',
        fr: 'Avec des données signées cryptographiquement (Web3) et une infrastructure de pointe (GCP), nous garantissons l\'intégrité de vos opérations.',
        hi: 'क्रिप्टोग्राफिक रूप से हस्ताक्षरित डेटा (वेब3) और अत्याधुनिक इन्फ्रास्ट्रक्चर (GCP) के साथ, हम आपके डेटा और संचालन की अखंडता सुनिश्चित करते हैं।',
        mi: 'Ki te raraunga kua hainatia ā-whakamuna (Web3) me te hanganga hou (GCP), ka whakarite mātou i te tika o ō raraunga me ō mahi.',
        ga: 'Le sonraí sínithe go cripteagrafach (Web3) agus bonneagar úrscothach (GCP), cinntímid sláine do shonraí agus d\'oibríochtaí.',
        gd: 'Le dàta air a shoidhnigeadh gu cripteagrafach (Web3) agus bun-structar ùr-nodha (GCP), nì sinn cinnteach gu bheil ionracas do dhàta agus do ghnìomhachd.',
        cy: 'Gyda data wedi\'i lofnodi\'n cryptograffig (Web3) a seilwaith o\'r radd flaenaf (GCP), rydym yn sicrhau uniondeb eich data a\'ch gweithrediadau.',
        af: 'Met kriptografies ondertekende data (Web3) en \'n moderne infrastruktuur (GCP), verseker ons die integriteit van jou data en operasies.',
      },
      integrationTitle: {
        en: 'Simple Integration: Designed for Your Reality, Not Ours.',
        fr: 'Intégration Simple : Conçu pour votre Réalité, pas pour la nôtre.',
        hi: 'सरल एकीकरण: आपकी वास्तविकता के लिए डिज़ाइन किया गया, हमारी नहीं।',
        mi: 'Whakaurunga Ngāwari: I Hoahoatia mō Tō Ōritetanga, Ehara mō Tō Mātou.',
        ga: 'Comhtháthú Simplí: Deartha Do Do Réaltacht, Ní dár gCuid Féin.',
        gd: 'Amalachadh Sìmplidh: Air a Dhealbhadh Airson Do Fhìrinn, Chan e na h-Againne.',
        cy: 'Integreiddio Syml: Wedi\'i Ddylunio ar gyfer Eich Realiti, Nid Ein Un Ni.',
        af: 'Eenvoudige Integrasie: Ontwerp vir Jou Realiteit, Nie Ons S\'n Nie.',
      },
      integrationText: {
        en: 'Our Kiwi-Edge device is designed to connect to your existing sensor systems in a non-intrusive, plug & play approach.',
        fr: 'Notre boîtier Kiwi-Edge est conçu pour se connecter à vos systèmes de capteurs existants, via une approche non-intrusive et "plug & play".',
        hi: 'हमारा कीवी-एज डिवाइस आपके मौजूदा सेंसर सिस्टम से गैर-घुसपैठ, प्लग एंड प्ले दृष्टिकोण में जुड़ने के लिए डिज़ाइन किया गया है।',
        mi: 'I hoahoatia tō mātou pūrere Kiwi-Edge kia hono atu ki ō pūnaha pūoko o nāianei i roto i te huarahi kore-whakararuraru, "plug & play".',
        ga: 'Tá ár bhfeiste Kiwi-Edge deartha chun nascadh le do chórais braiteora atá ann cheana féin ar bhealach neamh-ionrach, plug & play.',
        gd: 'Tha an t-inneal Kiwi-Edge againn air a dhealbhadh gus ceangal ri na siostaman sensor a th’ agad mu thràth ann an dòigh neo-ionnsaigheach, plug & play.',
        cy: 'Mae ein dyfais Kiwi-Edge wedi\'i dylunio i gysylltu â\'ch systemau synhwyrydd presennol mewn dull di-ymyrraeth, plug & play.',
        af: 'Ons Kiwi-Edge-toestel is ontwerp om aan jou bestaande sensorsisteme te koppel met \'n nie-indringende, prop-en-speel benadering.',
      },
    },
    search: { // Titre de la section "Smart Search" sur la page produit
      title: {
        en: 'Don\'t look for information. Get the answer.',
        fr: 'Ne cherchez plus l\'information. Obtenez la réponse.',
        hi: 'जानकारी न खोजें। उत्तर प्राप्त करें।',
        mi: 'Kaua e rapu mōhiohio. Tikina te whakautu.',
        ga: 'Ná cuardaigh faisnéis. Faigh an freagra.',
        gd: 'Na seall airson fiosrachadh. Faigh am freagairt.',
        cy: 'Peidiwch â chwilio am wybodaeth. Cael yr ateb.',
        af: 'Moenie inligting soek nie. Kry die antwoord.',
      },
      subtitle: {
        en: 'Our Smart Search turns your archives into a 24/7 operational expert.',
        fr: 'Notre Recherche Intelligente transforme vos archives en un expert opérationnel disponible 24/7.',
        hi: 'हमारी स्मार्ट खोज आपके अभिलेखागार को 24/7 परिचालन विशेषज्ञ में बदल देती है।',
        mi: 'Ka huri a mātou Rapu Mātauranga i ō pūranga hei tohunga mahi 24/7.',
        ga: 'Déanann ár gCuardach Cliste do chartlanna a thiontú ina shaineolaí oibriúcháin 24/7.',
        gd: 'Bidh an Rannsachadh Smart againn ag atharrachadh nan tasglannan agad gu eòlaiche obrachaidh 24/7.',
        cy: 'Mae ein Chwilio Clyfar yn troi eich archifau yn arbenigwr gweithredol 24/7.',
        af: 'Ons Slim Soektog verander jou argiewe in \'n 24/7 operasionele kundige.',
      },
      text: {
        en: 'Ask a complex question in natural language and get a factual, sourced answer in seconds. Our A2A protocol dynamically routes your query to the best specialized AI models to find the right information, whether it\'s in technical reports, maintenance logs, or geological surveys.',
        fr: 'Posez une question complexe en langage naturel et obtenez une réponse factuelle et sourcée en secondes. Notre protocole A2A route dynamiquement votre requête vers les meilleurs modèles d\'IA spécialisés pour trouver l\'information, qu\'elle soit dans des rapports techniques, des logs ou des études géologiques.',
        hi: 'प्राकृतिक भाषा में एक जटिल प्रश्न पूछें और सेकंड में एक तथ्यात्मक, स्रोत-आधारित उत्तर प्राप्त करें। हमारा A2A प्रोटोकॉल आपकी क्वेरी को सबसे अच्छे विशेषीकृत एआई मॉडल पर गतिशील रूप से रूट करता है ताकि सही जानकारी मिल सके, चाहे वह तकनीकी रिपोर्ट, रखरखाव लॉग या भूवैज्ञानिक सर्वेक्षण में हो।',
        mi: 'Patai i tētahi pātai matatini i roto i te reo tūturu, ā, ka whiwhi whakautu pono, ā-puna i roto i ngā hēkona. Ka hono hāngai tō mātou tikanga A2A i tō pātai ki ngā tauira AI motuhake pai rawa atu hei kimi i ngā pārongo tika, ahakoa kei roto i ngā pūrongo hangarau, ngā rākau tiaki, ngā rangahau whenua rānei.',
        ga: 'Cuir ceist chasta i dteanga nádúrtha agus faigh freagra fíorasach, foinseach i soicindí. Déanann ár bprótacal A2A do cheist a atreorú go dinimiciúil chuig na samhlacha AI speisialaithe is fearr chun an fhaisnéis cheart a aimsiú, bíodh sé i dtuarascálacha teicniúla, logaí cothabhála, nó suirbhéanna geolaíocha.',
        gd: 'Faighnich ceist iom-fhillte ann an cànan nàdarra agus faigh freagairt fhìor, stòraichte ann an diogan. Bidh am protocol A2A againn a’ stiùireadh do cheist gu dinamach gu na modalan AI sònraichte as fheàrr gus am fiosrachadh ceart a lorg, ge bith a bheil e ann an aithisgean teicnigeach, logaichean cumail suas, no sgrùdaidhean geòlais.',
        cy: 'Gofynnwch gwestiwn cymhleth mewn iaith naturiol a chewch ateb ffeithiol, wedi\'i ffynonellau mewn eiliadau. Mae ein protocol A2A yn llwybro eich ymholiad yn ddeinamig i\'r modelau AI arbenigol gorau i ddod o hyd i\'r wybodaeth gywir, p\'un a yw mewn adroddiadau technegol, logiau cynnal a chadw, neu arolygon daearegol.',
        af: 'Vra \'n komplekse vraag in natuurlike taal en kry \'n feitelike, brongebaseerde antwoord binne sekondes. Ons A2A-protokol stuur jou navraag dinamies na die beste gespesialiseerde KI-modelle om die regte inligting te vind, of dit nou in tegniese verslae, instandhoudingslogboeke of geologiese opnames is.',
      },
    },
    // Définitions pour les nouvelles sections "Core Components" et "Applications"
    coreComponents: {
      title: {
        en: 'Kiwi-Ops Product Architecture: Powering Your Operations',
        fr: 'Architecture Produit Kiwi-Ops : Propulsez Vos Opérations',
        hi: 'कीवी-ऑप्स उत्पाद वास्तुकला: आपके संचालन को शक्ति प्रदान करना',
        mi: 'Hoahoanga Hua Kiwi-Ops: Te Whakakaha i ō Mahi.',
        ga: 'Ailtireacht Táirgí Kiwi-Ops: Ag Cumhachtú Do Oibríochtaí',
        gd: 'Ailtireachd Bathar Kiwi-Ops: A’ toirt cumhachd do na h-obraichean agad',
        cy: 'Pensaernïaeth Cynnyrch Kiwi-Ops: Pweru Eich Gweithrediadau',
        af: 'Kiwi-Ops Produksargitektuur: Dryf Jou Operasies Aan',
      },
      intro: {
        en: 'Kiwi-Ops unifies cutting-edge technologies to deliver unparalleled control and insight.',
        fr: 'Kiwi-Ops unifie des technologies de pointe pour offrir un contrôle et une vision sans précédent.',
        hi: 'कीवी-ऑप्स अद्वितीय नियंत्रण और अंतर्दृष्टि प्रदान करने के लिए अत्याधुनिक प्रौद्योगिकियों को एकीकृत करता है।',
        mi: 'Ka whakakotahi a Kiwi-Ops i ngā hangarau hou kia puta ai te mana whakahaere me te māramatanga kore e rite.',
        ga: 'Aontaíonn Kiwi-Ops teicneolaíochtaí ceannródaíocha chun rialú agus léargas gan sárú a sheachadadh.',
        gd: 'Bidh Kiwi-Ops a’ tighinn còmhla ri teicneòlasan ùr-nodha gus smachd agus lèirsinn gun choimeas a lìbhrigeadh.',
        cy: 'Mae Kiwi-Ops yn uno technolegau blaengar i ddarparu rheolaeth a mewnwelediad heb eu hail.',
        af: 'Kiwi-Ops verenig toonaangewende tegnologieë om ongeëwenaarde beheer en insig te lewer.',
      },
      edgeTitle: {
        en: 'Kiwi-Edge: Intelligent On-Site Processing',
        fr: 'Kiwi-Edge : Traitement Intelligent sur Site',
        hi: 'कीवी-एज: ऑन-साइट बुद्धिमान प्रसंस्करण',
        mi: 'Kiwi-Edge: Te Tukatuka Mātauranga i runga i te Wāhi.',
        ga: 'Kiwi-Edge: Próiseáil Chliste ar an Láthair',
        gd: 'Kiwi-Edge: Giullachd Inntleachdail air an Làrach',
        cy: 'Kiwi-Edge: Prosesu Deallus Ar-safle',
        af: 'Kiwi-Edge: Intelligente Terreinverwerking',
      },
      edgeText: {
        en: 'Our robust Edge AI device processes data directly at the source, ensuring immediate insights and decision-making capabilities, even in disconnected environments.',
        fr: 'Notre dispositif Edge AI robuste traite les données directement à la source, assurant des informations et des capacités de prise de décision immédiates, même dans des environnements déconnectés.',
        hi: 'हमारा मजबूत एज एआई डिवाइस सीधे स्रोत पर डेटा संसाधित करता है, जिससे डिस्कनेक्ट किए गए वातावरण में भी तत्काल अंतर्दृष्टि और निर्णय लेने की क्षमता सुनिश्चित होती है।',
        mi: 'Ka tukatukahia e tō mātou pūrere Edge AI te raraunga tika i te pūtake, ka whakarite i ngā māramatanga inamata me ngā kaha whakatau, ahakoa i roto i ngā taiao kore hononga.',
        ga: 'Próiseálann ár bhfeiste láidir Edge AI sonraí go díreach ag an bhfoinse, ag cinntiú léargais láithreacha agus cumais chinnteoireachta, fiú i dtimpeallachtaí scoite.',
        gd: 'Bidh an t-inneal làidir Edge AI againn a’ giullachd dàta gu dìreach aig an stòr, a’ dèanamh cinnteach gu bheil lèirsinn sa bhad agus comasan co-dhùnaidh ann, eadhon ann an àrainneachdan gun cheangal.',
        cy: 'Mae ein dyfais AI Ymyl gadarn yn prosesu data yn uniongyrchol wrth y ffynhonnell, gan sicrhau mewnwelediadau ar unwaith a galluoedd gwneud penderfyniadau, hyd yn oed mewn amgylcheddau datgysylltiedig.',
        af: 'Ons robuuste Edge KI-toestel verwerk data direk by die bron, wat onmiddellike insigte en besluitnemingsvermoëns verseker, selfs in ontkoppelde omgewings.',
      },
      cloudTitle: {
        en: 'Kiwi-Cloud: Centralized Strategic Intelligence',
        fr: 'Kiwi-Cloud : Intelligence Stratégique Centralisée',
        hi: 'कीवी-क्लाउड: केंद्रीकृत रणनीतिक बुद्धिमत्ता',
        mi: 'Kiwi-Cloud: Te Mātauranga Rautaki Matua.',
        ga: 'Kiwi-Cloud: Faisnéis Straitéiseach Láraithe',
        gd: 'Kiwi-Cloud: Eòlas Ro-innleachdail Meadhanach',
        cy: 'Kiwi-Cloud: Deallusrwydd Strategol Canolog',
        af: 'Kiwi-Cloud: Gesentraliseerde Strategiese Intelligensie',
      },
      cloudText: {
        en: 'Leveraging secure GCP infrastructure, Kiwi-Cloud aggregates and analyzes fleet-wide data, enabling advanced predictive analytics and global operational oversight.',
        fr: 'S\'appuyant sur une infrastructure GCP sécurisée, Kiwi-Cloud agrège et analyse les données de l\'ensemble de la flotte, permettant des analyses prédictives avancées et une supervision opérationnelle globale.',
        hi: 'सुरक्षित GCP इन्फ्रास्ट्रक्चर का लाभ उठाते हुए, कीवी-क्लाउड बेड़े-व्यापी डेटा को एकत्र और विश्लेषण करता है, जिससे उन्नत भविष्य कहनेवाला विश्लेषण और वैश्विक परिचालन निरीक्षण सक्षम होता है।',
        mi: 'Ma te whakamahi i te hanganga GCP haumaru, ka kohia, ka tātarihia e Kiwi-Cloud ngā raraunga o te katoa o te waka, ka taea te tātari matapae matatau me te tirotiro mahi o te ao.',
        ga: 'Ag baint leasa as bonneagar slán GCP, bailíonn agus anailísíonn Kiwi-Cloud sonraí ar fud an chabhlaigh, ag cur ar chumas anailísíocht thuarthach chun cinn agus maoirseacht oibriúcháin dhomhanda.',
        gd: 'Le bhith a’ cleachdadh bun-structair tèarainte GCP, bidh Kiwi-Cloud a’ cruinneachadh agus a’ dèanamh anailis air dàta air feadh a’ chabhlaich, a’ comasachadh anailisean ro-innseach adhartach agus stiùireadh obrachaidh cruinneil.',
        cy: 'Gan ddefnyddio seilwaith GCP diogel, mae Kiwi-Cloud yn casglu ac yn dadansoddi data ar draws y fflyd, gan alluogi dadansoddiadau rhagfynegol datblygedig a goruchwyliaeth weithredol fyd-eang.',
        af: 'Deur veilige GCP-infrastruktuur te benut, aggregeer en ontleed Kiwi-Cloud vlootwye data, wat gevorderde voorspellende analise en wêreldwye operasionele toesig moontlik maak.',
      },
      ledgerTitle: {
        en: 'Kiwi-Ledger: Immutable Data Integrity',
        fr: 'Kiwi-Ledger : Intégrité des Données Immuable',
        hi: 'कीवी-लेजर: अपरिवर्तनीय डेटा अखंडता',
        mi: 'Kiwi-Ledger: Te Tika Raraunga Kore e Taea te Whakarereke.',
        ga: 'Kiwi-Ledger: Sláine Sonraí Do-athraithe',
        gd: 'Kiwi-Ledger: Ionracas Dàta Neo-atharraichte',
        cy: 'Kiwi-Ledger: Integriti Data Anffaeledig',
        af: 'Kiwi-Ledger: Onveranderlike Data-integriteit',
      },
      ledgerText: {
        en: 'Built on Web3 technology, Kiwi-Ledger provides an unchangeable record of all critical operational data, guaranteeing transparency, auditability, and trust.',
        fr: 'Basé sur la technologie Web3, Kiwi-Ledger fournit un enregistrement immuable de toutes les données opérationnelles critiques, garantissant la transparence, l\'auditabilité et la confiance.',
        hi: 'वेब3 तकनीक पर निर्मित, कीवी-लेजर सभी महत्वपूर्ण परिचालन डेटा का एक अपरिवर्तनीय रिकॉर्ड प्रदान करता है, जो पारदर्शिता, ऑडिटेबिलिटी और विश्वास की गारंटी देता है।',
        mi: 'He mea hanga i runga i te hangarau Web3, ka whakarato a Kiwi-Ledger i tētahi rēkooti kore e taea te whakarereke o ngā raraunga whakahaere whakahirahira katoa, ka whakamanahia te mārama, te arotake, me te whakawhirinaki.',
        ga: 'Tógtha ar theicneolaíocht Web3, soláthraíonn Kiwi-Ledger taifead do-athraithe de gach sonraí oibriúcháin ríthábhachtacha, ag ráthú trédhearcachta, inathraitheachta, agus iontaoibhe.',
        gd: 'Air a thogail air teicneòlas Web3, bidh Kiwi-Ledger a’ toirt seachad clàr neo-atharraichte de gach dàta obrachaidh èiginneach, a’ gealltainn follaiseachd, comas sgrùdaidh, agus earbsa.',
        cy: 'Wedi\'i adeiladu ar dechnoleg Web3, mae Kiwi-Ledger yn darparu cofnod anffaeledig o\'r holl ddata gweithredol hollbwysig, gan warantu tryloywder, archwiliadwyedd, ac ymddiriedaeth.',
        af: 'Gebou op Web3-tegnologie, bied Kiwi-Ledger \'n onveranderlike rekord van alle kritieke operasionele data, wat deursigtigheid, ouditeerbaarheid en vertroue waarborg.',
      },
    },
    applications: {
      title: {
        en: 'Kiwi-Ops: Applications Across Critical Domains',
        fr: 'Kiwi-Ops : Applications dans les Domaines Critiques',
        hi: 'कीवी-ऑप्स: महत्वपूर्ण डोमेन में अनुप्रयोग',
        mi: 'Kiwi-Ops: Ngā Tono puta noa i ngā Rohe Whakahirahira.',
        ga: 'Kiwi-Ops: Feidhmchláir Thar Fearainn Chriticiúla',
        gd: 'Kiwi-Ops: Iarrtasan Thar Raointean Èiginneach',
        cy: 'Kiwi-Ops: Ceisiadau Ar Draws Parthau Critigol',
        af: 'Kiwi-Ops: Toepassings Oor Kritieke Domeine',
      },
      subtitle: {
        en: 'Extending intelligent capabilities to Air, Land, and Sea operations.',
        fr: 'Étend les capacités intelligentes aux opérations aériennes, terrestres et maritimes.',
        hi: 'वायु, भूमि और समुद्री संचालन तक बुद्धिमान क्षमताओं का विस्तार।',
        mi: 'Te whakaroa i ngā kaha mātauranga ki ngā mahi Rererangi, Whenua, me te Moana.',
        ga: 'Cumas cliste a leathnú chuig oibríochtaí Aeir, Talún, agus Mara.',
        gd: 'A’ leudachadh chomasan tuigseach gu obraichean Adhair, Fearainn, is Mara.',
        cy: 'Estyn galluoedd deallus i weithrediadau Awyr, Tir, a Môr.',
        af: 'Die uitbreiding van intelligente vermoëns na Lug-, Land- en See-operasies.',
      },
    },
    finalCta: {
      title: {
        en: 'Let\'s build the future of underground infrastructure together.',
        fr: 'Construisons ensemble le futur des infrastructures souterraines.',
        hi: 'आइए मिलकर भूमिगत अवसंरचना का भविष्य बनाएं।',
        mi: 'Me hanga ngātahi e tātou te anamata o ngā hanganga o raro.',
        ga: 'Déanaimis todhchaí an bhonneagair faoi thalamh a thógáil le chéile.',
        gd: 'Togaidh sinn ri teachd a’ bhun-structair fon talamh còmhla.',
        cy: 'Gadewch i ni adeiladu dyfodol seilwaith tanddaearol gyda\'n gilydd.',
        af: 'Kom ons bou saam aan die toekoms van ondergrondse infrastruktuur.',
      },
      subtitle: {
        en: 'Our technology is in beta with selected partners. If you believe innovation is born from audacity, contact us.',
        fr: 'Notre technologie est en bêta avec des partenaires sélectionnés. Si vous croyez que l\'innovation naît de l\'audace, contactez-nous.',
        hi: 'हमारी तकनीक चयनित भागीदारों के साथ बीटा में है। यदि आप मानते हैं कि नवाचार दुस्साहस से पैदा होता है, तो हमसे संपर्क करें।',
        mi: 'Kei te hōtaka beta tō mātou hangarau me ngā hoa mahi kua tohua. Ki te whakapono koe ka whānau te auahatanga i te maia, whakapā mai ki a mātou.',
        ga: 'Tá ár dteicneolaíocht i béite le comhpháirtithe roghnaithe. Má chreideann tú go dtagann nuálaíocht as an misneach, déan teagmháil linn.',
        gd: 'Tha an teicneòlas againn ann an deuchainn le com-pàirtichean taghte. Ma tha thu a’ creidsinn gu bheil ùr-ghnàthachadh air a bhreith bho dhànachd, cuir fios thugainn.',
        cy: 'Mae ein technoleg mewn beta gyda phartneriaid dethol. Os ydych chi\'n credu bod arloesedd yn cael ei eni o feiddgarwch, cysylltwch â ni.',
        af: 'Ons tegnologie is in beta met geselekteerde vennote. As jy glo innovasie word uit waagmoed gebore, kontak ons.',
      },
      button: {
        en: 'Request a Strategic Demo',
        fr: 'Demander une démonstration stratégique',
        hi: 'एक रणनीतिक डेमो का अनुरोध करें',
        mi: 'Tonoa he Whakaaturanga Rautaki',
        ga: 'Iarr Taispeántas Straitéiseach',
        gd: 'Iarr Demo Ro-innleachdail',
        cy: 'Gofyn am Demo Strategol',
        af: 'Versoek \'n Strategiese Demo',
      },
    },
    team: {
        title: { en: 'Our Team', fr: 'Notre Équipe', hi: 'हमारी टीम', mi: 'Tō Mātou Kapa', ga: 'Ár bhFoireann', gd: 'Ar Sgioba', cy: 'Ein Tîm', af: 'Ons Span' },
        subtitle: { en: 'Innovation driven by expertise and passion.', fr: 'L\'innovation portée par l\'expertise et la passion.', hi: 'विशेषज्ञता और जुनून से प्रेरित नवाचार।', mi: 'Te auahatanga e akiakihia ana e te tohungatanga me te ngākau nui.', ga: 'Nuálaíocht á tiomáint ag saineolas agus paisean.', gd: 'Ùr-ghnàthachadh air a stiùireadh le eòlas agus dìoghras.', cy: 'Arloesedd a yrrir gan arbenigedd ac angerdd.', af: 'Innovasie gedryf deur kundigheid en passie.' },
        member1Name: { en: 'Professor Alistair Finch', fr: 'Professeur Alistair Finch', hi: 'प्रोफेसर एलिस्टर फिंच', mi: 'Ahorangi Alistair Finch', ga: 'An tOllamh Alistair Finch', gd: 'An t-Ollamh Alistair Finch', cy: 'Yr Athro Alistair Finch', af: 'Professor Alistair Finch' },
        member1Title: { en: 'CEO & Co-founder', fr: 'CEO & Co-fondateur', hi: 'सीईओ और सह-संस्थापक', mi: 'Tumuaki & Kaiwhakarewa Tahi', ga: 'POF & Comhbhunaitheoir', gd: 'Ceannard & Co-stèidheadair', cy: 'Prif Swyddog Gweithredol a Chyd-sefydlydd', af: 'CEO en Mede-stigter' },
        member1Bio: { en: 'Visionary leader with 15 years of experience in underground engineering and project management. Spearheading Kiwi-Ops strategy and business development.', fr: 'Leader visionnaire avec 15 ans d\'expérience en ingénierie souterraine et gestion de projet. Il dirige la stratégie et le développement commercial de Kiwi-Ops.', hi: 'भूमिगत इंजीनियरिंग और परियोजना प्रबंधन में 15 वर्षों के अनुभव के साथ दूरदर्शी नेता। कीवी-ऑप्स रणनीति और व्यवसाय विकास का नेतृत्व कर रहे हैं।', mi: 'He kaiārahi matakite me te 15 tau o te wheako i roto i te pūkaha o raro me te whakahaere kaupapa. E ārahi ana i te rautaki me te whanaketanga pakihi o Kiwi-Ops.', ga: 'Ceannaire físí le 15 bliana de thaithí i réimse na hinnealtóireachta faoi thalamh agus bainistíocht tionscadail. Ag treorú straitéis agus forbairt ghnó Kiwi-Ops.', gd: 'Ceannard lèirsinnach le 15 bliadhna de eòlas ann an innleadaireachd fon talamh agus riaghladh pròiseict. A’ stiùireadh ro-innleachd agus leasachadh gnìomhachas Kiwi-Ops.', cy: 'Arweinydd gweledigaethol gyda 15 mlynedd o brofiad mewn peirianneg tanddaearol a rheoli prosiectau. Yn arwain strategaeth a datblygiad busnes Kiwi-Ops.', af: 'Visioenêre leier met 15 jaar ondervinding in ondergrondse ingenieurswese en projekbestuur. Lei Kiwi-Ops se strategie en sake-ontwikkeling.' },
        member2Name: { en: 'Dr. Kwame Nkrumah', fr: 'Dr. Kwame Nkrumah', hi: 'डॉ. क्वामे न्क्रूमा', mi: 'Takuta Kwame Nkrumah', ga: 'An Dr. Kwame Nkrumah', gd: 'An Dotair Kwame Nkrumah', cy: 'Dr. Kwame Nkrumah', af: 'Dr. Kwame Nkrumah' },
        member2Title: { en: 'CTO & Co-founder', fr: 'CTO & Co-fondateur', hi: 'सीटीओ और सह-संस्थापक', mi: 'Tumuaki Hangarau & Kaiwhakarewa Tahi', ga: 'CTO & Comhbhunaitheoir', gd: 'CTO & Co-stèidheadair', cy: 'Prif Swyddog Technoleg a Chyd-sefydlydd', af: 'CTO en Mede-stigter' },
        member2Bio: { en: 'Tech wizard with a PhD in AI and 12 years in software architecture. Drives the innovation behind Kiwi-Ops\' Edge AI, Cloud, and Web3 solutions.', fr: 'Génie technique avec un doctorat en IA et 12 ans en architecture logicielle. Il est le moteur de l\'innovation derrière les solutions Edge AI, Cloud et Web3 de Kiwi-Ops.', hi: 'एआई में पीएचडी और सॉफ्टवेयर आर्किटेक्चर में 12 वर्षों के अनुभव के साथ तकनीकी विशेषज्ञ। कीवी-ऑप्स के एज एआई, क्लाउड और वेब3 समाधानों के पीछे नवाचार को बढ़ावा देते हैं।', mi: 'He tohunga hangarau me te PhD i roto i te AI me te 12 tau i roto i te hoahoanga pūmanawa. E akiaki ana i te auahatanga i muri i ngā otinga Edge AI, Cloud, me Web3 a Kiwi-Ops.', ga: 'Draíodóir teicneolaíochta le PhD san AI agus 12 bliana i gcomhpháirtíocht bogearraí. Ag tiomáint na nuálaíochta taobh thiar de réitigh Edge AI, Cloud, agus Web3 de chuid Kiwi-Ops.', gd: 'Bana-bhuidseach teicneòlas le PhD ann an AI agus 12 bliadhna ann an ailtireachd bathar-bog. A’ stiùireadh an ùr-ghnàthachaidh air cùl fhuasglaidhean Edge AI, Cloud, agus Web3 aig Kiwi-Ops.', cy: 'Dewin technegol gyda PhD mewn AI a 12 mlynedd mewn pensaernïaeth meddalwedd. Yn gyrru\'r arloesedd y tu ôl i ddatrysiadau AI Ymyl, Cwmwl, a Web3 Kiwi-Ops.', af: 'Tegnologiese towenaar met \'n PhD in KI en 12 jaar in sagteware-argitektuur. Dryf die innovasie agter Kiwi-Ops se Edge KI, Wolk, en Web3-oplossings aan.' },
    }
  },
  solutionsPage: { // Nouvelle section pour les traductions spécifiques de la page Solutions
    title: {
      en: 'Our Solutions: Mastering Every Environment',
      fr: 'Nos Solutions : Maîtriser Chaque Environnement',
      hi: 'हमारे समाधान: हर वातावरण में महारत हासिल करना',
      mi: 'Ā Mātou Rongoā: Te Whakahaere i ia Taiao',
      ga: 'Ár Réitigh: Máistreacht ar Gach Timpeallacht',
      gd: 'Ar Fuasglaidhean: A’ Maighstireachd Gach Àrainneachd',
      cy: 'Ein Datrysiadau: Meistroli Pob Amgylchedd',
      af: 'Ons Oplossings: Beheers Elke Omgewing',
    },
    subtitle: {
      en: 'Intelligent capabilities for Air, Land, and Sea operations.',
      fr: 'Capacités intelligentes pour les opérations aériennes, terrestres et maritimes.',
      hi: 'हवा, भूमि और समुद्री अभियानों के लिए बुद्धिमान क्षमताएं।',
      mi: 'Ngā kaha mātauranga mō ngā mahi Rererangi, Whenua, me te Moana.',
      ga: 'Cumas cliste d\'oibríochtaí Aeir, Talún, agus Mara.',
      gd: 'Comasan tuigseach airson obraichean Adhair, Fearainn, is Mara.',
      cy: 'Galluoedd deallus ar gyfer gweithrediadau Awyr, Tir, a Môr.',
      af: 'Intelligente vermoëns vir Lug-, Land- en See-operasies.',
    },
    airTitle: {
      en: 'Air Operations: Precision and Predictive Power',
      fr: 'Opérations Aériennes : Précision et Puissance Prédictive',
      hi: 'हवाई संचालन: सटीकता और पूर्वानुमान क्षमता',
      mi: 'Ngā Mahi Rererangi: Te Tino me te Mana Matapae',
      ga: 'Oibríochtaí Aeir: Cruinneas agus Cumhacht Thuarthach',
      gd: 'Gnìomhachasan Adhair: Cruinneas agus Cumhachd Ro-innse',
      cy: 'Gweithrediadau Awyr: Cywirdeb a Phŵer Rhagfynegol',
      af: 'Lugoperasies: Presisie en Voorspellende Krag',
    },
    airText: {
      en: 'From drone fleet management to predictive maintenance of complex airborne systems, Kiwi-Ops ensures critical advantage in the skies.',
      fr: 'De la gestion de flottes de drones à la maintenance prédictive de systèmes aéroportés complexes, Kiwi-Ops assure un avantage critique dans les airs.',
      hi: 'ड्रोन बेड़े प्रबंधन से लेकर जटिल हवाई प्रणालियों के पूर्वानुमानित रखरखाव तक, कीवी-ऑप्स आसमान में महत्वपूर्ण लाभ सुनिश्चित करता है।',
      mi: 'Mai i te whakahaere waka rererangi kore tangata ki te tiaki matapae o ngā pūnaha rererangi matatini, ka whakarite a Kiwi-Ops i te painga nui i te rangi.',
      ga: 'Ó bhainistíocht cabhlach drone go cothabháil thuarthach córas casta aerbheirthe, cinntíonn Kiwi-Ops buntáiste ríthábhachtach sna spéartha.',
      gd: 'Bho rianachd cabhlach drone gu cumail suas ro-innseach siostaman adhair iom-fhillte, bidh Kiwi-Ops a’ dèanamh cinnteach gu bheil buannachd chudromach anns na speuran.',
      cy: 'O reolaeth fflyd dronau i gynnal a chadw rhagfynegol systemau awyr cymhleth, mae Kiwi-Ops yn sicrhau mantais hollbwysig yn yr awyr.',
      af: 'Van dreunvlootbestuur tot voorspellende instandhouding van komplekse lugstelsels, verseker Kiwi-Ops \'n kritieke voordeel in die lug.',
    },
    landTitle: {
      en: 'Land Operations: Groundbreaking Intelligence',
      fr: 'Opérations Terrestres : Intelligence de Terrain Révolutionnaire',
      hi: 'भूमि संचालन: अभूतपूर्व बुद्धिमत्ता',
      mi: 'Ngā Mahi Whenua: Te Mātauranga Whai Tikanga',
      ga: 'Oibríochtaí Talún: Faisnéis Athfhionnachtála',
      gd: 'Gnìomhachasan Fearainn: Eòlas Briseadh-talmhainn',
      cy: 'Gweithrediadau Tir: Deallusrwydd Arloesol',
      af: 'Landoperasies: Grondverskuiwende Intelligensie',
    },
    landText: {
      en: 'Beyond tunneling, our solutions empower terrestrial forces with predictive vehicle maintenance, advanced reconnaissance, and real-time environmental analysis.',
      fr: 'Au-delà du percement de tunnels, nos solutions renforcent les forces terrestres avec la maintenance prédictive des véhicules, la reconnaissance avancée et l\'analyse environnementale en temps réel.',
      hi: 'सुरंग बनाने से परे, हमारे समाधान पूर्वानुमानित वाहन रखरखाव, उन्नत टोही और वास्तविक समय के पर्यावरणीय विश्लेषण के साथ स्थलीय सेनाओं को सशक्त बनाते हैं।',
      mi: 'I tua atu i te keri hūrori, ka whakamanahia e ā mātou rongoā ngā ope whenua ki te tiaki matapae waka, te torotoro matatau, me te tātari taiao wā-tūturu.',
      ga: 'Thar an tollánú, cumhachtaíonn ár réitigh fórsaí talún le cothabháil thuarthach feithiclí, taiscéalaíocht chun cinn, agus anailís chomhshaoil fíor-ama.',
      gd: 'Nas fhaide na tolladh, bidh na fuasglaidhean againn a’ toirt cumhachd do fheachdan talmhainn le cumail suas ro-innseach charbadan, rannsachadh adhartach, agus anailis àrainneachdail ann an àm fìor.',
      cy: 'Y tu hwnt i dwneli, mae ein datrysiadau yn grymuso lluoedd daearol gyda chynnal a chadw cerbydau rhagfynegol, archwiliad uwch, a dadansoddiad amgylcheddol amser real.',
      af: 'Behalwe tonnelbou, bemagtig ons oplossings landmagte met voorspellende voertuigonderhoud, gevorderde verkenning, en intydse omgewingsanalise.',
    },
    seaTitle: {
      en: 'Sea Operations: Depths of Data, Surface of Control',
      fr: 'Opérations Maritimes : Profondeurs de Données, Surface de Contrôle',
      hi: 'समुद्री संचालन: डेटा की गहराई, नियंत्रण की सतह',
      mi: 'Ngā Mahi Moana: Te Hōhonutanga o ngā Raraunga, Te Mata o te Mana Whakahaere',
      ga: 'Oibríochtaí Muirí: Doimhneachtaí Sonraí, Dromchla Rialaithe',
      gd: 'Gnìomhachasan Mara: Doimhneachd Dàta, Uachdar Smachd',
      cy: 'Gweithrediadau Môr: Dyfnder Data, Wyneb Rheolaeth',
      af: 'See-operasies: Dieptes van Data, Oppervlak van Beheer',
    },
    seaText: {
      en: 'From subsurface monitoring to naval fleet optimization, Kiwi-Ops provides unparalleled situational awareness and operational efficiency for maritime domains.',
      fr: 'De la surveillance sous-marine à l\'optimisation de flottes navales, Kiwi-Ops offre une connaissance situationnelle et une efficacité opérationnelle inégalées pour les domaines maritimes.',
      hi: 'पानी के नीचे की निगरानी से लेकर नौसेना बेड़े के अनुकूलन तक, कीवी-ऑप्स समुद्री डोमेन के लिए अद्वितीय स्थितिजन्य जागरूकता और परिचालन दक्षता प्रदान करता है।',
      mi: 'Mai i te aroturuki i raro i te wai ki te whakatikatika waka moana, ka whakarato a Kiwi-Ops i te mohiotanga ā-horahanga kore e rite, me te whai hua whakahaere mō ngā wāhanga moana.',
      ga: 'Ó fhaireachán fomhuirí go barrfheabhsú cabhlach cabhlaigh, cuireann Kiwi-Ops feasacht staide gan samhail agus éifeachtúlacht oibriúcháin ar fáil do réimsí muirí.',
      gd: 'Bho sgrùdadh fo-mhuir gu optimization cabhlach cabhlaich, bidh Kiwi-Ops a’ toirt seachad mothachadh suidheachadh gun choimeas agus èifeachdas obrachaidh airson raointean mara.',
      cy: 'O fonitro is-wyneb i optimeiddio fflyd llyngesol, mae Kiwi-Ops yn darparu ymwybyddiaeth sefyllfaol a effeithlonrwydd gweithredol heb ei hail ar gyfer meysydd morwrol.',
      af: 'Van onderwatermonitering tot vlootoptimisering, bied Kiwi-Ops ongeëwenaarde situasionele bewustheid en operasionele doeltreffendheid vir maritieme gebiede.',
    },
  },
  platform: { // Nouvelle section pour les traductions spécifiques de la page Platform
    title: {
      en: 'The Kiwi-Ops Platform: Your Operational Command Center',
      fr: 'La Plateforme Kiwi-Ops : Votre Centre de Commande Opérationnel',
      hi: 'कीवी-ऑप्स प्लेटफ़ॉर्म: आपका परिचालन कमान केंद्र',
      mi: 'Te Paparanga Kiwi-Ops: Tō Pokapū Whakahaere Mahi',
      ga: 'Ardán Kiwi-Ops: Do Lárionad Ordaithe Oibriúcháin',
      gd: 'Àrd-ùrlar Kiwi-Ops: An t-Ionad Smachd Obrachaidh agad',
      cy: 'Llwyfan Kiwi-Ops: Eich Canolfan Rheoli Gweithredol',
      af: 'Die Kiwi-Ops Platform: Jou Operasionele Beheer Sentrum',
    },
    subtitle: {
      en: 'Unifying Edge AI, Secure Cloud, and Web3 Trust for Unprecedented Control.',
      fr: 'Unifiant l\'IA Edge, le Cloud Sécurisé et la Confiance Web3 pour un Contrôle Inédit.',
      hi: 'अभूतपूर्व नियंत्रण के लिए एज एआई, सुरक्षित क्लाउड और वेब3 ट्रस्ट को एकीकृत करना।',
      mi: 'Te Whakakotahi i te AI Whakamutunga, te Kapua Haumaru, me te Whakawhirinaki Web3 mo te Mana Kore-mua.',
      ga: 'Ag Aontú AI Imeall, Scamaill Shláin, agus Iontaobhais Web3 le haghaidh Rialú Gan Réamhshampla.',
      gd: 'A’ tighinn còmhla ri AI Iomall, Sgòth Tèarainte, agus Earbsa Web3 airson Smachd Gun choimeas.',
      cy: 'Uno AI Ymyl, Cwmwl Diogel, ac Ymddiriedaeth Web3 ar gyfer Rheolaeth Ddigyffelyb.',
      af: 'Rand KI, Veilige Wolk, en Web3 Vertroue Verenigde vir Ongecedented Beheer.',
    },
    // Les traductions pour les piliers (Kiwi-Edge, Kiwi-Cloud, Kiwi-Ledger) sont déjà dans productPage.solution
  },
  aiAgents: { // Nouvelle section pour les agents AI, pour la page Solutions
    sectionTitle: {
      en: 'Meet Our Specialized AI Agents',
      fr: 'Rencontrez nos Agents d\'Intelligence Spécialisée',
      hi: 'हमारे विशेष एआई एजेंटों से मिलें',
      mi: 'Tutaki ki ō Mātou Kaihoko AI Whai Whakaritenga',
      ga: 'Buail le hÁr nGníomhairí AI Speisialaithe',
      gd: 'Coinnich ris na h-Àidseantan AI Sònraichte againn',
      cy: 'Cwrdd â\'n Hasianwyr AI Arbenigol',
      af: 'Ontmoet Ons Gespesialiseerde KI Agente',
    },
    sectionSubtitle: {
      en: 'Kiwi-Ops\' A2A protocol connects your queries to the most relevant expertise.',
      fr: 'Le protocole A2A de Kiwi-Ops connecte vos requêtes à l\'expertise la plus pertinente.',
      hi: 'कीवी-ऑप्स का ए2ए प्रोटोकॉल आपकी प्रश्नों को सबसे प्रासंगिक विशेषज्ञता से जोड़ता है।',
      mi: 'Ko te kawa A2A a Kiwi-Ops e hono ana i ō patai ki te tohungatanga tino tika.',
      ga: 'Ceanglaíonn prótacal A2A Kiwi-Ops do cheisteanna leis an saineolas is ábhartha.',
      gd: 'Bidh protocol A2A Kiwi-Ops a’ ceangal do cheistean ris an eòlas as buntainniche.',
      cy: 'Mae protocol A2A Kiwi-Ops yn cysylltu eich ymholiadau â\'r arbenigedd mwyaf perthnasol.',
      af: 'Kiwi-Ops se A2A-protokol verbind jou navrae met die mees relevante kundigheid.',
    },
    geoAgentTitle: {
      en: 'Geological Analysis Agent',
      fr: 'Agent d\'Analyse Géologique',
      hi: 'भूवैज्ञानिक विश्लेषण एजेंट',
      mi: 'Kaihoko Tātari Mātaiao Whenua',
      ga: 'Gníomhaire Anailíse Geolaíche',
      gd: 'Àidseant Anailis Geòlais',
      cy: 'Asiant Dadansoddi Geolegol',
      af: 'Geologiese Analise Agent',
    },
    geoAgentText: {
      en: 'Specialized in analyzing subterranean data and predicting geological challenges for construction and defense.',
      fr: 'Spécialisé dans l\'analyse des données souterraines et la prédiction des défis géologiques pour la construction et la défense.',
      hi: 'भूमिगत डेटा का विश्लेषण करने और निर्माण और रक्षा के लिए भूवैज्ञानिक चुनौतियों का अनुमान लगाने में विशेषज्ञ।',
      mi: 'He tohunga ki te tātari raraunga o raro me te matapae i ngā wero mātaiao whenua mō te hanga me te tiaki.',
      ga: 'Speisialaithe in anailís a dhéanamh ar shonraí faoi thalamh agus dúshláin gheolaíocha a thuar do thógáil agus cosaint.',
      gd: 'Sònraichte ann a bhith a’ dèanamh anailis air dàta fon talamh agus a’ ro-innse dhùbhlain geòlais airson togail agus dìon.',
      cy: 'Arbenigol mewn dadansoddi data tanddaearol a rhagfynegi heriau geolegol ar gyfer adeiladu ac amddiffyn.',
      af: 'Gespesialiseerd in die ontleding van ondergrondse data en die voorspelling van geologiese uitdagings vir konstruksie en verdediging.',
    },
    predMaintAgentTitle: {
      en: 'Predictive Maintenance Agent',
      fr: 'Agent de Maintenance Prédictive',
      hi: 'पूर्वानुमानित रखरखाव एजेंट',
      mi: 'Kaihoko Tiaki Matapae',
      ga: 'Gníomhaire Cothabhála Tuarthach',
      gd: 'Àidseant Cumail Suas Ro-innseach',
      cy: 'Asiant Cynnal a Chadw Rhagfynegol',
      af: 'Voorspellende Instandhouding Agent',
    },
    predMaintAgentText: {
      en: 'Detects real-time anomalies and anticipates failures for TBMs, land vehicles, and air/sea systems.',
      fr: 'Détecte les anomalies en temps réel et anticipe les pannes pour les tunneliers, véhicules terrestres, et systèmes aériens/maritimes.',
      hi: 'टीबीएम, भूमि वाहनों और हवाई/समुद्री प्रणालियों के लिए वास्तविक समय में विसंगतियों का पता लगाता है और विफलताओं का अनुमान लगाता है।',
      mi: 'Ka kitea ngā hē i te wā tūturu, ā, ka matapae i ngā hē mō ngā TBM, waka whenua, me ngā pūnaha hau/moana.',
      ga: 'Braitheann sé aimhrialtachtaí fíor-ama agus tuartar teipeanna do TBManna, feithiclí talún, agus córais aeir/mara.',
      gd: 'Lorgaidh e neo-riaghailtean ann an àm fìor agus ro-innsear fàilligean airson TBMan, carbadan talmhainn, agus siostaman adhair/mara.',
      cy: 'Canfod annormaleddau amser real a rhagweld methiannau ar gyfer TBMau, cerbydau tir, a systemau awyr/môr.',
      af: 'Bespeur intydse afwykings en voorsien mislukkings vir TBMs, landvoertuie en lug-/see-stelsels.',
    },
    tactIntAgentTitle: {
      en: 'Tactical Intelligence Agent',
      fr: 'Agent de Renseignement Tactique',
      hi: 'सामरिक खुफिया एजेंट',
      mi: 'Kaihoko Mōhiohio Whai Tikanga',
      ga: 'Gníomhaire Faisnéise Tactúla',
      gd: 'Àidseant Fiosrachaidh innleachdail',
      cy: 'Asiant Cudd-wybodaeth Tactegol',
      af: 'Taktiese Intelligensie Agent',
    },
    tactIntAgentText: {
      en: 'Provides advanced situational awareness and environmental analysis for real-time strategic decision-making in any domain.',
      fr: 'Fournit une connaissance situationnelle avancée et des analyses environnementales pour la prise de décision stratégique en temps réel dans n\'importe quel domaine.',
      hi: 'किसी भी डोमेन में वास्तविक समय में रणनीतिक निर्णय लेने के लिए उन्नत स्थितिजन्य जागरूकता और पर्यावरणीय विश्लेषण प्रदान करता है।',
      mi: 'Ka whakarato i te mōhiotanga ā-horahanga matatau me te tātari taiao mō te whakatau rautaki wā-tūturu i roto i tētahi rohe.',
      ga: 'Soláthraíonn sé feasacht staide chun cinn agus anailís chomhshaoil le haghaidh cinnteoireachta straitéisí fíor-ama in aon réimse.',
      gd: 'Bheir e seachad tuigse staide adhartach agus anailis àrainneachdail airson co-dhùnaidhean ro-innleachdail ann an àm fìor ann an raon sam bith.',
      cy: 'Darparu ymwybyddiaeth sefyllfaol uwch a dadansoddiad amgylcheddol ar gyfer gwneud penderfyniadau strategol amser real mewn unrhyw faes.',
      af: 'Verskaf gevorderde situasionele bewustheid en omgewingsanalise vir intydse strategiese besluitneming in enige domein.',
    },
    web3CompAgentTitle: {
      en: 'Web3 Compliance & Data Integrity Agent',
      fr: 'Agent de Conformité Web3 et d\'Intégrité des Données',
      hi: 'वेब3 अनुपालन और डेटा अखंडता एजेंट',
      mi: 'Kaihoko Whakatutukitanga Web3 me te Tino Raraunga',
      ga: 'Gníomhaire Comhlíonta Web3 & Sláine Sonraí',
      gd: 'Àidseant Co-chòrdachd Web3 & Ionracas Dàta',
      cy: 'Asiant Cydymffurfiaeth Web3 ac Integriti Data',
      af: 'Web3 Nakoming en Data-integriteit Agent',
    },
    web3CompAgentText: {
      en: 'Ensures immutable traceability of critical events and data integrity verification via the Kiwi-Ledger for utmost trust and accountability.',
      fr: 'Assure la traçabilité immuable des événements critiques et la vérification de l\'intégrité des données via le Kiwi-Ledger pour une confiance et une responsabilité maximales.',
      hi: 'अत्यधिक विश्वास और जवाबदेही के लिए कीवी-लेजर के माध्यम से महत्वपूर्ण घटनाओं की अपरिवर्तनीय पता लगाने की क्षमता और डेटा अखंडता सत्यापन सुनिश्चित करता है।',
      mi: 'Ka whakarite i te tino mōhiotanga kore e taea te whakarereke o ngā huihuinga whakahirahira me te whakaurunga raraunga mā te Kiwi-Ledger mō te tino whakawhirinaki me te kawenga takohanga.',
      ga: 'Cinntíonn sé inrianaitheacht dhochlaíoch imeachtaí criticiúla agus fíorú sláine sonraí trí Kiwi-Ledger le haghaidh an t-iontaobhas agus an chuntasacht is airde.',
      gd: 'Bheir e cinnteachd do shlighe-rùrachd thachartasan èiginneach agus dearbhadh ionracas dàta tro Kiwi-Ledger airson earbsa agus cunntachalachd as àirde.',
      cy: 'Sicrhau olrhain digwyddiadau critigol yn anwadal a gwirio integriti data trwy\'r Kiwi-Ledger ar gyfer ymddiriedaeth ac atebolrwydd llwyr.',
      af: 'Verseker onveranderlike naspeurbaarheid van kritieke gebeurtenisse en data-integriteitsverifikasie via die Kiwi-Ledger vir uiterste vertroue en aansprakelijkheid.',
    },
  },
  platformPAGE: { // Nouvelle section pour les traductions spécifiques de la page Platform
    title: {
      en: 'The Kiwi-Ops Platform: Your Operational Command Center',
      fr: 'La Plateforme Kiwi-Ops : Votre Centre de Commande Opérationnel',
      hi: 'कीवी-ऑप्स प्लेटफ़ॉर्म: आपका परिचालन कमान केंद्र',
      mi: 'Te Paparanga Kiwi-Ops: Tō Pokapū Whakahaere Mahi',
      ga: 'Ardán Kiwi-Ops: Do Lárionad Ordaithe Oibriúcháin',
      gd: 'Àrd-ùrlar Kiwi-Ops: An t-Ionad Smachd Obrachaidh agad',
      cy: 'Llwyfan Kiwi-Ops: Eich Canolfan Rheoli Gweithredol',
      af: 'Die Kiwi-Ops Platform: Jou Operasionele Beheer Sentrum',
    },
    subtitle: {
      en: 'Unifying Edge AI, Secure Cloud, and Web3 Trust for Unprecedented Control.',
      fr: 'Unifiant l\'IA Edge, le Cloud Sécurisé et la Confiance Web3 pour un Contrôle Inédit.',
      hi: 'अभूतपूर्व नियंत्रण के लिए एज एआई, सुरक्षित क्लाउड और वेब3 ट्रस्ट को एकीकृत करना।',
      mi: 'Te Whakakotahi i te AI Whakamutunga, te Kapua Haumaru, me te Whakawhirinaki Web3 mo te Mana Kore-mua.',
      ga: 'Ag Aontú AI Imeall, Scamaill Shláin, agus Iontaobhais Web3 le haghaidh Rialú Gan Réamhshampla.',
      gd: 'A’ tighinn còmhla ri AI Iomall, Sgòth Tèarainte, agus Earbsa Web3 airson Smachd Gun choimeas.',
      cy: 'Uno AI Ymyl, Cwmwl Diogel, ac Ymddiriedaeth Web3 ar gyfer Rheolaeth Ddigyffelyb.',
      af: 'Rand KI, Veilige Wolk, en Web3 Vertroue Verenigde vir Ongecedented Beheer.',
    },
    // Les traductions pour les piliers (Kiwi-Edge, Kiwi-Cloud, Kiwi-Ledger) sont déjà dans productPage.solution
  },
  installPage: { // Nouvelle section pour les traductions de la page d'installation
    title: {
      en: 'Download Kiwi-Ops',
      fr: 'Téléchargez Kiwi-Ops',
      hi: 'कीवी-ऑप्स डाउनलोड करें',
      mi: 'Tikiake i a Kiwi-Ops',
      ga: 'Íoslódáil Kiwi-Ops',
      gd: 'Luchdaich sìos Kiwi-Ops',
      cy: 'Lawrlwytho Kiwi-Ops',
      af: 'Laai Kiwi-Ops af',
    },
    subtitle: {
      en: 'Get the full power of operational intelligence on your device.',
      fr: 'Profitez de toute la puissance de l\'intelligence opérationnelle sur votre appareil.',
      hi: 'अपने डिवाइस पर परिचालन बुद्धिमत्ता की पूरी शक्ति प्राप्त करें।',
      mi: 'Tikina te mana katoa o te mātauranga whakahaere ki tō pūrere.',
      ga: 'Faigh lánchumhacht na faisnéise oibríochtúla ar do ghléas.',
      gd: 'Faigh làn chumhachd fiosrachaidh obrachaidh air an uidheam agad.',
      cy: 'Cael holl rym deallusrwydd gweithredol ar eich dyfais.',
      af: 'Kry die volle krag van operasionele intelligensie op jou toestel.',
    },
    googlePlay: {
      en: 'Get it on Google Play',
      fr: 'Disponible sur Google Play',
      hi: 'Google Play पर प्राप्त करें',
      mi: 'Tikina i te Google Play',
      ga: 'Faigh é ar Google Play',
      gd: 'Faigh e air Google Play',
      cy: 'Cael ef ar Google Play',
      af: 'Kry dit op Google Play',
    },
    appStore: {
      en: 'Download on the App Store',
      fr: 'Télécharger sur l\'App Store',
      hi: 'ऐप स्टोर से डाउनलोड करें',
      mi: 'Tikiake i the App Store',
      ga: 'Íoslódáil ón App Store',
      gd: 'Luchdaich sìos air an App Store',
      cy: 'Lawrlwytho ar yr App Store',
      af: 'Laai af op die App Store',
    },
    qrCodeText: {
      en: 'Scan to Download for All Platforms',
      fr: 'Scannez pour télécharger sur toutes les plateformes',
      hi: 'सभी प्लेटफॉर्म के लिए डाउनलोड करने के लिए स्कैन करें',
      mi: 'Matawai ki te Tikiake mō ngā Paparanga Katoa',
      ga: 'Scan chun Íoslódáil do Gach Ardán',
      gd: 'Sgan airson Luchdadh sìos airson a h-uile Àrd-ùrlar',
      cy: 'Sganiwch i Lawrlwytho ar gyfer Pob Llwyfan',
      af: 'Skandeer om af te laai vir Alle Platforms',
    },
    googlePlayLink: 'https://play.google.com/store/apps/details?id=your.app.id', // Remplacez par le vrai lien
    appStoreLink: 'https://apps.apple.com/us/app/your-app-id/id1234567890', // Remplacez par le vrai lien
    qrCodeImage: '/images/kiwi-ops-qrcode.png', // Chemin vers votre QR code image
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

export default function ProductPage() {
  const { theme } = useTheme();
  const { language } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);

  const getLoginNavTranslation = (key: string) => getTranslation('loginPage', key, language);
  const tProduct = (key: string) => getTranslation('productPage', key, language);
  const tProductSolution = (key: string) => getTranslation('productPage', `solution.${key}`, language);
  const tProductCoreComponents = (key: string) => getTranslation('productPage', `coreComponents.${key}`, language);
  const tProductApplications = (key: string) => getTranslation('productPage', `applications.${key}`, language);
  const tSolutionsPage = (key: string) => getTranslation('solutionsPage', key, language); // Pour réutiliser les traductions d'applications
  const tInstall = (key: string) => getTranslation('installPage', key, language);

  const handleInstallClick = () => {
    window.location.href = '/install';
  };

  return (
    <div className={`${styles.pageContainer} ${theme === 'dark' ? styles.darkMode : styles.lightMode}`}>
      {/* Navbar */}
      <nav className={styles.navbar}>
        <div className={styles.navLogo}>Kiwi-Ops</div>
        <button className={styles.menuToggle} onClick={() => setMenuOpen(!menuOpen)}><FaBars /></button>
        <ul className={`${styles.navLinks} ${menuOpen ? styles.open : ''}`}>
           {/* Lien 1: Nos Produits -> /product */}
           <li><Link href="/product">{getLoginNavTranslation('product')}</Link></li>

           {/* Lien 2: La plateforme -> /platform */}
           <li><Link href="/platform">{getLoginNavTranslation('features')}</Link></li>

           {/* Lien 3: Notre Équipe -> /team */}
           <li><Link href="/team">{getLoginNavTranslation('team')}</Link></li>

           {/* Lien 4: Notre Histoire -> /story */}
           <li><Link href="/story">{getLoginNavTranslation('story')}</Link></li>

           {/* Lien 5: Nos solutions -> /solutions */}
           <li><Link href="/solutions">{getLoginNavTranslation('search')}</Link></li>
        </ul>
        {/* Le label 'installAppLabel' est un label générique, donc getLoginNavTranslation est approprié ici */}
        <button className={styles.installButton} onClick={handleInstallClick} aria-label={tInstall('installAppLabel')}><FaDownload /></button>
      </nav>

      {/* --- SECTION 1: HERO --- */}
      <section className={`${styles.section} ${styles.heroSection}`} id="hero-section">
        <h1 className={styles.mainTitle}>{tProduct('hero.title')}</h1>
        <p className={styles.subtitle}>{tProduct('hero.subtitle')}</p>
        <a href="#contact" className={styles.ctaButton}>{tProduct('hero.ctaButton')}</a>
      </section>

      {/* --- SECTION 2: THE CHALLENGE --- */}
      <section className={`${styles.section} ${styles.challengeSection}`} id="challenge-section">
        <h2 className={styles.sectionTitle}>{tProduct('challenge.title')}</h2>
        <div className={styles.challengeGrid}>
          <p>{tProduct('challenge.point1')}</p>
          <p>{tProduct('challenge.point2')}</p>
          <p>{tProduct('challenge.point3')}</p>
        </div>
      </section>

      {/* --- SECTION 3: THE SOLUTION (Pillars) - Aperçu de haut niveau --- */}
      <section className={`${styles.section} ${styles.lightBackground} ${styles.solutionSection}`} id="solution-section">
        <h2 className={styles.sectionTitle}>{tProductSolution('title')}</h2>
        <div className={styles.pillarsGrid}>
          <div className={styles.pillarCard}>
            <h3>{tProductSolution('pillar1Title')}</h3>
            <p>{tProductSolution('pillar1Text')}</p>
          </div>
          <div className={styles.pillarCard}>
            <h3>{tProductSolution('pillar2Title')}</h3>
            <p>{tProductSolution('pillar2Text')}</p>
          </div>
          <div className={styles.pillarCard}>
            <h3>{tProductSolution('pillar3Title')}</h3>
            <p>{tProductSolution('pillar3Text')}</p>
          </div>
        </div>
      </section>

      {/* --- NOUVELLE SECTION: ARCHITECTURE DU PRODUIT KIWI-OPS (Remplace "Notre Équipe") --- */}
      <section className={`${styles.section} ${styles.darkBackground} ${styles.coreComponentsSection}`} id="core-components-section">
        <h2 className={styles.sectionTitle}>{tProductCoreComponents('title')}</h2>
        <p className={styles.subtitle}>{tProductCoreComponents('intro')}</p>
        <div className={styles.componentsGrid}>
          <div className={styles.componentCard}>
            <h3>{tProductCoreComponents('edgeTitle')}</h3>
            <p>{tProductCoreComponents('edgeText')}</p>
          </div>
          <div className={styles.componentCard}>
            <h3>{tProductCoreComponents('cloudTitle')}</h3>
            <p>{tProductCoreComponents('cloudText')}</p>
          </div>
          <div className={styles.componentCard}>
            <h3>{tProductCoreComponents('ledgerTitle')}</h3>
            <p>{tProductCoreComponents('ledgerText')}</p>
          </div>
        </div>
      </section>

      {/* --- SECTION 4: FEATURES --- */}
      <section className={`${styles.section} ${styles.featuresSection}`} id="features-section">
        <h2 className={styles.sectionTitle}>{tProduct('features.title')}</h2>
        <div className={styles.featuresGrid}>
          <div className={styles.featureCard}>
            <h4>🚀 {tProduct('features.speedTitle')}</h4>
            <p>{tProduct('features.speedText')}</p>
          </div>
          <div className={styles.featureCard}>
            <h4>🔒 {tProduct('features.securityTitle')}</h4>
            <p>{tProduct('features.securityText')}</p>
          </div>
          <div className={styles.featureCard}>
            <h4>⚡ {tProduct('features.integrationTitle')}</h4>
            <p>{tProduct('features.integrationText')}</p>
          </div>
        </div>
      </section>

      {/* --- SECTION 5: SMART SEARCH --- */}
       <section className={`${styles.section} ${styles.darkBackground} ${styles.searchSection}`} id="search-section">
        <h2 className={styles.sectionTitle}>{tProduct('search.title')}</h2>
        <p className={styles.subtitle}>{tProduct('search.subtitle')}</p>
        <p className={styles.sectionText}>{tProduct('search.text')}</p>
      </section>

      {/* --- NOUVELLE SECTION: APPLICATIONS DU PRODUIT KIWI-OPS (Remplace "Notre Histoire") --- */}
      <section className={`${styles.section} ${styles.lightBackground} ${styles.applicationsSection}`} id="applications-section">
        <h2 className={styles.sectionTitle}>{tProductApplications('title')}</h2>
        <p className={styles.subtitle}>{tProductApplications('subtitle')}</p>
        <div className={styles.applicationsGrid}>
          <div className={styles.applicationCard}>
            <h3>{tSolutionsPage('airTitle')}</h3>
            <p>{tSolutionsPage('airText')}</p>
          </div>
          <div className={styles.applicationCard}>
            <h3>{tSolutionsPage('landTitle')}</h3>
            <p>{tSolutionsPage('landText')}</p>
          </div>
          <div className={styles.applicationCard}>
            <h3>{tSolutionsPage('seaTitle')}</h3>
            <p>{tSolutionsPage('seaText')}</p>
          </div>
        </div>
      </section>

       {/* --- SECTION 7: FINAL CTA --- */}
      <section className={`${styles.section} ${styles.ctaSection}`} id="contact">
        <h2 className={styles.sectionTitle}>{tProduct('finalCta.title')}</h2>
        <p className={styles.subtitle}>{tProduct('finalCta.subtitle')}</p>
        <a href="#contact" className={tProduct('finalCta.button') === 'Participez au Programme Bêta' ? styles.ctaButtonBeta : styles.ctaButton}>{tProduct('finalCta.button')}</a>
      </section>

    </div>
  );
}