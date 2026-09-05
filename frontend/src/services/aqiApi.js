// ====================================================
// AQI API Service — WAQI (World Air Quality Index)
// Docs: https://aqicn.org/json-api/doc/
// ====================================================
// IMPORTANT: WAQI requires an API token.
// For production, proxy this through a backend to hide the token.
// Get a free token at: https://aqicn.org/data-platform/token/
//
// Set in .env file:
//   VITE_WAQI_TOKEN=your_token_here
// ====================================================

import { mockAQI } from '../data/mockData';

const WAQI_BASE = 'https://api.waqi.info';
const OPEN_METEO_AQI = 'https://air-quality-api.open-meteo.com/v1/air-quality';
const USE_MOCK = false;

/**
 * Fetch current AQI data for given coordinates.
 * Uses WAQI API (when VITE_WAQI_TOKEN is set) + Open-Meteo fallback for accurate AQI.
 */
export async function fetchAQI(lat, lng) {
  if (USE_MOCK) {
    await new Promise(r => setTimeout(r, 1000));
    return mockAQI;
  }

  const token = import.meta.env.VITE_WAQI_TOKEN || '';

  try {
    // Fetch both WAQI and Open-Meteo in parallel for maximum accuracy
    const [waqiRes, omRes] = await Promise.allSettled([
      fetch(`${WAQI_BASE}/feed/geo:${Number(lat).toFixed(4)};${Number(lng).toFixed(4)}/?token=${token}`).then(r => r.json()),
      fetch(`${OPEN_METEO_AQI}?latitude=${lat}&longitude=${lng}&current=us_aqi,pm2_5,pm10,ozone,nitrogen_dioxide,sulphur_dioxide,carbon_monoxide`).then(r => r.json())
    ]);

    let waqiData = waqiRes.status === 'fulfilled' && waqiRes.value?.status === 'ok' ? waqiRes.value.data : null;
    let omData = omRes.status === 'fulfilled' && omRes.value?.current ? omRes.value.current : null;

    // Determine standard US AQI and pollutant levels
    let finalAqi = 0;
    let pm25 = 0;
    let pm10 = 0;
    let o3 = 0;
    let no2 = 0;
    let so2 = 0;
    let co = 0;
    let dominantPollutant = 'PM2.5';

    if (omData && omData.us_aqi) {
      finalAqi = Math.round(omData.us_aqi);
      pm25 = Math.round(omData.pm2_5 || 0);
      pm10 = Math.round(omData.pm10 || 0);
      o3 = Math.round(omData.ozone || 0);
      no2 = Math.round(omData.nitrogen_dioxide || 0);
      so2 = Math.round(omData.sulphur_dioxide || 0);
      co = Math.round(omData.carbon_monoxide || 0);
    } else if (waqiData && typeof waqiData.aqi === 'number') {
      finalAqi = waqiData.aqi;
      const iaqi = waqiData.iaqi || {};
      pm25 = Math.round(iaqi.pm25?.v || 0);
      pm10 = Math.round(iaqi.pm10?.v || 0);
      o3 = Math.round(iaqi.o3?.v || 0);
      no2 = Math.round(iaqi.no2?.v || 0);
      so2 = Math.round(iaqi.so2?.v || 0);
      co = Math.round(iaqi.co?.v || 0);
      dominantPollutant = waqiData.dominentpol || 'PM2.5';
    } else {
      return mockAQI;
    }

    // Determine dominant pollutant if needed
    if (pm25 >= pm10 && pm25 >= o3) dominantPollutant = 'PM2.5';
    else if (pm10 >= pm25 && pm10 >= o3) dominantPollutant = 'PM10';
    else if (o3 >= pm25 && o3 >= pm10) dominantPollutant = 'Ozone';

    return {
      aqi: finalAqi,
      level: getAQILevel(finalAqi),
      pm25,
      pm10,
      o3,
      no2,
      so2,
      co,
      dominantPollutant: dominantPollutant.toUpperCase(),
    };
  } catch (err) {
    console.error('AQI API failed, using fallback mock:', err);
    return mockAQI;
  }
}

export function getAQILevel(aqi) {
  if (aqi <= 50) return 'Good';
  if (aqi <= 100) return 'Moderate';
  if (aqi <= 150) return 'Unhealthy for Sensitive Groups';
  if (aqi <= 200) return 'Unhealthy';
  if (aqi <= 300) return 'Very Unhealthy';
  return 'Hazardous';
}

export function getAQIColor(aqi) {
  if (aqi <= 50) return '#22c55e';
  if (aqi <= 100) return '#eab308';
  if (aqi <= 150) return '#f97316';
  if (aqi <= 200) return '#ef4444';
  if (aqi <= 300) return '#a855f7';
  return '#7f1d1d';
}
