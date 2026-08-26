import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight, ShieldCheck, Award, Flame } from 'lucide-react';
import { resolveImageUrl, DEFAULT_FALLBACK_IMAGE } from '../../utils/imageUrl';

interface HeroSectionProps {
  onNavigate: (path: string) => void;
}

interface HeroSlide {
  id: string;
  badge: string;
  headlineMain: string;
  headlineHighlight: string;
  subtitle: string;
  ctaText: string;
  targetLink: string;
  image: string;
  bgGradient: string;
  overlayAccent: string;
}

const HERO_SLIDES: HeroSlide[] = [
  {
    id: 'slide-booster',
    badge: '১০০% প্রাকৃতিক ও পুষ্টিকর',
    headlineMain: 'শারীরিক এনার্জির পাওয়ার বুস্টার',
    headlineHighlight: 'রসুনজিরা ও হানি নাট',
    subtitle: 'কালোজিরা ফুলের মধু, কাজু-কাঠবাদাম, পেস্তা ও ভেষজ উপাদানের অতুলনীয় সংমিশ্রণ।',
    ctaText: 'এখনই অর্ডার করুন',
    targetLink: '/product/premium-honey-nut-jar',
    image: '/images/pureghor/777916124_1726477055273195_4515666685499235866_n.jpeg',
    bgGradient: 'from-[#0B3818] via-[#004F18] to-[#123B19]',
    overlayAccent: 'bg-[#5EB809]',
  },
  {
    id: 'slide-nut-combo',
    badge: 'মেগা সেভিংস অফার',
    headlineMain: '৪ জার মেগা বাদাম, কিসমিস ও',
    headlineHighlight: 'মিষ্টি কুমড়ো বীজ কম্বো',
    subtitle: 'কাঠবাদাম + কাজুবাদাম + গোল্ডেন কিসমিস + কুমড়ো বীজ — টোটাল ১ কেজি প্রিমিয়াম প্যাক।',
    ctaText: 'কম্বো অফার নিন',
    targetLink: '/product/four-jar-nut-seed-combo',
    image: '/images/pureghor/738465049_1960823601232100_4535246048439465719_n.jpeg',
    bgGradient: 'from-[#173812] via-[#004F18] to-[#1B4D20]',
    overlayAccent: 'bg-[#E89D10]',
  },
  {
    id: 'slide-ghee-mustard',
    badge: 'ঐতিহ্যবাহী খাঁটি স্বাদ',
    headlineMain: 'সিরাজগঞ্জের দানাদার গাওয়া ঘি ও',
    headlineHighlight: 'ঘানির খাঁটি সরিষার তেল',
    subtitle: 'গাভীর দুধের মাখন থেকে জ্বাল দেওয়া সুগন্ধি ঘি ও কাঠের ঘানিতে প্রথম চাপের তেল।',
    ctaText: 'ঘি ও তেল দেখুন',
    targetLink: '/category/ghee-and-oils',
    image: '/images/pureghor/731843570_3182118701988973_854022805183807248_n.jpeg',
    bgGradient: 'from-[#0F3517] via-[#004F18] to-[#0A2610]',
    overlayAccent: 'bg-[#5EB809]',
  },
  {
    id: 'slide-biswanath-opening',
    badge: 'সিলেটের বিখ্যাত ব্র্যান্ড',
    headlineMain: 'PureGhor এখন বিশ্বনাথ ও',
    headlineHighlight: 'লালাবাজার আউটলেটে',
    subtitle: 'নতুন শাখা উদ্বোধন উপলক্ষে যেকোনো অর্ডারে পাচ্ছেন ১০% বিশেষ ছাড়। কোড: PURE10',
    ctaText: '১০% ছাড়ে শপ করুন',
    targetLink: '/shop',
    image: '/images/pureghor/701370545_844991221981629_1527727780744872160_n.jpg',
    bgGradient: 'from-[#004F18] via-[#063B14] to-[#01260C]',
    overlayAccent: 'bg-[#5EB809]',
  },
];

export const HeroSection: React.FC<HeroSectionProps> = ({ onNavigate }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const touchStartX = useRef<number | null>(null);

  // Auto slide interval (pauses on hover)
  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5500);
    return () => clearInterval(interval);
  }, [isHovered]);

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;
    if (diff > 50) {
      handleNext();
    } else if (diff < -50) {
      handlePrev();
    }
    touchStartX.current = null;
  };

  const activeSlide = HERO_SLIDES[currentSlide];

  return (
    <section className="pt-4 pb-6 sm:pt-6 sm:pb-8 bg-[#F5FBF2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main 2-Column Hero Grid Matching the Screenshot */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 items-stretch">
          
          {/* ================= LEFT: Large Featured Banner Carousel (8 cols) ================= */}
          <div
            className="lg:col-span-8 relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-md border border-[#DCECD5] group min-h-[340px] sm:min-h-[380px] md:min-h-[440px] flex flex-col justify-end"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {/* Background Slides with Fade Transition */}
            {HERO_SLIDES.map((s, index) => (
              <div
                key={s.id}
                className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                  index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                }`}
              >
                {/* Background Image */}
                <img
                  src={resolveImageUrl(s.image)}
                  alt={s.headlineMain}
                  className="w-full h-full object-cover object-center transform scale-100 group-hover:scale-105 transition-transform duration-1000"
                  onError={(e) => {
                    const target = e.currentTarget as HTMLImageElement;
                    if (target.src !== DEFAULT_FALLBACK_IMAGE) {
                      target.src = DEFAULT_FALLBACK_IMAGE;
                    }
                  }}
                />
                {/* High Contrast Gradient Overlay for Crisp Bangla Readability */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#003B12]/95 via-[#004F18]/80 to-transparent lg:w-4/5" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent lg:hidden" />
              </div>
            ))}

            {/* Slide Content Overlay */}
            <div className="relative z-20 p-5 sm:p-7 md:p-9 max-w-xl text-white">
              {/* Badge */}
              <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md border border-white/25 px-3 py-1 rounded-full text-xs font-bold text-[#5EB809] mb-3 shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-[#5EB809]" />
                <span className="text-white font-['Hind_Siliguri']">{activeSlide.badge}</span>
              </div>

              {/* Big Bangla Display Headline */}
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[40px] font-black font-['Hind_Siliguri'] leading-[1.25] tracking-tight text-white mb-2.5 drop-shadow-md">
                {activeSlide.headlineMain} <br className="hidden sm:inline" />
                <span className="text-[#5EB809] drop-shadow-sm">{activeSlide.headlineHighlight}</span>
              </h1>

              {/* Subtitle */}
              <p className="text-xs sm:text-sm md:text-base text-white/90 leading-relaxed font-normal mb-5 max-w-md font-['Hind_Siliguri'] line-clamp-2 sm:line-clamp-none">
                {activeSlide.subtitle}
              </p>

              {/* Action Button */}
              <div className="flex items-center gap-3">
                <button
                  id={`hero-slide-btn-${activeSlide.id}`}
                  onClick={() => onNavigate(activeSlide.targetLink)}
                  className="bg-[#5EB809] hover:bg-[#4ea204] text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl font-bold text-sm sm:text-base flex items-center gap-2 shadow-lg hover:shadow-xl active:scale-95 transition-all cursor-pointer font-['Hind_Siliguri'] group/btn"
                >
                  <span>{activeSlide.ctaText}</span>
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            {/* Prev / Next Circular Navigation Arrow Buttons on Left and Right Edges */}
            <button
              onClick={handlePrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-30 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/85 hover:bg-white text-[#004F18] hover:text-[#5EB809] shadow-lg flex items-center justify-center transition-all cursor-pointer backdrop-blur-xs active:scale-90"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              onClick={handleNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-30 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/85 hover:bg-white text-[#004F18] hover:text-[#5EB809] shadow-lg flex items-center justify-center transition-all cursor-pointer backdrop-blur-xs active:scale-90"
              aria-label="Next slide"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Slide Indicator Dots at Bottom Center */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1.5 bg-black/30 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
              {HERO_SLIDES.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    currentSlide === idx
                      ? 'w-6 bg-[#5EB809]'
                      : 'w-2 bg-white/60 hover:bg-white'
                  }`}
                  aria-label={`Slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>


          {/* ================= RIGHT: Two Stacked Promo Banners (4 cols) ================= */}
          <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-4 sm:gap-5 justify-between">
            
            {/* Top Promo Card: Family Occasion / Spices & Oils */}
            <div
              onClick={() => onNavigate('/shop')}
              className="relative flex-1 rounded-2xl sm:rounded-3xl overflow-hidden shadow-md border border-[#DCECD5] group cursor-pointer min-h-[170px] sm:min-h-[185px] lg:min-h-0 flex flex-col justify-end bg-[#004F18]"
            >
              <img
                src={resolveImageUrl('/images/pureghor/738465049_1960823601232100_4535246048439465719_n.jpeg')}
                alt="সব আয়োজন পরিবারের সাথে"
                className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                onError={(e) => {
                  const target = e.currentTarget as HTMLImageElement;
                  if (target.src !== DEFAULT_FALLBACK_IMAGE) target.src = DEFAULT_FALLBACK_IMAGE;
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#003B12]/95 via-[#004F18]/60 to-black/10 group-hover:via-[#004F18]/50 transition-colors" />

              {/* Text Badge & Content */}
              <div className="relative z-10 p-4 sm:p-5 text-white">
                <div className="inline-flex items-center gap-1 bg-[#E89D10] text-[#102B16] text-[10px] font-black px-2.5 py-0.5 rounded-full mb-1.5 shadow-xs uppercase tracking-wider">
                  <span>সবসময় সব আয়োজনে</span>
                </div>
                <h3 className="font-bold text-base sm:text-lg text-white font-['Hind_Siliguri'] leading-tight mb-1 group-hover:text-[#5EB809] transition-colors">
                  পরিবারের সাথে খাঁটি মসলা ও তেল
                </h3>
                <p className="text-[11px] sm:text-xs text-white/80 line-clamp-1 font-['Hind_Siliguri']">
                  ১০০% খাঁটি ও অর্গানিক পণ্যের সেরা সমাহার &rarr;
                </p>
              </div>

              {/* Quality Seal Badge in Corner */}
              <div className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white shadow-xs">
                <Award className="w-5 h-5 text-[#5EB809]" />
              </div>
            </div>

            {/* Bottom Promo Card: Pure Cow Ghee Everyday */}
            <div
              onClick={() => onNavigate('/category/ghee-and-oils')}
              className="relative flex-1 rounded-2xl sm:rounded-3xl overflow-hidden shadow-md border border-[#DCECD5] group cursor-pointer min-h-[170px] sm:min-h-[185px] lg:min-h-0 flex flex-col justify-end bg-[#0B3512]"
            >
              <img
                src={resolveImageUrl('/images/pureghor/731843570_3182118701988973_854022805183807248_n.jpeg')}
                alt="আয়োজনে প্রতিদিন খাঁটি গাওয়া ঘি"
                className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                onError={(e) => {
                  const target = e.currentTarget as HTMLImageElement;
                  if (target.src !== DEFAULT_FALLBACK_IMAGE) target.src = DEFAULT_FALLBACK_IMAGE;
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#003B12]/95 via-[#004F18]/60 to-black/10 group-hover:via-[#004F18]/50 transition-colors" />

              {/* Text Badge & Content */}
              <div className="relative z-10 p-4 sm:p-5 text-white">
                <div className="inline-flex items-center gap-1 bg-[#5EB809] text-white text-[10px] font-black px-2.5 py-0.5 rounded-full mb-1.5 shadow-xs uppercase tracking-wider">
                  <span>আয়োজনে প্রতিদিন</span>
                </div>
                <h3 className="font-bold text-base sm:text-lg text-white font-['Hind_Siliguri'] leading-tight mb-1 group-hover:text-[#5EB809] transition-colors">
                  খাঁটি গাওয়া ঘি — প্রিমিয়াম কোয়ালিটি
                </h3>
                <p className="text-[11px] sm:text-xs text-white/80 line-clamp-1 font-['Hind_Siliguri']">
                  সিরাজগঞ্জের ঐতিহ্যবাহী দানাদার গাওয়া ঘি &rarr;
                </p>
              </div>

              {/* 100% Pure Seal Badge in Corner */}
              <div className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white shadow-xs">
                <ShieldCheck className="w-5 h-5 text-[#5EB809]" />
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
