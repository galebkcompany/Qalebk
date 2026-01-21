// app/admin/dashboard/page.tsx

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import Card from '../components/Card'

export const dynamic = 'force-dynamic'


async function getStats() {
  try {
    const cookieStore = await cookies()
    
    // إنشاء Supabase Admin Client مع Service Role Key
    const supabaseAdmin = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!, // استخدام Service Role مباشرة
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
        },
      }
    )

    // 1. عدد المنتجات
    const { count: productsCount, error: productsError } = await supabaseAdmin
      .from('products')
      .select('*', { count: 'exact', head: true })

    if (productsError) {
      console.error('Error fetching products:', productsError)
    }

    // 2. عدد المستخدمين المسجلين
    let usersCount = 0
    try {
      const { data: { users }, error: usersError } = await supabaseAdmin.auth.admin.listUsers()
      
      if (usersError) {
        console.error('Error fetching users:', usersError)
      } else {
        usersCount = users?.length || 0
      }
    } catch (error) {
      console.error('Error listing users:', error)
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
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">لوحة التحكم</h1>
      
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