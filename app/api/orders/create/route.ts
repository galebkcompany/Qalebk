// app/api/orders/create/route.ts
import { supabase } from '@/app/lib/supabaseClient';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email, product_id } = await request.json();

    // التحقق من البيانات
    if (!email || !product_id) {
      return NextResponse.json(
        { error: 'البريد الإلكتروني ومعرف المنتج مطلوبان' },
        { status: 400 }
      );
    }

    // جلب المنتج والسعر
    const { data: product, error: productError } = await supabase
      .from('products')
      .select(`
        *,
        prices!inner (
          price_id,
          amount,
          currency
        )
      `)
      .eq('id', product_id)
      .single();

    if (productError || !product) {
      return NextResponse.json(
        { error: 'المنتج غير موجود' },
        { status: 404 }
      );
    }

    // إنشاء طلب جديد
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([{
        email,
        product_id,
        amount: product.prices.amount,
        currency: product.prices.currency,
        payment_status: 'pending',
      }])
      .select()
      .single();

    if (orderError) {
      console.error('Order creation error:', orderError);
      return NextResponse.json(
        { error: 'فشل في إنشاء الطلب' },
        { status: 500 }
      );
    }

    // إرجاع معلومات الطلب
    return NextResponse.json({
      order_id: order.id,
      delivery_token: order.delivery_token,
      price_id: product.prices.price_id,
      amount: product.prices.amount,
      currency: product.prices.currency,
    });

  } catch (error: any) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'حدث خطأ في إنشاء الطلب' },
      { status: 500 }
    );
  }
}