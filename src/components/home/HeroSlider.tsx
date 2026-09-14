'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight, Zap } from 'lucide-react';

interface Slide {
  id: string;
  badge: string;
  badgeColor: string;
  title: string;
  subtitle: string;
  price: string;
  oldPrice?: string;
  discount?: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  image: string;
  bgGradient: string;
}

export const HeroSlider: React.FC = () => {
  const slides: Slide[] = [
    {
      id: 'slide-1',
      badge: 'Новая коллекция',
      badgeColor: 'bg-slate-800/90 text-slate-200 border-slate-700',
      title: 'iPhone 17 Pro',
      subtitle: 'Титановый флагман с чипом A19 Pro',
      price: 'от 599 990 ₸',
      oldPrice: '649 990 ₸',
      discount: '-8%',
      description: 'Новая эра мобильной фотографии: перископический зум 10x, титановый сплав 5-го класса и дисплей ProMotion 120 Гц.',
      buttonText: 'Подробнее о новинке',
      buttonLink: '/product/prod-iphone-17-pro',
      image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=1000&auto=format&fit=crop',
      bgGradient: 'from-slate-900 via-slate-900 to-slate-950',
    },
    {
      id: 'slide-2',
      badge: 'Спецпредложение',
      badgeColor: 'bg-slate-800/90 text-slate-200 border-slate-700',
      title: 'MacBook Air 15" M4',
      subtitle: 'Невероятная мощь. Тонкий как лезвие.',
      price: 'от 699 990 ₸',
      oldPrice: '749 990 ₸',
      discount: '-50 000 ₸',
      description: 'До 20 часов работы без подзарядки, абсолютно бесшумный корпус и дисплей Liquid Retina с миллиардом цветов.',
      buttonText: 'Купить с выгодой',
      buttonLink: '/product/prod-macbook-air-m4',
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1000&auto=format&fit=crop',
      bgGradient: 'from-slate-900 via-slate-900 to-slate-950',
    },
    {
      id: 'slide-3',
      badge: 'Консоли нового поколения',
      badgeColor: 'bg-slate-800/90 text-slate-200 border-slate-700',
      title: 'PlayStation 5 Pro 2TB',
      subtitle: 'Продвинутый Ray Tracing и AI-апскейлер PSSR',
      price: 'от 459 990 ₸',
      oldPrice: '499 990 ₸',
      discount: 'Хит',
      description: 'Полное погружение в кинематографичный гейминг нового поколения с мгновенной загрузкой на SSD 2 ТБ.',
      buttonText: 'Смотреть консоль',
      buttonLink: '/product/prod-playstation-5-pro',
      image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?q=80&w=1000&auto=format&fit=crop',
      bgGradient: 'from-slate-900 via-slate-900 to-slate-950',
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto switch slides every 6 seconds
  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, slides.length]);

  const slide = slides[currentSlide];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setIsAutoPlaying(false);
  };

  return (
    <section
      className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-900 shadow-2xl transition-all"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      <div className={`relative min-h-[460px] md:min-h-[520px] bg-gradient-to-r ${slide.bgGradient} flex items-center p-6 sm:p-10 lg:p-14`}>
        {/* Background ambient lighting */}
        <div className="absolute top-1/4 left-1/3 w-96 h-96 rounded-full bg-blue-500/15 blur-3xl pointer-events-none"></div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center w-full">
          {/* Text Content */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-6 text-white">
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-bold border tracking-wider uppercase flex items-center gap-1.5 ${slide.badgeColor}`}>
                <Sparkles size={13} /> {slide.badge}
              </span>
              {slide.discount && (
                <span className="px-2 py-0.5 rounded-md bg-rose-600 text-white text-[11px] font-bold">
                  {slide.discount}
                </span>
              )}
            </div>

            <div>
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-none text-white">
                {slide.title}
              </h1>
              <p className="text-base sm:text-xl font-medium text-slate-300 mt-2">
                {slide.subtitle}
              </p>
            </div>

            <p className="text-xs sm:text-sm text-slate-300/90 max-w-lg leading-relaxed">
              {slide.description}
            </p>

            {/* Price Row */}
            <div className="flex items-baseline gap-3 pt-2">
              <span className="text-2xl sm:text-4xl font-black text-white">
                {slide.price}
              </span>
              {slide.oldPrice && (
                <span className="text-base sm:text-lg text-slate-400 line-through">
                  {slide.oldPrice}
                </span>
              )}
            </div>

            {/* CTA Button */}
            <div className="pt-2 flex items-center gap-4">
              <Link
                href={slide.buttonLink}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition transform hover:-translate-y-0.5 shadow-lg shadow-blue-500/30"
              >
                <span>{slide.buttonText}</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          {/* Banner Product Image */}
          <div className="lg:col-span-5 flex justify-center items-center">
            <div className="relative group">
              <div className="absolute inset-0 rounded-full bg-blue-500/20 blur-2xl group-hover:bg-blue-500/30 transition duration-500"></div>
              <img
                src={slide.image}
                alt={slide.title}
                className="relative z-10 max-h-[280px] sm:max-h-[360px] object-contain drop-shadow-2xl transition transform group-hover:scale-105 duration-500"
              />
            </div>
          </div>
        </div>

        {/* Manual Arrow Navigation */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/40 hover:bg-black/70 text-white/80 hover:text-white backdrop-blur-md border border-white/10 transition z-20"
          aria-label="Предыдущий слайд"
        >
          <ChevronLeft size={22} />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/40 hover:bg-black/70 text-white/80 hover:text-white backdrop-blur-md border border-white/10 transition z-20"
          aria-label="Следующий слайд"
        >
          <ChevronRight size={22} />
        </button>

        {/* Slide Indicator Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                setCurrentSlide(idx);
                setIsAutoPlaying(false);
              }}
              className={`h-2 rounded-full transition-all duration-300 ${
                currentSlide === idx ? 'w-8 bg-blue-500' : 'w-2 bg-white/30 hover:bg-white/60'
              }`}
              aria-label={`Перейти к слайду ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
