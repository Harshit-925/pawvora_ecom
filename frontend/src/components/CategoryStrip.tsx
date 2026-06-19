/**
 * CategoryStrip — Animated scrolling category pills.
 * Spring physics on tap + layoutId for active indicator.
 */
import React from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../store/useAppStore';

const categories = [
  { id: 'all', label: 'All Products', icon: '✨' },
  { id: 'dogs', label: 'Dog Food', icon: '🐕' },
  { id: 'cats', label: 'Cat Food', icon: '🐈' },
  { id: 'treats', label: 'Treats', icon: '🦴' },
  { id: 'toys', label: 'Toys', icon: '🎾' },
  { id: 'accessories', label: 'Accessories', icon: '🎀' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.07, delayChildren: 0.1 },
  },
};

const pillVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 280, damping: 22 },
  },
};

export const CategoryStrip: React.FC = () => {
  const { activeCategory, setActiveCategory } = useStore();

  return (
    <section className="pt-12 pb-6 px-6" style={{ background: 'linear-gradient(180deg, #FFF0F3 0%, #FFF8F1 100%)' }}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ type: 'spring', stiffness: 200, damping: 22 }}
          className="text-center mb-8"
        >
          <h2 className="text-2xl font-bold" style={{ fontFamily: "'Playfair Display SC', serif", color: '#1E3A5F' }}>
            Shop by Category
          </h2>
        </motion.div>

        <motion.div
          className="flex gap-3 justify-center flex-wrap"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <motion.button
                key={cat.id}
                variants={pillVariants}
                onClick={() => setActiveCategory(cat.id)}
                whileHover={{ scale: 1.07, y: -2 }}
                whileTap={{ scale: 0.94 }}
                transition={{ type: 'spring', stiffness: 400, damping: 22 }}
                className="relative px-5 py-2.5 rounded-full text-sm font-semibold flex items-center gap-2 cursor-pointer border-0 overflow-hidden"
                style={{
                  background: isActive ? 'linear-gradient(135deg, #E11D48, #B80035)' : 'rgba(255,255,255,0.8)',
                  color: isActive ? '#FFFFFF' : '#1E3A5F',
                  border: isActive ? 'none' : '1px solid rgba(229,189,190,0.6)',
                  boxShadow: isActive ? '0 8px 24px rgba(225,29,72,0.35)' : '0 2px 8px rgba(0,0,0,0.05)',
                  fontFamily: "'Karla', sans-serif",
                }}
                aria-pressed={isActive}
              >
                {isActive && (
                  <motion.div
                    layoutId="active-pill-bg"
                    className="absolute inset-0 rounded-full"
                    style={{ background: 'linear-gradient(135deg, #E11D48, #B80035)', zIndex: -1 }}
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
                <span role="img" aria-hidden="true">{cat.icon}</span>
                {cat.label}
              </motion.button>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};
