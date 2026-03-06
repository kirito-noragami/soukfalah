const PasswordField = ({
  id = 'password',
  placeholder = 'Password',
  autoComplete = 'current-password'
}) => {
  return <label className="auth-field">
      <span className="auth-field__icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <rect x="4" y="11" width="16" height="9" rx="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M8 11V8a4 4 0 0 1 8 0v3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <input id={id} name="password" type="password" placeholder={placeholder} autoComplete={autoComplete} required />
    </label>;
};
export default PasswordField;