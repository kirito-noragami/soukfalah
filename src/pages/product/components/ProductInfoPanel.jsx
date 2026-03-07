import { useState } from 'react';
import farmerBadge from '../../../assets/images/logo.svg';
import { useCart } from '../../../app/providers/CartProvider';
import AddToCartButton from './AddToCartButton';
import QuantitySelector from './QuantitySelector';
import './ProductInfoPanel.css';

const ProductInfoPanel = ({ product }) => {
  const [quantity, setQuantity] = useState(1);
  const { items } = useCart();   // SAFE
  const inCart = items.find(i => i.id === product.id);

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
          <span className="product-info__meta-label">Available</span>
          <span className="product-info__meta-value">{product.available} {product.unit}</span>
        </div>
        <div className="product-info__meta-row">
          <span className="product-info__meta-label">Harvest Date</span>
          <span className="product-info__meta-value">{product.harvestDate}</span>
        </div>
        <div className="product-info__meta-row">
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
        <p style={{ fontSize: '0.85rem', color: '#4caf50', marginBottom: '0.5rem' }}>
          ✓ Already in cart ({inCart.quantity} {product.unit})
        </p>
      )}

      <div className="product-info__actions">
        <QuantitySelector
          min={1}
          max={product.available ?? 99}
          initial={1}
          onChange={setQuantity}
        />
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