/**
 * Typed API client — all fetch calls go through here.
 * Never use raw fetch() in components.
 */
import type { NutritionInput, NutritionResult } from '../types';

const BASE_URL = import.meta.env.VITE_API_URL ?? '/api';

async function post<TIn, TOut>(path: string, body: TIn): Promise<TOut> {
  const response = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Unknown error' }));
    throw new Error(error.detail ?? `HTTP ${response.status}`);
  }

  return response.json() as Promise<TOut>;
}

function getClientFallback(input: NutritionInput): NutritionResult {
  const breed = input.pet_breed || "your pet";
  const weight = input.pet_weight_kg || 10.0;
  const rer = 70 * Math.pow(weight, 0.75);
  const calories = Math.round(rer * 1.6 * 100) / 100;
  
  return {
    session_id: input.session_id,
    timestamp: new Date().toISOString(),
    recommended_calories: calories,
    ai_insights: [
      `Based on the profile for ${breed}, ensure a diet rich in high-quality animal proteins to support muscle maintenance.`,
      `Given the weight of ${weight}kg, precise portion control is key. Monitor treats carefully as they add up quickly.`,
      "Fresh, biologically appropriate food can improve digestion and coat health noticeably within a few weeks.",
    ],
    fallback_used: true,
  };
}

export const api = {
  analyze: async (input: NutritionInput): Promise<NutritionResult> => {
    try {
      if (typeof window !== 'undefined' && window.location.hostname.endsWith('github.io') && !import.meta.env.VITE_API_URL) {
        return getClientFallback(input);
      }
      return await post<NutritionInput, NutritionResult>('/analyze', input);
    } catch (err) {
      if (err instanceof TypeError) {
        console.warn("Backend API not reachable. Using client-side fallback engine:", err);
        return getClientFallback(input);
      }
      throw err;
    }
  },
};
