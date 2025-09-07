'use client';

import { useState, FormEvent, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageCode } from '@/types';
import Image from 'next/image';
import { FaPaperPlane, FaDownload, FaBars } from 'react-icons/fa';
import styles from './page.module.css';

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
      fr: "Agent L.I.O.N. réfléchit...",
      mi: "Kei te whakaaro a Agent K.T.K....",
      ga: "Tá Agent ☘️ R.O.C.K. ag smaoineamh...",
      hi: "एजेंट ☸️ C.K.R. सोच रहा है...",
      gd: "Tha Agent 🌸 T.H.O.R.N. a' smaoineachadh...",
      cy: "Mae Asiant yn meddwl...",
      'en-AU': "Agent ✨ D.G.R.'s thinkin'...",
      'en-NZ': "Agent 🌿 FERN's thinking...",
      'en-CA': "Agent 🍁 M.A.P.L. is thinking...",
      'fr-CA': "Agent 🍁 M.A.P.L. réfléchit...",
      'en-ZA': "Agent 🇿🇦 P.R.T. is thinking...",
      af: "Agent 🇿🇦 P.R.T. dink...",
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
      'en-AU': 'Military Packages', 'en-NZ': 'Military Packages', 'en-CA': 'Military Packages',
      'fr-CA': 'Paquetages Militaires', 'en-ZA': 'Militêre Pakkette', af: 'Militêre Pakkette',
    },
  },
  loginPage: {
    title: {
      en: 'Building in the shadows. Emerging for tomorrow.',
      fr: "Construire dans l’ombre. Émerger pour demain.",
      mi: "AI matatau. Kei ō ringa.",
      ga: "AI den scoth. I do lámha.",
      hi: "अत्याधुनिक एआई। आपके हाथों में।",
      gd: "AI ùr-nodha. Na làmhan agad.",
      af: "Gevorderde KI. In jou hande.",
    },
    subtitle: {
      en: 'Kiwi-Ops. Intelligence that adapts to you',
      fr: "Kiwi-Ops. L’intelligence qui s’adapte à vous",
      mi: "AI ā-mōkihi mō ngā kaiwhakawhanake katoa.",
      ga: "AI modúlach do gach forbróir.",
      hi: "सभी डेवलपर्स के लिए मॉड्यूलर एआई।",
      gd: "AI modular airson a h-uile leasaiche.",
      af: "Modulêre KI vir alle ontwikkelaars.",
    },
    chatButton: {
      en: 'Ask the Chat',
      fr: 'Demandez au Chat',
      mi: 'Pātai ki te Kōrero',
      ga: 'Fiafraigh den Chomhrá',
      hi: 'चैट से पूछें',
      gd: 'Faighnich don Chat',
      af: 'Vra die Chat',
    },
    chatTitle: {
      en: 'Chat with AI',
      fr: "Chat avec l'IA",
      mi: "Kōrero ki te AI",
      ga: "Comhrá leis an AI",
      hi: "एआई से चैट करें",
      gd: "Cabadaich leis an AI",
      af: "Gesels met KI",
    },
    chatInputPlaceholder: {
      en: 'Write your message here...',
      fr: 'Écrivez votre message ici...',
      mi: 'Tuhia tō karere ki konei...',
      ga: 'Scríobh do theachtaireacht anseo...',
      hi: 'यहां अपना संदेश लिखें...',
      gd: 'Sgrìobh do theachdaireachd an seo...',
      af: 'Skryf jou boodskap hier...',
    },
    installAppLabel: {
      en: 'Install App',
      fr: "Installer l'Application",
      mi: "Tāuta Taupānga",
      ga: "Suiteáil Aip",
      hi: "ऐप इंस्टॉल करें",
      gd: "Stàlaich App",
      af: "Installeer Toep",
    },
    product: { en: 'Product', fr: 'Produit', mi: 'Hua', ga: 'Táirge', hi: 'उत्पाद', gd: 'Bathar', af: 'Produk' },
    features: { en: 'Features', fr: 'Fonctionnalités', mi: 'Āhuatanga', ga: 'Gnéithe', hi: 'विशेषताएँ', gd: 'Feartan', af: 'Kenmerke' },
    story: { en: 'Our Story', fr: 'Notre histoire', mi: 'To mātou kōrero', ga: 'Ár Scéal', hi: 'हमारी कहानी', gd: 'Ar Sgeulachd', af: 'Ons Verhaal' },
    search: { en: 'Search', fr: 'Recherche', mi: 'Rapua', ga: 'Cuardaigh', hi: 'खोजें', gd: 'Lorg', af: 'Soek' },
  },
};

// ----------------------
// Helpers
// ----------------------
function getTranslation(section: keyof typeof allTranslations, key: string, language: LanguageCode): string {
  const value: any = (allTranslations as any)[section]?.[key];
  if (typeof value === 'object') return value[language] || value.en || '';
  return value || '';
}

// ----------------------
// Chat component
// ----------------------
interface Message {
  id: number;
  sender: 'user' | 'ai';
  text: string;
  avatar: string;
}

const ChatInterface = ({ language }: { language: LanguageCode }) => {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, sender: 'ai', text: getTranslation('chat', 'welcomeMessage', language), avatar: '/avatars/avatar-ai.png' },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Met à jour seulement le message de bienvenue lors du changement de langue
  useEffect(() => {
    setMessages(prev =>
      prev.map(m =>
        m.id === 1 && m.sender === 'ai'
          ? { ...m, text: getTranslation('chat', 'welcomeMessage', language) }
          : m
      )
    );
  }, [language]);

  const handleSendMessage = (e: FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const newUserMessage: Message = { id: messages.length + 1, sender: 'user', text: inputMessage, avatar: '/avatars/avatar-user.png'};
    setMessages(prev => [...prev, newUserMessage]);
    setInputMessage('');

    setTimeout(() => {
      const aiResponse: Message = {
        id: messages.length + 2,
        sender: 'ai',
        text: getTranslation('chat', 'thinking', language),
        avatar: '/avatars/avatar-ai.png',
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className={styles.chatContainer}>
      <div className={styles.chatHeader}>
        <h3>{getTranslation('loginPage', 'chatTitle', language)}</h3>
      </div>
      <div className={styles.chatMessages}>
        {messages.map(m => (
          <div key={m.id} className={`${styles.message} ${styles[m.sender]}`}>
            <Image src={m.avatar} alt={m.sender} width={30} height={30} className={styles.avatar} />
            <div className={styles.messageBubble}>{m.text}</div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSendMessage} className={styles.chatInputForm}>
        <input
          type="text"
          value={inputMessage}
          onChange={e => setInputMessage(e.target.value)}
          placeholder={getTranslation('chat', 'placeholder', language)}
          className={styles.chatInputField}
        />
        <button type="submit" className={styles.sendButton}><FaPaperPlane /></button>
      </form>
    </div>
  );
};

// ----------------------
// Main Page
// ----------------------
export default function ChatLoginPage() {
  const { theme } = useTheme();
  const { language } = useLanguage();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleInstallClick = () => router.push('/install');

  return (
    <div className={`${styles.pageContainer} ${theme === 'dark' ? styles.darkMode : styles.lightMode}`}>
      {/* Navbar */}
      <nav className={styles.navbar}>
        <div className={styles.navLogo}>Kiwi-Ops</div>
        <button className={styles.menuToggle} onClick={() => setMenuOpen(!menuOpen)}><FaBars /></button>
        <ul className={`${styles.navLinks} ${menuOpen ? styles.open : ''}`}>
          <li><Link href="#product">{getTranslation('loginPage', 'product', language)}</Link></li>
          <li><Link href="#features">{getTranslation('loginPage', 'features', language)}</Link></li>
          <li><Link href="#story">{getTranslation('loginPage', 'story', language)}</Link></li>
          <li><Link href="#search">{getTranslation('loginPage', 'search', language)}</Link></li>
        </ul>
        <button className={styles.installButton} onClick={handleInstallClick} aria-label={getTranslation('loginPage', 'installAppLabel', language)}><FaDownload /></button>
      </nav>

      {/* Background */}
      <div className={styles.poppyBackground}>
        <img src={theme === 'dark' ? '/images/poppy-image-darkmode.png' : '/images/poppy-image.png'} alt="coquelicot" />
        {theme === 'dark' && <div className={styles.darkOverlay}></div>}
      </div>

      {/* Main content */}
      <div className={styles.contentWrapper}>
        <div className={styles.textSection}>
          <h1 className={styles.title}>{getTranslation('loginPage', 'title', language)}</h1>
          <p className={styles.subtitle}>{getTranslation('loginPage', 'subtitle', language)}</p>
          <button className={styles.askChatButton} onClick={() => console.log("Demander au Chat")}>
            {getTranslation('loginPage', 'chatButton', language)}
          </button>
        </div>
        <div className={styles.chatSection}>
          <ChatInterface language={language} />
        </div>
      </div>
    </div>
  );
}
