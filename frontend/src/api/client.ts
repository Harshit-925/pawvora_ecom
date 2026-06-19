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

export const api = {
  analyze: (input: NutritionInput) =>
    post<NutritionInput, NutritionResult>('/analyze', input),
};
