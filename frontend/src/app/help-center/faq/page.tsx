'use client'; // Indique que ce composant est un Client Component

import React from 'react';
import { useTheme } from '../../../context/ThemeContext'; // Ajustez le chemin si nécessaire, remonte d'un niveau de plus

export default function FAQPage() {
  const { theme } = useTheme();

  // Définissez les couleurs en fonction du thème, cohérentes avec le style "super agent"
  const textColor = theme === 'dark' ? '#E0E0E0' : '#333333';
  const mutedTextColor = theme === 'dark' ? '#A0A0A0' : '#666666';
  const borderColor = theme === 'dark' ? '#555555' : '#AAAAAA';
  const backgroundColorPage = theme === 'dark' ? '#1f2937' : '#ffffff'; // Fond de page légèrement crème
  const sectionBgColor = theme === 'dark' ? '#2A2A3A' : '#F5F0E1'; // Fond des sections/cartes
  const highlightColor = theme === 'dark' ? '#8BC4FF' : '#4A90E2'; // Couleur d'accent pour les liens/icônes
  const textShadowColor = theme === 'dark' ? 'rgba(0,0,0,0.6)' : 'rgba(150,150,150,0.4)';

  // Exemple de structure de données pour les FAQ
  const faqs = [
    {
      question: "Comment accéder à mon dossier d'agent ?",
      answer: "Votre dossier est accessible via le 'Tableau de Bord État-Major' après une authentification réussie. Vous y trouverez un accès direct à vos informations et missions."
    },
    {
      question: "Que faire en cas de problème de connexion ?",
      answer: "Vérifiez votre 'Adresse de Transmission' (email) et votre 'Code Secret' (mot de passe). Si le problème persiste, utilisez l'option 'Récupération de Code Secret' sur la page d'inscription, ou contactez le 'Support du QG'."
    },
    {
      question: "Comment mettre à jour mes informations personnelles ?",
      answer: "Rendez-vous dans la section 'Configuration du Quartier Général' (Paramètres), sous 'Dossier d'Agent'. Vous pourrez y modifier vos coordonnées."
    },
    {
      question: "Le système est-il compatible avec tous les terminaux ?",
      answer: "Kiwi-Ops est optimisé pour les terminaux standards (ordinateurs de bureau, tablettes, mobiles). Pour une liste complète des compatibilités, consultez le 'Protocole d'Intégration Matériel' dans la documentation technique."
    },
    {
      question: "Comment signaler une anomalie ou un bug ?",
      answer: "Toute anomalie doit être signalée via le canal sécurisé 'tech.support@kiwi-ops.com' en décrivant précisément le 'Protocole d'Erreur' observé et les circonstances."
    },
    {
      question: "Quelles sont les conditions d'accréditation financière ?",
      answer: "Les détails d'accréditation sont disponibles dans le 'Protocole de Service' (Conditions Générales d'Utilisation) et la section 'Accréditation & Protocole Financier' de vos 'Paramètres du QG'."
    },
    {
        question: "Comment fonctionne l'analyse d'image médicale ?",
        answer: "Le module d'analyse d'image médicale utilise des algorithmes avancés de reconnaissance de motifs pour détecter des anomalies ou des marqueurs spécifiques dans les clichés fournis. Les résultats sont présentés avec un indice de confiance opérationnel."
    },
    {
        question: "Puis-je suggérer de nouvelles fonctionnalités pour les agents ?",
        answer: "Absolument ! Vos retours sont cruciaux. Envoyez vos 'Propositions d'Amélioration' via la section 'Assistance & Support du QG' sur la page de paramètres. Chaque suggestion est évaluée par le Commandement."
    },
    // Ajoutez d'autres FAQ ici
  ];

  return (
    <div style={{
      padding: '2rem',
      maxWidth: '900px',
      margin: '0 auto',
      lineHeight: '1.6',
      fontSize: '1rem',
      color: textColor,
      fontFamily: "'Arial', sans-serif",
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
        fontFamily: "'Playfair Display', serif",
        textTransform: 'uppercase',
        letterSpacing: '2px',
        color: textColor,
        textShadow: `2px 2px 0px ${textShadowColor}`
      }}>
        Protocole FAQ<br />— Base de Connaissances —
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
        "Réponses aux interrogations opérationnelles les plus fréquentes pour une efficacité maximale de nos agents."
      </p>

      {/* Liste des FAQ */}
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
        {faqs.map((faq, index) => (
          <div key={index} style={{
            marginBottom: '1.5rem',
            paddingBottom: '1.5rem',
            borderBottom: index < faqs.length - 1 ? `1px dashed ${mutedTextColor}` : 'none'
          }}>
            <h3 style={{
              fontSize: '1.25rem',
              marginBottom: '0.8rem',
              color: highlightColor,
              fontWeight: 'bold',
              fontFamily: "'Playfair Display', serif" // Pour les questions
            }}>
              Q: {faq.question}
            </h3>
            <p style={{
              color: textColor,
              fontSize: '1rem',
              fontFamily: "'Georgia', serif" // Pour les réponses
            }}>
              R: {faq.answer}
            </p>
          </div>
        ))}
      </section>

      <p style={{ textAlign: 'center', marginTop: '3rem', fontSize: '0.8rem', color: mutedTextColor }}>
        © {new Date().getFullYear()} Kiwi-Ops – Base de Connaissances Sécurisée.
      </p>
    </div>
  );
}