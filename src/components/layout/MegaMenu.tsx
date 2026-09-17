'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Category, Product } from '@/types';
import {
  ChevronRight,
  ArrowRight,
  Flame,
  Sparkles,
  Award,
  Tag,
  Star,
  Layers,
} from 'lucide-react';
import { CategoryIcon } from '@/components/common/CategoryIcon';

interface MegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  products: Product[];
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export const MegaMenu: React.FC<MegaMenuProps> = ({
  isOpen,
  onClose,
  categories,
  products,
  onMouseEnter,
  onMouseLeave,
}) => {
  const router = useRouter();
  const [activeSlug, setActiveSlug] = useState<string>(categories[0]?.slug || 'smartphones');

  // Sync active slug if categories load or change
  useEffect(() => {
    if (categories.length > 0 && !categories.some((c) => c.slug === activeSlug)) {
      setActiveSlug(categories[0].slug);
    }
  }, [categories, activeSlug]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Current active category
  const activeCategory = useMemo(() => {
    return categories.find((c) => c.slug === activeSlug) || categories[0];
  }, [categories, activeSlug]);

  // Products belonging to active category
  const categoryProducts = useMemo(() => {
    return products.filter((p) => p.categorySlug === activeSlug);
  }, [products, activeSlug]);

  // Extract top brands for the active category
  const categoryBrands = useMemo(() => {
    const set = new Set<string>();
    categoryProducts.forEach((p) => {
      if (p.brand) set.add(p.brand);
    });
    return Array.from(set).slice(0, 10);
  }, [categoryProducts]);

  // 3 featured / top products in this category
  const featuredProducts = useMemo(() => {
    return categoryProducts.slice(0, 3);
  }, [categoryProducts]);

  if (!isOpen || !activeCategory) return null;

  const handleCategoryClick = (slug: string) => {
    onClose();
    router.push(`/catalog?category=${slug}`);
  };

  const handleBrandClick = (brand: string) => {
    onClose();
    router.push(`/catalog?category=${activeSlug}&brand=${encodeURIComponent(brand)}`);
  };

  return (
    <>
      {/* Backdrop overlay */}
      <div
        onClick={onClose}
        className="fixed inset-0 top-[110px] bg-slate-950/40 backdrop-blur-xs z-40 transition-opacity animate-in fade-in duration-150"
        aria-hidden="true"
      />

      {/* Mega Menu Container */}
      <div
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        className="absolute left-0 right-0 top-full z-50 px-4 pt-2 pb-6 max-w-7xl mx-auto pointer-events-auto animate-in fade-in slide-in-from-top-2 duration-150"
      >
        <div className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex h-[510px]">
          {/* Left Column: All 14 Categories */}
          <div className="w-72 shrink-0 border-r border-slate-100 dark:border-slate-800/80 bg-slate-50/80 dark:bg-slate-950/50 p-3 overflow-y-auto no-scrollbar space-y-1">
            <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
              <span>Категории</span>
              <span className="text-[10px] bg-slate-200/60 dark:bg-slate-800 px-1.5 py-0.5 rounded-md font-mono">
                {categories.length}
              </span>
            </div>

            {categories.map((cat) => {
              const isActive = cat.slug === activeSlug;
              return (
                <button
                  key={cat.id}
                  onMouseEnter={() => setActiveSlug(cat.slug)}
                  onClick={() => handleCategoryClick(cat.slug)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all text-left group ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-slate-800/60 hover:text-blue-600 dark:hover:text-blue-400'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <span className="shrink-0 flex items-center justify-center w-5 h-5">
                      <CategoryIcon
                        slug={cat.slug}
                        size={17}
                        className={isActive ? 'text-white' : 'text-blue-600 dark:text-blue-400 group-hover:text-blue-500'}
                      />
                    </span>
                    <span className="truncate">{cat.name}</span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.5 rounded-md ${
                        isActive
                          ? 'bg-blue-700/60 text-blue-100'
                          : 'text-slate-400 bg-slate-200/40 dark:bg-slate-800/40'
                      }`}
                    >
                      {cat.productCount}
                    </span>
                    <ChevronRight
                      size={14}
                      className={`transition-transform ${
                        isActive ? 'text-white translate-x-0.5' : 'text-slate-400 group-hover:translate-x-0.5'
                      }`}
                    />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Pane: Category Overview, Brands, Filters & Featured Products */}
          <div className="flex-1 p-6 overflow-y-auto no-scrollbar flex flex-col justify-between bg-white dark:bg-slate-900">
            <div>
              {/* Category Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800/80">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200/50 dark:border-blue-900/50 flex items-center justify-center shadow-xs">
                    <CategoryIcon slug={activeCategory.slug} size={24} className="text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                      {activeCategory.name}
                    </h2>
                    <p className="text-xs text-slate-400">
                      В наличии {activeCategory.productCount} товаров с официальной гарантией и доставкой
                    </p>
                  </div>
                </div>

                <Link
                  href={`/catalog?category=${activeCategory.slug}`}
                  onClick={onClose}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-xs shadow-blue-500/20"
                >
                  <span>Все товары категории</span>
                  <ArrowRight size={14} />
                </Link>
              </div>

              {/* Brands Section */}
              {categoryBrands.length > 0 && (
                <div className="mt-5">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                    <Layers size={13} />
                    <span>Популярные бренды в категории:</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {categoryBrands.map((brand) => (
                      <button
                        key={brand}
                        onClick={() => handleBrandClick(brand)}
                        className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/30 text-slate-800 dark:text-slate-200 text-xs font-semibold transition"
                      >
                        {brand}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick Filters / Curated Sets */}
              <div className="mt-5">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                  <Tag size={13} />
                  <span>Быстрые подборки:</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <Link
                    href={`/catalog?category=${activeCategory.slug}&filter=hot-deals`}
                    onClick={onClose}
                    className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-rose-50 dark:hover:bg-rose-950/20 hover:border-rose-300 dark:hover:border-rose-900 transition flex items-center gap-2"
                  >
                    <span className="w-7 h-7 rounded-lg bg-rose-100 dark:bg-rose-900/50 text-rose-600 flex items-center justify-center shrink-0">
                      %
                    </span>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      Со скидкой
                    </span>
                  </Link>

                  <Link
                    href={`/catalog?category=${activeCategory.slug}&filter=tech-friday`}
                    onClick={onClose}
                    className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-amber-50 dark:hover:bg-amber-950/20 hover:border-amber-300 dark:hover:border-amber-900 transition flex items-center gap-2"
                  >
                    <span className="w-7 h-7 rounded-lg bg-amber-100 dark:bg-amber-900/50 text-amber-600 flex items-center justify-center shrink-0">
                      <Flame size={14} className="fill-amber-500" />
                    </span>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      TECH FRIDAY
                    </span>
                  </Link>

                  <Link
                    href={`/catalog?category=${activeCategory.slug}&filter=new`}
                    onClick={onClose}
                    className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-blue-50 dark:hover:bg-blue-950/20 hover:border-blue-300 dark:hover:border-blue-900 transition flex items-center gap-2"
                  >
                    <span className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-900/50 text-blue-600 flex items-center justify-center shrink-0">
                      <Sparkles size={14} />
                    </span>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      Новинки 2026
                    </span>
                  </Link>

                  <Link
                    href={`/catalog?category=${activeCategory.slug}&filter=bestsellers`}
                    onClick={onClose}
                    className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 hover:border-emerald-300 dark:hover:border-emerald-900 transition flex items-center gap-2"
                  >
                    <span className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 flex items-center justify-center shrink-0">
                      <Award size={14} />
                    </span>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      Хиты продаж
                    </span>
                  </Link>
                </div>
              </div>

              {/* Featured 3 Products Preview */}
              {featuredProducts.length > 0 && (
                <div className="mt-5">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
                    Популярные модели:
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {featuredProducts.map((p) => (
                      <Link
                        key={p.id}
                        href={`/product/${p.id}`}
                        onClick={onClose}
                        className="group p-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 bg-slate-50/50 dark:bg-slate-800/30 hover:bg-white dark:hover:bg-slate-800 transition flex items-center gap-3"
                      >
                        <img
                          src={p.mainImage}
                          alt={p.title}
                          className="w-14 h-14 object-cover rounded-xl border border-slate-200 dark:border-slate-700 group-hover:scale-105 transition shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                            {p.title}
                          </p>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-xs font-extrabold text-blue-600 dark:text-blue-400">
                              {p.price.toLocaleString('ru-RU')} ₸
                            </span>
                            {p.discountPercent && (
                              <span className="text-[10px] font-bold px-1 rounded bg-rose-500/10 text-rose-600 dark:text-rose-400">
                                -{p.discountPercent}%
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-0.5">
                            <Star size={10} className="fill-amber-400 text-amber-400" />
                            <span>{p.rating}</span>
                            <span>• {p.salesCount} купили</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Bottom bar summary */}
            <div className="pt-3 mt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
              <span>Доставка по всему Казахстану • Гарантия лучшей цены в Кызылорде</span>
              <Link
                href="/catalog"
                onClick={onClose}
                className="font-semibold text-blue-600 dark:text-blue-400 hover:underline"
              >
                Открыть весь каталог (все категории) →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
