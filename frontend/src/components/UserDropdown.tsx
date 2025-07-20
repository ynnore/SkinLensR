// Fichier: src/components/UserDropdown.tsx
'use client';

import React from 'react';
import Link from 'next/link'; // Importez Link de Next.js
import { useRouter } from 'next/navigation'; // Importez useRouter
import { useTheme } from '../context/ThemeContext'; // Pour utiliser les couleurs thématiques
import styles from './UserDropdown.module.css'; // Importez le module CSS
import { FaUserCircle, FaSignOutAlt, FaTwitter, FaDiscord, FaTag, FaCog } from 'react-icons/fa'; // Icônes nécessaires

interface UserDropdownProps {
  onClose: () => void;
  userEmail: string;
}

export default function UserDropdown({ onClose, userEmail }: UserDropdownProps) {
  const router = useRouter();
  const { theme } = useTheme();

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault(); // Empêche la navigation par défaut
    console.log('User logged out');
    onClose(); // Ferme le dropdown
    router.push('/logout'); // Redirige vers la page de déconnexion
  };

  // Définissez les couleurs en fonction du thème (pour injecter dans les variables CSS)
  const textColor = theme === 'dark' ? '#E0E0E0' : '#111827';
  const mutedTextColor = theme === 'dark' ? '#A0A0A0' : '#6b7280';
  const borderColor = theme === 'dark' ? '#555555' : '#e5e7eb';
  const highlightColor = theme === 'dark' ? '#8BC4FF' : '#4A90E2';
  const sectionBgColor = theme === 'dark' ? '#2A2A3A' : '#F8F8F8'; // Utiliser #F8F8F8 pour le mode clair (gris très très clair)
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
            <FaUserCircle /><span>Profil</span> {/* Lien vers la page profil */}
          </Link>
        </li>
        <li>
          <Link href="/settings" className={styles.menuItem} onClick={onClose}>
            <FaCog /><span>Paramètres QG</span> {/* Lien vers la page de paramètres */}
          </Link>
        </li>
        <li>
          <Link href="/pricing" className={styles.menuItem} onClick={onClose}>
            <FaTag /><span>Tarifs d'Accréditation</span> {/* Lien vers la page pricing */}
          </Link>
        </li>
        {/* L'élément de déconnexion */}
        <li>
          <a onClick={handleLogout} className={`${styles.menuItem} ${styles.logoutItem}`}>
            <FaSignOutAlt /><span>Déconnexion</span>
          </a>
        </li>
      </ul>

      <div className={styles.divider}></div>

      {/* Réseaux sociaux */}
      <div className={styles.socialSection}>
        <a href="https://twitter.com/KiwiOps" target="_blank" rel="noopener noreferrer" className={styles.socialLink} onClick={onClose}>
          <FaTwitter />
        </a>
        <a href="https://discord.gg/KiwiOpsCommunity" target="_blank" rel="noopener noreferrer" className={styles.socialLink} onClick={onClose}>
          <FaDiscord />
        </a>
      </div>
    </div>
  );
}