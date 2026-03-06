import './StripePayButton.css';
const StripePayButton = ({
  label = 'Pay securely'
}) => {
  return <button className="stripe-pay" type="button">
      <span className="stripe-pay__title">{label}</span>
      <span className="stripe-pay__badge">
        Powered by <span className="stripe-pay__logo">stripe</span>
      </span>
    </button>;
};
export default StripePayButton;