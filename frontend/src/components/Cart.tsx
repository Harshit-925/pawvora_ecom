/**
 * Cart — Spring slide-in drawer with AnimatePresence.
 * Spring physics: slide-in drawer, item remove, quantity update.
 */
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Plus, Minus, Trash2 } from 'lucide-react';
import { Drawer } from 'vaul';
import { useStore } from '../store/useAppStore';

export const Cart: React.FC = () => {
  const { isCartOpen, toggleCart, updateQuantity, removeFromCart } = useStore();
  const total = useStore((s) => s.cartTotal());
  const items = useStore((s) => s.cartItems);

  return (
    <Drawer.Root 
      open={isCartOpen} 
      onOpenChange={(open) => { if (open !== isCartOpen) toggleCart(); }} 
      direction="right"
      shouldScaleBackground
    >
      <Drawer.Portal>
        {/* Backdrop overlay */}
        <Drawer.Overlay 
          className="fixed inset-0 z-40 bg-[rgba(30,58,95,0.4)] backdrop-blur-[4px] transition-all duration-300"
        />

        {/* Content panel */}
        <Drawer.Content
          className="fixed right-0 top-0 bottom-0 z-50 flex flex-col outline-none h-full"
          style={{
            width: 'min(420px, 100vw)',
            background: '#FFF8F1',
            boxShadow: '-20px 0 60px rgba(30,58,95,0.15)',
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 shrink-0" style={{ borderBottom: '1px solid rgba(229,189,190,0.5)' }}>
            <div className="flex items-center gap-3">
              <ShoppingBag className="w-5 h-5" style={{ color: '#E11D48' }} />
              <Drawer.Title className="text-xl font-bold" style={{ fontFamily: "'Playfair Display SC', serif", color: '#1E3A5F' }}>
                Your Cart
              </Drawer.Title>
              {items.length > 0 && (
                <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: '#E11D48' }}>
                  {items.reduce((s, i) => s + i.quantity, 0)}
                </span>
              )}
            </div>
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              onClick={toggleCart}
              className="w-9 h-9 rounded-full flex items-center justify-center cursor-pointer border-0 bg-transparent"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" style={{ color: '#1E3A5F' }} />
            </motion.button>
          </div>

          {/* Items */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            <AnimatePresence initial={false}>
              {items.length === 0 ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center h-full gap-4 text-center py-20"
                >
                  <span className="text-6xl">🛒</span>
                  <p className="text-lg font-medium" style={{ fontFamily: "'Playfair Display SC', serif", color: '#1E3A5F' }}>
                    Your cart is empty
                  </p>
                  <p className="text-sm" style={{ color: '#5C3F40', fontFamily: "'Karla', sans-serif" }}>
                    Add some premium treats for your furry friend!
                  </p>
                </motion.div>
              ) : (
                items.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 40, height: 0 }}
                    transition={{ type: 'spring', stiffness: 280, damping: 26 }}
                    className="flex gap-4 p-4 rounded-2xl glass-card"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold truncate" style={{ fontFamily: "'Playfair Display SC', serif", color: '#1E3A5F' }}>
                        {item.name}
                      </h4>
                      <p className="text-xs mt-0.5" style={{ color: '#906F70', fontFamily: "'Karla', sans-serif" }}>
                        ${item.price.toFixed(2)} each
                      </p>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-2">
                          <motion.button
                            whileTap={{ scale: 0.85 }}
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer border-0"
                            style={{ background: 'rgba(225,29,72,0.1)', color: '#E11D48' }}
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </motion.button>
                          <span className="w-6 text-center text-sm font-semibold" style={{ color: '#1E3A5F', fontFamily: "'Karla', sans-serif" }}>
                            {item.quantity}
                          </span>
                          <motion.button
                            whileTap={{ scale: 0.85 }}
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer border-0"
                            style={{ background: 'rgba(225,29,72,0.1)', color: '#E11D48' }}
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </motion.button>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => removeFromCart(item.id)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer border-0"
                          style={{ background: 'rgba(220,38,38,0.1)', color: '#DC2626' }}
                          aria-label={`Remove ${item.name}`}
                        >
                          <Trash2 className="w-3 h-3" />
                        </motion.button>
                      </div>
                    </div>
                    <div className="text-sm font-bold self-start" style={{ color: '#E11D48', fontFamily: "'Playfair Display SC', serif" }}>
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>

          {/* Footer checkout */}
          {items.length > 0 && (
            <motion.div
              layout
              className="px-6 py-5 shrink-0"
              style={{ borderTop: '1px solid rgba(229,189,190,0.5)' }}
            >
              <div className="flex justify-between items-center mb-2">
                <span style={{ color: '#5C3F40', fontFamily: "'Karla', sans-serif" }}>Subtotal</span>
                <span className="text-xl font-bold" style={{ color: '#1E3A5F', fontFamily: "'Playfair Display SC', serif" }}>
                  ${total.toFixed(2)}
                </span>
              </div>
              {total < 50 && (
                <p className="text-xs mb-4" style={{ color: '#E11D48', fontFamily: "'Karla', sans-serif" }}>
                  Add ${(50 - total).toFixed(2)} more for free shipping!
                </p>
              )}
              <motion.button
                whileHover={{ scale: 1.02, boxShadow: '0 16px 40px rgba(225,29,72,0.4)' }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                className="w-full py-4 rounded-2xl text-white font-semibold text-lg cursor-pointer border-0"
                style={{ background: 'linear-gradient(135deg, #E11D48, #B80035)', fontFamily: "'Karla', sans-serif" }}
              >
                Checkout — ${total.toFixed(2)}
              </motion.button>
            </motion.div>
          )}
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};
