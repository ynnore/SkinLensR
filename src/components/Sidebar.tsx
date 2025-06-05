// src/components/Sidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  FaTachometerAlt, FaSearch, FaFolder, FaLink, FaCreditCard, FaBoxOpen,
  FaHistory, FaLaptopCode, FaCog, FaFileContract, FaShieldAlt
} from 'react-icons/fa';
import { HiOutlineSparkles } from "react-icons/hi"; // Logo alternatif

import styles from './Sidebar.module.css'; // Importez le CSS Module

interface SidebarProps {
  isOpen: boolean;
}

const menuItems = [
  { href: '/run', label: 'Run', icon: FaTachometerAlt },
  { href: '/discover', label: 'Discover', icon: FaSearch },
  { href: '/files', label: 'Files', icon: FaFolder },
  { href: '/connections', label: 'Connections', icon: FaLink },
  { href: '/pay', label: 'Pay', icon: FaCreditCard },
  { href: '#', label: 'Coming Soon', icon: FaBoxOpen, disabled: true },
  { href: '/recent-runs', label: 'Recent Runs', icon: FaHistory },
  { href: '/app-development', label: 'App Development', icon: FaLaptopCode },
];

const bottomMenuItems = [
  { href: '/settings', label: 'Settings', icon: FaCog },
  { href: '/terms', label: 'Terms', icon: FaFileContract },
  { href: '/privacy-policy', label: 'Privacy Policy', icon: FaShieldAlt },
];

interface MenuItemLayoutProps {
  href: string;
  label: string;
  icon: React.ElementType;
  isOpen: boolean;
  disabled?: boolean;
  currentPathname: string;
}

function MenuItemLayout({ href, label, icon: Icon, isOpen, disabled, currentPathname }: MenuItemLayoutProps) {
  const isActive = !disabled && currentPathname === href;

  let linkClassName = styles.menuItemLink;
  if (isActive && !disabled) { // S'assurer que disabled n'est pas actif pour le style 'active'
    linkClassName += ` ${styles.active}`;
  }
  if (disabled) {
    linkClassName += ` ${styles.disabled}`;
  }

  let iconClassName = styles.menuItemIcon;
  if (isOpen) {
    iconClassName += ` ${styles.menuItemIconOpen}`;
  } else {
    iconClassName += ` ${styles.menuItemIconClosed}`;
  }

  let labelClassName = styles.menuItemLabel;
  if (isOpen) {
    labelClassName += ` ${styles.menuItemLabelOpen}`;
  } else {
    labelClassName += ` ${styles.menuItemLabelClosed}`;
  }

  return (
    <Link
      href={disabled ? '#' : href}
      className={linkClassName}
      aria-disabled={disabled}
      onClick={(e) => disabled && e.preventDefault()}
    >
      <Icon className={iconClassName} />
      <span className={labelClassName}>
        {label}
      </span>
    </Link>
  );
}

export default function Sidebar({ isOpen }: SidebarProps) {
  const currentPathname = usePathname();

  const sidebarClassName = `${styles.sidebar} ${isOpen ? styles.sidebarOpen : styles.sidebarClosed}`;

  return (
    <div className={sidebarClassName}>
      <div className={styles.sidebarHeader}>
        <Link href="/" className={styles.logoLink}>
          {isOpen ? (
            'SkinLensr' // Texte lorsque la sidebar est ouverte
          ) : (
            <HiOutlineSparkles className={styles.logoIconSL} /> // Icône lorsque la sidebar est fermée
          )}
        </Link>
      </div>

      <nav className={styles.nav}>
        {menuItems.map((item) => (
          <MenuItemLayout
            key={item.label}
            {...item}
            isOpen={isOpen}
            currentPathname={currentPathname}
          />
        ))}
      </nav>

      {/* Section pour les items du bas de la sidebar */}
      <div className={styles.sidebarFooter}>
        {bottomMenuItems.map((item) => (
          <MenuItemLayout
            key={item.label}
            {...item}
            isOpen={isOpen}
            currentPathname={currentPathname}
          />
        ))}
      </div>
    </div>
  );
}