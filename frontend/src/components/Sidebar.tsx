'use client';

import React, { useState, useCallback } from 'react';
import { FaSun, FaMoon, FaFire, FaCompass, FaFileAlt, FaLink, FaCoins, FaCog, FaFileContract, FaKey } from 'react-icons/fa';
import { MdWaves } from 'react-icons/md';
import { LanguageCode } from './MainLayoutClient'; // Importer le type LanguageCode
import styles from './Sidebar.module.css';

// Traductions multilingues
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

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
  language: LanguageCode; // Recevoir la langue du parent
  setLanguage: (lang: LanguageCode) => void; // Recevoir la fonction `setLanguage` du parent
}

export default function Sidebar({
  isOpen,
  toggleSidebar,
  isDarkMode,
  toggleTheme,
  language,
  setLanguage,
}: SidebarProps) {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const toggleMenu = useCallback(() => setMenuOpen(prev => !prev), []);

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

        {isMenuOpen && <div>User Dropdown</div>}

        {/* Sélecteur de langue */}
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value as LanguageCode)}
          className={styles.languageSelector}
        >
          <option value="en">🇬🇧 English</option>
          <option value="fr">🇫🇷 Français</option>
          <option value="mi">🇳🇿 Māori</option>
        </select>
      </div>

      <nav className={styles.nav}>
        <ul>
          {navLinks.map(({ href, label, icon: Icon }) => (
            <li key={label}>
              <a href={href} className={styles.navLink}>
                <Icon className={styles.navIcon} />
                <span className={styles.navLabel}>{label}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className={styles.footer}>
        <ul>
          {footerLinks.map(({ href, label, icon: Icon }) => (
            <li key={label}>
              <a href={href} className={styles.navLink}>
                <Icon className={styles.navIcon} />
                <span className={styles.navLabel}>{label}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
