// app/product/[slug]/page.tsx
import { supabaseServer } from "@/app/lib/supabaseServer";
import { notFound } from "next/navigation";
import ProductPageClient from "./ProductPageClient";

interface Product {
  id: string;
  name: string;
  description: string;
  image_url: string;
  preview_url: string | null;
  customizable_fields?: string | null;
  platforms: string[];
  installation_guide: string | null;
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
        installation_guide,
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

export default async function ProductPage({
  params,
}: {
  params: { slug: string } | Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const product = await getProduct(resolvedParams.slug);

  if (!product) notFound();

  return <ProductPageClient product={product} slug={resolvedParams.slug} />;
}
