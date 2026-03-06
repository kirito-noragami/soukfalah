import logoMark from '../../assets/images/home-fields.png';
import './Footer.css';
const languages = [{
  id: 'ar',
  label: 'AR'
}, {
  id: 'fr',
  label: 'FR'
}, {
  id: 'en',
  label: 'EN'
}];
const Footer = ({
  locale = 'en',
  onChangeLanguage
}) => {
  return <footer className="souk-footer" id="contact">
      <div className="souk-footer__inner">
        <div className="souk-footer__brand">
          <span className="souk-footer__mark" aria-hidden="true">
            <img src={logoMark} alt="" />
          </span>
          <span className="souk-footer__name" data-i18n-skip="true">SoukFellah</span>
        </div>
        <nav className="souk-footer__nav" aria-label="Footer navigation">
          <a href="/marketplace">Marketplace</a>
          <a href="/about">About Us</a>
          <a href="/contact">Contact</a>
        </nav>
        <div className="souk-footer__langs" role="group" aria-label="Language selector" data-i18n-skip="true">
          {languages.map(language => <button key={language.id} className={locale === language.id ? 'active' : undefined} type="button" aria-pressed={locale === language.id} onClick={() => onChangeLanguage?.(language.id)}>
              {language.label}
            </button>)}
        </div>
      </div>
      <div className="souk-footer__meta">
        <span>(c) 2024 SoukFellah. All rights reserved.</span>
      </div>
    </footer>;
};
export default Footer;
