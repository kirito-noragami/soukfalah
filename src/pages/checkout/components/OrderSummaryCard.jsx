import StripePayButton from './StripePayButton';
import './OrderSummaryCard.css';
const formatPrice = value => {
  const hasDecimals = Math.round(value * 100) % 100 !== 0;
  return `${value.toFixed(hasDecimals ? 2 : 0)} DH`;
};
const OrderSummaryCard = ({
  items
}) => {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  return <div className="order-summary">
      <div className="order-summary__header">
        <h2>Order Summary</h2>
      </div>
      <div className="order-summary__items">
        {items.map(item => <div key={item.id} className="order-summary__item">
            <div className="order-summary__thumb" style={{
          '--item-accent': item.accent
        }} />
            <div className="order-summary__info">
              <div className="order-summary__name">{item.name}</div>
              <div className="order-summary__detail">
                {formatPrice(item.price)} / {item.unit} x {item.quantity}
              </div>
            </div>
            <div className="order-summary__price">{formatPrice(item.price * item.quantity)}</div>
            <button className="order-summary__remove" type="button" aria-label={`Remove ${item.name}`}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 6h18" />
                <path d="M8 6V4h8v2" />
                <path d="M6 6l1 14h10l1-14" />
                <path d="M10 11v6M14 11v6" />
              </svg>
            </button>
          </div>)}
      </div>
      <div className="order-summary__total">
        <span>Total Price:</span>
        <strong>{formatPrice(total)}</strong>
      </div>
      <StripePayButton />
      <div className="order-summary__secure">
        <span className="order-summary__lock" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="4" y="10" width="16" height="10" rx="2" />
            <path d="M8 10V7a4 4 0 0 1 8 0v3" />
          </svg>
        </span>
        Secure Payment by Stripe
      </div>
      <div className="order-summary__payments">
        <span>VISA</span>
        <span>Mastercard</span>
        <span>Amex</span>
        <span>Apple Pay</span>
      </div>
      <p className="order-summary__terms">
        By placing this order, you agree to the <a href="#">Terms of Service</a> and{' '}
        <a href="#">Privacy Policy</a>.
      </p>
    </div>;
};
export default OrderSummaryCard;