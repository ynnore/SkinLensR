'use client';

import Link from 'next/link';
import styles from './Sidebar.module.css';
import { useState, useCallback } from 'react';
import UserDropdown from './UserDropdown';
import {
  FaFire,
  FaCompass,
  FaFileAlt,
  FaLink,
  FaCoins,
  FaCog,
  FaFileContract,
  FaKey,
  FaSun,
  FaMoon,
  FaAngleLeft,
  FaAngleRight,
} from 'react-icons/fa';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

interface NavLinkItem {
  href: string;
  label: string;
  icon: React.ElementType;
  isComingSoon?: boolean;
}

const navLinks: NavLinkItem[] = [
  { href: '#', label: 'Scan', icon: FaFire },
  { href: '#', label: 'Dashboard', icon: FaCompass },
  { href: '#', label: 'Files', icon: FaFileAlt },
  { href: '#', label: 'Connections', icon: FaLink },
  { href: '#', label: 'Pay', icon: FaCoins },
];

const footerLinks: NavLinkItem[] = [
  { href: '#', label: 'Settings', icon: FaCog },
  { href: '#', label: 'Terms', icon: FaFileContract },
  { href: '#', label: 'Privacy Policy', icon: FaKey },
];

export default function Sidebar({
  isOpen,
  toggleSidebar,
  isDarkMode,
  toggleTheme,
}: SidebarProps) {
  const [isMenuOpen, setMenuOpen] = useState(false);

  const toggleMenu = useCallback(() => {
    setMenuOpen((prev) => !prev);
  }, []);

  return (
    <aside className={`${styles.sidebar} ${isOpen ? styles.open : styles.closed}`}>
      <button onClick={toggleSidebar} className={styles.collapseButton}>
        {isOpen ? <FaAngleLeft /> : <FaAngleRight />}
      </button>

      <div className={styles.header}>
        <button onClick={toggleMenu} className={styles.logoButton}>
          <div className={styles.logo}>S</div>
        </button>
        <span className={styles.headerTitle}>Beta</span>
        <button onClick={toggleTheme} className={styles.themeToggle}>
          {isDarkMode ? <FaSun /> : <FaMoon />}
        </button>
        {isMenuOpen && <UserDropdown />}
      </div>

      <nav className={styles.nav}>
        <ul>
          {navLinks.map(({ href, label, icon: Icon, isComingSoon }) => (
            <li key={label}>
              <Link href={href} className={styles.navLink}>
                <Icon className={styles.navIcon} />
                <span className={styles.navLabel}>{label}</span>
                {isComingSoon && (
                  <span className={styles.comingSoon}>Coming Soon</span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className={styles.footer}>
        <ul>
          {footerLinks.map(({ href, label, icon: Icon }) => (
            <li key={label}>
              <Link href={href} className={styles.navLink}>
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
