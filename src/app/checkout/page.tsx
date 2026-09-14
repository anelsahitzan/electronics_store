'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useStore } from '@/context/StoreContext';
import { DeliveryMethod, PaymentMethod, Order } from '@/types';
import {
  CheckCircle2,
  ChevronRight,
  User,
  Truck,
  CreditCard,
  Check,
  MapPin,
  Sparkles,
  ArrowLeft,
  ArrowRight,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, cartSubtotal, cartDiscount, cartTotal, appliedPromoCode, createOrder, selectedCity } = useStore();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form states
  const [formData, setFormData] = useState({
    name: 'Иван Сергеев',
    phone: '+7 (777) 123-45-67',
    email: 'ivan@example.kz',
    city: selectedCity,
    street: 'ул. Айтеке би',
    house: '42',
    apartment: '15',
    deliveryMethod: 'Курьер' as DeliveryMethod,
    paymentMethod: 'Онлайн-оплата (Kaspi / QR)' as PaymentMethod,
  });

  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  if (cart.length === 0 && !confirmedOrder) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Корзина пуста</h2>
        <p className="text-xs text-slate-500 mt-2 mb-6">Добавьте товары в корзину перед переходом к оформлению</p>
        <Link href="/catalog" className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold">
          В каталог
        </Link>
      </div>
    );
  }

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      setStep((s) => (s + 1) as any);
    } else if (step === 3) {
      setStep(4);
    }
  };

  const handleFinalSubmit = () => {
    const order = createOrder({
      customerName: formData.name,
      phone: formData.phone,
      email: formData.email,
      city: formData.city,
      street: formData.street,
      house: formData.house,
      apartment: formData.apartment,
      deliveryMethod: formData.deliveryMethod,
      paymentMethod: formData.paymentMethod,
    });

    setConfirmedOrder(order);

    // Launch celebratory confetti
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (e) {}
  };

  // Success screen
  if (confirmedOrder) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-6 animate-in zoom-in-95 duration-200">
        <div className="w-20 h-20 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto border-2 border-emerald-500/20">
          <CheckCircle2 size={44} />
        </div>

        <div>
          <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
            Заказ успешно оформлен!
          </span>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-2">
            Заказ #{confirmedOrder.id}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Мы отправили детали и квитанцию на {confirmedOrder.email}
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-left space-y-3 text-xs">
          <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
            <span className="text-slate-400">Получатель:</span>
            <span className="font-bold text-slate-900 dark:text-white">{confirmedOrder.customerName}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
            <span className="text-slate-400">Телефон:</span>
            <span className="font-medium text-slate-900 dark:text-white">{confirmedOrder.phone}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
            <span className="text-slate-400">Адрес доставки:</span>
            <span className="font-medium text-slate-900 dark:text-white text-right">
              г. {confirmedOrder.city}, {confirmedOrder.street}, д. {confirmedOrder.house}
            </span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
            <span className="text-slate-400">Способ оплаты:</span>
            <span className="font-semibold text-blue-600 dark:text-blue-400">{confirmedOrder.paymentMethod}</span>
          </div>
          <div className="flex justify-between pt-2 text-sm font-bold">
            <span className="text-slate-900 dark:text-white">Сумма к оплате:</span>
            <span className="text-base font-black text-emerald-600 dark:text-emerald-400">
              {confirmedOrder.total.toLocaleString('ru-RU')} ₸
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Link
            href="/profile"
            className="flex-1 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition"
          >
            Смотреть статус в личном кабинете
          </Link>
          <Link
            href="/"
            className="flex-1 py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs transition"
          >
            На главную
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Checkout Progress Stepper */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight text-center sm:text-left mb-6">
          Оформление заказа
        </h1>

        <div className="grid grid-cols-4 gap-2">
          {[
            { num: 1, label: 'Контакты', icon: User },
            { num: 2, label: 'Доставка', icon: Truck },
            { num: 3, label: 'Оплата', icon: CreditCard },
            { num: 4, label: 'Подтверждение', icon: Check },
          ].map((s) => {
            const Icon = s.icon;
            const isCompleted = step > s.num;
            const isCurrent = step === s.num;

            return (
              <div
                key={s.num}
                className={`flex flex-col sm:flex-row items-center gap-2 p-2 sm:p-3 rounded-xl border transition ${
                  isCurrent
                    ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400'
                    : isCompleted
                    ? 'border-emerald-500/50 bg-emerald-50/20 text-emerald-600'
                    : 'border-slate-200 dark:border-slate-800 text-slate-400'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                    isCurrent
                      ? 'bg-blue-600 text-white'
                      : isCompleted
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                  }`}
                >
                  {isCompleted ? <Check size={14} /> : s.num}
                </div>
                <span className="text-[11px] font-bold hidden sm:inline">{s.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Step Forms */}
        <div className="lg:col-span-8 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          {/* STEP 1: Contacts */}
          {step === 1 && (
            <form onSubmit={handleNext} className="space-y-4">
              <h2 className="text-base font-bold text-slate-900 dark:text-white pb-2 border-b border-slate-100 dark:border-slate-800">
                Шаг 1: Контактные данные
              </h2>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Имя и фамилия получателя
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Иван Сергеев"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Номер телефона
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+7 (777) 123-45-67"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Электронная почта (Email)
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="ivan@example.kz"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 transition"
                >
                  <span>Далее: Доставка</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: Delivery */}
          {step === 2 && (
            <form onSubmit={handleNext} className="space-y-5">
              <h2 className="text-base font-bold text-slate-900 dark:text-white pb-2 border-b border-slate-100 dark:border-slate-800">
                Шаг 2: Способ доставки и адрес
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {(['Курьер', 'Самовывоз', 'Пункт выдачи'] as DeliveryMethod[]).map((method) => (
                  <button
                    type="button"
                    key={method}
                    onClick={() => setFormData({ ...formData, deliveryMethod: method })}
                    className={`p-3.5 rounded-xl border text-left transition ${
                      formData.deliveryMethod === method
                        ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 ring-1 ring-blue-600'
                        : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-400'
                    }`}
                  >
                    <div className="font-bold text-xs">{method}</div>
                    <div className="text-[10px] text-slate-400 mt-1">
                      {method === 'Курьер' ? 'До двери (0 ₸)' : 'Бесплатно в г. Кызылорда'}
                    </div>
                  </button>
                ))}
              </div>

              <div className="space-y-3 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Город
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-white"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Улица
                    </label>
                    <input
                      type="text"
                      value={formData.street}
                      onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                      placeholder="ул. Айтеке би"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-white"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Дом
                      </label>
                      <input
                        type="text"
                        value={formData.house}
                        onChange={(e) => setFormData({ ...formData, house: e.target.value })}
                        placeholder="42"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Кв.
                      </label>
                      <input
                        type="text"
                        value={formData.apartment}
                        onChange={(e) => setFormData({ ...formData, apartment: e.target.value })}
                        placeholder="15"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300"
                >
                  ← Назад
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 transition"
                >
                  <span>Далее: Оплата</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: Payment */}
          {step === 3 && (
            <form onSubmit={handleNext} className="space-y-4">
              <h2 className="text-base font-bold text-slate-900 dark:text-white pb-2 border-b border-slate-100 dark:border-slate-800">
                Шаг 3: Способ оплаты
              </h2>

              <div className="space-y-2.5">
                {[
                  {
                    name: 'Онлайн-оплата (Kaspi / QR)' as PaymentMethod,
                    badge: 'Популярно',
                    desc: 'Мгновенная оплата через приложение Kaspi.kz по QR-коду',
                  },
                  {
                    name: 'Банковская карта' as PaymentMethod,
                    desc: 'Visa, MasterCard, Halyk Bank без комиссии',
                  },
                  {
                    name: 'Оплата при получении' as PaymentMethod,
                    desc: 'Наличными или картой курьеру при передаче заказа',
                  },
                ].map((opt) => (
                  <label
                    key={opt.name}
                    className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition ${
                      formData.paymentMethod === opt.name
                        ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/40 ring-1 ring-blue-600'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-400'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={formData.paymentMethod === opt.name}
                      onChange={() => setFormData({ ...formData, paymentMethod: opt.name })}
                      className="mt-1 text-blue-600 focus:ring-blue-500"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-900 dark:text-white">
                          {opt.name}
                        </span>
                        {opt.badge && (
                          <span className="px-2 py-0.5 rounded-md bg-red-500 text-white text-[10px] font-bold">
                            {opt.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">{opt.desc}</p>
                    </div>
                  </label>
                ))}
              </div>

              <div className="pt-4 flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300"
                >
                  ← Назад
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 transition"
                >
                  <span>Проверить и подтвердить</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            </form>
          )}

          {/* STEP 4: Confirmation */}
          {step === 4 && (
            <div className="space-y-6">
              <h2 className="text-base font-bold text-slate-900 dark:text-white pb-2 border-b border-slate-100 dark:border-slate-800">
                Шаг 4: Подтверждение заказа
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-xs space-y-2 sm:space-y-0">
                <div>
                  <h4 className="font-bold text-slate-400 uppercase tracking-wider text-[10px] mb-1">
                    Получатель:
                  </h4>
                  <p className="font-bold text-slate-900 dark:text-white">{formData.name}</p>
                  <p className="text-slate-500">{formData.phone}</p>
                  <p className="text-slate-500">{formData.email}</p>
                </div>

                <div>
                  <h4 className="font-bold text-slate-400 uppercase tracking-wider text-[10px] mb-1">
                    Доставка и оплата:
                  </h4>
                  <p className="font-medium text-slate-900 dark:text-white">
                    {formData.deliveryMethod}: г. {formData.city}, {formData.street} {formData.house}
                  </p>
                  <p className="font-semibold text-blue-600 dark:text-blue-400 mt-1">
                    {formData.paymentMethod}
                  </p>
                </div>
              </div>

              {/* Items in order */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Состав заказа ({cart.length} поз.):
                </h4>
                <div className="space-y-1.5 max-h-48 overflow-y-auto">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between text-xs py-1.5 border-b border-slate-100 dark:border-slate-800/80"
                    >
                      <div className="truncate max-w-xs">
                        <span className="font-bold text-slate-900 dark:text-white">
                          {item.product.title}
                        </span>{' '}
                        <span className="text-slate-400">× {item.quantity}</span>
                      </div>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {(item.unitPrice * item.quantity).toLocaleString('ru-RU')} ₸
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300"
                >
                  ← Изменить
                </button>
                <button
                  type="button"
                  onClick={handleFinalSubmit}
                  className="px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-sm shadow-xl shadow-blue-500/25 transition"
                >
                  Подтвердить заказ ({cartTotal.toLocaleString('ru-RU')} ₸)
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Mini Order Summary */}
        <div className="lg:col-span-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white pb-2 border-b border-slate-100 dark:border-slate-800">
            Ваш заказ
          </h3>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between text-slate-500">
              <span>Сумма товаров:</span>
              <span className="font-semibold text-slate-900 dark:text-white">
                {cartSubtotal.toLocaleString('ru-RU')} ₸
              </span>
            </div>

            {cartDiscount > 0 && (
              <div className="flex justify-between text-orange-500 font-semibold">
                <span>Скидка:</span>
                <span>-{cartDiscount.toLocaleString('ru-RU')} ₸</span>
              </div>
            )}

            <div className="flex justify-between text-slate-500">
              <span>Доставка:</span>
              <span className="font-semibold text-emerald-600">0 ₸</span>
            </div>

            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-between items-baseline">
              <span className="font-bold text-slate-900 dark:text-white">Итого:</span>
              <span className="text-xl font-black text-blue-600 dark:text-blue-400">
                {cartTotal.toLocaleString('ru-RU')} ₸
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
