'use client';

import React, { useState, KeyboardEvent } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import styles from './page.module.css';
import {
  FaPaperclip,
  FaImage,
  FaKeyboard,
  FaMicrophone,
  FaUser,
  FaPlayCircle,
} from 'react-icons/fa';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

type LanguageCode = 'en' | 'fr' | 'mi';

const languageOrder: LanguageCode[] = ['en', 'fr', 'mi'];

const languageConfig: Record<LanguageCode, { label: string; flag: string }> = {
  en: { label: 'English', flag: '/flags/gb.png' },
  fr: { label: 'Français', flag: '/flags/fr.png' },
  mi: { label: 'Māori', flag: '/flags/maori.png' },
};

const translations = {
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
  welcomeHeadline: {
    en: 'Automate anything',
    fr: 'Automatisez tout',
    mi: 'Rangatira katoa',
  },
  watch: {
    en: 'Watch',
    fr: 'Regarder',
    mi: 'Mātakitaki',
  },
  intro: {
    en: 'Getting started with SkinLensR',
    fr: 'Bien démarrer avec SkinLensR',
    mi: 'Kei te timata ki SkinLensR',
  },
  inputBar: {
    en: 'Type here to give a task to SkinLensR',
    fr: 'Tapez ici une tâche à confier à SkinLensR',
    mi: 'Tāpaea tēnei ki SkinLensR',
  },
};

const LanguageSpinner = ({
  language,
  setLanguage,
}: {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
}) => {
  const ITEM_HEIGHT = 24;
  const currentIndex = languageOrder.indexOf(language);

  const handleClick = () => {
    const nextIndex = (currentIndex + 1) % languageOrder.length;
    setLanguage(languageOrder[nextIndex]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <div
      className={styles.languageSpinner}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label="Changer de langue"
    >
      <div
        className={styles.spinnerList}
        style={{ transform: `translateY(-${currentIndex * ITEM_HEIGHT}px)` }}
      >
        {languageOrder.map((code) => (
          <div className={styles.spinnerItem} key={code}>
            <Image
              src={languageConfig[code].flag}
              alt={languageConfig[code].label}
              width={24}
              height={16}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

const ChatInterface = ({
  language,
  setLanguage,
}: {
  language: LanguageCode;
  setLanguage: React.Dispatch<React.SetStateAction<LanguageCode>>;
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    const userMessage: Message = { role: 'user', content: inputValue };
    setMessages(prev => [...prev, userMessage]);
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
            className={`${styles.messageBubble} ${
              msg.role === 'user' ? styles.userMessage : styles.assistantMessage
            }`}
          >
            <div className={styles.avatar}>
              {msg.role === 'user' ? <FaUser /> : <div className={styles.robotAvatar}>H</div>}
            </div>
            <p className={styles.messageContent}>{msg.content}</p>
          </div>
        ))}
        {isLoading && (
          <div className={`${styles.messageBubble} ${styles.assistantMessage}`}>
            <div className={styles.avatar}>
              <div className={styles.robotAvatar}>H</div>
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
            <LanguageSpinner language={language} setLanguage={setLanguage} />
            <button className={styles.sendButton} onClick={handleSendMessage} disabled={isLoading}>
              ↑
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

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

export default function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [language, setLanguage] = useState<LanguageCode>('en');

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