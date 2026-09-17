'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useStore } from '@/context/StoreContext';
import { OrderStatus, Product, Role } from '@/types';
import {
  BarChart3,
  Package,
  ShoppingCart,
  Users,
  Percent,
  Zap,
  Plus,
  Edit2,
  Trash2,
  Check,
  Search,
  Filter,
  ArrowUpRight,
  TrendingUp,
  Clock,
  Shield,
  Eye,
  AlertCircle,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const {
    currentUser,
    switchRole,
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    orders,
    updateOrderStatus,
    promoCodes,
    addPromoCode,
    techFriday,
    updateTechFriday,
    categories,
  } = useStore();

  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'orders' | 'discounts' | 'tech-friday' | 'users'>('dashboard');

  // Product modal form state
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [productForm, setProductForm] = useState({
    title: '',
    brand: 'Apple',
    category: 'Смартфоны',
    categorySlug: 'smartphones',
    price: 499990,
    oldPrice: 549990,
    discountPercent: 10,
    stockQuantity: 25,
    mainImage: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?q=80&w=1000&auto=format&fit=crop',
    description: 'Новый девайс с высокими техническими характеристиками.',
    isTechFriday: false,
    isHotDeal: true,
  });

  // Promo code form state
  const [promoForm, setPromoForm] = useState({
    code: '',
    type: 'fixed' as 'fixed' | 'percent',
    value: 10000,
    minOrder: 50000,
    validUntil: '2026-10-31',
  });

  // Order filters
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [orderSearch, setOrderSearch] = useState<string>('');

  // Sample users list for management
  const [usersList, setUsersList] = useState([
    {
      id: 'u-1',
      name: 'Иван Сергеев',
      email: 'ivan@example.kz',
      phone: '+7 (777) 123-45-67',
      registeredAt: '10.05.2025',
      ordersCount: 5,
      totalSpent: 1840000,
      role: 'USER' as Role,
    },
    {
      id: 'u-2',
      name: 'Али Нургалиев',
      email: 'ali@example.kz',
      phone: '+7 (701) 987-65-43',
      registeredAt: '14.02.2026',
      ordersCount: 2,
      totalSpent: 280000,
      role: 'USER' as Role,
    },
    {
      id: 'u-3',
      name: 'Lawliet (Анель)',
      email: 'lawliet@anelimarket.kz',
      phone: '+7 (777) 900-11-22',
      registeredAt: '10.11.2024',
      ordersCount: 12,
      totalSpent: 4250000,
      role: 'ADMIN' as Role,
    },
    {
      id: 'u-4',
      name: 'Данияр Ахметов',
      email: 'daniyar@example.kz',
      phone: '+7 (705) 555-12-34',
      registeredAt: '01.07.2025',
      ordersCount: 4,
      totalSpent: 980000,
      role: 'MANAGER' as Role,
    },
  ]);

  // Admin access guard
  const isAdmin = currentUser?.role === 'ADMIN' || currentUser?.role === 'MANAGER';

  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto">
          <Shield size={32} />
        </div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">
          Ограниченный доступ
        </h1>
        <p className="text-xs text-slate-500">
          Для доступа к панели управления необходимы права администратора.
        </p>
        <button
          onClick={() => switchRole('ADMIN')}
          className="w-full py-3 rounded-xl bg-blue-600 text-white font-bold text-xs shadow-md"
        >
          Активировать роль ADMIN (Демо-доступ)
        </button>
      </div>
    );
  }

  // Handle open edit product
  const handleOpenEdit = (p: Product) => {
    setEditingProductId(p.id);
    setProductForm({
      title: p.title,
      brand: p.brand,
      category: p.category,
      categorySlug: p.categorySlug,
      price: p.price,
      oldPrice: p.oldPrice || p.price,
      discountPercent: p.discountPercent || 0,
      stockQuantity: p.stockQuantity,
      mainImage: p.mainImage,
      description: p.description,
      isTechFriday: p.isTechFriday || false,
      isHotDeal: p.isHotDeal || false,
    });
    setIsProductModalOpen(true);
  };

  const handleOpenCreate = () => {
    setEditingProductId(null);
    setProductForm({
      title: '',
      brand: 'Apple',
      category: 'Смартфоны',
      categorySlug: 'smartphones',
      price: 499990,
      oldPrice: 549990,
      discountPercent: 10,
      stockQuantity: 20,
      mainImage: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?q=80&w=1000&auto=format&fit=crop',
      description: 'Новый девайс с высокими техническими характеристиками.',
      isTechFriday: false,
      isHotDeal: true,
    });
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProductId) {
      updateProduct(editingProductId, {
        title: productForm.title,
        brand: productForm.brand,
        category: productForm.category,
        categorySlug: productForm.categorySlug,
        price: Number(productForm.price),
        oldPrice: Number(productForm.oldPrice),
        discountPercent: Number(productForm.discountPercent),
        stockQuantity: Number(productForm.stockQuantity),
        mainImage: productForm.mainImage,
        description: productForm.description,
        isTechFriday: productForm.isTechFriday,
        isHotDeal: productForm.isHotDeal,
      });
    } else {
      const newProd: Product = {
        id: `prod-${Date.now()}`,
        title: productForm.title,
        slug: productForm.title.toLowerCase().replace(/\s+/g, '-'),
        brand: productForm.brand,
        category: productForm.category,
        categorySlug: productForm.categorySlug,
        price: Number(productForm.price),
        oldPrice: Number(productForm.oldPrice),
        discountPercent: Number(productForm.discountPercent),
        stockQuantity: Number(productForm.stockQuantity),
        inStock: Number(productForm.stockQuantity) > 0,
        mainImage: productForm.mainImage,
        gallery: [productForm.mainImage],
        colors: [{ name: 'Стандартный', hex: '#2563eb', inStock: true }],
        storageOptions: [{ capacity: '256 GB', priceOffset: 0 }],
        description: productForm.description,
        rating: 5.0,
        reviewsCount: 1,
        salesCount: 0,
        isNew: true,
        isHotDeal: productForm.isHotDeal,
        isTechFriday: productForm.isTechFriday,
        specs: {
          'Основные': {
            'Производитель': productForm.brand,
            'Категория': productForm.category,
          },
        },
        tags: [productForm.brand, productForm.category],
        createdAt: new Date().toISOString(),
      };
      addProduct(newProd);
    }
    setIsProductModalOpen(false);
  };

  const handleCreatePromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoForm.code.trim()) return;
    addPromoCode({
      code: promoForm.code.trim().toUpperCase(),
      type: promoForm.type,
      value: Number(promoForm.value),
      minOrder: Number(promoForm.minOrder),
      validUntil: promoForm.validUntil,
      active: true,
    });
    setPromoForm({
      code: '',
      type: 'fixed',
      value: 10000,
      minOrder: 50000,
      validUntil: '2026-10-31',
    });
    alert('Промокод успешно добавлен!');
  };

  // Filter orders
  const filteredOrders = orders.filter((o) => {
    const matchesStatus = orderStatusFilter === 'all' || o.status === orderStatusFilter;
    const matchesSearch =
      orderSearch === '' ||
      o.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customerName.toLowerCase().includes(orderSearch.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
            <Shield size={20} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Панель Администратора AneliMarket
            </h1>
            <p className="text-xs text-slate-500">
              Управление заказами, товарами, скидками и промокодами (Кызылорда)
            </p>
          </div>
        </div>

        <Link
          href="/"
          className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          Перейти на сайт магазина
        </Link>
      </div>

      {/* Navigation tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 border-b border-slate-200 dark:border-slate-800 text-xs font-bold">
        {[
          { id: 'dashboard', label: '📊 Dashboard', icon: BarChart3 },
          { id: 'products', label: `📦 Товары (${products.length})`, icon: Package },
          { id: 'orders', label: `🚚 Заказы (${orders.length})`, icon: ShoppingCart },
          { id: 'discounts', label: '🏷 Скидки & Промокоды', icon: Percent },
          { id: 'tech-friday', label: '⚡ TECH FRIDAY', icon: Zap },
          { id: 'users', label: `👥 Пользователи (${usersList.length})`, icon: Users },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl whitespace-nowrap transition ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB: Dashboard */}
      {activeTab === 'dashboard' && (
        <div className="space-y-8">
          {/* KPI metrics row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Продажи сегодня
              </span>
              <div className="text-2xl font-black text-slate-900 dark:text-white">
                1 842 000 ₸
              </div>
              <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold">
                <TrendingUp size={13} />
                <span>+14.2% по сравнению со вчера</span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Заказы
              </span>
              <div className="text-2xl font-black text-slate-900 dark:text-white">
                {orders.length + 144}
              </div>
              <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold">
                <TrendingUp size={13} />
                <span>98% успешно доставлены</span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Пользователи
              </span>
              <div className="text-2xl font-black text-slate-900 dark:text-white">
                12 482
              </div>
              <span className="text-[11px] text-slate-400">+48 новых за сутки</span>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Товары в каталоге
              </span>
              <div className="text-2xl font-black text-slate-900 dark:text-white">
                {products.length}
              </div>
              <span className="text-[11px] text-blue-600 font-semibold">22 категории активны</span>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Средний чек
              </span>
              <div className="text-2xl font-black text-slate-900 dark:text-white">
                54 200 ₸
              </div>
              <span className="text-[11px] text-slate-400">Kaspi QR / Red лидирует</span>
            </div>
          </div>

          {/* Graphical Analytics visual simulation */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Динамика выручки за последние 7 дней (₸)
                </h3>
                <span className="text-xs text-blue-600 font-semibold">Сентябрь 2026</span>
              </div>

              {/* Bar charts */}
              <div className="h-48 flex items-end justify-between gap-3 pt-6 px-2 border-b border-slate-100 dark:border-slate-800">
                {[
                  { day: 'Пн', val: 65, sum: '1.2M' },
                  { day: 'Вт', val: 78, sum: '1.4M' },
                  { day: 'Ср', val: 55, sum: '980K' },
                  { day: 'Чт', val: 90, sum: '1.7M' },
                  { day: 'Пт', val: 100, sum: '1.84M' },
                  { day: 'Сб', val: 85, sum: '1.5M' },
                  { day: 'Вс', val: 70, sum: '1.3M' },
                ].map((bar) => (
                  <div key={bar.day} className="flex-1 flex flex-col items-center gap-2">
                    <span className="text-[10px] font-bold text-slate-500">{bar.sum}</span>
                    <div
                      className="w-full rounded-t-lg bg-gradient-to-t from-blue-600 to-indigo-500 hover:from-blue-500 hover:to-indigo-400 transition"
                      style={{ height: `${bar.val}%` }}
                    />
                    <span className="text-xs font-semibold text-slate-400">{bar.day}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick status box */}
            <div className="lg:col-span-4 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Топ категорий по продажам
              </h3>
              <div className="space-y-3 text-xs">
                {[
                  { name: '📱 Смартфоны Apple & Samsung', pct: 44, amount: '810 000 ₸' },
                  { name: '💻 Ноутбуки для разработки', pct: 28, amount: '515 000 ₸' },
                  { name: '🎧 Наушники TWS / ANC', pct: 16, amount: '295 000 ₸' },
                  { name: '🎮 Игровые консоли PS5', pct: 12, amount: '222 000 ₸' },
                ].map((cat) => (
                  <div key={cat.name} className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-700 dark:text-slate-300 font-medium truncate max-w-[180px]">
                        {cat.name}
                      </span>
                      <span className="font-bold text-slate-900 dark:text-white">{cat.amount}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div className="h-full bg-blue-600 rounded-full" style={{ width: `${cat.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB: Product Management (CRUD) */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Список товаров ({products.length})
            </h2>
            <button
              onClick={handleOpenCreate}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition"
            >
              <Plus size={16} />
              <span>Добавить новый товар</span>
            </button>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="p-3.5">Товар</th>
                  <th className="p-3.5">Категория</th>
                  <th className="p-3.5">Цена</th>
                  <th className="p-3.5">Скидка</th>
                  <th className="p-3.5">Остаток</th>
                  <th className="p-3.5">Статус</th>
                  <th className="p-3.5 text-right">Действия</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                    <td className="p-3.5 flex items-center gap-3">
                      <img
                        src={p.mainImage}
                        alt={p.title}
                        className="w-10 h-10 object-contain rounded-lg border border-slate-200 dark:border-slate-800 p-1"
                      />
                      <div>
                        <Link
                          href={`/product/${p.id}`}
                          className="font-bold text-slate-900 dark:text-white hover:text-blue-600 truncate max-w-xs block"
                        >
                          {p.title}
                        </Link>
                        <span className="text-[10px] text-slate-400">{p.brand}</span>
                      </div>
                    </td>
                    <td className="p-3.5 text-slate-600 dark:text-slate-300">{p.category}</td>
                    <td className="p-3.5 font-bold text-slate-900 dark:text-white">
                      {p.price.toLocaleString('ru-RU')} ₸
                    </td>
                    <td className="p-3.5">
                      {p.discountPercent ? (
                        <span className="px-2 py-0.5 rounded-md bg-orange-500/10 text-orange-500 font-bold">
                          -{p.discountPercent}%
                        </span>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td className="p-3.5 font-semibold text-slate-700 dark:text-slate-300">
                      {p.stockQuantity} шт.
                    </td>
                    <td className="p-3.5">
                      {p.inStock ? (
                        <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-500 font-bold">
                          В наличии
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-500 font-bold">
                          Нет на складе
                        </span>
                      )}
                    </td>
                    <td className="p-3.5 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEdit(p)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                        title="Редактировать"
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Удалить товар «${p.title}»?`)) {
                            deleteProduct(p.id);
                          }
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                        title="Удалить"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB: Order Management */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Заказы клиентов ({orders.length})
            </h2>

            {/* Filters */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
                placeholder="Поиск по № заказа или клиенту..."
                className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs"
              />
              <select
                value={orderStatusFilter}
                onChange={(e) => setOrderStatusFilter(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold"
              >
                <option value="all">Все статусы</option>
                <option value="Оплачен">Оплачен</option>
                <option value="Собирается">Собирается</option>
                <option value="В пути">В пути</option>
                <option value="Доставлен">Доставлен</option>
                <option value="Отменён">Отменён</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="p-3.5">№ Заказа</th>
                  <th className="p-3.5">Клиент</th>
                  <th className="p-3.5">Сумма</th>
                  <th className="p-3.5">Дата</th>
                  <th className="p-3.5">Статус</th>
                  <th className="p-3.5 text-right">Сменить статус</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                    <td className="p-3.5 font-black text-slate-900 dark:text-white">
                      #{ord.id}
                    </td>
                    <td className="p-3.5">
                      <div className="font-bold text-slate-900 dark:text-white">{ord.customerName}</div>
                      <div className="text-[10px] text-slate-400">{ord.phone}</div>
                    </td>
                    <td className="p-3.5 font-black text-slate-900 dark:text-white">
                      {ord.total.toLocaleString('ru-RU')} ₸
                    </td>
                    <td className="p-3.5 text-slate-400">
                      {new Date(ord.createdAt).toLocaleDateString('ru-RU')}
                    </td>
                    <td className="p-3.5">
                      <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                        {ord.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      <select
                        value={ord.status}
                        onChange={(e) => updateOrderStatus(ord.id, e.target.value as OrderStatus)}
                        className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs font-semibold cursor-pointer"
                      >
                        <option value="Ожидает оплаты">Ожидает оплаты</option>
                        <option value="Оплачен">Оплачен</option>
                        <option value="Собирается">Собирается</option>
                        <option value="Передан курьеру">Передан курьеру</option>
                        <option value="В пути">В пути</option>
                        <option value="Доставлен">Доставлен</option>
                        <option value="Отменён">Отменён</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB: Discounts & Promo Codes */}
      {activeTab === 'discounts' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Active Promo Codes List */}
          <div className="lg:col-span-7 space-y-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Активные промокоды ({promoCodes.length})
            </h2>
            <div className="space-y-3">
              {promoCodes.map((p) => (
                <div
                  key={p.code}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="px-2 py-0.5 rounded-md bg-blue-600 text-white font-black text-xs">
                      {p.code}
                    </span>
                    <p className="text-slate-400 mt-1">
                      Скидка: {p.type === 'percent' ? `${p.value}%` : `${p.value.toLocaleString('ru-RU')} ₸`} • Мин. заказ: {p.minOrder.toLocaleString('ru-RU')} ₸
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 font-bold text-[10px]">
                    Активен
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Create Promo Code form */}
          <div className="lg:col-span-5 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Создать промокод
            </h3>
            <form onSubmit={handleCreatePromo} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Код промокода</label>
                <input
                  type="text"
                  value={promoForm.code}
                  onChange={(e) => setPromoForm({ ...promoForm, code: e.target.value })}
                  placeholder="SUMMER2026"
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 uppercase font-bold"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 mb-1">Тип скидки</label>
                  <select
                    value={promoForm.type}
                    onChange={(e) => setPromoForm({ ...promoForm, type: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-medium"
                  >
                    <option value="fixed">Фиксированная (₸)</option>
                    <option value="percent">Процент (%)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Значение</label>
                  <input
                    type="number"
                    value={promoForm.value}
                    onChange={(e) => setPromoForm({ ...promoForm, value: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Мин. сумма заказа (₸)</label>
                <input
                  type="number"
                  value={promoForm.minOrder}
                  onChange={(e) => setPromoForm({ ...promoForm, minOrder: Number(e.target.value) })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold"
              >
                Сохранить промокод
              </button>
            </form>
          </div>
        </div>
      )}

      {/* TAB: Tech Friday sale settings */}
      {activeTab === 'tech-friday' && (
        <div className="max-w-2xl p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Zap size={18} className="text-purple-500" />
                <span>Настройки распродажи TECH FRIDAY</span>
              </h2>
              <p className="text-xs text-slate-400">Управление глобальным таймером и скидками</p>
            </div>
            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-purple-600">
              <input
                type="checkbox"
                checked={techFriday.isActive}
                onChange={(e) => updateTechFriday({ isActive: e.target.checked })}
                className="rounded border-purple-500 text-purple-600 w-4 h-4 cursor-pointer"
              />
              <span>Акция включена</span>
            </label>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-400 mb-1">Название акции</label>
              <input
                type="text"
                value={techFriday.title}
                onChange={(e) => updateTechFriday({ title: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-bold"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Диапазон скидок</label>
              <input
                type="text"
                value={techFriday.discountRange}
                onChange={(e) => updateTechFriday({ discountRange: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-bold"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Дата и время окончания (Таймер)</label>
              <input
                type="datetime-local"
                defaultValue={new Date(techFriday.endDate).toISOString().slice(0, 16)}
                onChange={(e) => updateTechFriday({ endDate: new Date(e.target.value).toISOString() })}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950"
              />
            </div>

            <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-950/30 border border-purple-500/20 text-purple-300 text-xs">
              ⚡ При активной акции на товарах с флагом TECH FRIDAY отображается повышенная скидка и специальный бейдж. После истечения таймера цены автоматически возвращаются к базовым.
            </div>
          </div>
        </div>
      )}

      {/* TAB: Users Management */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Пользователи платформы ({usersList.length})
          </h2>

          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="p-3.5">Имя</th>
                  <th className="p-3.5">Контакты</th>
                  <th className="p-3.5">Заказов</th>
                  <th className="p-3.5">Сумма покупок</th>
                  <th className="p-3.5">Роль</th>
                  <th className="p-3.5 text-right">Управление ролью</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {usersList.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                    <td className="p-3.5 font-bold text-slate-900 dark:text-white">{u.name}</td>
                    <td className="p-3.5 text-slate-500">
                      <div>{u.email}</div>
                      <div>{u.phone}</div>
                    </td>
                    <td className="p-3.5 font-semibold text-slate-900 dark:text-white">
                      {u.ordersCount}
                    </td>
                    <td className="p-3.5 font-black text-slate-900 dark:text-white">
                      {u.totalSpent.toLocaleString('ru-RU')} ₸
                    </td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                        u.role === 'ADMIN' ? 'bg-red-500/10 text-red-500' : u.role === 'MANAGER' ? 'bg-amber-500/10 text-amber-500' : 'bg-blue-500/10 text-blue-500'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      <select
                        value={u.role}
                        onChange={(e) => {
                          const nextRole = e.target.value as Role;
                          setUsersList((prev) =>
                            prev.map((item) => (item.id === u.id ? { ...item, role: nextRole } : item))
                          );
                        }}
                        className="px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs font-semibold cursor-pointer"
                      >
                        <option value="USER">USER</option>
                        <option value="MANAGER">MANAGER</option>
                        <option value="ADMIN">ADMIN</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal: Create or Edit Product */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
          <div className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 overflow-y-auto max-h-[90vh] space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white pb-2 border-b border-slate-100 dark:border-slate-800">
              {editingProductId ? 'Редактировать товар' : 'Создать новый товар'}
            </h3>

            <form onSubmit={handleSaveProduct} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Название товара</label>
                <input
                  type="text"
                  value={productForm.title}
                  onChange={(e) => setProductForm({ ...productForm, title: e.target.value })}
                  placeholder="Apple iPhone 17 Pro 256GB"
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-semibold"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Бренд</label>
                  <select
                    value={productForm.brand}
                    onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-semibold"
                  >
                    <option value="Apple">Apple</option>
                    <option value="Samsung">Samsung</option>
                    <option value="ASUS">ASUS</option>
                    <option value="Lenovo">Lenovo</option>
                    <option value="Sony">Sony</option>
                    <option value="LG">LG</option>
                    <option value="Logitech">Logitech</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Категория</label>
                  <select
                    value={productForm.category}
                    onChange={(e) => {
                      const selectedCat = categories.find((c) => c.name === e.target.value);
                      setProductForm({
                        ...productForm,
                        category: e.target.value,
                        categorySlug: selectedCat ? selectedCat.slug : 'smartphones',
                      });
                    }}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-semibold"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Цена (₸)</label>
                  <input
                    type="number"
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Старая цена (₸)</label>
                  <input
                    type="number"
                    value={productForm.oldPrice}
                    onChange={(e) => setProductForm({ ...productForm, oldPrice: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Скидка %</label>
                  <input
                    type="number"
                    value={productForm.discountPercent}
                    onChange={(e) => setProductForm({ ...productForm, discountPercent: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Остаток на складе</label>
                <input
                  type="number"
                  value={productForm.stockQuantity}
                  onChange={(e) => setProductForm({ ...productForm, stockQuantity: Number(e.target.value) })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">URL изображения</label>
                <input
                  type="url"
                  value={productForm.mainImage}
                  onChange={(e) => setProductForm({ ...productForm, mainImage: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Описание</label>
                <textarea
                  rows={3}
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950"
                  required
                />
              </div>

              <div className="flex gap-4 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={productForm.isHotDeal}
                    onChange={(e) => setProductForm({ ...productForm, isHotDeal: e.target.checked })}
                    className="rounded text-blue-600"
                  />
                  <span>🔥 Горячее предложение</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={productForm.isTechFriday}
                    onChange={(e) => setProductForm({ ...productForm, isTechFriday: e.target.checked })}
                    className="rounded text-purple-600"
                  />
                  <span>⚡ TECH FRIDAY</span>
                </label>
              </div>

              <div className="pt-4 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 text-white font-bold"
                >
                  Сохранить товар
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
