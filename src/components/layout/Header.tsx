import { useState } from 'react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { useCartStore } from '@/stores/cartStore';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();
  const totalItems = useCartStore((state) => state.items.reduce((sum, item) => sum + item.quantity, 0));
  const toggleCart = useCartStore((state) => state.toggleCart);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50);
  });

  return (
    <motion.header
      className={`fixed top-0 left-0 w-full z-50 transition-colors duration-300 ${
        isScrolled ? 'bg-black/80 backdrop-blur-xl' : 'bg-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
    >
      <div className="section-container flex items-center justify-between h-[56px] md:h-[64px] px-4 md:px-8 mx-auto w-full max-w-7xl">
        <div>
          <span className="text-xl md:text-lg font-bold text-white">Singapore Security</span>
        </div>
        
        <button
          onClick={toggleCart}
          className="relative flex items-center justify-center min-w-[44px] min-h-[44px] text-white"
          aria-label="Open cart"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <path d="M16 10a4 4 0 0 1-8 0"></path>
          </svg>
          
          {totalItems > 0 && (
            <span className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-accent rounded-full transform translate-x-1 -translate-y-1">
              {totalItems}
            </span>
          )}
        </button>
      </div>
    </motion.header>
  );
}
