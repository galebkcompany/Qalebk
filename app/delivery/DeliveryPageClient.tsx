"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import JSZip from "jszip";
import {
  Download,
  FileCode,
  CheckCircle,
  AlertCircle,
  Clock,
  X,
  ChevronLeft,
  Copy,
  Gift,
} from "lucide-react";

type DeliveryData = {
  product: {
    id: string;
    name: string;
    image_url: string;
    code: string;
    installation_guide: string;
    download_code?: string;
    copy_code?: string;
  };
  purchase: {
    created_at: string;
    amount: number;
    currency: string;
  };
  token: {
    expires_at: string;
    accessed_count: number;
  };
};

type GiftProduct = {
  id: string;
  name: string;
  image_url: string;
};

export default function DeliveryPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [data, setData] = useState<DeliveryData | null>(null);
  const [downloadStarted, setDownloadStarted] = useState(false);
  const [actionError, setActionError] = useState("");
  const [timeLeft, setTimeLeft] = useState<number>(0);

  // حالات التقييم
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  // حالات النوافذ المنبثقة (Modals)
  const [activeModal, setActiveModal] = useState<string | null>(null);

  // حالات الهدية
  const [showGiftModal, setShowGiftModal] = useState(false);
  const [giftProducts, setGiftProducts] = useState<GiftProduct[]>([]);
  const [loadingGifts, setLoadingGifts] = useState(false);
  const [selectedGift, setSelectedGift] = useState<string | null>(null);
  const [downloadingGift, setDownloadingGift] = useState(false);
  const [giftClaimed, setGiftClaimed] = useState(false);

  useEffect(() => {
    if (!token) {
      router.push("/");
      return;
    }

    let sId = localStorage.getItem(`session_${token}`);
    if (!sId) {
      sId = crypto.randomUUID();
      localStorage.setItem(`session_${token}`, sId);
    }

    fetch(`/api/delivery?token=${token}`, {
      headers: {
        "x-session-id": sId,
      },
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.error) {
          setError(result.error);
        } else {
          setData(result);
          const expiresAt = new Date(result.token.expires_at).getTime();
          const now = Date.now();
          const secondsLeft = Math.max(0, Math.floor((expiresAt - now) / 1000));
          setTimeLeft(secondsLeft);
        }
      })
      .finally(() => setLoading(false));
  }, [token, router]);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setError("انتهت صلاحية الرابط");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);

  const handleDownload = () => {
    if (!data?.product.download_code) {
      setActionError("لا يوجد كود للتحميل");
      return;
    }
    const blob = new Blob([data.product.download_code], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `section.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setDownloadStarted(true);
    setActionError("");
  };

  const handleDownloadCopyCode = () => {
    if (!data?.product.copy_code) {
      setActionError("لا يوجد كود للتحميل");
      return;
    }

    const blob = new Blob([data.product.copy_code], {
      type: "text/javascript",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.href = url;
    a.download = `script.js`;

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setDownloadStarted(true);
    setActionError("");
  };

  const copyCode = async () => {
    if (!data?.product.copy_code) {
      setActionError("لا يوجد كود للنسخ");
      return;
    }
    try {
      await navigator.clipboard.writeText(data.product.copy_code);
      setActionError("");
    } catch {
      setActionError("فشل نسخ الكود");
    }
  };

  const handleSubmitReview = async () => {
    if (!rating) {
      setActionError("الرجاء اختيار تقييم");
      return;
    }

    setIsSubmittingReview(true);
    setActionError("");

    try {
      const sessionId = localStorage.getItem(`session_${token}`);

      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rating,
          review_text: review.trim() || null,
          token,
          session_id: sessionId,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "فشل إرسال التقييم");
      }

      setReviewSubmitted(true);
    } catch (err: any) {
      setActionError(err.message || "حدث خطأ أثناء إرسال التقييم");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  // جلب المنتجات المجانية
  const handleOpenGiftModal = async () => {
    setShowGiftModal(true);
    setLoadingGifts(true);
    setActionError("");

    try {
      const response = await fetch("/api/free-gift");
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "فشل جلب المنتجات");
      }

      setGiftProducts(result.products || []);
    } catch (err: any) {
      setActionError(err.message || "حدث خطأ في جلب المنتجات");
    } finally {
      setLoadingGifts(false);
    }
  };

// تحميل الهدية المختارة
const handleDownloadGift = async (productId: string) => {
  if (!token) return;

  setDownloadingGift(true);
  setActionError("");
  setSelectedGift(productId);

  try {
    const sessionId = localStorage.getItem(`session_${token}`);

    const response = await fetch(
      `/api/free-gift/${productId}?token=${token}`,
      {
        headers: {
          "x-session-id": sessionId || "",
        },
      },
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "فشل تحميل الهدية");
    }

    // إنشاء ملف ZIP
    const zip = new JSZip();

    // إضافة ملف HTML إلى ZIP
    if (result.html_code) {
      zip.file("gift-section.html", result.html_code);
    }

    // إضافة ملف JavaScript إلى ZIP
    if (result.script_code) {
      zip.file("gift-script.js", result.script_code);
    }

    // توليد ملف ZIP
    const zipBlob = await zip.generateAsync({ type: "blob" });

    // تنزيل ملف ZIP
    const url = URL.createObjectURL(zipBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "gift-section.zip";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    // تحديث الحالة وإغلاق النافذة مباشرة
    setGiftClaimed(true);
    setShowGiftModal(false);

  } catch (err: any) {
    setActionError(err.message || "حدث خطأ في تحميل الهدية");
    setShowGiftModal(false);
  } finally {
    setDownloadingGift(false);
    setSelectedGift(null);
  }
};
  const installationSteps: Record<
    string,
    { title: string; steps: string[]; note?: string }
  > = {
    salla: {
      title: "سلة",
      steps: [
        "اذهب إلى لوحة التحكم ثم (تصميم المتجر).",
        "اختر الثيم النشط واضغط (تخصيص النسخة).",
        "انتقل إلى (تخصيص الثيم) ثم (أكواد JS إضافية) والصق الكود بالكامل.",
        "ابحث داخل الكود عن LINK-TO-YOUR-IMG1.png واستبدلها بروابط صورك.",
        "اضغط (حفظ التغييرات) ثم قم بمعاينة المتجر.",
      ],
      note: "إضافة الأكواد المخصصة متاحة فقط لباقتي برو (Pro) أو سبيشل (Special).",
    },

    zid: {
      title: "زد",
      steps: [
        "اذهب إلى (هوية المتجر) ثم (تصميم المتجر).",
        "اضغط (تخصيص) للثيم الحالي.",
        "ابحث عن (Custom JS) أو (أكواد JS مخصصة) والصق الكود بالكامل.",
        "اضغط (حفظ) ثم نشر التغييرات.",
      ],
    },

    shopify: {
      title: "شوبيفاي",
      steps: [
        "اذهب إلى Online Store > Themes > Customize.",
        "اضغط Add Section في المكان المطلوب.",
        "اختر Custom Liquid.",
        "الصق الكود بالكامل داخل المربع.",
        "تأكد أن الكود داخل وسم <script> إذا لم يكن موجوداً.",
      ],
    },

    woocommerce: {
      title: "ووكوميرس / ووردبريس",
      steps: [
        "قم بتثبيت إضافة Code Snippets.",
        "أنشئ Snippet جديد واختر النوع JavaScript.",
        "الصق الكود بالكامل واختر (Front-end only).",
        "أو باستخدام Elementor: أضف عنصر HTML Code والصق الكود داخله.",
      ],
    },
    CustomWeb: {
      title: "المواقع المخصصة",
      steps: [
        "حدّد الصفحة والعنصر الذي تريد عرض القسم فيه (غالبًا الصفحة الرئيسية أو قسم معيّن داخلها).",
        "إدراج الكود في الصفحة:\n\n HTML عادي: الصق الكود داخل <body> في المكان المطلوب.\nReact / Next.js: ضع الكود داخل الـ component المناسب، وتأكد أن التنفيذ يتم بعد تحميل الـ DOM.",
        "التأكد من وسم JavaScript إذا كان الكود JavaScript خام، يجب أن يكون داخل <script></script>. ",
        "تعديل روابط الصور",
        "التحقق والاختبار.",
      ],
    },
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        جاري تحميل الاكواد ...
      </div>
    );
  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 font-semibold">{error}</p>
        </div>
      </div>
    );
  if (!data) return null;

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans" dir="rtl">
      <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row gap-6 p-4 lg:p-8 mt-6">
        {/* القسم الرئيسي (75%) */}

        <div className="flex-1 space-y-6 order-2 lg:order-1">
          <div className="bg-white p-6 lg:p-8 rounded-2xl border border-gray-200">
            <div className="flex flex-col md:flex-row gap-6 mb-8">
              {data.product.image_url.endsWith(".mp4") ? (
                <video
                  src={data.product.image_url}
                  muted
                  loop
                  autoPlay
                  playsInline
                  preload="metadata"
                  className="w-70 rounded-xl overflow-hidden bg-gray-100 object-cover"
                />
              ) : (
                <img
                  src={data.product.image_url}
                  className="w-full sm:w-80 rounded-xl bg-gray-100 object-cover"
                  alt={data.product.name}
                />
              )}
              <div className="flex-1 py-2">
                <h2 className="font-bold text-2xl mb-2">{data.product.name}</h2>
                
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* مربع الكود المصدري */}
              <div className="relative group bg-[#1e1e1e] rounded overflow-hidden border border-gray-800 shadow-sm">
                <div className="flex items-center justify-between px-4 py-3 bg-[#252526] border-b border-gray-800">
                  <span className="text-gray-400 text-xs font-mono">
                    index.html
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={handleDownload}
                      className="p-2 hover:bg-gray-700 rounded-lg transition-colors text-gray-300"
                      title="تحميل الملف"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="p-4 h-[160px] overflow-hidden relative">
                  <pre className="text-blue-400 font-mono text-xs leading-6">
                    <code>
                      {data.product.download_code
                        ?.split("\n")
                        .slice(0, 6)
                        .join("\n")}
                    </code>
                  </pre>
                  <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#1e1e1e] to-transparent"></div>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <button
                    onClick={handleDownload}
                    className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-lg transition-all opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0"
                  >
                    تنزيل الكود
                  </button>
                </div>
              </div>

              {/* مربع كود التضمين */}
              <div className="relative group bg-[#1e1e1e] rounded overflow-hidden border border-gray-800 shadow-sm">
                <div className="flex items-center justify-between px-4 py-3 bg-[#252526] border-b border-gray-800">
                  <span className="text-gray-400 text-xs font-mono">
                    embed-script.js
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={handleDownloadCopyCode}
                      className="p-2 hover:bg-gray-700 rounded-lg transition-colors text-gray-300"
                      title="تحميل الكود"
                    >
                      <Download className="w-4 h-4" />
                    </button>

                    <button
                      onClick={copyCode}
                      className="p-2 hover:bg-gray-700 rounded-lg transition-colors text-gray-300"
                      title="نسخ الكود"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="p-4 h-[160px] overflow-hidden relative">
                  <pre className="text-green-400 font-mono text-xs leading-6">
                    <code>
                      {data.product.copy_code
                        ?.split("\n")
                        .slice(0, 6)
                        .join("\n")}
                    </code>
                  </pre>
                  <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#1e1e1e] to-transparent"></div>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <button
                    onClick={copyCode}
                    className="w-full py-2 bg-gray-700 hover:bg-gray-600 text-white text-xs font-bold rounded-lg transition-all opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0"
                  >
                    نسخ الكود
                  </button>
                </div>
              </div>
            </div>

            {actionError && (
              <div className="p-4 bg-red-50 text-red-600 rounded-xl text-center font-medium mb-4">
                {actionError}
              </div>
            )}
            {downloadStarted && (
              <div className="p-4 bg-green-50 text-green-600 rounded-xl text-center font-medium mb-4">
                ✓ تم التحميل بنجاح
              </div>
            )}

            {data.product.installation_guide && (
              <div className="mt-8 border-t border-gray-100 pt-8">
                <h3 className="font-bold text-gray-800 text-xl mb-4 flex items-center gap-3">
                  نصائح
                </h3>
                <div className="prose prose-purple max-w-none text-gray-700 leading-relaxed">
                  <ul>
                    <li>
                      <strong>روابط الصور:</strong> الكود يحتوي على روابط وهمية
                      مثل (<code>LINK-TO-YOUR-IMG1.png</code>). يجب عليك وضع
                      روابط صورك الحقيقة الكود ليعمل القسم بشكل صحيح.
                    </li>

                    <li>
                      <strong>التوافق:</strong> الكود مصمم ليكون متوافقًا مع
                      الجوال (Responsive)، لذا سيظهر بشكل جيد على جميع الشاشات.
                    </li>
                  </ul>
                </div>
              </div>
            )}
            {/* زر الهدية */}
            {!giftClaimed && (
              <div className="bg-white py-6 border border-gray-200 rounded-2xl mt-8 text-center px-8">
                <div className="flex items-center gap-3 mb-4 justify-center">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <Gift className="w-5 h-5 text-purple-600" />
                  </div>
                  <h3 className="font-bold text-lg">احصل على قسم مجاني</h3>
                </div>
                <button
                  onClick={handleOpenGiftModal}
                  className="w-full bg-gray-50 text-gray-800 py-3 border border-gray-300 rounded-full font-bold  transition-colors mt-2 hover:bg-gray-200"
                >
                  اختر القسم
                </button>
              </div>
            )}
          </div>
        </div>

        {/* القائمة الجانبية (25%) */}
        <div className="w-full lg:w-[350px] space-y-6 order-1 lg:order-2">
          {/* حالة الطلب */}
          <div className="bg-white p-6 border border-gray-200 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-xl font-bold mb-4">تم التسليم بنجاح</h1>

            <div
              className={`p-4 rounded-xl flex items-center gap-3 ${timeLeft < 300 ? "bg-red-50 border border-red-100" : "bg-blue-50 border border-blue-100"}`}
            >
              <Clock
                className={`w-5 h-5 ${timeLeft < 300 ? "text-red-600" : "text-blue-600"}`}
              />
              <div className="text-right">
                <p className="text-xs text-gray-500">الرابط متاح لمدة</p>
                <p
                  className={`font-bold text-lg ${timeLeft < 300 ? "text-red-600" : "text-blue-600"}`}
                >
                  {formatTime(timeLeft)}
                </p>
              </div>
            </div>
          </div>

          {giftClaimed && (
            <div className="bg-green-50 p-6 rounded-2xl border border-green-200 text-center">
              <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
              <h3 className="font-bold text-lg text-green-800 mb-2">
                تم استلام القسم المجاني!
              </h3>
            </div>
          )}

          {/* تقييم المنتج */}
          <div className="bg-white p-6 border border-gray-200">
            <h3 className="font-bold text-lg mb-4">تقييم المنتج</h3>

            {reviewSubmitted && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm text-center font-medium">
                ✓ تم إرسال تقييمك بنجاح
              </div>
            )}

            <div className="flex justify-center gap-2 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className="transition-transform hover:scale-110"
                  disabled={isSubmittingReview}
                >
                  <img
                    src={
                      star <= rating ? "icons/star.svg" : "icons/staroff.svg"
                    }
                    alt="star"
                    className="w-8 h-8"
                  />
                </button>
              ))}
            </div>
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="اكتب رأيك هنا..."
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 min-h-[100px] resize-none"
              disabled={isSubmittingReview}
            />
            <button
              onClick={handleSubmitReview}
              disabled={isSubmittingReview || !rating}
              className="w-full mt-3 bg-black text-white py-2 rounded-full text-sm font-bold hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isSubmittingReview ? "جاري الإرسال..." : "إرسال التقييم"}
            </button>
          </div>

          {/* طريقة التركيب */}
          <div className="bg-white p-6 border border-gray-200">
            <h3 className="font-bold text-lg mb-4">طريقة التركيب</h3>
            <div className="space-y-3">
              {[
                { id: "salla", name: "سلة", color: "bg-[#00dee0]" },
                { id: "zid", name: "زد", color: "bg-[#8e44ad]" },
                { id: "shopify", name: "شوبيفاي", color: "bg-[#95bf47]" },
                { id: "woocommerce", name: "ووكوميرس", color: "bg-blue-600" },
                {
                  id: "CustomWeb",
                  name: "المواقع المخصصة",
                  color: "bg-gray-600",
                },
              ].map((platform) => (
                <button
                  key={platform.id}
                  onClick={() => setActiveModal(platform.id)}
                  className="w-full flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-2 h-8 ${platform.color} rounded-full`}
                    ></div>
                    <span className="font-bold">منصة {platform.name}</span>
                  </div>
                  <ChevronLeft className="w-5 h-5 text-gray-400 group-hover:translate-x-[-4px] transition-transform" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal الهدية */}
      {showGiftModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between text-gray-900 bg-gray-50">
              <h3 className="font-bold text-2xl flex items-center gap-3">
                <Gift className="w-8 h-8" />
                اختر قسماً مجانياً كهدية
              </h3>
              <button
                onClick={() => setShowGiftModal(false)}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-8 max-h-[70vh] overflow-y-auto">
              {loadingGifts ? (
                <div className="text-center py-12">
                  <div className="inline-block w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
                  <p className="mt-4 text-gray-600">جاري تحميل المنتجات...</p>
                </div>
              ) : giftProducts.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-600">لا توجد منتجات متاحة حالياً</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                  {giftProducts.map((product) => (
                    <div
                      key={product.id}
                      className="group relative bg-white border-2 border-gray-200 rounded-xl overflow-hidden hover:border-purple-500 transition-all cursor-pointer"
                      onClick={() => handleDownloadGift(product.id)}
                    >
                      {product.image_url.endsWith(".mp4") ? (
                        <video
                          src={product.image_url}
                          muted
                          loop
                          autoPlay
                          playsInline
                          className="w-full h-48   object-cover"
                        />
                      ) : (
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-full h-48 object-cover"
                        />
                      )}
                      <div className="p-3">
                        <h4 className="font-bold text-sm text-center line-clamp-2">
                          {product.name}
                        </h4>
                      </div>
                      <div className="absolute inset-0 bg-gray-100/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        {downloadingGift && selectedGift === product.id ? (
                          <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <Download className="w-12 h-12 text-black" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* النوافذ المنبثقة للتركيب (Modals) */}
      {activeModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50">
              <h3 className="font-bold text-xl">
                خطوات التركيب على {installationSteps[activeModal]?.title}
              </h3>
              <button
                onClick={() => setActiveModal(null)}
                className="p-2 hover:bg-gray-200 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-8 max-h-[70vh] overflow-y-auto whitespace-pre-line">
              <div className="space-y-6">
                {installationSteps[activeModal]?.steps.map((step, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                      {index + 1}
                    </div>
                    <p className="text-gray-700 pt-1">{step}</p>
                  </div>
                ))}

                {installationSteps[activeModal]?.note && (
                  <div className="p-4 bg-yellow-50 border border-yellow-100 rounded-xl text-sm text-yellow-800">
                    {installationSteps[activeModal].note}
                  </div>
                )}
              </div>
            </div>

            <div className="p-6 bg-gray-50 border-t border-gray-100">
              <button
                onClick={() => setActiveModal(null)}
                className="w-full bg-black text-white py-3 rounded-xl font-bold hover:bg-gray-800 transition-colors"
              >
                فهمت ذلك
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
