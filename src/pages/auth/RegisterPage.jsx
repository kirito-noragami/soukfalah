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
  const { login } = useAuth();
  const [error, setError] = useState('');

  const suggestedRole = typeof window === 'undefined' ? 'farmer' : (new URLSearchParams(window.location.search).get('role') || '').toLowerCase();
  const defaultRole = ['farmer', 'buyer', 'admin'].includes(suggestedRole) ? suggestedRole : 'farmer';
  const pageStyle = { '--auth-bg-image': `url(${fieldsImage})` };

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const fullName = String(formData.get('fullName') || '').trim();
    const roleInput = String(formData.get('role') || '').trim().toLowerCase();

    const normalizedName = fullName.toLowerCase();
    let role = roleInput;
    if (['admin', 'buyer', 'farmer'].includes(normalizedName)) role = normalizedName;

    if (!role) {
      setError('Please select a role to continue.');
      return;
    }

    setError('');
    login(fullName || role, role);
    navigateTo('/');
  };

  return (
    <div className="auth-page" style={pageStyle}>
      <AuthCard title="Create an Account" subtitle="Join the SoukFellah community" footer={<><span>Already have an account?</span><a href="/login">Log In</a></>}>
        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="auth-field">
            <span className="auth-field__icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M20 21a8 8 0 0 0-16 0" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="12" cy="8" r="4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <input type="text" name="fullName" placeholder="Full name" autoComplete="name" required />
          </label>
          <EmailField />
          <PasswordField placeholder="Create a password" autoComplete="new-password" />
          <RoleSelector defaultRole={defaultRole} />
          <AuthSubmitButton label="Register" />
          {error && <span className="auth-error">{error}</span>}
        </form>
      </AuthCard>
    </div>
  );
};

export default RegisterPage;