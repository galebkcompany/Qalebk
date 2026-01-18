import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// ملاحظة: إذا وضعت هذا الكود في app/api/webhooks/paddle/route.ts
// فإن الرابط في Paddle يجب أن يكون: https://your-ngrok-url.ngrok-free.dev/api/webhooks/paddle

export async function POST(request: NextRequest) {
  console.log("🚀 Webhook Received at:", new Date().toISOString());

  try {
    const body = await request.text();
    const signature = request.headers.get("paddle-signature");

    console.log("📝 Signature Header:", signature);
    
    // التحقق من التوقيع
    if (!verifyPaddleSignature(body, signature)) {
      console.error("❌ Invalid Paddle signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const event = JSON.parse(body);
    console.log("🔔 Event Type Received:", event.event_type);

    // معالجة حدث transaction.completed أو transaction.paid
    if (event.event_type === "transaction.completed" || event.event_type === "transaction.paid") {
      const data = event.data;
      const orderId = data.custom_data?.order_id;

      console.log("📊 Data Received:", {
        transaction_id: data.id,
        order_id: orderId,
        custom_data: data.custom_data
      });

      if (!orderId) {
        console.error("⚠️ order_id missing in custom_data. Check Frontend customData naming.");
        return NextResponse.json({ error: "Missing order_id" }, { status: 400 });
      }

      // تحديث Supabase
      const { error: updateError } = await supabase
        .from("orders")
        .update({
          payment_status: "completed",
          paddle_transaction_id: data.id,
          completed_at: new Date().toISOString(),
        })
        .eq("id", orderId);

      if (updateError) {
        console.error("❌ Supabase Update Error:", updateError);
        throw updateError;
      }

      console.log("✅ Order successfully updated to completed:", orderId);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("💥 Webhook Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// استبدل دالة verifyPaddleSignature بهذا الإصدار المحسن للتصحيح
function verifyPaddleSignature(body: string, signature: string | null): boolean {
  if (!signature) return false;
  try {
    const parts = signature.split(";");
    let ts = "", h1 = "";
    parts.forEach(p => {
      const [k, v] = p.split("=");
      if (k === "ts") ts = v;
      if (k === "h1") h1 = v;
    });

    const webhookSecret = process.env.PADDLE_WEBHOOK_SECRET!;
    // تسجيل للمساعدة في التصحيح (احذفه بعد الإصلاح)
    console.log("🔑 Using Secret:", webhookSecret.substring(0, 10) + "...");
    
    const signedPayload = `${ts}:${body}`;
    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(signedPayload)
      .digest("hex");

    console.log("🔍 Expected:", expectedSignature);
    console.log("🔍 Received:", h1);

    return crypto.timingSafeEqual(Buffer.from(h1), Buffer.from(expectedSignature));
  } catch (err) {
    console.error("❌ Signature Error:", err);
    return false;
  }
}

