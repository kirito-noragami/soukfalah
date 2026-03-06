import { navigateTo } from '../../app/navigation';

const OrderSuccessPage = () => {
  let lastOrder = null;
  try {
    const orders = JSON.parse(localStorage.getItem('soukfalah-orders') || '[]');
    lastOrder = orders[0] ?? null;
  } catch {}

  return (
    <div style={{ minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3rem 1rem', textAlign: 'center' }}>
      <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🌿</div>
      <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>Order Placed!</h1>
      {lastOrder && (
        <p style={{ opacity: 0.7, marginBottom: '0.5rem' }}>
          Order <strong>{lastOrder.id}</strong> • {lastOrder.items.length} item{lastOrder.items.length > 1 ? 's' : ''} • <strong>{lastOrder.total.toFixed(2)} DH</strong>
        </p>
      )}
      <p style={{ opacity: 0.6, maxWidth: '380px', marginBottom: '2rem' }}>
        Thank you! Your order is being prepared. You can track it in your dashboard.
      </p>
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <button
          type="button"
          onClick={() => navigateTo('/dashboard')}
          style={{ padding: '0.75rem 1.5rem', borderRadius: '10px', border: 'none', background: '#4caf50', color: '#fff', fontWeight: 700, cursor: 'pointer' }}
        >
          View My Orders
        </button>
        <button
          type="button"
          onClick={() => navigateTo('/marketplace')}
          style={{ padding: '0.75rem 1.5rem', borderRadius: '10px', border: '1px solid currentColor', background: 'transparent', fontWeight: 600, cursor: 'pointer' }}
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
};

export default OrderSuccessPage;