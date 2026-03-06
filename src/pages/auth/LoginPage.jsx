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
  const [error, setError] = useState('');
  const pageStyle = { '--auth-bg-image': `url(${fieldsImage})` };

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const username = String(formData.get('username') || '').trim().toLowerCase();
    const password = String(formData.get('password') || '').trim().toLowerCase();

    let role = null;
    if (username === 'admin' && password === 'admin') role = 'admin';
    else if (username === 'buyer' && password === 'buyer') role = 'buyer';
    else if (username === 'farmer' && password === 'farmer') role = 'farmer';

    if (!role) {
      setError('Invalid credentials. Try admin/admin, buyer/buyer, or farmer/farmer.');
      return;
    }

    setError('');
    login(username, role);
    navigateTo('/');
  };

  return (
    <div className="auth-page" style={pageStyle}>
      <AuthCard title="Log In" subtitle="Welcome back to SoukFellah" footer={<><span>Don't have an account?</span><a href="/register">Create an account</a></>}>
        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="auth-field">
            <span className="auth-field__icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M20 21a8 8 0 0 0-16 0" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="12" cy="8" r="4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <input type="text" name="username" placeholder="Username" autoComplete="username" required />
          </label>
          <PasswordField />
          <AuthSubmitButton label="Log In" />
          {error && <span className="auth-error">{error}</span>}
        </form>
      </AuthCard>
    </div>
  );
};

export default LoginPage;