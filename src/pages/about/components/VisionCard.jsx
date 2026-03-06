import './VisionCard.css';
const VisionCard = () => {
  return <article className="vision-card">
      <div className="vision-card__media" aria-hidden="true" />
      <div className="vision-card__body">
        <div className="vision-card__title">
          <span className="vision-card__icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 12s4-6 9-6 9 6 9 6-4 6-9 6-9-6-9-6z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </span>
          <h2>Our Vision</h2>
        </div>
        <p>
          A connected rural economy where farmers are valued, harvests travel fewer
          kilometers, and families enjoy fresh produce with full traceability.
        </p>
      </div>
    </article>;
};
export default VisionCard;