/**
 * Displays AI insights.
 * aria-live="polite" announces results to screen readers.
 */
import React from 'react';
import { useAppStore } from '../store/useAppStore';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Bone, AlertCircle } from 'lucide-react';

export const ResultsPanel: React.FC = () => {
  const { result, error } = useAppStore();

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <section aria-label="Analysis Results" id="results-section" className="h-full">
      {/* Error — role="alert" for immediate announcement */}
      <AnimatePresence>
        {error && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            role="alert" 
            aria-live="assertive" 
            className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6 flex items-start gap-3 shadow-sm"
          >
            <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
            <div>
              <p className="text-red-800 font-semibold text-sm">Action Required</p>
              <p className="text-red-600 text-sm mt-1">{error}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results — aria-live="polite" for non-urgent announcement */}
      <div aria-live="polite" aria-atomic="true" className="h-full">
        <AnimatePresence mode="wait">
          {result ? (
            <motion.div 
              key="results"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-brand-dark rounded-3xl shadow-2xl p-8 sm:p-10 text-white h-full relative overflow-hidden"
            >
              {/* Decorative background element */}
              <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-brand-primary/10 rounded-full blur-3xl pointer-events-none" />
              
              <motion.div variants={itemVariants} className="relative z-10">
                <div className="flex items-center gap-3 mb-2">
                  <Bone className="w-6 h-6 text-brand-accent" />
                  <h3 className="text-2xl font-display font-bold">Nutrition Plan</h3>
                </div>
                <p className="text-gray-400 text-sm mb-8">Personalized for your pet's exact biology.</p>
              </motion.div>
              
              <motion.div variants={itemVariants} className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8 backdrop-blur-sm relative z-10">
                <p className="text-sm text-gray-400 font-medium uppercase tracking-wider mb-2">Daily Target</p>
                <div className="flex items-end gap-2">
                  <span className="text-4xl font-display font-bold text-brand-primary leading-none">
                    {result.recommended_calories}
                  </span>
                  <span className="text-gray-400 pb-1">kcal/day</span>
                </div>
              </motion.div>

              <div className="relative z-10">
                <h4 className="text-sm font-medium uppercase tracking-wider text-gray-400 mb-6">Expert Insights</h4>
                <ul className="space-y-6" aria-label="AI-generated insights">
                  {result.ai_insights.map((insight, i) => (
                    <motion.li 
                      variants={itemVariants}
                      key={i} 
                      className="flex gap-4 items-start group"
                    >
                      <div className="mt-1 flex-shrink-0 w-8 h-8 rounded-full bg-brand-primary/20 flex items-center justify-center text-brand-primary font-bold text-sm border border-brand-primary/30 group-hover:scale-110 group-hover:bg-brand-primary group-hover:text-white transition-all">
                        {i + 1}
                      </div>
                      <p className="text-gray-200 leading-relaxed text-sm md:text-base pt-0.5">{insight}</p>
                    </motion.li>
                  ))}
                </ul>
              </div>

              {result.fallback_used && (
                <motion.p variants={itemVariants} className="text-xs text-brand-accent/70 mt-8 flex items-center gap-2 relative z-10">
                  <CheckCircle2 className="w-4 h-4" />
                  Using localized clinical baseline
                </motion.p>
              )}
            </motion.div>
          ) : (
            <motion.div 
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full min-h-[400px] border-2 border-dashed border-gray-200 rounded-3xl flex flex-col items-center justify-center text-center p-8 text-gray-400"
            >
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <Bone className="w-8 h-8 text-gray-300" />
              </div>
              <p className="font-medium text-gray-500">Awaiting Profile Details</p>
              <p className="text-sm mt-2 max-w-[250px]">Enter your pet's details to generate a highly customized nutritional profile.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};
