/**
 * ProductGrid — Filtered, staggered product grid with spring animations.
 */
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import CardFanCarousel from './ui/card-fan-carousel';
import { products } from '../utils/products';
import { useStore } from '../store/useAppStore';

export const ProductGrid: React.FC = () => {
  const activeCategory = useStore((s) => s.activeCategory);

  const filtered = useMemo(() => {
    if (activeCategory === 'all') return products;
    return products.filter(
      (p) => p.petCategory === activeCategory || p.productCategory === activeCategory
    );
  }, [activeCategory]);

  return (
    <section id="dogs" className="pt-6 pb-12 px-6" style={{ background: '#FFF8F1' }}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ type: 'spring', stiffness: 180, damping: 22 }}
          className="text-center mb-2"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: "'Playfair Display SC', serif", color: '#1E3A5F' }}>
            Featured Products
          </h2>
          <p className="text-lg" style={{ color: '#5C3F40', fontFamily: "'Karla', sans-serif" }}>
            Handpicked by our in-house veterinary team.
          </p>
        </motion.div>

        <div className="overflow-visible">
          <CardFanCarousel key={activeCategory} products={filtered} />
        </div>

        {filtered.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <p className="text-2xl" style={{ color: '#906F70', fontFamily: "'Playfair Display SC', serif" }}>
              No products in this category yet.
            </p>
            <p className="mt-2 text-base" style={{ color: '#5C3F40', fontFamily: "'Karla', sans-serif" }}>
              Check back soon — new arrivals weekly!
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
};
