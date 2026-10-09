import React, { useState } from 'react';
import { X, QrCode, Truck, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import type { CustomerInfo, PaymentMethod, Order } from '../types';

export const CheckoutModal: React.FC = () => {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cart,
    subtotal,
    shippingFee,
    grandTotal,
    placeOrder,
    setCurrentView,
  } = useShop();

  const [customer, setCustomer] = useState<CustomerInfo>({
    fullName: '',
    phone: '',
    address: '',
    postalCode: '',
  });

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('promptpay');
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [errors, setErrors] = useState<Partial<Record<keyof CustomerInfo, string>>>({});

  if (!isCheckoutOpen) return null;

  const validate = () => {
    const errs: Partial<Record<keyof CustomerInfo, string>> = {};
    if (!customer.fullName.trim()) errs.fullName = 'กรุณากรอกชื่อ-นามสกุล';
    if (!customer.phone.trim()) {
      errs.phone = 'กรุณากรอกเบอร์โทรศัพท์';
    } else if (!/^[0-9-+\s]{9,12}$/.test(customer.phone.trim())) {
      errs.phone = 'รูปแบบเบอร์โทรศัพท์ไม่ถูกต้อง';
    }
    if (!customer.address.trim()) errs.address = 'กรุณากรอกที่อยู่จัดส่ง';
    if (!customer.postalCode.trim()) errs.postalCode = 'กรุณากรอกรหัสไปรษณีย์';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const createdOrder = placeOrder(customer, paymentMethod);
    setCompletedOrder(createdOrder);
  };

  const handleClose = () => {
    setCompletedOrder(null);
    setIsCheckoutOpen(false);
  };

  const handleViewOrdersInAdmin = () => {
    handleClose();
    setCurrentView('admin');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto animate-fade-in">
      <div
        className="relative bg-white rounded-3xl max-w-2xl w-full my-8 p-6 sm:p-8 shadow-2xl border border-stone-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {completedOrder ? (
          /* Success Screen */
          <div className="text-center py-4 space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="text-xs uppercase font-bold tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                สั่งซื้อสำเร็จ
              </span>
              <h2 className="text-2xl font-bold text-stone-900 mt-2">
                ขอบคุณสำหรับการสั่งซื้อ!
              </h2>
              <p className="text-sm text-stone-500 mt-1">
                หมายเลขคำสั่งซื้อของคุณคือ{' '}
                <strong className="text-stone-900">{completedOrder.id}</strong>
              </p>
            </div>

            <div className="bg-stone-50 rounded-2xl p-4 sm:p-5 text-left border border-stone-200 text-xs sm:text-sm space-y-3">
              <div className="flex justify-between border-b border-stone-200 pb-2">
                <span className="text-stone-500">ผู้รับพัสดุ:</span>
                <span className="font-semibold text-stone-900">
                  {completedOrder.customer.fullName} ({completedOrder.customer.phone})
                </span>
              </div>
              <div className="flex justify-between border-b border-stone-200 pb-2">
                <span className="text-stone-500">ที่อยู่จัดส่ง:</span>
                <span className="font-medium text-stone-800 text-right max-w-xs">
                  {completedOrder.customer.address} {completedOrder.customer.postalCode}
                </span>
              </div>
              <div className="flex justify-between border-b border-stone-200 pb-2">
                <span className="text-stone-500">ช่องทางชำระเงิน:</span>
                <span className="font-semibold text-stone-900">
                  {completedOrder.paymentMethod === 'promptpay'
                    ? 'QR Code พร้อมเพย์'
                    : 'เก็บเงินปลายทาง (COD)'}
                </span>
              </div>
              <div className="flex justify-between pt-1 font-bold text-base text-stone-900">
                <span>ยอดชำระสุทธิ:</span>
                <span className="text-amber-700">
                  ฿{completedOrder.grandTotal.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={handleViewOrdersInAdmin}
                className="flex-1 py-3 px-4 rounded-xl font-medium text-xs sm:text-sm bg-stone-100 hover:bg-stone-200 text-stone-800 flex items-center justify-center gap-2 transition-colors"
              >
                <ShieldCheck className="w-4 h-4 text-amber-700" />
                ดูคำสั่งซื้อในระบบหลังบ้าน
              </button>
              <button
                onClick={handleClose}
                className="flex-1 py-3 px-4 rounded-xl font-medium text-xs sm:text-sm bg-amber-600 hover:bg-amber-700 text-white shadow-md shadow-amber-200 transition-colors"
              >
                เลือกซื้อสินค้าต่อ
              </button>
            </div>
          </div>
        ) : (
          /* Checkout Form */
          <div>
            <div className="mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-stone-900">
                เช็คเอาต์ / ชำระเงิน
              </h2>
              <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
                กรอกข้อมูลที่อยู่จัดส่งและเลือกวิธีการชำระเงิน
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Shipping Details */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-stone-800 flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-amber-600" /> ข้อมูลการจัดส่งพัสดุ
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-stone-600 mb-1">
                      ชื่อ-นามสกุล *
                    </label>
                    <input
                      type="text"
                      value={customer.fullName}
                      onChange={(e) => setCustomer({ ...customer, fullName: e.target.value })}
                      placeholder="สมชาย ใจดี"
                      className={`w-full px-3.5 py-2 text-sm rounded-xl border ${
                        errors.fullName ? 'border-rose-500 bg-rose-50/50' : 'border-stone-200'
                      } outline-none focus:border-amber-500 transition-colors`}
                    />
                    {errors.fullName && (
                      <p className="text-[11px] text-rose-500 mt-1">{errors.fullName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-600 mb-1">
                      เบอร์โทรศัพท์ *
                    </label>
                    <input
                      type="tel"
                      value={customer.phone}
                      onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                      placeholder="0812345678"
                      className={`w-full px-3.5 py-2 text-sm rounded-xl border ${
                        errors.phone ? 'border-rose-500 bg-rose-50/50' : 'border-stone-200'
                      } outline-none focus:border-amber-500 transition-colors`}
                    />
                    {errors.phone && (
                      <p className="text-[11px] text-rose-500 mt-1">{errors.phone}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-600 mb-1">
                    ที่อยู่จัดส่ง (บ้านเลขที่, ซอย, ถนน, ตำบล/แขวง, อำเภอ/เขต, จังหวัด) *
                  </label>
                  <textarea
                    rows={2}
                    value={customer.address}
                    onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                    placeholder="123/45 ซอยสุขุมวิท 55 แขวงคลองตันเหนือ เขตวัฒนา กรุงเทพฯ"
                    className={`w-full px-3.5 py-2 text-sm rounded-xl border ${
                      errors.address ? 'border-rose-500 bg-rose-50/50' : 'border-stone-200'
                    } outline-none focus:border-amber-500 transition-colors`}
                  />
                  {errors.address && (
                    <p className="text-[11px] text-rose-500 mt-1">{errors.address}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-600 mb-1">
                    รหัสไปรษณีย์ *
                  </label>
                  <input
                    type="text"
                    value={customer.postalCode}
                    onChange={(e) => setCustomer({ ...customer, postalCode: e.target.value })}
                    placeholder="10110"
                    maxLength={5}
                    className={`w-full sm:w-48 px-3.5 py-2 text-sm rounded-xl border ${
                      errors.postalCode ? 'border-rose-500 bg-rose-50/50' : 'border-stone-200'
                    } outline-none focus:border-amber-500 transition-colors`}
                  />
                  {errors.postalCode && (
                    <p className="text-[11px] text-rose-500 mt-1">{errors.postalCode}</p>
                  )}
                </div>
              </div>

              {/* Payment Method Selection */}
              <div className="space-y-3 pt-2 border-t border-stone-200">
                <h3 className="text-sm font-semibold text-stone-800 flex items-center gap-1.5">
                  <QrCode className="w-4 h-4 text-amber-600" /> วิธีการชำระเงิน
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div
                    onClick={() => setPaymentMethod('promptpay')}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      paymentMethod === 'promptpay'
                        ? 'border-amber-600 bg-amber-50/40 text-stone-900'
                        : 'border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <QrCode className="w-5 h-5 text-blue-700" />
                      <span className="font-semibold text-sm">QR Code พร้อมเพย์</span>
                    </div>
                    <p className="text-xs text-stone-500">
                      สแกนจ่ายทันทีผ่าน Mobile Banking ฟรีค่าธรรมเนียม
                    </p>
                  </div>

                  <div
                    onClick={() => setPaymentMethod('cod')}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      paymentMethod === 'cod'
                        ? 'border-amber-600 bg-amber-50/40 text-stone-900'
                        : 'border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Truck className="w-5 h-5 text-emerald-700" />
                      <span className="font-semibold text-sm">เก็บเงินปลายทาง (COD)</span>
                    </div>
                    <p className="text-xs text-stone-500">
                      ชำระเงินสดกับเจ้าหน้าที่จัดส่งพัสดุเมื่อสินค้าถึงบ้าน
                    </p>
                  </div>
                </div>

                {/* PromptPay QR Preview */}
                {paymentMethod === 'promptpay' && (
                  <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 flex flex-col items-center text-center space-y-2">
                    <div className="bg-blue-900 text-white font-bold text-xs tracking-wider py-1 px-4 rounded-md">
                      พร้อมเพย์ • PROMPTPAY
                    </div>
                    {/* QR Mock graphic */}
                    <div className="bg-white p-3 rounded-xl border border-stone-200 shadow-sm">
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=PROMPTPAY:SLOWCRAFT:${grandTotal}`}
                        alt="PromptPay QR Code"
                        className="w-36 h-36 mx-auto object-contain"
                      />
                    </div>
                    <p className="text-xs text-stone-600">
                      ยอดชำระ: <strong className="text-amber-700 font-bold text-sm">฿{grandTotal.toLocaleString()}</strong>
                    </p>
                    <p className="text-[11px] text-stone-400">
                      ชื่อบัญชี: บจก. สโลว์ คราฟท์ (ประเทศไทย)
                    </p>
                  </div>
                )}
              </div>

              {/* Order Recap */}
              <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-1.5 text-xs text-stone-600">
                <div className="flex justify-between">
                  <span>จำนวนสินค้าในรายการ</span>
                  <span className="font-semibold text-stone-800">{cart.length} รายการ</span>
                </div>
                <div className="flex justify-between">
                  <span>ยอดรวมสินค้า</span>
                  <span className="font-semibold text-stone-800">฿{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>ค่าจัดส่ง</span>
                  <span>{shippingFee === 0 ? <strong className="text-emerald-600">ฟรี</strong> : `฿${shippingFee}`}</span>
                </div>
                <div className="flex justify-between text-base font-bold text-stone-900 pt-2 border-t border-stone-200">
                  <span>ยอดชำระสุทธิ</span>
                  <span className="text-amber-700">฿{grandTotal.toLocaleString()}</span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-4 bg-amber-600 hover:bg-amber-700 text-white rounded-2xl font-semibold text-sm shadow-lg shadow-amber-200 transition-all active:scale-[0.99]"
              >
                ยืนยันการสั่งซื้อ (฿{grandTotal.toLocaleString()})
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
