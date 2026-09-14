import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/context/StoreContext";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { AuthModal } from "@/components/auth/AuthModal";
import { AIAssistantModal } from "@/components/ai/AIAssistantModal";
import { CartToast } from "@/components/common/CartToast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TechMarket — Интернет-магазин электроники и гаджетов | Кызылорда",
  description: "Купить смартфоны, ноутбуки, ПК, комплектующие, наушники и технику в Кызылорде с гарантией и рассрочкой 0-0-24. Скидки TECH FRIDAY.",
  keywords: "TechMarket, Кызылорда электроника, купить iPhone 17, MacBook Air M4, смартфоны, ноутбуки, скидки",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="ru"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 selection:bg-blue-500 selection:text-white">
        <StoreProvider>
          <Header />
          <main className="flex-1 w-full">{children}</main>
          <Footer />
          <MobileBottomNav />
          <AuthModal />
          <AIAssistantModal />
          <CartToast />
        </StoreProvider>
      </body>
    </html>
  );
}
