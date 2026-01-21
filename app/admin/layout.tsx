// app/admin/layout.tsx

import Link from 'next/link';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { redirect } from 'next/navigation';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  const { data: { session } } = await supabase.auth.getSession();

  // التحقق من الجلسة والصلاحيات
  if (!session || session.user.email !== 'galebkcompany@gmail.com') {
    redirect('/');
  }

  return (
    <div className="flex min-h-screen bg-white">
      <aside className="w-64 bg-white text-black p-6 flex flex-col gap-6 border-r">
        <h1 className="text-2xl font-bold">Admin Panel</h1>
        <nav className="flex flex-col gap-3 mt-6">
          <Link href="/admin/dashboard" className="text-xl hover:opacity-80">
            Dashboard
          </Link>
          <Link href="/admin/add-product" className="text-xl hover:opacity-80">
            Add Product
          </Link>
        </nav>
      </aside>

      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
  );
}