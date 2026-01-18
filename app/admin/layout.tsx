import Link from 'next/link'
import { cookies } from 'next/headers'
import { createClient } from '@supabase/supabase-js'
import { redirect } from 'next/navigation'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {

  //   const supabase = createClient(
  //   process.env.NEXT_PUBLIC_SUPABASE_URL!,
  //   process.env.SUPABASE_SERVICE_ROLE_KEY! // هذه فقط على السيرفر
  // )

  // const cookieStore = await cookies()
  // const token = cookieStore.get('sb-access-token')?.value

  // const { data: { user } } = await supabase.auth.getUser(token || '')

  // if (!user || user.email !== 'admin@example.com') {
  //   redirect('/') // غير مسموح، أرسل إلى الصفحة الرئيسية
  // }
  return (
    <div className="flex min-h-screen bg-white">
      
      {/* Sidebar */}
      <aside className="w-64 bg-white text-black p-6 flex flex-col gap-6">
        <h1 className="text-2xl font-bold">Admin Panel</h1>
        <nav className="flex flex-col gap-3 mt-6">
          <Link href="/admin/dashboard" className="text-xl hover:opacity-80">Dashboard</Link>
          <Link href="/admin/add-product" className="text-xl hover:opacity-80">Add Product</Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        {children}
      </main>

    </div>
  )
}
