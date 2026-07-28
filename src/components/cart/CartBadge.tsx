import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CartBadgeProps {
  count: number;
}

export const CartBadge: React.FC<CartBadgeProps> = ({ count }) => {
  return (
    <AnimatePresence>
      {count > 0 && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
          className="absolute -top-1 -right-1 w-5 h-5 bg-accent text-white text-[10px] font-bold flex items-center justify-center rounded-full z-10"
        >
          {count}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
