import styles from './dashboard.module.css';

export default function DashboardPage() {
  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.title}>État-Major</h1>
      {/* Ici viendra ton tableau de bord principal */}
      <p className={styles.placeholder}>Synthèse des opérations et renseignements importants...</p>
    </div>
  );
}