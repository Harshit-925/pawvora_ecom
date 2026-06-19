/**
 * TrustBanner — Deep navy trust section with spring entrance badges.
 */
import React from 'react';
import { motion } from 'framer-motion';
import { Award, Leaf, Truck } from 'lucide-react';

const badges = [
  { icon: Award, label: 'Vet Recommended', sub: 'Trusted by 2,400+ vets', color: '#FB7185' },
  { icon: Leaf, label: '100% Natural', sub: 'No artificial additives', color: '#34D399' },
  { icon: Truck, label: 'Free Shipping', sub: 'On orders over $50', color: '#60A5FA' },
];

export const TrustBanner: React.FC = () => {
  return (
    <section
      className="py-20 px-6"
      style={{ background: 'linear-gradient(135deg, #1E3A5F 0%, #142841 100%)' }}
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ type: 'spring', stiffness: 180, damping: 22 }}
          className="text-center mb-14"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white" style={{ fontFamily: "'Playfair Display SC', serif" }}>
            Our Pets Approve
          </h2>
          <p className="text-lg mt-3" style={{ color: 'rgba(255,255,255,0.6)', fontFamily: "'Karla', sans-serif" }}>
            Every product is clinically tested and loved by thousands of animals.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {badges.map((badge, i) => (
            <motion.div
              key={badge.label}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ type: 'spring', stiffness: 200, damping: 22, delay: i * 0.12 }}
              whileHover={{ y: -6, scale: 1.03 }}
              className="flex flex-col items-center text-center p-8 rounded-3xl cursor-default"
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.12)',
                backdropFilter: 'blur(10px)',
              }}
            >
              <motion.div
                whileHover={{ rotate: [0, -8, 8, 0] }}
                transition={{ type: 'spring', stiffness: 300, damping: 12 }}
                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5"
                style={{ background: `${badge.color}20`, border: `1.5px solid ${badge.color}40` }}
              >
                <badge.icon className="w-8 h-8" style={{ color: badge.color }} />
              </motion.div>
              <h3 className="text-xl font-bold text-white mb-2" style={{ fontFamily: "'Playfair Display SC', serif" }}>
                {badge.label}
              </h3>
              <p style={{ color: 'rgba(255,255,255,0.55)', fontFamily: "'Karla', sans-serif", fontSize: '0.95rem' }}>
                {badge.sub}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
