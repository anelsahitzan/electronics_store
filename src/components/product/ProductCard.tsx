'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Product } from '@/types';
import { useStore } from '@/context/StoreContext';
import { Heart, Scale, ShoppingCart, Star, Check, Minus, Plus } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  rank?: number;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, rank }) => {
  const {
    cart,
    addToCart,
    updateCartQuantity,
    toggleWishlist,
    isInWishlist,
    toggleComparison,
    isInComparison,
  } = useStore();

  const [justAdded, setJustAdded] = useState(false);
  const [stockWarning, setStockWarning] = useState(false);
  const isWishlisted = isInWishlist(product.id);
  const isCompared = isInComparison(product.id);

  // Stock limit calculation
  const maxStock = product.stockQuantity && product.stockQuantity > 0 ? product.stockQuantity : 5;

  // Find if this product is in the cart and calculate quantity
  const cartItems = cart.filter((item) => item.product.id === product.id);
  const totalQuantityInCart = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const primaryCartItem = cartItems[0];
  const isMaxStockReached = totalQuantityInCart >= maxStock;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isMaxStockReached) {
      setStockWarning(true);
      setTimeout(() => setStockWarning(false), 2000);
      return;
    }
    addToCart(product);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1800);
  };

  const handleIncrement = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isMaxStockReached) {
      setStockWarning(true);
      setTimeout(() => setStockWarning(false), 2000);
      return;
    }
    if (primaryCartItem) {
      updateCartQuantity(primaryCartItem.id, 1);
    } else {
      addToCart(product);
    }
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setStockWarning(false);
    if (primaryCartItem) {
      updateCartQuantity(primaryCartItem.id, -1);
    }
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
    <div className="group relative flex flex-col rounded-2xl bg-white dark:bg-[#141b29] border border-slate-200/80 dark:border-slate-800/80 hover:border-blue-500/40 dark:hover:border-blue-500/40 shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_28px_-4px_rgba(0,0,0,0.08)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.25)] dark:hover:shadow-[0_12px_28px_-4px_rgba(0,0,0,0.45)] transition-all duration-300 overflow-hidden">
      {/* Badges container - Horizontal flex with 8px gap */}
      <div className="absolute top-3 left-3 z-10 flex flex-wrap gap-2 items-center pointer-events-none">
        {rank !== undefined && (
          <span className="w-6 h-6 rounded-full bg-slate-900/95 dark:bg-slate-800 text-white font-black text-[11px] flex items-center justify-center border border-slate-700 shadow-sm shrink-0">
            #{rank}
          </span>
        )}
        {product.discountPercent && product.discountPercent > 0 ? (
          <span className="px-2 py-0.5 rounded-md bg-rose-600 text-white text-[11px] font-bold shadow-xs shrink-0">
            -{product.discountPercent}%
          </span>
        ) : null}
        {maxStock <= 3 && (
          <span className="px-2 py-0.5 rounded-md bg-amber-500 text-white text-[10px] font-black tracking-tight shadow-xs flex items-center gap-0.5 shrink-0">
            🔥 Осталось {maxStock} шт.
          </span>
        )}
        {product.isNew ? (
          <span className="px-2 py-0.5 rounded-md bg-slate-900/90 dark:bg-slate-800 text-slate-200 text-[10px] font-bold border border-slate-700 shrink-0">
            Новинка
          </span>
        ) : product.isBestseller ? (
          <span className="px-2 py-0.5 rounded-md bg-slate-900/90 dark:bg-slate-800 text-slate-200 text-[10px] font-bold border border-slate-700 shrink-0">
            Хит Kaspi
          </span>
        ) : null}
        {product.isTechFriday && (
          <span className="px-2 py-0.5 rounded-md bg-slate-900/90 dark:bg-slate-800 text-slate-300 text-[10px] font-semibold border border-slate-700 shrink-0">
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
              ? 'bg-blue-600 text-white shadow-blue-500/20'
              : 'bg-white/90 dark:bg-slate-800/90 text-slate-500 dark:text-slate-300 hover:text-rose-500 hover:bg-white dark:hover:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60'
          }`}
        >
          <Heart size={16} className={isWishlisted ? 'fill-current' : ''} />
        </button>

        <button
          onClick={handleToggleComparison}
          title={isCompared ? 'Удалить из сравнения' : 'Добавить к сравнению'}
          className={`p-2 rounded-xl backdrop-blur-md transition shadow-xs ${
            isCompared
              ? 'bg-blue-600 text-white shadow-blue-500/20'
              : 'bg-white/90 dark:bg-slate-800/90 text-slate-500 dark:text-slate-300 hover:text-blue-600 hover:bg-white dark:hover:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60'
          }`}
        >
          <Scale size={16} />
        </button>
      </div>

      {/* Product Image Link */}
      <Link href={`/product/${product.id}`} className="relative block aspect-square overflow-hidden bg-slate-50/70 dark:bg-[#0d111a]/60 border-b border-slate-100 dark:border-slate-800/60 p-5 flex items-center justify-center">
        <img
          src={product.mainImage}
          alt={product.title}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
      </Link>

      {/* Product Details Info */}
      <div className="flex flex-col flex-1 p-4 sm:p-5 bg-white dark:bg-[#141b29]">
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
        <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between gap-2">
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

          {/* Ozon-Style Add to Cart / Stepper Counter */}
          {totalQuantityInCart > 0 ? (
            <div className="flex flex-col items-end gap-1">
              {stockWarning ? (
                <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 animate-in fade-in slide-in-from-bottom-1 duration-200 whitespace-nowrap">
                  ⚠️ Макс. {maxStock} шт.
                </span>
              ) : justAdded ? (
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 animate-in fade-in slide-in-from-bottom-1 duration-200 flex items-center gap-0.5">
                  <Check size={11} strokeWidth={3} /> Добавлено
                </span>
              ) : isMaxStockReached ? (
                <span className="text-[9px] font-medium text-slate-400 dark:text-slate-500 whitespace-nowrap">
                  Лимит: {maxStock} шт.
                </span>
              ) : null}
              <div
                className="flex items-center bg-blue-50 dark:bg-slate-800 border border-blue-200 dark:border-slate-700 rounded-xl p-0.5 shadow-xs"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
              >
                <button
                  type="button"
                  onClick={handleDecrement}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-700 active:scale-90 transition font-bold cursor-pointer"
                  title="Уменьшить количество"
                  aria-label="Уменьшить количество"
                >
                  <Minus size={13} strokeWidth={2.5} />
                </button>
                <span className="min-w-[24px] text-center font-black text-xs text-blue-600 dark:text-blue-400 px-1 select-none">
                  {totalQuantityInCart}
                </span>
                <button
                  type="button"
                  onClick={handleIncrement}
                  disabled={isMaxStockReached}
                  className={`w-7 h-7 rounded-lg flex items-center justify-center transition font-bold ${
                    isMaxStockReached
                      ? 'opacity-30 cursor-not-allowed text-slate-400'
                      : 'text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-700 active:scale-90 cursor-pointer'
                  }`}
                  title={isMaxStockReached ? `Больше нет в наличии (максимум ${maxStock} шт.)` : 'Увеличить количество'}
                  aria-label="Увеличить количество"
                >
                  <Plus size={13} strokeWidth={2.5} />
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={handleAddToCart}
              className="p-2.5 rounded-xl font-semibold text-xs transition flex items-center justify-center gap-1.5 shadow-xs shrink-0 bg-blue-600 hover:bg-blue-700 text-white cursor-pointer active:scale-95"
              title="Добавить в корзину"
            >
              <ShoppingCart size={15} />
              <span className="hidden sm:inline">В корзину</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
