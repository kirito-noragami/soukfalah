import { navigateTo } from '../../../app/navigation';
import { getStoredRole } from '../../../app/session';

const ctaByRole = {
  buyer: {
    title: ['Ready for your next', 'farm order?'],
    actionLabel: 'Open Buyer Workspace',
    actionTo: '/dashboard/buyer/workspace'
  },
  farmer: {
    title: ['Ready to publish', 'today harvest?'],
    actionLabel: 'Open Farmer Studio',
    actionTo: '/dashboard/farmer/studio'
  },
  admin: {
    title: ['Ready to review', 'market activity?'],
    actionLabel: 'Open Admin Operations',
    actionTo: '/dashboard/admin/operations'
  },
  guest: {
    title: ['Ready to get fresh,', 'local products from farmers?'],
    actionLabel: 'Start Shopping',
    actionTo: '/marketplace'
  }
};

const CallToAction = () => {
  const role = getStoredRole() || 'guest';
  const config = ctaByRole[role] || ctaByRole.guest;

  return <section className="home-cta">
      <div className="home-cta__inner">
        <h2 className="home-cta__title">
          {config.title[0]} <span>{config.title[1]}</span>
        </h2>
        <button className="home-button home-button--primary" type="button" onClick={() => navigateTo(config.actionTo)}>
          {config.actionLabel}
        </button>
      </div>
    </section>;
};
export default CallToAction;