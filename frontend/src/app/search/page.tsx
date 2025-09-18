'use client';

import React, { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageCode } from '@/types';
import styles from './search.module.css';
import { useRouter } from 'next/navigation';

// --- TRADUCTIONS ---
const allTranslations = {
  searchPage: {
    pageTitle: { en: 'Intelligent Search, Powered by Kiwi-Ops', fr: 'Recherche Intelligente, Propulsée par Kiwi-Ops', /* ... autres langues */ },
    searchPlaceholder: { en: 'What are you looking for today?', fr: 'Que recherchez-vous aujourd\'hui ?', /* ... */ },
    searchButton: { en: 'Search', fr: 'Rechercher', /* ... */ },
    aiSearchExplanationTitle: { en: 'Experience the Power of A2A: Smart Search with Kiwi-Ops', fr: 'Découvrez la Puissance de l\'A2A : Recherche Intelligente avec Kiwi-Ops', /* ... */ },
    aiSearchExplanationText: { en: 'Behind every search, Kiwi-Ops leverages its secure Application-to-Application (A2A) protocol to dynamically route your query to the best AI models.', fr: 'Derrière chaque recherche, Kiwi-Ops exploite son protocole sécurisé Application-to-Application (A2A) pour acheminer dynamiquement votre requête vers les meilleurs modèles d\'IA.', /* ... */ },
    aiRefinementTitle: { en: 'AI-Enhanced Query:', fr: 'Requête Affinée par l\'IA :', /* ... */ },
    noResults: { en: 'No results found for your query. Try a different search.', fr: 'Aucun résultat trouvé pour votre requête. Essayez une autre recherche.', /* ... */ },
    loadingResults: { en: 'Processing your intelligent search...', fr: 'Traitement de votre recherche intelligente...', /* ... */ },
    exampleSuggestions: { en: 'Popular searches: Kiwi Pro, Ergonomic Design, Long-lasting Battery', fr: 'Recherches populaires : Kiwi Pro, Design Ergonomique, Batterie longue durée', /* ... */ },
    footer: { en: 'Kiwi-Ops – Secure Intelligent Solutions.', fr: 'Kiwi-Ops – Solutions Intelligentes Sécurisées.', /* ... */ },
  }
};

// --- FONCTION DE TRADUCTION ---
const getTranslation = <
  S extends keyof typeof allTranslations,
  K extends keyof typeof allTranslations[S]
>(
  section: S,
  key: K,
  lang: LanguageCode
): string => {
  const sectionTranslations = allTranslations[section];
  if (!sectionTranslations) return `[Missing Section: ${String(section)}]`;

  const translations = sectionTranslations[key];
  if (typeof translations !== 'object' || translations === null || !('en' in translations)) {
    return `[Invalid Translation]`;
  }

  return (translations as { [l: string]: string })[lang] || (translations as { [l: string]: string }).en;
};

// --- DONNÉES MOCK ---
const mockSearchResults = [
  {
    id: 'kiwi-pro-v2',
    name: 'Kiwi Pro Gen 2',
    description: { en: 'The next generation of Kiwi Pro, with enhanced AI capabilities.', fr: 'La nouvelle génération de Kiwi Pro, avec des capacités d\'IA améliorées.' },
    category: 'Smart Devices',
    imageUrl: '/images/kiwi-product-main.jpg',
  },
  {
    id: 'kiwi-sense',
    name: 'Kiwi Sense',
    description: { en: 'A compact and powerful sensor for environmental monitoring.', fr: 'Un capteur compact et puissant pour la surveillance environnementale.' },
    category: 'Sensors',
    imageUrl: '/images/kiwi-product-alt1.jpg',
  },
  {
    id: 'kiwi-hub',
    name: 'Kiwi Hub',
    description: { en: 'The central station for all your Kiwi devices.', fr: 'La station centrale pour tous vos appareils Kiwi.' },
    category: 'Connectivity',
    imageUrl: '/images/kiwi-product-alt2.jpg',
  },
];

// --- SIMULATION D'API ---
async function simulateKiwiOpsSearch(query: string, language: LanguageCode) {
  await new Promise((resolve) => setTimeout(resolve, 1500));
  const lowerQuery = query.toLowerCase();

  const results = mockSearchResults.filter(item =>
    item.name.toLowerCase().includes(lowerQuery) ||
    (item.description[language as keyof typeof item.description]?.toLowerCase().includes(lowerQuery)) ||
    item.description.en.toLowerCase().includes(lowerQuery) ||
    item.category.toLowerCase().includes(lowerQuery)
  );

  let aiRefinement: string | undefined;
  if (lowerQuery.includes('pro')) {
    aiRefinement = language === 'fr' ? 'Recherche axée sur les appareils "Pro".' : 'Focusing search on "Pro" devices.';
  } else if (lowerQuery.includes('batterie') || lowerQuery.includes('battery')) {
    aiRefinement = language === 'fr' ? 'Affinement pour trouver des produits avec longue autonomie.' : 'Refining search for extended battery life.';
  } else if (lowerQuery.includes('capteur') || lowerQuery.includes('sensor')) {
    aiRefinement = language === 'fr' ? 'Recherche des capteurs et solutions.' : 'Searching for sensors and monitoring solutions.';
  }

  return { results, aiRefinement };
}

// --- COMPOSANT PRINCIPAL ---
export default function SearchPage() {
  const { theme } = useTheme();
  const { language } = useLanguage();
  const router = useRouter();

  const textColor = theme === 'dark' ? '#E0E0E0' : '#111827';
  const mutedTextColor = theme === 'dark' ? '#A0A0A0' : '#6b7280';
  const borderColor = theme === 'dark' ? '#555555' : '#e5e7eb';
  const highlightColor = theme === 'dark' ? '#8BC4FF' : '#4A90E2';
  const sectionBgColor = theme === 'dark' ? 'rgba(42, 42, 58, 0.9)' : 'rgba(248, 248, 248, 0.9)';
  const textShadowColor = theme === 'dark' ? 'rgba(0,0,0,0.6)' : 'rgba(0,0,0,0.1)';
  const shadowColorCard = theme === 'dark' ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.1)';
  const overlayColor = theme === 'dark' ? 'rgba(10, 15, 25, 0.88)' : 'rgba(255, 255, 255, 0.7)';

  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [aiRefinement, setAiRefinement] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    setAiRefinement(null);
    setHasSearched(true);

    try {
      const { results: newResults, aiRefinement: newAiRefinement } = await simulateKiwiOpsSearch(searchQuery, language);
      setResults(newResults);
      setAiRefinement(newAiRefinement || null);
    } catch (error) {
      console.error("Error during search:", error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={styles.pageContainer}
      style={{
        '--kiwi-overlay-color': overlayColor,
        '--kiwi-text-primary': textColor,
        '--kiwi-text-secondary': mutedTextColor,
        '--kiwi-border-color': borderColor,
        '--kiwi-background-section': sectionBgColor,
        '--kiwi-highlight-color': highlightColor,
        '--kiwi-text-shadow': `2px 2px 0px ${textShadowColor}`,
        '--kiwi-shadow-color-card': shadowColorCard,
      } as React.CSSProperties}
    >
      <div className={styles.contentWrapper}>
        <h1 className={styles.title}>{getTranslation('searchPage', 'pageTitle', language)}</h1>

        <section className={styles.aiExplanationSection}>
          <h2>{getTranslation('searchPage', 'aiSearchExplanationTitle', language)}</h2>
          <p>{getTranslation('searchPage', 'aiSearchExplanationText', language)}</p>
        </section>

        <form onSubmit={handleSearch} className={styles.searchForm}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={getTranslation('searchPage', 'searchPlaceholder', language)}
            className={styles.searchInput}
            disabled={isLoading}
          />
          <button type="submit" className={styles.searchButton} disabled={isLoading}>
            {isLoading ? getTranslation('searchPage', 'loadingResults', language) : getTranslation('searchPage', 'searchButton', language)}
          </button>
        </form>

        {!hasSearched && (
          <p className={styles.searchSuggestions}>
            {getTranslation('searchPage', 'exampleSuggestions', language)}
          </p>
        )}

        {aiRefinement && (
          <div className={styles.aiRefinementBox}>
            <strong>{getTranslation('searchPage', 'aiRefinementTitle', language)}</strong> {aiRefinement}
          </div>
        )}

        <div className={styles.searchResultsContainer}>
          {isLoading && hasSearched && (
            <p className={styles.loadingMessage}>{getTranslation('searchPage', 'loadingResults', language)}</p>
          )}

          {!isLoading && hasSearched && results.length === 0 && (
            <p className={styles.noResultsMessage}>{getTranslation('searchPage', 'noResults', language)}</p>
          )}

          {!isLoading && results.length > 0 && (
            <div className={styles.resultsGrid}>
              {results.map((item) => (
                <div key={item.id} className={styles.resultCard} onClick={() => router.push(`/product/${item.id}`)}>
                  <img src={item.imageUrl} alt={item.name} className={styles.resultImage} />
                  <h3>{item.name}</h3>
                  <p className={styles.resultCategory}>{item.category}</p>
                  <p>{item.description[language as keyof typeof item.description] || item.description.en}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <p className={styles.globalFooter}>
          © <span suppressHydrationWarning>{new Date().getFullYear()}</span> {getTranslation('searchPage', 'footer', language)}
        </p>
      </div>
    </div>
  );
}
