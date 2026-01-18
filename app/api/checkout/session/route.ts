// app/api/checkout/session/route.ts
import { supabaseAdmin } from '@/app/lib/supabaseAdmin'; 
import { NextRequest, NextResponse } from 'next/server';



export async function POST(request: NextRequest) {
  try {
    const { email, product_id } = await request.json();

    // 1️⃣ التحقق من البيانات
    if (!email || !product_id) {
      return NextResponse.json(
        { error: 'بيانات غير مكتملة' },
        { status: 400 }
      );
    }

    // التحقق من صحة البريد الإلكتروني
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'بريد إلكتروني غير صحيح' },
        { status: 400 }
      );
    }

    // 2️⃣ جلب المنتج والسعر من Supabase
    const { data: product, error: productError } = await supabaseAdmin
      .from('products')
      .select(`
        *,
        prices!inner (
          price_id,
          amount,
          currency,
          price_label
        )
      `)
      .eq('id', product_id)
      .single();

    if (productError || !product) {
      console.error('Product fetch error:', productError);
      return NextResponse.json(
        { error: 'المنتج غير موجود' },
        { status: 404 }
      );
    }

    // 3️⃣ إنشاء جلسة checkout مؤقتة في قاعدة البيانات
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 دقيقة
    
    const { data: session, error: sessionError } = await supabaseAdmin
      .from('checkout_sessions')
      .insert([{
        email,
        product_id,
        delivery_type: 'code_full', // دائماً code_full
        price_id: product.prices.price_id,
        status: 'pending',
        expires_at: expiresAt.toISOString(),
      }])
      .select()
      .single();

    if (sessionError) {
      console.error('Session creation error:', sessionError);
      return NextResponse.json(
        { error: 'فشل في إنشاء جلسة الدفع', details: sessionError.message },
        { status: 500 }
      );
    }

    // 4️⃣ إنشاء Paddle Transaction
    const paddleTransaction = await createPaddleTransaction({
      email,
      product,
      session_id: session.id,
    });

    // 5️⃣ تحديث الجلسة بـ paddle_checkout_id
    await supabaseAdmin
      .from('checkout_sessions')
      .update({ paddle_checkout_id: paddleTransaction.id })
      .eq('id', session.id);

    // 6️⃣ إرجاع بيانات Paddle للـ Inline Checkout
    return NextResponse.json({
      session_id: session.id,
      paddle_transaction_id: paddleTransaction.id,
      client_token: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN,
      expires_at: expiresAt.toISOString(),
    });

  } catch (error: any) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'حدث خطأ في إنشاء جلسة الدفع', details: error.message },
      { status: 500 }
    );
  }
}

// ═══════════════════════════════════════════════════════════════
// دالة إنشاء Paddle Transaction
// ═══════════════════════════════════════════════════════════════

interface PaddleTransactionData {
  email: string;
  product: any;
  session_id: string;
}

async function createPaddleTransaction(data: PaddleTransactionData) {
  const paddleApiUrl = process.env.NEXT_PUBLIC_PADDLE_ENVIRONMENT === 'production'
    ? 'https://api.paddle.com'
    : 'https://sandbox-api.paddle.com';

  const response = await fetch(`${paddleApiUrl}/transactions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.PADDLE_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      items: [
        {
          price_id: data.product.prices.price_id,
          quantity: 1,
        },
      ],
      customer_email: data.email,
      custom_data: {
        product_id: data.product.id,
        session_id: data.session_id,
        delivery_type: 'code_full',
      },
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Paddle API Error: ${JSON.stringify(error)}`);
  }

  const transaction = await response.json();
  return transaction.data;
}

// ═══════════════════════════════════════════════════════════════
// Endpoint لتحديث الجلسات المنتهية (Cron Job)
// ═══════════════════════════════════════════════════════════════

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const expectedToken = process.env.CRON_SECRET;
    
    if (!expectedToken || authHeader !== `Bearer ${expectedToken}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from('checkout_sessions')
      .update({ status: 'expired' })
      .eq('status', 'pending')
      .lt('expires_at', new Date().toISOString())
      .select();

    if (error) throw error;

    return NextResponse.json({
      message: 'Sessions updated',
      updated_count: data?.length || 0,
    });
  } catch (error: any) {
    console.error('Error updating expired sessions:', error);
    return NextResponse.json(
      { error: 'Failed to update sessions' },
      { status: 500 }
    );
  }
}