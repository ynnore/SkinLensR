'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image'; // Utilisé si vous avez des logos avec Image de Next.js
import { FaBars, FaDownload } from 'react-icons/fa';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageCode } from '@/types'; // Assurez-vous que LanguageCode est correctement importé ou défini
import styles from './Navbar.module.css'; // Styles spécifiques à la Navbar

// --- DÉBUT DES TRADUCTIONS ET FONCTION getTranslation (Intégrées directement dans la Navbar) ---
// ATTENTION: Cette section sera dupliquée. Toutes les pages qui incluent cette Navbar,
// ainsi que la Navbar elle-même, devront avoir la même version de 'allTranslations'.
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
    // --- TRADUCTIONS MISES À JOUR POUR LA BARRE DE NAVIGATION ---
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
    features: { // "La plateforme" (anciennement features)
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
    search: { // "Nos solutions" (anciennement search)
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
    // --- FIN NOUVELLES TRADUCTIONS POUR LA BARRE DE NAVIGATION ---
  },
  productPage: { // Minimal pour éviter les erreurs si la structure s'attend à la présence de ces clés
    hero: { title: {en: '', fr: ''}, subtitle: {en: '', fr: ''}, ctaButton: {en: '', fr: ''} },
    challenge: { title: {en: '', fr: ''}, point1: {en: '', fr: ''}, point2: {en: '', fr: ''}, point3: {en: '', fr: ''} },
    solution: {
      title: { en: '', fr: '' }, pillar1Title: { en: '', fr: '' }, pillar1Text: { en: '', fr: '' },
      pillar2Title: { en: '', fr: '' }, pillar2Text: { en: '', fr: '' },
      pillar3Title: { en: '', fr: '' }, pillar3Text: { en: '', fr: '' },
    },
    features: { title: {en: '', fr: ''}, speedTitle: {en: '', fr: ''}, speedText: {en: '', fr: ''}, securityTitle: {en: '', fr: ''}, securityText: {en: '', fr: ''}, integrationTitle: {en: '', fr: ''}, integrationText: {en: '', fr: ''} },
    search: { title: {en: '', fr: ''}, subtitle: {en: '', fr: ''}, text: {en: '', fr: ''} },
    story: { title: {en: '', fr: ''}, subtitle: {en: '', fr: ''}, text: {en: '', fr: ''} },
    finalCta: { title: {en: '', fr: ''}, subtitle: {en: '', fr: ''}, button: {en: '', fr: ''} },
    team: { title: {en: '', fr: ''}, subtitle: {en: '', fr: ''}, member1Name: {en: '', fr: ''}, member1Title: {en: '', fr: ''}, member1Bio: {en: '', fr: ''}, member2Name: {en: '', fr: ''}, member2Title: {en: '', fr: ''}, member2Bio: {en: '', fr: ''} }
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


interface NavbarProps {
  // Aucune prop n'est passée car les traductions et le thème sont gérés en interne
}

const Navbar: React.FC<NavbarProps> = () => {
  const { theme } = useTheme();
  const { language } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);

  // Fonction utilitaire pour obtenir les traductions des labels de navigation
  const getLoginNavTranslation = (key: string) => getTranslation('loginPage', key, language);

  // Vous pouvez ajuster le comportement du bouton d'installation si nécessaire
  const handleInstallClick = () => {
    // Logique pour l'installation, ou redirection
    console.log('Install App clicked!');
  };

  return (
    <nav className={`${styles.navbar} ${theme === 'dark' ? styles.darkMode : ''}`}>
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
      <button className={styles.installButton} onClick={handleInstallClick} aria-label={getLoginNavTranslation('installAppLabel')}><FaDownload /></button>
    </nav>
  );
};

export default Navbar;