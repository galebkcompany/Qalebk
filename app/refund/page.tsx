import Footer from "@/app/components/Footer";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "سياسة الاسترجاع",
  description: "سياسة الاسترجاع الخاصة بمنصة قالبك",
};

export default function Refund() {
  return (
    <>
      <div className="min-h-screen bg-white text-black">
        {/* Header */}
        <header className="border-b border-gray-200 py-8">
          <div className="container max-w-4xl mx-auto space-y-8">
            <h1 className="text-4xl font-bold mb-2">سياسة الاسترجاع</h1>
            <p className="text-gray-600">قالبك</p>
          </div>
        </header>

        {/* Content */}
        <main className="py-12">
          <div className="container max-w-4xl mx-auto space-y-8">
            {/* Digital Products Nature */}
            <section>
              <h2 className="text-2xl font-bold mb-4">
                طبيعة المنتجات الرقمية
              </h2>
              <p className="text-gray-700 leading-relaxed">
                تقدم قالبك منتجات رقمية غير ملموسة (أكواد برمجية). بموجب طبيعة
                هذه المنتجات، يتم تسليمها فوراً عند إتمام عملية الدفع. نظراً لأن
                المنتجات الرقمية لا يمكن إرجاعها أو استبدالها بعد التسليم، فإن
                سياسة الاسترجاع الخاصة بنا تتبع المعايير الدولية للمنتجات
                الرقمية.
              </p>
            </section>

            {/* Accepted Refund Cases */}
            <section>
              <h2 className="text-2xl font-bold mb-4">
                حالات الاسترجاع المقبولة
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                لا يوجد استرجاع بمجرد إتمام الدفع واستلام الكود، باستثناء
                الحالات التالية:
              </p>
              <div className="space-y-4 mr-6">
                <div className="border-r-4 border-black pr-4">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    خلل فني مثبت
                  </h3>
                  <p className="text-gray-700 mb-3">
                    في حالة اكتشاف خلل فني في الكود يمنع تشغيله بشكل صحيح أو
                    يسبب أخطاء برمجية واضحة ، يحق للعميل طلب استرجاع المبلغ
                    المدفوع خلال 14 يوماً من تاريخ الشراء. يجب على العميل تقديم
                    دليل واضح على الخلل (لقطات شاشة، رسائل الأخطاء، وصف مفصل
                    للمشكلة).
                  </p>
                </div>
                <div className="border-r-4 border-black pr-4">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    عدم توافق المنصة
                  </h3>
                  <p className="text-gray-700">
                    إذا كان الكود غير متوافق مع منصة المتجر الإلكتروني المُعلن
                    عنها، يحق للعميل طلب استرجاع المبلغ خلال 14 يوماً من الشراء.
                  </p>
                  <p className="text-gray-700 mt-4">
                    مسؤولية التحقق من توافق الكود مع المنصة تقع على العميل قبل
                    الشراء بناءً على الأقسام المدعومة المذكورة في صفحة المنتج.
                  </p>
                </div>
              </div>
            </section>

            {/* Refund Request Process */}
            <section>
              <h2 className="text-2xl font-bold mb-4">عملية طلب الاسترجاع</h2>
              <p className="text-gray-700 leading-relaxed">
                يجب على العميل تقديم طلب الاسترجاع عبر التواصل مع فريق الدعم{" "}
                <span className="font-semibold">
                  {" "}
                  <a
                href="mailto:support@qalebk.com"
                className="mt-2 inline-block font-semibold text-blue-600 hover:underline"
              >
                support@qalebk.com
              </a>
                </span>{" "}
                مع تقديم الأدلة الكافية على الخلل. ستقوم فريق قالبك بفحص الطلب
                والرد خلال 5 أيام عمل.
              </p>
            </section>

            {/* Refund Exceptions */}
            <section>
              <h2 className="text-2xl font-bold mb-4">
                استثناءات من الاسترجاع
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                لا يتم قبول طلبات الاسترجاع في الحالات التالية:
              </p>
              <ul className="space-y-2 mr-6 text-gray-700">
                <li className="flex items-start">
                  <span className="ml-3 font-bold">•</span>
                  <span>
                    إذا كان الخلل ناتجاً عن تعديلات أجراها العميل على الكود.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="ml-3 font-bold">•</span>
                  <span>إذا مضى أكثر من 14 يوماً على تاريخ الشراء.</span>
                </li>
                <li className="flex items-start">
                  <span className="ml-3 font-bold">•</span>
                  <span>
                    إذا كان الكود قد تم استخدامه بالفعل في متجر حي أو تم توزيعه
                    على أطراف ثالثة.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="ml-3 font-bold">•</span>
                  <span>
                    إذا كان الطلب يتعلق برغبة العميل الشخصية في عدم الرضا عن
                    التصميم أو الوظائف.
                  </span>
                </li>
              </ul>
            </section>

            {/* Refund Processing */}
            <section>
              <h2 className="text-2xl font-bold mb-4">معالجة الاسترجاع</h2>
              <p className="text-gray-700 leading-relaxed">
                في حالة الموافقة على طلب الاسترجاع، سيتم معالجة المبلغ المسترد
                خلال 7-10 أيام عمل عبر نفس طريقة الدفع المستخدمة في الشراء.
              </p>
            </section>

            {/* Important Notes */}
            <section className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <h2 className="text-xl font-bold mb-4">ملاحظات مهمة</h2>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="ml-3 font-bold">•</span>
                  <span>
                    جميع طلبات الاسترجاع يجب أن تكون مدعومة بأدلة واضحة وموثقة.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="ml-3 font-bold">•</span>
                  <span>
                    الفترة الزمنية للاسترجاع هي 14 يوماً فقط من تاريخ الشراء.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="ml-3 font-bold">•</span>
                  <span>
                    نحتفظ بالحق في رفض طلبات الاسترجاع التي لا تستوفي الشروط
                    المذكورة أعلاه.
                  </span>
                </li>
              </ul>
            </section>

            {/* Contact */}
            <section className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <h2 className="text-xl font-bold mb-3">التواصل</h2>
              <p className="text-gray-700 leading-relaxed">
                إذا كان لديك أي أسئلة أو استفسارات بخصوص سياسة الاسترجاع، لا
                تتردد في التواصل معنا عبر البريد الإلكتروني التالي:
              </p>

              <a
                href="mailto:support@qalebk.com"
                className="mt-2 inline-block font-semibold text-blue-600 hover:underline"
              >
                support@qalebk.com
              </a>
            </section>
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
}
