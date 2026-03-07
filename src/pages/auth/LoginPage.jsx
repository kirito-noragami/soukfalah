import { useState } from 'react';
import fieldsImage from '../../assets/images/home-fields.png';
import { navigateTo } from '../../app/navigation';
import { useAuth } from '../../app/providers/AuthProvider';
import AuthCard from './components/AuthCard';
import PasswordField from './components/PasswordField';
import AuthSubmitButton from './components/AuthSubmitButton';
import './LoginPage.css';

const LoginPage = () => {
  const auth = useAuth();                      // SAFE – never null
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    const fd       = new FormData(e.currentTarget);
    const username = String(fd.get('username') || '').trim();
    const password = String(fd.get('password') || '').trim();

    if (!username || !password) {
      setError('Please fill in both fields.');
      return;
    }

    const result = auth.login(username, password);
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
          {/* Username */}
          <label className="auth-field">
            <span className="auth-field__icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M20 21a8 8 0 0 0-16 0" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="12" cy="8" r="4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <input
              type="text"
              name="username"
              placeholder="Username"
              autoComplete="username"
            />
          </label>

          {/* Password */}
          <PasswordField />

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

          <AuthSubmitButton label="Log In" />

          <p style={{ fontSize: '0.75rem', opacity: 0.5, textAlign: 'center', margin: 0 }}>
            Demo: admin/admin · buyer/buyer · farmer/farmer
          </p>
        </form>
      </AuthCard>
    </div>
  );
};

export default LoginPage;