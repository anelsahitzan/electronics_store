'use client';

import React from 'react';
import Link from 'next/link';
import { Product } from '@/types';
import { ProductCard } from '@/components/product/ProductCard';
import { ChevronRight } from 'lucide-react';

interface ProductSectionProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  products: Product[];
  viewAllLink?: string;
  isBestsellerList?: boolean;
}

export const ProductSection: React.FC<ProductSectionProps> = ({
  title,
  subtitle,
  icon,
  products,
  viewAllLink = '/catalog',
  isBestsellerList = false,
}) => {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          {icon && <div className="text-2xl">{icon}</div>}
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {title}
            </h2>
            {subtitle && (
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {viewAllLink && (
          <Link
            href={viewAllLink}
            className="flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
          >
            <span>Смотреть все</span>
            <ChevronRight size={14} />
          </Link>
        )}
      </div>

      {/* Grid of Product Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((product, index) => (
          <div key={product.id} className="relative">
            {isBestsellerList && (
              <div className="absolute top-2 left-2 z-20 w-6 h-6 rounded-full bg-slate-900 dark:bg-slate-800 text-white font-bold text-[11px] flex items-center justify-center border border-slate-700 shadow-sm">
                #{index + 1}
              </div>
            )}
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
};
