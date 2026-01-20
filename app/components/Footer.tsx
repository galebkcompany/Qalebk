import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50 py-8  pt-12 pb-6">
      <div className="mx-auto max-w-5xl px-6">
        {/* القسم العلوي: 3 أجزاء */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12 text-right">
          {/* الجزء الأول: اللوجو والوصف */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="w-[76px] sm:w-[100px]">
              <Image
                src="/images/logo/logo.png"
                alt="قالبك Qalebk"
                width={362}
                height={689}
                priority
                sizes="(max-width: 640px) 90px, 120px"
                className="w-full h-auto object-contain   "
              />
            </Link>
            <p className="text-gray-800 text-sm leading-relaxed max-w-xs">
              قالبك هو السوق العربي الأول لبيع وشراء قوالب ومنصات الويب الجاهزة 
            </p>

            {/* يمين: السوشيال ميديا */}
            <div className="flex items-center gap-4">
              <Link
                href="https://www.youtube.com/@qalebk"
                target="_blank"
                rel="noopener noreferrer"
                className="border border-gray-500 h-12 w-12 flex items-center justify-center rounded-full hover:bg-gray-200 transition "
              >
                <Image
                  src="/icons/youtube.svg"
                  alt="YouTube"
                  width={26}
                  height={26}
                  className="brightness-100 invert"
                />
              </Link>

              <Link
                href="https://www.tiktok.com/@qalebk"
                target="_blank"
                rel="noopener noreferrer"
                className="border border-gray-500 h-12 w-12 flex items-center justify-center rounded-full hover:bg-gray-200 transition"
              >
                <Image
                  src="/icons/tiktok.svg"
                  alt="TikTok"
                  width={28}
                  height={28}
                  className="brightness-100 invert"
                />
              </Link>
            </div>
          </div>

          {/* الجزء الثاني: روابط سريعة */}
          <div>
            <h3 className="text-lg text-gray-900  mb-6">روابط سريعة</h3>
            <ul className="space-y-4 text-gray-800 text-sm">
              <li>
                <Link href="/" className="hover:text-gray-500 transition">
                  الرئيسية
                </Link>
              </li>
              <li>
                <Link
                  href="/categories/sections"
                  className="hover:text-gray-500 transition"
                >
                  أقسام جاهزة
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-gray-500 transition">
                  الأسئلة الشائعة
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-gray-500 transition">
                  عن قالبك
                </Link>
              </li>
            </ul>
          </div>

          {/* الجزء الثالث: عن الشركة والسياسات */}
          <div>
            <h3 className="text-lg  mb-6 text-gray-800">الدعم والسياسات</h3>
            <ul className="space-y-4 text-gray-800 text-sm">
              <li>
                <Link href="/terms" className="hover:text-gray-500 transition">
                  شروط الاستخدام
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-gray-500 transition"
                >
                  سياسة الخصوصية
                </Link>
              </li>
              <li>
                <Link href="/refund" className="hover:text-gray-500 transition">
                  سياسة الاسترجاع
                </Link>
              </li>
              {/* <li>
                <Link
                  href="/hosting"
                  className="hover:text-gray-500 transition"
                >
                  الاستضافة
                </Link>
              </li> */}
              <li>
                <Link
                  href="/support"
                  className="hover:text-gray-500 transition"
                >
                  الدعم والمساعدة
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* الخط الفاصل */}
        <div className="border-t border-gray-200 pt-8">
          <div className="relative flex flex-col md:flex-row items-center">
            {/* أيقونات الدفع */}
            <div className="order-1 md:order-2 md:mr-auto flex items-center gap-3 mb-4 md:mb-0">
              {[
                { id: "visa", src: "/images/payment/visa.png" },
                { id: "mastercard", src: "/images/payment/mastercard.png" },
                { id: "paypal", src: "/images/payment/paypal.png" },
              ].map((card) => (
                <div
                  key={card.id}
                  className="bg-white p-1 rounded-md w-12 h-7 flex items-center justify-center transition hover:shadow-md"
                >
                  <Image
                    src={card.src}
                    alt={card.id}
                    width={30}
                    height={25}
                    className="object-contain"
                  />
                </div>
              ))}
            </div>

            {/* النص */}
            <div className="order-2 md:order-1 md:absolute md:left-1/2 md:-translate-x-1/2 text-gray-900 text-sm text-center">
              جميع الحقوق محفوظة © {new Date().getFullYear()}{" "}
              <span className="text-gray-800 font-bold">قالبك</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
