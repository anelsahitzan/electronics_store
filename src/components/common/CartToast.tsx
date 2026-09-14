'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useStore } from '@/context/StoreContext';
import { Check, ShoppingCart, X, ArrowRight } from 'lucide-react';

export const CartToast: React.FC = () => {
  const { cartToast, closeCartToast } = useStore();

  useEffect(() => {
    if (!cartToast) return;
    const timer = setTimeout(() => {
      closeCartToast();
    }, 4000);
    return () => clearTimeout(timer);
  }, [cartToast, closeCartToast]);

  if (!cartToast) return null;

  const { product, selectedColor, selectedStorage, quantity } = cartToast;

  return (
    <aside
      aria-label="Уведомление о добавлении в корзину"
      className="fixed bottom-20 md:bottom-6 right-4 z-50 max-w-sm w-[calc(100vw-2rem)] rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-4 animate-in slide-in-from-bottom-5 duration-300 backdrop-blur-md"
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
          <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center">
            <Check size={12} strokeWidth={3} />
          </div>
          <span>Добавлено в корзину</span>
        </div>
        <button
          onClick={closeCartToast}
          className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white transition"
          aria-label="Закрыть уведомление"
        >
          <X size={15} />
        </button>
      </div>

      {/* Product preview */}
      <div className="flex items-center gap-3">
        <img
          src={product.mainImage}
          alt={product.title}
          className="w-14 h-14 object-contain rounded-xl bg-slate-50 dark:bg-slate-950 p-1 border border-slate-200 dark:border-slate-800 shrink-0"
        />
        <div className="flex-1 min-w-0">
          <p className="font-bold text-xs text-slate-900 dark:text-white truncate">
            {product.title}
          </p>
          <p className="text-[11px] text-slate-400 truncate mt-0.5">
            {selectedColor} {selectedStorage ? `• ${selectedStorage}` : ''} • {quantity} шт.
          </p>
          <p className="text-xs font-black text-blue-600 dark:text-blue-400 mt-1">
            {product.price.toLocaleString('ru-RU')} ₸
          </p>
        </div>
      </div>

      {/* Action buttons */}
      <div className="mt-3 pt-2 flex items-center gap-2">
        <Link
          href="/cart"
          onClick={closeCartToast}
          className="flex-1 py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs text-center flex items-center justify-center gap-1.5 transition shadow-xs"
        >
          <ShoppingCart size={13} />
          <span>В корзину</span>
          <ArrowRight size={13} />
        </Link>
        <button
          onClick={closeCartToast}
          className="py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold text-xs transition"
        >
          Продолжить
        </button>
      </div>
    </aside>
  );
};
