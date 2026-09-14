export type Role = 'USER' | 'ADMIN' | 'MANAGER';

export type OrderStatus =
  | 'Ожидает оплаты'
  | 'Оплачен'
  | 'Собирается'
  | 'Передан курьеру'
  | 'В пути'
  | 'Доставлен'
  | 'Отменён';

export type DeliveryMethod = 'Курьер' | 'Самовывоз' | 'Пункт выдачи';

export type PaymentMethod = 'Банковская карта' | 'Онлайн-оплата (Kaspi / QR)' | 'Оплата при получении';

export interface ProductColor {
  name: string;
  hex: string;
  inStock: boolean;
  image?: string;
}

export interface StorageOption {
  capacity: string;
  priceOffset: number; // in KZT
}

export interface ProductSpecs {
  [group: string]: {
    [param: string]: string;
  };
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  brand: string;
  category: string;
  categorySlug: string;
  price: number;
  oldPrice?: number;
  discountPercent?: number;
  isTechFriday?: boolean;
  isHotDeal?: boolean;
  isNew?: boolean;
  isBestseller?: boolean;
  salesCount: number;
  rating: number;
  reviewsCount: number;
  mainImage: string;
  gallery: string[];
  colors: ProductColor[];
  storageOptions: StorageOption[];
  inStock: boolean;
  stockQuantity: number;
  description: string;
  specs: ProductSpecs;
  tags: string[];
  createdAt: string;
  views?: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  productCount: number;
  isPopular?: boolean;
  description?: string;
}

export interface CartItem {
  id: string; // unique item key: productId + color + storage
  product: Product;
  selectedColor: string;
  selectedStorage?: string;
  quantity: number;
  unitPrice: number;
}

export interface Order {
  id: string; // e.g. "TM-10482"
  createdAt: string;
  customerName: string;
  phone: string;
  email: string;
  city: string;
  street: string;
  house: string;
  apartment?: string;
  deliveryMethod: DeliveryMethod;
  paymentMethod: PaymentMethod;
  items: CartItem[];
  subtotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
  status: OrderStatus;
  promoCodeApplied?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: Role;
  registeredAt: string;
  ordersCount: number;
  totalSpent: number;
  avatar?: string;
  addresses?: { city: string; address: string; isDefault: boolean }[];
}

export interface PromoCode {
  code: string;
  type: 'percent' | 'fixed';
  value: number; // e.g., 15000 (₸) or 20 (%)
  minOrder: number;
  validUntil: string;
  category?: string;
  active: boolean;
}

export interface Review {
  id: string;
  productId: string;
  author: string;
  rating: number;
  date: string;
  content: string;
  isVerifiedPurchase: boolean;
  likes: number;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'price_drop' | 'order' | 'promo' | 'system';
  date: string;
  isRead: boolean;
  link?: string;
}

export interface TechFridaySettings {
  title: string;
  isActive: boolean;
  endDate: string; // ISO string
  discountRange: string;
}

export interface FilterState {
  category?: string;
  brand?: string[];
  minPrice?: number;
  maxPrice?: number;
  inStockOnly?: boolean;
  techFridayOnly?: boolean;
  hasDiscountOnly?: boolean;
  rating?: number;
  ram?: string[];
  storage?: string[];
  diagonal?: string[];
  searchQuery?: string;
  sortBy?: 'popular' | 'rating' | 'price_asc' | 'price_desc' | 'discount' | 'newest';
}
