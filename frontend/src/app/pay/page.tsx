'use client'; // Indique que ce composant est un Client Component

import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext'; // Assurez-vous que ce chemin est correct

export default function PaymentPage() {
  const { theme } = useTheme();

  // Définissez les couleurs en fonction du thème, avec une touche "Lorette"
  const textColor = theme === 'dark' ? '#E0E0E0' : '#333333';
  const linkColor = theme === 'dark' ? '#8BC4FF' : '#4A90E2'; // Un bleu un peu plus affirmé
  const mutedTextColor = theme === 'dark' ? '#A0A0A0' : '#666666';
  const borderColor = theme === 'dark' ? '#555555' : '#AAAAAA'; // Une bordure plus grise pour l'effet ancien

  const [nomPorteur, setNomPorteur] = useState('');
  const [numeroCarte, setNumeroCarte] = useState('');
  const [dateExpiration, setDateExpiration] = useState('');
  const [cvv, setCvv] = useState('');
  const [message, setMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Backgrounds: MODIFIÉ ICI POUR LE FOND PRINCIPAL ET LES SECTIONS
  const backgroundColorPage = theme === 'dark' ? '#1A1A2E' : '#f9fafb'; // <--- FOND DE PAGE PRINCIPAL
  const sectionBgColor = theme === 'dark' ? '#2A2A3A' : '#FFFFFF'; // <--- FOND DES CARTES/FORMULAIRES (BLANC PUR)

  // Autres couleurs dérivées pour l'ombre des boutons, inputs, etc.
  // Ces couleurs sont réutilisées dans le style inline ci-dessous.
  const textShadowColor = theme === 'dark' ? 'rgba(0,0,0,0.5)' : 'rgba(150,150,150,0.3)';
  const shadowColorCard = theme === 'dark' ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.2)';
  const shadowColorButton = theme === 'dark' ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.2)';
  const inputBgColor = theme === 'dark' ? '#1F1F2A' : '#FFFFFF';


  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setIsProcessing(true);
    setMessage('');

    console.log("Nom du Porteur:", nomPorteur);
    console.log("Numéro de Carte:", numeroCarte);
    console.log("Date d'Expiration:", dateExpiration);
    console.log("CVV:", cvv);

    // Simulation d'un traitement
    setTimeout(() => {
      setIsProcessing(false);
      setMessage("Dossier de Transaction Reçu. Traitement en cours via Protocole Bêta.");
      // Réinitialiser le formulaire si désiré
      setNomPorteur('');
      setNumeroCarte('');
      setDateExpiration('');
      setCvv('');
    }, 2000);
  };

  return (
    <div style={{
      padding: '2rem',
      maxWidth: '700px', // Largeur adaptée pour le contenu
      margin: '0 auto',
      lineHeight: '1.6',
      fontSize: '1rem',
      color: textColor,
      fontFamily: "'Georgia', serif", // Utilisation d'une police serif par défaut pour le corps
      backgroundColor: backgroundColorPage, // Applique le nouveau fond de page
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
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
        textShadow: `2px 2px 0px ${textShadowColor}` // Utilise la nouvelle couleur d'ombre
      }}>
        Bureau Central<br />Kiwi-Ops
      </h1>
      <p style={{ fontStyle: 'italic', marginBottom: '3rem', textAlign: 'center', color: mutedTextColor, fontSize: '1.1rem' }}>
        "Votre contribution, notre succès commun."
      </p>

      {/* Formulaire de paiement simplifié */}
      <form onSubmit={handleSubmit} style={{
        border: `2px solid ${borderColor}`, // Bordure plus prononcée
        padding: '2.5rem',
        borderRadius: '5px',
        boxShadow: `5px 5px 0px ${shadowColorCard}`, // Utilise la nouvelle couleur d'ombre
        background: sectionBgColor, // Applique le nouveau fond de section
        color: textColor,
        width: '100%', // Prend toute la largeur disponible dans le maxWidth parent
        boxSizing: 'border-box' // Inclut padding et border dans la largeur
      }}>
        <h3 style={{
          fontSize: '1.8rem',
          marginBottom: '1.5rem',
          borderBottom: `2px dashed ${borderColor}`, // Ligne en pointillé
          paddingBottom: '0.8rem',
          color: textColor,
          textAlign: 'center',
          fontFamily: "'Playfair Display', serif", // Police pour les titres d'affiches
          fontWeight: 'bold',
          textTransform: 'uppercase'
        }}>
          Dossier de Transaction<br />— Accréditation d'Agent —
        </h3>
        <p style={{ marginBottom: '1.5rem', color: mutedTextColor, textAlign: 'center', fontStyle: 'italic' }}>
          "La discrétion et la précision sont nos maîtres mots."
        </p>

        {/* Champ Nom du Porteur */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label htmlFor="card-name" style={{ display: 'block', marginBottom: '0.6rem', color: textColor, fontSize: '1.1rem' }}>
            Nom du Porteur (Telle que sur la Fiche) :
          </label>
          <input
            type="text"
            id="card-name"
            value={nomPorteur}
            onChange={(e) => setNomPorteur(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '12px',
              border: `1px solid ${borderColor}`,
              borderRadius: '4px',
              backgroundColor: inputBgColor, // Utilise la nouvelle couleur d'input
              color: textColor,
              fontSize: '1rem',
              boxSizing: 'border-box'
            }}
          />
        </div>

        {/* Champ Numéro de Carte */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label htmlFor="card-number" style={{ display: 'block', marginBottom: '0.6rem', color: textColor, fontSize: '1.1rem' }}>
            Numéro d'Accréditation (Fiche Bancaire) :
          </label>
          <input
            type="text"
            id="card-number"
            value={numeroCarte}
            onChange={(e) => setNumeroCarte(e.target.value)}
            required
            placeholder="XXXX XXXX XXXX XXXX"
            style={{
              width: '100%',
              padding: '12px',
              border: `1px solid ${borderColor}`,
              borderRadius: '4px',
              backgroundColor: inputBgColor, // Utilise la nouvelle couleur d'input
              color: textColor,
              fontSize: '1rem',
              boxSizing: 'border-box'
            }}
          />
        </div>

        {/* Champs Date d'Expiration et CVV */}
        <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2rem' }}>
          <div style={{ flex: 1 }}>
            <label htmlFor="expiry-date" style={{ display: 'block', marginBottom: '0.6rem', color: textColor, fontSize: '1.1rem' }}>
              Valide Jusqu'à (MM/AA) :
            </label>
            <input
              type="text"
              id="expiry-date"
              value={dateExpiration}
              onChange={(e) => setDateExpiration(e.target.value)}
              required
              placeholder="MM/AA"
              style={{
                width: '100%',
                padding: '12px',
                border: `1px solid ${borderColor}`,
                borderRadius: '4px',
                backgroundColor: inputBgColor, // Utilise la nouvelle couleur d'input
                color: textColor,
                fontSize: '1rem',
                boxSizing: 'border-box'
              }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label htmlFor="cvv" style={{ display: 'block', marginBottom: '0.6rem', color: textColor, fontSize: '1.1rem' }}>
              Code Secret (CVV) :
            </label>
            <input
              type="text"
              id="cvv"
              value={cvv}
              onChange={(e) => setCvv(e.target.value)}
              required
              placeholder="CVC"
              style={{
                width: '100%',
                padding: '12px',
                border: `1px solid ${borderColor}`,
                borderRadius: '4px',
                backgroundColor: inputBgColor, // Utilise la nouvelle couleur d'input
                color: textColor,
                fontSize: '1rem',
                boxSizing: 'border-box'
              }}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isProcessing}
          style={{
            backgroundColor: linkColor, // Couleur d'accent
            color: '#fff',
            padding: '15px 30px',
            borderRadius: '5px',
            border: 'none',
            fontSize: '1.2rem',
            cursor: 'pointer',
            opacity: isProcessing ? 0.6 : 1,
            transition: 'opacity 0.3s ease, background-color 0.3s ease',
            width: '100%',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            boxShadow: `2px 2px 0px ${shadowColorButton}`, // Utilise la nouvelle couleur d'ombre
          }}
        >
          {isProcessing ? "Traitement de l'Accréditation..." : "Valider le Dossier"}
        </button>

        {message && (
          <p style={{ color: 'green', marginTop: '1.5rem', fontSize: '1rem', textAlign: 'center', fontWeight: 'bold' }}>
            {message}
          </p>
        )}
      </form>

      <section style={{
        marginTop: '4rem',
        borderTop: `2px dashed ${borderColor}`, // Ligne de séparation style affiche
        paddingTop: '2.5rem',
        textAlign: 'center',
        color: textColor,
        fontSize: '0.95rem'
      }}>
        <h2 style={{
          fontSize: '1.6rem',
          marginBottom: '1rem',
          color: textColor,
          fontFamily: "'Playfair Display', serif",
          fontWeight: 'bold'
        }}>
          Directive du Commandement Opérationnel
        </h2>
        <p style={{ color: mutedTextColor, marginBottom: '1rem' }}>
          Toute transaction est enregistrée et protégée par le Protocole de Sécurité Numérique A.
        </p>
        <p style={{ color: mutedTextColor, marginBottom: '1.5rem' }}>
          Pour toute anomalie ou question relative à votre accréditation financière, contactez sans délai le Service des Affaires Monétaires.
        </p>
        <a href="mailto:finance@kiwi-ops.com" style={{ color: linkColor, textDecoration: 'none', fontSize: '1rem', display: 'block', fontWeight: 'bold' }}>
          billing@kiwi-ops.com
        </a>
      </section>

      <p style={{ textAlign: 'center', marginTop: '3rem', fontSize: '0.8rem', color: mutedTextColor }}>
        © {new Date().getFullYear()} Kiwi-Ops – Tous droits d'accès réservés.
      </p>
    </div>
  );
}