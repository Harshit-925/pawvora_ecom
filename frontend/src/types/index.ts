/** Dynamic Animal Food domain types */

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
