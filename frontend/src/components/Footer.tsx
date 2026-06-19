/**
 * Footer — Staggered column reveal on scroll.
 */
import React from 'react';
import { motion } from 'framer-motion';
import { PawPrint, Instagram, Twitter, Youtube, Mail } from 'lucide-react';

const footerLinks = {
  Shop: ['Dog Food', 'Cat Food', 'Treats', 'Toys', 'Accessories'],
  Company: ['About Us', 'Our Story', 'Careers', 'Press'],
  Support: ['FAQ', 'Shipping Info', 'Returns', 'Contact Us'],
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};

const colVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 180, damping: 22 } },
};

export const Footer: React.FC = () => {
  return (
    <footer className="pt-16 pb-8 px-6" style={{ background: '#1E3A5F' }} aria-label="Site footer">
      <div className="max-w-7xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-5 gap-10 pb-12 border-b"
          style={{ borderColor: 'rgba(255,255,255,0.1)' }}
        >
          {/* Brand */}
          <motion.div variants={colVariants} className="col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #E11D48, #FB7185)' }}>
                <PawPrint className="w-5 h-5 text-white" />
              </div>
              <span style={{ fontFamily: "'Playfair Display SC', serif", fontWeight: 700, fontSize: '1.35rem', color: '#FFFFFF' }}>
                Paw<span style={{ color: '#FB7185' }}>Vora</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed mb-6 max-w-xs" style={{ color: 'rgba(255,255,255,0.5)', fontFamily: "'Karla', sans-serif" }}>
              Premium nutrition and care for pets who deserve nothing but the best. Trusted by 50,000+ families.
            </p>
            <div className="flex gap-3">
              {[Instagram, Twitter, Youtube].map((Icon, i) => (
                <motion.a
                  key={i}
                  href="#"
                  whileHover={{ scale: 1.15, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)' }}
                  aria-label={`Social link ${i + 1}`}
                >
                  <Icon className="w-4 h-4" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Nav columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <motion.div key={title} variants={colVariants}>
              <h4 className="text-sm font-bold mb-4 uppercase tracking-wider" style={{ color: '#FB7185', fontFamily: "'Karla', sans-serif" }}>
                {title}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link}>
                    <motion.a
                      href="#"
                      className="text-sm no-underline"
                      style={{ color: 'rgba(255,255,255,0.5)', fontFamily: "'Karla', sans-serif" }}
                      whileHover={{ color: '#FFFFFF', x: 4 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 22 }}
                    >
                      {link}
                    </motion.a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>

        {/* Newsletter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: 'spring', stiffness: 180, damping: 22 }}
          className="py-10 flex flex-col md:flex-row items-center justify-between gap-6"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}
        >
          <div>
            <h3 className="text-lg font-bold text-white" style={{ fontFamily: "'Playfair Display SC', serif" }}>
              Get exclusive deals
            </h3>
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)', fontFamily: "'Karla', sans-serif" }}>
              Join 50,000+ pet parents. No spam, ever.
            </p>
          </div>
          <form className="flex gap-3 w-full md:w-auto" onSubmit={(e) => e.preventDefault()} aria-label="Newsletter signup">
            <div className="relative flex-1 md:w-72">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'rgba(255,255,255,0.4)' }} />
              <input
                type="email"
                placeholder="your@email.com"
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl text-sm text-white placeholder-white/30 outline-none border-0"
                style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', fontFamily: "'Karla', sans-serif" }}
                aria-label="Email for newsletter"
              />
            </div>
            <motion.button
              type="submit"
              whileHover={{ scale: 1.04, boxShadow: '0 8px 24px rgba(225,29,72,0.4)' }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              className="px-6 py-3.5 rounded-2xl text-sm font-semibold text-white border-0 cursor-pointer whitespace-nowrap"
              style={{ background: 'linear-gradient(135deg, #E11D48, #B80035)', fontFamily: "'Karla', sans-serif" }}
            >
              Subscribe
            </motion.button>
          </form>
        </motion.div>

        {/* Bottom */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-2 text-xs" style={{ color: 'rgba(255,255,255,0.3)', fontFamily: "'Karla', sans-serif" }}>
          <p>© 2025 PawVora. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="no-underline hover:text-white/60 transition-colors">Privacy Policy</a>
            <a href="#" className="no-underline hover:text-white/60 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
