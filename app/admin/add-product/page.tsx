"use client";

import { useState, useEffect, useRef } from "react";
import { supabase } from "@/app/lib/supabaseClient";
import axios from "axios";
import slugify from "slugify";

type Price = {
  variant_id: string;
  price_label: string;
  amount: number;
};

const PLATFORM_OPTIONS = [
  { value: "Salla", label: "سلة" },
  { value: "Zid", label: "زد" },
  { value: "Shopify", label: "شوبيفاي" },
  { value: "Wordpress", label: "ووردبريس" },
  { value: "WooCommerce", label: "وي كميرس" },
  { value: "ExpandCart", label: "اكسباند كارد" },
  { value: "custom website", label: "مواقع مخصصة" },
];

const PRODUCT_TYPES = [{ value: "section", label: "Section" }];

// مكون Tabs البسيط
const Tabs = ({
  tabs,
}: {
  tabs: Array<{ label: string; value: string; content: React.ReactNode }>;
}) => {
  const [active, setActive] = useState(tabs[0]?.value || "");

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="flex border-b bg-gray-50">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActive(tab.value)}
            className={`px-4 py-2 font-medium transition-colors ${
              active === tab.value
                ? "bg-white border-b-2 border-black"
                : "text-gray-600 hover:text-black"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="p-4 bg-white">
        {tabs.find((t) => t.value === active)?.content}
      </div>
    </div>
  );
};

export default function AddProduct() {
  const [name, setName] = useState("");
  const [fullDesc, setFullDesc] = useState("");
  const [productType, setProductType] = useState("section");
  const [priceId, setPriceId] = useState("13.49");
  const [isFeatured, setIsFeatured] = useState(false);
  const [platforms, setPlatforms] = useState<string[]>([]);
  const [installation, setInstallation] = useState("");
  const [customizableFields, setCustomizableFields] = useState(
    "يمكن تخصيص الألوان، النصوص، الخطوط، حجم العناصر، وترتيب المحتوى بما يتناسب مع هوية مشروعك.",
  );
  const [previewCode, setPreviewCode] = useState("");

  const [slug, setSlug] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [prices, setPrices] = useState<Price[]>([]);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // الأكواد
  const [htmlCssCode, setHtmlCssCode] = useState("");
  const [scriptEmbedCode, setScriptEmbedCode] = useState("");

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const loadPrices = async () => {
      const { data, error } = await supabase
        .from("prices")
        .select("variant_id, price_label, amount");

      if (!error && data) {
        setPrices(data);
      }
    };

    loadPrices();
  }, []);

  const handleSubmit = async () => {
    if (!name || !image) {
      alert("الاسم والصورة مطلوبان");
      return;
    }

    if (!htmlCssCode && !scriptEmbedCode) {
      alert("يجب إضافة كود واحد على الأقل (HTML/CSS أو Script Embed)");
      return;
    }

    setLoading(true);

    try {
      // 1. رفع الصورة إلى Cloudinary
      // ✅ الكود المحسّن
      const formData = new FormData();
      formData.append("file", image);
      formData.append(
        "upload_preset",
        process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!,
      );

      // تحديد نوع الملف تلقائياً
      const isVideo = image.type.startsWith("video/");
      const resourceType = isVideo ? "video" : "image";

      // رفع الملف مع تحديد النوع في الرابط
      const uploadUrl = `${process.env.NEXT_PUBLIC_CLOUDINARY_URL!.replace("/image/upload", `/${resourceType}/upload`)}`;

      const cloudRes = await axios.post(uploadUrl, formData);
      const image_url = cloudRes.data.secure_url;
      const image_public_id = cloudRes.data.public_id;

      // 2. توليد slug
      const finalSlug = slug || slugify(name, { lower: true, strict: true });

      // 3. حفظ المنتج
      const { data: productData, error: productError } = await supabase
        .from("products")
        .insert([
          {
            name,
            description: fullDesc,
            product_type: productType,
            image_url,
            image_public_id,
            preview_url:
              productType === "section" ? "/preview/section" : "/preview/page",
            variant_id: priceId,
            is_featured: isFeatured,
            platforms,
            installation_guide: installation,
            customizable_fields: customizableFields,
            slug: finalSlug,
          },
        ])
        .select()
        .single();

      if (productError) throw productError;

      // 4. حفظ الأكواد
      const codes = [];
      if (htmlCssCode) {
        codes.push({
          product_id: productData.id,
          type: "html_css",
          code: htmlCssCode,
        });
      }
      if (scriptEmbedCode) {
        codes.push({
          product_id: productData.id,
          type: "script_embed",
          code: scriptEmbedCode,
          preview: previewCode || scriptEmbedCode,
        });
      }

      if (codes.length > 0) {
        const { error: codesError } = await supabase
          .from("codes")
          .insert(codes);

        if (codesError) throw codesError;
      }

      alert("✅ تم حفظ المنتج والأكواد بنجاح!");

      // إعادة تعيين النموذج
      setName("");
      setFullDesc("");
      setProductType("section");
      setPriceId("9.49");
      setIsFeatured(false);
      setPlatforms([]);
      setInstallation(
        "لأصحاب المتاجر و المواقع الجاهزه يمكنك نسخ الكود وتضمينه في متجرك او موقعك مباشره خلال دقائق فقط بدون معرفه بالبرمجه اما المبرمجين واصاحب المواقع المخصصه يمكنهم استخادم الكود مباشره داخل مشروعهم",
      );
      setCustomizableFields(
        "يمكن تخصيص الألوان، النصوص، الخطوط، حجم العناصر، وترتيب المحتوى والصور بما يتناسب مع هوية متجرك او موقعك.",
      );
      setSlug("");
      setImage(null);
      setHtmlCssCode("");
      setScriptEmbedCode("");
      setPreviewCode("");
    } catch (error: any) {
      console.error("❌ خطأ:", error);
      alert("حدث خطأ: " + (error.message || "خطأ غير معروف"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white to-gray-100 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            إضافة منتج جديد
          </h1>

          {/* صورة المنتج */}
          <div className="mb-6">
            <label className="block font-medium text-gray-700 mb-2">
              صورة المنتج *
            </label>
            <input
              className="w-full bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 p-4 hover:border-gray-400 transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-black file:text-white hover:file:bg-gray-800"
              type="file"
              accept="image/*,video/mp4"
              onChange={(e) => setImage(e.target.files?.[0] || null)}
            />
            {image && (
              <p className="mt-2 text-sm text-green-600">
                ✓ تم اختيار: {image.name}
              </p>
            )}
          </div>

          {/* اسم المنتج */}
          <div className="mb-6">
            <label className="block font-medium text-gray-700 mb-2">
              عنوان المنتج *
            </label>
            <input
              type="text"
              className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-black focus:outline-none transition-colors"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* نوع المنتج */}
          <div className="mb-6">
            <label className="block font-medium text-gray-700 mb-2">
              نوع المنتج *
            </label>
            <div className="grid grid-cols-2 gap-4">
              {PRODUCT_TYPES.map((type) => (
                <div
                  key={type.value}
                  onClick={() => setProductType(type.value)}
                  className={`p-4 rounded-lg text-lg border-2 cursor-pointer transition-all ${
                    productType === type.value
                      ? "border-black bg-black text-white"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                >
                  <div className="text-center py-4">
                    <div className="font-semibold">{type.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* الوصف الكامل */}
          <div className="mb-6">
            <label className="block font-medium text-gray-700 mb-2">
              الوصف
            </label>
            <textarea
              className="w-full border-2 border-gray-300 rounded-lg p-3 focus:border-black focus:outline-none transition-colors"
              rows={6}
              value={fullDesc}
              onChange={(e) => setFullDesc(e.target.value)}
            />
          </div>

          {/* السعر */}
          <div className="mb-6">
            <label className="block font-medium text-gray-700 mb-2">
              السعر *
            </label>
            <select
              className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-black focus:outline-none transition-colors bg-white"
              value={priceId}
              onChange={(e) => setPriceId(e.target.value)}
            >
              <option value="">اختر السعر</option>
              {prices.map((price) => (
                <option key={price.variant_id} value={price.variant_id}>
                  {price.price_label} – SAR {price.amount}
                </option>
              ))}
            </select>
          </div>

          {/* مميز */}
          <div className="flex items-center gap-3 mb-6 bg-gray-50 p-4 rounded-lg">
            <input
              type="checkbox"
              id="featured"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="w-5 h-5 rounded border-gray-300 text-black focus:ring-black"
            />
            <label
              htmlFor="featured"
              className="font-medium text-gray-700 cursor-pointer"
            >
              عرض المنتج كمميز في الصفحة الرئيسية
            </label>
          </div>

          {/* ما الذي يمكن تخصيصه */}
          <div className="mb-6">
            <label className="block font-medium text-gray-700 mb-2">
              ما الذي يمكن تخصيصه؟
            </label>
            <textarea
              className="w-full border-2 border-gray-300 rounded-lg p-3 focus:border-black focus:outline-none transition-colors"
              rows={4}
              value={customizableFields}
              onChange={(e) => setCustomizableFields(e.target.value)}
              placeholder="مثال: يمكن تخصيص الألوان، النصوص، حجم العداد، التاريخ المستهدف..."
            />
          </div>

          {/* المنصات */}
          <div ref={dropdownRef} className="relative mb-6">
            <label className="block font-medium text-gray-700 mb-2">
              المنصات المدعومة
            </label>
            <div
              onClick={() => setOpen(!open)}
              className="w-full min-h-[56px] border-2 border-gray-300 rounded-lg px-4 py-3 cursor-pointer flex flex-wrap gap-2 items-center hover:border-gray-400 transition-colors"
            >
              {platforms.length === 0 && (
                <span className="text-gray-400">اختر المنصات المدعومة</span>
              )}
              {platforms.map((p) => {
                const label = PLATFORM_OPTIONS.find(
                  (o) => o.value === p,
                )?.label;
                return (
                  <span
                    key={p}
                    className="bg-black text-white rounded-full px-4 py-1.5 text-sm flex items-center gap-2"
                  >
                    {label}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setPlatforms(platforms.filter((x) => x !== p));
                      }}
                      className="hover:text-red-400 font-bold"
                    >
                      ×
                    </button>
                  </span>
                );
              })}
            </div>

            {open && (
              <div className="absolute z-10 mt-2 w-full bg-white rounded-lg shadow-xl border-2 border-gray-200 p-3 flex flex-wrap gap-2">
                {PLATFORM_OPTIONS.map((option) => {
                  const selected = platforms.includes(option.value);
                  return (
                    <div
                      key={option.value}
                      onClick={() => {
                        if (selected) {
                          setPlatforms(
                            platforms.filter((p) => p !== option.value),
                          );
                        } else {
                          setPlatforms([...platforms, option.value]);
                        }
                      }}
                      className={`px-4 py-2 rounded-full cursor-pointer border-2 text-sm transition-all ${
                        selected
                          ? "bg-black text-white border-black"
                          : "border-gray-300 hover:border-black hover:bg-gray-50"
                      }`}
                    >
                      {option.label}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* طريقة التركيب */}
          <div className="mb-6">
            <label className="block font-medium text-gray-700 mb-2">
              طريقة التركيب
            </label>
            <textarea
              className="w-full border-2 border-gray-300 rounded-lg p-3 focus:border-black focus:outline-none transition-colors"
              rows={4}
              value={installation}
              onChange={(e) => setInstallation(e.target.value)}
              placeholder="اشرح كيفية تركيب الكود خطوة بخطوة..."
            />
          </div>

          {/* Slug */}
          <div className="mb-6">
            <label className="block font-medium text-gray-700 mb-2">
              Slug (اختياري)
            </label>
            <input
              type="text"
              className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-black focus:outline-none transition-colors"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="سيتم توليده تلقائياً إن لم تكتبه"
            />
          </div>
        </div>

        {/* قسم الأكواد */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            الأكواد
          </h2>

          <Tabs
            tabs={[
              {
                label: "HTML/CSS",
                value: "html",
                content: (
                  <div>
                    <p className="text-sm text-gray-600 mb-3">
                      الكود المباشر الذي يحتوي على HTML و CSS
                    </p>
                    <textarea
                      className="w-full border-2 border-gray-300 rounded-lg p-4 focus:border-black focus:outline-none transition-colors font-mono text-sm"
                      rows={12}
                      value={htmlCssCode}
                      onChange={(e) => setHtmlCssCode(e.target.value)}
                      placeholder={`كود HTML/CSS هنا...`}
                    />
                    {htmlCssCode && (
                      <p className="mt-2 text-sm text-green-600">
                        ✓ تم إدخال {htmlCssCode.length} حرف
                      </p>
                    )}
                  </div>
                ),
              },
              {
                label: "Script Embed",
                value: "script",
                content: (
                  <div>
                    <p className="text-sm text-gray-600 mb-3">
                      نفس الكود لكن داخل وسم{" "}
                      <code className="bg-gray-100 px-2 py-1 rounded">
                        &lt;script&gt;
                      </code>{" "}
                      للتضمين السهل
                    </p>
                    <textarea
                      className="w-full border-2 border-gray-300 rounded-lg p-4 focus:border-black focus:outline-none transition-colors font-mono text-sm"
                      rows={12}
                      value={scriptEmbedCode}
                      onChange={(e) => setScriptEmbedCode(e.target.value)}
                      placeholder={`كود السكريبت هنا...`}
                    />
                    {scriptEmbedCode && (
                      <p className="mt-2 text-sm text-green-600">
                        ✓ تم إدخال {scriptEmbedCode.length} حرف
                      </p>
                    )}
                  </div>
                ),
              },
              {
                label: "كود المعاينة",
                value: "preview",
                content: (
                  <div>
                    <p className="text-sm text-gray-600 mb-3">
                      الكود الذي سيظهر في صفحة المعاينة (يُنصح أن يكون نفس كود
                      Script Embed)
                    </p>
                    <textarea
                      className="w-full border-2 border-gray-300 rounded-lg p-4 focus:border-black focus:outline-none transition-colors font-mono text-sm"
                      rows={12}
                      value={previewCode}
                      onChange={(e) => setPreviewCode(e.target.value)}
                      placeholder={`كود المعاينه هنا...`}
                    />
                    {previewCode && (
                      <p className="mt-2 text-sm text-green-600">
                        ✓ تم إدخال {previewCode.length} حرف
                      </p>
                    )}
                  </div>
                ),
              },
            ]}
          />
        </div>

        {/* زر الحفظ */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-black text-white px-6 py-4 rounded-lg font-bold text-lg hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98]"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                جاري الحفظ...
              </span>
            ) : (
              "حفظ المنتج"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
