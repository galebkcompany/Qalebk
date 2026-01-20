// app/api/products/[id]/route.ts
import { supabase } from '@/app/lib/supabaseClient';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // ✅ حل المشكلة: await params
    const { id } = await context.params;

    const { data: product, error } = await supabase
      .from('products')
      .select(`
        id,
        name,
        description,
        image_url,
        platforms,
        is_featured,
        customizable_fields,
        installation_guide,
        prices!inner (
          amount,
          currency,
          price_label,
          variant_id
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'المنتج غير موجود', details: error.message },
        { status: 404 }
      );
    }

    if (!product) {
      return NextResponse.json(
        { error: 'المنتج غير موجود' },
        { status: 404 }
      );
    }

    return NextResponse.json(product);
  } catch (error: any) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'حدث خطأ في جلب المنتج', details: error.message },
      { status: 500 }
    );
  }
}