"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ShoppingBag, Mail, Code, Check, AlertCircle } from "lucide-react";

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
  const [paddleLoaded, setPaddleLoaded] = useState(false);
  const [currentTxId, setCurrentTxId] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [polling, setPolling] = useState(false);

  const originalPrice = product?.prices.amount ? product.prices.amount * 2 : 0;
  const discount = 50;
  const finalPrice = product?.prices.amount || 0;

  const checkoutContainerRef = useRef<HTMLDivElement>(null);

  const token = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN;

  // التحقق من وجود التوكن
  if (!token) {
    console.error("Paddle client token is missing.");
  }

  useEffect(() => {
    if (!productId) {
      router.push("/");
      return;
    }

    // تحميل Paddle SDK والمنتج
    loadPaddleScript();
    fetchProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  let isPaddleInitializing = false;

  const loadPaddleScript = () => {
    // 1. إذا كنا في السيرفر لا تفعل شيئاً
    if (typeof window === "undefined") return;
    if (isPaddleInitializing) return; // منع التكرار

    // 2. إذا كان Paddle محملاً بالفعل
    if (window.Paddle) {
      console.log("Paddle is already loaded");
      initializePaddle();
      setPaddleLoaded(true);
      return;
    }

    // 3. التحقق مما إذا كان السكريبت موجوداً بالفعل في الصفحة لتجنب التكرار
    if (
      document.querySelector(
        'script[src="https://cdn.paddle.com/paddle/v2/paddle.js"]',
      )
    ) {
      console.log("Script already appended, waiting for load...");
      return;
    }

    // 4. إنشاء السكريبت وتحميله
    const script = document.createElement("script");
    script.src = "https://cdn.paddle.com/paddle/v2/paddle.js";
    script.async = true;

    // ✅ عند النجاح
    script.onload = () => {
      console.log("Paddle loaded successfully!");
      initializePaddle();
      setPaddleLoaded(true); // هذا السطر هو الذي يغير نص الزر
    };

    // ❌ عند الفشل (مهم جداً)
    script.onerror = () => {
      console.error("Failed to load Paddle script. Check Ad Blocker.");
      setError(
        "فشل تحميل نظام الدفع. يرجى إيقاف مانع الإعلانات (Ad Blocker) أو التحقق من الإنترنت.",
      );
      setLoading(false); // إيقاف التحميل حتى يظهر الخطأ للمستخدم
    };

    document.head.appendChild(script);
  };

  const initializePaddle = () => {
    const token = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN;
    console.log("Initializing Paddle with token:", token); // تأكد أنه يظهر في Console المتصفح

    if (!token) {
      console.error("Token is missing!");
      return;
    }

    if (!window.Paddle) {
      console.error("Paddle SDK not loaded");
      return;
    }

    // ✅ أضف هذا السطر (قبل Initialize)
    window.Paddle.Environment.set("sandbox");

    window.Paddle.Initialize({
      token,
      checkout: {
        settings: {
          displayMode: "inline",
          frameTarget: "paddle-checkout-container",
          frameInitialHeight: 450,
          frameStyle:
            "width: 100%; min-width: 312px; background-color: transparent; border: none;",
        },
      },
    });
  };

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

  // استبدل handleSubmit بهذا:
  const handleSubmit = async () => {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("يرجى إدخال بريد إلكتروني صحيح");
      return;
    }

    setError("");

    try {
      // 1. إنشاء الطلب
      const orderResponse = await fetch("/api/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, product_id: productId }),
      });

      if (!orderResponse.ok) throw new Error("فشل إنشاء الطلب");

      const { order_id, delivery_token, price_id } = await orderResponse.json();
      setOrderId(order_id);
      setSubmitting(true);

      // 2. فتح Paddle Checkout
      setTimeout(() => {
        if (!window.Paddle) {
          setError("نظام الدفع غير جاهز");
          setSubmitting(false);
          return;
        }

        window.Paddle.Checkout.open({
          items: [{ priceId: price_id, quantity: 1 }],
          customer: { email },
          customData: {
            order_id: order_id, // ✅ هذا هو المفتاح
            email: email, // اختياري للتتبع
          },
        });

        // 3. بدء الـ Polling للتحقق من حالة الطلب
        startPolling(order_id, email, delivery_token);
      }, 300);
    } catch (err: any) {
      setError(err.message);
      setSubmitting(false);
    }
  };

  // دالة Polling للتحقق من حالة الطلب
  const startPolling = (
    orderId: string,
    email: string,
    deliveryToken: string,
  ) => {
    setPolling(true);

    const checkStatus = async () => {
      try {
        const response = await fetch(
          `/api/orders/check-status?order_id=${orderId}&email=${email}`,
        );

        if (!response.ok) return;

        const data = await response.json();

        if (data.is_completed) {
          // الدفع تم! انتقل للتسليم
          console.log("✅ Payment completed! Redirecting...");
          window.location.href = `/delivery?token=${deliveryToken}`;
          return true; // أوقف الـ polling
        }

        return false; // استمر في الـ polling
      } catch (error) {
        console.error("Polling error:", error);
        return false;
      }
    };

    // افحص كل 3 ثواني
    const intervalId = setInterval(async () => {
      const completed = await checkStatus();
      if (completed) {
        clearInterval(intervalId);
        setPolling(false);
      }
    }, 3000);

    // أوقف الـ polling بعد 10 دقائق
    setTimeout(
      () => {
        clearInterval(intervalId);
        setPolling(false);
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
  <div className="min-h-screen bg-white py-12 px-4" dir="rtl">
    {/* نافذة الدفع - تغطي كل الشاشة */}
    {submitting && (
      <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-start pt-12 px-4">
        {/* النص التوضيحي */}
        <div className="mb-6 text-center max-w-md">
          <p className="text-gray-600 text-sm">
            سوف يتم توجيهك مباشرة بعد الدفع لصفحة الاستلام
          </p>
        </div>

        {/* حاوية نافذة الدفع */}
        <div className="w-full max-w-2xl bg-white rounded-2xl border border-gray-200 p-6 shadow-lg">
          <div
            id="paddle-checkout-container"
            className="paddle-checkout-container"
            ref={checkoutContainerRef}
            style={{ width: "100%", minHeight: "500px" }}
          ></div>
        </div>
      </div>
    )}

    {/* المحتوى الأصلي - يظهر فقط إذا لم يكن submitting */}
    {!submitting && (
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">إتمام الطلب</h1>
          <p className="text-gray-600">خطوة واحدة تفصلك عن الحصول على منتجك</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
          {/* القسم الأيمن */}
          <div className="space-y-6">
            {/* بطاقة المنتج */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5" />
                ملخص الطلب
              </h2>

              <div className="flex gap-4">
                <div className="felx items-center relative rounded-xl overflow-hidden bg-gray-100">
                  {product.is_featured && (
                    <div className="absolute top-1 right-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs px-2 py-0.5 rounded-full z-10">
                      مميز ★
                    </div>
                  )}
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-70 aspect-[990/480] rounded-xl overflow-hidden bg-gray-100 object-cover"
                  />
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
                </div>
              </div>
            </div>

            {/* نموذج البريد الإلكتروني */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 space-y-6">
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
                  طريقة الاستلام
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
                            الكود الكامل
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">
                        احصل على الكود مباشرة (HTML/CSS + Script Embed)
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}
            </div>
          </div>

          {/* القسم الأيسر - ملخص السعر */}
          <div className="lg:sticky lg:top-8 h-fit">
            <div className="bg-white rounded-2xl p-6 space-y-4">
              <h3 className="font-bold text-lg text-gray-900 border-b border-gray-100 pb-3">
                ملخص السعر
              </h3>

              <div className="space-y-3">
                <div className="flex justify-between text-gray-700">
                  <span>سعر المنتج</span>
                  <span className="line-through text-gray-400">
                    ${originalPrice}
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
                  <span className="font-semibold">${finalPrice}</span>
                </div>

                <div className="border-t border-gray-200 pt-3 flex justify-between text-xl font-bold">
                  <span>الإجمالي</span>
                  <span className="text-green-600">${finalPrice}</span>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-6 space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Check className="w-4 h-4 text-green-500" />
                  <span>تسليم فوري بعد الدفع</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Check className="w-4 h-4 text-green-500" />
                  <span>كود كامل جاهز للاستخدام</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Check className="w-4 h-4 text-green-500" />
                  <span>دعم فني مجاني</span>
                </div>
              </div>

              <div className="flex items-center justify-center pt-2">
                <button
                  onClick={handleSubmit}
                  disabled={!paddleLoaded}
                  className="w-full bg-black hover:bg-gray-900 text-white font-bold py-3 px-6 rounded-full transition-all transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {!paddleLoaded ? "جاري تحميل نظام الدفع..." : `متابعة الدفع`}
                </button>
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
    )}
  </div>
);
}
