// ====================================================
// Advisory API Service
// Currently uses client-side advisory engine.
// Can be replaced with an AI backend (e.g. OpenAI, Gemini).
// ====================================================

import { generateAdvisory } from '../utils/advisoryEngine';

/**
 * Get personalized advisory based on environment + profile.
 * @param {Object} envData - { weather, aqi }
 * @param {Object} profile - { age, condition, occupation }
 * @returns {Object} - { text, risk, factors, confidence }
 */
export async function fetchAdvisory(envData, profile) {
  // Simulate AI processing delay
  await new Promise(r => setTimeout(r, 500));

  // Use client-side engine for now
  // In production, replace with:
  // const res = await fetch('/api/advisory', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ envData, profile }),
  // });
  // return res.json();

  return generateAdvisory(envData, profile);
}
