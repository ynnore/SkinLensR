// Fichier : src/app/page.tsx
'use client';

import React, { useState, KeyboardEvent, useEffect } from 'react';
import Head from 'next/head';
import styles from './page.module.css'; 
import { FaPaperclip, FaImage, FaKeyboard, FaMicrophone, FaUser, FaPlayCircle } from 'react-icons/fa';

import { useLanguage } from '@/contexts/LanguageContext'; 

const translations = {
  welcomeMessage: {
    en: "Hello! I'm SkinLensR. How can I help you today?",
    fr: "Bonjour ! Je suis SkinLensR. Comment puis-je vous aider ?",
    mi: "Kia ora! Ko SkinLensR ahau. Me pēhea taku āwhina i a koe i tēnei rā?",
    ga: "Dia duit! Is mise SkinLensR. Conas is féidir liom cabhrú leat inniu?", 
    hi: "नमस्ते! मैं स्किनलेंसआर हूँ। आज मैं आपकी कैसे मदद कर सकता हूँ?",       
    gd: "Halo! 'S mise SkinLensR. Ciamar as urrainn dhomh do chuideachadh an-diugh?", 
    'en-AU': "G'day! I'm SkinLensR. How can I help ya today?",                   
    'en-NZ': "Kia ora! I'm SkinLensR. How can I help you today?",                 
    'en-CA': "Hey there! I'm SkinLensR. How can I help you today, eh?",           
    'fr-CA': "Bonjour ! Je suis SkinLensR. Comment puis-je vous aider aujourd'hui ?", 
    'en-ZA': "Howzit! I'm SkinLensR. How can I help you today?",                 
    af: "Goeiedag! Ek is SkinLensR. Hoe kan ek jou vandag help?",                
  },
  thinking: {
    en: 'SkinLensR is thinking...',
    fr: 'SkinLensR réfléchit...',
    mi: 'Ke whakaaro a SkinLensR...',
    ga: 'Tá SkinLensR ag smaoineamh...',
    hi: 'स्किनलेंसआर सोच रहा है...',
    gd: 'Tha SkinLensR a\' smaoineachadh...',
    'en-AU': 'SkinLensR\'s thinkin\'...',
    'en-NZ': 'SkinLensR\'s thinking...',
    'en-CA': 'SkinLensR is thinking...',
    'fr-CA': 'SkinLensR réfléchit...',
    'en-ZA': 'SkinLensR is thinking...',
    af: 'SkinLensR dink...',
  },
  placeholder: {
    en: 'Type your message...',
    fr: 'Tapez votre message...',
    mi: 'Tēnā koa, tāpiri tō karere...',
    ga: 'Clóscríobh do theachtaireacht...',
    hi: 'अपना संदेश टाइप करें...',
    gd: 'Cuir a-steach do theachdaireachd...',
    'en-AU': 'Chuck your message in here...',
    'en-NZ': 'Type your message here...',
    'en-CA': 'Type your message...',
    'fr-CA': 'Écrivez votre message...',
    'en-ZA': 'Type your message...',
    af: 'Tik jou boodskap...',
  },
  welcomeHeadline: {
    en: 'Automate anything', fr: 'Automatisez tout', mi: 'Rangatira katoa',
    ga: 'Uathoibrigh rud ar bith', hi: 'कुछ भी स्वचालित करें', gd: 'Uatamaich rud sam bith',
    'en-AU': 'Automate anything, mate', 'en-NZ': 'Automate anything', 'en-CA': 'Automate anything',
    'fr-CA': 'Automatisez tout', 'en-ZA': 'Automate anything', af: 'Outomatiseer enigiets',
  },
  watch: {
    en: 'Watch', fr: 'Regarder', mi: 'Mātakitaki',
    ga: 'Féach', hi: 'देखो', gd: 'Coimhead',
    'en-AU': 'Watch', 'en-NZ': 'Watch', 'en-CA': 'Watch', 'fr-CA': 'Regarder',
    'en-ZA': 'Watch', af: 'Kyk',
  },
  intro: {
    en: 'Getting started with SkinLensR', fr: 'Bien démarrer avec SkinLensR', mi: 'Kei te timata ki SkinLensR',
    ga: 'Ag tosú le SkinLensR', hi: 'स्किनलेंसआर के साथ शुरुआत करना', gd: 'A\' tòiseachadh le SkinLensR',
    'en-AU': 'Getting started with SkinLensR', 'en-NZ': 'Getting started with SkinLensR', 'en-CA': 'Getting started with SkinLensR',
    'fr-CA': 'Bien démarrer avec SkinLensR', 'en-ZA': 'Getting started with SkinLensR', af: 'Begin met SkinLensR',
  },
  inputBar: {
    en: 'Type here to give a task to SkinLensR', fr: 'Tapez ici une tâche à confier à SkinLensR', mi: 'Tāpaea tēnei ki SkinLensR',
    ga: 'Clóscríobh anseo chun tasc a thabhairt do SkinLensR', hi: 'यहां स्किनलेंसआर को एक कार्य देने के लिए टाइप करें', gd: 'Sgrìobh an seo gus gnìomh a thoirt do SkinLensR',
    'en-AU': 'Type here to give a task to SkinLensR', 'en-NZ': 'Type here to give a task to SkinLensR', 'en-CA': 'Type here to give a task to SkinLensR',
    'fr-CA': 'Tapez ici une tâche à confier à SkinLensR', 'en-ZA': 'Type here to give a task to SkinLensR', af: 'Tik hier om SkinLensR \'n taak te gee',
  },
};

const ChatInterface = () => {
  const { language } = useLanguage(); 
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    setMessages([{ role: 'assistant', content: translations.welcomeMessage[language] || translations.welcomeMessage.en }]);
  }, [language]);

  const getAssistantAvatar = () => {
    const emblemMap: { [key: string]: string } = {
        en: '🇬🇧', fr: '🇫🇷', mi: '🇳🇿', ga: '🇮🇪', hi: '🇮🇳', gd: '🏴󠁧󠁢󠁳󠁣󠁴󠁿',
        'en-AU': '🇦🇺', 'en-NZ': '🇳🇿', 'en-CA': '🇨🇦', 'fr-CA': '🇨🇦',
        'en-ZA': '🇿🇦', af: '🇿🇦'
    };
    const emblem = emblemMap[language] || '🤖'; 
    return <div className={styles.robotAvatar}>{emblem}</div>;
  };

  const handleSendMessage = () => { /* ... */ };
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => { /* ... */ };

  const messageAreaClassName = (msgRole: string) => [styles.messageBubble, msgRole === 'user' ? styles.userMessage : styles.assistantMessage].join(' ');

  return (
    <div className={styles.chatContainer}>
      <header className={styles.pageHeader}>
        <div className={styles.headerLeft}>
          <span></span>
          <h1></h1>
        </div>
        <div className={styles.headerRight}>
          <button className={styles.moreButton}>...</button>
          <button className={styles.shareButton}>3D</button>
        </div>
      </header>
      <div className={styles.messagesArea}>
        {messages.map((msg, i) => (
          <div key={i} className={messageAreaClassName(msg.role)}>
            <div className={styles.avatar}>
              {msg.role === 'user' ? <FaUser /> : getAssistantAvatar()}
            </div>
            <p className={styles.messageContent}>{msg.content}</p>
          </div>
        ))}
        {isLoading && (
          <div className={messageAreaClassName('assistant')}>
            <div className={styles.avatar}>
              {getAssistantAvatar()}
            </div>
            <p className={styles.messageContent}>
              <i>{translations.thinking[language] || translations.thinking.en}</i>
            </p>
          </div>
        )}
      </div>
      <footer className={styles.pageFooter}>
        <div className={styles.inputWrapper}>
          <button className={styles.iconButton}><FaPaperclip /></button>
          <input
            type="text"
            placeholder={translations.placeholder[language] || translations.placeholder.en}
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
            <button className={styles.sendButton} onClick={handleSendMessage} disabled={isLoading}>
              ↑
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

interface Message {
  role: string;
  content: string;
}

const WelcomeInterface = () => {
  const { language } = useLanguage(); 
  return (
    <div className={styles.welcomeContainer}>
      <div className={styles.welcomeLogo}>
        <div className={styles.logoIcon}>H</div>
        <h1>{translations.welcomeHeadline[language] || translations.welcomeHeadline.en}</h1>
      </div>
      <div className={styles.welcomeCard}>
        <div className={styles.videoThumbnail}><FaPlayCircle /></div>
        <div className={styles.cardText}>
          <p><strong>{translations.watch[language] || translations.watch.en}</strong></p>
          <p>{translations.intro[language] || translations.intro.en}</p>
        </div>
        <button className={styles.closeCardButton}>×</button>
      </div>
      <div className={styles.inputBar}>{translations.inputBar[language] || translations.inputBar.en}</div>
    </div>
  );
};

export default function Page() {
  const isLoggedIn = true; 

  return (
    <>
      <Head>
        <title>SkinLensR - Chat</title>
      </Head>
      <div className={styles.mainPageContentWrapper}> 
        {isLoggedIn ? <ChatInterface /> : <WelcomeInterface />}
      </div>
    </>
  );
}
