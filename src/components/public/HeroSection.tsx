import React from 'react';
import { ArrowRight, ShieldCheck, Sparkles, Award } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

interface HeroSectionProps {
  onNavigate: (path: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onNavigate }) => {
  const { settings, banners } = useStore();
  const heroBanner = banners.find((b) => b.type === 'hero' && b.isActive);

  const headline = heroBanner?.titleBn || 'আপনার পরিবারের জন্য সত্যিকারের খাঁটি খাবার';
  const subtitle =
    heroBanner?.subtitleBn || 'নির্বাচিত উৎস থেকে সংগ্রহ, যত্নে প্যাকেজিং এবং ঘরে পৌঁছে দেওয়া।';
  const ctaText = heroBanner?.ctaTextBn || 'এখনই শপ করুন';
  const heroBg = heroBanner?.imageUrl || '';

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#004F18] via-[#083F15] to-[#004F18] text-white py-12 md:py-20">
      {/* Background Graphic Pattern */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#FFFFFF_1.5px,transparent_1.5px)] [background-size:20px_20px]" />
      
      {/* Optional custom hero background image with dark overlay */}
      {heroBg && (
        <div className="absolute inset-0 z-0 opacity-25">
          <img
            src={heroBg}
            alt={heroBanner?.altText || 'Hero background'}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#004F18] via-[#004F18]/90 to-transparent" />
        </div>
      )}

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Column: Copy and CTA */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Heritage Badge */}
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs md:text-sm font-semibold text-[#5EB809] border border-white/20">
              <Sparkles className="w-4 h-4 text-[#5EB809]" />
              <span className="text-white">সিলেটের বিখ্যাত বিশ্বস্ত ব্র্যান্ড</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-['Hind_Siliguri'] text-white leading-[1.2] tracking-tight">
              {headline}
            </h1>

            {/* Supporting Copy */}
            <p className="text-base sm:text-lg text-white/90 max-w-xl mx-auto lg:mx-0 font-normal leading-relaxed font-['Hind_Siliguri']">
              {subtitle}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={() => onNavigate('/shop')}
                className="w-full sm:w-auto min-h-[48px] bg-[#5EB809] hover:bg-[#4ea204] text-white px-8 py-3.5 rounded-2xl font-black text-base flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all cursor-pointer font-['Hind_Siliguri']"
              >
                <span>{ctaText}</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <button
                onClick={() => onNavigate('/quality-promise')}
                className="w-full sm:w-auto min-h-[48px] bg-white/10 hover:bg-white/20 text-white border border-white/20 px-6 py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer font-['Hind_Siliguri']"
              >
                <Award className="w-4 h-4 text-[#5EB809]" />
                <span>আমাদের মানের প্রতিশ্রুতি দেখুন</span>
              </button>
            </div>

            {/* Micro proof badges */}
            <div className="flex items-center justify-center lg:justify-start gap-6 pt-4 text-xs text-white/80 font-medium border-t border-white/10">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#5EB809]" />
                <span>১০০% রাসায়নিক মুক্ত</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[#5EB809]">🚚</span>
                <span>সারা দেশে ক্যাশ অন ডেলিভারি</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Showcase */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="relative w-full max-w-md bg-gradient-to-b from-white/15 to-white/5 p-4 rounded-3xl backdrop-blur-md border border-white/20 shadow-2xl">
              
              {/* Main Visual Image (Organic Product Collection) */}
              <div className="relative aspect-4/3 rounded-2xl overflow-hidden shadow-inner bg-[#F5FBF2]">
                <img
                  src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80"
                  alt="PureGhor খাঁটি খাদ্য পরিবার"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#004F18]/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="bg-[#5EB809] text-white text-[11px] font-black px-2 py-0.5 rounded uppercase">
                    খাঁটি পণ্য উৎসব
                  </span>
                  <p className="font-bold text-base mt-1 font-['Hind_Siliguri']">
                    সুন্দরবনের মধু, গাওয়া ঘি ও ঘানির খাঁটি তেল
                  </p>
                </div>
              </div>

              {/* Floating Value Card */}
              <div className="absolute -bottom-4 -left-4 bg-white text-[#004F18] p-3 rounded-2xl shadow-xl border border-[#DCECD5] flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#5EB809] text-white flex items-center justify-center font-black text-sm shadow-xs">
                  ১০%
                </div>
                <div>
                  <h4 className="text-xs font-bold font-['Hind_Siliguri']">উদ্বোধনী বিশেষ অফার</h4>
                  <p className="text-[11px] text-[#004F18] font-black">কুপন কোড: PURE10</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
