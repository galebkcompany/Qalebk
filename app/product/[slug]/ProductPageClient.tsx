// app/product/[slug]/ProductPageClient.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Eye, Heart, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabaseClient";
import Footer from "@/app/components/Footer";
import FaqSection from "@/app/components/FaqSection";

interface Product {
  id: string;
  name: string;
  description: string;
  image_url: string;
  customizable_fields?: string | null;
  preview_url: string | null;
  platforms: string[];
  installation_guide: string | null;
  is_featured: boolean;
  prices: {
    amount: number;
    currency: string;
    price_label: string;
  };
}

interface Review {
  id: string;
  rating: number;
  review_text: string | null;
  created_at: string;
}

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

export default function ProductPageClient({
  product,
  slug,
}: {
  product: Product;
  slug: string;
}) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  const router = useRouter();

  type AddToFavoriteState = "idle" | "loading" | "success";
  const [favoriteState, setFavoriteState] =
    useState<AddToFavoriteState>("idle");

  // حساب السعر الأصلي (مثال: إذا كان السعر الحالي 49 والخصم 50%)
  const originalPrice = product.prices.amount * 2;
  const discount = 50;

  const toggleSection = (sectionId: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  useEffect(() => {
    if (!product?.id) return;

    const fetchReviews = async () => {
      setReviewsLoading(true);

      const { data, error } = await supabase
        .from("reviews")
        .select("id, rating, review_text, created_at")
        .eq("product_id", product.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("فشل جلب التقييمات:", error);
        setReviews([]);
      } else {
        setReviews(data || []);
      }

      setReviewsLoading(false);
    };

    fetchReviews();
  }, [product.id]);

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  const handleBuyNow = () => {
    // 1. إرسال الحدث إلى Google Analytics كحدث رئيسي
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "begin_checkout", {
        currency: "SAR", // أو العملة التي تستخدمها
        value: product.prices.amount,
        items: [
          {
            item_id: product.id,
            item_name: product.name,
            price: product.prices.amount,
          },
        ],
      });
    }
    // الانتقال مباشرة إلى صفحة الدفع مع product_id
    router.push(`/checkout?product=${product.id}`);
  };

  const handleAddToFavorite = () => {
    if (favoriteState !== "idle") return;

    setFavoriteState("loading");

    setTimeout(() => {
      setFavoriteState("success");

      setTimeout(() => {
        setFavoriteState("idle");
      }, 2000);
    }, 1200);
  };

  // const addToCart = () => {
  //   const item = {
  //     id: product.id,
  //     name: product.name,
  //     price: product.prices.amount,
  //     image_url: product.image_url,
  //     slug: slug,
  //     is_featured: product.is_featured,
  //     product_url: `/product/${slug}`, // الرابط الذي سيتم الانتقال إليه
  //   };

  //   // جلب البيانات الحالية من localStorage
  //   const cart = JSON.parse(localStorage.getItem("cart") || "[]");

  //   const exists = cart.some((p: any) => p.id === item.id);
  //   if (exists) return;

  //   // حفظ القائمة الجديدة
  //   localStorage.setItem("cart", JSON.stringify([...cart, item]));

  //   // إرسال تنبيه لتحديث العداد في القائمة العلوية (Navbar) إذا وجد
  //   window.dispatchEvent(new Event("cart-updated"));
  // };

  const addToFavorite = () => {
    const item = {
      id: product.id,
      name: product.name,
      price: product.prices.amount,
      image_url: product.image_url,
      slug: slug,
      is_featured: product.is_featured,
      product_url: `/product/${slug}`,
    };

    // جلب المفضلة الحالية
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");

    const exists = favorites.some((p: any) => p.id === item.id);
    if (exists) return;

    // 1. إرسال الحدث إلى Google Analytics (حدث تتبع عادي)
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "add_to_favorite", {
        currency: "SAR",
        value: item.price,
        items: [
          {
            item_id: item.id,
            item_name: item.name,
            price: item.price,
          },
        ],
      });
    }

    localStorage.setItem("favorites", JSON.stringify([...favorites, item]));

    // إشعار لتحديث العداد (Navbar مثلاً)
    window.dispatchEvent(new Event("favorites-updated"));
  };

  return (
    <main className="min-h-screen bg-white" dir="rtl">
      <div className="max-w-7xl mx-auto px-2 py-8">
        {/* صورة المنتج - تظهر أولاً على جميع الشاشات */}
        <div className="relative bg-gray-100 border border-gray-100 overflow-hidden w-full lg:hidden">
          {product.is_featured && (
            <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-[10px] uppercase tracking-wider font-bold px-2 py-1 sm:px-3 sm:text-[11px] rounded-full shadow-lg">
              <span>مميز</span>
              <span>★</span>
            </div>
          )}
          {product.image_url.endsWith(".mp4") ? (
            <video
              src={product.image_url}
              muted
              loop
              autoPlay
              playsInline
              preload="metadata"
              className="w-full h-full object-cover"
            />
          ) : (
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover"
              loading="lazy"
              draggable={false}
            />
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[3fr_1fr] gap-12">
          {/* الجانب الايمن - المحتوى فقط */}
          <div className="space-y-8 order-2 lg:order-1">
            {/* صورة المنتج - تظهر فقط على الشاشات الكبيرة */}
            <div className="hidden lg:block relative bg-gray-100 border border-gray-100 overflow-hidden w-full">
              {product.is_featured && (
                <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-[10px] uppercase tracking-wider font-bold px-2 py-1 sm:px-3 sm:text-[11px] rounded-full shadow-lg">
                  <span>مميز</span>
                  <span>★</span>
                </div>
              )}
              {product.image_url.endsWith(".mp4") ? (
                <video
                  src={product.image_url}
                  muted
                  loop
                  autoPlay
                  playsInline
                  preload="metadata"
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  draggable={false}
                />
              )}
            </div>
            {/* تفاصيل المنتج */}
            <ProductSection title="وصف القسم" content={product.description} />
            {/* الحقول القابلة للتخصيص */}
            {product.customizable_fields?.trim() && (
              <ProductSection
                title="الحقول القابلة للتخصيص"
                content={product.customizable_fields}
              />
            )}
            {/* المنصات المدعومة */}
            {product.platforms && product.platforms.length > 0 && (
              <div className="space-y-3">
                <h2 className="text-xl font-medium text-gray-900">
                  المنصات المدعومة
                </h2>
                <div className=" rounded-xl p-6">
                  <div className="flex flex-wrap gap-2">
                    {product.platforms.map((platform, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 bg-white border border-gray-300 rounded-full text-sm font-medium text-gray-800"
                      >
                        {platform}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
            {/* طريقة التركيب */}
            {product.installation_guide && (
              <ProductSection
                title="طريقة التركيب"
                content={product.installation_guide}
              />
            )}
          </div>

          {/* الجانب الايسر */}
          <div className="space-y-6 py-8 order-1 lg:order-2">
            {/* قسم السعر */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-black">
                  {product.prices.amount} {product.prices.currency}
                </span>
                <span className="text-lg text-gray-400 line-through">
                  {originalPrice} {product.prices.currency}
                </span>
              </div>
              <p className="text-green-500 font-medium text-base">
                قسم إضافي مجاني لأول 10 عملاء!
              </p>
            </div>

            {/* العنوان*/}
            <div className="space-y-2">
              <p className="text-gray-800 leading-relaxed text-base">
                {product.name}
              </p>
            </div>

            {product.preview_url ? (
              <Link
                href={`${product.preview_url}?id=${product.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-full flex items-center justify-center gap-2 transition-colors duration-200 active:scale-95"
              >
                معاينة القسم
                <Eye size={20} />
              </Link>
            ) : (
              <div className="w-full bg-gray-100 text-gray-500 font-semibold py-3 px-6 rounded-full flex items-center justify-center gap-2 cursor-not-allowed">
                لا يوجد رابط معاينة
                <Eye size={20} />
              </div>
            )}

            {/* زر الشراء والإضافة إلى المفضلة */}
            <div className="flex items-center gap-2">
              {/* زر اشترِ الآن */}
              <button
                onClick={handleBuyNow}
                className="
            flex-[9]
      bg-black hover:bg-gray-900
      text-white font-semibold
      py-3 px-6 rounded-full
      transition-all duration-300
      active:scale-95
    "
              >
                الحصول على القسم
              </button>

              {/* زر إضافة إلى السلة */}
              <button
                onClick={() => {
                  addToFavorite();
                  handleAddToFavorite();
                }}
                disabled={favoriteState !== "idle"}
                className={`
      flex-[2]
      h-[47px]
      flex items-center justify-center
      rounded-full
      transition-all duration-300
      ${
        favoriteState === "success"
          ? "bg-white border border-gray-300"
          : "bg-white border border-gray-300 hover:bg-gray-100"
      }
      disabled:cursor-not-allowed
    `}
              >
                {favoriteState === "idle" && (
                  <Heart size={20} className="text-black" />
                )}

                {favoriteState === "loading" && (
                  <span className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                )}

                {favoriteState === "success" && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 text-black"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </button>
            </div>

            {/* ماذا سيوفر لك قالبك */}
            <div className="border-t border-gray-200 pt-10 space-y-8">
              <h3 className="font-semibold text-black text-lg">
                ماذا سيوفر لك قالبك؟
              </h3>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <img
                    src="/icons/verifi.svg"
                    alt="verified"
                    className="w-5 h-5 mt-1 opacity-70"
                  />
                  <div>
                    <p className="font-semibold text-black">توفير الوقت</p>
                    <p className="text-gray-600 text-sm leading-relaxed mt-1">
                      لا تحتاج مصمم أو مطور. انسخ والصق القسم خلال 5 دقائق فقط.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <img
                    src="/icons/verifi.svg"
                    alt="verified"
                    className="w-5 h-5 mt-1 opacity-70"
                  />
                  <div>
                    <p className="font-semibold text-black">توفير المال</p>
                    <p className="text-gray-600 text-sm leading-relaxed mt-1">
                      احصل على واجهة احترافية بدون دفع مئات الريالات لمصمم او
                      مطور.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <img
                    src="/icons/verifi.svg"
                    alt="verified"
                    className="w-5 h-5 mt-1 opacity-70"
                  />
                  <div>
                    <p className="font-semibold text-black">
                      زيادة معدل التحويل
                    </p>
                    <p className="text-gray-600 text-sm leading-relaxed mt-1">
                      الواجهة الاحترافية تلفت انتباه العميل وتزيد احتمالية
                      الشراء.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* تفاصيل إضافية */}
            <div className="space-y-3 border-t border-gray-200 pt-7">
              <h3 className="font-semibold text-black text-lg">تفاصيل القسم</h3>

              {/* يباع بواسطة */}
              {/* <DetailItem label="يباع بواسطة" value="قالبك" /> */}

              {/* نوع المنتج */}
              <DetailItem label="نوع المنتج" value="منتج رقمي" />

              {/* طريقة الاستلام - ضرورية جداً لـ Paddle */}
              <DetailItem label="طريقة الاستلام" value="تحميل فوري" />

              {/* ما الذي ستحصل عليه؟ */}
              <DetailItem label="انواع الملف" value=" ملف HTML و ملفJS" />

              {/*  التجاوب */}
              <DetailItem
                label="التجاوب"
                value="متجاوب مع جميع الأجهزة والشاشات"
              />
            </div>

            {/* الأسئلة الشائعة والدعم */}
            <div className="space-y-6">
              {/* التوصيل */}
              <CollapsibleSection
                id="delivery"
                title="التوصيل: تحميل فوري"
                content="المنتجات التي يتم تنزيلها فوراً لا تقبل عمليات الاسترجاع أو الاستبدال، في حال وجود مشكلة يرجي التواصل مع الدعم."
                isOpen={openSections["delivery"] || false}
                onToggle={() => toggleSection("delivery")}
              />

              {/* الأسئلة الشائعة */}
              <FaqSection
                title="الأسئلة الشائعة"
                faqs={[
                  {
                    question: "هل المنتج يعمل على جميع المنصات؟",
                    answer:
                      "نعم، المنتج متوافق مع جميع المنصات الرئيسية المذكورة في قسم المنصات المدعومة. ويعمل ايضعا على المنصات التي تدعم الحقن البرمجي.",
                  },
                  {
                    question: "هل يمكن استرجاع المنتج بعد الشراء؟",
                    answer:
                      "بما أن المنتج رقمي ويتم تحميله فورًا، لا يمكن استرجاعه بعد الشراء. الا في حال وجود مشكلة تقنية",
                  },
                  {
                    question: "هل أحتاج خبرة برمجية لتركيبه؟",
                    answer:
                      "لا، المنتج مصمم يكون سهل التركيب  وليعمل مباشرة على متجرك، ويتم توفير دليل تركيب واضح.",
                  },
                ]}
              />

              {/* تواصل مع الدعم */}
              <Link
                href="/support"
                className="w-full bg-gray-50 hover:bg-gray-200 text-gray-900 font-semibold py-3 px-5 rounded-full transition-colors duration-200 text-sm"
              >
                هل تحتاج الى المساعده؟ تواصل معنا
              </Link>
            </div>
          </div>
        </div>
        {reviews.length === 0 && (
            <div className="space-y-3  mt-10 m-2 md:ml-10 md:mr-10">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-medium text-gray-900">
                  تقييمات المنتج (0)
                </h2>
                <div className="flex items-center gap-1 bg-yellow-50 px-3 py-1 rounded-full">
                  <span className="text-2xl font-base text-black">
                    {averageRating.toFixed(1)}
                  </span>
                  <img src="/icons/star.svg" alt="star" className="w-6 h-6" />
                </div>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 text-center">
                <p className="text-gray-700 font-medium">لا توجد تقييمات بعد</p>
                <p className="text-sm text-gray-500 mt-4  ">
                  منتج جديد كن اول من يترك تقييمًا! ❤
                </p>
              </div>
            </div>
          )}

          {/* التقييمات */}
          {reviews && reviews.length > 0 && (
              <div className="space-y-3 mt-10 m-2 md:ml-10 md:mr-10">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-medium text-gray-900">
                  تقييمات القسم ({reviews.length})
                </h2>
                <div className="flex items-center gap-1 bg-yellow-50 px-3 py-1 rounded-full">
                  <span className="text-2xl font-base text-black">
                    {averageRating.toFixed(1)}
                  </span>
                  <img src="/icons/star.svg" alt="star" className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-8">
                {reviews.slice(0, 3).map((review) => (
                  <div
                    key={review.id}
                    className="border-b border-gray-200 last:border-0 pb-4 last:pb-0"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <img
                              key={i}
                              src={
                                i < review.rating
                                  ? "/icons/star.svg"
                                  : "/icons/staroff.svg"
                              }
                              alt="star"
                              className="w-6 h-6"
                            ></img>
                          ))}
                        </div>
                        <span className="text-sm font-medium text-gray-700">
                          {review.rating}/5
                        </span>
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(review.created_at).toLocaleDateString(
                          "ar-SA",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          },
                        )}
                      </span>
                    </div>
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                      {review.review_text || "—"}
                    </p>
                  </div>
                ))}

                {/* زر عرض المزيد */}
                {reviews.length > 3 && (
                  <button
                    onClick={() => setShowAllReviews(true)}
                    className="w-full mt-4 py-2 text-center text-gray-600 hover:text-gray-900 font-medium transition-colors"
                  >
                    عرض المزيد من التقييمات ←
                  </button>
                )}
              </div>

              {/* النافذة المنبثقة */}
              {showAllReviews && (
                <div className="fixed inset-0 bg-black/30 bg-opacity-50 z-50 flex items-center justify-center p-4">
                  <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[80vh] overflow-hidden flex flex-col">
                    {/* رأس النافذة */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-300">
                      <div className="flex items-center gap-3">
                        <h3 className="text-2xl font-bold text-gray-900">
                          جميع التقييمات ({reviews.length})
                        </h3>
                        <div className="flex items-center gap-1 bg-yellow-50 px-3 py-1 rounded-full">
                          <span className="text-2xl font-base text-black">
                            {averageRating.toFixed(1)}
                          </span>
                          <img
                            src="/icons/star.svg"
                            alt="star"
                            className="w-5 h-5"
                          />
                        </div>
                      </div>
                      <button
                        onClick={() => setShowAllReviews(false)}
                        className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                      >
                        ×
                      </button>
                    </div>

                    {/* محتوى التقييمات */}
                    <div className="overflow-y-auto p-6 space-y-4">
                      {reviews.slice(0, 10).map((review) => (
                        <div
                          key={review.id}
                          className="border-b border-gray-200 last:border-0 pb-4 last:pb-0"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <img
                                    key={i}
                                    src={
                                      i < review.rating
                                        ? "/icons/star.svg"
                                        : "/icons/staroff.svg"
                                    }
                                    alt="star"
                                    className="w-5 h-5"
                                  ></img>
                                ))}
                              </div>
                              <span className="text-sm font-medium text-gray-700">
                                {review.rating}/5
                              </span>
                            </div>
                            <span className="text-sm text-gray-500">
                              {new Date(review.created_at).toLocaleDateString(
                                "ar-SA",
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                },
                              )}
                            </span>
                          </div>
                          <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                            {review.review_text}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
      </div>
      <Footer />
    </main>
  );
}

// مكون التفاصيل
function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start">
      <div>
        <p className="text-gray-700 text-base">
          <span className="font-semibold">{label}:</span> {value}
        </p>
      </div>
    </div>
  );
}

// مكون القسم القابل للتوسع
function CollapsibleSection({
  id,
  title,
  content,
  isOpen,
  onToggle,
}: {
  id: string;
  title: string;
  content: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="overflow-hidden ">
      <button
        onClick={onToggle}
        className="w-full bg-gray-50  rounded-full hover:bg-gray-200 text-gray-900 font-semibold py-4 px-4 flex items-center justify-between transition-colors duration-200"
      >
        <span className="text-sm">{title}</span>
        <ChevronDown
          size={20}
          className={`transition-transform duration-200 flex-shrink-0 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      {isOpen && (
        <div className="bg-white p-3 text-gray-700 text-sm leading-relaxed border rounded-xl mt-2 border-gray-100">
          {content}
        </div>
      )}
    </div>
  );
}

// مكون قسم المنتج

function ProductSection({
  title,
  content,
}: {
  title: string;
  content: string;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      const lineHeight = parseFloat(
        getComputedStyle(contentRef.current).lineHeight,
      );
      const maxHeight = lineHeight * 7;
      const actualHeight = contentRef.current.scrollHeight;

      setShowButton(actualHeight > maxHeight + 6); // 5px هامش للدقة
    }
  }, [content]);

  return (
    <div className="space-y-3">
      <h2 className="text-xl font-medium text-gray-900">{title}</h2>
      <div className="relative">
        <div
          ref={contentRef}
          className="bg-[#FCFCFC] rounded-xl p-6 text-gray-800 text-lg whitespace-pre-line overflow-hidden transition-all duration-300"
          style={{
            lineHeight: "1.75rem",
            maxHeight: !isExpanded && showButton ? "calc(1.75rem * 7)" : "none",
            WebkitMaskImage:
              !isExpanded && showButton
                ? "linear-gradient(to bottom, black 70%, transparent 100%)"
                : "none",
            maskImage:
              !isExpanded && showButton
                ? "linear-gradient(to bottom, black 70%, transparent 100%)"
                : "none",
          }}
        >
          {content}
        </div>

        {showButton && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-3 px-4 text-blue-600 hover:text-blue-700 font-medium text-base transition-colors flex items-center gap-1"
          >
            {isExpanded ? (
              <>
                عرض أقل
                <svg
                  className="w-4 h-4 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 15l7-7 7 7"
                  />
                </svg>
              </>
            ) : (
              <>
                عرض المزيد
                <svg
                  className="w-4 h-4 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
