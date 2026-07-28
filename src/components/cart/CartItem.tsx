import React from 'react';
import { useCartStore } from '@/stores/cartStore';
import { formatPrice } from '@/lib/constants';
import type { CartItem as CartItemType } from '@/types';

interface CartItemProps {
  item: CartItemType;
}

export const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);

  const handleDecrement = () => {
    if (item.quantity > 1) {
      updateQuantity(item.product_id, item.quantity - 1);
    } else {
      removeItem(item.product_id);
    }
  };

  const handleIncrement = () => {
    updateQuantity(item.product_id, item.quantity + 1);
  };

  return (
    <div className="flex flex-row gap-3 py-3 border-b border-gray-100 last:border-0">
      <div className="w-12 h-12 rounded-lg bg-gray-100 flex-shrink-0 overflow-hidden flex items-center justify-center">
        {item.image_url ? (
          <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
        ) : (
          <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        )}
      </div>
      <div className="flex-1 flex flex-col justify-center min-w-0">
        <h4 className="text-sm font-medium text-dark line-clamp-1">{item.name}</h4>
        <span className="text-xs text-gray-500">{formatPrice(item.price)}</span>
      </div>
      <div className="flex flex-col items-end justify-between">
        <div className="text-sm font-semibold text-dark">
          {formatPrice(item.price * item.quantity)}
        </div>
        <div className="flex items-center gap-1 mt-2">
          <button 
            onClick={handleDecrement} 
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-sm font-semibold text-dark transition-colors"
          >
            –
          </button>
          <span className="w-6 text-center text-sm font-semibold">{item.quantity}</span>
          <button 
            onClick={handleIncrement} 
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-sm font-semibold text-dark transition-colors"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
};
