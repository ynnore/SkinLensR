// Fichier: src/app/logout/page.tsx
'use client';

import { useRouter } from 'next/navigation';
// Plus tard, tu importeras ta vraie fonction de déconnexion
// import { signOut } from 'next-auth/react'; 
import styles from './logout.module.css';

export default function LogoutPage() {
  const router = useRouter();

  // Fonction pour confirmer la déconnexion
  const handleConfirmLogout = async () => {
    console.log('Demande de permission approuvée. Démobilisation en cours...');
    // await signOut({ redirect: false }); // Ta vraie fonction de déconnexion
    router.push('/'); // Redirige vers la page de login
  };

  // Fonction pour annuler et retourner au service
  const handleCancel = () => {
    router.back(); // Retourne à la page précédente (probablement le dashboard)
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.formWrapper}>
        <h1 className={styles.title}>Demande de Permission</h1>
        <p className={styles.preamble}>
          Agent, votre demande de permission a été enregistrée. Veuillez confirmer votre départ du poste. Vos accès seront suspendus jusqu'à votre retour.
        </p>

        <div className={styles.infoSection}>
          <p><span>MATRICULE :</span> KWI-007</p>
          <p><span>NOM DE CODE :</span> Ronny</p>
          <p><span>POSTE ACTUEL :</span> État-Major</p>
        </div>

        <div className={styles.buttonContainer}>
          <button onClick={handleCancel} className={styles.cancelButton}>
            ANNULER ET REPRENDRE LE SERVICE
          </button>
          <button onClick={handleConfirmLogout} className={styles.confirmButton}>
            CONFIRMER LA DEMANDE ET QUITTER LE POSTE
          </button>
        </div>

        <p className={styles.footerText}>
          La discrétion est requise, même en permission.
        </p>
      </div>
    </div>
  );
}