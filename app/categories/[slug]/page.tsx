"use client";

import { use } from "react";
import { useEffect, useState } from "react";
import ProductCard from "@/app/components/ProductCard";
import { supabase } from "@/app/lib/supabaseClient";

const categoryTitles: Record<string, string> = {
  "perfumes": "متاجر العطور",
  "jewelry": "متاجر المجوهرات",
  "cosmetics": "متاجر العناية والجمال",
  "abayas": "متاجر العبايات و الأزياء",
  "electronics": "متاجر الإلكترونيات",
  // أضف أي slug جديد هنا مع ترجمته
};

export default function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const displayTitle = categoryTitles[slug.toLowerCase()] || slug;



  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("products")
          .select(`
            id, name, slug, image_url, platforms, is_featured,
            category_images,
            prices ( amount )
          `)
          .not(`category_images->${slug}`, 'is', null) 
          .order("created_at", { ascending: false });

        if (error) throw error;
        setProducts(data || []);
      } catch (err) {
        console.error("تفاصيل الخطأ:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, [slug]);

  // مكون الهيكل العظمي (Skeleton) للتحميل
  const SkeletonCard = () => (
    <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm">
      <div className="aspect-video bg-gray-200 animate-pulse" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
        <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
        <div className="flex justify-between items-center pt-2">
          <div className="h-6 bg-gray-200 rounded w-20 animate-pulse" />
          <div className="h-8 bg-gray-200 rounded-full w-24 animate-pulse" />
        </div>
      </div>
    </div>
  );

  return (
    <main className="p-4 bg-backg w-full mx-auto" dir="rtl">
      <div className="mt-8 mb-2 px-2">
        <h2 className="text-2xl md:text-3xl font-base text-black">
          أقسام لـ <span className="">{displayTitle}</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 py-6">
        {loading ? (
          // عرض 6 بطاقات تحميل أثناء الانتظار
          Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
        ) : products.length === 0 ? (
          <div className="col-span-full text-center py-20">
            <h2 className="text-xl text-gray-600">قريباً.. سيتم إضافة منتجات لهذا القسم</h2>
          </div>
        ) : (
          products.map((product, index) => (
            <ProductCard
              key={product.id}
              index={index}
              currentNiche={slug} 
              product={{
                ...product,
                price: product.prices?.amount || 0,
                category_images: product.category_images,
              }}
            />
          ))
        )}
      </div>
    </main>
  );
}