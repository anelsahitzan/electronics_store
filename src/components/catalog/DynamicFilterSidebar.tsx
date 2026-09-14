'use client';

import React from 'react';
import { useStore } from '@/context/StoreContext';
import { FilterState } from '@/types';
import { X, RotateCcw, Check, Star } from 'lucide-react';

interface DynamicFilterSidebarProps {
  categorySlug?: string;
  filters: FilterState;
  onFilterChange: (updates: Partial<FilterState>) => void;
  onReset: () => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const DynamicFilterSidebar: React.FC<DynamicFilterSidebarProps> = ({
  categorySlug,
  filters,
  onFilterChange,
  onReset,
  isOpenMobile = false,
  onCloseMobile,
}) => {
  const { products } = useStore();

  // Brand toggle
  const toggleBrand = (brandName: string) => {
    const current = filters.brand || [];
    const next = current.includes(brandName)
      ? current.filter((b) => b !== brandName)
      : [...current, brandName];
    onFilterChange({ brand: next });
  };

  // RAM toggle
  const toggleRam = (ramVal: string) => {
    const current = filters.ram || [];
    const next = current.includes(ramVal)
      ? current.filter((r) => r !== ramVal)
      : [...current, ramVal];
    onFilterChange({ ram: next });
  };

  // Storage toggle
  const toggleStorage = (storageVal: string) => {
    const current = filters.storage || [];
    const next = current.includes(storageVal)
      ? current.filter((s) => s !== storageVal)
      : [...current, storageVal];
    onFilterChange({ storage: next });
  };

  // Dynamically extract available brands for category
  const availableBrands = React.useMemo(() => {
    const list = categorySlug
      ? products.filter((p) => p.categorySlug === categorySlug)
      : products;
    const brandsSet = new Set<string>();
    list.forEach((p) => {
      if (p.brand) brandsSet.add(p.brand);
    });
    const result = Array.from(brandsSet);
    return result.length > 0 ? result.slice(0, 16) : ['Apple', 'Samsung', 'ASUS', 'Sony'];
  }, [categorySlug, products]);

  const content = (
    <div className="space-y-6 text-sm">
      {/* Header with reset */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
        <h3 className="font-bold text-base text-slate-900 dark:text-white">Фильтры</h3>
        <button
          onClick={onReset}
          className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium"
        >
          <RotateCcw size={12} /> Сбросить
        </button>
      </div>

      {/* Price Range */}
      <div className="space-y-2.5">
        <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300">
          Цена (₸)
        </h4>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <span className="text-[10px] text-slate-400">от</span>
            <input
              type="number"
              value={filters.minPrice || ''}
              onChange={(e) => onFilterChange({ minPrice: Number(e.target.value) || 0 })}
              placeholder="50 000"
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-white"
            />
          </div>
          <div>
            <span className="text-[10px] text-slate-400">до</span>
            <input
              type="number"
              value={filters.maxPrice || ''}
              onChange={(e) => onFilterChange({ maxPrice: Number(e.target.value) || 2000000 })}
              placeholder="1 500 000"
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* Brand Checkboxes */}
      <div className="space-y-2.5">
        <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300">
          Бренд
        </h4>
        <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
          {availableBrands.map((brand) => {
            const isChecked = filters.brand?.includes(brand);
            return (
              <label
                key={brand}
                className="flex items-center gap-2.5 cursor-pointer text-xs text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 select-none py-0.5"
              >
                <input
                  type="checkbox"
                  checked={isChecked || false}
                  onChange={() => toggleBrand(brand)}
                  className="rounded border-slate-300 dark:border-slate-700 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                />
                <span>{brand}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* RAM Checkboxes (for smartphones / laptops / PC) */}
      {(categorySlug === 'smartphones' || categorySlug === 'laptops' || !categorySlug) && (
        <div className="space-y-2.5">
          <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Оперативная память (RAM)
          </h4>
          <div className="grid grid-cols-2 gap-1.5">
            {['8 GB', '12 GB', '16 GB', '32 GB'].map((ram) => {
              const isChecked = filters.ram?.includes(ram);
              return (
                <button
                  type="button"
                  key={ram}
                  onClick={() => toggleRam(ram)}
                  className={`py-1.5 px-2.5 rounded-lg text-xs font-medium border transition text-center ${
                    isChecked
                      ? 'border-blue-600 bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-bold'
                      : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-400'
                  }`}
                >
                  {ram}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Storage Checkboxes */}
      {(categorySlug === 'smartphones' || categorySlug === 'laptops' || categorySlug === 'storage-devices' || !categorySlug) && (
        <div className="space-y-2.5">
          <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Встроенная память
          </h4>
          <div className="grid grid-cols-2 gap-1.5">
            {['128 GB', '256 GB', '512 GB', '1 TB', '2 TB'].map((st) => {
              const isChecked = filters.storage?.includes(st);
              return (
                <button
                  type="button"
                  key={st}
                  onClick={() => toggleStorage(st)}
                  className={`py-1.5 px-2.5 rounded-lg text-xs font-medium border transition text-center ${
                    isChecked
                      ? 'border-blue-600 bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-bold'
                      : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-400'
                  }`}
                >
                  {st}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Rating Filter */}
      <div className="space-y-2.5">
        <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300">
          Рейтинг от
        </h4>
        <div className="flex gap-2">
          {[4.5, 4.0, 3.5].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => onFilterChange({ rating: filters.rating === r ? undefined : r })}
              className={`flex items-center gap-1 py-1.5 px-2.5 rounded-lg text-xs font-semibold border transition ${
                filters.rating === r
                  ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/40 text-amber-600'
                  : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
              }`}
            >
              <Star size={12} className="fill-amber-400 text-amber-400" />
              <span>{r}+</span>
            </button>
          ))}
        </div>
      </div>

      {/* Quick Toggles */}
      <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
        <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700 dark:text-slate-300 select-none">
          <input
            type="checkbox"
            checked={filters.inStockOnly || false}
            onChange={(e) => onFilterChange({ inStockOnly: e.target.checked })}
            className="rounded border-slate-300 dark:border-slate-700 text-blue-600 w-4 h-4 cursor-pointer"
          />
          <span>Только в наличии</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700 dark:text-slate-300 select-none">
          <input
            type="checkbox"
            checked={filters.hasDiscountOnly || false}
            onChange={(e) => onFilterChange({ hasDiscountOnly: e.target.checked })}
            className="rounded border-slate-300 dark:border-slate-700 text-blue-600 w-4 h-4 cursor-pointer"
          />
          <span>Только со скидкой</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer text-xs text-purple-600 dark:text-purple-400 font-semibold select-none">
          <input
            type="checkbox"
            checked={filters.techFridayOnly || false}
            onChange={(e) => onFilterChange({ techFridayOnly: e.target.checked })}
            className="rounded border-purple-500 text-purple-600 w-4 h-4 cursor-pointer"
          />
          <span>⚡ Акция TECH FRIDAY</span>
        </label>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shrink-0 h-fit sticky top-24 shadow-xs">
        {content}
      </aside>

      {/* Mobile Drawer */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={onCloseMobile}
          />
          <div className="relative ml-auto w-full max-w-xs h-full bg-white dark:bg-slate-900 p-6 overflow-y-auto shadow-2xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-200 dark:border-slate-800">
                <span className="font-bold text-lg text-slate-900 dark:text-white">Фильтры</span>
                <button
                  onClick={onCloseMobile}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white"
                >
                  <X size={22} />
                </button>
              </div>
              {content}
            </div>

            <div className="pt-6 border-t border-slate-200 dark:border-slate-800 mt-6">
              <button
                onClick={onCloseMobile}
                className="w-full py-3 rounded-xl bg-blue-600 text-white font-bold text-sm shadow-md"
              >
                Применить фильтры
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
