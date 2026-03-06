import { useState } from 'react';
import './PriceRangeSlider.css';
const PriceRangeSlider = ({
  min = 0,
  max = 50,
  step = 1,
  initial = 35
}) => {
  const [price, setPrice] = useState(initial);
  return <div className="price-range">
      <div className="price-range__header">
        <span className="price-range__label">Price Range</span>
        <span className="price-range__value">Up to {price} DH</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={price} onChange={event => setPrice(Number(event.target.value))} />
      <div className="price-range__range">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>;
};
export default PriceRangeSlider;