// src/app/[lng]/layout.tsx
import { languages } from '../../i18n/settings';
import { LanguageProvider } from '@/contexts/LanguageContext';

export async function generateStaticParams() {
  return languages.map((lng) => ({ lng }));
}

export default function RootLayout({
  children,
  params: { lng },
}: {
  children: React.ReactNode;
  params: {
    lng: string;
  };
}) {
  return (
    <html lang={lng}>
      <body>
        {/* ✅ On passe la langue dynamique venant du routeur */}
        <LanguageProvider initialLanguage={lng as any}>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
