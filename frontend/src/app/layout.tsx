import './globals.css';
import MainLayoutClient from '@/components/MainLayoutClient';

export const metadata = {
  title: 'SkinLensR',
  viewport: 'width=device-width, initial-scale=1',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {/* On enveloppe toute l'app dans MainLayoutClient */}
        <MainLayoutClient>
          {children}
        </MainLayoutClient>
      </body>
    </html>
  );
}

