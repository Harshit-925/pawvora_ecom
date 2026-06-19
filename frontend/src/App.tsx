import React, { Suspense } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { CategoryStrip } from './components/CategoryStrip';
import { ProductGrid } from './components/ProductGrid';
import { TrustBanner } from './components/TrustBanner';
import { ShopByPet } from './components/ShopByPet';
import { NutritionFeature } from './components/NutritionFeature';
import { Footer } from './components/Footer';
import { Cart } from './components/Cart';
import { Toaster } from 'sonner';

const App: React.FC = () => {
  return (
    <div vaul-drawer-wrapper="" className="bg-[#FFF8F1] min-h-screen flex flex-col">
      {/* Skip to main content — accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-xl focus:shadow-lg focus:text-white"
        style={{ background: '#E11D48' }}
      >
        Skip to main content
      </a>

      <Navbar />
      <Cart />

      <main id="main-content" tabIndex={-1} className="flex-grow">
        <Suspense fallback={
          <div className="min-h-screen flex items-center justify-center" aria-busy="true">
            <div className="w-10 h-10 border-4 rounded-full animate-spin" style={{ borderColor: 'rgba(225,29,72,0.2)', borderTopColor: '#E11D48' }} />
          </div>
        }>
          <HeroSection />
          <CategoryStrip />
          <ProductGrid />
          <TrustBanner />
          <ShopByPet />
          <NutritionFeature />
        </Suspense>
      </main>

      <Footer />
      <Toaster richColors closeButton position="bottom-right" />
    </div>
  );
};

export default App;
