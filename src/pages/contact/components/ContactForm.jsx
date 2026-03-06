import './ContactForm.css';
const ContactForm = () => {
  return <form className="contact-form" onSubmit={event => event.preventDefault()}>
      <div className="contact-form__header">
        <h3>Get in Touch</h3>
        <p>We respond to every message within 24 hours.</p>
      </div>
      <div className="contact-form__fields">
        <label className="contact-form__field">
          <span>Full Name</span>
          <input type="text" placeholder="Enter your full name" />
        </label>
        <label className="contact-form__field">
          <span>Email Address</span>
          <input type="email" placeholder="Enter your email address" />
        </label>
        <label className="contact-form__field">
          <span>Message</span>
          <textarea rows={5} placeholder="Write your message here" />
        </label>
      </div>
      <button className="contact-form__button" type="submit">
        Send Message
      </button>
    </form>;
};
export default ContactForm;