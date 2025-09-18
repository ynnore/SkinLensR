// src/app/team/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image'; // Pour les avatars des membres de l'équipe
import { FaBars, FaDownload } from 'react-icons/fa';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageCode } from '@/types'; // Assurez-vous que LanguageCode est correctement importé ou défini

// --- DÉBUT DES TRADUCTIONS ET FONCTION getTranslation (Intégrées directement dans ce fichier) ---
// ATTENTION: Cet objet DOIT être identique dans TOUS les fichiers .tsx utilisant les traductions.
const allTranslations = {
  header: {
    missionStatement: {
      en: "Inspired by the Wellington Tunnelers of Arras, our mission is to build in the shadows what will, tomorrow, break through to the surface.",
      fr: "Inspirés des tunneliers de Wellington à Arras, notre mission est de bâtir dans l’ombre ce qui, demain, percera la surface.",
      mi: "He mea whakahihiri mai i ngā kaikeri o raro o Te Whanganui-a-Tara ki Arras, ko tā mātou kaupapa he hanga i roto i te atarangi i ngā mea ka puta ki te mata āpōpopo.",
      ga: "Ar an taobh istigh de tholláin Wellington in Arras, is é ár misean tógáil sa scáth a bbrisfidh an dromchla amárach.",
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
    chatTitle: { en: "Chat with AI", fr: "Chat avec l'IA" },
    chatInputPlaceholder: { en: 'Write your message here...', fr: 'Écrivez votre message ici...' },
    installAppLabel: { en: 'Install App', fr: "Installer l'Application" },
    product: { // "Nos Produits"
      en: 'Our Products', fr: 'Nos Produits', mi: 'Ā Mātou Hua', ga: 'Ár dTáirgí', hi: 'हमारे उत्पाद', gd: 'Ar Bathar', cy: 'Ein Cynhyrchion', af: 'Ons Produkte',
    },
    features: { // "La plateforme"
      en: 'The Platform', fr: 'La plateforme', mi: 'Te Paparanga', ga: 'An tArdán', hi: 'प्लेटफ़ॉर्म', gd: 'Am Plaicform', cy: 'Y Llwyfan', af: 'Die Platform',
    },
    story: { // "Notre Histoire"
      en: 'Our Story', fr: 'Notre Histoire', mi: 'Tō Mātou Kōrero', ga: 'Ár Scéal', hi: 'हमारी कहानी', gd: 'Ar Sgeulachd', cy: 'Ein Stori', af: 'Ons Verhaal', },
    search: { // "Nos solutions"
      en: 'Our Solutions', fr: 'Nos solutions', mi: 'Ā Mātou Rongoā', ga: 'Ár Réitigh', hi: 'हमारे समाधान', gd: 'Ar Fuasglaidhean', cy: 'Ein Datrysiadau', af: 'Ons Oplossings', },
    team: { // "Notre Équipe"
      en: 'Our Team', fr: 'Notre Équipe', mi: 'Tō Mātou Kapa', ga: 'Ár bhFoireann', hi: 'हमारी टीम', gd: 'Ar Sgioba', cy: 'Ein Tîm', af: 'Ons Span', },
  },
  productPage: { // Contient les détails de la section team
    hero: { title: {en: '', fr: ''}, subtitle: {en: '', fr: ''}, ctaButton: {en: '', fr: ''} },
    challenge: { title: {en: '', fr: ''}, point1: {en: '', fr: ''}, point2: {en: '', fr: ''}, point3: {en: '', fr: ''} },
    solution: {
      title: { en: '', fr: '' }, pillar1Title: { en: '', fr: '' }, pillar1Text: { en: '', fr: '' },
      pillar2Title: { en: '', fr: '' }, pillar2Text: { en: '', fr: '' },
      pillar3Title: { en: '', fr: '' }, pillar3Text: { en: '', fr: '' },
    },
    features: { title: {en: '', fr: ''}, speedTitle: {en: '', fr: ''}, speedText: {en: '', fr: ''}, securityTitle: {en: '', fr: '', gd: ''}, securityText: {en: '', fr: ''}, integrationTitle: {en: '', fr: ''}, integrationText: {en: '', fr: ''} },
    search: { title: {en: '', fr: ''}, subtitle: {en: '', fr: ''}, text: {en: '', fr: ''} },
    story: { title: {en: '', fr: ''}, subtitle: {en: '', fr: ''}, text: {en: '', fr: ''} },
    finalCta: { title: {en: '', fr: ''}, subtitle: {en: '', fr: ''}, button: {en: '', fr: ''} },
    team: {
        title: {
          en: 'Our Team: The Architects of Mastery',
          fr: 'Notre Équipe : Les Architectes de la Maîtrise',
          mi: 'Tō Mātou Kapa: Ngā Kaihoahoa o te Mana Whakahaere',
          ga: 'Ár bhFoireann: Ailtirí na Máistreachta',
          hi: 'हमारी टीम: महारत के वास्तुकार',
          gd: 'Ar Sgioba: Ailtirich na Maighstireachd',
          cy: 'Ein Tîm: Penseiri Meistrolaeth',
          af: 'Ons Span: Die Argitekte van Meesterskap',
        },
        subtitle: {
          en: 'Innovation driven by expertise and passion for groundbreaking operations.',
          fr: 'L\'innovation portée par l\'expertise et la passion pour des opérations révolutionnaires.',
          mi: 'Ko te auahatanga e akiakihia ana e te tohungatanga me te ngākau nui ki ngā mahi whakahou.',
          ga: 'Nuálaíocht á tiomáint ag saineolas agus paisean do ghníomhaíochtaí ceannródaíocha.',
          gd: 'Ùr-ghnàthachadh air a stiùireadh le eòlas agus dìoghras airson gnìomhachasan ùra.',
          cy: 'Arloesedd a yrrir gan arbenigedd a chariad at weithrediadau arloesol.',
          af: 'Innovasie gedryf deur kundigheid en passie vir baanbrekende operasies.',
        },
        member1Name: { en: 'Professor Alistair Finch', fr: 'Professeur Alistair Finch' }, // REMPLACER avec le vrai nom
        member1Title: { en: 'CEO & Co-founder', fr: 'CEO & Co-fondateur' },
        member1Bio: {
            en: 'Visionary leader with 15 years of experience in underground engineering and project management. Spearheading Kiwi-Ops strategy and business development.', // REMPLACER X
            fr: 'Leader visionnaire avec 15 ans d\'expérience en ingénierie souterraine et gestion de projet. Il dirige la stratégie et le développement commercial de Kiwi-Ops.' // REMPLACER X
        },
        member2Name: { en: 'Dr. Kwame Nkrumah', fr: 'Dr. Kwame Nkrumah' }, // REMPLACER avec le vrai nom
        member2Title: { en: 'CTO & Co-founder', fr: 'CTO & Co-fondateur' },
        member2Bio: {
            en: 'Tech wizard with a PhD in AI and 12 years in software architecture. Drives the innovation behind Kiwi-Ops\' Edge AI, Cloud, and Web3 solutions.', // REMPLACER Y
            fr: 'Génie technique avec un doctorat en IA et 12 ans en architecture logicielle. Il est le moteur de l\'innovation derrière les solutions Edge AI, Cloud et Web3 de Kiwi-Ops.' // REMPLACER Y
        },
    }
  },
  solutionsPage: { // Minimal pour éviter les erreurs si la structure s'attend à la présence de ces clés
    title: {en: '', fr: ''}, subtitle: {en: '', fr: ''},
    airTitle: {en: '', fr: ''}, airText: {en: '', fr: ''},
    landTitle: {en: '', fr: ''}, landText: {en: '', fr: ''},
    seaTitle: {en: '', fr: ''}, seaText: {en: '', fr: ''},
  },
  platformPage: { // Minimal pour éviter les erreurs si la structure s'attend à la présence de ces clés
    title: {en: '', fr: ''}, subtitle: {en: '', fr: ''},
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

import styles from './team.module.css'; // <--- CORRIGÉ : utilise 'team.module.css' pour les styles de cette page


export default function TeamPage() {
  const { theme } = useTheme();
  const { language } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false); // État pour le menu mobile de la navbar

  // Fonction utilitaire pour obtenir les traductions des labels de navigation
  const getLoginNavTranslation = (key: string) => getTranslation('loginPage', key, language);
  // Fonction utilitaire pour obtenir les traductions spécifiques de la page Team (issues de productPage.team)
  const tTeam = (key: string) => getTranslation('productPage', `team.${key}`, language);


  return (
    <div className={`${styles.pageContainer} ${theme === 'dark' ? styles.darkMode : styles.lightMode}`}>
      {/* Navbar (intégrée directement) */}
      <nav className={styles.navbar}>
        <div className={styles.navLogo}><Link href="/">Kiwi-Ops</Link></div>
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
        <button className={styles.installButton} aria-label={getLoginNavTranslation('installAppLabel')}><FaDownload /></button>
      </nav>

      {/* Contenu de la page Équipe */}
      <section className={`${styles.section} ${styles.teamContentSection}`} id="team-main-content">
        <h1 className={styles.sectionTitle}>{tTeam('title')}</h1>
        <p className={styles.subtitle}>{tTeam('subtitle')}</p>

        {/* AFFICHAGE DES MEMBRES DE L'ÉQUIPE (contenu de TeamSection intégré directement) */}
        <div className={styles.teamGrid}>
          {/* Membre de l'équipe 1 */}
          <div className={styles.teamMemberCard}>
            <Image
              src="/avatars/team-member-1.png" // Chemin vers votre première image
              alt={tTeam('member1Name')}
              width={150} // Ajustez la taille selon votre design
              height={150} // Ajustez la taille selon votre design
              className={styles.teamAvatar} // Assurez-vous d'avoir ce style pour le cercle, etc.
            />
            <h3>{tTeam('member1Name')}</h3>
            <p className={styles.teamMemberTitle}>{tTeam('member1Title')}</p>
            <p>{tTeam('member1Bio')}</p>
          </div>

          {/* Membre de l'équipe 2 */}
          <div className={styles.teamMemberCard}>
            <Image
              src="/avatars/team-member-2.png" // Chemin vers votre deuxième image
              alt={tTeam('member2Name')}
              width={150} // Ajustez la taille selon votre design
              height={150} // Ajustez la taille selon votre design
              className={styles.teamAvatar} // Assurez-vous d'avoir ce style pour le cercle, etc.
            />
            <h3>{tTeam('member2Name')}</h3>
            <p className={styles.teamMemberTitle}>{tTeam('member2Title')}</p>
            <p>{tTeam('member2Bio')}</p>
          </div>

          {/* Ajoutez d'autres membres ici en dupliquant le bloc 'teamMemberCard' si nécessaire */}
        </div>
      </section>

      {/* Vous pouvez ajouter un footer ici si vous en avez un */}
    </div>
  );
}