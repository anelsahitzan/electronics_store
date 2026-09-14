'use client';

import React from 'react';
import Link from 'next/link';
import { Zap, Phone, Mail, MapPin, ShieldCheck, Truck, RefreshCw, CreditCard } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 text-sm mt-16 pb-20 md:pb-8">
      {/* Guarantees row */}
      <div className="border-b border-slate-200 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
              <Truck size={24} />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white text-sm">Быстрая доставка</h4>
              <p className="text-xs text-slate-500 mt-0.5">В день заказа по Кызылорде и 1-3 дня по РК</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white text-sm">Официальная гарантия</h4>
              <p className="text-xs text-slate-500 mt-0.5">12 месяцев сервисного обслуживания</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
              <CreditCard size={24} />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white text-sm">Рассрочка 0-0-24</h4>
              <p className="text-xs text-slate-500 mt-0.5">Kaspi Red, Halyk Bank, Jusan</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <RefreshCw size={24} />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white text-sm">Обмен и возврат</h4>
              <p className="text-xs text-slate-500 mt-0.5">Простой возврат в течение 14 дней</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
        {/* Company Col */}
        <div className="col-span-2 lg:col-span-2 space-y-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white">
              <Zap size={18} />
            </div>
            <span className="text-xl font-black text-slate-900 dark:text-white">
              TECH<span className="text-blue-600 dark:text-blue-400">MARKET</span>
            </span>
          </Link>
          <p className="text-xs leading-relaxed max-w-sm">
            Крупнейший marketplace оригинальной электроники и гаджетов в Кызылорде и Казахстане. Официальные поставки, честные цены и сервис высшего класса.
          </p>
          <div className="space-y-2 pt-2 text-xs">
            <div className="flex items-center gap-2">
              <MapPin size={15} className="text-blue-600 shrink-0" />
              <span>г. Кызылорда, ул. Айтеке би, 42</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone size={15} className="text-blue-600 shrink-0" />
              <a href="tel:+77771234567" className="hover:text-blue-600 transition font-semibold">
                +7 (777) 123-45-67 (Call-центр 24/7)
              </a>
            </div>
            <div className="flex items-center gap-2">
              <Mail size={15} className="text-blue-600 shrink-0" />
              <a href="mailto:support@techmarket.kz" className="hover:text-blue-600 transition">
                support@techmarket.kz
              </a>
            </div>
          </div>
        </div>

        {/* Categories Col */}
        <div>
          <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider mb-4">
            Популярное
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <Link href="/catalog?category=smartphones" className="hover:text-blue-600 transition">
                Смартфоны Apple & Samsung
              </Link>
            </li>
            <li>
              <Link href="/catalog?category=laptops" className="hover:text-blue-600 transition">
                Ноутбуки для работы и игр
              </Link>
            </li>
            <li>
              <Link href="/catalog?category=headphones" className="hover:text-blue-600 transition">
                Наушники с шумоподавлением
              </Link>
            </li>
            <li>
              <Link href="/catalog?category=gaming-consoles" className="hover:text-blue-600 transition">
                PlayStation 5 & Xbox
              </Link>
            </li>
            <li>
              <Link href="/catalog?category=monitors" className="hover:text-blue-600 transition">
                Игровые мониторы 240Hz
              </Link>
            </li>
          </ul>
        </div>

        {/* Customer Help Col */}
        <div>
          <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider mb-4">
            Покупателям
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <Link href="/promotions" className="hover:text-blue-600 transition text-orange-500 font-semibold">
                🔥 Все горячие скидки
              </Link>
            </li>
            <li>
              <Link href="/catalog?filter=tech-friday" className="hover:text-blue-600 transition text-purple-500 font-semibold">
                ⚡ TECH FRIDAY Распродажа
              </Link>
            </li>
            <li>
              <Link href="/profile" className="hover:text-blue-600 transition">
                Отследить заказ
              </Link>
            </li>
            <li>
              <Link href="/credit" className="hover:text-blue-600 transition">
                Условия рассрочки
              </Link>
            </li>
            <li>
              <Link href="/warranty" className="hover:text-blue-600 transition">
                Гарантийное обслуживание
              </Link>
            </li>
          </ul>
        </div>

        {/* Legal & Payment Methods Col */}
        <div>
          <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider mb-4">
            Способы оплаты
          </h4>
          <div className="flex flex-wrap gap-2 text-[10px]">
            <span className="px-2.5 py-1 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-red-600">
              Kaspi Pay / QR
            </span>
            <span className="px-2.5 py-1 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-emerald-600">
              Halyk Bank
            </span>
            <span className="px-2.5 py-1 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-blue-600">
              Visa / Mastercard
            </span>
            <span className="px-2.5 py-1 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-medium">
              Оплата наличными
            </span>
          </div>

          <div className="mt-6">
            <h5 className="font-semibold text-xs text-slate-900 dark:text-white mb-1.5">
              Мобильное приложение
            </h5>
            <p className="text-[11px] text-slate-400">
              Установите PWA TechMarket на экран смартфона для мгновенных уведомлений
            </p>
          </div>
        </div>
      </div>

      {/* Copyright row */}
      <div className="border-t border-slate-200 dark:border-slate-800/80 pt-6">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© 2026 TechMarket. Все права защищены. Кызылорда, Казахстан.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:underline">Политика конфиденциальности</Link>
            <Link href="/terms" className="hover:underline">Публичная оферта</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
