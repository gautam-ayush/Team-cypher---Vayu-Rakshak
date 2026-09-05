import { useState, useEffect } from 'react';
import { fetchAQI } from '../services/aqiApi';

/**
 * Hook to fetch AQI data for given coordinates.
 */
export function useAQI(lat, lng) {
  const [aqi, setAqi] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (lat == null || lng == null) return;

    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchAQI(lat, lng)
      .then((data) => {
        if (!cancelled) setAqi(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [lat, lng]);

  return { aqi, loading, error };
}
