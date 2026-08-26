import React from 'react';
import { ShieldCheck, PackageCheck, Truck, Headphones, CheckCircle2 } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

const iconMap: Record<string, React.ReactNode> = {
  ShieldCheck: <ShieldCheck className="w-6 h-6 text-[#004F18]" />,
  PackageCheck: <PackageCheck className="w-6 h-6 text-[#004F18]" />,
  Truck: <Truck className="w-6 h-6 text-[#004F18]" />,
  Headphones: <Headphones className="w-6 h-6 text-[#004F18]" />,
};

export const TrustStrip: React.FC = () => {
  const { settings } = useStore();
  const items = settings.trustStrip || [];

  return (
    <div className="bg-white border-y border-[#DCECD5] py-6 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-4 p-3.5 rounded-2xl bg-[#F5FBF2] border border-[#DCECD5] hover:border-[#5EB809] hover:shadow-xs transition-all duration-200"
            >
              <div className="w-12 h-12 rounded-xl bg-[#E8F8D8] border border-[#5EB809]/30 flex items-center justify-center shrink-0">
                {iconMap[item.icon] || <CheckCircle2 className="w-6 h-6 text-[#004F18]" />}
              </div>
              <div>
                <h4 className="font-bold text-sm text-[#004F18] font-['Hind_Siliguri'] leading-tight">
                  {item.titleBn}
                </h4>
                <p className="text-xs text-[#102B16]/70 mt-0.5 line-clamp-2">
                  {item.descBn}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
