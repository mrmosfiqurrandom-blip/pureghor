import React from 'react';
import { ShieldCheck, PackageCheck, Truck, Headphones, CheckCircle2 } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

const iconMap: Record<string, React.ReactNode> = {
  ShieldCheck: <ShieldCheck className="w-6 h-6 text-[#1F6B45]" />,
  PackageCheck: <PackageCheck className="w-6 h-6 text-[#1F6B45]" />,
  Truck: <Truck className="w-6 h-6 text-[#1F6B45]" />,
  Headphones: <Headphones className="w-6 h-6 text-[#1F6B45]" />,
};

export const TrustStrip: React.FC = () => {
  const { settings } = useStore();
  const items = settings.trustStrip || [];

  return (
    <div className="bg-white border-y border-[#E5E0D5] py-6 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-4 p-3 rounded-2xl bg-[#FFF8EA]/60 border border-[#E5E0D5]/60 hover:border-[#1F6B45]/40 transition-all duration-200"
            >
              <div className="w-12 h-12 rounded-xl bg-[#1F6B45]/10 flex items-center justify-center shrink-0">
                {iconMap[item.icon] || <CheckCircle2 className="w-6 h-6 text-[#1F6B45]" />}
              </div>
              <div>
                <h4 className="font-bold text-sm text-[#123B2A] font-['Hind_Siliguri'] leading-tight">
                  {item.titleBn}
                </h4>
                <p className="text-xs text-[#26312B]/70 mt-0.5 line-clamp-2">
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
