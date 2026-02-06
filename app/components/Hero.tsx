import React from "react";

const HeroSection = () => {
  return (
    // استخدام bg-background حسب طلبك مع نص داكن
    <section className="relative bg-backg text-slate-900 overflow-hidden py-12 px-6 sm:py-18 lg:py-22 border-b border-gray-200">
      {/* خلفية جمالية خفيفة جداً لتناسب اللون الأبيض */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] " />
      </div>

      <div className="max-w-7xl mx-auto text-center relative z-10">
        {/* العنوان الرئيسي */}
        <h1 className="  leading-tight mb-3 sm:mb-8 tracking-tight">
          <span className="text-slate-800 text-3xl sm:text-5xl md:text-6xl lg:text-6xl">
             متجرك لا يبيع لأن واجهته لا تُقنع
          </span>
          <br />
          {/* تأثير التوهج الأزرق على خلفية بيضاء */}
          <span className="relative inline-block mt-2 md:mt-6">
            <span className="text-2xl sm:text-4xl md:text-5xl lg:text-[42px] text-blue-600 ">
               أضف قسم بطل جاهز لمتجرك يزيد التحويل خلال دقائق — بدون برمجة
            </span>
          </span>
        </h1>

        {/* الوصف */}
        <p className="text-slate-700 text-base md:text-xl max-w-3xl mx-auto mb-4 leading-relaxed font-medium">
           تعمل على
          <span className="text-blue-600 mx-1">
            {" "}
            سلة، زد، شوبيفاي{" "}
          </span>
          والمواقع المخصصة — انسخ والصق فقط
        </p>

        {/* زر الإجراء CTA */}
        {/* <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button className="px-7 py-4 text-sm sm:text-base sm:px-9 sm:py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-all duration-300 transform  ">
            استعرض الأقسام
          </button>
        </div> */}
      </div>
    </section>
  );
};

export default HeroSection;
