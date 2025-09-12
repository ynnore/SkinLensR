'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageCode } from '@/types';
import styles from '../page.module.css';

// Même fonction utilitaire que sur ta page d’accueil
function getTranslation(section: string, key: string, language: LanguageCode): string {
  // ⚠️ Ici je suppose que tu as allTranslations défini globalement ou dans un helper
  const allTranslations: any = {
    loginPage: {
      product: { en: 'Product', fr: 'Produit' },
    },
  };
  const value = allTranslations[section]?.[key];
  return value?.[language] || value?.en || key;
}

export default function ProductPage() {
  const { language } = useLanguage();

  return (
    <div className={styles.pageContainer}>
      <h1>{getTranslation('loginPage', 'product', language)}</h1>
      <p>
        Voici la page de présentation de votre produit Kiwi. 
        Vous pouvez y ajouter des images, des fiches techniques, et une explication claire de la valeur ajoutée.
      </p>
    </div>
  );
}
