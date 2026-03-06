import FarmerPin from './FarmerPin';
import './MapCanvas.css';
const MapCanvas = ({
  farms,
  selectedFarmId,
  onSelectFarm,
  onDeselect
}) => {
  return <div className="map-canvas" onClick={onDeselect}>
      <div className="map-canvas__texture" aria-hidden="true" />
      <svg className="map-canvas__shape" viewBox="0 0 600 420" aria-hidden="true">
        <defs>
          <linearGradient id="map-land" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#dfe9d1" />
            <stop offset="50%" stopColor="#c9dcb5" />
            <stop offset="100%" stopColor="#b6c99f" />
          </linearGradient>
        </defs>
        <path d="M140 70L210 40L300 42L380 62L460 100L520 150L535 210L505 260L455 300L380 338L300 356L230 340L185 312L155 275L130 230L118 175L125 120Z" fill="url(#map-land)" stroke="#9fb08d" strokeWidth="3" />
        <path d="M180 120L240 110L300 120L340 145L360 175L330 200L280 208L220 190L190 165Z" fill="none" stroke="#b1c2a0" strokeWidth="2" strokeDasharray="6 6" opacity="0.6" />
        <path d="M220 260L280 250L340 260L390 285L420 315" fill="none" stroke="#a6b895" strokeWidth="2" opacity="0.4" />
        <text x="300" y="210" textAnchor="middle" className="map-canvas__label">
          Morocco
        </text>
      </svg>

      {farms.map(farm => <FarmerPin key={farm.id} farm={farm} isActive={farm.id === selectedFarmId} onClick={onSelectFarm} />)}

      <div className="map-canvas__ocean" aria-hidden="true">
        Atlantic Ocean
      </div>
    </div>;
};
export default MapCanvas;