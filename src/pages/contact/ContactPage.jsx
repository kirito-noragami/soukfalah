import fieldsImage from '../../assets/images/home-fields.png';
import heroImage from '../../assets/images/home-hero.png';
import ContactForm from './components/ContactForm';
import ContactInfoCard from './components/ContactInfoCard';
import './ContactPage.css';
const ContactPage = () => {
  const pageStyle = {
    '--contact-hero-image': `url(${heroImage})`,
    '--contact-fields-image': `url(${fieldsImage})`
  };
  return <div className="contact-page" id="contact" style={pageStyle}>
      <section className="contact-hero">
        <div className="contact-hero__inner">
          <span className="contact-hero__kicker">Contact Us</span>
          <h1 className="contact-hero__title">Contact Us</h1>
          <p className="contact-hero__subtitle">
            We're here to listen to you. Whether you have a question, feedback,
            or a concern, our team is always ready to help.
          </p>
        </div>
      </section>

      <div className="contact-page__grid">
        <ContactForm />
        <div className="contact-page__side">
          <ContactInfoCard />
          <section className="contact-note">
            <h3>We're Listening</h3>
            <p>
              Thank you for trusting SoukFellah. We look forward to hearing from
              you and improving our platform together.
            </p>
          </section>
        </div>
      </div>

      <section className="contact-banner">
        <div className="contact-banner__content">
          <h2>We're Listening</h2>
          <p>
            Thank you for trusting SoukFellah. We look forward to hearing from
            you and improving our platform together.
          </p>
        </div>
      </section>
    </div>;
};
export default ContactPage;