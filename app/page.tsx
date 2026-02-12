// app/page.tsx
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import Link from "next/link";

export default function Home() {
  // بيانات التصنيفات (يمكنك تغيير الصور لاحقاً)
const categories = [
  { title: "العطور", img: "/images/section/perfumes.png", slug: "perfumes" },
  { title: "العبايات و الأزياء", img: "/images/section/abaya.png", slug: "abayas" },
  { title: "المجوهرات", img: "/images/section/jewelry.png", slug: "jewelry" },
  { title: "العناية والجمال", img: "/images/section/beauty.png", slug: "cosmetics" },
  { title: "الإلكترونيات", img: "/images/section/tech.png", slug: "electronics" },
  // { title: "القهوة والمحامص", img: "/images/section/coffee.jpg", slug: "coffee" },
  // { title: "التمور والحلويات", img: "/images/section/dates.jpg", slug: "dates" },
  // { title: "المنزل والديكور", img: "/images/section/home.jpg", slug: "home" },
  // { title: "المستلزمات الرياضية", img: "/images/section/sports.jpg", slug: "sports" },
];


  return (
    <>
      <Hero />
      <main className="p-4 bg-backg max-w-7xl mx-auto">
        <div className="mt-12 mb-8 text-center">
          <h2 className="text-2xl md:text-4xl font-base text-slate-800">
            اختر <span className="text-blue-600">مجال متجرك</span> لرؤية
            البانرات المناسبة
          </h2>
        </div>

        {/* شبكة البطاقات (Categories Grid) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/categories/${cat.slug}`}
              className="relative group h-64 md:h-80 overflow-hidden rounded-2xl cursor-pointer shadow-lg block"
            >
              {/* الصورة الخلفية */}
              <img
                src={cat.img}
                alt={cat.title}
                className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-101"
              />

              {/* طبقة التظليل (Overlay) */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end p-6">
                <div>
                  <h3 className="text-white text-xl md:text-2xl font-bold mb-2">
                    {cat.title}
                  </h3>
                  <span className="inline-block bg-blue-600 text-white text-xs px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    عرض البانرات ←
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
