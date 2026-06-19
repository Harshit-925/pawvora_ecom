/**
 * NutritionFeature — AI Nutrition Calculator as an embedded feature section.
 */
import React, { useId, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, PawPrint } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { useStore } from '../store/useAppStore';
import { z } from 'zod';

const nutritionSchema = z.object({
  pet_species: z.string().min(1),
  pet_breed: z.string().min(1, 'Breed is required'),
  pet_age_months: z.number().min(0).max(360),
  pet_weight_kg: z.number().min(0.1),
  activity_level: z.enum(['Low', 'Moderate', 'High', 'Athlete']),
  allergies: z.string().optional(),
});

export const NutritionFeature: React.FC = () => {
  const formId = useId();
  const { setNutritionResult, setNutritionLoading, setNutritionError, isNutritionLoading, nutritionResult, nutritionError } = useStore();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    const fd = new FormData(e.currentTarget);
    const input = {
      pet_species: fd.get('pet_species') as string,
      pet_breed: fd.get('pet_breed') as string,
      pet_age_months: Number(fd.get('pet_age_months')),
      pet_weight_kg: Number(fd.get('pet_weight_kg')),
      activity_level: fd.get('activity_level') as string,
      allergies: fd.get('allergies') as string,
    };
    const parsed = nutritionSchema.safeParse(input);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      parsed.error.errors.forEach((err) => { if (err.path[0]) errs[err.path[0].toString()] = err.message; });
      setErrors(errs);
      return;
    }
    setNutritionLoading(true);
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: uuidv4(), ...input }),
      });
      if (!res.ok) throw new Error('Analysis failed');
      setNutritionResult(await res.json());
    } catch (err) {
      setNutritionError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setNutritionLoading(false);
    }
  };

  const fieldClass = "w-full rounded-xl px-4 py-3 text-sm border-2 outline-none transition-all bg-white";

  return (
    <section id="nutrition-ai" className="py-20 px-6" style={{ background: 'linear-gradient(135deg, #FFF8F1 0%, #FFF0F3 100%)' }}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ type: 'spring', stiffness: 180, damping: 22 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold mb-4"
            style={{ background: 'rgba(225,29,72,0.1)', color: '#E11D48', border: '1px solid rgba(225,29,72,0.2)', fontFamily: "'Karla', sans-serif" }}>
            <Sparkles className="w-4 h-4" /> AI-Powered Feature
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: "'Playfair Display SC', serif", color: '#1E3A5F' }}>
            Nutrition Calculator
          </h2>
          <p className="text-lg max-w-xl mx-auto" style={{ color: '#5C3F40', fontFamily: "'Karla', sans-serif" }}>
            Tell us about your pet. Our AI will recommend the perfect daily meal plan.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-10 items-start">
          {/* Form */}
          <motion.form
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ type: 'spring', stiffness: 180, damping: 24 }}
            onSubmit={handleSubmit}
            noValidate
            className="glass-card rounded-3xl p-8 space-y-5"
            aria-labelledby={`${formId}-title`}
          >
            <h3 id={`${formId}-title`} className="text-xl font-bold flex items-center gap-2" style={{ fontFamily: "'Playfair Display SC', serif", color: '#1E3A5F' }}>
              <PawPrint className="w-5 h-5" style={{ color: '#E11D48' }} /> Pet Profile
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor={`${formId}-species`} className="block text-sm font-medium mb-1.5" style={{ color: '#1E3A5F', fontFamily: "'Karla', sans-serif" }}>Species</label>
                <select id={`${formId}-species`} name="pet_species" defaultValue="Dog"
                  className={fieldClass} style={{ borderColor: '#E5BDBE', fontFamily: "'Karla', sans-serif" }}>
                  <option>Dog</option>
                  <option>Cat</option>
                </select>
              </div>
              <div>
                <label htmlFor={`${formId}-breed`} className="block text-sm font-medium mb-1.5" style={{ color: '#1E3A5F', fontFamily: "'Karla', sans-serif" }}>Breed</label>
                <input id={`${formId}-breed`} name="pet_breed" type="text" placeholder="e.g. Labrador"
                  className={fieldClass} style={{ borderColor: errors.pet_breed ? '#E11D48' : '#E5BDBE', fontFamily: "'Karla', sans-serif" }} />
                {errors.pet_breed && <p className="text-xs mt-1" style={{ color: '#E11D48' }}>{errors.pet_breed}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor={`${formId}-age`} className="block text-sm font-medium mb-1.5" style={{ color: '#1E3A5F', fontFamily: "'Karla', sans-serif" }}>Age (months)</label>
                <input id={`${formId}-age`} name="pet_age_months" type="number" placeholder="24"
                  className={fieldClass} style={{ borderColor: '#E5BDBE', fontFamily: "'Karla', sans-serif" }} />
              </div>
              <div>
                <label htmlFor={`${formId}-weight`} className="block text-sm font-medium mb-1.5" style={{ color: '#1E3A5F', fontFamily: "'Karla', sans-serif" }}>Weight (kg)</label>
                <input id={`${formId}-weight`} name="pet_weight_kg" type="number" step="0.1" placeholder="15.0"
                  className={fieldClass} style={{ borderColor: '#E5BDBE', fontFamily: "'Karla', sans-serif" }} />
              </div>
            </div>

            <div>
              <label htmlFor={`${formId}-activity`} className="block text-sm font-medium mb-1.5" style={{ color: '#1E3A5F', fontFamily: "'Karla', sans-serif" }}>Activity Level</label>
              <select id={`${formId}-activity`} name="activity_level" defaultValue="Moderate"
                className={fieldClass} style={{ borderColor: '#E5BDBE', fontFamily: "'Karla', sans-serif" }}>
                <option value="Low">Low (Indoor/Couch potato)</option>
                <option value="Moderate">Moderate (Daily walks)</option>
                <option value="High">High (Very active)</option>
                <option value="Athlete">Athlete (Working/Sport dog)</option>
              </select>
            </div>

            <div>
              <label htmlFor={`${formId}-allergies`} className="block text-sm font-medium mb-1.5" style={{ color: '#1E3A5F', fontFamily: "'Karla', sans-serif" }}>Allergies (optional)</label>
              <textarea id={`${formId}-allergies`} name="allergies" rows={2}
                className={fieldClass} placeholder="e.g. Chicken, Grain"
                style={{ borderColor: '#E5BDBE', fontFamily: "'Karla', sans-serif", resize: 'none' }} />
            </div>

            <motion.button
              type="submit"
              disabled={isNutritionLoading}
              whileHover={{ scale: 1.02, boxShadow: '0 12px 32px rgba(225,29,72,0.4)' }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              className="w-full py-4 rounded-2xl text-white font-semibold cursor-pointer border-0 flex items-center justify-center gap-2"
              style={{ background: 'linear-gradient(135deg, #E11D48, #B80035)', fontFamily: "'Karla', sans-serif", fontSize: '1rem' }}
              aria-busy={isNutritionLoading}
            >
              {isNutritionLoading ? (
                <motion.div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                  animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} />
              ) : (
                <><Sparkles className="w-4 h-4" /> Generate Meal Plan</>
              )}
            </motion.button>
          </motion.form>

          {/* Results */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ type: 'spring', stiffness: 180, damping: 24 }}
          >
            <AnimatePresence mode="wait">
              {nutritionError && (
                <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  role="alert" className="rounded-3xl p-6 mb-4"
                  style={{ background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.3)' }}>
                  <p className="font-semibold text-sm" style={{ color: '#DC2626' }}>Error: {nutritionError}</p>
                </motion.div>
              )}

              {nutritionResult ? (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 220, damping: 24 }}
                  className="rounded-3xl p-8 text-white"
                  style={{ background: 'linear-gradient(135deg, #1E3A5F 0%, #142841 100%)', boxShadow: '0 30px 80px rgba(30,58,95,0.3)' }}
                  aria-live="polite"
                  aria-atomic="true"
                >
                  <div className="flex items-center gap-2 mb-6">
                    <Sparkles className="w-5 h-5" style={{ color: '#FB7185' }} />
                    <h3 className="text-xl font-bold" style={{ fontFamily: "'Playfair Display SC', serif" }}>Your Pet's Meal Plan</h3>
                  </div>

                  <div className="rounded-2xl p-5 mb-6" style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)' }}>
                    <p className="text-sm mb-1" style={{ color: 'rgba(255,255,255,0.55)', fontFamily: "'Karla', sans-serif" }}>Daily Calorie Target</p>
                    <div className="flex items-end gap-2">
                      <span className="text-4xl font-bold" style={{ fontFamily: "'Playfair Display SC', serif", color: '#FB7185' }}>
                        {nutritionResult.recommended_calories}
                      </span>
                      <span style={{ color: 'rgba(255,255,255,0.5)', fontFamily: "'Karla', sans-serif", paddingBottom: '4px' }}>kcal / day</span>
                    </div>
                  </div>

                  <ul className="space-y-4" aria-label="AI Nutrition Insights">
                    {nutritionResult.ai_insights.map((insight, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ type: 'spring', stiffness: 280, damping: 24, delay: i * 0.1 }}
                        className="flex gap-3 items-start"
                      >
                        <span className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5"
                          style={{ background: 'rgba(251,113,133,0.2)', color: '#FB7185', border: '1px solid rgba(251,113,133,0.3)' }}>
                          {i + 1}
                        </span>
                        <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.82)', fontFamily: "'Karla', sans-serif" }}>{insight}</p>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="h-full min-h-64 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center p-8 text-center"
                  style={{ borderColor: 'rgba(229,189,190,0.5)' }}
                >
                  <span className="text-5xl mb-4">🐾</span>
                  <p className="font-medium" style={{ color: '#5C3F40', fontFamily: "'Playfair Display SC', serif" }}>Fill in your pet's profile</p>
                  <p className="text-sm mt-1" style={{ color: '#906F70', fontFamily: "'Karla', sans-serif" }}>Your personalized plan appears here.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
