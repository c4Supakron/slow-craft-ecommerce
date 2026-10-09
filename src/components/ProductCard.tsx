import React from 'react';
import { ShoppingCart, AlertCircle } from 'lucide-react';
import type { Product } from '../types';
import { useShop } from '../context/ShopContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, setSelectedProduct } = useShop();

  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 3;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOutOfStock) return;
    const res = addToCart(product);
    if (!res.success && res.message) {
      alert(res.message);
    }
  };

  return (
    <div
      onClick={() => setSelectedProduct(product)}
      className="group bg-white rounded-2xl overflow-hidden border border-stone-200 hover:border-amber-400 hover:shadow-lg transition-all duration-200 flex flex-col cursor-pointer"
    >
      {/* Product Image & Badges */}
      <div className="relative aspect-square w-full overflow-hidden bg-stone-100">
        <img
          src={product.imageUrl}
          alt={product.name}
          className={`w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300 ${
            isOutOfStock ? 'grayscale opacity-75' : ''
          }`}
          loading="lazy"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {isOutOfStock ? (
            <span className="bg-rose-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm">
              สินค้าหมด
            </span>
          ) : isLowStock ? (
            <span className="bg-amber-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> เหลือ {product.stock} ชิ้น
            </span>
          ) : null}
        </div>

        <span className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm text-stone-700 text-[11px] font-medium px-2 py-0.5 rounded-md shadow-sm">
          {product.category}
        </span>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between gap-3">
        <div>
          <h3 className="font-semibold text-stone-900 line-clamp-1 group-hover:text-amber-700 transition-colors">
            {product.name}
          </h3>
          <p className="text-xs text-stone-500 line-clamp-2 mt-1">
            {product.description}
          </p>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-stone-100">
          <div>
            <span className="text-xs text-stone-400 block">ราคา</span>
            <span className="text-lg font-bold text-stone-900">
              ฿{product.price.toLocaleString()}
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`p-2.5 rounded-xl flex items-center justify-center transition-all ${
              isOutOfStock
                ? 'bg-stone-100 text-stone-400 cursor-not-allowed'
                : 'bg-amber-600 hover:bg-amber-700 text-white active:scale-95 shadow-sm shadow-amber-200'
            }`}
            title={isOutOfStock ? 'สินค้าหมดชั่วคราว' : 'เพิ่มลงตะกร้า'}
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
