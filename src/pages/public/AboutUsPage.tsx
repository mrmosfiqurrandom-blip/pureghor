import React from 'react';
import { Award, Leaf, Users, MapPin, Heart, ShieldCheck } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const AboutUsPage: React.FC = () => {
  const { settings } = useStore();
  const content = settings.aboutUsContent;

  return (
    <div className="py-10 md:py-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 font-['Hind_Siliguri']">
      {/* Hero Header */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="bg-[#E8F8D8] text-[#004F18] border border-[#5EB809]/30 text-xs font-bold px-3.5 py-1.5 rounded-full uppercase">
          আমাদের গল্প
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-[#004F18] mt-3">
          {settings.storeNameBn || 'পিউর ঘর'} — খাঁটি পণ্যের বিশ্বস্ত প্রতিষ্ঠান
        </h1>
        <p className="text-sm text-[#102B16]/70 mt-2 leading-relaxed">
          সিলেটের বিশ্বনাথ ও লালাবাজার থেকে শুরু হওয়া আমাদের প্রাকৃতিক ও নিরাপদ খাদ্যের একনিষ্ঠ প্রয়াস
        </p>
      </div>

      {/* Main Story */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#DCECD5] shadow-xs space-y-8">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#004F18] mb-3 flex items-center gap-2">
            <Leaf className="w-6 h-6 text-[#5EB809]" />
            <span>কীভাবে আমাদের যাত্রা শুরু</span>
          </h2>
          <p className="text-base text-[#102B16]/90 leading-relaxed">
            {content?.storyBn ||
              'বাজারে ভেজাল ও অস্বাস্থ্যকর খাবারের ভিড়ে পরিবারের জন্য খাঁটি খাবারের সন্ধান করতে গিয়ে আমাদের এই পথচলা শুরু হয়। আমরা বিশ্বাস করি, সুস্থ জীবনের ভিত্তি হলো নিরাপদ ও প্রাকৃতিক খাবার।'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-[#DCECD5]">
          <div className="p-5 rounded-2xl bg-[#F5FBF2] border border-[#DCECD5]">
            <div className="w-10 h-10 rounded-xl bg-[#004F18] text-white flex items-center justify-center mb-3">
              <Award className="w-5 h-5 text-[#5EB809]" />
            </div>
            <h3 className="font-bold text-base text-[#004F18] mb-1">১০০% খাঁটি ও প্রাকৃতিক</h3>
            <p className="text-xs text-[#102B16]/70 leading-relaxed">
              কোনো প্রকার কৃত্রিম রং, রাসায়নিক কিংবা রাসায়নিক প্রিজারভেটিভ ব্যবহার করা হয় না।
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#F5FBF2] border border-[#DCECD5]">
            <div className="w-10 h-10 rounded-xl bg-[#004F18] text-white flex items-center justify-center mb-3">
              <Users className="w-5 h-5 text-[#5EB809]" />
            </div>
            <h3 className="font-bold text-base text-[#004F18] mb-1">সরাসরি কৃষক থেকে সংগ্রহ</h3>
            <p className="text-xs text-[#102B16]/70 leading-relaxed">
              সুন্দরবনের মৌয়াল এবং প্রান্তিক কৃষকদের সঠিক পারিশ্রমিক দিয়ে সরাসরি খাবার সংগ্রহ করি।
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#F5FBF2] border border-[#DCECD5]">
            <div className="w-10 h-10 rounded-xl bg-[#004F18] text-white flex items-center justify-center mb-3">
              <ShieldCheck className="w-5 h-5 text-[#5EB809]" />
            </div>
            <h3 className="font-bold text-base text-[#004F18] mb-1">ল্যাব টেস্ট ও সুরক্ষা</h3>
            <p className="text-xs text-[#102B16]/70 leading-relaxed">
              প্রতিটি চালানের আর্দ্রতা ও উপাদান ল্যাব টেস্টের মাধ্যমে কঠোরভাবে যাচাই করা হয়।
            </p>
          </div>
        </div>

        {/* Sourcing Promise */}
        <div className="pt-4 border-t border-[#DCECD5]">
          <h3 className="text-lg font-bold text-[#004F18] mb-2">আমাদের সোর্সিং ও দায়িত্বশীলতা</h3>
          <p className="text-sm text-[#102B16]/80 leading-relaxed">
            {content?.sourcingBn ||
              'সুন্দরবনের গভীর বনানী থেকে খলিশা মধু, যশোরের খেজুরের গুড়, সিরাজগঞ্জের গাওয়া ঘি এবং মানিকগঞ্জের কাঠের ঘানির সরিষার তেল আমরা নিজস্ব প্রতিনিধির সার্বক্ষণিক উপস্থিতিতে প্রক্রিয়াজাত করি।'}
          </p>
        </div>
      </div>
    </div>
  );
};
