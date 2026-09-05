import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Map, Search, Navigation } from 'lucide-react';
import { getAQIColor } from '../../services/aqiApi';
import { useApp } from '../../context/AppContext';
import LocationSearch from '../LocationSearch/LocationSearch';

const presetCities = [
  { city: 'New Delhi', lat: 28.6139, lng: 77.2090, region: 'Delhi', country: 'India' },
  { city: 'Mumbai', lat: 19.0760, lng: 72.8777, region: 'Maharashtra', country: 'India' },
  { city: 'Bengaluru', lat: 12.9716, lng: 77.5946, region: 'Karnataka', country: 'India' },
  { city: 'Kolkata', lat: 22.5726, lng: 88.3639, region: 'West Bengal', country: 'India' },
  { city: 'London', lat: 51.5074, lng: -0.1278, region: 'England', country: 'UK' },
  { city: 'New York', lat: 40.7128, lng: -74.0060, region: 'New York', country: 'USA' },
];

// Custom icons
const createCustomIcon = (color) => {
  return L.divIcon({
    className: 'custom-leaflet-icon',
    html: `
      <div style="
        width: 16px;
        height: 16px;
        background-color: ${color};
        border-radius: 50%;
        border: 2px solid white;
        box-shadow: 0 0 10px ${color}80;
      "></div>
    `,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
    popupAnchor: [0, -8]
  });
};

// Pulsing "You Are Here" icon
const userIcon = L.divIcon({
  className: 'custom-leaflet-icon user-pulse-icon',
  html: `
    <div style="position: relative; width: 24px; height: 24px;">
      <div style="
        position: absolute;
        inset: 0;
        background-color: rgba(34, 211, 238, 0.3);
        border-radius: 50%;
        animation: pulseRing 2s ease-out infinite;
      "></div>
      <div style="
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 14px;
        height: 14px;
        background-color: #22d3ee;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 0 15px rgba(34, 211, 238, 0.6), 0 0 30px rgba(34, 211, 238, 0.3);
      "></div>
    </div>
    <style>
      @keyframes pulseRing {
        0% { transform: scale(1); opacity: 1; }
        100% { transform: scale(2.5); opacity: 0; }
      }
    </style>
  `,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
  popupAnchor: [0, -12]
});

// Component to handle map view updates when location changes
function MapUpdater({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, { animate: true, duration: 2 });
  }, [center, zoom, map]);
  return null;
}

/**
 * Leaflet map showing user location and nearby stations.
 * Zooms to street level on the user's precise location.
 */
export default function LocationMap({ location, nearbyStations = [] }) {
  const { setManualLocation, requestLocation } = useApp();
  const [showSearch, setShowSearch] = useState(false);

  if (!location) return null;

  const center = [location.lat, location.lng];
  const zoom = 15; // Street level for accurate location display
  const cartoApiKey = import.meta.env.VITE_CARTO_API_KEY;
  const tileUrl = cartoApiKey
    ? `https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png?key=${cartoApiKey}`
    : `https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
      className="glass p-4 sm:p-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 px-2">
        <div className="flex items-center gap-2">
          <Map className="w-4 h-4 text-atmos-cyan" />
          <div className="section-title mb-0">Your Location & Area Selector</div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-atmos-cyan/10 border border-atmos-cyan/30 text-xs text-atmos-cyan hover:bg-atmos-cyan/20 transition-all"
          >
            <Search className="w-3.5 h-3.5" />
            {showSearch ? 'Hide Search' : 'Search Other Area'}
          </button>
          <button
            onClick={requestLocation}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-xs text-atmos-text-muted hover:text-white hover:bg-white/10 transition-all"
            title="Locate Me"
          >
            <Navigation className="w-3.5 h-3.5 text-atmos-cyan" />
            Locate Me
          </button>
        </div>
      </div>

      {/* Expandable Area Search Bar & Quick City Preset Buttons */}
      {(showSearch || true) && (
        <div className="mb-4 p-3 bg-atmos-surface/40 border border-atmos-border/40 rounded-xl flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          <div className="flex-1">
            <LocationSearch onLocationSelected={() => setShowSearch(false)} />
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            <span className="text-[10px] text-atmos-text-muted uppercase tracking-wider whitespace-nowrap mr-1">Quick Areas:</span>
            {presetCities.map((c) => (
              <button
                key={c.city}
                onClick={() => setManualLocation(c)}
                className={`px-2.5 py-1 rounded-lg text-xs transition-all whitespace-nowrap ${
                  location.city === c.city
                    ? 'bg-atmos-cyan text-black font-semibold shadow-glow-cyan'
                    : 'bg-white/5 text-atmos-text-muted hover:bg-white/10 hover:text-white border border-white/5'
                }`}
              >
                {c.city}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="h-[400px] w-full rounded-xl overflow-hidden border border-atmos-border/30 relative">
        <MapContainer
          center={center}
          zoom={zoom}
          scrollWheelZoom={true}
          style={{ height: '100%', width: '100%', background: '#0a0e1a' }}
          attributionControl={false}
        >
          {/* Carto Voyager tiles authenticated with user API key */}
          <TileLayer
            url={tileUrl}
            subdomains="abcd"
            maxZoom={19}
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
          />
          
          <MapUpdater center={center} zoom={zoom} />

          {/* User Location with pulsing marker */}
          <Marker position={center} icon={userIcon}>
            <Popup>
              <div className="font-semibold text-atmos-cyan">{location.city}</div>
              <div className="text-xs text-atmos-text-muted mt-1">📍 You Are Here</div>
              <div className="text-[10px] text-atmos-text-muted mt-1">
                {location.lat.toFixed(5)}°, {location.lng.toFixed(5)}°
              </div>
            </Popup>
          </Marker>

          {/* Nearby Stations */}
          {nearbyStations.map(station => {
            const color = getAQIColor(station.aqi);
            const icon = createCustomIcon(color);
            return (
              <Marker key={station.id} position={[station.lat, station.lng]} icon={icon}>
                <Popup>
                  <div className="font-semibold">{station.name}</div>
                  <div className="flex items-center gap-2 mt-1">
                     <span className="text-xs font-medium px-1.5 rounded-md" style={{ background: `${color}20`, color }}>
                       AQI {station.aqi}
                     </span>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
    </motion.div>
  );
}
