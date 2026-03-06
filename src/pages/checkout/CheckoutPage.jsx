import { useState } from 'react';
import fieldsImage from '../../assets/images/home-fields.png';
import { useCart } from '../../app/providers/CartProvider';
import { navigateTo } from '../../app/navigation';
import OrderSummaryCard from './components/OrderSummaryCard';
import './CheckoutPage.css';

const CheckoutPage = () => {
  const { items, total, clearCart } = useCart();
  const [form, setForm] = useState({ fullName: '', email: '', address: '', phone: '', payment: 'card' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const pageStyle = { '--checkout-fields-image': `url(${fieldsImage})` };

  const validate = () => {
    const e = {};
    if (!form.fullName.trim()) e.fullName = 'Full name is required';
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email is required';
    if (!form.address.trim()) e.address = 'Shipping address is required';
    if (!form.phone.trim()) e.phone = 'Phone number is required';
    return e;
  };

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length > 0) { setErrors(e2); return; }
    setSubmitting(true);

    // Save order to localStorage
    const order = {
      id: `SO-${Date.now()}`,
      items,
      total,
      shipping: { fullName: form.fullName, email: form.email, address: form.address, phone: form.phone },
      payment: form.payment,
      status: 'Preparing',
      createdAt: new Date().toISOString(),
    };

    try {
      const existing = JSON.parse(localStorage.getItem('soukfalah-orders') || '[]');
      localStorage.setItem('soukfalah-orders', JSON.stringify([order, ...existing]));
    } catch {}

    clearCart();
    setTimeout(() => navigateTo('/order-success'), 400);
  };

  if (items.length === 0) {
    return (
      <div className="checkout-page" style={pageStyle}>
        <header className="checkout-hero"><h1 className="checkout-hero__title">Checkout</h1></header>
        <div style={{ padding: '3rem', textAlign: 'center', opacity: 0.6 }}>
          <p>Your cart is empty.</p>
          <a href="/marketplace" style={{ textDecoration: 'underline', marginTop: '1rem', display: 'inline-block' }}>Go shopping</a>
        </div>
      </div>
    );
  }

  const fieldStyle = { display: 'flex', flexDirection: 'column', gap: '0.3rem', marginBottom: '1rem' };
  const labelStyle = { fontSize: '0.85rem', fontWeight: 600, opacity: 0.75 };
  const inputStyle = { padding: '0.6rem 0.8rem', borderRadius: '8px', border: '1px solid var(--color-border, #ddd)', fontSize: '0.95rem', background: 'transparent', color: 'inherit' };
  const errStyle = { color: 'red', fontSize: '0.78rem' };

  return (
    <div className="checkout-page" style={pageStyle}>
      <header className="checkout-hero"><h1 className="checkout-hero__title">Checkout</h1></header>
      <section className="checkout-grid">
        <div className="shipping-form">
          <div className="shipping-form__header"><h2>Shipping Information</h2></div>
          <form className="shipping-form__body" onSubmit={handleSubmit}>
            <div style={fieldStyle}>
              <label style={labelStyle}>Full Name</label>
              <input style={inputStyle} type="text" placeholder="Enter your full name" value={form.fullName} onChange={handleChange('fullName')} />
              {errors.fullName && <span style={errStyle}>{errors.fullName}</span>}
            </div>
            <div style={fieldStyle}>
              <label style={labelStyle}>Email Address</label>
              <input style={inputStyle} type="email" placeholder="Enter your email" value={form.email} onChange={handleChange('email')} />
              {errors.email && <span style={errStyle}>{errors.email}</span>}
            </div>
            <div style={fieldStyle}>
              <label style={labelStyle}>Shipping Address</label>
              <input style={inputStyle} type="text" placeholder="Enter your shipping address" value={form.address} onChange={handleChange('address')} />
              {errors.address && <span style={errStyle}>{errors.address}</span>}
            </div>
            <div style={fieldStyle}>
              <label style={labelStyle}>Phone Number</label>
              <input style={inputStyle} type="tel" placeholder="Enter your phone number" value={form.phone} onChange={handleChange('phone')} />
              {errors.phone && <span style={errStyle}>{errors.phone}</span>}
            </div>
            <div style={fieldStyle}>
              <label style={labelStyle}>Payment Method</label>
              <select style={inputStyle} value={form.payment} onChange={handleChange('payment')}>
                <option value="card">Credit / Debit Card</option>
                <option value="cash">Cash on Delivery</option>
              </select>
            </div>
            <button
              type="submit"
              disabled={submitting}
              style={{ width: '100%', padding: '0.85rem', borderRadius: '10px', border: 'none', background: '#4caf50', color: '#fff', fontWeight: 700, fontSize: '1rem', cursor: submitting ? 'not-allowed' : 'pointer', marginTop: '0.5rem' }}
            >
              {submitting ? 'Placing Order…' : `Place Order • ${total.toFixed(2)} DH`}
            </button>
          </form>
        </div>
        <OrderSummaryCard items={items} />
      </section>
    </div>
  );
};

export default CheckoutPage;