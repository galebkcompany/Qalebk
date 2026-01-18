//preview/section/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/app/lib/supabaseClient";

export default function PreviewSection() {
  const searchParams = useSearchParams();
  const productId = searchParams.get("id");
  const [loading, setLoading] = useState(true);
  const [injectionCode, setInjectionCode] = useState("");

  useEffect(() => {
    // في PreviewSection، استبدل fetchCode:
    const fetchCode = async () => {
      if (!productId) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("codes")
          .select("preview") // تغيير من code إلى preview
          .eq("product_id", productId)
          .eq("type", "script_embed")
          .single();

        if (!error && data && data.preview) {
          // تغيير من data.code إلى data.preview
          setInjectionCode(data.preview);
        }
      } catch (error) {
        console.error("Error fetching code:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCode();
  }, [productId]);

  useEffect(() => {
    if (!loading && injectionCode) {
      // حقن الكود في الصفحة
      const script = document.createElement("script");
      script.innerHTML = injectionCode;
      document.body.appendChild(script);

      return () => {
        // تنظيف عند unmount
        document.body.removeChild(script);
      };
    }
  }, [loading, injectionCode]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="main-header-bar bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          {/* Logo Skeleton */}
          <div className="w-32 h-8 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-shimmer bg-[length:200%_100%]" />

          {/* Navigation Skeleton */}
          <nav className="hidden md:flex items-center gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="w-20 h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-shimmer bg-[length:200%_100%]"
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </nav>

          {/* Icons Skeleton */}
          <div className="flex items-center gap-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="w-8 h-8 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-full animate-shimmer bg-[length:200%_100%]"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
        </div>
      </header>

      {/* Hero Section - سيتم الحقن هنا */}
      <div id="hero-injection-point" />

      {/* Products Grid */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-8">
          <div className="w-48 h-8 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-shimmer bg-[length:200%_100%] mb-2" />
          <div className="w-64 h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-shimmer bg-[length:200%_100%]" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div
              key={i}
              className="bg-white rounded-lg overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow"
            >
              {/* Image Skeleton */}
              <div
                className="w-full h-64 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer bg-[length:200%_100%]"
                style={{ animationDelay: `${i * 0.1}s` }}
              />

              {/* Content Skeleton */}
              <div className="p-4 space-y-3">
                <div
                  className="w-3/4 h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-shimmer bg-[length:200%_100%]"
                  style={{ animationDelay: `${i * 0.1}s` }}
                />
                <div
                  className="w-1/2 h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-shimmer bg-[length:200%_100%]"
                  style={{ animationDelay: `${i * 0.12}s` }}
                />
                <div className="flex items-center justify-between pt-2">
                  <div
                    className="w-20 h-6 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-shimmer bg-[length:200%_100%]"
                    style={{ animationDelay: `${i * 0.14}s` }}
                  />
                  <div
                    className="w-24 h-9 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-full animate-shimmer bg-[length:200%_100%]"
                    style={{ animationDelay: `${i * 0.16}s` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer Skeleton */}
      <footer className="bg-gray-900 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-4">
                <div
                  className="w-32 h-5 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 rounded animate-shimmer bg-[length:200%_100%]"
                  style={{ animationDelay: `${i * 0.1}s` }}
                />
                {[1, 2, 3].map((j) => (
                  <div
                    key={j}
                    className="w-24 h-3 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 rounded animate-shimmer bg-[length:200%_100%]"
                    style={{ animationDelay: `${(i + j) * 0.1}s` }}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </footer>

      {/* Loading Indicator */}
      {loading && (
        <div className="fixed bottom-4 right-4 bg-black text-white px-4 py-2 rounded-lg shadow-lg">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>جاري تحميل المعاينة...</span>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }

        .animate-shimmer {
          animation: shimmer 2s infinite linear;
        }
      `}</style>
    </div>
  );
}
