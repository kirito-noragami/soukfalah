import { useState } from 'react';
import fieldsImage from '../../assets/images/home-fields.png';
import { navigateTo } from '../../app/navigation';
import { useCart } from '../../app/providers/CartProvider';
import { useAuth } from '../../app/providers/AuthProvider';
import OrderSummaryCard from './components/OrderSummaryCard';
import './CheckoutPage.css';

const Field = ({ label, children }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', marginBottom: '1rem' }}>
    <label style={{ fontSize: '0.83rem', fontWeight: 600, opacity: 0.7 }}>{label}</label>
    {children}
  </div>
);

const inputStyle = {
  padding: '0.6rem 0.9rem', borderRadius: '8px',
  border: '1px solid var(--color-line-strong, #ccc)',
  fontSize: '0.95rem', background: 'transparent', color: 'inherit',
  width: '100%', boxSizing: 'border-box',
};

const CheckoutPage = () => {
  const { items, total, clearCart } = useCart();  // SAFE
  const { fullName }                = useAuth();  // SAFE
  const [loading, setLoading]       = useState(false);
  const [errors,  setErrors]        = useState({});
  const [form, setForm] = useState({
    fullName: fullName ?? '',
    email:    '',
    address:  '',
    phone:    '',
    payment:  'card',
  });

  const set = (k) => (e) => {
    setForm(prev => ({ ...prev, [k]: e.target.value }));
    setErrors(prev => ({ ...prev, [k]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.fullName.trim()) e.fullName = 'Required';
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email required';
    if (!form.address.trim()) e.address = 'Required';
    if (!form.phone.trim()) e.phone = 'Required';
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    const order = {
      id:       `SO-${Date.now()}`,
      items:    [...items],
      total,
      shipping: { fullName: form.fullName, email: form.email, address: form.address, phone: form.phone },
      payment:  form.payment,
      status:   'Preparing',
      createdAt: new Date().toISOString(),
    };
    try {
      const prev = JSON.parse(localStorage.getItem('soukfalah-orders') || '[]');
      localStorage.setItem('soukfalah-orders', JSON.stringify([order, ...prev]));
    } catch {}

    clearCart();
    setTimeout(() => navigateTo('/order-success'), 300);
  };

  if (items.length === 0) {
    return (
      <div className="checkout-page" style={{ '--checkout-fields-image': `url(${fieldsImage})` }}>
        <header className="checkout-hero"><h1 className="checkout-hero__title">Checkout</h1></header>
        <div style={{ padding: '3rem', textAlign: 'center', opacity: 0.6 }}>
          <p>Your cart is empty.</p>
          <a href="/marketplace" style={{ textDecoration: 'underline', display: 'inline-block', marginTop: '1rem' }}>
            Go shopping
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page" style={{ '--checkout-fields-image': `url(${fieldsImage})` }}>
      <header className="checkout-hero">
        <h1 className="checkout-hero__title">Checkout</h1>
      </header>

      <section className="checkout-grid">
        <div className="shipping-form">
          <div className="shipping-form__header"><h2>Shipping Information</h2></div>
          <form className="shipping-form__body" onSubmit={handleSubmit} noValidate>

            <Field label="Full Name">
              <input style={inputStyle} type="text" value={form.fullName} onChange={set('fullName')} placeholder="Your full name" />
              {errors.fullName && <span style={{ color: '#c0392b', fontSize: '0.78rem' }}>{errors.fullName}</span>}
            </Field>

            <Field label="Email">
              <input style={inputStyle} type="email" value={form.email} onChange={set('email')} placeholder="your@email.com" />
              {errors.email && <span style={{ color: '#c0392b', fontSize: '0.78rem' }}>{errors.email}</span>}
            </Field>

            <Field label="Shipping Address">
              <input style={inputStyle} type="text" value={form.address} onChange={set('address')} placeholder="Street, City" />
              {errors.address && <span style={{ color: '#c0392b', fontSize: '0.78rem' }}>{errors.address}</span>}
            </Field>

            <Field label="Phone Number">
              <input style={inputStyle} type="tel" value={form.phone} onChange={set('phone')} placeholder="+212 6xx xxx xxx" />
              {errors.phone && <span style={{ color: '#c0392b', fontSize: '0.78rem' }}>{errors.phone}</span>}
            </Field>

            <Field label="Payment Method">
              <select style={inputStyle} value={form.payment} onChange={set('payment')}>
                <option value="card">Credit / Debit Card</option>
                <option value="cash">Cash on Delivery</option>
              </select>
            </Field>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '0.9rem', borderRadius: '10px',
                border: 'none', background: '#2f4b31', color: '#fff',
                fontWeight: 700, fontSize: '1rem',
                cursor: loading ? 'wait' : 'pointer', marginTop: '0.5rem',
              }}
            >
              {loading ? 'Placing Order…' : `Place Order · ${total.toFixed(2)} DH`}
            </button>

          </form>
        </div>

        <OrderSummaryCard items={items} />
      </section>
    </div>
  );
};

export default CheckoutPage;