'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageCode } from '@/types';
import styles from '../page.module.css';

function getTranslation(section: string, key: string, language: LanguageCode): string {
  const allTranslations: any = {
    loginPage: {
      story: { en: 'Our Story', fr: 'Notre histoire' },
    },
  };
  const value = allTranslations[section]?.[key];
  return value?.[language] || value?.en || key;
}

export default function StoryPage() {
  const { language } = useLanguage();

  return (
    <div className={styles.pageContainer}>
      <h1>{getTranslation('loginPage', 'story', language)}</h1>
      <p>
        L’histoire de Kiwi commence avec une vision claire : 
        bâtir des solutions dans l’ombre pour révéler demain une innovation forte.  
        Racontez ici votre parcours, votre équipe, vos inspirations.
      </p>
    </div>
  );
}
