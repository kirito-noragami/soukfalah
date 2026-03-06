import './ImpactSection.css';
const stats = [{
  value: '120+',
  label: 'Partner farms'
}, {
  value: '9',
  label: 'Regions served'
}, {
  value: '48h',
  label: 'Harvest to market'
}, {
  value: '2k+',
  label: 'Monthly orders'
}];
const ImpactSection = () => {
  return <section className="impact-section">
      <div className="impact-section__header">
        <h2>Our Impact</h2>
        <p>
          Since our launch, SoukFellah has helped growers reach customers across
          Morocco. Here are a few highlights from the community.
        </p>
      </div>
      <div className="impact-section__stats">
        {stats.map(stat => <div key={stat.label} className="impact-section__stat">
            <span className="impact-section__value">{stat.value}</span>
            <span className="impact-section__label">{stat.label}</span>
          </div>)}
      </div>
    </section>;
};
export default ImpactSection;