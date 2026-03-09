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
  const { register } = useAuth();
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const suggestedRole =
    typeof window !== 'undefined'
      ? (new URLSearchParams(window.location.search).get('role') || '').toLowerCase()
      : 'buyer';
  const defaultRole = ['farmer', 'buyer', 'admin'].includes(suggestedRole)
    ? suggestedRole
    : 'buyer';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const fd       = new FormData(e.currentTarget);
    const fullName = String(fd.get('fullName') || '').trim();
    const username = String(fd.get('username') || '').trim();
    const email    = String(fd.get('email')    || '').trim();
    const password = String(fd.get('password') || '').trim();
    const role     = String(fd.get('role')     || '').trim().toLowerCase();

    if (!fullName || !email || !password || !role) {
      setError('Please fill in every field.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters (Supabase requirement).');
      return;
    }

    setLoading(true);
    const result = await register(fullName, username, email, password, role);
    setLoading(false);

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
          <label className="auth-field">
            <span className="auth-field__icon" aria-hidden="true">{personIcon}</span>
            <input type="text" name="fullName" placeholder="Full name" autoComplete="name" />
          </label>

          {/* username kept in form but not used for auth — email is the identifier */}
          <label className="auth-field">
            <span className="auth-field__icon" aria-hidden="true">{personIcon}</span>
            <input type="text" name="username" placeholder="Display name (optional)" autoComplete="username" />
          </label>

          <EmailField />

          <PasswordField placeholder="Password (min 6 chars)" autoComplete="new-password" />

          <RoleSelector defaultRole={defaultRole} />

          {error && (
            <p style={{
              color: '#c0392b', fontSize: '0.83rem', margin: 0,
              padding: '0.4rem 0.6rem', background: 'rgba(192,57,43,0.07)',
              borderRadius: '8px', textAlign: 'center',
            }}>
              {error}
            </p>
          )}

          <AuthSubmitButton label={loading ? 'Creating account…' : 'Create Account'} disabled={loading} />
        </form>
      </AuthCard>
    </div>
  );
};

export default RegisterPage;