import React from 'react';
import { Flame, Clock, ArrowRight, Sparkles, Tag, CheckCircle2 } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from '../common/ProductCard';
import { resolveImageUrl, DEFAULT_FALLBACK_IMAGE } from '../../utils/imageUrl';

interface SpecialOffersProps {
  onNavigate: (path: string) => void;
}

export const SpecialOffers: React.FC<SpecialOffersProps> = ({ onNavigate }) => {
  const { products } = useStore();
  const offerProducts = products.filter((p) => p.isSpecialOffer || (p.salePrice && p.salePrice < p.price)).slice(0, 4);

  return (
    <section className="bg-gradient-to-b from-[#F5FBF2] to-white py-12 md:py-16 border-y border-[#DCECD5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Promotional Special Banner: Biswanath Branch Opening & 10% Discount */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#004F18] to-[#0d5924] text-white shadow-xl border border-[#DCECD5]">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center p-6 sm:p-8">
            <div className="md:col-span-7 space-y-3">
              <div className="inline-flex items-center gap-1.5 bg-[#5EB809] text-white text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-xs">
                <Sparkles className="w-3.5 h-3.5" />
                <span>উদ্বোধনী বিশেষ মেগা অফার</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black font-['Hind_Siliguri'] text-white">
                সিলেটের বিখ্যাত ব্র্যান্ড PureGhor এখন বিশ্বনাথ!
              </h3>
              <p className="text-sm sm:text-base text-white/90 font-['Hind_Siliguri'] leading-relaxed">
                বিশ্বনাথ শাখা উদ্বোধন উপলক্ষে সকল অর্ডারে পাচ্ছেন ফ্ল্যাট ১০% ডিসকাউন্ট। খাঁটি মধু, গাওয়া ঘি, ঘানির তেল ও প্রিমিয়াম বাদাম সংগ্রহ করুন সেরা মূল্যে।
              </p>
              
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <div className="bg-white/15 backdrop-blur-sm border border-white/25 px-4 py-2 rounded-xl flex items-center gap-2">
                  <Tag className="w-4 h-4 text-[#5EB809]" />
                  <span className="text-xs text-white/80">কুপন কোড:</span>
                  <span className="font-mono font-black text-sm text-white tracking-wider">PURE10</span>
                </div>
                <button
                  onClick={() => onNavigate('/shop')}
                  className="bg-[#5EB809] hover:bg-[#4ea204] text-white px-6 py-2.5 rounded-xl font-bold text-sm flex items-center gap-1.5 shadow-md transition-transform active:scale-95 cursor-pointer font-['Hind_Siliguri']"
                >
                  <span>এখনই অফারে কিনুন</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Banner Right Image */}
            <div className="md:col-span-5 flex justify-center">
              <div className="relative w-full max-w-sm aspect-16/10 rounded-2xl overflow-hidden shadow-lg border border-white/20">
                <img
                  src={resolveImageUrl('/images/pureghor/701370545_844991221981629_1527727780744872160_n.jpg')}
                  alt="PureGhor বিশ্বনাথ শাখা উদ্বোধন অফার"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.currentTarget as HTMLImageElement;
                    if (target.src !== DEFAULT_FALLBACK_IMAGE) {
                      target.src = DEFAULT_FALLBACK_IMAGE;
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section Header with Flash Discount Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white text-[#004F18] p-5 sm:p-6 rounded-3xl border border-[#DCECD5] shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#5EB809] text-white flex items-center justify-center shrink-0 shadow-xs">
              <Flame className="w-6 h-6 fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-[#E89D10] text-white text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider">
                  সীমিত সময়ের অফার
                </span>
                <span className="text-xs text-[#004F18] font-bold flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#5EB809]" /> স্টক থাকা পর্যন্ত
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-[#004F18] font-['Hind_Siliguri'] mt-0.5">
                বিশেষ মূল্য ছাড় ও ধামাকা অফার
              </h2>
            </div>
          </div>

          <button
            onClick={() => onNavigate('/shop')}
            className="self-start sm:self-auto bg-[#004F18] hover:bg-[#5EB809] text-white px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>সকল পণ্য দেখুন</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {offerProducts.map((prod) => (
            <ProductCard key={prod.id} product={prod} onNavigate={onNavigate} />
          ))}
        </div>
      </div>
    </section>
  );
};
