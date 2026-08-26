import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export const FloatingSideCart: React.FC = () => {
  const { itemCount, subtotal, setIsCartDrawerOpen } = useCart();

  return (
    <button
      id="floating-side-cart-btn"
      onClick={() => setIsCartDrawerOpen(true)}
      className="fixed right-0 top-1/2 -translate-y-1/2 z-40 bg-white hover:bg-[#F5FBF2] text-[#004F18] border-l-2 border-y-2 border-[#5EB809] rounded-l-2xl shadow-xl p-2.5 flex flex-col items-center gap-1.5 transition-all duration-200 cursor-pointer group active:scale-95"
      aria-label="Open Cart Drawer"
      title="কার্ট দেখুন"
    >
      <div className="relative p-1 text-[#004F18] group-hover:text-[#5EB809] transition-colors">
        <ShoppingCart className="w-5 h-5" />
        {itemCount > 0 && (
          <span className="absolute -top-1.5 -right-2 bg-[#E89D10] text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
            {itemCount}
          </span>
        )}
      </div>
      <div className="bg-[#5EB809] group-hover:bg-[#4ea204] text-white text-[11px] font-bold px-2 py-0.5 rounded-lg whitespace-nowrap shadow-xs font-['Hind_Siliguri']">
        ৳{subtotal.toLocaleString()}
      </div>
    </button>
  );
};
