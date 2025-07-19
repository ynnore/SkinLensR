'use client';

import { useTheme } from '../../context/ThemeContext';
// On importe les types que l'on vient de créer !
import { UserProfile, AccreditationLevel } from '../../types/user';
import styles from './profile.module.css'; // Importez le CSS module

export default function ProfilePage() {
  const { theme } = useTheme();

  // --- Données de démonstration utilisant notre nouvelle structure ---
  // Plus tard, ces données viendront de ta base de données.
  const user: UserProfile = {
    id: 'xyz-123',
    email: 'ronny@kiwi-ops.com',
    nomDeCode: 'Agent Phoenix', // Exemple de nom de code
    matricule: 'KWI-007',
    accreditation: AccreditationLevel.COMMANDANT, // Tu peux changer ça en .AGENT ou .OFFICIER pour tester
    dateEnrolement: '18 juillet 2024',
  };
  // --- Fin des données de démo ---

  // Définissez les couleurs et autres propriétés en fonction du thème
  const textColor = theme === 'dark' ? '#E0E0E0' : '#333333';
  const mutedTextColor = theme === 'dark' ? '#A0A0A0' : '#666666';
  const borderColor = theme === 'dark' ? '#555555' : '#AAAAAA';
  const backgroundColorPage = theme === 'dark' ? '#1A1A2E' : '#FFF8E1'; // Fond de page légèrement crème
  const sectionBgColor = theme === 'dark' ? '#2A2A3A' : '#F5F0E1'; // Fond des sections/cartes
  const highlightColor = theme === 'dark' ? '#8BC4FF' : '#4A90E2'; // Couleur d'accent
  const textShadowColor = theme === 'dark' ? 'rgba(0,0,0,0.6)' : 'rgba(150,150,150,0.4)';
  const shadowColorCard = theme === 'dark' ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.2)';

  // Couleurs spécifiques pour le message d'accréditation
  const accreditationBorderColor = theme === 'dark' ? '#6C757D' : '#8A9BA8'; // Gris-bleu neutre
  const accreditationBackgroundColor = theme === 'dark' ? '#3B4A5C' : '#E0E8ED'; // Bleu-gris clair

  if (!user) {
    return (
      <div className={styles.pageContainer} style={{ backgroundColor: backgroundColorPage, color: textColor }}>
        Chargement des informations de l'agent...
      </div>
    );
  }

  return (
    <div
      className={styles.pageContainer}
      style={{
        backgroundColor: backgroundColorPage,
        // Définition des variables CSS consommées par profile.module.css
        '--kiwi-text-primary': textColor,
        '--kiwi-text-secondary': mutedTextColor,
        '--kiwi-border-color': borderColor,
        '--kiwi-background-section': sectionBgColor,
        '--kiwi-highlight-color': highlightColor,
        '--kiwi-text-shadow': `2px 2px 0px ${textShadowColor}`,
        '--kiwi-shadow-color-card': shadowColorCard,
        '--kiwi-border-color-muted': mutedTextColor, // Une bordure plus discrète pour les labels
        '--kiwi-border-color-accreditation': accreditationBorderColor, // Couleur spécifique pour l'accréditation
        '--kiwi-background-accreditation': accreditationBackgroundColor, // Couleur de fond spécifique
      } as React.CSSProperties} // Cast pour permettre les CSS variables
    >
      <h1 className={styles.title}>
        Fiche d'Agent
      </h1>
      <p className={styles.subtitle}>
        "Accès sécurisé à votre dossier personnel et vos accréditations de service au sein de Kiwi-Ops."
      </p>

      <div className={styles.profileSection}>
        <div className={styles.infoGroup}>
          <h2 className={styles.label}>Nom de Code</h2>
          <p className={styles.value}>{user.nomDeCode}</p>
        </div>

        <div className={styles.infoGroup}>
          <h2 className={styles.label}>Matricule d'Agent</h2>
          <p className={styles.value}>{user.matricule}</p>
        </div>

        <div className={styles.infoGroup}>
          <h2 className={styles.label}>Niveau d'Accréditation</h2>
          <p className={styles.value}>{user.accreditation}</p>
        </div>

        <div className={styles.infoGroup}>
          <h2 className={styles.label}>Date d'Enrôlement</h2>
          <p className={styles.value}>{user.dateEnrolement}</p>
        </div>

        <div className={styles.infoGroup}>
          <h2 className={styles.label}>Adresse de Transmission</h2>
          <p className={styles.value}>{user.email}</p>
        </div>
        
        {/* Affichage conditionnel basé sur le niveau d'accréditation */}
        {user.accreditation === AccreditationLevel.COMMANDANT && (
          <div className={styles.accreditationMessage}>
            <p>Accès de Commandement activé. Vous disposez des autorisations maximales pour les opérations.</p>
          </div>
        )}
        {user.accreditation === AccreditationLevel.OFFICIER && (
          <div className={styles.accreditationMessage}>
            <p>Accès d'Officier activé. Vous disposez d'autorisations élevées pour la gestion des opérations.</p>
          </div>
        )}
        {user.accreditation === AccreditationLevel.AGENT && (
          <div className={styles.accreditationMessage}>
            <p>Accès d'Agent activé. Vos autorisations sont dédiées aux opérations de terrain et de renseignement.</p>
          </div>
        )}

      </div>

      <p className={styles.globalFooter}>
        © {new Date().getFullYear()} Kiwi-Ops – Protocole de Profil Sécurisé.
      </p>
    </div>
  );
}