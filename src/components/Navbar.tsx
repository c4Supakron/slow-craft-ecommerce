import React from 'react';
import { ShoppingBag, Store, ShieldCheck, Search } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const Navbar: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    cartCount,
    setIsCartOpen,
    searchTerm,
    setSearchTerm,
  } = useShop();

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Brand */}
          <div
            onClick={() => setCurrentView('store')}
            className="flex items-center gap-2 cursor-pointer select-none"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-600 flex items-center justify-center text-white shadow-sm shadow-amber-200">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-lg text-stone-900 tracking-tight block leading-tight">
                SLOW CRAFT
              </span>
              <span className="text-xs text-stone-500 block">ร้านค้าออนไลน์</span>
            </div>
          </div>

          {/* Search Bar (Only shown in Storefront mode) */}
          {currentView === 'store' && (
            <div className="flex-1 max-w-md hidden md:block">
              <div className="relative">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="ค้นหาชื่อสินค้า หมวดหมู่..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-sm bg-stone-100 hover:bg-stone-200/70 focus:bg-white border border-transparent focus:border-amber-500 rounded-full outline-none transition-colors"
                />
              </div>
            </div>
          )}

          {/* Actions: View toggle & Cart */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Toggle Storefront / Admin */}
            <button
              onClick={() => setCurrentView(currentView === 'store' ? 'admin' : 'store')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                currentView === 'admin'
                  ? 'bg-amber-100 text-amber-900 border border-amber-300'
                  : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
              }`}
            >
              {currentView === 'store' ? (
                <>
                  <ShieldCheck className="w-4 h-4 text-stone-500" />
                  <span className="hidden sm:inline">ระบบจัดการหลังบ้าน</span>
                  <span className="sm:hidden">หลังบ้าน</span>
                </>
              ) : (
                <>
                  <Store className="w-4 h-4 text-amber-700" />
                  <span>กลับหน้าร้านค้า</span>
                </>
              )}
            </button>

            {/* Cart Button */}
            {currentView === 'store' && (
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 rounded-full hover:bg-stone-100 text-stone-700 transition-colors"
                aria-label="ตะกร้าสินค้า"
              >
                <ShoppingBag className="w-6 h-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-amber-600 text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-sm">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Mobile Search Input */}
        {currentView === 'store' && (
          <div className="pb-3 md:hidden">
            <div className="relative">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="ค้นหาชื่อสินค้า หมวดหมู่..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm bg-stone-100 focus:bg-white border border-transparent focus:border-amber-500 rounded-full outline-none transition-colors"
              />
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
