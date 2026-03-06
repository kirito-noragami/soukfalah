import './ContactInfoCard.css';
const ContactInfoCard = () => {
  return <div className="contact-info">
      <h3>Contact Information</h3>
      <div className="contact-info__list">
        <div className="contact-info__item">
          <span className="contact-info__icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11z" />
              <circle cx="12" cy="11" r="2.5" />
            </svg>
          </span>
          <div>
            <p className="contact-info__title">SoukFellah</p>
            <p className="contact-info__text">Km 12, Route de Marrakech, Morocco</p>
          </div>
        </div>
        <div className="contact-info__item">
          <span className="contact-info__icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19 19 0 0 1-8.3-3.1 19.5 19.5 0 0 1-6-6A19 19 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.8.3 1.6.5 2.4a2 2 0 0 1-.5 2.1l-1.3 1.3a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.8.2 1.6.4 2.4.5a2 2 0 0 1 1.7 2z" />
            </svg>
          </span>
          <div>
            <p className="contact-info__title">Phone</p>
            <p className="contact-info__text">+212 600 123 456</p>
          </div>
        </div>
        <div className="contact-info__item">
          <span className="contact-info__icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 4h16v16H4z" />
              <path d="m4 6 8 6 8-6" />
            </svg>
          </span>
          <div>
            <p className="contact-info__title">Email</p>
            <p className="contact-info__text">support@soukfellah.com</p>
          </div>
        </div>
        <div className="contact-info__item">
          <span className="contact-info__icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 7v5l3 2" />
            </svg>
          </span>
          <div>
            <p className="contact-info__title">Monday - Friday</p>
            <p className="contact-info__text">9:00 AM - 6:00 PM</p>
          </div>
        </div>
        <div className="contact-info__item">
          <span className="contact-info__icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 12l2 2 4-4" />
              <circle cx="12" cy="12" r="9" />
            </svg>
          </span>
          <div>
            <p className="contact-info__title">Response time</p>
            <p className="contact-info__text">Less than 24 hours</p>
          </div>
        </div>
      </div>
    </div>;
};
export default ContactInfoCard;