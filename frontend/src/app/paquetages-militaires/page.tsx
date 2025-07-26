'use client';

import React, { useState, useRef, useEffect } from 'react';
import styles from './paquetages.module.css';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { LanguageCode } from '@/types';

import { FaMicrophoneAlt, FaHands } from 'react-icons/fa';

// ---- Objet de traduction mis à jour et complété ----
const allTranslations = {
  agentHeartPage: {
    headline: {
      en: "Agent's Core",
      fr: "Cœur de l'Agent",
      mi: "Te Pokapū o te Āpiha",
      gd: "Crìoch an Neach-ionaid",
      ga: "Croí an Ghníomhaire",
      hi: "एजेंट का कोर",
      'fr-CA': "Noyau de l'Agent",
      af: "Agent se Kern",
    },
    intro: {
      en: "To listen to our agents, discretion is appreciated. Please do not disturb others.",
      fr: "Pour écouter nos agents, la discrétion est appréciée. Veuillez à ne pas gêner les autres.",
      mi: "Ki te whakarongo ki ā mātou āpiha, e tika ana te noho puku. Kaua e whakararuraru i ētahi atu.",
      gd: "Gus èisteachd ris na riochdairean againn, thathas a' cur luach air cothromachd. Na cuir dragh air daoine eile.",
      ga: "Chun éisteacht lenár ngníomhairí, is mór againn discréid. Ná cuir isteach ar dhaoine eile, le do thoil.",
      hi: "हमारे एजेंटों को सुनने के लिए, विवेक की सराहना की जाती है। कृपया दूसरों को परेशान न करें।",
      'fr-CA': "Pour écouter nos agents, la discrétion est de mise. Veuillez ne pas déranger les autres.",
      af: "Om na ons agente te luister, word diskresie waardeer. Moet asseblief nie ander steur nie.",
    },
    packageVoice: {
      name: { 
        en: "Agent's Voice", 
        fr: "Voix de l'Agent",
        mi: "Te Reo o te Āpiha",
        gd: "Guth an Neach-ionaid",
        ga: "Guth an Ghníomhaire",
        hi: "एजेंट की आवाज़",
        'fr-CA': "Voix de l'Agent",
        af: "Agent se Stem",
      },
      description: {
        en: "Activate the microphone to transmit with a synthesized vocoder voice for covert operations.",
        fr: "Activez le microphone pour transmettre avec une voix de vocodeur pour les opérations secrètes.",
        mi: "Whakahohehia te hopuorooro hei tuku kōrero mā te reo vocoder i hangaia mō ngā mahi huna.",
        gd: "Cuir am micreofon an gnìomh gus tar-chur le guth vocoder synthesized airson obraichean falaichte.",
        ga: "Gníomhachtaigh an micreafón chun tarchur le guth vocoder sintéisithe le haghaidh oibríochtaí ceilte.",
        hi: "गुप्त अभियानों के लिए संश्लेषित वोकोडर आवाज के साथ संचारित करने के लिए माइक्रोफोन को सक्रिय करें।",
        'fr-CA': "Activez le microphone pour transmettre avec une voix de vocodeur pour les opérations secrètes.",
        af: "Aktiveer die mikrofoon om met 'n gesintetiseerde vocoder-stem vir geheime operasies uit te saai.",
      },
      cta: { 
        en: "Activate Vocoder", 
        fr: "Activer Vocodeur",
        mi: "Whakahohe Vocoder",
        gd: "Cuir an Vocoder an Gnìomh",
        ga: "Gníomhachtaigh Vocoder",
        hi: "वोकोडर सक्रिय करें",
        'fr-CA': "Activer Vocodeur",
        af: "Aktiveer Vocoder",
      },
      ctaActive: { 
        en: "Deactivate", 
        fr: "Désactiver",
        mi: "Whakawetohia",
        gd: "Cuir dheth",
        ga: "Díghníomhachtaigh",
        hi: "निष्क्रिय करें",
        'fr-CA': "Désactiver",
        af: "Deaktiveer",
      },
    },
    packageSign: {
      name: { 
        en: "Silent Communication", 
        fr: "Communication Silencieuse",
        mi: "Whakawhitiwhiti Kōrero Puku",
        gd: "Conaltradh Sàmhach",
        ga: "Cumarsáid Chiúin",
        hi: "मौन संचार",
        'fr-CA': "Communication Silencieuse",
        af: "Stil Kommunikasie",
      },
      description: {
        en: "Use your webcam to communicate using sign language. (SignGemma technology coming soon).",
        fr: "Utilisez votre webcam pour communiquer en langage des signes. (Technologie SignGemma à venir).",
        mi: "Whakamahia tō kāmera tukutuku ki te kōrero mā te reo tohu. (Kei te haere mai te hangarau SignGemma).",
        gd: "Cleachd an camara-lìn agad gus conaltradh a dhèanamh le cànan soidhnidh. (Teicneòlas SignGemma a' tighinn a dh'aithghearr).",
        ga: "Bain úsáid as do cheamara gréasáin chun cumarsáid a dhéanamh le teanga chomharthaíochta. (Teicneolaíocht SignGemma ag teacht go luath).",
        hi: "सांकेतिक भाषा का उपयोग करके संवाद करने के लिए अपने वेबकैम का उपयोग करें। (SignGemma तकनीक जल्द ही आ रही है)।",
        'fr-CA': "Utilisez votre webcam pour communiquer en langage des signes. (Technologie SignGemma à venir).",
        af: "Gebruik jou webkamera om met gebaretaal te kommunikeer. (SignGemma-tegnologie kom binnekort).",
      },
      cta: { 
        en: "Initialize", 
        fr: "Initialiser",
        mi: "Tīmata",
        gd: "Tòisich",
        ga: "Tosaigh",
        hi: "आरंभ करें",
        'fr-CA': "Initialiser",
        af: "Inisialiseer",
      },
    },
  },
};

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

const AgentCorePage: React.FC = () => {
  const { language } = useLanguage();
  const { theme } = useTheme();

  const [micStatus, setMicStatus] = useState<'idle' | 'active' | 'error'>('idle');
  const audioRefs = useRef<{
    context: AudioContext;
    stream: MediaStream;
    carrier: OscillatorNode;
    analyser: AnalyserNode;
    animationFrameId: number;
    dryGain: GainNode;
    wetGain: GainNode;
  } | null>(null);
  
  useEffect(() => {
    return () => {
      if (audioRefs.current) {
        stopVocoder();
      }
    };
  }, []);

  const startVocoder = async () => {
    if (audioRefs.current) return;
    try {
      const context = new AudioContext();
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const micSource = context.createMediaStreamSource(stream);

      const carrier = context.createOscillator();
      carrier.type = 'sawtooth';
      carrier.frequency.setValueAtTime(110, context.currentTime);

      const analyser = context.createAnalyser();
      micSource.connect(analyser);

      const filter = context.createBiquadFilter();
      filter.type = 'bandpass';
      filter.Q.value = 15; 

      const wetGain = context.createGain();
      wetGain.gain.setValueAtTime(0.8, context.currentTime);

      carrier.connect(filter);
      filter.connect(wetGain);
      wetGain.connect(context.destination);

      const dryGain = context.createGain();
      dryGain.gain.setValueAtTime(0.25, context.currentTime);

      micSource.connect(dryGain);
      dryGain.connect(context.destination);

      carrier.start();
      
      audioRefs.current = { context, stream, carrier, analyser, animationFrameId: 0, dryGain, wetGain };

      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      
      const update = () => {
        if (!audioRefs.current) return;
        analyser.getByteFrequencyData(dataArray);
        const averageVolume = dataArray.reduce((acc, val) => acc + val, 0) / dataArray.length;
        const filterFrequency = (averageVolume / 255) * 8000 + 200;
        filter.frequency.setValueAtTime(filterFrequency, context.currentTime);

        const scale = [261.63, 311.13, 349.23, 392.00, 466.16, 523.25];
        const noteIndex = Math.floor((averageVolume / 255) * (scale.length - 1));
        const targetFrequency = scale[noteIndex];

        if (targetFrequency) {
            audioRefs.current.carrier.frequency.linearRampToValueAtTime(targetFrequency, context.currentTime + 0.05);
        }

        audioRefs.current.animationFrameId = requestAnimationFrame(update);
      };
      update();

      setMicStatus('active');
    } catch (err) {
      console.error("Erreur d'accès au microphone:", err);
      setMicStatus('error');
      if (audioRefs.current) stopVocoder();
    }
  };

  const stopVocoder = () => {
    const audio = audioRefs.current;
    if (!audio) return;
    audioRefs.current = null; 
    cancelAnimationFrame(audio.animationFrameId);
    audio.stream.getTracks().forEach(track => track.stop());
    audio.carrier.stop();
    audio.context.close().catch(e => console.error("Error closing audio context:", e));
    setMicStatus('idle');
  };

  const handleVocoderToggle = () => {
    if (micStatus === 'active') {
      stopVocoder();
    } else {
      startVocoder();
    }
  };
  
  const handleSignFeature = () => {
    alert(getTranslationPath('agentHeartPage.packageSign.description', language));
  };
  
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
        <div className={styles.packageCard}>
          <FaMicrophoneAlt className={styles.packageIcon} />
          <h2 className={styles.packageName}>
            {getTranslationPath('agentHeartPage.packageVoice.name', language)}
          </h2>
          <p className={styles.packageDescription}>
            {getTranslationPath('agentHeartPage.packageVoice.description', language)}
          </p>
          <button className={styles.packageCta} onClick={handleVocoderToggle}>
            {micStatus === 'active'
              ? getTranslationPath('agentHeartPage.packageVoice.ctaActive', language)
              : getTranslationPath('agentHeartPage.packageVoice.cta', language)
            }
          </button>
        </div>

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