// src/types/user.ts

/**
 * Définit les différents niveaux d'accréditation possibles pour un utilisateur.
 * L'utilisation d'un enum garantit la cohérence et évite les erreurs de frappe.
 */
export enum AccreditationLevel {
  AGENT = 'Agent de Terrain',
  OFFICIER = 'Officier de Renseignement',
  COMMANDANT = 'Commandant',
}

/**
 * Définit la structure d'un objet utilisateur dans l'application.
 */
export interface UserProfile {
  id: string; // L'ID unique de la base de données (ex: de Firebase Auth, Supabase, etc.)
  email: string;
  nomDeCode: string; // Le pseudo choisi par l'utilisateur
  matricule: string; // Généré une seule fois à la création du compte
  accreditation: AccreditationLevel; // Le niveau, qui dépend de l'abonnement
  dateEnrolement: string; // La date de création du compte
}