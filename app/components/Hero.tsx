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
        <h1
          className="text-gray-800 text-2xl sm:text-3xl sm:font-semibold md:text-[2.6rem] leading-tight tracking-tight"
        >
          حول واجهة متجرك إلى{" "}
          <span className="text-blue-500">واجهة احترافية</span> في أقل من 5
          دقائق
        </h1>
      </div>
    </section>
  );
};

export default HeroSection;
