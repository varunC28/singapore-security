import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '@/stores/cartStore';
import { useIsDesktop } from '@/hooks/useMediaQuery';
import { CartItem } from './CartItem';
import { formatPrice } from '@/lib/constants';
import EnquiryModal from '@/components/enquiry/EnquiryModal';

export const CartSheet: React.FC = () => {
  const items = useCartStore((state) => state.items);
  const isOpen = useCartStore((state) => state.isOpen);
  const closeCart = useCartStore((state) => state.closeCart);
  const totalItems = useCartStore((state) => state.totalItems());
  const totalPrice = useCartStore((state) => state.totalPrice());
  const isDesktop = useIsDesktop();
  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = React.useState(false);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />
          <motion.div
            initial={isDesktop ? { x: '100%' } : { y: '100%' }}
            animate={isDesktop ? { x: 0 } : { y: 0 }}
            exit={isDesktop ? { x: '100%' } : { y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed z-50 bg-white flex flex-col bottom-0 left-0 right-0 max-h-[85vh] rounded-t-3xl lg:top-0 lg:right-0 lg:left-auto lg:bottom-0 lg:w-96 lg:max-h-full lg:rounded-t-none lg:rounded-l-2xl shadow-2xl"
          >
            {/* Handle bar (mobile only) */}
            {!isDesktop && (
              <div className="w-full flex justify-center pt-3 pb-1">
                <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
              </div>
            )}

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-xl font-bold text-dark">
                Your Cart {totalItems > 0 && <span className="text-gray-400 text-base font-normal">({totalItems})</span>}
              </h2>
              <button 
                onClick={closeCart} 
                className="w-11 h-11 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Close cart"
              >
                <svg className="w-6 h-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-2">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12">
                  <svg className="w-16 h-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  <div className="space-y-1">
                    <p className="text-lg font-medium text-dark">Your cart is empty</p>
                    <button onClick={closeCart} className="text-sm text-accent font-medium hover:underline">
                      Browse Products
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col">
                  {items.map(item => (
                    <CartItem key={item.product_id} item={item} />
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-6 border-t border-gray-100 bg-white lg:rounded-bl-2xl">
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-bold text-dark">Subtotal</span>
                <span className="text-lg font-bold text-dark">{formatPrice(totalPrice)}</span>
              </div>
              {(() => {
                const messageText = items.length > 0 
                  ? `Hello! I would like to order the following items:\n${items.map(item => `⁃ ${item.name} (Qty: ${item.quantity})`).join('\n')}\n\nPlease connect with me!`
                  : `Hello, I have an enquiry.`;
                
                return (
                  <a 
                    href={items.length === 0 ? '#' : `https://wa.me/919424066666?text=${encodeURIComponent(messageText)}`}
                    target={items.length === 0 ? '_self' : '_blank'}
                    rel={items.length === 0 ? '' : 'noopener noreferrer'}
                    className={`btn-accent w-full text-center flex items-center justify-center ${items.length === 0 ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}`}
                    onClick={(e) => {
                      if (items.length === 0) e.preventDefault();
                    }}
                  >
                    Send Enquiry On WhatsApp
                  </a>
                );
              })()}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
