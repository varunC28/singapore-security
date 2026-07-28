import { motion } from 'framer-motion';
import type { Product } from '@/types';
import { useCartStore } from '@/stores/cartStore';
import { formatPrice } from '@/lib/constants';
import QuantityStepper from './QuantityStepper';

interface ProductCardProps {
  product: Product;
  onClick?: () => void;
}

export default function ProductCard({ product, onClick }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const quantity = useCartStore((state) => state.items.find(i => i.product_id === product.id)?.quantity || 0);
  const inCart = quantity > 0;
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.in_stock) {
      addItem({
        product_id: product.id,
        name: product.name,
        price: product.price,
        image_url: product.image_url,
      });
    }
  };

  return (
    <motion.div
      onClick={onClick}
      whileHover={{ y: -4 }}
      className={`bg-dark rounded-2xl overflow-hidden product-card flex flex-col ${onClick ? 'cursor-pointer' : ''} ${!product.in_stock ? 'opacity-60' : ''}`}
    >
      <div className="aspect-square bg-white p-6 relative w-full">
        {product.image_url ? (
          <img 
            src={product.image_url} 
            alt={product.name} 
            className="w-full h-full object-contain"
          />
        ) : (
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
            <circle cx="12" cy="13" r="4"></circle>
          </svg>
        )}
      </div>
      
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-white font-semibold text-sm line-clamp-2 mb-2">
          {product.name}
        </h3>
        

        
        <div className="mt-auto">
          {product.mrp && product.mrp > product.price ? (
            <div className="mb-4">
              <div className="flex items-end gap-2 mb-0.5">
                <span className="text-red-500 font-semibold text-lg leading-none">-{Math.round(((product.mrp - product.price) / product.mrp) * 100)}%</span>
                <span className="text-white font-bold text-xl leading-none">{formatPrice(product.price)}</span>
              </div>
              <div className="text-gray-400 text-xs">
                M.R.P.: <span className="line-through">{formatPrice(product.mrp)}</span>
              </div>
            </div>
          ) : (
            <p className="text-white font-bold text-xl mb-4">
              {formatPrice(product.price)}
            </p>
          )}
          
          <div className="h-[44px]">
            {!product.in_stock ? (
              <button 
                disabled
                className="w-full h-full rounded-full bg-white/5 text-white/50 opacity-50 cursor-not-allowed font-medium"
              >
                Currently Unavailable
              </button>
            ) : inCart ? (
              <div onClick={e => e.stopPropagation()} className="h-full w-full">
                <QuantityStepper productId={product.id} quantity={quantity} />
              </div>
            ) : (
              <button 
                onClick={handleAddToCart}
                className="btn-glass w-full h-full rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-medium transition-colors min-h-[44px]"
              >
                Add to Cart
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
