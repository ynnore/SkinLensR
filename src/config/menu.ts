// src/config/menu.ts
import { FaCompass, FaBolt, FaComments, FaHistory, FaCog, FaShieldAlt, FaBook } from 'react-icons/fa';

// On définit une structure pour nos liens
export interface NavLink {
  href: string;
  label: string;
  icon: React.ElementType;
}

// On définit la liste des liens principaux
export const mainNavLinks: NavLink[] = [
  { href: '/discover', label: 'Discover', icon: FaCompass },
  { href: '/pay', label: 'Pay', icon: FaBolt },
  { href: '/connections', label: 'Connections', icon: FaComments },
  { href: '/recent-runs', label: 'Recent Runs', icon: FaHistory },
  { href: '/app-development', label: 'App Development', icon: FaBook },
];

// On définit la liste des liens du bas (paramètres, etc.)
export const secondaryNavLinks: NavLink[] = [
  { href: '/settings', label: 'Settings', icon: FaCog },
  { href: '/terms', label: 'Terms', icon: FaShieldAlt },
  { href: '/privacy', label: 'Privacy Policy', icon: FaShieldAlt },
];
