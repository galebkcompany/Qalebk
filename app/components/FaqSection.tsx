"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

type FaqItem = {
  question: string;
  answer: string;
};

export default function FaqSection({
  title,
  faqs,
}: {
  title: string;
  faqs: FaqItem[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [openQuestion, setOpenQuestion] = useState<number | null>(null);

  return (
    <div className="overflow-hidden">
      {/* العنوان الرئيسي */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-gray-50 rounded-full hover:bg-gray-200 text-gray-900 font-semibold py-4 px-4 flex items-center justify-between transition-colors"
      >
        <span className="text-sm">{title}</span>
        <ChevronDown
          size={20}
          className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {/* قائمة الأسئلة */}
      {isOpen && (
        <div className="mt-3 space-y-2">
          {faqs.map((faq, index) => {
            const opened = openQuestion === index;

            return (
              <div
                key={index}
                className="border border-gray-200 rounded-xl overflow-hidden"
              >
                <button
                  onClick={() =>
                    setOpenQuestion(opened ? null : index)
                  }
                  className="w-full px-4 py-3 bg-white hover:bg-gray-50 flex items-center justify-between text-sm font-medium text-gray-800"
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    size={18}
                    className={`transition-transform ${
                      opened ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {opened && (
                  <div className="px-4 py-3 text-sm text-gray-700 leading-relaxed bg-gray-50">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
