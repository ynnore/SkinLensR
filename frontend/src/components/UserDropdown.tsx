'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext'; // Importez useLanguage
import { LanguageCode } from '@/types'; // Importez LanguageCode
import styles from './UserDropdown.module.css';
import { FaUserCircle, FaSignOutAlt, FaTwitter, FaDiscord, FaTag, FaCog } from 'react-icons/fa';

interface UserDropdownProps {
  onClose: () => void;
  userEmail: string;
}

// Définitions des traductions pour ce composant
const allTranslations = {
  userDropdown: {
    profileLink: {
      en: 'Profile',
      fr: 'Profil',
      mi: 'Kōtaha',
      ga: 'Próifíl',
      hi: 'प्रोफ़ाइल',
      gd: 'Pròifil',
      'en-AU': 'Profile', 'en-NZ': 'Profile', 'en-CA': 'Profile', 'fr-CA': 'Profil', 'en-ZA': 'Profile', af: 'Profiel'
    },
    settingsLink: {
      en: 'HQ Settings',
      fr: 'Paramètres QG',
      mi: 'Tautuhinga QG',
      ga: 'Socruithe Ceanncheathrún',
      hi: 'मुख्यालय सेटिंग्स',
      gd: 'Roghainnean HQ',
      'en-AU': 'HQ Settings', 'en-NZ': 'HQ Settings', 'en-CA': 'HQ Settings', 'fr-CA': 'Paramètres QG', 'en-ZA': 'HK Instellings', af: 'HK Instellings'
    },
    pricingLink: {
      en: 'Accreditation Rates',
      fr: 'Tarifs d\'Accréditation',
      mi: 'Utu Whakaaetanga',
      ga: 'Rátaí Creidiúnaithe',
      hi: 'प्रत्यायन दरें',
      gd: 'Ratanan Barrantachd',
      'en-AU': 'Accreditation Rates', 'en-NZ': 'Accreditation Rates', 'en-CA': 'Accreditation Rates', 'fr-CA': 'Tarifs d\'Accréditation', 'en-ZA': 'Akkreditasie Tariewe', af: 'Akkreditasie Tariewe'
    },
    logoutLink: {
      en: 'Logout',
      fr: 'Déconnexion',
      mi: 'Takiputa',
      ga: 'Logáil Amach',
      hi: 'लॉग आउट',
      gd: 'Log a-mach',
      'en-AU': 'Logout', 'en-NZ': 'Logout', 'en-CA': 'Logout', 'fr-CA': 'Déconnexion', 'en-ZA': 'Logout', af: 'Teken uit'
    },
    logoutConsoleMessage: {
      en: 'User logged out',
      fr: 'Utilisateur déconnecté',
      mi: 'Kua takiputa te kaiwhakamahi',
      ga: 'Úsáideoir logáilte amach',
      hi: 'उपयोगकर्ता लॉग आउट हो गया',
      gd: 'Cleachdaiche air logadh a-mach',
      'en-AU': 'User logged out', 'en-NZ': 'User logged out', 'en-CA': 'User logged out', 'fr-CA': 'Utilisateur déconnecté', 'en-ZA': 'Gebruiker afgemeld', af: 'Gebruiker afgemeld'
    },
  },
};

// Fonction de traduction générique
const getTranslation = <S extends keyof typeof allTranslations, K extends keyof typeof allTranslations[S]>(
  section: S,
  key: K,
  lang: LanguageCode
): string => {
  const sectionTranslations = allTranslations[section];
  if (!sectionTranslations) {
    console.warn(`Translation section not found: ${String(section)}`);
    return `[Missing Section: ${String(section)}]`;
  }
  const specificTranslations = sectionTranslations[key];
  if (typeof specificTranslations !== 'object' || specificTranslations === null || !('en' in specificTranslations)) {
    console.warn(`Translation missing or invalid for: ${String(section)}.${String(key)} in language ${lang}`);
    return `[Invalid Translation: ${String(section)}.${String(key)}]`;
  }
  return (specificTranslations as { [l: string]: string })[lang] || (specificTranslations as { [l: string]: string }).en;
};


export default function UserDropdown({ onClose, userEmail }: UserDropdownProps) {
  const router = useRouter();
  const { theme } = useTheme();
  const { language } = useLanguage(); // Obtenez la langue courante

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    console.log(getTranslation('userDropdown', 'logoutConsoleMessage', language));
    onClose();
    router.push('/logout');
  };

  // Définissez les couleurs en fonction du thème (pour injecter dans les variables CSS)
  const textColor = theme === 'dark' ? '#E0E0E0' : '#111827';
  const mutedTextColor = theme === 'dark' ? '#A0A0A0' : '#6b7280';
  const borderColor = theme === 'dark' ? '#555555' : '#e5e7eb';
  const highlightColor = theme === 'dark' ? '#8BC4FF' : '#4A90E2';
  const sectionBgColor = theme === 'dark' ? '#2A2A3A' : '#F8F8F8';
  const shadowColorCard = theme === 'dark' ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.1)';
  const hoverBgColor = theme === 'dark' ? 'rgba(0,0,0,0.1)' : 'rgba(0,0,0,0.05)';
  const buttonDangerBg = theme === 'dark' ? '#B03A2E' : '#dc3545';
  const buttonDangerHoverBg = theme === 'dark' ? '#993026' : '#c82333';


  return (
    <div
      className={styles.dropdown}
      style={{
        '--kiwi-text-primary': textColor,
        '--kiwi-text-secondary': mutedTextColor,
        '--kiwi-border-color': borderColor,
        '--kiwi-background-section': sectionBgColor,
        '--kiwi-highlight-color': highlightColor,
        '--kiwi-shadow-color-card': shadowColorCard,
        '--kiwi-hover-bg': hoverBgColor,
        '--kiwi-button-danger-bg': buttonDangerBg,
        '--kiwi-button-danger-hover-bg': buttonDangerHoverBg,
        '--font-special-elite': "'Playfair Display', serif",
        '--font-courier-prime': "'Georgia', serif",
      } as React.CSSProperties}
    >
      {/* Section Profil/Email */}
      <div className={styles.profileSection}>
        <FaUserCircle className={styles.profileIcon} />
        <span className={styles.profileEmail}>{userEmail}</span>
      </div>

      <ul className={styles.menuList}>
        <li>
          <Link href="/profile" className={styles.menuItem} onClick={onClose}>
            <FaUserCircle /><span>{getTranslation('userDropdown', 'profileLink', language)}</span>
          </Link>
        </li>
        <li>
          <Link href="/settings" className={styles.menuItem} onClick={onClose}>
            <FaCog /><span>{getTranslation('userDropdown', 'settingsLink', language)}</span>
          </Link>
        </li>
        <li>
          <Link href="/pricing" className={styles.menuItem} onClick={onClose}>
            <FaTag /><span>{getTranslation('userDropdown', 'pricingLink', language)}</span>
          </Link>
        </li>
        {/* L'élément de déconnexion */}
        <li>
          <a onClick={handleLogout} className={`${styles.menuItem} ${styles.logoutItem}`}>
            <FaSignOutAlt /><span>{getTranslation('userDropdown', 'logoutLink', language)}</span>
          </a>
        </li>
      </ul>

      <div className={styles.divider}></div>

      {/* Réseaux sociaux */}
      <div className={styles.socialSection}>
        <a href="https://twitter.com/KiwiOps" target="_blank" rel="noopener noreferrer" className={styles.socialLink} onClick={onClose} aria-label="Twitter">
          <FaTwitter />
        </a>
        <a href="https://discord.gg/KiwiOpsCommunity" target="_blank" rel="noopener noreferrer" className={styles.socialLink} onClick={onClose} aria-label="Discord">
          <FaDiscord />
        </a>
      </div>
    </div>
  );
}