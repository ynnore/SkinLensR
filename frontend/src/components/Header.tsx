// Fichier: src/components/Header.tsx
import styles from './Header.module.css';
import { FaSun, FaMoon } from 'react-icons/fa';

interface HeaderProps {
  onToggleUserMenu: () => void;
  onToggleTheme: () => void;
  isDarkMode: boolean;
}

export default function Header({ onToggleUserMenu, onToggleTheme, isDarkMode }: HeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.leftSection}></div>
      <div className={styles.rightSection}>
        <button onClick={onToggleTheme} className={styles.iconButton}>
          {isDarkMode ? <FaSun /> : <FaMoon />}
        </button>
        <button onClick={onToggleUserMenu} className={styles.iconButton}>
          <div className={styles.avatar}>N</div>
        </button>
      </div>
    </header>
  );
}