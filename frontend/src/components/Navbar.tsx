/**
 * PawVora Navbar — sticky with spring glassmorphism on scroll.
 * Spring physics: stagger nav links, cart badge bounce, glass blur on scroll.
 */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useSpring } from 'framer-motion';
import { ShoppingBag, Search, Menu, X, PawPrint } from 'lucide-react';
import { useStore } from '../store/useAppStore';

const navLinks = [
  { label: 'Home', href: '#hero' },
  { label: 'Dogs', href: '#dogs' },
  { label: 'Cats', href: '#cats' },
  { label: 'Treats', href: '#treats' },
  { label: 'Nutrition AI', href: '#nutrition-ai' },
];

const linkVariants = {
  hidden: { opacity: 0, y: -12 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 24,
      delay: i * 0.06,
    },
  }),
};

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { toggleCart } = useStore();
  const count = useStore((s) => s.cartCount());

  // Spring-animated cart badge scale
  const badgeScale = useSpring(1, { stiffness: 600, damping: 18 });

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Bounce badge when count changes
  useEffect(() => {
    if (count > 0) {
      badgeScale.set(1.5);
      setTimeout(() => badgeScale.set(1), 200);
    }
  }, [count, badgeScale]);

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 280, damping: 28, delay: 0.1 }}
        className="fixed top-0 left-0 right-0 z-50"
        style={{
          backgroundColor: isScrolled ? 'rgba(255,248,241,0.85)' : 'transparent',
          backdropFilter: isScrolled ? 'blur(20px)' : 'none',
          WebkitBackdropFilter: isScrolled ? 'blur(20px)' : 'none',
          borderBottom: isScrolled ? '1px solid rgba(229,189,190,0.5)' : '1px solid transparent',
          transition: 'background-color 0.3s, backdrop-filter 0.3s, border-color 0.3s',
        }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <motion.a
            href="#hero"
            className="flex items-center gap-2.5 no-underline"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          >
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #E11D48, #FB7185)' }}
            >
              <PawPrint className="w-5 h-5 text-white" />
            </div>
            <span style={{ fontFamily: "'Playfair Display SC', serif", fontWeight: 700, fontSize: '1.35rem', color: '#1E3A5F' }}>
              Paw<span style={{ color: '#E11D48' }}>Vora</span>
            </span>
          </motion.a>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
            {navLinks.map((link, i) => (
              <motion.a
                key={link.href}
                href={link.href}
                custom={i}
                variants={linkVariants}
                initial="hidden"
                animate="visible"
                className="relative px-4 py-2 text-sm font-medium rounded-full cursor-pointer no-underline"
                style={{ color: '#1E3A5F', fontFamily: "'Karla', sans-serif" }}
                whileHover={{ backgroundColor: 'rgba(225,29,72,0.08)', color: '#E11D48' }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 400, damping: 22 }}
              >
                {link.label}
              </motion.a>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.1, backgroundColor: 'rgba(225,29,72,0.08)' }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer border-0 bg-transparent"
              aria-label="Search"
            >
              <Search className="w-5 h-5" style={{ color: '#1E3A5F' }} />
            </motion.button>

            <motion.button
              onClick={toggleCart}
              className="relative w-10 h-10 rounded-full flex items-center justify-center cursor-pointer border-0 bg-transparent"
              whileHover={{ scale: 1.1, backgroundColor: 'rgba(225,29,72,0.08)' }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              aria-label={`Open cart, ${count} items`}
            >
              <ShoppingBag className="w-5 h-5" style={{ color: '#1E3A5F' }} />
              <AnimatePresence>
                {count > 0 && (
                  <motion.span
                    key="badge"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    style={{ scale: badgeScale, background: '#E11D48', fontSize: '11px', fontWeight: 700 }}
                    className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-white flex items-center justify-center"
                  >
                    {count}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>

            <motion.a
              href="#"
              className="hidden md:flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white no-underline ml-2"
              style={{ background: 'linear-gradient(135deg, #E11D48, #B80035)', fontFamily: "'Karla', sans-serif" }}
              whileHover={{ scale: 1.04, boxShadow: '0 8px 24px rgba(225,29,72,0.4)' }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            >
              Shop Now
            </motion.a>

            {/* Mobile menu toggle */}
            <motion.button
              className="md:hidden w-10 h-10 flex items-center justify-center rounded-full border-0 bg-transparent cursor-pointer"
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsMobileOpen((v) => !v)}
              aria-label="Toggle menu"
              aria-expanded={isMobileOpen}
            >
              <AnimatePresence mode="wait">
                {isMobileOpen ? (
                  <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                    <X className="w-5 h-5" style={{ color: '#1E3A5F' }} />
                  </motion.span>
                ) : (
                  <motion.span key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                    <Menu className="w-5 h-5" style={{ color: '#1E3A5F' }} />
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileOpen && (
            <motion.div
              key="mobile-menu"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="md:hidden overflow-hidden"
              style={{ background: 'rgba(255,248,241,0.96)', backdropFilter: 'blur(20px)', borderTop: '1px solid rgba(229,189,190,0.4)' }}
            >
              <nav className="px-6 py-4 flex flex-col gap-1">
                {navLinks.map((link, i) => (
                  <motion.a
                    key={link.href}
                    href={link.href}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 24, delay: i * 0.05 }}
                    className="px-4 py-3 rounded-xl text-base font-medium no-underline"
                    style={{ color: '#1E3A5F', fontFamily: "'Karla', sans-serif" }}
                    onClick={() => setIsMobileOpen(false)}
                  >
                    {link.label}
                  </motion.a>
                ))}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  );
};
