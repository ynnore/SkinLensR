// src/app/pricing/page.tsx
'use client';

import React from 'react'; // <-- Assurez-vous que React est bien importé ici
import { useTheme } from '../../context/ThemeContext';
import styles from './pricing.module.css';
import { FaCheckCircle, FaTimesCircle, FaStar } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

export default function PricingPage() {
  const { theme } = useTheme();
  const router = useRouter();

  // Définissez les couleurs en fonction du thème
  const textColor = theme === 'dark' ? '#E0E0E0' : '#111827';
  const mutedTextColor = theme === 'dark' ? '#A0A0A0' : '#6b7280';
  const borderColor = theme === 'dark' ? '#555555' : '#e5e7eb';
  const highlightColor = theme === 'dark' ? '#8BC4FF' : '#4A90E2';

  // Backgrounds: FIXÉ À BLANC PUR POUR LE MODE CLAIR
  const backgroundColorPage = theme === 'dark' ? '#1f2937' : '#ffffff';
  const sectionBgColor = theme === 'dark' ? '#2A2A3A' : '#F8F8F8'; // Gris très très clair pour les cartes

  // Autres couleurs dérivées
  const textShadowColor = theme === 'dark' ? 'rgba(0,0,0,0.6)' : 'rgba(0,0,0,0.1)';
  const shadowColorCard = theme === 'dark' ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.1)';
  const shadowColorHover = theme === 'dark' ? 'rgba(0,0,0,0.7)' : 'rgba(0,0,0,0.2)';
  const shadowColorButton = theme === 'dark' ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.1)';

  const buttonPrimaryBg = theme === 'dark' ? '#005bb5' : '#0070f3';
  const buttonPrimaryHoverBg = theme === 'dark' ? '#004a99' : '#005edb';
  const buttonPrimaryText = theme === 'dark' ? '#E0E0E0' : 'white';


  return (
    <div
      className={styles.pageContainer}
      style={{ // <-- J'ai retiré 'as React.CSSProperties' ici
        // Définition des variables CSS pour cette page
        '--kiwi-background-page': backgroundColorPage,
        '--kiwi-text-primary': textColor,
        '--kiwi-text-secondary': mutedTextColor,
        '--kiwi-border-color': borderColor,
        '--kiwi-background-section': sectionBgColor,
        '--kiwi-highlight-color': highlightColor,
        '--kiwi-text-shadow': `2px 2px 0px ${textShadowColor}`,
        '--kiwi-shadow-color-card': shadowColorCard,
        '--kiwi-shadow-color-hover': shadowColorHover,
        '--kiwi-shadow-color-button': shadowColorButton,
        '--kiwi-button-primary-bg': buttonPrimaryBg,
        '--kiwi-button-primary-hover-bg': buttonPrimaryHoverBg,
        '--kiwi-button-primary-text': buttonPrimaryText,
        '--font-special-elite': "'Playfair Display', serif",
        '--font-courier-prime': "'Georgia', serif",
      }} // <-- Plus de 'as React.CSSProperties'
    >
      <h1 className={styles.title}>
        Protocoles d'Accréditation<br />— Tarifs des Missions —
      </h1>
      <p className={styles.subtitle}>
        "Choisissez le niveau d'accréditation qui correspond le mieux à vos opérations et à vos besoins stratégiques."
      </p>

      <div className={styles.pricingGrid}>
        {/* Carte de Plan Basique */}
        <div className={styles.pricingCard}>
          <div className={styles.cardHeader}>
            <h2 className={styles.planName}>AGENT OPS</h2>
            <p className={styles.planDescription}>Pour les agents indépendants en mission discrète.</p>
          </div>
          <p className={styles.price}>
            €0<span>/mois</span>
          </p>
          <ul className={styles.featuresList}>
            <li><FaCheckCircle className={styles.featureIcon} /> Accès Essentiel aux Outils</li>
            <li><FaCheckCircle className={styles.featureIcon} /> 1 Mission Active</li>
            <li><FaCheckCircle className={styles.featureIcon} /> Support Standard</li>
            <li><FaTimesCircle className={styles.featureIcon} style={{ color: mutedTextColor }} /> Rapports d'Analyse Avancée</li>
            <li><FaTimesCircle className={styles.featureIcon} style={{ color: mutedTextColor }} /> Accès aux Archives Complètes</li>
          </ul>
          <button
            className={styles.callToAction}
            onClick={() => router.push('/inscription')}
          >
            S'Accréditer (Gratuit)
          </button>
        </div>

        {/* Carte de Plan Standard */}
        <div className={styles.pricingCard}>
          <div className={styles.cardHeader}>
            <h2 className={styles.planName}>ÉQUIPE OPS</h2>
            <p className={styles.planDescription}>Pour les équipes nécessitant une coordination accrue.</p>
          </div>
          <p className={styles.price}>
            €29<span>/mois</span>
          </p>
          <ul className={styles.featuresList}>
            <li><FaCheckCircle className={styles.featureIcon} /> Accès Complet aux Outils</li>
            <li><FaCheckCircle className={styles.featureIcon} /> Missions Illimitées</li>
            <li><FaCheckCircle className={styles.featureIcon} /> Support Prioritaire</li>
            <li><FaCheckCircle className={styles.featureIcon} /> Rapports d'Analyse Avancée</li>
            <li><FaTimesCircle className={styles.featureIcon} style={{ color: mutedTextColor }} /> Accès aux Archives Complètes</li>
          </ul>
          <button
            className={styles.callToAction}
            onClick={() => router.push('/pay')}
          >
            Choisir ce Protocole
          </button>
        </div>

        {/* Carte de Plan Premium */}
        <div className={styles.pricingCard}>
          <div className={styles.cardHeader}>
            <h2 className={styles.planName}>
              <FaStar style={{marginRight: '0.5rem', color: highlightColor}}/>
              QG OPS
            </h2>
            <p className={styles.planDescription}>Le plus haut niveau d'autorité et de ressources.</p>
          </div>
          <p className={styles.price}>
            €79<span>/mois</span>
          </p>
          <ul className={styles.featuresList}>
            <li><FaCheckCircle className={styles.featureIcon} /> Accès Ultra Complet</li>
            <li><FaCheckCircle className={styles.featureIcon} /> Missions Illimitées</li>
            <li><FaCheckCircle className={styles.featureIcon} /> Support Dédié 24/7</li>
            <li><FaCheckCircle className={styles.featureIcon} /> Rapports d'Analyse Avancée</li>
            <li><FaCheckCircle className={styles.featureIcon} /> Accès aux Archives Complètes</li>
          </ul>
          <button
            className={styles.callToAction}
            onClick={() => router.push('/pay')}
          >
            Devenir Commandant
          </button>
        </div>
      </div>

      <p className={styles.globalFooter}>
        © {new Date().getFullYear()} Kiwi-Ops – Protocoles Financiers Sécurisés.
      </p>
    </div>
  );
}