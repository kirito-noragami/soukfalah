import { useState } from 'react';
import './QuantitySelector.css';

const QuantitySelector = ({ min = 1, max = 99, initial = 1, onChange }) => {
  const [quantity, setQuantity] = useState(initial);

  const update = (next) => {
    const clamped = Math.max(min, Math.min(max, next));
    setQuantity(clamped);
    onChange?.(clamped);
  };

  return (
    <div className="quantity-selector" aria-label="Quantity selector">
      <button className="quantity-selector__button" type="button" onClick={() => update(quantity - 1)} aria-label="Decrease quantity">-</button>
      <span className="quantity-selector__value">{quantity}</span>
      <button className="quantity-selector__button" type="button" onClick={() => update(quantity + 1)} aria-label="Increase quantity">+</button>
    </div>
  );
};

export default QuantitySelector;