// app/api/admin/users-count/route.ts
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // إنشاء Supabase client مع Service Role Key
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!, // المفتاح السري
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // جلب عدد المستخدمين
    const { data: { users }, error } = await supabaseAdmin.auth.admin.listUsers()

    if (error) {
      console.error('Error listing users:', error)
      return NextResponse.json({ count: 0, error: error.message }, { status: 500 })
    }

    return NextResponse.json({ count: users?.length || 0 })
  } catch (error: any) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ count: 0, error: error.message }, { status: 500 })
  }
}