
export function WebsiteJsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'قالبك',
    url: 'https://qalebk.com',
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

export function OrganizationJsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'قالبك',
    url: 'https://qalebk.com',
    logo: 'https://qalebk.com/logo.png',
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

export function ProductJsonLd({ product, slug, reviews = [] }: any) {
  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / reviews.length
      : 0;

  const jsonLd: any = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: [product.image_url],
    sku: product.id,
    brand: {
      "@type": "Organization", // أفضل من "Brand"
      name: "قالبك",
    },
    offers: {
      "@type": "Offer",
      url: `https://qalebk.com/product/${slug}`,
      priceCurrency: product.prices.currency,
      price: product.prices.amount.toString(),
      availability: "https://schema.org/InStock",
      priceValidUntil: "2026-12-31",
      seller: {
        "@type": "Organization",
        name: "قالبك"
      }
    },
  };

  // إضافة التقييمات فقط إذا كانت موجودة
  if (reviews.length > 0) {
    jsonLd.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: averageRating.toFixed(1),
      reviewCount: reviews.length,
      bestRating: "5",
      worstRating: "1"
    };

    jsonLd.review = reviews.slice(0, 5).map((r: any) => ({
      "@type": "Review",
      author: {
        "@type": "Person",
        name: "عميل"
      },
      reviewRating: {
        "@type": "Rating",
        ratingValue: r.rating.toString(),
        bestRating: "5",
        worstRating: "1"
      },
      reviewBody: r.review_text || "",
      datePublished: r.created_at
    }));
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
