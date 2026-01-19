import Footer from "./components/Footer";
import Hero from "./components/Hero";
import ProductCard from "./components/ProductCard"
import { supabaseServer } from "@/app/lib/supabaseServer"

export const dynamic = 'force-dynamic'; // فرض التحديث الديناميكي
export const revalidate = 0;

export default async function Home() {

  

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
    .order("created_at", { ascending: false })

  if (error) {
    console.error(error)
    return <div className="p-6">فشل تحميل المنتجات</div>
  }
  
  return (
    <>
    {/* Notification Banner for Paddle Reviewers */}
    <div className="w-full bg-blue-600 text-white py-4 px-6 text-center border-b-4 border-blue-800">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-lg font-bold mb-2">📢 To Paddle Review Team:</h2>
        <p className="text-sm md:text-base leading-relaxed">
          Hello Paddle Team! We have submitted our domain for approval but received a rejection notice without specific details about what needs to be fixed. 
          <strong> We kindly request that you provide us with detailed feedback about which specific page or section requires improvement, and what exactly is missing or incorrect.</strong> 
          This will help us address your concerns immediately. Please specify the page URL and the exact issue. Thank you for your assistance!
        </p>
        <p className="text-xs mt-2 opacity-90">
          🌐 Website: qalebk.com
        </p>
      </div>
    </div>

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
