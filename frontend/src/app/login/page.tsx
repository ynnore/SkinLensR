import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageCode } from '@/types';
import styles from './login.module.css';

// allTranslations est défini ailleurs, tu l'as déjà

const getTranslation = <S extends keyof typeof allTranslations, K extends keyof typeof allTranslations[S]>(
  section: S,
  key: K,
  lang: LanguageCode
): string => {
  const sectionTranslations = allTranslations[section];
  if (!sectionTranslations) {
    console.warn(`Translation section not found: ${String(section)}`);
    return `[Missing Section: ${String(section)}]`;
  }
  const specificTranslations = sectionTranslations[key];
  if (typeof specificTranslations !== 'object' || specificTranslations === null || !('en' in specificTranslations)) {
    console.warn(`Translation missing or invalid for: ${String(section)}.${String(key)} in language ${lang}`);
    return `[Invalid Translation: ${String(section)}.${String(key)}]`;
  }
  return (specificTranslations as { [l: string]: string })[lang] || (specificTranslations as { [l: string]: string }).en || '';
};

export default function LoginPage() {
  const { language } = useLanguage();
  const { theme } = useTheme();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [isEmailValidated, setIsEmailValidated] = useState(true);
  const [isPasswordValidated, setIsPasswordValidated] = useState(true);

  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const emailValid = emailRegex.test(email);
      setIsEmailValidated(emailValid);

      const passwordValid = password.length >= 8;
      setIsPasswordValidated(passwordValid);

      if (emailValid && passwordValid) {
        // TODO: Remplacer par appel réel à ton API backend
        // Exemple :
        // const response = await fetch('/api/login', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({ email, password }),
        // });
        // if (!response.ok) throw new Error('Authentication failed');
        // const data = await response.json();
        // router.push('/dashboard');

        router.push('/register'); // redirection test si succès
      } else {
        if (!emailValid && !passwordValid) {
          setError(getTranslation('loginPage', 'errorMessageGeneric', language));
        } else if (!emailValid) {
          setError(getTranslation('loginPage', 'invalidEmail', language));
        } else if (!passwordValid) {
          setError(getTranslation('loginPage', 'invalidPassword', language));
        }
      }
    } catch (err) {
      console.error('Erreur login:', err);
      setError(getTranslation('loginPage', 'errorMessageGeneric', language));
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = isEmailValidated && isPasswordValidated && email !== '' && password !== '';

  return (
    <div
      className={styles.pageContainer}
      style={{
        backgroundColor: theme === 'dark' ? '#1A1A2E' : '#f9fafb',
        color: theme === 'dark' ? '#E0E0E0' : '#333333',
        fontFamily: "'Arial', sans-serif",
      }}
    >
      <div className={styles.formWrapper}>
        <h1
          className={styles.title}
          style={{
            color: theme === 'dark' ? '#8BC4FF' : '#4A90E2',
            textShadow: theme === 'dark' ? '2px 2px 0 rgba(0,0,0,0.6)' : '2px 2px 0 rgba(150,150,150,0.4)',
          }}
        >
          {getTranslation('loginPage', 'mainTitle', language)}
        </h1>
        <p
          className={styles.preamble}
          style={{ color: theme === 'dark' ? '#A0A0A0' : '#666666' }}
        >
          {getTranslation('loginPage', 'preamble', language)}
        </p>

        {error && (
          <div
            className={styles.errorBox}
            role="alert"
            style={{
              backgroundColor: theme === 'dark' ? '#402020' : '#fdd',
              color: theme === 'dark' ? '#FFDDDD' : '#A00',
              border: `1px solid ${theme === 'dark' ? '#802020' : '#CC0000'}`,
              boxShadow: `0 2px 8px ${theme === 'dark' ? 'rgba(255,0,0,0.3)' : 'rgba(255,100,100,0.3)'}`,
            }}
          >
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>
              {getTranslation('loginPage', 'usernameLabel', language)}
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                const valid = emailRegex.test(e.target.value);
                setIsEmailValidated(valid);
                if (error) setError(null);
              }}
              className={styles.inputField}
              disabled={isLoading}
              style={{
                backgroundColor: theme === 'dark' ? '#1F1F2A' : '#FFFFFF',
                color: theme === 'dark' ? '#E0E0E0' : '#333333',
                borderColor: theme === 'dark' ? '#444444' : '#CCCCCC',
              }}
              placeholder="agent@example.com"
            />
            {email && (
              <span style={{ color: isEmailValidated ? 'green' : 'red', marginLeft: 10 }}>
                {isEmailValidated
                  ? getTranslation('loginPage', 'emailValidated', language)
                  : getTranslation('loginPage', 'invalidEmail', language)}
              </span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.label}>
              {getTranslation('loginPage', 'passwordLabel', language)}
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                const valid = e.target.value.length >= 8;
                setIsPasswordValidated(valid);
                if (error) setError(null);
              }}
              className={styles.inputField}
              disabled={isLoading}
              style={{
                backgroundColor: theme === 'dark' ? '#1F1F2A' : '#FFFFFF',
                color: theme === 'dark' ? '#E0E0E0' : '#333333',
                borderColor: theme === 'dark' ? '#444444' : '#CCCCCC',
              }}
              placeholder="********"
            />
            {password && (
              <span style={{ color: isPasswordValidated ? 'green' : 'red', marginLeft: 10 }}>
                {isPasswordValidated
                  ? getTranslation('loginPage', 'passwordValidated', language)
                  : getTranslation('loginPage', 'invalidPassword', language)}
              </span>
            )}
            <Link
              href="/forgot-password"
              className={styles.forgotPasswordLink}
              style={{ color: theme === 'dark' ? '#8BC4FF' : '#4A90E2' }}
            >
              {getTranslation('loginPage', 'forgotPassword', language)}
            </Link>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading || !isFormValid}
              className={styles.submitButton}
              style={{
                backgroundColor: theme === 'dark' ? '#005bb5' : '#0070f3',
                color: theme === 'dark' ? '#E0E0E0' : 'white',
                opacity: isLoading || !isFormValid ? 0.6 : 1,
                cursor: isLoading || !isFormValid ? 'not-allowed' : 'pointer',
              }}
            >
              {isLoading
                ? getTranslation('loginPage', 'loadingButtonText', language)
                : getTranslation('loginPage', 'submitButtonText', language)}
            </button>
          </div>
        </form>

        {!error && !isFormValid && (
          <p className={styles.footerText}>
            {getTranslation('loginPage', 'alreadyMatricule', language)}{' '}
            <Link href="/register" className={styles.link} style={{ color: theme === 'dark' ? '#8BC4FF' : '#4A90E2' }}>
              {getTranslation('loginPage', 'registerLinkText', language)}
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}


