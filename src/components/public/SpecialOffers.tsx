import React from 'react';
import { Flame, Clock, ArrowRight } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from '../common/ProductCard';

interface SpecialOffersProps {
  onNavigate: (path: string) => void;
}

export const SpecialOffers: React.FC<SpecialOffersProps> = ({ onNavigate }) => {
  const { products } = useStore();
  const offerProducts = products.filter((p) => p.isSpecialOffer || (p.salePrice && p.salePrice < p.price)).slice(0, 4);

  if (offerProducts.length === 0) return null;

  return (
    <section className="bg-gradient-to-b from-[#F5FBF2] to-white py-12 border-y border-[#DCECD5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with Urgency Signal */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4 bg-[#004F18] text-[#F5FBF2] p-5 sm:p-6 rounded-3xl shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#5EB809] text-white flex items-center justify-center shrink-0">
              <Flame className="w-6 h-6 fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-[#E89D10] text-white text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider">
                  সীমিত সময়ের অফার
                </span>
                <span className="text-xs text-[#5EB809] font-bold flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> শেষ সুযোগ
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white font-['Hind_Siliguri'] mt-0.5">
                বিশেষ মূল্য ছাড় ও ধামাকা অফার
              </h2>
            </div>
          </div>

          <button
            onClick={() => onNavigate('/shop')}
            className="self-start sm:self-auto bg-white text-[#004F18] hover:bg-[#5EB809] hover:text-white px-5 py-2.5 rounded-xl font-black text-xs sm:text-sm flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>সকল অফার দেখুন</span>
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
