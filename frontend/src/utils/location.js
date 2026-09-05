// ====================================================
// Location Utilities
// Coordinate conversion, distance, and helpers
// ====================================================

/**
 * Convert lat/lng to 3D position on a sphere (for Three.js).
 * @param {number} lat - Latitude in degrees
 * @param {number} lng - Longitude in degrees
 * @param {number} radius - Sphere radius (default 1)
 * @returns {{ x: number, y: number, z: number }}
 */
export function latLngToVector3(lat, lng, radius = 1) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);

  return {
    x: -(radius * Math.sin(phi) * Math.cos(theta)),
    y: radius * Math.cos(phi),
    z: radius * Math.sin(phi) * Math.sin(theta),
  };
}

/**
 * Convert lat/lng to spherical rotation for the globe.
 * Returns the rotation needed to center the globe on this point.
 */
export function latLngToRotation(lat, lng) {
  return {
    x: lat * (Math.PI / 180),
    y: -lng * (Math.PI / 180) - Math.PI / 2,
  };
}

/**
 * Format coordinates for display.
 */
export function formatCoords(lat, lng) {
  const latDir = lat >= 0 ? 'N' : 'S';
  const lngDir = lng >= 0 ? 'E' : 'W';
  return `${Math.abs(lat).toFixed(2)}°${latDir}, ${Math.abs(lng).toFixed(2)}°${lngDir}`;
}

/**
 * Calculate distance between two points (Haversine, in km).
 */
export function haversineDistance(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
