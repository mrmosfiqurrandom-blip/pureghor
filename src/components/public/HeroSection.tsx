import React, { useState, useEffect, useRef, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { resolveImageUrl, DEFAULT_FALLBACK_IMAGE } from '../../utils/imageUrl';

interface HeroSectionProps {
  onNavigate: (path: string) => void;
}

// Fallback banner slides if no custom hero banners are in store
const DEFAULT_HERO_BANNERS = [
  {
    id: 'def-ban-1',
    imageUrl: '/images/pureghor/701370545_844991221981629_1527727780744872160_n.jpg',
    targetUrl: '/shop',
    altText: 'PureGhor বিশেষ অফার ব্যানার',
  },
  {
    id: 'def-ban-2',
    imageUrl: '/images/pureghor/777916124_1726477055273195_4515666685499235866_n.jpeg',
    targetUrl: '/product/premium-honey-nut-jar',
    altText: 'শারীরিক এনার্জির পাওয়ার বুস্টার হানি নাট ব্যানার',
  },
  {
    id: 'def-ban-3',
    imageUrl: '/images/pureghor/738465049_1960823601232100_4535246048439465719_n.jpeg',
    targetUrl: '/product/four-jar-nut-seed-combo',
    altText: '৪ জার মেগা বাদাম ও কিসমিস কম্বো ব্যানার',
  },
  {
    id: 'def-ban-4',
    imageUrl: '/images/pureghor/781114770_1579141536992901_5028016013915671066_n.jpeg',
    targetUrl: '/about',
    altText: 'PureGhor আউটলেট ব্যানার',
  },
];

export const HeroSection: React.FC<HeroSectionProps> = ({ onNavigate }) => {
  const { banners } = useStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const touchStartX = useRef<number | null>(null);

  // Active hero slides from database or fallback defaults
  const activeSlides = useMemo(() => {
    const customBanners = banners
      .filter((b) => b.isActive && (b.type === 'hero' || !b.type))
      .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))
      .map((b) => ({
        id: b.id,
        imageUrl: b.imageUrl,
        targetUrl: b.targetUrl || '/shop',
        altText: b.altText || b.titleBn || 'PureGhor Banner',
      }));

    if (customBanners.length > 0) {
      return customBanners;
    }
    return DEFAULT_HERO_BANNERS;
  }, [banners]);

  // Keep index within bounds if slide count changes
  useEffect(() => {
    if (currentIndex >= activeSlides.length) {
      setCurrentIndex(0);
    }
  }, [activeSlides.length, currentIndex]);

  // Auto-slide every 5 seconds (pauses on hover)
  useEffect(() => {
    if (isHovered || activeSlides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isHovered, activeSlides.length]);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + activeSlides.length) % activeSlides.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % activeSlides.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;
    if (diff > 45) {
      // Swiped left -> next slide
      setCurrentIndex((prev) => (prev + 1) % activeSlides.length);
    } else if (diff < -45) {
      // Swiped right -> prev slide
      setCurrentIndex((prev) => (prev - 1 + activeSlides.length) % activeSlides.length);
    }
    touchStartX.current = null;
  };

  const handleBannerClick = (targetUrl?: string) => {
    if (targetUrl) {
      onNavigate(targetUrl);
    } else {
      onNavigate('/shop');
    }
  };

  return (
    <section className="pt-3 pb-4 sm:pt-4 sm:pb-6 bg-[#F5FBF2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Full-width responsive sliding banner container */}
        <div
          id="hero-banner-carousel"
          className="relative w-full overflow-hidden rounded-2xl sm:rounded-3xl shadow-sm border border-[#DCECD5] bg-white group select-none"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Horizontal Slide Track with smooth CSS transform */}
          <div
            className="flex transition-transform duration-500 ease-out will-change-transform"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {activeSlides.map((slide, idx) => (
              <div
                key={slide.id || idx}
                className="w-full shrink-0 cursor-pointer"
                onClick={() => handleBannerClick(slide.targetUrl)}
              >
                <div className="relative w-full aspect-[2.4/1] sm:aspect-[2.8/1] md:aspect-[3.2/1] lg:aspect-[3.5/1] min-h-[160px] max-h-[440px] bg-[#E8F8D8]/40 overflow-hidden">
                  <img
                    src={resolveImageUrl(slide.imageUrl)}
                    alt={slide.altText}
                    className="w-full h-full object-cover object-center"
                    loading={idx === 0 ? 'eager' : 'lazy'}
                    onError={(e) => {
                      const target = e.currentTarget as HTMLImageElement;
                      if (target.src !== DEFAULT_FALLBACK_IMAGE) {
                        target.src = DEFAULT_FALLBACK_IMAGE;
                      }
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Left Arrow Button */}
          {activeSlides.length > 1 && (
            <button
              id="hero-banner-prev-btn"
              onClick={handlePrev}
              className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/90 hover:bg-white text-[#004F18] shadow-lg flex items-center justify-center transition-all opacity-80 hover:opacity-100 group-hover:scale-105 active:scale-95 cursor-pointer backdrop-blur-xs"
              aria-label="Previous Slide"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          )}

          {/* Right Arrow Button */}
          {activeSlides.length > 1 && (
            <button
              id="hero-banner-next-btn"
              onClick={handleNext}
              className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/90 hover:bg-white text-[#004F18] shadow-lg flex items-center justify-center transition-all opacity-80 hover:opacity-100 group-hover:scale-105 active:scale-95 cursor-pointer backdrop-blur-xs"
              aria-label="Next Slide"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          )}

          {/* Slide Indicator Dots at Bottom */}
          {activeSlides.length > 1 && (
            <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 sm:gap-2 bg-black/25 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
              {activeSlides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentIndex(idx);
                  }}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    currentIndex === idx
                      ? 'w-6 sm:w-7 bg-[#5EB809]'
                      : 'w-2 bg-white/70 hover:bg-white'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>

      </div>
    </section>
  );
};
