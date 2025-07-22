'use client';

// ✅ Imports complétés avec useRef, useCallback, useOnClickOutside et useSound
import React, { useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageCode } from '@/types';
import { useOnClickOutside } from '@/hooks/useOnClickOutside';
import useSound from 'use-sound';
import styles from './UserDropdown.module.css';

// Icônes
import {
  FaSignOutAlt, FaDiscord, FaYoutube, FaLinkedin, FaGithub, FaInstagram, FaHandshake, FaThumbsUp, FaEnvelope,
  FaUserPlus, FaNewspaper, FaTruck, FaExclamationTriangle, FaRocket, FaLightbulb, FaUserCircle,
  FaChevronDown
} from 'react-icons/fa';
import { FaTiktok } from 'react-icons/fa6';

interface UserDropdownProps {
  onClose: () => void;
  userEmail: string;
}

// SVG minimaliste pour X
const XIcon = ({ size = 18 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18 2h3l-7.5 9 7.5 11h-3l-6-9-6 9H3l7.5-11L3 2h3l6 8z"/>
  </svg>
);

// L'objet des traductions que vous avez fourni
const allTranslations = {
  operationsLinks: {
    ghost: { en: 'Join Operation', fr: 'Rejoindre l\'Opération', mi: 'Hono atu ki te Whakahaere', ga: 'Páirt a ghlacadh san Oibríocht', hi: 'ऑपरेशन में शामिल हों', gd: 'Gabh an sàs san obair' },
    press: { en: 'Press', fr: 'Presse', mi: 'Pāpāho', ga: 'Preas', hi: 'प्रेस', gd: 'Na meadhanan' },
    dispatch: { en: 'Dispatch', fr: 'Expédition', mi: 'Tuku', ga: 'Seoladh', hi: 'प्रेषण', gd: 'Cur air falbh' },
    breach: { en: 'Breach Report', fr: 'Signalement de Violation', mi: 'Ripoata Pakaru', ga: 'Tuarascáil Sáraithe', hi: 'उल्लंघन की रिपोर्ट', gd: 'Aithisg Briseadh' },
    vanguard: { en: 'Vanguard', fr: 'Avant-garde', mi: 'Kaitiaki', ga: 'Tús cadhnaíochta', hi: 'हरावल', gd: 'Ro-thach' },
    intel: { en: 'Intel', fr: 'Intel', mi: 'Mōhiohio', ga: 'Faisnéis', hi: 'इंटेल', gd: 'Fiosrachadh' },
  },
  contactLinks: {
    becomePartners: { en: 'Become partners', fr: 'Devenir partenaires', mi: 'Hoko hoa', ga: 'Bí i do chomhpháirtithe', hi: 'साझेदार बनें', gd: 'Bi nad chom-pàirtichean' },
    feedback: { en: 'Feedback', fr: 'Feedback', mi: 'Urupare', ga: 'Aiseolas', hi: 'प्रतिक्रिया', gd: 'Fios air ais' },
    talkToSales: { en: 'Talk to sales', fr: 'Parler à un commercial', mi: 'Kōrero ki te hoko', ga: 'Labhair le díolacháin', hi: 'बिक्री से बात करें', gd: 'Bruidhinn ri reic' },
  },
  socials: {
    followUs: { en: 'Follow us', fr: 'Suivez-nous', mi: 'A pee i a matou', ga: 'Lean muid', hi: 'हमें फॉलो करें', gd: 'Lean sinn' },
    joinDiscord: { en: 'Join the Discord', fr: 'Rejoindre le Discord', mi: 'Hono atu ki te Discord', ga: 'Bí páirteach sa Discord', hi: 'डिस्कॉर्ड से जुड़ें', gd: 'Thig còmhla ris an Discord' },
  },
  userDropdown: {
    logoutLink: { en: 'Logout', fr: 'Déconnexion', mi: 'Takiputa', ga: 'Logáil Amach', hi: 'लॉग आउट', gd: 'Log a-mach' },
  },
};

const getTranslation = <S extends keyof typeof allTranslations, K extends keyof typeof allTranslations[S]>(
  section: S,
  key: K,
  lang: LanguageCode
): string => {
  const translations = (allTranslations[section] as any)?.[key];
  return translations?.[lang] || translations?.['en'] || `[${String(section)}.${String(key)}]`;
};


export default function UserDropdown({ onClose, userEmail }: UserDropdownProps) {
  const router = useRouter();
  const { theme } = useTheme();
  const { language } = useLanguage();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null); // ✅ La ref pour le clic extérieur

  // ✅ Le son de la roulette
  const [playClickSound] = useSound('/sounds/roulette-click.mp3', { volume: 0.5 });
  
  // ✅ Ferme le menu si on clique en dehors
  useOnClickOutside(dropdownRef, () => setIsMenuOpen(false));

  const toggleMenu = useCallback(() => {
    setIsMenuOpen(prev => !prev);
    playClickSound(); // Joue le son
  }, [playClickSound]);

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    onClose();
    router.push('/logout');
  };
  
  const handleLinkClick = useCallback(() => {
    setIsMenuOpen(false); // Ferme le menu au clic sur un lien
    onClose();
  }, [onClose]);

  const textColor = theme === 'dark' ? '#E0E0E0' : '#111827';
  const mutedTextColor = theme === 'dark' ? '#A0A0A0' : '#6b7280';
  const borderColor = theme === 'dark' ? '#3e3e4f' : '#e5e7eb';
  const hoverBgColor = theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)';

  return (
    // ✅ La ref est attachée au conteneur principal
    <div className={styles.dropdown} ref={dropdownRef} style={{ '--kiwi-text-primary': textColor, '--kiwi-text-secondary': mutedTextColor, '--kiwi-border-color': borderColor, '--kiwi-hover-bg': hoverBgColor } as React.CSSProperties}>
      
      {/* Le bouton qui contrôle tout */}
      <div className={styles.profileSection} onClick={toggleMenu}>
        <FaUserCircle className={styles.profileIcon} />
        <span className={styles.profileEmail}>{userEmail}</span>
        <FaChevronDown className={`${styles.chevronIcon} ${isMenuOpen ? styles.chevronOpen : ''}`} />
      </div>

      {/* Le conteneur coulissant */}
      <div className={`${styles.collapsibleContent} ${isMenuOpen ? styles.contentOpen : styles.contentClosed}`}>
        
        {/* Le contenu est identique à votre code */}
        <div className={styles.divider}></div>
        
        <ul className={styles.menuList}>
            <li><Link href="/register" className={styles.menuItem} onClick={handleLinkClick}><FaUserPlus /><span>{getTranslation('operationsLinks', 'ghost', language)}</span></Link></li>
            <li><a href="mailto:press@kiwi-ops.com" className={styles.menuItem}><FaNewspaper /><span>{getTranslation('operationsLinks', 'press', language)}</span></a></li>
            <li><a href="mailto:dispatch@kiwi-ops.com" className={styles.menuItem}><FaTruck /><span>{getTranslation('operationsLinks', 'dispatch', language)}</span></a></li>
            <li><a href="mailto:breach@kiwi-ops.com" className={styles.menuItem}><FaExclamationTriangle /><span>{getTranslation('operationsLinks', 'breach', language)}</span></a></li>
            <li><a href="mailto:vanguard@kiwi-ops.com" className={styles.menuItem}><FaRocket /><span>{getTranslation('operationsLinks', 'vanguard', language)}</span></a></li>
            <li><a href="mailto:intel@kiwi-ops.com" className={styles.menuItem}><FaLightbulb /><span>{getTranslation('operationsLinks', 'intel', language)}</span></a></li>
        </ul>
        
        <div className={styles.divider}></div>

        <ul className={styles.menuList}>
            <li><a href="mailto:partners@kiwi-ops.com" className={styles.menuItem}><FaHandshake /><span>{getTranslation('contactLinks', 'becomePartners', language)}</span></a></li>
            <li><a href="mailto:feedback@kiwi-ops.com" className={styles.menuItem}><FaThumbsUp /><span>{getTranslation('contactLinks', 'feedback', language)}</span></a></li>
            <li><Link href="/contact-sales" className={styles.menuItem} onClick={handleLinkClick}><FaEnvelope /><span>{getTranslation('contactLinks', 'talkToSales', language)}</span></Link></li>
        </ul>

        <div className={styles.divider}></div>
        
        <ul className={styles.menuList}>
            <li><a href="https://x.com/KiwiOps" target="_blank" rel="noopener noreferrer" className={styles.menuItem} onClick={handleLinkClick}><XIcon /><span>{getTranslation('socials', 'followUs', language)}</span></a></li>
            <li><a href="https://youtube.com/@KiwiOps" target="_blank" rel="noopener noreferrer" className={styles.menuItem} onClick={handleLinkClick}><FaYoutube /><span>YouTube</span></a></li>
            <li><a href="https://www.linkedin.com/company/kiwiops" target="_blank" rel="noopener noreferrer" className={styles.menuItem} onClick={handleLinkClick}><FaLinkedin /><span>LinkedIn</span></a></li>
            <li><a href="https://github.com/KiwiOps" target="_blank" rel="noopener noreferrer" className={styles.menuItem} onClick={handleLinkClick}><FaGithub /><span>GitHub</span></a></li>
            <li><a href="https://www.instagram.com/KiwiOps" target="_blank" rel="noopener noreferrer" className={styles.menuItem} onClick={handleLinkClick}><FaInstagram /><span>Instagram</span></a></li>
            <li><a href="https://www.tiktok.com/@KiwiOps" target="_blank" rel="noopener noreferrer" className={styles.menuItem} onClick={handleLinkClick}><FaTiktok /><span>TikTok</span></a></li>
            <li><a href="https://discord.gg/KiwiOpsCommunity" target="_blank" rel="noopener noreferrer" className={styles.menuItem} onClick={handleLinkClick}><FaDiscord /><span>{getTranslation('socials', 'joinDiscord', language)}</span></a></li>
        </ul>

        <div className={styles.divider}></div>

        <ul className={styles.menuList}>
            <li><a onClick={handleLogout} className={`${styles.menuItem} ${styles.logoutItem}`}><FaSignOutAlt /><span>{getTranslation('userDropdown', 'logoutLink', language)}</span></a></li>
        </ul>

      </div>
    </div>
  );
}