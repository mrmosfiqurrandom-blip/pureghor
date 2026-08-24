import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const FAQSection: React.FC = () => {
  const { faqs } = useStore();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="py-14 bg-white border-t border-[#DCECD5]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 text-[#5EB809] text-xs font-bold uppercase tracking-wider mb-2">
            <HelpCircle className="w-4 h-4" />
            <span>সচরাচর জিজ্ঞাসা</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#004F18] font-['Hind_Siliguri']">
            সাধারণ কিছু প্রশ্নের উত্তর
          </h2>
          <p className="text-sm text-[#102B16]/70 mt-2 font-['Hind_Siliguri']">
            ডেলিভারি, ক্যাশ অন ডেলিভারি, রিফান্ড ও পণ্যের মান নিয়ে গুরুত্বপূর্ণ তথ্যাবলি
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={faq.id}
                className="rounded-2xl border border-[#DCECD5] bg-[#F5FBF2]/60 transition-all overflow-hidden"
              >
                <button
                  onClick={() => toggle(idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-[#004F18] font-['Hind_Siliguri'] hover:text-[#5EB809] transition-colors cursor-pointer"
                >
                  <span>{faq.questionBn}</span>
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shrink-0 border border-[#DCECD5]">
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-[#5EB809]" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-500" />
                    )}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-4 pb-5 sm:px-5 text-sm text-[#102B16]/80 leading-relaxed font-['Hind_Siliguri'] border-t border-[#DCECD5] pt-3 bg-white">
                    {faq.answerBn}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
