/**
 * ProductCard — Glassmorphism card with spring hover-lift + rose glow.
 * Spring physics: hover lift, add-to-cart pop, badge spring entrance.
 */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Star, Check } from 'lucide-react';
import { useStore } from '../store/useAppStore';
import type { Product } from '../types';

interface Props {
  product: Product;
  index: number;
}

export const ProductCard: React.FC<Props> = ({ product, index }) => {
  const addToCart = useStore((s) => s.addToCart);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.92 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 180,
        damping: 22,
        delay: index * 0.08,
      },
    },
  };

  return (
    <motion.article
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      whileHover={{
        y: -10,
        boxShadow: '0 30px 70px rgba(225,29,72,0.18), 0 8px 20px rgba(0,0,0,0.08)',
        transition: { type: 'spring', stiffness: 280, damping: 22 },
      }}
      className="glass-card rounded-3xl overflow-hidden flex flex-col cursor-pointer group"
      aria-label={`${product.name} by ${product.brand}`}
    >
      {/* Image Container */}
      <div className="relative overflow-hidden aspect-[4/3]" style={{ background: 'linear-gradient(135deg, #FFF0F3, #FFF8F1)' }}>
        <motion.img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
          whileHover={{ scale: 1.08 }}
          transition={{ type: 'spring', stiffness: 200, damping: 25 }}
          loading="lazy"
        />
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          <AnimatePresence>
            {product.isNew && (
              <motion.span
                initial={{ opacity: 0, x: -16, scale: 0.7 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 22 }}
                className="px-2.5 py-0.5 rounded-full text-xs font-bold text-white"
                style={{ background: '#1E3A5F', fontFamily: "'Karla', sans-serif" }}
              >
                NEW
              </motion.span>
            )}
            {product.isBestSeller && (
              <motion.span
                initial={{ opacity: 0, x: -16, scale: 0.7 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 22, delay: 0.05 }}
                className="px-2.5 py-0.5 rounded-full text-xs font-bold text-white"
                style={{ background: '#E11D48', fontFamily: "'Karla', sans-serif" }}
              >
                BEST SELLER
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* Category badge */}
        <motion.div
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          className="absolute inset-0 flex items-center justify-center"
          style={{ background: 'rgba(30,58,95,0.5)', backdropFilter: 'blur(4px)' }}
        >
          <motion.span
            initial={{ scale: 0.5, opacity: 0 }}
            whileHover={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 22 }}
            className="px-4 py-2 rounded-xl text-white text-sm font-semibold"
            style={{ background: 'rgba(225,29,72,0.9)', fontFamily: "'Karla', sans-serif" }}
          >
            Quick View
          </motion.span>
        </motion.div>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-3 p-5 flex-1">
        {/* Dietary badges */}
        <div className="flex flex-wrap gap-1.5">
          {product.badges.map((badge) => (
            <span
              key={badge}
              className="px-2.5 py-0.5 rounded-full text-xs font-semibold"
              style={{
                background: 'rgba(30,58,95,0.08)',
                color: '#1E3A5F',
                fontFamily: "'Karla', sans-serif",
              }}
            >
              {badge}
            </span>
          ))}
        </div>

        <div>
          <h3 className="text-lg font-bold leading-snug" style={{ fontFamily: "'Playfair Display SC', serif", color: '#1E3A5F' }}>
            {product.name}
          </h3>
          <p className="text-xs mt-0.5" style={{ color: '#906F70', fontFamily: "'Karla', sans-serif" }}>
            by {product.brand}
          </p>
        </div>

        <p className="text-sm leading-relaxed flex-1" style={{ color: '#5C3F40', fontFamily: "'Karla', sans-serif" }}>
          {product.description}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-2">
          <div className="flex gap-0.5" aria-label={`Rating: ${product.rating} out of 5`}>
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className="w-3.5 h-3.5"
                fill={i < Math.floor(product.rating) ? '#F59E0B' : 'none'}
                style={{ color: '#F59E0B' }}
              />
            ))}
          </div>
          <span className="text-xs font-medium" style={{ color: '#5C3F40', fontFamily: "'Karla', sans-serif" }}>
            {product.rating} ({product.reviewCount})
          </span>
        </div>

        {/* Price + Cart Button */}
        <div className="flex items-center justify-between pt-1">
          <span className="text-2xl font-bold" style={{ color: '#E11D48', fontFamily: "'Playfair Display SC', serif" }}>
            ${product.price.toFixed(2)}
          </span>

          <motion.button
            onClick={handleAdd}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.91 }}
            transition={{ type: 'spring', stiffness: 500, damping: 22 }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-semibold text-white cursor-pointer border-0"
            style={{
              background: added
                ? 'linear-gradient(135deg, #10B981, #059669)'
                : 'linear-gradient(135deg, #E11D48, #B80035)',
              boxShadow: added
                ? '0 8px 20px rgba(16,185,129,0.35)'
                : '0 8px 20px rgba(225,29,72,0.35)',
              fontFamily: "'Karla', sans-serif",
              transition: 'background 0.3s, box-shadow 0.3s',
            }}
            aria-label={`Add ${product.name} to cart`}
          >
            <AnimatePresence mode="wait">
              {added ? (
                <motion.span
                  key="check"
                  initial={{ scale: 0, rotate: -90 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                  className="flex items-center gap-1"
                >
                  <Check className="w-4 h-4" /> Added!
                </motion.span>
              ) : (
                <motion.span
                  key="bag"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                  className="flex items-center gap-1"
                >
                  <ShoppingBag className="w-4 h-4" /> Add
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>
    </motion.article>
  );
};
