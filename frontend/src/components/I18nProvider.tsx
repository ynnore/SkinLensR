// src/components/I18nProvider.tsx
'use client';

import { I18nextProvider } from 'react-i18next';
// La seule ligne qui change : on importe la configuration client
import i18n from '@/i18n-client'; 
import { ReactNode, Suspense } from 'react';

export default function I18nProvider({ children }: { children: ReactNode }) {
  // On garde Suspense, c'est une bonne pratique
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <I18nextProvider i18n={i18n}>
        {children}
      </I18nextProvider>
    </Suspense>
  );
}