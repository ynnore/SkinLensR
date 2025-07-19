// Fichier: src/app/profile/page.tsx
'use client';

import { useTheme } from '../../context/ThemeContext';
// 1. IMPORTER LE HOOK DE TRADUCTION
import { useTranslation } from 'react-i18next'; // Ou ton hook équivalent
// On importe nos types
import { UserProfile, AccreditationLevel } from '../../types/user'; 

export default function ProfilePage() {
  // 2. INITIALISER LE HOOK DE TRADUCTION
  const { t } = useTranslation('common');
  
  const { theme } = useTheme();

  // --- Données de démonstration ---
  const user: UserProfile = {
    id: 'xyz-123',
    email: 'ronny@kiwi-ops.com',
    nomDeCode: 'Ronny',
    matricule: 'KWI-007',
    accreditation: AccreditationLevel.COMMANDANT,
    dateEnrolement: '18 juillet 2024',
  };
  // --- Fin des données de démo ---

  const textColor = theme === 'dark' ? '#E0E0E0' : '#333';
  const mutedTextColor = theme === 'dark' ? '#A0A0A0' : '#666';
  const borderColor = theme === 'dark' ? '#444' : '#eee';

  // Helper pour traduire le niveau d'accréditation basé sur l'enum
  const getTranslatedAccreditation = (level: AccreditationLevel) => {
    switch (level) {
      case AccreditationLevel.AGENT:
        return t('profilePage.accreditationAgent');
      case AccreditationLevel.OFFICIER:
        return t('profilePage.accreditationOfficer');
      case AccreditationLevel.COMMANDANT:
        return t('profilePage.accreditationCommander');
      default:
        return level; // Fallback au cas où
    }
  };

  if (!user) {
    // Pense à ajouter une clé "loading" à tes fichiers JSON si besoin
    return <div>{t('loading', 'Chargement des informations...')}</div>;
  }

  return (
    <div style={{ padding: '2rem 2.5rem', color: textColor }}>
      {/* 3. UTILISER LA FONCTION 't' POUR TRADUIRE CHAQUE TEXTE */}
      <h1 style={{ fontFamily: 'var(--font-special-elite), serif', fontSize: '2.5rem', textTransform: 'uppercase' }}>
        {t('profilePage.title')}
      </h1>

      <div style={{ marginTop: '3rem', borderTop: `2px solid ${borderColor}`, paddingTop: '2rem' }}>
        
        <div style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ fontFamily: 'var(--font-courier-prime), monospace', color: mutedTextColor, fontSize: '1rem', textTransform: 'uppercase' }}>
            {t('profilePage.labelName')}
          </h2>
          <p style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{user.nomDeCode}</p>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ fontFamily: 'var(--font-courier-prime), monospace', color: mutedTextColor, fontSize: '1rem', textTransform: 'uppercase' }}>
            {t('profilePage.labelMatricule')}
          </h2>
          <p style={{ fontSize: '1.2rem' }}>{user.matricule}</p>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ fontFamily: 'var(--font-courier-prime), monospace', color: mutedTextColor, fontSize: '1rem', textTransform: 'uppercase' }}>
            {t('profilePage.labelAccreditation')}
          </h2>
          {/* On utilise notre helper pour afficher la traduction correcte */}
          <p style={{ fontSize: '1.2rem' }}>{getTranslatedAccreditation(user.accreditation)}</p>
        </div>
        
        {user.accreditation === AccreditationLevel.COMMANDANT && (
          <div style={{ padding: '1rem', border: `1px solid ${borderColor}`, backgroundColor: 'rgba(0,0,0,0.1)', marginTop: '2rem' }}>
            <p style={{ margin: 0 }}>{t('profilePage.commanderAccessMessage')}</p>
          </div>
        )}

      </div>
    </div>
  );
}