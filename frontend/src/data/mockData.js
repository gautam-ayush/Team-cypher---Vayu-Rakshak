// ====================================================
// MOCK DATA — Realistic environmental data for UI dev
// Replace with real API calls via service layer later
// ====================================================

export const mockWeather = {
  temperature: 34,
  feelsLike: 38,
  humidity: 70,
  uvIndex: 8,
  windSpeed: 12,
  windDirection: 'NW',
  condition: 'Partly Cloudy',
  conditionIcon: '⛅',
  pressure: 1008,
  visibility: 6,
  dewPoint: 27,
  cloudCover: 45,
};

export const mockAQI = {
  aqi: 156,
  level: 'Unhealthy',
  pm25: 110,
  pm10: 145,
  o3: 42,
  no2: 38,
  so2: 12,
  co: 0.8,
  dominantPollutant: 'PM2.5',
};

export const mockTrendData = [
  { date: 'Aug 29', aqi: 74,  pm25: 42,  temp: 31, uv: 6 },
  { date: 'Aug 30', aqi: 103, pm25: 68,  temp: 33, uv: 7 },
  { date: 'Aug 31', aqi: 89,  pm25: 55,  temp: 32, uv: 5 },
  { date: 'Sep 01', aqi: 112, pm25: 78,  temp: 35, uv: 8 },
  { date: 'Sep 02', aqi: 98,  pm25: 61,  temp: 33, uv: 7 },
  { date: 'Sep 03', aqi: 134, pm25: 92,  temp: 34, uv: 9 },
  { date: 'Sep 04', aqi: 156, pm25: 110, temp: 34, uv: 8 },
];

export const mockAlertHistory = [
  {
    id: 1,
    date: 'Today',
    dateShort: 'Sep 04',
    level: 'high',
    aqi: 156,
    summary: 'AQI elevated — limit outdoor activity. PM2.5 is the primary concern.',
  },
  {
    id: 2,
    date: 'Yesterday',
    dateShort: 'Sep 03',
    level: 'high',
    aqi: 134,
    summary: 'Air quality unhealthy for sensitive groups. UV index also very high.',
  },
  {
    id: 3,
    date: '2 days ago',
    dateShort: 'Sep 02',
    level: 'moderate',
    aqi: 98,
    summary: 'Moderate pollution levels. Generally acceptable for most people.',
  },
  {
    id: 4,
    date: '3 days ago',
    dateShort: 'Sep 01',
    level: 'high',
    aqi: 112,
    summary: 'Unhealthy for sensitive groups. High temperature compounding risk.',
  },
  {
    id: 5,
    date: '4 days ago',
    dateShort: 'Aug 31',
    level: 'moderate',
    aqi: 89,
    summary: 'Moderate air quality with comfortable temperatures.',
  },
  {
    id: 6,
    date: '5 days ago',
    dateShort: 'Aug 30',
    level: 'moderate',
    aqi: 103,
    summary: 'Moderate to unhealthy AQI. Sensitive individuals should limit exposure.',
  },
  {
    id: 7,
    date: '6 days ago',
    dateShort: 'Aug 29',
    level: 'low',
    aqi: 74,
    summary: 'Satisfactory air quality. Enjoy outdoor activities normally.',
  },
];

export const mockNearbyStations = [
  { id: 1, name: 'Central Monitoring', lat: 23.259, lng: 77.412, aqi: 156 },
  { id: 2, name: 'Industrial Area', lat: 23.235, lng: 77.445, aqi: 189 },
  { id: 3, name: 'University Campus', lat: 23.282, lng: 77.395, aqi: 132 },
  { id: 4, name: 'Residential Zone', lat: 23.248, lng: 77.378, aqi: 118 },
];

export const demoProfiles = [
  {
    id: 'healthy-adult',
    label: 'Profile A',
    name: 'Healthy Adult',
    age: 'adult',
    condition: 'none',
    occupation: 'office',
    icon: '🏢',
  },
  {
    id: 'asthma-outdoor',
    label: 'Profile B',
    name: 'Asthma + Outdoor',
    age: 'adult',
    condition: 'asthma',
    occupation: 'outdoor',
    icon: '🌿',
  },
  {
    id: 'senior-heart',
    label: 'Profile C',
    name: 'Senior + Heart',
    age: 'senior',
    condition: 'heart',
    occupation: 'other',
    icon: '❤️',
  },
];

export const defaultProfile = {
  age: 'adult',
  condition: 'asthma',
  occupation: 'outdoor',
};

export const defaultLocation = {
  lat: 23.2599,
  lng: 77.4126,
  city: 'Bhopal',
  region: 'Madhya Pradesh',
  country: 'India',
};
