import { useMemo, useState } from 'react';
import fieldsImage from '../../assets/images/home-fields.png';
import FarmerPopupCard from './components/FarmerPopupCard';
import MapCanvas from './components/MapCanvas';
import { farms } from '../../data/farms';
import './MapViewPage.css';
const MapViewPage = () => {
  const [selectedFarmId, setSelectedFarmId] = useState(farms[0]?.id);
  const selectedFarm = useMemo(() => farms.find(farm => farm.id === selectedFarmId), [selectedFarmId]);
  const pageStyle = {
    '--map-fields-image': `url(${fieldsImage})`
  };
  const popupStyle = selectedFarm ? {
    '--popup-x': `${selectedFarm.position.x}%`,
    '--popup-y': `${selectedFarm.position.y}%`
  } : undefined;
  return <div className="map-view" style={pageStyle}>
      <div className="map-view__header">
        <div>
          <p className="map-view__kicker">Nearby farms</p>
          <h1 className="map-view__title">Map View</h1>
          <p className="map-view__subtitle">
            Explore farms across Morocco and discover what is available today.
          </p>
        </div>
        <a className="map-view__action" href="/marketplace">
          Back to Marketplace
        </a>
      </div>

      <div className="map-view__frame">
        <MapCanvas farms={farms} selectedFarmId={selectedFarmId} onSelectFarm={setSelectedFarmId} onDeselect={() => setSelectedFarmId(undefined)} />

        <div className="map-view__search" onClick={event => event.stopPropagation()}>
          <span className="map-view__search-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-3.5-3.5" strokeLinecap="round" />
            </svg>
          </span>
          <input type="search" placeholder="Search farms or products..." />
        </div>

        {selectedFarm ? <FarmerPopupCard farm={selectedFarm} onClose={() => setSelectedFarmId(undefined)} style={popupStyle} /> : null}
      </div>
    </div>;
};
export default MapViewPage;