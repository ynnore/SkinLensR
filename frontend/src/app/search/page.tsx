'use client';

import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageCode } from '@/types';
import styles from '../page.module.css';

function getTranslation(section: string, key: string, language: LanguageCode): string {
  const allTranslations: any = {
    loginPage: {
      search: { en: 'Search', fr: 'Recherche' },
    },
  };
  const value = allTranslations[section]?.[key];
  return value?.[language] || value?.en || key;
}

export default function SearchPage() {
  const { language } = useLanguage();
  const [query, setQuery] = useState('');

  return (
    <div className={styles.pageContainer}>
      <h1>{getTranslation('loginPage', 'search', language)}</h1>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="🔍 Rechercher..."
        className={styles.searchInput}
      />
      {query && <p>Résultats pour : <strong>{query}</strong></p>}
    </div>
  );
}
