// ====================================================
// Geocoding API Service — Open-Meteo Geocoding
// Free, no API key required
// Docs: https://open-meteo.com/en/docs/geocoding-api
// ====================================================

const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const REVERSE_URL = 'https://nominatim.openstreetmap.org/reverse';

/**
 * Search for cities by name. Returns array of results.
 */
export async function searchCities(query) {
  if (!query || query.length < 2) return [];

  try {
    const params = new URLSearchParams({
      name: query,
      count: 8,
      language: 'en',
      format: 'json',
    });

    const res = await fetch(`${GEOCODING_URL}?${params}`);
    if (!res.ok) throw new Error(`Geocoding error: ${res.status}`);
    const data = await res.json();

    return (data.results || []).map(r => ({
      id: r.id,
      name: r.name,
      region: r.admin1 || '',
      country: r.country,
      lat: r.latitude,
      lng: r.longitude,
      label: `${r.name}${r.admin1 ? ', ' + r.admin1 : ''}, ${r.country}`,
    }));
  } catch (err) {
    console.error('City search failed:', err);
    return [];
  }
}

/**
 * Reverse geocode lat/lng to city name.
 * Uses OpenStreetMap Nominatim (free, rate-limited to 1 req/sec).
 */
export async function reverseGeocode(lat, lng) {
  try {
    const params = new URLSearchParams({
      lat,
      lon: lng,
      format: 'json',
      zoom: 10,
    });

    const res = await fetch(`${REVERSE_URL}?${params}`, {
      headers: { 'Accept-Language': 'en' },
    });
    if (!res.ok) throw new Error(`Reverse geocode error: ${res.status}`);
    const data = await res.json();

    const city = data.address?.city ||
                 data.address?.town ||
                 data.address?.village ||
                 data.address?.county || 'Unknown';
    const region = data.address?.state || '';
    const country = data.address?.country || '';

    return { city, region, country };
  } catch (err) {
    console.error('Reverse geocode failed:', err);
    return { city: 'Unknown Location', region: '', country: '' };
  }
}
