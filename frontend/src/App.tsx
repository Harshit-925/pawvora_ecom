import React, { Suspense } from 'react';
import { InputForm } from './components/InputForm';
import { ResultsPanel } from './components/ResultsPanel';
import { motion, useScroll, useTransform } from 'framer-motion';
import { PawPrint } from 'lucide-react';

const App: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const yOffset = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  return (
    <>
      {/* Skip to main content — accessibility requirement */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4
                   focus:z-50 focus:bg-brand-dark focus:text-white focus:px-4 focus:py-2 focus:rounded focus:shadow-lg"
      >
        Skip to main content
      </a>

      <div className="min-h-screen bg-brand-light selection:bg-brand-primary/30 relative">
        
        {/* Dynamic Background Pattern */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
           <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-primary/5 rounded-full blur-3xl" />
           <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-brand-accent/5 rounded-full blur-3xl" />
        </div>

        {/* Header */}
        <header className="relative z-10 border-b border-gray-100 bg-white/60 backdrop-blur-xl px-6 py-4 sticky top-0">
          <div className="max-w-6xl mx-auto flex items-center gap-3">
            <div className="bg-brand-dark p-2 rounded-xl">
              <PawPrint className="w-5 h-5 text-brand-primary" />
            </div>
            <div>
              <h1 className="text-xl font-display font-bold text-brand-dark tracking-tight">Kibble<span className="text-brand-primary">AI</span></h1>
            </div>
          </div>
        </header>

        {/* Hero Section (Scrolling animation target) */}
        <motion.div 
          style={{ opacity, y: yOffset }}
          className="relative z-10 max-w-4xl mx-auto px-6 pt-20 pb-12 text-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <span className="inline-block py-1 px-3 rounded-full bg-brand-primary/10 text-brand-primary font-medium text-sm mb-6 border border-brand-primary/20">
              Biologically Appropriate Nutrition
            </span>
            <h2 className="text-5xl md:text-7xl font-display font-extrabold text-brand-dark tracking-tight mb-6 leading-[1.1]">
              Feed them exactly <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-emerald-400">
                what they need.
              </span>
            </h2>
            <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto">
              Our AI nutritionist analyzes your pet's unique biology to create a dynamic feeding plan that adapts as they grow.
            </p>
          </motion.div>
        </motion.div>

        {/* Main Content */}
        <main id="main-content" className="relative z-10 max-w-6xl mx-auto px-6 pb-24" tabIndex={-1}>
          <Suspense fallback={
            <div aria-busy="true" className="flex justify-center p-12">
              <div className="w-8 h-8 border-4 border-brand-primary/30 border-t-brand-primary rounded-full animate-spin" />
            </div>
          }>
            <div className="grid lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-7">
                <InputForm />
              </div>
              <div className="lg:col-span-5 lg:sticky lg:top-24 h-full min-h-[500px]">
                <ResultsPanel />
              </div>
            </div>
          </Suspense>
        </main>
      </div>
    </>
  );
};

export default App;
