'use client';

import Link from 'next/link';
import { useTheme } from '@/context/ThemeContext'; // ✅ Vérifie le chemin réel
import { useTranslation } from '@/i18n/client';    // ✅ Vérifie le chemin réel
import { languages } from '@/i18n/settings';

// ✅ Permet à Next.js de générer les params lng même dans un sous-dossier
export async function generateStaticParams() {
  return languages.map((lng) => ({ lng }));
}

export default function TermsPage({ params }: { params: { lng: string } }) {
  const lng = params.lng;

  // ✅ Récupération des traductions
  const { t } = useTranslation(lng, 'common');

  const { theme } = useTheme();

  const textColor = theme === 'dark' ? '#E0E0E0' : '#333';
  const linkColor = theme === 'dark' ? '#8BC4FF' : '#0070f3';
  const mutedTextColor = theme === 'dark' ? '#A0A0A0' : '#666';
  const borderColor = theme === 'dark' ? '#444' : '#eee';

  return (
    <div
      style={{
        padding: '2rem',
        maxWidth: '800px',
        margin: '0 auto',
        lineHeight: '1.6',
        color: textColor,
      }}
    >
      <h1 style={{ marginBottom: '1rem', fontSize: '2.5rem' }}>{t('termsPage.title')}</h1>
      <p style={{ fontStyle: 'italic', marginBottom: '2rem', color: mutedTextColor }}>
        {t('termsPage.lastUpdated')}
      </p>

      {/* === Section 1 === */}
      <section style={{ marginBottom: '2rem' }}>
        <h2
          style={{
            fontSize: '1.8rem',
            marginBottom: '0.8rem',
            borderBottom: `1px solid ${borderColor}`,
            paddingBottom: '0.4rem',
          }}
        >
          {t('termsPage.section1Title')}
        </h2>
        <p>{t('termsPage.section1Content1')}</p>
        <p>
          {t('termsPage.section1Content2')}{' '}
          <a href="mailto:terms@kiwi-ops.com" style={{ color: linkColor, textDecoration: 'none' }}>
            terms@kiwi-ops.com
          </a>
          .
        </p>
      </section>

      {/* === Section 2 === */}
      <section style={{ marginBottom: '2rem' }}>
        <h2
          style={{
            fontSize: '1.8rem',
            marginBottom: '0.8rem',
            borderBottom: `1px solid ${borderColor}`,
            paddingBottom: '0.4rem',
          }}
        >
          {t('termsPage.section2Title')}
        </h2>
        <p>{t('termsPage.section2Content1')}</p>
        <p>
          {t('termsPage.section2Content2')}{' '}
          <a href="mailto:support@kiwi-ops.com" style={{ color: linkColor, textDecoration: 'none' }}>
            support@kiwi-ops.com
          </a>
          .
        </p>
      </section>

      {/* === Section 3 === */}
      <section style={{ marginBottom: '2rem' }}>
        <h2
          style={{
            fontSize: '1.8rem',
            marginBottom: '0.8rem',
            borderBottom: `1px solid ${borderColor}`,
            paddingBottom: '0.4rem',
          }}
        >
          {t('termsPage.section3Title')}
        </h2>
        <p>{t('loremIpsum')}</p>
      </section>

      {/* === Section 4 === */}
      <section style={{ marginBottom: '2rem' }}>
        <h2
          style={{
            fontSize: '1.8rem',
            marginBottom: '0.8rem',
            borderBottom: `1px solid ${borderColor}`,
            paddingBottom: '0.4rem',
          }}
        >
          {t('termsPage.section4Title')}
        </h2>
        <p>{t('termsPage.section4Content1')}</p>
        <p>
          {t('termsPage.section4Content2')}{' '}
          <Link href={`/${lng}/privacy-policy`} style={{ color: linkColor, textDecoration: 'none' }}>
            {t('sidebar.privacy_policy')}
          </Link>
          .
        </p>
        <p>
          {t('termsPage.section4Content3')}{' '}
          <a href="mailto:privacy@kiwi-ops.com" style={{ color: linkColor, textDecoration: 'none' }}>
            privacy@kiwi-ops.com
          </a>
          .
        </p>
      </section>

      {/* === Section 5 === */}
      <section style={{ marginBottom: '2rem' }}>
        <h2
          style={{
            fontSize: '1.8rem',
            marginBottom: '0.8rem',
            borderBottom: `1px solid ${borderColor}`,
            paddingBottom: '0.4rem',
          }}
        >
          {t('termsPage.section5Title')}
        </h2>
        <p>{t('termsPage.section5Content1')}</p>
        <ul>
          <li style={{ marginBottom: '0.5rem' }}>
            {t('termsPage.contactTerms')}{' '}
            <a href="mailto:terms@kiwi-ops.com" style={{ color: linkColor, textDecoration: 'none' }}>
              terms@kiwi-ops.com
            </a>
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            {t('termsPage.contactPrivacy')}{' '}
            <a href="mailto:privacy@kiwi-ops.com" style={{ color: linkColor, textDecoration: 'none' }}>
              privacy@kiwi-ops.com
            </a>
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            {t('termsPage.contactSupport')}{' '}
            <a href="mailto:support@kiwi-ops.com" style={{ color: linkColor, textDecoration: 'none' }}>
              support@kiwi-ops.com
            </a>
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            {t('termsPage.contactLegal')}{' '}
            <a href="mailto:legal@kiwi-ops.com" style={{ color: linkColor, textDecoration: 'none' }}>
              legal@kiwi-ops.com
            </a>
          </li>
        </ul>
      </section>

      {/* Footer */}
      <p style={{ textAlign: 'center', marginTop: '3rem', fontSize: '0.9rem', color: mutedTextColor }}>
        {t('termsPage.copyright', { year: new Date().getFullYear() })}
      </p>
    </div>
  );
}