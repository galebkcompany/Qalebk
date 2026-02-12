// app/product/[slug]/page.tsx
import { Metadata } from 'next'
import { supabaseServer } from "@/app/lib/supabaseServer";
import { notFound } from "next/navigation";
import ProductPageClient from "./ProductPageClient";
import { ProductJsonLd } from '@/app/components/JsonLd'

interface Product {
  id: string;
  name: string;
  description: string;
  image_url: string;
  preview_url: string | null;
  customizable_fields?: string | null;
  platforms: string[];
  category_images: any;
  // installation_guide: string | null;
  is_featured: boolean;
  prices: {
    amount: number;
    currency: string;
    price_label: string;
  };
}

async function getProduct(slug: string): Promise<Product | null> {
  try {
    const { data: product, error } = await supabaseServer
      .from("products")
      .select(
        `
        id,
        name,
        description,
        image_url,
        preview_url,
        customizable_fields,
        platforms,
        category_images,
        is_featured,
        prices (
          amount,
          currency,
          price_label
        )
      `
      )
      .eq("slug", slug)
      .single();

    if (error) {
      console.error("Database error:", error);
      return null;
    }

    if (!product) return null;

    return {
      ...product,
      prices: Array.isArray(product.prices)
        ? product.prices[0]
        : product.prices,
    };
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

// 👇 إضافة generateMetadata للـ SEO
type Props = {
  params: { slug: string } | Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const product = await getProduct(resolvedParams.slug);

  if (!product) {
    return {
      title: 'المنتج غير موجود',
      description: 'لم يتم العثور على المنتج المطلوب'
    }
  }

  // اختصار الوصف لـ 160 حرف (مهم للـ SEO)
  const shortDescription = product.description?.substring(0, 160) || `اشتري ${product.name} بأفضل سعر`;

  return {
    title: product.name,
    description: shortDescription,
    
    // Open Graph (فيسبوك، واتساب، تيليجرام)
    // openGraph: {
    //   title: product.name,
    //   description: shortDescription,
    //   type: 'product',
    //   url: `https://qalebk.com/product/${resolvedParams.slug}`,
    //   images: [
    //     {
    //       url: product.image_url,
    //       width: 1200,
    //       height: 630,
    //       alt: product.name,
    //     }
    //   ],
    //   siteName: 'قالبك',
    // },
    
    // Twitter Card
    twitter: {
      card: 'summary_large_image',
      title: product.name,
      description: shortDescription,
      images: [product.image_url],
    },
    
    // Canonical URL (مهم لتجنب المحتوى المكرر)
    alternates: {
      canonical: `https://qalebk.com/product/${resolvedParams.slug}`,
    },
    
    // معلومات إضافية للمنتج
    other: {
      'product:price:amount': product.prices.amount.toString(),
      'product:price:currency': product.prices.currency,
    },
  }
}

export default async function ProductPage({ params }: Props) {
  const resolvedParams = await params;
  const product = await getProduct(resolvedParams.slug);

  if (!product) notFound();

  return (
    <>
      {/* 👇 إضافة JSON-LD Schema للمنتج */}
      <ProductJsonLd product={product} />
      
      <ProductPageClient product={product} slug={resolvedParams.slug} />
    </>
  );
}