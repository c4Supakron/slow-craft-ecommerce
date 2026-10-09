import React, { useState } from 'react';
import { X, ShoppingBag, Check, AlertCircle } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const ProductDetailModal: React.FC = () => {
  const { selectedProduct, setSelectedProduct, addToCart } = useShop();
  const [quantity, setQuantity] = useState(1);
  const [addedSuccess, setAddedSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!selectedProduct) return null;

  const isOutOfStock = selectedProduct.stock <= 0;

  const handleAdd = () => {
    if (isOutOfStock) return;
    setErrorMessage('');
    const res = addToCart(selectedProduct, quantity);
    if (res.success) {
      setAddedSuccess(true);
      setTimeout(() => setAddedSuccess(false), 2000);
    } else {
      setErrorMessage(res.message || 'ไม่สามารถเพิ่มสินค้าได้');
    }
  };

  const increment = () => {
    if (quantity < selectedProduct.stock) {
      setQuantity((q) => q + 1);
    }
  };

  const decrement = () => {
    if (quantity > 1) {
      setQuantity((q) => q - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div
        className="relative bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-stone-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => setSelectedProduct(null)}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 hover:bg-white text-stone-600 hover:text-stone-900 shadow-sm transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Image */}
          <div className="relative aspect-square md:aspect-auto md:h-full bg-stone-100">
            <img
              src={selectedProduct.imageUrl}
              alt={selectedProduct.name}
              className={`w-full h-full object-cover ${
                isOutOfStock ? 'grayscale opacity-80' : ''
              }`}
            />
            {isOutOfStock && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <span className="bg-rose-600 text-white font-bold text-sm px-4 py-1.5 rounded-full shadow-lg">
                  สินค้าหมดชั่วคราว
                </span>
              </div>
            )}
          </div>

          {/* Details */}
          <div className="p-6 md:p-8 flex flex-col justify-between gap-6">
            <div className="space-y-3">
              <span className="inline-block bg-amber-50 text-amber-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                {selectedProduct.category}
              </span>
              <h2 className="text-xl md:text-2xl font-bold text-stone-900 leading-snug">
                {selectedProduct.name}
              </h2>
              <div className="flex items-baseline gap-3">
                <span className="text-2xl font-bold text-stone-900">
                  ฿{selectedProduct.price.toLocaleString()}
                </span>
                <span className="text-xs text-stone-500">
                  คงเหลือ: {selectedProduct.stock} ชิ้น
                </span>
              </div>
              <p className="text-sm text-stone-600 leading-relaxed pt-2 border-t border-stone-100">
                {selectedProduct.description}
              </p>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="p-3 bg-rose-50 text-rose-700 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Controls */}
            {!isOutOfStock ? (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <span className="text-xs text-stone-500 font-medium">จำนวน:</span>
                  <div className="flex items-center border border-stone-200 rounded-xl overflow-hidden bg-stone-50">
                    <button
                      onClick={decrement}
                      disabled={quantity <= 1}
                      className="w-9 h-9 flex items-center justify-center text-stone-600 hover:bg-stone-200 transition-colors disabled:opacity-30"
                    >
                      -
                    </button>
                    <span className="w-10 text-center font-semibold text-sm">
                      {quantity}
                    </span>
                    <button
                      onClick={increment}
                      disabled={quantity >= selectedProduct.stock}
                      className="w-9 h-9 flex items-center justify-center text-stone-600 hover:bg-stone-200 transition-colors disabled:opacity-30"
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleAdd}
                  className={`w-full py-3.5 px-6 rounded-2xl font-medium text-sm flex items-center justify-center gap-2 transition-all shadow-md ${
                    addedSuccess
                      ? 'bg-emerald-600 text-white'
                      : 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-200'
                  }`}
                >
                  {addedSuccess ? (
                    <>
                      <Check className="w-4 h-4" /> เพิ่มลงในตะกร้าแล้ว!
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" /> เพิ่มลงตะกร้า (฿
                      {(selectedProduct.price * quantity).toLocaleString()})
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div className="p-4 bg-stone-100 rounded-2xl text-center text-sm text-stone-500">
                ขณะนี้สินค้าหมดสต็อก คุณสามารถติดต่อสอบถามทางร้านได้
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
