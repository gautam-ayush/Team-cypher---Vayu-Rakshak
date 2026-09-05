import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Loader2, Navigation } from 'lucide-react';
import { searchCities } from '../../services/geocodingApi';
import { useApp } from '../../context/AppContext';

/**
 * Fallback location search if geolocation is denied or fails.
 */
export default function LocationSearch({ onLocationSelected }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const { setManualLocation, requestLocation, geoStatus } = useApp();
  const searchTimeout = useRef(null);

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }

    setLoading(true);
    if (searchTimeout.current) clearTimeout(searchTimeout.current);

    searchTimeout.current = setTimeout(async () => {
      const data = await searchCities(query);
      setResults(data);
      setLoading(false);
    }, 500);

    return () => clearTimeout(searchTimeout.current);
  }, [query]);

  const handleSelect = (city) => {
    setManualLocation({
      lat: city.lat,
      lng: city.lng,
      city: city.name,
      region: city.region,
      country: city.country,
    });
    setQuery('');
    setResults([]);
    setIsFocused(false);
    if (onLocationSelected) onLocationSelected();
  };

  return (
    <div className="w-full max-w-md relative z-50">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-atmos-text-muted" />
        </div>
        <input
          type="text"
          className="input-dark w-full pl-11 pr-12 shadow-2xl"
          placeholder="Search city to check environment..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          // onBlur delayed to allow click on results
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
        />
        
        {/* Current Location Button */}
        <div className="absolute inset-y-0 right-0 pr-2 flex items-center">
          <button
             onClick={requestLocation}
             className="p-1.5 rounded-lg hover:bg-white/10 transition-colors group"
             title="Use Current Location"
          >
            {geoStatus === 'requesting' ? (
              <Loader2 className="h-4 w-4 text-atmos-cyan animate-spin" />
            ) : (
              <Navigation className="h-4 w-4 text-atmos-text-muted group-hover:text-atmos-cyan" />
            )}
          </button>
        </div>
      </div>

      {/* Autocomplete Dropdown */}
      <AnimatePresence>
        {isFocused && (query.length > 0 || results.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 bg-atmos-surface/95 backdrop-blur-xl border border-atmos-border rounded-xl shadow-2xl overflow-hidden"
          >
            {loading && results.length === 0 ? (
              <div className="p-4 flex items-center justify-center gap-2 text-atmos-text-muted text-sm">
                <Loader2 className="w-4 h-4 animate-spin" />
                Searching...
              </div>
            ) : results.length > 0 ? (
              <ul className="max-h-60 overflow-y-auto">
                {results.map((result) => (
                  <li key={result.id}>
                    <button
                      className="w-full text-left px-4 py-3 hover:bg-white/5 transition-colors flex items-start gap-3 border-b border-atmos-border/50 last:border-0"
                      onClick={() => handleSelect(result)}
                    >
                      <MapPin className="w-4 h-4 text-atmos-cyan mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="text-sm font-medium text-white">{result.name}</div>
                        <div className="text-xs text-atmos-text-muted">
                          {result.region ? `${result.region}, ` : ''}{result.country}
                        </div>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            ) : query.length >= 2 ? (
              <div className="p-4 text-center text-atmos-text-muted text-sm">
                No cities found
              </div>
            ) : null}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
