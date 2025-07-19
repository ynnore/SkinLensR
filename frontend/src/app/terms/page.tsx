'use client'; // Indique que ce composant est un Client Component

import { useTheme } from '../../context/ThemeContext'; // Importez le hook useTheme
import styles from './terms.module.css'; // Importez le CSS module

export default function TermsPage() {
  const { theme } = useTheme(); // Accédez au thème actuel

  // Définissez les couleurs et autres propriétés en fonction du thème
  const textColor = theme === 'dark' ? '#E0E0E0' : '#333333';
  const mutedTextColor = theme === 'dark' ? '#A0A0A0' : '#666666';
  const borderColor = theme === 'dark' ? '#555555' : '#AAAAAA';
  const backgroundColorPage = theme === 'dark' ? '#1A1A2E' : '#FFF8E1'; // Fond de page légèrement crème
  const highlightColor = theme === 'dark' ? '#8BC4FF' : '#4A90E2'; // Couleur d'accent
  const textShadowColor = theme === 'dark' ? 'rgba(0,0,0,0.6)' : 'rgba(150,150,150,0.4)';

  const lastUpdatedDate = "25 juillet 2024";

  return (
    // Le style sur le div parent injecte les variables CSS pour le thème
    <div
      className={styles.pageContainer}
      style={{
        backgroundColor: backgroundColorPage,
        // Définition des variables CSS consommées par terms.module.css
        '--kiwi-text-primary': textColor,
        '--kiwi-text-secondary': mutedTextColor,
        '--kiwi-border-color': borderColor,
        '--kiwi-highlight-color': highlightColor,
        '--kiwi-text-shadow': `2px 2px 0px ${textShadowColor}`
        // Assurez-vous que --font-special-elite et --font-courier-prime sont définis globalement
        // ou utilisez les fallbacks définis dans connections.module.css.
      } as React.CSSProperties} // Cast pour permettre les CSS variables
    >
      <h1 className={styles.title}>
        Protocoles de Service<br />— Conditions Générales —
      </h1>
      <p className={styles.subtitle}>
        Dernière révision : {lastUpdatedDate}
      </p>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          1. Introduction aux Protocoles
        </h2>
        <p className={styles.sectionText}>
          Bienvenue sur le réseau de Kiwi-Ops. Ces conditions générales d'utilisation (les "Conditions") régissent votre accès et votre utilisation de notre site web, applications et services (collectivement, les "Services"). En accédant ou en utilisant les Services, vous acceptez d'être lié par ces Conditions.
        </p>
        <p className={styles.sectionText}>
          Toute question concernant ces Protocoles doit être adressée au Département des Affaires Légales :{" "}
          <a href="mailto:terms@kiwi-ops.com" className={styles.infoLink}>terms@kiwi-ops.com</a>.
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          2. Gestion de Votre Dossier d'Agent
        </h2>
        <p className={styles.sectionText}>
          Pour accéder à certaines fonctionnalités classifiées de nos Services, il peut vous être demandé de créer et de maintenir un dossier d'agent. Vous êtes seul responsable de la confidentialité de vos accréditations de dossier et de toutes les activités qui en découlent.
        </p>
        <p className={styles.sectionText}>
          En cas de défaillance de votre dossier d'agent ou si vous suspectez une activité non autorisée, veuillez contacter notre centre de support général :{" "}
          <a href="mailto:support@kiwi-ops.com" className={styles.infoLink}>support@kiwi-ops.com</a>.
        </p>
      </section>

      {/* Ajoutez ici toutes vos autres sections de conditions générales, en utilisant les classes */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          3. Directive d'Utilisation des Services
        </h2>
        <p className={styles.sectionText}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        </p>
        <p className={styles.sectionText}>
          [Continuez avec d'autres paragraphes ou sous-sections de vos conditions spécifiques.]
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          4. Protocole de Confidentialité des Données
        </h2>
        <p className={styles.sectionText}>
          La sécurité de vos informations est primordiale pour nous. Notre Protocole de Confidentialité des Données décrit comment nous recueillons, utilisons et partageons vos renseignements. Nous vous invitons à consulter attentivement ce protocole.
        </p>
        <p className={styles.sectionText}>
          Vous pouvez consulter notre Protocole de Confidentialité complet ici :{" "}
          <a href="/privacy-policy" className={styles.infoLink}>[Lien vers le Protocole de Confidentialité]</a>.
        </p>
        <p className={styles.sectionText}>
          Pour toute question relative à la protection de vos données personnelles, veuillez contacter le Département de la Confidentialité :{" "}
          <a href="mailto:privacy@kiwi-ops.com" className={styles.infoLink}>privacy@kiwi-ops.com</a>.
        </p>
      </section>

      {/* Section finale */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          5. Contact du Commandement
        </h2>
        <p className={styles.sectionText}>
          Si vous avez d'autres questions ou préoccupations concernant ces Protocoles de Service, vous pouvez contacter le Commandement aux points de contact désignés :
        </p>
        <ul className={styles.sectionList}>
          <li className={styles.sectionListItem}>
            Pour les questions spécifiques aux conditions :{" "}
            <a href="mailto:terms@kiwi-ops.com" className={styles.infoLink}>terms@kiwi-ops.com</a>
          </li>
          <li className={styles.sectionListItem}>
            Pour les questions de confidentialité :{" "}
            <a href="mailto:privacy@kiwi-ops.com" className={styles.infoLink}>privacy@kiwi-ops.com</a>
          </li>
          <li className={styles.sectionListItem}>
            Pour le support général :{" "}
            <a href="mailto:support@kiwi-ops.com" className={styles.infoLink}>support@kiwi-ops.com</a>
          </li>
          <li className={styles.sectionListItem}>
            Pour les questions légales générales :{" "}
            <a href="mailto:legal@kiwi-ops.com" className={styles.infoLink}>legal@kiwi-ops.com</a>
          </li>
        </ul>
      </section>

      <p className={styles.globalFooter}>
        © {new Date().getFullYear()} Kiwi-Ops – Protocole de Service Actif.
      </p>
    </div>
  );
}