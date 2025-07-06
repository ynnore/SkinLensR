// Fichier: src/app/privacy-policy/page.tsx
'use client'; // Indique que ce composant est un Client Component (nécessaire pour les hooks comme useTheme)

import { useTheme } from '../../context/ThemeContext'; // Importez le hook useTheme

export default function PrivacyPolicyPage() {
  const { theme } = useTheme(); // Accédez au thème actuel

  // Définissez les couleurs en fonction du thème
  const textColor = theme === 'dark' ? '#E0E0E0' : '#333'; // Gris clair pour le mode sombre, gris foncé pour le mode clair
  const linkColor = theme === 'dark' ? '#8BC4FF' : '#0070f3'; // Bleu plus clair pour les liens en mode sombre
  const mutedTextColor = theme === 'dark' ? '#A0A0A0' : '#666'; // Gris plus clair pour les textes secondaires/italiques
  const borderColor = theme === 'dark' ? '#444' : '#eee'; // Bordure plus foncée pour le mode sombre

  const lastUpdatedDate = "25 juillet 2024";

  return (
    <div style={{
      padding: '2rem',
      maxWidth: '800px',
      margin: '0 auto',
      lineHeight: '1.6',
      fontSize: '1rem',
      color: textColor // Appliquez la couleur de texte dynamique
    }}>
      <h1 style={{ marginBottom: '1rem', fontSize: '2.5rem' }}>Privacy Policy</h1>
      <p style={{ fontStyle: 'italic', marginBottom: '2rem', color: mutedTextColor }}> {/* Appliquez la couleur dynamique */}
        Dernière mise à jour : {lastUpdatedDate}
      </p>

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.8rem', marginBottom: '0.8rem', borderBottom: `1px solid ${borderColor}`, paddingBottom: '0.4rem' }}>
          1. Introduction
        </h2>
        <p>
          Chez Kiwi-Ops, nous nous engageons à protéger votre vie privée. Cette Politique de Confidentialité explique comment nous recueillons, utilisons, divulguons et protégeons vos informations personnelles lorsque vous utilisez nos services, notre site web et nos applications (collectivement, les "Services").
        </p>
        <p>
          En utilisant nos Services, vous consentez aux pratiques décrites dans cette Politique de Confidentialité. Si vous avez des questions ou des préoccupations concernant nos pratiques en matière de confidentialité, veuillez nous contacter à :{" "}
          <a href="mailto:privacy@kiwi-ops.com" style={{ color: linkColor, textDecoration: 'none' }}>privacy@kiwi-ops.com</a>.
        </p>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.8rem', marginBottom: '0.8rem', borderBottom: `1px solid ${borderColor}`, paddingBottom: '0.4rem' }}>
          2. Informations que nous recueillons
        </h2>
        <p>
          Nous recueillons différents types d'informations pour fournir et améliorer nos Services :
        </p>
        <h3 style={{ fontSize: '1.4rem', marginBottom: '0.6rem', marginTop: '1rem' }}>
          2.1 Informations personnelles
        </h3>
        <p>
          Lorsque vous créez un compte ou utilisez nos Services, nous pouvons vous demander de nous fournir certaines informations personnellement identifiables qui peuvent être utilisées pour vous contacter ou vous identifier ("Données Personnelles"). Cela peut inclure, sans s'y limiter :
        </p>
        <ul>
          <li>Nom et prénom</li>
          <li>Adresse e-mail</li>
          <li>Numéro de téléphone</li>
          <li>Informations de facturation (si applicable)</li>
          <li>Données d'utilisation (voir ci-dessous)</li>
        </ul>

        <h3 style={{ fontSize: '1.4rem', marginBottom: '0.6rem', marginTop: '1rem' }}>
          2.2 Données d'utilisation
        </h3>
        <p>
          Nous pouvons également collecter des informations sur la manière dont les Services sont consultés et utilisés ("Données d'utilisation"). Ces Données d'utilisation peuvent inclure des informations telles que l'adresse IP de votre ordinateur, le type de navigateur, la version du navigateur, les pages de nos Services que vous visitez, l'heure et la date de votre visite, le temps passé sur ces pages, les identifiants uniques d'appareil et d'autres données de diagnostic.
        </p>

        <h3 style={{ fontSize: '1.4rem', marginBottom: '0.6rem', marginTop: '1rem' }}>
          2.3 Données de suivi et cookies
        </h3>
        <p>
          Nous utilisons des cookies et des technologies de suivi similaires pour suivre l'activité sur nos Services et conserver certaines informations.
          Les cookies sont des fichiers avec une petite quantité de données qui peuvent inclure un identifiant unique anonyme. Les cookies sont envoyés à votre navigateur à partir d'un site web et stockés sur votre appareil.
        </p>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.8rem', marginBottom: '0.8rem', borderBottom: `1px solid ${borderColor}`, paddingBottom: '0.4rem' }}>
          3. Utilisation de vos informations
        </h2>
        <p>
          Kiwi-Ops utilise les données collectées à diverses fins :
        </p>
        <ul>
          <li>Pour fournir et maintenir nos Services</li>
          <li>Pour vous notifier des changements apportés à nos Services</li>
          <li>Pour vous permettre de participer à des fonctionnalités interactives de nos Services lorsque vous choisissez de le faire</li>
          <li>Pour fournir un support client</li>
          <li>Pour surveiller l'utilisation de nos Services</li>
          <li>Pour détecter, prévenir et résoudre les problèmes techniques</li>
          <li>Pour gérer votre compte et vous envoyer des informations pertinentes</li>
        </ul>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.8rem', marginBottom: '0.8rem', borderBottom: `1px solid ${borderColor}`, paddingBottom: '0.4rem' }}>
          4. Divulgation de vos informations
        </h2>
        <p>
          Nous ne vendons, n'échangeons ni ne louons vos informations personnelles à des tiers. Nous pouvons partager vos informations avec des fournisseurs de services tiers qui effectuent des services en notre nom (par exemple, traitement des paiements, hébergement web, analyse de données). Ces tiers sont contractuellement tenus de maintenir la confidentialité de vos informations et de ne les utiliser qu'aux fins pour lesquelles nous les avons divulguées.
        </p>
        <p>
          Nous pouvons également divulguer vos informations si la loi l'exige ou en réponse à des demandes valides des autorités publiques (par exemple, un tribunal ou une agence gouvernementale). Pour les questions spécifiques à la divulgation légale, vous pouvez contacter :{" "}
          <a href="mailto:legal@kiwi-ops.com" style={{ color: linkColor, textDecoration: 'none' }}>legal@kiwi-ops.com</a>.
        </p>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.8rem', marginBottom: '0.8rem', borderBottom: `1px solid ${borderColor}`, paddingBottom: '0.4rem' }}>
          5. Vos droits en matière de protection des données
        </h2>
        <p>
          Selon votre lieu de résidence, vous pouvez disposer de certains droits concernant vos informations personnelles, notamment :
        </p>
        <ul>
          <li>Le droit d'accéder à vos informations.</li>
          <li>Le droit de rectifier des informations inexactes.</li>
          <li>Le droit de demander la suppression de vos informations.</li>
          <li>Le droit de vous opposer au traitement de vos informations.</li>
          <li>Le droit de retirer votre consentement.</li>
          <li>Le droit à la portabilité des données.</li>
        </ul>
        <p>
          Pour exercer l'un de ces droits, veuillez nous contacter à :{" "}
          <a href="mailto:privacy@kiwi-ops.com" style={{ color: linkColor, textDecoration: 'none' }}>privacy@kiwi-ops.com</a>.
          Nous répondrons à votre demande conformément aux lois applicables.
        </p>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.8rem', marginBottom: '0.8rem', borderBottom: `1px solid ${borderColor}`, paddingBottom: '0.4rem' }}>
          6. Sécurité des données
        </h2>
        <p>
          La sécurité de vos données est importante pour nous, mais aucune méthode de transmission sur Internet ou de stockage électronique n'est 100% sécurisée. Bien que nous nous efforcions d'utiliser des moyens commercialement acceptables pour protéger vos Données Personnelles, nous ne pouvons garantir leur sécurité absolue.
        </p>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.8rem', marginBottom: '0.8rem', borderBottom: `1px solid ${borderColor}`, paddingBottom: '0.4rem' }}>
          7. Liens vers d'autres sites
        </h2>
        <p>
          Nos Services peuvent contenir des liens vers d'autres sites qui ne sont pas exploités par nous. Si vous cliquez sur un lien tiers, vous serez dirigé vers le site de ce tiers. Nous vous conseillons vivement de consulter la politique de confidentialité de chaque site que vous visitez.
        </p>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.8rem', marginBottom: '0.8rem', borderBottom: `1px solid ${borderColor}`, paddingBottom: '0.4rem' }}>
          8. Modifications de cette Politique de Confidentialité
        </h2>
        <p>
          Nous pouvons mettre à jour notre Politique de Confidentialité de temps à autre. Nous vous informerons de tout changement en publiant la nouvelle Politique de Confidentialité sur cette page. Nous vous conseillons de consulter cette Politique de Confidentialité périodiquement pour tout changement.
        </p>
        <p>
          Les modifications de cette Politique de Confidentialité sont effectives lorsqu'elles sont publiées sur cette page. La date de "Dernière mise à jour" en haut de cette page indique la date de la dernière révision.
        </p>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.8rem', marginBottom: '0.8rem', borderBottom: `1px solid ${borderColor}`, paddingBottom: '0.4rem' }}>
          9. Contactez-nous
        </h2>
        <p>
          Si vous avez des questions concernant cette Politique de Confidentialité, les pratiques de notre site ou vos interactions avec nos Services, vous pouvez nous contacter :
        </p>
        <ul>
          <li style={{ marginBottom: '0.5rem' }}>
            Par e-mail :{" "}
            <a href="mailto:privacy@kiwi-ops.com" style={{ color: linkColor, textDecoration: 'none' }}>privacy@kiwi-ops.com</a>
            {" "} (pour les questions spécifiques à la confidentialité)
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            Par e-mail :{" "}
            <a href="mailto:support@kiwi-ops.com" style={{ color: linkColor, textDecoration: 'none' }}>support@kiwi-ops.com</a>
            {" "} (pour le support général ou les questions techniques)
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            Par e-mail :{" "}
            <a href="mailto:legal@kiwi-ops.com" style={{ color: linkColor, textDecoration: 'none' }}>legal@kiwi-ops.com</a>
            {" "} (pour les questions légales plus générales ou les requêtes des autorités)
          </li>
        </ul>
        <p>
          Veuillez également consulter nos{" "}
          <a href="/terms" style={{ color: linkColor, textDecoration: 'none' }}>Conditions Générales d'Utilisation</a>
          {" "} pour plus d'informations sur l'utilisation de nos Services.
        </p>
      </section>

      <p style={{ textAlign: 'center', marginTop: '3rem', fontSize: '0.9rem', color: mutedTextColor }}>
        © {new Date().getFullYear()} Kiwi-Ops. Tous droits réservés.
      </p>
    </div>
  );
}