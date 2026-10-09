import React from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, Truck } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    setIsCheckoutOpen,
    updateCartQuantity,
    removeFromCart,
    subtotal,
    shippingFee,
    grandTotal,
  } = useShop();

  if (!isCartOpen) return null;

  const freeShippingThreshold = 500;
  const neededForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const freeShippingPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm animate-fade-in">
      <div
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-amber-600" />
            <h2 className="font-bold text-stone-900 text-lg">ตะกร้าสินค้า ({cart.length})</h2>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Meter */}
        <div className="bg-amber-50/70 p-3 sm:px-5 border-b border-amber-100">
          <div className="flex items-center gap-2 text-xs font-medium text-amber-900 mb-1.5">
            <Truck className="w-4 h-4 text-amber-600" />
            {subtotal >= freeShippingThreshold ? (
              <span className="text-emerald-700 font-semibold">🎉 คุณได้รับสิทธิ์จัดส่งฟรีทั่วประเทศ!</span>
            ) : (
              <span>
                ช้อปเพิ่มอีก <strong className="text-amber-800">฿{neededForFreeShipping.toLocaleString()}</strong> เพื่อส่งฟรี!
              </span>
            )}
          </div>
          <div className="w-full bg-amber-200/60 rounded-full h-1.5 overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                subtotal >= freeShippingThreshold ? 'bg-emerald-500' : 'bg-amber-600'
              }`}
              style={{ width: `${freeShippingPercent}%` }}
            />
          </div>
        </div>

        {/* Item List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 divide-y divide-stone-100">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-stone-400">
              <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center mb-4 text-stone-400">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <p className="font-medium text-stone-600">ยังไม่มีสินค้าในตะกร้า</p>
              <p className="text-xs text-stone-400 mt-1">
                เลือกดูสินค้าที่คุณชื่นชอบแล้วกดเพิ่มลงในตะกร้าได้เลย
              </p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.product.id} className="py-4 first:pt-0 last:pb-0 flex gap-4">
                {/* Product thumbnail */}
                <img
                  src={item.product.imageUrl}
                  alt={item.product.name}
                  className="w-18 h-18 sm:w-20 sm:h-20 object-cover rounded-xl bg-stone-100 border border-stone-100 shrink-0"
                />

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="text-sm font-semibold text-stone-900 line-clamp-1">
                      {item.product.name}
                    </h4>
                    <span className="text-xs text-stone-500 block mt-0.5">
                      ฿{item.product.price.toLocaleString()} / ชิ้น
                    </span>
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    {/* Quantity controls */}
                    <div className="flex items-center border border-stone-200 rounded-lg overflow-hidden bg-stone-50">
                      <button
                        onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                        className="w-7 h-7 flex items-center justify-center text-stone-600 hover:bg-stone-200 transition-colors"
                      >
                        -
                      </button>
                      <span className="w-8 text-center font-medium text-xs">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                        disabled={item.quantity >= item.product.stock}
                        className="w-7 h-7 flex items-center justify-center text-stone-600 hover:bg-stone-200 transition-colors disabled:opacity-30"
                      >
                        +
                      </button>
                    </div>

                    {/* Total & Remove */}
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-stone-900">
                        ฿{(item.product.price * item.quantity).toLocaleString()}
                      </span>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-stone-400 hover:text-rose-500 p-1 transition-colors"
                        title="ลบออกจากตะกร้า"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer & Checkout */}
        {cart.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-stone-200 bg-stone-50/50 space-y-3">
            <div className="space-y-1.5 text-xs text-stone-600">
              <div className="flex justify-between">
                <span>ยอดรวมสินค้า</span>
                <span className="font-semibold text-stone-900">฿{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>ค่าจัดส่ง</span>
                <span>
                  {shippingFee === 0 ? (
                    <span className="text-emerald-600 font-semibold">ส่งฟรี</span>
                  ) : (
                    `฿${shippingFee.toLocaleString()}`
                  )}
                </span>
              </div>
              <div className="flex justify-between text-base font-bold text-stone-900 pt-2 border-t border-stone-200">
                <span>ยอดสุทธิ</span>
                <span className="text-amber-700">฿{grandTotal.toLocaleString()}</span>
              </div>
            </div>

            <button
              onClick={handleProceedToCheckout}
              className="w-full py-3.5 px-4 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-medium text-sm flex items-center justify-center gap-2 shadow-md shadow-amber-200 transition-all active:scale-[0.99]"
            >
              <span>ดำเนินการสั่งซื้อ</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
