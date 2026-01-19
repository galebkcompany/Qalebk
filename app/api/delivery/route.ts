import { supabase } from "@/app/lib/supabaseClient";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json({ error: "رمز التسليم مطلوب" }, { status: 400 });
    }

    const sessionId = request.headers.get("x-session-id");

    if (!sessionId) {
      return NextResponse.json({ error: "جلسة غير صالحة" }, { status: 401 });
    }

    // 1️⃣ جلب الطلب + المنتج
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select(`*, product:products(*)`)
      .eq("delivery_token", token)
      .eq("payment_status", "completed")
      .single();

    if (orderError || !order) {
      console.error("❌ Order not found or not paid. Token:", token);
      return NextResponse.json(
        { error: "الرابط غير صالح أو لم يتم الدفع" },
        { status: 404 }
      );
    }

    if (order.browser_session_id) {
      // الرابط فُتح سابقاً، يجب أن يتطابق الرمز
      if (order.browser_session_id !== sessionId) {
        return NextResponse.json(
          { error: "عذراً، هذا الرابط مقفل على الجهاز الذي فتحه أول مرة." },
          { status: 403 }
        );
      }
    } else {
      // هذه أول مرة يُفتح فيها الرابط، نقوم بربطه بهذا المتصفح
      await supabase
        .from("orders")
        .update({
          browser_session_id: sessionId,
          token_opened: true,
        })
        .eq("id", order.id);
    }

    // 2️⃣ تحقق من انتهاء الرابط مع إضافة Logs للتتبع
    if (order.token_expires_at) {
      const expiresAt = new Date(order.token_expires_at).getTime();
      const currentTime = new Date().getTime();
      const diffInMinutes = (expiresAt - currentTime) / 60000;



      if (expiresAt < currentTime) {
        console.warn("⚠️ الرابط منتهي الصلاحية فعلياً");
        return NextResponse.json(
          { error: "رابط التحميل منتهي الصلاحية" },
          { status: 410 }
        );
      }
    } else {
    }

    // 3️⃣ تحقق من عدد مرات الوصول
    if (order.access_count >= order.max_access_count) {
      console.warn(
        `⚠️ تجاوز الحد الأقصى للوصول: ${order.access_count}/${order.max_access_count}`
      );
      return NextResponse.json(
        { error: "تم تجاوز الحد الأقصى لعدد مرات الوصول" },
        { status: 403 }
      );
    }

    const { data: updatedOrder, error: updateError } = await supabase
      .from("orders")
      .update({
        token_opened: true,
        access_count: (order.access_count || 0) + 1,
      })
      .eq("id", order.id)
      .select() // هذه الإضافة مهمة لجلب البيانات بعد التحديث
      .single();

    if (updateError) {
      console.error("❌ فشل تحديث بيانات الوصول:", updateError);
    }

    // 5️⃣ جلب الأكواد حسب النوع
    const { data: codes, error: codesError } = await supabase
      .from("codes")
      .select("type, code")
      .eq("product_id", order.product.id);

    if (codesError || !codes || codes.length === 0) {
      return NextResponse.json(
        { error: "لم يتم العثور على كود المنتج" },
        { status: 404 }
      );
    }

    // 6️⃣ صنّف الأكواد حسب النوع
    const downloadCode = codes.find((c) => c.type === "html_css")?.code || "";
    const copyCode = codes.find((c) => c.type === "script_embed")?.code || "";

    // 7️⃣ إرجاع البيانات
    return NextResponse.json({
      product: {
        name: order.product.name,
        image_url: order.product.image_url,
        download_code: downloadCode,
        copy_code: copyCode,
        installation_guide: order.product.installation_guide,
      },
      purchase: {
        created_at: order.completed_at,
        amount: order.amount,
        currency: order.currency,
      },
      token: {
        expires_at: updatedOrder?.token_expires_at || order.token_expires_at, // نستخدم القيمة الجديدة
        accessed_count: updatedOrder?.access_count || order.access_count + 1,
      },
    });
  } catch (error: any) {
    console.error("Delivery API error:", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء جلب بيانات التسليم" },
      { status: 500 }
    );
  }
}
