import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useDragControls } from 'framer-motion';
import { X, ChevronDown } from 'lucide-react';
import type { Product } from '@/types';
import { formatPrice } from '@/lib/constants';
import { useCartStore } from '@/stores/cartStore';
import QuantityStepper from './QuantityStepper';

interface ProductDetailsModalProps {
  product: Product;
  onClose: () => void;
}

function Accordion({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-gray-200 last:border-b-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center py-4 bg-gray-50/50 hover:bg-gray-100/50 transition-colors px-4"
      >
        <span className="font-semibold text-gray-900">{title}</span>
        <ChevronDown
          size={20}
          className={`text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-4 bg-white">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ProductDetailsModal({ product, onClose }: ProductDetailsModalProps) {
  const addItem = useCartStore((state) => state.addItem);
  const dragControls = useDragControls();
  
  const quantity = useCartStore((state) => state.items.find(i => i.product_id === product.id)?.quantity || 0);
  const inCart = quantity > 0;

  const handleAddToCart = () => {
    if (product.in_stock) {
      addItem({
        product_id: product.id,
        name: product.name,
        price: product.price,
        image_url: product.image_url,
      });
    }
  };

  // Prevent background scrolling when modal is open (with strict iOS Safari fix)
  useEffect(() => {
    const scrollY = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      window.scrollTo(0, scrollY);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center sm:p-6">
      {/* Blurred Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      {/* Modal Content */}
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        drag="y"
        dragControls={dragControls}
        dragListener={false}
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0, bottom: 0.5 }}
        onDragEnd={(_, info) => {
          if (info.offset.y > 100 || info.velocity.y > 500) {
            onClose();
          }
        }}
        className="relative bg-white sm:rounded-2xl shadow-2xl w-full max-w-4xl min-h-[100dvh] h-[100dvh] sm:min-h-0 sm:h-auto max-h-[100dvh] sm:max-h-[90vh] overflow-y-auto overscroll-none md:overflow-hidden flex flex-col md:flex-row z-10"
      >
        {/* Mobile Drag Handle */}
        <div 
          className="w-full flex justify-center pt-4 pb-2 md:hidden sticky top-0 bg-white/80 backdrop-blur z-50 touch-none cursor-grab"
          onPointerDown={(e) => dragControls.start(e)}
        >
          <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
        </div>

        {/* Floating Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 p-2 bg-white/90 backdrop-blur shadow-md hover:bg-gray-100 rounded-full text-gray-600 hover:text-gray-900 transition-all border border-gray-200"
        >
          <X size={20} />
        </button>

        {/* Left Side: Image */}
        <div className="w-full md:w-2/5 bg-gray-50 flex flex-col p-8 pt-4 md:pt-8 border-r border-gray-100 shrink-0">
          <div className="aspect-square w-full relative mb-6">
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-contain mix-blend-multiply"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 rounded-xl flex items-center justify-center">
                <span className="text-gray-400">No image</span>
              </div>
            )}
          </div>

          <div className="mt-auto space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 leading-tight">
              {product.name}
            </h2>
            <div>
              {product.mrp && product.mrp > product.price ? (
                <div className="mb-2">
                  <div className="flex items-end gap-3 mb-1">
                    <span className="text-red-600 font-semibold text-3xl leading-none">-{Math.round(((product.mrp - product.price) / product.mrp) * 100)}%</span>
                    <span className="text-gray-900 font-extrabold text-4xl leading-none">{formatPrice(product.price)}</span>
                  </div>
                  <div className="text-gray-600 font-medium text-sm">
                    M.R.P.: <span className="line-through">{formatPrice(product.mrp)}</span>
                  </div>
                </div>
              ) : (
                <div className="text-3xl font-extrabold text-gray-900 mb-2">
                  {formatPrice(product.price)}
                </div>
              )}
              <div className="text-sm font-semibold text-gray-800">
                Inclusive of all taxes
              </div>
            </div>

            <div className="h-[48px] mt-4">
              {!product.in_stock ? (
                <button
                  disabled
                  className="w-full h-full rounded-xl bg-gray-100 text-gray-400 cursor-not-allowed font-medium border border-gray-200"
                >
                  Out of Stock
                </button>
              ) : inCart ? (
                <div className="bg-gray-900 rounded-3xl h-full flex items-center justify-center">
                  <QuantityStepper productId={product.id} quantity={quantity} />
                </div>
              ) : (
                <button
                  onClick={handleAddToCart}
                  className="w-full h-full rounded-xl bg-[#3b82f6] hover:bg-blue-600 text-white font-medium transition-colors shadow-sm"
                >
                  Add to Cart
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Details Accordion */}
        <div className="w-full md:w-3/5 md:overflow-y-auto bg-white flex flex-col flex-1">
          <div className="p-6 flex-1 pt-8 md:pt-6">
            <div className="flex justify-between items-center mb-6 border-b border-gray-200 pb-2">
              <h3 className="text-lg font-bold text-gray-900">Product information</h3>
            </div>

            <div className="border border-gray-200 rounded-xl overflow-hidden">
              {product.description && (
                <Accordion title="Description" defaultOpen={true}>
                  <p className="text-gray-600 whitespace-pre-line text-sm leading-relaxed">
                    {product.description}
                  </p>
                </Accordion>
              )}

              {product.specs && product.specs.map((group, gIndex) => (
                <Accordion key={gIndex} title={group.group || 'Specifications'} defaultOpen={!product.description && gIndex === 0}>
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <table className="w-full text-sm text-left">
                      <tbody className="divide-y divide-gray-200">
                        {group.items.map((spec, i) => (
                          <tr key={i} className="even:bg-gray-50/50">
                            <th className="px-4 py-3 font-semibold text-gray-700 bg-gray-50/80 w-1/3 align-top border-r border-gray-200">
                              {spec.label}
                            </th>
                            <td className="px-4 py-3 text-gray-600 align-top">
                              {spec.value}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Accordion>
              ))}

              {/* Only show if empty */}
              {!product.description && (!product.specs || product.specs.length === 0) && (
                <div className="p-8 text-center text-gray-500">
                  No additional information available for this product.
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
