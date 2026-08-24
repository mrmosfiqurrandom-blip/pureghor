import React, { useState } from 'react';
import { Sparkles, Trophy, Flame } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from '../common/ProductCard';

interface ProductGridSectionProps {
  onNavigate: (path: string) => void;
}

export const ProductGridSection: React.FC<ProductGridSectionProps> = ({ onNavigate }) => {
  const { products } = useStore();
  const [activeTab, setActiveTab] = useState<'bestseller' | 'new' | 'all'>('bestseller');

  const bestSellers = products.filter((p) => p.isFeatured);
  const newArrivals = [...products].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const displayList =
    activeTab === 'bestseller' ? bestSellers : activeTab === 'new' ? newArrivals : products;

  return (
    <section className="py-12 md:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header with Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-[#5EB809] text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>আমাদের প্রিমিয়াম কালেকশন</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#004F18] font-['Hind_Siliguri']">
            জনপ্রিয় ও নির্বাচিত পণ্যসমূহ
          </h2>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center bg-white p-1 rounded-2xl border border-[#DCECD5] self-start sm:self-auto shadow-2xs">
          <button
            onClick={() => setActiveTab('bestseller')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'bestseller'
                ? 'bg-[#004F18] text-white shadow-xs'
                : 'text-[#102B16]/70 hover:text-[#004F18]'
            }`}
          >
            <Trophy className="w-3.5 h-3.5 text-[#5EB809]" />
            <span>বেস্ট সেলার</span>
          </button>
          <button
            onClick={() => setActiveTab('new')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'new'
                ? 'bg-[#004F18] text-white shadow-xs'
                : 'text-[#102B16]/70 hover:text-[#004F18]'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-[#5EB809]" />
            <span>নতুন পণ্য</span>
          </button>
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'all'
                ? 'bg-[#004F18] text-white shadow-xs'
                : 'text-[#102B16]/70 hover:text-[#004F18]'
            }`}
          >
            সবগুলো ({products.length})
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {displayList.slice(0, 8).map((product) => (
          <ProductCard key={product.id} product={product} onNavigate={onNavigate} />
        ))}
      </div>

      {/* View all button */}
      <div className="text-center mt-10">
        <button
          onClick={() => onNavigate('/shop')}
          className="bg-white hover:bg-[#004F18] text-[#004F18] hover:text-white border-2 border-[#004F18] px-8 py-3.5 rounded-full font-black text-sm transition-all duration-200 shadow-xs active:scale-95 cursor-pointer font-['Hind_Siliguri']"
        >
          আমাদের শপের সব পণ্য দেখুন &rarr;
        </button>
      </div>
    </section>
  );
};
