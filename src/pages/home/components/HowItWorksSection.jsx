const HowItWorksSection = () => {
  const steps = [{
    title: 'Search',
    description: 'Find fresh products nearby by selecting city, category, and distance.',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="11" cy="11" r="6" />
          <path d="M16 16l4 4" />
        </svg>
  }, {
    title: 'Order',
    description: 'Choose your products and securely place your order online.',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="9" cy="20" r="1.5" />
          <circle cx="17" cy="20" r="1.5" />
          <path d="M3 4h2l2.5 12h11l2-7H7" />
        </svg>
  }, {
    title: 'Receive',
    description: 'Get your products - delivered fresh from the farm to your door.',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M3 7h11v10H3z" />
          <path d="M14 10h4l3 3v4h-7z" />
          <circle cx="7" cy="19" r="1.5" />
          <circle cx="17" cy="19" r="1.5" />
        </svg>
  }];
  return <section className="home-how">
      <div className="home-section__header">
        <h2 className="home-section__title">How it works</h2>
      </div>
      <div className="home-how__grid">
        {steps.map(step => <article key={step.title} className="home-how__card">
            <div className="home-how__icon" aria-hidden="true">
              {step.icon}
            </div>
            <div>
              <h3 className="home-how__title">{step.title}</h3>
              <p className="home-how__text">{step.description}</p>
            </div>
          </article>)}
      </div>
    </section>;
};
export default HowItWorksSection;