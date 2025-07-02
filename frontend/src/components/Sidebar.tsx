// Fichier : src/components/Sidebar.tsx (Correction de l'import)
'use client';

import React, { useState, useCallback, ChangeEvent, useRef } from 'react';
// === LE BLOC D'IMPORTATION A ÉTÉ NETTOYÉ ICI ===
import {
  FaSun, FaMoon, FaFire, FaCompass, FaFileAlt, FaLink, FaCoins, FaCog, FaFileContract, FaKey,
  FaUserCircle, FaSignOutAlt, FaFolderOpen, FaFolder,
  FaTimes
} from 'react-icons/fa';
import { useOnClickOutside } from '@/hooks/useOnClickOutside';
import styles from './Sidebar.module.css';

import { LanguageCode } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '../context/ThemeContext';

// === L'OBJET DE TRADUCTION A ÉTÉ NETTOYÉ ET CORRIGÉ ICI ===
const languageDisplayInfo: { [key in LanguageCode]: { shortName: string; flag: string } } = { en: { shortName: 'EN', flag: '🇬🇧' }, fr: { shortName: 'FR', flag: '🇫🇷' }, mi: { shortName: 'Māori', flag: '🇳🇿' }, ga: { shortName: 'GA', flag: '🇮🇪' }, hi: { shortName: 'HI', flag: '🇮🇳' }, gd: { shortName: 'GD', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿' }, 'en-AU': { shortName: 'AU', flag: '🇦🇺' }, 'en-NZ': { shortName: 'NZ', flag: '🇳🇿' }, 'en-CA': { shortName: 'CA (EN)', flag: '🇨🇦' }, 'fr-CA': { shortName: 'CA (FR)', flag: '🇨🇦' }, 'en-ZA': { shortName: 'ZA (EN)', flag: '🇿🇦' }, af: { shortName: 'AF', flag: '🇿🇦' },};

const translations = { 
  header: { 
    beta: { en: 'Beta', fr: 'Bêta', mi: 'Pēta', ga: 'Béite', hi: 'बीटा', gd: 'Beta (Gàidhlig)', 'en-AU': 'Beta', 'en-NZ': 'Beta', 'en-CA': 'Beta', 'fr-CA': 'Bêta', 'en-ZA': 'Beta', af: 'Beta' }
  }, 
  sidebar: { 
    scan: { en: 'Scan', fr: 'Scanner', mi: 'Matawai', ga: 'Scan', hi: 'स्कैन', gd: 'Scan (Gàidhlig)', 'en-AU': 'Scan', 'en-NZ': 'Scan', 'en-CA': 'Scan', 'fr-CA': 'Scanner', 'en-ZA': 'Scan', af: 'Skandeer' }, 
    dashboard: { en: 'Dashboard', fr: 'Tableau de Bord', mi: 'Papātohu', ga: 'Painéal na nIonstraimí', hi: 'डैशboard', gd: 'Dashboard (Gàidhlig)', 'en-AU': 'Dashboard', 'en-NZ': 'Dashboard', 'en-CA': 'Dashboard', 'fr-CA': 'Tableau de Bord', 'en-ZA': 'Dashboard', af: 'Dashboard' }, 
    files: { en: 'Files', fr: 'Fichiers', mi: 'Kōnae', ga: 'Comhaid', hi: 'फ़ाइलें', gd: 'Files (Gàidhlig)', 'en-AU': 'Files', 'en-NZ': 'Files', 'en-CA': 'Files', 'fr-CA': 'Fichiers', 'en-ZA': 'Files', af: 'Lêers' }, 
    connections: { en: 'Connections', fr: 'Connexions', mi: 'Hononga', ga: 'Naisc', hi: 'कनेक्शन', gd: 'Connections (Gàidhlig)', 'en-AU': 'Connections', 'en-NZ': 'Connections', 'en-CA': 'Connections', 'fr-CA': 'Connexions', 'en-ZA': 'Connections', af: 'Verbindings' }, 
    pay: { en: 'Pay', fr: 'Paiements', mi: 'Utu', ga: 'Íoc', hi: 'भुगतान करें', gd: 'Pay (Gàidhlig)', 'en-AU': 'Pay', 'en-NZ': 'Pay', 'en-CA': 'Pay', 'fr-CA': 'Paiements', 'en-ZA': 'Pay', af: 'Betaal' }, 
    settings: { en: 'Settings', fr: 'Paramètres', mi: 'Tautuhitinga', ga: 'Socruithe', hi: 'सेटिंग्स', gd: 'Settings (Gàidhlig)', 'en-AU': 'Settings', 'en-NZ': 'Settings', 'en-CA': 'Settings', 'fr-CA': 'Paramètres', 'en-ZA': 'Settings', af: 'Instellings' }, 
    terms: { en: 'Terms', fr: 'Conditions', mi: 'Ture', ga: 'Téarmaí', hi: 'शर्तें', gd: 'Terms (Gàidhlig)', 'en-AU': 'Terms', 'en-NZ': 'Terms', 'en-CA': 'Terms', 'fr-CA': 'Conditions', 'en-ZA': 'Terms', af: 'Terme' }, 
    privacy: { en: 'Privacy Policy', fr: 'Politique de confidentialité', mi: 'Tūmataitinga', ga: 'Polasaí Príobháideachta', hi: 'गोपनीयता नीति', gd: 'Privacy Policy (Gàidhlig)', 'en-AU': 'Privacy Policy', 'en-NZ': 'Privacy Policy', 'en-CA': 'Privacy Policy', 'fr-CA': 'Politique de confidentialité', 'en-ZA': 'Privacy Policy', af: 'Privaatheidsbeleid' }
  }, 
  userMenu: { 
    profile: { en: 'Profile', fr: 'Profil', mi: 'Kōtaha', ga: 'Próifíl', hi: 'प्रोफ़ाइल', gd: 'Pròifil', 'en-AU': 'Profile', 'en-NZ': 'Profile', 'en-CA': 'Profile', 'fr-CA': 'Profil', 'en-ZA': 'Profile', af: 'Profiel' }, 
    accountSettings: { en: 'Account Settings', fr: 'Réglages du compte', mi: 'Tautuhinga Pūkete', ga: 'Socruithe Cuntais', hi: 'खाता setings', gd: 'Roghainnean Cunntais', 'en-AU': 'Account Settings', 'en-NZ': 'Account Settings', 'en-CA': 'Account Settings', 'fr-CA': 'Réglages du compte', 'en-ZA': 'Account Settings', af: 'Rekeninginstellingen' }, 
    logout: { en: 'Logout', fr: 'Déconnexion', mi: 'Takiputa', ga: 'Logáil Amach', hi: 'लॉग आउट', gd: 'Log a-mach', 'en-AU': 'Logout', 'en-NZ': 'Logout', 'en-CA': 'Logout', 'fr-CA': 'Déconnexion', 'en-ZA': 'Logout', af: 'Teken uit' }
  }
};


// ... reste du fichier ...
interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

export default function Sidebar({ isOpen, toggleSidebar }: SidebarProps) {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { language, setLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  const toggleMenu = useCallback(() => setMenuOpen(prev => !prev), []);
  useOnClickOutside(menuRef, () => setMenuOpen(false));
  const handleLanguageChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setLanguage(event.target.value as LanguageCode);
  };
  const getTranslation = <S extends keyof typeof translations, K extends keyof typeof translations[S]>(section: S, key: K): string => {
    const sectionTranslations = translations[section];
    if (!sectionTranslations) return `[Missing Section: ${String(section)}]`;
    const specificTranslations = sectionTranslations[key];
    if (typeof specificTranslations !== 'object' || specificTranslations === null || !('en' in specificTranslations)) return `[Invalid Translation: ${String(section)}.${String(key)}]`;
    return (specificTranslations as { [lang: string]: string })[language] || (specificTranslations as { [lang: string]: string }).en;
  };
  const navLinks = [ { id: 'scan', href: '#', label: getTranslation('sidebar', 'scan'), icon: FaFire }, { id: 'dashboard', href: '#', label: getTranslation('sidebar', 'dashboard'), icon: FaCompass }, { id: 'files', href: '#', label: getTranslation('sidebar', 'files'), icon: FaFileAlt }, { id: 'connections', href: '#', label: getTranslation('sidebar', 'connections'), icon: FaLink }, { id: 'pay', href: '#', label: getTranslation('sidebar', 'pay'), icon: FaCoins },];
  const footerLinks = [ { id: 'settings', href: '#', label: getTranslation('sidebar', 'settings'), icon: FaCog }, { id: 'terms', href: '#', label: getTranslation('sidebar', 'terms'), icon: FaFileContract }, { id: 'privacy', href: '#', label: getTranslation('sidebar', 'privacy'), icon: FaKey },];

  return (
    <aside className={`${styles.sidebar} ${!isOpen ? styles.closed : ''}`}>
      
      <button onClick={toggleSidebar} className={styles.mobileCloseButton} aria-label="Close sidebar">
        <FaTimes />
      </button>

      <div className={styles.header}>
        <div className={styles.logoAndToggleButtonWrapper}>
          <div ref={menuRef} className={styles.logoContainer}>
            <button onClick={toggleMenu} className={styles.logoButton}>
              <div className={styles.logo}>S</div>
            </button>
            {isMenuOpen && (
              <div className={styles.userMenu}>
                <ul>
                  <li><button className={styles.userMenuItem}><FaUserCircle /><span>{getTranslation('userMenu', 'profile')}</span></button></li>
                  <li><button className={styles.userMenuItem}><FaCog /><span>{getTranslation('userMenu', 'accountSettings')}</span></button></li>
                  <li><button className={styles.userMenuItem}><FaSignOutAlt /><span>{getTranslation('userMenu', 'logout')}</span></button></li>
                </ul>
              </div>
            )}
          </div>
        </div>
        <div className={styles.headerControls}>
          <button onClick={toggleTheme} className={styles.themeToggle}>
            {theme === 'dark' ? <FaSun /> : <FaMoon />}
          </button>
          
          {isOpen && (
            <select value={language} onChange={handleLanguageChange} className={styles.languageSelector}>
              {Object.entries(languageDisplayInfo).map(([code, info]) => (
                <option key={code} value={code}>{info.flag} {info.shortName}</option>
              ))}
            </select>
          )}
          
          <button onClick={toggleSidebar} className={styles.headerToggleButton}>
            {isOpen ? <FaFolderOpen /> : <FaFolder />}
          </button>
        </div>
      </div>
      
      <nav className={styles.nav}>
        <ul>{navLinks.map(({ id, href, label, icon: Icon }) => (<li key={id}><a href={href} className={styles.navLink}><Icon className={styles.navIcon} /> <span className={styles.navLabel}>{label}</span></a></li>))}</ul>
      </nav>
      <div className={styles.footer}>
        <ul>{footerLinks.map(({ id, href, label, icon: Icon }) => (<li key={id}><a href={href} className={styles.navLink}><Icon className={styles.navIcon} /> <span className={styles.navLabel}>{label}</span></a></li>))}</ul>
      </div>
    </aside>
  );
}