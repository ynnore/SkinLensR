'use client';

import React, { useState, KeyboardEvent, useEffect } from 'react';
import Head from 'next/head';
// import Image from 'next/image'; // On a bien supprimé cet import
import styles from './page.module.css';
import KiwiIcon from '@/components/icons/KiwiIcon'; 

import {
  FaPaperclip,
  FaImage,
  FaKeyboard,
  FaMicrophone,
  FaUser,
  FaPlayCircle,
} from 'react-icons/fa';

// --- TYPES ET CONFIGURATIONS ---

export type LanguageCode = 'en' | 'fr' | 'mi';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const languageOptions = {
  en: { name: 'English', emblem: '🌹' },
  fr: { name: 'Français', emblem: '🐓' },
  mi: { name: 'Te Reo Māori', emblem: '🌿' },
};

const translations = {
  welcomeMessage: {
    en: "Hello! I'm SkinLensR. How can I help you today?",
    fr: "Bonjour ! Je suis SkinLensR. Comment puis-je vous aider ?",
    mi: "Kia ora! Ko SkinLensR ahau. Me pēhea taku āwhina i a koe i tēnei rā?",
  },
  thinking: {
    en: 'SkinLensR is thinking...',
    fr: 'SkinLensR réfléchit...',
    mi: 'Ke whakaaro a SkinLensR...',
  },
  placeholder: {
    en: 'Type your message...',
    fr: 'Tapez votre message...',
    mi: 'Tēnā koa, tāpiri tō karere...',
  },
  welcomeHeadline: { en: 'Automate anything', fr: 'Automatisez tout', mi: 'Rangatira katoa' },
  watch: { en: 'Watch', fr: 'Regarder', mi: 'Mātakitaki' },
  intro: { en: 'Getting started with SkinLensR', fr: 'Bien démarrer avec SkinLensR', mi: 'Kei te timata ki SkinLensR' },
  inputBar: { en: 'Type here to give a task to SkinLensR', fr: 'Tapez ici une tâche à confier à SkinLensR', mi: 'Tāpaea tēnei ki SkinLensR' },
};

// --- COMPOSANT SÉLECTEUR DE LANGUE ---

const LanguageSelector = ({
  language,
  setLanguage,
}: {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const handleSelect = (lang: LanguageCode) => {
    setLanguage(lang);
    setIsOpen(false);
  };
  return (
    <div className={styles.languageSelector}>
      <button className={styles.languageButton} onClick={() => setIsOpen(!isOpen)}>
        <span>{languageOptions[language].emblem}</span>
      </button>
      {isOpen && (
        <div className={styles.languageMenu}>
          {(Object.keys(languageOptions) as LanguageCode[]).map((langCode) => (
            <button key={langCode} className={styles.languageMenuItem} onClick={() => handleSelect(langCode)}>
              <span className={styles.emblem}>{languageOptions[langCode].emblem}</span>
              <span>{languageOptions[langCode].name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};


// --- COMPOSANT INTERFACE DE CHAT ---

const ChatInterface = ({
  language,
  setLanguage,
}: {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    setMessages([{
      role: 'assistant',
      content: translations.welcomeMessage[language],
    }]);
  }, [language]);

  const getAssistantAvatar = () => {
    return (
      <KiwiIcon className={styles.assistantAvatarIcon} />
    );
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    setMessages(prev => [...prev, { role: 'user', content: inputValue }]);
    setInputValue('');
    setIsLoading(true);
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: 'Here is a sample response from SkinLensR!' },
      ]);
      setIsLoading(false);
    }, 1000);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isLoading) handleSendMessage();
  };

  return (
    <div className={styles.chatContainer}>
      <header className={styles.pageHeader}>
        <div className={styles.headerLeft}>
          <span>Run</span>
          <h1>App Development on Jetson Orin Nano</h1>
        </div>
        <div className={styles.headerRight}>
          <button className={styles.moreButton}>...</button>
          <button className={styles.shareButton}>3D</button>
        </div>
      </header>
      <div className={styles.messagesArea}>
        {messages.map((msg, i) => (
          <div
            key={i}
            className={[ styles.messageBubble, msg.role === 'user' ? styles.userMessage : styles.assistantMessage ].join(' ')}
          >
            <div className={styles.avatar}>
              {/* ▼▼▼ C'EST CETTE LIGNE QUI EST CORRIGÉE ▼▼▼ */}
              {msg.role === 'user' ? <FaUser /> : getAssistantAvatar()}
            </div>
            <p className={styles.messageContent}>{msg.content}</p>
          </div>
        ))}
        {isLoading && (
          <div className={`${styles.messageBubble} ${styles.assistantMessage}`}>
            <div className={styles.avatar}>
              {getAssistantAvatar()}
            </div>
            <p className={styles.messageContent}>
              <i>{translations.thinking[language]}</i>
            </p>
          </div>
        )}
      </div>
      <footer className={styles.pageFooter}>
        <div className={styles.inputWrapper}>
          <button className={styles.iconButton}><FaPaperclip /></button>
          <input
            type="text"
            placeholder={translations.placeholder[language]}
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
          />
        </div>
        <div className={styles.footerActions}>
          <div className={styles.footerActionsLeft}>
            <button className={styles.iconButton}><FaImage /></button>
            <button className={styles.iconButton}><FaKeyboard /></button>
            <button className={styles.iconButton}><FaMicrophone /></button>
          </div>
          <div className={styles.footerActionsRight}>
            <LanguageSelector language={language} setLanguage={setLanguage} />
            <button
              className={styles.sendButton}
              onClick={handleSendMessage}
              disabled={isLoading}
            >
              ↑
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};


// --- COMPOSANT WELCOME ---
const WelcomeInterface = ({ language }: { language: LanguageCode }) => (
  <div className={styles.welcomeContainer}>
    <div className={styles.welcomeLogo}>
      <div className={styles.logoIcon}>H</div>
      <h1>{translations.welcomeHeadline[language]}</h1>
    </div>
    <div className={styles.welcomeCard}>
      <div className={styles.videoThumbnail}><FaPlayCircle /></div>
      <div className={styles.cardText}>
        <p><strong>{translations.watch[language]}</strong></p>
        <p>{translations.intro[language]}</p>
      </div>
      <button className={styles.closeCardButton}>×</button>
    </div>
    <div className={styles.inputBar}>{translations.inputBar[language]}</div>
  </div>
);


// --- COMPOSANT PRINCIPAL DE LA PAGE ---
export default function Page() {
  const [language, setLanguage] = useState<LanguageCode>('en');
  const [isLoggedIn] = useState(true);

  return (
    <>
      <Head>
        <title>SkinLensR</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main className={styles.mainPageContainer}>
        {isLoggedIn
          ? <ChatInterface language={language} setLanguage={setLanguage} />
          : <WelcomeInterface language={language} />}
      </main>
    </>
  );
}