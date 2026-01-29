// app/support/page.tsx

import Link from "next/link";
import { Phone, Mail } from "lucide-react";
import Footer from "../components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "دعم العملاء",
  description: "صفحة دعم العملاء لمنصة قالبك",
  robots: {
    index: false,
    follow: true,
  },
};

export default function SupportPage() {
  const whatsappNumber = "966579109350"; // رقم الواتساب
  const whatsappMessage = encodeURIComponent(
    "مرحبًا، أحتاج مساعدة بخصوص أحد الأقسام."
  );
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  const supportEmail = "support@qalebk.com"; // البريد الاحترافي

  return (
    <main className="min-h-screen bg-white flex flex-col justify-between p-6">
      {/* محتوى الصفحة */}
      <div className="text-center mt-10 mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">دعم العملاء</h1>
        <p className="text-gray-800 text-lg leading-relaxed">
          إذا واجهت أي مشكلة أو تحتاج مساعدة، يمكنك التواصل معنا عبر أي من الخيارات التالية:
        </p>
      </div>

      {/* أزرار التواصل */}
      <div className="flex flex-col sm:flex-row justify-center gap-4 mb-20">
        {/* زر واتساب */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 max-w-md flex items-center justify-center gap-3 border border-gray-300 rounded-xl bg-white text-black font-semibold py-6 px-6 hover:bg-gray-100 transition-colors duration-200"
        >
          <Phone size={20} />
          واتساب
        </a>

        {/* زر البريد الإلكتروني */}
        <a
          href={`mailto:${supportEmail}`}
          className="flex-1 max-w-md flex items-center justify-center gap-3 border border-gray-300 rounded-xl bg-white text-black font-semibold py-6 px-6 hover:bg-gray-100 transition-colors duration-200"
        >
          <Mail size={20} />
          البريد الإلكتروني
        </a>

        {/* زر صفحة التركيب (اختياري) */}
        {/* <Link
          href="/installation-guide"
          className="flex-1 flex items-center justify-center gap-3 border border-gray-300 rounded-xl bg-white text-black font-semibold py-3 px-6 hover:bg-gray-100 transition-colors duration-200"
        >
          <BookOpen size={20} />
          طريقة تركيب القسم
        </Link> */}
      </div>

      <Footer />
    </main>
  );
}
