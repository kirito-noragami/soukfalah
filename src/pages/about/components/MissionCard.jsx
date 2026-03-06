import heroImage from '../../../assets/images/home-hero.png';
import './MissionCard.css';
const MissionCard = () => {
  const cardStyle = {
    '--mission-image': `url(${heroImage})`
  };
  return <section className="mission-card" style={cardStyle}>
      <div className="mission-card__art" aria-hidden="true" />
      <div className="mission-card__content">
        <div className="mission-card__title">
          <span className="mission-card__icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 3c3 4 5 6 5 9a5 5 0 1 1-10 0c0-3 2-5 5-9z" />
              <path d="M7 14c2 2 6 2 8 0" />
            </svg>
          </span>
          <h2>Our Mission</h2>
        </div>
        <p>
          We help local farmers reach nearby buyers with fair prices, reliable payments,
          and clear logistics. SoukFellah champions sustainable practices so every
          harvest protects the soil and supports rural families.
        </p>
        <div className="mission-card__tags">
          <span>Farmers first</span>
          <span>Short supply chain</span>
          <span>Transparent pricing</span>
        </div>
      </div>
    </section>;
};
export default MissionCard;