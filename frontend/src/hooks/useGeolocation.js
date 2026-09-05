import { useState, useEffect, useCallback } from 'react';
import { reverseGeocode } from '../services/geocodingApi';

/**
 * Hook for browser geolocation with reverse geocoding.
 * Returns location state + manual set function.
 */
export function useGeolocation() {
  const [location, setLocation] = useState(null);
  const [status, setStatus] = useState('idle'); // idle | requesting | success | denied | error
  const [error, setError] = useState(null);

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setStatus('error');
      setError('Geolocation is not supported by your browser');
      return;
    }

    setStatus('requesting');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const geo = await reverseGeocode(latitude, longitude);
          setLocation({
            lat: latitude,
            lng: longitude,
            city: geo.city,
            region: geo.region,
            country: geo.country,
          });
          setStatus('success');
        } catch {
          setLocation({
            lat: latitude,
            lng: longitude,
            city: 'Your Location',
            region: '',
            country: '',
          });
          setStatus('success');
        }
      },
      (err) => {
        setStatus('denied');
        setError(err.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 60000,
      }
    );
  }, []);

  // Request on mount
  useEffect(() => {
    requestLocation();
  }, [requestLocation]);

  const setManualLocation = useCallback((loc) => {
    setLocation(loc);
    setStatus('success');
    setError(null);
  }, []);

  return { location, status, error, requestLocation, setManualLocation };
}
