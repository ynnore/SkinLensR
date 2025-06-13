"use client";

// On importe les types nécessaires depuis React
import React, { useState, KeyboardEvent } from 'react';
import styles from './page.module.css';
import { FaPaperclip, FaImage, FaKeyboard, FaMicrophone, FaUser, FaRobot, FaPlayCircle } from 'react-icons/fa';

// --- Définition des types pour plus de clarté et de sécurité ---
interface Message {
  role: 'user' | 'assistant';
  content: string;
}

// ==================================================================
// --- Sous-composant pour l'interface de CHAT ---
// ==================================================================
const ChatInterface = () => {
  // --- Gestion des états ---
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // --- La fonction qui appelle votre API backend ---
  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: inputValue };
    
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const API_BASE_URL = 'https://skinlens-new.ew.r.appspot.com';
      const API_ENDPOINT = `${API_BASE_URL}/agent`;

      const response = await fetch(API_ENDPOINT, {
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

      setMessages(prevMessages => [...prevMessages, assistantMessage]);

    } catch (error) {
      const errorMessageText = error instanceof Error ? error.message : 'Une erreur inconnue est survenue.';
      console.error("Erreur lors de l'envoi du message:", errorMessageText);
      
      const errorMessage: Message = { role: 'assistant', content: `Désolé, une erreur est survenue. Veuillez réessayer.` };
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // --- Gestion de la touche "Entrée" ---
  const handleKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && !isLoading) {
      handleSendMessage();
    }
  };

  return (
    <div className={styles.chatContainer}>
      <header className={styles.pageHeader}>
        <div className={styles.headerLeft}>
          <span>Run</span>
          <h1>App Development on Nano Jetson Orin</h1>
        </div>
        <div className={styles.headerRight}>
          <button className={styles.moreButton}>...</button>
          <button className={styles.shareButton}>3d</button>
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
            <div className={styles.avatar}>
              <div className={styles.robotAvatar}>H</div>
            </div>
            <p className={styles.messageContent}><i>...</i></p>
          </div>
        )}
      </div>
      <footer className={styles.pageFooter}>
        <div className={styles.inputWrapper}>
          <button className={styles.iconButton}><FaPaperclip /></button>
          <input 
            type="text" 
            placeholder="Type your message..." 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
          />
        </div>
        <div className={styles.footerActions}>
          <button className={styles.iconButton}><FaImage /></button>
          <button className={styles.iconButton}><FaKeyboard /></button>
          <button className={styles.iconButton}><FaMicrophone /></button>
          <div className={styles.moderateDropdown}><span>Moderate</span><span>▼</span></div>
          <button className={styles.sendButton} onClick={handleSendMessage} disabled={isLoading}>↑</button>
        </div>
      </footer>
    </div>
  );
};


// =======================================================
// --- Sous-composant pour l'interface de BIENVENUE ---
// =======================================================
const WelcomeInterface = () => (
  <div className={styles.welcomeContainer}>
    <div className={styles.welcomeLogo}>
      <div className={styles.logoIcon}>H</div>
      <h1>Automate anything</h1>
    </div>
    <div className={styles.welcomeCard}>
      <div className={styles.videoThumbnail}><FaPlayCircle /></div>
      <div className={styles.cardText}>
        <p><strong>Watch</strong></p>
        <p>Getting started with SkinlensR</p>
      </div>
      <button className={styles.closeCardButton}>×</button>
    </div>
    <div className={styles.inputBar}>
      Type here to give a task to SkinLensR
    </div>
  </div>
);


// ===================================================================
// --- Composant Principal de la Page (LA PARTIE LA PLUS IMPORTANTE) ---
// ===================================================================
export default function HomePage() {
  // Vous pouvez changer cette valeur à `false` pour voir l'écran de bienvenue par défaut
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  return (
    <main className={styles.mainPageContainer}>
      {isLoggedIn ? <ChatInterface /> : <WelcomeInterface />}
    </main>
  );
}