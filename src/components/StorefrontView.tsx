import React, { useMemo, useState } from 'react';
import { Sparkles, Truck, Coffee, Filter, SearchX } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { ProductCard } from './ProductCard';

export const StorefrontView: React.FC = () => {
  const { products, selectedCategory, setSelectedCategory, searchTerm } = useShop();
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc'>('default');

  // Dynamic unique categories
  const categories = useMemo(() => {
    const list = Array.from(new Set(products.map((p) => p.category)));
    return ['ทั้งหมด', ...list];
  }, [products]);

  // Filtered and sorted products
  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        const matchesCategory =
          selectedCategory === 'ทั้งหมด' || product.category === selectedCategory;
        const matchesSearch =
          searchTerm.trim() === '' ||
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.category.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        return 0;
      });
  }, [products, selectedCategory, searchTerm, sortBy]);

  return (
    <div className="space-y-8 pb-16 animate-fade-in">
      {/* Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-stone-900 via-stone-800 to-amber-950 text-white shadow-xl">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#d97706_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="relative max-w-4xl mx-auto px-6 py-12 sm:py-16 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold backdrop-blur-sm border border-amber-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>คัดสรรสินค้าคุณภาพสำหรับคนรักกาแฟและบ้าน</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            SLOW CRAFT STORE
          </h1>
          <p className="text-stone-300 text-sm sm:text-base max-w-xl mx-auto font-light leading-relaxed">
            สัมผัสศิลปะแห่งการสกัดกาแฟและของใช้สไตล์มินิมอล พร้อมโปรโมชั่นพิเศษ
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-stone-300">
            <div className="flex items-center gap-1.5 bg-white/10 px-3.5 py-1.5 rounded-full backdrop-blur-sm">
              <Truck className="w-4 h-4 text-amber-400" />
              <span>ส่งฟรีทั่วไทยเมื่อช้อปครบ ฿500</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/10 px-3.5 py-1.5 rounded-full backdrop-blur-sm">
              <Coffee className="w-4 h-4 text-amber-400" />
              <span>เมล็ดกาแฟคั่วใหม่ทุกสัปดาห์</span>
            </div>
          </div>
        </div>
      </div>

      {/* Categories & Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-amber-600 text-white shadow-sm shadow-amber-200'
                  : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Sort Selector */}
        <div className="flex items-center gap-2 self-end sm:self-auto text-xs sm:text-sm">
          <Filter className="w-4 h-4 text-stone-400" />
          <span className="text-stone-500 font-medium">เรียงตาม:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-white border border-stone-200 rounded-xl px-3 py-1.5 text-stone-700 outline-none focus:border-amber-500 transition-colors"
          >
            <option value="default">ค่าเริ่มต้น</option>
            <option value="price-asc">ราคา: ต่ำ → สูง</option>
            <option value="price-desc">ราคา: สูง → ต่ำ</option>
          </select>
        </div>
      </div>

      {/* Search Result Feedback */}
      {searchTerm && (
        <div className="text-xs text-stone-500">
          ผลการค้นหาสำหรับ "{searchTerm}": พบ {filteredProducts.length} รายการ
        </div>
      )}

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white rounded-3xl border border-stone-200 p-12 text-center text-stone-400 space-y-3">
          <SearchX className="w-12 h-12 mx-auto text-stone-300" />
          <h3 className="font-semibold text-stone-700 text-base">ไม่พบสินค้าที่คุณค้นหา</h3>
          <p className="text-xs text-stone-400 max-w-sm mx-auto">
            ลองปรับคำค้นหาหรือเลือกหมวดหมู่อื่นดูใหม่อีกครั้ง
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {/* Footer Info */}
      <footer className="mt-16 pt-8 border-t border-stone-200 text-center text-xs text-stone-400 space-y-2">
        <p>© 2026 SLOW CRAFT STORE. สงวนลิขสิทธิ์</p>
        <p>บริการจัดส่งพัสดุด่วนทุกวันจันทร์ - เสาร์ • รองรับการชำระเงินผ่าน PromptPay และ COD</p>
      </footer>
    </div>
  );
};
