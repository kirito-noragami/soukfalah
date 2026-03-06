const EmailField = ({
  id = 'email',
  placeholder = 'Email'
}) => {
  return <label className="auth-field">
      <span className="auth-field__icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M4 6h16v12H4z" strokeLinecap="round" strokeLinejoin="round" />
          <path d="m4 7 8 6 8-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <input id={id} name="email" type="email" placeholder={placeholder} autoComplete="email" required />
    </label>;
};
export default EmailField;