'use client';

import React from 'react';
import Link from 'next/link';
import { useStore } from '@/context/StoreContext';
import { ProductCard } from '@/components/product/ProductCard';
import { Flame, Zap, ArrowRight, Sparkles } from 'lucide-react';

export default function PromotionsPage() {
  const { products, techFriday } = useStore();

  const discountedProducts = products.filter((p) => p.discountPercent && p.discountPercent > 0);

  const promoBanners = [
    {
      title: '⚡ TECH FRIDAY',
      desc: 'Главная распродажа года со скидками до 30% на все флагманы!',
      badge: 'Глобальная акция',
      badgeColor: 'bg-purple-600',
      link: '/catalog?filter=tech-friday',
      bg: 'from-purple-900/60 to-slate-900 border-purple-500/30',
    },
    {
      title: '📱 Смартфоны с выгодой',
      desc: 'Скидки до -20% на топовые модели Apple iPhone и Samsung Galaxy.',
      badge: 'Смартфоны',
      badgeColor: 'bg-blue-600',
      link: '/catalog?category=smartphones',
      bg: 'from-blue-900/60 to-slate-900 border-blue-500/30',
    },
    {
      title: '💻 Ноутбуки для учебы и работы',
      desc: 'Экономия до 50 000 ₸ на MacBook Air и мощные ноутбуки Lenovo & ASUS.',
      badge: 'Ноутбуки',
      badgeColor: 'bg-indigo-600',
      link: '/catalog?category=laptops',
      bg: 'from-indigo-900/60 to-slate-900 border-indigo-500/30',
    },
    {
      title: '🎧 Беспроводной звук Hi-Res',
      desc: 'Специальные цены на наушники с активным шумоподавлением Sony и AirPods Pro.',
      badge: 'Аудио',
      badgeColor: 'bg-orange-600',
      link: '/catalog?category=headphones',
      bg: 'from-orange-900/60 to-slate-900 border-orange-500/30',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-10">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
          <Flame size={28} className="text-orange-500 fill-orange-500" />
          <span>🔥 Все акции и спецпредложения</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Лучшие предложения электроники и скидочные программы в Кызылорде
        </p>
      </div>

      {/* Grid of promo banners */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {promoBanners.map((promo, idx) => (
          <Link
            key={idx}
            href={promo.link}
            className={`p-6 rounded-3xl border bg-gradient-to-r ${promo.bg} text-white space-y-3 shadow-lg hover:shadow-2xl transition hover:-translate-y-1`}
          >
            <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase text-white ${promo.badgeColor}`}>
              {promo.badge}
            </span>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight">{promo.title}</h2>
            <p className="text-xs text-slate-300 max-w-md leading-relaxed">{promo.desc}</p>
            <div className="pt-2 flex items-center gap-1.5 text-xs font-bold text-white group">
              <span>Смотреть товары</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition" />
            </div>
          </Link>
        ))}
      </div>

      {/* Products with discounts */}
      <div className="space-y-4">
        <h2 className="text-xl font-black text-slate-900 dark:text-white">
          Товары со скидкой прямо сейчас ({discountedProducts.length})
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {discountedProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </div>
  );
}
