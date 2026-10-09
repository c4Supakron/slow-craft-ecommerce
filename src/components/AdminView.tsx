import React, { useState } from 'react';
import {
  Package,
  ShoppingBag,
  TrendingUp,
  AlertTriangle,
  Plus,
  Edit2,
  Trash2,
  X,
  RotateCcw,
  CheckCircle,
  Clock,
  XCircle,
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import type { Product, OrderStatus } from '../types';

export const AdminView: React.FC = () => {
  const {
    products,
    orders,
    addProduct,
    updateProduct,
    deleteProduct,
    updateOrderStatus,
    resetDefaultData,
  } = useShop();

  const [activeTab, setActiveTab] = useState<'products' | 'orders'>('products');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [productForm, setProductForm] = useState<Omit<Product, 'id'>>({
    name: '',
    description: '',
    price: 0,
    category: 'อุปกรณ์กาแฟ',
    stock: 10,
    imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
  });

  // Analytics
  const totalRevenue = orders
    .filter((o) => o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.grandTotal, 0);

  const lowStockProducts = products.filter((p) => p.stock <= 3);

  const handleOpenAdd = () => {
    setProductForm({
      name: '',
      description: '',
      price: 190,
      category: 'อุปกรณ์กาแฟ',
      stock: 10,
      imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (product: Product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      stock: product.stock,
      imageUrl: product.imageUrl,
    });
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.name.trim()) return alert('กรุณาระบุชื่อสินค้า');
    if (productForm.price <= 0) return alert('กรุณาระบุราคาที่ถูกต้อง');

    if (editingProduct) {
      updateProduct({
        ...editingProduct,
        ...productForm,
      });
      setEditingProduct(null);
    } else {
      addProduct(productForm);
      setIsAddModalOpen(false);
    }
  };

  const statusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
            <Clock className="w-3 h-3" /> รอจัดส่ง
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
            <CheckCircle className="w-3 h-3" /> สำเร็จแล้ว
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-800">
            <XCircle className="w-3 h-3" /> ยกเลิก
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Top Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
            ระบบจัดการร้านค้า (Admin)
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            จัดการรายการสินค้า ตรวจสอบสต็อก และติดตามคำสั่งซื้อของลูกค้า
          </p>
        </div>

        <button
          onClick={() => {
            if (confirm('คุณต้องการรีเซ็ตข้อมูลทั้งหมดกลับเป็นค่าเริ่มต้นหรือไม่?')) {
              resetDefaultData();
            }
          }}
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-stone-600 bg-stone-100 hover:bg-stone-200 transition-colors self-start sm:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          รีเซ็ตข้อมูลตัวอย่าง (Reset Demo)
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-50 rounded-xl text-amber-700">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-stone-500 font-medium block">สินค้าทั้งหมด</span>
            <span className="text-xl sm:text-2xl font-bold text-stone-900">{products.length} รายการ</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 rounded-xl text-blue-700">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-stone-500 font-medium block">คำสั่งซื้อทั้งหมด</span>
            <span className="text-xl sm:text-2xl font-bold text-stone-900">{orders.length} ออเดอร์</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 rounded-xl text-emerald-700">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-stone-500 font-medium block">ยอดขายสะสม</span>
            <span className="text-xl sm:text-2xl font-bold text-emerald-700">
              ฿{totalRevenue.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-rose-50 rounded-xl text-rose-700">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-stone-500 font-medium block">สต็อกใกล้หมด/หมด</span>
            <span className="text-xl sm:text-2xl font-bold text-rose-700">
              {lowStockProducts.length} รายการ
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-stone-200 gap-4">
        <button
          onClick={() => setActiveTab('products')}
          className={`pb-3 font-semibold text-sm transition-all border-b-2 flex items-center gap-2 ${
            activeTab === 'products'
              ? 'border-amber-600 text-amber-700'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <Package className="w-4 h-4" /> จัดการสินค้า ({products.length})
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 font-semibold text-sm transition-all border-b-2 flex items-center gap-2 ${
            activeTab === 'orders'
              ? 'border-amber-600 text-amber-700'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <ShoppingBag className="w-4 h-4" /> รายการคำสั่งซื้อ ({orders.length})
        </button>
      </div>

      {/* Tab 1: Products Management */}
      {activeTab === 'products' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-stone-900">รายการสินค้าในร้าน</h2>
            <button
              onClick={handleOpenAdd}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs sm:text-sm font-medium flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" /> เพิ่มสินค้าใหม่
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-semibold">
                  <tr>
                    <th className="p-4">รูปภาพ</th>
                    <th className="p-4">ชื่อสินค้า</th>
                    <th className="p-4">หมวดหมู่</th>
                    <th className="p-4">ราคา</th>
                    <th className="p-4">สต็อกคงเหลือ</th>
                    <th className="p-4 text-right">จัดการ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {products.map((product) => (
                    <tr key={product.id} className="hover:bg-stone-50/50 transition-colors">
                      <td className="p-4 w-16">
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded-lg bg-stone-100"
                        />
                      </td>
                      <td className="p-4 font-semibold text-stone-900 max-w-xs">
                        <p className="truncate">{product.name}</p>
                        <p className="text-[11px] font-normal text-stone-400 truncate">
                          {product.description}
                        </p>
                      </td>
                      <td className="p-4 text-stone-600">{product.category}</td>
                      <td className="p-4 font-bold text-stone-900">
                        ฿{product.price.toLocaleString()}
                      </td>
                      <td className="p-4">
                        <span
                          className={`font-semibold px-2 py-0.5 rounded-md text-xs ${
                            product.stock === 0
                              ? 'bg-rose-100 text-rose-700'
                              : product.stock <= 3
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-emerald-100 text-emerald-700'
                          }`}
                        >
                          {product.stock} ชิ้น
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenEdit(product)}
                            className="p-1.5 text-stone-500 hover:text-amber-700 hover:bg-stone-100 rounded-lg transition-colors"
                            title="แก้ไขสินค้า"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`คุณต้องการลบ "${product.name}" หรือไม่?`)) {
                                deleteProduct(product.id);
                              }
                            }}
                            className="p-1.5 text-stone-500 hover:text-rose-600 hover:bg-stone-100 rounded-lg transition-colors"
                            title="ลบสินค้า"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Orders List */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-stone-900">ประวัติคำสั่งซื้อ</h2>

          {orders.length === 0 ? (
            <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center text-stone-400">
              <ShoppingBag className="w-12 h-12 mx-auto mb-3 opacity-40" />
              <p className="font-semibold text-stone-600">ยังไม่มีคำสั่งซื้อ</p>
              <p className="text-xs text-stone-400 mt-1">
                เมื่อลูกค้าสั่งซื้อสินค้าจากหน้าร้าน รายการคำสั่งซื้อจะปรากฏที่นี่
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl border border-stone-200 p-5 sm:p-6 shadow-sm space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-base text-stone-900">{order.id}</span>
                        {statusBadge(order.status)}
                      </div>
                      <span className="text-xs text-stone-400">
                        เวลาสั่งซื้อ: {new Date(order.createdAt).toLocaleString('th-TH')}
                      </span>
                    </div>

                    {/* Change status control */}
                    <div className="flex items-center gap-2 self-start sm:self-auto">
                      <span className="text-xs text-stone-500 font-medium">เปลี่ยนสถานะ:</span>
                      <select
                        value={order.status}
                        onChange={(e) =>
                          updateOrderStatus(order.id, e.target.value as OrderStatus)
                        }
                        className="text-xs bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-1.5 font-medium outline-none focus:border-amber-500"
                      >
                        <option value="pending">รอจัดส่ง (Pending)</option>
                        <option value="completed">สำเร็จแล้ว (Completed)</option>
                        <option value="cancelled">ยกเลิก (Cancelled)</option>
                      </select>
                    </div>
                  </div>

                  {/* Customer info & items grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
                    {/* Customer */}
                    <div className="bg-stone-50 p-4 rounded-xl border border-stone-100 space-y-1.5">
                      <span className="font-semibold text-stone-800 block text-xs uppercase tracking-wider text-amber-700">
                        ข้อมูลผู้สั่งซื้อ & จัดส่ง
                      </span>
                      <p className="font-medium text-stone-900">
                        {order.customer.fullName} ({order.customer.phone})
                      </p>
                      <p className="text-stone-600">
                        {order.customer.address} {order.customer.postalCode}
                      </p>
                      <p className="text-stone-500 pt-1">
                        ชำระผ่าน:{' '}
                        <strong className="text-stone-800">
                          {order.paymentMethod === 'promptpay'
                            ? 'QR Code พร้อมเพย์'
                            : 'เก็บเงินปลายทาง (COD)'}
                        </strong>
                      </p>
                    </div>

                    {/* Items */}
                    <div className="bg-stone-50 p-4 rounded-xl border border-stone-100 space-y-2">
                      <span className="font-semibold text-stone-800 block text-xs uppercase tracking-wider text-amber-700">
                        รายการสินค้า ({order.items.length})
                      </span>
                      <div className="divide-y divide-stone-200/60 max-h-36 overflow-y-auto pr-1">
                        {order.items.map((item) => (
                          <div
                            key={item.product.id}
                            className="py-1.5 flex justify-between items-center text-xs"
                          >
                            <span className="text-stone-800 truncate max-w-xs">
                              {item.product.name} x {item.quantity}
                            </span>
                            <span className="font-semibold text-stone-900">
                              ฿{(item.product.price * item.quantity).toLocaleString()}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="pt-2 border-t border-stone-200 flex justify-between font-bold text-sm text-stone-900">
                        <span>ยอดรวมสุทธิ:</span>
                        <span className="text-amber-700">
                          ฿{order.grandTotal.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Add / Edit Product Modal */}
      {(isAddModalOpen || editingProduct) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div
            className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => {
                setIsAddModalOpen(false);
                setEditingProduct(null);
              }}
              className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold text-stone-900 mb-4">
              {editingProduct ? 'แก้ไขข้อมูลสินค้า' : 'เพิ่มสินค้าใหม่'}
            </h2>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block font-medium text-stone-700 mb-1">ชื่อสินค้า *</label>
                <input
                  type="text"
                  required
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-200 rounded-xl outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block font-medium text-stone-700 mb-1">หมวดหมู่</label>
                <input
                  type="text"
                  value={productForm.category}
                  onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                  placeholder="เช่น อุปกรณ์กาแฟ, เมล็ดกาแฟ, ของแต่งบ้าน"
                  className="w-full px-3 py-2 border border-stone-200 rounded-xl outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-stone-700 mb-1">ราคา (บาท) *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={productForm.price}
                    onChange={(e) =>
                      setProductForm({ ...productForm, price: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 border border-stone-200 rounded-xl outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block font-medium text-stone-700 mb-1">สต็อก (ชิ้น) *</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={productForm.stock}
                    onChange={(e) =>
                      setProductForm({ ...productForm, stock: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 border border-stone-200 rounded-xl outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-stone-700 mb-1">รูปภาพ URL</label>
                <input
                  type="url"
                  value={productForm.imageUrl}
                  onChange={(e) => setProductForm({ ...productForm, imageUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3 py-2 border border-stone-200 rounded-xl outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block font-medium text-stone-700 mb-1">รายละเอียดสินค้า</label>
                <textarea
                  rows={3}
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-200 rounded-xl outline-none focus:border-amber-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setEditingProduct(null);
                  }}
                  className="px-4 py-2 border border-stone-200 rounded-xl text-stone-600 hover:bg-stone-50"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-medium shadow-sm shadow-amber-200"
                >
                  บันทึกสินค้า
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
