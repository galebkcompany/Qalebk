"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface FavoriteItem {
  id: string;
  name: string;
  price: number;
  image_url: string;
  product_url: string;
  is_featured: boolean;
}

export default function FavoritesPage() {
  const [items, setItems] = useState<FavoriteItem[]>([]);

  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    setItems(favorites);
  }, []);

  const removeItem = (id: string) => {
    const updatedFavorites = items.filter((item) => item.id !== id);
    setItems(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    window.dispatchEvent(new Event("favorites-updated"));
  };

  if (items.length === 0) {
    return (
      <div className="flex bg-white flex-col items-center justify-center min-h-[100vh]">
        <h2 className="text-2xl font-semibold text-gray-800">
          لا توجد منتجات في المفضلة
        </h2>
        <Link
          href="/"
          className="mt-4 text-blue-500 bg-gray-100 p-3 rounded-full hover:underline"
        >
          العودة للتسوق
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl min-h-screen bg-white text-black mx-auto p-6 flex flex-col">
      <div className="flex-1">
        <h1 className="text-3xl font-medium mb-8 text-right">
          المنتجات المفضلة
        </h1>

        <div className="space-y-6">
          {items.map((item) => (
            <Link href={item.product_url} key={item.id} className="block">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border border-gray-200 p-4 rounded-xl bg-white hover:shadow-sm transition-all cursor-pointer gap-4">
                {/* الصورة */}
                {item.image_url.endsWith(".mp4") ? (
                  <video
                    src={item.image_url}
                    muted
                    loop
                    autoPlay
                    playsInline
                    preload="metadata"
                    className="w-80 h-full object-cover"
                  />
                ) : (
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-80 h-full object-cover"
                    loading="lazy"
                    draggable={false}
                  />
                )}

                {/* المحتوى */}
                <div className="flex flex-col justify-start gap-1 sm:gap-2 flex-1 text-right">
                  {item.is_featured && (
                    <div className="inline-flex items-center w-fit gap-1 bg-purple-600/95 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full mb-1">
                      <span>مميز</span>
                      <span>★</span>
                    </div>
                  )}

                  <p className="text-xl font-medium text-gray-800">
                    {item.name}
                  </p>

                  {/* السعر + الخصم */}
                  <div className="flex flex-wrap items-center gap-3 mt-1">
                    <span className="text-xl font-bold text-black">
                      {item.price} SAR
                    </span>

                    <span className="text-sm text-gray-400 line-through">
                      {item.price * 2} SAR
                    </span>

                    <span className="text-green-600 text-base font-medium">
                      احصل على قسم إضافي مجاناً
                    </span>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    removeItem(item.id);
                  }}
                  className="text-gray-600 hover:text-red-500 px-4 py-2 rounded-lg transition-colors"
                >
                  إزالة
                </button>
              </div>
            </Link>
          ))}
        </div>
      </div>
      {/* Footer */}
      <footer className="mt-16 border-t border-gray-200 pt-4 text-sm text-gray-500">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* الروابط */}
          <div className="flex flex-wrap gap-4 justify-center sm:justify-start">
            <Link href="/terms" className="hover:text-gray-800 transition">
              شروط الاستخدام
            </Link>
            <Link href="/privacy" className="hover:text-gray-800 transition">
              سياسة الخصوصية
            </Link>
            <Link href="/refund" className="hover:text-gray-800 transition">
              سياسة الاسترجاع
            </Link>
          </div>

          {/* الحقوق */}
          <div className="text-center sm:text-end">
            جميع الحقوق محفوظة © 2026 قالبك
          </div>
        </div>
      </footer>
    </div>
  );
}
