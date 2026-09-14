'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useStore } from '@/context/StoreContext';
import { ShoppingCart, Trash2, Tag, Check, ArrowRight, ShieldCheck, Truck } from 'lucide-react';

export default function CartPage() {
  const router = useRouter();
  const {
    cart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    cartSubtotal,
    cartDiscount,
    cartTotal,
    appliedPromoCode,
    applyPromoCode,
    removePromoCode,
  } = useStore();

  const [promoInput, setPromoInput] = useState('');
  const [promoMessage, setPromoMessage] = useState<{ text: string; isError: boolean } | null>(null);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;

    const res = applyPromoCode(promoInput);
    if (res.success) {
      setPromoMessage({ text: res.message, isError: false });
      setPromoInput('');
    } else {
      setPromoMessage({ text: res.message, isError: true });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
            <ShoppingCart size={28} className="text-blue-600" />
            <span>Корзина покупок</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Проверьте состав заказа перед оформлением
          </p>
        </div>

        {cart.length > 0 && (
          <button
            onClick={clearCart}
            className="flex items-center gap-1.5 text-xs text-rose-500 hover:text-rose-600 font-semibold"
          >
            <Trash2 size={14} />
            <span>Очистить корзину</span>
          </button>
        )}
      </div>

      {cart.length === 0 ? (
        <div className="py-20 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8">
          <ShoppingCart size={48} className="mx-auto text-slate-400 mb-4 stroke-1" />
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Ваша корзина пуста
          </h2>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-6">
            Выберите необходимые девайсы из каталога или воспользуйтесь подбором AI.
          </p>
          <Link
            href="/catalog"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition"
          >
            <span>Перейти к покупкам</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Cart Items List */}
          <div className="lg:col-span-8 space-y-3">
            {cart.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between transition hover:shadow-xs"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={item.product.mainImage}
                    alt={item.product.title}
                    className="w-20 h-20 object-contain rounded-xl bg-slate-50 dark:bg-slate-950 p-2 shrink-0"
                  />
                  <div>
                    <Link
                      href={`/product/${item.product.id}`}
                      className="font-bold text-sm text-slate-900 dark:text-white hover:text-blue-600 transition line-clamp-1"
                    >
                      {item.product.title}
                    </Link>
                    <div className="text-xs text-slate-400 mt-0.5 space-x-2">
                      <span>Цвет: {item.selectedColor}</span>
                      {item.selectedStorage && (
                        <span>• Память: {item.selectedStorage}</span>
                      )}
                    </div>
                    <div className="text-sm font-black text-blue-600 dark:text-blue-400 mt-1">
                      {item.unitPrice.toLocaleString('ru-RU')} ₸
                    </div>
                  </div>
                </div>

                {/* Counter & Subtotal */}
                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
                  <div className="flex items-center rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-1">
                    <button
                      onClick={() => updateCartQuantity(item.id, -1)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 font-bold text-sm"
                    >
                      -
                    </button>
                    <span className="w-8 text-center font-bold text-xs text-slate-900 dark:text-white">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateCartQuantity(item.id, 1)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 font-bold text-sm"
                    >
                      +
                    </button>
                  </div>

                  <div className="text-right min-w-[100px]">
                    <div className="text-base font-black text-slate-900 dark:text-white">
                      {(item.unitPrice * item.quantity).toLocaleString('ru-RU')} ₸
                    </div>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg transition"
                    title="Удалить товар"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Cart Summary & Checkout Sidebar */}
          <div className="lg:col-span-4 space-y-4">
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5 shadow-sm">
              <h2 className="font-bold text-base text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800">
                Сумма заказа
              </h2>

              {/* Promo code input form */}
              <div className="space-y-2">
                <form onSubmit={handleApplyPromo} className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag size={14} className="absolute left-3 top-3 text-slate-400" />
                    <input
                      type="text"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      placeholder="Промокод (TECHFRIDAY)"
                      className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs uppercase font-semibold text-slate-900 dark:text-white"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-blue-600 hover:text-white text-xs font-bold transition"
                  >
                    Применить
                  </button>
                </form>

                {/* Promo application status feedback */}
                {appliedPromoCode && (
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-400 text-xs">
                    <span className="flex items-center gap-1 font-bold">
                      <Check size={14} /> Промокод «{appliedPromoCode.code}»
                    </span>
                    <button
                      onClick={removePromoCode}
                      className="text-rose-500 hover:underline text-[11px]"
                    >
                      Отменить
                    </button>
                  </div>
                )}

                {promoMessage && (
                  <p
                    className={`text-xs ${
                      promoMessage.isError ? 'text-rose-500' : 'text-emerald-600'
                    }`}
                  >
                    {promoMessage.text}
                  </p>
                )}
              </div>

              {/* Price Calculations breakdown */}
              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Товары:</span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {cartSubtotal.toLocaleString('ru-RU')} ₸
                  </span>
                </div>

                {cartDiscount > 0 && (
                  <div className="flex justify-between text-orange-500 font-semibold">
                    <span>Скидка по промокоду:</span>
                    <span>-{cartDiscount.toLocaleString('ru-RU')} ₸</span>
                  </div>
                )}

                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Доставка по Кызылорде:</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                    0 ₸ (Бесплатно)
                  </span>
                </div>

                <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-between items-baseline">
                  <span className="text-sm font-bold text-slate-900 dark:text-white">
                    Итого к оплате:
                  </span>
                  <span className="text-xl font-black text-blue-600 dark:text-blue-400">
                    {cartTotal.toLocaleString('ru-RU')} ₸
                  </span>
                </div>
              </div>

              {/* Checkout CTA */}
              <button
                onClick={() => router.push('/checkout')}
                className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2"
              >
                <span>Оформить заказ</span>
                <ArrowRight size={16} />
              </button>

              <div className="pt-2 text-[11px] text-slate-400 space-y-1.5">
                <div className="flex items-center gap-1.5">
                  <Truck size={13} className="text-blue-500" />
                  <span>Доставка курьером до двери</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck size={13} className="text-emerald-500" />
                  <span>Безопасная оплата Kaspi / Картой</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
