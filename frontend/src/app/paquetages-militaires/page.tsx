// Fichier: src/app/paquetages-militaires/page.tsx
'use client';

import React from 'react';
import styles from './paquetages.module.css';
import { useLanguage } from '@/contexts/LanguageContext'; // Assurez-vous du bon chemin
import { useTheme } from '@/context/ThemeContext';     // Assurez-vous du bon chemin

// Objet de traduction pour cette page
const packagesTranslations = {
  headline: {
    en: "Military Packages",
    fr: "Paquetages Militaires",
  },
  intro: {
    en: "Unlock advanced agent capabilities tailored for your strategic operations.",
    fr: "Débloquez des capacités d'agent avancées, conçues pour vos opérations stratégiques.",
  },
  packageCadet: {
    name: { en: "Cadet Briefing", fr: "Briefing Cadet" },
    description: { en: "Basic social media analysis. Ideal for reconnaissance.", fr: "Analyse de base des réseaux sociaux. Idéal pour la reconnaissance." },
    cta: { en: "Access Briefing", fr: "Accéder au Briefing" }
  },
  packageOperative: {
    name: { en: "Operative Toolkit", fr: "Kit d'Outils d'Opérateur" },
    description: { en: "Deep dives into social trends, sentiment analysis, tactical content suggestions.", fr: "Plongées profondes dans les tendances sociales, analyse de sentiment, suggestions de contenu tactiques." },
    cta: { en: "Activate Toolkit", fr: "Activer le Kit d'Outils" }
  },
  packageOfficer: {
    name: { en: "Strategic Command", fr: "Commandement Stratégique" },
    description: { en: "Predictive analytics, full profile audits, AI-driven content generation.", fr: "Analyse prédictive, audits de profil complets, génération de contenu par IA." },
    cta: { en: "Request Access", fr: "Demander l'Accès" }
  },
  // ... vous ajouterez ici plus de détails sur les prix, etc.
};

function getPackageTranslation<K extends keyof typeof packagesTranslations, P extends keyof typeof packagesTranslations[K]>(
  key: K, subKey: P, lang: LanguageCode
): string {
  const translations = packagesTranslations[key] as Record<string, any>;
  return (translations[subKey] as Record<string, string>)?.[lang] || (translations[subKey] as Record<string, string>)?.en || '';
}


const PaquetagesMilitairesPage: React.FC = () => {
  const { language } = useLanguage();
  const { theme } = useTheme();

  const backgroundColor = theme === 'dark' ? '#1f2937' : '#ffffff';
  const textColor = theme === 'dark' ? '#E0E0E0' : '#111827';
  const cardBgColor = theme === 'dark' ? '#2A2A3A' : '#F8F8F8';
  const borderColor = theme === 'dark' ? '#555555' : '#e5e7eb';
  const highlightColor = theme === 'dark' ? '#0070f3' : '#0070f3';

  return (
    <div
      className={styles.container}
      style={{
        '--kiwi-background-page': backgroundColor,
        '--kiwi-text-primary': textColor,
        '--kiwi-background-card': cardBgColor,
        '--kiwi-border-color': borderColor,
        '--kiwi-highlight-color': highlightColor,
      } as React.CSSProperties}
    >
      <h1 className={styles.headline}>{getPackageTranslation('headline', 'en', language)}</h1>
      <p className={styles.intro}>{getPackageTranslation('intro', 'en', language)}</p>

      <div className={styles.packagesGrid}>
        {/* Paquetage Cadet */}
        <div className={styles.packageCard}>
          <h2 className={styles.packageName}>{getPackageTranslation('packageCadet', 'name', language)}</h2>
          <p className={styles.packageDescription}>{getPackageTranslation('packageCadet', 'description', language)}</p>
          <button className={styles.packageCta}>{getPackageTranslation('packageCadet', 'cta', language)}</button>
        </div>

        {/* Paquetage Opérateur */}
        <div className={styles.packageCard}>
          <h2 className={styles.packageName}>{getPackageTranslation('packageOperative', 'name', language)}</h2>
          <p className={styles.packageDescription}>{getPackageTranslation('packageOperative', 'description', language)}</p>
          <button className={styles.packageCta}>{getPackageTranslation('packageOperative', 'cta', language)}</button>
        </div>

        {/* Paquetage Officier */}
        <div className={styles.packageCard}>
          <h2 className={styles.packageName}>{getPackageTranslation('packageOfficer', 'name', language)}</h2>
          <p className={styles.packageDescription}>{getPackageTranslation('packageOfficer', 'description', language)}</p>
          <button className={styles.packageCta}>{getPackageTranslation('packageOfficer', 'cta', language)}</button>
        </div>
      </div>
    </div>
  );
};