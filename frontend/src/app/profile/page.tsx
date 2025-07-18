// Fichier: src/app/profile/page.tsx
'use client';

import { useTheme } from '../../context/ThemeContext';
// On importe les types que l'on vient de créer !
import { UserProfile, AccreditationLevel } from '../../types/user'; 

export default function ProfilePage() {
  const { theme } = useTheme();

  // --- Données de démonstration utilisant notre nouvelle structure ---
  // Plus tard, ces données viendront de ta base de données.
  const user: UserProfile = {
    id: 'xyz-123',
    email: 'ronny@kiwi-ops.com',
    nomDeCode: 'Ronny',
    matricule: 'KWI-007',
    accreditation: AccreditationLevel.COMMANDANT, // Tu peux changer ça en .AGENT ou .OFFICIER pour tester
    dateEnrolement: '18 juillet 2024',
  };
  // --- Fin des données de démo ---

  const textColor = theme === 'dark' ? '#E0E0E0' : '#333';
  const mutedTextColor = theme === 'dark' ? '#A0A0A0' : '#666';
  const borderColor = theme === 'dark' ? '#444' : '#eee';

  if (!user) {
    return <div>Chargement des informations de l'agent...</div>;
  }

  return (
    <div style={{ padding: '2rem 2.5rem', color: textColor }}>
      <h1 style={{ fontFamily: 'var(--font-special-elite), serif', fontSize: '2.5rem', textTransform: 'uppercase' }}>
        Fiche d'Agent
      </h1>

      <div style={{ marginTop: '3rem', borderTop: `2px solid ${borderColor}`, paddingTop: '2rem' }}>
        
        <div style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ fontFamily: 'var(--font-courier-prime), monospace', color: mutedTextColor, fontSize: '1rem', textTransform: 'uppercase' }}>Nom de Code</h2>
          <p style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{user.nomDeCode}</p>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ fontFamily: 'var(--font-courier-prime), monospace', color: mutedTextColor, fontSize: '1rem', textTransform: 'uppercase' }}>Matricule</h2>
          <p style={{ fontSize: '1.2rem' }}>{user.matricule}</p>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ fontFamily: 'var(--font-courier-prime), monospace', color: mutedTextColor, fontSize: '1rem', textTransform: 'uppercase' }}>Niveau d'Accréditation</h2>
          <p style={{ fontSize: '1.2rem' }}>{user.accreditation}</p>
        </div>
        
        {/* Exemple d'affichage conditionnel basé sur le niveau d'accréditation */}
        {user.accreditation === AccreditationLevel.COMMANDANT && (
          <div style={{ padding: '1rem', border: `1px solid ${borderColor}`, backgroundColor: 'rgba(0,0,0,0.1)', marginTop: '2rem' }}>
            <p style={{ margin: 0 }}>Accès de commandement activé. Vous disposez des autorisations maximales.</p>
          </div>
        )}

      </div>
    </div>
  );
}