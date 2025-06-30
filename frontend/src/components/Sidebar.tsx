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

type LanguageCode = 'en' | 'fr' | 'mi'; 

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
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
}

export default function Sidebar({
  isOpen, toggleSidebar, isDarkMode, toggleTheme, language, setLanguage
}: SidebarProps) {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleMenu = useCallback(() => setMenuOpen(prev => !prev), []);
  useOnClickOutside(menuRef, () => setMenuOpen(false));

  const handleLanguageChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setLanguage(event.target.value as LanguageCode);
  };
  
  const navLinks = [
    { id: 'scan', href: '#', label: translations.scan[language], icon: FaFire },
    { id: 'dashboard', href: '#', label: translations.dashboard[language], icon: FaCompass },
    { id: 'files', href: '#', label: translations.files[language], icon: FaFileAlt },
    { id: 'connections', href: '#', label: translations.connections[language], icon: FaLink },
    { id: 'pay', href: '#', label: translations.pay[language], icon: FaCoins },
  ];
  const footerLinks = [
    { id: 'settings', href: '#', label: translations.settings[language], icon: FaCog },
    { id: 'terms', href: '#', label: translations.terms[language], icon: FaFileContract },
    { id: 'privacy', href: '#', label: translations.privacy[language], icon: FaKey },
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
        <span className={styles.headerTitle}>{translations.beta[language]}</span>
        <button onClick={toggleTheme} className={styles.themeToggle}>
          {isDarkMode ? <FaSun /> : <FaMoon />}
        </button>
        <select value={language} onChange={handleLanguageChange} className={styles.languageSelector}>
          <option value="en">🇬🇧 English</option>
          <option value="fr">🇫🇷 Français</option>
          <option value="mi">🇳🇿 Māori</option>
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