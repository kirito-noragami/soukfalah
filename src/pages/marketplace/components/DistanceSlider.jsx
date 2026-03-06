import { useState } from 'react';
import './DistanceSlider.css';
const DistanceSlider = ({
  min = 0,
  max = 100,
  step = 5,
  initial = 30
}) => {
  const [distance, setDistance] = useState(initial);
  return <div className="distance-slider">
      <div className="distance-slider__header">
        <span className="distance-slider__label">Distance</span>
        <span className="distance-slider__value">{distance} km</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={distance} onChange={event => setDistance(Number(event.target.value))} />
      <div className="distance-slider__range">
        <span>{min} km</span>
        <span>{max} km</span>
      </div>
    </div>;
};
export default DistanceSlider;