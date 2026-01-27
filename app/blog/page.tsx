// app/blog/page.tsx

import Link from "next/link";
import Image from "next/image";
import { getAllArticles } from "./articlesData";
import { Metadata } from "next";
import Footer from "../components/Footer";

export const metadata: Metadata = {
  title: "المدونة",
  description: "اقرأ أحدث المقالات والنصائح في مدونتنا",
  openGraph: {
    title: "المدونة",
    description: "اقرأ أحدث المقالات والنصائح",
    type: "website",
  },
};

export default function BlogPage() {
  const articles = getAllArticles();

  return (
    <>
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="mb-8 text-center">
          <h1 className="text-5xl font-bold mb-4 text-gray-900">مدونتنا</h1>
          <p className="text-lg text-gray-600">
            اكتشف أحدث المقالات والنصائح .
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {articles.map((article) => (
            <article
              key={article.slug}
              className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              <Link href={`/blog/${article.slug}`}>
                <div className="relative w-full h-64">
                  {" "}
                  {/* تحديد حجم العنصر الأب */}
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="p-6">
                  <h2 className="text-2xl font-bold mb-2 hover:text-gray-700 transition-colors">
                    {article.title}
                  </h2>

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{article.author}</span>
                    <time dateTime={article.publishedDate}>
                      {new Date(article.publishedDate).toLocaleDateString(
                        "ar-SA",
                      )}
                    </time>
                  </div>

                  <span className="inline-block mt-4 text-blue-600 font-semibold">
                    اقرأ المزيد ←
                  </span>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
}
