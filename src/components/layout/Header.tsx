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
    <div className="fixed top-4 left-0 right-0 z-50 flex justify-center w-full px-4 pointer-events-none">
      <motion.header
        className={`pointer-events-auto w-max transition-all duration-300 rounded-full border ${
          isScrolled ? 'bg-black/80 backdrop-blur-xl border-white/10 shadow-2xl' : 'bg-transparent border-transparent'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
      >
        <div className="flex items-center justify-center gap-8 h-[56px] md:h-[64px] px-6 mx-auto w-full">
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
    </div>
  );
}
