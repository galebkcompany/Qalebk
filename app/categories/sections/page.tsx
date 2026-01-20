// app/categories/sections/page.tsx
import Footer from "@/app/components/Footer";
import Hero from "@/app/components/Hero";
import ProductCard from "@/app/components/ProductCard";
import { supabaseServer } from "@/app/lib/supabaseServer";

export const dynamic = 'force-dynamic'; // فرض التحديث الديناميكي
export const revalidate = 0;

export default async function SectionsPage() {

  // جلب المنتجات من نوع "section"
  const { data: products, error } = await supabaseServer
    .from("products")
    .select(`
      id,
      name,
      slug,
      image_url,
      price_id,
      platforms,
      is_featured,
      prices (
        amount
      )
    `)
    .eq("product_type", "section") // فلترة حسب نوع المنتج
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return <div className="p-6">فشل تحميل الأقسام</div>;
  }

  return (
    <>
      <main className="p-4 bg-backg">
        <h1 className="text-2xl font-bold mb-4">أقسام جاهزة</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 py-6">
          {products.map((product: any) => (
            <ProductCard
              key={product.id}
              product={{
                id: product.id,
                slug: product.slug,
                name: product.name,
                image_url: product.image_url,
                price: product.prices.amount,
                platforms: product.platforms,
                is_featured: product.is_featured,
              }}
            />
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
