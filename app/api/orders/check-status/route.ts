// app/api/orders/check-status/route.ts
import { supabase } from '@/app/lib/supabaseClient';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('order_id');
    const email = searchParams.get('email');

    if (!orderId || !email) {
      return NextResponse.json(
        { error: 'معرف الطلب والبريد الإلكتروني مطلوبان' },
        { status: 400 }
      );
    }

    // جلب حالة الطلب
    const { data: order, error } = await supabase
      .from('orders')
      .select('id, payment_status, delivery_token')
      .eq('id', orderId)
      .eq('email', email)
      .single();

    if (error || !order) {
      return NextResponse.json(
        { error: 'الطلب غير موجود' },
        { status: 404 }
      );
    }

    // إرجاع الحالة
    return NextResponse.json({
      order_id: order.id,
      payment_status: order.payment_status,
      delivery_token: order.delivery_token,
      is_completed: order.payment_status === 'completed',
    });

  } catch (error: any) {
    console.error('Error checking order status:', error);
    return NextResponse.json(
      { error: 'حدث خطأ في التحقق من الطلب' },
      { status: 500 }
    );
  }
}