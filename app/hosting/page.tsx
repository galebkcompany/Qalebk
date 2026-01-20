import Footer from "@/app/components/Footer";
import Link from "next/link";


export default function Hosting() {
  return (
    <>
    <div className="min-h-screen bg-white text-black">
      {/* Header */}
      <header className="border-b border-gray-200 py-8">
        <div className="container max-w-4xl mx-auto space-y-8">
          <h1 className="text-4xl font-bold mb-2">اتفاقية خدمة الاستضافة</h1>
          <p className="text-gray-600">قالبك | Hosting SLA</p>
        </div>
      </header>

      {/* Content */}
      <main className="py-12">
        <div className="container max-w-4xl mx-auto space-y-8">
          {/* Service Scope */}
          <section>
            <h2 className="text-2xl font-bold mb-4">نطاق الخدمة</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              تقدم قالبك خدمة استضافة الصور (Hosting) بقيمة 0.99$ سنوياً. تشمل هذه الخدمة:
            </p>
            <ul className="space-y-2 mr-6 text-gray-700">
              <li className="flex items-start">
                <span className="ml-3 font-bold">•</span>
                <span>استضافة صور العميل على سيرفرات Cloudflare R2 السحابية.</span>
              </li>
              <li className="flex items-start">
                <span className="ml-3 font-bold">•</span>
                <span>كود جاهز بالروابط المحدثة للصور المرفوعة.</span>
              </li>
              <li className="flex items-start">
                <span className="ml-3 font-bold">•</span>
                <span>لوحة تحكم بسيطة لإدارة الصور وحذفها.</span>
              </li>
              <li className="flex items-start">
                <span className="ml-3 font-bold">•</span>
                <span>دعم فني أساسي لمشاكل الاستضافة.</span>
              </li>
            </ul>
          </section>

          {/* Service Duration and Renewal */}
          <section>
            <h2 className="text-2xl font-bold mb-4">مدة الخدمة والتجديد</h2>
            <div className="space-y-4 mr-6">
              <div className="border-r-4 border-black pr-4">
                <h3 className="font-semibold text-gray-900 mb-2">مدة الخدمة</h3>
                <p className="text-gray-700">
                  تُضمن قالبك استضافة الصور لمدة سنة ميلادية كاملة من تاريخ الشراء.
                </p>
              </div>
              <div className="border-r-4 border-black pr-4">
                <h3 className="font-semibold text-gray-900 mb-2">التجديد</h3>
                <p className="text-gray-700 mb-3">
                  الخدمة قابلة للتجديد سنوياً لضمان استمرار ظهور الصور. يجب على العميل تجديد الاشتراك قبل انتهاء صلاحيته بـ 30 يوماً على الأقل.
                </p>
                <p className="text-gray-700">
                  في حالة عدم التجديد، ستتم إزالة الصور من الخوادم بعد 30 يوماً من انتهاء الاشتراك.
                </p>
              </div>
            </div>
          </section>

          {/* SLA Commitments */}
          <section>
            <h2 className="text-2xl font-bold mb-4">مستوى الخدمة (SLA)</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              تلتزم قالبك بالمعايير التالية:
            </p>
            <div className="space-y-4 mr-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">توفر الخدمة</h3>
                <p className="text-gray-700">
                  تضمن قالبك توفر الخدمة بنسبة 99% على مدار السنة (باستثناء الصيانة المخطط لها والحالات الطارئة).
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">سرعة التحميل</h3>
                <p className="text-gray-700">
                  تسعى قالبك لضمان سرعة تحميل الصور في أقل من 3 ثوان من أي مكان في العالم.
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">النسخ الاحتياطية</h3>
                <p className="text-gray-700">
                  يتم إنشاء نسخ احتياطية من الصور بشكل دوري لضمان عدم فقدان البيانات.
                </p>
              </div>
            </div>
          </section>

          {/* Usage Limits */}
          <section>
            <h2 className="text-2xl font-bold mb-4">حدود الاستخدام</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              كل اشتراك في خدمة الاستضافة يشمل:
            </p>
            <div className="bg-gray-50 p-6 rounded-lg">
              <table className="w-full text-right">
                <tbody>
                  <tr className="border-b border-gray-200">
                    <td className="py-3 font-semibold text-gray-900">تخزين الصور</td>
                    <td className="py-3 text-gray-700">حتى 2 ميجابايت للصوره الواحده</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-3 font-semibold text-gray-900">عمليات التحميل والتحديث</td>
                    <td className="py-3 text-gray-700">عدد غير محدود</td>
                  </tr>
                  <tr>
                    <td className="py-3 font-semibold text-gray-900">عرض النطاق الترددي</td>
                    <td className="py-3 text-gray-700">غير محدود</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-gray-700 leading-relaxed mt-4">
              عدد الصور المسموح برفعا على الاستضافة تختلف من قسم لأخر. 
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">الاستخدام العادل</h2>
            <p className="text-gray-700 leading-relaxed">
                تخضع خدمة الاستضافة لسياسة الاستخدام العادل. في حال رصد استهلاك غير طبيعي للموارد (Bandwidth) يؤثر على استقرار السيرفرات أو أداء الخدمة للعملاء الآخرين، يحق لـ 'قالبك' التواصل مع العميل لتنبيهه. وفي حال استمرار هذا الاستهلاك لمدة 30 يوماً دون معالجة، يحق لنا تقييد أو إيقاف الوصول للصور. ملاحظة: نحتفظ بالحق في التعليق الفوري والمؤقت للخدمة في الحالات الطارئة التي تهدد سلامة البنية التحتية للمنصة.
            </p>
          </section>

          {/* Planned Maintenance */}
          <section>
            <h2 className="text-2xl font-bold mb-4">الصيانة المخطط لها</h2>
            <p className="text-gray-700 leading-relaxed">
              قد تقوم قالبك بإجراء صيانة دورية على الخوادم. ستحاول قالبك إجراء الصيانة خلال ساعات الذروة المنخفضة (بين الساعة 2-4 صباحاً بتوقيت UTC) وستُعلم العملاء بموعد الصيانة قبل 48 ساعة على الأقل.
            </p>
          </section>

          {/* Force Majeure */}
          <section>
            <h2 className="text-2xl font-bold mb-4">الحالات الطارئة والقوة القاهرة</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              لا تتحمل قالبك مسؤولية انقطاع الخدمة الناجم عن:
            </p>
            <ul className="space-y-2 mr-6 text-gray-700">
              <li className="flex items-start">
                <span className="ml-3 font-bold">•</span>
                <span>أعطال الإنترنت أو مشاكل الاتصال بين العميل والخادم.</span>
              </li>
              <li className="flex items-start">
                <span className="ml-3 font-bold">•</span>
                <span>الكوارث الطبيعية أو الأحداث غير المتوقعة.</span>
              </li>
              <li className="flex items-start">
                <span className="ml-3 font-bold">•</span>
                <span>الهجمات الإلكترونية أو محاولات الاختراق (مع التزام قالبك باتخاذ إجراءات أمنية معقولة).</span>
              </li>
              <li className="flex items-start">
                <span className="ml-3 font-bold">•</span>
                <span>مشاكل في خدمات الطرف الثالث (مثل Cloudflare).</span>
              </li>
            </ul>
          </section>

          {/* Technical Support */}
          <section>
            <h2 className="text-2xl font-bold mb-4">الدعم الفني</h2>
            <p className="text-gray-700 leading-relaxed">
              يحصل عملاء خدمة الاستضافة على دعم فني أساسي عبر البريد الإلكتروني او الموقع. متوسط وقت الرد هو 24 ساعة عمل.
            </p>
          </section>

          {/* Refunds and Compensation */}
          <section>
            <h2 className="text-2xl font-bold mb-4">الاستردادات والتعويضات</h2>
            <p className="text-gray-700 leading-relaxed">
                في حالة انقطاع الخدمة بشكل كامل لأكثر من 7 أيام متواصلة، يحق للعميل طلب استرجاع كامل للرسوم السنوية.
            </p>
          </section>

          {/* Service Termination */}
          <section>
            <h2 className="text-2xl font-bold mb-4">إنهاء الخدمة</h2>
            <p className="text-gray-700 leading-relaxed">
              يحق للعميل إنهاء اشتراك الاستضافة في أي وقت. عند الإنهاء، سيتم حذف الصور من الخوادم بعد 7 أيام من تأكيد الإنهاء.
            </p>
          </section>

          {/* Policy Changes */}
          <section className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <h2 className="text-xl font-bold mb-3">التعديلات على السياسة</h2>
            <p className="text-gray-700">
              تحتفظ قالبك بالحق في تعديل شروط الاستضافة. سيتم إخطار العملاء بأي تعديلات جوهرية قبل 30 يوماً من سريانها.
            </p>
          </section>

          {/* Contact */}
          <section className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <h2 className="text-xl font-bold mb-3">للتواصل معنا</h2>
            <p className="text-gray-700">
              لأي استفسارات حول خدمة الاستضافة أو اتفاقية SLA، يرجى التواصل معنا عبر: {" "}
                <Link 
                  href="/support" 
                  className="font-semibold text-blue-600 hover:underline"
                >
                  qalebk.com/support
                </Link>
            </p>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-gray-50 py-8 mt-12">
        <div className="container max-w-4xl text-center text-gray-600 text-sm">
          <p>© 2026 قالبك . جميع الحقوق محفوظة.</p>
        </div>
      </footer>
    </div>
    <Footer />
    </>
  );
}
