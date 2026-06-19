/**
 * Primary input form.
 * WCAG 2.1 AA: every input has label + htmlFor + aria-describedby.
 */
import React, { useId, useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { api } from '../api/client';
import { v4 as uuidv4 } from 'uuid';
import { motion } from 'framer-motion';
import { nutritionSchema } from '../utils/validation';
import { PawPrint, Scale, Calendar, Activity, Info } from 'lucide-react';

export const InputForm: React.FC = () => {
  const { setResult, setLoading, setError, addToHistory, isLoading } = useAppStore();
  const formId = useId();
  
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setFormErrors({});

    const formData = new FormData(e.currentTarget);
    const inputObj = {
      pet_species: formData.get('pet_species') as string,
      pet_breed: formData.get('pet_breed') as string,
      pet_age_months: Number(formData.get('pet_age_months')),
      pet_weight_kg: Number(formData.get('pet_weight_kg')),
      activity_level: formData.get('activity_level') as string,
      allergies: formData.get('allergies') as string,
    };

    const validation = nutritionSchema.safeParse(inputObj);
    if (!validation.success) {
      const errors: Record<string, string> = {};
      validation.error.errors.forEach((err) => {
        if (err.path[0]) {
          errors[err.path[0].toString()] = err.message;
        }
      });
      setFormErrors(errors);
      setLoading(false);
      return;
    }

    try {
      const result = await api.analyze({
        session_id: uuidv4(),
        ...inputObj,
      });
      setResult(result);
      addToHistory(result);
      
      // Scroll to results softly
      setTimeout(() => {
        document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputClasses = "w-full rounded-xl border-gray-200 bg-white/50 px-4 py-3 pl-11 text-sm outline-none transition-all focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 placeholder:text-gray-400 shadow-sm backdrop-blur-sm";

  return (
    <motion.form 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onSubmit={handleSubmit} 
      aria-labelledby={`${formId}-title`} 
      noValidate
      className="bg-white/80 backdrop-blur-md rounded-3xl shadow-xl border border-white/40 p-8 sm:p-10"
    >
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-brand-primary/10 p-3 rounded-2xl">
          <PawPrint className="w-6 h-6 text-brand-primary" />
        </div>
        <h2 id={`${formId}-title`} className="text-2xl font-display font-bold text-brand-dark">
          Pet Profile
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
        <div>
          <label htmlFor={`${formId}-species`} className="block text-sm font-medium text-gray-700 mb-2">
            Species <span aria-hidden="true" className="text-brand-accent">*</span>
          </label>
          <div className="relative">
            <PawPrint className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400" />
            <select
              id={`${formId}-species`}
              name="pet_species"
              className={inputClasses}
              defaultValue="Dog"
              aria-invalid={!!formErrors.pet_species}
            >
              <option value="Dog">Dog</option>
              <option value="Cat">Cat</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor={`${formId}-breed`} className="block text-sm font-medium text-gray-700 mb-2">
            Breed <span aria-hidden="true" className="text-brand-accent">*</span>
          </label>
          <div className="relative">
            <Info className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400" />
            <input
              id={`${formId}-breed`}
              name="pet_breed"
              type="text"
              placeholder="e.g. Golden Retriever"
              className={inputClasses}
              aria-invalid={!!formErrors.pet_breed}
              aria-describedby={formErrors.pet_breed ? `${formId}-breed-error` : undefined}
            />
          </div>
          {formErrors.pet_breed && <p id={`${formId}-breed-error`} className="text-red-500 text-xs mt-1">{formErrors.pet_breed}</p>}
        </div>

        <div>
          <label htmlFor={`${formId}-age`} className="block text-sm font-medium text-gray-700 mb-2">
            Age (Months) <span aria-hidden="true" className="text-brand-accent">*</span>
          </label>
          <div className="relative">
            <Calendar className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400" />
            <input
              id={`${formId}-age`}
              name="pet_age_months"
              type="number"
              placeholder="24"
              className={inputClasses}
              aria-invalid={!!formErrors.pet_age_months}
              aria-describedby={formErrors.pet_age_months ? `${formId}-age-error` : undefined}
            />
          </div>
          {formErrors.pet_age_months && <p id={`${formId}-age-error`} className="text-red-500 text-xs mt-1">{formErrors.pet_age_months}</p>}
        </div>

        <div>
          <label htmlFor={`${formId}-weight`} className="block text-sm font-medium text-gray-700 mb-2">
            Weight (kg) <span aria-hidden="true" className="text-brand-accent">*</span>
          </label>
          <div className="relative">
            <Scale className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400" />
            <input
              id={`${formId}-weight`}
              name="pet_weight_kg"
              type="number"
              step="0.1"
              placeholder="15.5"
              className={inputClasses}
              aria-invalid={!!formErrors.pet_weight_kg}
              aria-describedby={formErrors.pet_weight_kg ? `${formId}-weight-error` : undefined}
            />
          </div>
          {formErrors.pet_weight_kg && <p id={`${formId}-weight-error`} className="text-red-500 text-xs mt-1">{formErrors.pet_weight_kg}</p>}
        </div>
      </div>

      <div className="mb-6">
        <label htmlFor={`${formId}-activity`} className="block text-sm font-medium text-gray-700 mb-2">
          Activity Level <span aria-hidden="true" className="text-brand-accent">*</span>
        </label>
        <div className="relative">
          <Activity className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400" />
          <select
            id={`${formId}-activity`}
            name="activity_level"
            className={inputClasses}
            defaultValue="Moderate"
          >
            <option value="Low">Low (Couch potato)</option>
            <option value="Moderate">Moderate (Daily walks)</option>
            <option value="High">High (Very active)</option>
            <option value="Athlete">Athlete (Working/Sport)</option>
          </select>
        </div>
      </div>

      <div className="mb-8">
        <label htmlFor={`${formId}-allergies`} className="block text-sm font-medium text-gray-700 mb-2">
          Known Allergies
        </label>
        <div className="relative">
          <textarea
            id={`${formId}-allergies`}
            name="allergies"
            rows={2}
            className="w-full rounded-xl border-gray-200 bg-white/50 px-4 py-3 text-sm outline-none transition-all focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 placeholder:text-gray-400 shadow-sm backdrop-blur-sm"
            placeholder="e.g. Chicken, Grain (Optional)"
          />
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        type="submit"
        disabled={isLoading}
        aria-busy={isLoading}
        className="relative w-full overflow-hidden rounded-xl bg-brand-primary px-6 py-4 font-display font-semibold text-white shadow-lg shadow-brand-primary/30 transition-all hover:bg-emerald-400 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed"
      >
        <span className="relative z-10 flex items-center justify-center gap-2">
          {isLoading ? (
             <motion.div
               animate={{ rotate: 360 }}
               transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
               className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
             />
          ) : (
            'Generate Custom Plan'
          )}
        </span>
      </motion.button>
    </motion.form>
  );
};
