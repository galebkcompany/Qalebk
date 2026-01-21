import Footer from "@/app/components/Footer";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "شروط الاستخدام",
  description: "شروط الاستخدام الخاصة بمنصة قالبك",
};

export default function Terms() {
  return (
    <>
      <div className="min-h-screen bg-white text-black">
        {/* Header */}
        <header className="border-b border-gray-200 py-8">
          <div className="container max-w-4xl mx-auto space-y-8">
            <h1 className="text-4xl font-bold mb-2">شروط الاستخدام</h1>
            <p className="text-gray-600">قالبك</p>
          </div>
        </header>

        {/* Content */}
        <main className="py-12">
          <div className="container max-w-4xl mx-auto space-y-8">
            {/* Introduction */}
            <section>
              <h2 className="text-2xl font-bold mb-4">مقدمة</h2>
              
              <p className="text-gray-700 leading-relaxed mb-4">
                
                قالبك هو سوق رقمي رائد متخصص في توفير أقسام واجهة مستخدم (UI
                Sections) برمجية جاهزة (تعتمد على HTML, CSS, JavaScript) مصممة
                خصيصاً للمتاجر والمواقع الإلكترونية. تهدف المنصة إلى تمكين أصحاب
                المتاجر من تحسين مظهر واحترافية مواقعهم بسهولة. يتميز نظامنا
                بالأتمتة الكاملة، حيث يتم تسليم الأكواد والملفات الرقمية للعميل
                فوراً بعد إتمام عملية الشراء مباشرة.{" "}
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                  <span className="font-bold text-gray-700">
                    {" "}
                    نقر ونؤكد أن جميع الأكواد والتصاميم المعروضة هي من تطويرنا
                    الخاص وحصرية لمنصة "قالبك"، ونحن المالك الوحيد والأساسي لهذه
                    المنتجات، ولا نسمح لبائعين خارجيين بعرض منتجاتهم عبر منصتنا.
                  </span>
                </p>
              <p className="text-gray-700 leading-relaxed">
                يرحب بك قالبك في منصتنا. يتم تنظيم استخدامك لخدماتنا بموجب شروط
                الاستخدام التالية. بمجرد شرائك لأي منتج أو خدمة من قالبك، فإنك
                توافق على الالتزام بجميع الشروط والأحكام المذكورة أدناه.
              </p>
            </section>

            {/* Services Definition */}
            <section>
              <h2 className="text-2xl font-bold mb-4">
                تعريف المنتجات والخدمات
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                تقدم قالبك أكواداً برمجية جاهزة (HTML/CSS/JavaScript) مصممة
                خصيصاً للمتاجر الإلكترونية. تشمل خدماتنا:
              </p>
              <div className="space-y-3 mr-6">
                <div>
                  <h3 className="font-semibold text-gray-900">الأساسية</h3>
                  <p className="text-gray-700">
                    توفير الكود الخام (Raw Code) بملكية استخدام شخصي للعميل، مع
                    تسليم فوري بعد إتمام عملية الدفع.
                  </p>
                </div>
              </div>
            </section>

            {/* Ownership and Usage */}
            <section>
              <h2 className="text-2xl font-bold mb-4">
                شروط الملكية والاستخدام
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                الكود المشترى من قالبك مخصص للاستخدام الشخصي والحصري للعميل فقط.
                يحق للعميل استخدام الكود في متجره او موقعه فقط .
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">
                حقوق الملكية الفكرية والترخيص
              </h2>
              <p className="text-gray-700 leading-relaxed">
                جميع المنتجات، الأكواد البرمجية، التصاميم، والشعارات المعروضة
                على منصة "قالبك" هي ملكية فكرية حصرية للمنصة ومحمية بموجب قوانين
                حقوق النشر الدولية.
              </p>
              <p className="text-gray-700 leading-relaxed mt-2">
                عند شرائك لأي منتج من "قالبك"، فإنك لا تشتري ملكية الكود نفسه،
                بل تشتري "ترخيص استخدام" (License to Use) يمنحك الحقوق التالية:
              </p>

              <ul className="space-y-2 mr-6 mt-2 text-gray-700">
                <li className="flex items-start">
                  <span className="ml-3 font-bold">•</span>
                  <span>
                    {" "}
                    1-يحق لك استخدام المنتج في مشروع شخصي أو تجاري واحد.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="ml-3 font-bold">•</span>
                  <span>2-يحق لك تعديل الكود ليناسب احتياجاتك.</span>
                </li>
              </ul>

              <p className="text-gray-700 font-bold leading-relaxed mt-4">
                المحظورات:
              </p>
              <ul className="space-y-2 mr-6 mt-2 text-gray-700">
                <li className="flex items-start">
                  <span className="ml-3 font-bold">•</span>
                  <span>
                    1-يمنع منعاً باتاً إعادة بيع، توزيع، أو مشاركة الكود المصدري
                    (Source Code) مع أي طرف ثالث مجاناً أو بمقابل.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="ml-3 font-bold">•</span>
                  <span>
                    2-لا يحق لك دمج المنتج في منتج آخر يتم بيعه كقالب أو أداة
                    تصميم (Reselling as a template).
                  </span>
                </li>
              </ul>

              <p className="text-gray-700 leading-relaxed mt-4">
                أي انتهاك لهذه الشروط يعرضك للمسائلة القانونية وإلغاء الترخيص
                فوراً دون استرداد للأموال.
              </p>
            </section>

            {/* Delivery Terms */}
            <section>
              <h2 className="text-2xl font-bold mb-4">التسليم والوصول</h2>
              <p className="text-gray-700 leading-relaxed">
                يتم تسليم المنتجات إلكترونياً فور إتمام الدفع بنجاح عبر رابط
                مباشر
              </p>
              <ul className="list-disc list-inside mt-2 text-gray-700">
                <li>
                  نحتفظ بالحق في إيقاف رابط التحميل في حال رصدنا نشاطاً مشبوهاً
                  (مثل مشاركة الرابط علنياً).
                </li>
              </ul>
            </section>

            {/* Modifications Responsibility */}
            <section>
              <h2 className="text-2xl font-bold mb-4">مسؤولية التعديلات</h2>
              <p className="text-gray-700 leading-relaxed">
                قالبك غير مسؤولة عن أي تعديلات يجريها العميل على الكود او أي
                تحديثات تجريها منصات المتاجر (مثل سلة أو زد وغيرها) قد تؤدي
                لتعطل الكود مستقبلاً، ولكننا سنبذل جهدنا لتوفير تحديثات متوافقة,
                في حالة قيام العميل بتعديل الكود بطريقة خاطئة وأدت إلى تعطل
                متجره أو ظهور أخطاء، فإن قالبك غير مسؤولة عن إصلاح هذه الأخطاء
                أو تعويض العميل عن أي خسائر ناتجة عنها.
              </p>
            </section>

            {/* Legal Compliance */}
            <section>
              <h2 className="text-2xl font-bold mb-4">الامتثال للقوانين</h2>
              <p className="text-gray-700 leading-relaxed">
                يوافق العميل على استخدام خدمات قالبك بما يتوافق مع جميع القوانين
                والتشريعات المعمول بها في دولته. يُمنع استخدام الكود لأغراض غير
                قانونية أو تنتهك حقوق الملكية الفكرية للآخرين.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">
                معالجة المدفوعات والضرائب
              </h2>
              <p className="text-gray-700 leading-relaxed">
                يتم معالجة جميع عمليات الشراء على منصة 'قالبك' بواسطة{" "}
                <span className="font-semibold">Lemon Squeezy</span>. يعتبر
                Lemon Squeezy هو تاجر السجل (Merchant of Record) لجميع طلباتنا،
                وهو المسؤول عن معالجة المدفوعات، الضرائب، وخدمة العملاء المتعلقة
                بالفواتير.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">
                إخلاء المسؤولية عن الأرباح
              </h2>
              <p className="text-gray-700">
                قالبك تقدم أدوات وأكواد برمجية لتحسين مظهر المتجر الإلكتروني. لا
                نضمن زيادة في المبيعات أو الأرباح نتيجة استخدام هذه الأكواد.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">
                العمر القانوني والصلاحية
              </h2>
              <p className="text-gray-700">
                بشرائك من قالبك، تقر وتوافق على أن عمرك لا يقل عن 18 سنة أو أنك
                تملك الصلاحية القانونية للشراء.
              </p>
            </section>

            {/* Terms Modifications */}
            <section>
              <h2 className="text-2xl font-bold mb-4">التعديلات على الشروط</h2>
              <p className="text-gray-700 leading-relaxed">
                تحتفظ قالبك بالحق في تعديل هذه الشروط في أي وقت. سيتم إخطار
                العملاء بأي تعديلات جوهرية عبر البريد الإلكتروني.
              </p>
            </section>

            <section className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-8">
              <h2 className="text-xl font-bold mb-4">
                الاختصاص القضائي والقانون الواجب التطبيق
              </h2>
              <p className="text-gray-700 mb-3">
                تخضع هذه الاتفاقيات والسياسات للقوانين المعمول بها في المملكة
                العربية السعودية.
              </p>
              <p className="text-gray-700">
                يتفق الطرفان على الاختصاص الحصري للمحاكم السعودية في حالة حدوث
                أي نزاع.
              </p>
            </section>

            {/* Contact */}
            <section className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <h2 className="text-xl font-bold mb-3">للتواصل معنا</h2>
              <p className="text-gray-700">
                لأي استفسارات حول شروط الاستخدام، يرجى التواصل معنا عبر صفحة
                الدعم الفني:{" "}
                <Link
                  href="/support"
                  className="font-semibold text-blue-600 hover:underline"
                >
                  qalebk.com/support
                </Link>
              </p>
            </section>

            {/* Owner Section */}
            <section className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <h2 className="text-xl font-bold mb-3">الملكية القانونية</h2>
              <p className="text-gray-700">
                هذا الموقع والخدمات المرتبطة به تدار وتعود ملكيتها بالكامل
                للمالك:
                <span className="font-semibold"> Mohannad Ibrahim Mukhtar </span>
                بصفته المطور والمصمم الوحيد لكافة المحتويات الرقمية المباعة.
              </p>
            </section>
          </div>
        </main>

        {/* Footer */}
      </div>
      <Footer />
    </>
  );
}
