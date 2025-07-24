// Fichier: src/app/stay-tuned-hub/page.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { LanguageCode } from '@/types';
import styles from './stay-tuned-hub.module.css';

// Icônes des réseaux sociaux et autres inspirations (importées de react-icons/fa)
import { 
    FaTwitter, FaDiscord, FaYoutube, FaLinkedin, FaGithub, FaInstagram, FaTiktok, 
    FaMapMarkerAlt, FaGlobe, FaTrophy, FaAward 
} from 'react-icons/fa';

// SVG minimaliste pour X
const XIcon = ({ size = 18 }: { size?: number }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
        <path d="M18 2h3l-7.5 9 7.5 11h-3l-6-9-6 9H3l7.5-11L3 2h3l6 8z"/>
    </svg>
);

// ✅ OBJET ALLTRANSLATIONS COMPLET ET VÉRIFIÉ AVEC TOUTES LES LANGUES
const allTranslations = {
    stayTuned: {
        headline: {
            en: 'Stay Tuned: Operation W Intel Hub',
            fr: 'Restez Connecté : Centre d\'Intel Opération W',
            mi: 'Kia Mau Ki a Mātou: Te Wāhi Whakawhiti Kōrero o Operation W',
            ga: 'Fan Tiúnta: Mol Intleachtúil Oibríocht W',
            hi: 'जुड़े रहें: ऑपरेशन W इंटेल हब',
            gd: 'Fuirich Tiùnaidh: Mol Fiosrachaidh Obrachadh W',
            cy: 'Arhoswch yn Tiwn: Hwb Gwybodaeth Ymgyrch W',
            'en-AU': 'Stay Tuned: Operation W Intel Hub',
            'en-NZ': 'Stay Tuned: Operation W Intel Hub',
            'en-CA': 'Stay Tuned: Operation W Intel Hub',
            'fr-CA': 'Restez Connecté : Centre d\'Intel Opération W',
            'en-ZA': 'Bly Ingeskakel: Operasie W Intel Hub',
            af: 'Bly Ingeskakel: Operasie W Intel Hub',
        },
        intro: {
            en: 'Your direct line to classified intel, social updates, and our core inspirations and achievements.',
            fr: 'Votre ligne directe pour l\'intel classifié, les mises à jour sociales, et nos inspirations et réussites fondamentales.',
            mi: 'Tō raina tika ki ngā kōrero muna, ngā whakahōutanga pāpori, me ō mātou awe me ngā whakatutukitanga matua.',
            ga: 'Do líne dhíreach chuig intleacht aicmithe, nuashonruithe sóisialta, agus ár bpríomh-inspioráidí agus éachtaí.',
            hi: 'वर्गीकृत जानकारी, सामाजिक अपडेट और हमारी मुख्य प्रेरणाओं और उपलब्धियों के लिए आपकी सीधी पंक्ति।',
            gd: 'Do loidhne dhìreach gu fiosrachadh clàraichte, ùrachaidhean sòisealta, agus ar prìomh bhrosnachadh is euchdan.',
            cy: 'Eich llinell uniongyrchol i wybodaeth ddosbarthedig, diweddariadau cymdeithasol, a’n hysbrydoliaethau a chyflawniadau craidd.',
            'en-AU': 'Your direct line to classified intel, social updates, and our core inspirations and achievements.',
            'en-NZ': 'Your direct line to classified intel, social updates, and our core inspirations and achievements.',
            'en-CA': 'Your direct line to classified intel, social updates, and our core inspirations and achievements.',
            'fr-CA': 'Votre ligne directe pour l\'intel classifié, les mises à jour sociales, et nos inspirations et réussites fondamentales.',
            'en-ZA': 'U direkte lyn na geklassifiseerde intel, sosiale opdaterings, en ons kerninspirasies en prestasies.',
            af: 'U direkte lyn na geklassifiseerde intel, sosiale opdaterings, en ons kerninspirasies en prestasies.',
        },
        socialsTab: {
            en: 'Social Intel', fr: 'Intel Social',
            mi: 'Intel Pāpori', ga: 'Intleacht Shóisialta', hi: 'सामाजिक जानकारी', gd: 'Fiosrachadh Sòisealta', cy: 'Gwybodaeth Gymdeithasol',
            'en-AU': 'Social Intel', 'en-NZ': 'Social Intel', 'en-CA': 'Social Intel', 'fr-CA': 'Intel Social', 'en-ZA': 'Sosiale Intel', af: 'Sosiale Intel',
        },
        inspirationsTab: {
            en: 'Our Inspirations', fr: 'Nos Inspirations',
            mi: 'Ō Mātou Awe', ga: 'Ár n-Inspioráidí', hi: 'हमारी प्रेरणाएँ', gd: 'Ar Brosnachaidhean', cy: 'Ein Hysbrydoliaethau',
            'en-AU': 'Our Inspirations', 'en-NZ': 'Our Inspirations', 'en-CA': 'Our Inspirations', 'fr-CA': 'Nos Inspirations', 'en-ZA': 'Ons Inspirasies', af: 'Ons Inspirasies',
        },
        achievementsTab: {
            en: 'Our Achievements', fr: 'Nos Réussites',
            mi: 'Ō Mātou Whakatutukitanga', ga: 'Ár n-Éachtaí', hi: 'हमारी उपलब्धियाँ', gd: 'Ar n-Euchdan', cy: 'Ein Cyflawniadau',
            'en-AU': 'Our Achievements', 'en-NZ': 'Our Achievements', 'en-CA': 'Our Achievements', 'fr-CA': 'Nos Réussites', 'en-ZA': 'Ons Prestasies', af: 'Ons Prestasies',
        },
    },
    inspirations: {
        wellingtonTunnelers: {
            en: 'Wellington Tunnelers (Arras)',
            fr: 'Tunneliers de Wellington (Arras)',
            mi: 'Ngā Kaikeri o Te Whanganui-a-Tara (Arras)',
            ga: 'Tolladóirí Wellington (Arras)',
            hi: 'वेलिंगटन टनलर्स (आरास)',
            gd: 'Tunnelairean Wellington (Arras)',
            cy: 'Twnelwyr Wellington (Arras)',
            'en-AU': 'Wellington Tunnelers (Arras)', 'en-NZ': 'Wellington Tunnelers (Arras)', 'en-CA': 'Wellington Tunnelers (Arras)', 'fr-CA': 'Tunneliers de Wellington (Arras)', 'en-ZA': 'Wellington Tunneliers (Arras)', af: 'Wellington Tunneliers (Arras)',
        },
        notreDameLorette: {
            en: 'Notre-Dame-de-Lorette (French National Necropolis)',
            fr: 'Nécropole Nationale de Notre-Dame-de-Lorette',
            mi: 'Notre-Dame-de-Lorette (Nekoropoli Motu o Wīwī)',
            ga: 'Notre-Dame-de-Lorette (Nécropole Náisiúnta na Fraince)',
            hi: 'नोत्रे-डेम-डे-लोरेट (फ्रांसीसी राष्ट्रीय नेक्रोपोलिस)',
            gd: 'Notre-Dame-de-Lorette (Neacròpolis Nàiseanta Frangach)',
            cy: 'Notre-Dame-de-Lorette (Necropolis Cenedlaethol Ffrainc)',
            'en-AU': 'Notre-Dame-de-Lorette (French National Necropolis)', 'en-NZ': 'Notre-Dame-de-Lorette (French National Necropolis)', 'en-CA': 'Notre-Dame-de-Lorette (French National Necropolis)', 'fr-CA': 'Nécropole Nationale de Notre-Dame-de-Lorette', 'en-ZA': 'Notre-Dame-de-Lorette (Franse Nasionale Nekropolis)', af: 'Notre-Dame-de-Lorette (Franse Nasionale Nekropolis)',
        },
        wellingtonUrl: 'https://en.wikipedia.org/wiki/Wellington_Tunnel',
        loretteUrl: 'https://en.wikipedia.org/wiki/Notre-Dame-de-Lorette_French_National_Cemetery',
    },
    achievements: {
        headline: {
            en: 'Key Operational Achievements',
            fr: 'Réussites Opérationnelles Clés',
            mi: 'Ngā Whakatutukitanga Nui o te Mahinga',
            ga: 'Príomhghnóthachain Oibríochtúla',
            hi: 'प्रमुख परिचालन उपलब्धियाँ',
            gd: 'Prìomh Euchdan Obrachaidh',
            cy: 'Cyflawniadau Gweithredol Allweddol',
            'en-AU': 'Key Operational Achievements', 'en-NZ': 'Key Operational Achievements', 'en-CA': 'Key Operational Achievements', 'fr-CA': 'Réussites Opérationnelles Clés', 'en-ZA': 'Sleutel Bedryfsprestasies', af: 'Sleutel Bedryfsprestasies',
        },
        launch: {
            en: 'Successful Beta Launch (2024)',
            fr: 'Lancement Bêta Réussi (2024)',
            mi: 'Te Whakarewanga Beta Angitu (2024)',
            ga: 'Seoladh Alfa Rathúil (2024)',
            hi: 'सफल बीटा लॉन्च (2024)',
            gd: 'Cur air Bhog Beta soirbheachail (2024)',
            cy: 'Lansio Beta Llwyddiannus (2024)',
            'en-AU': 'Successful Beta Launch (2024)', 'en-NZ': 'Successful Beta Launch (2024)', 'en-CA': 'Successful Beta Launch (2024)', 'fr-CA': 'Lancement Bêta Réussi (2024)', 'en-ZA': 'Suksesvolle Beta-bekendstelling (2024)', af: 'Suksesvolle Beta-bekendstelling (2024)',
        },
        milestone1: {
            en: 'Achieved 1000 Agents (Internal Test)',
            fr: 'Atteinte de 1000 Agents (Test Interne)',
            mi: '1000 Apiha Kua Tutuki (Whakamātautau ā-roto)',
            ga: '1000 Gníomhaire Bainisteach (Tástáil Inmheánach)',
            hi: '1000 एजेंट प्राप्त हुए (आंतरिक परीक्षण)',
            gd: '1000 Àidseant air an Ruighinn (Deuchainn a-staigh)',
            cy: 'Cyflawni 1000 Asiant (Prawf Mewnol)',
            'en-AU': 'Achieved 1000 Agents (Internal Test)', 'en-NZ': 'Achieved 1000 Agents (Internal Test)', 'en-CA': 'Achieved 1000 Agents (Internal Test)', 'fr-CA': 'Atteinte de 1000 Agents (Test Interne)', 'en-ZA': '1000 Agente behaal (Interne toets)', af: '1000 Agente behaal (Interne toets)',
        },
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

    const [activeTab, setActiveTab] = useState<'socials' | 'inspirations' | 'achievements'>('socials');

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

                {/* Barre d'onglets */}
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
                        className={`${styles.tabButton} ${activeTab === 'achievements' ? styles.activeTab : ''}`}
                        onClick={() => setActiveTab('achievements')}
                    >
                        {getTranslation('stayTuned', 'achievementsTab', language)}
                    </button>
                </div>

                {/* Contenu des onglets */}
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

                    {activeTab === 'achievements' && (
                        <div className={styles.tabPanel}>
                            <h2 className={styles.panelTitle}>{getTranslation('achievements', 'headline', language)}</h2>
                            <ul className={styles.achievementsList}>
                                <li><FaTrophy /><span>{getTranslation('achievements', 'launch', language)}</span></li>
                                <li><FaAward /><span>{getTranslation('achievements', 'milestone1', language)}</span></li>
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StayTunedHubPage;