
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

export function ProductJsonLd({ product, slug }: any) {
  const jsonLd: any = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: [product.image_url],
    sku: product.id,
    brand: {
      '@type': 'Brand',
      name: 'قالبك',
    },
    offers: {
      '@type': 'Offer',
      url: `https://qalebk.com/product/${slug}`,
      priceCurrency: product.prices.currency,
      price: product.prices.amount.toString(),
      availability: 'https://schema.org/InStock',
      priceValidUntil: '2026-12-31',
      
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
