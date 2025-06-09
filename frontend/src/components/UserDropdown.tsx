import styles from './UserDropdown.module.css';
import { FaSignOutAlt, FaTwitter, FaDiscord } from 'react-icons/fa';

export default function UserDropdown() {
  const mockUser = { email: 'ronny...dev@gmail.com' };
  
  return (
    <div className={styles.dropdown}>
      <div className={styles.profileSection}>
        <span>{mockUser.email}</span>
      </div>
      <a href="#" className={styles.menuItem}><FaSignOutAlt /><span>Log out</span></a>
      <div className={styles.divider}></div>
      <a href="#" className={styles.menuItem}><FaTwitter /><span>Follow us</span></a>
      <a href="#" className={styles.menuItem}><FaDiscord /><span>Join the Discord</span></a>
    </div>
  );
}