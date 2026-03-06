import './CartSummaryCard.css';
const formatPrice = value => {
  const hasDecimals = Math.round(value * 100) % 100 !== 0;
  return `${value.toFixed(hasDecimals ? 2 : 0)} DH`;
};
const CartSummaryCard = ({
  total
}) => {
  return <div className="cart-summary">
      <div className="cart-summary__row">
        <span>Total Price:</span>
        <strong>{formatPrice(total)}</strong>
      </div>
      <a className="cart-summary__button" href="/checkout">
        Proceed to Checkout
      </a>
    </div>;
};
export default CartSummaryCard;