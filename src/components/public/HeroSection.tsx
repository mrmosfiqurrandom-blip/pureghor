import React, { useState, useEffect, useRef } from 'react';
import {
  Leaf,
  Sprout,
  ShieldCheck,
  ArrowRight,
  Truck,
  Award,
  Headphones,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { resolveImageUrl, DEFAULT_FALLBACK_IMAGE } from '../../utils/imageUrl';

interface HeroSectionProps {
  onNavigate: (path: string) => void;
}

interface HeroSlide {
  id: string;
  image: string;
  fallback: string;
  alt: string;
  badge: string;
}

const HERO_SLIDES: HeroSlide[] = [
  {
    id: 'slide-1',
    image: '/images/pureghor_store_slide1.png',
    fallback: '/images/hero_new_upload.png',
    alt: 'PureGhor Physical Store Outlet & Attendant',
    badge: 'অরিজিনাল শোরুম ও আউটলেট',
  },
  {
    id: 'slide-2',
    image: '/images/uploaded/img2.jpg',
    fallback: '/images/pureghor_store_slide1.png',
    alt: 'PureGhor ১০০% খাঁটি ও প্রাকৃতিক ফুড',
    badge: '১০০% প্রাকৃতিক ও অর্গানিক',
  },
  {
    id: 'slide-3',
    image: '/images/uploaded/img1.jpg',
    fallback: '/images/pureghor_store_slide1.png',
    alt: 'PureGhor বিশ্বনাথ ও লালাবাজার আউটলেট',
    badge: 'সিলেটের বিশ্বস্ত ব্র্যান্ড',
  },
  {
    id: 'slide-4',
    image: '/images/uploaded/img10.jpg',
    fallback: '/images/pureghor_store_slide1.png',
    alt: 'PureGhor প্রিমিয়াম মধু ও ফুড কম্বো',
    badge: 'স্পেশাল মেগা অফার',
  },
  {
    id: 'slide-5',
    image: '/images/uploaded/img7.jpg',
    fallback: '/images/pureghor_store_slide1.png',
    alt: 'PureGhor ৪ জার এনার্জি বুস্টার কম্বো',
    badge: 'স্বাস্থ্যকর কম্বো প্যাকেজ',
  },
];

export const HeroSection: React.FC<HeroSectionProps> = ({ onNavigate }) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // Auto-play interval
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 4500);

    return () => clearInterval(timer);
  }, [isPaused]);

  const handleNextSlide = () => {
    setCurrentSlideIndex((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  const handlePrevSlide = () => {
    setCurrentSlideIndex((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 45;
    if (distance > minSwipeDistance) {
      handleNextSlide();
    } else if (distance < -minSwipeDistance) {
      handlePrevSlide();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  const handleCategoriesClick = () => {
    const section = document.getElementById('categories-section');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    } else {
      onNavigate('/shop');
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#F5FBF2] via-[#F8FCF5] to-[#F5FBF2] pt-4 pb-8 sm:pt-6 sm:pb-10 lg:pt-8 lg:pb-12 border-b border-[#DCECD5]">
      
      {/* Decorative Organic Floating Leaves (SVG Accents) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none" aria-hidden="true">
        {/* Top Left Leaf */}
        <div className="absolute -top-4 left-10 w-16 h-16 opacity-30 text-[#5EB809] rotate-45 transform">
          <Leaf className="w-full h-full fill-[#5EB809]/20" />
        </div>
        {/* Center Floating Leaf */}
        <div className="absolute top-1/4 left-1/3 w-10 h-10 opacity-25 text-[#3E8418] -rotate-12 transform">
          <Leaf className="w-full h-full fill-[#3E8418]/15" />
        </div>
        {/* Top Center Leaf */}
        <div className="absolute top-8 left-1/2 w-8 h-8 opacity-20 text-[#5EB809] rotate-45 transform">
          <Leaf className="w-full h-full fill-[#5EB809]/20" />
        </div>
        {/* Bottom Left Leaf */}
        <div className="absolute bottom-16 left-4 w-12 h-12 opacity-25 text-[#004F18] -rotate-45 transform">
          <Leaf className="w-full h-full fill-[#004F18]/10" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Main Hero 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-center">
          
          {/* LEFT SIDE: Bengali Content & Actions */}
          <div className="lg:col-span-6 xl:col-span-6 flex flex-col justify-center space-y-5 sm:space-y-6 text-left">
            
            {/* 1. Small Badge */}
            <div className="inline-flex items-center gap-2 bg-[#E8F8D8]/90 border border-[#BDE3A3] text-[#004F18] px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold shadow-xs w-fit backdrop-blur-xs font-['Hind_Siliguri']">
              <Leaf className="w-4 h-4 text-[#5EB809] shrink-0" />
              <span>১০০% প্রাকৃতিক ও বিশুদ্ধ</span>
            </div>

            {/* 2. Main Bengali Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[52px] font-black text-[#0B3818] tracking-tight leading-[1.18] sm:leading-[1.15] font-['Hind_Siliguri']">
              বিশুদ্ধ খাবার,
              <span className="block mt-1 sm:mt-1.5 text-[#004F18]">সুস্থ জীবনের সাথী</span>
            </h1>

            {/* 3. Supporting Text */}
            <p className="text-base sm:text-lg text-[#234A2E] leading-relaxed font-['Hind_Siliguri'] max-w-xl font-normal">
              আপনার সুস্থ জীবনযাপনের জন্য বেছে নিন ১০০% প্রাকৃতিক, অর্গানিক ও ভরসাযোগ্য পণ্য।
            </p>

            {/* 4. 3 Small Trust/Benefit Highlights */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-1 pb-1">
              
              {/* Benefit 1 */}
              <div className="flex items-center gap-2 sm:gap-2.5">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#5EB809] text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Leaf className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="font-['Hind_Siliguri'] min-w-0">
                  <h4 className="font-bold text-xs sm:text-sm text-[#004F18] leading-tight truncate">
                    ১০০% প্রাকৃতিক
                  </h4>
                  <p className="text-[11px] sm:text-xs text-[#102B16]/75 leading-tight truncate mt-0.5">
                    নিরাপদ ও বিশুদ্ধ
                  </p>
                </div>
              </div>

              {/* Benefit 2 */}
              <div className="flex items-center gap-2 sm:gap-2.5">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#5EB809] text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Sprout className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="font-['Hind_Siliguri'] min-w-0">
                  <h4 className="font-bold text-xs sm:text-sm text-[#004F18] leading-tight truncate">
                    অর্গানিক পণ্য
                  </h4>
                  <p className="text-[11px] sm:text-xs text-[#102B16]/75 leading-tight truncate mt-0.5">
                    রাসায়নিকমুক্ত
                  </p>
                </div>
              </div>

              {/* Benefit 3 */}
              <div className="flex items-center gap-2 sm:gap-2.5">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#5EB809] text-white flex items-center justify-center shrink-0 shadow-xs">
                  <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="font-['Hind_Siliguri'] min-w-0">
                  <h4 className="font-bold text-xs sm:text-sm text-[#004F18] leading-tight truncate">
                    বিশ্বাসযোগ্য মান
                  </h4>
                  <p className="text-[11px] sm:text-xs text-[#102B16]/75 leading-tight truncate mt-0.5">
                    ল্যাব টেস্টেড
                  </p>
                </div>
              </div>

            </div>

            {/* 5. CTA Action Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              {/* Primary CTA */}
              <button
                id="hero-primary-shop-btn"
                onClick={() => onNavigate('/shop')}
                className="bg-[#347814] hover:bg-[#004F18] active:scale-[0.98] text-white font-bold text-sm sm:text-base px-6 sm:px-8 py-3.5 rounded-full shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2.5 group cursor-pointer font-['Hind_Siliguri']"
              >
                <span>এখনই কিনুন</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              {/* Secondary CTA */}
              <button
                id="hero-secondary-categories-btn"
                onClick={handleCategoriesClick}
                className="bg-[#E8F8D8]/70 hover:bg-[#E8F8D8] active:scale-[0.98] border border-[#A2D481] text-[#004F18] font-bold text-sm sm:text-base px-6 sm:px-7 py-3.5 rounded-full shadow-xs hover:shadow-sm transition-all duration-200 flex items-center gap-1.5 cursor-pointer font-['Hind_Siliguri']"
              >
                <span>ক্যাটাগরি দেখুন</span>
              </button>
            </div>

          </div>

          {/* RIGHT SIDE: Interactive Image Slider with Auto-Play & Touch Gestures */}
          <div className="lg:col-span-6 xl:col-span-6 flex items-center justify-center relative">
            <div
              className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg border border-[#DCECD5] bg-white group select-none"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              
              {/* Slider Image Container */}
              <div className="relative aspect-[16/10] sm:aspect-[16/9] lg:aspect-[16/10] w-full overflow-hidden bg-[#F0F7ED]">
                {HERO_SLIDES.map((slide, index) => {
                  const isActive = index === currentSlideIndex;
                  return (
                    <div
                      key={slide.id}
                      className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                        isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                      }`}
                    >
                      <img
                        src={slide.image}
                        alt={slide.alt}
                        className={`w-full h-full object-cover object-center transition-transform duration-700 ease-out ${
                          isActive ? 'scale-100' : 'scale-105'
                        }`}
                        onError={(e) => {
                          const target = e.currentTarget as HTMLImageElement;
                          if (target.src !== slide.fallback && slide.fallback) {
                            target.src = slide.fallback;
                          } else if (target.src !== DEFAULT_FALLBACK_IMAGE) {
                            target.src = DEFAULT_FALLBACK_IMAGE;
                          }
                        }}
                      />

                      {/* Vignette Overlay */}
                      <div className="hidden lg:block absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-[#F5FBF2]/40 to-transparent pointer-events-none" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/5 to-transparent pointer-events-none" />
                    </div>
                  );
                })}
              </div>

              {/* Active Slide Identity Badge (Bottom Left) */}
              <div className="absolute bottom-3.5 left-3.5 sm:bottom-4 sm:left-4 z-20 bg-white/95 backdrop-blur-md border border-[#DCECD5] text-[#004F18] px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-bold shadow-md flex items-center gap-2 font-['Hind_Siliguri']">
                <CheckCircle2 className="w-4 h-4 text-[#5EB809] shrink-0" />
                <span>{HERO_SLIDES[currentSlideIndex].badge}</span>
              </div>

              {/* Slider Navigation Arrows (Prev / Next) */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrevSlide();
                }}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 z-20 w-8.5 h-8.5 sm:w-10 sm:h-10 rounded-full bg-white/90 hover:bg-white text-[#004F18] shadow-md border border-[#DCECD5] flex items-center justify-center opacity-80 group-hover:opacity-100 transition-all cursor-pointer hover:scale-105 active:scale-95"
                aria-label="Previous Slide"
              >
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleNextSlide();
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 z-20 w-8.5 h-8.5 sm:w-10 sm:h-10 rounded-full bg-white/90 hover:bg-white text-[#004F18] shadow-md border border-[#DCECD5] flex items-center justify-center opacity-80 group-hover:opacity-100 transition-all cursor-pointer hover:scale-105 active:scale-95"
                aria-label="Next Slide"
              >
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>

              {/* Dot Indicators (Bottom Right) */}
              <div className="absolute bottom-4 right-4 z-20 flex items-center gap-1.5 bg-black/40 backdrop-blur-xs px-2.5 py-1.5 rounded-full">
                {HERO_SLIDES.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentSlideIndex(index);
                    }}
                    className={`transition-all duration-300 rounded-full cursor-pointer ${
                      index === currentSlideIndex
                        ? 'w-5 h-2 bg-[#5EB809]'
                        : 'w-2 h-2 bg-white/70 hover:bg-white'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>

            </div>
          </div>

        </div>

        {/* 4 Trust / Value Feature Pillars (Bottom of Hero) */}
        <div className="mt-8 sm:mt-10 bg-white rounded-2xl sm:rounded-3xl border border-[#DCECD5] shadow-xs px-4 sm:px-6 py-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 divide-y sm:divide-y-0 sm:divide-x divide-[#DCECD5]">
            
            {/* Pillar 1: বিস্তারিত পণ্যের সমাহার */}
            <div className="flex items-center gap-3 sm:gap-3.5 pt-2 sm:pt-0 sm:px-2 first:pt-0">
              <div className="w-10 h-10 rounded-xl bg-[#E8F8D8] text-[#004F18] flex items-center justify-center shrink-0">
                <Leaf className="w-5 h-5 text-[#5EB809]" />
              </div>
              <div className="font-['Hind_Siliguri'] min-w-0">
                <h4 className="font-bold text-xs sm:text-sm text-[#004F18] leading-tight truncate">
                  বিস্তারিত পণ্যের সমাহার
                </h4>
                <p className="text-[11px] sm:text-xs text-[#102B16]/70 leading-tight mt-0.5 truncate">
                  ৩০০০+ পণ্য
                </p>
              </div>
            </div>

            {/* Pillar 2: দ্রুত ডেলিভারি */}
            <div className="flex items-center gap-3 sm:gap-3.5 pt-2 sm:pt-0 sm:px-4">
              <div className="w-10 h-10 rounded-xl bg-[#E8F8D8] text-[#004F18] flex items-center justify-center shrink-0">
                <Truck className="w-5 h-5 text-[#5EB809]" />
              </div>
              <div className="font-['Hind_Siliguri'] min-w-0">
                <h4 className="font-bold text-xs sm:text-sm text-[#004F18] leading-tight truncate">
                  দ্রুত ডেলিভারি
                </h4>
                <p className="text-[11px] sm:text-xs text-[#102B16]/70 leading-tight mt-0.5 truncate">
                  সারা বাংলাদেশে
                </p>
              </div>
            </div>

            {/* Pillar 3: সর্বোচ্চ মানের গ্যারান্টি */}
            <div className="flex items-center gap-3 sm:gap-3.5 pt-2 sm:pt-0 sm:px-4">
              <div className="w-10 h-10 rounded-xl bg-[#E8F8D8] text-[#004F18] flex items-center justify-center shrink-0">
                <Award className="w-5 h-5 text-[#5EB809]" />
              </div>
              <div className="font-['Hind_Siliguri'] min-w-0">
                <h4 className="font-bold text-xs sm:text-sm text-[#004F18] leading-tight truncate">
                  সর্বোচ্চ মানের গ্যারান্টি
                </h4>
                <p className="text-[11px] sm:text-xs text-[#102B16]/70 leading-tight mt-0.5 truncate">
                  ১০০% নিশ্চয়তা
                </p>
              </div>
            </div>

            {/* Pillar 4: গ্রাহক সেবা */}
            <div className="flex items-center gap-3 sm:gap-3.5 pt-2 sm:pt-0 sm:px-4">
              <div className="w-10 h-10 rounded-xl bg-[#E8F8D8] text-[#004F18] flex items-center justify-center shrink-0">
                <Headphones className="w-5 h-5 text-[#5EB809]" />
              </div>
              <div className="font-['Hind_Siliguri'] min-w-0">
                <h4 className="font-bold text-xs sm:text-sm text-[#004F18] leading-tight truncate">
                  গ্রাহক সেবা
                </h4>
                <p className="text-[11px] sm:text-xs text-[#102B16]/70 leading-tight mt-0.5 truncate">
                  ২৪/৭ সাপোর্ট
                </p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};


