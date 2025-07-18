import styles from './files.module.css';

export default function FilesPage() {
  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.title}>Archives</h1>
      {/* Ici viendra ton gestionnaire de fichiers */}
      <p className={styles.placeholder}>Consultation des dossiers et documents classifiés...</p>
    </div>
  );
}