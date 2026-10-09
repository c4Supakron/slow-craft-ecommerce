import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Product, CartItem, CustomerInfo, PaymentMethod, Order, OrderStatus } from '../types';
import { INITIAL_PRODUCTS } from '../data/initialProducts';

interface ShopContextType {
  products: Product[];
  cart: CartItem[];
  orders: Order[];
  currentView: 'store' | 'admin';
  setCurrentView: (view: 'store' | 'admin') => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
  cartCount: number;
  subtotal: number;
  shippingFee: number;
  grandTotal: number;
  addToCart: (product: Product, quantity?: number) => { success: boolean; message?: string };
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  placeOrder: (customer: CustomerInfo, paymentMethod: PaymentMethod) => Order;
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  resetDefaultData: () => void;
}

export const ShopContext = createContext<ShopContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PRODUCTS: 'shop_products_v1',
  CART: 'shop_cart_v1',
  ORDERS: 'shop_orders_v1',
};

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load products from LocalStorage or seed with INITIAL_PRODUCTS
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_PRODUCTS;
  });

  // Load cart from LocalStorage
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CART);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return [];
  });

  // Load orders from LocalStorage
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return [];
  });

  const [currentView, setCurrentView] = useState<'store' | 'admin'>('store');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ทั้งหมด');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    } catch (e) {
      console.error('Failed to save products', e);
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to save cart', e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    } catch (e) {
      console.error('Failed to save orders', e);
    }
  }, [orders]);

  // Derived calculations
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shippingFee = subtotal === 0 || subtotal >= 500 ? 0 : 50;
  const grandTotal = subtotal + shippingFee;

  const addToCart = (product: Product, quantity = 1) => {
    // Current stock check
    const currentStock = products.find((p) => p.id === product.id)?.stock ?? 0;
    if (currentStock <= 0) {
      return { success: false, message: 'ขออภัย สินค้าชิ้นนี้หมดแล้ว' };
    }

    const existingIndex = cart.findIndex((item) => item.product.id === product.id);
    const existingQty = existingIndex > -1 ? cart[existingIndex].quantity : 0;

    if (existingQty + quantity > currentStock) {
      return {
        success: false,
        message: `มีสินค้าในสต็อกเพียง ${currentStock} ชิ้น (คุณมีในตะกร้าแล้ว ${existingQty} ชิ้น)`,
      };
    }

    if (existingIndex > -1) {
      const updated = [...cart];
      updated[existingIndex] = {
        ...updated[existingIndex],
        quantity: existingQty + quantity,
      };
      setCart(updated);
    } else {
      setCart([...cart, { product, quantity }]);
    }

    return { success: true };
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    const targetProduct = products.find((p) => p.id === productId);
    const maxStock = targetProduct?.stock ?? 0;
    const finalQty = Math.min(quantity, maxStock);

    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity: finalQty } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const placeOrder = (customer: CustomerInfo, paymentMethod: PaymentMethod): Order => {
    const orderId = `ORD-${Date.now().toString().slice(-6)}`;
    const newOrder: Order = {
      id: orderId,
      items: [...cart],
      customer,
      subtotal,
      shippingFee,
      grandTotal,
      paymentMethod,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    // Decrement stock in products
    setProducts((prev) =>
      prev.map((prod) => {
        const cartItem = cart.find((item) => item.product.id === prod.id);
        if (cartItem) {
          const newStock = Math.max(0, prod.stock - cartItem.quantity);
          return { ...prod, stock: newStock };
        }
        return prod;
      })
    );

    // Save order & clear cart
    setOrders((prev) => [newOrder, ...prev]);
    clearCart();

    return newOrder;
  };

  const addProduct = (newProd: Omit<Product, 'id'>) => {
    const product: Product = {
      ...newProd,
      id: `prod-${Date.now().toString().slice(-5)}`,
    };
    setProducts((prev) => [product, ...prev]);
  };

  const updateProduct = (updated: Product) => {
    setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    // Also sync in-cart product details if price or name changed
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === updated.id
          ? {
              ...item,
              product: updated,
              quantity: Math.min(item.quantity, updated.stock),
            }
          : item
      ).filter((item) => item.quantity > 0)
    );
  };

  const deleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    removeFromCart(productId);
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, status } : ord))
    );
  };

  const resetDefaultData = () => {
    setProducts(INITIAL_PRODUCTS);
    setCart([]);
    setOrders([]);
    localStorage.removeItem(STORAGE_KEYS.PRODUCTS);
    localStorage.removeItem(STORAGE_KEYS.CART);
    localStorage.removeItem(STORAGE_KEYS.ORDERS);
  };

  return (
    <ShopContext.Provider
      value={{
        products,
        cart,
        orders,
        currentView,
        setCurrentView,
        searchTerm,
        setSearchTerm,
        selectedCategory,
        setSelectedCategory,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        selectedProduct,
        setSelectedProduct,
        cartCount,
        subtotal,
        shippingFee,
        grandTotal,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        placeOrder,
        addProduct,
        updateProduct,
        deleteProduct,
        updateOrderStatus,
        resetDefaultData,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
