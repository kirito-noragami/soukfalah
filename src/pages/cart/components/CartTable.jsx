import CartItemRow from './CartItemRow';
import './CartTable.css';
const formatPrice = value => {
  const hasDecimals = Math.round(value * 100) % 100 !== 0;
  return `${value.toFixed(hasDecimals ? 2 : 0)} DH`;
};
const CartTable = ({
  items,
  onQuantityChange,
  onRemove
}) => {
  return <div className="cart-table">
      <div className="cart-table__header">
        <h2>Products</h2>
      </div>
      <div className="cart-table__labels">
        <span>Product</span>
        <span>Price</span>
        <span>Quantity</span>
        <span>Total</span>
      </div>
      <div className="cart-table__body">
        {items.length === 0 ? <div className="cart-table__empty">
            <p>Your cart is empty.</p>
            <a href="/marketplace">Browse the marketplace</a>
          </div> : items.map(item => <CartItemRow key={item.id} item={item} formatPrice={formatPrice} onQuantityChange={onQuantityChange} onRemove={onRemove} />)}
      </div>
    </div>;
};
export default CartTable;