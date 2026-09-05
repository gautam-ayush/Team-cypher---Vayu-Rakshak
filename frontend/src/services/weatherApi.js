// ====================================================
// Weather API Service — Open-Meteo
// Free, no API key required
// Docs: https://open-meteo.com/en/docs
// ====================================================

import { mockWeather, mockTrendData } from '../data/mockData';

const BASE_URL = 'https://api.open-meteo.com/v1/forecast';

/**
 * Fetch current weather data for given coordinates.
 * Currently returns mock data. Toggle USE_MOCK to false to use real API.
 */
const USE_MOCK = false;

export async function fetchWeather(lat, lng) {
  if (USE_MOCK) {
    // Simulate network delay
    await new Promise(r => setTimeout(r, 800));
    return mockWeather;
  }

  try {
    const params = new URLSearchParams({
      latitude: lat,
      longitude: lng,
      daily: 'uv_index_max',
      hourly: 'temperature_2m,relative_humidity_2m,apparent_temperature,precipitation_probability,weather_code,wind_speed_10m,wind_direction_10m',
      current_weather: true,
      timezone: 'auto',
    });

    const res = await fetch(`${BASE_URL}?${params}`);
    if (!res.ok) throw new Error(`Weather API error: ${res.status}`);
    const data = await res.json();

    const curr = data.current_weather || {};
    const hourly = data.hourly || {};
    const daily = data.daily || {};

    const uvIndex = daily.uv_index_max?.[0] !== undefined 
      ? Math.round(daily.uv_index_max[0]) 
      : 5;

    return {
      temperature: Math.round(curr.temperature ?? hourly.temperature_2m?.[0] ?? 25),
      feelsLike: Math.round(hourly.apparent_temperature?.[0] ?? curr.temperature ?? 25),
      humidity: hourly.relative_humidity_2m?.[0] ?? 50,
      uvIndex: uvIndex,
      windSpeed: Math.round(curr.windspeed ?? hourly.wind_speed_10m?.[0] ?? 10),
      windDirection: curr.winddirection ?? hourly.wind_direction_10m?.[0] ?? 0,
      precipitationProbability: hourly.precipitation_probability?.[0] ?? 0,
      condition: mapWeatherCode(curr.weathercode ?? hourly.weather_code?.[0] ?? 0),
    };
  } catch (err) {
    console.error('Weather API failed, using mock data:', err);
    return mockWeather;
  }
}

/**
 * Fetch 7-day trend data including real-time AQI, PM2.5, and Temperature.
 */
export async function fetchWeatherTrend(lat, lng) {
  if (USE_MOCK) {
    await new Promise(r => setTimeout(r, 600));
    return mockTrendData;
  }

  try {
    const [aqRes, weatherRes] = await Promise.allSettled([
      fetch(`https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lng}&hourly=us_aqi,pm2_5&past_days=7`).then(r => r.json()),
      fetch(`${BASE_URL}?latitude=${lat}&longitude=${lng}&daily=temperature_2m_max,uv_index_max&past_days=7&timezone=auto`).then(r => r.json())
    ]);

    const aqData = aqRes.status === 'fulfilled' ? aqRes.value : null;
    const wData = weatherRes.status === 'fulfilled' ? weatherRes.value : null;

    if (aqData?.hourly?.time) {
      const dailyMap = {};
      aqData.hourly.time.forEach((tStr, idx) => {
        const day = tStr.split('T')[0];
        if (!dailyMap[day]) dailyMap[day] = { aqiVals: [], pm25Vals: [] };
        if (aqData.hourly.us_aqi?.[idx] != null) dailyMap[day].aqiVals.push(aqData.hourly.us_aqi[idx]);
        if (aqData.hourly.pm2_5?.[idx] != null) dailyMap[day].pm25Vals.push(aqData.hourly.pm2_5[idx]);
      });

      const days = Object.keys(dailyMap).slice(0, 7);
      return days.map((day, i) => {
        const aqiArr = dailyMap[day].aqiVals;
        const pmArr = dailyMap[day].pm25Vals;
        const avgAqi = aqiArr.length ? Math.round(aqiArr.reduce((a, b) => a + b, 0) / aqiArr.length) : 100;
        const avgPm25 = pmArr.length ? Math.round(pmArr.reduce((a, b) => a + b, 0) / pmArr.length) : 45;
        const temp = wData?.daily?.temperature_2m_max?.[i] ? Math.round(wData.daily.temperature_2m_max[i]) : 30;

        return {
          date: new Date(day).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          aqi: avgAqi,
          pm25: avgPm25,
          temp: temp,
        };
      });
    }

    if (wData?.daily?.time) {
      return wData.daily.time.slice(0, 7).map((date, i) => ({
        date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        aqi: Math.round(75 + Math.sin(i) * 30),
        pm25: Math.round(35 + Math.sin(i) * 15),
        temp: Math.round(wData.daily.temperature_2m_max[i]),
      }));
    }

    return mockTrendData;
  } catch (err) {
    console.error('Weather trend API failed, using fallback trend:', err);
    return mockTrendData;
  }
}

function mapWeatherCode(code) {
  const codes = {
    0: 'Clear Sky', 1: 'Mostly Clear', 2: 'Partly Cloudy', 3: 'Overcast',
    45: 'Fog', 48: 'Rime Fog', 51: 'Light Drizzle', 53: 'Drizzle',
    55: 'Heavy Drizzle', 61: 'Light Rain', 63: 'Rain', 65: 'Heavy Rain',
    71: 'Light Snow', 73: 'Snow', 75: 'Heavy Snow', 80: 'Rain Showers',
    95: 'Thunderstorm',
  };
  return codes[code] || 'Partly Cloudy';
}
