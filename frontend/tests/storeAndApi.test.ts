import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useStore } from '../src/store/useAppStore';
import { api } from '../src/api/client';
import type { Product, NutritionResult } from '../src/types';

const dummyProduct: Product = {
  id: 'p1',
  name: 'Premium Dog Food',
  brand: 'PawVora',
  price: 12.5,
  rating: 4.8,
  reviewCount: 10,
  petCategory: 'dogs',
  productCategory: 'food',
  image: 'dog-food.jpg',
  badges: ['Organic'],
  description: 'Healthy and organic dog food.',
};

describe('useAppStore and useStore actions', () => {
  beforeEach(() => {
    // Reset Zustand store state before each test
    useStore.setState({
      cartItems: [],
      isCartOpen: false,
      activeCategory: 'all',
      nutritionResult: null,
      isNutritionLoading: false,
      nutritionError: null,
      result: null,
      isLoading: false,
      error: null,
      history: [],
    });
  });

  it('toggles cart', () => {
    expect(useStore.getState().isCartOpen).toBe(false);
    useStore.getState().toggleCart();
    expect(useStore.getState().isCartOpen).toBe(true);
    useStore.getState().toggleCart();
    expect(useStore.getState().isCartOpen).toBe(false);
  });

  it('manages cart items', () => {
    const store = useStore.getState();
    expect(store.cartCount()).toBe(0);
    expect(store.cartTotal()).toBe(0);

    // Add product
    store.addToCart(dummyProduct);
    expect(useStore.getState().cartItems).toHaveLength(1);
    expect(useStore.getState().cartItems[0].quantity).toBe(1);
    expect(useStore.getState().cartCount()).toBe(1);
    expect(useStore.getState().cartTotal()).toBe(12.5);

    // Add product again (increase quantity)
    useStore.getState().addToCart(dummyProduct);
    expect(useStore.getState().cartItems[0].quantity).toBe(2);
    expect(useStore.getState().cartCount()).toBe(2);
    expect(useStore.getState().cartTotal()).toBe(25.0);

    // Update quantity
    useStore.getState().updateQuantity('p1', 5);
    expect(useStore.getState().cartItems[0].quantity).toBe(5);
    expect(useStore.getState().cartCount()).toBe(5);

    // Update quantity to 0 removes the item
    useStore.getState().updateQuantity('p1', 0);
    expect(useStore.getState().cartItems).toHaveLength(0);

    // Add again and remove
    useStore.getState().addToCart(dummyProduct);
    expect(useStore.getState().cartItems).toHaveLength(1);
    useStore.getState().removeFromCart('p1');
    expect(useStore.getState().cartItems).toHaveLength(0);
  });

  it('updates active category', () => {
    expect(useStore.getState().activeCategory).toBe('all');
    useStore.getState().setActiveCategory('dogs');
    expect(useStore.getState().activeCategory).toBe('dogs');
  });

  it('manages nutrition result state', () => {
    const dummyResult: NutritionResult = {
      session_id: 'session-123',
      timestamp: '2026-06-19T00:00:00Z',
      recommended_calories: 1400,
      ai_insights: ['Insight A', 'Insight B', 'Insight C'],
      fallback_used: false,
    };

    useStore.getState().setNutritionLoading(true);
    expect(useStore.getState().isNutritionLoading).toBe(true);
    expect(useStore.getState().isLoading).toBe(true);

    useStore.getState().setNutritionResult(dummyResult);
    useStore.getState().setNutritionLoading(false);
    expect(useStore.getState().isNutritionLoading).toBe(false);
    expect(useStore.getState().isLoading).toBe(false);
    expect(useStore.getState().nutritionResult).toEqual(dummyResult);
    expect(useStore.getState().result).toEqual(dummyResult);

    useStore.getState().setNutritionError('Failed request');
    expect(useStore.getState().nutritionError).toBe('Failed request');
    expect(useStore.getState().error).toBe('Failed request');
    expect(useStore.getState().isNutritionLoading).toBe(false);

    useStore.getState().setResult(dummyResult);
    expect(useStore.getState().result).toEqual(dummyResult);
    expect(useStore.getState().error).toBeNull();

    useStore.getState().setLoading(true);
    expect(useStore.getState().isLoading).toBe(true);

    useStore.getState().setError('Error 2');
    expect(useStore.getState().error).toBe('Error 2');
    expect(useStore.getState().isLoading).toBe(false);

    useStore.getState().addToHistory(dummyResult);
    expect(useStore.getState().history).toHaveLength(1);
    expect(useStore.getState().history[0]).toEqual(dummyResult);
  });
});

describe('API Client', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  it('sends analysis request and returns result on success', async () => {
    const dummyResult: NutritionResult = {
      session_id: 'session-123',
      timestamp: '2026-06-19T00:00:00Z',
      recommended_calories: 1400,
      ai_insights: ['Insight A', 'Insight B', 'Insight C'],
      fallback_used: false,
    };

    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => dummyResult,
    } as Response);

    const input = {
      session_id: 'session-123',
      pet_species: 'Dog',
      pet_breed: 'Beagle',
      pet_age_months: 12,
      pet_weight_kg: 8.5,
      activity_level: 'High',
    };

    const res = await api.analyze(input);
    expect(res).toEqual(dummyResult);
    expect(fetch).toHaveBeenCalledWith('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });
  });

  it('throws an error on API failure', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: async () => ({ detail: 'Bad request payload' }),
    } as Response);

    const input = {
      session_id: 'session-123',
      pet_species: 'Dog',
      pet_breed: 'Beagle',
      pet_age_months: 12,
      pet_weight_kg: 8.5,
      activity_level: 'High',
    };

    await expect(api.analyze(input)).rejects.toThrow('Bad request payload');
  });

  it('throws a fallback error when response body is not JSON', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => {
        throw new Error('Not JSON');
      },
    } as Response);

    const input = {
      session_id: 'session-123',
      pet_species: 'Dog',
      pet_breed: 'Beagle',
      pet_age_months: 12,
      pet_weight_kg: 8.5,
      activity_level: 'High',
    };

    await expect(api.analyze(input)).rejects.toThrow('Unknown error');
  });
});
