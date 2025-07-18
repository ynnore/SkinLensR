// Fichier: src/app/connections/page.tsx
'use client';

// On n'a plus besoin de useTheme ici, car le style est géré par le CSS global
import { allNations, Nation } from '../../lib/nations'; 
import styles from './connections.module.css'; 

export default function ConnectionsPage() {
  // Pour la démo, on définit quelques nations comme "actives".
  // Plus tard, cette information viendra de ta base de données.
  const activeNations = ['ca', 'gb', 'fr', 'de'];

  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.title}>Réseau des Alliances</h1>
      <p className={styles.subtitle}>
        Visualisation de l'état du réseau des agents IA. Les connexions actives et les flux de données entre les nations sont affichés ici.
      </p>

      {/* La grille des nations */}
      <div className={styles.nationsGrid}>
        {allNations.map((nation: Nation) => (
          <div key={nation.id} className={styles.nationCard}>
            <div className={styles.cardHeader}>
              <h2 className={styles.nationName}>{nation.name}</h2>
              <span 
                className={styles.statusDot} 
                style={{ 
                  backgroundColor: activeNations.includes(nation.id) ? '#2ECC71' : '#E74C3C',
                  boxShadow: activeNations.includes(nation.id) ? '0 0 8px #2ECC71' : 'none'
                }}
                title={activeNations.includes(nation.id) ? 'Connexion Active' : 'Liaison non établie'}
              ></span>
            </div>
            <p className={styles.nationGroup}>{nation.group}</p>
          </div>
        ))}
      </div>
    </div>
  );
}