import React, { useState, useEffect } from 'react';
import { ArrowRight, ShieldCheck, Sparkles, Award, ChevronLeft, ChevronRight, Store, Flame, HeartHandshake } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

interface HeroSectionProps {
  onNavigate: (path: string) => void;
}

const HERO_SLIDES = [
  {
    id: 'slide-biswanath',
    badge: 'সিলেটের বিখ্যাত ব্র্যান্ড',
    title: 'PureGhor এখন বিশ্বনাথ আউটলেটে!',
    subtitle: 'বিশ্বনাথ শাখা উদ্বোধন উপলক্ষে পাচ্ছেন যেকোনো অর্ডারে বিশেষ ১০% অতিরিক্ত ছাড়। কুপন কোড: PURE10',
    primaryCta: '১০% ছাড়ে শপ করুন',
    primaryLink: '/shop',
    secondaryCta: 'আউটলেটের ঠিকানা',
    secondaryLink: '/about-us',
    image: '/images/pureghor/701370545_844991221981629_1527727780744872160_n.jpg',
    tag: 'উদ্বোধনী অফার',
  },
  {
    id: 'slide-store-welcome',
    badge: 'আমাদের নিজস্ব শোরুম',
    title: 'আপনারা চলে আসুন পিওর ঘরে',
    subtitle: 'লালাবাজার ও বিশ্বনাথ আউটলেটে চোখের সামনে দেখে কিনুন খাঁটি মধু, গাওয়া ঘি, ঘানির তেল ও ড্রাই ফ্রুটস।',
    primaryCta: 'আমাদের পণ্যসমূহ দেখুন',
    primaryLink: '/shop',
    secondaryCta: 'শোরুম গ্যালারি',
    secondaryLink: '/about-us',
    image: '/images/pureghor/781114770_1579141536992901_5028016013915671066_n.jpeg',
    tag: 'সরাসরি শোরুম ভিজিট',
  },
  {
    id: 'slide-honey-nut',
    badge: 'সুপার এনার্জি ফুড',
    title: 'প্রিমিয়াম হানি নাট ও কালোজিরা ফুলের মধু',
    subtitle: 'প্রাকৃতিক মধুর সুমিষ্ট স্বাদ এবং কাঠবাদাম, কাজুবাদাম, পেস্তা ও আখরোটের পুষ্টিকর মেলবন্ধন।',
    primaryCta: 'হানি নাট অর্ডার করুন',
    primaryLink: '/product/premium-honey-nut-jar',
    secondaryCta: 'মানের প্রতিশ্রুতি',
    secondaryLink: '/quality-promise',
    image: '/images/pureghor/731067967_1165096542480498_5504005484939299210_n.jpeg',
    tag: '১০০% খাঁটি ও পুষ্টিকর',
  },
  {
    id: 'slide-nut-combo',
    badge: 'মেগা সেভিংস অফার',
    title: '৪ জার মেগা বাদাম, কিসমিস ও বীজ কম্বো',
    subtitle: 'কাঠ বাদাম + কাজু বাদাম + গোল্ডেন কিসমিস + কুমড়ো বীজ — টোটাল ১ কেজি প্রিমিয়াম ড্রাই ফ্রুটস প্যাক।',
    primaryCta: 'কম্বো অফার নিন',
    primaryLink: '/product/four-jar-nut-seed-combo',
    secondaryCta: 'সকল কম্বো দেখুন',
    secondaryLink: '/shop',
    image: '/images/pureghor/738465049_1960823601232100_4535246048439465719_n.jpeg',
    tag: '১ কেজি মেগা প্যাক',
  },
];

export const HeroSection: React.FC<HeroSectionProps> = ({ onNavigate }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const slide = HERO_SLIDES[currentSlide];

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#004F18] via-[#063b15] to-[#002f0e] text-white py-8 sm:py-12 md:py-16">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#FFFFFF_1.5px,transparent_1.5px)] [background-size:20px_20px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Copy & Interactive Actions */}
          <div className="lg:col-span-7 space-y-5 text-center lg:text-left">
            {/* Heritage Badge */}
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs md:text-sm font-bold text-[#5EB809] border border-white/20 shadow-xs">
              <Sparkles className="w-4 h-4 text-[#5EB809]" />
              <span className="text-white">{slide.badge}</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black font-['Hind_Siliguri'] text-white leading-[1.2] tracking-tight transition-all duration-300">
              {slide.title}
            </h1>

            {/* Supporting Copy */}
            <p className="text-sm sm:text-base md:text-lg text-white/90 max-w-xl mx-auto lg:mx-0 font-normal leading-relaxed font-['Hind_Siliguri']">
              {slide.subtitle}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-1">
              <button
                id="hero-primary-cta"
                onClick={() => onNavigate(slide.primaryLink)}
                className="w-full sm:w-auto min-h-[48px] bg-[#5EB809] hover:bg-[#4ea204] text-white px-7 py-3.5 rounded-2xl font-black text-base flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all cursor-pointer font-['Hind_Siliguri']"
              >
                <span>{slide.primaryCta}</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <button
                id="hero-secondary-cta"
                onClick={() => onNavigate(slide.secondaryLink)}
                className="w-full sm:w-auto min-h-[48px] bg-white/10 hover:bg-white/20 text-white border border-white/20 px-5 py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer font-['Hind_Siliguri']"
              >
                <Store className="w-4 h-4 text-[#5EB809]" />
                <span>{slide.secondaryCta}</span>
              </button>
            </div>

            {/* Micro proof badges */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6 pt-3 text-xs text-white/80 font-medium border-t border-white/10">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#5EB809]" />
                <span>১০০% রাসায়নিক মুক্ত</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-[#E89D10]" />
                <span>১০% উদ্বোধনী ছাড়</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[#5EB809]">🚚</span>
                <span>সারা দেশে ক্যাশ অন ডেলিভারি</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Image Card with Carousel Controls */}
          <div className="lg:col-span-5 relative flex flex-col items-center">
            <div className="relative w-full max-w-md bg-white/10 p-3 sm:p-4 rounded-3xl backdrop-blur-md border border-white/20 shadow-2xl overflow-hidden group">
              
              {/* Main Visual Image */}
              <div className="relative aspect-4/3 rounded-2xl overflow-hidden shadow-inner bg-[#102B16]">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />
                
                {/* Top Badge */}
                <div className="absolute top-3 left-3 bg-[#5EB809] text-white text-[11px] font-black px-2.5 py-1 rounded-full shadow-md">
                  {slide.tag}
                </div>

                {/* Bottom Overlay Label */}
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <p className="font-bold text-sm font-['Hind_Siliguri'] line-clamp-1">
                    {slide.title}
                  </p>
                </div>
              </div>

              {/* Slider Arrow Controls */}
              <div className="flex items-center justify-between mt-3 px-1">
                <div className="flex items-center gap-1.5">
                  {HERO_SLIDES.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentSlide(idx)}
                      className={`h-2 rounded-full transition-all cursor-pointer ${
                        currentSlide === idx ? 'w-6 bg-[#5EB809]' : 'w-2 bg-white/40 hover:bg-white/70'
                      }`}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)}
                    className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center transition-colors cursor-pointer"
                    aria-label="Previous slide"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length)}
                    className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center transition-colors cursor-pointer"
                    aria-label="Next slide"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Floating Value Card under hero box */}
            <div className="mt-3 bg-white text-[#004F18] px-4 py-2.5 rounded-2xl shadow-xl border border-[#DCECD5] flex items-center gap-3 w-full max-w-md">
              <div className="w-9 h-9 rounded-xl bg-[#5EB809] text-white flex items-center justify-center font-black text-xs shrink-0 shadow-xs">
                ১০%
              </div>
              <div className="flex-1">
                <h4 className="text-xs font-bold font-['Hind_Siliguri'] text-[#004F18]">বিশ্বনাথ শাখা উদ্বোধনী কুপন</h4>
                <p className="text-[11px] text-[#004F18] font-bold">কুপন কোড: <span className="font-mono bg-[#F5FBF2] px-1.5 py-0.5 rounded border border-[#DCECD5] text-[#004F18]">PURE10</span></p>
              </div>
              <button
                onClick={() => onNavigate('/shop')}
                className="text-xs bg-[#004F18] hover:bg-[#5EB809] text-white px-3 py-1.5 rounded-xl font-bold transition-colors cursor-pointer shrink-0"
              >
                ব্যবহার করুন
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
