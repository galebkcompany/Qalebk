// app/page.tsx
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import ProductCard from "./components/ProductCard"
import { supabaseServer } from "@/app/lib/supabaseServer"


// export const dynamic = 'force-dynamic'; // فرض التحديث الديناميكي
// export const revalidate = 7200; // إعادة التحقق كل ساعتين

export default async function Home() {

  

  const { data: products, error } = await supabaseServer
    .from("products")
    .select(`
      id,
      name,
      slug,
      image_url,
      variant_id,
      platforms,
      is_featured,
      prices (
        amount
      )
    `)
    .order("created_at", { ascending: false })

  if (error) {
    console.error(error)
    return <div className="p-6">فشل تحميل المنتجات</div>
  }
  
  return (
    <>
    <Hero />
    <main className="p-4 bg-backg">
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
