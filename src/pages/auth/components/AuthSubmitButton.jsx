import './AuthSubmitButton.css';
const AuthSubmitButton = ({ label, disabled }) => (
  <button className="auth-submit" type="submit" disabled={disabled} style={disabled ? { opacity: 0.6, cursor: 'not-allowed' } : {}}>
    {label}
  </button>
);
export default AuthSubmitButton;