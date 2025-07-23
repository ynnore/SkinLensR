'use client';

import React, { useState, useEffect, useRef, KeyboardEvent } from 'react';
import styles from './scan.module.css';
import { 
  FaToolbox, FaBullhorn, FaImage, FaKeyboard, FaMicrophone, FaPlayCircle, FaPlus 
} from 'react-icons/fa';

import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { LanguageCode } from '../../types';

// === Avatars ===
const flagAvatars: Record<string, string> = {
  'en-AU': '/avatars/australian.png',
  'en-CA': '/avatars/canada.jpg',
  'fr-CA': '/avatars/canada.jpg',
  'en': '/avatars/england.png',
  'hi': '/avatars/india.png',
  'en-NZ': '/avatars/new-zealand.png',
  'mi': '/avatars/maoripioneer.png',
  'en-ZA': '/avatars/south-africa.png',
  'af': '/avatars/south-africa.png',
  'ga': '/avatars/irish.png',
  'gd': '/avatars/scottish.jpg',
  'cy': '/avatars/welsh.jpg',
  'fr': '/avatars/france.png',
};

const symbolicAgentAvatars: Record<string, string> = {
  lion: '/avatars/lion.png',
  thorn: '/avatars/thorn.png',
  protea: '/avatars/protea.png',
  '007': '/avatars/007.png',
  ashoka: '/avatars/ashoka.png',
  ktk: '/avatars/ktk.png',
  rock: '/avatars/rock.png',
  fern: '/avatars/fern.png',
  southerncross: '/avatars/southerncross.png',
  maple: '/avatars/maple.svg',
};

const agentDetails: Record<string, { name: string; avatarPath: string }> = {
  fr: { name: 'L.I.O.N.', avatarPath: symbolicAgentAvatars.lion || flagAvatars.fr },
  'en-CA': { name: '🍁 M.A.P.L.', avatarPath: symbolicAgentAvatars.maple || flagAvatars['en-CA'] },
  'fr-CA': { name: '🍁 M.A.P.L.', avatarPath: symbolicAgentAvatars.maple || flagAvatars['fr-CA'] },
  ga: { name: '☘️ R.O.C.K.', avatarPath: symbolicAgentAvatars.rock || flagAvatars.ga },
  gd: { name: '🌸 T.H.O.R.N.', avatarPath: symbolicAgentAvatars.thorn || flagAvatars.gd },
  'en-NZ': { name: '🌿 FERN', avatarPath: symbolicAgentAvatars.fern || flagAvatars['en-NZ'] },
  mi: { name: '⚫⚪🔴 K.T.K.', avatarPath: symbolicAgentAvatars.ktk || flagAvatars.mi },
  'en-AU': { name: '✨ D.G.R.', avatarPath: symbolicAgentAvatars.southerncross || flagAvatars['en-AU'] },
  hi: { name: '☸️ C.K.R.', avatarPath: symbolicAgentAvatars.ashoka || flagAvatars.hi },
  'en-ZA': { name: '🇿🇦 P.R.T.', avatarPath: symbolicAgentAvatars.protea || flagAvatars['en-ZA'] },
  af: { name: '🇿🇦 P.R.T.', avatarPath: symbolicAgentAvatars.protea || flagAvatars.af },
  en: { name: 'A.L.A.N', avatarPath: symbolicAgentAvatars['007'] || flagAvatars.en },
  default: { name: 'L.I.O.N.', avatarPath: symbolicAgentAvatars.lion || flagAvatars.fr },
};

const userAvatarsMapping: Record<string, string> = {
  ...flagAvatars,
  default: '/avatars/human.png',
};

// === Types & Traductions ===
interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const allTranslations = {
  header: {
    missionStatement: {
      fr: "Inspirés des tunneliers de Wellington à Arras, notre mission est de bâtir dans l’ombre ce qui, demain, percera la surface.",
      en: "Inspired by the Wellington Tunnelers of Arras, our mission is to build in the shadows what will, tomorrow, break through to the surface.",
    },
    beta: { en: "Beta", fr: "Bêta" }
  },
  chat: {
    welcomeMessage: {
      en: "Hello! I'm A.L.A.N (a nod to Alan Turing). How can I help you today?",
      fr: "Bonjour ! Je suis l'Agent L.I.O.N. Comment puis-je vous aider aujourd'hui ?",
    },
    thinking: {
      en: 'Agent is thinking...',
      fr: 'Agent L.I.O.N. réfléchit...',
    },
    placeholder: {
      en: 'Type your message...',
      fr: 'Tapez votre message...',
    }
  },
};

function getTranslation<
  S extends keyof typeof allTranslations,
  K extends keyof typeof allTranslations[S]
>(section: S, key: K, language: LanguageCode): string {
  const translations = allTranslations[section][key] as Record<string, string>;
  return translations?.[language] || translations?.en || '';
}

// === Component ===
const ChatInterface: React.FC = () => {
  const { language } = useLanguage();
  const { theme } = useTheme();

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  const muteButtonRef = useRef<HTMLButtonElement>(null);

  const sounds = useRef({
    click: new Audio('/sounds/click_ui.mp3'),
    send: new Audio('/sounds/morse_signal.mp3'),
    typing: new Audio('/sounds/typewriter_key.mp3'),
    ambiance: new Audio('/sounds/gramophone_music.mp3')
  });

  // Définir agent courant
  const currentAgent = agentDetails[language] || agentDetails.default;

  useEffect(() => {
    // Initial volumes
    sounds.current.click.volume = 0.6;
    sounds.current.send.volume = 0.7;
    sounds.current.typing.volume = 0.5;
    sounds.current.ambiance.volume = 0.1;
    sounds.current.ambiance.loop = true;
    sounds.current.ambiance.muted = isMuted;

    // Message de bienvenue
    const welcomeMessage = getTranslation('chat', 'welcomeMessage', language);
    setMessages([{ role: 'assistant', content: welcomeMessage }]);

    return () => sounds.current.ambiance.pause();
  }, [language]);

  useEffect(() => {
    sounds.current.ambiance.muted = isMuted;
  }, [isMuted]);

  const playSound = (sound: HTMLAudioElement) => {
    if (!isMuted) {
      sound.currentTime = 0;
      sound.play().catch(() => {});
    }
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    playSound(sounds.current.send);

    const newMessage: Message = { role: 'user', content: inputValue.trim() };
    setMessages(prev => [...prev, newMessage]);
    setInputValue('');
    setIsLoading(true);

    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: `Ceci est une réponse simulée de ${currentAgent.name}.` }
      ]);
      setIsLoading(false);
    }, 1200);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key.length === 1) playSound(sounds.current.typing);
    if (e.key === 'Enter' && !isLoading) handleSendMessage();
  };

  const getAvatar = (role: 'user' | 'assistant') => {
    const src =
      role === 'user'
        ? userAvatarsMapping[language] || userAvatarsMapping.default
        : currentAgent.avatarPath;
    return <img src={src} alt={role === 'user' ? 'User' : currentAgent.name} />;
  };

  // Theme styles
  const backgroundColor = theme === 'dark' ? '#1f2937' : '#ffffff';
  const textColor = theme === 'dark' ? '#E0E0E0' : '#111827';

  return (
    <div
      className={styles.chatContainer}
      style={{ background: backgroundColor, color: textColor }}
    >
      {/* HEADER */}
      <header className={styles.pageHeader}>
        <div className={styles.headerLeft}>
          <span>{getTranslation('header', 'missionStatement', language)}</span>
        </div>
        <div className={styles.headerRight}>
          <button
            ref={muteButtonRef}
            onClick={() => {
              const mute = !isMuted;
              setIsMuted(mute);
              if (!mute) sounds.current.ambiance.play().catch(() => {});
            }}
            className={styles.iconButton}
          >
            <img
              src="/images/gramophone.svg"
              alt="Gramophone"
              width={24}
              height={24}
              style={{ opacity: isMuted ? 0.6 : 1 }}
            />
          </button>
        </div>
      </header>

      {/* MESSAGES */}
      <div className={styles.messagesArea}>
        {messages.map((msg, idx) => (
          <div key={idx} className={msg.role === 'user' ? styles.userMessage : styles.assistantMessage}>
            <div className={styles.avatar}>{getAvatar(msg.role)}</div>
            <p className={styles.messageContent}>{msg.content}</p>
          </div>
        ))}
      </div>

      {/* FOOTER */}
      <footer className={styles.pageFooter}>
        {/* Icônes */}
        <div className={styles.footerActionsLeft}>
          {[FaImage, FaKeyboard, FaMicrophone, FaToolbox, FaPlus, FaBullhorn].map((Icon, i) => (
            <button key={i} className={styles.iconButton} onClick={() => playSound(sounds.current.click)}>
              <Icon />
            </button>
          ))}
        </div>

        {/* Input + Send */}
        <div className={styles.inputWrapper}>
          <input
            type="text"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={getTranslation('chat', 'placeholder', language)}
          />
          <button className={styles.sendButton} onClick={handleSendMessage} disabled={isLoading}>
            <FaPlayCircle />
          </button>
        </div>
      </footer>
    </div>
  );
};

export default ChatInterface;
