/**
 * ShopByPet — 3 large cards with spring image zoom on hover.
 */
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useStore } from '../store/useAppStore';

const petCards = [
  {
    id: 'dogs',
    label: 'For Dogs',
    emoji: '🐕',
    tagline: 'From mighty kibble to cozy beds',
    bg: 'linear-gradient(135deg, #FFF0F3, #FFE4E8)',
    accent: '#E11D48',
    image: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'cats',
    label: 'For Cats',
    emoji: '🐈',
    tagline: 'Gourmet delights for the discerning feline',
    bg: 'linear-gradient(135deg, #EFF6FF, #DBEAFE)',
    accent: '#1E3A5F',
    image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'small-animals',
    label: 'Small Animals',
    emoji: '🐇',
    tagline: 'Tiny treats for big personalities',
    bg: 'linear-gradient(135deg, #ECFDF5, #D1FAE5)',
    accent: '#059669',
    image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&auto=format&fit=crop&q=80',
  },
];

export const ShopByPet: React.FC = () => {
  const setActiveCategory = useStore((s) => s.setActiveCategory);

  return (
    <section id="cats" className="py-20 px-6" style={{ background: '#FFF8F1' }}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ type: 'spring', stiffness: 180, damping: 22 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: "'Playfair Display SC', serif", color: '#1E3A5F' }}>
            Shop By Pet
          </h2>
          <p className="text-lg" style={{ color: '#5C3F40', fontFamily: "'Karla', sans-serif" }}>
            Every companion deserves something special.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {petCards.map((card, i) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 60, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ type: 'spring', stiffness: 160, damping: 22, delay: i * 0.1 }}
              whileHover={{ y: -10 }}
              className="relative overflow-hidden rounded-3xl cursor-pointer group"
              style={{
                background: card.bg,
                border: '1px solid rgba(255,255,255,0.6)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                minHeight: '380px',
              }}
              onClick={() => {
                setActiveCategory(card.id);
                document.getElementById('dogs')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              {/* Image */}
              <div className="absolute inset-0 overflow-hidden rounded-3xl">
                <motion.img
                  src={card.image}
                  alt={card.label}
                  className="w-full h-full object-cover opacity-30"
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 25 }}
                />
              </div>

              {/* Gradient overlay */}
              <div
                className="absolute inset-0 rounded-3xl"
                style={{ background: 'linear-gradient(to top, rgba(255,255,255,0.95) 40%, transparent)' }}
              />

              {/* Content */}
              <div className="relative z-10 flex flex-col justify-end h-full p-7" style={{ minHeight: '380px' }}>
                <motion.span
                  className="text-5xl mb-4 block"
                  whileHover={{ scale: 1.3, rotate: [0, -10, 10, 0] }}
                  transition={{ type: 'spring', stiffness: 300, damping: 12 }}
                >
                  {card.emoji}
                </motion.span>
                <h3 className="text-2xl font-bold mb-2" style={{ fontFamily: "'Playfair Display SC', serif", color: card.accent }}>
                  {card.label}
                </h3>
                <p className="text-sm mb-5" style={{ color: '#5C3F40', fontFamily: "'Karla', sans-serif" }}>
                  {card.tagline}
                </p>

                <motion.div
                  className="flex items-center gap-2 font-semibold text-sm"
                  style={{ color: card.accent, fontFamily: "'Karla', sans-serif" }}
                  whileHover={{ x: 6 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                >
                  Shop Now
                  <motion.span
                    className="group-hover:translate-x-1 transition-transform"
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <ArrowRight className="w-4 h-4" />
                  </motion.span>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
