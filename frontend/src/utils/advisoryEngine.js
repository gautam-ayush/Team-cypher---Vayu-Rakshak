// ====================================================
// Client-side Advisory Engine
// Generates personalized plain-English advisories
// based on environmental data + user profile.
//
// In production, replace with an AI backend (GPT, Gemini, etc.)
// ====================================================

import { calculateRisk, getRiskFactors } from './risk';

/**
 * Generate a personalized advisory.
 * @param {Object} envData - { weather, aqi }
 * @param {Object} profile - { age, condition, occupation }
 * @returns {Object} - { text, risk, factors, confidence, recommendations }
 */
export function generateAdvisory(envData, profile) {
  const { weather, aqi } = envData;
  const risk = calculateRisk(aqi, weather, profile);
  const factors = getRiskFactors(aqi, weather, profile);

  const text = buildAdvisoryText(aqi, weather, profile, risk);
  const recommendations = buildRecommendations(aqi, weather, profile, risk);

  return {
    text,
    risk,
    factors,
    recommendations,
    confidence: 'Environmental conditions + health profile analysis',
    generatedAt: new Date().toISOString(),
  };
}

function buildAdvisoryText(aqi, weather, profile, risk) {
  const parts = [];

  // Opening — environment status
  if (aqi.aqi > 150) {
    parts.push(`Air pollution is currently high, with an AQI of ${aqi.aqi} and elevated ${aqi.dominantPollutant} levels at ${aqi.pm25} µg/m³.`);
  } else if (aqi.aqi > 100) {
    parts.push(`Air quality is moderate to unhealthy for sensitive groups, with an AQI of ${aqi.aqi}. ${aqi.dominantPollutant} is the primary pollutant.`);
  } else if (aqi.aqi > 50) {
    parts.push(`Air quality is moderate at AQI ${aqi.aqi}. While generally acceptable, sensitive individuals may experience mild effects.`);
  } else {
    parts.push(`Air quality is good at AQI ${aqi.aqi}. Conditions are generally favorable for outdoor activities.`);
  }

  // Personalized risk explanation
  if (profile.condition !== 'none') {
    const conditionText = {
      asthma: 'your asthma condition makes you more sensitive to airborne particulates and pollutants',
      copd: 'COPD increases your vulnerability to air pollution, especially fine particles',
      heart: 'your heart condition means pollution and heat stress pose additional cardiovascular risk',
      allergies: 'elevated pollutant levels may aggravate your allergy symptoms',
      other: 'your health condition may increase sensitivity to environmental factors',
    };
    parts.push(`Because ${conditionText[profile.condition] || conditionText.other}, ${risk.level === 'HIGH' || risk.level === 'VERY HIGH' ? 'extra precaution is advised.' : 'awareness is recommended.'}`);
  }

  if (profile.occupation === 'outdoor' || profile.occupation === 'traffic' || profile.occupation === 'delivery') {
    parts.push('Your occupation involves regular outdoor exposure, which increases your total pollutant intake compared to indoor workers.');
  }

  if (profile.age === 'senior') {
    parts.push('As a senior, your body may be less efficient at managing environmental stressors like heat and pollution.');
  } else if (profile.age === 'child') {
    parts.push('Children breathe faster relative to body size, absorbing proportionally more pollutants during outdoor activity.');
  }

  // Weather add-ons
  if (weather.uvIndex >= 8) {
    parts.push(`The UV index is very high at ${weather.uvIndex}. Sun protection is essential if spending time outdoors.`);
  }
  if (weather.temperature >= 35) {
    parts.push(`The temperature of ${weather.temperature}°C (feels like ${weather.feelsLike}°C) adds heat stress risk.`);
  }

  return parts.join(' ');
}

function buildRecommendations(aqi, weather, profile, risk) {
  const recs = [];

  if (risk.level === 'VERY HIGH') {
    recs.push('Avoid prolonged outdoor activity whenever possible');
    recs.push('Keep windows closed and use air purification if available');
    recs.push('Monitor for any symptoms and seek shade or indoor environments');
  } else if (risk.level === 'HIGH') {
    recs.push('Reduce strenuous outdoor activity during peak pollution hours');
    recs.push('Take regular breaks in cleaner-air environments');
    if (profile.condition === 'asthma' || profile.condition === 'copd') {
      recs.push('Keep rescue medication accessible');
    }
  } else if (risk.level === 'MODERATE') {
    recs.push('Generally safe for outdoor activities with moderate precaution');
    if (profile.condition !== 'none') {
      recs.push('Monitor how you feel and reduce intensity if symptoms appear');
    }
  } else {
    recs.push('Conditions are favorable — enjoy outdoor activities');
    recs.push('Stay hydrated and use sun protection as usual');
  }

  if (weather.uvIndex >= 6) {
    recs.push('Apply SPF 30+ sunscreen and wear protective clothing outdoors');
  }
  if (weather.temperature >= 35) {
    recs.push('Stay hydrated and avoid peak sun hours (11am–3pm)');
  }

  return recs;
}
