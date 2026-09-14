'use client';

import React, { useState } from 'react';
import { useStore } from '@/context/StoreContext';
import { Sparkles, X, Bot, Check, ArrowRight, ShoppingCart, Send } from 'lucide-react';
import Link from 'next/link';

interface AIRecommendation {
  productId: string;
  rank: 1 | 2 | 3;
  matchScore: number;
  reasons: string[];
}

export const AIAssistantModal: React.FC = () => {
  const { isAIAssistantOpen, setAIAssistantOpen, products, addToCart } = useStore();
  const [query, setQuery] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [recommendations, setRecommendations] = useState<AIRecommendation[] | null>(null);

  if (!isAIAssistantOpen) return null;

  const quickPrompts = [
    'Ноутбук для Java-разработки, Docker и игр до 850 000 ₸',
    'Лучший флагманский смартфон с мощной камерой и 120 Гц',
    'Беспроводные наушники с лучшим ANC шумоподавлением',
    'Монитор для киберспорта 240 Гц с сочной картинкой',
  ];

  const handleAnalyze = (inputQuery: string) => {
    if (!inputQuery.trim()) return;
    setIsThinking(true);
    setRecommendations(null);

    setTimeout(() => {
      const q = inputQuery.toLowerCase();
      let results: AIRecommendation[] = [];

      if (q.includes('ноутбук') || q.includes('java') || q.includes('docker') || q.includes('программир') || q.includes('игры')) {
        results = [
          {
            productId: 'prod-lenovo-legion-pro-5',
            rank: 1,
            matchScore: 98,
            reasons: [
              '32 GB оперативной памяти DDR5 — идеальный запас для Docker и тяжелых IDE',
              'Мощнейший 24-ядерный Intel Core i9-14900HX для мгновенной сборки проектов',
              'NVIDIA GeForce RTX 4070 (140W) для любых современных игр на ультра-настройках',
              'Дисплей 240 Гц 2.5K с защитой зрения и 100% sRGB',
            ],
          },
          {
            productId: 'prod-macbook-air-m4',
            rank: 2,
            matchScore: 91,
            reasons: [
              'Чип Apple M4 (10 ядер CPU) и 16 GB памяти — быстрый запуск контейнеров',
              'Невероятная автономность до 18-20 часов без розетки',
              'Бесшумная работа (нет вентиляторов) и великолепный дисплей Liquid Retina',
              'Удобная UNIX-подобная среда macOS Sequoia',
            ],
          },
          {
            productId: 'prod-asus-rog-zephyrus-g16',
            rank: 3,
            matchScore: 89,
            reasons: [
              'Ультимативный ROG Nebula OLED 240Hz экран',
              'NVIDIA GeForce RTX 4080 — максимальный FPS',
              'Премиальный тонкий корпус из анодированного алюминия',
            ],
          },
        ];
      } else if (q.includes('смартфон') || q.includes('телефон') || q.includes('камер') || q.includes('айфон')) {
        results = [
          {
            productId: 'prod-iphone-17-pro',
            rank: 1,
            matchScore: 97,
            reasons: [
              'Топовая система камер с 10x оптическим перископическим зумом',
              'Плавный экран 120 Гц ProMotion с пиковой яркостью 2500 нит',
              'Прочный титановый корпус аэрокосмического класса',
              'Чип Apple A19 Pro — запас производительности на 5+ лет',
            ],
          },
          {
            productId: 'prod-samsung-s25-ultra',
            rank: 2,
            matchScore: 95,
            reasons: [
              '200 Мп основная камера и интеллектуальные функции Galaxy AI',
              'Удобный встроенный стилус S Pen для заметок и эскизов',
              'Экран Dynamic AMOLED 2X 6.8" 120Hz',
              'Qualcomm Snapdragon 8 Elite с максимальной энергоэффективностью',
            ],
          },
        ];
      } else if (q.includes('наушник') || q.includes('anc') || q.includes('звук') || q.includes('шум')) {
        results = [
          {
            productId: 'prod-sony-wh1000xm5',
            rank: 1,
            matchScore: 99,
            reasons: [
              'Лучшее в мире активное шумоподавление с 8 микрофонами и двумя процессорами',
              'Поддержка Hi-Res Audio и аудиофильского кодека LDAC',
              'До 30 часов непрерывного воспроизведения музыки',
              'Мягкие премиальные амбушюры и ультракомфортная посадка',
            ],
          },
          {
            productId: 'prod-airpods-pro-2',
            rank: 2,
            matchScore: 96,
            reasons: [
              'Компактный TWS формат в кармане с кейсом MagSafe USB-C',
              'Адаптивное аудио и пространственный звук с отслеживанием головы',
              'Идеальная бесшовная экосистема для устройств Apple',
            ],
          },
        ];
      } else {
        // General smart fallbacks
        results = [
          {
            productId: 'prod-macbook-air-m4',
            rank: 1,
            matchScore: 94,
            reasons: [
              'Универсальный ультрабук №1 для любых рабочих и повседневных задач',
              'Мощный процессор Apple M4 и потрясающая автономность 18 часов',
            ],
          },
          {
            productId: 'prod-iphone-17-pro',
            rank: 2,
            matchScore: 92,
            reasons: [
              'Лидер по продажам и отзывам покупателей TechMarket',
              'Титановый корпус, 120 Гц и профессиональная съемка 4K ProRes',
            ],
          },
        ];
      }

      setRecommendations(results);
      setIsThinking(false);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
        {/* Modal Top Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Bot size={22} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                AI-Консультант TechMarket
                <span className="px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                  GPT-4o Turbo
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Задайте вопрос своими словами — нейросеть подберет оптимальную технику
              </p>
            </div>
          </div>
          <button
            onClick={() => setAIAssistantOpen(false)}
            className="p-2 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-5">
          {/* Search / Prompt input */}
          <div>
            <div className="relative flex items-center">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAnalyze(query)}
                placeholder="Что мне купить? Например: нужен ноутбук до 500 000 ₸ для учебы и игр..."
                className="w-full pl-4 pr-12 py-3.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 shadow-inner"
              />
              <button
                onClick={() => handleAnalyze(query)}
                disabled={!query.trim() || isThinking}
                className="absolute right-2 p-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white transition shadow-sm"
              >
                <Send size={16} />
              </button>
            </div>

            {/* Quick Prompts */}
            <div className="mt-3 flex flex-wrap gap-1.5">
              <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1 self-center mr-1">
                <Sparkles size={12} /> Примеры:
              </span>
              {quickPrompts.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setQuery(p);
                    handleAnalyze(p);
                  }}
                  className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700/80 transition"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Loading state */}
          {isThinking && (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
              <div className="w-12 h-12 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                Анализирую параметры каталога, отзывы и тесты производительности...
              </p>
            </div>
          )}

          {/* Results Display */}
          {recommendations && (
            <div className="space-y-4 pt-2">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider flex items-center justify-between">
                <span>Рекомендации нейросети:</span>
                <span className="text-xs text-blue-600 dark:text-blue-400 font-normal">
                  Найдено {recommendations.length} лучших соответствия
                </span>
              </h3>

              <div className="space-y-4">
                {recommendations.map((rec) => {
                  const product = products.find((p) => p.id === rec.productId);
                  if (!product) return null;

                  const badgeColors =
                    rec.rank === 1
                      ? 'bg-amber-500 text-white'
                      : rec.rank === 2
                      ? 'bg-slate-400 text-white'
                      : 'bg-amber-700 text-white';

                  const badgeText = rec.rank === 1 ? '🥇 1-е место' : rec.rank === 2 ? '🥈 2-е место' : '🥉 3-е место';

                  return (
                    <div
                      key={product.id}
                      className={`p-4 rounded-xl border ${
                        rec.rank === 1
                          ? 'border-blue-500/40 bg-blue-50/20 dark:bg-blue-950/20 ring-1 ring-blue-500/20'
                          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/50'
                      } transition hover:shadow-md`}
                    >
                      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80">
                        <div className="flex items-center gap-3">
                          <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${badgeColors}`}>
                            {badgeText}
                          </span>
                          <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                            {rec.matchScore}% совпадение
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-base font-bold text-slate-900 dark:text-white">
                            {product.price.toLocaleString('ru-RU')} ₸
                          </span>
                          {product.oldPrice && (
                            <span className="ml-2 text-xs text-slate-400 line-through">
                              {product.oldPrice.toLocaleString('ru-RU')} ₸
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="mt-3 flex items-start gap-4">
                        <img
                          src={product.mainImage}
                          alt={product.title}
                          className="w-20 h-20 object-cover rounded-lg border border-slate-200 dark:border-slate-700 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <Link
                            href={`/product/${product.id}`}
                            onClick={() => setAIAssistantOpen(false)}
                            className="font-bold text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition line-clamp-1"
                          >
                            {product.title}
                          </Link>
                          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                            {product.description}
                          </p>

                          {/* Bullet reasoning */}
                          <div className="mt-2.5 space-y-1">
                            <p className="text-[11px] font-semibold text-slate-400">Причина выбора:</p>
                            {rec.reasons.map((reason, rIdx) => (
                              <div key={rIdx} className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300">
                                <Check size={14} className="text-emerald-500 shrink-0" />
                                <span>{reason}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-end gap-2">
                        <Link
                          href={`/product/${product.id}`}
                          onClick={() => setAIAssistantOpen(false)}
                          className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                        >
                          Подробнее
                        </Link>
                        <button
                          onClick={() => {
                            addToCart(product);
                          }}
                          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition shadow-xs"
                        >
                          <ShoppingCart size={14} /> В корзину
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
