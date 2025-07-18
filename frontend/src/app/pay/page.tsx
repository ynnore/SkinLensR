import styles from './pay.module.css';

export default function PayPage() {
  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.title}>Intendance</h1>
      {/* Ici viendra la gestion des abonnements */}
      <p className={styles.placeholder}>Gestion des contributions à l'effort des opérations...</p>
    </div>
  );
}