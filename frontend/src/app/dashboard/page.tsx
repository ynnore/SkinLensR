'use client'; // Indique que ce composant est un Client Component

import React from 'react';
import { useTheme } from '../../context/ThemeContext'; // Assurez-vous que ce chemin est correct

export default function DashboardPage() {
  const { theme } = useTheme();

  // Définissez les couleurs en fonction du thème, cohérentes avec le style "super agent"
  const textColor = theme === 'dark' ? '#E0E0E0' : '#333333';
  const mutedTextColor = theme === 'dark' ? '#A0A0A0' : '#666666';
  const borderColor = theme === 'dark' ? '#555555' : '#AAAAAA';
  const backgroundColor = theme === 'dark' ? '#1A1A2E' : '#FFFFFF'; // Fond blanc pour le mode clair du tableau de bord
  const warningColor = theme === 'dark' ? '#FFCACA' : '#CC0000'; // Rouge pour l'alerte de développement

  return (
    <div style={{
      padding: '2rem',
      maxWidth: '1200px', // Largeur plus grande pour un tableau de bord
      margin: '0 auto',
      lineHeight: '1.6',
      fontSize: '1rem',
      color: textColor,
      fontFamily: "'Arial', sans-serif", // Police moderne pour un tableau de bord
      backgroundColor: backgroundColor,
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start', // Aligner le contenu en haut
    }}>
      <h1 style={{
        marginBottom: '1rem',
        fontSize: '3.8rem', // Plus grand pour le titre principal
        textAlign: 'center',
        fontWeight: 'bold',
        fontFamily: "'Playfair Display', serif", // Police pour les titres très visibles
        textTransform: 'uppercase',
        letterSpacing: '3px', // Plus d'espacement pour l'impact
        color: textColor,
        textShadow: `3px 3px 0px ${theme === 'dark' ? 'rgba(0,0,0,0.6)' : 'rgba(150,150,150,0.4)'}`
      }}>
        ÉTAT-MAJOR
      </h1>
      <p style={{
        fontStyle: 'italic',
        marginBottom: '3rem',
        textAlign: 'center',
        color: mutedTextColor,
        fontSize: '1.2rem',
        maxWidth: '80%', // Limite la largeur du sous-titre
        borderBottom: `1px solid ${borderColor}`, // Une petite ligne sous le sous-titre
        paddingBottom: '1rem'
      }}>
        "Synthèse des opérations et renseignements importants en temps réel."
      </p>

      {/* Zone de contenu pour les widgets - Message de développement */}
      <section style={{
        width: '100%',
        marginTop: '3rem',
        padding: '2rem',
        border: `2px dashed ${warningColor}`, // Bordure dash pour signaler le "en cours"
        borderRadius: '8px',
        backgroundColor: theme === 'dark' ? '#3A2A2A' : '#FFF3F3', // Fond léger pour l'alerte
        color: warningColor,
        textAlign: 'center',
        boxShadow: `4px 4px 0px ${theme === 'dark' ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.15)'}`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '200px', // Hauteur minimale pour que la zone soit visible
      }}>
        <h2 style={{
          fontSize: '2rem',
          marginBottom: '1rem',
          color: warningColor,
          fontFamily: "'Playfair Display', serif",
          fontWeight: 'bold',
          textTransform: 'uppercase'
        }}>
          Accès au Tableau de Bord
        </h2>
        <p style={{
          fontSize: '1.2rem',
          fontStyle: 'italic',
          color: mutedTextColor, // Utiliser mutedTextColor pour le texte de l'alerte
          maxWidth: '700px'
        }}>
          Zone de contenu pour les widgets du tableau de bord. Les systèmes de visualisation des opérations et de présentation des données stratégiques sont en cours de calibrage et de déploiement.
        </p>
        <p style={{
          fontSize: '1.1rem',
          marginTop: '1.5rem',
          fontWeight: 'bold',
          color: warningColor // Revenir au rouge pour l'appel à l'action/message principal
        }}>
          Veuillez rester en alerte pour les prochaines mises à jour du Commandement.
        </p>
        {/* Vous pouvez ajouter un spinner ou une icône ici si vous le souhaitez */}
      </section>

      {/* Future Zone des Widgets Réels (masquée pour l'instant) */}
      {/*
      <section style={{
        width: '100%',
        marginTop: '3rem',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', // Grille responsive pour les widgets
        gap: '2rem',
      }}>
        <div style={{
          border: `1px solid ${borderColor}`,
          borderRadius: '5px',
          padding: '1.5rem',
          backgroundColor: theme === 'dark' ? '#2A2A3A' : '#F8F8F8',
          boxShadow: `3px 3px 0px ${theme === 'dark' ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.1)'}`,
          color: textColor,
        }}>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: textColor }}>Widget 1: Résumé des Missions</h3>
          <p>Données clés des missions récentes...</p>
        </div>
        <div style={{
          border: `1px solid ${borderColor}`,
          borderRadius: '5px',
          padding: '1.5rem',
          backgroundColor: theme === 'dark' ? '#2A2A3A' : '#F8F8F8',
          boxShadow: `3px 3px 0px ${theme === 'dark' ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.1)'}`,
          color: textColor,
        }}>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: textColor }}>Widget 2: Alertes Critiques</h3>
          <p>Liste des alertes en temps réel...</p>
        </div>
        {/* ... d'autres widgets ... }
      </section>
      */}

      <p style={{ textAlign: 'center', marginTop: '4rem', fontSize: '0.8rem', color: mutedTextColor }}>
        © {new Date().getFullYear()} Kiwi-Ops – Système du Commandement Unifié.
      </p>
    </div>
  );
}