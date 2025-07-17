// Fichier : src/app/page.tsx
'use client'; // Gardez ceci si vous avez des hooks ou des interactions client

import React, { useState, KeyboardEvent, useEffect, useRef } from 'react';
import styles from './page.module.css'; // S'assure que page.module.css est bien importé
import { FaPaperclip, FaImage, FaKeyboard, FaMicrophone } from 'react-icons/fa'; // FaPlayCircle n'est plus utilisé dans votre WelcomeInterface si elle est retirée
import { useLanguage } from '@/contexts/LanguageContext';

// --- INTERFACES & TRADUCTIONS ---
interface Message {
  role: string;
  content: string;
}

// Chemins des fichiers images des drapeaux
const flagAvatars: { [key: string]: string } = {
  'en-AU': '/avatars/australian.png', 'en-CA': '/avatars/canada.jpg', 'fr-CA': '/avatars/canada.jpg',
  'en': '/avatars/england.png', 'hi': '/avatars/india.png', 'en-NZ': '/avatars/new-zealand.png',
  'mi': '/avatars/maoripioneer.png', 'en-ZA': '/avatars/south-africa.png', 'af': '/avatars/south-africa.png',
  'ga': '/avatars/irish.png', 'gd': '/avatars/scottish.jpg', // Correction: Ajoutez 'gd' pour écossais
  // 'cy': '/avatars/welsh.jpg', // Si vous n'avez pas de déploiement spécifique gallois, ou n'utilisez pas
  'fr': '/avatars/france.png',
};

// Chemins des fichiers images des avatars symboliques
const symbolicAgentAvatars: { [key: string]: string } = {
  'lion': '/avatars/lion.png', // L'avatar du Lion d'Arras pour la France
  'alan_turing': '/avatars/alan_turing.png', // Pour Alan Turing (Angleterre)
  'johnny_clegg': '/avatars/johnny_clegg.png', // Pour Johnny Clegg (Afrique du Sud)
  'gandhi': '/avatars/gandhi.png', // Pour Gandhi (Inde)
  // Ajoutez d'autres avatars au fur et à mesure que vous les créez
  'maple': '/avatars/maple.svg', // Pour Canada
  'rock': '/avatars/rock.png', // Pour Irlande (si lié à un symbole ou paysage)
  'thorn': '/avatars/thorn.png', // Pour Écosse (si lié à un symbole ou paysage)
  'fern': '/avatars/fern.png', // Pour Nouvelle-Zélande
  'southerncross': '/avatars/southerncross.png', // Pour Australie
  'ktk': '/avatars/ktk.png', // Pour Māori (si vous avez un agent spécifique Māori)
};

// Noms des agents et le chemin de leur avatar, personnalisés par langue/culture
const agentDetails: { [key: string]: { name: string; avatarPath: string } } = {
  'fr': { name: 'L.I.O.N.', avatarPath: symbolicAgentAvatars.lion || flagAvatars.fr },
  // Canada (fr et en)
  'en-CA': { name: '🍁 M.A.P.L.', avatarPath: symbolicAgentAvatars.maple || flagAvatars['en-CA'] },
  'fr-CA': { name: '🍁 M.A.P.L.', avatarPath: symbolicAgentAvatars.maple || flagAvatars['fr-CA'] },
  // Irlande
  'ga': { name: '☘️ R.O.C.K.', avatarPath: symbolicAgentAvatars.rock || flagAvatars.ga },
  // Écosse
  'gd': { name: '🌸 T.H.O.R.N.', avatarPath: symbolicAgentAvatars.thorn || flagAvatars.gd },
  // Nouvelle-Zélande
  'en-NZ': { name: '🌿 FERN', avatarPath: symbolicAgentAvatars.fern || flagAvatars['en-NZ'] },
  // Maōri (si vous avez un déploiement spécifique Māori et un agent dédié)
  'mi': { name: '⚫⚪🔴 K.T.K.', avatarPath: symbolicAgentAvatars.ktk || flagAvatars.mi },
  // Australie
  'en-AU': { name: '✨ D.G.R.', avatarPath: symbolicAgentAvatars.southerncross || flagAvatars['en-AU'] },
  // Inde
  'hi': { name: '☸️ G.A.N.D.H.I.', avatarPath: symbolicAgentAvatars.gandhi || flagAvatars.hi }, // Renommé en G.A.N.D.H.I.
  // Afrique du Sud
  'en-ZA': { name: '🇿🇦 J.C.', avatarPath: symbolicAgentAvatars.johnny_clegg || flagAvatars['en-ZA'] }, // Renommé en J.C. pour Johnny Clegg
  'af': { name: '🇿🇦 J.C.', avatarPath: symbolicAgentAvatars.johnny_clegg || flagAvatars.af }, // Renommé en J.C. pour Johnny Clegg
  // Angleterre (UK)
  'en': { name: 'A.L.A.N.', avatarPath: symbolicAgentAvatars.alan_turing || flagAvatars.en }, // Renommé en A.L.A.N. pour Alan Turing
  // Agent par défaut si la langue n'est pas trouvée
  'default': { name: 'L.I.O.N.', avatarPath: symbolicAgentAvatars.lion || flagAvatars.fr }
};

// Mappage des avatars utilisateur (peut aussi être personnalisé par langue si besoin)
const userAvatarsMapping: { [key: string]: string } = {
  ...flagAvatars, // Utilise les drapeaux comme avatars utilisateur par défaut pour ces langues
  'default': '/avatars/human.png', // Avatar générique pour l'utilisateur
};

// Traductions de l'interface utilisateur
const translations = {
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
      en: "Hello! I'm A.L.A.N. (nod to Alan Turing). How can I help you today?", // Message pour Alan Turing
      fr: "Bonjour ! Je suis l'Agent L.I.O.N. Comment puis-je vous aider aujourd'hui ?",
      mi: "Kia ora! Ko Agent K.T.K. ahau. Me pēhea taku āwhina i a koe i tēnei rā?",
      ga: "Dia duit! Is mise Agent ☘️ R.O.C.K.. Conas is féidir liom cabhrú leat inniu?",
      hi: "नमस्ते! मैं एजेंट ☸️ G.A.N.D.H.I. हूँ। आज मैं आपकी कैसे मदद कर सकता हूँ?", // Message pour Gandhi
      gd: "Halo! 'S mise Agent 🌸 T.H.O.R.N.. Ciamar as urrainn dhomh do chuideachadh an-diugh?",
      'en-AU': "G'day! I'm Agent ✨ D.G.R.. How can I help ya today?",
      'en-NZ': "Kia ora! I'm Agent 🌿 FERN. How can I help you today?",
      'en-CA': "Hey there! I'm Agent 🍁 M.A.P.L.. How can I help you today, eh?",
      'fr-CA': "Bonjour ! Je suis l'Agent 🍁 M.A.P.L.. Comment puis-je vous aider aujourd'hui ?",
      'en-ZA': "Howzit! I'm Agent 🇿🇦 J.C. (nod to Johnny Clegg). How can I help you today?", // Message pour Johnny Clegg
      af: "Goeiedag! Ek is Agent 🇿🇦 J.C. Hoe kan ek jou vandag help?", // Message pour Johnny Clegg (Afrikaans)
    },
    thinking: {
      en: 'Agent is thinking...', // Plus générique
      fr: 'Agent L.I.O.N. réfléchit...',
      mi: 'Kei te whakaaro a Agent K.T.K....',
      ga: 'Tá Agent ☘️ R.O.C.K. ag smaoineamh...',
      hi: 'एजेंट ☸️ G.A.N.D.H.I. सोच रहा है...',
      gd: 'Tha Agent 🌸 T.H.O.R.N. a\' smaoineachadh...',
      'en-AU': 'Agent ✨ D.G.R.\'s thinkin\'...',
      'en-NZ': 'Agent 🌿 FERN\'s thinking...',
      'en-CA': 'Agent 🍁 M.A.P.L. is thinking...',
      'fr-CA': 'Agent 🍁 M.A.P.L. réfléchit...',
      'en-ZA': 'Agent 🇿🇦 J.C. is thinking...',
      af: 'Agent 🇿🇦 J.C. dink...',
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
  // La section welcome est conservée telle quelle, car elle ne concerne pas l'agent K
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
      fr: "Tapez ici une tâche à confier à l'Agent L.I.O.N.", // MIS A JOUR pour L.I.O.N.
      mi: 'Tāpaea tēnei ki Agent K', // Si agent K est générique pour le welcome screen
      ga: 'Clóscríobh anseo chun tasc a thabhairt do Agent K',
      hi: 'यहां एजेंट के को एक कार्य देने के लिए टाइप करें',
      gd: 'Sgrìobh an here gus gnìomh a thoirt do Agent K',
      'en-AU': 'Type here to give a task to Agent K',
      'en-NZ': 'Type here to give a task to Agent K',
      'en-CA': 'Type here to give a task to Agent K',
      'fr-CA': "Tapez ici une tâche à confier à l'Agent L.I.O.N.", // MIS A JOUR pour L.I.O.N.
      'en-ZA': 'Type here to give a task to Agent K',
      af: 'Tik hier om Agent K \'n taak te gee',
    },
  },
  sidebar: {
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
      click: new Audio('/sounds/click_ui.mp3'), // Conserver click_ui.mp3 pour les clics
      send: new Audio('/sounds/morse_signal.mp3'), // Utilise morse_signal.mp3 pour l'envoi
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
  const agentAvatarSrc = currentAgent.avatarPath; // L'avatar de l'agent est directement dans agentDetails.avatarPath


  useEffect(() => {
    // Le message de bienvenue initial de l'agent est directement tiré des traductions
    const welcomeMessageContent = translations.chat.welcomeMessage[language] || translations.chat.welcomeMessage.en;
    setMessages([{ role: 'assistant', content: welcomeMessageContent }]);
  }, [language]);

  // Fonction pour obtenir l'avatar de l'assistant
  const getAssistantAvatar = () => {
    return (
      <img
        src={agentAvatarSrc} // Utilise le chemin de l'avatar de l'agent déterminé dynamiquement
        alt={`Avatar de ${agentName}`} // Texte alternatif dynamique pour l'accessibilité
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
          // Réponse simulée de l'agent (utilisant le nom de l'agent actuel)
          { role: 'assistant', content: `Ceci est une réponse simulée de l'Agent ${agentName}.` }
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

  return (
    <div className={styles.chatContainer}>
      <header className={styles.pageHeader}>
        <div className={styles.headerLeft}>
          {/* Correction: Supprimer le h1 vide ici si le span est suffisant */}
          <span>{translations.header.missionStatement[language] || translations.header.missionStatement.en}</span>
          {/* <h1></h1> */}
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
                        // Tenter de jouer si non-muted et pas déjà en cours
                        // Cette ligne n'est peut-être pas nécessaire ici si l'ambiance est loop
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
              <i>{translations.chat.thinking[language] || translations.chat.thinking.en}</i>
            </p>
          </div>
        )}
      </div>
      <footer className={styles.pageFooter}>
        <div className={styles.inputWrapper}>
          <button className={styles.iconButton} onClick={() => playSound(sounds.current.click)}><FaPaperclip /></button>
          <input
            type="text"
            placeholder={translations.chat.placeholder[language] || translations.chat.placeholder.en}
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


// La WelcomeInterface a été simplifiée ou retirée dans les discussions précédentes.
// Si elle est utilisée, vérifiez son intégration et son affichage.
const WelcomeInterface = () => {
  const { language } = useLanguage();
  return (
    <div className={styles.welcomeContainer}>
      <div className={styles.welcomeLogo}>
        {/* L'icône 'O' ici n'est pas rendue comme dans la sidebar (où elle pourrait être un composant). */}
        {/* Si l'objectif est d'utiliser le logo 'o' de Kiwi-Ops, il faudrait s'assurer que c'est le même composant ou style */}
        <div className={styles.logoIcon}>O</div>
        <h1>{translations.welcome.headline[language] || translations.welcome.headline.en}</h1>
      </div>
      <div className={styles.welcomeCard}>
        {/* FaPlayCircle n'est pas importé s'il n'est pas utilisé ailleurs */}
        {/* <div className={styles.videoThumbnail}><FaPlayCircle /></div> */}
        <div className={styles.cardText}>
          <p><strong>{translations.welcome.watch[language] || translations.welcome.watch.en}</strong></p>
          <p>{translations.welcome.intro[language] || translations.welcome.intro.en}</p>
        </div>
        <button className={styles.closeCardButton}>×</button>
      </div>
      <div className={styles.inputBar}>{translations.welcome.inputBar[language] || translations.welcome.inputBar.en}</div>
    </div>
  );
};

export default function Page() {
  const isLoggedIn = true; // Définissez cette variable en fonction de votre logique d'authentification

  return (
    <>
      {isLoggedIn ? <ChatInterface /> : <WelcomeInterface />}
    </>
  );
}