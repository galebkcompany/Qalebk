import Footer from "@/app/components/Footer";

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
                <div>
                  <h3 className="font-semibold text-gray-900">الاستضافة</h3>
                  <p className="text-gray-700">
                    خدمة إضافية بقيمة 0.99$ سنوياً تشمل استضافة صور العميل على
                    سيرفرات Cloudflare R2 السحابية وتوليد كود جاهز بالروابط
                    المحدثة.
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
                يحق للعميل استخدام الكود في متجره او موقعه فقط . يُمنع منعاً
                باتاً:
              </p>
              <ul className="space-y-2 mr-6 text-gray-700">
                <li className="flex items-start">
                  <span className="ml-3 font-bold">•</span>
                  <span>إعادة بيع الكود أو أي جزء منه لأطراف ثالثة.</span>
                </li>
                <li className="flex items-start">
                  <span className="ml-3 font-bold">•</span>
                  <span>
                    توزيع الكود بشكل مجاني أو تجاري دون تصريح كتابي من قالبك.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="ml-3 font-bold">•</span>
                  <span>نسخ الكود أو تعديله بهدف إعادة بيعه تحت اسم آخر.</span>
                </li>
                <li className="flex items-start">
                  <span className="ml-3 font-bold">•</span>
                  <span>
                    يُمنع استخدام الكود في أكثر من متجر واحد لكل عملية شراء. إذا
                    كنت مصمماً، يجب شراء ترخيص منفصل لكل عميل او التواصل مع
                    المالك للحصول على ترخيص تجاري.
                  </span>
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
                لأي استفسارات حول شروط الاستخدام، يرجى التواصل معنا عبر:{" "}
                <span className="font-semibold">support@qalebk.com</span>
              </p>
            </section>

            {/* Contact */}
            <section className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <h2 className="text-xl font-bold mb-3">المالك</h2>
              <p className="text-gray-700">
                يتم تشغيل منصة قالبك بواسطة Mohanad Ibrahim Mukhtar كمالك مؤسسة
                فردية
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
