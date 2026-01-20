import Footer from "@/app/components/Footer";


export default function Privacy() {
  return (
    <>
    <div className="min-h-screen bg-white text-black ">
      {/* Header */}
      <header className="border-b border-gray-200 py-8">
        <div className="container max-w-4xl">
          <h1 className="text-4xl  font-bold mb-2">سياسة الخصوصية</h1>
          <p className="text-gray-600">قالبك</p>
        </div>
      </header>

      {/* Content */}
      <main className="py-12">
        <div className="container max-w-4xl mx-auto space-y-8">
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-bold mb-4">مقدمة</h2>
            <p className="text-gray-700 leading-relaxed">
              تلتزم قالبك بحماية خصوصية عملائها. توضح هذه السياسة كيفية جمع واستخدام وحماية بيانات العملاء.
            </p>
          </section>

          {/* Collected Data */}
          <section>
            <h2 className="text-2xl font-bold mb-4">البيانات المجمعة</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              تقوم قالبك بجمع البيانات التالية:
            </p>
            <div className="space-y-4 mr-6">
              <div>
                <h3 className="font-semibold text-gray-900">البريد الإلكتروني</h3>
                <p className="text-gray-700 mb-2">يتم جمع عنوان البريد الإلكتروني للعميل لأغراض:</p>
                <ul className="space-y-1 mr-4 text-gray-700 text-sm">
                  <li className="flex items-start">
                    <span className="ml-2">•</span>
                    <span>إرسال الأكواد المشتراة بعد إتمام عملية الدفع.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="ml-2">•</span>
                    <span>التحقق من حساب العميل والتحقق من هويته.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="ml-2">•</span>
                    <span>إرسال إشعارات حول تحديثات الخدمة أو عروض جديدة.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="ml-2">•</span>
                    <span>التواصل بشأن طلبات الدعم الفني.</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">بيانات الحساب</h3>
                <p className="text-gray-700 mb-2">في حالة استخدام خدمة الاستضافة، نجمع:</p>
                <ul className="space-y-1 mr-4 text-gray-700 text-sm">
                  <li className="flex items-start">
                    <span className="ml-2">•</span>
                    <span>اسم العميل.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="ml-2">•</span>
                    <span>معلومات الدفع (يتم معالجتها بواسطة Lemon Squeezy ولا نحتفظ بها).</span>
                  </li>
                  <li className="flex items-start">
                    <span className="ml-2">•</span>
                    <span>الصور المرفوعة من قبل العميل.</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">بيانات الاستخدام</h3>
                <p className="text-gray-700">قد نجمع معلومات حول كيفية استخدام الموقع (عناوين IP، نوع المتصفح، صفحات الزيارة) لتحسين الخدمة.</p>
              </div>
            </div>
          </section>

          {/* Data Usage */}
          <section>
            <h2 className="text-2xl font-bold mb-4">استخدام البيانات</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              تستخدم قالبك البيانات المجمعة فقط للأغراض التالية:
            </p>
            <ul className="space-y-2 mr-6 text-gray-700">
              <li className="flex items-start">
                <span className="ml-3 font-bold">•</span>
                <span>تقديم الخدمات المطلوبة.</span>
              </li>
              <li className="flex items-start">
                <span className="ml-3 font-bold">•</span>
                <span>تحسين جودة الخدمة والموقع.</span>
              </li>
              <li className="flex items-start">
                <span className="ml-3 font-bold">•</span>
                <span>إرسال تحديثات وإشعارات مهمة.</span>
              </li>
              <li className="flex items-start">
                <span className="ml-3 font-bold">•</span>
                <span>الامتثال للالتزامات القانونية.</span>
              </li>
            </ul>
          </section>

          {/* Data Protection */}
          <section>
            <h2 className="text-2xl font-bold mb-4">حماية البيانات</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              تتخذ قالبك إجراءات أمنية مناسبة لحماية بيانات العملاء من الوصول غير المصرح به أو الفقدان أو التعديل. تشمل هذه الإجراءات:
            </p>
            <ul className="space-y-2 mr-6 text-gray-700">
              <li className="flex items-start">
                <span className="ml-3 font-bold">•</span>
                <span>تشفير البيانات الحساسة.</span>
              </li>
              <li className="flex items-start">
                <span className="ml-3 font-bold">•</span>
                <span>استخدام خوادم آمنة مع شهادات SSL.</span>
              </li>
              <li className="flex items-start">
                <span className="ml-3 font-bold">•</span>
                <span>تقييد الوصول إلى البيانات للموظفين المصرح لهم فقط.</span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">تخزين الصور</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              يتحمل العميل المسؤولية القانونية الكاملة عن محتوى الصور التي يرفعها على استضافتنا، ويُمنع رفع صور تنتهك الآداب العامة أو حقوق الملكية.
            </p>
          </section>

          {/* Third Party Sharing */}
          <section>
            <h2 className="text-2xl font-bold mb-4">مشاركة البيانات مع أطراف ثالثة</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              <strong>لا تقوم قالبك ببيع بيانات العملاء لأي طرف ثالث</strong>. ومع ذلك، قد نشارك البيانات في الحالات التالية:
            </p>
            <div className="space-y-3 mr-6">
              <div>
                <h3 className="font-semibold text-gray-900">مع مزودي الخدمات</h3>
                <p className="text-gray-700">مثل Lemon Squeezy (معالج الدفع) و Cloudflare (مزود الاستضافة) لتقديم الخدمات.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">الامتثال القانوني</h3>
                <p className="text-gray-700">عند الحاجة للامتثال للقوانين أو الاستجابة لطلبات السلطات المختصة.</p>
              </div>
            </div>
          </section>

          {/* Customer Rights */}
          <section>
            <h2 className="text-2xl font-bold mb-4">حقوق العملاء</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              يحق للعميل:
            </p>
            <ul className="space-y-2 mr-6 text-gray-700">
              <li className="flex items-start">
                <span className="ml-3 font-bold">•</span>
                <span>الوصول إلى البيانات الشخصية المجمعة عنه.</span>
              </li>
              <li className="flex items-start">
                <span className="ml-3 font-bold">•</span>
                <span>طلب تصحيح أي بيانات غير دقيقة.</span>
              </li>
              <li className="flex items-start">
                <span className="ml-3 font-bold">•</span>
                <span>طلب حذف بيانته الشخصية (مع الالتزام بالقوانين المعمول بها).</span>
              </li>
              <li className="flex items-start">
                <span className="ml-3 font-bold">•</span>
                <span>الاعتراض على معالجة بيانته.</span>
              </li>
            </ul>
          </section>

          {/* Cookies */}
          <section>
            <h2 className="text-2xl font-bold mb-4">ملفات تعريف الارتباط (Cookies)</h2>
            <p className="text-gray-700 leading-relaxed">
              يستخدم الموقع ملفات تعريف الارتباط لتحسين تجربة المستخدم. يمكن للعميل تعطيل ملفات تعريف الارتباط من خلال إعدادات المتصفح.
            </p>
          </section>

          {/* Contact */}
          <section className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <h2 className="text-xl font-bold mb-3">للتواصل بشأن الخصوصية</h2>
            <p className="text-gray-700">
              لأي استفسارات حول سياسة الخصوصية أو لممارسة حقوقك، يرجى التواصل معنا عبر: <span className="font-semibold">privacy@qalebk.com</span>
            </p>
          </section>
        </div>
      </main>

      
    </div>
    <Footer/>
    </>
  );
}
