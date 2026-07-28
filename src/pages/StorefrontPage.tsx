import { lazy, Suspense } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ProductsSection from '@/components/products/ProductsSection';
import { CartSheet } from '@/components/cart/CartSheet';

// Lazy-load the hero to avoid blocking initial paint with Three.js bundle
const HeroSection = lazy(() => import('@/components/hero/HeroSection'));

const StorefrontPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Header />
      
      <main className="flex-grow">
        {/* Hero — lazy loaded, with minimal fallback */}
        <Suspense
          fallback={
            <section className="min-h-screen bg-black flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
            </section>
          }
        >
          <HeroSection />
        </Suspense>

        <ProductsSection />
      </main>

      <Footer />
      
      <CartSheet />
    </div>
  );
};

export default StorefrontPage;
