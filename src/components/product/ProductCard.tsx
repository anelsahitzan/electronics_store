'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Product } from '@/types';
import { useStore } from '@/context/StoreContext';
import { Heart, Scale, ShoppingCart, Star, Check } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const {
    addToCart,
    toggleWishlist,
    isInWishlist,
    toggleComparison,
    isInComparison,
  } = useStore();

  const [isAdded, setIsAdded] = useState(false);
  const isWishlisted = isInWishlist(product.id);
  const isCompared = isInComparison(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  const handleToggleComparison = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleComparison(product.id);
  };

  return (
    <div className="group relative flex flex-col rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 hover:border-blue-500/50 dark:hover:border-blue-500/40 shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden">
      {/* Badges container */}
      <div className="absolute top-3 left-3 z-10 flex flex-wrap gap-1 items-start">
        {product.discountPercent && product.discountPercent > 0 ? (
          <span className="px-2 py-0.5 rounded-md bg-rose-600 text-white text-[11px] font-bold shadow-xs">
            -{product.discountPercent}%
          </span>
        ) : product.isNew ? (
          <span className="px-2 py-0.5 rounded-md bg-slate-900/90 dark:bg-slate-800 text-slate-200 text-[10px] font-bold border border-slate-700">
            Новинка
          </span>
        ) : product.isBestseller ? (
          <span className="px-2 py-0.5 rounded-md bg-slate-900/90 dark:bg-slate-800 text-slate-200 text-[10px] font-bold border border-slate-700">
            Хит
          </span>
        ) : null}
        {product.isTechFriday && (
          <span className="px-2 py-0.5 rounded-md bg-slate-900/90 dark:bg-slate-800 text-slate-300 text-[10px] font-semibold border border-slate-700">
            Tech Friday
          </span>
        )}
      </div>

      {/* Floating Action Buttons (Wishlist, Compare) */}
      <div className="absolute top-3 right-3 z-10 flex flex-col gap-1.5 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <button
          onClick={handleToggleWishlist}
          title={isWishlisted ? 'Удалить из избранного' : 'Добавить в избранное'}
          className={`p-2 rounded-xl backdrop-blur-md transition shadow-xs ${
            isWishlisted
              ? 'bg-rose-500 text-white'
              : 'bg-white/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:text-rose-500 hover:bg-white dark:hover:bg-slate-800'
          }`}
        >
          <Heart size={16} className={isWishlisted ? 'fill-current' : ''} />
        </button>

        <button
          onClick={handleToggleComparison}
          title={isCompared ? 'Удалить из сравнения' : 'Добавить к сравнению'}
          className={`p-2 rounded-xl backdrop-blur-md transition shadow-xs ${
            isCompared
              ? 'bg-blue-600 text-white'
              : 'bg-white/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:text-blue-500 hover:bg-white dark:hover:bg-slate-800'
          }`}
        >
          <Scale size={16} />
        </button>
      </div>

      {/* Product Image Link */}
      <Link href={`/product/${product.id}`} className="relative block aspect-square overflow-hidden bg-slate-50 dark:bg-slate-950/60 p-4">
        <img
          src={product.mainImage}
          alt={product.title}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
      </Link>

      {/* Product Details Info */}
      <div className="flex flex-col flex-1 p-4">
        {/* Category & Brand */}
        <div className="text-[11px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
          {product.brand} • {product.category}
        </div>

        {/* Title */}
        <Link
          href={`/product/${product.id}`}
          className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition line-clamp-2 min-h-[40px]"
        >
          {product.title}
        </Link>

        {/* Rating & Reviews */}
        <div className="flex items-center gap-1.5 mt-2 text-xs">
          <div className="flex items-center text-amber-400">
            <Star size={13} className="fill-amber-400" />
            <span className="font-bold ml-1 text-slate-800 dark:text-slate-200">
              {product.rating}
            </span>
          </div>
          <span className="text-slate-400">({product.reviewsCount})</span>
        </div>

        {/* Price block */}
        <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800/60 flex items-baseline justify-between gap-2">
          <div>
            <div className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight">
              {product.price.toLocaleString('ru-RU')} ₸
            </div>
            {product.oldPrice && (
              <div className="text-xs text-slate-400 line-through">
                {product.oldPrice.toLocaleString('ru-RU')} ₸
              </div>
            )}
          </div>

          {/* Quick Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            className={`p-2.5 rounded-xl font-semibold text-xs transition flex items-center justify-center gap-1 shadow-xs shrink-0 ${
              isAdded
                ? 'bg-emerald-600 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
            title="Добавить в корзину"
          >
            {isAdded ? (
              <>
                <Check size={16} />
                <span className="hidden sm:inline">В корзине</span>
              </>
            ) : (
              <>
                <ShoppingCart size={16} />
                <span className="hidden sm:inline">В корзину</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
