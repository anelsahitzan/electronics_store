'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useStore } from '@/context/StoreContext';
import { Scale, X, ShoppingCart, Trash2, ArrowRight } from 'lucide-react';

export default function ComparePage() {
  const { comparison, toggleComparison, clearComparison, products, addToCart } = useStore();
  const [onlyDifferences, setOnlyDifferences] = useState(false);

  // Get selected products
  const comparedProducts = products.filter((p) => comparison.includes(p.id));

  // Collect all unique specs across compared products
  const allSpecKeys = Array.from(
    new Set(
      comparedProducts.flatMap((p) =>
        Object.entries(p.specs || {}).flatMap(([group, params]) =>
          Object.keys(params).map((k) => `${group} : ${k}`)
        )
      )
    )
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
            <Scale size={28} className="text-blue-600" />
            <span>Сравнение товаров</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Сравните характеристики и выберите идеальный девайс ({comparedProducts.length} из 4)
          </p>
        </div>

        {comparedProducts.length > 0 && (
          <div className="flex items-center gap-4">
            {/* Toggle differences */}
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700 dark:text-slate-300 select-none">
              <input
                type="checkbox"
                checked={onlyDifferences}
                onChange={(e) => setOnlyDifferences(e.target.checked)}
                className="rounded border-slate-300 dark:border-slate-700 text-blue-600 w-4 h-4 cursor-pointer"
              />
              <span>Только различающиеся</span>
            </label>

            <button
              onClick={clearComparison}
              className="flex items-center gap-1 text-xs text-rose-500 hover:text-rose-600 font-semibold"
            >
              <Trash2 size={14} />
              <span>Очистить</span>
            </button>
          </div>
        )}
      </div>

      {comparedProducts.length === 0 ? (
        <div className="py-20 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8">
          <Scale size={48} className="mx-auto text-slate-400 mb-4 stroke-1" />
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Список сравнения пуст
          </h2>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-6">
            Добавляйте товары к сравнению с помощью значка весов в каталоге или карточке товара.
          </p>
          <Link
            href="/catalog"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition"
          >
            <span>Перейти в каталог</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <table className="w-full text-left border-collapse min-w-[650px]">
            {/* Table Header: Product cards row */}
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800">
                <th className="p-4 w-48 text-xs font-bold text-slate-400 uppercase tracking-wider bg-slate-50 dark:bg-slate-950/40">
                  Параметр
                </th>
                {comparedProducts.map((p) => (
                  <th key={p.id} className="p-4 w-64 align-top">
                    <div className="relative flex flex-col items-center text-center space-y-2">
                      <button
                        onClick={() => toggleComparison(p.id)}
                        className="absolute -top-1 -right-1 p-1 rounded-full text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                        title="Удалить из сравнения"
                      >
                        <X size={16} />
                      </button>

                      <img
                        src={p.mainImage}
                        alt={p.title}
                        className="w-24 h-24 object-contain rounded-xl"
                      />
                      <Link
                        href={`/product/${p.id}`}
                        className="font-bold text-xs text-slate-900 dark:text-white hover:text-blue-600 line-clamp-2"
                      >
                        {p.title}
                      </Link>
                      <div className="font-black text-sm text-blue-600 dark:text-blue-400">
                        {p.price.toLocaleString('ru-RU')} ₸
                      </div>
                      <button
                        onClick={() => {
                          addToCart(p);
                        }}
                        className="w-full py-2 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center gap-1 transition"
                      >
                        <ShoppingCart size={13} />
                        <span>В корзину</span>
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            {/* General specs rows */}
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-xs">
              {/* Rating */}
              <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                <td className="p-3.5 font-bold text-slate-500 bg-slate-50/30 dark:bg-slate-950/20">
                  Рейтинг
                </td>
                {comparedProducts.map((p) => (
                  <td key={p.id} className="p-3.5 text-center font-bold text-slate-900 dark:text-white">
                    ⭐ {p.rating} ({p.reviewsCount})
                  </td>
                ))}
              </tr>

              {/* Dynamic specs comparison */}
              {allSpecKeys.map((fullKey) => {
                const [group, param] = fullKey.split(' : ');
                const values = comparedProducts.map((p) => p.specs?.[group]?.[param] || '—');
                const isDifferent = new Set(values).size > 1;

                if (onlyDifferences && !isDifferent) return null;

                return (
                  <tr
                    key={fullKey}
                    className={`transition ${
                      isDifferent
                        ? 'bg-blue-50/30 dark:bg-blue-950/20 font-medium'
                        : 'hover:bg-slate-50/50 dark:hover:bg-slate-800/30'
                    }`}
                  >
                    <td className="p-3.5 font-semibold text-slate-600 dark:text-slate-400 bg-slate-50/30 dark:bg-slate-950/20">
                      <div>{param}</div>
                      <div className="text-[10px] text-slate-400 font-normal">{group}</div>
                    </td>
                    {values.map((val, idx) => (
                      <td
                        key={idx}
                        className={`p-3.5 text-center ${
                          isDifferent ? 'text-blue-700 dark:text-blue-300 font-bold' : 'text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {val}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
