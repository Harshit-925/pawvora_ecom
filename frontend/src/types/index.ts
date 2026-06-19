/** PawVora domain types */

export type PetCategory = 'dogs' | 'cats' | 'small-animals';
export type ProductCategory = 'food' | 'treats' | 'toys' | 'accessories';

export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  rating: number;
  reviewCount: number;
  petCategory: PetCategory;
  productCategory: ProductCategory;
  image: string;
  badges: string[];
  description: string;
  isNew?: boolean;
  isBestSeller?: boolean;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

export interface NutritionInput {
  session_id: string;
  pet_species: string;
  pet_breed: string;
  pet_age_months: number;
  pet_weight_kg: number;
  activity_level: string;
  allergies?: string;
}

export interface NutritionResult {
  session_id: string;
  timestamp: string;
  recommended_calories: number;
  ai_insights: string[];
  fallback_used: boolean;
}

export interface ApiError {
  detail: string;
  code?: string;
}
