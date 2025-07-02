// Fichier : src/components/I18nProvider.tsx
'use client';

import { I18nextProvider } from 'react-i18next';
// NOUVEAU : Importez LanguageCode depuis '@/types'
import { LanguageCode } from '@/types'; // <<< CORRECTION MAJEURE ICI
import i18n from '@/i18n-client'; 
import { ReactNode, Suspense } from 'react';

// Si vous aviez un LanguageSpinner ou LanguageSelector qui utilisait LanguageCode,
// il faudrait aussi corriger leur import. Mais d'après le log, c'est I18nProvider.

// Vous pourriez avoir besoin d'adapter cette interface si elle est différente dans votre code
interface I18nProviderProps {
  children: ReactNode;
  // Si I18nProvider prend la langue en prop, définissez-la ainsi :
  // language: LanguageCode;
}

export default function I18nProvider({ children }: I18nProviderProps) {
  // Si I18nProvider a besoin de la langue, et qu'il ne la reçoit pas en prop,
  // il devrait la récupérer du contexte i18next (une fois i18next configuré)
  // ou si vous avez un context pour LanguageCode vous devriez l'utiliser.
  // Pour l'instant, je ne modifie pas la logique interne de I18nProvider car l'erreur est sur l'import.
  
  return (
    // Suspense est souvent utilisé avec i18n pour le chargement async des traductions
    <Suspense fallback={null}>
      <I18nextProvider i18n={i18n}>
        {children}
      </I18nextProvider>
    </Suspense>
  );
}