import { navigateTo } from '../../../app/navigation';
import { getRoleLabel, getStoredRole, getStoredUser } from '../../../app/session';

const heroConfigs = {
  guest: {
    title: ['Buy Fresh Products', 'Directly from Farmers'],
    text: 'Connect directly with local farmers, get the freshest produce at fair prices.',
    primaryLabel: 'Browse Marketplace',
    primaryTo: '/marketplace',
    secondaryLabel: 'Become a Farmer Seller',
    secondaryTo: '/sell'
  },
  buyer: {
    title: ['Continue Shopping', 'From Trusted Farmers'],
    text: 'Track your orders, revisit favorite farms, and discover fresh arrivals near your city.',
    primaryLabel: 'Open Buyer Workspace',
    primaryTo: '/dashboard/buyer/workspace',
    secondaryLabel: 'Browse Marketplace',
    secondaryTo: '/marketplace'
  },
  farmer: {
    title: ['Manage Your Farm', 'Sell with Confidence'],
    text: 'Add products, manage stock, and process incoming orders from one farmer-focused workspace.',
    primaryLabel: 'Open Farmer Studio',
    primaryTo: '/dashboard/farmer/studio',
    secondaryLabel: 'Manage Orders',
    secondaryTo: '/dashboard/farmer/studio#orders'
  },
  admin: {
    title: ['Operate the Platform', 'Review and Scale'],
    text: 'Moderate products, review seller applications, and keep the marketplace healthy and secure.',
    primaryLabel: 'Open Admin Operations',
    primaryTo: '/dashboard/admin/operations',
    secondaryLabel: 'Review Products',
    secondaryTo: '/dashboard/admin/operations#moderation'
  }
};

const HeroSection = () => {
  const role = getStoredRole();
  const sessionRole = role || 'guest';
  const userName = getStoredUser();
  const config = heroConfigs[sessionRole] || heroConfigs.guest;
  const roleLabel = getRoleLabel(role);
  const firstName = userName ? userName.split(/\s+/)[0] : '';

  return <section className="home-hero" id="home">
      <div className="home-hero__card">
        <div className="home-hero__content">
          <div className="home-hero__context">
            <span className="home-hero__context-pill">{roleLabel} Mode</span>
            {firstName ? <span className="home-hero__context-user">Welcome, {firstName}</span> : null}
          </div>
          <h1 className="home-hero__title">
            {config.title[0]} <br />
            {config.title[1]}
          </h1>
          <p className="home-hero__text">{config.text}</p>
          <div className="home-hero__actions">
            <button className="home-button home-button--primary" type="button" onClick={() => navigateTo(config.primaryTo)}>
              {config.primaryLabel}
            </button>
            <button className="home-button home-button--ghost" type="button" onClick={() => navigateTo(config.secondaryTo)}>
              {config.secondaryLabel}
            </button>
          </div>
        </div>
        <div className="home-hero__visual" aria-hidden="true" />
      </div>
    </section>;
};
export default HeroSection;