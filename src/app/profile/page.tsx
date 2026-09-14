'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useStore } from '@/context/StoreContext';
import {
  Package,
  Heart,
  MessageSquare,
  MapPin,
  User,
  Bell,
  Settings,
  LogOut,
  Shield,
  Clock,
  CheckCircle2,
  Truck,
  AlertCircle,
} from 'lucide-react';

function ProfileContent() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') || 'orders';

  const {
    currentUser,
    logout,
    switchRole,
    orders,
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    reviews,
    setAuthModalOpen,
  } = useStore();

  const [activeTab, setActiveTab] = useState<string>(initialTab);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<string | null>(null);

  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-blue-600/10 text-blue-600 flex items-center justify-center mx-auto">
          <User size={32} />
        </div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">
          Вход в личный кабинет
        </h1>
        <p className="text-xs text-slate-500">
          Пожалуйста, войдите в аккаунт, чтобы просматривать историю заказов и настройки.
        </p>
        <button
          onClick={() => setAuthModalOpen(true)}
          className="w-full py-3 rounded-xl bg-blue-600 text-white font-bold text-xs"
        >
          Войти в профиль
        </button>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Доставлен':
        return 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 border-emerald-500/20';
      case 'В пути':
        return 'bg-blue-50 text-blue-600 dark:bg-blue-950/40 border-blue-500/20';
      case 'Передан курьеру':
      case 'Собирается':
        return 'bg-amber-50 text-amber-600 dark:bg-amber-950/40 border-amber-500/20';
      case 'Отменён':
        return 'bg-rose-50 text-rose-600 dark:bg-rose-950/40 border-rose-500/20';
      case 'Оплачен':
      default:
        return 'bg-purple-50 text-purple-600 dark:bg-purple-950/40 border-purple-500/20';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Top Banner User Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-900/50 via-slate-900 to-indigo-950/50 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black text-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            {currentUser.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                Здравствуйте, {currentUser.name}
              </h1>
              <span className="px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-400 text-[10px] font-bold uppercase tracking-wider">
                {currentUser.role}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {currentUser.email} • {currentUser.phone}
            </p>
          </div>
        </div>

        {/* Quick actions: role switcher & admin access */}
        <div className="flex flex-wrap items-center gap-2">
          {currentUser.role === 'ADMIN' ? (
            <Link
              href="/admin"
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs shadow-md shadow-blue-500/25 transition"
            >
              <Shield size={14} />
              <span>Панель Администратора</span>
            </Link>
          ) : (
            <button
              onClick={() => switchRole('ADMIN')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold"
            >
              <Shield size={14} /> Переключить на роль ADMIN
            </button>
          )}

          <button
            onClick={logout}
            className="p-2.5 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition"
            title="Выйти из аккаунта"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>

      {/* Main Grid: Tabs Sidebar + Tab Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Navigation Tabs */}
        <div className="lg:col-span-3 p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
          {[
            { id: 'orders', label: 'Мои заказы', icon: Package, badge: orders.length },
            { id: 'notifications', label: 'Уведомления', icon: Bell, badge: notifications.filter((n) => !n.isRead).length },
            { id: 'addresses', label: 'Адреса доставки', icon: MapPin },
            { id: 'reviews', label: 'Мои отзывы', icon: MessageSquare },
            { id: 'profile', label: 'Настройки профиля', icon: Settings },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setSelectedOrderDetails(null);
                }}
                className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-semibold transition ${
                  isActive
                    ? 'bg-blue-600 text-white font-bold shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon size={16} />
                  <span>{tab.label}</span>
                </div>
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      isActive ? 'bg-white text-blue-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Content Panels */}
        <div className="lg:col-span-9 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 min-h-[400px]">
          {/* TAB: Orders */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <h2 className="text-base font-bold text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800">
                История заказов
              </h2>

              {orders.length === 0 ? (
                <div className="py-12 text-center text-slate-400 text-xs">
                  У вас пока нет оформленных заказов
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 transition hover:border-slate-400"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800 text-xs">
                        <div className="space-y-0.5">
                          <span className="font-black text-sm text-slate-900 dark:text-white">
                            Заказ #{order.id}
                          </span>
                          <p className="text-slate-400">
                            {new Date(order.createdAt).toLocaleDateString('ru-RU', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                            })}
                          </p>
                        </div>

                        <div className="flex items-center gap-3">
                          <span
                            className={`px-3 py-1 rounded-xl text-xs font-bold border ${getStatusBadge(
                              order.status
                            )}`}
                          >
                            🚚 {order.status}
                          </span>
                          <span className="font-black text-sm text-slate-900 dark:text-white">
                            {order.total.toLocaleString('ru-RU')} ₸
                          </span>
                        </div>
                      </div>

                      {/* Items row preview */}
                      <div className="space-y-2">
                        {order.items.map((it, idx) => (
                          <div key={idx} className="flex items-center gap-3 text-xs">
                            <img
                              src={it.product.mainImage}
                              alt={it.product.title}
                              className="w-12 h-12 object-contain rounded-lg border border-slate-200 dark:border-slate-800 p-1"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-slate-900 dark:text-white truncate">
                                {it.product.title}
                              </p>
                              <p className="text-[11px] text-slate-400">
                                {it.quantity} шт. • {it.selectedColor} {it.selectedStorage ? `• ${it.selectedStorage}` : ''}
                              </p>
                            </div>
                            <span className="font-bold text-slate-900 dark:text-white">
                              {(it.unitPrice * it.quantity).toLocaleString('ru-RU')} ₸
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Expand / Details */}
                      <div className="pt-2 flex items-center justify-between text-xs text-slate-400">
                        <span>
                          Доставка: г. {order.city}, {order.street} {order.house}
                        </span>
                        <button
                          onClick={() =>
                            setSelectedOrderDetails(
                              selectedOrderDetails === order.id ? null : order.id
                            )
                          }
                          className="font-bold text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          {selectedOrderDetails === order.id ? 'Скрыть детали' : 'Подробнее о заказе'}
                        </button>
                      </div>

                      {selectedOrderDetails === order.id && (
                        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 text-xs space-y-2 border border-slate-200 dark:border-slate-800">
                          <p>
                            <span className="text-slate-400">Способ доставки:</span> {order.deliveryMethod}
                          </p>
                          <p>
                            <span className="text-slate-400">Способ оплаты:</span> {order.paymentMethod}
                          </p>
                          {order.promoCodeApplied && (
                            <p>
                              <span className="text-slate-400">Применен промокод:</span> {order.promoCodeApplied}
                            </p>
                          )}
                          <p>
                            <span className="text-slate-400">Сумма товаров:</span> {order.subtotal.toLocaleString('ru-RU')} ₸
                          </p>
                          <p>
                            <span className="text-slate-400">Скидка:</span> -{order.discount.toLocaleString('ru-RU')} ₸
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB: Notifications */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  Центр уведомлений
                </h2>
                <button
                  onClick={markAllNotificationsAsRead}
                  className="text-xs text-blue-600 hover:underline"
                >
                  Прочитать все
                </button>
              </div>

              <div className="space-y-3">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    onClick={() => markNotificationAsRead(notif.id)}
                    className={`p-4 rounded-xl border transition cursor-pointer flex items-start gap-3.5 ${
                      notif.isRead
                        ? 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 opacity-70'
                        : 'border-blue-500/40 bg-blue-50/20 dark:bg-blue-950/20 ring-1 ring-blue-500/20'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-lg bg-blue-600/10 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                      <Bell size={16} />
                    </div>
                    <div className="flex-1 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 dark:text-white">{notif.title}</span>
                        <span className="text-[10px] text-slate-400">{notif.date}</span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-300 mt-1">{notif.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: Addresses */}
          {activeTab === 'addresses' && (
            <div className="space-y-6">
              <h2 className="text-base font-bold text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800">
                Сохраненные адреса доставки
              </h2>

              <div className="space-y-3">
                {currentUser.addresses?.map((addr, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <MapPin size={18} className="text-blue-600" />
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white">
                          г. {addr.city}
                        </p>
                        <p className="text-slate-400">{addr.address}</p>
                      </div>
                    </div>
                    {addr.isDefault && (
                      <span className="px-2.5 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 text-[10px] font-bold">
                        Основной
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: Profile Settings */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <h2 className="text-base font-bold text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800">
                Личные данные
              </h2>

              <div className="space-y-4 text-xs max-w-md">
                <div>
                  <label className="block text-slate-400 mb-1">Имя</label>
                  <input
                    type="text"
                    defaultValue={currentUser.name}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Email</label>
                  <input
                    type="email"
                    defaultValue={currentUser.email}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Телефон</label>
                  <input
                    type="tel"
                    defaultValue={currentUser.phone}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950"
                  />
                </div>
                <button className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold">
                  Сохранить изменения
                </button>
              </div>
            </div>
          )}

          {/* TAB: My Reviews */}
          {activeTab === 'reviews' && (
            <div className="space-y-6">
              <h2 className="text-base font-bold text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800">
                Мои отзывы
              </h2>
              <div className="space-y-3">
                {reviews.map((rev) => (
                  <div key={rev.id} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 dark:text-white">Оценка: {rev.rating} ★</span>
                      <span className="text-slate-400">{rev.date}</span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300">{rev.content}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto p-12 text-center">Загрузка профиля...</div>}>
      <ProfileContent />
    </Suspense>
  );
}
