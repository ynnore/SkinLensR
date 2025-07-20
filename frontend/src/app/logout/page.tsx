// Fichier: src/app/logout/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useTheme } from '../../context/ThemeContext'; // Importez le hook useTheme
// Plus tard, tu importeras ta vraie fonction de déconnexion
// import { signOut } from 'next-auth/react';
import styles from './logout.module.css'; // On importe notre propre style

export default function LogoutPage() {
  const router = useRouter();
  const { theme } = useTheme(); // Accédez au thème actuel

  // Définissez les couleurs et autres propriétés en fonction du thème
  const textColor = theme === 'dark' ? '#E0E0E0' : '#333333';
  const mutedTextColor = theme === 'dark' ? '#A0A0A0' : '#666666';
  const borderColor = theme === 'dark' ? '#555555' : '#AAAAAA';
  const backgroundColorPage = theme === 'dark' ? '#1A1A2E' : '#f9fafb';
  const sectionBgColor = theme === 'dark' ? '#2A2A3A' : '#F5F0E1'; // Fond du cadre
  const highlightColor = theme === 'dark' ? '#8BC4FF' : '#4A90E2'; // Couleur d'accent
  const textShadowColor = theme === 'dark' ? 'rgba(0,0,0,0.6)' : 'rgba(150,150,150,0.4)';
  const shadowColorCard = theme === 'dark' ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.2)';
  const shadowColorCardLight = theme === 'dark' ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.1)'; // Pour les sections d'info
  const shadowColorButton = theme === 'dark' ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.15)';

  // Couleurs des boutons
  const buttonPrimaryText = theme === 'dark' ? '#E0E0E0' : 'white';

  const buttonDangerBg = theme === 'dark' ? '#B03A2E' : '#dc3545'; // Rouge pour la confirmation de départ
  const buttonDangerHoverBg = theme === 'dark' ? '#993026' : '#c82333';

  const buttonSecondaryBg = theme === 'dark' ? '#6c757d' : '#6c757d'; // Gris pour annuler
  const buttonSecondaryHoverBg = theme === 'dark' ? '#5a6268' : '#5a6268';

  // Couleurs de la section info
  const infoBackground = theme === 'dark' ? '#3A3A4A' : '#EFEBE9'; // Un gris plus clair ou un beige
  const infoBorder = theme === 'dark' ? '#4A4A5A' : '#D0D0D0';


  // Fonction pour confirmer la déconnexion
  const handleConfirmLogout = async () => {
    console.log('Demande de permission approuvée. Démobilisation en cours...');
    // --- ICI EST LE POINT D'INTÉGRATION FUTUR ---
    // En production, tu appelleras ta fonction de déconnexion réelle (par ex. NextAuth.js)
    // await signOut({ redirect: false });
    router.push('/'); // Redirige vers la page de login après déconnexion effective
  };

  // Fonction pour annuler et retourner au service
  const handleCancel = () => {
    router.back(); // Retourne à la page précédente (probablement le dashboard)
  };

  return (
    <div
      className={styles.pageContainer}
      style={{
        backgroundColor: backgroundColorPage,
        // Définition des variables CSS consommées par logout.module.css
        '--kiwi-text-primary': textColor,
        '--kiwi-text-secondary': mutedTextColor,
        '--kiwi-border-color': borderColor,
        '--kiwi-background-section': sectionBgColor,
        '--kiwi-highlight-color': highlightColor,
        '--kiwi-text-shadow': `2px 2px 0px ${textShadowColor}`,
        '--kiwi-shadow-color-card': shadowColorCard,
        '--kiwi-shadow-color-card-light': shadowColorCardLight,
        '--kiwi-shadow-color-button': shadowColorButton,
        '--kiwi-button-primary-text': buttonPrimaryText,
        '--kiwi-button-danger-bg': buttonDangerBg,
        '--kiwi-button-danger-hover-bg': buttonDangerHoverBg,
        '--kiwi-button-secondary-bg': buttonSecondaryBg,
        '--kiwi-button-secondary-hover-bg': buttonSecondaryHoverBg,
        '--kiwi-info-background': infoBackground,
        '--kiwi-info-border': infoBorder,
      } as React.CSSProperties} // Cast pour permettre les CSS variables
    >
      <div className={styles.formWrapper}>
        <h1 className={styles.title}>Demande de Permission</h1>
        <p className={styles.preamble}>
          Agent, votre demande de permission a été enregistrée. Veuillez confirmer votre départ du poste. Vos accès seront suspendus jusqu'à votre retour.
        </p>

        <div className={styles.infoSection}>
          <p><span>MATRICULE :</span> KWI-007</p>
          <p><span>NOM DE CODE :</span> Ronny</p>
          <p><span>POSTE ACTUEL :</span> État-Major</p>
        </div>

        <div className={styles.buttonContainer}>
          <button onClick={handleCancel} className={`${styles.button} ${styles.cancelButton}`}>
            ANNULER ET REPRENDRE LE SERVICE
          </button>
          <button onClick={handleConfirmLogout} className={`${styles.button} ${styles.confirmButton}`}>
            CONFIRMER LA DEMANDE ET QUITTER LE POSTE
          </button>
        </div>

        <p className={styles.footerText}>
          La discrétion est requise, même en permission.
        </p>
      </div>
    </div>
  );
}

    


