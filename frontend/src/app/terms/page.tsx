// Fichier: src/app/terms/page.tsx
'use client'; // Indique que ce composant est un Client Component

import { useTheme } from '../../context/ThemeContext'; // Importez le hook useTheme

export default function TermsPage() {
  const { theme } = useTheme(); // Accédez au thème actuel

  // Définissez les couleurs en fonction du thème
  const textColor = theme === 'dark' ? '#E0E0E0' : '#333';
  const linkColor = theme === 'dark' ? '#8BC4FF' : '#0070f3';
  const mutedTextColor = theme === 'dark' ? '#A0A0A0' : '#666';
  const borderColor = theme === 'dark' ? '#444' : '#eee';

  const lastUpdatedDate = "25 juillet 2024";

  return (
    <div style={{
      padding: '2rem',
      maxWidth: '800px',
      margin: '0 auto',
      lineHeight: '1.6',
      fontSize: '1rem',
      color: textColor
    }}>
      <h1 style={{ marginBottom: '1rem', fontSize: '2.5rem' }}>Terms and Conditions</h1>
      <p style={{ fontStyle: 'italic', marginBottom: '2rem', color: mutedTextColor }}>
        Dernière mise à jour : {lastUpdatedDate}
      </p>

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.8rem', marginBottom: '0.8rem', borderBottom: `1px solid ${borderColor}`, paddingBottom: '0.4rem' }}>
          1. Introduction
        </h2>
        <p>
          Bienvenue sur le site de Kiwi-Ops. Ces conditions générales d'utilisation (les "Conditions") régissent votre accès et votre utilisation de notre site web, applications et services (collectivement, les "Services"). En accédant ou en utilisant les Services, vous acceptez d'être lié par ces Conditions.
        </p>
        <p>
          Si vous avez des questions concernant ces Conditions, veuillez nous contacter à l'adresse suivante :{" "}
          <a href="mailto:terms@kiwi-ops.com" style={{ color: linkColor, textDecoration: 'none' }}>terms@kiwi-ops.com</a>.
        </p>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.8rem', marginBottom: '0.8rem', borderBottom: `1px solid ${borderColor}`, paddingBottom: '0.4rem' }}>
          2. Votre Compte
        </h2>
        <p>
          Pour accéder à certaines fonctionnalités de nos Services, il peut vous être demandé de créer un compte. Vous êtes responsable du maintien de la confidentialité de vos informations de compte et de toutes les activités qui se produisent sous votre compte.
        </p>
        <p>
          En cas de problème avec votre compte ou si vous suspectez une activité non autorisée, veuillez contacter notre support général :{" "}
          <a href="mailto:support@kiwi-ops.com" style={{ color: linkColor, textDecoration: 'none' }}>support@kiwi-ops.com</a>.
        </p>
      </section>

      {/* Ajoutez ici toutes vos autres sections de conditions générales */}
      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.8rem', marginBottom: '0.8rem', borderBottom: `1px solid ${borderColor}`, paddingBottom: '0.4rem' }}>
          3. Utilisation des Services
        </h2>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        </p>
        {/* Continuez avec d'autres paragraphes ou sous-sections */}
      </section>

      {/* Exemple de section pour la politique de confidentialité (si séparée) */}
      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.8rem', marginBottom: '0.8rem', borderBottom: `1px solid ${borderColor}`, paddingBottom: '0.4rem' }}>
          4. Politique de Confidentialité
        </h2>
        <p>
          Votre vie privée est importante pour nous. Notre Politique de Confidentialité décrit comment nous recueillons, utilisons et partageons vos informations. Nous vous invitons à la consulter attentivement.
        </p>
        <p>
          Vous pouvez consulter notre Politique de Confidentialité complète ici :{" "}
          <a href="/privacy-policy" style={{ color: linkColor, textDecoration: 'none' }}>[Lien vers la Politique de Confidentialité]</a>.
        </p>
        <p>
          Pour toute question relative à la protection de vos données personnelles, veuillez nous contacter à :{" "}
          <a href="mailto:privacy@kiwi-ops.com" style={{ color: linkColor, textDecoration: 'none' }}>privacy@kiwi-ops.com</a>.
        </p>
      </section>

      {/* Section finale */}
      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.8rem', marginBottom: '0.8rem', borderBottom: `1px solid ${borderColor}`, paddingBottom: '0.4rem' }}>
          5. Contact
        </h2>
        <p>
          Si vous avez d'autres questions ou préoccupations concernant ces Conditions Générales, vous pouvez nous contacter à :
        </p>
        <ul>
          <li style={{ marginBottom: '0.5rem' }}>
            Pour les questions spécifiques aux conditions :{" "}
            <a href="mailto:terms@kiwi-ops.com" style={{ color: linkColor, textDecoration: 'none' }}>terms@kiwi-ops.com</a>
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            Pour les questions de confidentialité :{" "}
            <a href="mailto:privacy@kiwi-ops.com" style={{ color: linkColor, textDecoration: 'none' }}>privacy@kiwi-ops.com</a>
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            Pour le support général :{" "}
            <a href="mailto:support@kiwi-ops.com" style={{ color: linkColor, textDecoration: 'none' }}>support@kiwi-ops.com</a>
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            Pour les questions légales générales :{" "}
            <a href="mailto:legal@kiwi-ops.com" style={{ color: linkColor, textDecoration: 'none' }}>legal@kiwi-ops.com</a>
          </li>
        </ul>
      </section>

      <p style={{ textAlign: 'center', marginTop: '3rem', fontSize: '0.9rem', color: mutedTextColor }}>
        © {new Date().getFullYear()} Kiwi-Ops. Tous droits réservés.
      </p>
    </div>
  );
}