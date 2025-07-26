'use client';

import React, { useState, useRef, useEffect } from 'react';
import styles from './paquetages.module.css';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { LanguageCode } from '@/types';

// AJOUT : Import des icônes pour les nouvelles fonctionnalités
import { FaHeartbeat, FaMicrophoneAlt, FaHands } from 'react-icons/fa';

// ---- Objet de traduction ENTIÈREMENT REVU ----
const allTranslations = {
  agentHeartPage: { // Le nom de la section a été changé pour correspondre au nouveau thème
    headline: {
      en: "Agent's Core",
      fr: "Cœur de l'Agent",
    },
    intro: {
      en: "Access the agent's advanced biometric and communication systems.",
      fr: "Accédez aux systèmes biométriques et de communication avancés de l'agent.",
    },
    packageHeart: {
      name: { en: "Heartbeat", fr: "Rythme Cardiaque" },
      description: {
        en: "Listen to the agent's real-time biometric rhythm. Steady and ready.",
        fr: "Écoutez le rythme biométrique de l'agent en temps réel. Calme et prêt.",
      },
      cta: { en: "Listen", fr: "Écouter" },
      ctaStop: { en: "Stop", fr: "Arrêter" },
    },
    packageVoice: {
      name: { en: "Agent's Voice", fr: "Voix de l'Agent" },
      description: {
        en: "Activate the microphone to transmit with a synthesized vocoder voice for covert operations.",
        fr: "Activez le microphone pour transmettre avec une voix de vocodeur pour les opérations secrètes.",
      },
      cta: { en: "Activate Microphone", fr: "Activer le Micro" },
      ctaActive: { en: "Microphone Active", fr: "Micro Actif" },
    },
    packageSign: {
      name: { en: "Silent Communication", fr: "Communication Silencieuse" },
      description: {
        en: "Use your webcam to communicate using sign language. (SignGemma technology coming soon).",
        fr: "Utilisez votre webcam pour communiquer en langage des signes. (Technologie SignGemma à venir).",
      },
      cta: { en: "Initialize", fr: "Initialiser" },
    },
  },
};

// -------- La fonction de traduction (inchangée) --------
function getTranslationPath(path: string, lang: LanguageCode): string {
  const keys = path.split('.');
  let curr: any = allTranslations;
  for (const key of keys) curr = curr?.[key];
  if (!curr || typeof curr !== 'object' || !('en' in curr)) {
    console.warn(`Translation missing for: ${path} in language ${lang}`);
    return `[${path}]`;
  }
  return curr[lang] || curr.en;
}

// -------- Le composant principal ENTIÈREMENT REVU --------
const AgentCorePage: React.FC = () => {
  const { language } = useLanguage();
  const { theme } = useTheme();

  // --- États pour les fonctionnalités interactives ---
  const [isHeartbeatPlaying, setIsHeartbeatPlaying] = useState(false);
  const [micStatus, setMicStatus] = useState<'idle' | 'active' | 'error'>('idle');
  const heartSoundRef = useRef<HTMLAudioElement | null>(null);

  // Initialisation du son du cœur
  useEffect(() => {
    // Assurez-vous d'avoir un son de battement de coeur en boucle ici
    heartSoundRef.current = new Audio('/sounds/heartbeat_loop.mp3'); 
    heartSoundRef.current.loop = true;

    // Nettoyage : arrête le son quand on quitte la page
    return () => {
      heartSoundRef.current?.pause();
    };
  }, []);

  // --- Gestionnaires d'événements ---
  const toggleHeartbeat = () => {
    const sound = heartSoundRef.current;
    if (!sound) return;

    if (isHeartbeatPlaying) {
      sound.pause();
    } else {
      sound.play().catch(e => console.error("Heartbeat sound error:", e));
    }
    setIsHeartbeatPlaying(!isHeartbeatPlaying);
  };

  const handleMicAccess = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      alert("Votre navigateur ne supporte pas l'accès au microphone.");
      setMicStatus('error');
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // Le micro est actif. Ici, vous intégreriez la logique du vocoder.
      setMicStatus('active');
      console.log("Microphone accessible. Stream:", stream);
      // NOTE: Le stream doit être géré (par ex. stoppé) pour libérer le micro.
    } catch (err) {
      console.error("Erreur d'accès au microphone:", err);
      setMicStatus('error');
    }
  };
  
  const handleSignFeature = () => {
    alert(getTranslationPath('agentHeartPage.packageSign.description', language));
  };


  // --- Variables de style (inchangées) ---
  const backgroundColor = theme === 'dark' ? '#1f2937' : '#ffffff';
  const textColor = theme === 'dark' ? '#E0E0E0' : '#111827';
  const cardBgColor = theme === 'dark' ? '#2A2A3A' : '#F8F8F8';
  const borderColor = theme === 'dark' ? '#555555' : '#e5e7eb';
  const highlightColor = theme === 'dark' ? '#0070f3' : '#0070f3';

  return (
    <div
      className={styles.container}
      style={{
        '--kiwi-background-page': backgroundColor,
        '--kiwi-text-primary': textColor,
        '--kiwi-background-card': cardBgColor,
        '--kiwi-border-color': borderColor,
        '--kiwi-highlight-color': highlightColor,
      } as React.CSSProperties}
    >
      <h1 className={styles.headline}>
        {getTranslationPath('agentHeartPage.headline', language)}
      </h1>
      <p className={styles.intro}>
        {getTranslationPath('agentHeartPage.intro', language)}
      </p>

      <div className={styles.packagesGrid}>
        {/* Module Cœur */}
        <div className={styles.packageCard}>
          <FaHeartbeat className={styles.packageIcon} />
          <h2 className={styles.packageName}>
            {getTranslationPath('agentHeartPage.packageHeart.name', language)}
          </h2>
          <p className={styles.packageDescription}>
            {getTranslationPath('agentHeartPage.packageHeart.description', language)}
          </p>
          <button className={styles.packageCta} onClick={toggleHeartbeat}>
            {isHeartbeatPlaying 
              ? getTranslationPath('agentHeartPage.packageHeart.ctaStop', language)
              : getTranslationPath('agentHeartPage.packageHeart.cta', language)
            }
          </button>
        </div>

        {/* Module Voix */}
        <div className={styles.packageCard}>
          <FaMicrophoneAlt className={styles.packageIcon} />
          <h2 className={styles.packageName}>
            {getTranslationPath('agentHeartPage.packageVoice.name', language)}
          </h2>
          <p className={styles.packageDescription}>
            {getTranslationPath('agentHeartPage.packageVoice.description', language)}
          </p>
          <button className={styles.packageCta} onClick={handleMicAccess} disabled={micStatus === 'active'}>
            {micStatus === 'active'
              ? getTranslationPath('agentHeartPage.packageVoice.ctaActive', language)
              : getTranslationPath('agentHeartPage.packageVoice.cta', language)
            }
          </button>
        </div>

        {/* Module Langage des Signes */}
        <div className={styles.packageCard}>
          <FaHands className={styles.packageIcon} />
          <h2 className={styles.packageName}>
            {getTranslationPath('agentHeartPage.packageSign.name', language)}
          </h2>
          <p className={styles.packageDescription}>
            {getTranslationPath('agentHeartPage.packageSign.description', language)}
          </p>
          <button className={styles.packageCta} onClick={handleSignFeature}>
            {getTranslationPath('agentHeartPage.packageSign.cta', language)}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AgentCorePage;