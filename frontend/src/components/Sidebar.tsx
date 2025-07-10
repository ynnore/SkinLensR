// Fichier : src/components/Sidebar.tsx
'use client';

import React, { useState, useCallback, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import {
  FaSun, FaMoon, FaFire, FaCompass, FaFileAlt, FaLink, FaCoins, FaCog,
  FaFileContract, FaKey, FaUserCircle, FaSignOutAlt, FaFolderOpen, FaFolder, FaTimes
} from 'react-icons/fa';

import { useOnClickOutside } from '@/hooks/useOnClickOutside';
import styles from './Sidebar.module.css';

import { LanguageCode } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import LanguageSelector from './LanguageSelector'; // Import du composant LanguageSelector

const translations = {
  header: {
    beta: { en: 'Beta', fr: 'Bêta', mi: 'Pēta', ga: 'Béite', hi: 'बीटा', gd: 'Beta (Gàidhlig)', 'en-AU': 'Beta', 'en-NZ': 'Beta', 'en-CA': 'Beta', 'fr-CA': 'Bêta', 'en-ZA': 'Beta', af: 'Beta' }
  },
  sidebar: {
    scan: { en: 'Scan', fr: 'Scanner', mi: 'Matawai', ga: 'Scan', hi: 'स्कैन', gd: 'Scan (Gàidhlig)', 'en-AU': 'Scan', 'en-NZ': 'Scan', 'en-CA': 'Scan', 'fr-CA': 'Scanner', 'en-ZA': 'Scan', af: 'Skandeer' },
    dashboard: { en: 'Dashboard', fr: 'Tableau de Bord', mi: 'Papātohu', ga: 'Painéal na nIonstraimí', hi: 'डैशboard', gd: 'Dashboard (Gàidhlig)', 'en-AU': 'Dashboard', 'en-NZ': 'Dashboard', 'en-CA': 'Dashboard', 'fr-CA': 'Tableau de Bord', 'en-ZA': 'Dashboard', af: 'Dashboard' },
    files: { en: 'Files', fr: 'Fichiers', mi: 'Kōnae', ga: 'Comhaid', hi: 'फ़ाइलें', gd: 'Files (Gàidhlig)', 'en-AU': 'Files', 'en-NZ': 'Files', 'en-CA': 'Files', 'fr-CA': 'Fichiers', 'en-ZA': 'Files', af: 'Lêers' },
    connections: { en: 'Connections', fr: 'Connexions', mi: 'Hononga', ga: 'Naisc', hi: 'कनेक्शन', gd: 'Connections (Gàidhlig)', 'en-AU': 'Connections', 'en-NZ': 'Connections', 'en-CA': 'Connections', 'fr-CA': 'Connexions', 'en-ZA': 'Connections', af: 'Verbindings' },
    pay: { en: 'Pay', fr: 'Paiements', mi: 'Utu', ga: 'Íoc', hi: 'भु भुगतान करें', gd: 'Pay (Gàidhlig)', 'en-AU': 'Pay', 'en-NZ': 'Pay', 'en-CA': 'Pay', 'fr-CA': 'Paiements', 'en-ZA': 'Pay', af: 'Betaal' },
    settings: { en: 'Settings', fr: 'Paramètres', mi: 'Tautuhitinga', ga: 'Socruithe', hi: 'सेटिंग्स', gd: 'Settings (Gàidhlig)', 'en-AU': 'Settings', 'en-NZ': 'Settings', 'en-CA': 'Settings', 'fr-CA': 'Paramètres', 'en-ZA': 'Settings', af: 'Instellings' },
    terms: { en: 'Terms', fr: 'Conditions', mi: 'Ture', ga: 'Téarmaí', hi: 'शर्तें', gd: 'Terms (Gàidhlig)', 'en-AU': 'Terms', 'en-NZ': 'Terms', 'en-CA': 'Terms', 'fr-CA': 'Conditions', 'en-ZA': 'Terms', af: 'Terme' },
    privacy: { en: 'Privacy Policy', fr: 'Politique de confidentialité', mi: 'Tūmataitinga', ga: 'Polasaí Príobhaideachta', hi: 'गोपनीयता नीति', gd: 'Privacy Policy (Gàidhlig)', 'en-AU': 'Privacy Policy', 'en-NZ': 'Privacy Policy', 'en-CA': 'Privacy Policy', 'fr-CA': 'Politique de confidentialité', 'en-ZA': 'Privacy Policy', af: 'Privaatheidsbeleid' }
  },
  userMenu: {
    profile: { en: 'Profile', fr: 'Profil', mi: 'Kōtaha', ga: 'Próifíl', hi: 'प्रोफ़ाइल', gd: 'Pròifil', 'en-AU': 'Profile', 'en-NZ': 'Profile', 'en-CA': 'Profile', 'fr-CA': 'Profil', 'en-ZA': 'Profile', af: 'Profiel' },
    accountSettings: { en: 'Account Settings', fr: 'Réglages du compte', mi: 'Tautuhinga Pūkete', ga: 'Socruithe Cuntais', hi: 'खाता setings', gd: 'Roghainnean Cunntais', 'en-AU': 'Account Settings', 'en-NZ': 'Account Settings', 'en-CA': 'Account Settings', 'fr-CA': 'Réglages du compte', 'en-ZA': 'Account Settings', af: 'Rekeninginstellingen' },
    logout: { en: 'Logout', fr: 'Déconnexion', mi: 'Takiputa', ga: 'Logáil Amach', hi: 'लॉग आउट', gd: 'Log a-mach', 'en-AU': 'Logout', 'en-NZ': 'Logout', 'en-CA': 'Logout', 'fr-CA': 'Déconnexion', 'en-ZA': 'Logout', af: 'Teken uit' }
  }
};


interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

export default function Sidebar({ isOpen, toggleSidebar }: SidebarProps) {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { language, setLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();

  const toggleMenu = useCallback(() => setMenuOpen(prev => !prev), []);
  useOnClickOutside(menuRef, () => setMenuOpen(false));

  const getTranslation = <S extends keyof typeof translations, K extends keyof typeof translations[S]>(
    section: S,
    key: K
  ): string => {
    const sectionTranslations = translations[section];
    if (!sectionTranslations) return `[Missing Section: ${String(section)}]`;
    const specificTranslations = sectionTranslations[key];
    if (typeof specificTranslations !== 'object' || specificTranslations === null || !('en' in specificTranslations)) return `[Invalid Translation: ${String(section)}.${String(key)}]`;
    return (specificTranslations as { [lang: string]: string })[language] || (specificTranslations as { [lang: string]: string }).en;
  };

  const navLinks = [
    { id: 'scan', href: '/scan', label: getTranslation('sidebar', 'scan'), icon: FaFire },
    { id: 'dashboard', href: '/dashboard', label: getTranslation('sidebar', 'dashboard'), icon: FaCompass },
    { id: 'files', href: '/files', label: getTranslation('sidebar', 'files'), icon: FaFileAlt },
    { id: 'connections', href: '/connections', label: getTranslation('sidebar', 'connections'), icon: FaLink },
    { id: 'pay', href: '/pay', label: getTranslation('sidebar', 'pay'), icon: FaCoins },
  ];

  const footerLinks = [
    { id: 'settings', href: '/settings', label: getTranslation('sidebar', 'settings'), icon: FaCog },
    { id: 'terms', href: '/terms', label: getTranslation('sidebar', 'terms'), icon: FaFileContract },
    { id: 'privacy', href: '/privacy-policy', label: getTranslation('sidebar', 'privacy'), icon: FaKey },
  ];

  return (
    <aside className={`${styles.sidebar} ${!isOpen ? styles.closed : ''}`}>
      <button onClick={toggleSidebar} className={styles.mobileCloseButton} aria-label="Fermer la barre latérale">
        <FaTimes />
      </button>

      <div className={styles.header}>
        <div className={styles.logoAndToggleButtonWrapper}>
          <div ref={menuRef} className={styles.logoContainer}>
            <button onClick={toggleMenu} className={styles.logoButton} aria-label="Ouvrir le menu utilisateur">
              <div className={styles.logo}>o</div>
            </button>
            {isMenuOpen && (
              <div className={styles.userMenu}>
                <ul>
                  <li>
                    <Link href="/profile" className={styles.userMenuItem} onClick={() => setMenuOpen(false)}>
                      <FaUserCircle /><span>{getTranslation('userMenu', 'profile')}</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/settings" className={styles.userMenuItem} onClick={() => setMenuOpen(false)}>
                      <FaCog /><span>{getTranslation('userMenu', 'accountSettings')}</span>
                    </Link>
                  </li>
                  <li>
                    <button className={styles.userMenuItem}>
                      <FaSignOutAlt /><span>{getTranslation('userMenu', 'logout')}</span>
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>

        <div className={styles.headerControls}>
          <button onClick={toggleTheme} className={styles.themeToggle} aria-label="Changer de thème">
            {theme === 'dark' ? <FaSun suppressHydrationWarning /> : <FaMoon suppressHydrationWarning />}
          </button>

          <LanguageSelector
            currentLanguage={language}
            onSelectLanguage={setLanguage}
            isSidebarOpen={isOpen}
          />

          <button onClick={toggleSidebar} className={styles.headerToggleButton} aria-label="Basculer la barre latérale">
            {isOpen ? <FaFolder /> : <FaFolderOpen />}
          </button>
        </div>
      </div>

      <nav className={styles.nav}>
        <ul>
          {navLinks.map(({ id, href, label, icon: Icon }) => (
            <li key={id}>
              <Link href={href} className={`${styles.navLink} ${pathname === href ? styles.active : ''}`}>
                <Icon className={styles.navIcon} />
                <span className={styles.navLabel}>{label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className={styles.footer}>
        <ul>
          {footerLinks.map(({ id, href, label, icon: Icon }) => (
            <li key={id}>
              <Link href={href} className={`${styles.navLink} ${pathname === href ? styles.active : ''}`}>
                <Icon className={styles.navIcon} />
                <span className={styles.navLabel}>{label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}