'use client';

import React, { useState, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useStore } from '@/context/StoreContext';
import { ProductCard } from '@/components/product/ProductCard';
import { DynamicFilterSidebar } from '@/components/catalog/DynamicFilterSidebar';
import { FilterState, Product } from '@/types';
import { SlidersHorizontal, ChevronRight, ChevronLeft, ArrowUpDown } from 'lucide-react';

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

    // RAM filter
    if (filters.ram && filters.ram.length > 0) {
      list = list.filter((p) => {
        const pRam = p.specs?.['Память']?.['Оперативная память (RAM)'] || p.specs?.['Память']?.['RAM'] || '';
        return filters.ram!.some((r) => pRam.toLowerCase().includes(r.toLowerCase()));
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

  const handleResetFilters = () => {
    setFilters({
      category: undefined,
      brand: [],
      minPrice: undefined,
      maxPrice: undefined,
      inStockOnly: false,
      hasDiscountOnly: false,
      techFridayOnly: false,
      rating: undefined,
      ram: [],
      storage: [],
      sortBy: 'popular',
    });
    setCurrentPage(1);
  };

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
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {currentCategory ? `${currentCategory.icon} ${currentCategory.name}` : 'Все товары электроники'}
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
        />

        {/* Product Grid Area */}
        <div className="flex-1 min-w-0 space-y-6">
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
