"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface Faq {
  question: string;
  answer: string;
}

export default function Faq({ faqs }: { faqs: Faq[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="space-y-3">
      {faqs.map((faq, index) => (
        <div key={index} className="overflow-hidden">
          <button
            onClick={() => toggle(index)}
            className="w-full bg-gray-50 rounded-full hover:bg-gray-200 text-gray-900 font-semibold py-4 px-4 flex items-center justify-between transition-colors duration-200"
          >
            <span className="text-sm">{faq.question}</span>
            <ChevronDown
              size={20}
              className={`transition-transform duration-200 flex-shrink-0 ${
                openIndex === index ? "rotate-180" : ""
              }`}
            />
          </button>

          {openIndex === index && (
            <div className="bg-white p-4 text-gray-700 text-sm leading-relaxed border rounded-xl mt-2 border-gray-100">
              {faq.answer}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
