'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Product,
  CartItem,
  Order,
  OrderStatus,
  User,
  Role,
  PromoCode,
  Review,
  NotificationItem,
  TechFridaySettings,
  Category,
} from '@/types';
import {
  INITIAL_PRODUCTS,
  INITIAL_CATEGORIES,
  INITIAL_PROMO_CODES,
  INITIAL_ORDERS,
  INITIAL_REVIEWS,
  INITIAL_NOTIFICATIONS,
  INITIAL_USER,
  INITIAL_TECH_FRIDAY,
} from '@/data/mockData';
import { KASPI_TOP_PRODUCTS } from '@/data/kaspiTopProducts';

const ALL_INITIAL_PRODUCTS: Product[] = [...KASPI_TOP_PRODUCTS, ...INITIAL_PRODUCTS];

interface StoreContextType {
  // Products & Categories
  products: Product[];
  categories: Category[];
  addProduct: (product: Product) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, color?: string, storage?: string, quantity?: number) => void;
  updateCartQuantity: (itemId: string, delta: number) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  cartDiscount: number;
  appliedPromoCode: PromoCode | null;
  applyPromoCode: (code: string) => { success: boolean; message: string };
  removePromoCode: () => void;
  cartTotal: number;

  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // Compare
  comparison: string[];
  toggleComparison: (productId: string) => void;
  isInComparison: (productId: string) => boolean;
  clearComparison: () => void;

  // User & Auth
  currentUser: User | null;
  login: (email: string, role?: Role, name?: string) => void;
  logout: () => void;
  switchRole: (role: Role) => void;
  updateUserProfile: (updates: Partial<User>) => void;

  // Orders
  orders: Order[];
  createOrder: (orderData: {
    customerName: string;
    phone: string;
    email: string;
    city: string;
    street: string;
    house: string;
    apartment?: string;
    deliveryMethod: any;
    paymentMethod: any;
  }) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;

  // Promo codes
  promoCodes: PromoCode[];
  addPromoCode: (promo: PromoCode) => void;

  // Tech Friday
  techFriday: TechFridaySettings;
  updateTechFriday: (settings: Partial<TechFridaySettings>) => void;

  // Notifications
  notifications: NotificationItem[];
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  unreadNotificationsCount: number;

  // Toast notification
  cartToast: {
    product: Product;
    selectedColor?: string;
    selectedStorage?: string;
    quantity: number;
  } | null;
  closeCartToast: () => void;

  // Reviews
  reviews: Review[];
  addReview: (review: Omit<Review, 'id' | 'date' | 'likes'>) => void;

  // Global UI
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  isAuthModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
  isAIAssistantOpen: boolean;
  setAIAssistantOpen: (open: boolean) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize state from localStorage if available
  const [products, setProducts] = useState<Product[]>(ALL_INITIAL_PRODUCTS);
  const [categories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>(['prod-iphone-17-pro', 'prod-airpods-pro-2']);
  const [comparison, setComparison] = useState<string[]>(['prod-iphone-17-pro', 'prod-samsung-s25-ultra']);
  const [appliedPromoCode, setAppliedPromoCode] = useState<PromoCode | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(INITIAL_USER);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>(INITIAL_PROMO_CODES);
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [techFriday, setTechFriday] = useState<TechFridaySettings>(INITIAL_TECH_FRIDAY);
  const [selectedCity, setSelectedCity] = useState<string>('Кызылорда');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);
  const [isAIAssistantOpen, setAIAssistantOpen] = useState(false);
  const [cartToast, setCartToast] = useState<{
    product: Product;
    selectedColor?: string;
    selectedStorage?: string;
    quantity: number;
  } | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const closeCartToast = () => setCartToast(null);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedProducts = localStorage.getItem('tm_products');
      if (savedProducts) {
        try {
          const parsed = JSON.parse(savedProducts);
          if (Array.isArray(parsed) && parsed.length >= 500) {
            const hasKaspi = parsed.some((p: Product) => p.id === 'kaspi-iphone-16-pro-max');
            if (!hasKaspi) {
              const combined = [...KASPI_TOP_PRODUCTS, ...parsed];
              setProducts(combined);
              localStorage.setItem('tm_products', JSON.stringify(combined));
            } else {
              setProducts(parsed);
            }
          } else {
            // Outdated small catalog cache; replace with full expanded catalog
            setProducts(ALL_INITIAL_PRODUCTS);
            localStorage.setItem('tm_products', JSON.stringify(ALL_INITIAL_PRODUCTS));
          }
        } catch {
          setProducts(ALL_INITIAL_PRODUCTS);
        }
      } else {
        setProducts(ALL_INITIAL_PRODUCTS);
        localStorage.setItem('tm_products', JSON.stringify(ALL_INITIAL_PRODUCTS));
      }

      const savedCart = localStorage.getItem('tm_cart');
      if (savedCart) setCart(JSON.parse(savedCart));

      const savedWishlist = localStorage.getItem('tm_wishlist');
      if (savedWishlist) setWishlist(JSON.parse(savedWishlist));

      const savedComparison = localStorage.getItem('tm_comparison');
      if (savedComparison) setComparison(JSON.parse(savedComparison));

      const savedOrders = localStorage.getItem('tm_orders');
      if (savedOrders) setOrders(JSON.parse(savedOrders));

      const savedTheme = localStorage.getItem('tm_theme');
      if (savedTheme === 'light' || savedTheme === 'dark') {
        setTheme(savedTheme);
        document.documentElement.classList.toggle('dark', savedTheme === 'dark');
      } else {
        setTheme('light');
        document.documentElement.classList.remove('dark');
      }

      const savedCity = localStorage.getItem('tm_city');
      if (savedCity) setSelectedCity(savedCity);
    } catch (e) {
      console.warn('LocalStorage error:', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem('tm_products', JSON.stringify(products));
      localStorage.setItem('tm_cart', JSON.stringify(cart));
      localStorage.setItem('tm_wishlist', JSON.stringify(wishlist));
      localStorage.setItem('tm_comparison', JSON.stringify(comparison));
      localStorage.setItem('tm_orders', JSON.stringify(orders));
      localStorage.setItem('tm_theme', theme);
      localStorage.setItem('tm_city', selectedCity);
    } catch (e) {
      console.warn('Error saving to LocalStorage', e);
    }
  }, [products, cart, wishlist, comparison, orders, theme, selectedCity, isLoaded]);

  // Sync theme class with HTML
  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    document.documentElement.classList.toggle('dark', nextTheme === 'dark');
  };

  // Products CRUD
  const addProduct = (product: Product) => {
    setProducts((prev) => [product, ...prev]);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((item) => item.id !== id));
  };

  // Cart Operations
  const addToCart = (
    product: Product,
    color?: string,
    storage?: string,
    quantity: number = 1
  ) => {
    const chosenColor = color || (product.colors.length > 0 ? product.colors[0].name : 'Стандартный');
    const chosenStorage = storage || (product.storageOptions.length > 0 ? product.storageOptions[0].capacity : undefined);
    const cartItemId = `${product.id}-${chosenColor}-${chosenStorage || ''}`;

    // Calculate item unit price based on storage offset
    let unitPrice = product.price;
    if (chosenStorage) {
      const option = product.storageOptions.find((opt) => opt.capacity === chosenStorage);
      if (option) unitPrice += option.priceOffset;
    }

    const maxStock = product.stockQuantity && product.stockQuantity > 0 ? product.stockQuantity : 10;

    setCart((prev) => {
      const existing = prev.find((item) => item.id === cartItemId);
      if (existing) {
        const newQty = Math.min(existing.quantity + quantity, maxStock);
        return prev.map((item) =>
          item.id === cartItemId
            ? { ...item, quantity: newQty }
            : item
        );
      } else {
        const newQty = Math.min(quantity, maxStock);
        return [
          ...prev,
          {
            id: cartItemId,
            product,
            selectedColor: chosenColor,
            selectedStorage: chosenStorage,
            quantity: newQty,
            unitPrice,
          },
        ];
      }
    });

    // Trigger floating notification
    setCartToast({
      product,
      selectedColor: chosenColor,
      selectedStorage: chosenStorage,
      quantity,
    });
  };

  const updateCartQuantity = (itemId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === itemId) {
            const maxStock = item.product.stockQuantity && item.product.stockQuantity > 0 ? item.product.stockQuantity : 10;
            const nextQty = item.quantity + delta;
            // Prevent adding beyond warehouse stock limit
            if (nextQty > maxStock) {
              return item;
            }
            return nextQty > 0 ? { ...item, quantity: nextQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== itemId));
  };

  const clearCart = () => {
    setCart([]);
    setAppliedPromoCode(null);
  };

  // Cart calculations
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

  // Promo code validation & application
  const applyPromoCode = (code: string) => {
    const cleaned = code.trim().toUpperCase();
    const found = promoCodes.find((p) => p.code.toUpperCase() === cleaned && p.active);

    if (!found) {
      return { success: false, message: 'Промокод не найден или недействителен' };
    }

    if (cartSubtotal < found.minOrder) {
      return {
        success: false,
        message: `Минимальная сумма заказа для этого промокода: ${found.minOrder.toLocaleString('ru-RU')} ₸`,
      };
    }

    setAppliedPromoCode(found);
    return { success: true, message: `Промокод «${found.code}» успешно применен!` };
  };

  const removePromoCode = () => {
    setAppliedPromoCode(null);
  };

  let cartDiscount = 0;
  if (appliedPromoCode) {
    if (appliedPromoCode.type === 'percent') {
      cartDiscount = Math.round((cartSubtotal * appliedPromoCode.value) / 100);
    } else {
      cartDiscount = Math.min(appliedPromoCode.value, cartSubtotal);
    }
  }

  const cartTotal = Math.max(0, cartSubtotal - cartDiscount);

  // Wishlist Operations
  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      return exists ? prev.filter((id) => id !== productId) : [...prev, productId];
    });
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  // Comparison Operations
  const toggleComparison = (productId: string) => {
    setComparison((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        return prev.filter((id) => id !== productId);
      }
      if (prev.length >= 4) {
        alert('Максимально можно сравнивать до 4 товаров одновременно.');
        return prev;
      }
      return [...prev, productId];
    });
  };

  const isInComparison = (productId: string) => comparison.includes(productId);
  const clearComparison = () => setComparison([]);

  // Auth & User Operations
  const login = (email: string, role: Role = 'USER', name: string = 'Пользователь') => {
    setCurrentUser({
      id: `usr-${Date.now()}`,
      name,
      email,
      phone: '+7 (777) 000-00-00',
      role,
      registeredAt: new Date().toISOString().split('T')[0],
      ordersCount: 0,
      totalSpent: 0,
      addresses: [{ city: selectedCity, address: 'ул. Айтеке би 10', isDefault: true }],
    });
    setAuthModalOpen(false);
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const switchRole = (role: Role) => {
    if (currentUser) {
      setCurrentUser({ ...currentUser, role });
    } else {
      login('lawliet@anelimarket.kz', role, 'Lawliet');
    }
  };

  const updateUserProfile = (updates: Partial<User>) => {
    if (currentUser) {
      setCurrentUser({ ...currentUser, ...updates });
    }
  };

  // Orders Operations
  const createOrder = (orderData: {
    customerName: string;
    phone: string;
    email: string;
    city: string;
    street: string;
    house: string;
    apartment?: string;
    deliveryMethod: any;
    paymentMethod: any;
  }): Order => {
    const newId = `TM-${Math.floor(10000 + Math.random() * 90000)}`;
    const newOrder: Order = {
      id: newId,
      createdAt: new Date().toISOString(),
      customerName: orderData.customerName,
      phone: orderData.phone,
      email: orderData.email,
      city: orderData.city,
      street: orderData.street,
      house: orderData.house,
      apartment: orderData.apartment,
      deliveryMethod: orderData.deliveryMethod,
      paymentMethod: orderData.paymentMethod,
      items: [...cart],
      subtotal: cartSubtotal,
      discount: cartDiscount,
      deliveryFee: 0, // Free delivery promo in Kyzylorda
      total: cartTotal,
      status: 'Оплачен',
      promoCodeApplied: appliedPromoCode ? appliedPromoCode.code : undefined,
    };

    setOrders((prev) => [newOrder, ...prev]);

    // Update user stats
    if (currentUser) {
      setCurrentUser((prev) =>
        prev
          ? {
              ...prev,
              ordersCount: prev.ordersCount + 1,
              totalSpent: prev.totalSpent + cartTotal,
            }
          : null
      );
    }

    // Add notification
    const orderNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: 'Заказ успешно оформлен',
      message: `Ваш заказ #${newId} на сумму ${cartTotal.toLocaleString('ru-RU')} ₸ принят в обработку!`,
      type: 'order',
      date: 'Только что',
      isRead: false,
      link: '/profile',
    };
    setNotifications((prev) => [orderNotif, ...prev]);

    // Clear cart after successful checkout
    clearCart();
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((order) => (order.id === orderId ? { ...order, status } : order))
    );

    // Notify user
    const statusNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: `Статус заказа #${orderId} изменен`,
      message: `Новый статус: ${status}`,
      type: 'order',
      date: 'Только что',
      isRead: false,
      link: '/profile',
    };
    setNotifications((prev) => [statusNotif, ...prev]);
  };

  // Promo code CRUD
  const addPromoCode = (promo: PromoCode) => {
    setPromoCodes((prev) => [...prev, promo]);
  };

  // Tech Friday Settings
  const updateTechFriday = (settings: Partial<TechFridaySettings>) => {
    setTechFriday((prev) => ({ ...prev, ...settings }));
  };

  // Notification Operations
  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const unreadNotificationsCount = notifications.filter((n) => !n.isRead).length;

  // Reviews Operations
  const addReview = (review: Omit<Review, 'id' | 'date' | 'likes'>) => {
    const newRev: Review = {
      ...review,
      id: `rev-${Date.now()}`,
      date: 'Сегодня',
      likes: 0,
    };
    setReviews((prev) => [newRev, ...prev]);

    // Update product rating and reviews count
    setProducts((prev) =>
      prev.map((prod) => {
        if (prod.id === review.productId) {
          const newCount = prod.reviewsCount + 1;
          const newRating = Number(
            ((prod.rating * prod.reviewsCount + review.rating) / newCount).toFixed(2)
          );
          return { ...prod, reviewsCount: newCount, rating: newRating };
        }
        return prod;
      })
    );
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        categories,
        addProduct,
        updateProduct,
        deleteProduct,
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartCount,
        cartSubtotal,
        cartDiscount,
        appliedPromoCode,
        applyPromoCode,
        removePromoCode,
        cartTotal,
        wishlist,
        toggleWishlist,
        isInWishlist,
        comparison,
        toggleComparison,
        isInComparison,
        clearComparison,
        currentUser,
        login,
        logout,
        switchRole,
        updateUserProfile,
        orders,
        createOrder,
        updateOrderStatus,
        promoCodes,
        addPromoCode,
        techFriday,
        updateTechFriday,
        notifications,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        unreadNotificationsCount,
        reviews,
        addReview,
        theme,
        toggleTheme,
        selectedCity,
        setSelectedCity,
        isAuthModalOpen,
        setAuthModalOpen,
        isAIAssistantOpen,
        setAIAssistantOpen,
        cartToast,
        closeCartToast,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
