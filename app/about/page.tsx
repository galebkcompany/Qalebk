import Footer from "../components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: " حول منصة قالبك - من نحن",
  description:
    "اكتشف قصة منصة قالبك، رؤيتنا في تقديم حلول برمجية مبتكرة لأصحاب المتاجر الإلكترونية في الوطن العربي، ولماذا نحن الخيار الأمثل لتحويل متجرك إلى تجربة رقمية متكاملة.",
};

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
            بل تجربة متكاملة تبدأ من اللحظة الأولى، تجمع بين الجمال البصري
            والأداء التقني.
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
              والرغبة في التميز البرمجي. هدفنا هو تمكين أصحاب المتاجر في الوطن
              العربي من الوصول بسهولة إلى أقسام برمجية احترافية (UI Sections)
              يمكن تركيبها بضغطة زر، لتحويل المتجر من شكل تقليدي إلى تجربة حديثة
              ومتكاملة.
            </p>
          </div>

          {/* لماذا قالبك */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">لماذا قالبك؟</h2>
            <p className="text-gray-800 leading-relaxed text-base">
              نحن لا نقدم مجرد أكواد؛ نقدم{" "}
              <span className="font-semibold">هوية تقنية متكاملة</span>. كل قسم
              مصمم بعناية ليكون:
            </p>
            <ul className="list-disc list-inside text-gray-800 space-y-2 pl-5">
              <li>سريع الأداء ومتجاوب مع جميع الشاشات.</li>
              <li>متوافق مع أشهر منصات التجارة الإلكترونية مثل سلة وزد و شوبيفاي.</li>
              <li>
                سهل التركيب والتخصيص، حتى بدون خبرة برمجية متقدمة.
              </li>
            </ul>
          </div>

          {/* رؤيتنا */}
          <div className="space-y-4">
            <h2 className="text-2xl">رؤيتنا المستقبلية</h2>
            <p className="text-gray-800 leading-relaxed text-base">
              طموحنا يتجاوز كونه متجرًا رقميًا؛ نحن نعمل على بناء Marketplace
              يجمع نخبة المبدعين والمبرمجين مع أصحاب المتاجر، لنكون الوجهة
              الأولى لكل من يبحث عن الابتكار البرمجي، ونحوّل المتاجر العربية إلى
              تحف تقنية تنافس عالميًا.
            </p>
          </div>

          {/* CTA */}
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8 text-center space-y-4">
            <h3 className="text-xl">انضم إلينا اليوم</h3>
            <p className="text-gray-700 leading-relaxed">
              وابدأ في تغيير قواعد اللعبة في متجرك، خطوة بخطوة، بقوة التصميم
              والبرمجة.
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
