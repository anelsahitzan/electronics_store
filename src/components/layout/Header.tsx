'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useStore } from '@/context/StoreContext';
import { MegaMenu } from './MegaMenu';
import {
  Search,
  MapPin,
  Heart,
  ShoppingCart,
  User as UserIcon,
  Moon,
  Sun,
  Menu,
  X,
  Scale,
  Sparkles,
  Zap,
  Flame,
  ChevronDown,
  Shield,
  LogOut,
} from 'lucide-react';
import { CategoryIcon } from '@/components/common/CategoryIcon';

export const Header: React.FC = () => {
  const router = useRouter();
  const {
    categories,
    products,
    cartCount,
    cartTotal,
    wishlist,
    comparison,
    currentUser,
    logout,
    theme,
    toggleTheme,
    selectedCity,
    setSelectedCity,
    setAuthModalOpen,
    setAIAssistantOpen,
  } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isMobileSearchVisible, setIsMobileSearchVisible] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const catalogRef = useRef<HTMLDivElement>(null);
  const catalogTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleCatalogMouseEnter = () => {
    if (catalogTimerRef.current) clearTimeout(catalogTimerRef.current);
    setIsCatalogOpen(true);
  };

  const handleCatalogMouseLeave = () => {
    if (catalogTimerRef.current) clearTimeout(catalogTimerRef.current);
    catalogTimerRef.current = setTimeout(() => {
      setIsCatalogOpen(false);
    }, 220);
  };

  // Close popups on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
      if (catalogRef.current && !catalogRef.current.contains(event.target as Node)) {
        setIsCatalogOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      if (catalogTimerRef.current) clearTimeout(catalogTimerRef.current);
    };
  }, []);

  // Filter products for live search
  const filteredSearchProducts = searchQuery.trim()
    ? products
      .filter(
        (p) =>
          p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
      )
      .slice(0, 5)
    : [];

  const popularSearches = ['iPhone 17 Pro', 'MacBook Air M4', 'AirPods Pro', 'Lenovo Legion', 'PlayStation 5'];
  const cities = ['Кызылорда', 'Алматы', 'Астана', 'Шымкент', 'Актобе', 'Караганда'];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearchOpen(false);
    setIsMobileSearchVisible(false);
    router.push(`/catalog?q=${encodeURIComponent(searchQuery.trim())}`);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md transition-colors">
      {/* Top Utility bar (Desktop) */}
      <div className="hidden lg:block border-b border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-950/40 text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 py-1.5 flex items-center justify-between">
          <div className="flex items-center gap-6">
            {/* City Selector */}
            <div className="relative">
              <button
                onClick={() => setIsCityDropdownOpen(!isCityDropdownOpen)}
                className="flex items-center gap-1.5 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition"
              >
                <MapPin size={13} className="text-blue-600 dark:text-blue-400" />
                <span>{selectedCity}</span>
                <ChevronDown size={12} />
              </button>

              {isCityDropdownOpen && (
                <div className="absolute left-0 mt-1 w-36 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl py-1 z-50">
                  {cities.map((city) => (
                    <button
                      key={city}
                      onClick={() => {
                        setSelectedCity(city);
                        setIsCityDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 text-xs hover:bg-blue-50 dark:hover:bg-slate-700 transition ${selectedCity === city
                          ? 'font-bold text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-slate-700/50'
                          : 'text-slate-700 dark:text-slate-200'
                        }`}
                    >
                      {city}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <span className="text-slate-300 dark:text-slate-700">|</span>
            <Link href="/delivery" className="hover:text-blue-600 dark:hover:text-blue-400 transition">
              Доставка и оплата
            </Link>
            <Link href="/warranty" className="hover:text-blue-600 dark:hover:text-blue-400 transition">
              Гарантия 1 год
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/catalog?filter=credit"
              className="hover:text-blue-600 dark:hover:text-blue-400 font-semibold transition flex items-center gap-1"
            >
              <span>Рассрочка 0-0-24</span>
            </Link>
            <span className="text-slate-300 dark:text-slate-700">|</span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Бесплатная доставка от 50 000 ₸
            </span>
            <span className="text-slate-300 dark:text-slate-700">|</span>
            <button
              onClick={() => setAIAssistantOpen(true)}
              className="flex items-center gap-1 font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 transition"
            >
              <Sparkles size={13} />
              <span>AI-Консультант</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between gap-3 sm:gap-5">
        {/* Left: Brand Logo + Catalog Button Grouped */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition">
              <Zap size={19} className="fill-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white flex items-center">
                ANELI<span className="text-blue-600 dark:text-blue-400">MARKET</span>
              </span>
              <span className="text-[9px] uppercase tracking-widest text-slate-400 font-semibold -mt-1 hidden sm:inline">
                Electronics Store
              </span>
            </div>
          </Link>

          {/* Catalog Menu Button (Desktop) */}
          <div
            className="relative hidden md:block"
            ref={catalogRef}
            onMouseEnter={handleCatalogMouseEnter}
            onMouseLeave={handleCatalogMouseLeave}
          >
            <button
              onClick={() => setIsCatalogOpen(!isCatalogOpen)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold text-xs transition-all shadow-2xs select-none ${isCatalogOpen
                  ? 'bg-blue-600 text-white shadow-blue-500/25 ring-2 ring-blue-500/20'
                  : 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 border border-blue-200/60 dark:border-blue-900/50'
                }`}
              aria-expanded={isCatalogOpen}
            >
              {isCatalogOpen ? <X size={16} /> : <Menu size={16} />}
              <span>Каталог</span>
              <ChevronDown
                size={13}
                className={`transition-transform duration-200 ${isCatalogOpen ? 'rotate-180' : ''}`}
              />
            </button>
          </div>
        </div>

        {/* Center: Live Search Bar (Desktop) */}
        <div className="relative flex-1 max-w-xl hidden md:block" ref={searchRef}>
          <form onSubmit={handleSearchSubmit}>
            <div className="relative flex items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchOpen(true);
                }}
                onFocus={() => setIsSearchOpen(true)}
                placeholder="Поиск товаров: например, iPhone 17, MacBook, RTX 4070..."
                className="w-full pl-9 pr-20 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/70 dark:bg-slate-900/90 text-slate-900 dark:text-white text-xs focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-slate-900 transition"
              />
              <Search className="absolute left-3 text-slate-400" size={16} />
              <button
                type="submit"
                className="absolute right-1 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition shadow-xs"
              >
                Найти
              </button>
            </div>
          </form>

          {/* Autocomplete Dropdown */}
          {isSearchOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden z-50 p-3">
              {filteredSearchProducts.length > 0 ? (
                <div>
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 px-2">
                    Результаты поиска:
                  </div>
                  <div className="space-y-1">
                    {filteredSearchProducts.map((prod) => (
                      <Link
                        key={prod.id}
                        href={`/product/${prod.id}`}
                        onClick={() => setIsSearchOpen(false)}
                        className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={prod.mainImage}
                            alt={prod.title}
                            className="w-10 h-10 object-cover rounded-lg border border-slate-200 dark:border-slate-700"
                          />
                          <div>
                            <div className="text-sm font-semibold text-slate-900 dark:text-white line-clamp-1">
                              {prod.title}
                            </div>
                            <div className="text-xs text-slate-400">
                              {prod.category} • {prod.brand}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-bold text-blue-600 dark:text-blue-400">
                            {prod.price.toLocaleString('ru-RU')} ₸
                          </div>
                          {prod.oldPrice && (
                            <div className="text-[10px] text-slate-400 line-through">
                              {prod.oldPrice.toLocaleString('ru-RU')} ₸
                            </div>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ) : searchQuery.trim() ? (
                <div className="py-6 text-center text-sm text-slate-500">
                  По запросу «{searchQuery}» ничего не найдено
                </div>
              ) : null}

              {/* Popular Searches */}
              <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5 px-2">
                  Популярные запросы:
                </div>
                <div className="flex flex-wrap gap-1 px-1">
                  {popularSearches.map((term) => (
                    <button
                      key={term}
                      onClick={() => {
                        setSearchQuery(term);
                        router.push(`/catalog?q=${encodeURIComponent(term)}`);
                        setIsSearchOpen(false);
                      }}
                      className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-700 transition"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Navigation Actions (Compact & Unified) */}
        <div className="flex items-center gap-1 sm:gap-1.5">
          {/* Mobile search toggle */}
          <button
            onClick={() => setIsMobileSearchVisible(!isMobileSearchVisible)}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 md:hidden transition"
            aria-label="Поиск"
          >
            <Search size={18} />
          </button>

          {/* Dark / Light Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            aria-label="Сменить тему"
            title={theme === 'dark' ? 'Переключить на светлую' : 'Переключить на темную'}
          >
            {theme === 'dark' ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} className="text-slate-700" />}
          </button>

          {/* Comparison Icon (Desktop) */}
          <Link
            href="/compare"
            className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition hidden sm:flex"
            title="Сравнение товаров"
          >
            <Scale size={18} />
            {comparison.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center">
                {comparison.length}
              </span>
            )}
          </Link>

          {/* Wishlist Icon */}
          <Link
            href="/wishlist"
            className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            title="Избранное"
          >
            <Heart size={18} />
            {wishlist.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </Link>

          {/* Cart Button */}
          <Link
            href="/cart"
            className="relative flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-900/60 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition shadow-2xs"
          >
            <div className="relative">
              <ShoppingCart size={18} />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-2 w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="hidden sm:inline font-bold text-xs">
              {cartTotal > 0 ? `${cartTotal.toLocaleString('ru-RU')} ₸` : 'Корзина'}
            </span>
          </Link>

          {/* Profile / Auth Button */}
          <div className="relative">
            {currentUser ? (
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center gap-2 p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                  {currentUser.name.charAt(0)}
                </div>
                <div className="hidden lg:flex flex-col text-left leading-tight">
                  <span className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[90px]">
                    {currentUser.name}
                  </span>
                  <span className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold">
                    {currentUser.role}
                  </span>
                </div>
                <ChevronDown size={14} className="hidden lg:block text-slate-400" />
              </button>
            ) : (
              <button
                onClick={() => setAuthModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-800 dark:text-white transition"
              >
                <UserIcon size={16} />
                <span className="hidden sm:inline">Войти</span>
              </button>
            )}

            {/* Profile Dropdown */}
            {currentUser && isProfileMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl py-2 z-50 animate-in fade-in duration-100">
                <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                  <p className="text-xs font-bold text-slate-900 dark:text-white">{currentUser.name}</p>
                  <p className="text-[11px] text-slate-400 truncate">{currentUser.email}</p>
                </div>

                <div className="py-1">
                  <Link
                    href="/profile"
                    onClick={() => setIsProfileMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-800"
                  >
                    <UserIcon size={14} /> Личный кабинет
                  </Link>
                  <Link
                    href="/profile?tab=orders"
                    onClick={() => setIsProfileMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-800"
                  >
                    📦 Мои заказы
                  </Link>

                  {/* Admin link if user is ADMIN */}
                  {currentUser.role === 'ADMIN' && (
                    <Link
                      href="/admin"
                      onClick={() => setIsProfileMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-950/30 hover:bg-blue-100 dark:hover:bg-blue-900/40"
                    >
                      <Shield size={14} /> Панель администратора
                    </Link>
                  )}
                </div>

                <div className="pt-1 border-t border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => {
                      logout();
                      setIsProfileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20"
                  >
                    <LogOut size={14} /> Выйти
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Search input overlay if active */}
      {isMobileSearchVisible && (
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 md:hidden bg-slate-50 dark:bg-slate-950">
          <form onSubmit={handleSearchSubmit}>
            <div className="relative flex items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Поиск товаров..."
                className="w-full pl-9 pr-20 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm"
                autoFocus
              />
              <Search className="absolute left-3 text-slate-400" size={16} />
              <button
                type="submit"
                className="absolute right-1 px-3 py-1 rounded-lg bg-blue-600 text-white text-xs font-bold"
              >
                Найти
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Sub-header Categories Quick Access Bar */}
      <div className="border-t border-slate-100 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md text-xs">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between gap-3">
          {/* Main Category Links - 1 Click Access */}
          <nav className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5 whitespace-nowrap scroll-smooth">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/catalog?category=${cat.slug}`}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition shrink-0 group"
              >
                <CategoryIcon
                  slug={cat.slug}
                  size={15}
                  className="text-slate-500 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:scale-110 transition-transform"
                />
                <span>{cat.name}</span>
              </Link>
            ))}
          </nav>

          {/* Marketing Highlights (Unified Minimalist Aesthetic) */}
          <div className="hidden lg:flex items-center gap-1.5 shrink-0 border-l border-slate-200 dark:border-slate-800 pl-3">
            <Link
              href="/catalog?filter=tech-friday"
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 transition border border-slate-200 dark:border-slate-700/60"
            >
              <Flame size={12} className="text-blue-500 dark:text-blue-400" />
              <span>TECH FRIDAY</span>
            </Link>
            <Link
              href="/promotions"
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 transition border border-slate-200 dark:border-slate-700/60"
            >
              <span className="font-bold text-blue-500 dark:text-blue-400">%</span>
              <span>Акции</span>
            </Link>
            <Link
              href="/catalog?filter=new"
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 transition border border-slate-200 dark:border-slate-700/60"
            >
              <Sparkles size={12} className="text-blue-500 dark:text-blue-400" />
              <span>Новинки</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Interactive Mega Menu */}
      <MegaMenu
        isOpen={isCatalogOpen}
        onClose={() => setIsCatalogOpen(false)}
        categories={categories}
        products={products}
        onMouseEnter={handleCatalogMouseEnter}
        onMouseLeave={handleCatalogMouseLeave}
      />
    </header>
  );
};
