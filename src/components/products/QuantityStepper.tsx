import { motion } from 'framer-motion';
import { useCartStore } from '@/stores/cartStore';

interface QuantityStepperProps {
  productId: string;
  quantity: number;
}

export default function QuantityStepper({ productId, quantity }: QuantityStepperProps) {
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);

  const handleDecrement = () => {
    if (quantity <= 1) {
      removeItem(productId);
    } else {
      updateQuantity(productId, quantity - 1);
    }
  };

  const handleIncrement = () => {
    updateQuantity(productId, quantity + 1);
  };

  return (
    <div className="flex items-center justify-between w-full h-[44px] bg-white/10 rounded-full border border-white/20 px-1 btn-glass">
      <button
        onClick={handleDecrement}
        className="flex items-center justify-center min-w-[44px] min-h-[44px] text-white rounded-full hover:bg-white/10 transition-colors"
        aria-label="Decrease quantity"
      >
        –
      </button>
      
      <motion.span 
        key={quantity}
        initial={{ scale: 1.2, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-white font-semibold min-w-[20px] text-center"
      >
        {quantity}
      </motion.span>
      
      <button
        onClick={handleIncrement}
        className="flex items-center justify-center min-w-[44px] min-h-[44px] text-white rounded-full hover:bg-white/10 transition-colors"
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  );
}
