'use client';

import React, { useState, useCallback, useEffect, useRef, KeyboardEvent } from 'react';
import styles from './scan.module.css';
import { useRouter } from 'next/navigation';

import { 
  FaPaperclip, FaImage, FaKeyboard, FaMicrophone, FaPlayCircle, FaPlus, 
  FaBullhorn, FaBriefcase 
} from 'react-icons/fa';

import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import { LanguageCode } from '@/types';


// ... (Vos constantes Avatars et Traductions restent inchangées) ...

// === Component ===
const ChatInterface: React.FC = () => {
  const { language } = useLanguage();
  const { theme } = useTheme();
  const router = useRouter();

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [userMessageCount, setUserMessageCount] = useState(0);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const muteButtonRef = useRef<HTMLButtonElement>(null); // ✅ Déclaration de la ref ici

  const sounds = useRef<{
    click: HTMLAudioElement | null,
    send: HTMLAudioElement | null,
    typing: HTMLAudioElement | null,
    ambiance: HTMLAudioElement | null,
    upload: HTMLAudioElement | null,
    denied: HTMLAudioElement | null,
  }>({ click: null, send: null, typing: null, ambiance: null, upload: null, denied: null });

  useEffect(() => {
    const initAudio = (path: string) => {
        try {
            const audio = new Audio(path);
            console.log(`Audio loaded: ${path}`, audio); // ✅ Log pour la création
            return audio;
        } catch (e) {
            console.error(`Failed to load audio: ${path}`, e); // ✅ Log en cas d'échec
            return null; // Retourne null si la création échoue
        }
    };

    sounds.current.click = initAudio('/sounds/click_ui.mp3');
    sounds.current.send = initAudio('/sounds/morse_signal.mp3');
    sounds.current.typing = initAudio('/sounds/typewriter_key.mp3');
    sounds.current.ambiance = initAudio('/sounds/gramophone_music.mp3');
    sounds.current.upload = initAudio('/sounds/upload_image.mp3');
    sounds.current.denied = initAudio('/sounds/old-church-bell.mp3');

    // ✅ Vérifier explicitement avant de définir les volumes
    if (sounds.current.click) sounds.current.click.volume = 0.6;
    if (sounds.current.send) sounds.current.send.volume = 0.7;
    if (sounds.current.typing) sounds.current.typing.volume = 0.5;
    if (sounds.current.ambiance) {
        sounds.current.ambiance.volume = 0.1;
        sounds.current.ambiance.loop = true;
        sounds.current.ambiance.muted = isMuted;
    }
    if (sounds.current.upload) sounds.current.upload.volume = 0.7;
    if (sounds.current.denied) sounds.current.denied.volume = 0.6;

    return () => { sounds.current.ambiance?.pause(); }
  }, []); // Dépendance vide pour ne s'exécuter qu'une fois au montage

  useEffect(() => {
    if (sounds.current.ambiance) {
      sounds.current.ambiance.muted = isMuted;
      if (!isMuted && sounds.current.ambiance.paused) {
          sounds.current.ambiance.play().catch(e => console.error("Erreur de lecture de l'ambiance:", e));
      }
    }
  }, [isMuted]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const playSound = (sound: HTMLAudioElement | null) => {
    if (!isMuted && sound) { // ✅ Vérifie que 'sound' n'est pas null avant de le manipuler
      sound.currentTime = 0;
      sound.play().catch(() => {});
    }
  };

  const currentAgent = agentDetails[language] || agentDetails.default;
  useEffect(() => {
    const welcomeMessage = getTranslation('chat', 'welcomeMessage', language);
    setMessages([{ role: 'assistant', content: welcomeMessage }]);
  }, [language]);

  const getAvatar = (role: 'user' | 'assistant') => {
    const src = role === 'user' ? userAvatarsMapping[language] || userAvatarsMapping.default : currentAgent.avatarPath;
    return <img src={src} alt={role === 'user' ? 'User' : currentAgent.name} />;
  };

  const speakAgentResponse = (text: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    playSound(sounds.current.click); // Utilise playSound pour le clic aussi
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language;
    utterance.pitch = 1.1;
    utterance.rate = 1.0;
    window.speechSynthesis.speak(utterance);
  };

  const handleFileUpload = () => {
    playSound(sounds.current.upload); // Utilise playSound pour l'upload
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'assistant', content: `J'analyse le fichier que vous venez de m'envoyer...` }]);
    }, 1000);
  };

  const handleMicClick = () => {
    setIsRecording(!isRecording);
    // Logique future pour le vocoder
  };

  const handlePlusClick = () => {
    playSound(sounds.current.click);
    router.push('/drive');
  };

  const handleToolboxClick = () => {
    playSound(sounds.current.click);
    router.push('/paquetages-militaires');
  };

  const handleSendMessage = async () => {
    const prompt = inputValue.trim();
    if (!prompt) return;

    if (userMessageCount >= 3) {
      playSound(sounds.current.denied);
      setMessages(prev => [...prev, { role: 'assistant', content: "Votre accès d'essai est terminé. Veuillez passer à un plan supérieur pour continuer l'opération." }]);
      return;
    }

    playSound(sounds.current.send);
    setMessages(prev => [...prev, { role: 'user', content: prompt }]);
    setUserMessageCount(prev => prev + 1);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('http://<IP_DE_VOTRE_JETSON>:8080/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      const fullReply = data.answer;

      setIsLoading(false);
      setMessages(prev => [...prev, { role: 'assistant', content: '' }]);
      let index = 0;
      const intervalId = setInterval(() => {
        setMessages(prev => {
          if (index >= fullReply.length) {
            clearInterval(intervalId);
            return prev;
          }
          const updatedLastMessage = { ...prev[prev.length - 1], content: fullReply.substring(0, index + 1) };
          return [...prev.slice(0, -1), updatedLastMessage];
        });
        playSound(sounds.current.typing);
        index++;
      }, 75);
    } catch (error) {
      console.error("Erreur de communication avec l'agent:", error);
      setIsLoading(false);
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: "Erreur de communication avec le poste de commande." }
      ]);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isLoading) handleSendMessage();
  };

  const messageAreaClassName = (msgRole: string) => `${styles.messageBubble} ${msgRole === 'user' ? styles.userMessage : styles.assistantMessage}`;
  const backgroundColor = theme === 'dark' ? '#1f2937' : '#ffffff';
  const textColor = theme === 'dark' ? '#E0E0E0' : '#111827';

  return (
    <div className={styles.chatContainer} style={{ background: backgroundColor, color: textColor }} >
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
              // Si on active le son et que l'ambiance n'est pas jouée, on la lance
              if (!mute && sounds.current.ambiance && sounds.current.ambiance.paused) {
                  sounds.current.ambiance.play().catch(e => console.error("Erreur de lecture de l'ambiance:", e));
              }
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
          <div key={idx} className={messageAreaClassName(msg.role)}>
            <div className={styles.avatar}>{getAvatar(msg.role)}</div>
            <p className={styles.messageContent}>
              {msg.content}
              {isLoading && idx === messages.length -1 && msg.role === 'assistant' && (
                <span className={styles.typingCursor}></span>
              )}
            </p>
            {msg.role === 'assistant' && idx > 0 && !isLoading && (
              <button onClick={() => speakAgentResponse(msg.content)} className={styles.voiceboxButton}>
                <FaBullhorn />
              </button>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* FOOTER */}
      <footer className={styles.pageFooter}>
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

        <div className={styles.footerActions}>
          <div className={styles.footerActionsLeft}>
            <button className={styles.iconButton} onClick={handleFileUpload}>
              <FaPaperclip />
            </button>
            <button className={styles.iconButton} onClick={handleMicClick} style={{ color: isRecording ? '#ff4d4d' : 'inherit' }}>
              <FaMicrophone />
            </button>
            <button className={styles.iconButton} onClick={handlePlusClick}>
              <FaPlus />
            </button>
            <button className={styles.iconButton} onClick={handleToolboxClick}>
              <FaBriefcase />
              <span className={styles.buttonLabel}>{getTranslation('chat', 'militaryPackages', language)}</span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};


const WelcomeInterface: React.FC = () => {
  const { language } = useLanguage();
  const { theme } = useTheme();

  const backgroundColor = theme === 'dark' ? '#1f2937' : '#ffffff';
  const textColor = theme === 'dark' ? '#E0E0E0' : '#111827';
  const highlightColor = theme === 'dark' ? '#8BC4FF' : '#4A90E2';

  return (
    <div
      className={styles.welcomeContainer}
      style={{
        '--kiwi-background-page': backgroundColor,
        '--kiwi-text-primary': textColor,
        '--kiwi-highlight-color': highlightColor,
      } as React.CSSProperties}
    >
      <div className={styles.welcomeLogo}>
        <div className={styles.logoIcon}>O</div>
        <h1>{getTranslation('welcome', 'headline', language)}</h1>
      </div>
      <div className={styles.welcomeCard}>
        <div className={styles.videoThumbnail}><FaPlayCircle /></div>
        <div className={styles.cardText}>
          <p><strong>{getTranslation('welcome', 'watch', language)}</strong></p>
          <p>{getTranslation('welcome', 'intro', language)}</p>
        </div>
        <button className={styles.closeCardButton}>×</button>
      </div>
      <div className={styles.inputBar}>{getTranslation('welcome', 'inputBar', language)}</div>
    </div>
  );
};

export default function ScanPage() {
  const isLoggedIn = true;
  return <>{isLoggedIn ? <ChatInterface /> : <WelcomeInterface />}</>;
}