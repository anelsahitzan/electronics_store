'use client';

import React, { useState } from 'react';
import { useStore } from '@/context/StoreContext';
import { X, Mail, Lock, User as UserIcon, Shield, Sparkles } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setAuthModalOpen, login, switchRole } = useStore();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  if (!isAuthModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    login(email, 'USER', name || 'Пользователь');
  };

  const handleQuickAdminLogin = () => {
    login('admin@techmarket.kz', 'ADMIN', 'Lawliet (Главный Администратор)');
  };

  const handleQuickUserLogin = () => {
    login('customer@techmarket.kz', 'USER', 'Анель Нургалиева');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden p-6 sm:p-8">
        {/* Close button */}
        <button
          onClick={() => setAuthModalOpen(false)}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-600/10 text-blue-600 dark:text-blue-400 mb-3">
            <UserIcon size={24} />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            {isRegister ? 'Создать аккаунт' : 'Вход в TechMarket'}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {isRegister
              ? 'Зарегистрируйтесь для скидок и отслеживания заказов'
              : 'Введите данные для входа в личный кабинет'}
          </p>
        </div>

        {/* Quick Demo Login Badges */}
        <div className="mb-6 p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 text-xs">
          <p className="font-semibold text-blue-900 dark:text-blue-300 mb-2 flex items-center gap-1.5">
            <Sparkles size={14} /> Быстрый вход для тестирования:
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleQuickUserLogin}
              className="py-1.5 px-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium text-slate-800 dark:text-slate-200 hover:border-blue-500 transition text-center shadow-xs"
            >
              👤 Покупатель
            </button>
            <button
              type="button"
              onClick={handleQuickAdminLogin}
              className="py-1.5 px-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition text-center shadow-xs flex items-center justify-center gap-1"
            >
              <Shield size={12} /> Админ-панель
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Ваше имя
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3.5 top-3 text-slate-400" size={18} />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Иван Сергеев"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Email или Телефон
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 text-slate-400" size={18} />
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ivan@techmarket.kz"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Пароль
              </label>
              {!isRegister && (
                <button
                  type="button"
                  onClick={() => alert('Ссылка для сброса пароля отправлена на email!')}
                  className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Забыли пароль?
                </button>
              )}
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 text-slate-400" size={18} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition shadow-md shadow-blue-500/20"
          >
            {isRegister ? 'Зарегистрироваться' : 'Войти'}
          </button>
        </form>

        {/* Social logins */}
        <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800 text-center">
          <p className="text-xs text-slate-400 mb-3">Или войти через</p>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => login('google_user@gmail.com', 'USER', 'Google User')}
              className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-sm font-medium transition"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#EA4335"
                  d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"
                />
                <path
                  fill="#4285F4"
                  d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5.1 3.7-8.9z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.6 14.8c-.3-.8-.4-1.8-.4-2.8s.2-2 .4-2.8L1.9 6.3C.7 8.7 0 10.3 0 12s.7 3.3 1.9 5.7l3.7-2.9z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16C3.7 20.4 7.5 23 12 23z"
                />
              </svg>
              Google
            </button>
            <button
              onClick={() => login('apple_user@icloud.com', 'USER', 'Apple User')}
              className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-sm font-medium transition"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 0.93-2.85-.9.04-1.99.6-2.63 1.35-.57.65-1.06 1.71-.93 2.73 1 .08 2.02-.48 2.63-1.23z" />
              </svg>
              Apple ID
            </button>
          </div>

          <div className="mt-6 text-center text-xs text-slate-500">
            {isRegister ? 'Уже есть аккаунт?' : 'Нет аккаунта?'}{' '}
            <button
              type="button"
              onClick={() => setIsRegister(!isRegister)}
              className="text-blue-600 dark:text-blue-400 font-semibold hover:underline"
            >
              {isRegister ? 'Войти' : 'Зарегистрироваться'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
