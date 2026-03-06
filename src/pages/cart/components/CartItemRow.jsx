import './CartItemRow.css';
const CartItemRow = ({
  item,
  formatPrice,
  onQuantityChange,
  onRemove
}) => {
  const rowStyle = {
    '--item-accent': item.accent
  };
  return <div className="cart-item" style={rowStyle}>
      <div className="cart-item__product">
        <div className="cart-item__image" role="img" aria-label={item.name} />
        <div>
          <div className="cart-item__name">{item.name}</div>
          <div className="cart-item__unit">
            {formatPrice(item.price)} / {item.unit}
          </div>
        </div>
      </div>
      <div className="cart-item__price">
        {formatPrice(item.price)} / {item.unit}
      </div>
      <div className="cart-item__quantity" aria-label={`Quantity for ${item.name}`}>
        <button className="cart-item__qty-btn" type="button" onClick={() => onQuantityChange(item.id, -1)} disabled={item.quantity <= 1} aria-label={`Decrease ${item.name}`}>
          -
        </button>
        <span className="cart-item__qty-value">{item.quantity}</span>
        <button className="cart-item__qty-btn" type="button" onClick={() => onQuantityChange(item.id, 1)} aria-label={`Increase ${item.name}`}>
          +
        </button>
      </div>
      <div className="cart-item__total">
        <span className="cart-item__total-value">
          {formatPrice(item.price * item.quantity)}
        </span>
        <button className="cart-item__remove" type="button" onClick={() => onRemove(item.id)} aria-label={`Remove ${item.name}`}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 6h18" />
            <path d="M8 6V4h8v2" />
            <path d="M6 6l1 14h10l1-14" />
            <path d="M10 11v6M14 11v6" />
          </svg>
        </button>
      </div>
    </div>;
};
export default CartItemRow;