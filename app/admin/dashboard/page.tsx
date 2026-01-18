// app/admin/dashboard/page.tsx
import { supabase } from '@/app/lib/supabaseClient'
import Card from '../components/Card'

async function getStats() {
  try {
    // 1. عدد المنتجات
    const { count: productsCount, error: productsError } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })

    if (productsError) throw productsError

    // 2. عدد المستخدمين المسجلين - نستخدم API route
    let usersCount = 0
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/admin/users-count`)
      if (response.ok) {
        const data = await response.json()
        usersCount = data.count || 0
      }
    } catch (error) {
      console.error('Error fetching users count:', error)
    }

    return {
      productsCount: productsCount || 0,
      usersCount: usersCount,
      cartCount: 0, // سيتم تحديثه لاحقاً
      salesCount: 0, // سيتم تحديثه لاحقاً
    }
  } catch (error) {
    console.error('Error fetching stats:', error)
    return {
      productsCount: 0,
      usersCount: 0,
      cartCount: 0,
      salesCount: 0,
    }
  }
}

export default async function Dashboard() {
  const stats = await getStats()

  const cards = [
    { title: 'عدد المبيعات', value: stats.salesCount, upcoming: true },
    { title: 'عدد المنتجات في السلة', value: stats.cartCount, upcoming: true },
    { title: 'عدد العملاء المسجلين', value: stats.usersCount },
    { title: 'إجمالي المنتجات', value: stats.productsCount },
  ]

  return (
    <div className="space-y-6 ">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, i) => (
          <div key={i} className="relative">
            <Card title={card.title} value={card.value} />
            {card.upcoming && (
              <div className="absolute top-2 right-2 bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                قريباً
              </div>
            )}
          </div>
        ))}
      </div>

    </div>
  )
}