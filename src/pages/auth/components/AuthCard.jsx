import logoMark from '../../../assets/images/home-fields.png';
import './AuthCard.css';
const AuthCard = ({
  title,
  subtitle,
  children,
  footer
}) => {
  return <section className="auth-card">
      <div className="auth-card__brand">
        <span className="auth-card__mark" aria-hidden="true">
          <img src={logoMark} alt="" />
        </span>
        <span className="auth-card__name">
          Souk<span>Fellah</span>
        </span>
      </div>

      <header className="auth-card__header">
        <h1 className="auth-card__title">{title}</h1>
        {subtitle ? <p className="auth-card__subtitle">{subtitle}</p> : null}
      </header>

      {children}

      {footer ? <div className="auth-footer">{footer}</div> : null}
    </section>;
};
export default AuthCard;