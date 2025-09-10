'use client'; // Indique que ce composant est un Client Component

import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageCode } from '@/types';
import { QRCodeSVG } from 'qrcode.react';
import axios from 'axios';

// --- TRADUCTIONS ---
const allTranslations = {
  paymentPage: {
    // ... toutes vos traductions sont ici ...
    mainTitleLine1: { en: 'Central Bureau', fr: 'Bureau Central' /* ... */ },
    mainTitleLine2: { en: 'Kiwi-Ops', fr: 'Kiwi-Ops' /* ... */ },
    subtitle: { en: '"Your contribution, our common success."', fr: '"Votre contribution, notre succès commun."' /* ... */ },
    transactionTitleLine1: { en: 'Transaction File', fr: 'Dossier de Transaction' /* ... */ },
    transactionTitleLine2: { en: '— Agent Accreditation —', fr: '— Accréditation d\'Agent —' /* ... */ },
    discretionMessage: { en: '"Discretion and precision are our watchwords."', fr: '"La discrétion et la précision sont nos maîtres mots."' /* ... */ },
    directiveTitle: { en: 'Operational Command Directive', fr: 'Directive du Commandement Opérationnel' /* ... */ },
    transactionProtection: { en: 'All transactions are recorded...', fr: 'Toute transaction est enregistrée...' /* ... */ },
    contactAnomalies: { en: 'For any anomaly...', fr: 'Pour toute anomalie...' /* ... */ },
    billingEmail: { en: 'billing@kiwi-ops.com', fr: 'billing@kiwi-ops.com' /* ... */ },
    copyright: { en: 'Kiwi-Ops – All access rights reserved.', fr: 'Kiwi-Ops – Tous droits d\'accès réservés.' /* ... */ },
    choosePlanTitle: { en: 'Select Accreditation Protocol', fr: 'Sélectionner le Protocole d\'Accréditation' },
    payStandardButton: { en: 'Acquire Standard Protocol (€29)', fr: 'Acquérir le Protocole Standard (29€)' },
    payPremiumButton: { en: 'Acquire Premium Protocol (€79)', fr: 'Acquérir le Protocole Premium (79€)' },
    generatingInvoice: { en: 'Generating Secure Transmission...', fr: 'Génération de la transmission sécurisée...' },
    paymentOrderTitle: { en: 'Payment Order', fr: 'Ordre de Virement' },
    sendAmountLabel: { en: 'Amount to Transfer (Regtest BTC):', fr: 'Montant à Transférer (BTC Regtest) :' },
    toAddressLabel: { en: 'To Secure Channel Address:', fr: 'Vers le Canal Sécurisé :' },
    statusLabel: { en: 'Transmission Status:', fr: 'Statut de la Transmission :' },
    statusPending: { en: 'Awaiting network broadcast...', fr: 'En attente de diffusion sur le réseau...' },
    statusDetected: { en: 'Broadcast detected, awaiting confirmation...', fr: 'Diffusion détectée, en attente de confirmation...' },
    statusConfirmed: { en: 'Accreditation Confirmed. Access granted.', fr: 'Accréditation Confirmée. Accès accordé.' },
    errorMessage: { en: 'Transmission error. Please re-initiate the protocol.', fr: 'Erreur de transmission. Veuillez ré-initier le protocole.' },
    invoiceExpired: { en: 'Secure channel has expired. Please generate a new one.', fr: 'Le canal sécurisé a expiré. Veuillez en générer un nouveau.' }
  },
};

// Fonction de traduction générique (inchangée)
const getTranslation = <S extends keyof typeof allTranslations, K extends keyof typeof allTranslations[S]>(
    section: S,
    key: K,
    lang: LanguageCode
  ): string => {
    const sectionTranslations = allTranslations[section];
    if (!sectionTranslations) return `[Missing Section: ${String(section)}]`;
    const specificTranslations = sectionTranslations[key];
    if (typeof specificTranslations !== 'object' || specificTranslations === null || !('en' in specificTranslations)) {
      return `[Invalid Translation: ${String(section)}.${String(key)}]`;
    }
    return (specificTranslations as { [l: string]: string })[lang] || (specificTranslations as { [l: string]: string }).en;
  };

// Simple logger pour éviter les erreurs si console n'est pas défini (bonne pratique)
const logger = {
    error: (...args: any[]) => {
        if (console && console.error) {
            console.error(...args);
        }
    }
};

// ====================================================================================
// CORRECTION : L'objet de styles est maintenant DÉCLARÉ ICI, AVANT d'être utilisé.
// ====================================================================================
const styles: { [key: string]: React.CSSProperties } = {
    pageContainer: {
        padding: '2rem',
        maxWidth: '700px',
        margin: '0 auto',
        lineHeight: '1.6',
        fontSize: '1rem',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    mainTitle: {
        marginBottom: '1rem',
        fontSize: '3.5rem',
        textAlign: 'center',
        fontWeight: 'bold',
        fontFamily: "'Playfair Display', serif",
        textTransform: 'uppercase',
        letterSpacing: '2px',
    },
    subtitle: {
        fontStyle: 'italic',
        marginBottom: '3rem',
        textAlign: 'center',
        fontSize: '1.1rem',
    },
    formContainer: {
        padding: '2.5rem',
        borderRadius: '5px',
        width: '100%',
        boxSizing: 'border-box'
    },
    sectionTitle: {
        fontSize: '1.8rem',
        marginBottom: '1.5rem',
        borderBottom: `2px dashed #AAAAAA`,
        paddingBottom: '0.8rem',
        textAlign: 'center',
        fontFamily: "'Playfair Display', serif",
        fontWeight: 'bold',
        textTransform: 'uppercase'
    },
    button: {
        color: '#fff',
        padding: '15px 30px',
        borderRadius: '5px',
        border: 'none',
        fontSize: '1.2rem',
        cursor: 'pointer',
        transition: 'opacity 0.3s ease, background-color 0.3s ease',
        width: '100%',
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    label: {
        display: 'block',
        marginBottom: '0.6rem',
        fontSize: '1.1rem',
        fontWeight: 'normal',
        fontFamily: "'Georgia', serif",
    },
    paymentInfoText: {
        fontSize: '1.1rem',
        fontWeight: 'bold',
        padding: '10px',
        backgroundColor: '#f0f0f0',
        color: '#333',
        borderRadius: '4px',
        fontFamily: "'Courier New', Courier, monospace",
        marginTop: 0,
        marginBottom: 0
    },
    footerSection: {
        marginTop: '4rem',
        borderTop: `2px dashed #AAAAAA`,
        paddingTop: '2.5rem',
        textAlign: 'center',
        fontSize: '0.95rem'
    },
    footerTitle: {
        fontSize: '1.6rem',
        marginBottom: '1rem',
        fontFamily: "'Playfair Display', serif",
        fontWeight: 'bold'
    },
    copyrightText: {
        textAlign: 'center', 
        marginTop: '3rem', 
        fontSize: '0.8rem'
    }
};

// Le composant de la page de paiement
export default function PaymentPage() {
  const { theme } = useTheme();
  const { language } = useLanguage();

  // --- États du composant ---
  const [invoice, setInvoice] = useState<any>(null);
  const [paymentStatus, setPaymentStatus] = useState('pending');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // --- Styles dynamiques ---
  const textColor = theme === 'dark' ? '#E0E0E0' : '#333333';
  const linkColor = theme === 'dark' ? '#8BC4FF' : '#4A90E2';
  const mutedTextColor = theme === 'dark' ? '#A0A0A0' : '#666666';
  const borderColor = theme === 'dark' ? '#555555' : '#AAAAAA';
  const backgroundColorPage = theme === 'dark' ? '#1A1A2E' : '#f9fafb';
  const sectionBgColor = theme === 'dark' ? '#2A2A3A' : '#FFFFFF';
  const textShadowColor = theme === 'dark' ? 'rgba(0,0,0,0.5)' : 'rgba(150,150,150,0.3)';
  const shadowColorCard = theme === 'dark' ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.2)';
  const shadowColorButton = theme === 'dark' ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.2)';

  // --- Logique de paiement ---
  const handleCreateInvoice = async (planId: string) => {
    setIsLoading(true);
    setError('');
    setInvoice(null);
    setPaymentStatus('pending');

    try {
      const response = await axios.post('/api/payments/create-invoice', { plan_id: planId });
      setInvoice(response.data);
    } catch (err: any) {
      setError(getTranslation('paymentPage', 'errorMessage', language));
      logger.error("Erreur lors de la création de la facture:", err.response?.data || err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const checkStatus = async (paymentId: string) => {
    try {
      const response = await axios.get(`/api/payments/${paymentId}/status`);
      const newStatus = response.data.status;
      
      if (newStatus !== paymentStatus) {
        setPaymentStatus(newStatus);
      }
      
      if (newStatus === 'confirmed') {
        if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
      }
    } catch (err: any) {
      logger.error("Erreur lors de la vérification du statut:", err.response?.data || err.message);
      if (err.response?.status === 404) {
        setError(getTranslation('paymentPage', 'invoiceExpired', language));
        if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
      }
    }
  };

  useEffect(() => {
    if (invoice && paymentStatus !== 'confirmed') {
      pollingIntervalRef.current = setInterval(() => {
        checkStatus(invoice.payment_id);
      }, 5000);
    }

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [invoice, paymentStatus]);

  // --- Rendu conditionnel du contenu de la boîte ---
  const renderContent = () => {
    if (invoice) {
      let statusText = getTranslation('paymentPage', 'statusPending', language);
      if (paymentStatus === 'detected') statusText = getTranslation('paymentPage', 'statusDetected', language);
      if (paymentStatus === 'confirmed') statusText = getTranslation('paymentPage', 'statusConfirmed', language);
      
      return (
        <div style={{ textAlign: 'center' }}>
          <h3 style={{...styles.sectionTitle, color: textColor, borderBottomColor: borderColor}}>
            {getTranslation('paymentPage', 'paymentOrderTitle', language)}
          </h3>
          <QRCodeSVG value={invoice.uri} size={180} style={{ margin: '20px 0', background: 'white', padding: '10px', border: `1px solid ${borderColor}` }} />
          
          <div style={{ marginBottom: '1rem', textAlign: 'left' }}>
            <label style={{...styles.label, color: textColor}}>{getTranslation('paymentPage', 'sendAmountLabel', language)}</label>
            <p style={styles.paymentInfoText}>{invoice.amount_to_pay} BTC</p>
          </div>
          
          <div style={{ marginBottom: '1.5rem', textAlign: 'left' }}>
            <label style={{...styles.label, color: textColor}}>{getTranslation('paymentPage', 'toAddressLabel', language)}</label>
            <p style={{...styles.paymentInfoText, wordBreak: 'break-all', fontSize: '1rem'}}>{invoice.address_to_pay}</p>
          </div>
          
          <div style={{ borderTop: `1px dashed ${borderColor}`, paddingTop: '1rem', textAlign: 'left' }}>
            <label style={{...styles.label, color: textColor}}>{getTranslation('paymentPage', 'statusLabel', language)}</label>
            <p style={{...styles.paymentInfoText, color: paymentStatus === 'confirmed' ? '#2E7D32' : '#333', backgroundColor: paymentStatus === 'confirmed' ? '#C8E6C9' : '#f0f0f0' }}>
                {statusText}
            </p>
          </div>
        </div>
      );
    }
    
    return (
      <>
        <h3 style={{...styles.sectionTitle, color: textColor, borderBottomColor: borderColor}}>
            {getTranslation('paymentPage', 'transactionTitleLine1', language)}<br />
            {getTranslation('paymentPage', 'transactionTitleLine2', language)}
        </h3>
        <p style={{ marginBottom: '1.5rem', color: mutedTextColor, textAlign: 'center', fontStyle: 'italic' }}>
          {getTranslation('paymentPage', 'discretionMessage', language)}
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <button
                onClick={() => handleCreateInvoice('standard')}
                disabled={isLoading}
                style={{ ...styles.button, backgroundColor: linkColor, boxShadow: `2px 2px 0px ${shadowColorButton}` }}
            >
                {isLoading ? getTranslation('paymentPage', 'generatingInvoice', language) : getTranslation('paymentPage', 'payStandardButton', language)}
            </button>
            <button
                onClick={() => handleCreateInvoice('premium')}
                disabled={isLoading}
                style={{ ...styles.button, backgroundColor: linkColor, boxShadow: `2px 2px 0px ${shadowColorButton}` }}
            >
                {isLoading ? getTranslation('paymentPage', 'generatingInvoice', language) : getTranslation('paymentPage', 'payPremiumButton', language)}
            </button>
        </div>
        {error && <p style={{ color: 'red', marginTop: '1.5rem', fontSize: '1rem', textAlign: 'center', fontWeight: 'bold' }}>{error}</p>}
      </>
    );
  };
  
  return (
    <div style={{...styles.pageContainer, color: textColor, backgroundColor: backgroundColorPage, fontFamily: "'Georgia', serif"}}>
        <h1 style={{ ...styles.mainTitle, color: textColor, textShadow: `2px 2px 0px ${textShadowColor}`}}>
            {getTranslation('paymentPage', 'mainTitleLine1', language)}<br />
            {getTranslation('paymentPage', 'mainTitleLine2', language)}
        </h1>
        <p style={{...styles.subtitle, color: mutedTextColor}}>
            {getTranslation('paymentPage', 'subtitle', language)}
        </p>
        
        <div style={{ ...styles.formContainer, border: `2px solid ${borderColor}`, boxShadow: `5px 5px 0px ${shadowColorCard}`, background: sectionBgColor }}>
            {renderContent()}
        </div>

        <section style={{...styles.footerSection, color: textColor, borderTopColor: borderColor}}>
          <h2 style={{...styles.footerTitle, color: textColor}}>
            {getTranslation('paymentPage', 'directiveTitle', language)}
          </h2>
          <p style={{ color: mutedTextColor, marginBottom: '1rem' }}>
            {getTranslation('paymentPage', 'transactionProtection', language)}
          </p>
          <p style={{ color: mutedTextColor, marginBottom: '1.5rem' }}>
            {getTranslation('paymentPage', 'contactAnomalies', language)}
          </p>
          <a href={`mailto:${getTranslation('paymentPage', 'billingEmail', language)}`} style={{ color: linkColor, textDecoration: 'none', fontSize: '1rem', display: 'block', fontWeight: 'bold' }}>
            {getTranslation('paymentPage', 'billingEmail', language)}
          </a>
        </section>

        <p style={{...styles.copyrightText, color: mutedTextColor}}>
            © <span suppressHydrationWarning>{new Date().getFullYear()}</span> {getTranslation('paymentPage', 'copyright', language)}
        </p>
    </div>
  );
}