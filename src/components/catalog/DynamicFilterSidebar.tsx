'use client';

import React, { useState, useMemo } from 'react';
import { useStore } from '@/context/StoreContext';
import { FilterState } from '@/types';
import { X, RotateCcw, Search, ChevronDown, ChevronUp, Star, Sliders, Cpu, HardDrive, Layers, Laptop } from 'lucide-react';

interface DynamicFilterSidebarProps {
  categorySlug?: string;
  filters: FilterState;
  onFilterChange: (updates: Partial<FilterState>) => void;
  onReset: () => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
  totalMatches?: number;
}

export const DynamicFilterSidebar: React.FC<DynamicFilterSidebarProps> = ({
  categorySlug,
  filters,
  onFilterChange,
  onReset,
  isOpenMobile = false,
  onCloseMobile,
  totalMatches,
}) => {
  const { products } = useStore();

  // Search terms inside filter lists
  const [modelSearch, setModelSearch] = useState('');
  const [brandSearch, setBrandSearch] = useState('');

  // Collapsible section states
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    models: true,
    processors: true,
    ram: true,
    storage: true,
    brands: true,
    price: true,
    diagonal: false,
    rating: false,
    options: true,
  });

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  // Toggle helper for array filters
  const toggleArrayFilter = (key: keyof FilterState, value: string) => {
    const current = (filters[key] as string[]) || [];
    const next = current.includes(value)
      ? current.filter((item) => item !== value)
      : [...current, value];
    onFilterChange({ [key]: next });
  };

  // 1. Available Model Series based on category
  const availableModelSeries = useMemo(() => {
    if (categorySlug === 'smartphones') {
      return [
        { id: 'iPhone 18', label: 'Apple iPhone 18', group: 'Apple' },
        { id: 'iPhone 17', label: 'Apple iPhone 17', group: 'Apple' },
        { id: 'iPhone 16', label: 'Apple iPhone 16', group: 'Apple' },
        { id: 'iPhone 15', label: 'Apple iPhone 15', group: 'Apple' },
        { id: 'iPhone 14', label: 'Apple iPhone 14', group: 'Apple' },
        { id: 'iPhone 13', label: 'Apple iPhone 13', group: 'Apple' },
        { id: 'Galaxy S25', label: 'Samsung Galaxy S25', group: 'Samsung' },
        { id: 'Galaxy S24', label: 'Samsung Galaxy S24', group: 'Samsung' },
        { id: 'Galaxy Z', label: 'Samsung Galaxy Z (Fold/Flip)', group: 'Samsung' },
        { id: 'Galaxy A', label: 'Samsung Galaxy A-серия', group: 'Samsung' },
        { id: 'Xiaomi 15', label: 'Xiaomi 15 / 14-серия', group: 'Xiaomi' },
        { id: 'Redmi Note', label: 'Xiaomi Redmi Note', group: 'Xiaomi' },
        { id: 'Google Pixel', label: 'Google Pixel 9 / 8', group: 'Google' },
        { id: 'POCO', label: 'POCO F6 / X6', group: 'Xiaomi' },
        { id: 'OnePlus', label: 'OnePlus 13 / 12', group: 'OnePlus' },
      ];
    }

    if (categorySlug === 'laptops') {
      return [
        { id: 'MacBook M4', label: 'Apple MacBook (M4 / Pro / Max)', group: 'Apple' },
        { id: 'MacBook M3', label: 'Apple MacBook (M3)', group: 'Apple' },
        { id: 'MacBook M2', label: 'Apple MacBook (M2)', group: 'Apple' },
        { id: 'MacBook M1', label: 'Apple MacBook Air (M1)', group: 'Apple' },
        { id: 'ASUS ROG', label: 'ASUS ROG (Zephyrus / Strix)', group: 'ASUS' },
        { id: 'ASUS TUF', label: 'ASUS TUF Gaming', group: 'ASUS' },
        { id: 'Lenovo Legion', label: 'Lenovo Legion Pro / Slim', group: 'Lenovo' },
        { id: 'Lenovo ThinkPad', label: 'Lenovo ThinkPad X1 / T14', group: 'Lenovo' },
        { id: 'Acer Predator', label: 'Acer Predator / Nitro', group: 'Acer' },
        { id: 'HP Victus / Omen', label: 'HP Victus & OMEN', group: 'HP' },
        { id: 'Dell XPS', label: 'Dell XPS / Alienware', group: 'Dell' },
      ];
    }

    if (categorySlug === 'pc' || categorySlug === 'tablets') {
      return [
        { id: 'MacBook M4', label: 'Apple Silicon M4', group: 'Apple' },
        { id: 'MacBook M2', label: 'Apple Silicon M2', group: 'Apple' },
        { id: 'iPad Pro', label: 'Apple iPad Pro', group: 'Apple' },
        { id: 'iPad Air', label: 'Apple iPad Air', group: 'Apple' },
      ];
    }

    // Default / All categories
    return [
      { id: 'iPhone 18', label: 'Apple iPhone 18', group: 'Смартфоны' },
      { id: 'iPhone 17', label: 'Apple iPhone 17', group: 'Смартфоны' },
      { id: 'iPhone 16', label: 'Apple iPhone 16', group: 'Смартфоны' },
      { id: 'MacBook M4', label: 'Apple MacBook M4', group: 'Ноутбуки' },
      { id: 'MacBook M3', label: 'Apple MacBook M3', group: 'Ноутбуки' },
      { id: 'MacBook M2', label: 'Apple MacBook M2', group: 'Ноутбуки' },
      { id: 'MacBook M1', label: 'Apple MacBook M1', group: 'Ноутбуки' },
      { id: 'Galaxy S25', label: 'Samsung Galaxy S25', group: 'Смартфоны' },
      { id: 'Galaxy S24', label: 'Samsung Galaxy S24', group: 'Смартфоны' },
      { id: 'ASUS ROG', label: 'ASUS ROG Gaming', group: 'Ноутбуки' },
      { id: 'Lenovo Legion', label: 'Lenovo Legion', group: 'Ноутбуки' },
    ];
  }, [categorySlug]);

  const filteredModelSeries = useMemo(() => {
    if (!modelSearch.trim()) return availableModelSeries;
    const q = modelSearch.toLowerCase();
    return availableModelSeries.filter(
      (m) => m.label.toLowerCase().includes(q) || m.id.toLowerCase().includes(q)
    );
  }, [availableModelSeries, modelSearch]);

  // 2. Available Processors
  const availableProcessors = useMemo(() => {
    if (categorySlug === 'laptops' || categorySlug === 'pc') {
      return [
        'Apple M4',
        'Apple M3',
        'Apple M2',
        'Apple M1',
        'Intel Core Ultra / i9',
        'Intel Core i7 / Ultra 7',
        'AMD Ryzen 9',
        'AMD Ryzen 7',
      ];
    }
    if (categorySlug === 'smartphones') {
      return [
        'Apple A19 Pro',
        'Apple A18 Pro',
        'Apple A17 Pro',
        'Apple A16 Bionic',
        'Snapdragon 8 Gen 3',
      ];
    }
    return [
      'Apple M4',
      'Apple M3',
      'Apple M2',
      'Apple M1',
      'Apple A19 Pro',
      'Apple A18 Pro',
      'Intel Core Ultra / i9',
      'Intel Core i7 / Ultra 7',
      'AMD Ryzen 9',
      'Snapdragon 8 Gen 3',
    ];
  }, [categorySlug]);

  // 3. Available Brands
  const availableBrands = useMemo(() => {
    const list = categorySlug
      ? products.filter((p) => p.categorySlug === categorySlug)
      : products;
    const brandsMap = new Map<string, number>();
    list.forEach((p) => {
      if (p.brand) {
        brandsMap.set(p.brand, (brandsMap.get(p.brand) || 0) + 1);
      }
    });

    return Array.from(brandsMap.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([brand, count]) => ({ brand, count }));
  }, [categorySlug, products]);

  const filteredBrands = useMemo(() => {
    if (!brandSearch.trim()) return availableBrands;
    const q = brandSearch.toLowerCase();
    return availableBrands.filter((b) => b.brand.toLowerCase().includes(q));
  }, [availableBrands, brandSearch]);

  // Check active count
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.brand?.length) count += filters.brand.length;
    if (filters.modelSeries?.length) count += filters.modelSeries.length;
    if (filters.processor?.length) count += filters.processor.length;
    if (filters.ram?.length) count += filters.ram.length;
    if (filters.storage?.length) count += filters.storage.length;
    if (filters.diagonal?.length) count += filters.diagonal.length;
    if (filters.minPrice || filters.maxPrice) count += 1;
    if (filters.inStockOnly) count += 1;
    if (filters.hasDiscountOnly) count += 1;
    if (filters.techFridayOnly) count += 1;
    if (filters.rating) count += 1;
    return count;
  }, [filters]);

  const content = (
    <div className="space-y-5 text-sm">
      {/* Header with Title and Reset */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Sliders size={16} className="text-blue-600 dark:text-blue-400" />
          <h3 className="font-bold text-base text-slate-900 dark:text-white">Фильтры</h3>
          {activeFiltersCount > 0 && (
            <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-blue-600 text-white">
              {activeFiltersCount}
            </span>
          )}
        </div>
        {activeFiltersCount > 0 && (
          <button
            onClick={onReset}
            className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:underline font-semibold"
          >
            <RotateCcw size={12} /> Сбросить
          </button>
        )}
      </div>

      {/* 1. Model / Series Filter (Kaspi style: iPhone 16/17/18, MacBook M1-M4) */}
      <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
        <button
          type="button"
          onClick={() => toggleSection('models')}
          className="w-full flex items-center justify-between font-bold text-xs uppercase tracking-wider text-slate-800 dark:text-slate-200 mb-2"
        >
          <span className="flex items-center gap-1.5">
            <Layers size={14} className="text-blue-500" />
            Линейка / Модели
            {filters.modelSeries?.length ? (
              <span className="text-blue-600 dark:text-blue-400">({filters.modelSeries.length})</span>
            ) : null}
          </span>
          {openSections.models ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
        </button>

        {openSections.models && (
          <div className="space-y-2 pt-1">
            {availableModelSeries.length > 8 && (
              <div className="relative">
                <Search size={13} className="absolute left-2.5 top-2 text-slate-400" />
                <input
                  type="text"
                  value={modelSearch}
                  onChange={(e) => setModelSearch(e.target.value)}
                  placeholder="Поиск линейки..."
                  className="w-full pl-8 pr-2 py-1 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
                />
              </div>
            )}

            <div className="space-y-1 max-h-52 overflow-y-auto pr-1">
              {filteredModelSeries.map((item) => {
                const isChecked = filters.modelSeries?.includes(item.id);
                return (
                  <label
                    key={item.id}
                    className={`flex items-center justify-between p-1.5 rounded-lg cursor-pointer text-xs select-none transition ${
                      isChecked
                        ? 'bg-blue-50/80 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-semibold'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <input
                        type="checkbox"
                        checked={isChecked || false}
                        onChange={() => toggleArrayFilter('modelSeries', item.id)}
                        className="rounded border-slate-300 dark:border-slate-700 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                      />
                      <span>{item.label}</span>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* 2. Processors (CPU / Chip) */}
      {(categorySlug === 'smartphones' || categorySlug === 'laptops' || categorySlug === 'pc' || !categorySlug) && (
        <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
          <button
            type="button"
            onClick={() => toggleSection('processors')}
            className="w-full flex items-center justify-between font-bold text-xs uppercase tracking-wider text-slate-800 dark:text-slate-200 mb-2"
          >
            <span className="flex items-center gap-1.5">
              <Cpu size={14} className="text-blue-500" />
              Процессор / Чип
              {filters.processor?.length ? (
                <span className="text-blue-600 dark:text-blue-400">({filters.processor.length})</span>
              ) : null}
            </span>
            {openSections.processors ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
          </button>

          {openSections.processors && (
            <div className="space-y-1.5 pt-1 max-h-48 overflow-y-auto pr-1">
              {availableProcessors.map((proc) => {
                const isChecked = filters.processor?.includes(proc);
                return (
                  <label
                    key={proc}
                    className={`flex items-center gap-2.5 p-1.5 rounded-lg cursor-pointer text-xs select-none transition ${
                      isChecked
                        ? 'bg-blue-50/80 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-semibold'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked || false}
                      onChange={() => toggleArrayFilter('processor', proc)}
                      className="rounded border-slate-300 dark:border-slate-700 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                    />
                    <span>{proc}</span>
                  </label>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 3. RAM (Оперативная память) - Chips layout */}
      {(categorySlug === 'smartphones' || categorySlug === 'laptops' || categorySlug === 'pc' || categorySlug === 'tablets' || !categorySlug) && (
        <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
          <button
            type="button"
            onClick={() => toggleSection('ram')}
            className="w-full flex items-center justify-between font-bold text-xs uppercase tracking-wider text-slate-800 dark:text-slate-200 mb-2"
          >
            <span>Оперативная память (RAM)</span>
            {openSections.ram ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
          </button>

          {openSections.ram && (
            <div className="grid grid-cols-3 gap-1.5 pt-1">
              {['8 GB', '12 GB', '16 GB', '24 GB', '32 GB', '64 GB'].map((ram) => {
                const isChecked = filters.ram?.includes(ram);
                return (
                  <button
                    type="button"
                    key={ram}
                    onClick={() => toggleArrayFilter('ram', ram)}
                    className={`py-1.5 px-2 rounded-lg text-xs font-semibold border transition text-center ${
                      isChecked
                        ? 'border-blue-600 bg-blue-600 text-white shadow-xs'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-slate-400 dark:hover:border-slate-600'
                    }`}
                  >
                    {ram}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 4. Storage / SSD (Встроенная память) - Chips layout */}
      {(categorySlug === 'smartphones' || categorySlug === 'laptops' || categorySlug === 'pc' || categorySlug === 'storage-devices' || categorySlug === 'tablets' || !categorySlug) && (
        <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
          <button
            type="button"
            onClick={() => toggleSection('storage')}
            className="w-full flex items-center justify-between font-bold text-xs uppercase tracking-wider text-slate-800 dark:text-slate-200 mb-2"
          >
            <span className="flex items-center gap-1.5">
              <HardDrive size={14} className="text-blue-500" />
              Встроенная память / SSD
            </span>
            {openSections.storage ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
          </button>

          {openSections.storage && (
            <div className="grid grid-cols-3 gap-1.5 pt-1">
              {['128 GB', '256 GB', '512 GB', '1 TB', '2 TB'].map((st) => {
                const isChecked = filters.storage?.includes(st);
                return (
                  <button
                    type="button"
                    key={st}
                    onClick={() => toggleArrayFilter('storage', st)}
                    className={`py-1.5 px-2 rounded-lg text-xs font-semibold border transition text-center ${
                      isChecked
                        ? 'border-blue-600 bg-blue-600 text-white shadow-xs'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-slate-400 dark:hover:border-slate-600'
                    }`}
                  >
                    {st}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 5. Screen Diagonal */}
      {(categorySlug === 'smartphones' || categorySlug === 'laptops' || categorySlug === 'monitors' || categorySlug === 'tv' || !categorySlug) && (
        <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
          <button
            type="button"
            onClick={() => toggleSection('diagonal')}
            className="w-full flex items-center justify-between font-bold text-xs uppercase tracking-wider text-slate-800 dark:text-slate-200 mb-2"
          >
            <span className="flex items-center gap-1.5">
              <Laptop size={14} className="text-blue-500" />
              Диагональ экрана
            </span>
            {openSections.diagonal ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
          </button>

          {openSections.diagonal && (
            <div className="space-y-1.5 pt-1">
              {['6.1" - 6.3"', '6.7" - 6.9"', '13" - 14"', '15" - 16"', '17"+'].map((diag) => {
                const isChecked = filters.diagonal?.includes(diag);
                return (
                  <label
                    key={diag}
                    className={`flex items-center gap-2.5 p-1.5 rounded-lg cursor-pointer text-xs select-none transition ${
                      isChecked
                        ? 'bg-blue-50/80 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-semibold'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked || false}
                      onChange={() => toggleArrayFilter('diagonal', diag)}
                      className="rounded border-slate-300 dark:border-slate-700 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                    />
                    <span>{diag}</span>
                  </label>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 6. Brand Filter with Search */}
      <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
        <button
          type="button"
          onClick={() => toggleSection('brands')}
          className="w-full flex items-center justify-between font-bold text-xs uppercase tracking-wider text-slate-800 dark:text-slate-200 mb-2"
        >
          <span>
            Бренд {filters.brand?.length ? <span className="text-blue-600">({filters.brand.length})</span> : null}
          </span>
          {openSections.brands ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
        </button>

        {openSections.brands && (
          <div className="space-y-2 pt-1">
            {availableBrands.length > 7 && (
              <div className="relative">
                <Search size={13} className="absolute left-2.5 top-2 text-slate-400" />
                <input
                  type="text"
                  value={brandSearch}
                  onChange={(e) => setBrandSearch(e.target.value)}
                  placeholder="Поиск бренда..."
                  className="w-full pl-8 pr-2 py-1 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
                />
              </div>
            )}

            <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
              {filteredBrands.map(({ brand, count }) => {
                const isChecked = filters.brand?.includes(brand);
                return (
                  <label
                    key={brand}
                    className={`flex items-center justify-between p-1.5 rounded-lg cursor-pointer text-xs select-none transition ${
                      isChecked
                        ? 'bg-blue-50/80 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-semibold'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <input
                        type="checkbox"
                        checked={isChecked || false}
                        onChange={() => toggleArrayFilter('brand', brand)}
                        className="rounded border-slate-300 dark:border-slate-700 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                      />
                      <span>{brand}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-normal">({count})</span>
                  </label>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* 7. Price Range (₸) */}
      <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
        <button
          type="button"
          onClick={() => toggleSection('price')}
          className="w-full flex items-center justify-between font-bold text-xs uppercase tracking-wider text-slate-800 dark:text-slate-200 mb-2"
        >
          <span>Цена (₸)</span>
          {openSections.price ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
        </button>

        {openSections.price && (
          <div className="grid grid-cols-2 gap-2 pt-1">
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
                onChange={(e) => onFilterChange({ maxPrice: Number(e.target.value) || undefined })}
                placeholder="2 000 000"
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-white"
              />
            </div>
          </div>
        )}
      </div>

      {/* 8. Rating Filter */}
      <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
        <button
          type="button"
          onClick={() => toggleSection('rating')}
          className="w-full flex items-center justify-between font-bold text-xs uppercase tracking-wider text-slate-800 dark:text-slate-200 mb-2"
        >
          <span>Рейтинг от</span>
          {openSections.rating ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
        </button>

        {openSections.rating && (
          <div className="flex gap-2 pt-1">
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
        )}
      </div>

      {/* 9. Options / Availability / Tech Friday */}
      <div className="space-y-2 pt-1">
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

        <label className="flex items-center gap-2 cursor-pointer text-xs text-blue-600 dark:text-blue-400 font-semibold select-none">
          <input
            type="checkbox"
            checked={filters.techFridayOnly || false}
            onChange={(e) => onFilterChange({ techFridayOnly: e.target.checked })}
            className="rounded border-blue-500 text-blue-600 w-4 h-4 cursor-pointer"
          />
          <span>⚡ Акция TECH FRIDAY</span>
        </label>
      </div>

      {/* Total match indicator button for mobile or quick view */}
      {totalMatches !== undefined && (
        <div className="pt-2">
          <div className="w-full py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs text-center font-medium">
            Найдено товаров: <span className="font-bold text-slate-900 dark:text-white">{totalMatches}</span>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 p-5 rounded-2xl bg-white dark:bg-[#141b29] border border-slate-200/80 dark:border-slate-800/80 shrink-0 h-fit sticky top-24 shadow-[0_2px_12px_rgba(0,0,0,0.04)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.25)]">
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

            <div className="pt-6 border-t border-slate-200 dark:border-slate-800 mt-6 sticky bottom-0 bg-white dark:bg-slate-900 pb-2">
              <button
                onClick={onCloseMobile}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition"
              >
                Показать {totalMatches !== undefined ? `(${totalMatches})` : 'результаты'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
