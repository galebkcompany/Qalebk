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
          variant_id,
          amount,
          currency
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

    console.log('✅ Order created successfully:', {
      order_id: order.id,
      variant_id: product.prices.variant_id
    });

    // إرجاع معلومات الطلب - variant_id بدلاً من price_id
    return NextResponse.json({
      order_id: order.id,
      delivery_token: order.delivery_token,
      variant_id: product.prices.variant_id, // ✅ هذا هو التغيير المهم
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