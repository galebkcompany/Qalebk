// app/auth/callback/route.ts

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const error = requestUrl.searchParams.get('error');
  const error_description = requestUrl.searchParams.get('error_description');

  // التحقق من وجود خطأ من Supabase
  if (error) {
    console.error('خطأ في المصادقة:', error, error_description);
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent(error_description || error)}`, requestUrl.origin)
    );
  }

  if (code) {
    try {
      const cookieStore = await cookies();
      
      const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            get(name: string) {
              return cookieStore.get(name)?.value;
            },
            set(name: string, value: string, options: any) {
              cookieStore.set({ name, value, ...options });
            },
            remove(name: string, options: any) {
              cookieStore.set({ name, value: '', ...options });
            },
          },
        }
      );
      
      // تبديل الكود بالجلسة
      const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
      
      if (exchangeError) {
        console.error('خطأ في تبديل الكود:', exchangeError);
        return NextResponse.redirect(
          new URL('/login?error=auth_failed', requestUrl.origin)
        );
      }

      // التحقق من البريد الإلكتروني للأدمن
      if (data.user?.email === 'galebkcompany@gmail.com') {
        return NextResponse.redirect(new URL('/admin/dashboard', requestUrl.origin));
      }

      // مستخدم عادي
      return NextResponse.redirect(new URL('/', requestUrl.origin));
      
    } catch (err) {
      console.error('خطأ غير متوقع:', err);
      return NextResponse.redirect(
        new URL('/login?error=unexpected', requestUrl.origin)
      );
    }
  }

  return NextResponse.redirect(new URL('/', requestUrl.origin));
}