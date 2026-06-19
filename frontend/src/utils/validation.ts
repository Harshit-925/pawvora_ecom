/**
 * Zod schemas for form validation.
 * Validate on the client before hitting the API.
 */
import { z } from 'zod';

export const nutritionSchema = z.object({
  pet_species: z.string().min(1, 'Species is required'),
  pet_breed: z.string().min(1, 'Breed is required'),
  pet_age_months: z.number().min(0, 'Must be positive').max(360, 'Age seems too high'),
  pet_weight_kg: z.number().min(0.1, 'Weight must be > 0'),
  activity_level: z.enum(['Low', 'Moderate', 'High', 'Athlete']),
  allergies: z.string().optional(),
});

export type NutritionFormData = z.infer<typeof nutritionSchema>;
