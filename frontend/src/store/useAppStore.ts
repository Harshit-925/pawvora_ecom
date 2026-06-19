/**
 * Global state via Zustand.
 * No prop drilling — components read/write here.
 */
import { create } from 'zustand';
import type { NutritionResult } from '../types';

interface AppState {
  result: NutritionResult | null;
  isLoading: boolean;
  error: string | null;
  history: NutritionResult[];
  setResult: (result: NutritionResult) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  addToHistory: (result: NutritionResult) => void;
  reset: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  result: null,
  isLoading: false,
  error: null,
  history: [],
  setResult: (result) => set({ result, error: null }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error, isLoading: false }),
  addToHistory: (result) =>
    set((state) => ({ history: [result, ...state.history].slice(0, 10) })),
  reset: () => set({ result: null, error: null, isLoading: false }),
}));
