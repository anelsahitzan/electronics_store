'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useStore } from '@/context/StoreContext';
import { Home, Grid, Heart, ShoppingCart, User as UserIcon } from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const pathname = usePathname();
  const { cartCount, wishlist, currentUser, setAuthModalOpen } = useStore();

  const navItems = [
    { label: 'Главная', href: '/', icon: Home },
    { label: 'Каталог', href: '/catalog', icon: Grid },
    { label: 'Избранное', href: '/wishlist', icon: Heart, badge: wishlist.length },
    { label: 'Корзина', href: '/cart', icon: ShoppingCart, badge: cartCount },
    {
      label: 'Профиль',
      href: currentUser ? '/profile' : '#',
      icon: UserIcon,
      onClick: !currentUser ? () => setAuthModalOpen(true) : undefined,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 md:hidden pb-safe">
      <div className="grid grid-cols-5 h-16 items-center px-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          if (item.onClick) {
            return (
              <button
                key={item.label}
                onClick={item.onClick}
                className="flex flex-col items-center justify-center py-1 text-slate-500 dark:text-slate-400 hover:text-blue-600 transition"
              >
                <div className="relative">
                  <Icon size={20} />
                </div>
                <span className="text-[10px] font-medium mt-1">{item.label}</span>
              </button>
            );
          }

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1 transition relative ${
                isActive
                  ? 'text-blue-600 dark:text-blue-400 font-bold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-blue-600'
              }`}
            >
              <div className="relative">
                <Icon size={20} className={isActive ? 'stroke-[2.5]' : 'stroke-2'} />
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 px-1 rounded-full bg-blue-600 text-white text-[9px] font-bold flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-1">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
