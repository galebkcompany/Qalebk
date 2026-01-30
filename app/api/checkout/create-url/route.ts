// app/api/checkout/create-url/route.ts
import { NextResponse } from "next/server";

const LEMONSQUEEZY_API_KEY = process.env.LEMONSQUEEZY_API_KEY;

export async function POST(request: Request) {
  try {
    const { variant_id, email, order_id } = await request.json();
    const STORE_ID = process.env.NEXT_PUBLIC_LEMONSQUEEZY_STORE_ID || process.env.LEMONSQUEEZY_STORE_ID;

    if (!LEMONSQUEEZY_API_KEY || !STORE_ID) {
      return NextResponse.json({ error: "Missing API Configuration" }, { status: 500 });
    }

    const response = await fetch("https://api.lemonsqueezy.com/v1/checkouts", {
      method: "POST",
      headers: {
        "Accept": "application/vnd.api+json",
        "Content-Type": "application/vnd.api+json",
        "Authorization": `Bearer ${LEMONSQUEEZY_API_KEY}`,
      },
      body: JSON.stringify({
        data: {
          type: "checkouts",
          attributes: {
            checkout_data: {
              email: email,
              // ✅ الطريقة الصحيحة لإرسال البيانات المخصصة لكي تظهر في الـ Webhook
              custom: {
                order_id: String(order_id),
              },
            },
            // ✅ تفعيل إعادة التوجيه التلقائي بعد الدفع (اختياري هنا، والأفضل ضبطه في لوحة التحكم)
            checkout_options: {
              embed: true,          // ✅ تفعيل وضع الـ Overlay
              media: true,          // ✅ عرض صورة المنتج
              logo: true,           // ✅ عرض شعار المتجر
              dark: false,          // ⚙️ اختياري: الوضع الليلي (false = فاتح)
              button_color: "#000000", // ⚙️ اختياري: لون زر الدفع
            }
          },
          relationships: {
            store: {
              data: { type: "stores", id: String(STORE_ID) },
            },
            variant: {
              data: { type: "variants", id: String(variant_id) },
            },
          },
        },
      }),
    });

    const responseData = await response.json();

    if (!response.ok) {
      console.error("❌ LemonSqueezy API Error:", responseData);
      return NextResponse.json({ error: "فشل إنشاء رابط الدفع" }, { status: response.status });
    }

    return NextResponse.json({ checkout_url: responseData.data.attributes.url });
  } catch (error: any) {
    console.error("❌ Server Error:", error);
    return NextResponse.json({ error: "حدث خطأ داخلي" }, { status: 500 });
  }
}
