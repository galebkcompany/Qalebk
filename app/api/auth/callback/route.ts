// app/api/auth/callback/route.ts (أو app/auth/callback/route.ts)

import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
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
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );
      
      const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
      
      if (exchangeError) {
        console.error('خطأ في تبديل الكود:', exchangeError);
        return NextResponse.redirect(
          new URL('/login?error=auth_failed', requestUrl.origin)
        );
      }

      // نجح التسجيل - إعادة التوجيه للصفحة الرئيسية
      return NextResponse.redirect(new URL('/', requestUrl.origin));
      
    } catch (err) {
      console.error('خطأ غير متوقع:', err);
      return NextResponse.redirect(
        new URL('/login?error=unexpected', requestUrl.origin)
      );
    }
  }

  // لا يوجد code - إعادة توجيه للصفحة الرئيسية
  return NextResponse.redirect(new URL('/', requestUrl.origin));
}