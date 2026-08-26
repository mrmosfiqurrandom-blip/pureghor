import React from 'react';
import { Truck, RotateCcw, ShieldAlert, CheckCircle } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const DeliveryReturnPolicyPage: React.FC = () => {
  const { settings } = useStore();

  return (
    <div className="py-10 md:py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 font-['Hind_Siliguri']">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="bg-[#E8F8D8] text-[#004F18] text-xs font-bold px-3.5 py-1.5 rounded-full uppercase border border-[#5EB809]/30">
          গ্রাহক সুরক্ষা
        </span>
        <h1 className="text-3xl font-black text-[#004F18] mt-3">
          ডেলিভারি ও রিটার্ন পলিসি
        </h1>
        <p className="text-sm text-[#102B16]/70 mt-1">
          স্বচ্ছ এবং ঝামেলামুক্ত শপিং অভিজ্ঞতা নিশ্চিত করতে আমাদের স্পষ্ট নিয়মাবলি
        </p>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#DCECD5] shadow-xs space-y-8 text-sm leading-relaxed text-[#102B16]/85">
        <div>
          <h2 className="text-lg font-bold text-[#004F18] mb-2 flex items-center gap-2">
            <Truck className="w-5 h-5 text-[#5EB809]" />
            <span>ডেলিভারি চার্জ ও সময়সীমা</span>
          </h2>
          <p>
            আমরা সমগ্র বাংলাদেশে বিশ্বস্ত কুরিয়ার সার্ভিসের মাধ্যমে হোম ডেলিভারি প্রদান করি।
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1 text-[#102B16]/75">
            <li><strong>সিলেট সদর ও পার্শ্ববর্তী এলাকা:</strong> ডেলিভারি চার্জ ৫০ টাকা (২৪ থেকে ৪৮ ঘণ্টার মধ্যে ডেলিভারি)।</li>
            <li><strong>ঢাকা সিটি কর্পোরেশন:</strong> ডেলিভারি চার্জ ৮০ টাকা (২৪ থেকে ৪৮ ঘণ্টা)।</li>
            <li><strong>ঢাকার বাইরে সমগ্র বাংলাদেশ:</strong> ডেলিভারি চার্জ ১২০-১৩০ টাকা (২ থেকে ৩ কার্যদিবস)।</li>
            <li><strong>ফ্রি ডেলিভারি অফার:</strong> ২০০০ টাকার সমপরিমাণ বা তদূর্ধ্ব অর্ডারে সারা বাংলাদেশে কোনো ডেলিভারি চার্জ নেই।</li>
          </ul>
        </div>

        <div className="pt-4 border-t border-[#DCECD5]">
          <h2 className="text-lg font-bold text-[#004F18] mb-2 flex items-center gap-2">
            <RotateCcw className="w-5 h-5 text-[#5EB809]" />
            <span>রিটার্ন ও রিপ্লেসমেন্ট নীতিমালা</span>
          </h2>
          <p>
            পণ্য গ্রহণের সময় ডেলিভারিম্যানের সামনে পার্সেলটি চেক করার অনুরোধ করা হচ্ছে। যদি কোনো কারণে:
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1 text-[#102B16]/75">
            <li>পণ্য ভাঙা বা ক্ষতিগ্রস্ত অবস্থায় পৌঁছায়</li>
            <li>ভুল পণ্য বা পরিমাণের অমিল থাকে</li>
            <li>স্বাদ বা ঘ্রাণে অনাকাঙ্ক্ষিত কোনো সমস্যা অনুভূত হয়</li>
          </ul>
          <p className="mt-3">
            তাহলে ডেলিভারির ৪৮ ঘণ্টার মধ্যে আমাদের কাস্টমার কেয়ারে কল (<strong>{settings.phone || '01754-991822'}</strong>) বা হোয়াটসঅ্যাপে পার্সেলের ছবি পাঠিয়ে জানালে আমরা সম্পূর্ণ ফ্রিতে নতুন পণ্য পাঠিয়ে দেব অথবা আপনার পরিশোধিত টাকা রিফান্ড করব।
          </p>
        </div>
      </div>
    </div>
  );
};
