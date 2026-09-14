'use client';

import React from 'react';
import Link from 'next/link';
import { useStore } from '@/context/StoreContext';
import { ProductCard } from '@/components/product/ProductCard';
import { Heart, Bell, ArrowRight } from 'lucide-react';

export default function WishlistPage() {
  const { wishlist, products } = useStore();

  const wishlistedProducts = products.filter((p) => wishlist.includes(p.id));

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
            <Heart size={28} className="text-rose-500 fill-rose-500" />
            <span>Избранное</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Сохраненные вами товары ({wishlistedProducts.length} товаров)
          </p>
        </div>
      </div>

      {wishlistedProducts.length === 0 ? (
        <div className="py-20 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8">
          <Heart size={48} className="mx-auto text-slate-400 mb-4 stroke-1" />
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            В избранном пока ничего нет
          </h2>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-6">
            Добавляйте понравившиеся товары, чтобы следить за изменениями цен и скидками.
          </p>
          <Link
            href="/catalog"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition"
          >
            <span>В каталог товаров</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Price drops banner if any product has discounts */}
          {wishlistedProducts.some((p) => p.oldPrice && p.oldPrice > p.price) && (
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 flex items-center gap-3 text-amber-800 dark:text-amber-300 text-xs">
              <Bell size={18} className="text-amber-600 shrink-0" />
              <div>
                <span className="font-bold">🔔 Отличные новости!</span> Цены на некоторые товары из вашего избранного снизились. Успейте оформить заказ по выгодной цене!
              </div>
            </div>
          )}

          {/* Grid of Products with price-drop indicator */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {wishlistedProducts.map((product) => {
              const priceDiff = product.oldPrice ? product.oldPrice - product.price : 0;
              return (
                <div key={product.id} className="relative flex flex-col">
                  {priceDiff > 0 && (
                    <div className="mb-2 p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-300 text-[11px] font-bold flex items-center gap-1.5">
                      <Bell size={12} className="text-emerald-600" />
                      <span>Цена снизилась на {priceDiff.toLocaleString('ru-RU')} ₸</span>
                    </div>
                  )}
                  <ProductCard product={product} />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
