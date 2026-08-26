import React from 'react';
import { Sparkles, ChevronRight } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { resolveImageUrl, DEFAULT_FALLBACK_IMAGE } from '../../utils/imageUrl';

interface CategoryTilesProps {
  onNavigate: (path: string) => void;
}

// Fallback category visual icons/images mapping to ensure every category card looks stunning
const CATEGORY_VISUALS: Record<string, { labelEn: string; labelBn: string; image: string }> = {
  'honey-nuts': {
    labelEn: 'HONEY',
    labelBn: 'মধু ও হানি নাট',
    image: '/images/pureghor/778160023_1968999603762127_8330157447235278502_n.jpeg',
  },
  'nuts-and-seeds': {
    labelEn: 'NUTS & SEEDS',
    labelBn: 'ড্রাই ফ্রুটস ও বাদাম',
    image: '/images/pureghor/738465049_1960823601232100_4535246048439465719_n.jpeg',
  },
  'ghee-and-oils': {
    labelEn: 'PURE GHEE & OIL',
    labelBn: 'গাওয়া ঘি ও তেল',
    image: '/images/pureghor/731843570_3182118701988973_854022805183807248_n.jpeg',
  },
  'oats-and-superfood': {
    labelEn: 'DRY FOOD & OATS',
    labelBn: 'ওটস ও সুপারফুড',
    image: '/images/pureghor/722119294_1968026900508945_6535640957699175289_n.jpeg',
  },
  'khejurer-gur': {
    labelEn: 'DATES & GUR (খেজুর)',
    labelBn: 'খেজুরের গুড় ও মিষ্টি',
    image: '/images/pureghor/772513850_1055475870270979_5142302322816849426_n.jpeg',
  },
  'spices-and-balachao': {
    labelEn: 'SPICES & BALACHAO',
    labelBn: 'মসলা ও বালাচাও',
    image: '/images/pureghor/740259912_853043360933083_8062257320957614052_n.jpeg',
  },
};

export const CategoryTiles: React.FC<CategoryTilesProps> = ({ onNavigate }) => {
  const { categories } = useStore();
  const activeCategories = categories.filter((c) => c.isActive);

  return (
    <section id="categories-section" className="py-6 sm:py-8 md:py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header matching the screenshot: Shop by Category */}
      <div className="flex items-center justify-between mb-5 sm:mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-[#004F18] font-['Hind_Siliguri'] flex items-center gap-2">
            <span>Shop by Category</span>
            <span className="text-sm sm:text-base font-bold text-[#004F18]/60">
              (ক্যাটাগরি সমূহ)
            </span>
          </h2>
        </div>

        <button
          onClick={() => onNavigate('/shop')}
          className="text-xs sm:text-sm font-bold text-[#004F18] hover:text-[#5EB809] flex items-center gap-1 group cursor-pointer transition-colors"
        >
          <span>সকল পণ্য দেখুন</span>
          <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Horizontal Category Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
        {activeCategories.map((cat) => {
          const visual = CATEGORY_VISUALS[cat.slug];
          const displayLabel = visual?.labelEn || cat.nameEn || cat.nameBn.toUpperCase();
          const imageUrl = cat.imageUrl || visual?.image || DEFAULT_FALLBACK_IMAGE;

          return (
            <div
              key={cat.id}
              onClick={() => onNavigate(`/category/${cat.slug}`)}
              className="group bg-white hover:bg-[#F5FBF2] rounded-2xl p-3 sm:p-4 border border-[#DCECD5] hover:border-[#5EB809] hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col items-center text-center justify-between select-none"
            >
              {/* Product / Category Thumbnail with clean background */}
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-white mb-2.5 flex items-center justify-center p-1 group-hover:scale-105 transition-transform duration-300">
                <img
                  src={resolveImageUrl(imageUrl)}
                  alt={cat.nameBn}
                  className="w-full h-full object-contain object-center"
                  loading="lazy"
                  onError={(e) => {
                    const target = e.currentTarget as HTMLImageElement;
                    if (target.src !== DEFAULT_FALLBACK_IMAGE) {
                      target.src = DEFAULT_FALLBACK_IMAGE;
                    }
                  }}
                />
              </div>

              {/* Category Label in Bold Uppercase matching screenshot */}
              <div className="w-full">
                <h3 className="font-bold text-xs sm:text-sm text-[#004F18] group-hover:text-[#5EB809] tracking-tight uppercase transition-colors truncate">
                  {displayLabel}
                </h3>
                <p className="text-[11px] text-gray-500 font-['Hind_Siliguri'] truncate mt-0.5">
                  {cat.nameBn}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
