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

const allTranslations = {
  loginPage: {
    title: { en: 'Cutting-edge AI. In your hands.', fr: "L'IA de pointe. Entre vos mains." },
    subtitle: { en: 'Modular AI for all developers.', fr: "L'IA modulable pour tous les développeurs." },
    chatButton: { en: 'Ask the Chat', fr: 'Demandez au Chat' },
    chatTitle: { en: 'Chat with AI', fr: 'Chat avec l\'IA' },
    chatInputPlaceholder: { en: 'Write your message here...', fr: 'Écrivez votre message ici...' },
    installAppLabel: { en: 'Install App', fr: "Installer l'Application" },
    product: { en: 'Product', fr: 'Produit' },
    features: { en: 'Features', fr: 'Fonctionnalités' },
    pricing: { en: 'Pricing', fr: 'Tarifs' },
    contact: { en: 'Contact', fr: 'Contact' },
  },
};

function getTranslation<S extends keyof typeof allTranslations, K extends keyof typeof allTranslations[S]>(
  section: S,
  key: K,
  lang: LanguageCode
): string {
  const translations = (allTranslations[section] as any)?.[key];
  return translations?.[lang] || translations?.en || '';
}

interface Message {
  id: number;
  sender: 'user' | 'ai';
  text: string;
  avatar: string;
}

const ChatInterface = ({ language }: { language: LanguageCode }) => {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, sender: 'ai', text: 'Bonjour ! Comment puis-je vous aider aujourd\'hui ?', avatar: '/avatar-ai.png' },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = (e: FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const newUserMessage: Message = { id: messages.length + 1, sender: 'user', text: inputMessage, avatar: '/avatar-user.png' };
    setMessages(prev => [...prev, newUserMessage]);
    setInputMessage('');

    setTimeout(() => {
      const aiResponse: Message = {
        id: messages.length + 2,
        sender: 'ai',
        text: `Je traite votre requête : "${newUserMessage.text}".`,
        avatar: '/avatar-ai.png',
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
          placeholder={getTranslation('loginPage', 'chatInputPlaceholder', language)}
          className={styles.chatInputField}
        />
        <button type="submit" className={styles.sendButton}><FaPaperPlane /></button>
      </form>
    </div>
  );
};

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
          <li><Link href="#pricing">{getTranslation('loginPage', 'pricing', language)}</Link></li>
          <li><Link href="#contact">{getTranslation('loginPage', 'contact', language)}</Link></li>
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
