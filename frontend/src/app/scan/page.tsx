'use client';

import React, { useState, useEffect, useRef, KeyboardEvent } from 'react';
import styles from './scan.module.css';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import { FaPlus, FaHeart } from "react-icons/fa";
import { VscArrowUp } from "react-icons/vsc";

import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { LanguageCode } from '@/types';

// ----------------------
// Avatars & agent config
// ----------------------
const flagAvatars: Record<string, string> = {
  'en-AU': '/avatars/australian.png', 'en-CA': '/avatars/canada.jpg', 'fr-CA': '/avatars/canada.jpg',
  'en': '/avatars/england.png', 'hi': '/avatars/india.png', 'en-NZ': '/avatars/new-zealand.png',
  'mi': '/avatars/maoripioneer.png', 'en-ZA': '/avatars/south-africa.png', 'af': '/avatars/south-africa.png',
  'ga': '/avatars/irish.png', 'gd': '/avatars/scottish.jpg', 'cy': '/avatars/welsh.jpg',
  'fr': '/avatars/france.png',
};

const symbolicAgentAvatars: Record<string, string> = {
  lion: '/avatars/lion.png', thorn: '/avatars/thorn.png', protea: '/avatars/protea.png',
  '007': '/avatars/007.png', ashoka: '/avatars/ashoka.png', ktk: '/avatars/ktk.png',
  rock: '/avatars/rock.png', fern: '/avatars/fern.png', southerncross: '/avatars/southerncross.png',
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

// ----------------------
// Types
// ----------------------
interface Message {
  role: 'user' | 'assistant';
  content: string;
}

// ----------------------
// Translations
// ----------------------
const allTranslations = {
  header: {
    missionStatement: {
      en: "Inspired by the Wellington Tunnelers of Arras, our mission is to build in the shadows what will, tomorrow, break through to the surface.",
      fr: "Inspirés des tunneliers de Wellington à Arras, notre mission est de bâtir dans l’ombre ce qui, demain, percera la surface.",
      mi: "He mea whakahihiri mai i ngā kaikeri o raro o Te Whanganui-a-Tara ki Arras, ko tā mātou kaupapa he hanga i roto i te atarangi i ngā mea ka puta ki te mata āpōpopo.",
      ga: "Ar an taobh istigh de tholláin Wellington in Arras, is é ár misean tógáil sa scáth a bhrisfidh an dromchla amárach.",
      hi: "एरास में वेलिंगटन टनलर्स से प्रेरित होकर, हमारा मिशन छाया में वह निर्माण करना है जो कल सतह को भेद देगा।",
      gd: "Air a bhrosnachadh le Tunnelairean Wellington ann an Arras, is e ar misneachd togail anns an dubhar na nì, a-màireach, briseadh tro uachdar.",
      cy: "Wedi'u hysbrydoli gan Dwnelwyr Wellington yn Arras, ein cenhadaeth yw adeiladu yn y cysgodion yr hyn, yfory, a fydd yn torri trwy'r wyneb.",
      'en-AU': "Inspired by the Wellington Tunnelers of Arras...",
      'en-NZ': "Inspired by the Wellington Tunnelers of Arras...",
      'en-CA': "Inspired by the Wellington Tunnelers of Arras...",
      'fr-CA': "Inspirés des tunneliers de Wellington à Arras...",
      'en-ZA': "Geïnspireer deur die Wellington Tunneliers...",
      af: "Geïnspireer deur die Wellington Tunneliers...",
    },
    beta: {
      en: "Beta", fr: "Bêta", mi: "Beta", ga: "Béite", hi: "बीटा", gd: "Beta", cy: "Beta",
      'en-AU': "Beta", 'en-NZ': "Beta", 'en-CA': "Beta", 'fr-CA': "Bêta", 'en-ZA': "Beta", af: "Beta",
    }
  },
  chat: {
    welcomeMessage: {
      en: "Hello! I'm A.L.A.N (a nod to Alan Turing). How can I help you today?",
      fr: "Bonjour ! Je suis l'Agent L.I.O.N. Comment puis-je vous aider aujourd'hui ?",
      mi: "Kia ora! Ko Agent K.T.K. ahau. Me pēhea taku āwhina i a koe i tēnei rā?",
      ga: "Dia duit! Is mise Agent ☘️ R.O.C.K.. Conas is féidir liom cabhrú leat inniu?",
      hi: "नमस्ते! मैं एजेंट ☸️ C.K.R. हूँ। आज मैं आपकी कैसे मदद कर सकता हूँ?",
      gd: "Halo! 'S mise Agent S.C. Ciamar as urrainn dhomh do chuideachadh an-diugh?",
      cy: "Helo! Fi yw Asiant A.L.A.N. Sut alla i eich helpu heddiw?",
      'en-AU': "G'day! I'm Agent ✨ D.G.R.. How can I help ya today?",
      'en-NZ': "Kia ora! I'm Agent 🌿 FERN. How can I help you today?",
      'en-CA': "Hey there! I'm Agent 🍁 M.A.P.L.. How can I help you today, eh?",
      'fr-CA': "Bonjour ! Je suis l'Agent 🍁 M.A.P.L.. Comment puis-je vous aider aujourd'hui ?",
      'en-ZA': "Howzit! I'm Agent 🇿🇦 M.DB.. nod to Neslon Mandela How can I help you today?",
      af: "Goeiedag! Ek is Agent 🇿🇦 M.D.B. Hoe kan ek jou vandag help?",
    },
    thinking: {
      en: 'Agent is thinking...',
      fr: 'Agent L.I.O.N. réfléchit...',
      mi: 'Kei te whakaaro a Agent K.T.K....',
      ga: 'Tá Agent ☘️ R.O.C.K. ag smaoineamh...',
      hi: 'एजेंट ☸️ C.K.R. सोच रहा है...',
      gd: 'Tha Agent 🌸 T.H.O.R.N. a\' smaoineachadh...',
      cy: "Mae Asiant yn meddwl...",
      'en-AU': "Agent ✨ D.G.R.'s thinkin'...",
      'en-NZ': "Agent 🌿 FERN's thinking...",
      'en-CA': 'Agent 🍁 M.A.P.L. is thinking...',
      'fr-CA': 'Agent 🍁 M.A.P.L. réfléchit...',
      'en-ZA': 'Agent 🇿🇦 P.R.T. is thinking...',
      af: 'Agent 🇿🇦 P.R.T. dink...',
    },
    placeholder: {
      en: 'Type your message...',
      fr: 'Tapez votre message...',
      mi: 'Tēnā koa, tāpiri tō karere...',
      ga: 'Clóscríobh do theachtaireacht...',
      hi: 'अपना संदेश type करें...',
      gd: 'Cuir a-steach do theachdaireachd...',
      cy: 'Teipiwch eich neges...',
      'en-AU': 'Chuck your message in here...',
      'en-NZ': 'Type your message here...',
      'en-CA': 'Type your message...',
      'fr-CA': 'Écrivez votre message...',
      'en-ZA': 'Type your message...',
      af: 'Tik jou boodskap...',
    },
    militaryPackages: {
      en: 'Military Packages',
      fr: 'Paquetages Militaires',
      mi: 'Ngā Pūtē Whawhai',
      ga: 'Pacáistí Míleata',
      hi: 'सैन्य पैकेज',
      gd: 'Pacaidean Armailteach',
      cy: 'Pecynnau Milwrol',
      'en-AU': 'Military Packages', 'en-NZ': 'Military Packages', 'en-CA': 'Military Packages', 'fr-CA': 'Paquetages Militaires', 'en-ZA': 'Militêre Pakkette', af: 'Militêre Pakkette',
    },
  },
};

// ----------------------
// Helpers
// ----------------------
function getTranslation(section: keyof typeof allTranslations, keyPath: string, language: LanguageCode): string {
  const keys = keyPath.split('.');
  let value: any = (allTranslations as any)[section];

  for (const key of keys) {
    if (!value || typeof value !== 'object') {
      console.warn(`Invalid translation path: ${section}.${keyPath}`);
      return `[${keyPath}]`;
    }
    value = value[key];
  }

  if (value == null) return `[${keyPath}]`;
  if (typeof value === 'object') {
    // prefer requested language, then english, then first available
    return value[language] || value.en || Object.values(value)[0] || `[${keyPath}]`;
  }
  return String(value);
}

function getAuthToken(): string | null {
  try {
    if (typeof window === 'undefined') return null;
    const token = localStorage.getItem('access_token');
    if (token) return token;
    // fallback: cookie named access_token
    const match = document.cookie.match(/(?:^|; )access_token=([^;]+)/);
    return match ? decodeURIComponent(match[1]) : null;
  } catch (e) {
    return null;
  }
}

// ----------------------
// Component
// ----------------------
const ChatInterface: React.FC = () => {
  const { language } = useLanguage();
  const { theme } = useTheme();
  const router = useRouter();

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAmbianceMuted, setIsAmbianceMuted] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const muteButtonRef = useRef<HTMLButtonElement | null>(null);

  // Store audio elements so we can play sounds
  const sounds = useRef<{
    click?: HTMLAudioElement;
    send?: HTMLAudioElement;
    typing?: HTMLAudioElement;
    ambiance?: HTMLAudioElement;
    heart?: HTMLAudioElement;
  }>({});

  const currentAgent = (agentDetails as any)[language] || agentDetails.default;

  // Initialize audio elements & welcome message on language change or mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    sounds.current.click = new Audio('/sounds/click_ui.mp3');
    sounds.current.send = new Audio('/sounds/send_telegram.mp3');
    sounds.current.typing = new Audio('/sounds/typewriter_key.mp3');
    sounds.current.ambiance = new Audio('/sounds/gramophone_music.mp3');
    sounds.current.heart = new Audio('/sounds/like_sound.mp3');

    // set volumes & loop
    if (sounds.current.click) sounds.current.click.volume = 0.6;
    if (sounds.current.send) sounds.current.send.volume = 0.7;
    if (sounds.current.typing) sounds.current.typing.volume = 0.5;
    if (sounds.current.ambiance) {
      sounds.current.ambiance.volume = 0.1;
      sounds.current.ambiance.loop = true;
      sounds.current.ambiance.muted = isAmbianceMuted;
      if (!isAmbianceMuted) {
        sounds.current.ambiance.play().catch(() => {});
      }
    }

    const welcomeMessage = getTranslation('chat', 'welcomeMessage', language);
    setMessages([{ role: 'assistant', content: welcomeMessage }]);

    // Clean up on unmount
    return () => {
      sounds.current.ambiance?.pause();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  // Handle ambiance mute/unmute
  useEffect(() => {
    if (sounds.current.ambiance) {
      sounds.current.ambiance.muted = isAmbianceMuted;
      if (!isAmbianceMuted && sounds.current.ambiance.paused) {
        sounds.current.ambiance.play().catch(() => {});
      } else if (isAmbianceMuted) {
        sounds.current.ambiance.pause();
      }
    }
  }, [isAmbianceMuted]);

  // Auto scroll chat to bottom on new messages or loading state
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Utility to play sounds safely
  const playSound = (sound?: HTMLAudioElement) => {
    if (!sound) return;
    if (!sound.paused) {
      sound.currentTime = 0;
      return;
    }
    sound.currentTime = 0;
    sound.play().catch(() => {
      // ignore autoplay errors due to lack of user interaction
    });
  };

  // Handle click on heart button: play sound and redirect to /paquetages-militaires
  const handleHeartClick = () => {
    const heartSound = sounds.current.heart;
    if (heartSound) {
      playSound(heartSound);
      heartSound.onended = () => router.push('/paquetages-militaires');
    } else {
      router.push('/paquetages-militaires');
    }
  };

  // Endpoints candidates for API request (try fallback)
  const getCandidateEndpoints = (): string[] => {
    const base = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') || '';
    if (!base) return ['/scan/scan/generate', '/scan/generate'];
    return [
      `${base}/scan/scan/generate`,
      `${base}/scan/generate`,
      `${base}/scan`,
    ];
  };

  // Send user message, fetch assistant response, update chat
  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;
    playSound(sounds.current.send);

    const newMessage: Message = { role: 'user', content: inputValue.trim() };
    setMessages(prev => [...prev, newMessage]);
    setInputValue('');
    setIsLoading(true);

    const endpoints = getCandidateEndpoints();
    const token = getAuthToken();

    let lastError: any = null;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000); // 30s timeout

    try {
      for (const url of endpoints) {
        try {
          const res = await fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: JSON.stringify({ prompt: newMessage.content, mode: 'text', query: newMessage.content }),
            signal: controller.signal,
          });

          if (res.status === 401) {
            setMessages(prev => [
              ...prev,
              { role: 'assistant', content: "Unauthorized (401). Please login or provide a valid token." }
            ]);
            setIsLoading(false);
            return;
          }

          if (res.status === 404) {
            lastError = new Error(`404 Not Found at ${url}`);
            continue; // try next endpoint
          }

          if (!res.ok) {
            const text = await res.text().catch(() => '');
            throw new Error(`HTTP ${res.status} ${res.statusText} ${text}`);
          }

          const data = await res.json().catch(() => ({}));
          const reply = data?.response_text || data?.response || data?.result || data?.message || String(data);
          setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
          clearTimeout(timeout);
          setIsLoading(false);
          return;
        } catch (err) {
          lastError = err;
          if ((err as any)?.name === 'AbortError') {
            lastError = new Error('Request timed out');
            break;
          }
          // continue to try next endpoint
        }
      }

      // none succeeded
      throw lastError ?? new Error('No endpoint succeeded');
    } catch (err: any) {
      console.error('Send error:', err);
      let message = 'Erreur lors de la communication avec le serveur.';
      if (err instanceof Error) message = err.message;
      setMessages(prev => [...prev, { role: 'assistant', content: `Erreur : ${message}` }]);
    } finally {
      clearTimeout(timeout);
      setIsLoading(false);
    }
  };

  // Play typing sound on key press, send message on Enter
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key.length === 1) playSound(sounds.current.typing);
    if (e.key === 'Enter' && !isLoading) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Get avatar image element for user or assistant
  const getAvatar = (role: 'user' | 'assistant') => {
    const src = role === 'user' ? (userAvatarsMapping[language] || userAvatarsMapping.default) : (currentAgent.avatarPath || userAvatarsMapping.default);
    return <img src={src} alt={role === 'user' ? 'User avatar' : `${currentAgent.name} avatar`} className={styles.avatarImage} />;
  };

  // Styles based on theme
  const backgroundColor = theme === 'dark' ? '#1f2937' : '#ffffff';
  const textColor = theme === 'dark' ? '#E0E0E0' : 'black';

  return (
    <div className={styles.chatContainer} style={{ background: backgroundColor, color: textColor }}>
      <header className={styles.pageHeader}>
        <div className={styles.headerLeft}>
          <span>{getTranslation('header', 'missionStatement', language)}</span>
        </div>
        <div className={styles.headerRight}>
          <button
            ref={muteButtonRef}
            onClick={() => setIsAmbianceMuted(s => !s)}
            className={styles.iconButton}
            aria-label={isAmbianceMuted ? "Unmute ambiance" : "Mute ambiance"}
            title={isAmbianceMuted ? "Unmute ambiance" : "Mute ambiance"}
          >
            <img src="/images/gramophone.svg" alt="Gramophone" width={24} height={24} />
          </button>
        </div>
      </header>

      <div className={styles.messagesArea} role="log" aria-live="polite" aria-relevant="additions">
        {messages.map((msg, idx) => (
          <div key={idx} className={msg.role === 'user' ? styles.userMessage : styles.assistantMessage}>
            <div className={styles.avatar}>{getAvatar(msg.role)}</div>
            <div className={styles.messageContent}>{msg.content}</div>
          </div>
        ))}

        {isLoading && (
          <div className={styles.assistantMessage}>
            <div className={styles.avatar}>{getAvatar('assistant')}</div>
            <div className={styles.messageContent}>{getTranslation('chat', 'thinking', language)}</div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <footer className={styles.pageFooter}>
        <div className={styles.footerActionsLeft}>
          <button className={styles.iconButton} onClick={handleHeartClick} aria-label={getTranslation('chat', 'militaryPackages', language)}>
            <FaHeart />
          </button>

          <Link href="/drive" passHref legacyBehavior>
            <button className={styles.iconButton} onClick={() => playSound(sounds.current.click)} aria-label="Add content">
              <FaPlus />
            </button>
          </Link>
        </div>

        <div className={styles.inputWrapper}>
          <input
            type="text"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={getTranslation('chat', 'placeholder', language)}
            aria-label="Message input"
            style={{
              backgroundColor: theme === 'dark' ? '#1F1F2A' : '#FFFFFF',
              color: theme === 'dark' ? '#E0E0E0' : 'black',
              borderColor: theme === 'dark' ? '#444444' : '#CCCCCC',
            }}
            disabled={isLoading}
            autoComplete="off"
          />
          <button
            className={styles.sendButton}
            onClick={handleSendMessage}
            disabled={isLoading || !inputValue.trim()}
            aria-label="Send message"
            title="Send message"
            type="button"
          >
            <VscArrowUp />
          </button>
        </div>
      </footer>
    </div>
  );
};

export default ChatInterface;
