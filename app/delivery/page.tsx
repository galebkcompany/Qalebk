"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Download,
  FileCode,
  CheckCircle,
  AlertCircle,
  Clock,
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
  const [timeLeft, setTimeLeft] = useState<number>(0); // ✅ الوقت المتبقي بالثواني

  useEffect(() => {
    if (!token) {
      router.push("/");
      return;
    }

    // 1. جلب أو إنشاء رمز الجلسة
    let sId = localStorage.getItem(`session_${token}`);
    if (!sId) {
      sId = crypto.randomUUID();
      localStorage.getItem(`session_${token}`);
    }

    // 2. إرسال الطلب مع الرمز في الـ Headers
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
          // ✅ حساب الوقت المتبقي بالثواني عند التحميل
          const expiresAt = new Date(result.token.expires_at).getTime();
          const now = Date.now();
          const secondsLeft = Math.max(0, Math.floor((expiresAt - now) / 1000));
          setTimeLeft(secondsLeft);
        }
      })
      .finally(() => setLoading(false));
  }, [token, router]);

  // ✅ العداد التنازلي
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

  // ✅ دالة لتنسيق الوقت (MM:SS)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        جاري التحميل...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 font-semibold">{error}</p>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="min-h-screen bg-white p-6 text-gray-900" dir="rtl">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow">
        <div className="text-center mb-6">
          <CheckCircle className="w-14 h-14 text-green-600 mx-auto mb-2" />
          <h1 className="text-2xl font-bold">تم إتمام الطلب بنجاح</h1>
        </div>

        <div className="flex gap-4 mb-6">
          <img
            src={data.product.image_url}
            className="w-24 h-24 rounded object-cover"
            alt={data.product.name}
          />
          <div>
            <h2 className="font-bold text-lg">{data.product.name}</h2>
            <p className="text-sm text-gray-600">
              {data.purchase.currency} {data.purchase.amount}
            </p>
          </div>
        </div>

        {/* ✅ العداد التنازلي المحسّن */}
        <div
          className={`p-4 rounded mb-6 flex items-center gap-3 ${
            timeLeft < 300
              ? "bg-red-50 border border-red-200"
              : "bg-yellow-50 border border-yellow-200"
          }`}
        >
          <Clock
            className={`w-5 h-5 ${timeLeft < 300 ? "text-red-600" : "text-yellow-600"}`}
          />
          <div className="flex-1">
            <span className="text-sm text-gray-700">الرابط صالح لمدة</span>
            <span
              className={`font-bold text-lg mr-2 ${
                timeLeft < 300 ? "text-red-600" : "text-yellow-600"
              }`}
            >
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>

        <button
          onClick={handleDownload}
          disabled={timeLeft === 0}
          className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-3 rounded mb-3 flex justify-center items-center gap-2 font-semibold transition-colors"
        >
          <Download className="w-5 h-5" /> تحميل الكود
        </button>

        <button
          onClick={copyCode}
          disabled={timeLeft === 0}
          className="w-full bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed py-3 rounded flex justify-center items-center gap-2 font-semibold transition-colors"
        >
          <FileCode className="w-5 h-5" /> نسخ الكود
        </button>

        {actionError && (
          <div className="mt-4 text-center text-red-600 font-semibold">
            {actionError}
          </div>
        )}

        {downloadStarted && (
          <p className="text-center text-green-600 mt-4 font-semibold">
            ✓ تم بدء التحميل
          </p>
        )}

        {data.product.installation_guide && (
          <div className="mt-6 bg-gray-50 p-4 rounded-lg">
            <h3 className="font-bold mb-3 text-lg flex items-center gap-2">
              <FileCode className="w-5 h-5 text-purple-600" />
              دليل التثبيت
            </h3>
            <div
              className="prose prose-sm max-w-none text-gray-700"
              dangerouslySetInnerHTML={{
                __html: data.product.installation_guide,
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}