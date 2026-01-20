"use client";

import { useState } from "react";
import Footer from "@/app/components/Footer";
import Faq from "@/app/components/Faq";

type Tab = "platform" | "sections";

export default function FaqPage() {
  const [activeTab, setActiveTab] = useState<Tab>("platform");

  return (
    <main className="min-h-screen bg-white" dir="rtl">
      <div className="max-w-5xl mx-auto px-4 py-12 space-y-10">
        {/* العنوان */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">الأسئلة الشائعة</h1>
          <p className="text-gray-600 text-sm">
            هنا ستجد إجابات لأكثر الأسئلة شيوعًا حول منصة قالبك
          </p>
        </div>

        {/* التبويبات */}
        <div className="flex justify-center gap-2">
          <TabButton
            active={activeTab === "platform"}
            onClick={() => setActiveTab("platform")}
          >
            حول قالبك
          </TabButton>

          <TabButton
            active={activeTab === "sections"}
            onClick={() => setActiveTab("sections")}
          >
            حول الأقسام
          </TabButton>
        </div>

        {/* محتوى */}
        <div className="space-y-4">
          {activeTab === "platform" && (
            <Faq
              faqs={[
                {
                  question: "ما هي منصة قالبك؟",
                  answer:
                    "قالبك منصة متخصصة في بيع الأقسام والقوالب الجاهزة للمتاجر و المواقع الإلكترونية.",
                },
                {
                  question: "ما الذي سأحصل عليه بالضبط عند شراء قسم من قالبك؟",
                  answer:
                    "عند الشراء، ستحصل على ملف رقمي يحتوي على الأكواد المصدرية البرمجية (HTML, CSS, JavaScript) للقسم الذي اخترته. هذه الأكواد جاهزة للنسخ واللصق مباشرة في متجرك الإلكتروني (سلة، زد، أو أي موقع مخصص).",
                },

                {
                  question: "كيف سأستلم المنتج بعد الدفع؟",
                  answer:
                    "التسليم فوري وآلي. بمجرد إتمام عملية الدفع عبر Lemon Squeezy، سيظهر لك رابط تحميل ونسخ مباشر للملفات، ويمكنك دائماً الوصول لمشترياتك عبر لوحة التحكم في حسابك على قالبك.",
                },
              ]}
            />
          )}

          {activeTab === "sections" && (
            <Faq
              faqs={[
                {
                  question: "هل تعمل هذه الأقسام على منصات 'سلة' و 'زد'؟",
                  answer:
                    "نعم، تم تصميم واختبار جميع أقسام 'قالبك' لتكون متوافقة تماماً مع منصات التجارة الإلكترونية التي تدعم إضافة الأكواد المخصصة (Custom CSS/JS) مثل سلة (Salla) وزد (Zid) و شوبيفاي (Shopify)، بالإضافة إلى المواقع البرمجية الخاصة. ومع ذلك، ننصح دائماً بمراجعة دليل التركيب الخاص بكل قسم للتأكد من التوافق الكامل مع المنصة التي تستخدمها.",
                },

                {
                  question: "هل أحتاج إلى خبرة في البرمجة لاستخدام هذه الأقسام؟",
                  answer:
                    "لا، لا تحتاج لأن تكون مبرمجاً. نحن نصمم الأقسام لتكون سهلة الاستخدام قدر الإمكان. نوفر لك تعليمات واضحة حول كيفية نسخ الكود ولصقه في إعدادات متجرك، مما يمنحك تصميماً احترافياً خلال دقائق دون كتابة سطر برمج واحد.",
                },
                {
                  question: "هل يمكن تعديل التصميم؟",
                  answer: "نعم، بعد شراء القسم يمكنك تعديل التصميم بسهولة.",
                },
                {
                  question: "هل هنالك دعم فني إذا واجهتني مشكلة في التركيب؟",
                  answer:
                    "نعم، نحن نقدم دعم فني عبر واتساب لمساعدتك في تركيب الأقسام وحل أي مشاكل قد تواجهها.",
                },
                {
                  question: "هل يمكنني استخدام الكود الذي اشتريته في أكثر من متجر؟",
                    answer:"رخصة الشراء تمنحك الحق في استخدام القسم البرمجي في متاجرك فقط.  ولا يسمح لك بإعادة بيع أو توزيع الأكواد التي تشتريها من قالبك.",
                },
                {
                  question: "هل تؤثر هذه الأقسام على سرعة تحميل متجري؟",
                    answer:"أبداً، نحن في 'قالبك' نولي أداء الموقع أهمية قصوى. جميع الأقسام تُكتب برمجياً باستخدام (Native HTML/CSS) بدون الاعتماد على مكتبات ثقيلة أو أكواد خارجية تؤدي لبطء الموقع، مما يضمن بقاء متجرك سريعاً وصديقاً لمحركات البحث (SEO).",
                },

                {
                  question: "ماذا لو تغير تصميم منصة سله أو زد ، هل سيتوقف الكود عن العمل؟",
                  answer:
                    "الكود الذي نقدمه يعتمد على معايير الويب القياسية (HTML/CSS/JavaScript) وليس على تصميم معين لمنصة سلة أو زد. لذلك، حتى إذا تغير تصميم المنصة، سيظل الكود يعمل بشكل صحيح في متجرك. ومع ذلك، قد تحتاج إلى إجراء بعض التعديلات الطفيفة إذا كانت هناك تغييرات كبيرة في بنية المنصة.",
                },


              ]}
            />
          )}
        </div>
      </div>

      <Footer />
    </main>
  );
}

/* زر التبويب */
function TabButton({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`
        px-6 py-2 rounded-full text-sm font-semibold transition-all
        ${
          active
            ? "bg-black text-white"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        }
      `}
    >
      {children}
    </button>
  );
}
