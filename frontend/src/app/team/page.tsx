'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaBars, FaDownload } from 'react-icons/fa';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageCode } from '@/types';
import styles from './team.module.css';

// --- DÉBUT DES TRADUCTIONS ET FONCTION getTranslation (Assurez-vous que cet objet est identique partout) ---
const allTranslations = {
  header: {
    missionStatement: {
      en: "Inspired by the Wellington Tunnelers of Arras, our mission is to build in the shadows what will, tomorrow, break through to the surface.",
      fr: "Inspirés des tunneliers de Wellington à Arras, notre mission est de bâtir dans l’ombre ce qui, demain, percera la surface.",
      mi: "He mea whakahihiri mai i ngā kaikeri o raro o Te Whanganui-a-Tara ki Arras, ko tā mātou kaupapa he hanga i roto i te atarangi i ngā mea ka puta ki te mata āpōpopo.",
      ga: "Ar an taobh istigh de tholláin Wellington in Arras, is é ár misean tógáil sa scáth a bbrisfidh an dromchla amárach.",
      hi: "एरास में वेलिंगटन टनलर्स से प्रेरित होकर, हमारा मिशन छाया में वह निर्माण करना है जो कल सतह को भेद देगा।",
      gd: "Air a bhrosnachadh le Tunnelairean Wellington ann an Arras, is e ar misneachd togail anns an dubhar na nì, a-màireach, briseadh tro uachdar.",
      cy: "Wedi'u hysbrydoli gan Dwnelwyr Wellington yn Arras, ein cenhadaeth yw adeiladu yn y cysgodion yr hyn, yfory, a fydd yn torri trwy'y wyneb.",
      'en-AU': "Inspired by the Wellington Tunnelers of Arras, our mission is to build in the shadows what will, tomorrow, break through to the surface.",
      'en-NZ': "Inspired by the Wellington Tunnelers of Arras, our mission is to build in the shadows what will, tomorrow, break through to the surface.",
      'en-CA': "Inspired by the Wellington Tunnelers of Arras, our mission is to build in the shadows what will, tomorrow, break through to the surface.",
      'fr-CA': "Inspirés des tunneliers de Wellington à Arras, notre mission est de bâtir dans l’ombre ce qui, demain, percera la surface.",
      'en-ZA': "Inspired by the Wellington Tunneliers of Arras, our mission is to build in the shadows what will, tomorrow, break through to the surface.",
      af: "Geïnspireer deur die Wellington Tunneliers van Arras, is ons missie om in die skaduwees te bou wat môre deur die oppervlak sal breek.",
    },
    beta: {
      en: "Beta", fr: "Bêta", mi: "Beta", ga: "Béite", hi: "बीटा", gd: "Beta", cy: "Beta",
      'en-AU': "Beta", 'en-NZ': "Beta", 'en-CA': "Beta", 'fr-CA': "Bêta", 'en-ZA': "Beta", af: "Beta",
    }
  },
  chat: {
    welcomeMessage: { en: "Hello! I'm A.L.A.N...", fr: "Bonjour ! Je suis l'Agent L.I.O.N..." },
    thinking: { en: 'Agent is thinking...', fr: "Agent L.I.O.N. réfléchit..." },
    placeholder: { en: 'Type your message...', fr: 'Tapez votre message...' },
    militaryPackages: { en: 'Military Packages', fr: 'Paquetages Militaires' },
  },
  loginPage: {
    title: { en: 'Building in the shadows. Emerging for tomorrow.', fr: "Construire dans l’ombre. Émerger pour demain." },
    subtitle: { en: 'Kiwi-Ops. Intelligence that adapts to you', fr: "Kiwi-Ops. L’intelligence qui s’adapte à vous" },
    chatButton: { en: 'Get Started', fr: 'Démarrer' },
    chatTitle: { en: "Chat with AI", fr: "Chat avec l'IA" },
    chatInputPlaceholder: { en: 'Write your message here...', fr: 'Écrivez votre message ici...' },
    installAppLabel: {
      en: 'Install App', fr: "Installer l'Application", hi: 'ऐप इंस्टॉल करें', mi: 'Tāuta Taupānga', ga: 'Suiteáil Aip', gd: 'Stàlaich App', cy: 'Gosod Ap', af: 'Installeer Toep',
    },
    product: { en: 'Our Products', fr: 'Nos Produits', mi: 'Ā Mātou Hua', ga: 'Ár dTáirgí', hi: 'हमारे उत्पाद', gd: 'Ar Bathar', cy: 'Ein Cynhyrchion', af: 'Ons Produkte', },
    features: { en: 'The Platform', fr: 'La plateforme', mi: 'Te Paparanga', ga: 'An tArdán', hi: 'प्लेटफ़ॉर्म', gd: 'Am Plaicform', cy: 'Y Llwyfan', af: 'Die Platform', },
    story: { en: 'Our Story', fr: 'Notre Histoire', mi: 'Tō Mātou Kōrero', ga: 'Ár Scéal', hi: 'हमारी कहानी', gd: 'Ar Sgeulachd', cy: 'Ein Stori', af: 'Ons Verhaal', },
    search: { en: 'Our Solutions', fr: 'Nos solutions', mi: 'Ā Mātou Rongoā', ga: 'Ár Réitigh', hi: 'हमारे समाधान', gd: 'Ar Fuasglaidhean', cy: 'Ein Datrysiadau', af: 'Ons Oplossings', },
    team: { en: 'Our Team', fr: 'Notre Équipe', mi: 'Tō Mātou Kapa', ga: 'Ár bhFoireann', hi: 'हमारी टीम', gd: 'Ar Sgioba', cy: 'Ein Tîm', af: 'Ons Span', },
  },
  productPage: {
    hero: { title: {en: '', fr: ''}, subtitle: {en: '', fr: ''}, ctaButton: {en: '', fr: ''} },
    challenge: { title: {en: '', fr: ''}, point1: {en: '', fr: ''}, point2: {en: '', fr: ''}, point3: {en: '', fr: ''} },
    solution: {
      title: { en: '', fr: '' }, pillar1Title: { en: '', fr: '' }, pillar1Text: { en: '', fr: '' },
      pillar2Title: { en: '', fr: '' }, pillar2Text: { en: '', fr: '' },
      pillar3Title: { en: '', fr: '' }, pillar3Text: { en: '', fr: '' },
    },
    features: { title: {en: '', fr: ''}, speedTitle: {en: '', fr: ''}, speedText: {en: '', fr: ''}, securityTitle: {en: '', fr: '', gd: ''}, securityText: {en: '', fr: ''}, integrationTitle: {en: '', fr: ''}, integrationText: {en: '', fr: ''} },
    search: { title: {en: '', fr: ''}, subtitle: {en: '', fr: ''}, text: {en: '', fr: ''} },
    story: { title: {en: '', fr: ''}, subtitle: {en: '', fr: ''}, text: {en: '', fr: ''} },
    finalCta: { title: {en: '', fr: ''}, subtitle: {en: '', fr: ''}, button: {en: '', fr: ''} },
    team: {
        title: {
          en: 'Our Team: Diverse Expertise, Proven Execution',
          fr: 'Notre Équipe : L\'expertise diversifiée et les capacités d\'exécution avérées',
          mi: 'Tō Mātou Kapa: Ngā Toi Rerekē, Te Whakatinanatanga Kua Whakaatuhia',
          ga: 'Ár bhFoireann: Saineolas Éagsúil, Feidhmiú Cruthaithe',
          hi: 'हमारी टीम: विविध विशेषज्ञता, सिद्ध निष्पादन',
          gd: 'Ar Sgioba: Eòlas Eadar-dhealaichte, Coileanadh Dearbhte',
          cy: 'Ein Tîm: Arbenigedd Amrywiol, Gweithrediad Profedig',
          af: 'Ons Span: Diverse Kundigheid, Bewese Uitvoering',
        },
        subtitle: {
          en: 'Our team\'s diversified expertise and proven execution capabilities are particularly suited not only to build and scale Kiwi-ops, but also to thrive and contribute to the Google ecosystem.',
          fr: 'L\'expertise diversifiée et les capacités d\'exécution avérées de notre équipe sont particulièrement adaptées non seulement pour construire et faire évoluer Kiwi-ops, mais aussi pour prospérer et contribuer à l\'écosystème Google.',
          mi: 'Ko ngā toi rerekē o tō mātou kapa me ngā kaha whakatinanatanga kua whakaatuhia e tika ana kia hanga, kia whakanui i a Kiwi-ops, engari kia tūhura, kia whai wāhi hoki ki te pūnaha rauwiringa kaiao a Google.',
          ga: 'Tá saineolas éagsúil ár bhfoireann agus cumais fheidhmithe cruthaithe oiriúnach go háirithe ní amháin chun Kiwi-ops a thógáil agus a scála, ach freisin chun rath a chur air agus cur leis an éiceachóras Google.',
          gd: 'Tha eòlas eadar-dhealaichte ar sgioba agus comasan coileanaidh dearbhte gu sònraichte iomchaidh chan ann a-mhàin airson Kiwi-ops a thogail agus a leudachadh, ach cuideachd airson soirbheachadh agus cur ris an eag-shiostam Google.',
          cy: 'Mae arbenigedd amrywiol a galluoedd gweithredu profedig ein tîm yn arbennig o addas nid yn unig i adeiladu a graddio Kiwi-ops, ond hefyd i ffynnu a chyfrannu at ecosystem Google.',
          af: 'Ons span se gediversifiseerde kundigheid en bewese uitvoeringsvermoëns is veral geskik om nie net Kiwi-ops te bou en te skaal nie, maar ook om te floreer en by te dra tot die Google-ekosisteem.',
        },
        member1Name: { en: 'Agent Harry', fr: 'Agent Harry' },
        member1Title: { en: 'CEO & CPO', fr: 'CEO & CPO' },
        member1Bio: {
            en: 'A customer-focused CEO/CPO combining technical expertise and strategic vision to transform market insights into innovative products that delight users.',
            fr: 'Un CEO/CPO axé sur le client combinant expertise technique et vision stratégique pour transformer les insights du marché en produits innovants qui ravissent les utilisateurs.'
        },
        member2Name: { en: 'Agent Loréne', fr: 'Agent Loréne' },
        member2Title: { en: 'Advisor (General Manager)', fr: 'Conseillère (Directrice Générale)' },
        member2Bio: {
            en: 'Dedicated to fostering innovation through effective talent management and organizational growth, optimizing processes for innovative businesses.',
            fr: 'Dédiée à la promotion de l\'innovation par une gestion efficace des talents et une croissance organisationnelle, optimisant les processus pour les entreprises innovantes. - Moneypenny, Directrice Générale'
        },
        member3Name: { en: 'Agent Fire', fr: 'Agent Fire' },
        member3Title: { en: 'CTO', fr: 'CTO' },
        member3Bio: {
            en: 'Passionate about innovation and efficiency, a certified architect developing CRM solutions to optimize processes and enhance customer satisfaction.',
            fr: 'Passionné par l\'innovation et l\'efficacité, architecte certifié développant des solutions CRM pour optimiser les processus et améliorer la satisfaction client.'
        },
    }
  },
  solutionsPage: {
    title: {en: '', fr: ''}, subtitle: {en: '', fr: ''},
    airTitle: {en: '', fr: ''}, airText: {en: '', fr: ''},
    landTitle: {en: '', fr: ''}, landText: {en: '', fr: ''},
    seaTitle: {en: '', fr: ''}, seaText: {en: '', fr: ''},
    ctaTitle: {en: 'Ready to Transform Your Operations?', fr: 'Prêt à Transformer Vos Opérations ?'},
    ctaSubtitle: {en: 'Contact our experts to discuss your specific needs and discover how Kiwi-Ops can empower your team.', fr: 'Contactez nos experts pour discuter de vos besoins spécifiques et découvrez comment Kiwi-Ops peut renforcer votre équipe.'},
    ctaButtonExperts: {en: 'Talk to an Expert', fr: 'Parlez à un Expert'},
  },
  platformPage: {
    title: {en: '', fr: ''}, subtitle: {en: '', fr: ''},
  },
  aiAgents: {
    sectionTitle: {en: '', fr: ''}, sectionSubtitle: {en: '', fr: ''},
    geoAgentTitle: {en: '', fr: ''}, geoAgentText: {en: '', fr: ''},
    predMaintAgentTitle: {en: '', fr: ''}, predMaintAgentText: {en: '', fr: ''},
    tactIntAgentTitle: {en: '', fr: ''}, tactIntAgentText: {en: '', fr: ''},
    web3CompAgentTitle: {en: '', fr: ''}, web3CompAgentText: {en: '', fr: ''},
  },
  installPage: {
    title: {en: '', fr: ''}, subtitle: {en: '', fr: ''}, googlePlay: {en: '', fr: ''}, appStore: {en: '', fr: ''}, qrCodeText: {en: '', fr: ''}, googlePlayLink: '', appStoreLink: '', qrCodeImage: '',
  },
  footer: {
    copyright: {en: '© 2024 Kiwi-Ops. All rights reserved.', fr: '© 2024 Kiwi-Ops. Tous droits réservés.'},
    privacyPolicy: {en: 'Privacy Policy', fr: 'Politique de Confidentialité'},
    termsOfService: {en: 'Terms of Service', fr: 'Conditions Générales d\'Utilisation'},
    contactUs: {en: 'Contact Us', fr: 'Nous Contacter'},
  },
};

function getTranslation(section: keyof typeof allTranslations, keyPath: string, language: LanguageCode): string {
  const keys = keyPath.split('.');
  let result = (allTranslations as any)[section];
  for (const theKey of keys) {
    if (result === undefined || result === null) return keyPath;
    result = result?.[theKey];
  }
  return result?.[language] || result?.en || keyPath;
}
// --- FIN DES TRADUCTIONS ET FONCTION getTranslation ---

export default function TeamPage() {
  const { theme } = useTheme();
  const { language } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);

  const getLoginNavTranslation = (key: string) => getTranslation('loginPage', key, language);
  const tTeam = (key: string) => getTranslation('productPage', `team.${key}`, language);
  const tSolutions = (key: string) => getTranslation('solutionsPage', key, language); // Utilisé pour le CTA final
  const tFooter = (key: string) => getTranslation('footer', key, language);

  return (
    <div className={`${styles.pageContainer} ${theme === 'dark' ? styles.darkMode : styles.lightMode}`}>
      {/* Navbar */}
      <nav className={styles.navbar}>
        <div className={styles.navLogo}><Link href="/">Kiwi-Ops</Link></div>
        <button className={styles.menuToggle} onClick={() => setMenuOpen(!menuOpen)}><FaBars /></button>
        <ul className={`${styles.navLinks} ${menuOpen ? styles.open : ''}`}>
           <li><Link href="/product">{getLoginNavTranslation('product')}</Link></li>
           <li><Link href="/platform">{getLoginNavTranslation('features')}</Link></li>
           <li><Link href="/team">{getLoginNavTranslation('team')}</Link></li>
           <li><Link href="/story">{getLoginNavTranslation('story')}</Link></li>
           <li><Link href="/solutions">{getLoginNavTranslation('search')}</Link></li>
        </ul>
        <button className={styles.installButton} aria-label={getLoginNavTranslation('installAppLabel')}><FaDownload /></button>
      </nav>

      {/* Contenu de la page Équipe */}
      <section className={`${styles.section} ${styles.teamContentSection}`} id="team-main-content">
        <h1 className={styles.sectionTitle}>{tTeam('title')}</h1>
        <p className={styles.subtitle}>{tTeam('subtitle')}</p>

        {/* AFFICHAGE DES MEMBRES DE L'ÉQUIPE */}
        <div className={styles.teamGrid}>
          {/* Membre de l'équipe 1: Agent Harry */}
          <div className={styles.teamMemberCard}>
            <Image
              src="/avatars/agent-harry.png"
              alt={tTeam('member1Name')}
              width={150}
              height={150}
              className={styles.teamAvatar}
            />
            <h3>{tTeam('member1Name')}</h3>
            <p className={styles.teamMemberTitle}>{tTeam('member1Title')}</p>
            <p>{tTeam('member1Bio')}</p>
          </div>

          {/* Membre de l'équipe 2: Agent Loréne */}
          <div className={styles.teamMemberCard}>
            <Image
              src="/avatars/agent-lorene.png"
              alt={tTeam('member2Name')}
              width={150}
              height={150}
              className={styles.teamAvatar}
            />
            <h3>{tTeam('member2Name')}</h3>
            <p className={styles.teamMemberTitle}>{tTeam('member2Title')}</p>
            <p>{tTeam('member2Bio')}</p>
          </div>

          {/* Membre de l'équipe 3: Agent Fire */}
          <div className={styles.teamMemberCard}>
            <Image
              src="/avatars/agent-fire.png"
              alt={tTeam('member3Name')}
              width={150}
              height={150}
              className={styles.teamAvatar}
            />
            <h3>{tTeam('member3Name')}</h3>
            <p className={styles.teamMemberTitle}>{tTeam('member3Title')}</p>
            <p>{tTeam('member3Bio')}</p>
          </div>
        </div>
      </section>

      {/* Final Call To Action */}
      <section className={`${styles.section} ${styles.ctaContainer} ${styles.finalCta}`}>
        <h2 className={styles.ctaTitle}>{tSolutions('ctaTitle')}</h2>
        <p className={styles.ctaSubtitle}>
          {tSolutions('ctaSubtitle')}
        </p>
        <Link href="mailto:contact@kiwi-ops.com" className={styles.ctaButton}>
          {tSolutions('ctaButtonExperts')}
        </Link>
      </section>

      {/* FOOTER */}
      <footer className={`${styles.footer}`}>
        <div className={styles.footerContent}>
          <div className={styles.footerBrand}>
            <h3>Kiwi-Ops</h3>
            <p>{tFooter('copyright')}</p>
          </div>
          <div className={styles.footerNav}>
            <h4>{getLoginNavTranslation('search')}</h4> {/* "Nos solutions" */}
            <ul>
              <li><Link href="/product">{getLoginNavTranslation('product')}</Link></li>
              <li><Link href="/team">{getLoginNavTranslation('team')}</Link></li>
              <li><Link href="/story">{getLoginNavTranslation('story')}</Link></li>
              <li><Link href="/solutions">{getLoginNavTranslation('search')}</Link></li>
            </ul>
          </div>
          <div className={styles.footerLegal}>
            <h4>Legal</h4>
            <ul>
              <li><Link href="/privacy">{tFooter('privacyPolicy')}</Link></li>
              <li><Link href="/terms">{tFooter('termsOfService')}</Link></li>
            </ul>
          </div>
          <div className={styles.footerContact}>
            <h4>{tFooter('contactUs')}</h4>
            <p>Email: <a href="mailto:info@kiwi-ops.com">info@kiwi-ops.com</a></p>
          </div>
        </div>
      </footer>
    </div>
  );
}