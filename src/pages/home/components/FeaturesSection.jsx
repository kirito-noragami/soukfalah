const FeaturesSection = () => {
  const features = [{
    title: 'Direct from Farmers',
    description: 'Support local farms by buying their fresh, organic produce.',
    illustration: <svg className="home-feature__art" viewBox="0 0 180 120" fill="none">
          <rect x="0" y="72" width="180" height="48" fill="#e4ecd1" />
          <path d="M0 88c30-18 60-24 90-24s60 6 90 24v32H0z" fill="#d1dcb9" />
          <rect x="112" y="18" width="46" height="32" rx="8" fill="#2f4b31" />
          <path d="M120 41l8-8 8 5 10-12" stroke="#f8f1e6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="56" cy="44" r="12" fill="#f0caa7" />
          <path d="M44 40l12-10 16 10" fill="#b07a2a" />
          <rect x="44" y="54" width="24" height="26" rx="8" fill="#6d8b4b" />
          <rect x="70" y="62" width="48" height="26" rx="6" fill="#d7b27d" stroke="#b48a55" strokeWidth="2" />
          <path d="M70 71h48M70 80h48" stroke="#b48a55" strokeWidth="2" />
          <circle cx="84" cy="60" r="6" fill="#d95b4b" />
          <circle cx="96" cy="58" r="6" fill="#f2c14f" />
          <circle cx="108" cy="60" r="6" fill="#78a95a" />
        </svg>
  }, {
    title: 'Fair Prices & Fresh Products',
    description: 'Get the best prices and the freshest products directly from the farm.',
    illustration: <svg className="home-feature__art" viewBox="0 0 180 120" fill="none">
          <rect x="0" y="74" width="180" height="46" fill="#e4ecd1" />
          <path d="M30 70c18-20 40-26 60-26s42 6 60 26" stroke="#9db27a" strokeWidth="6" strokeLinecap="round" />
          <circle cx="60" cy="52" r="12" fill="#d95b4b" />
          <circle cx="88" cy="48" r="12" fill="#5f8f4e" />
          <circle cx="110" cy="56" r="10" fill="#f2c14f" />
          <circle cx="132" cy="50" r="10" fill="#d95b4b" />
          <rect x="44" y="64" width="92" height="30" rx="6" fill="#d7b27d" stroke="#b48a55" strokeWidth="2" />
          <path d="M44 74h92M44 84h92M60 64v30M90 64v30M120 64v30" stroke="#b48a55" strokeWidth="2" />
        </svg>
  }, {
    title: 'Secure Online Payment',
    description: 'Easy and safe payment methods for a secure shopping experience.',
    illustration: <svg className="home-feature__art" viewBox="0 0 180 120" fill="none">
          <rect x="22" y="36" width="86" height="54" rx="10" fill="#cfe0b8" stroke="#a5ba8a" strokeWidth="2" />
          <rect x="96" y="42" width="60" height="46" rx="10" fill="#b8cca0" stroke="#9bb27c" strokeWidth="2" />
          <rect x="60" y="46" width="64" height="48" rx="12" fill="#2f4b31" />
          <path d="M70 46v-6a20 20 0 0 1 40 0v6" stroke="#2f4b31" strokeWidth="8" strokeLinecap="round" />
          <rect x="84" y="66" width="16" height="20" rx="8" fill="#f8f1e6" />
          <circle cx="92" cy="74" r="3" fill="#2f4b31" />
          <rect x="106" y="56" width="30" height="6" rx="3" fill="#7da05c" />
          <circle cx="126" cy="76" r="5" fill="#7da05c" />
        </svg>
  }];
  return <section className="home-features">
      <div className="home-section__header">
        <h2 className="home-section__title">
          Direct <span>from</span> Farmers
        </h2>
      </div>
      <div className="home-features__grid">
        {features.map(feature => <article key={feature.title} className="home-feature__card">
            <div className="home-feature__media" aria-hidden="true">
              {feature.illustration}
            </div>
            <h3 className="home-feature__title">{feature.title}</h3>
            <p className="home-feature__text">{feature.description}</p>
          </article>)}
      </div>
    </section>;
};
export default FeaturesSection;