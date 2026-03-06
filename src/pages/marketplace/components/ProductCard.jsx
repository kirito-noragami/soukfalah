import { useCart } from '../../../app/providers/CartProvider';
import './ProductCard.css';

const ProductCard = ({ product, index }) => {
  const { addItem, items } = useCart();
  const inCart = items.find((i) => i.id === product.id);

  const cardStyle = {
    '--card-accent': product.accent,
    '--card-delay': `${index * 0.06}s`,
  };

  const handleAdd = (e) => {
    e.preventDefault();
    addItem(product, 1);
  };

  return (
    <article className="product-card" style={cardStyle}>
      <a href={`/product/${product.id}`} className="product-card__media" style={{ display: 'block', textDecoration: 'none' }}>
        <div className="product-card__art" role="img" aria-label={product.name} />
        {product.badge ? <span className="product-card__badge">{product.badge}</span> : null}
      </a>
      <div className="product-card__body">
        <h3 className="product-card__title">{product.name}</h3>
        <div className="product-card__price">
          <span className="product-card__value">{product.price}</span>
          <span className="product-card__unit">/ {product.unit}</span>
        </div>
        <div className="product-card__meta">
          <span className="product-card__pin" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 21s7-7 7-11a7 7 0 1 0-14 0c0 4 7 11 7 11z" />
              <circle cx="12" cy="10" r="2.5" />
            </svg>
          </span>
          <span>{product.location}</span>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
          <a className="product-card__cta" href={`/product/${product.id}`} aria-label={`View ${product.name}`} style={{ flex: 1 }}>
            View
          </a>
          <button
            type="button"
            onClick={handleAdd}
            style={{
              flex: 1,
              border: 'none',
              borderRadius: '6px',
              background: inCart ? 'var(--color-success, #4caf50)' : 'var(--card-accent)',
              color: '#fff',
              cursor: 'pointer',
              fontSize: '0.8rem',
              fontWeight: 600,
              padding: '0.45rem 0.6rem',
            }}
          >
            {inCart ? `✓ In Cart` : '+ Cart'}
          </button>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;