// ==============================
// 1️⃣ إنشاء API Endpoint جديد
// ==============================
// app/api/checkout/create-session/route.ts

import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { email, product_name, variant_id, order_id } = await request.json();

    const apiKey = process.env.LEMONSQUEEZY_API_KEY;
    const storeId = process.env.NEXT_PUBLIC_LEMONSQUEEZY_STORE_ID;

    if (!apiKey || !storeId) {
      throw new Error("Missing LemonSqueezy credentials");
    }

    // إنشاء checkout session عبر API
    const response = await fetch("https://api.lemonsqueezy.com/v1/checkouts", {
      method: "POST",
      headers: {
        "Accept": "application/vnd.api+json",
        "Content-Type": "application/vnd.api+json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        data: {
          type: "checkouts",
          attributes: {
            checkout_data: {
              email: email,
              name: product_name,
              custom: {
                order_id: order_id,
              },
            },
          },
          relationships: {
            store: {
              data: {
                type: "stores",
                id: storeId,
              },
            },
            variant: {
              data: {
                type: "variants",
                id: variant_id,
              },
            },
          },
        },
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("LemonSqueezy API Error:", error);
      throw new Error("Failed to create checkout");
    }

    const data = await response.json();
    const checkoutUrl = data.data.attributes.url;

    return NextResponse.json({ checkout_url: checkoutUrl });
  } catch (error: any) {
    console.error("Checkout creation error:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}


