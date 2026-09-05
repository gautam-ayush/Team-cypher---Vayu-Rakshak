import { useState, useEffect } from 'react';
import { fetchWeather, fetchWeatherTrend } from '../services/weatherApi';

/**
 * Hook to fetch weather data for given coordinates.
 */
export function useWeather(lat, lng) {
  const [weather, setWeather] = useState(null);
  const [trend, setTrend] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (lat == null || lng == null) return;

    let cancelled = false;
    setLoading(true);
    setError(null);

    Promise.all([
      fetchWeather(lat, lng),
      fetchWeatherTrend(lat, lng),
    ])
      .then(([weatherData, trendData]) => {
        if (!cancelled) {
          setWeather(weatherData);
          setTrend(trendData);
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [lat, lng]);

  return { weather, trend, loading, error };
}
