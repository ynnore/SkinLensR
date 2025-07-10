// src/components/LanguageSelector.tsx
'use client';

import React, { useState, useCallback, useRef } from 'react';
import Image from 'next/image';
import { useOnClickOutside } from '@/hooks/useOnClickOutside';
import styles from './LanguageSelector.module.css';
import { LanguageCode } from '@/types';

const languageDisplayInfo: { [key in LanguageCode]: { shortName: string; flag: string } } = {
  en: { shortName: 'EN', flag: '🇬🇧' },
  fr: { shortName: 'FR', flag: '🇫🇷' },
  mi: { shortName: 'Mi', flag: '/flags/maori.png' },
  ga: { shortName: 'GA', flag: '🇮🇪' },
  hi: { shortName: 'HI', flag: '🇮🇳' },
  gd: { shortName: 'GD', flag: '/flags/scotland.png' }, // CONFIRME : Utilise une image pour le drapeau Écossais
  'en-AU': { shortName: 'AU', flag: '🇦🇺' },
  'en-NZ': { shortName: 'NZ', flag: '🇳🇿' },
  'en-CA': { shortName: 'CAe', flag: '🇨🇦' },
  'fr-CA': { shortName: 'CAf', flag: '🇨🇦' },
  'en-ZA': { shortName: 'ZA', flag: '🇿🇦' },
  af: { shortName: 'AF', flag: '🇿🇦' },
};

interface LanguageSelectorProps {
  currentLanguage: LanguageCode;
  onSelectLanguage: (code: LanguageCode) => void;
  isSidebarOpen: boolean;
}

export default function LanguageSelector({ currentLanguage, onSelectLanguage, isSidebarOpen }: LanguageSelectorProps) {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(dropdownRef, () => setDropdownOpen(false));

  const handleButtonClick = useCallback(() => {
    setDropdownOpen(prev => !prev);
  }, []);

  const handleOptionClick = useCallback((code: LanguageCode) => {
    onSelectLanguage(code);
    setDropdownOpen(false);
  }, [onSelectLanguage]);

  const currentLangInfo = languageDisplayInfo[currentLanguage];

  return (
    <div className={`${styles.languageSelectorContainer} ${!isSidebarOpen ? styles.closedSidebarMode : ''}`} ref={dropdownRef}>
      <button onClick={handleButtonClick} className={styles.currentLanguageButton} aria-haspopup="true" aria-expanded={isDropdownOpen}>
        {currentLangInfo && (
          <>
            {currentLangInfo.flag.startsWith('/') ? (
              <Image
                src={currentLangInfo.flag}
                alt={`${currentLangInfo.shortName} Flag`}
                className={styles.flagImage}
                width={28}
                height={24}
              />
            ) : (
              <span className={styles.flagEmoji}>{currentLangInfo.flag}</span>
            )}
            {isSidebarOpen && <span className={styles.languageShortName}>{currentLangInfo.shortName}</span>}
            {/* CORRECTION : Flèche par défaut vers le bas (▼) quand le dropdown est fermé */}
            {isSidebarOpen && <span className={styles.dropdownArrow}>{isDropdownOpen ? '▲' : '▼'}</span>}
          </>
        )}
      </button>

      {isDropdownOpen && (
        <div className={styles.languageOptionsDropdown}>
          {Object.entries(languageDisplayInfo).map(([code, info]) => (
            <button
              key={code}
              onClick={() => handleOptionClick(code as LanguageCode)}
              className={`${styles.languageOption} ${code === currentLanguage ? styles.activeLanguageOption : ''}`}
            >
              {info.flag.startsWith('/') ? (
                <Image
                  src={info.flag}
                  alt={`${info.shortName} Flag`}
                  className={styles.flagImage}
                  width={20}
                  height={15}
                />
              ) : (
                <span className={styles.flagEmoji}>{info.flag}</span>
              )}
              <span className={styles.languageShortName}>{info.shortName}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}