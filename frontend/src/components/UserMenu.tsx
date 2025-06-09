// Fichier: src/components/UserMenu.tsx
"use client";

import styles from './UserMenu.module.css';
import { useState } from 'react';
import { FaSignOutAlt, FaTwitter, FaDiscord, FaPaperPlane, FaPhone, FaUserCircle } from 'react-icons/fa';

// On simule l'état de connexion ici pour l'exemple
const mockUser = {
  email: 'ronny...dev@gmail.com',
};

const UserMenu = () => {
  // État pour savoir si l'utilisateur est connecté. Changez-le en `false` pour tester.
  const [isLoggedIn] = useState(true); 

  if (!isLoggedIn) {
    return (
      <a href="/login" className={`${styles.menuButton} ${styles.loginButton}`}>
        <FaUserCircle />
        <span>Login / Sign Up</span>
      </a>
    );
  }

  return (
    <div className={styles.userMenu}>
      <div className={styles.profileRow}>
        <div className={styles.avatar}></div>
        <span>{mockUser.email}</span>
      </div>
      
      <a href="/logout" className={styles.menuButton}>
        <FaSignOutAlt />
        <span>Log out</span>
      </a>

      <div className={styles.divider}></div>
      
      <a href="#" className={styles.menuButton}><FaTwitter /><span>Follow us</span></a>
      <a href="#" className={styles.menuButton}><FaDiscord /><span>Join the Discord</span></a>
      <a href="#" className={styles.menuButton}><FaPaperPlane /><span>Send feedback</span></a>
      <a href="#" className={styles.menuButton}><FaPhone /><span>Talk to sales</span></a>
    </div>
  );
};

export default UserMenu;