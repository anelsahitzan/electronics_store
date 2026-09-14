'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useStore } from '@/context/StoreContext';
import { ProductCard } from '@/components/product/ProductCard';
import { Zap, Timer, ArrowRight } from 'lucide-react';

export const TechFridayBanner: React.FC = () => {
  const { techFriday, products } = useStore();

  const [timeLeft, setTimeLeft] = useState({
    days: 3,
    hours: 21,
    minutes: 47,
    seconds: 12,
  });

  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const targetDate = new Date(techFriday.endDate).getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance <= 0) {
        setIsExpired(true);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        setTimeLeft({ days, hours, minutes, seconds });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [techFriday.endDate]);

  if (!techFriday.isActive || isExpired) {
    return null;
  }

  // Filter Tech Friday items
  const techFridayProducts = products.filter((p) => p.isTechFriday);

  const pad = (n: number) => n.toString().padStart(2, '0');

  return (
    <section className="relative rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm">
      {/* Header & Countdown Timer */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold tracking-wider uppercase mb-1">
            <Zap size={14} className="text-blue-600 dark:text-blue-400" /> Сезонная распродажа
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
            <span>TECH FRIDAY</span>
            <span className="text-xs sm:text-sm font-bold text-rose-600 bg-rose-500/10 px-2.5 py-1 rounded-lg border border-rose-500/20">
              Скидки {techFriday.discountRange}
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Специальные цены на ограниченную партию электроники
          </p>
        </div>

        {/* Live Countdown Display */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 bg-slate-50 dark:bg-slate-950 p-3 rounded-2xl border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">
            <Timer size={15} />
            <span>До конца акции:</span>
          </div>

          <div className="flex items-center gap-1.5">
            <div className="flex flex-col items-center justify-center w-11 h-11 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-sm font-black text-slate-900 dark:text-white">{pad(timeLeft.days)}</span>
              <span className="text-[8px] text-slate-400 uppercase font-semibold">дн</span>
            </div>
            <span className="text-slate-400 font-bold">:</span>
            <div className="flex flex-col items-center justify-center w-11 h-11 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-sm font-black text-slate-900 dark:text-white">{pad(timeLeft.hours)}</span>
              <span className="text-[8px] text-slate-400 uppercase font-semibold">час</span>
            </div>
            <span className="text-slate-400 font-bold">:</span>
            <div className="flex flex-col items-center justify-center w-11 h-11 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-sm font-black text-slate-900 dark:text-white">{pad(timeLeft.minutes)}</span>
              <span className="text-[8px] text-slate-400 uppercase font-semibold">мин</span>
            </div>
            <span className="text-slate-400 font-bold">:</span>
            <div className="flex flex-col items-center justify-center w-11 h-11 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs">
              <span className="text-sm font-black text-blue-600 dark:text-blue-400">{pad(timeLeft.seconds)}</span>
              <span className="text-[8px] text-slate-400 uppercase font-semibold">сек</span>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {techFridayProducts.slice(0, 4).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Footer Link */}
      <div className="mt-6 text-center">
        <Link
          href="/catalog?filter=tech-friday"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold transition"
        >
          <span>Все предложения акции ({techFridayProducts.length})</span>
          <ArrowRight size={14} />
        </Link>
      </div>
    </section>
  );
};
