import React from 'react';
import { ShopProvider, useShop } from './context/ShopContext';
import { Navbar } from './components/Navbar';
import { StorefrontView } from './components/StorefrontView';
import { AdminView } from './components/AdminView';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { ProductDetailModal } from './components/ProductDetailModal';

const MainLayout: React.FC = () => {
  const { currentView } = useShop();

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {currentView === 'store' ? <StorefrontView /> : <AdminView />}
      </main>

      {/* Overlays & Modals */}
      <CartDrawer />
      <CheckoutModal />
      <ProductDetailModal />
    </div>
  );
};

export function App() {
  return (
    <ShopProvider>
      <MainLayout />
    </ShopProvider>
  );
}

export default App;
