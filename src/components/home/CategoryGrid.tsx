'use client';

import React from 'react';
import Link from 'next/link';
import { useStore } from '@/context/StoreContext';
import { ChevronRight } from 'lucide-react';
import { CategoryIcon } from '@/components/common/CategoryIcon';

export const CategoryGrid: React.FC = () => {
  const { categories } = useStore();

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Популярные категории
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Быстрый переход к каталогу электроники
          </p>
        </div>
        <Link
          href="/catalog"
          className="flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
        >
          <span>Весь каталог ({categories.length})</span>
          <ChevronRight size={14} />
        </Link>
      </div>

      {/* Desktop: Grid / Mobile: Horizontal Swipe Scroll */}
      <div className="flex md:grid md:grid-cols-4 lg:grid-cols-6 gap-3 overflow-x-auto no-scrollbar pb-2 md:pb-0">
        {categories.slice(0, 12).map((category) => (
          <Link
            key={category.id}
            href={`/catalog?category=${category.slug}`}
            className="group flex-shrink-0 w-36 sm:w-44 md:w-auto p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 hover:border-blue-500/50 hover:shadow-lg transition-all duration-200 flex flex-col items-center text-center"
          >
            <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/40 group-hover:bg-blue-600/10 flex items-center justify-center mb-2.5 transition transform group-hover:scale-110">
              <CategoryIcon slug={category.slug} size={26} className="text-blue-600 dark:text-blue-400" />
            </div>
            <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition line-clamp-1">
              {category.name}
            </span>
            <span className="text-[11px] text-slate-400 mt-0.5">
              {category.productCount} товаров
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
};
