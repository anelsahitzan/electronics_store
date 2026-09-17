'use client';

import React from 'react';
import Link from 'next/link';
import { Zap, Phone, Mail, MapPin, ShieldCheck, Truck, RefreshCw, CreditCard, ExternalLink, MessageCircle } from 'lucide-react';

// Custom SVG Icons for Instagram, TikTok and WhatsApp matching site design
const InstagramIcon: React.FC<{ size?: number; className?: string }> = ({ size = 18, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const TikTokIcon: React.FC<{ size?: number; className?: string }> = ({ size = 18, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.88 2.89 2.89 0 0 1-2.88-2.88 2.89 2.89 0 0 1 2.88-2.88c.36 0 .7.07 1.01.2V9.45a6.37 6.37 0 0 0-1.01-.08 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.75a8.28 8.28 0 0 0 4.76 1.48V6.78a4.83 4.83 0 0 1-1-.09z" />
  </svg>
);

const WhatsAppIcon: React.FC<{ size?: number; className?: string }> = ({ size = 18, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.23 8.23 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.42 0-2.81-.37-4.04-1.07l-.29-.17-3.11.82.83-3.03-.19-.3a8.18 8.18 0 0 1-1.25-4.49c0-4.54 3.7-8.24 8.24-8.24m4.52 11.64c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.98-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.02-1.25-.75-.67-1.26-1.5-1.41-1.75-.14-.25-.02-.39.11-.51.11-.11.25-.29.38-.44.13-.14.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.43h-.47c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.23.9 2.43 1.03 2.6.13.17 1.77 2.7 4.29 3.79.6.26 1.07.41 1.44.53.6.19 1.15.16 1.58.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.1-.23-.17-.48-.29z" />
  </svg>
);

export const Footer: React.FC = () => {
  const whatsappUrl =
    'https://wa.me/77771234567?text=' +
    encodeURIComponent('Сәлеметсіз бе! AneliMarket интернет-дүкенінен тауар бойынша сұрақ қойғым келеді.');
  const instagramUrl = 'https://instagram.com/anelimarket_kz';
  const tiktokUrl = 'https://tiktok.com/@anelimarket_kz';
  const phoneUrl = 'tel:+77771234567';

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

      {/* Social and Fast Contact Callout Strip */}
      <div className="border-b border-slate-200 dark:border-slate-800/80 bg-white/60 dark:bg-slate-900/50 py-4">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-bold text-slate-900 dark:text-white">
              Байланыс орталығы / Центр поддержки клиентов:
            </span>
            <span className="text-slate-500 hidden sm:inline">Бізге жазыңыз немесе қоңырау шалыңыз</span>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* WhatsApp */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500 text-emerald-600 dark:text-emerald-400 hover:text-white border border-emerald-500/20 hover:border-emerald-500 text-xs font-bold transition shadow-xs group"
              title="WhatsApp арқылы жазу"
            >
              <WhatsAppIcon size={16} className="group-hover:scale-110 transition-transform" />
              <span>WhatsApp</span>
            </a>

            {/* Instagram */}
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r hover:from-rose-500 hover:via-purple-500 hover:to-amber-500 bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:text-white border border-rose-500/20 hover:border-transparent text-xs font-bold transition shadow-xs group"
              title="Instagram парақшамыз"
            >
              <InstagramIcon size={16} className="group-hover:scale-110 transition-transform" />
              <span>Instagram</span>
            </a>

            {/* TikTok */}
            <a
              href={tiktokUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/10 dark:bg-slate-800 hover:bg-black dark:hover:bg-white text-slate-800 dark:text-slate-200 hover:text-white dark:hover:text-black border border-slate-300 dark:border-slate-700 text-xs font-bold transition shadow-xs group"
              title="TikTok парақшамыз"
            >
              <TikTokIcon size={15} className="group-hover:scale-110 transition-transform" />
              <span>TikTok</span>
            </a>

            {/* Phone */}
            <a
              href={phoneUrl}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-xs shadow-blue-500/20 group"
              title="Телефон арқылы хабарласу"
            >
              <Phone size={14} className="group-hover:rotate-12 transition-transform" />
              <span>+7 (777) 123-45-67</span>
            </a>
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
              ANELI<span className="text-blue-600 dark:text-blue-400">MARKET</span>
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
              <a href={phoneUrl} className="hover:text-blue-600 transition font-bold text-slate-900 dark:text-white">
                +7 (777) 123-45-67 <span className="text-slate-400 font-normal">(Call-центр 24/7)</span>
              </a>
            </div>
            <div className="flex items-center gap-2">
              <Mail size={15} className="text-blue-600 shrink-0" />
              <a href="mailto:support@anelimarket.kz" className="hover:text-blue-600 transition">
                support@anelimarket.kz
              </a>
            </div>
          </div>

          {/* Direct Social Media Links */}
          <div className="pt-2">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
              Біз әлеуметтік желілерде:
            </span>
            <div className="flex items-center gap-2">
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-rose-500 hover:bg-rose-500 hover:text-white hover:border-rose-500 transition shadow-xs"
                title="Instagram: @anelimarket_kz"
                aria-label="Instagram"
              >
                <InstagramIcon size={17} />
              </a>

              <a
                href={tiktokUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-800 dark:text-slate-200 hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black hover:border-transparent transition shadow-xs"
                title="TikTok: @anelimarket_kz"
                aria-label="TikTok"
              >
                <TikTokIcon size={16} />
              </a>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-emerald-500 hover:bg-emerald-500 hover:text-white hover:border-emerald-500 transition shadow-xs"
                title="WhatsApp: +7 777 123 45 67"
                aria-label="WhatsApp"
              >
                <WhatsAppIcon size={17} />
              </a>

              <a
                href={phoneUrl}
                className="w-9 h-9 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-blue-600 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition shadow-xs"
                title="Телефон: +7 (777) 123-45-67"
                aria-label="Телефон"
              >
                <Phone size={16} />
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
              <Link href="/promotions" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition">
                Горячие скидки
              </Link>
            </li>
            <li>
              <Link href="/catalog?filter=tech-friday" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition">
                TECH FRIDAY Распродажа
              </Link>
            </li>
            <li>
              <Link href="/profile" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition">
                Отследить заказ
              </Link>
            </li>
            <li>
              <Link href="/credit" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition">
                Условия рассрочки
              </Link>
            </li>
            <li>
              <Link href="/warranty" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition">
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
          <div className="flex flex-wrap gap-1.5 text-[11px]">
            <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 text-slate-700 dark:text-slate-300 font-medium transition">
              Kaspi Pay / QR
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 text-slate-700 dark:text-slate-300 font-medium transition">
              Halyk Bank
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 text-slate-700 dark:text-slate-300 font-medium transition">
              Visa / Mastercard
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 text-slate-700 dark:text-slate-300 font-medium transition">
              Оплата наличными
            </span>
          </div>

          <div className="mt-6">
            <h5 className="font-semibold text-xs text-slate-900 dark:text-white mb-1.5">
              Мобильное приложение
            </h5>
            <p className="text-[11px] text-slate-400">
              Установите PWA AneliMarket на экран смартфона для мгновенных уведомлений
            </p>
          </div>
        </div>
      </div>

      {/* Copyright row */}
      <div className="border-t border-slate-200 dark:border-slate-800/80 pt-6">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© 2026 AneliMarket. Все права защищены. Кызылорда, Казахстан.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:underline">Политика конфиденциальности</Link>
            <Link href="/terms" className="hover:underline">Публичная оферта</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
