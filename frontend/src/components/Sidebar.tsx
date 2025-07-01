// Fichier : src/components/Sidebar.tsx
'use client';

import React, { useState, useCallback, ChangeEvent, useRef } from 'react';
import { 
  FaSun, FaMoon, FaFire, FaCompass, FaFileAlt, FaLink, FaCoins, FaCog, FaFileContract, FaKey,
  FaUserCircle, FaSignOutAlt
} from 'react-icons/fa';
import { MdWaves } from 'react-icons/md';
import { useOnClickOutside } from '@/hooks/useOnClickOutside';
import styles from './Sidebar.module.css';

import { LanguageCode } from '@/types'; 
import { useLanguage } from '@/contexts/LanguageContext';

// NOUVEAU : Objet de mappage pour l'affichage des langues dans le sélecteur
// J'ai mis des diminutifs courants et les drapeaux associés.
// Vous pouvez ajuster les diminutifs et les drapeaux selon vos préférences.
const languageDisplayInfo: { [key in LanguageCode]: { shortName: string; flag: string } } = {
  en: { shortName: 'EN', flag: '🇬🇧' }, // Anglais (Royaume-Uni)
  fr: { shortName: 'FR', flag: '🇫🇷' }, // Français (Europe)
  mi: { shortName: 'Māori', flag: '🇳🇿' }, // Māori
  ga: { shortName: 'GA', flag: '🇮🇪' }, // Gaélique irlandais
  hi: { shortName: 'HI', flag: '🇮🇳' }, // Hindi (Inde)
  gd: { shortName: 'GD', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿' }, // Gaélique écossais
  'en-AU': { shortName: 'AU', flag: '🇦🇺' }, // Anglais (Australie)
  'en-NZ': { shortName: 'NZ', flag: '🇳🇿' }, // Anglais (Nouvelle-Zélande)
  'en-CA': { shortName: 'CA (EN)', flag: '🇨🇦' }, // Anglais (Canada)
  'fr-CA': { shortName: 'CA (FR)', flag: '🇨🇦' }, // Français (Canada)
  'en-ZA': { shortName: 'ZA (EN)', flag: '🇿🇦' }, // Anglais (Afrique du Sud)
  af: { shortName: 'AF', flag: '🇿🇦' }, // Afrikaans (Afrique du Sud)
};

// Votre objet translations complet, avec toutes les langues
const translations = {
  beta: {
    en: 'Beta', fr: 'Bêta', mi: 'Pēta',
    ga: 'Béite', hi: 'बीटा', gd: 'Beta (Gàidhlig)',
    'en-AU': 'Beta', 'en-NZ': 'Beta', 'en-CA': 'Beta', 'fr-CA': 'Bêta',
    'en-ZA': 'Beta', af: 'Beta',
  },
  scan: {
    en: 'Scan', fr: 'Scanner', mi: 'Matawai',
    ga: 'Scan (Irish)', hi: 'स्कैन', gd: 'Scan (Gàidhlig)',
    'en-AU': 'Scan', 'en-NZ': 'Scan', 'en-CA': 'Scan', 'fr-CA': 'Scanner',
    'en-ZA': 'Scan', af: 'Skandeer',
  },
  dashboard: {
    en: 'Dashboard', fr: 'Tableau de Bord', mi: 'Papātohu',
    ga: 'Dashboard (Irish)', hi: 'डैशबोर्ड', gd: 'Dashboard (Gàidhlig)',
    'en-AU': 'Dashboard', 'en-NZ': 'Dashboard', 'en-CA': 'Dashboard', 'fr-CA': 'Tableau de Bord',
    'en-ZA': 'Dashboard', af: 'Dashboard',
  },
  files: {
    en: 'Files', fr: 'Fichiers', mi: 'Kōnae',
    ga: 'Files (Irish)', hi: 'फ़ाइलें', gd: 'Files (Gàidhlig)',
    'en-AU': 'Files', 'en-NZ': 'Files', 'en-CA': 'Files', 'fr-CA': 'Fichiers',
    'en-ZA': 'Files', af: 'Lêers',
  },
  connections: {
    en: 'Connections', fr: 'Connexions', mi: 'Hononga',
    ga: 'Connections (Irish)', hi: 'कनेक्शन', gd: 'Connections (Gàidhlig)',
    'en-AU': 'Connections', 'en-NZ': 'Connections', 'en-CA': 'Connections', 'fr-CA': 'Connexions',
    'en-ZA': 'Connections', af: 'Verbindings',
  },
  pay: {
    en: 'Pay', fr: 'Paiements', mi: 'Utu',
    ga: 'Pay (Irish)', hi: 'भुगतान करें', gd: 'Pay (Gàidhlig)',
    'en-AU': 'Pay', 'en-NZ': 'Pay', 'en-CA': 'Pay', 'fr-CA': 'Paiements',
    'en-ZA': 'Pay', af: 'Betaal',
  },
  settings: {
    en: 'Settings', fr: 'Paramètres', mi: 'Tautuhitinga',
    ga: 'Settings (Irish)', hi: 'सेटिंग्स', gd: 'Settings (Gàidhlig)',
    'en-AU': 'Settings', 'en-NZ': 'Settings', 'en-CA': 'Settings', 'fr-CA': 'Paramètres',
    'en-ZA': 'Settings', af: 'Instellings',
  },
  terms: {
    en: 'Terms', fr: 'Conditions', mi: 'Ture',
    ga: 'Terms (Irish)', hi: 'शartáin', gd: 'Terms (Gàidhlig)',
    'en-AU': 'Terms', 'en-NZ': 'Terms', 'en-CA': 'Terms', 'fr-CA': 'Conditions',
    'en-ZA': 'Terms', af: 'Terme',
  },
  privacy: {
    en: 'Privacy Policy', fr: 'Confidentialité', mi: 'Tūmataitinga',
    ga: 'Privacy Policy (Irish)', hi: 'गोपनीयता नीति', gd: 'Privacy Policy (Gàidhlig)',
    'en-AU': 'Privacy Policy', 'en-NZ': 'Privacy Policy', 'en-CA': 'Privacy Policy', 'fr-CA': 'Confidentialité',
    'en-ZA': 'Privacy Policy', af: 'Privaatheidsbeleid',
  },
};

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
  // language et setLanguage sont récupérés du contexte, pas des props
}

export default function Sidebar({
  isOpen, toggleSidebar, isDarkMode, toggleTheme
}: SidebarProps) {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const { language, setLanguage } = useLanguage(); 

  const toggleMenu = useCallback(() => setMenuOpen(prev => !prev), []);
  useOnClickOutside(menuRef, () => setMenuOpen(false));

  const handleLanguageChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setLanguage(event.target.value as LanguageCode);
  };
  
  const getTranslation = (key: keyof typeof translations) => translations[key][language] || translations[key].en;

  const navLinks = [
    { id: 'scan', href: '#', label: getTranslation('scan'), icon: FaFire },
    { id: 'dashboard', href: '#', label: getTranslation('dashboard'), icon: FaCompass },
    { id: 'files', href: '#', label: getTranslation('files'), icon: FaFileAlt },
    { id: 'connections', href: '#', label: getTranslation('connections'), icon: FaLink },
    { id: 'pay', href: '#', label: getTranslation('pay'), icon: FaCoins },
  ];
  const footerLinks = [
    { id: 'settings', href: '#', label: getTranslation('settings'), icon: FaCog },
    { id: 'terms', href: '#', label: getTranslation('terms'), icon: FaFileContract },
    { id: 'privacy', href: '#', label: getTranslation('privacy'), icon: FaKey },
  ];

  return (
    <aside className={`${styles.sidebar} ${!isOpen ? styles.closed : ''}`}>
      <div onClick={toggleSidebar} className={styles.toggleButton}>
        <MdWaves className={styles.toggleIcon} />
      </div>

      <div className={styles.header}>
        <div ref={menuRef} className={styles.logoContainer}>
          <button onClick={toggleMenu} className={styles.logoButton}>
            <div className={styles.logo}>S</div>
          </button>
          {isMenuOpen && (
            <div className={styles.userMenu}>
              <ul>
                <li><button className={styles.userMenuItem}><FaUserCircle /><span>Profil</span></button></li>
                <li><button className={styles.userMenuItem}><FaCog /><span>Réglages</span></button></li>
                <li><button className={styles.userMenuItem}><FaSignOutAlt /><span>Déconnexion</span></button></li>
              </ul>
            </div>
          )}
        </div>
        <span className={styles.headerTitle}>{getTranslation('beta')}</span>
        <button onClick={toggleTheme} className={styles.themeToggle}>
          {isDarkMode ? <FaSun /> : <FaMoon />}
        </button>
        <select value={language} onChange={handleLanguageChange} className={styles.languageSelector}>
          {/* NOUVEAU : Générer les options dynamiquement avec les diminutifs et drapeaux */}
          {Object.entries(languageDisplayInfo).map(([code, info]) => (
            <option key={code} value={code}>
              {info.flag} {info.shortName}
            </option>
          ))}
        </select>
      </div>

      <nav className={styles.nav}>
        <ul>
          {navLinks.map(({ id, href, label, icon: Icon }) => (
            <li key={id}><a href={href} className={styles.navLink}><Icon className={styles.navIcon} /> <span className={styles.navLabel}>{label}</span></a></li>
          ))}
        </ul>
      </nav>

      <div className={styles.footer}>
        <ul>
          {footerLinks.map(({ id, href, label, icon: Icon }) => (
            <li key={id}><a href={href} className={styles.navLink}><Icon className={styles.navIcon} /> <span className={styles.navLabel}>{label}</span></a></li>
          ))}
        </ul>
      </div>
    </aside>
  );
}