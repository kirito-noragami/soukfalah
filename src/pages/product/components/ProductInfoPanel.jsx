import { useState } from 'react';
import farmerBadge from '../../../assets/images/logo.svg';
import { useCart } from '../../../app/providers/CartProvider';
import AddToCartButton from './AddToCartButton';
import QuantitySelector from './QuantitySelector';
import './ProductInfoPanel.css';

const ProductInfoPanel = ({ product }) => {
  const [quantity, setQuantity] = useState(1);
  const { items } = useCart();
  const inCart = items.find((i) => i.id === product.id);

  return (
    <div className="product-info">
      <div className="product-info__header">
        <h1 className="product-info__title">{product.name}</h1>
        <div className="product-info__price">
          <span className="product-info__price-value">{product.price}</span>
          <span className="product-info__price-unit">/ {product.unit}</span>
        </div>
      </div>

      <div className="product-info__meta">
        <div className="product-info__meta-row">
          <span className="product-info__meta-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 10h18l-1.5 9.5a2 2 0 0 1-2 1.5h-11a2 2 0 0 1-2-1.5L3 10z" />
              <path d="M7 10V7a5 5 0 0 1 10 0v3" />
            </svg>
          </span>
          <span className="product-info__meta-label">Available</span>
          <span className="product-info__meta-value">
            {product.available} {product.availableUnit ?? product.unit}
          </span>
        </div>
        <div className="product-info__meta-row">
          <span className="product-info__meta-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="4" y="5" width="16" height="16" rx="2" />
              <path d="M16 3v4M8 3v4M4 11h16" />
            </svg>
          </span>
          <span className="product-info__meta-label">Harvest Date</span>
          <span className="product-info__meta-value">{product.harvestDate}</span>
        </div>
        <div className="product-info__meta-row">
          <span className="product-info__meta-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 21s7-7 7-11a7 7 0 1 0-14 0c0 4 7 11 7 11z" />
              <circle cx="12" cy="10" r="2.5" />
            </svg>
          </span>
          <span className="product-info__meta-label">City</span>
          <span className="product-info__meta-value">{product.location}</span>
        </div>
      </div>

      <div className="product-info__farmer">
        <span className="product-info__avatar" aria-hidden="true">
          <img src={farmerBadge} alt="" />
        </span>
        <div>
          <div className="product-info__farmer-name">{product.farmer.name}</div>
          <div className="product-info__farmer-location">{product.farmer.location}</div>
        </div>
      </div>

      {inCart && (
        <div style={{ fontSize: '0.85rem', color: 'var(--color-success, green)', marginBottom: '0.5rem' }}>
          ✓ Already in cart ({inCart.quantity} {product.unit})
        </div>
      )}

      <div className="product-info__actions">
        <QuantitySelector min={1} max={product.available ?? 99} initial={1} onChange={setQuantity} />
        <AddToCartButton product={product} quantity={quantity} />
        <button className="product-info__favorite" type="button" aria-label="Save item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20.8 8.6c0 5-8.8 11.4-8.8 11.4S3.2 13.6 3.2 8.6a4.4 4.4 0 0 1 7.6-3.1L12 6.7l1.2-1.2a4.4 4.4 0 0 1 7.6 3.1z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ProductInfoPanel;