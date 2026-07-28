import { lazy, Suspense } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ProductsSection from '@/components/products/ProductsSection';
import { CartSheet } from '@/components/cart/CartSheet';
import { SEO } from '@/components/seo/SEO';

// Lazy-load the hero to avoid blocking initial paint with Three.js bundle
const HeroSection = lazy(() => import('@/components/hero/HeroSection'));

const StorefrontPage: React.FC = () => {
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Singapore Security",
    "image": "https://singapore-security.vercel.app/og-image.jpg",
    "@id": "https://singapore-security.vercel.app",
    "url": "https://singapore-security.vercel.app",
    "telephone": "+919424066666",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "LG 16A Silver Mall 8, RNT Road",
      "addressLocality": "Indore",
      "postalCode": "452001",
      "addressRegion": "Madhya Pradesh",
      "addressCountry": "IN"
    },
    "sameAs": [
      "https://www.justdial.com/Indore/Singapore-Security-Rnt-Road/0731PX731-X731-140228122250-L3H8_BZDET",
      "https://www.facebook.com/bmccctv/",
      "https://www.exportersindia.com/singapore-security/",
      "https://in.linkedin.com/in/bm-chaturvedi-81b55458"
    ]
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <SEO 
        title="Singapore Security | Best CCTV Camera Dealer in Indore"
        description="Singapore Security is the top dealer in Indore for premium CCTV cameras, DVRs, NVRs, CP Plus products, and security accessories. Modern Security, Modern Trust."
        jsonLd={localBusinessSchema}
      />
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
