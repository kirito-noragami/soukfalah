import { navigateTo } from '../../app/navigation';

const OrderSuccessPage = () => {
  let order = null;
  try {
    const orders = JSON.parse(localStorage.getItem('soukfalah-orders') || '[]');
    order = orders[0] ?? null;
  } catch {}

  return (
    <div style={{
      minHeight: '70vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '3rem 1rem', textAlign: 'center',
    }}>
      <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🌿</div>
      <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>Order Placed!</h1>

      {order && (
        <>
          <p style={{ opacity: 0.7, marginBottom: '0.25rem' }}>
            Order <strong>{order.id}</strong>
          </p>
          <p style={{ opacity: 0.7, marginBottom: '0.25rem' }}>
            {order.items.length} item{order.items.length > 1 ? 's' : ''} ·{' '}
            <strong>{Number(order.total).toFixed(2)} DH</strong>
          </p>
          <p style={{ opacity: 0.6, marginBottom: '0.25rem' }}>
            Delivering to {order.shipping?.address}
          </p>
        </>
      )}

      <p style={{ opacity: 0.55, maxWidth: '380px', margin: '0.75rem auto 2rem' }}>
        Thank you! Your order is being prepared and you'll receive a confirmation shortly.
      </p>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <button
          type="button"
          onClick={() => navigateTo('/dashboard')}
          style={{
            padding: '0.75rem 1.5rem', borderRadius: '10px',
            border: 'none', background: '#2f4b31', color: '#fff',
            fontWeight: 700, cursor: 'pointer',
          }}
        >
          View My Orders
        </button>
        <button
          type="button"
          onClick={() => navigateTo('/marketplace')}
          style={{
            padding: '0.75rem 1.5rem', borderRadius: '10px',
            border: '1px solid currentColor', background: 'transparent',
            fontWeight: 600, cursor: 'pointer',
          }}
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
};

export default OrderSuccessPage;