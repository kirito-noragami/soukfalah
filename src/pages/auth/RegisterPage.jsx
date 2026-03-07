import { useState } from 'react';
import fieldsImage from '../../assets/images/home-fields.png';
import { navigateTo } from '../../app/navigation';
import { useAuth } from '../../app/providers/AuthProvider';
import AuthCard from './components/AuthCard';
import EmailField from './components/EmailField';
import PasswordField from './components/PasswordField';
import RoleSelector from './components/RoleSelector';
import AuthSubmitButton from './components/AuthSubmitButton';
import './RegisterPage.css';

const RegisterPage = () => {
  const auth = useAuth();                      // SAFE – never null
  const [error, setError] = useState('');

  const suggestedRole =
    typeof window !== 'undefined'
      ? (new URLSearchParams(window.location.search).get('role') || '').toLowerCase()
      : 'buyer';
  const defaultRole = ['farmer', 'buyer', 'admin'].includes(suggestedRole)
    ? suggestedRole
    : 'buyer';

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    const fd       = new FormData(e.currentTarget);
    const fullName = String(fd.get('fullName') || '').trim();
    const username = String(fd.get('username') || '').trim();
    const email    = String(fd.get('email')    || '').trim();
    const password = String(fd.get('password') || '').trim();
    const role     = String(fd.get('role')     || '').trim().toLowerCase();

    if (!fullName || !username || !email || !password || !role) {
      setError('Please fill in every field.');
      return;
    }
    if (password.length < 4) {
      setError('Password must be at least 4 characters.');
      return;
    }

    const result = auth.register(fullName, username, email, password, role);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    navigateTo('/');
  };

  const personIcon = (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M20 21a8 8 0 0 0-16 0" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="8" r="4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  return (
    <div className="auth-page" style={{ '--auth-bg-image': `url(${fieldsImage})` }}>
      <AuthCard
        title="Create Account"
        subtitle="Join the SoukFellah community"
        footer={
          <>
            <span>Already have an account?</span>
            <a href="/login">Log In</a>
          </>
        }
      >
        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          {/* Full name */}
          <label className="auth-field">
            <span className="auth-field__icon" aria-hidden="true">{personIcon}</span>
            <input
              type="text"
              name="fullName"
              placeholder="Full name"
              autoComplete="name"
            />
          </label>

          {/* Username */}
          <label className="auth-field">
            <span className="auth-field__icon" aria-hidden="true">{personIcon}</span>
            <input
              type="text"
              name="username"
              placeholder="Username (used to log in)"
              autoComplete="username"
            />
          </label>

          {/* Email */}
          <EmailField />

          {/* Password */}
          <PasswordField placeholder="Password (min 4 chars)" autoComplete="new-password" />

          {/* Role picker */}
          <RoleSelector defaultRole={defaultRole} />

          {/* Error */}
          {error && (
            <p style={{
              color: '#c0392b', fontSize: '0.83rem', margin: 0,
              padding: '0.4rem 0.6rem', background: 'rgba(192,57,43,0.07)',
              borderRadius: '8px', textAlign: 'center',
            }}>
              {error}
            </p>
          )}

          <AuthSubmitButton label="Create Account" />
        </form>
      </AuthCard>
    </div>
  );
};

export default RegisterPage;