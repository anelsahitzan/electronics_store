'use client';

import React, { useState, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useStore } from '@/context/StoreContext';
import { ProductCard } from '@/components/product/ProductCard';
import { DynamicFilterSidebar } from '@/components/catalog/DynamicFilterSidebar';
import { FilterState, Product } from '@/types';
import { SlidersHorizontal, ChevronRight, ChevronLeft, ArrowUpDown, X } from 'lucide-react';
import { CategoryIcon } from '@/components/common/CategoryIcon';

function CatalogContent() {
  const searchParams = useSearchParams();
  const { products, categories } = useStore();

  const initialCategorySlug = searchParams.get('category') || undefined;
  const initialSearchQuery = searchParams.get('q') || undefined;
  const initialBrand = searchParams.get('brand') ? [searchParams.get('brand')!] : undefined;
  const initialFilter = searchParams.get('filter');

  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState<number>(24);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const [filters, setFilters] = useState<FilterState>({
    category: initialCategorySlug,
    searchQuery: initialSearchQuery,
    brand: initialBrand,
    techFridayOnly: initialFilter === 'tech-friday',
    hasDiscountOnly: initialFilter === 'hot-deals',
    sortBy: initialFilter === 'new' ? 'newest' : initialFilter === 'bestsellers' ? 'popular' : 'popular',
  });

  // Current active category details
  const currentCategory = categories.find((c) => c.slug === filters.category);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let list = [...products];

    // Category filter
    if (filters.category) {
      list = list.filter((p) => p.categorySlug === filters.category);
    }

    // Search query
    if (filters.searchQuery) {
      const q = filters.searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    // Brands
    if (filters.brand && filters.brand.length > 0) {
      list = list.filter((p) => filters.brand!.includes(p.brand));
    }

    // Price range
    if (filters.minPrice !== undefined) {
      list = list.filter((p) => p.price >= filters.minPrice!);
    }
    if (filters.maxPrice !== undefined) {
      list = list.filter((p) => p.price <= filters.maxPrice!);
    }

    // In stock
    if (filters.inStockOnly) {
      list = list.filter((p) => p.inStock);
    }

    // Discount
    if (filters.hasDiscountOnly) {
      list = list.filter((p) => p.discountPercent && p.discountPercent > 0);
    }

    // Tech Friday
    if (filters.techFridayOnly) {
      list = list.filter((p) => p.isTechFriday);
    }

    // Rating
    if (filters.rating !== undefined) {
      list = list.filter((p) => p.rating >= filters.rating!);
    }

    // Model Series filter (iPhone 18, 17, 16, MacBook M1-M4, Galaxy, etc.)
    if (filters.modelSeries && filters.modelSeries.length > 0) {
      list = list.filter((p) => {
        const text = (
          p.title +
          ' ' +
          (p.specs?.['Основные характеристики']?.['Модель'] || '') +
          ' ' +
          (p.tags || []).join(' ')
        ).toLowerCase();
        const cpu = (
          p.specs?.['Технические параметры']?.['Процессор (CPU)'] || ''
        ).toLowerCase();

        return filters.modelSeries!.some((series) => {
          const s = series.toLowerCase();
          if (series === 'MacBook M4') return text.includes('macbook') && (text.includes('m4') || cpu.includes('m4'));
          if (series === 'MacBook M3') return text.includes('macbook') && (text.includes('m3') || cpu.includes('m3'));
          if (series === 'MacBook M2') return text.includes('macbook') && (text.includes('m2') || cpu.includes('m2'));
          if (series === 'MacBook M1') return text.includes('macbook') && (text.includes('m1') || cpu.includes('m1'));
          if (series === 'iPhone 18') return text.includes('iphone 18');
          if (series === 'iPhone 17') return text.includes('iphone 17');
          if (series === 'iPhone 16') return text.includes('iphone 16');
          if (series === 'iPhone 15') return text.includes('iphone 15');
          if (series === 'iPhone 14') return text.includes('iphone 14');
          if (series === 'iPhone 13') return text.includes('iphone 13');
          if (series === 'Galaxy S25') return text.includes('s25');
          if (series === 'Galaxy S24') return text.includes('s24');
          if (series === 'Galaxy Z') return text.includes('z fold') || text.includes('z flip');
          if (series === 'Galaxy A') return text.includes('galaxy a');
          if (series === 'Redmi Note') return text.includes('redmi note');
          if (series === 'Google Pixel') return text.includes('pixel');
          if (series === 'ASUS ROG') return text.includes('rog');
          if (series === 'ASUS TUF') return text.includes('tuf');
          if (series === 'Lenovo Legion') return text.includes('legion');
          if (series === 'Lenovo ThinkPad') return text.includes('thinkpad');
          if (series === 'HP Victus / Omen') return text.includes('victus') || text.includes('omen');
          if (series === 'Dell XPS') return text.includes('xps');
          return text.includes(s);
        });
      });
    }

    // Processor (CPU / Chip) filter
    if (filters.processor && filters.processor.length > 0) {
      list = list.filter((p) => {
        const cpuSpec = (
          p.specs?.['Технические параметры']?.['Процессор (CPU)'] ||
          p.specs?.['Технические параметры']?.['Процессор'] ||
          ''
        ).toLowerCase();
        const text = (p.title + ' ' + (p.tags || []).join(' ')).toLowerCase();
        const full = cpuSpec + ' ' + text;

        return filters.processor!.some((proc) => {
          if (proc === 'Apple M4') return full.includes('m4');
          if (proc === 'Apple M3') return full.includes('m3');
          if (proc === 'Apple M2') return full.includes('m2');
          if (proc === 'Apple M1') return full.includes('m1');
          if (proc === 'Apple A19 Pro') return full.includes('a19');
          if (proc === 'Apple A18 Pro') return full.includes('a18');
          if (proc === 'Apple A17 Pro') return full.includes('a17');
          if (proc === 'Apple A16 Bionic') return full.includes('a16');
          if (proc === 'Snapdragon 8 Gen 3') return full.includes('snapdragon 8 gen 3') || (full.includes('snapdragon') && full.includes('gen 3'));
          if (proc === 'Intel Core Ultra / i9') return full.includes('i9') || full.includes('ultra 9');
          if (proc === 'Intel Core i7 / Ultra 7') return full.includes('i7') || full.includes('ultra 7');
          if (proc === 'AMD Ryzen 9') return full.includes('ryzen 9');
          if (proc === 'AMD Ryzen 7') return full.includes('ryzen 7');
          return full.includes(proc.toLowerCase());
        });
      });
    }

    // RAM filter
    if (filters.ram && filters.ram.length > 0) {
      list = list.filter((p) => {
        const ramSpec = (
          p.specs?.['Технические параметры']?.['Оперативная память'] ||
          p.specs?.['Память']?.['Оперативная память (RAM)'] ||
          p.specs?.['Память']?.['RAM'] ||
          ''
        ).toLowerCase();
        const titleAndDesc = (p.title + ' ' + (p.description || '')).toLowerCase();
        const optCapacities = (p.storageOptions || []).map((o) => o.capacity.toLowerCase()).join(' ');
        const combined = ramSpec + ' ' + titleAndDesc + ' ' + optCapacities;

        return filters.ram!.some((r) => {
          const num = r.replace(/[^0-9]/g, '');
          return (
            combined.includes(`${num} gb`) ||
            combined.includes(`${num}gb`) ||
            combined.includes(`${num} гб`) ||
            ramSpec.includes(r.toLowerCase())
          );
        });
      });
    }

    // Storage / SSD filter
    if (filters.storage && filters.storage.length > 0) {
      list = list.filter((p) => {
        const storageSpec = (
          p.specs?.['Технические параметры']?.['Накопитель'] ||
          p.specs?.['Память']?.['Встроенная память (ROM)'] ||
          p.specs?.['Память']?.['ROM'] ||
          ''
        ).toLowerCase();
        const titleAndDesc = (p.title + ' ' + (p.description || '')).toLowerCase();
        const optCapacities = (p.storageOptions || []).map((o) => o.capacity.toLowerCase()).join(' ');
        const combined = storageSpec + ' ' + titleAndDesc + ' ' + optCapacities;

        return filters.storage!.some((st) => {
          const stClean = st.toLowerCase();
          return (
            storageSpec.includes(stClean) ||
            combined.includes(stClean) ||
            (stClean === '1 tb' && (combined.includes('1 tb') || combined.includes('1024 gb') || combined.includes('1тб'))) ||
            (stClean === '2 tb' && (combined.includes('2 tb') || combined.includes('2048 gb') || combined.includes('2тб')))
          );
        });
      });
    }

    // Diagonal filter
    if (filters.diagonal && filters.diagonal.length > 0) {
      list = list.filter((p) => {
        const screenSpec = (
          p.specs?.['Технические параметры']?.['Экран / Дисплей'] ||
          p.specs?.['Экран']?.['Диагональ'] ||
          p.title
        ).toLowerCase();

        return filters.diagonal!.some((diag) => {
          if (diag === '6.1" - 6.3"') return screenSpec.includes('6.1') || screenSpec.includes('6.2') || screenSpec.includes('6.3');
          if (diag === '6.7" - 6.9"') return screenSpec.includes('6.7') || screenSpec.includes('6.8') || screenSpec.includes('6.9');
          if (diag === '13" - 14"') return screenSpec.includes('13.') || screenSpec.includes('13"') || screenSpec.includes('14.') || screenSpec.includes('14"');
          if (diag === '15" - 16"') return screenSpec.includes('15.') || screenSpec.includes('15"') || screenSpec.includes('16.') || screenSpec.includes('16"');
          if (diag === '17"+') return screenSpec.includes('17.') || screenSpec.includes('17"') || screenSpec.includes('18"');
          return screenSpec.includes(diag.toLowerCase());
        });
      });
    }

    // Sorting
    list.sort((a, b) => {
      switch (filters.sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'price_asc':
          return a.price - b.price;
        case 'price_desc':
          return b.price - a.price;
        case 'discount':
          return (b.discountPercent || 0) - (a.discountPercent || 0);
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'popular':
        default:
          return b.salesCount - a.salesCount;
      }
    });

    return list;
  }, [products, filters]);

  // Pagination calculation
  const totalItems = filteredProducts.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const displayedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleFilterChange = (updates: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...updates }));
    setCurrentPage(1);
  };

  const handleRemoveFilter = (key: keyof FilterState, value: string) => {
    const current = (filters[key] as string[]) || [];
    setFilters((prev) => ({
      ...prev,
      [key]: current.filter((v) => v !== value),
    }));
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setFilters({
      category: filters.category,
      brand: [],
      modelSeries: [],
      processor: [],
      ram: [],
      storage: [],
      diagonal: [],
      minPrice: undefined,
      maxPrice: undefined,
      inStockOnly: false,
      hasDiscountOnly: false,
      techFridayOnly: false,
      rating: undefined,
      sortBy: 'popular',
    });
    setCurrentPage(1);
  };

  const hasActiveFilters = Boolean(
    filters.brand?.length ||
    filters.modelSeries?.length ||
    filters.processor?.length ||
    filters.ram?.length ||
    filters.storage?.length ||
    filters.diagonal?.length ||
    filters.minPrice ||
    filters.maxPrice ||
    filters.inStockOnly ||
    filters.hasDiscountOnly ||
    filters.techFridayOnly ||
    filters.rating
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-slate-400">
        <Link href="/" className="hover:text-blue-600 transition">
          Главная
        </Link>
        <ChevronRight size={12} />
        <Link href="/catalog" className="hover:text-blue-600 transition">
          Каталог
        </Link>
        {currentCategory && (
          <>
            <ChevronRight size={12} />
            <span className="text-slate-900 dark:text-white font-medium">
              {currentCategory.name}
            </span>
          </>
        )}
      </nav>

      {/* Page Title & Count Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            {currentCategory && (
              <span className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200/50 dark:border-blue-900/50 text-blue-600 dark:text-blue-400 shrink-0 inline-flex items-center justify-center">
                <CategoryIcon slug={currentCategory.slug} size={22} />
              </span>
            )}
            <span>{currentCategory ? currentCategory.name : 'Все товары электроники'}</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Найдено: <span className="font-bold text-slate-900 dark:text-white">{totalItems}</span> товаров
          </p>
        </div>

        {/* Toolbar: Filter mobile toggle + Sort dropdown */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="flex lg:hidden items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold transition shadow-xs"
          >
            <SlidersHorizontal size={15} />
            <span>Фильтры</span>
          </button>

          {/* Sort selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 hidden sm:inline">Сортировка:</span>
            <div className="relative">
              <select
                value={filters.sortBy || 'popular'}
                onChange={(e) => handleFilterChange({ sortBy: e.target.value as any })}
                className="appearance-none pl-3 pr-8 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold border-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                <option value="popular">По популярности</option>
                <option value="rating">По рейтингу</option>
                <option value="price_asc">По цене: сначала дешёвые</option>
                <option value="price_desc">По цене: сначала дорогие</option>
                <option value="discount">По скидке</option>
                <option value="newest">Новинки</option>
              </select>
              <ArrowUpDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Layout: Sidebar + Product Grid */}
      <div className="flex items-start gap-6">
        <DynamicFilterSidebar
          categorySlug={filters.category}
          filters={filters}
          onFilterChange={handleFilterChange}
          onReset={handleResetFilters}
          isOpenMobile={isMobileFilterOpen}
          onCloseMobile={() => setIsMobileFilterOpen(false)}
          totalMatches={totalItems}
        />

        {/* Product Grid Area */}
        <div className="flex-1 min-w-0 space-y-4">
          {/* Active Filter Chips Bar */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-1.5 p-3 rounded-xl bg-slate-100/80 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 text-xs">
              <span className="text-slate-400 font-medium mr-1">Фильтры:</span>
              
              {filters.modelSeries?.map((m) => (
                <span
                  key={`m-${m}`}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg font-semibold bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900/60 shadow-2xs"
                >
                  <span>{m}</span>
                  <button
                    onClick={() => handleRemoveFilter('modelSeries', m)}
                    className="hover:text-blue-800 dark:hover:text-white"
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}

              {filters.processor?.map((p) => (
                <span
                  key={`p-${p}`}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg font-semibold bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900/60 shadow-2xs"
                >
                  <span>Чип: {p}</span>
                  <button
                    onClick={() => handleRemoveFilter('processor', p)}
                    className="hover:text-blue-800 dark:hover:text-white"
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}

              {filters.brand?.map((b) => (
                <span
                  key={`b-${b}`}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg font-semibold bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-2xs"
                >
                  <span>{b}</span>
                  <button
                    onClick={() => handleRemoveFilter('brand', b)}
                    className="hover:text-blue-600"
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}

              {filters.ram?.map((r) => (
                <span
                  key={`r-${r}`}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg font-semibold bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900/60 shadow-2xs"
                >
                  <span>RAM: {r}</span>
                  <button
                    onClick={() => handleRemoveFilter('ram', r)}
                    className="hover:text-blue-800 dark:hover:text-white"
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}

              {filters.storage?.map((s) => (
                <span
                  key={`s-${s}`}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg font-semibold bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900/60 shadow-2xs"
                >
                  <span>SSD: {s}</span>
                  <button
                    onClick={() => handleRemoveFilter('storage', s)}
                    className="hover:text-blue-800 dark:hover:text-white"
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}

              {filters.diagonal?.map((d) => (
                <span
                  key={`d-${d}`}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg font-semibold bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-2xs"
                >
                  <span>Экран: {d}</span>
                  <button
                    onClick={() => handleRemoveFilter('diagonal', d)}
                    className="hover:text-blue-600"
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}

              {filters.minPrice !== undefined && filters.minPrice > 0 && (
                <span
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg font-semibold bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-2xs"
                >
                  <span>от {filters.minPrice.toLocaleString('ru-RU')} ₸</span>
                  <button
                    onClick={() => handleFilterChange({ minPrice: undefined })}
                    className="hover:text-blue-600"
                  >
                    <X size={12} />
                  </button>
                </span>
              )}

              {filters.maxPrice !== undefined && (
                <span
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg font-semibold bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-2xs"
                >
                  <span>до {filters.maxPrice.toLocaleString('ru-RU')} ₸</span>
                  <button
                    onClick={() => handleFilterChange({ maxPrice: undefined })}
                    className="hover:text-blue-600"
                  >
                    <X size={12} />
                  </button>
                </span>
              )}

              {filters.inStockOnly && (
                <span
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/60 shadow-2xs"
                >
                  <span>В наличии</span>
                  <button
                    onClick={() => handleFilterChange({ inStockOnly: false })}
                    className="hover:text-emerald-800 dark:hover:text-white"
                  >
                    <X size={12} />
                  </button>
                </span>
              )}

              {filters.hasDiscountOnly && (
                <span
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg font-semibold bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900/60 shadow-2xs"
                >
                  <span>Со скидкой</span>
                  <button
                    onClick={() => handleFilterChange({ hasDiscountOnly: false })}
                    className="hover:text-blue-800 dark:hover:text-white"
                  >
                    <X size={12} />
                  </button>
                </span>
              )}

              {filters.techFridayOnly && (
                <span
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg font-semibold bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900/60 shadow-2xs"
                >
                  <span>TECH FRIDAY</span>
                  <button
                    onClick={() => handleFilterChange({ techFridayOnly: false })}
                    className="hover:text-blue-800 dark:hover:text-white"
                  >
                    <X size={12} />
                  </button>
                </span>
              )}

              <button
                onClick={handleResetFilters}
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-bold ml-auto"
              >
                Сбросить всё
              </button>
            </div>
          )}
          {displayedProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {displayedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="py-16 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8">
              <div className="text-4xl mb-3">🔍</div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Товары не найдены
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                Попробуйте изменить параметры фильтрации или сбросить фильтры для отображения всех товаров.
              </p>
              <button
                onClick={handleResetFilters}
                className="mt-4 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition"
              >
                Сбросить все фильтры
              </button>
            </div>
          )}

          {/* Pagination Component */}
          {totalPages > 1 && (
            <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Items per page selector */}
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span>Показывать:</span>
                {[24, 48, 96].map((count) => (
                  <button
                    key={count}
                    onClick={() => {
                      setItemsPerPage(count);
                      setCurrentPage(1);
                    }}
                    className={`px-2 py-1 rounded-md text-xs font-bold transition ${
                      itemsPerPage === count
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {count}
                  </button>
                ))}
              </div>

              {/* Desktop Pagination */}
              <div className="hidden sm:flex items-center gap-1.5">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-xs font-semibold disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  <ChevronLeft size={14} />
                  <span>Предыдущая</span>
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 rounded-lg text-xs font-bold transition ${
                      currentPage === page
                        ? 'bg-blue-600 text-white'
                        : 'border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-xs font-semibold disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  <span>Следующая</span>
                  <ChevronRight size={14} />
                </button>
              </div>

              {/* Mobile Pagination */}
              <div className="flex sm:hidden items-center gap-3">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-bold disabled:opacity-40"
                >
                  ← Назад
                </button>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {currentPage} / {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-bold disabled:opacity-40"
                >
                  Вперёд →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CatalogPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto p-12 text-center">Загрузка каталога...</div>}>
      <CatalogContent />
    </Suspense>
  );
}
