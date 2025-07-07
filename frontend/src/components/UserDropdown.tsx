// Fichier: src/components/UserDropdown.tsx
'use client';

import React from 'react';
import styles from './UserDropdown.module.css';
import { FaSignOutAlt, FaTwitter, FaDiscord } from 'react-icons/fa';

// L'interface n'a plus besoin de la prop 'theme'
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
    // Les styles inline ne sont plus nécessaires ici
    <div className={styles.dropdown}> 
      <div className={styles.profileSection}>
        <span>{userEmail}</span>
      </div>

      <button onClick={handleLogout} className={styles.menuItem}>
        <FaSignOutAlt /><span>Log out</span>
      </button>

      <div className={styles.divider}></div>

      <a href="https://twitter.com/KiwiOps" target="_blank" rel="noopener noreferrer" className={styles.menuItem}>
        <FaTwitter /><span>Follow us</span>
      </a>

      <a href="https://discord.gg/KiwiOpsCommunity" target="_blank" rel="noopener noreferrer" className={styles.menuItem}>
        <FaDiscord /><span>Join the Discord</span>
      </a>
    </div>
  );
}