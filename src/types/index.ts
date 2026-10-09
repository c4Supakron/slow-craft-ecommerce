export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  imageUrl: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CustomerInfo {
  fullName: string;
  phone: string;
  address: string;
  postalCode: string;
}

export type PaymentMethod = 'promptpay' | 'cod';

export type OrderStatus = 'pending' | 'completed' | 'cancelled';

export interface Order {
  id: string;
  items: CartItem[];
  customer: CustomerInfo;
  subtotal: number;
  shippingFee: number;
  grandTotal: number;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  createdAt: string;
}
