// ====================================================
// Risk Calculation Engine
// Determines personalized risk level based on
// environmental data + user profile
// ====================================================

/**
 * Calculate overall risk level.
 * @param {Object} aqi - AQI data object
 * @param {Object} weather - Weather data object
 * @param {Object} profile - { age, condition, occupation }
 * @returns {{ level: string, score: number, color: string }}
 */
export function calculateRisk(aqi, weather, profile) {
  let score = 0;

  // Base AQI risk (0-100 scale)
  if (aqi.aqi <= 50) score += 10;
  else if (aqi.aqi <= 100) score += 30;
  else if (aqi.aqi <= 150) score += 50;
  else if (aqi.aqi <= 200) score += 70;
  else if (aqi.aqi <= 300) score += 85;
  else score += 100;

  // UV risk modifier
  if (weather.uvIndex >= 8) score += 15;
  else if (weather.uvIndex >= 6) score += 10;
  else if (weather.uvIndex >= 3) score += 5;

  // Temperature risk modifier
  if (weather.temperature >= 40) score += 15;
  else if (weather.temperature >= 35) score += 10;
  else if (weather.temperature <= 5) score += 10;

  // Age modifier
  const ageModifiers = { child: 15, teen: 5, adult: 0, senior: 20 };
  score += ageModifiers[profile.age] || 0;

  // Health condition modifier
  const conditionModifiers = {
    none: 0, asthma: 25, copd: 30, heart: 25, allergies: 15, other: 10,
  };
  score += conditionModifiers[profile.condition] || 0;

  // Occupation modifier
  const occupationModifiers = {
    student: 5, office: 0, outdoor: 20, traffic: 25, delivery: 20, other: 5,
  };
  score += occupationModifiers[profile.occupation] || 0;

  // Clamp
  score = Math.min(100, Math.max(0, score));

  return {
    score,
    level: getRiskLevel(score),
    color: getRiskColor(score),
  };
}

export function getRiskLevel(score) {
  if (score <= 25) return 'LOW';
  if (score <= 50) return 'MODERATE';
  if (score <= 75) return 'HIGH';
  return 'VERY HIGH';
}

export function getRiskColor(score) {
  if (score <= 25) return '#22c55e';
  if (score <= 50) return '#eab308';
  if (score <= 75) return '#f97316';
  return '#ef4444';
}

/**
 * Get a list of active risk factors for "Why this alert" section.
 */
export function getRiskFactors(aqi, weather, profile) {
  const factors = [];

  if (aqi.aqi > 100)
    factors.push('AQI is elevated above healthy levels');
  if (aqi.pm25 > 55)
    factors.push('PM2.5 concentration is high');
  if (aqi.pm10 > 100)
    factors.push('PM10 concentration is elevated');
  if (weather.uvIndex >= 6)
    factors.push(`UV index is high (${weather.uvIndex})`);
  if (weather.temperature >= 35)
    factors.push(`High temperature (${weather.temperature}°C)`);
  if (weather.humidity >= 70)
    factors.push('High humidity may worsen heat stress');

  // Profile factors
  if (profile.age === 'senior')
    factors.push('Seniors are more vulnerable to environmental extremes');
  if (profile.age === 'child')
    factors.push('Children are more sensitive to air pollution');

  if (profile.condition === 'asthma')
    factors.push('Asthma increases sensitivity to air pollutants');
  if (profile.condition === 'copd')
    factors.push('COPD increases respiratory vulnerability');
  if (profile.condition === 'heart')
    factors.push('Heart conditions increase heat and pollution risk');
  if (profile.condition === 'allergies')
    factors.push('Allergies may be aggravated by air quality');

  if (profile.occupation === 'outdoor')
    factors.push('Outdoor work increases total exposure time');
  if (profile.occupation === 'traffic')
    factors.push('Traffic exposure increases pollutant inhalation');
  if (profile.occupation === 'delivery')
    factors.push('Delivery work involves prolonged outdoor exposure');

  return factors;
}
