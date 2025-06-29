// src/components/Sidebar.tsx
'use client';

import Link from 'next/link';
import { useState, useCallback } from 'react';
import styles from './Sidebar.module.css';
import { MdWaves } from 'react-icons/md';
import UserDropdown from './UserDropdown';
import { LanguageCode } from './MainLayoutClient'; // On importe le type depuis le parent
import {
  FaFire, FaCompass, FaFileAlt, FaLink, FaCoins, FaCog,
  FaFileContract, FaKey, FaSun, FaMoon,
} from 'react-icons/fa';

// Le dictionnaire de traductions pour la Sidebar
const translations = {
  beta: { en: 'Beta', fr: 'Bêta', mi: 'Pēta' },
  scan: { en: 'Scan', fr: 'Scanner', mi: 'Matawai' },
  dashboard: { en: 'Dashboard', fr: 'Tableau de Bord', mi: 'Papātohu' },
  files: { en: 'Files', fr: 'Fichiers', mi: 'Kōnae' },
  connections: { en: 'Connections', fr: 'Connexions', mi: 'Hononga' },
  pay: { en: 'Pay', fr: 'Paiements', mi: 'Utu' },
  settings: { en: 'Settings', fr: 'Paramètres', mi: 'Tautuhinga' },
  terms: { en: 'Terms', fr: 'Conditions', mi: 'Ture' },
  privacy: { en: 'Privacy Policy', fr: 'Confidentialité', mi: 'Tūmataitinga' },
};

// L'interface pour les props reçues
interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
  language: LanguageCode; // On attend la langue en prop
}

export default function Sidebar({
  isOpen,
  toggleSidebar,
  isDarkMode,
  toggleTheme,
  language,
}: SidebarProps) {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const toggleMenu = useCallback(() => setMenuOpen((prev) => !prev), []);

  // On utilise la langue reçue pour créer les listes de liens
  const navLinks = [
    { href: '#', label: translations.scan[language], icon: FaFire },
    { href: '#', label: translations.dashboard[language], icon: FaCompass },
    { href: '#', label: translations.files[language], icon: FaFileAlt },
    { href: '#', label: translations.connections[language], icon: FaLink },
    { href: '#', label: translations.pay[language], icon: FaCoins },
  ];
  const footerLinks = [
    { href: '#', label: translations.settings[language], icon: FaCog },
    { href: '#', label: translations.terms[language], icon: FaFileContract },
    { href: '#', label: translations.privacy[language], icon: FaKey },
  ];

  return (
    <aside className={`${styles.sidebar} ${!isOpen ? styles.closed : ''}`}>
      <div onClick={toggleSidebar} className={styles.toggleButton}>
        <MdWaves className={styles.toggleIcon} />
      </div>

      <div className={styles.header}>
        <button onClick={toggleMenu} className={styles.logoButton}>
          <div className={styles.logo}>S</div>
        </button>
        <span className={styles.headerTitle}>{translations.beta[language]}</span>
        <button onClick={toggleTheme} className={styles.themeToggle}>
          {isDarkMode ? <FaSun /> : <FaMoon />}
        </button>
        {isMenuOpen && <UserDropdown />}
      </div>

      <nav className={styles.nav}>
        <ul>
          {navLinks.map(({ href, label, icon: Icon }) => (
            <li key={label}> <Link href={href} className={styles.navLink}> <Icon className={styles.navIcon} /> <span className={styles.navLabel}>{label}</span> </Link> </li>
          ))}
        </ul>
      </nav>
      <div className={styles.footer}>
        <ul>
          {footerLinks.map(({ href, label, icon: Icon }) => (
            <li key={label}> <Link href={href} className={styles.navLink}> <Icon className={styles.navIcon} /> <span className={styles.navLabel}>{label}</span> </Link> </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}