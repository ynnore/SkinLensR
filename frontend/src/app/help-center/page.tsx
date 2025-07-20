'use client'; // Indique que ce composant est un Client Component

import React from 'react';
import { useTheme } from '../../context/ThemeContext'; // Assurez-vous que ce chemin est correct
// Si vous voulez un fichier CSS module dédié pour cette page, créez-le :
// import styles from './help-center.module.css';

export default function HelpCenterPage() {
  const { theme } = useTheme();

  // Définissez les couleurs en fonction du thème, cohérentes avec le style "super agent"
  const textColor = theme === 'dark' ? '#E0E0E0' : '#333333';
  const mutedTextColor = theme === 'dark' ? '#A0A0A0' : '#666666';
  const borderColor = theme === 'dark' ? '#555555' : '#AAAAAA';
  const backgroundColorPage = theme === 'dark' ? '#1f2937' : '#ffffff'; // Fond de page légèrement crème
  const sectionBgColor = theme === 'dark' ? '#2A2A3A' : '#F5F0E1'; // Fond des sections/cartes
  const highlightColor = theme === 'dark' ? '#8BC4FF' : '#4A90E2'; // Couleur d'accent pour les liens/icônes
  const textShadowColor = theme === 'dark' ? 'rgba(0,0,0,0.6)' : 'rgba(150,150,150,0.4)';

  return (
    <div style={{
      padding: '2rem',
      maxWidth: '900px',
      margin: '0 auto',
      lineHeight: '1.6',
      fontSize: '1rem',
      color: textColor,
      fontFamily: "'Arial', sans-serif", // Police moderne par défaut
      backgroundColor: backgroundColorPage,
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
    }}>
      <h1 style={{
        marginBottom: '1rem',
        fontSize: '3.5rem',
        textAlign: 'center',
        fontWeight: 'bold',
        fontFamily: "'Playfair Display', serif", // Police pour les titres très visibles
        textTransform: 'uppercase',
        letterSpacing: '2px',
        color: textColor,
        textShadow: `2px 2px 0px ${textShadowColor}`
      }}>
        Protocole d'Assistance<br />— Centre d'Aide Kiwi-Ops —
      </h1>
      <p style={{
        fontStyle: 'italic',
        marginBottom: '3rem',
        textAlign: 'center',
        color: mutedTextColor,
        fontSize: '1.15rem',
        maxWidth: '85ch',
        borderBottom: `1px dashed ${borderColor}`,
        paddingBottom: '1rem'
      }}>
        "Accédez à la documentation, aux FAQ et aux canaux de support pour toutes vos requêtes opérationnelles."
      </p>

      {/* Section FAQ */}
      <section style={{
        width: '100%',
        marginBottom: '2.5rem',
        padding: '1.8rem',
        border: `2px solid ${borderColor}`,
        borderRadius: '8px',
        backgroundColor: sectionBgColor,
        boxShadow: `5px 5px 0px ${theme === 'dark' ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.2)'}`,
        color: textColor,
      }}>
        <h2 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: '1.8rem',
          marginBottom: '1rem',
          borderBottom: `1px dashed ${borderColor}`,
          paddingBottom: '0.8rem',
          color: highlightColor,
        }}>
          Questions Fréquentes (FAQ)
        </h2>
        <p style={{ marginBottom: '1.5rem', color: mutedTextColor, fontStyle: 'italic' }}>
          Consultez les réponses aux interrogations les plus courantes de nos agents.
        </p>

        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: textColor, fontWeight: 'bold' }}>
            Q: Comment modifier mon code secret ?
          </h3>
          <p style={{ color: mutedTextColor }}>
            R: Rendez-vous dans les "Paramètres du QG" (l'icône engrenage dans le menu latéral), puis naviguez vers la section "Protocoles de Sécurité". Vous pourrez y initier le changement de votre code secret.
          </p>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: textColor, fontWeight: 'bold' }}>
            Q: Où trouver les rapports de mission archivés ?
          </h3>
          <p style={{ color: mutedTextColor }}>
            R: Les rapports sont accessibles via la section "Dossiers Classifiés" (l'icône dossier dans le menu latéral). Utilisez les filtres pour affiner votre recherche par catégorie ou date d'activité.
          </p>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: textColor, fontWeight: 'bold' }}>
            Q: Puis-je contribuer de nouveaux renseignements ?
          </h3>
          <p style={{ color: mutedTextColor }}>
            R: Oui, la contribution de renseignements est encouragée. Le protocole de soumission est détaillé dans la section "Opérations de Renseignement" du manuel d'agent (disponible prochainement).
          </p>
        </div>

        <p style={{ textAlign: 'right', marginTop: '2rem', fontSize: '0.9rem' }}>
          <a href="/help-center/faq" style={{ color: highlightColor, textDecoration: 'none', fontWeight: 'bold' }}>Voir toutes les FAQ</a>
        </p>
      </section>

      {/* Section Contact Support */}
      <section style={{
        width: '100%',
        marginBottom: '2.5rem',
        padding: '1.8rem',
        border: `2px solid ${borderColor}`,
        borderRadius: '8px',
        backgroundColor: sectionBgColor,
        boxShadow: `5px 5px 0px ${theme === 'dark' ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.2)'}`,
        color: textColor,
      }}>
        <h2 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: '1.8rem',
          marginBottom: '1rem',
          borderBottom: `1px dashed ${borderColor}`,
          paddingBottom: '0.8rem',
          color: highlightColor,
        }}>
          Contacter le Support du QG
        </h2>
        <p style={{ marginBottom: '1.5rem', color: mutedTextColor, fontStyle: 'italic' }}>
          Si vous n'avez pas trouvé de réponse à votre requête, notre équipe est prête à vous assister.
        </p>

        <p style={{ marginBottom: '1rem', color: textColor }}>
          Pour une assistance rapide, veuillez nous contacter via les canaux sécurisés ci-dessous :
        </p>
        <ul>
          <li style={{ marginBottom: '0.5rem' }}>
            <strong style={{ color: highlightColor }}>Requêtes Générales :</strong>{" "}
            <a href="mailto:support@kiwi-ops.com" style={{ color: highlightColor, textDecoration: 'none', fontWeight: 'bold' }}>support@kiwi-ops.com</a>
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            <strong style={{ color: highlightColor }}>Problèmes Techniques :</strong>{" "}
            <a href="mailto:tech.support@kiwi-ops.com" style={{ color: highlightColor, textDecoration: 'none', fontWeight: 'bold' }}>ops@kiwi-ops.com</a>
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            <strong style={{ color: highlightColor }}>Affaires d'Accréditation :</strong>{" "}
            <a href="mailto:account@kiwi-ops.com" style={{ color: highlightColor, textDecoration: 'none', fontWeight: 'bold' }}>accounts@kiwi-ops.com</a>
          </li>
        </ul>
        <p style={{ marginTop: '2rem', color: mutedTextColor, fontSize: '0.9rem', fontStyle: 'italic' }}>
          "Toute communication est traitée avec la plus haute discrétion et confidentialité."
        </p>
      </section>

      <p style={{ textAlign: 'center', marginTop: '3rem', fontSize: '0.8rem', color: mutedTextColor }}>
        © {new Date().getFullYear()} Kiwi-Ops – Protocole d'Assistance Actif.
      </p>
    </div>
  );
}