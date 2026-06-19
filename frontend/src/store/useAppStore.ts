/**
 * PawVora global store — cart, navigation, and state.
 */
import { create } from 'zustand';
import type { CartItem, Product, NutritionResult } from '../types';
import { toast } from 'sonner';

interface StoreState {
  // Cart
  cartItems: CartItem[];
  isCartOpen: boolean;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  toggleCart: () => void;
  cartTotal: () => number;
  cartCount: () => number;

  // Active category filter
  activeCategory: string;
  setActiveCategory: (cat: string) => void;

  // Nutrition AI result
  nutritionResult: NutritionResult | null;
  isNutritionLoading: boolean;
  nutritionError: string | null;
  setNutritionResult: (r: NutritionResult | null) => void;
  setNutritionLoading: (l: boolean) => void;
  setNutritionError: (e: string | null) => void;

  // Aliases and additional fields for InputForm, ResultsPanel, and unit tests
  result: NutritionResult | null;
  isLoading: boolean;
  error: string | null;
  history: NutritionResult[];
  setResult: (r: NutritionResult | null) => void;
  setLoading: (l: boolean) => void;
  setError: (e: string | null) => void;
  addToHistory: (r: NutritionResult) => void;
}

export const useStore = create<StoreState>((set, get) => ({
  cartItems: [],
  isCartOpen: false,

  addToCart: (product) => {
    const existing = get().cartItems.find((i) => i.id === product.id);
    if (existing) {
      set((s) => ({
        cartItems: s.cartItems.map((i) =>
          i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        ),
      }));
    } else {
      set((s) => ({ cartItems: [...s.cartItems, { ...product, quantity: 1 }] }));
    }
    toast.success(`${product.name} added to cart!`, {
      action: {
        label: 'View Cart',
        onClick: () => set({ isCartOpen: true }),
      },
    });
  },

  removeFromCart: (productId) => {
    const removed = get().cartItems.find((i) => i.id === productId);
    if (removed) {
      set((s) => ({ cartItems: s.cartItems.filter((i) => i.id !== productId) }));
      toast.info(`${removed.name} removed from cart.`, {
        action: {
          label: 'Undo',
          onClick: () => get().addToCart(removed),
        },
      });
    }
  },

  updateQuantity: (productId, quantity) => {
    if (quantity <= 0) {
      get().removeFromCart(productId);
      return;
    }
    set((s) => ({
      cartItems: s.cartItems.map((i) => (i.id === productId ? { ...i, quantity } : i)),
    }));
  },

  toggleCart: () => set((s) => ({ isCartOpen: !s.isCartOpen })),

  cartTotal: () => get().cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0),

  cartCount: () => get().cartItems.reduce((sum, i) => sum + i.quantity, 0),

  activeCategory: 'all',
  setActiveCategory: (cat) => set({ activeCategory: cat }),

  // Original state & setters
  nutritionResult: null,
  isNutritionLoading: false,
  nutritionError: null,
  setNutritionResult: (r) => set({ nutritionResult: r, result: r, nutritionError: null, error: null }),
  setNutritionLoading: (l) => set({ isNutritionLoading: l, isLoading: l }),
  setNutritionError: (e) => set({ nutritionError: e, error: e, isNutritionLoading: false, isLoading: false }),

  // Aliases/helpers for compatibility
  result: null,
  isLoading: false,
  error: null,
  history: [],
  setResult: (r) => set({ result: r, nutritionResult: r, error: null, nutritionError: null }),
  setLoading: (l) => set({ isLoading: l, isNutritionLoading: l }),
  setError: (e) => set({ error: e, nutritionError: e, isLoading: false, isNutritionLoading: false }),
  addToHistory: (r) => set((s) => ({ history: [r, ...s.history] })),
}));

export const useAppStore = useStore;

