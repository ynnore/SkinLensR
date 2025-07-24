'use client';

export const dynamic = "force-dynamic";

import React, { useState, useEffect, useRef, KeyboardEvent } from 'react';
import styles from './scan.module.css';
import { useRouter } from 'next/navigation';

import { 
  FaImage, FaKeyboard, FaMicrophone, FaPlayCircle, FaPlus, FaToolbox,
  FaBullhorn 
} from 'react-icons/fa';

import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { LanguageCode } from '@/types';

// === Avatars ===
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

// === Types ===
interface Message {
  role: 'user' | 'assistant';
  content: string;
}

// ✅ TRADUCTIONS COMPLÈTES (ajout packagesPage.*)
const allTranslations = {
  header: {
    missionStatement: {
      fr: "Inspirés des tunneliers de Wellington à Arras, notre mission est de bâtir dans l’ombre ce qui, demain, percera la surface.",
      en: "Inspired by the Wellington Tunnelers of Arras, our mission is to build in the shadows what will, tomorrow, break through to the surface.",
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
  welcome: {
    headline: {
      en: "Operation W", fr: "Opération W", mi: "Operesihona W", ga: "Oibríocht W", hi: "ऑपरेशन डब्ल्यू", gd: "Obrachadh W", cy: "Ymgyrch W",
      'en-AU': "Operation W", 'en-NZ': "Operation W", 'en-CA': "Operation W", 'fr-CA': "Opération W", 'en-ZA': "Operasie W", af: "Operasie W",
    },
    watch: {
      en: 'Watch', fr: 'Regarder', mi: 'Mātakitaki', ga: 'Féach', hi: 'देखो', gd: 'Coimhead', cy: 'Gwylio',
      'en-AU': 'Watch', 'en-NZ': 'Watch', 'en-CA': 'Watch', 'fr-CA': 'Regarder', 'en-ZA': 'Watch', af: 'Kyk',
    },
    intro: {
       en: 'Getting started with Operation W',
      fr: 'Bien démarrer avec Opération W',
      mi: 'Kei te timata ki Operation W',
      ga: 'Ag tosú le Operation W',
      hi: 'ऑपरेशन डब्ल्यू के साथ शुरुआत करना',
      gd: 'A\' tòiseachadh le Operation W',
      cy: 'Dechrau gyda Ymgyrch W',
      'en-AU': 'Getting started with Operation W', 'en-NZ': 'Getting started with Operation W', 'en-CA': 'Getting started with Operation W', 'fr-CA': 'Bien démarrer avec Opération W', 'en-ZA': 'Begin met Operasie W', af: 'Begin met Operasie W',
    },
    inputBar: {
      en: 'Type here to give a task to Agent K',
      fr: "Tapez ici une tâche à confier à l'Agent K",
      mi: 'Tāpaea tēnei ki Agent K',
      ga: 'Clóscríobh anseo chun tasc a thabhairt do Agent K',
      hi: 'यहां एजेंट के को एक कार्य देने के लिए टाइप करें',
      gd: 'Sgrìobh an here gus gnìomh a thoirt do Agent K',
      cy: 'Teipiwch yma i roi tasg i Asiant K',
      'en-AU': 'Type here to give a task to Agent K', 'en-NZ': 'Type here to give a task to Agent K', 'en-CA': 'Type here to give a task to Agent K', 'fr-CA': "Tapez ici une tâche à confier à l'Agent K", 'en-ZA': 'Tik hier om Agent K \'n taak te gee', af: 'Tik hier om Agent K \'n taak te gee',
    },
  },
  packagesPage: {
    packageCadet: {
      en: "Cadet Package", fr: "Pack Cadet", mi: "Mōkī Kāreti", ga: "Pacáiste Caidéata", hi: "कैडेट पैकेज", gd: "Pasgan Cadet", cy: "Pecyn Cadet",
      'en-AU': "Cadet Package", 'en-NZ': "Cadet Package", 'en-CA': "Cadet Package", 'fr-CA': "Pack Cadet", 'en-ZA': "Kadet Pakket", af: "Kadet Pakket"
    },
    packageOperative: {
      en: "Operative Package", fr: "Pack Opératif", mi: "Mōkī Kaiwhakahaere", ga: "Pacáiste Oibrí", hi: "ऑपरेटिव पैकेज", gd: "Pasgan Obrach", cy: "Pecyn Gweithredol",
      'en-AU': "Operative Package", 'en-NZ': "Operative Package", 'en-CA': "Operative Package", 'fr-CA': "Pack Opératif", 'en-ZA': "Operatiewe Pakket", af: "Operatiewe Pakket"
    },
    packageOfficer: {
      en: "Officer Package", fr: "Pack Officier", mi: "Mōkī Āpiha", ga: "Pacáiste Oifigeach", hi: "ऑफिसर पैकेज", gd: "Pasgan Oifigear", cy: "Pecyn Swyddog",
      'en-AU': "Officer Package", 'en-NZ': "Officer Package", 'en-CA': "Officer Package", 'fr-CA': "Pack Officier", 'en-ZA': "Beampte Pakket", af: "Beampte Pakket"
    }
  }
};

function getTranslation(section: keyof typeof allTranslations, key: string, language: LanguageCode): string {
  const sectionData = allTranslations[section] as Record<string, Record<string, string>>;
  const translations = sectionData?.[key];
  return translations?.[language] || translations?.en || '';
}

// === Chat Interface ===
const ChatInterface: React.FC = () => {
  const { language } = useLanguage();
  const { theme } = useTheme();
  const router = useRouter();

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const muteButtonRef = useRef<HTMLButtonElement>(null);

  // Sons initialisés uniquement côté client
  const sounds = useRef<{ click?: HTMLAudioElement; send?: HTMLAudioElement; typing?: HTMLAudioElement; ambiance?: HTMLAudioElement }>({});

  const currentAgent = agentDetails[language] || agentDetails.default;

  useEffect(() => {
    if (typeof window !== "undefined") {
      sounds.current.click = new Audio('/sounds/click_ui.mp3');
      sounds.current.send = new Audio('/sounds/morse_signal.mp3');
      sounds.current.typing = new Audio('/sounds/typewriter_key.mp3');
      sounds.current.ambiance = new Audio('/sounds/gramophone_music.mp3');

      if (sounds.current.ambiance) {
        sounds.current.click!.volume = 0.6;
        sounds.current.send!.volume = 0.7;
        sounds.current.typing!.volume = 0.5;
        sounds.current.ambiance.volume = 0.1;
        sounds.current.ambiance.loop = true;
        sounds.current.ambiance.muted = isMuted;
      }
    }

    const welcomeMessage = getTranslation('chat', 'welcomeMessage', language);
    setMessages([{ role: 'assistant', content: welcomeMessage }]);

    return () => {
      sounds.current.ambiance?.pause();
    };
  }, [language]);

  useEffect(() => {
    if (sounds.current.ambiance) sounds.current.ambiance.muted = isMuted;
  }, [isMuted]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const playSound = (sound?: HTMLAudioElement) => {
    if (!isMuted && sound) {
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
    const src = role === 'user' ? (userAvatarsMapping[language] || userAvatarsMapping.default) : currentAgent.avatarPath;
    return <img src={src} alt={role === 'user' ? 'User' : currentAgent.name} />;
  };

  const backgroundColor = theme === 'dark' ? '#1f2937' : '#ffffff';
  const textColor = theme === 'dark' ? '#E0E0E0' : '#111827';

  return (
    <div className={styles.chatContainer} style={{ background: backgroundColor, color: textColor }}>
      {/* HEADER */}
      <header className={styles.pageHeader}>
        <div className={styles.headerLeft}>
          <span>{getTranslation('header', 'missionStatement', language)}</span>
        </div>
        <div className={styles.headerRight}>
          <button ref={muteButtonRef} onClick={() => {
            const mute = !isMuted;
            setIsMuted(mute);
            if (!mute && sounds.current.ambiance) {
              sounds.current.ambiance.play().catch(() => {});
            }
          }} className={styles.iconButton}>
            <img src="/images/gramophone.svg" alt="Gramophone" width={24} height={24} style={{ opacity: isMuted ? 0.6 : 1 }} />
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
        <div ref={messagesEndRef} />
      </div>

      {/* FOOTER */}
      <footer className={styles.pageFooter}>
        <div className={styles.footerActionsLeft}>
          {[FaImage, FaKeyboard, FaMicrophone, FaToolbox, FaPlus, FaBullhorn].map((Icon, i) => (
            <button key={i} className={styles.iconButton} onClick={() => playSound(sounds.current.click)}>
              <Icon />
            </button>
          ))}
        </div>

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
