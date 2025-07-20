'use client';

import React from 'react';
import styles from './UserDropdown.module.css';
import { 
  FaSignOutAlt, 
  FaTwitter, 
  FaDiscord, 
  FaTag, 
  FaInstagram, 
  FaFacebook, 
  FaLinkedin 
} from 'react-icons/fa';

interface UserDropdownProps {
  onClose: () => void;
  userEmail: string;
}

export default function UserDropdown({ onClose, userEmail }: UserDropdownProps) {
  const handleLogout = () => {
    console.log('User logged out');
    onClose();
  };

  return (
    <div className={styles.dropdown}> 
      {/* Section profil */}
      <div className={styles.profileSection}>
        <span>{userEmail}</span>
      </div>

      {/* Bouton Pricing */}
      <a href="/pricing" className={styles.menuItem} onClick={onClose}>
        <FaTag /><span>Pricing</span>
      </a>

      {/* Déconnexion */}
      <button onClick={handleLogout} className={styles.menuItem}>
        <FaSignOutAlt /><span>Log out</span>
      </button>

      <div className={styles.divider}></div>

      {/* Réseaux sociaux */}
      <a href="https://twitter.com/KiwiOps" target="_blank" rel="noopener noreferrer" className={styles.menuItem}>
        <FaTwitter /><span>Twitter</span>
      </a>

      <a href="https://instagram.com/KiwiOps" target="_blank" rel="noopener noreferrer" className={styles.menuItem}>
        <FaInstagram /><span>Instagram</span>
      </a>

      <a href="https://facebook.com/KiwiOps" target="_blank" rel="noopener noreferrer" className={styles.menuItem}>
        <FaFacebook /><span>Facebook</span>
      </a>

      <a href="https://linkedin.com/company/KiwiOps" target="_blank" rel="noopener noreferrer" className={styles.menuItem}>
        <FaLinkedin /><span>LinkedIn</span>
      </a>

      <a href="https://discord.gg/KiwiOpsCommunity" target="_blank" rel="noopener noreferrer" className={styles.menuItem}>
        <FaDiscord /><span>Discord</span>
      </a>
    </div>
  );
}
