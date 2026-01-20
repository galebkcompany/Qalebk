// app/api/webhooks/lemonsqueezy/route.ts

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  console.log("🚀 LemonSqueezy Webhook Received at:", new Date().toISOString());

  try {
    const body = await request.text();
    const signature = request.headers.get("x-signature");

    if (!verifyLemonSqueezySignature(body, signature)) {
      console.error("❌ Invalid LemonSqueezy signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const event = JSON.parse(body);
    const eventName = event.meta?.event_name;
    
    console.log("🔔 Event Type:", eventName);

    if (eventName === "order_created") {
      const data = event.data;
      // ✅ التعديل الجوهري: Lemon Squeezy يرسل البيانات المخصصة في meta.custom_data
      const orderId = event.meta?.custom_data?.order_id;
      const lemonSqueezyOrderId = data.id;

      console.log("📊 Webhook Data Processing:");
      console.log("- LemonSqueezy Order ID:", lemonSqueezyOrderId);
      console.log("- Local Order ID (from custom_data):", orderId);
      console.log("- Status:", data.attributes?.status);

      if (!orderId) {
        console.error("⚠️ order_id missing in event.meta.custom_data");
        // سنحاول البحث عنه في مكان آخر كاحتياط
        const backupOrderId = data.attributes?.custom_data?.order_id;
        if (!backupOrderId) {
            return NextResponse.json({ error: "Missing order_id" }, { status: 400 });
        }
      }

      const finalOrderId = orderId || event.data.attributes?.custom_data?.order_id;

      // تحديث الطلب في قاعدة البيانات
      const { error: updateError } = await supabase
        .from("orders")
        .update({
          payment_status: "completed",
          lemonsqueezy_order_id: lemonSqueezyOrderId,
          completed_at: new Date().toISOString(),
        })
        .eq("id", finalOrderId);

      if (updateError) {
        console.error("❌ Supabase Update Error:", updateError);
        throw updateError;
      }

      console.log("✅ Order completed successfully in Database:", finalOrderId);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("💥 Webhook Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

function verifyLemonSqueezySignature(body: string, signature: string | null): boolean {
  if (!signature) return false;

  try {
    const webhookSecret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET!;
    const hmac = crypto.createHmac("sha256", webhookSecret);
    const digest = hmac.update(body).digest("hex");

    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest));
  } catch (err) {
    console.error("❌ Signature Verification Error:", err);
    return false;
  }
}
