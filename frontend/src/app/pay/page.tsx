'use client'; // Indique que ce composant est un Client Component

import React, { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext'; // Assurez-vous que ce chemin est correct
import { useLanguage } from '@/contexts/LanguageContext'; // Importez useLanguage
import { LanguageCode } from '@/types'; // Importez LanguageCode

// Définitions des traductions pour cette page
const allTranslations = {
  paymentPage: {
    mainTitleLine1: {
      en: 'Central Bureau',
      fr: 'Bureau Central',
      mi: 'Tari Matua',
      ga: 'An Biúró Láir',
      hi: 'केंद्रीय ब्यूरो',
      gd: 'Biùro Meadhanach',
      'en-AU': 'Central Bureau', 'en-NZ': 'Central Bureau', 'en-CA': 'Central Bureau', 'fr-CA': 'Bureau Central', 'en-ZA': 'Central Bureau', af: 'Sentrale Buro'
    },
    mainTitleLine2: {
      en: 'Kiwi-Ops',
      fr: 'Kiwi-Ops',
      mi: 'Kiwi-Ops',
      ga: 'Kiwi-Ops',
      hi: 'कीवी-ऑप्स',
      gd: 'Kiwi-Ops',
      'en-AU': 'Kiwi-Ops', 'en-NZ': 'Kiwi-Ops', 'en-CA': 'Kiwi-Ops', 'fr-CA': 'Kiwi-Ops', 'en-ZA': 'Kiwi-Ops', af: 'Kiwi-Ops'
    },
    subtitle: {
      en: '"Your contribution, our common success."',
      fr: '"Votre contribution, notre succès commun."',
      mi: '"Tō takoha, tō mātou angitu tahi."',
      ga: '"Do ranníocaíocht, ár gcomhshláinte."',
      hi: '"आपका योगदान, हमारी साझा सफलता।"',
      gd: '"Do thabhartas, ar soirbheas coitcheann."',
      'en-AU': '"Your contribution, our common success."', 'en-NZ': '"Your contribution, our common success."', 'en-CA': '"Your contribution, our common success."', 'fr-CA': '"Votre contribution, notre succès commun."', 'en-ZA': '"Your contribution, our common success."', af: '"U bydrae, ons gesamentlike sukses."'
    },
    transactionTitleLine1: {
      en: 'Transaction File',
      fr: 'Dossier de Transaction',
      mi: 'Kōnae Tauwhitinga',
      ga: 'Comhad Idirbhirt',
      hi: 'लेन-देन फ़ाइल',
      gd: 'Faidhle Gnothaich',
      'en-AU': 'Transaction File', 'en-NZ': 'Transaction File', 'en-CA': 'Transaction File', 'fr-CA': 'Dossier de Transaction', 'en-ZA': 'Transaction File', af: 'Transaksielêer'
    },
    transactionTitleLine2: {
      en: '— Agent Accreditation —',
      fr: '— Accréditation d\'Agent —',
      mi: '— Whakaaetanga Āpiha —',
      ga: '— Creidiúnú Gníomhaire —',
      hi: '— एजेंट प्रत्यायन —',
      gd: '— Barrantachd Àidseant —',
      'en-AU': '— Agent Accreditation —', 'en-NZ': '— Agent Accreditation —', 'en-CA': '— Agent Accreditation —', 'fr-CA': '— Accréditation d\'Agent —', 'en-ZA': '— Agent Accreditation —', af: '— Agent Akkreditasie —'
    },
    discretionMessage: {
      en: '"Discretion and precision are our watchwords."',
      fr: '"La discrétion et la précision sont nos maîtres mots."',
      mi: '"Ko te huna me te tino tika ō mātou kupu matua."',
      ga: '"Is iad an discréid agus an cruinneas ár bhfocal faire."',
      hi: '"विवेक और सटीकता हमारे मुख्य शब्द हैं।"',
      gd: '"Is e diomhaireachd agus cruinneas ar faclan-faire."',
      'en-AU': '"Discretion and precision are our watchwords."', 'en-NZ': '"Discretion and precision are our watchwords."', 'en-CA': '"Discretion and precision are our watchwords."', 'fr-CA': '"La discrétion et la précision sont nos maîtres mots."', 'en-ZA': '"Discretion and precision are our watchwords."', af: '"Diskresie en presisie is ons wagwoorde."'
    },
    cardNameLabel: {
      en: 'Cardholder Name (As on File):',
      fr: 'Nom du Porteur (Telle que sur la Fiche) :',
      mi: 'Ingoa Kāri (Kei te Kōnae):',
      ga: 'Ainm an tSealbhóra Cáta (Mar atá ar Chomhad):',
      hi: 'कार्ड धारक का नाम (फ़ाइल के अनुसार):',
      gd: 'Ainm an Neach-seilbh Cairt (Mar a tha air Faidhle):',
      'en-AU': 'Cardholder Name (As on File):', 'en-NZ': 'Cardholder Name (As on File):', 'en-CA': 'Cardholder Name (As on File):', 'fr-CA': 'Nom du Porteur (Telle que sur la Fiche) :', 'en-ZA': 'Cardholder Name (As on File):', af: 'Kaarthouer Naam (Soos op Lêer):'
    },
    cardNumberLabel: {
      en: 'Accreditation Number (Bank File):',
      fr: 'Numéro d\'Accréditation (Fiche Bancaire) :',
      mi: 'Tau Whakaaetanga (Kōnae Peeke):',
      ga: 'Uimhir Chreidiúnaithe (Comhad Bainc):',
      hi: 'प्रत्यायन संख्या (बैंक फ़ाइल):',
      gd: 'Àireamh Barrantachd (Faidhle Banca):',
      'en-AU': 'Accreditation Number (Bank File):', 'en-NZ': 'Accreditation Number (Bank File):', 'en-CA': 'Accreditation Number (Bank File):', 'fr-CA': 'Numéro d\'Accréditation (Fiche Bancaire) :', 'en-ZA': 'Accreditation Number (Bank File):', af: 'Akkreditasie Nommer (Bank Lêer):'
    },
    expiryDateLabel: {
      en: 'Valid Until (MM/YY):',
      fr: 'Valide Jusqu\'à (MM/AA) :',
      mi: 'Wā Whaimana Tae Noa ki (MM/TT):',
      ga: 'Bailí Go Dtí (MM/BB):',
      hi: 'तक मान्य (माह/वर्ष):',
      gd: 'Dligheach Gu ruige (MM/BB):',
      'en-AU': 'Valid Until (MM/YY):', 'en-NZ': 'Valid Until (MM/YY):', 'en-CA': 'Valid Until (MM/YY):', 'fr-CA': 'Valide Jusqu\'à (MM/AA) :', 'en-ZA': 'Valid Until (MM/YY):', af: 'Geldig Tot (MM/JJ):'
    },
    cvvLabel: {
      en: 'Secret Code (CVV):',
      fr: 'Code Secret (CVV) :',
      mi: 'Waehere Ngaro (CVV):',
      ga: 'Cód Rúnda (CVV):',
      hi: 'गुप्त कोड (CVV):',
      gd: 'Còd Dìomhair (CVV):',
      'en-AU': 'Secret Code (CVV):', 'en-NZ': 'Secret Code (CVV):', 'en-CA': 'Secret Code (CVV):', 'fr-CA': 'Code Secret (CVV) :', 'en-ZA': 'Secret Code (CVV):', af: 'Geheime Kode (CVV):'
    },
    processingButton: {
      en: 'Processing Accreditation...',
      fr: 'Traitement de l\'Accréditation...',
      mi: 'Te Whakahaere Whakaaetanga...',
      ga: 'Ag Próiseáil Creidiúnaithe...',
      hi: 'प्रत्यायन संसाधित हो रहा है...',
      gd: 'A’ Pròiseas Barrantachd...',
      'en-AU': 'Processing Accreditation...', 'en-NZ': 'Processing Accreditation...', 'en-CA': 'Processing Accreditation...', 'fr-CA': 'Traitement de l\'Accréditation...', 'en-ZA': 'Processing Accreditation...', af: 'Verwerk akkreditasie...'
    },
    submitButton: {
      en: 'Validate File',
      fr: 'Valider le Dossier',
      mi: 'Whakamana i te Kōnae',
      ga: 'Bailíochtaigh an Comhad',
      hi: 'फ़ाइल मान्य करें',
      gd: 'Dearbhaich am Faidhle',
      'en-AU': 'Validate File', 'en-NZ': 'Validate File', 'en-CA': 'Validate File', 'fr-CA': 'Valider le Dossier', 'en-ZA': 'Validate File', af: 'Valideer Lêer'
    },
    successMessage: {
      en: 'Transaction File Received. Processing in progress via Beta Protocol.',
      fr: 'Dossier de Transaction Reçu. Traitement en cours via Protocole Bêta.',
      mi: 'Kua Tae Mai te Kōnae Tauwhitinga. Kei te haere tonu te whakahaere mā te Tikanga Beta.',
      ga: 'Comhad Idirbhirt Faighte. Próiseáil ar siúl tríd an bPrótacal Beta.',
      hi: 'लेन-देन फ़ाइल प्राप्त हुई। बीटा प्रोटोकॉल के माध्यम से प्रसंस्करण प्रगति पर है।',
      gd: 'Faidhle Gnothaich air Fhaighinn. Tha pròiseas a’ dol air adhart tro Protocol Beta.',
      'en-AU': 'Transaction File Received. Processing in progress via Beta Protocol.', 'en-NZ': 'Transaction File Received. Processing in progress via Beta Protocol.', 'en-CA': 'Transaction File Received. Processing in progress via Beta Protocol.', 'fr-CA': 'Dossier de Transaction Reçu. Traitement en cours via Protocole Bêta.', 'en-ZA': 'Transaction File Received. Processing in progress via Beta Protocol.', af: 'Transaksielêer Ontvang. Verwerking is aan die gang via Beta Protokol.'
    },
    directiveTitle: {
      en: 'Operational Command Directive',
      fr: 'Directive du Commandement Opérationnel',
      mi: 'Aratohu Whakahau Whakahaere',
      ga: 'Treoir an Ordaithe Oibríochta',
      hi: 'परिचालन कमांड निर्देश',
      gd: 'Stiùireadh Àithne Obrachaidh',
      'en-AU': 'Operational Command Directive', 'en-NZ': 'Operational Command Directive', 'en-CA': 'Operational Command Directive', 'fr-CA': 'Directive du Commandement Opérationnel', 'en-ZA': 'Operational Command Directive', af: 'Operasionele Bevelsriglyn'
    },
    transactionProtection: {
      en: 'All transactions are recorded and protected by Digital Security Protocol A.',
      fr: 'Toute transaction est enregistrée et protégée par le Protocole de Sécurité Numérique A.',
      mi: 'Ka tuhia, ka tiakina hoki ngā tauwhitinga katoa e te Tikanga Haumaru Matihiko A.',
      ga: 'Déantar gach idirbheart a thaifeadadh agus a chosaint le Prótacal Slándála Digiteach A.',
      hi: 'सभी लेनदेन डिजिटल सुरक्षा प्रोटोकॉल ए द्वारा रिकॉर्ड और सुरक्षित किए जाते हैं।',
      gd: 'Tha gach gnothaich air a chlàradh agus air a dhìon le Protocol Tèarainteachd Didseatach A.',
      'en-AU': 'All transactions are recorded and protected by Digital Security Protocol A.', 'en-NZ': 'All transactions are recorded and protected by Digital Security Protocol A.', 'en-CA': 'All transactions are recorded and protected by Digital Security Protocol A.', 'fr-CA': 'Toute transaction est enregistrée et protégée par le Protocole de Sécurité Numérique A.', 'en-ZA': 'All transactions are recorded and protected by Digital Security Protocol A.', af: 'Alle transaksies word aangeteken en beskerm deur Digitale Sekuriteitsprotokol A.'
    },
    contactAnomalies: {
      en: 'For any anomaly or question related to your financial accreditation, contact the Monetary Affairs Department without delay.',
      fr: 'Pour toute anomalie ou question relative à votre accréditation financière, contactez sans délai le Service des Affaires Monétaires.',
      mi: 'Mō tētahi anōmali, pātai rānei e pā ana ki tō whakaaetanga pūtea, whakapā atu ki te Tari Take Pūtea me te kore tōmuri.',
      ga: 'Le haghaidh aon aimhrialtacht nó ceist a bhaineann le do chreidiúnú airgeadais, déan teagmháil láithreach leis an Roinn Gnóthaí Airgeadaíochta.',
      hi: 'आपकी वित्तीय प्रत्यायन से संबंधित किसी भी विसंगति या प्रश्न के लिए, बिना किसी देरी के मौद्रिक मामलों के विभाग से संपर्क करें।',
      gd: 'Airson ana-cainnt sam bith no ceist co-cheangailte ri do bharantachd ionmhasail, cuir fios gun dàil gu Roinn Cùisean Airgead.',
      'en-AU': 'For any anomaly or question related to your financial accreditation, contact the Monetary Affairs Department without delay.', 'en-NZ': 'For any anomaly or question related to your financial accreditation, contact the Monetary Affairs Department without delay.', 'en-CA': 'For any anomaly or question related to your financial accreditation, contact the Monetary Affairs Department without delay.', 'fr-CA': 'Pour toute anomalie ou question relative à votre accréditation financière, contactez sans délai le Service des Affaires Monétaires.', 'en-ZA': 'For any anomaly or question related to your financial accreditation, contact the Monetary Affairs Department without delay.', af: 'Vir enige afwyking of vraag met betrekking tot u finansiële akkreditasie, kontak die Monetêre Sake Afdeling sonder versuim.'
    },
    billingEmail: {
      en: 'billing@kiwi-ops.com', // Emails typically not translated, but included for consistency
      fr: 'billing@kiwi-ops.com',
      mi: 'billing@kiwi-ops.com',
      ga: 'billing@kiwi-ops.com',
      hi: 'billing@kiwi-ops.com',
      gd: 'billing@kiwi-ops.com',
      'en-AU': 'billing@kiwi-ops.com', 'en-NZ': 'billing@kiwi-ops.com', 'en-CA': 'billing@kiwi-ops.com', 'fr-CA': 'billing@kiwi-ops.com', 'en-ZA': 'billing@kiwi-ops.com', af: 'billing@kiwi-ops.com'
    },
    copyright: {
      en: 'Kiwi-Ops – All access rights reserved.',
      fr: 'Kiwi-Ops – Tous droits d\'accès réservés.',
      mi: 'Kiwi-Ops – Kua rāhui katoa ngā mana uru.',
      ga: 'Kiwi-Ops – Gach ceart rochtana forchoimeádta.',
      hi: 'कीवी-ऑप्स – सभी पहुंच अधिकार सुरक्षित।',
      gd: 'Kiwi-Ops – Gach còir ruigsinneachd glèidhte.',
      'en-AU': 'Kiwi-Ops – All access rights reserved.', 'en-NZ': 'Kiwi-Ops – All access rights reserved.', 'en-CA': 'Kiwi-Ops – All access rights reserved.', 'fr-CA': 'Kiwi-Ops – Tous droits d\'accès réservés.', 'en-ZA': 'Kiwi-Ops – All access rights reserved.', af: 'Kiwi-Ops – Alle toegangsregte voorbehou.'
    },
  },
};

// Fonction de traduction générique
const getTranslation = <S extends keyof typeof allTranslations, K extends keyof typeof allTranslations[S]>(
  section: S,
  key: K,
  lang: LanguageCode
): string => {
  const sectionTranslations = allTranslations[section];
  if (!sectionTranslations) return `[Missing Section: ${String(section)}]`;
  const specificTranslations = sectionTranslations[key];
  if (typeof specificTranslations !== 'object' || specificTranslations === null || !('en' in specificTranslations)) {
    console.warn(`Translation missing or invalid for: ${String(section)}.${String(key)} in language ${lang}`);
    return `[Invalid Translation: ${String(section)}.${String(key)}]`;
  }
  return (specificTranslations as { [l: string]: string })[lang] || (specificTranslations as { [l: string]: string }).en;
};


export default function PaymentPage() {
  const { theme } = useTheme();
  const { language } = useLanguage(); // Obtenez la langue courante

  // Définissez les couleurs en fonction du thème, avec une touche "Lorette"
  const textColor = theme === 'dark' ? '#E0E0E0' : '#333333';
  const linkColor = theme === 'dark' ? '#8BC4FF' : '#4A90E2';
  const mutedTextColor = theme === 'dark' ? '#A0A0A0' : '#666666';
  const borderColor = theme === 'dark' ? '#555555' : '#AAAAAA';

  const [nomPorteur, setNomPorteur] = useState('');
  const [numeroCarte, setNumeroCarte] = useState('');
  const [dateExpiration, setDateExpiration] = useState('');
  const [cvv, setCvv] = useState('');
  const [message, setMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Backgrounds
  const backgroundColorPage = theme === 'dark' ? '#1A1A2E' : '#f9fafb';
  const sectionBgColor = theme === 'dark' ? '#2A2A3A' : '#FFFFFF';

  // Autres couleurs dérivées (ombres, inputs)
  const textShadowColor = theme === 'dark' ? 'rgba(0,0,0,0.5)' : 'rgba(150,150,150,0.3)';
  const shadowColorCard = theme === 'dark' ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.2)';
  const shadowColorButton = theme === 'dark' ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.2)';
  const inputBgColor = theme === 'dark' ? '#1F1F2A' : '#FFFFFF';


  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setIsProcessing(true);
    setMessage('');

    console.log("Nom du Porteur:", nomPorteur);
    console.log("Numéro de Carte:", numeroCarte);
    console.log("Date d'Expiration:", dateExpiration);
    console.log("CVV:", cvv);

    // Simulation d'un traitement
    setTimeout(() => {
      setIsProcessing(false);
      // Utilisation de la traduction pour le message de succès
      setMessage(getTranslation('paymentPage', 'successMessage', language));
      // Réinitialiser le formulaire si désiré
      setNomPorteur('');
      setNumeroCarte('');
      setDateExpiration('');
      setCvv('');
    }, 2000);
  };

  return (
    <div style={{
      padding: '2rem',
      maxWidth: '700px',
      margin: '0 auto',
      lineHeight: '1.6',
      fontSize: '1rem',
      color: textColor,
      fontFamily: "'Georgia', serif",
      backgroundColor: backgroundColorPage,
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <h1 style={{
        marginBottom: '1rem',
        fontSize: '3.5rem',
        textAlign: 'center',
        fontWeight: 'bold',
        fontFamily: "'Playfair Display', serif",
        textTransform: 'uppercase',
        letterSpacing: '2px',
        color: textColor,
        textShadow: `2px 2px 0px ${textShadowColor}`
      }}>
        {getTranslation('paymentPage', 'mainTitleLine1', language)}<br />
        {getTranslation('paymentPage', 'mainTitleLine2', language)}
      </h1>
      <p style={{ fontStyle: 'italic', marginBottom: '3rem', textAlign: 'center', color: mutedTextColor, fontSize: '1.1rem' }}>
        {getTranslation('paymentPage', 'subtitle', language)}
      </p>

      {/* Formulaire de paiement simplifié */}
      <form onSubmit={handleSubmit} style={{
        border: `2px solid ${borderColor}`,
        padding: '2.5rem',
        borderRadius: '5px',
        boxShadow: `5px 5px 0px ${shadowColorCard}`,
        background: sectionBgColor,
        color: textColor,
        width: '100%',
        boxSizing: 'border-box'
      }}>
        <h3 style={{
          fontSize: '1.8rem',
          marginBottom: '1.5rem',
          borderBottom: `2px dashed ${borderColor}`,
          paddingBottom: '0.8rem',
          color: textColor,
          textAlign: 'center',
          fontFamily: "'Playfair Display', serif",
          fontWeight: 'bold',
          textTransform: 'uppercase'
        }}>
          {getTranslation('paymentPage', 'transactionTitleLine1', language)}<br />
          {getTranslation('paymentPage', 'transactionTitleLine2', language)}
        </h3>
        <p style={{ marginBottom: '1.5rem', color: mutedTextColor, textAlign: 'center', fontStyle: 'italic' }}>
          {getTranslation('paymentPage', 'discretionMessage', language)}
        </p>

        {/* Champ Nom du Porteur */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label htmlFor="card-name" style={{ display: 'block', marginBottom: '0.6rem', color: textColor, fontSize: '1.1rem' }}>
            {getTranslation('paymentPage', 'cardNameLabel', language)}
          </label>
          <input
            type="text"
            id="card-name"
            value={nomPorteur}
            onChange={(e) => setNomPorteur(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '12px',
              border: `1px solid ${borderColor}`,
              borderRadius: '4px',
              backgroundColor: inputBgColor,
              color: textColor,
              fontSize: '1rem',
              boxSizing: 'border-box'
            }}
          />
        </div>

        {/* Champ Numéro de Carte */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label htmlFor="card-number" style={{ display: 'block', marginBottom: '0.6rem', color: textColor, fontSize: '1.1rem' }}>
            {getTranslation('paymentPage', 'cardNumberLabel', language)}
          </label>
          <input
            type="text"
            id="card-number"
            value={numeroCarte}
            onChange={(e) => setNumeroCarte(e.target.value)}
            required
            placeholder="XXXX XXXX XXXX XXXX"
            style={{
              width: '100%',
              padding: '12px',
              border: `1px solid ${borderColor}`,
              borderRadius: '4px',
              backgroundColor: inputBgColor,
              color: textColor,
              fontSize: '1rem',
              boxSizing: 'border-box'
            }}
          />
        </div>

        {/* Champs Date d'Expiration et CVV */}
        <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2rem' }}>
          <div style={{ flex: 1 }}>
            <label htmlFor="expiry-date" style={{ display: 'block', marginBottom: '0.6rem', color: textColor, fontSize: '1.1rem' }}>
              {getTranslation('paymentPage', 'expiryDateLabel', language)}
            </label>
            <input
              type="text"
              id="expiry-date"
              value={dateExpiration}
              onChange={(e) => setDateExpiration(e.target.value)}
              required
              placeholder="MM/AA"
              style={{
                width: '100%',
                padding: '12px',
                border: `1px solid ${borderColor}`,
                borderRadius: '4px',
                backgroundColor: inputBgColor,
                color: textColor,
                fontSize: '1rem',
                boxSizing: 'border-box'
              }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label htmlFor="cvv" style={{ display: 'block', marginBottom: '0.6rem', color: textColor, fontSize: '1.1rem' }}>
              {getTranslation('paymentPage', 'cvvLabel', language)}
            </label>
            <input
              type="text"
              id="cvv"
              value={cvv}
              onChange={(e) => setCvv(e.target.value)}
              required
              placeholder="CVC"
              style={{
                width: '100%',
                padding: '12px',
                border: `1px solid ${borderColor}`,
                borderRadius: '4px',
                backgroundColor: inputBgColor,
                color: textColor,
                fontSize: '1rem',
                boxSizing: 'border-box'
              }}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isProcessing}
          style={{
            backgroundColor: linkColor,
            color: '#fff',
            padding: '15px 30px',
            borderRadius: '5px',
            border: 'none',
            fontSize: '1.2rem',
            cursor: 'pointer',
            opacity: isProcessing ? 0.6 : 1,
            transition: 'opacity 0.3s ease, background-color 0.3s ease',
            width: '100%',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            boxShadow: `2px 2px 0px ${shadowColorButton}`,
          }}
        >
          {isProcessing ? getTranslation('paymentPage', 'processingButton', language) : getTranslation('paymentPage', 'submitButton', language)}
        </button>

        {message && (
          <p style={{ color: 'green', marginTop: '1.5rem', fontSize: '1rem', textAlign: 'center', fontWeight: 'bold' }}>
            {message}
          </p>
        )}
      </form>

      <section style={{
        marginTop: '4rem',
        borderTop: `2px dashed ${borderColor}`,
        paddingTop: '2.5rem',
        textAlign: 'center',
        color: textColor,
        fontSize: '0.95rem'
      }}>
        <h2 style={{
          fontSize: '1.6rem',
          marginBottom: '1rem',
          color: textColor,
          fontFamily: "'Playfair Display', serif",
          fontWeight: 'bold'
        }}>
          {getTranslation('paymentPage', 'directiveTitle', language)}
        </h2>
        <p style={{ color: mutedTextColor, marginBottom: '1rem' }}>
          {getTranslation('paymentPage', 'transactionProtection', language)}
        </p>
        <p style={{ color: mutedTextColor, marginBottom: '1.5rem' }}>
          {getTranslation('paymentPage', 'contactAnomalies', language)}
        </p>
        <a href="mailto:finance@kiwi-ops.com" style={{ color: linkColor, textDecoration: 'none', fontSize: '1rem', display: 'block', fontWeight: 'bold' }}>
          {getTranslation('paymentPage', 'billingEmail', language)}
        </a>
      </section>

      <p style={{ textAlign: 'center', marginTop: '3rem', fontSize: '0.8rem', color: mutedTextColor }}>
        © <span suppressHydrationWarning>{new Date().getFullYear()}</span> {getTranslation('paymentPage', 'copyright', language)}
      </p>
    </div>
  );
}