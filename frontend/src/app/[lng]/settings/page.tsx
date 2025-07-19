// Fichier: src/app/settings/page.tsx
'use client'; // Indique que ce composant est un Client Component

import { useTheme } from '../../context/ThemeContext'; // Importez le hook useTheme

export default function SettingsPage() {
  const { theme } = useTheme(); // Accédez au thème actuel

  // Définissez les couleurs en fonction du thème
  const textColor = theme === 'dark' ? '#E0E0E0' : '#333';
  const linkColor = theme === 'dark' ? '#8BC4FF' : '#0070f3';
  const mutedTextColor = theme === 'dark' ? '#A0A0A0' : '#666';
  const borderColor = theme === 'dark' ? '#444' : '#eee';
  const inputBgColor = theme === 'dark' ? '#2c2c2c' : '#f9f9f9'; // Couleur de fond pour les champs de formulaire en lecture seule
  const inputBorderColor = theme === 'dark' ? '#555' : '#ddd'; // Bordure pour les champs de formulaire
  const sectionBgColor = theme === 'dark' ? '#1a1a1a' : '#fff'; // Fond des sections
  const buttonPrimaryBg = theme === 'dark' ? '#005bb5' : '#0070f3'; // Bouton principal
  const buttonPrimaryText = theme === 'dark' ? '#E0E0E0' : 'white'; // Texte bouton principal
  const buttonDangerBg = theme === 'dark' ? '#992222' : '#dc3545'; // Bouton danger
  const buttonSuccessBg = theme === 'dark' ? '#1e7e34' : '#28a745'; // Bouton succès

  return (
    <div style={{
      padding: '2rem',
      maxWidth: '900px',
      margin: '0 auto',
      lineHeight: '1.6',
      fontSize: '1rem',
      color: textColor // Appliquez la couleur de texte dynamique
    }}>
      <h1 style={{ marginBottom: '1.5rem', fontSize: '2.5rem', borderBottom: `1px solid ${borderColor}`, paddingBottom: '0.5rem' }}>
        Settings
      </h1>
      <p style={{ marginBottom: '2.5rem', color: mutedTextColor }}>
        Configure your account and application settings here.
      </p>

      {/* Section 1: Account Information */}
      <section style={{ marginBottom: '2.5rem', padding: '1.5rem', border: `1px solid ${borderColor}`, borderRadius: '8px', backgroundColor: sectionBgColor }}>
        <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>
          Account Information
        </h2>
        <p style={{ marginBottom: '1rem' }}>Manage your personal details and profile.</p>
        {/* Placeholder for actual form components */}
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="name" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Name:</label>
          <input type="text" id="name" defaultValue="John Doe" style={{ width: '100%', padding: '0.75rem', border: `1px solid ${inputBorderColor}`, borderRadius: '4px', backgroundColor: inputBgColor, color: textColor }} />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="email" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Email:</label>
          <input type="email" id="email" defaultValue="john.doe@example.com" readOnly style={{ width: '100%', padding: '0.75rem', border: `1px solid ${inputBorderColor}`, borderRadius: '4px', backgroundColor: inputBgColor, color: mutedTextColor }} />
          <small style={{ color: mutedTextColor, display: 'block', marginTop: '0.25rem' }}>Contact support to change your email address.</small>
        </div>
        <button style={{ padding: '0.8rem 1.5rem', backgroundColor: buttonPrimaryBg, color: buttonPrimaryText, border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '1rem' }}>
          Save Changes
        </button>
        <p style={{ marginTop: '1.5rem', fontSize: '0.9rem', color: mutedTextColor }}>
          For any issues related to your account or profile, please contact:{" "}
          <a href="mailto:account@kiwi-ops.com" style={{ color: linkColor, textDecoration: 'none' }}>account@kiwi-ops.com</a> (or `support@kiwi-ops.com` if you don't have a specific `account` alias).
        </p>
      </section>

      {/* Section 2: Security Settings */}
      <section style={{ marginBottom: '2.5rem', padding: '1.5rem', border: `1px solid ${borderColor}`, borderRadius: '8px', backgroundColor: sectionBgColor }}>
        <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>
          Security
        </h2>
        <p style={{ marginBottom: '1rem' }}>Manage your password and security preferences.</p>
        {/* Placeholder for password change form */}
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="current-password" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Current Password:</label>
          <input type="password" id="current-password" style={{ width: '100%', padding: '0.75rem', border: `1px solid ${inputBorderColor}`, borderRadius: '4px', backgroundColor: inputBgColor, color: textColor }} />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="new-password" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>New Password:</label>
          <input type="password" id="new-password" style={{ width: '100%', padding: '0.75rem', border: `1px solid ${inputBorderColor}`, borderRadius: '4px', backgroundColor: inputBgColor, color: textColor }} />
        </div>
        <button style={{ padding: '0.8rem 1.5rem', backgroundColor: buttonPrimaryBg, color: buttonPrimaryText, border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '1rem' }}>
          Change Password
        </button>
        {/* Placeholder for 2FA settings */}
        <div style={{ marginTop: '2rem', display: 'flex', alignItems: 'center' }}>
          <input type="checkbox" id="two-factor-auth" style={{ marginRight: '0.5rem' }} />
          <label htmlFor="two-factor-auth" style={{ fontWeight: 'bold' }}>Enable Two-Factor Authentication</label>
        </div>
        <p style={{ marginTop: '1.5rem', fontSize: '0.9rem', color: mutedTextColor }}>
          For any security concerns or to report a vulnerability, please contact:{" "}
          <a href="mailto:security@kiwi-ops.com" style={{ color: linkColor, textDecoration: 'none' }}>security@kiwi-ops.com</a>.
        </p>
      </section>

      {/* Section 3: Notifications */}
      <section style={{ marginBottom: '2.5rem', padding: '1.5rem', border: `1px solid ${borderColor}`, borderRadius: '8px', backgroundColor: sectionBgColor }}>
        <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>
          Notifications
        </h2>
        <p style={{ marginBottom: '1rem' }}>Choose how you want to receive updates from us.</p>
        {/* Placeholder for notification toggles */}
        <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center' }}>
          <input type="checkbox" id="email-notifications" defaultChecked style={{ marginRight: '0.5rem' }} />
          <label htmlFor="email-notifications">Email Notifications</label>
        </div>
        <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center' }}>
          <input type="checkbox" id="inapp-notifications" defaultChecked style={{ marginRight: '0.5rem' }} />
          <label htmlFor="inapp-notifications">In-App Notifications</label>
        </div>
        <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center' }}>
          <input type="checkbox" id="scan-notifications" defaultChecked style={{ marginRight: '0.5rem' }} />
          <label htmlFor="scan-notifications">Scan Completion Alerts</label>
        </div>
        <button style={{ padding: '0.8rem 1.5rem', backgroundColor: buttonPrimaryBg, color: buttonPrimaryText, border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '1rem' }}>
          Update Notification Settings
        </button>
        <p style={{ marginTop: '1.5rem', fontSize: '0.9rem', color: mutedTextColor }}>
          Having trouble with notifications? Contact our support team:{" "}
          <a href="mailto:support@kiwi-ops.com" style={{ color: linkColor, textDecoration: 'none' }}>support@kiwi-ops.com</a>.
        </p>
      </section>

      {/* Section 4: Billing & Subscription (if applicable) */}
      <section style={{ marginBottom: '2.5rem', padding: '1.5rem', border: `1px solid ${borderColor}`, borderRadius: '8px', backgroundColor: sectionBgColor }}>
        <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>
          Billing & Subscription
        </h2>
        <p style={{ marginBottom: '1rem' }}>Manage your plan and payment methods.</p>
        <p style={{ marginBottom: '1rem' }}>Your current plan: <strong>Pro Plan</strong> (<a href="#" style={{ color: linkColor, textDecoration: 'none' }}>Upgrade/Downgrade</a>)</p>
        {/* Placeholder for billing details */}
        <p style={{ marginBottom: '1rem' }}>Payment Method: **** **** **** 1234 (Expires 12/25)</p>
        <button style={{ padding: '0.8rem 1.5rem', backgroundColor: buttonPrimaryBg, color: buttonPrimaryText, border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '1rem', marginRight: '1rem' }}>
          Update Payment Method
        </button>
        <button style={{ padding: '0.8rem 1.5rem', backgroundColor: '#6c757d', color: buttonPrimaryText, border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '1rem' }}>
          View Invoices
        </button>
        <p style={{ marginTop: '1.5rem', fontSize: '0.9rem', color: mutedTextColor }}>
          For all billing and payment related inquiries, please contact:{" "}
          <a href="mailto:billing@kiwi-ops.com" style={{ color: linkColor, textDecoration: 'none' }}>billing@kiwi-ops.com</a>.
        </p>
      </section>

      {/* Section 5: Data & Privacy (Crucial for professionalism and compliance) */}
      <section style={{ marginBottom: '2.5rem', padding: '1.5rem', border: `1px solid ${borderColor}`, borderRadius: '8px', backgroundColor: sectionBgColor }}>
        <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>
          Data & Privacy
        </h2>
        <p style={{ marginBottom: '1rem' }}>Manage your data and privacy settings.</p>
        <button style={{ padding: '0.8rem 1.5rem', backgroundColor: buttonSuccessBg, color: buttonPrimaryText, border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '1rem', marginRight: '1rem' }}>
          Export My Data
        </button>
        <button style={{ padding: '0.8rem 1.5rem', backgroundColor: buttonDangerBg, color: buttonPrimaryText, border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '1rem' }}>
          Delete My Account
        </button>
        <p style={{ marginTop: '1.5rem', fontSize: '0.9rem', color: mutedTextColor }}>
          For questions related to your data privacy, data access, deletion requests, or to report data breaches, please contact:{" "}
          <a href="mailto:privacy@kiwi-ops.com" style={{ color: linkColor, textDecoration: 'none' }}>privacy@kiwi-ops.com</a>.
        </p>
        <p style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: mutedTextColor }}>
          You can also review our full{" "}
          <a href="/privacy-policy" style={{ color: linkColor, textDecoration: 'none' }}>Privacy Policy</a>
          {" "} and{" "}
          <a href="/terms" style={{ color: linkColor, textDecoration: 'none' }}>Terms and Conditions</a>.
        </p>
      </section>

      {/* Section 6: General Help & Support (Catch-all) */}
      <section style={{ marginBottom: '2.5rem', padding: '1.5rem', border: `1px solid ${borderColor}`, borderRadius: '8px', backgroundColor: sectionBgColor }}>
        <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>
          Help & Support
        </h2>
        <p style={{ marginBottom: '1rem' }}>Need further assistance? Our team is here to help.</p>
        <p style={{ marginTop: '1.5rem', fontSize: '0.9rem', color: mutedTextColor }}>
          For any other questions or general support, please contact:{" "}
          <a href="mailto:support@kiwi-ops.com" style={{ color: linkColor, textDecoration: 'none' }}>support@kiwi-ops.com</a>.
        </p>
        <p style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: mutedTextColor }}>
          You can also visit our comprehensive{" "}
          <a href="/help-center" style={{ color: linkColor, textDecoration: 'none' }}>Help Center</a> (if you have one).
        </p>
      </section>

      <p style={{ textAlign: 'center', marginTop: '3rem', fontSize: '0.9rem', color: mutedTextColor }}>
        © {new Date().getFullYear()} Kiwi-Ops. All rights reserved.
      </p>
    </div>
  );
}