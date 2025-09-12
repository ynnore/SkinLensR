'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageCode } from '@/types';
import { QRCodeSVG } from 'qrcode.react';
import axios from 'axios';
import styles from './pay.module.css';

// --- TRADUCTIONS COMPLÈTES ---
const allTranslations = {
  paymentPage: {
    mainTitleLine1: { en: 'Central Bureau', fr: 'Bureau Central', mi: 'Tari Matua', gd: 'Biùro Meadhanach', ga: 'An Biúró Láir', hi: ' केंद्रीय ब्यूरो', 'fr-CA': 'Bureau Central', af: 'Sentrale Buro' },
    mainTitleLine2: { en: 'Kiwi-Ops', fr: 'Kiwi-Ops', mi: 'Kiwi-Ops', gd: 'Kiwi-Ops', ga: 'Kiwi-Ops', hi: 'कीवी-ऑप्स', 'fr-CA': 'Kiwi-Ops', af: 'Kiwi-Ops' },
    subtitle: { en: '"Your contribution, our common success."', fr: '"Votre contribution, notre succès commun."', mi: '"Tō takoha, tō mātou angitu tahi."', gd: '"Do thabhartas, ar soirbheas coitcheann."', ga: '"Do ranníocaíocht, ár rath coiteann."', hi: '"आपका योगदान, हमारी साझा सफलता।"', 'fr-CA': '"Votre contribution, notre succès commun."', af: '"U bydrae, ons gesamentlike sukses."' },
    transactionTitleLine1: { en: 'Transaction File', fr: 'Dossier de Transaction', mi: 'Kōnae Tauwhitinga', gd: 'Faidhle Gnothaich', ga: 'Comhad Idirbhirt', hi: 'लेन-देन फ़ाइल', 'fr-CA': 'Dossier de Transaction', af: 'Transaksielêer' },
    discretionMessage: { en: '"Discretion and precision are our watchwords."', fr: '"La discrétion et la précision sont nos maîtres mots."', mi: '"Ko te noho puku me te pū te tīmatanga o ā mātou mahi."', gd: '"Is e gliocas agus pongalachd ar facail-suaicheantais."', ga: '"Is iad discréid agus cruinneas ár mana."', hi: '"विवेक और सटीकता हमारे मूलमंत्र हैं।"', 'fr-CA': '"La discrétion et la précision sont nos maîtres mots."', af: '"Diskresie en presisie is ons wagwoorde."' },
    directiveTitle: { en: 'Operational Command Directive', fr: 'Directive du Commandement Opérationnel', mi: 'Aratohu Whakahau Whakahaere', gd: 'Stiùireadh an Àrd-chomannd Obrachaidh', ga: 'Treoir an Ordaithe Oibríochta', hi: 'परिचालन कमान निर्देश', 'fr-CA': 'Directive du Commandement Opérationnel', af: 'Operasionele Bevelsriglyn' },
    transactionProtection: { en: 'All transactions are recorded and protected by Digital Security Protocol A.', fr: 'Toute transaction est enregistrée et protégée par le Protocole de Sécurité Numérique A.', mi: 'Ka tuhia, ka tiakina ngā tauwhitinga katoa e te Kawa Haumaru Matihiko A.', gd: 'Tha gach gnothach air a chlàradh agus air a dhìon le Pròtacal Tèarainteachd Didseatach A.', ga: 'Déantar gach idirbheart a thaifeadadh agus a chosaint le Prótacal Slándála Digiteach A.', hi: 'सभी लेनदेन डिजिटल सुरक्षा प्रोटोकॉल ए द्वारा दर्ज और संरक्षित हैं।', 'fr-CA': 'Toute transaction est enregistrée et protégée par le Protocole de Sécurité Numérique A.', af: 'Alle transaksies word aangeteken en beskerm deur Digitale Sekuriteitsprotokol A.' },
    contactAnomalies: { en: 'For any anomaly related to your accreditation, contact the Monetary Affairs Department.', fr: 'Pour toute anomalie relative à votre accréditation, contactez le Service des Affaires Monétaires.', mi: 'Mō tētahi hapa e pā ana ki tō whakaaetanga, whakapā atu ki te Tari Take Pūtea.', gd: 'Airson mì-riaghailt sam bith co-cheangailte ris a’ bharantachd agad, cuir fios gu Roinn nan Cùisean Airgeadaidh.', ga: 'I gcás aon aimhrialtachta a bhaineann le d’acmhainn, déan teagmháil leis an Roinn Gnóthaí Airgeadaíochta.', hi: 'आपकी प्रत्यायन से संबंधित किसी भी विसंगति के लिए, मौद्रिक मामलों के विभाग से संपर्क करें।', 'fr-CA': 'Pour toute anomalie relative à votre accréditation, contactez le Service des Affaires Monétaires.', af: 'Vir enige anomalie wat verband hou met u akkreditasie, kontak die Departement van Monetêre Sake.' },
    billingEmail: { en: 'billing@kiwi-ops.com', fr: 'billing@kiwi-ops.com', mi: 'billing@kiwi-ops.com', gd: 'billing@kiwi-ops.com', ga: 'billing@kiwi-ops.com', hi: 'billing@kiwi-ops.com', 'fr-CA': 'billing@kiwi-ops.com', af: 'billing@kiwi-ops.com' },
    copyright: { en: 'Kiwi-Ops – All access rights reserved.', fr: 'Kiwi-Ops – Tous droits d\'accès réservés.', mi: 'Kiwi-Ops – Kua rāhuitia ngā mana uru katoa.', gd: 'Kiwi-Ops – Gach còir-inntrigidh glèidhte.', ga: 'Kiwi-Ops – Gach ceart rochtana ar cosaint.', hi: 'कीवी-ऑप्स – सभी प्रवेश अधिकार सुरक्षित हैं।', 'fr-CA': 'Kiwi-Ops – Tous droits d\'accès réservés.', af: 'Kiwi-Ops – Alle toegangsregte voorbehou.' },
    proFormaTitle: { en: '— Pro Forma Accreditation —', fr: '— Accréditation Pro Forma —', mi: '— Whakaaetanga Pro Forma —', gd: '— Barantachd Pro Forma —', ga: '— Creidiúnú Pro Forma —', hi: '— प्रो फॉर्मा प्रत्यायन —', 'fr-CA': '— Accréditation Pro Forma —', af: '— Pro Forma Akkreditasie —' },
    confirmationPrompt: { en: 'Please review and confirm your accreditation protocol before proceeding.', fr: 'Veuillez vérifier et confirmer votre protocole d\'accréditation avant de procéder.', mi: 'Tēnā arotake me te whakamana i tō kawa whakaaetanga i mua i te haere tonu.', gd: 'Feuch an dèan thu sgrùdadh agus dearbhadh air a’ phròtacal barantachaidh agad mus lean thu air adhart.', ga: 'Déan athbhreithniú agus deimhnigh do phrótacal creidiúnaithe sula dtéann tú ar aghaidh.', hi: 'आगे बढ़ने से पहले कृपया अपनी प्रत्यायन प्रोटोकॉल की समीक्षा और पुष्टि करें।', 'fr-CA': 'Veuillez vérifier et confirmer votre protocole d\'accréditation avant de procéder.', af: 'Hersien en bevestig asseblief u akkreditasieprotokol voordat u voortgaan.' },
    planLabel: { en: 'Selected Protocol:', fr: 'Protocole Sélectionné :', mi: 'Kawa Kua Tohua:', gd: 'Pròtacal air a thaghadh:', ga: 'Prótacal Roghnaithe:', hi: 'चयनित प्रोटोकॉल:', 'fr-CA': 'Protocole Sélectionné :', af: 'Geselekteerde Protokol:' },
    confirmButton: { en: 'Confirm & Generate Secure Channel', fr: 'Confirmer & Générer le Canal Sécurisé', mi: 'Whakaū & Hangaia te Awhe Haumaru', gd: 'Dearbhaich & Cruthaich Sianal Tèarainte', ga: 'Deimhnigh & Gin Cainéal Slán', hi: 'पुष्टि करें और सुरक्षित चैनल उत्पन्न करें', 'fr-CA': 'Confirmer & Générer le Canal Sécurisé', af: 'Bevestig & Genereer Veilige Kanaal' },
    generatingInvoice: { en: 'Generating Secure Transmission...', fr: 'Génération de la transmission sécurisée...', mi: 'Te Waihanga Tuku Haumaru...', gd: 'A’ cruthachadh tar-chuir tèarainte...', ga: 'Ag Giniúint Tarchuir Slán...', hi: 'सुरक्षित प्रसारण उत्पन्न हो रहा है...', 'fr-CA': 'Génération de la transmission sécurisée...', af: 'Genereer Veilige Oordrag...' },
    paymentOrderTitle: { en: 'Payment Order', fr: 'Ordre de Virement', mi: 'Ota Utu', gd: 'Òrdugh Pàighidh', ga: 'Ordú Íocaíochta', hi: 'भुगतान आदेश', 'fr-CA': 'Ordre de Virement', af: 'Betalingsbevel' },
    sendAmountLabel: { en: 'Amount to Transfer (Regtest BTC):', fr: 'Montant à Transférer (BTC Regtest) :', mi: 'Tapeke hei Whakawhiti (Regtest BTC):', gd: 'Suim ri ghluasad (Regtest BTC):', ga: 'Méid le hAistriú (Regtest BTC):', hi: 'हस्तांतरित करने के लिए राशि (Regtest BTC):', 'fr-CA': 'Montant à Transférer (BTC Regtest) :', af: 'Bedrag om oor te dra (Regtest BTC):' },
    toAddressLabel: { en: 'To Secure Channel Address:', fr: 'Vers le Canal Sécurisé :', mi: 'Ki te Wāhitau Awhe Haumaru:', gd: 'Gu seòladh an t-sianail thèarainte:', ga: 'Chuig Seoladh an Chainéil Slán:', hi: 'सुरक्षित चैनल पते पर:', 'fr-CA': 'Vers le Canal Sécurisé :', af: 'Na die Veilige Kanaaladres:' },
    statusLabel: { en: 'Transmission Status:', fr: 'Statut de la Transmission :', mi: 'Tūnga Tuku:', gd: 'Inbhe an tar-chuir:', ga: 'Stádas an Tarchuir:', hi: 'प्रसारण स्थिति:', 'fr-CA': 'Statut de la Transmission :', af: 'Oordragstatus:' },
    statusPending: { en: 'Awaiting network broadcast...', fr: 'En attente de diffusion sur le réseau...', mi: 'E tatari ana mō te pāhotanga whatunga...', gd: 'A’ feitheamh ri craoladh an lìonra...', ga: 'Ag fanacht le craoladh an líonra...', hi: 'नेटवर्क प्रसारण की प्रतीक्षा में...', 'fr-CA': 'En attente de diffusion sur le réseau...', af: 'Wag vir netwerkuitsending...' },
    statusDetected: { en: 'Broadcast detected, awaiting confirmation...', fr: 'Diffusion détectée, en attente de confirmation...', mi: 'Pāhotanga kua kitea, e tatari ana mō te haamauraa...', gd: 'Craoladh air a lorg, a’ feitheamh ri dearbhadh...', ga: 'Craoladh braite, ag fanacht le deimhniú...', hi: 'प्रसारण का पता चला, पुष्टि की प्रतीक्षा में...', 'fr-CA': 'Diffusion détectée, en attente de confirmation...', af: 'Uitsending bespeur, wag vir bevestiging...' },
    statusConfirmed: { en: 'Accreditation Confirmed. Access granted.', fr: 'Accréditation Confirmée. Accès accordé.', mi: 'Whakaaetanga Kua Whakapūmautia. Kua Whakaaetia te Urunga.', gd: 'Barantachd air a dhearbhadh. Cothrom air a thoirt seachad.', ga: 'Creidiúnú Deimhnithe. Rochtain deonaithe.', hi: 'प्रत्यायन की पुष्टि हुई। प्रवेश प्रदान किया गया।', 'fr-CA': 'Accréditation Confirmée. Accès accordé.', af: 'Akkreditasie Bevestig. Toegang verleen.' },
    errorMessage: { en: 'Transmission error. Please re-initiate the protocol.', fr: 'Erreur de transmission. Veuillez ré-initier le protocole.', mi: 'Hapa tuku. Tēnā tīmata anō i te kawa.', gd: 'Mearachd tar-chuir. Feuch an ath-thòisich thu am pròtacal.', ga: 'Earráid tarchuir. Tosaigh an prótacál arís, le do thoil.', hi: 'संचरण त्रुटि। कृपया प्रोटोकॉल को फिर से शुरू करें।', 'fr-CA': 'Erreur de transmission. Veuillez ré-initier le protocole.', af: 'Oordragfout. Herbegin asseblief die protokol.' },
    planErrorMessage: { en: 'Protocol not specified. Please return to the pricing page.', fr: 'Protocole non spécifié. Veuillez retourner à la page des tarifs.', mi: 'Kāore i tohua te kawa. Hoki atu ki te whārangi utu.', gd: 'Pròtacal gun sònrachadh. Feuch an till thu gu duilleag nam prìsean.', ga: 'Níl an prótacal sonraithe. Fill ar leathanach na bpraghsanna, le do thoil.', hi: 'प्रोटोकॉल निर्दिष्ट नहीं है। कृपया मूल्य निर्धारण पृष्ठ पर वापस जाएं।', 'fr-CA': 'Protocole non spécifié. Veuillez retourner à la page des tarifs.', af: 'Protokol nie gespesifiseer nie. Keer asseblief terug na die prysbladsy.' },
    invoiceExpired: { en: 'Secure channel has expired. Please generate a new one.', fr: 'Le canal sécurisé a expiré. Veuillez en générer un nouveau.', mi: 'Kua pau te wā o te hongere haumaru. Tēnā hanga he mea hōu.', gd: 'Tha an sianal tèarainte air tighinn gu crìch. Feuch an cruthaich thu fear ùr.', ga: 'Tá an cainéal slán imithe in éag. Gin ceann nua, le do thoil.', hi: 'सुरक्षित चैनल समाप्त हो गया है। कृपया एक नया उत्पन्न करें।', 'fr-CA': 'Le canal sécurisé a expiré. Veuillez en générer un nouveau.', af: 'Veilige kanaal het verval. Genereer asseblief \'n nuwe een.' },
    successTitle: { en: 'Transmission Complete', fr: 'Transmission Terminée', mi: 'Tuku Kua Oti', gd: 'Tar-chur deiseil', ga: 'Tarchur Críochnaithe', hi: 'संचरण पूर्ण', 'fr-CA': 'Transmission Terminée', af: 'Oordrag Voltooi' },
    successSubtitle: { en: 'Your accreditation is now active. You will be redirected shortly.', fr: 'Votre accréditation est maintenant active. Vous allez être redirigé.', mi: 'Kua hohe tō whakaaetanga ināianei. Ka tukuna koe ākuanei.', gd: 'Tha do bharantachd a-nis gnìomhach. Thèid do ath-stiùireadh a dh’ aithghearr.', ga: 'Tá do chreidiúnú gníomhach anois. Déanfar tú a atreorú go gairid.', hi: 'आपकी प्रत्यायन अब सक्रिय है। आपको शीघ्र ही पुनः निर्देशित किया जाएगा।', 'fr-CA': 'Votre accréditation est maintenant active. Vous serez redirigé sous peu.', af: 'Jou akkreditasie is nou aktief. Jy sal binnekort herlei word.' }
  },
};

const getTranslation = (section, key, lang) => {
    const sectionTranslations = allTranslations[section];
    if (!sectionTranslations) return `[Missing Section: ${section}]`;
    const specificTranslations = sectionTranslations[key];
    if (typeof specificTranslations !== 'object' || specificTranslations === null || !('en' in specificTranslations)) {
      return `[Invalid Translation]`;
    }
    return specificTranslations[lang] || specificTranslations.en;
};

const logger = { error: (...args) => console.error(...args) };

function PayComponent() {
  const { theme } = useTheme();
  const { language } = useLanguage();
  const searchParams = useSearchParams();
  const planId = searchParams.get('plan');

  // --- États ---
  const [view, setView] = useState('loading'); // loading, confirm, pay, error
  const [planDetails, setPlanDetails] = useState(null);
  const [invoice, setInvoice] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState('pending');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const pollingIntervalRef = useRef(null);

  // --- Styles dynamiques ---
  const { textColor, linkColor, mutedTextColor, borderColor, sectionBgColor, inputBgColor, textShadowColor, shadowColorCard, shadowColorButton, backgroundImage, overlayColor } = {
    textColor: theme === 'dark' ? '#E0E0E0' : '#333333',
    linkColor: theme === 'dark' ? '#8BC4FF' : '#4A90E2',
    mutedTextColor: theme === 'dark' ? '#A0A0A0' : '#666666',
    borderColor: theme === 'dark' ? '#555555' : '#AAAAAA',
    sectionBgColor: theme === 'dark' ? 'rgba(42, 42, 58, 0.9)' : 'rgba(248, 248, 248, 0.9)',
    inputBgColor: theme === 'dark' ? '#1F1F2A' : '#FFFFFF',
    textShadowColor: theme === 'dark' ? 'rgba(0,0,0,0.5)' : 'rgba(150,150,150,0.3)',
    shadowColorCard: theme === 'dark' ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.2)',
    shadowColorButton: theme === 'dark' ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.2)',
    backgroundImage: theme === 'dark' ? 'url(/images/pay-bg-dark.png)' : 'url(/images/pay-bg-light.png)',
    overlayColor: theme === 'dark' ? 'rgba(10, 15, 25, 0.6)' : 'rgba(255, 255, 255, 0.5)',
  };

  // --- Logique de paiement ---

  // Étape 1: Charger les détails du plan pour la confirmation
  useEffect(() => {
    if (!planId) {
      setError(getTranslation('paymentPage', 'planErrorMessage', language));
      setView('error');
      return;
    }
    const fetchPlanDetails = async () => {
      try {
        // ASSUREZ-VOUS QUE L'URL DU BACKEND EST CORRECTE
        const response = await axios.get(`http://127.0.0.1:8000/api/plan-details/${planId}`);
        setPlanDetails(response.data);
        setView('confirm');
      } catch (err) {
        setError(getTranslation('paymentPage', 'errorMessage', language));
        setView('error');
        logger.error("Erreur fetchPlanDetails:", err);
      }
    };
    fetchPlanDetails();
  }, [planId, language]);

  // Étape 2: L'utilisateur confirme et on crée la facture
  const handleCreateInvoice = async () => {
    setIsLoading(true);
    setError('');
    try {
      // ASSUREZ-VOUS QUE L'URL DU BACKEND EST CORRECTE
      const response = await axios.post('http://127.0.0.1:8000/api/create-invoice', { plan: planId });
      setInvoice(response.data);
      setView('pay');
    } catch (err) {
      setError(getTranslation('paymentPage', 'errorMessage', language));
      setView('error');
      logger.error("Erreur handleCreateInvoice:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Étape 3: Polling pour le statut du paiement
  useEffect(() => {
    if (invoice && paymentStatus !== 'confirmed') {
      pollingIntervalRef.current = setInterval(async () => {
        try {
          // ASSUREZ-VOUS QUE CET ENDPOINT EXISTE SUR VOTRE BACKEND
          const response = await axios.get(`http://127.0.0.1:8000/api/invoice-status/${invoice.address}`);
          const newStatus = response.data.status; // ex: 'pending', 'detected', 'confirmed'
          if (newStatus !== paymentStatus) {
            setPaymentStatus(newStatus);
          }
          if (newStatus === 'confirmed') {
            if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
          }
        } catch (err) {
          logger.error("Erreur checkStatus:", err);
          // Optionnel: Gérer l'expiration de la facture
        }
      }, 5000);
    }
    return () => {
      if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
    };
  }, [invoice, paymentStatus]);

  // --- Rendu conditionnel ---
  const renderContent = () => {
    switch (view) {
      case 'loading':
        return <p style={{ textAlign: 'center', fontStyle: 'italic' }}>{getTranslation('paymentPage', 'generatingInvoice', language)}</p>;
      
      case 'error':
        return <p style={{ color: 'red', textAlign: 'center', fontWeight: 'bold' }}>{error}</p>;
      
      case 'confirm':
        return (
          <div style={{ textAlign: 'center' }}>
            <h3 className={styles.sectionTitle} style={{color: textColor, borderBottomColor: borderColor}}>{getTranslation('paymentPage', 'transactionTitleLine1', language)}<br />{getTranslation('paymentPage', 'proFormaTitle', language)}</h3>
            <p style={{ marginBottom: '2rem', color: mutedTextColor, textAlign: 'center', fontStyle: 'italic' }}>{getTranslation('paymentPage', 'confirmationPrompt', language)}</p>
            <div style={{ marginBottom: '1.5rem', textAlign: 'left' }}>
              <label className={styles.label} style={{color: textColor}}>{getTranslation('paymentPage', 'planLabel', language)}</label>
              <p className={styles.paymentInfoText} style={{borderColor: borderColor, backgroundColor: inputBgColor, fontWeight: 'normal'}}>{planDetails?.description || planId}</p>
            </div>
            <div style={{ marginBottom: '2.5rem', textAlign: 'left' }}>
              <label className={styles.label} style={{color: textColor}}>{getTranslation('paymentPage', 'sendAmountLabel', language)}</label>
              <p className={styles.paymentInfoText} style={{borderColor: borderColor, backgroundColor: inputBgColor}}>{planDetails?.amount_btc} BTC</p>
            </div>
            <button onClick={handleCreateInvoice} disabled={isLoading} className={styles.button} style={{ backgroundColor: linkColor, boxShadow: `2px 2px 0px ${shadowColorButton}` }}>
              {isLoading ? getTranslation('paymentPage', 'generatingInvoice', language) : getTranslation('paymentPage', 'confirmButton', language)}
            </button>
          </div>
        );
      
      case 'pay':
        if (!invoice) return null; // Sécurité au cas où
        
        if (paymentStatus === 'confirmed') {
          return (
            <div className={styles.successContainer}>
              <img src="/images/payment-confirmed.png" alt={getTranslation('paymentPage', 'statusConfirmed', language)} className={styles.successIcon} />
              <h3 className={styles.sectionTitle} style={{ borderBottom: 'none', color: textColor }}>{getTranslation('paymentPage', 'successTitle', language)}</h3>
              <p style={{ color: mutedTextColor, textAlign: 'center', marginTop: '-1rem' }}>{getTranslation('paymentPage', 'successSubtitle', language)}</p>
            </div>
          );
        }

        let statusText = getTranslation('paymentPage', 'statusPending', language);
        if (paymentStatus === 'detected') statusText = getTranslation('paymentPage', 'statusDetected', language);
        
        return (
          <div style={{ textAlign: 'center' }}>
            <h3 className={styles.sectionTitle} style={{color: textColor, borderBottomColor: borderColor}}>{getTranslation('paymentPage', 'paymentOrderTitle', language)}</h3>
            <QRCodeSVG value={invoice.paymentUri} size={180} style={{ margin: '20px 0', background: 'white', padding: '10px', border: `1px solid ${borderColor}` }} />
            <div style={{ marginBottom: '1rem', textAlign: 'left' }}>
              <label className={styles.label} style={{color: textColor}}>{getTranslation('paymentPage', 'sendAmountLabel', language)}</label>
              <p className={styles.paymentInfoText} style={{borderColor: borderColor, backgroundColor: inputBgColor}}>{invoice.amount} BTC</p>
            </div>
            <div style={{ marginBottom: '1.5rem', textAlign: 'left' }}>
              <label className={styles.label} style={{color: textColor}}>{getTranslation('paymentPage', 'toAddressLabel', language)}</label>
              <p className={styles.paymentInfoText} style={{wordBreak: 'break-all', fontSize: '1rem', borderColor: borderColor, backgroundColor: inputBgColor}}>{invoice.address}</p>
            </div>
            <div style={{ borderTop: `1px dashed ${borderColor}`, paddingTop: '1rem', textAlign: 'left' }}>
              <label className={styles.label} style={{color: textColor}}>{getTranslation('paymentPage', 'statusLabel', language)}</label>
              <p className={styles.paymentInfoText} style={{borderColor: borderColor, backgroundColor: inputBgColor, fontWeight: 'normal'}}>{statusText}</p>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };
  
  return (
    <div className={styles.pageContainer} style={{ '--kiwi-payment-background-image': backgroundImage, '--kiwi-overlay-color': overlayColor }}>
      <div className={styles.contentWrapper}>
        <h1 className={styles.mainTitle} style={{ color: textColor, textShadow: `2px 2px 0px ${textShadowColor}` }}>{getTranslation('paymentPage', 'mainTitleLine1', language)}<br />{getTranslation('paymentPage', 'mainTitleLine2', language)}</h1>
        <p className={styles.subtitle} style={{ color: mutedTextColor }}>{getTranslation('paymentPage', 'subtitle', language)}</p>
        <div className={styles.formContainer} style={{ border: `2px solid ${borderColor}`, boxShadow: `5px 5px 0px ${shadowColorCard}`, background: sectionBgColor }}>
          {renderContent()}
        </div>
        <section className={styles.footerSection} style={{ color: textColor, borderTopColor: borderColor }}>
          <h2 className={styles.footerTitle} style={{ color: textColor }}>{getTranslation('paymentPage', 'directiveTitle', language)}</h2>
          <p style={{ color: mutedTextColor, marginBottom: '1rem' }}>{getTranslation('paymentPage', 'transactionProtection', language)}</p>
          <p style={{ color: mutedTextColor, marginBottom: '1.5rem' }}>{getTranslation('paymentPage', 'contactAnomalies', language)}</p>
          <a href={`mailto:${getTranslation('paymentPage', 'billingEmail', language)}`} style={{ color: linkColor, textDecoration: 'none', fontSize: '1rem', display: 'block', fontWeight: 'bold' }}>
            {getTranslation('paymentPage', 'billingEmail', language)}
          </a>
        </section>
        <p className={styles.copyrightText} style={{ color: mutedTextColor }}>
          © <span suppressHydrationWarning>{new Date().getFullYear()}</span> {getTranslation('paymentPage', 'copyright', language)}
        </p>
      </div>
    </div>
  );
}

// --- Wrapper pour la compatibilité avec Next.js App Router ---
export default function PayPageWrapper() {
  return (
    <Suspense fallback={<div style={{height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>Loading Protocol...</div>}>
      <PayComponent />
    </Suspense>
  );
}