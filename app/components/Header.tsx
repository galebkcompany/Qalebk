"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart, User, Menu, LogOut, Package, UserCircle } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/app/contexts/AuthContext";
import LoginModal from "@/app/components/LoginModal";

export default function Header() {
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const { user, loading, signOut } = useAuth();
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

  // إغلاق القائمة عند النقر خارجها
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        accountRef.current &&
        !accountRef.current.contains(event.target as Node)
      ) {
        setIsAccountOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const categories = [{ name: "أقسام جاهزة", href: "/categories/sections" }];
const BASE_HOURS = 48; // يومين
const STORAGE_KEY = "free-section-timer";

const [timeLeft, setTimeLeft] = useState({
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
});

useEffect(() => {
  let endTime = localStorage.getItem(STORAGE_KEY);

  if (!endTime) {
    // عشوائية ذكية
    const randomHours = Math.floor(Math.random() * 4) + 3; // 3 → 6 ساعات
    const randomMinutes = Math.floor(Math.random() * 50) + 10; // 10 → 59 دقيقة

    const totalMs =
      (BASE_HOURS - randomHours) * 60 * 60 * 1000 -
      randomMinutes * 60 * 1000;

    const end = Date.now() + totalMs;

    localStorage.setItem(STORAGE_KEY, end.toString());
    endTime = end.toString();
  }

  const interval = setInterval(() => {
    const diff = Number(endTime) - Date.now();

    if (diff <= 0) {
      clearInterval(interval);
      setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      return;
    }

    setTimeLeft({
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / (1000 * 60)) % 60),
      seconds: Math.floor((diff / 1000) % 60),
    });
  }, 1000);

  return () => clearInterval(interval);
}, []);

  return (
    <>
      <div className="w-full bg-green-500 text-white text-center text-sm py-2 font-medium flex items-center justify-center gap-2 flex-wrap">
        <span>احصل على قسم إضافي مجانًا</span>

        <span className="bg-white/20 px-2 py-1 rounded-md text-xs font-bold">
          {timeLeft.days}ي :{timeLeft.hours.toString().padStart(2, "0")}س :
          {timeLeft.minutes.toString().padStart(2, "0")}د :
          {timeLeft.seconds.toString().padStart(2, "0")}ث
        </span>
      </div>

      <header className="w-full border-b border-gray-300 bg-backg py-1 text-black">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-col gap-2 py-2 sm:flex-row sm:h-16 sm:items-center sm:gap-6 sm:py-0">
            {/* الصف الأول - في الموبايل: Logo + الأيقونات | في التابلت والكمبيوتر: كل شيء */}
            <div className="flex items-center gap-4 sm:flex-1 sm:gap-6">
              {/* Logo */}
              <Link href="/" className="w-[72px] sm:w-[90px]">
                <Image
                  src="/images/logo/logo.png"
                  alt="قالبك Qalebk"
                  width={689}
                  height={362}
                  priority
                  sizes="(max-width: 640px) 90px, 120px"
                  className="w-full h-auto object-contain"
                />
              </Link>

              {/* زر الفئات - يظهر فقط في الشاشات الكبيرة */}
              <div className="hidden sm:block relative">
                <button
                  onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                  className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-gray-100 transition-colors flex-shrink-0"
                >
                  <Menu size={22} />
                  <span className="text-sm font-medium">الفئات</span>
                </button>

                {/* القائمة المنسدلة */}
                {isCategoriesOpen && (
                  <>
                    {/* طبقة شفافة للإغلاق عند الضغط خارج القائمة */}
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setIsCategoriesOpen(false)}
                    />

                    <div className="absolute top-full py-3 right-0 mt-4 w-64 bg-white border border-gray-100 rounded-lg shadow-lg z-20">
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

              {/* حقل البحث - يظهر فقط في الشاشات الكبيرة */}
              <div className="hidden sm:flex sm:flex-1 sm:min-w-0">
                <input
                  type="text"
                  placeholder="مثال: قسم متجر عطور"
                  className="w-full rounded-full bg-white border border-gray-500 px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-gray-800"
                />
              </div>

              {/* الأيقونات - دائماً ظاهرة في نفس الصف مع اللوجو على الموبايل */}
              <div className="flex items-center gap-6 mr-auto sm:mr-6 flex-shrink-0">
                {/* أيقونة الحساب مع القائمة المنسدلة */}
                <div className="relative" ref={accountRef}>
                  <button
                    onClick={() => setIsAccountOpen(!isAccountOpen)}
                    onMouseEnter={() => setIsAccountOpen(true)}
                    className="hover:opacity-70 bg-white"
                  >
                    <User size={24} />
                  </button>

                  {/* القائمة المنسدلة للحساب */}
                  {isAccountOpen && (
                    <div
                      className="absolute left-1/2 -translate-x-1/3  mt-4 w-50 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-50"
                      onMouseLeave={() => setIsAccountOpen(false)}
                    >
                      {loading ? (
                        <div className="px-4 py-3 text-center text-gray-500">
                          جاري التحميل...
                        </div>
                      ) : user ? (
                        <>
                          {/* معلومات المستخدم */}
                          <div className="px-4 py-3 border-b border-gray-200">
                            <p className="text-base text-gray-600">مرحباً</p>
                          </div>

                          {/* خيارات المستخدم المسجل */}
                          <Link
                            href="/account"
                            onClick={() => setIsAccountOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                          >
                            <UserCircle size={20} />
                            <span>حسابي</span>
                          </Link>

                          <Link
                            href="/orders"
                            onClick={() => setIsAccountOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                          >
                            <Package size={20} />
                            <span>مشترياتي</span>
                          </Link>
                        </>
                      ) : (
                        <>
                          {/* رسالة للمستخدم غير المسجل */}
                          <div className="px-4 py-3 border-b border-gray-200 flex flex-col items-center">
                            <p className="text-sm text-gray-600 mb-3">
                              مرحباً بك! أنشئ حسابك
                            </p>
                            <button
                              onClick={() => {
                                setIsLoginModalOpen(true);
                                setIsAccountOpen(false);
                              }}
                              className="w-full bg-black text-white py-2 rounded-full hover:bg-gray-900 transition-colors font-medium"
                            >
                              إنشاء حساب
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>

                <Link href="/favorites" className="relative hover:opacity-70">
                  <Heart size={23} />

                  {favoritesCount > 0 && (
                    <span className="absolute -top-2 -left-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#F63049] text-xs text-white">
                      {favoritesCount}
                    </span>
                  )}
                </Link>
              </div>
            </div>

            {/* الصف الثاني - يظهر فقط في الشاشات الصغيرة */}
            <div className="flex items-center gap-2 sm:hidden">
              {/* أيقونة الفئات بدون نص */}
              <div className="relative">
                <button
                  onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <Menu size={20} />
                </button>

                {/* القائمة المنسدلة للموبايل */}
                {isCategoriesOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setIsCategoriesOpen(false)}
                    />

                    <div className="absolute top-full py-4 right-0 mt-2 w-60 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
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

              {/* حقل البحث */}
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="مثال: قسم متجر عطور"
                  className="w-full rounded-full bg-white border border-gray-500 px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-gray-600"
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* نافذة تسجيل الدخول */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </>
  );
}
