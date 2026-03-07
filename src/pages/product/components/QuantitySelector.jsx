import { useState } from 'react';
import './QuantitySelector.css';

const QuantitySelector = ({ min = 1, max = 99, initial = 1, onChange }) => {
  const [qty, setQty] = useState(initial);

  const update = (n) => {
    const v = Math.max(min, Math.min(max, n));
    setQty(v);
    onChange?.(v);
  };

  return (
    <div className="quantity-selector" aria-label="Quantity">
      <button
        className="quantity-selector__button"
        type="button"
        onClick={() => update(qty - 1)}
        disabled={qty <= min}
        aria-label="Decrease quantity"
      >
        −
      </button>
      <span className="quantity-selector__value">{qty}</span>
      <button
        className="quantity-selector__button"
        type="button"
        onClick={() => update(qty + 1)}
        disabled={qty >= max}
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  );
};

export default QuantitySelector;