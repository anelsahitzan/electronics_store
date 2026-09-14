'use client';

import React from 'react';
import { useStore } from '@/context/StoreContext';
import { HeroSlider } from '@/components/home/HeroSlider';
import { CategoryGrid } from '@/components/home/CategoryGrid';
import { TechFridayBanner } from '@/components/home/TechFridayBanner';
import { ProductSection } from '@/components/home/ProductSection';
import { Sparkles, Flame, Trophy, Bot, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  const { products, setAIAssistantOpen } = useStore();

  const hotDeals = products.filter((p) => p.isHotDeal).slice(0, 4);
  const newArrivals = products.filter((p) => p.isNew).slice(0, 4);
  const bestsellers = [...products]
    .sort((a, b) => b.salesCount - a.salesCount)
    .slice(0, 4);

  const brands = [
    { name: 'Apple', logo: '🍎', slug: 'Apple' },
    { name: 'Samsung', logo: '🪐', slug: 'Samsung' },
    { name: 'Sony', logo: '🎵', slug: 'Sony' },
    { name: 'ASUS', logo: '⚡', slug: 'ASUS' },
    { name: 'Lenovo', logo: '💻', slug: 'Lenovo' },
    { name: 'LG', logo: '📺', slug: 'LG' },
    { name: 'Logitech', logo: '🖱', slug: 'Logitech' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-12 sm:space-y-16">
      {/* Hero Section */}
      <HeroSlider />

      {/* Categories Horizontal / Grid */}
      <CategoryGrid />

      {/* Tech Friday Flash Sale Banner & Products */}
      <TechFridayBanner />

      {/* Hot Deals Section */}
      <ProductSection
        title="🔥 Горячие предложения"
        subtitle="Специальные цены со скидкой до 20%"
        products={hotDeals}
        viewAllLink="/catalog?filter=hot-deals"
      />

      {/* AI Assistant Banner */}
      <section className="rounded-3xl bg-white dark:bg-slate-900 p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold">
            <Bot size={14} className="text-blue-600 dark:text-blue-400" /> AI-консультант
          </div>
          <h3 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            Помочь с выбором устройства?
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            Опишите свои задачи и бюджет простыми словами (например, «ноутбук для учебы и разработки до 500 000 ₸»), и ассистент подберет подходящие варианты с аргументами.
          </p>
        </div>
        <button
          onClick={() => setAIAssistantOpen(true)}
          className="flex-shrink-0 flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition shadow-md shadow-blue-500/10"
        >
          <Sparkles size={15} />
          <span>Подобрать устройство</span>
        </button>
      </section>

      {/* New Products Section */}
      <ProductSection
        title="✨ Новинки"
        subtitle="Только что поступившие устройства 2026 года"
        products={newArrivals}
        viewAllLink="/catalog?filter=new"
      />

      {/* Bestsellers Section with #1, #2, #3 badges */}
      <ProductSection
        title="🏆 Популярное"
        subtitle="Бестселлеры по количеству реальных заказов"
        products={bestsellers}
        viewAllLink="/catalog?filter=bestsellers"
        isBestsellerList={true}
      />

      {/* Popular Brands Row */}
      <section className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          Популярные бренды
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {brands.map((brand) => (
            <Link
              key={brand.name}
              href={`/catalog?brand=${brand.slug}`}
              className="group p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500/50 hover:shadow-md transition text-center flex flex-col items-center justify-center gap-1.5"
            >
              <span className="text-2xl group-hover:scale-110 transition duration-200">
                {brand.logo}
              </span>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                {brand.name}
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
