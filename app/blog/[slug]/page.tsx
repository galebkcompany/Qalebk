// app/blog/[slug]/page.tsx

import { getArticleBySlug, getAllArticles } from "../articlesData";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Footer from "@/app/components/Footer";
import "../blog-content.css";

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

// توليد المسارات الثابتة
export async function generateStaticParams() {
  const articles = getAllArticles();

  return articles.map((article) => ({
    slug: article.slug,
  }));
}

// Metadata - مع await
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params; // ✅ استخدم await هنا
  const article = getArticleBySlug(slug);

  if (!article) {
    return {
      title: "المقالة غير موجودة",
    };
  }

  return {
    title: `${article.title}`,
    description: article.description,
    keywords: article.keywords,
    authors: [{ name: article.author }],
    openGraph: {
      title: article.title,
      description: article.description,
      type: "article",
      publishedTime: article.publishedDate,
      authors: [article.author],
      images: [
        {
          url: article.image,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.description,
      images: [article.image],
    },
    alternates: {
      canonical: `https://qalebk.com/blog/${slug}`,
    },
  };
}

// المكون الرئيسي - مع await
export default async function BlogPost({ params }: Props) {
  const { slug } = await params; // ✅ استخدم await هنا
  const article = getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    description: article.description,
    image: [`https://qalebk.com${article.image}`],
    // رابط المقال نفسه
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://qalebk.com/blog/${article.slug}`,
    },
    // الكاتب
    author: {
      "@type": "Organization",
      name: "قالبك",
      url: "https://qalebk.com",
    },

      // الناشر
  publisher: {
    "@type": "Organization",
    name: "قالبك",
    url: "https://qalebk.com",
    logo: {
      "@type": "ImageObject",
      url: "https://qalebk.com/images/logo/logo.png",
      width: 512,
      height: 512,
    },
  },

    datePublished: article.publishedDate,
    dateModified: article.publishedDate,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="max-w-4xl mx-auto px-4 py-12">
        <header className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
            {article.title}
          </h1>

          <div className="flex items-center gap-4 text-gray-600 mb-6">
            <span>بواسطة {article.author}</span>
            <span>•</span>
            <time dateTime={article.publishedDate}>
              {new Date(article.publishedDate).toLocaleDateString("ar-SA", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
          </div>

          {article.image && (
            <div className="relative w-full h-96 mb-8 rounded-lg overflow-hidden">
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </header>

        <div
          dir="rtl"
          className="blog-content"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />
      </article>

      <Footer />
    </>
  );
}
