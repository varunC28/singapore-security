import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import ProductCard from './ProductCard';
import ProductSkeleton from './ProductSkeleton';
import ProductDetailsModal from './ProductDetailsModal';
import { useProducts } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';

function CategoryAccordion({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="mb-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center py-4 bg-transparent transition-colors text-left"
      >
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-dark">{title}</h2>
          <div className="w-12 h-1 rounded-full bg-accent mt-3"></div>
        </div>
        <ChevronDown
          size={28}
          className={`text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="pt-6 pb-2">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ProductsSection() {
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const { categories } = useCategories();
  const { products, loading } = useProducts();

  const productsByCategory = useMemo(() => {
    const grouped: Record<string, typeof products> = {};
    categories.forEach(c => {
      grouped[c.id] = [];
    });
    const uncategorized: typeof products = [];

    products.forEach(p => {
      if (p.category_id && grouped[p.category_id]) {
        grouped[p.category_id].push(p);
      } else {
        uncategorized.push(p);
      }
    });
    
    return { grouped, uncategorized };
  }, [products, categories]);

  return (
    <section id="products" className="bg-white py-16 md:py-24">
      <div className="section-container">
        
        {loading ? (
          <div>
             <h2 className="text-3xl md:text-4xl font-bold text-dark">Our Products</h2>
             <div className="w-12 h-1 rounded-full bg-accent mt-3 mb-8"></div>
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 mt-8">
              {Array.from({ length: 8 }).map((_, i) => (
                <ProductSkeleton key={i} />
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {categories.map((category, index) => {
              const categoryProducts = productsByCategory.grouped[category.id] || [];

              return (
                <CategoryAccordion key={category.id} title={category.name} defaultOpen={index === 0}>
                  {categoryProducts.length > 0 ? (
                    <div 
                      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6"
                    >
                      {categoryProducts.map((product) => (
                        <motion.div
                          key={product.id}
                          layout
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          transition={{ duration: 0.3 }}
                        >
                          <ProductCard product={product} onClick={() => setSelectedProduct(product)} />
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-8 text-left text-gray-500 italic bg-gray-50 rounded-xl px-6 border border-gray-100">
                      Products for this category will be available soon.
                    </div>
                  )}
                </CategoryAccordion>
              );
            })}

            {productsByCategory.uncategorized.length > 0 && (
              <CategoryAccordion title="Other Products" defaultOpen={categories.length === 0}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                  {productsByCategory.uncategorized.map((product) => (
                    <ProductCard key={product.id} product={product} onClick={() => setSelectedProduct(product)} />
                  ))}
                </div>
              </CategoryAccordion>
            )}
            
            {products.length === 0 && (
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-dark">Our Products</h2>
                <div className="w-12 h-1 rounded-full bg-accent mt-3 mb-8"></div>
                <div className="py-12 text-center text-gray-500">
                  No products found.
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      
      <AnimatePresence>
        {selectedProduct && (
          <ProductDetailsModal 
            product={selectedProduct} 
            onClose={() => setSelectedProduct(null)} 
          />
        )}
      </AnimatePresence>
    </section>
  );
}
