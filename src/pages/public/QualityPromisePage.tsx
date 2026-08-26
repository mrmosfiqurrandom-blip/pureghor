import React from 'react';
import { Award, ShieldCheck, Microscope, PackageCheck, HeartHandshake } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const QualityPromisePage: React.FC = () => {
  const { settings } = useStore();

  return (
    <div className="py-10 md:py-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 font-['Hind_Siliguri']">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="bg-[#E8F8D8] text-[#004F18] text-xs font-bold px-3.5 py-1.5 rounded-full uppercase border border-[#5EB809]/30">
          কোয়ালিটি প্রমিজ
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-[#004F18] mt-3">
          বিশুদ্ধতার অঙ্গীকার ও মান নিয়ন্ত্রণ
        </h1>
        <p className="text-sm text-[#102B16]/70 mt-2">
          কীভাবে আমরা প্রতিটি খাদ্যপণ্যের সর্বোচ্চ বিশুদ্ধতা ও পুষ্টিমান নিশ্চিত করি
        </p>
      </div>

      <div className="space-y-6">
        {/* Step 1 */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#DCECD5] shadow-xs flex flex-col sm:flex-row gap-6 items-start">
          <div className="w-14 h-14 rounded-2xl bg-[#E8F8D8] text-[#004F18] border border-[#5EB809]/30 flex items-center justify-center shrink-0">
            <HeartHandshake className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#004F18] mb-1">১. সরাসরি মাঠপর্যায়ের বিশ্বস্ত সোর্সিং</h2>
            <p className="text-sm text-[#102B16]/75 leading-relaxed">
              আমরা কোনো মধ্যস্বত্বভোগী বা খোলা বাজারের পাইকারি উৎস থেকে পণ্য কিনি না। সুন্দরবনের নিবন্ধিত মৌয়াল, যশোরের ঐতিহ্যবাহী খেজুর গাছি এবং স্থানীয় খামারিদের থেকে সরাসরি কাঁচামাল সংগ্রহ করি।
            </p>
          </div>
        </div>

        {/* Step 2 */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#DCECD5] shadow-xs flex flex-col sm:flex-row gap-6 items-start">
          <div className="w-14 h-14 rounded-2xl bg-[#E8F8D8] text-[#004F18] border border-[#5EB809]/30 flex items-center justify-center shrink-0">
            <Microscope className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#004F18] mb-1">২. নিয়মিত ল্যাব টেস্ট ও বিশ্লেষণ</h2>
            <p className="text-sm text-[#102B16]/75 leading-relaxed">
              মধু ও তেলের আর্দ্রতা, সুক্রোজ লেভেল, ফ্রি-ফ্যাটি এসিড এবং পিউরিটি স্ট্যান্ডার্ড নিয়মিত পরীক্ষাগারে টেস্ট করা হয়। কোনো ত্রুটি বা রাসায়নিক পাওয়া গেলে তাৎক্ষণিক পুরো ব্যাচ বাতিল করা হয়।
            </p>
          </div>
        </div>

        {/* Step 3 */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#DCECD5] shadow-xs flex flex-col sm:flex-row gap-6 items-start">
          <div className="w-14 h-14 rounded-2xl bg-[#E8F8D8] text-[#004F18] border border-[#5EB809]/30 flex items-center justify-center shrink-0">
            <PackageCheck className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#004F18] mb-1">৩. ফুড-গ্রেড ও বায়ুরোধী সুরক্ষা প্যাকেজিং</h2>
            <p className="text-sm text-[#102B16]/75 leading-relaxed">
              আমাদের সকল পণ্য কাচের জার অথবা ভার্জিন ফুড-গ্রেড বোতলে সিল করা হয়। ফলে কুরিয়ারে পরিবহনকালেও কোনো বাতাস বা আর্দ্রতা ঢুকে পুষ্টিগুণ নষ্ট হতে পারে না।
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
