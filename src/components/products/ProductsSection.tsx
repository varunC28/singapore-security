import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CategoryTabs from './CategoryTabs';
import ProductCard from './ProductCard';
import ProductSkeleton from './ProductSkeleton';
import { useProducts } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';

export default function ProductsSection() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const { categories } = useCategories();
  const { products, loading } = useProducts({ categoryId: activeCategory });

  return (
    <section id="products" className="bg-white py-16 md:py-24">
      <div className="section-container">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-dark">Our Products</h2>
          <div className="w-12 h-1 rounded-full bg-accent mt-3 mb-8"></div>
        </div>
        
        <CategoryTabs 
          categories={categories} 
          activeCategory={activeCategory} 
          onSelect={setActiveCategory} 
        />
        
        <div className="mt-8">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <ProductSkeleton key={i} />
              ))}
            </div>
          ) : (
            <>
              <motion.div 
                layout
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6"
              >
                <AnimatePresence mode="popLayout">
                  {products.map((product) => (
                    <motion.div
                      key={product.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ProductCard product={product} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
              
              {products.length === 0 && (
                <div className="py-12 text-center text-gray-500">
                  No products found in this category.
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
