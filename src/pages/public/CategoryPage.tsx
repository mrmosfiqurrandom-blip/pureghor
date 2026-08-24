import React from 'react';
import { ChevronRight, ArrowLeft } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from '../../components/common/ProductCard';
import { PlaceholderImage } from '../../components/common/PlaceholderImage';

interface CategoryPageProps {
  slug: string;
  onNavigate: (path: string) => void;
}

export const CategoryPage: React.FC<CategoryPageProps> = ({ slug, onNavigate }) => {
  const { categories, products } = useStore();
  const category = categories.find((c) => c.slug === slug);

  if (!category) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-[#123B2A] mb-4">ক্যাটাগরি পাওয়া যায়নি</h2>
        <button
          onClick={() => onNavigate('/shop')}
          className="bg-[#1F6B45] text-white px-6 py-2.5 rounded-full text-sm font-bold"
        >
          সকল পণ্য দেখুন
        </button>
      </div>
    );
  }

  const categoryProducts = products.filter((p) => p.categoryId === category.id);

  return (
    <div className="py-8 md:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 mb-6 font-['Hind_Siliguri']">
        <button onClick={() => onNavigate('/')} className="hover:text-[#1F6B45]">
          হোম
        </button>
        <ChevronRight className="w-3.5 h-3.5" />
        <button onClick={() => onNavigate('/shop')} className="hover:text-[#1F6B45]">
          শপ
        </button>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-[#123B2A] font-bold">{category.nameBn}</span>
      </div>

      {/* Category Banner Card */}
      <div className="relative rounded-3xl overflow-hidden bg-[#123B2A] text-white p-6 sm:p-10 mb-10 shadow-sm border border-[#1F6B45]/30">
        <div className="relative z-10 max-w-2xl">
          <span className="bg-[#D99A2B] text-[#123B2A] text-xs font-black px-2.5 py-1 rounded-md uppercase tracking-wider">
            খাঁটি কালেকশন
          </span>
          <h1 className="text-2xl sm:text-4xl font-black text-[#FFF8EA] font-['Hind_Siliguri'] mt-3 mb-2">
            {category.nameBn}
          </h1>
          <p className="text-sm sm:text-base text-white/80 leading-relaxed font-['Hind_Siliguri']">
            {category.descriptionBn}
          </p>
          <div className="mt-4 text-xs font-bold text-[#D99A2B]">
            মোট {categoryProducts.length} টি পণ্য প্রস্তুত রয়েছে
          </div>
        </div>

        {category.imageUrl && (
          <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-20 hidden md:block">
            <img
              src={category.imageUrl}
              alt={category.nameBn}
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </div>

      {/* Product Grid */}
      {categoryProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {categoryProducts.map((prod) => (
            <ProductCard key={prod.id} product={prod} onNavigate={onNavigate} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center border border-[#E5E0D5]">
          <p className="text-sm text-gray-500 mb-4">এই ক্যাটাগরিতে বর্তমানে কোনো পণ্য যোগ করা হয়নি।</p>
          <button
            onClick={() => onNavigate('/shop')}
            className="bg-[#1F6B45] text-white px-5 py-2 rounded-full text-xs font-bold"
          >
            অন্যান্য পণ্য দেখুন
          </button>
        </div>
      )}
    </div>
  );
};
