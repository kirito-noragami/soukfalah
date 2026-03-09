/**
 * MapViewPage — loads all farms from Supabase and shows them on the Leaflet map.
 * Farms without PostGIS coordinates fall back to a city lookup table.
 */
import { useEffect, useMemo, useState } from 'react';
import fieldsImage from '../../assets/images/home-fields.png';
import MapCanvas   from './components/MapCanvas';
import { supabase } from '../../services/supabase';
import './MapViewPage.css';

/* Fallback coordinates for Moroccan cities (lng, lat) */
const CITY_COORDS = {
  tangier:      { lat: 35.7595, lng: -5.8340 },
  tetouan:      { lat: 35.5785, lng: -5.3680 },
  chefchaouen:  { lat: 35.1688, lng: -5.2694 },
  rabat:        { lat: 34.0209, lng: -6.8416 },
  casablanca:   { lat: 33.5731, lng: -7.5898 },
  fes:          { lat: 34.0181, lng: -5.0078 },
  meknes:       { lat: 33.8935, lng: -5.5473 },
  marrakech:    { lat: 31.6295, lng: -7.9811 },
  agadir:       { lat: 30.4278, lng: -9.5981 },
  oujda:        { lat: 34.6814, lng: -1.9086 },
  midelt:       { lat: 32.6812, lng: -4.7340 },
  errachidia:   { lat: 31.9314, lng: -4.4247 },
  taza:         { lat: 34.2133, lng: -4.0150 },
  beni:         { lat: 35.1500, lng: -3.6000 },
};

const getCityCoords = (city) => {
  if (!city) return null;
  const key = city.toLowerCase().trim();
  return CITY_COORDS[key] ?? null;
};

const normalizeFarm = (farm) => {
  /* Try PostGIS POINT string first */
  let coordinates = null;
  if (farm.location) {
    const m = String(farm.location).match(/POINT\(([^ ]+) ([^ )]+)\)/);
    if (m) coordinates = { lng: parseFloat(m[1]), lat: parseFloat(m[2]) };
  }
  /* Fall back to city lookup */
  if (!coordinates) coordinates = getCityCoords(farm.city);

  const products = (farm.products || [])
    .filter(p => p.status === 'active')
    .map(p => ({
      id:       p.id,
      name:     p.name,
      price_dh: p.price_dh,
      price:    p.price_dh,
      unit:     p.unit,
      accent:   p.accent,
    }));

  return {
    id:          farm.id,
    name:        farm.name,
    city:        farm.city,
    location:    farm.city,
    accent:      farm.accent || '#6f9c6b',
    description: farm.description,
    coordinates,
    products,
    owner_id:    farm.owner_id,
    farmer: farm.profiles
      ? { name: farm.profiles.full_name, avatar: farm.profiles.avatar_url }
      : null,
  };
};

const normalize = (v) => (v || '').toLowerCase().trim();

const MapViewPage = () => {
  const [farms,          setFarms]          = useState([]);
  const [loading,        setLoading]        = useState(true);
  const [searchQuery,    setSearchQuery]    = useState('');
  const [selectedFarmId, setSelectedFarmId] = useState(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('farms')
        .select(`
          id, name, city, location, accent, description, owner_id,
          profiles(full_name, avatar_url),
          products(id, name, price_dh, unit, accent, status)
        `)
        .order('created_at', { ascending: false });

      if (!error && data) {
        const normalized = data.map(normalizeFarm);
        setFarms(normalized);
        const first = normalized.find(f => f.coordinates);
        if (first) setSelectedFarmId(first.id);
      }
      setLoading(false);
    };
    load();
  }, []);

  const filteredFarms = useMemo(() => {
    const q = normalize(searchQuery);
    if (!q) return farms;
    return farms.filter(f =>
      normalize(f.name).includes(q) ||
      normalize(f.city).includes(q) ||
      f.products.some(p => normalize(p.name).includes(q))
    );
  }, [farms, searchQuery]);

  useEffect(() => {
    if (!filteredFarms.length) { setSelectedFarmId(null); return; }
    if (!filteredFarms.some(f => f.id === selectedFarmId)) {
      const first = filteredFarms.find(f => f.coordinates);
      setSelectedFarmId(first?.id ?? null);
    }
  }, [filteredFarms, selectedFarmId]);

  const selectedFarm = filteredFarms.find(f => f.id === selectedFarmId);
  const pageStyle    = { '--map-fields-image': `url(${fieldsImage})` };

  return (
    <div className="map-view" style={pageStyle}>
      <div className="map-view__header">
        <div>
          <p className="map-view__kicker">Nearby farms</p>
          <h1 className="map-view__title">Map View</h1>
          <p className="map-view__subtitle">
            Move, zoom, and explore real farm locations across Morocco.
          </p>
        </div>
        <a className="map-view__action" href="/marketplace">Back to Marketplace</a>
      </div>

      <div className="map-view__frame">
        {loading ? (
          <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:400, opacity:0.5 }}>
            Loading farms…
          </div>
        ) : (
          <MapCanvas
            farms={filteredFarms}
            selectedFarmId={selectedFarmId}
            onSelectFarm={setSelectedFarmId}
            onDeselect={() => setSelectedFarmId(null)}
          />
        )}

        <div className="map-view__search" onClick={e => e.stopPropagation()}>
          <span className="map-view__search-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-3.5-3.5" strokeLinecap="round" />
            </svg>
          </span>
          <input
            type="search"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search city, farm, or product…"
          />
        </div>
      </div>

      <div className="map-view__stats">
        <span>{filteredFarms.length} farm{filteredFarms.length !== 1 ? 's' : ''} shown</span>
        {selectedFarm
          ? <span>Selected: {selectedFarm.name}</span>
          : <span>Click a pin to view farm details.</span>}
      </div>
    </div>
  );
};

export default MapViewPage;