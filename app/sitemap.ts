import { MetadataRoute } from 'next'
import { supabaseServer } from "@/app/lib/supabaseServer"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://qalebk.com'
  
  // جلب جميع المنتجات
  const { data: products } = await supabaseServer
    .from("products")
    .select("slug, created_at")
  
  const productUrls = products?.map((product) => ({
    url: `${baseUrl}/product/${product.slug}`,
    lastModified: new Date(product.created_at),
    changeFrequency: 'daily' as const,
    priority: 0.8,
  })) || []

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/categories/sections`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy`, 
      lastModified: new Date(),
      priority: 0.5,
    },
    {
      url: `${baseUrl}/refund`, 
      lastModified: new Date(),
      priority: 0.5,
    },
    ...productUrls,
  ]
}