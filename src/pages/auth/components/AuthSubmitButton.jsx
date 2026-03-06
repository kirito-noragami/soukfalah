import './AuthSubmitButton.css';
const AuthSubmitButton = ({
  label
}) => {
  return <>
      <button className="auth-submit" type="submit">
        {label}
      </button>
    </>;
};
export default AuthSubmitButton;