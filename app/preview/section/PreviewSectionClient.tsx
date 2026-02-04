//preview/section/page.tsx
"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/app/lib/supabaseClient";
import { Monitor, Smartphone } from "lucide-react";

export default function PreviewSection() {
  const searchParams = useSearchParams();
  const productId = searchParams.get("id");
  const [loading, setLoading] = useState(true);
  const [injectionCode, setInjectionCode] = useState("");
  const [viewMode, setViewMode] = useState("desktop");
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const fetchCode = async () => {
      if (!productId) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("codes")
          .select("preview")
          .eq("product_id", productId)
          .eq("type", "script_embed")
          .single();

        if (!error && data && data.preview) {
          setInjectionCode(data.preview);
        }
      } catch (error) {
        console.error("Error fetching code:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCode();
  }, [productId]);

  useEffect(() => {
    if (iframeRef.current && injectionCode) {
      const doc =
        iframeRef.current.contentDocument ||
        iframeRef.current.contentWindow?.document;
      if (doc) {
        // 1. التحقق من نوع الكود
        const isScript =
          injectionCode.trim().startsWith("<script") ||
          injectionCode.trim().startsWith("(function");

        const fullHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body { margin:0; background:white; overflow-x: hidden; }
    /* إخفاء السكرول بار */
    html, body { scrollbar-width: none; -ms-overflow-style: none; }
    body::-webkit-scrollbar { display: none; }
    
    .animate-shimmer {
      animation: shimmer 2s infinite linear;
      background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
      background-size: 200% 100%;
    }
    @keyframes shimmer {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }
  </style>
</head>
<body>

<!-- Header Skeleton -->

<header class="bg-white border-b sticky top-0 z-50">

  <div class="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">

    <div class="w-32 h-8 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-shimmer bg-[length:200%_100%]"></div>

    <div class="hidden md:flex gap-6">

      ${Array.from({ length: 4 })

        .map(
          () => `

        <div class="w-20 h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-shimmer bg-[length:200%_100%]"></div>

      `,
        )

        .join("")}

    </div>

    <div class="flex gap-4">

      ${Array.from({ length: 3 })

        .map(
          () => `

        <div class="w-8 h-8 rounded-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer bg-[length:200%_100%]"></div>

      `,
        )

        .join("")}

    </div>

  </div>

</header>

<div id="hero-injection-point">
  ${!isScript ? injectionCode : ""}
</div>

<section class="max-w-7xl mx-auto px-4 py-12">
  <div class="w-48 h-8 animate-shimmer rounded mb-8"></div>
  <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
    ${`<div class="border rounded-lg p-4 space-y-4">
        <div class="h-48 animate-shimmer rounded"></div>
        <div class="h-4 w-3/4 animate-shimmer rounded"></div>
        <div class="h-4 w-1/2 animate-shimmer rounded"></div>
      </div>`.repeat(8)}
  </div>
</section>





<!-- Footer Skeleton -->

<footer class="bg-gray-900 mt-16">

  <div class="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">

    ${Array.from({ length: 4 })

      .map(
        () => `

      <div class="space-y-4">

        <div class="w-32 h-5 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 rounded animate-shimmer bg-[length:200%_100%]"></div>

        <div class="w-24 h-3 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 rounded animate-shimmer bg-[length:200%_100%]"></div>

        <div class="w-24 h-3 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 rounded animate-shimmer bg-[length:200%_100%]"></div>

      </div>

    `,
      )

      .join("")}

  </div>

</footer>

${isScript ? (injectionCode.includes("<script") ? injectionCode : `<script>${injectionCode}<\/script>`) : ""}

</body>
</html>
`;

        doc.open();
        doc.write(fullHtml);
        doc.close();
      }
    }
  }, [injectionCode]);

  return (
    <div className="min-h-screen bg-[#F0F2F5] flex flex-col items-center overflow-hidden">
      {/* 
          The Stage:
          هنا يتم التحكم في حجم الـ iframe. 
          عندما يتغير عرض الـ iframe، سيعتقد الكود بداخله أن الـ Viewport تغير فعلياً،
          مما سيؤدي لتفعيل الـ Media Queries (مثل sm:, md:, lg:) بشكل حقيقي.
      */}
      <div
        className={`flex-1 w-full flex justify-center items-center transition-all duration-500 ease-in-out ${viewMode === "mobile" ? "p-10" : "p-0"}`}
      >
        <div
          className={`bg-white transition-all duration-500 ease-in-out shadow-2xl overflow-hidden relative ${
            viewMode === "mobile"
              ? "w-[385px] h-[680px] rounded-[45px] border-[6px] border-[#1a1a1a] ring-8 ring-white/50"
              : "w-full h-screen"
          }`}
        >
          {/* Mobile Notch */}
          {viewMode === "mobile" && (
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-36 h-7 bg-[#1a1a1a] rounded-b-3xl z-[60] flex items-center justify-center">
              <div className="w-10 h-1 bg-gray-800 rounded-full" />
            </div>
          )}

          {/* 
              The Iframe:
              هذا هو المفتاح. الـ iframe يخلق بيئة Viewport مستقلة تماماً.
          */}
          <iframe
            ref={iframeRef}
            title="Preview"
            className="w-full h-full border-none"
            sandbox="allow-scripts allow-same-origin"
          />
        </div>
      </div>

      {/* Floating Toggle Button - Fixed at bottom center */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] hidden md:block">
        <div className="bg-white/70 backdrop-blur-xl p-1.5 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.15)] border border-white/20 flex items-center gap-1">
          <button
            onClick={() => setViewMode("desktop")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all duration-300 ${
              viewMode === "desktop"
                ? "bg-black text-white shadow-lg scale-105"
                : "text-gray-500 hover:bg-gray-100"
            }`}
          >
            <Monitor size={18} />
            <span className="text-sm font-bold">Desktop</span>
          </button>
          <button
            onClick={() => setViewMode("mobile")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all duration-300 ${
              viewMode === "mobile"
                ? "bg-black text-white shadow-lg scale-105"
                : "text-gray-500 hover:bg-gray-100"
            }`}
          >
            <Smartphone size={18} />
            <span className="text-sm font-bold">Mobile</span>
          </button>
        </div>
      </div>

      {/* Loading Indicator */}
      {loading && (
        <div className="fixed bottom-4 right-4 bg-black/90 backdrop-blur-sm text-white px-5 py-3 rounded-2xl shadow-2xl z-[110] flex items-center gap-3 border border-white/10">
          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          <span className="text-sm font-medium">جاري التحميل...</span>
        </div>
      )}

      <style jsx>{`
        /* أنيميشن الشيمر للكود الأصلي (إذا لزم الأمر) */
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite linear;
        }
      `}</style>
    </div>
  );
}
