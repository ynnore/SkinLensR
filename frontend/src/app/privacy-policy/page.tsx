      
'use client'; // Indique que ce composant est un Client Component (nécessaire pour les hooks comme useTheme)

import { useTheme } from '../../context/ThemeContext'; // Importez le hook useTheme
import styles from './privacy-policy.module.css'; // Importez le CSS module

export default function PrivacyPolicyPage() {
  const { theme } = useTheme(); // Accédez au thème actuel

  // Définissez les couleurs et autres propriétés en fonction du thème
  const textColor = theme === 'dark' ? '#E0E0E0' : '#333333';
  const mutedTextColor = theme === 'dark' ? '#A0A0A0' : '#666666';
  const borderColor = theme === 'dark' ? '#555555' : '#AAAAAA';
  const backgroundColorPage = theme === 'dark' ? '#1A1A2E' : '#f9fafb';
  const highlightColor = theme === 'dark' ? '#8BC4FF' : '#4A90E2'; // Couleur d'accent
  const textShadowColor = theme === 'dark' ? 'rgba(0,0,0,0.6)' : 'rgba(150,150,150,0.4)';

  const lastUpdatedDate = "15 juillet 2025";

  return (
    // Le style sur le div parent injecte les variables CSS pour le thème
    <div
      className={styles.pageContainer}
      style={{
        backgroundColor: backgroundColorPage,
        // Définition des variables CSS consommées par privacy-policy.module.css
        '--kiwi-text-primary': textColor,
        '--kiwi-text-secondary': mutedTextColor,
        '--kiwi-border-color': borderColor,
        '--kiwi-highlight-color': highlightColor,
        '--kiwi-text-shadow': `2px 2px 0px ${textShadowColor}`
        // Assurez-vous que --font-special-elite et --font-courier-prime sont définis globalement
        // ou utilisez les fallbacks définis dans le CSS module.
      } as React.CSSProperties} // Cast pour permettre les CSS variables
    >
      <h1 className={styles.title}>
        Protocole de Confidentialité<br />— Sécurité des Données —
      </h1>
      <p className={styles.subtitle}>
        Dernière mise à jour : {lastUpdatedDate}
      </p>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          1. Introduction et Engagement
        </h2>
        <p className={styles.sectionText}>
          Chez Kiwi-Ops, nous nous engageons fermement à protéger votre vie privée et la confidentialité de vos informations. Ce Protocole de Confidentialité explique comment nous recueillons, utilisons, divulguons et protégeons vos renseignements personnels lorsque vous utilisez nos services, notre site web et nos applications (collectivement, les "Services").
        </p>
        <p className={styles.sectionText}>
          En utilisant nos Services, vous consentez aux pratiques décrites dans ce Protocole. Pour toute question ou préoccupation concernant nos pratiques en matière de confidentialité, veuillez nous contacter à :{" "}
          <a href="mailto:privacy@kiwi-ops.com" className={styles.infoLink}>privacy@kiwi-ops.com</a>.
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          2. Renseignements Collectés
        </h2>
        <p className={styles.sectionText}>
          Nous recueillons différents types d'informations pour fournir et améliorer nos Services :
        </p>
        <h3 className={styles.subSectionTitle}>
          2.1 Données Personnelles de l'Agent
        </h3>
        <p className={styles.sectionText}>
          Lorsque vous créez un compte d'agent ou utilisez nos Services, nous pouvons vous demander de nous fournir certaines informations personnellement identifiables qui peuvent être utilisées pour vous contacter ou vous identifier ("Données Personnelles"). Cela peut inclure, sans s'y limiter :
        </p>
        <ul className={styles.sectionList}>
          <li className={styles.sectionListItem}>Nom et prénom</li>
          <li className={styles.sectionListItem}>Adresse e-mail (Adresse de Transmission)</li>
          <li className={styles.sectionListItem}>Numéro de téléphone sécurisé</li>
          <li className={styles.sectionListItem}>Informations de facturation (si applicable pour l'accréditation)</li>
          <li className={styles.sectionListItem}>Données d'utilisation (voir ci-dessous)</li>
        </ul>

        <h3 className={styles.subSectionTitle}>
          2.2 Données d'Opérations et d'Utilisation
        </h3>
        <p className={styles.sectionText}>
          Nous pouvons également collecter des informations sur la manière dont les Services sont consultés et utilisés ("Données d'Utilisation"). Ces Données d'Utilisation peuvent inclure des informations telles que l'adresse IP de votre terminal de commandement, le type et la version du navigateur sécurisé, les pages de nos Services que vous visitez, l'heure et la date de votre session, le temps passé sur ces pages, les identifiants uniques d'appareil et d'autres données de diagnostic de système.
        </p>

        <h3 className={styles.subSectionTitle}>
          2.3 Protocoles de Suivi et Cookies Opérationnels
        </h3>
        <p className={styles.sectionText}>
          Nous utilisons des cookies et des technologies de suivi similaires pour surveiller l'activité sur nos Services et conserver certaines informations opérationnelles.
          Les cookies sont des fichiers avec une petite quantité de données qui peuvent inclure un identifiant unique anonyme. Ces identifiants sont transmis à votre navigateur à partir d'une interface sécurisée et stockés sur votre appareil pour optimiser votre expérience.
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          3. Finalités de l'Utilisation des Renseignements
        </h2>
        <p className={styles.sectionText}>
          Kiwi-Ops utilise les données collectées à diverses fins opérationnelles :
        </p>
        <ul className={styles.sectionList}>
          <li className={styles.sectionListItem}>Pour fournir et maintenir nos Services en état d'alerte</li>
          <li className={styles.sectionListItem}>Pour vous notifier des changements importants apportés à nos Services</li>
          <li className={styles.sectionListItem}>Pour vous permettre de participer à des fonctionnalités interactives lorsque vous choisissez de le faire</li>
          <li className={styles.sectionListItem}>Pour fournir un support technique et opérationnel</li>
          <li className={styles.sectionListItem}>Pour surveiller l'utilisation et la performance de nos Services</li>
          <li className={styles.sectionListItem}>Pour détecter, prévenir et résoudre les anomalies techniques</li>
          <li className={styles.sectionListItem}>Pour gérer votre dossier d'agent et vous envoyer des informations stratégiques pertinentes</li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          4. Divulgation des Renseignements
        </h2>
        <p className={styles.sectionText}>
          Nous ne vendons, n'échangeons ni ne louons vos informations personnelles à des entités tierces. Nous pouvons partager vos informations avec des fournisseurs de services tiers qui exécutent des services en notre nom (par exemple, traitement des accréditations financières, hébergement sécurisé, analyse de données opérationnelles). Ces tiers sont contractuellement tenus de maintenir la confidentialité de vos informations et de ne les utiliser qu'aux fins pour lesquelles nous les avons divulguées.
        </p>
        <p className={styles.sectionText}>
          Nous pouvons également divulguer vos informations si la loi l'exige ou en réponse à des demandes validées des autorités compétentes (par exemple, une cour de justice ou une agence gouvernementale dûment mandatée). Pour les questions spécifiques à la divulgation légale, vous pouvez contacter :{" "}
          <a href="mailto:legal@kiwi-ops.com" className={styles.infoLink}>legal@kiwi-ops.com</a>.
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          5. Droits de l'Agent en Matière de Protection des Données
        </h2>
        <p className={styles.sectionText}>
          Selon votre juridiction et le protocole en vigueur, vous pouvez disposer de certains droits concernant vos informations personnelles, notamment :
        </p>
        <ul className={styles.sectionList}>
          <li className={styles.sectionListItem}>Le droit d'accéder à votre dossier de renseignements.</li>
          <li className={styles.sectionListItem}>Le droit de rectifier les informations inexactes de votre dossier.</li>
          <li className={styles.sectionListItem}>Le droit de demander la suppression de votre dossier de renseignements.</li>
          <li className={styles.sectionListItem}>Le droit de vous opposer au traitement de certaines de vos informations.</li>
          <li className={styles.sectionListItem}>Le droit de retirer votre consentement pour le traitement des données.</li>
          <li className={styles.sectionListItem}>Le droit à la portabilité de vos données opérationnelles.</li>
        </ul>
        <p className={styles.sectionText}>
          Pour exercer l'un de ces droits, veuillez nous contacter au Département de la Confidentialité :{" "}
          <a href="mailto:privacy@kiwi-ops.com" className={styles.infoLink}>privacy@kiwi-ops.com</a>.
          Nous répondrons à votre requête conformément aux directives et lois applicables.
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          6. Sécurisation des Données Opérationnelles
        </h2>
        <p className={styles.sectionText}>
          La sécurité de vos données est une priorité absolue pour nous, mais aucune méthode de transmission sur les réseaux ou de stockage électronique n'est totalement inviolable. Bien que nous nous efforcions d'utiliser des moyens commercialement acceptables et des protocoles avancés pour protéger vos Données Personnelles, nous ne pouvons garantir leur sécurité absolue contre toute intrusion non autorisée.
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          7. Liens vers les Canaux Externes
        </h2>
        <p className={styles.sectionText}>
          Nos Services peuvent contenir des liens vers d'autres interfaces ou sites qui ne sont pas sous notre contrôle opérationnel. Si vous cliquez sur un lien externe, vous serez redirigé vers l'interface de cette entité tierce. Nous vous conseillons vivement de consulter le protocole de confidentialité de chaque interface que vous visitez.
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          8. Révisions du Protocole de Confidentialité
        </h2>
        <p className={styles.sectionText}>
          Nous pouvons mettre à jour notre Protocole de Confidentialité de temps à autre pour refléter les évolutions des menaces ou de nos pratiques. Nous vous informerons de tout changement majeur en publiant la nouvelle version du Protocole sur cette page. Nous vous conseillons de consulter ce Protocole périodiquement pour toute révision.
        </p>
        <p className={styles.sectionText}>
          Les modifications de ce Protocole de Confidentialité sont effectives dès leur publication sur cette page. La date de "Dernière mise à jour" en haut de cette page indique la date de la dernière révision approuvée.
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          9. Contact du Département de la Confidentialité
        </h2>
        <p className={styles.sectionText}>
          Si vous avez des questions concernant ce Protocole de Confidentialité, les pratiques de notre réseau ou vos interactions avec nos Services, vous pouvez contacter le Département de la Confidentialité :
        </p>
        <ul className={styles.sectionList}>
          <li className={styles.sectionListItem}>
            Par e-mail :{" "}
            <a href="mailto:privacy@kiwi-ops.com" className={styles.infoLink}>privacy@kiwi-ops.com</a>
            {" "} (pour les questions spécifiques à la confidentialité)
          </li>
          <li className={styles.sectionListItem}>
            Par e-mail :{" "}
            <a href="mailto:support@kiwi-ops.com" className={styles.infoLink}>support@kiwi-ops.com</a>
            {" "} (pour le support général ou les questions techniques)
          </li>
          <li className={styles.sectionListItem}>
            Par e-mail :{" "}
            <a href="mailto:legal@kiwi-ops.com" className={styles.infoLink}>legal@kiwi-ops.com</a>
            {" "} (pour les questions légales plus générales ou les requêtes des autorités)
          </li>
        </ul>
        <p className={styles.sectionText}>
          Veuillez également consulter nos{" "}
          <a href="/terms" className={styles.infoLink}>Protocoles de Service (Conditions Générales d'Utilisation)</a>
          {" "} pour plus d'informations sur l'utilisation de nos Services.
        </p>
      </section>

      <p className={styles.globalFooter}>
        © {new Date().getFullYear()} Kiwi-Ops – Protocole de Confidentialité Actif.
      </p>
    </div>
  );
}

    

