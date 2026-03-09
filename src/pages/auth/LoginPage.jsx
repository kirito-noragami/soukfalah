import { useState } from 'react';
import fieldsImage from '../../assets/images/home-fields.png';
import { navigateTo } from '../../app/navigation';
import { useAuth } from '../../app/providers/AuthProvider';
import AuthCard from './components/AuthCard';
import PasswordField from './components/PasswordField';
import AuthSubmitButton from './components/AuthSubmitButton';
import './LoginPage.css';

const LoginPage = () => {
  const { login } = useAuth();
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const fd       = new FormData(e.currentTarget);
    const email    = String(fd.get('username') || '').trim(); // field is named "username" in the form
    const password = String(fd.get('password') || '').trim();

    if (!email || !password) {
      setError('Please fill in both fields.');
      return;
    }

    setLoading(true);
    const result = await login(email, password);
    setLoading(false);

    if (!result.ok) {
      setError(result.error);
      return;
    }
    navigateTo('/');
  };

  return (
    <div className="auth-page" style={{ '--auth-bg-image': `url(${fieldsImage})` }}>
      <AuthCard
        title="Log In"
        subtitle="Welcome back to SoukFellah"
        footer={
          <>
            <span>No account yet?</span>
            <a href="/register">Create one</a>
          </>
        }
      >
        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <label className="auth-field">
            <span className="auth-field__icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M20 21a8 8 0 0 0-16 0" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="12" cy="8" r="4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <input
              type="email"
              name="username"
              placeholder="Email address"
              autoComplete="email"
            />
          </label>

          <PasswordField />

          {error && (
            <p style={{
              color: '#c0392b', fontSize: '0.83rem', margin: 0,
              padding: '0.4rem 0.6rem', background: 'rgba(192,57,43,0.07)',
              borderRadius: '8px', textAlign: 'center',
            }}>
              {error}
            </p>
          )}

          <AuthSubmitButton label={loading ? 'Signing in…' : 'Log In'} disabled={loading} />

          <p style={{ fontSize: '0.75rem', opacity: 0.5, textAlign: 'center', margin: 0 }}>
            Use your Supabase email &amp; password
          </p>
        </form>
      </AuthCard>
    </div>
  );
};

export default LoginPage;