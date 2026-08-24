import React, { useState } from 'react';
import {
  X,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  ArrowRight,
  Sparkles,
  Tag,
  CheckCircle2,
  Truck,
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useStore } from '../../context/StoreContext';

interface CartDrawerProps {
  onNavigate: (path: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onNavigate }) => {
  const {
    items,
    itemCount,
    subtotal,
    discount,
    deliveryCharge,
    grandTotal,
    appliedCoupon,
    couponMessage,
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    updateQuantity,
    removeFromCart,
    applyCoupon,
    removeCoupon,
  } = useCart();
  const { settings } = useStore();

  const [couponInput, setCouponInput] = useState('');
  const [applying, setApplying] = useState(false);

  if (!isCartDrawerOpen) return null;

  const freeShippingThreshold = settings?.freeDeliveryThreshold || 2000;
  const progressPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));
  const remainingForFree = Math.max(0, freeShippingThreshold - subtotal);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setApplying(true);
    await applyCoupon(couponInput.trim());
    setApplying(false);
  };

  const handleProceedCheckout = () => {
    setIsCartDrawerOpen(false);
    onNavigate('/checkout');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-['Hind_Siliguri']">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCartDrawerOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
          
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-[#E5E0D5] flex items-center justify-between bg-[#FAF6EE]">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-[#1F6B45] text-white flex items-center justify-center">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-[#123B2A]">আপনার শপিং ব্যাগ</h3>
                <span className="text-xs text-gray-500 font-medium">({itemCount} টি পণ্য)</span>
              </div>
            </div>
            <button
              onClick={() => setIsCartDrawerOpen(false)}
              className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress */}
          <div className="bg-[#FFF8EA] px-4 py-3 border-b border-[#E5E0D5]/70 text-xs">
            <div className="flex items-center justify-between mb-1.5 font-bold text-[#123B2A]">
              <span className="flex items-center gap-1">
                <Truck className="w-3.5 h-3.5 text-[#1F6B45]" />
                {remainingForFree === 0 ? (
                  <span className="text-emerald-700">অভিনন্দন! আপনি ফ্রি ডেলিভারি পাচ্ছেন</span>
                ) : (
                  <span>
                    আর মাত্র <strong className="text-[#1F6B45]">৳{remainingForFree.toLocaleString()}</strong> এর কেনাকাটায় ফ্রি ডেলিভারি!
                  </span>
                )}
              </span>
              <span>{progressPercent}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-[#1F6B45] h-full transition-all duration-300 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-gray-400 space-y-3">
                <ShoppingBag className="w-16 h-16 stroke-1" />
                <p className="font-bold text-sm text-[#123B2A]">আপনার ব্যাগটি বর্তমানে খালি</p>
                <button
                  onClick={() => {
                    setIsCartDrawerOpen(false);
                    onNavigate('/shop');
                  }}
                  className="bg-[#1F6B45] text-white text-xs font-bold px-5 py-2.5 rounded-full"
                >
                  শপিং শুরু করুন
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.productId}
                  className="bg-[#FAF6EE]/50 p-3 rounded-2xl border border-[#E5E0D5] flex gap-3 items-center"
                >
                  <img
                    src={item.image}
                    alt={item.nameBn}
                    className="w-16 h-16 rounded-xl object-cover border border-[#E5E0D5] shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-xs sm:text-sm text-[#123B2A] truncate">
                      {item.nameBn}
                    </h4>
                    <span className="text-[11px] text-gray-400 block font-medium">
                      {item.selectedWeightOption || `${item.weight} ${item.unit}`}
                    </span>
                    <div className="font-black text-xs text-[#1F6B45] mt-1">
                      ৳{item.price.toLocaleString()}
                    </div>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <button
                      onClick={() => removeFromCart(item.productId)}
                      className="text-gray-400 hover:text-red-500 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    <div className="flex items-center border border-[#E5E0D5] rounded-lg bg-white overflow-hidden text-xs">
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        className="px-2 py-1 text-gray-600 hover:bg-[#1F6B45] hover:text-white"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2.5 font-bold text-[#123B2A]">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        className="px-2 py-1 text-gray-600 hover:bg-[#1F6B45] hover:text-white"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Area */}
          {items.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-[#E5E0D5] bg-[#FAF6EE] space-y-3">
              {/* Coupon input */}
              {appliedCoupon ? (
                <div className="bg-emerald-50 border border-emerald-200 p-2.5 rounded-xl flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-emerald-800 font-bold">
                    <Tag className="w-3.5 h-3.5" />
                    <span>কুপন কোড: {appliedCoupon.code} (-৳{discount})</span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-red-500 hover:underline font-bold text-[11px]"
                  >
                    মুছে ফেলুন
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="কুপন কোড (যেমন: PURE10)"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    className="flex-1 bg-white border border-[#E5E0D5] rounded-xl px-3 py-2 text-xs font-mono uppercase outline-none focus:border-[#1F6B45]"
                  />
                  <button
                    type="submit"
                    disabled={applying}
                    className="bg-[#1F6B45] text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-[#123B2A] cursor-pointer"
                  >
                    {applying ? '...' : 'প্রয়োগ'}
                  </button>
                </form>
              )}

              {couponMessage && !appliedCoupon && (
                <p className="text-[11px] text-red-600 font-bold">{couponMessage}</p>
              )}

              {/* Price Breakdown */}
              <div className="space-y-1 text-xs text-[#26312B]/80 font-medium pt-1">
                <div className="flex justify-between">
                  <span>সাবটোটাল:</span>
                  <span className="font-bold text-[#123B2A]">৳{subtotal.toLocaleString()}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-bold">
                    <span>কুপন ছাড়:</span>
                    <span>-৳{discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>ডেলিভারি চার্জ:</span>
                  <span className="font-bold text-[#123B2A]">
                    {deliveryCharge === 0 ? 'ফ্রি' : `৳${deliveryCharge}`}
                  </span>
                </div>
                <div className="flex justify-between text-base font-black text-[#123B2A] pt-2 border-t border-[#E5E0D5]">
                  <span>সর্বমোট:</span>
                  <span className="text-[#1F6B45]">৳{grandTotal.toLocaleString()}</span>
                </div>
              </div>

              {/* Checkout CTA */}
              <button
                onClick={handleProceedCheckout}
                className="w-full min-h-[48px] bg-[#1F6B45] hover:bg-[#123B2A] text-white rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-lg active:scale-98 transition-all cursor-pointer font-['Hind_Siliguri']"
              >
                <span>চেকআউটে এগিয়ে যান</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
