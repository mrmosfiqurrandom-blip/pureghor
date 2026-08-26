import React, { useState, useMemo } from 'react';
import { Filter, SlidersHorizontal, Search, Grid, List, Check } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from '../../components/common/ProductCard';

interface ShopPageProps {
  onNavigate: (path: string) => void;
  initialCategorySlug?: string;
}

export const ShopPage: React.FC<ShopPageProps> = ({ onNavigate, initialCategorySlug }) => {
  const { products, categories } = useStore();
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategorySlug || 'all');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [searchTerm, setSearchTerm] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [offersOnly, setOffersOnly] = useState(false);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Category filter
      if (selectedCategory !== 'all') {
        const cat = categories.find((c) => c.slug === selectedCategory);
        if (cat && p.categoryId !== cat.id) return false;
      }
      // Search term
      if (searchTerm.trim()) {
        const clean = searchTerm.toLowerCase();
        if (
          !p.nameBn.toLowerCase().includes(clean) &&
          !p.nameEn.toLowerCase().includes(clean) &&
          !p.sku.toLowerCase().includes(clean)
        ) {
          return false;
        }
      }
      // Stock filter
      if (inStockOnly && p.stock <= 0) return false;
      // Offer filter
      if (offersOnly && !(p.isSpecialOffer || (p.salePrice && p.salePrice < p.price))) return false;

      return true;
    }).sort((a, b) => {
      const priceA = a.salePrice || a.price;
      const priceB = b.salePrice || b.price;
      if (sortBy === 'price-asc') return priceA - priceB;
      if (sortBy === 'price-desc') return priceB - priceA;
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
    });
  }, [products, categories, selectedCategory, sortBy, searchTerm, inStockOnly, offersOnly]);

  return (
    <div className="py-8 md:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-black text-[#004F18] font-['Hind_Siliguri']">
          সকল খাঁটি ও প্রাকৃতিক খাদ্যপণ্য
        </h1>
        <p className="text-sm text-[#102B16]/70 mt-1 font-['Hind_Siliguri']">
          মোট {filteredProducts.length} টি পণ্য পাওয়া গেছে
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filters */}
        <div className="space-y-6">
          {/* Search box */}
          <div className="bg-white p-4 rounded-2xl border border-[#DCECD5] shadow-xs">
            <label className="block text-xs font-bold text-[#004F18] uppercase mb-2">
              পণ্য খুঁজুন
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="যেমন: মধু, ঘি, তেল..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#F5FBF2] border border-[#DCECD5] rounded-xl py-2 pl-9 pr-3 text-sm outline-none focus:border-[#004F18]"
              />
              <Search className="w-4 h-4 text-[#004F18]/60 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Category Filter List */}
          <div className="bg-white p-4 rounded-2xl border border-[#DCECD5] shadow-xs">
            <h3 className="text-xs font-bold text-[#004F18] uppercase mb-3 font-['Hind_Siliguri']">
              ক্যাটাগরি সমূহ
            </h3>
            <div className="space-y-1 text-sm font-medium">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`w-full text-left px-3 py-2 rounded-xl flex items-center justify-between transition-colors cursor-pointer ${
                  selectedCategory === 'all'
                    ? 'bg-[#004F18] text-white font-bold'
                    : 'text-[#102B16] hover:bg-[#F5FBF2]'
                }`}
              >
                <span>সকল পণ্য</span>
                <span>{products.length}</span>
              </button>

              {categories.map((cat) => {
                const count = products.filter((p) => p.categoryId === cat.id).length;
                const isSelected = selectedCategory === cat.slug;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.slug)}
                    className={`w-full text-left px-3 py-2 rounded-xl flex items-center justify-between transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-[#004F18] text-white font-bold'
                        : 'text-[#102B16] hover:bg-[#F5FBF2]'
                    }`}
                  >
                    <span className="truncate">{cat.nameBn}</span>
                    <span className="text-xs opacity-75">({count})</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Toggles: In stock & Offers */}
          <div className="bg-white p-4 rounded-2xl border border-[#DCECD5] shadow-xs space-y-3 text-sm">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="w-4 h-4 rounded text-[#004F18] focus:ring-[#004F18]"
              />
              <span className="font-semibold text-[#004F18]">কেবলমাত্র ইন-স্টক পণ্য</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={offersOnly}
                onChange={(e) => setOffersOnly(e.target.checked)}
                className="w-4 h-4 rounded text-[#004F18] focus:ring-[#004F18]"
              />
              <span className="font-semibold text-[#004F18]">কেবলমাত্র বিশেষ ছাড়ের পণ্য</span>
            </label>
          </div>
        </div>

        {/* Product Grid Area */}
        <div className="lg:col-span-3">
          {/* Top Bar Sort */}
          <div className="bg-white p-3 sm:p-4 rounded-2xl border border-[#DCECD5] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
            <div className="text-xs sm:text-sm font-bold text-[#004F18]">
              প্রদর্শন করা হচ্ছে: <span className="text-[#5EB809] font-black">{filteredProducts.length}</span> টি পণ্য
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              <span className="text-xs font-bold text-gray-500">সর্ট করুন:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-[#F5FBF2] border border-[#DCECD5] text-xs font-bold rounded-xl py-2 px-3 outline-none focus:border-[#004F18]"
              >
                <option value="featured">ফিচার্ড / জনপ্রিয়</option>
                <option value="price-asc">দাম: কম থেকে বেশি</option>
                <option value="price-desc">দাম: বেশি থেকে কম</option>
                <option value="rating">সর্বোচ্চ রেটিং</option>
              </select>
            </div>
          </div>

          {/* Grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredProducts.map((p) => (
                <ProductCard key={p.id} product={p} onNavigate={onNavigate} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center border border-[#DCECD5] shadow-xs">
              <h3 className="text-lg font-bold text-[#004F18] mb-2 font-['Hind_Siliguri']">
                কোনো পণ্য পাওয়া যায়নি
              </h3>
              <p className="text-sm text-[#102B16]/70 mb-4">
                অনুগ্রহ করে ফিল্টার পরিবর্তন করুন বা অন্য কোনো কীওয়ার্ড দিয়ে সার্চ করুন।
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSearchTerm('');
                  setInStockOnly(false);
                  setOffersOnly(false);
                }}
                className="bg-[#004F18] hover:bg-[#063B14] text-white px-5 py-2.5 rounded-full text-xs font-bold cursor-pointer transition-colors"
              >
                ফিল্টার রিসেট করুন
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
