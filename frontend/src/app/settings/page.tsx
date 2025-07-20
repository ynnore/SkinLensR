'use client'; // Indique que ce composant est un Client Component

import { useTheme } from '../../context/ThemeContext'; // Importez le hook useTheme
import styles from './settings.module.css'; // Importez le CSS module

export default function SettingsPage() {
  const { theme } = useTheme(); // Accédez au thème actuel

  // Définissez les couleurs et autres propriétés en fonction du thème
  const textColor = theme === 'dark' ? '#E0E0E0' : '#333333';
  const mutedTextColor = theme === 'dark' ? '#A0A0A0' : '#666666';
  const borderColor = theme === 'dark' ? '#555555' : '#AAAAAA';
  const backgroundColorPage = theme === 'dark' ? '#1A1A2E' : '#f9fafb'
  const sectionBgColor = theme === 'dark' ? '#2A2A3A' : '#F5F0E1'; // Fond des sections/cartes
  const highlightColor = theme === 'dark' ? '#8BC4FF' : '#4A90E2'; // Couleur d'accent
  const inputBgColor = theme === 'dark' ? '#1F1F2A' : '#FFFFFF';
  const inputReadOnlyBgColor = theme === 'dark' ? '#1A1A22' : '#F0F0F0'; // Couleur pour les inputs en lecture seule
  const inputBorderColor = theme === 'dark' ? '#444444' : '#CCCCCC';

  // Couleurs des boutons
  const buttonPrimaryBg = theme === 'dark' ? '#005bb5' : '#0070f3';
  const buttonPrimaryHoverBg = theme === 'dark' ? '#004a99' : '#005edb';
  const buttonPrimaryText = theme === 'dark' ? '#E0E0E0' : 'white';

  const buttonDangerBg = theme === 'dark' ? '#B03A2E' : '#dc3545'; // Rouge plus doux en dark
  const buttonDangerHoverBg = theme === 'dark' ? '#993026' : '#c82333';

  const buttonSuccessBg = theme === 'dark' ? '#28A745' : '#28a745';
  const buttonSuccessHoverBg = theme === 'dark' ? '#218838' : '#218838';

  const buttonSecondaryBg = theme === 'dark' ? '#6c757d' : '#6c757d';
  const buttonSecondaryHoverBg = theme === 'dark' ? '#5a6268' : '#5a6268';

  // Ombres
  const shadowColorCard = theme === 'dark' ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.2)';
  const shadowColorButton = theme === 'dark' ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.15)';
  const textShadowColor = theme === 'dark' ? 'rgba(0,0,0,0.6)' : 'rgba(150,150,150,0.4)';


  return (
    // Le style sur le div parent injecte les variables CSS pour le thème
    <div
      className={styles.pageContainer}
      style={{
        backgroundColor: backgroundColorPage,
        // Définition des variables CSS consommées par settings.module.css
        '--kiwi-text-primary': textColor,
        '--kiwi-text-secondary': mutedTextColor,
        '--kiwi-border-color': borderColor,
        '--kiwi-background-section': sectionBgColor,
        '--kiwi-highlight-color': highlightColor,
        '--kiwi-input-background-color': inputBgColor,
        '--kiwi-input-readonly-background-color': inputReadOnlyBgColor,
        '--kiwi-input-border-color': inputBorderColor,
        '--kiwi-button-primary-bg': buttonPrimaryBg,
        '--kiwi-button-primary-hover-bg': buttonPrimaryHoverBg,
        '--kiwi-button-primary-text': buttonPrimaryText,
        '--kiwi-button-danger-bg': buttonDangerBg,
        '--kiwi-button-danger-hover-bg': buttonDangerHoverBg,
        '--kiwi-button-success-bg': buttonSuccessBg,
        '--kiwi-button-success-hover-bg': buttonSuccessHoverBg,
        '--kiwi-button-secondary-bg': buttonSecondaryBg,
        '--kiwi-button-secondary-hover-bg': buttonSecondaryHoverBg,
        '--kiwi-shadow-color-card': shadowColorCard,
        '--kiwi-shadow-color-button': shadowColorButton,
        '--kiwi-text-shadow': `2px 2px 0px ${textShadowColor}`
      } as React.CSSProperties} // Cast pour permettre les CSS variables
    >
      <h1 className={styles.title}>
        Configuration du Quartier Général
      </h1>
      <p className={styles.subtitle}>
        "Ajustez les paramètres de votre compte et les préférences opérationnelles de l'application."
      </p>

      {/* Section 1: Informations d'Agent */}
      <section className={styles.settingSection}>
        <h2 className={styles.sectionTitle}>
          Dossier d'Agent
        </h2>
        <p className={styles.sectionDescription}>Gérez vos informations personnelles et votre profil d'agent.</p>
        <div className={styles.formGroup}>
          <label htmlFor="name" className={styles.formLabel}>Nom de Code :</label>
          <input type="text" id="name" defaultValue="Agent Phoenix" className={styles.formInput} />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="email" className={styles.formLabel}>Adresse de Transmission (E-mail) :</label>
          <input type="email" id="email" defaultValue="phoenix.agent@kiwi-ops.com" readOnly className={styles.formInput} />
          <small className={styles.smallText}>Contactez le Commandement pour modifier votre adresse de transmission.</small>
        </div>
        <button className={`${styles.button} ${styles.buttonPrimary}`}>
          Mettre à Jour le Dossier
        </button>
        <p className={styles.smallText} style={{ marginTop: '1.5rem' }}>
          Pour tout problème lié à votre dossier d'agent ou votre profil, veuillez contacter :{" "}
          <a href="mailto:account@kiwi-ops.com" className={styles.infoLink}>account@kiwi-ops.com</a>.
        </p>
      </section>

      {/* Section 2: Protocoles de Sécurité */}
      <section className={styles.settingSection}>
        <h2 className={styles.sectionTitle}>
          Protocoles de Sécurité
        </h2>
        <p className={styles.sectionDescription}>Gérez votre code secret et vos préférences de sécurité.</p>
        <div className={styles.formGroup}>
          <label htmlFor="current-password" className={styles.formLabel}>Code Secret Actuel :</label>
          <input type="password" id="current-password" className={styles.formInput} />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="new-password" className={styles.formLabel}>Nouveau Code Secret :</label>
          <input type="password" id="new-password" className={styles.formInput} />
        </div>
        <button className={`${styles.button} ${styles.buttonPrimary}`}>
          Modifier le Code Secret
        </button>
        <div className={styles.checkboxGroup} style={{ marginTop: '2rem' }}>
          <input type="checkbox" id="two-factor-auth" className={styles.checkboxInput} />
          <label htmlFor="two-factor-auth" className={styles.checkboxLabel}>Activer l'Authentification Renforcée (2FA)</label>
        </div>
        <p className={styles.smallText} style={{ marginTop: '1.5rem' }}>
          Pour toute préoccupation de sécurité ou pour signaler une vulnérabilité, veuillez contacter :{" "}
          <a href="mailto:security@kiwi-ops.com" className={styles.infoLink}>security@kiwi-ops.com</a>.
        </p>
      </section>

      {/* Section 3: Alertes et Notifications */}
      <section className={styles.settingSection}>
        <h2 className={styles.sectionTitle}>
          Alertes et Notifications
        </h2>
        <p className={styles.sectionDescription}>Choisissez comment recevoir les mises à jour et les alertes opérationnelles.</p>
        <div className={styles.checkboxGroup}>
          <input type="checkbox" id="email-notifications" defaultChecked className={styles.checkboxInput} />
          <label htmlFor="email-notifications" className={styles.checkboxLabel}>Notifications par Transmission E-mail</label>
        </div>
        <div className={styles.checkboxGroup}>
          <input type="checkbox" id="inapp-notifications" defaultChecked className={styles.checkboxInput} />
          <label htmlFor="inapp-notifications" className={styles.checkboxLabel}>Alertes Intégrées à l'Interface</label>
        </div>
        <div className={styles.checkboxGroup}>
          <input type="checkbox" id="scan-notifications" defaultChecked className={styles.checkboxInput} />
          <label htmlFor="scan-notifications" className={styles.checkboxLabel}>Alertes de Fin de Scan d'Analyse</label>
        </div>
        <button className={`${styles.button} ${styles.buttonPrimary}`}>
          Mettre à Jour les Préférences d'Alertes
        </button>
        <p className={styles.smallText} style={{ marginTop: '1.5rem' }}>
          Des difficultés avec les notifications ? Contactez l'Équipe de Support :{" "}
          <a href="mailto:support@kiwi-ops.com" className={styles.infoLink}>support@kiwi-ops.com</a>.
        </p>
      </section>

      {/* Section 4: Accréditation et Protocole Financier (si applicable) */}
      <section className={styles.settingSection}>
        <h2 className={styles.sectionTitle}>
          Accréditation & Protocole Financier
        </h2>
        <p className={styles.sectionDescription}>Gérez votre niveau d'accréditation et vos méthodes de paiement.</p>
        <p style={{ marginBottom: '1rem', color: textColor }}>Votre accréditation actuelle : <strong>Protocole Alpha</strong> (<a href="#" className={styles.infoLink}>Mettre à Niveau / Rétrograder</a>)</p>
        <p style={{ marginBottom: '1rem', color: textColor }}>Méthode de Paiement Enregistrée : **** **** **** 1234 (Valide jusqu'à 12/25)</p>
        <button className={`${styles.button} ${styles.buttonPrimary}`} style={{ marginRight: '1rem' }}>
          Mettre à Jour le Protocole de Paiement
        </button>
        <button className={`${styles.button} ${styles.buttonSecondary}`}>
          Consulter les Facturations
        </button>
        <p className={styles.smallText} style={{ marginTop: '1.5rem' }}>
          Pour toutes questions relatives à l'accréditation ou aux transactions, veuillez contacter :{" "}
          <a href="mailto:billing@kiwi-ops.com" className={styles.infoLink}>billing@kiwi-ops.com</a>.
        </p>
      </section>

      {/* Section 5: Données et Confidentialité (Crucial pour le professionnalisme) */}
      <section className={styles.settingSection}>
        <h2 className={styles.sectionTitle}>
          Données et Confidentialité
        </h2>
        <p className={styles.sectionDescription}>Gérez vos données personnelles et vos paramètres de confidentialité.</p>
        <button className={`${styles.button} ${styles.buttonSuccess}`} style={{ marginRight: '1rem' }}>
          Extraire mes Données
        </button>
        <button className={`${styles.button} ${styles.buttonDanger}`}>
          Supprimer mon Dossier d'Agent
        </button>
        <p className={styles.smallText} style={{ marginTop: '1.5rem' }}>
          Pour toute question concernant la confidentialité de vos données, l'accès, les requêtes de suppression, ou pour signaler des brèches, veuillez contacter :{" "}
          <a href="mailto:privacy@kiwi-ops.com" className={styles.infoLink}>privacy@kiwi-ops.com</a>.
        </p>
        <p className={styles.smallText} style={{ marginTop: '0.5rem' }}>
          Veuillez également consulter nos{" "}
          <a href="/privacy-policy" className={styles.infoLink}>Politique de Confidentialité</a>
          {" "} et{" "}
          <a href="/terms" className={styles.infoLink}>Conditions Générales d'Utilisation</a>.
        </p>
      </section>

      {/* Section 6: Assistance et Support Général */}
      <section className={styles.settingSection}>
        <h2 className={styles.sectionTitle}>
          Assistance & Support du QG
        </h2>
        <p className={styles.sectionDescription}>Besoin d'une assistance supplémentaire ? Notre équipe est là pour vous aider.</p>
        <p className={styles.smallText} style={{ marginTop: '1.5rem' }}>
          Pour toute autre question ou un support général, veuillez contacter :{" "}
          <a href="mailto:support@kiwi-ops.com" className={styles.infoLink}>support@kiwi-ops.com</a>.
        </p>
        <p className={styles.smallText} style={{ marginTop: '0.5rem' }}>
          Vous pouvez également visiter notre{" "}
          <a href="/help-center" className={styles.infoLink}>Centre d'Aide</a> (si vous en avez un).
        </p>
      </section>

      <p className={styles.globalFooter}>
        © {new Date().getFullYear()} Kiwi-Ops – Tous droits d'accès réservés.
      </p>
    </div>
  );
}