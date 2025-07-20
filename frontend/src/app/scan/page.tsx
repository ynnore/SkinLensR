// Fichier: src/app/scan/page.tsx (Contenu du chat/scan)
'use client'; // Indique que ce composant est un Client Component

import React, { useState, useCallback, useEffect, useRef, KeyboardEvent } from 'react';
import styles from './scan.module.css'; // Assurez-vous que scan.module.css est importé (ou utilisez styles inline)
import { FaPaperclip, FaImage, FaKeyboard, FaMicrophone, FaPlayCircle, FaSun, FaMoon } from 'react-icons/fa';
import { useLanguage } from '../../contexts/LanguageContext'; // Chemin ajusté pour src/app/scan
import { useTheme } from '../../context/ThemeContext'; // Chemin ajusté pour src/app/scan
import { useOnClickOutside } from '../../hooks/useOnClickOutside'; // Chemin ajusté pour src/app/scan
import { LanguageCode } from '../../types'; // Chemin ajusté pour src/app/scan
import LanguageSelector from '../../components/LanguageSelector';
import UserDropdown from '../../components/UserDropdown';

// Chemins des fichiers images des drapeaux
const flagAvatars: { [key: string]: string } = {
  'en-AU': '/avatars/australian.png', 'en-CA': '/avatars/canada.jpg', 'fr-CA': '/avatars/canada.jpg',
  'en': '/avatars/england.png', 'hi': '/avatars/india.png', 'en-NZ': '/avatars/new-zealand.png',
  'mi': '/avatars/maoripioneer.png', 'en-ZA': '/avatars/south-africa.png', 'af': '/avatars/south-africa.png',
  'ga': '/avatars/irish.png', 'gd': '/avatars/scottish.jpg', 'cy': '/avatars/welsh.jpg',
  'fr': '/avatars/france.png',
};

// Chemins des fichiers images des avatars symboliques
const symbolicAgentAvatars: { [key: string]: string } = {
  'lion': '/avatars/lion.png', 'thorn': '/avatars/thorn.png', 'protea': '/avatars/protea.png',
  '007': '/avatars/007.png', 'ashoka': '/avatars/ashoka.png', 'ktk': '/avatars/ktk.png',
  'rock': '/avatars/rock.png', 'fern': '/avatars/fern.png', 'southerncross': '/avatars/southerncross.png',
  'maple': '/avatars/maple.svg',
};

// Noms des agents et le chemin de leur avatar
const agentDetails: { [key: string]: { name: string; avatarPath: string } } = {
  'fr': { name: 'L.I.O.N.', avatarPath: symbolicAgentAvatars.lion || flagAvatars.fr },
  'en-CA': { name: '🍁 M.A.P.L.', avatarPath: symbolicAgentAvatars.maple || flagAvatars['en-CA'] },
  'fr-CA': { name: '🍁 M.A.P.L.', avatarPath: symbolicAgentAvatars.maple || flagAvatars['fr-CA'] },
  'ga': { name: '☘️ R.O.C.K.', avatarPath: symbolicAgentAvatars.rock || flagAvatars.ga },
  'gd': { name: '🌸 T.H.O.R.N.', avatarPath: symbolicAgentAvatars.thorn || flagAvatars.gd },
  'en-NZ': { name: '🌿 FERN', avatarPath: symbolicAgentAvatars.fern || flagAvatars['en-NZ'] },
  'mi': { name: '⚫⚪🔴 K.T.K.', avatarPath: symbolicAgentAvatars.ktk || flagAvatars.mi },
  'en-AU': { name: '✨ D.G.R.', avatarPath: symbolicAgentAvatars.southerncross || flagAvatars['en-AU'] },
  'hi': { name: '☸️ C.K.R.', avatarPath: symbolicAgentAvatars.ashoka || flagAvatars.hi },
  'en-ZA': { name: '🇿🇦 P.R.T.', avatarPath: symbolicAgentAvatars.protea || flagAvatars['en-ZA'] },
  'af': { name: '🇿🇦 P.R.T.', avatarPath: symbolicAgentAvatars.protea || flagAvatars.af },
  'en': { name: 'A.L.A.N', avatarPath: symbolicAgentAvatars['007'] || flagAvatars.en },
  'default': { name: 'L.I.O.N.', avatarPath: symbolicAgentAvatars.lion || flagAvatars.fr }
};

const userAvatarsMapping: { [key: string]: string } = {
  ...flagAvatars,
  'default': '/avatars/human.png',
};

// --- INTERFACES & TRADUCTIONS (fusionnées et nettoyées) ---
interface Message {
  role: string;
  content: string;
}

const allTranslations = {
  header: {
    missionStatement: {
      fr: "Inspirés des tunneliers de Wellington à Arras, notre mission est de bâtir dans l’ombre ce qui, demain, percera la surface.",
      en: "Inspired by the Wellington Tunnelers of Arras, our mission is to build in the shadows what will, tomorrow, break through to the surface.",
      mi: "He mea whakahihiri mai i ngā kaikeri o raro o Te Whanganui-a-Tara ki Arras, ko tā mātou kaupapa he hanga i roto i te atarangi i ngā mea ka puta ki te mata āpōpopo.",
      ga: "Ar an taobh istigh de tholláin Wellington in Arras, is é ár misean tógáil sa scáth a bhrisfidh an dromchla amárach.",
      hi: "एरास में वेलिंगटन टनलर्स से प्रेरित होकर, हमारा मिशन छाया में वह निर्माण करना है जो कल सतह को भेद देगा।",
      gd: "Air a bhrosnachadh le Tunnelairean Wellington ann an Arras, is e ar misneachd togail anns an dubhar na nì, a-màireach, briseadh tro uachdar.",
      'en-AU': "Inspired by the Wellington Tunnelers of Arras, our mission is to build in the shadows what will, tomorrow, break through to the surface.",
      'en-NZ': "Inspired by the Wellington Tunnelers of Arras, our mission is to build in the shadows what will, tomorrow, break through to the surface.",
      'en-CA': "Inspired by the Wellington Tunnelers of Arras, our mission is to build in the shadows what will, tomorrow, break through to the surface.",
      'fr-CA': "Inspirés des tunneliers de Wellington à Arras, notre mission est de bâtir dans l’ombre ce qui, demain, percera la surface.",
      'en-ZA': "Inspired by the Wellington Tunnelers of Arras, our mission is to build in the shadows what will, tomorrow, break through to the surface.",
      af: "Geïnspireer deur die Wellington Tunneliers van Arras, is ons missie om in die skaduwee te bou wat môre sal deurbreek na die oppervlak.",
    },
    beta: {
      en: "Beta", fr: "Bêta", mi: "Beta", ga: "Béite", hi: "बीटा", gd: "Beta",
      'en-AU': "Beta", 'en-NZ': "Beta", 'en-CA': "Beta", 'fr-CA': "Bêta", 'en-ZA': "Beta", af: "Beta",
    }
  },
  chat: {
    welcomeMessage: {
      en: "Hello! I'm A.L.A.N nod to Alan Turing,How can I help you today?",
      fr: "Bonjour ! Je suis l'Agent L.I.O.N. Comment puis-je vous aider aujourd'hui ?",
      mi: "Kia ora! Ko Agent K.T.K. ahau. Me pēhea taku āwhina i a koe i tēnei rā?",
      ga: "Dia duit! Is mise Agent ☘️ R.O.C.K.. Conas is féidir liom cabhrú leat inniu?",
      hi: "नमस्ते! मैं एजेंट ☸️ C.K.R. हूँ। आज मैं आपकी कैसे मदद कर सकता हूँ?",
      gd: "Halo! 'S mise Agent S.C. Ciamar as urrainn dhomh do chuideachadh an-diugh?",
      'en-AU': "G'day! I'm Agent ✨ D.G.R.. How can I help ya today?",
      'en-NZ': "Kia ora! I'm Agent 🌿 FERN. How can I help you today?",
      'en-CA': "Hey there! I'm Agent 🍁 M.A.P.L.. How can I help you today, eh?",
      'fr-CA': "Bonjour ! Je suis l'Agent 🍁 M.A.P.L.. Comment puis-je vous aider aujourd'hui ?",
      'en-ZA': "Howzit! I'm Agent 🇿🇦 M.DB.. nod to Neslon Mandela How can I help you today?",
      af: "Goeiedag! Ek is Agent 🇿🇦 M.D.B. Hoe kan ek jou vandag help?",
    },
    thinking: {
      en: 'Agent B is thinking...',
      fr: 'Agent L.I.O.N. réfléchit...',
      mi: 'Kei te whakaaro a Agent K.T.K....',
      ga: 'Tá Agent ☘️ R.O.C.K. ag smaoineamh...',
      hi: 'एजेंट ☸️ C.K.R. सोच रहा है...',
      gd: 'Tha Agent 🌸 T.H.O.R.N. a\' smaoineachadh...',
      'en-AU': 'Agent ✨ D.G.R.\'s thinkin\'...',
      'en-NZ': 'Agent 🌿 FERN\'s thinking...',
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
      'en-AU': 'Chuck your message in here...',
      'en-NZ': 'Type your message here...',
      'en-CA': 'Type your message...',
      'fr-CA': 'Écrivez votre message...',
      'en-ZA': 'Type your message...',
      af: 'Tik jou boodskap...',
    }
  },
  welcome: {
    headline: {
      en: "Operation W",
      fr: "Opération W",
      mi: "Operesihona W",
      ga: "Oibríocht W",
      hi: "ऑपरेशन डब्ल्यू",
      gd: "Obrachadh W",
      'en-AU': "Operation W",
      'en-NZ': "Operation W",
      'en-CA': "Operation W",
      'fr-CA': "Opération W",
      'en-ZA': "Operation W",
      af: "Operasie W",
    },
    watch: {
      en: 'Watch', fr: 'Regarder', mi: 'Mātakitaki',
      ga: 'Féach', hi: 'देखो', gd: 'Coimhead',
      'en-AU': 'Watch', 'en-NZ': 'Watch', 'en-CA': 'Watch', 'fr-CA': 'Regarder',
      'en-ZA': 'Watch', af: 'Kyk',
    },
    intro: {
       en: 'Getting started with Operation W',
      fr: 'Bien démarrer avec Opération W',
      mi: 'Kei te timata ki Operation W',
      ga: 'Ag tosú le Operation W',
      hi: 'ऑपरेशन डब्ल्यू के साथ शुरुआत करना',
      gd: 'A\' tòiseachadh le Operation W',
      'en-AU': 'Getting started with Operation W',
      'en-NZ': 'Getting started with Operation W',
      'en-CA': 'Getting started with Operation W',
      'fr-CA': 'Bien démarrer avec Opération W',
      'en-ZA': 'Getting started with Operation W',
      af: 'Begin met Operasie W',
    },
    inputBar: {
      en: 'Type here to give a task to Agent K',
      fr: "Tapez ici une tâche à confier à l'Agent K",
      mi: 'Tāpaea tēnei ki Agent K',
      ga: 'Clóscríobh anseo chun tasc a thabhairt do Agent K',
      hi: 'यहां एजेंट के को एक कार्य देने के लिए टाइप करें',
      gd: 'Sgrìobh an here gus gnìomh a thoirt do Agent K',
      'en-AU': 'Type here to give a task to Agent K',
      'en-NZ': 'Type here to give a task to Agent K',
      'en-CA': 'Type here to give a task to Agent K',
      'fr-CA': "Tapez ici une tâche à confier à l'Agent K",
      'en-ZA': 'Type here to give a task to Agent K',
      af: 'Tik hier om Agent K \'n taak te gee',
    },
  },
};

const getTranslation = <S extends keyof typeof allTranslations, K extends keyof typeof allTranslations[S]>(
  section: S,
  key: K,
  language: LanguageCode
): string => {
  const sectionTranslations = allTranslations[section];
  if (!sectionTranslations) return `[Missing Section: ${String(section)}]`;
  const specificTranslations = sectionTranslations[key];
  if (typeof specificTranslations !== 'object' || specificTranslations === null || !('en' in specificTranslations)) return `[Invalid Translation: ${String(section)}.${String(key)}]`;
  return (specificTranslations as { [lang: string]: string })[language] || (specificTranslations as { [lang: string]: string }).en;
};


const ChatInterface = () => {
  const { language } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const muteButtonRef = useRef<HTMLButtonElement>(null);

  const sounds = useRef<{
      click: HTMLAudioElement | null,
      send: HTMLAudioElement | null,
      typing: HTMLAudioElement | null,
      ambiance: HTMLAudioElement | null,
  }>({ click: null, send: null, typing: null, ambiance: null });

  useEffect(() => {
    sounds.current = {
      click: new Audio('/sounds/click_ui.mp3'),
      send: new Audio('/sounds/morse_signal.mp3'),
      typing: new Audio('/sounds/typewriter_key.mp3'),
      ambiance: new Audio('/sounds/gramophone_music.mp3')
    };

    if (sounds.current.click) sounds.current.click.volume = 0.6;
    if (sounds.current.send) sounds.current.send.volume = 0.7;
    if (sounds.current.typing) sounds.current.typing.volume = 0.5;
    if (sounds.current.ambiance) {
        sounds.current.ambiance.volume = 0.1;
        sounds.current.ambiance.loop = true;
        sounds.current.ambiance.muted = isMuted;
    }
    return () => { sounds.current.ambiance?.pause(); }
  }, []);

  useEffect(() => {
    if (sounds.current.ambiance) {
      sounds.current.ambiance.muted = isMuted;
    }
  }, [isMuted]);

  const playSound = (sound: HTMLAudioElement | null) => {
    if (!isMuted && sound && sound !== sounds.current.ambiance) {
      sound.currentTime = 0;
      sound.play().catch(error => console.log(`Audio play error: ${error.message}`));
    }
  };

  // Détermine les détails de l'agent actuel en fonction de la langue sélectionnée
  const currentAgent = agentDetails[language] || agentDetails['default'];
  const agentName = currentAgent.name;
  const agentAvatarSrc = currentAgent.avatarPath;


  useEffect(() => {
    // Le message de bienvenue initial de l'agent est directement tiré des traductions
    const welcomeMessageContent = getTranslation('chat', 'welcomeMessage', language);
    setMessages([{ role: 'assistant', content: welcomeMessageContent }]);
  }, [language]);

  // Fonction pour obtenir l'avatar de l'assistant
  const getAssistantAvatar = () => {
    return (
      <img
        src={agentAvatarSrc}
        alt={`Avatar de ${agentName}`}
      />
    );
  };

  // Fonction pour obtenir l'avatar de l'utilisateur (dépend maintenant de la langue)
  const getUserAvatar = () => {
    const userAvatarSrc = userAvatarsMapping[language] || userAvatarsMapping['default'];
    return (
      <img
        src={userAvatarSrc}
        alt="Votre avatar"
      />
    );
  };

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      playSound(sounds.current.send);
      setMessages(prevMessages => [
        ...prevMessages,
        { role: 'user', content: inputValue.trim() }
      ]);
      setInputValue('');
      setIsLoading(true);

      setTimeout(() => {
        setMessages(prevMessages => [
          ...prevMessages,
          { role: 'assistant', content: `Ceci est une réponse simulée de ${agentName}.` }
        ]);
        setIsLoading(false);
      }, 1500);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key.length === 1) playSound(sounds.current.typing);
    if (e.key === 'Enter' && !isLoading) handleSendMessage();
  };

  const messageAreaClassName = (msgRole: string) => [styles.messageBubble, msgRole === 'user' ? styles.userMessage : styles.assistantMessage].join(' ');

  // Définition des couleurs basées sur le thème
  const textColor = theme === 'dark' ? '#E0E0E0' : '#111827';
  const mutedTextColor = theme === 'dark' ? '#A0A0A0' : '#6b7280';
  const highlightColor = theme === 'dark' ? '#8BC4FF' : '#4A90E2';
  const backgroundColorPage = theme === 'dark' ? '#1f2937' : '#ffffff';


  return (
    <div
      className={styles.chatContainer}
      style={{
        // Définition des variables CSS pour cette page via style prop
        '--kiwi-background-page': backgroundColorPage,
        '--kiwi-text-primary': textColor,
        '--kiwi-text-secondary': mutedTextColor,
        '--kiwi-highlight-color': highlightColor,
        // Autres variables que votre CSS module pourrait utiliser
        '--font-special-elite': "'Playfair Display', serif",
        '--font-courier-prime': "'Georgia', serif",
      } as React.CSSProperties}
    >
      <header className={styles.pageHeader}>
        <div className={styles.headerLeft}>
          <span>{getTranslation('header', 'missionStatement', language)}</span>
          <h1></h1>
        </div>
        <div className={styles.headerRight}>
          <button
            ref={muteButtonRef}
            onClick={() => {
                const newMutedState = !isMuted;
                setIsMuted(newMutedState);

                if (sounds.current.ambiance) {
                    if (newMutedState) {
                        sounds.current.ambiance.pause();
                    } else {
                        sounds.current.ambiance.play().catch(e => {
                            console.error("Erreur de lecture de l'ambiance (politique d'autoplay ou autre):", e);
                        });
                    }
                }
            }}
            className={styles.iconButton}
            title={isMuted ? "Activer la musique" : "Couper la musique"}
          >
            <img
              src="/images/gramophone.svg"
              alt="Icône Gramophone"
              width={24}
              height={24}
              className={styles.gramophoneIcon}
              style={{ opacity: isMuted ? 0.6 : 1 }}
            />
          </button>

          <button className={styles.moreButton} onClick={() => playSound(sounds.current.click)}>...</button>
          <button className={styles.shareButton} onClick={() => playSound(sounds.current.click)}>3D</button>
        </div>
      </header>
      <div className={styles.messagesArea}>
        {messages.map((msg, i) => (
          <div key={i} className={messageAreaClassName(msg.role)}>
            <div className={styles.avatar}>
              {msg.role === 'user' ? getUserAvatar() : getAssistantAvatar()}
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
              <i>{getTranslation('chat', 'thinking', language)}</i>
            </p>
          </div>
        )}
      </div>
      <footer className={styles.pageFooter}>
        <div className={styles.inputWrapper}>
          <button className={styles.iconButton} onClick={() => playSound(sounds.current.click)}><FaPaperclip /></button>
          <input
            type="text"
            placeholder={getTranslation('chat', 'placeholder', language)}
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
          />
        </div>
        <div className={styles.footerActions}>
          <div className={styles.footerActionsLeft}>
            <button className={styles.iconButton} onClick={() => playSound(sounds.current.click)}><FaImage /></button>
            <button className={styles.iconButton} onClick={() => playSound(sounds.current.click)}><FaKeyboard /></button>
            <button className={styles.iconButton} onClick={() => playSound(sounds.current.click)}><FaMicrophone /></button>
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

export default function ScanPage() { // Renommé en ScanPage pour sa nouvelle localisation
  // Cette variable doit être gérée par un état d'authentification réel
  const isLoggedIn = true; // Conservez ceci pour la démo, mais c'est ici que votre logique d'authentification intervient

  return (
    <>
      {isLoggedIn ? <ChatInterface /> : <WelcomeInterface />}
    </>
  );
}