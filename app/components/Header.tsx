"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart, User, Menu, Package, UserCircle } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/app/contexts/AuthContext";
import LoginModal from "@/app/components/LoginModal";

export default function Header() {
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const { user, loading } = useAuth();
  const accountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateFavoritesCount = () => {
      const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
      setFavoritesCount(favorites.length);
    };
    updateFavoritesCount();
    window.addEventListener("favorites-updated", updateFavoritesCount);
    window.addEventListener("storage", updateFavoritesCount);
    return () => {
      window.removeEventListener("favorites-updated", updateFavoritesCount);
      window.removeEventListener("storage", updateFavoritesCount);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (accountRef.current && !accountRef.current.contains(event.target as Node)) {
        setIsAccountOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const categories = [{ name: "أقسام جاهزة", href: "/categories/sections" }];

  return (
    <>
      <header className="w-full border-b border-gray-300 bg-backg py-1text-black stickyz-[50]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          {/* حاوية رئيسية مرنة (Flexbox) تضمن وجود الجميع في صف واحد دائماً */}
          <div className="flex items-center justify-between gap-2 h-16">
            
            {/* 1. اللوجو وزر الفئات (الشاشات الكبيرة) */}
            <div className="flex items-center gap-2 sm:gap-6 flex-shrink-0">
              <Link href="/" className="w-[60px] sm:w-[90px]">
                <Image
                  src="/images/logo/logo.png"
                  alt="قالبك Qalebk"
                  width={689}
                  height={362}
                  priority
                  className="w-full h-auto object-contain"
                />
              </Link>

              {/* زر الفئات - يظهر بنص في الكبير وأيقونة فقط في الصغير */}
              <div className="relative">
                {/* <button
                  onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                  className="flex items-center gap-1 p-2 sm:px-4 sm:py-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <Menu size={20} className="sm:w-[22px]" />
                  <span className="hidden sm:block text-sm font-medium">الفئات</span>
                </button> */}

                {isCategoriesOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsCategoriesOpen(false)} />
                    <div className="absolute top-full py-3 right-0 mt-4 w-60 bg-white border border-gray-100 rounded-lg shadow-lg z-20">
                      {categories.map((category, index) => (
                        <Link
                          key={index}
                          href={category.href}
                          onClick={() => setIsCategoriesOpen(false)}
                          className="block px-4 py-3 text-base hover:bg-gray-50 transition-colors"
                        >
                          {category.name}
                        </Link>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* 2. حقل البحث - يتمدد ليشغل المساحة المتاحة الوسطى */}
            <div className="flex-1 max-w-2xl mx-2">
              <input
                type="text"
                placeholder="ابحث عن قسم..."
                className="w-full rounded-full bg-white border border-gray-400 px-4 py-3 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-black transition-all"
              />
            </div>

            {/* 3. أيقونات الحساب والمفضلة */}
            <div className="flex items-center gap-3 sm:gap-6 flex-shrink-0">
              <div className="relative" ref={accountRef}>
                <button
                  onClick={() => setIsAccountOpen(!isAccountOpen)}
                  className="hover:opacity-70 p-1"
                >
                  <User size={22} className="sm:w-[24px]" />
                </button>

                {isAccountOpen && (
                  <div className="absolute left-0 sm:left-1/2 sm:-translate-x-1/2 mt-4 w-48 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-50">
                    {loading ? (
                      <div className="px-4 py-3 text-center text-xs text-gray-500">جاري التحميل...</div>
                    ) : user ? (
                      <>
                        <div className="px-4 py-2 border-b border-gray-100 bg-gray-50">
                          <p className="text-xs font-bold truncate">{user.email}</p>
                        </div>
                        <Link href="/account" onClick={() => setIsAccountOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-gray-50">
                          <UserCircle size={18} /> <span>حسابي</span>
                        </Link>
                        <Link href="/orders" onClick={() => setIsAccountOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-gray-50">
                          <Package size={18} /> <span>مشترياتي</span>
                        </Link>
                      </>
                    ) : (
                      <div className="p-4">
                        <button
                          onClick={() => { setIsLoginModalOpen(true); setIsAccountOpen(false); }}
                          className="w-full bg-black text-white py-2 rounded-md text-sm font-medium"
                        >
                          تسجيل الدخول
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <Link href="/favorites" className="relative hover:opacity-70 p-1">
                <Heart size={21} className="sm:w-[23px]" />
                {favoritesCount > 0 && (
                  <span className="absolute -top-1 -left-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white font-bold">
                    {favoritesCount}
                  </span>
                )}
              </Link>
            </div>

          </div>
        </div>
      </header>

      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </>
  );
}