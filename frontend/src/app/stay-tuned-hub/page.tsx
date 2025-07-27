// Fichier: src/app/stay-tuned-hub/page.tsx
'use client';

// CORRECTION : La faute de frappe "inuseState" est corrigée en "{ useState }"
import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { LanguageCode } from '@/types';
import styles from './stay-tuned-hub.module.css';

import { 
    FaTwitter, FaDiscord, FaYoutube, FaLinkedin, FaGithub, FaInstagram, FaTiktok, 
    FaMapMarkerAlt, FaGlobe, FaSearch
} from 'react-icons/fa';

// SVG minimaliste pour X (inchangé)
const XIcon = ({ size = 18 }: { size?: number }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
        <path d="M18 2h3l-7.5 9 7.5 11h-3l-6-9-6 9H3l7.5-11L3 2h3l6 8z"/>
    </svg>
);

// Objet de traduction (inchangé)
const allTranslations = {
    stayTuned: {
        headline: { en: 'Stay Tuned: Operation W Intel Hub', fr: 'Restez Connecté : Centre d\'Intel Opération W', /* ... */ },
        intro: { en: 'Your direct line to classified intel, social updates, and our core inspirations.', fr: 'Votre ligne directe pour l\'intel classifié, les mises à jour sociales, et nos inspirations fondamentales.', /* ... */ },
        socialsTab: { en: 'Social Intel', fr: 'Intel Social', /* ... */ },
        inspirationsTab: { en: 'Our Inspirations', fr: 'Nos Inspirations', /* ... */ },
        rechercheTab: { en: 'Search Archives', fr: 'Rechercher', mi: 'Rapu', ga: 'Cuardaigh', hi: 'खोजें', gd: 'Rannsaich', cy: 'Chwilio', 'fr-CA': 'Rechercher', af: 'Soek Argiewe', },
    },
    inspirations: {
        wellingtonTunnelers: { en: 'Wellington Tunnelers (Arras)', fr: 'Tunneliers de Wellington (Arras)' },
        notreDameLorette: { en: 'Notre-Dame-de-Lorette (French National Necropolis)', fr: 'Nécropole Nationale de Notre-Dame-de-Lorette' },
        wellingtonUrl: 'https://en.wikipedia.org/wiki/Wellington_Tunnel',
        loretteUrl: 'https://en.wikipedia.org/wiki/Notre-Dame-de-Lorette_French_National_Cemetery',
    },
    recherche: {
        headline: { en: 'Search Mission Archives', fr: 'Rechercher dans les Archives' },
        placeholder: { en: 'Enter keyword, agent name, or mission date...', fr: 'Entrez un mot-clé, nom d\'agent, ou date de mission...' },
        loading: { en: 'Searching classified archives...', fr: 'Recherche dans les archives classifiées...' },
        noResults: { en: 'No documents found for', fr: 'Aucun document trouvé pour' },
    },
};

function getTranslation<S extends keyof typeof allTranslations, K extends keyof typeof allTranslations[S]>(
    section: S, key: K, lang: LanguageCode
): string {
    const translations = (allTranslations[section] as any)?.[key];
    return translations?.[lang] || translations?.['en'] || `[${String(section)}.${String(key)}]`;
}

const StayTunedHubPage: React.FC = () => {
    const { language } = useLanguage();
    const { theme } = useTheme();

    const [activeTab, setActiveTab] = useState<'socials' | 'inspirations' | 'recherche'>('socials');
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);

    const handleSearch = () => {
        if (!searchTerm.trim()) return;
        setIsSearching(true);
        setSearchResults([]);
        setHasSearched(true);
        setTimeout(() => {
            const fakeResults = [
                { id: 1, title: `Rapport de Mission : ${searchTerm}`, snippet: 'Analyse des communications interceptées le 24/07. Agent Wellington a confirmé la cible...' },
                { id: 2, title: 'Fiche Agent : Walter Tull', snippet: 'Recruté pour ses capacités exceptionnelles, spécialisé dans les opérations de reconnaissance en territoire hostile...' },
                { id: 3, title: 'Archive : Tunneliers de Wellington', snippet: 'Plans originaux et journaux de bord relatifs à la construction du réseau souterrain à Arras...' },
            ];
            setSearchResults(fakeResults);
            setIsSearching(false);
        }, 1500);
    };

    const backgroundColor = theme === 'dark' ? '#1f2937' : '#ffffff';
    const textColor = theme === 'dark' ? '#E0E0E0' : '#111827';
    const sectionBgColor = theme === 'dark' ? '#2A2A3A' : '#F8F8F8';
    const borderColor = theme === 'dark' ? '#3e3e4f' : '#e5e7eb';
    const highlightColor = theme === 'dark' ? '#0070f3' : '#0070f3';

    return (
        <div 
            className={styles.container} 
            style={{
                '--kiwi-background-page': backgroundColor,
                '--kiwi-text-primary': textColor,
                '--kiwi-background-section': sectionBgColor,
                '--kiwi-border-color': borderColor,
                '--kiwi-highlight-color': highlightColor,
            } as React.CSSProperties}
        >
            <div className={styles.contentWrapper}>
                <h1 className={styles.headline}>{getTranslation('stayTuned', 'headline', language)}</h1>
                <p className={styles.intro}>{getTranslation('stayTuned', 'intro', language)}</p>

                <div className={styles.tabsContainer}>
                    <button 
                        className={`${styles.tabButton} ${activeTab === 'socials' ? styles.activeTab : ''}`}
                        onClick={() => setActiveTab('socials')}
                    >
                        {getTranslation('stayTuned', 'socialsTab', language)}
                    </button>
                    <button 
                        className={`${styles.tabButton} ${activeTab === 'inspirations' ? styles.activeTab : ''}`}
                        onClick={() => setActiveTab('inspirations')}
                    >
                        {getTranslation('stayTuned', 'inspirationsTab', language)}
                    </button>
                    <button 
                        className={`${styles.tabButton} ${activeTab === 'recherche' ? styles.activeTab : ''}`}
                        onClick={() => setActiveTab('recherche')}
                    >
                        {getTranslation('stayTuned', 'rechercheTab', language)}
                    </button>
                </div>

                <div className={styles.tabContent}>
                    {activeTab === 'socials' && (
                        <div className={styles.tabPanel}>
                            <h2 className={styles.panelTitle}>Réseaux Sociaux de la Mission</h2>
                            <ul className={styles.socialList}>
                                <li><a href="https://x.com/KiwiOps" target="_blank" rel="noopener noreferrer" className={styles.socialLink}><XIcon /><span>X (Twitter)</span></a></li>
                                <li><a href="https://youtube.com/@KiwiOps" target="_blank" rel="noopener noreferrer" className={styles.socialLink}><FaYoutube /><span>YouTube</span></a></li>
                                <li><a href="https://www.linkedin.com/company/kiwiops" target="_blank" rel="noopener noreferrer" className={styles.socialLink}><FaLinkedin /><span>LinkedIn</span></a></li>
                                <li><a href="https://github.com/KiwiOps" target="_blank" rel="noopener noreferrer" className={styles.socialLink}><FaGithub /><span>GitHub</span></a></li>
                                <li><a href="https://www.instagram.com/KiwiOps" target="_blank" rel="noopener noreferrer" className={styles.socialLink}><FaInstagram /><span>Instagram</span></a></li>
                                <li><a href="https://www.tiktok.com/@KiwiOps" target="_blank" rel="noopener noreferrer" className={styles.socialLink}><FaTiktok /><span>TikTok</span></a></li>
                                <li><a href="https://discord.gg/KiwiOpsCommunity" target="_blank" rel="noopener noreferrer" className={styles.socialLink}><FaDiscord /><span>Discord</span></a></li>
                            </ul>
                        </div>
                    )}

                    {activeTab === 'inspirations' && (
                        <div className={styles.tabPanel}>
                            <h2 className={styles.panelTitle}>Nos Racines Opérationnelles</h2>
                            <ul className={styles.inspirationList}>
                                <li><a href={getTranslation('inspirations', 'wellingtonUrl', language)} target="_blank" rel="noopener noreferrer" className={styles.inspirationLink}><FaMapMarkerAlt /><span>{getTranslation('inspirations', 'wellingtonTunnelers', language)}</span></a></li>
                                <li><a href={getTranslation('inspirations', 'loretteUrl', language)} target="_blank" rel="noopener noreferrer" className={styles.inspirationLink}><FaGlobe /><span>{getTranslation('inspirations', 'notreDameLorette', language)}</span></a></li>
                            </ul>
                        </div>
                    )}

                    {activeTab === 'recherche' && (
                        <div className={styles.tabPanel}>
                            <h2 className={styles.panelTitle}>{getTranslation('recherche', 'headline', language)}</h2>
                            <div className={styles.searchWrapper}>
                                <input
                                    type="text"
                                    className={styles.searchInput}
                                    placeholder={getTranslation('recherche', 'placeholder', language)}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                />
                                <button className={styles.searchButton} onClick={handleSearch} disabled={isSearching}>
                                    {isSearching ? '...' : <FaSearch />}
                                </button>
                            </div>

                            <div className={styles.searchResults}>
                                {isSearching && <p className={styles.loadingMessage}>{getTranslation('recherche', 'loading', language)}</p>}

                                {!isSearching && searchResults.length > 0 && (
                                    <ul className={styles.resultsList}>
                                        {searchResults.map(result => (
                                            <li key={result.id} className={styles.resultItem}>
                                                <h3 className={styles.resultTitle}>{result.title}</h3>
                                                <p className={styles.resultSnippet}>{result.snippet}</p>
                                            </li>
                                        ))}
                                    </ul>
                                )}

                                {!isSearching && searchResults.length === 0 && hasSearched && (
                                     <p className={styles.noResultsMessage}>{getTranslation('recherche', 'noResults', language)} "{searchTerm}"</p>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StayTunedHubPage;