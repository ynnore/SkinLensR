'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageCode } from '@/types';
import styles from '../page.module.css';

function getTranslation(section: string, key: string, language: LanguageCode): string {
  const allTranslations: any = {
    loginPage: {
      features: { en: 'Features', fr: 'Fonctionnalités' },
    },
  };
  const value = allTranslations[section]?.[key];
  return value?.[language] || value?.en || key;
}

export default function FeaturesPage() {
  const { language } = useLanguage();

  return (
    <div className={styles.pageContainer}>
      <h1>{getTranslation('loginPage', 'features', language)}</h1>
      <ul>
        <li>🚀 Rapidité</li>
        <li>🔒 Sécurité</li>
        <li>⚡ Intégration simple</li>
      </ul>
    </div>
  );
}
