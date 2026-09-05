// ====================================================
// Gemini AI Chat Service for Vayu Rakshak
// ====================================================

const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent';

/**
 * Send user message to Gemini API with context.
 * @param {Array} history - Array of { role: 'user'|'model', text: string }
 * @param {Object} context - { location, aqi, weather, profile }
 * @returns {Promise<string>}
 */
export async function sendChatMessage(history, context) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error('Gemini API key is not configured. Please set VITE_GEMINI_API_KEY in your .env file.');
  }

  // System instruction with user context
  const systemPrompt = `You are Vayu Rakshak AI, an expert, compassionate environmental health and air quality assistant for the "Vayu Rakshak" personal intelligence platform.

CURRENT USER CONTEXT:
- Location: ${context?.location?.city || 'Unknown'}, ${context?.location?.region || ''} ${context?.location?.country || ''}
- Current AQI: ${context?.aqi?.aqi ?? 'Unknown'} (${context?.aqi?.level || 'N/A'}), Dominant Pollutant: ${context?.aqi?.dominantPollutant || 'PM2.5'}
- PM2.5 Level: ${context?.aqi?.pm25 ?? 'N/A'} µg/m³
- Temperature: ${context?.weather?.temperature ?? 'N/A'}°C (Feels like ${context?.weather?.feelsLike ?? 'N/A'}°C)
- Humidity: ${context?.weather?.humidity ?? 'N/A'}%, UV Index: ${context?.weather?.uvIndex ?? 'N/A'}, Rain Chance: ${context?.weather?.precipitationProbability ?? '0'}%
- User Profile: Age Group = ${context?.profile?.age || 'Adult'}, Health Condition = ${context?.profile?.condition || 'None'}, Occupation = ${context?.profile?.occupation || 'Office'}

INSTRUCTIONS:
1. Provide accurate, empathetic, and actionable health guidance grounded in real environmental science and the user's specific profile and location context.
2. Keep responses clean, concise (2 to 4 bullet points or short paragraphs), and easy to read on mobile.
3. If risk level or AQI is high, emphasize necessary safety precautions (e.g. N95 masks, air purifiers, outdoor exercise timing, rescue inhalers if asthmatic).
4. Maintain a warm, protective tone.
`;

  // Format messages into Gemini REST API format
  const contents = [
    {
      role: 'user',
      parts: [{ text: systemPrompt }]
    },
    {
      role: 'model',
      parts: [{ text: 'Understood. I am Vayu Rakshak AI, ready to assist you with tailored environmental health advice based on your location and health profile.' }]
    },
    ...history.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }))
  ];

  try {
    const res = await fetch(`${GEMINI_API_BASE}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents }),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error?.message || `Gemini API error: ${res.status}`);
    }

    const data = await res.json();
    const candidate = data.candidates?.[0];
    const replyText = candidate?.content?.parts?.[0]?.text;

    if (!replyText) {
      throw new Error('No response text returned from Gemini API.');
    }

    return replyText;
  } catch (err) {
    console.error('Gemini Chat API Error:', err);
    throw err;
  }
}
