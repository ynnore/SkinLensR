'use client'; // Indique que ce composant est un Client Component

import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext'; // Assurez-vous que ce chemin est correct

// Définir un type pour les données d'archive si vous avez une structure claire
interface ArchiveDocument {
  id: string;
  title: string;
  category: string;
  status: 'classifié' | 'opérationnel' | 'fermé';
  date: string;
  description: string;
  // Ajoutez d'autres champs pertinents pour vos documents d'archives
}

export default function ArchivesPage() {
  const { theme } = useTheme();

  // Définissez les couleurs en fonction du thème, cohérentes avec le style "super agent"
  const textColor = theme === 'dark' ? '#E0E0E0' : '#333333';
  const mutedTextColor = theme === 'dark' ? '#A0A0A0' : '#666666';
  const borderColor = theme === 'dark' ? '#555555' : '#AAAAAA';
  const backgroundColor = theme === 'dark' ? '#1A1A2E' : '#FFF8E1'; // Fond légèrement crème pour l'ambiance affiche ancienne
  const cardBackgroundColor = theme === 'dark' ? '#2A2A3A' : '#F5F0E1'; // Fond des cartes/panneaux
  const highlightColor = theme === 'dark' ? '#8BC4FF' : '#4A90E2'; // Couleur d'accent pour les liens/icônes

  // État pour simuler les données d'archives (viendraient du backend)
  const [archives, setArchives] = useState<ArchiveDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // --- INTÉGRATION BACKEND FUTUR : RÉCUPÉRATION DES ARCHIVES ---
    const fetchArchives = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Cette URL sera l'endpoint de votre API backend
        // Exemple: const response = await fetch('/api/archives');
        // const data = await response.json();

        // SIMULATION DE DONNÉES D'ARCHIVES (à remplacer par un appel API réel)
        const simulatedData: ArchiveDocument[] = [
          {
            id: 'DOC-001',
            title: 'Rapport de Mission : Opération "Silence Éclatant"',
            category: 'Opérationnel',
            status: 'classifié',
            date: '15/07/2024',
            description: 'Compte-rendu détaillé des phases 1 à 3 de l\'opération S.E. Concerne l\'interception de flux de données non autorisés.',
          },
          {
            id: 'DOS-A-7',
            title: 'Dossier Agent : Agent "Ombre Discrète"',
            category: 'Personnel',
            status: 'opérationnel',
            date: '01/06/2024',
            description: 'Mise à jour du profil d\'agent et évaluation des compétences acquises lors de la dernière formation.',
          },
          {
            id: 'PROTO-X9',
            title: 'Protocole de Cryptage : Version 3.1',
            category: 'Technique',
            status: 'fermé',
            date: '20/05/2024',
            description: 'Documentation complète du protocole de cryptage X9, incluant les vulnérabilités identifiées et corrigées.',
          },
          {
            id: 'RAP-L7',
            title: 'Rapport d\'Analyse : Flux Financiers Suspects - Réseau Hydra',
            category: 'Financier',
            status: 'classifié',
            date: '10/07/2024',
            description: 'Analyse des transactions atypiques identifiées sur le réseau Hydra et proposition de contre-mesures.',
          },
        ];
        // Fin de la simulation

        // Simuler un délai de chargement
        await new Promise(resolve => setTimeout(resolve, 1000));

        setArchives(simulatedData); // Mettez à jour avec les données réelles du backend
      } catch (err) {
        console.error("Erreur lors du chargement des archives:", err);
        setError("Impossible de charger les archives. Vérifiez la connexion au QG.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchArchives();
  }, []); // Exécuter une seule fois au montage du composant

  return (
    <div style={{
      padding: '2rem',
      maxWidth: '900px', // Une largeur un peu plus grande pour les listes
      margin: '0 auto',
      lineHeight: '1.6',
      fontSize: '1rem',
      color: textColor,
      fontFamily: "'Arial', sans-serif", // Pour une lisibilité moderne, mais adaptable
      backgroundColor: backgroundColor,
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
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
        textShadow: `2px 2px 0px ${theme === 'dark' ? 'rgba(0,0,0,0.5)' : 'rgba(150,150,150,0.3)'}`
      }}>
        Dossiers Classifiés<br />— Archives du Commandement —
      </h1>
      <p style={{ fontStyle: 'italic', marginBottom: '3rem', textAlign: 'center', color: mutedTextColor, fontSize: '1.1rem' }}>
        "Consultation des dossiers, rapports de mission et documents classifiés du Bureau Kiwi-Ops."
      </p>

      {/* Message d'état du Backend */}
      <section style={{
        marginBottom: '2rem',
        border: `1px dashed ${borderColor}`,
        padding: '1.5rem',
        borderRadius: '5px',
        background: theme === 'dark' ? '#3A2A2A' : '#FFEBEB', // Un fond un peu plus marqué pour l'alerte
        color: theme === 'dark' ? '#FFCACA' : '#CC0000', // Texte rougeâtre pour l'avertissement
        textAlign: 'center',
        boxShadow: `3px 3px 0px ${theme === 'dark' ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.1)'}`
      }}>
        <h2 style={{ fontSize: '1.6rem', marginBottom: '0.8rem', color: theme === 'dark' ? '#FFCACA' : '#CC0000' }}>
          Alerte Système : Accès aux Archives
        </h2>
        <p style={{ fontStyle: 'italic', fontSize: '1rem' }}>
          Le système de gestion des archives et la liaison au Backend du QG sont actuellement en phase de déploiement et d'optimisation.
          Les données présentées ci-dessous sont à titre indicatif et ne reflètent pas encore l'intégralité des dossiers actifs.
        </p>
        {/* Vous pourriez ajouter ici un indicateur de progression ou un lien vers l'état du système */}
      </section>

      {/* Section des Archives */}
      <section style={{
        width: '100%',
        backgroundColor: cardBackgroundColor,
        border: `2px solid ${borderColor}`,
        borderRadius: '5px',
        padding: '2rem',
        boxShadow: `5px 5px 0px ${theme === 'dark' ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.2)'}`,
        color: textColor
      }}>
        <h2 style={{
          fontSize: '2rem',
          marginBottom: '1.5rem',
          borderBottom: `1px solid ${borderColor}`,
          paddingBottom: '0.8rem',
          color: textColor,
          fontFamily: "'Playfair Display', serif",
          fontWeight: 'bold'
        }}>
          Registres Actifs
        </h2>

        {isLoading ? (
          <p style={{ textAlign: 'center', fontStyle: 'italic', color: mutedTextColor }}>
            Chargement des protocoles d'accès aux archives... Veuillez patienter.
          </p>
        ) : error ? (
          <p style={{ textAlign: 'center', color: '#fa755a', fontWeight: 'bold' }}>
            Erreur d'accès : {error}
          </p>
        ) : archives.length === 0 ? (
          <p style={{ textAlign: 'center', fontStyle: 'italic', color: mutedTextColor }}>
            Aucun dossier n'a été trouvé dans les registres actuels.
          </p>
        ) : (
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            {archives.map((doc) => (
              <div key={doc.id} style={{
                border: `1px solid ${borderColor}`,
                borderRadius: '4px',
                padding: '1rem 1.5rem',
                backgroundColor: theme === 'dark' ? '#3A3A4A' : '#FFFFFF',
                boxShadow: `2px 2px 0px ${theme === 'dark' ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.1)'}`,
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem'
              }}>
                <h3 style={{ fontSize: '1.4rem', marginBottom: '0.2rem', color: highlightColor }}>
                  {doc.title} <span style={{ fontSize: '0.9rem', color: mutedTextColor }}>({doc.id})</span>
                </h3>
                <p style={{ fontSize: '0.95rem', color: textColor }}>
                  <strong style={{ color: highlightColor }}>Catégorie :</strong> {doc.category}
                </p>
                <p style={{ fontSize: '0.95rem', color: textColor }}>
                  <strong style={{ color: highlightColor }}>Statut :</strong>{" "}
                  <span style={{
                    fontWeight: 'bold',
                    color: doc.status === 'classifié' ? '#E91E63' : (doc.status === 'opérationnel' ? '#4CAF50' : '#9E9E9E')
                  }}>
                    {doc.status.toUpperCase()}
                  </span>
                </p>
                <p style={{ fontSize: '0.9rem', fontStyle: 'italic', color: mutedTextColor }}>
                  Dernière mise à jour : {doc.date}
                </p>
                <p style={{ fontSize: '1rem', color: textColor, marginTop: '0.5rem' }}>
                  {doc.description}
                </p>
                {/* Exemple de bouton pour voir le détail ou télécharger (nécessitera un backend) */}
                <button
                  onClick={() => alert(`Accès au dossier ${doc.id}. Implémentation du protocole d'extraction en cours...`)}
                  style={{
                    backgroundColor: highlightColor,
                    color: '#fff',
                    padding: '8px 15px',
                    borderRadius: '4px',
                    border: 'none',
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    marginTop: '1rem',
                    alignSelf: 'flex-end', // Align the button to the right
                    boxShadow: `1px 1px 0px ${theme === 'dark' ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.15)'}`
                  }}
                >
                  Accéder au Document
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      <section style={{
        marginTop: '4rem',
        borderTop: `2px dashed ${borderColor}`,
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
          Protocole de Consultation des Archives
        </h2>
        <p style={{ color: mutedTextColor, marginBottom: '1rem' }}>
          Toute tentative d'accès non autorisé est détectée et signalée. Les registres sont sous surveillance permanente du Commandement.
        </p>
        <p style={{ color: mutedTextColor, marginBottom: '1.5rem' }}>
          Pour soumettre un nouveau rapport ou une requête d'accès spécial, contactez le Service des Opérations d'Archivage.
        </p>
        <a href="mailto:archives@kiwi-ops.com" style={{ color: highlightColor, textDecoration: 'none', fontSize: '1rem', display: 'block', fontWeight: 'bold' }}>
          archives@kiwi-ops.com
        </a>
      </section>

      <p style={{ textAlign: 'center', marginTop: '3rem', fontSize: '0.8rem', color: mutedTextColor }}>
        © {new Date().getFullYear()} Kiwi-Ops – Base de Données Sécurisée.
      </p>
    </div>
  );
}