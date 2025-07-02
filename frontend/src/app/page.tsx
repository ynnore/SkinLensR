// Fichier : src/app/page.tsx
'use client';

import React, { useState, KeyboardEvent, useEffect } from 'react';
import Head from 'next/head';
import styles from './page.module.css'; 
import { FaPaperclip, FaImage, FaKeyboard, FaMicrophone, FaUser, FaPlayCircle } from 'react-icons/fa';

import { useLanguage } from '@/contexts/LanguageContext'; 

// Structure de l'interface Message (peut être déplacée dans un fichier types.ts si vous en avez un)
interface Message {
  role: string;
  content: string;
}

const translations = {
  header: {
    missionStatement: {
      fr: "Inspirés des tunneliers de Wellington à Arras, notre mission est de bâtir dans l’ombre ce qui, demain, percera la surface.",
      en: "Inspired by the Wellington Tunnelers of Arras, our mission is to build in the shadows what will, tomorrow, break through to the surface.",
      mi: "He mea whakahihiri mai i ngā kaikeri o raro o Te Whanganui-a-Tara ki Arras, ko tā mātou kaupapa he hanga i roto i te atarangi i ngā mea ka puta ki te mata āpōpopo.",
      ga: "Ar an taobh istigh de tholláin Wellington in Arras, is é ár misean tógáil sa scáth a bhrisfidh an dromchla amárach.",
      hi: "एरास में वेलिंगटन टनलर्स से प्रेरित होकर, हमारा मिशन छाया में वह निर्माण करना है जो कल सतह को भेद देगा।",
      gd: "Air a bhrosnachadh le Tunnelairean Wellington ann an Arras, is e ar misean togail anns an dubhar na nì, a-màireach, briseadh tro uachdar.",
      'en-AU': "Inspired by the Wellington Tunnelers of Arras, our mission is to build in the shadows what will, tomorrow, break through to the surface.", // Ou une version Aussie si vous en avez une spécifique
      'en-NZ': "Inspired by the Wellington Tunnelers of Arras, our mission is to build in the shadows what will, tomorrow, break through to the surface.", // Idem pour NZ
      'en-CA': "Inspired by the Wellington Tunnelers of Arras, our mission is to build in the shadows what will, tomorrow, break through to the surface.", // Idem pour CA
      'fr-CA': "Inspirés des tunneliers de Wellington à Arras, notre mission est de bâtir dans l’ombre ce qui, demain, percera la surface.", // Idem pour FR-CA
      'en-ZA': "Inspired by the Wellington Tunnelers of Arras, our mission is to build in the shadows what will, tomorrow, break through to the surface.", // Idem pour ZA
      af: "Geïnspireer deur die Wellington Tunneliers van Arras, is ons missie om in die skaduwee te bou wat môre sal deurbreek na die oppervlak.",
    },
    beta: {
      en: "Beta", fr: "Bêta", mi: "Beta", ga: "Béite", hi: "बीटा", gd: "Beta",
      'en-AU': "Beta", 'en-NZ': "Beta", 'en-CA': "Beta", 'fr-CA': "Bêta", 'en-ZA': "Beta", af: "Beta",
    }
  },
  chat: {
    welcomeMessage: {
      en: "Hello! I'm SkinLensR. How can I help you today?",
      fr: "Bonjour ! Je suis SkinLensR. Comment puis-je vous aider aujourd'hui ?",
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
    }
  },
  welcome: { // Nouvel objet pour les éléments de l'interface de bienvenue
    headline: {
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
  },
  sidebar: { // Ajout de la section sidebar
    scan: { en: "Scan", fr: "Scanner", af: "Skandeer" },
    dashboard: { en: "Dashboard", fr: "Tableau de bord", af: "Paneelbord" },
    files: { en: "Files", fr: "Fichiers", af: "Lêers" },
    connections: { en: "Connections", fr: "Connexions", af: "Verbindings" },
    pay: { en: "Pay", fr: "Payer", af: "Betaal" },
    settings: { en: "Settings", fr: "Paramètres", af: "Instellings" },
    terms: { en: "Terms", fr: "Conditions", af: "Bepalings" },
    privacy_policy: { en: "Privacy Policy", fr: "Politique de confidentialité", af: "Privaatheidsbeleid" }
  }
};

const ChatInterface = () => {
  const { language } = useLanguage(); 
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    // Utiliser la nouvelle structure pour le message de bienvenue
    setMessages([{ role: 'assistant', content: translations.chat.welcomeMessage[language] || translations.chat.welcomeMessage.en }]);
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
          {/* Utiliser la clé de traduction pour la phrase d'inspiration */}
          <span>{translations.header.missionStatement[language] || translations.header.missionStatement.en}</span>
          <h1></h1>
        </div>
        <div className={styles.headerRight}>
          {/* Utiliser la clé de traduction pour Beta */}
          
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
              {/* Utiliser la nouvelle structure pour thinking */}
              <i>{translations.chat.thinking[language] || translations.chat.thinking.en}</i>
            </p>
          </div>
        )}
      </div>
      <footer className={styles.pageFooter}>
        <div className={styles.inputWrapper}>
          <button className={styles.iconButton}><FaPaperclip /></button>
          <input
            type="text"
            // Utiliser la nouvelle structure pour placeholder
            placeholder={translations.chat.placeholder[language] || translations.chat.placeholder.en}
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


const WelcomeInterface = () => {
  const { language } = useLanguage(); 
  return (
    <div className={styles.welcomeContainer}>
      <div className={styles.welcomeLogo}>
        <div className={styles.logoIcon}>H</div>
        {/* Utiliser la nouvelle structure pour welcomeHeadline */}
        <h1>{translations.welcome.headline[language] || translations.welcome.headline.en}</h1>
      </div>
      <div className={styles.welcomeCard}>
        <div className={styles.videoThumbnail}><FaPlayCircle /></div>
        <div className={styles.cardText}>
          {/* Utiliser la nouvelle structure pour watch */}
          <p><strong>{translations.welcome.watch[language] || translations.welcome.watch.en}</strong></p>
          {/* Utiliser la nouvelle structure pour intro */}
          <p>{translations.welcome.intro[language] || translations.welcome.intro.en}</p>
        </div>
        <button className={styles.closeCardButton}>×</button>
      </div>
      {/* Utiliser la nouvelle structure pour inputBar */}
      <div className={styles.inputBar}>{translations.welcome.inputBar[language] || translations.welcome.inputBar.en}</div>
    </div>
  );
};

export default function Page() {
  const isLoggedIn = true; // Pour le moment, toujours true

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