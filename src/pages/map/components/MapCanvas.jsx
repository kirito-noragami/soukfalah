import { useEffect, useMemo } from 'react';
import L from 'leaflet';
import { MapContainer, Marker, Popup, TileLayer, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './MapCanvas.css';

const MOROCCO_CENTER = [32.35, -6.2];
const MOROCCO_ZOOM = 6;
const FOCUS_ZOOM = 9;

const createFarmIcon = (accent, isActive) => L.divIcon({
  className: 'map-canvas__marker-wrapper',
  html: `<span class="map-canvas__marker${isActive ? ' is-active' : ''}" style="--marker-accent:${accent};"></span>`,
  iconSize: [24, 24],
  iconAnchor: [12, 24],
  popupAnchor: [0, -20]
});

const MapController = ({
  selectedFarm,
  onDeselect
}) => {
  const map = useMap();
  useMapEvents({
    click: () => {
      onDeselect?.();
    }
  });
  useEffect(() => {
    if (!selectedFarm?.coordinates) {
      return;
    }
    map.flyTo([selectedFarm.coordinates.lat, selectedFarm.coordinates.lng], FOCUS_ZOOM, {
      duration: 0.8
    });
  }, [map, selectedFarm]);
  return null;
};

const MapCanvas = ({
  farms,
  selectedFarmId,
  onSelectFarm,
  onDeselect
}) => {
  const selectedFarm = useMemo(() => farms.find(farm => farm.id === selectedFarmId), [farms, selectedFarmId]);

  // Only render markers for farms that have valid coordinates
  const mappableFarms = useMemo(() => farms.filter(farm => farm.coordinates?.lat != null && farm.coordinates?.lng != null), [farms]);

  const markerIcons = useMemo(() => Object.fromEntries(mappableFarms.map(farm => [farm.id, createFarmIcon(farm.accent, farm.id === selectedFarmId)])), [mappableFarms, selectedFarmId]);

  if (!farms.length) {
    return <div className="map-canvas map-canvas--empty">
        <p>No farms match your search.</p>
      </div>;
  }

  return <div className="map-canvas">
      <MapContainer className="map-canvas__leaflet" center={MOROCCO_CENTER} zoom={MOROCCO_ZOOM} minZoom={5} maxZoom={17} scrollWheelZoom>
        <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        <MapController selectedFarm={selectedFarm} onDeselect={onDeselect} />

        {mappableFarms.map(farm => <Marker key={farm.id} position={[farm.coordinates.lat, farm.coordinates.lng]} icon={markerIcons[farm.id]} eventHandlers={{
          click: () => onSelectFarm?.(farm.id)
        }}>
            <Popup>
              <div className="map-canvas__popup">
                <strong>{farm.name}</strong>
                <p>{farm.location}</p>
                <ul>
                  {farm.products.slice(0, 3).map(product => <li key={`${farm.id}-${product.name}`}>
                      {product.name}: {product.price}/{product.unit}
                    </li>)}
                </ul>
                <a href={`/farm/${farm.id}`}>View products</a>
              </div>
            </Popup>
          </Marker>)}
      </MapContainer>
    </div>;
};

export default MapCanvas;