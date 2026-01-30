import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const { productId } = await params;
    const token = req.nextUrl.searchParams.get("token");
    const sessionId = req.headers.get("x-session-id");

    console.log("🎁 Gift Request:", { productId, token, sessionId });

    if (!token || !sessionId) {
      return NextResponse.json(
        { error: "معلومات غير مكتملة" },
        { status: 400 }
      );
    }

    // التحقق من صلاحية الرابط من جدول orders
    const { data: orderData, error: orderError } = await supabase
      .from("orders")
      .select("*")
      .eq("delivery_token", token)
      .eq("browser_session_id", sessionId)
      .eq("payment_status", "completed")
      .maybeSingle();

    console.log("🔑 Order Check:", { 
      found: !!orderData, 
      error: orderError?.message 
    });

    if (orderError || !orderData) {
      return NextResponse.json({ error: "رابط غير صالح" }, { status: 403 });
    }

    // التحقق من انتهاء الصلاحية
    if (orderData.token_expires_at && new Date(orderData.token_expires_at) < new Date()) {
      return NextResponse.json({ error: "انتهت صلاحية الرابط" }, { status: 403 });
    }

    // التحقق من عدم استلام هدية سابقاً
    const { data: existingGift } = await supabase
      .from("claimed_gifts")
      .select("*")
      .eq("delivery_token", token)
      .eq("browser_session_id", sessionId)
      .maybeSingle();

    console.log("🎁 Gift Check:", { alreadyClaimed: !!existingGift });

    if (existingGift) {
      return NextResponse.json(
        { error: "لقد حصلت على هديتك بالفعل" },
        { status: 400 }
      );
    }

    // جلب الأكواد
    const { data: codes, error: codesError } = await supabase
      .from("codes")
      .select("type, code")
      .eq("product_id", productId)
      .in("type", ["html_css", "script_embed"]);

    console.log("📦 Codes:", { found: codes?.length || 0 });

    if (codesError || !codes || codes.length === 0) {
      return NextResponse.json(
        { error: "لم يتم العثور على أكواد المنتج" },
        { status: 404 }
      );
    }

    const htmlCode = codes.find((c) => c.type === "html_css")?.code;
    const scriptCode = codes.find((c) => c.type === "script_embed")?.code;

    // تسجيل استلام الهدية
    const { error: insertError } = await supabase
      .from("claimed_gifts")
      .insert({
        delivery_token: token,
        browser_session_id: sessionId,
        product_id: productId,
        order_id: orderData.id,
      });

    if (insertError) {
      console.error("⚠️ Insert error:", insertError.message);
    }

    console.log("✅ Gift claimed successfully");

    return NextResponse.json({
      html_code: htmlCode,
      script_code: scriptCode,
    });
  } catch (error: any) {
    console.error("💥 Gift API Error:", error);
    return NextResponse.json(
      { error: error.message || "حدث خطأ" },
      { status: 500 }
    );
  }
}