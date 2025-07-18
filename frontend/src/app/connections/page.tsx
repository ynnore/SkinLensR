import styles from './connections.module.css';

export default function ConnectionsPage() {
  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.title}>Réseau des Alliances</h1>
      {/* Ici viendra la gestion des connexions entre IA */}
      <p className={styles.placeholder}>Visualisation de l'état du réseau des agents IA alliés...</p>
    </div>
  );
}