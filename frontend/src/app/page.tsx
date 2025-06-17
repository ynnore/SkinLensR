"use client";

import React, { useState, KeyboardEvent } from 'react';
import Head from 'next/head';
import styles from './page.module.css';
import { FaPaperclip, FaImage, FaKeyboard, FaMicrophone, FaUser, FaPlayCircle } from 'react-icons/fa';

// --- Définition des types ---
interface Message {
  role: 'user' | 'assistant';
  content: string;
}

// === Composant de CHAT ===
const ChatInterface = ({ language }: { language: 'en' | 'fr' }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: inputValue };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('https://skinlens-new.ew.r.appspot.com/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userMessage.content }),
      });

      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({ error: 'Réponse invalide du serveur' }));
        throw new Error(errorBody.error || `Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      const assistantMessage: Message = { role: 'assistant', content: data.response };
      setMessages(prev => [...prev, assistantMessage]);

    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Une erreur inconnue est survenue.';
      console.error(msg);
      const errorMessage: Message = { role: 'assistant', content: language === 'fr' ? "Désolé, une erreur est survenue." : "Sorry, an error occurred." };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && !isLoading) handleSendMessage();
  };

  return (
    <div className={styles.chatContainer}>
      <header className={styles.pageHeader}>
        <div className={styles.headerLeft}>
          <span>Run</span>
          <h1>App Development on Jetson Orin Nano</h1>
        </div>
        <div className={styles.headerRight}>
          <button className={styles.moreButton} aria-label="More options">...</button>
          <button className={styles.shareButton} aria-label="3D mode">3D</button>
        </div>
      </header>

      <div className={styles.messagesArea}>
        {messages.map((msg, index) => (
          <div key={index} className={`${styles.messageBubble} ${msg.role === 'user' ? styles.userMessage : styles.assistantMessage}`}>
            <div className={styles.avatar}>
              {msg.role === 'user' ? <FaUser /> : <div className={styles.robotAvatar}>H</div>}
            </div>
            <p className={styles.messageContent}>{msg.content}</p>
          </div>
        ))}
        {isLoading && (
          <div className={`${styles.messageBubble} ${styles.assistantMessage}`}>
            <div className={styles.avatar}><div className={styles.robotAvatar}>H</div></div>
            <p className={styles.messageContent}>
              <i>{language === 'fr' ? "SkinLensR réfléchit..." : "SkinLensR is thinking..."}</i>
            </p>
          </div>
        )}
      </div>

      <footer className={styles.pageFooter}>
        <div className={styles.inputWrapper}>
          <button className={styles.iconButton} aria-label="Attach file"><FaPaperclip /></button>
          <input
            type="text"
            placeholder={language === 'fr' ? "Tapez votre message..." : "Type your message..."}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
          />
        </div>
        <div className={styles.footerActions}>
          <button className={styles.iconButton} aria-label="Image upload"><FaImage /></button>
          <button className={styles.iconButton} aria-label="Keyboard"><FaKeyboard /></button>
          <button className={styles.iconButton} aria-label="Microphone"><FaMicrophone /></button>
          <div className={styles.moderateDropdown}><span>Moderate</span><span>▼</span></div>
          <button className={styles.sendButton} onClick={handleSendMessage} disabled={isLoading} aria-label="Send">↑</button>
        </div>
      </footer>
    </div>
  );
};

// === Interface de bienvenue ===
const WelcomeInterface = ({ language }: { language: 'en' | 'fr' }) => (
  <div className={styles.welcomeContainer}>
    <div className={styles.welcomeLogo}>
      <div className={styles.logoIcon}>H</div>
      <h1>{language === 'fr' ? "Automatisez tout" : "Automate anything"}</h1>
    </div>
    <div className={styles.welcomeCard}>
      <div className={styles.videoThumbnail}><FaPlayCircle /></div>
      <div className={styles.cardText}>
        <p><strong>{language === 'fr' ? "Regarder" : "Watch"}</strong></p>
        <p>{language === 'fr' ? "Bien démarrer avec SkinLensR" : "Getting started with SkinLensR"}</p>
      </div>
      <button className={styles.closeCardButton} aria-label="Close">×</button>
    </div>
    <div className={styles.inputBar}>
      {language === 'fr' ? "Tapez ici une tâche à confier à SkinLensR" : "Type here to give a task to SkinLensR"}
    </div>
  </div>
);

// === Composant Principal ===
export default function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [language, setLanguage] = useState<'en' | 'fr'>('en');

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>SkinLensR</title>
      </Head>
      <main className={styles.mainPageContainer}>
        <div className={styles.langSwitcher}>
          <button onClick={() => setLanguage('en')} disabled={language === 'en'}>EN</button>
          <button onClick={() => setLanguage('fr')} disabled={language === 'fr'}>FR</button>
        </div>
        {isLoggedIn ? <ChatInterface language={language} /> : <WelcomeInterface language={language} />}
      </main>
    </>
  );
}
