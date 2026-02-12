"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ShoppingBag, Mail, Code, Check, AlertCircle } from "lucide-react";
import { Lock } from "lucide-react";
import Script from "next/script";

declare global {
  interface Window {
    createLemonSqueezy?: () => void;
    LemonSqueezy?: {
      Setup?: (config: {
        eventHandler: (event: LemonSqueezyEvent) => void;
      }) => void;
      Url: {
        Open: (url: string) => void;
        Close: () => void;
      };
    };
  }
}

type LemonSqueezyEvent = {
  event: string;
  data?: any;
};

type Product = {
  id: string;
  name: string;
  image_url: string;
  platforms: string[];
  is_featured: boolean;
  prices: {
    amount: number;
    currency: string;
    price_label: string;
  };
};

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = searchParams.get("product");

  const [product, setProduct] = useState<Product | null>(null);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [lsLoaded, setLsLoaded] = useState(false);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const pollingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const imageFromQuery = searchParams.get("img");
  const displayImage = imageFromQuery || product?.image_url || "";

  // ✅ Cleanup عند unmount المكون
  useEffect(() => {
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
      if (pollingTimeoutRef.current) {
        clearTimeout(pollingTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (submitting) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [submitting]);

  const originalPrice = product?.prices.amount ? product.prices.amount * 2 : 0;
  const discount = 50;
  const finalPrice = product?.prices.amount || 0;

  useEffect(() => {
    if (!productId) {
      router.push("/");
      return;
    }

    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${productId}`);
        if (!response.ok) throw new Error("المنتج غير موجود");
        const data = await response.json();
        setProduct(data);
      } catch (err) {
        setError("حدث خطأ في تحميل المنتج");
        setTimeout(() => router.push("/"), 3000);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId, router]);

  const handleScriptLoad = useCallback(() => {
    console.log("🔵 Script loaded");

    if (window.createLemonSqueezy) {
      window.createLemonSqueezy();

      if (window.LemonSqueezy?.Setup) {
        window.LemonSqueezy.Setup({
          eventHandler: (event) => {
            console.log("🟣 LemonSqueezy Event:", event.event);

            if (event.event === "Checkout.Success") {
              console.log("✅ Payment successful!", event.data);

              // إغلاق الـ overlay
              if (window.LemonSqueezy?.Url?.Close) {
                window.LemonSqueezy.Url.Close();
              }

              // ✅ الزر يبقى في حالة تحميل - الـ polling سيتولى الباقي
            }
          },
        });
      }
    }
  }, []);

  const handleSubmit = async () => {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("يرجى إدخال بريد إلكتروني صحيح");
      return;
    }

    setError("");
    setSubmitting(true);

    try {
      const orderRes = await fetch("/api/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, product_id: productId }),
      });

      if (!orderRes.ok) throw new Error("فشل إنشاء الطلب");
      const { order_id, delivery_token, variant_id } = await orderRes.json();

      const checkoutRes = await fetch("/api/checkout/create-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ variant_id, email, order_id }),
      });

      if (!checkoutRes.ok) throw new Error("فشل الحصول على رابط الدفع");
      const { checkout_url } = await checkoutRes.json();

      if (window.LemonSqueezy) {
        window.LemonSqueezy.Url.Open(checkout_url);

        // ✅ مراقبة عودة التركيز للصفحة (عند إغلاق الـ overlay)
        const handleFocus = () => {
          console.log("🔵 User returned to page");

          // ✅ انتظر قليلاً ثم تحقق من حالة الدفع
          setTimeout(async () => {
            try {
              const response = await fetch(
                `/api/orders/check-status?order_id=${order_id}&email=${email}`,
              );

              if (response.ok) {
                const data = await response.json();

                // ✅ إذا لم يكتمل الدفع، أرجع الزر
                if (!data.is_completed) {
                  console.log("⚠️ Payment not completed - resetting button");
                  setSubmitting(false);
                }
              }
            } catch (error) {
              console.error("Check status error:", error);
            }
          }, 100);

          // ✅ إزالة المستمع بعد أول استخدام
          window.removeEventListener("focus", handleFocus);
        };

        window.addEventListener("focus", handleFocus);
      } else {
        window.open(checkout_url, "_blank");
      }

      // بدء الـ Polling
      startPolling(order_id, email, delivery_token);
    } catch (err: any) {
      setError(err.message);
      setSubmitting(false);
    }
  };

  const startPolling = (
    orderId: string,
    email: string,
    deliveryToken: string,
  ) => {
    setSubmitting(true);

    const checkStatus = async () => {
      try {
        const response = await fetch(
          `/api/orders/check-status?order_id=${orderId}&email=${email}`,
        );

        if (!response.ok) return false;

        const data = await response.json();

        if (data.is_completed) {
          console.log("✅ Payment completed! Redirecting...");

          // ✅ تنظيف الـ timers قبل التوجيه
          if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current);
          }
          if (pollingTimeoutRef.current) {
            clearTimeout(pollingTimeoutRef.current);
          }

          window.location.href = `/delivery?token=${deliveryToken}`;
          return true;
        }
        return false;
      } catch (error) {
        console.error("Polling error:", error);
        return false;
      }
    };

    // ✅ حفظ الـ interval في ref
    pollingIntervalRef.current = setInterval(async () => {
      const completed = await checkStatus();
      if (completed && pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    }, 3000);

    // ✅ حفظ الـ timeout في ref
    pollingTimeoutRef.current = setTimeout(
      () => {
        if (pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current);
        }
        setSubmitting(false);
        setError("انتهت مهلة الدفع. يرجى المحاولة مرة أخرى");
      },
      10 * 60 * 1000,
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600">المنتج غير موجود</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Script
        src="https://app.lemonsqueezy.com/js/lemon.js"
        onLoad={handleScriptLoad}
        strategy="afterInteractive"
      />

      <div className="min-h-screen bg-white py-8 px-4" dir="rtl">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 flex mb-2 items-center justify-center gap-2">
              <ShoppingBag className="w-5 h-5" />
              ملخص الطلب
            </h1>
            <p className="text-gray-600">
              خطوة واحدة تفصلك عن الحصول على قسمك الجديد
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
            {/* القسم الأيمن */}
            <div className="space-y-6">
              {/* بطاقة المنتج */}
              <div className="bg-white rounded-2xl p-6 border border-gray-200">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  القسم
                </h2>

                <div className="flex gap-4">
                  <div className="relative w-54 h-32 flex-shrink-0">
                    {product.is_featured && (
                      <div className="absolute top-1 right-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs px-2 py-0.5 rounded-full z-10">
                        مميز ★
                      </div>
                    )}
                    {displayImage.endsWith(".mp4") ? (
                      <video
                        src={displayImage}
                        muted
                        loop
                        autoPlay
                        playsInline
                        preload="metadata"
                        className="w-70 rounded-xl overflow-hidden bg-gray-100 object-cover"
                      />
                    ) : (
                      <img
                        src={displayImage}
                        alt={product.name}
                        className="w-100 rounded-xl overflow-hidden bg-gray-100 object-cover"
                      />
                    )}
                  </div>

                  <div className="flex-1">
                    <h3 className="text-base text-gray-600 mt-1 line-clamp-2">
                      {product.name}
                    </h3>
                    {product.platforms.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {product.platforms.slice(0, 100).map((platform) => (
                          <span
                            key={platform}
                            className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-700"
                          >
                            {platform}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="text-base text-green-600 justify-left flex mt-2 ">
                      + قسم إضافي مجاني
                    </div>
                  </div>
                </div>
              </div>

              {/* نموذج البريد الإلكتروني */}
              <div className="bg-white rounded-2xl p-6 border border-gray-200 space-y-6">
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-800">{error}</p>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    البريد الإلكتروني
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 focus:border-gray-500 focus:outline-none transition-colors"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    سيتم إرسال الفاتورة إلى هذا البريد
                  </p>
                </div>

                {/* طريقة الاستلام */}
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-3">
                    الاستلام
                  </label>

                  <div className="p-4 rounded-xl border border-gray-300 bg-white">
                    <div className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full border-2 border-purple-500 bg-purple-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-white" />
                      </div>

                      <div className="flex-1 text-right">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <Code className="w-5 h-5 text-purple-600" />
                            <span className="font-bold text-gray-900">
                              تنزيل الكود الكامل
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600">
                          يمكنك تنزيل القسم الكامل فور إتمام الدفع.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* القسم الأيسر - ملخص السعر */}
            <div className="lg:sticky lg:top-8 h-fit">
              <div className="bg-white rounded-2xl p-4 space-y-4">
                <h3 className="font-bold text-lg text-gray-900 border-b border-gray-100 pb-3">
                  ملخص السعر
                </h3>

                <div className="space-y-3">
                  <div className="flex justify-between text-gray-700">
                    <span>سعر المنتج</span>
                    <span className="line-through text-gray-400 flex items-center gap-1">
                      <img
                        src="/icons/SAR.png"
                        alt="SAR"
                        className="w-4 h-4 inline-block translate-y-[1px] opacity-60"
                      />
                      {originalPrice}
                    </span>
                  </div>

                  <div className="flex justify-between text-gray-700">
                    <span>الخصم</span>
                    <span className="text-green-600 font-medium">
                      %{discount}
                    </span>
                  </div>

                  <div className="border-t border-gray-200 pt-3 flex justify-between text-lg text-gray-900">
                    <span>سعر المنتج بعد الخصم</span>
                    <span className="font-semibold flex items-center gap-1">
                      <img
                        src="/icons/SAR.png"
                        alt="SAR"
                        className="w-5 h-5 inline-block translate-y-[2px]"
                      />
                      {finalPrice}
                    </span>
                  </div>

                  <div className="border-t border-gray-200 pt-3 flex justify-between text-xl font-bold">
                    <span>الإجمالي</span>
                    <span className="text-green-600 flex items-center gap-1">
                      <img
                        src="/icons/SAR.png"
                        alt="SAR"
                        className="w-5 h-5 inline-block translate-y-[2px]"
                      />
                      {finalPrice}
                    </span>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-6 space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <Check className="w-4 h-4 text-green-500" />
                    <span>تنزيل فوري</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <Check className="w-4 h-4 text-green-500" />
                    <span>تركيب سهل و سريع</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <Check className="w-4 h-4 text-green-500" />
                    <span>دعم فني مجاني</span>
                  </div>
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="w-full bg-black hover:bg-gray-900 text-white font-bold py-3 px-6 rounded-full transition-all transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {submitting ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mx-auto"></div>
                  ) : (
                    "متابعة الدفع"
                  )}
                </button>

                <div className="flex items-center justify-center gap-1.5 mb-3">
                  <Lock size={14} className="text-green-600" />
                  <p className="text-xs text-gray-400">
                    المدفوعات مؤمنة بواسطة{" "}
                    <span className="font-semibold text-gray-500">
                      Lemon Squeezy
                    </span>
                  </p>
                </div>
                <div>
                  {/* أيقونات وسائل الدفع */}
                  <div className="mt-4">
                    <p className="text-center text-xs text-gray-400 mb-3">
                      وسائل الدفع المقبولة
                    </p>
                    <div className="flex justify-center items-center gap-4 hover:grayscale-0 transition-all">
                      <img
                        src="/images/payment/visa.png"
                        alt="Visa"
                        className="h-10 object-contain w-12"
                      />
                      <img
                        src="/images/payment/mastercard.png"
                        alt="Mastercard"
                        className="h-7 object-contain w-12"
                      />
                      <img
                        src="/images/payment/paypal.png"
                        alt="Paypal"
                        className="h-12 object-contain w-12"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
