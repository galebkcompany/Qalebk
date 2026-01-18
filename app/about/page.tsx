export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white text-black" dir="rtl">
      {/* Hero */}
      <section className="border-b border-gray-200 py-16">
        <div className="container max-w-5xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl mb-5">
            نبتكر التفاصيل… ليزدهر متجرك
          </h1>
          <p className="text-gray-700 text-lg leading-relaxed max-w-2xl mx-auto">
            في منصة قالبك، نؤمن أن التجارة الإلكترونية ليست مجرد عرض للمنتجات،
            بل تجربة بصرية وتقنية تبدأ من أول ثانية.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="container max-w-5xl mx-auto px-4 space-y-16">
          
          {/* من نحن */}
          <div className="space-y-4">
            <h2 className="text-2xl">من نحن</h2>
            <p className="text-gray-800 leading-relaxed text-base">
              انطلقنا في قالبك برؤية طموحة لسد الفجوة بين التصاميم الجاهزة
              والرغبة في التميز البرمجي، لنمنح أصحاب المتاجر في الوطن العربي
              وصولًا سهلًا لأقسام برمجية (UI Sections) احترافية تُركب بضغطة زر،
              وتحوّل المتجر من شكل تقليدي إلى تجربة حديثة متكاملة.
            </p>
          </div>

          {/* لماذا قالبك */}
          <div className="space-y-4">
            <h2 className="text-2xl">لماذا قالبك؟</h2>
            <p className="text-gray-800 leading-relaxed text-base">
              نحن لا نبيع مجرد أكواد؛ نحن نوفر لك هوية تقنية متكاملة.
              صممنا كل قسم بعناية ليكون سريعًا، متجاوبًا، ومتوافقًا مع أشهر
              منصات التجارة الإلكترونية مثل سلة وزد، مع حلول ذكية لاستضافة
              الصور تضمن أداءً مستقرًا وتجربة استخدام سلسة.
            </p>
          </div>

          {/* رؤيتنا */}
          <div className="space-y-4">
            <h2 className="text-2xl">رؤيتنا المستقبلية</h2>
            <p className="text-gray-800 leading-relaxed text-base">
              طموحنا في قالبك يتجاوز كونه متجرًا رقميًا؛ نحن نبني
              Marketplace يجمع نخبة المبدعين والمبرمجين مع أصحاب المتاجر،
              لنكون الوجهة الأولى لكل من يبحث عن الابتكار البرمجي،
              ونحوّل المتاجر العربية إلى تحف تقنية تنافس عالميًا.
            </p>
          </div>

          {/* CTA */}
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8 text-center space-y-4">
            <h3 className="text-xl">
              انضم إلينا اليوم
            </h3>
            <p className="text-gray-700 leading-relaxed">
              وابدأ في تغيير قواعد اللعبة في متجرك، خطوة بخطوة،
              بقوة التصميم والبرمجة.
            </p>
          </div>

        </div>
      </section>
    </main>
  );
}
