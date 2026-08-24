import React from 'react';
import { Award, CheckCircle2, Shield, HeartHandshake, ArrowRight } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

interface QualityPromiseSectionProps {
  onNavigate: (path: string) => void;
}

export const QualityPromiseSection: React.FC<QualityPromiseSectionProps> = ({ onNavigate }) => {
  const { settings } = useStore();
  const content = settings.aboutUsContent;

  return (
    <section className="py-14 bg-[#004F18] text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#5EB809_1px,transparent_1px)] [background-size:24px_24px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Column Story */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 bg-[#5EB809]/20 text-[#5EB809] px-3.5 py-1.5 rounded-full text-xs font-bold border border-[#5EB809]/30">
              <Award className="w-4 h-4" />
              <span className="text-white">আমাদের অঙ্গীকার ও মান নিয়ন্ত্রণ</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white font-['Hind_Siliguri'] leading-snug">
              {content?.headline || 'খাঁটি খাবারের খোঁজে আমাদের নিরলস পথচলা'}
            </h2>

            <p className="text-sm sm:text-base text-white/90 leading-relaxed font-['Hind_Siliguri']">
              {content?.storyBn ||
                'PureGhor শুরু হয়েছিল একটি সহজ উদ্দেশ্য নিয়ে — আপনার পরিবারকে ভেজালমুক্ত, পুষ্টিকর ও প্রকৃত প্রাকৃতিক খাবার উপহার দেওয়া। কোনো কৃত্রিম প্রিজারভেটিভ বা ক্ষতিকারক প্রসেসিং ছাড়াই আমরা পণ্য সংগ্রহ করি।'}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="bg-white/10 p-4 rounded-2xl border border-white/15">
                <div className="flex items-center gap-2.5 text-[#5EB809] font-bold text-sm mb-1 font-['Hind_Siliguri']">
                  <Shield className="w-5 h-5" />
                  <span className="text-white">ল্যাব টেস্ট ও বিশুদ্ধতা</span>
                </div>
                <p className="text-xs text-white/80">
                  প্রতিটি ব্যাচের ঘনত্ব, আর্দ্রতা ও বিশুদ্ধতা সূক্ষ্মভাবে পরীক্ষা করা হয়।
                </p>
              </div>

              <div className="bg-white/10 p-4 rounded-2xl border border-white/15">
                <div className="flex items-center gap-2.5 text-[#5EB809] font-bold text-sm mb-1 font-['Hind_Siliguri']">
                  <HeartHandshake className="w-5 h-5" />
                  <span className="text-white">কৃষক ও মৌয়ালদের সহযোগিতা</span>
                </div>
                <p className="text-xs text-white/80">
                  সরাসরি সুন্দরবনের মৌয়াল এবং প্রত্যন্ত অঞ্চলের গাছিদের সাথে কাজ করি।
                </p>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => onNavigate('/quality-promise')}
                className="bg-[#5EB809] hover:bg-[#4ea204] text-white px-6 py-3 rounded-xl font-black text-sm inline-flex items-center gap-2 transition-all shadow-md active:scale-95 cursor-pointer font-['Hind_Siliguri']"
              >
                <span>কীভাবে পণ্য বাছাই করি বিস্তারিত জানুন</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Column Image & Stats */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/20 bg-white/10 p-2">
              <img
                src="https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80"
                alt="সরাসরি প্রাকৃতিক সোর্সিং"
                className="w-full h-80 object-cover rounded-2xl"
              />
              <div className="absolute bottom-4 left-4 right-4 bg-white text-[#004F18] p-4 rounded-2xl shadow-xl border border-[#DCECD5]">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs text-gray-500 font-bold">সিলেট ও সারা বাংলাদেশ</span>
                    <h4 className="text-base font-black text-[#004F18] font-['Hind_Siliguri']">
                      ১০,০০০+ সন্তুষ্ট পরিবারের ভরসা
                    </h4>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-[#E8F8D8] flex items-center justify-center text-[#5EB809]">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
