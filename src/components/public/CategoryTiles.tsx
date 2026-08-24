import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { PlaceholderImage } from '../common/PlaceholderImage';

interface CategoryTilesProps {
  onNavigate: (path: string) => void;
}

export const CategoryTiles: React.FC<CategoryTilesProps> = ({ onNavigate }) => {
  const { categories } = useStore();
  const activeCategories = categories.filter((c) => c.isActive);

  return (
    <section className="py-12 md:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-[#5EB809] text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>প্রাকৃতিক খাদ্য ভাণ্ডার</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#004F18] font-['Hind_Siliguri']">
            ক্যাটাগরি সমূহ
          </h2>
        </div>
        <button
          onClick={() => onNavigate('/shop')}
          className="text-xs sm:text-sm font-bold text-[#004F18] hover:text-[#5EB809] flex items-center gap-1 group cursor-pointer"
        >
          <span>সবগুলো ক্যাটাগরি দেখুন</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {activeCategories.map((cat) => (
          <div
            key={cat.id}
            onClick={() => onNavigate(`/category/${cat.slug}`)}
            className="group relative bg-white rounded-2xl p-3 sm:p-4 border border-[#DCECD5] hover:border-[#5EB809] hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col items-center text-center"
          >
            {/* Category Image with Circle Container */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-[#F5FBF2] mb-3 group-hover:scale-105 transition-transform duration-200 border border-[#DCECD5]">
              {cat.imageUrl ? (
                <img
                  src={cat.imageUrl}
                  alt={cat.nameBn}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  onError={(e) => {
                    (e.currentTarget as HTMLElement).style.display = 'none';
                  }}
                />
              ) : (
                <PlaceholderImage type="category" text={cat.nameBn} />
              )}
            </div>

            <h3 className="font-bold text-sm text-[#004F18] group-hover:text-[#5EB809] transition-colors line-clamp-1 font-['Hind_Siliguri']">
              {cat.nameBn}
            </h3>
            <span className="text-[11px] text-[#5EB809] font-bold mt-0.5 group-hover:underline">
              দেখুন &rarr;
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};
