import fieldsImage from '../../assets/images/home-fields.png';
import Breadcrumbs from '../../components/common/Breadcrumbs';
import { useCart } from '../../app/providers/CartProvider';
import CartTable from './components/CartTable';
import CartSummaryCard from './components/CartSummaryCard';
import './CartPage.css';

const CartPage = () => {
  const { items, total, updateQty, removeItem } = useCart();

  const pageStyle = { '--cart-fields-image': `url(${fieldsImage})` };

  const handleQuantityChange = (id, delta) => updateQty(id, delta);
  const handleRemove = (id) => removeItem(id);

  const breadcrumbs = [{ label: 'Marketplace', href: '/marketplace' }, { label: 'Cart' }];

  return (
    <div className="cart-page" style={pageStyle}>
      <div className="cart-page__breadcrumbs">
        <Breadcrumbs items={breadcrumbs} />
      </div>
      <header className="cart-hero">
        <div className="cart-hero__inner">
          <h1 className="cart-hero__title">Shopping Cart</h1>
          <p className="cart-hero__subtitle">
            {items.length === 0 ? 'Your cart is empty.' : `You have ${items.length} item${items.length > 1 ? 's' : ''} in your cart.`}
          </p>
        </div>
      </header>
      <section className="cart-card">
        {items.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', opacity: 0.6 }}>
            <p style={{ marginBottom: '1rem' }}>Nothing here yet.</p>
            <a href="/marketplace" style={{ textDecoration: 'underline' }}>Browse the Marketplace</a>
          </div>
        ) : (
          <>
            <CartTable items={items} onQuantityChange={handleQuantityChange} onRemove={handleRemove} />
            <div className="cart-card__footer">
              <a className="cart-continue" href="/marketplace">Continue Shopping</a>
              <CartSummaryCard total={total} />
            </div>
          </>
        )}
      </section>
    </div>
  );
};

export default CartPage;