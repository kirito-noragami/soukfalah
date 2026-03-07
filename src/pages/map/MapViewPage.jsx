import { useEffect, useMemo, useState } from 'react';
import fieldsImage from '../../assets/images/home-fields.png';
import MapCanvas from './components/MapCanvas';
import { farms } from '../../data/farms';
import './MapViewPage.css';

const normalize = value => value.toLowerCase().trim();

const MapViewPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFarmId, setSelectedFarmId] = useState(farms[0]?.id);

  const filteredFarms = useMemo(() => {
    const query = normalize(searchQuery);
    if (!query) {
      return farms;
    }
    return farms.filter(farm => {
      const inName = normalize(farm.name).includes(query);
      const inLocation = normalize(farm.location).includes(query);
      const inProducts = farm.products.some(product => normalize(product.name).includes(query));
      return inName || inLocation || inProducts;
    });
  }, [searchQuery]);

  useEffect(() => {
    if (!filteredFarms.length) {
      if (selectedFarmId) {
        setSelectedFarmId(undefined);
      }
      return;
    }
    if (!selectedFarmId || !filteredFarms.some(farm => farm.id === selectedFarmId)) {
      setSelectedFarmId(filteredFarms[0].id);
    }
  }, [filteredFarms, selectedFarmId]);

  const selectedFarm = useMemo(() => filteredFarms.find(farm => farm.id === selectedFarmId), [filteredFarms, selectedFarmId]);

  const pageStyle = {
    '--map-fields-image': `url(${fieldsImage})`
  };

  return <div className="map-view" style={pageStyle}>
      <div className="map-view__header">
        <div>
          <p className="map-view__kicker">Nearby farms</p>
          <h1 className="map-view__title">Map View</h1>
          <p className="map-view__subtitle">
            Move, zoom, and explore real farm locations across Morocco.
          </p>
        </div>
        <a className="map-view__action" href="/marketplace">
          Back to Marketplace
        </a>
      </div>

      <div className="map-view__frame">
        <MapCanvas farms={filteredFarms} selectedFarmId={selectedFarmId} onSelectFarm={setSelectedFarmId} onDeselect={() => setSelectedFarmId(undefined)} />

        <div className="map-view__search" onClick={event => event.stopPropagation()}>
          <span className="map-view__search-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-3.5-3.5" strokeLinecap="round" />
            </svg>
          </span>
          <input type="search" value={searchQuery} onChange={event => setSearchQuery(event.target.value)} placeholder="Search city, farm, or product..." />
        </div>
      </div>

      <div className="map-view__stats">
        <span>{filteredFarms.length} farms shown</span>
        {selectedFarm ? <span>Selected: {selectedFarm.name}</span> : <span>Select a farm marker to view details.</span>}
      </div>
    </div>;
};

export default MapViewPage;
