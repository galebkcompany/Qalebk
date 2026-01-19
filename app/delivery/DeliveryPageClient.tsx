"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Download,
  FileCode,
  CheckCircle,
  AlertCircle,
  Clock,
  X,
  ChevronLeft,
  Copy,
} from "lucide-react";

type DeliveryData = {
  product: {
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

  // حالات النوافذ المنبثقة (Modals)
  const [activeModal, setActiveModal] = useState<string | null>(null);

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
    a.download = `${data.product.name.replace(/\s+/g, "-").toLowerCase()}.html`;
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
      alert("تم نسخ الكود");
      setActionError("");
    } catch {
      setActionError("فشل نسخ الكود");
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        جاري التحميل...
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
      <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row gap-6 p-4 lg:p-8">
        {/* القسم الرئيسي (75%) */}
        <div className="flex-1 space-y-6 order-2 lg:order-1">
          <div className="bg-white p-6 lg:p-8 rounded-2xl border border-gray-200">
            <div className="flex flex-col md:flex-row gap-6 mb-8">
              <img
                src={data.product.image_url}
                className="w-full
            sm:w-80
            aspect-[990/480]
            rounded-xl
            bg-gray-100
            object-cover"
                alt={data.product.name}
              />
              <div className="flex-1 py-2">
                <h2 className="font-bold text-2xl mb-2">{data.product.name}</h2>
                {/* <div className="flex items-center gap-2 text-purple-600 font-bold text-xl">
                  <span>{data.purchase.currency}</span>
                  <span>{data.purchase.amount}</span>
                </div> */}
                <p className="text-gray-500 text-sm mt-4">
                  تاريخ الشراء:{" "}
                  {new Date(data.purchase.created_at).toLocaleDateString(
                    "ar-SA",
                  )}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* مربع الكود المصدري */}
              <div className="relative group bg-[#1e1e1e] rounded overflow-hidden border border-gray-800 shadow-2xl">
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
                  {/* تأثير التلاشي */}
                  <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#1e1e1e] to-transparent"></div>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <button
                    onClick={handleDownload}
                    className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-lg transition-all opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0"
                  >
                    تحميل الكود بالكامل
                  </button>
                </div>
              </div>

              {/* مربع كود التضمين */}
              <div className="relative group bg-[#1e1e1e] rounded overflow-hidden border border-gray-800 shadow-2xl">
                <div className="flex items-center justify-between px-4 py-3 bg-[#252526] border-b border-gray-800">
                  <span className="text-gray-400 text-xs font-mono">
                    embed-script.js
                  </span>
                  <div className="flex gap-2">
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
                  {/* تأثير التلاشي */}
                  <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#1e1e1e] to-transparent"></div>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <button
                    onClick={copyCode}
                    className="w-full py-2 bg-gray-700 hover:bg-gray-600 text-white text-xs font-bold rounded-lg transition-all opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0"
                  >
                    نسخ الكود بالكامل
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
                <h3 className="font-bold text-xl mb-6 flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <FileCode className="w-5 h-5 text-purple-600" />
                  </div>
                  دليل التثبيت السريع
                </h3>
                <div
                  className="prose prose-purple max-w-none text-gray-700 leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: data.product.installation_guide,
                  }}
                />
              </div>
            )}
          </div>
        </div>

        {/* القائمة الجانبية (25%) */}
        <div className="w-full lg:w-[350px] space-y-6 order-1 lg:order-2">
          {/* حالة الطلب */}
          <div className="bg-white p-6  border border-gray-200 text-center">
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

          {/* تقييم المنتج */}
          <div className="bg-white p-6 border border-gray-200">
            <h3 className="font-bold text-lg mb-4">تقييم المنتج</h3>
            <div className="flex justify-center gap-2 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className="transition-transform hover:scale-110"
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
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-[100px] resize-none"
            />
            <button className="w-full mt-3 bg-black text-white py-2 rounded-lg text-sm font-bold hover:bg-gray-800 transition-colors">
              إرسال التقييم
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

      {/* النوافذ المنبثقة (Modals) */}
      {activeModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50">
              <h3 className="font-bold text-xl">
                خطوات التركيب على{" "}
                {activeModal === "salla"
                  ? "سلة"
                  : activeModal === "zid"
                    ? "زد"
                    : "شوبيفاي"}
              </h3>
              <button
                onClick={() => setActiveModal(null)}
                className="p-2 hover:bg-gray-200 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-8 max-h-[70vh] overflow-y-auto">
              <div className="space-y-6">
                {/* سيتم إضافة الخطوات هنا لاحقاً */}
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                    1
                  </div>
                  <p className="text-gray-700 pt-1">
                    قم بتسجيل الدخول إلى لوحة تحكم{" "}
                    {activeModal === "salla"
                      ? "سلة"
                      : activeModal === "zid"
                        ? "زد"
                        : "شوبيفاي"}
                    .
                  </p>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                    2
                  </div>
                  <p className="text-gray-700 pt-1">
                    انتقل إلى قسم الإعدادات ثم خيارات المتجر.
                  </p>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                    3
                  </div>
                  <p className="text-gray-700 pt-1">
                    أضف الكود المنسوخ في المكان المخصص للأكواد المخصصة.
                  </p>
                </div>
                <div className="p-4 bg-yellow-50 border border-yellow-100 rounded-xl text-sm text-yellow-800">
                  سيتم تحديث هذه الخطوات بالتفصيل قريباً.
                </div>
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
