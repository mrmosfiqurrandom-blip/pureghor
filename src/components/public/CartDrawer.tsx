import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag, Truck, Tag } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useStore } from '../../context/StoreContext';

interface CartDrawerProps {
  onNavigate: (path: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onNavigate }) => {
  const { settings } = useStore();
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

  const [couponInput, setCouponInput] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);

  if (!isCartDrawerOpen) return null;

  const freeThreshold = settings.freeDeliveryThreshold || 2000;
  const remainingForFreeDelivery = Math.max(0, freeThreshold - subtotal);
  const freeDeliveryProgress = Math.min(100, Math.round((subtotal / freeThreshold) * 100));

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setCouponLoading(true);
    await applyCoupon(couponInput.trim());
    setCouponLoading(false);
  };

  const handleCheckoutClick = () => {
    setIsCartDrawerOpen(false);
    onNavigate('/checkout');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartDrawerOpen(false)}
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FFF8EA] shadow-2xl flex flex-col border-l border-[#E5E0D5]">
          
          {/* Header */}
          <div className="p-4 sm:p-6 bg-white border-b border-[#E5E0D5] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#1F6B45]" />
              <h2 className="text-lg font-bold text-[#123B2A] font-['Hind_Siliguri']">
                আপনার কার্ট ({itemCount} টি পণ্য)
              </h2>
            </div>
            <button
              onClick={() => setIsCartDrawerOpen(false)}
              className="p-2 rounded-xl text-gray-500 hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Delivery Progress */}
          <div className="bg-[#123B2A] text-white p-3 sm:px-6 text-xs">
            {remainingForFreeDelivery === 0 ? (
              <div className="flex items-center gap-2 text-[#D99A2B] font-bold">
                <Truck className="w-4 h-4" />
                <span>অভিনন্দন! আপনি ফ্রি ডেলিভারি পাচ্ছেন 🎉</span>
              </div>
            ) : (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-white/90">
                  <span>ফ্রি ডেলিভারির জন্য আরও ৳{remainingForFreeDelivery} টাকার পণ্য যোগ করুন</span>
                  <span className="font-bold">{freeDeliveryProgress}%</span>
                </div>
                <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-[#D99A2B] h-full transition-all duration-300 rounded-full"
                    style={{ width: `${freeDeliveryProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Items List or Empty State */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-12 flex flex-col items-center">
                <div className="w-20 h-20 rounded-full bg-[#1F6B45]/10 flex items-center justify-center text-[#1F6B45] mb-4">
                  <ShoppingBag className="w-10 h-10" />
                </div>
                <h3 className="text-lg font-bold text-[#123B2A] mb-1 font-['Hind_Siliguri']">
                  আপনার কার্ট বর্তমানে খালি
                </h3>
                <p className="text-sm text-[#26312B]/70 max-w-xs mb-6">
                  খাঁটি ও পুষ্টিকর খাবার আপনার পরিবারে পৌঁছে দিতে পণ্য সিলেক্ট করুন।
                </p>
                <button
                  onClick={() => {
                    setIsCartDrawerOpen(false);
                    onNavigate('/shop');
                  }}
                  className="bg-[#1F6B45] text-white px-6 py-3 rounded-full font-bold text-sm hover:bg-[#123B2A] transition-colors cursor-pointer"
                >
                  শপিং শুরু করুন
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.productId}
                  className="bg-white p-3.5 rounded-2xl border border-[#E5E0D5] flex gap-3 items-center shadow-xs"
                >
                  <img
                    src={item.image}
                    alt={item.nameBn}
                    className="w-16 h-16 rounded-xl object-cover bg-gray-50 border border-[#E5E0D5]"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-[#123B2A] truncate font-['Hind_Siliguri']">
                      {item.nameBn}
                    </h4>
                    <span className="text-xs text-gray-500">
                      {item.selectedWeightOption || `${item.weight} ${item.unit}`}
                    </span>
                    <div className="text-sm font-black text-[#1F6B45] mt-1">
                      ৳{item.price.toLocaleString()}
                    </div>
                  </div>

                  {/* Quantity controls */}
                  <div className="flex flex-col items-end gap-2">
                    <button
                      onClick={() => removeFromCart(item.productId)}
                      className="text-gray-400 hover:text-red-600 transition-colors p-1"
                      title="মুছে ফেলুন"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="flex items-center border border-[#E5E0D5] rounded-lg bg-[#FFF8EA]/50 overflow-hidden">
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        className="px-2 py-1 text-gray-600 hover:bg-[#1F6B45] hover:text-white transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2 text-xs font-bold text-[#123B2A]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        className="px-2 py-1 text-gray-600 hover:bg-[#1F6B45] hover:text-white transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Calculations & Checkout */}
          {items.length > 0 && (
            <div className="bg-white p-4 sm:p-6 border-t border-[#E5E0D5] space-y-4">
              
              {/* Coupon Form */}
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="কুপন কোড (যেমন: PURE10)"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    disabled={!!appliedCoupon}
                    className="w-full bg-[#FFF8EA]/60 border border-[#E5E0D5] rounded-xl py-2 pl-8 pr-3 text-xs uppercase font-bold tracking-wider outline-none focus:border-[#1F6B45]"
                  />
                  <Tag className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                </div>
                {appliedCoupon ? (
                  <button
                    type="button"
                    onClick={removeCoupon}
                    className="bg-red-100 text-red-700 px-3 py-2 rounded-xl text-xs font-bold hover:bg-red-200 transition-colors"
                  >
                    মুছুন
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={couponLoading || !couponInput.trim()}
                    className="bg-[#123B2A] text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-[#1F6B45] transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    {couponLoading ? '...' : 'প্রয়োগ'}
                  </button>
                )}
              </form>

              {couponMessage && (
                <p className={`text-xs ${appliedCoupon ? 'text-emerald-700' : 'text-red-600'}`}>
                  {couponMessage}
                </p>
              )}

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-[#26312B]/80 font-medium">
                <div className="flex justify-between">
                  <span>পণ্যের মূল্য (Subtotal):</span>
                  <span className="font-bold text-[#26312B]">৳{subtotal.toLocaleString()}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-bold">
                    <span>কুপন ছাড় (Discount):</span>
                    <span>-৳{discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>ডেলিভারি চার্জ:</span>
                  <span className="font-bold text-[#26312B]">
                    {deliveryCharge === 0 ? 'ফ্রি' : `৳${deliveryCharge}`}
                  </span>
                </div>
                <div className="flex justify-between text-base font-black text-[#123B2A] pt-2 border-t border-[#E5E0D5]">
                  <span>মোট প্রদেয় (Grand Total):</span>
                  <span className="text-[#1F6B45]">৳{grandTotal.toLocaleString()}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleCheckoutClick}
                className="w-full bg-[#1F6B45] hover:bg-[#123B2A] text-white py-3.5 rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-md active:scale-98 transition-all cursor-pointer font-['Hind_Siliguri']"
              >
                <span>চেকআউট ও অর্ডার সম্পন্ন করুন</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
