import './StripePayButton.css';

const StripePayButton = ({ label = 'Pay securely' }) => {

  const handleClick = () => {
    window.location.href = "https://buy.stripe.com/test_00w28q5d90uTfPTdLs0sU00";
  };

  return (
    <button className="stripe-pay" type="button" onClick={handleClick}>
      <span className="stripe-pay__title">{label}</span>
      <span className="stripe-pay__badge">
        Powered by <span className="stripe-pay__logo">stripe</span>
      </span>
    </button>
  );
};

export default StripePayButton;