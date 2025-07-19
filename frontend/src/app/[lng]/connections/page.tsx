// Fichier: src/app/connections/page.tsx
'use client';

// 1. IMPORTER LE HOOK DE TRADUCTION
// Il faut d'abord créer les fichiers de configuration i18n comme expliqué précédemment.
import { useTranslation } from 'react-i18next'; // <-- MODIFICATION

import { allNations, Nation } from '../../lib/nations';
import styles from './connections.module.css';

// 2. RECEVOIR LA LANGUE EN PROPS
// Next.js passera la langue (ex: 'fr', 'en') via les props.
export default function ConnectionsPage({ params: { lng } }: { params: { lng: string } }) { // <-- MODIFICATION
  
  // 3. INITIALISER LA FONCTION DE TRADUCTION "t"
  const { t } = useTranslation(lng, 'translation'); // <-- MODIFICATION

  const activeNations = ['ca', 'gb', 'fr', 'de'];

  return (
    <div className={styles.pageContainer}>
      {/* 4. REMPLACER LE TEXTE EN DUR PAR LES CLÉS DE TRADUCTION */}
      <h1 className={styles.title}>{t('connections.title')}</h1>
      <p className={styles.subtitle}>
        {t('connections.subtitle')}
      </p>

      <div className={styles.nationsGrid}>
        {allNations.map((nation: Nation) => (
          <div key={nation.id} className={styles.nationCard}>
            <div className={styles.cardHeader}>
              {/* Note: Pour traduire les noms des nations, il faudra adapter votre objet 'allNations' */}
              <h2 className={styles.nationName}>{nation.name}</h2>
              <span
                className={styles.statusDot}
                style={{
                  backgroundColor: activeNations.includes(nation.id) ? '#2ECC71' : '#E74C3C',
                  boxShadow: activeNations.includes(nation.id) ? '0 0 8px #2ECC71' : 'none'
                }}
                // On utilise aussi 't' pour les attributs comme 'title'
                title={activeNations.includes(nation.id) ? t('connections.statusActive') : t('connections.statusInactive')}
              ></span>
            </div>
            <p className={styles.nationGroup}>{nation.group}</p>
          </div>
        ))}
      </div>
    </div>
  );
}