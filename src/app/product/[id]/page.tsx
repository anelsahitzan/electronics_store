'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useStore } from '@/context/StoreContext';
import { ProductCard } from '@/components/product/ProductCard';
import {
  Heart,
  Scale,
  ShoppingCart,
  Star,
  Check,
  ShieldCheck,
  Truck,
  RotateCcw,
  Maximize2,
  X,
  ChevronRight,
  Sparkles,
  MessageSquare,
  ThumbsUp,
} from 'lucide-react';

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.id as string;

  const {
    products,
    addToCart,
    toggleWishlist,
    isInWishlist,
    toggleComparison,
    isInComparison,
    reviews,
    addReview,
    currentUser,
    setAuthModalOpen,
  } = useStore();

  const product = products.find((p) => p.id === productId) || products[0];

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState(product?.colors[0]?.name || '');
  const [selectedStorage, setSelectedStorage] = useState(product?.storageOptions[0]?.capacity || '');
  const [quantity, setQuantity] = useState(1);
  const [isZoomModalOpen, setIsZoomModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'specs' | 'reviews'>('specs');
  const [isAddedToCart, setIsAddedToCart] = useState(false);

  // New review form state
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewComment, setNewReviewComment] = useState('');
  const [isReviewSubmitted, setIsReviewSubmitted] = useState(false);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold">Товар не найден</h2>
        <Link href="/catalog" className="mt-4 inline-block text-blue-600">
          Вернуться в каталог
        </Link>
      </div>
    );
  }

  // Calculate adjusted price based on selected storage
  let currentPrice = product.price;
  if (selectedStorage) {
    const opt = product.storageOptions.find((o) => o.capacity === selectedStorage);
    if (opt) currentPrice += opt.priceOffset;
  }

  const isWishlisted = isInWishlist(product.id);
  const isCompared = isInComparison(product.id);

  // Product reviews
  const productReviews = reviews.filter((r) => r.productId === product.id);

  // Similar products
  const similarProducts = products
    .filter((p) => p.id !== product.id && p.categorySlug === product.categorySlug)
    .slice(0, 4);

  const handleAddToCart = () => {
    addToCart(product, selectedColor, selectedStorage, quantity);
    setIsAddedToCart(true);
    setTimeout(() => setIsAddedToCart(false), 2000);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewComment.trim()) return;

    addReview({
      productId: product.id,
      author: currentUser ? currentUser.name : 'Покупатель AneliMarket',
      rating: newReviewRating,
      content: newReviewComment.trim(),
      isVerifiedPurchase: true,
    });

    setNewReviewComment('');
    setIsReviewSubmitted(true);
    setTimeout(() => setIsReviewSubmitted(false), 3000);
  };

  const imagesList = product.gallery && product.gallery.length > 0 ? product.gallery : [product.mainImage];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-12">
      {/* Breadcrumbs */}
      <nav className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
        <Link href="/" className="hover:text-blue-600 transition">
          Главная
        </Link>
        <ChevronRight size={12} />
        <Link href="/catalog" className="hover:text-blue-600 transition">
          {product.category}
        </Link>
        <ChevronRight size={12} />
        <Link href={`/catalog?brand=${product.brand}`} className="hover:text-blue-600 transition">
          {product.brand}
        </Link>
        <ChevronRight size={12} />
        <span className="text-slate-900 dark:text-white font-medium truncate max-w-xs">
          {product.title}
        </span>
      </nav>

      {/* Top Main Section: Gallery + Purchase Options */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Gallery Column */}
        <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4">
          {/* Thumbnails list */}
          <div className="flex sm:flex-col gap-2.5 overflow-x-auto sm:overflow-y-auto no-scrollbar shrink-0">
            {imagesList.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImageIndex(idx)}
                className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 transition p-1 bg-white dark:bg-slate-900 ${
                  activeImageIndex === idx
                    ? 'border-blue-600 shadow-md'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-400'
                }`}
              >
                <img src={img} alt={`${product.title} ${idx + 1}`} className="w-full h-full object-contain" />
              </button>
            ))}
          </div>

          {/* Main Large Image with Zoom & Fullscreen */}
          <div className="relative flex-1 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 flex items-center justify-center min-h-[360px] sm:min-h-[480px] overflow-hidden group">
            {product.discountPercent && (
              <span className="absolute top-4 left-4 z-10 px-3 py-1 rounded-lg bg-orange-500 text-white text-xs font-black shadow-md">
                🔥 -{product.discountPercent}%
              </span>
            )}

            <button
              onClick={() => setIsZoomModalOpen(true)}
              className="absolute top-4 right-4 z-10 p-2.5 rounded-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-md text-slate-600 dark:text-slate-300 hover:text-blue-600 hover:bg-white transition shadow-xs"
              title="Развернуть на весь экран"
            >
              <Maximize2 size={18} />
            </button>

            <img
              src={imagesList[activeImageIndex]}
              alt={product.title}
              className="max-h-[380px] w-auto object-contain transition duration-300 group-hover:scale-105 cursor-zoom-in"
              onClick={() => setIsZoomModalOpen(true)}
            />
          </div>
        </div>

        {/* Purchase Configuration Column */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            <div className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-1">
              {product.brand}
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {product.title}
            </h1>

            {/* Rating & Reviews summary */}
            <div className="flex items-center gap-3 mt-2.5 text-xs">
              <div className="flex items-center gap-1 text-amber-400 font-bold">
                <Star size={15} className="fill-amber-400" />
                <span className="text-slate-900 dark:text-white">{product.rating}</span>
              </div>
              <span className="text-slate-400">•</span>
              <button
                onClick={() => setActiveTab('reviews')}
                className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
              >
                {product.reviewsCount} отзывов
              </button>
              <span className="text-slate-400">•</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                В наличии ({product.stockQuantity} шт.)
              </span>
            </div>
          </div>

          {/* Pricing Display */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-1">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                {currentPrice.toLocaleString('ru-RU')} ₸
              </span>
              {product.oldPrice && (
                <span className="text-base text-slate-400 line-through">
                  {(product.oldPrice + (currentPrice - product.price)).toLocaleString('ru-RU')} ₸
                </span>
              )}
            </div>
            {product.oldPrice && (
              <p className="text-xs font-bold text-orange-500">
                🔥 Ваша экономия: {(product.oldPrice - product.price).toLocaleString('ru-RU')} ₸
              </p>
            )}
          </div>

          {/* Color Selector */}
          {product.colors && product.colors.length > 0 && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Цвет: <span className="font-normal text-slate-500">{selectedColor}</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setSelectedColor(c.name)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-medium transition ${
                      selectedColor === c.name
                        ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 ring-1 ring-blue-600'
                        : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-400'
                    }`}
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-black/20 shadow-xs"
                      style={{ backgroundColor: c.hex }}
                    />
                    <span>{c.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Storage / Memory Selector */}
          {product.storageOptions && product.storageOptions.length > 0 && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Память / Накопитель:
              </label>
              <div className="flex flex-wrap gap-2">
                {product.storageOptions.map((opt) => (
                  <button
                    key={opt.capacity}
                    onClick={() => setSelectedStorage(opt.capacity)}
                    className={`px-3.5 py-2 rounded-xl border text-xs font-semibold transition ${
                      selectedStorage === opt.capacity
                        ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 ring-1 ring-blue-600'
                        : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-400'
                    }`}
                  >
                    {opt.capacity}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity and Add to Cart Buttons */}
          <div className="space-y-3 pt-2">
            {/* Stock status info */}
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-500 dark:text-slate-400">Количество:</span>
              <span className={`font-bold flex items-center gap-1 ${
                (product.stockQuantity || 5) <= 3 ? 'text-amber-500' : 'text-emerald-500'
              }`}>
                {(product.stockQuantity || 5) <= 3 ? '🔥 Мало на складе:' : '✓ В наличии:'} {product.stockQuantity || 5} шт.
              </span>
            </div>

            <div className="flex items-center gap-3">
              {/* Quantity counter */}
              <div className="flex items-center rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-1">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 font-bold transition cursor-pointer"
                  aria-label="Уменьшить количество"
                >
                  -
                </button>
                <span className="w-10 text-center font-bold text-sm text-slate-900 dark:text-white">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => Math.min(product.stockQuantity || 5, q + 1))}
                  disabled={quantity >= (product.stockQuantity || 5)}
                  className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold transition ${
                    quantity >= (product.stockQuantity || 5)
                      ? 'opacity-30 cursor-not-allowed text-slate-400'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 cursor-pointer'
                  }`}
                  title={quantity >= (product.stockQuantity || 5) ? `Лимит наличия (${product.stockQuantity || 5} шт.)` : 'Увеличить количество'}
                  aria-label="Увеличить количество"
                >
                  +
                </button>
              </div>

              {/* Main Add To Cart Button */}
              <button
                onClick={handleAddToCart}
                className={`flex-1 py-3.5 px-6 rounded-xl font-bold text-sm transition flex items-center justify-center gap-2 shadow-md ${
                  isAddedToCart
                    ? 'bg-emerald-600 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20'
                }`}
              >
                {isAddedToCart ? (
                  <>
                    <Check size={18} />
                    <span>Добавлено в корзину!</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart size={18} />
                    <span>ДОБАВИТЬ В КОРЗИНУ</span>
                  </>
                )}
              </button>
            </div>

            {/* Actions: Wishlist and Compare */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => toggleWishlist(product.id)}
                className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border text-xs font-semibold transition ${
                  isWishlisted
                    ? 'border-rose-500 text-rose-600 bg-rose-50 dark:bg-rose-950/30'
                    : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <Heart size={16} className={isWishlisted ? 'fill-current' : ''} />
                <span>{isWishlisted ? 'В избранном' : 'В избранное'}</span>
              </button>

              <button
                onClick={() => toggleComparison(product.id)}
                className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border text-xs font-semibold transition ${
                  isCompared
                    ? 'border-blue-500 text-blue-600 bg-blue-50 dark:bg-blue-950/30'
                    : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <Scale size={16} />
                <span>{isCompared ? 'В сравнении' : 'К сравнению'}</span>
              </button>
            </div>
          </div>

          {/* Quick Perks */}
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500">
            <div className="flex items-center gap-1.5">
              <Truck size={14} className="text-blue-600" />
              <span>Доставка: 0 ₸</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-emerald-600" />
              <span>Гарантия 1 год</span>
            </div>
            <div className="flex items-center gap-1.5">
              <RotateCcw size={14} className="text-amber-500" />
              <span>Возврат 14 дней</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs: Specifications & Customer Reviews */}
      <div className="space-y-6 pt-6 border-t border-slate-200 dark:border-slate-800">
        <div className="flex gap-4 border-b border-slate-200 dark:border-slate-800">
          <button
            onClick={() => setActiveTab('specs')}
            className={`pb-3 text-sm font-bold border-b-2 transition ${
              activeTab === 'specs'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Характеристики
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`pb-3 text-sm font-bold border-b-2 transition flex items-center gap-2 ${
              activeTab === 'reviews'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span>Отзывы</span>
            <span className="px-2 py-0.5 rounded-full text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              {productReviews.length}
            </span>
          </button>
        </div>

        {/* Specifications Tab Content */}
        {activeTab === 'specs' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(product.specs || {}).map(([groupTitle, groupParams]) => (
                <div
                  key={groupTitle}
                  className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 space-y-3"
                >
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider text-blue-600 dark:text-blue-400">
                    {groupTitle}
                  </h3>
                  <div className="space-y-2 text-xs">
                    {Object.entries(groupParams).map(([key, val]) => (
                      <div key={key} className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
                        <span className="text-slate-500">{key}</span>
                        <span className="font-semibold text-slate-900 dark:text-slate-200 text-right">
                          {val}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reviews Tab Content */}
        {activeTab === 'reviews' && (
          <div className="space-y-8">
            {/* Reviews Summary Rating Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div className="flex flex-col items-center justify-center text-center space-y-1">
                <span className="text-5xl font-black text-slate-900 dark:text-white">{product.rating}</span>
                <div className="flex text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={18} className="fill-amber-400" />
                  ))}
                </div>
                <span className="text-xs text-slate-400">На основе {product.reviewsCount} отзывов</span>
              </div>

              {/* Progress bars */}
              <div className="md:col-span-2 space-y-1.5 text-xs">
                {[
                  { star: 5, pct: 84 },
                  { star: 4, pct: 10 },
                  { star: 3, pct: 4 },
                  { star: 2, pct: 1 },
                  { star: 1, pct: 1 },
                ].map((item) => (
                  <div key={item.star} className="flex items-center gap-3">
                    <span className="w-8 font-medium text-slate-500">{item.star} ★</span>
                    <div className="flex-1 h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-amber-400 rounded-full"
                        style={{ width: `${item.pct}%` }}
                      />
                    </div>
                    <span className="w-8 text-right text-slate-400">{item.pct}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Leave a review form */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Оставить отзыв о товаре
              </h3>

              <form onSubmit={handleReviewSubmit} className="space-y-4">
                {/* Rating selection */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">Ваша оценка:</span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        type="button"
                        key={s}
                        onClick={() => setNewReviewRating(s)}
                        className="p-1 text-slate-300 hover:text-amber-400 transition"
                      >
                        <Star
                          size={20}
                          className={s <= newReviewRating ? 'text-amber-400 fill-amber-400' : ''}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <textarea
                  rows={3}
                  value={newReviewComment}
                  onChange={(e) => setNewReviewComment(e.target.value)}
                  placeholder="Расскажите о впечатлениях от использования, плюсах и минусах..."
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  required
                />

                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">
                    {currentUser ? `Автор: ${currentUser.name}` : 'Будет опубликовано с бейджем Покупатель'}
                  </span>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs"
                  >
                    Отправить отзыв
                  </button>
                </div>

                {isReviewSubmitted && (
                  <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 text-xs font-semibold flex items-center gap-2">
                    <Check size={16} /> Спасибо за ваш отзыв! Он успешно добавлен.
                  </div>
                )}
              </form>
            </div>

            {/* List of existing reviews */}
            <div className="space-y-4">
              {productReviews.length > 0 ? (
                productReviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-900 dark:text-white">
                            {rev.author}
                          </span>
                          {rev.isVerifiedPurchase && (
                            <span className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold border border-emerald-500/20">
                              ✓ Покупка подтверждена
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
                          <div className="flex text-amber-400">
                            {Array.from({ length: rev.rating }).map((_, i) => (
                              <Star key={i} size={12} className="fill-amber-400" />
                            ))}
                          </div>
                          <span>{rev.date}</span>
                        </div>
                      </div>

                      <button className="flex items-center gap-1 text-xs text-slate-400 hover:text-blue-600 transition">
                        <ThumbsUp size={13} />
                        <span>{rev.likes}</span>
                      </button>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                      {rev.content}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500 text-center py-6">
                  Пока нет отзывов для этого товара. Будьте первым!
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Similar Products Section ("Вам также может понравиться") */}
      {similarProducts.length > 0 && (
        <section className="space-y-4 pt-8">
          <h2 className="text-xl font-black text-slate-900 dark:text-white">
            Вам также может понравиться
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {similarProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Lightbox Zoom Modal */}
      {isZoomModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
          <button
            onClick={() => setIsZoomModalOpen(false)}
            className="absolute top-6 right-6 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
          >
            <X size={24} />
          </button>
          <img
            src={imagesList[activeImageIndex]}
            alt={product.title}
            className="max-h-[85vh] max-w-[90vw] object-contain"
          />
        </div>
      )}
    </div>
  );
}
