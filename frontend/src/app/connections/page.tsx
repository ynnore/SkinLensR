'use client'; // Indique que ce composant est un Client Component

import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext'; // Assurez-vous que ce chemin est correct
import styles from './connections.module.css'; // Importez le CSS module

// Définir un type pour les données de connexion (ex: "nations")
interface ConnectionNation {
  id: string;
  name: string;
  group: string;
  status: 'online' | 'offline' | 'restricted';
  lastActivity: string;
  description: string;
  // Ajoutez d'autres champs pertinents
}

export default function ConnectionsPage() {
  const { theme } = useTheme();

  // Définissez les couleurs en fonction du thème
  // Ces couleurs seront utilisées pour définir les variables CSS locales.
  const textColor = theme === 'dark' ? '#E0E0E0' : '#333333';
  const mutedTextColor = theme === 'dark' ? '#A0A0A0' : '#666666';
  const borderColor = theme === 'dark' ? '#555555' : '#AAAAAA';
  const backgroundColorPage = theme === 'dark' ? '#1A1A2E' : '#f9fafb';
  const cardBackgroundColor = theme === 'dark' ? '#2A2A3A' : '#F5F0E1'; // Fond des cartes/panneaux
  const highlightColor = theme === 'dark' ? '#8BC4FF' : '#4A90E2'; // Couleur d'accent pour les liens/icônes
  const shadowColorCard = theme === 'dark' ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.2)';
  const shadowColorHover = theme === 'dark' ? 'rgba(0,0,0,0.7)' : 'rgba(0,0,0,0.3)';
  const textShadowColor = theme === 'dark' ? 'rgba(0,0,0,0.6)' : 'rgba(150,150,150,0.4)';

  // État pour simuler les données des nations (viendraient du backend)
  const [nations, setNations] = useState<ConnectionNation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // --- INTÉGRATION BACKEND FUTUR : RÉCUPÉRATION DES CONNEXIONS ---
    const fetchNations = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Cette URL sera l'endpoint de votre API backend pour les connexions
        // Exemple: const response = await fetch('/api/connections');
        // const data = await response.json();

        // SIMULATION DE DONNÉES DE CONNEXIONS (à remplacer par un appel API réel)
        const simulatedData: ConnectionNation[] = [
          {
            id: 'FR-NDL',
            name: 'Notre Dame de Lorette',
            group: 'Europe Opérations',
            status: 'online',
            lastActivity: 'Il y a 5 minutes',
            description: 'Point de contact principal pour les opérations historiques et culturelles en France.'
          },
          {
            id: 'UK-WLT',
            name: 'Wellington Central',
            group: 'Alliance Transatlantique',
            status: 'online',
            lastActivity: 'Il y a 10 minutes',
            description: 'Centre névralgique pour la coordination des opérations stratégiques entre les continents.'
          },
          {
            id: 'JP-TKY',
            name: 'Tokyo Nexus',
            group: 'Pacifique Orient',
            status: 'restricted',
            lastActivity: 'Il y a 3 heures',
            description: 'Accès restreint aux données de surveillance des flux maritimes. Attente validation protocole Alpha.'
          },
          {
            id: 'BR-AMZ',
            name: 'Amazonia Watch',
            group: 'Sud Amérique Veille',
            status: 'offline',
            lastActivity: 'Il y a 2 jours',
            description: 'Mise à jour des systèmes en cours. Contact perdu avec l\'agent local. Urgence niveau 3.'
          },
        ];
        // Fin de la simulation

        // Simuler un délai de chargement
        await new Promise(resolve => setTimeout(resolve, 1000));

        setNations(simulatedData); // Mettez à jour avec les données réelles du backend
      } catch (err) {
        console.error("Erreur lors du chargement des connexions:", err);
        setError("Impossible de charger les statuts des connexions. Vérifiez le réseau du QG.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchNations();
  }, []); // Exécuter une seule fois au montage du composant

  return (
    // Le style sur le div parent injecte les variables CSS pour le thème
    <div
      className={styles.pageContainer}
      style={{
        backgroundColor: backgroundColorPage,
        // Définition des variables CSS consommées par connections.module.css
        '--kiwi-text-primary': textColor,
        '--kiwi-text-secondary': mutedTextColor,
        '--kiwi-border-color': borderColor,
        '--kiwi-background-card': cardBackgroundColor,
        '--kiwi-highlight-color': highlightColor,
        '--kiwi-shadow-color-card': shadowColorCard,
        '--kiwi-shadow-color-hover': shadowColorHover,
        '--kiwi-text-shadow': `2px 2px 0px ${textShadowColor}` // Pour le titre principal
        // Assurez-vous que --font-special-elite et --font-courier-prime sont définis globalement
        // ou ajoutez des fallbacks directement dans connections.module.css comme je l'ai fait.
      } as React.CSSProperties} // Cast pour permettre les CSS variables
    >
      <h1 className={styles.title}>
        Réseau d'Opérations<br />— Connexions Globales —
      </h1>
      <p className={styles.subtitle}>
        "Surveillance et gestion des points de contact avec les agences partenaires et les infrastructures stratégiques à travers le globe."
      </p>

      {/* Zone de contenu des Connexions */}
      <section className={styles.nationsGrid}>
        {isLoading ? (
          <p className={styles.loadingMessage}>
            Chargement des statuts de connexion... Veuillez patienter.
          </p>
        ) : error ? (
          <p className={styles.errorMessage}>
            Erreur de communication : {error}
          </p>
        ) : nations.length === 0 ? (
          <p className={styles.emptyMessage}>
            Aucune connexion active n'a été répertoriée.
          </p>
        ) : (
          nations.map((nation) => (
            <div key={nation.id} className={styles.nationCard}>
              <div className={styles.cardHeader}>
                <h3 className={styles.nationName}>{nation.name}</h3>
                <span
                  className={styles.statusDot}
                  style={{
                    backgroundColor:
                      nation.status === 'online'
                        ? '#4CAF50' // Vert pour En Ligne
                        : nation.status === 'offline'
                        ? '#F44336' // Rouge pour Hors Ligne
                        : '#FFC107', // Jaune pour Restreint
                  }}
                ></span>
              </div>
              <p className={styles.nationGroup}>Groupe : {nation.group}</p>
              <p className={styles.cardDescription}>{nation.description}</p>
              <div className={styles.cardFooter}>
                <p style={{ color: mutedTextColor, fontSize: '0.85rem', fontStyle: 'italic', marginBottom: '0.5rem' }}>
                    Dernière activité : {nation.lastActivity}
                </p>
                <a href={`/connections/${nation.id}`} className={styles.cardLink}>
                  Accéder au Dossier {nation.id}
                </a>
              </div>
            </div>
          ))
        )}
      </section>

      <p className={styles.globalFooter}>
        © {new Date().getFullYear()} Kiwi-Ops – Réseau de Commandement International.
      </p>
    </div>
  );
}