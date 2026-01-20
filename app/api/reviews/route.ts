// app/api/reviews/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { rating, review_text, token, session_id } = body;

    // 1️⃣ تحقق أساسي
    if (!token || !session_id || !rating) {
      return NextResponse.json(
        { error: "بيانات غير مكتملة" },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "التقييم يجب أن يكون بين 1 و 5" },
        { status: 400 }
      );
    }

    // 2️⃣ جلب الطلب من التوكن
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("id, product_id, browser_session_id, payment_status")
      .eq("delivery_token", token)
      .eq("payment_status", "completed")
      .single();

    if (orderError || !order) {
      return NextResponse.json(
        { error: "طلب غير صالح" },
        { status: 404 }
      );
    }

    // 3️⃣ تحقق من الجلسة
    if (order.browser_session_id !== session_id) {
      return NextResponse.json(
        { error: "غير مصرح لك بتقييم هذا الطلب" },
        { status: 403 }
      );
    }

    // 4️⃣ إدخال التقييم (الحماية الحقيقية هنا)
    const { error: insertError } = await supabase
      .from("reviews")
      .insert({
        order_id: order.id,
        product_id: order.product_id,
        rating,
        review_text: review_text || null,
        token,
        session_id,
      });

    if (insertError) {
      // 23505 = unique constraint violation
      if (insertError.code === "23505") {
        return NextResponse.json(
          { error: "لقد قمت بتقييم هذا الطلب مسبقًا" },
          { status: 409 }
        );
      }

      console.error("Review insert error:", insertError);
      return NextResponse.json(
        { error: "فشل حفظ التقييم" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Review API error:", error);
    return NextResponse.json(
      { error: "خطأ في الخادم" },
      { status: 500 }
    );
  }
}
