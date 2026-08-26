import React, { useState } from 'react';
import {
  ShieldCheck,
  Truck,
  CheckCircle2,
  Lock,
  ArrowRight,
  ShoppingBag,
  CreditCard,
  PhoneCall,
  AlertCircle,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useCart } from '../../context/CartContext';
import { useStore } from '../../context/StoreContext';
import { createOrderSecure } from '../../services/db';
import { PaymentMethod } from '../../types';

interface CheckoutPageProps {
  onNavigate: (path: string, orderData?: any) => void;
}

const DISTRICT_OPTIONS = [
  'সিলেট (Sylhet) — ৫০৳',
  'ঢাকা সিটি (Dhaka City) — ৮০৳',
  'চট্টগ্রাম (Chittagong) — ১২০৳',
  'রাজশাহী (Rajshahi) — ১২০৳',
  'খুলনা (Khulna) — ১২০৳',
  'বরিশাল (Barishal) — ১২০৳',
  'রংপুর (Rangpur) — ১২০৳',
  'ময়মনসিংহ (Mymensingh) — ১২০৳',
  'মৌলভীবাজার (Moulvibazar) — ৫০৳',
  'হবিগঞ্জ (Habiganj) — ৫০৳',
  'সুনামগঞ্জ (Sunamganj) — ৫০৳',
  'অন্যান্য জেলা (All Other Districts) — ১৩০৳',
];

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ onNavigate }) => {
  const { settings } = useStore();
  const {
    items,
    subtotal,
    discount,
    deliveryCharge,
    grandTotal,
    appliedCoupon,
    clearCart,
    setSelectedDistrict,
  } = useCart();

  // Form State
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [alternativePhone, setAlternativePhone] = useState('');
  const [district, setDistrict] = useState(DISTRICT_OPTIONS[0]);
  const [fullAddress, setFullAddress] = useState('');
  const [deliveryNote, setDeliveryNote] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('COD');
  
  // Submission & Validation State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Sync selected district to CartContext for fee calculation
  const handleDistrictChange = (val: string) => {
    setDistrict(val);
    setSelectedDistrict(val);
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation in Bangla
    if (!fullName.trim()) {
      setErrorMessage('অনুগ্রহ করে আপনার পুরো নাম লিখুন।');
      return;
    }
    const cleanPhone = phoneNumber.replace(/[^0-9]/g, '');
    if (cleanPhone.length < 11) {
      setErrorMessage('সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন (যেমন: 01712345678)।');
      return;
    }
    if (!fullAddress.trim() || fullAddress.trim().length < 8) {
      setErrorMessage('অনুগ্রহ করে বিস্তারিত ডেলিভারি ঠিকানা (রোড, বাড়ি নং, এলাকা) লিখুন।');
      return;
    }
    if (items.length === 0) {
      setErrorMessage('আপনার কার্টে কোনো পণ্য নেই।');
      return;
    }

    setIsSubmitting(true);

    try {
      const orderPayload = {
        customerSnapshot: {
          name: fullName.trim(),
          phone: cleanPhone,
        },
        items,
        subtotal,
        discount,
        deliveryCharge,
        grandTotal,
        couponCode: appliedCoupon?.code,
        currency: 'BDT',
        paymentMethod,
        paymentStatus: 'Pending' as const,
        orderStatus: 'Pending' as const,
        shippingAddress: {
          fullName: fullName.trim(),
          phoneNumber: cleanPhone,
          alternativePhone: alternativePhone.trim() || undefined,
          district,
          fullAddress: fullAddress.trim(),
          deliveryNote: deliveryNote.trim() || undefined,
        },
        customerNote: deliveryNote.trim() || undefined,
      };

      const result = await createOrderSecure(orderPayload);

      if (!result.success || !result.order) {
        setErrorMessage(result.message || 'অর্ডার প্রক্রিয়া করতে সমস্যা হয়েছে।');
        setIsSubmitting(false);
        return;
      }

      // Order created successfully!
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (e) {
        // ignore
      }

      clearCart();
      onNavigate(`/order-confirmation/${result.order.orderNumber}`, result.order);
    } catch (err: any) {
      setErrorMessage(err.message || 'অর্ডার করতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।');
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 rounded-full bg-[#E8F8D8] border border-[#5EB809]/30 flex items-center justify-center text-[#004F18] mx-auto mb-4">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="text-xl font-bold text-[#004F18] mb-2 font-['Hind_Siliguri']">
          আপনার কার্ট খালি
        </h2>
        <p className="text-sm text-[#102B16]/70 mb-6 font-['Hind_Siliguri']">
          অর্ডার সম্পন্ন করতে আগে কার্টে কিছু পণ্য যোগ করুন।
        </p>
        <button
          onClick={() => onNavigate('/shop')}
          className="bg-[#004F18] hover:bg-[#063B14] text-white px-6 py-3 rounded-full font-bold text-sm cursor-pointer transition-colors"
        >
          শপে ফিরে যান
        </button>
      </div>
    );
  }

  return (
    <div className="py-8 md:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <span className="bg-[#E8F8D8] text-[#004F18] border border-[#5EB809]/30 text-xs font-bold px-3 py-1 rounded-full uppercase">
          নিরাপদ ও দ্রুত চেকআউট
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-[#004F18] font-['Hind_Siliguri'] mt-2">
          অর্ডার নিশ্চিতকরণ ও ঠিকানা
        </h1>
        <p className="text-xs sm:text-sm text-[#102B16]/70 mt-1 font-['Hind_Siliguri']">
          সঠিক তথ্য দিয়ে ফর্মটি পূরণ করুন, ক্যাশ অন ডেলিভারিতে পণ্য বুঝে পেয়ে টাকা দিন
        </p>
      </div>

      {errorMessage && (
        <div className="max-w-4xl mx-auto mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm font-bold flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-6xl mx-auto">
        
        {/* Left: Customer & Address Form */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Contact Details Card */}
          <div className="bg-white p-6 rounded-3xl border border-[#DCECD5] shadow-xs">
            <h2 className="text-base font-bold text-[#004F18] font-['Hind_Siliguri'] mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#004F18] text-white text-xs flex items-center justify-center font-bold">
                ১
              </span>
              <span>আপনার যোগাযোগের তথ্য</span>
            </h2>

            <div className="space-y-4 text-sm font-['Hind_Siliguri']">
              <div>
                <label className="block text-xs font-bold text-[#102B16] mb-1">
                  আপনার নাম (Full Name) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: তানভীর আহমেদ"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-[#F5FBF2] border border-[#DCECD5] rounded-xl p-3 text-sm outline-none focus:border-[#004F18]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#102B16] mb-1">
                    মোবাইল নম্বর <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="01712345678"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full bg-[#F5FBF2] border border-[#DCECD5] rounded-xl p-3 text-sm outline-none focus:border-[#004F18]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#102B16] mb-1">
                    বিকল্প মোবাইল নম্বর (ঐচ্ছিক)
                  </label>
                  <input
                    type="tel"
                    placeholder="01812345678"
                    value={alternativePhone}
                    onChange={(e) => setAlternativePhone(e.target.value)}
                    className="w-full bg-[#F5FBF2] border border-[#DCECD5] rounded-xl p-3 text-sm outline-none focus:border-[#004F18]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Shipping Address Card */}
          <div className="bg-white p-6 rounded-3xl border border-[#DCECD5] shadow-xs">
            <h2 className="text-base font-bold text-[#004F18] font-['Hind_Siliguri'] mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#004F18] text-white text-xs flex items-center justify-center font-bold">
                ২
              </span>
              <span>ডেলিভারি ঠিকানা</span>
            </h2>

            <div className="space-y-4 text-sm font-['Hind_Siliguri']">
              <div>
                <label className="block text-xs font-bold text-[#102B16] mb-1">
                  জেলা ও ডেলিভারি এরিয়া <span className="text-red-500">*</span>
                </label>
                <select
                  value={district}
                  onChange={(e) => handleDistrictChange(e.target.value)}
                  className="w-full bg-[#F5FBF2] border border-[#DCECD5] rounded-xl p-3 text-sm font-bold text-[#004F18] outline-none focus:border-[#004F18]"
                >
                  {DISTRICT_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#102B16] mb-1">
                  পূর্ণাঙ্গ ঠিকানা (বাসা নং, রোড, থানা/উপজেলা) <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="যেমন: বাসা নং ১২, রোড ৩, বিশ্বনাথ, সিলেট।"
                  value={fullAddress}
                  onChange={(e) => setFullAddress(e.target.value)}
                  className="w-full bg-[#F5FBF2] border border-[#DCECD5] rounded-xl p-3 text-sm outline-none focus:border-[#004F18]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#102B16] mb-1">
                  ডেলিভারি নোট / বিশেষ নির্দেশনা (ঐচ্ছিক)
                </label>
                <input
                  type="text"
                  placeholder="যেমন: বিকেলে ডেলিভারি দিলে ভালো হয়"
                  value={deliveryNote}
                  onChange={(e) => setDeliveryNote(e.target.value)}
                  className="w-full bg-[#F5FBF2] border border-[#DCECD5] rounded-xl p-3 text-sm outline-none focus:border-[#004F18]"
                />
              </div>
            </div>
          </div>

          {/* Payment Method Card */}
          <div className="bg-white p-6 rounded-3xl border border-[#DCECD5] shadow-xs">
            <h2 className="text-base font-bold text-[#004F18] font-['Hind_Siliguri'] mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#004F18] text-white text-xs flex items-center justify-center font-bold">
                ৩
              </span>
              <span>পেমেন্ট পদ্ধতি সিলেক্ট করুন</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <label
                className={`p-4 rounded-2xl border-2 flex flex-col justify-between cursor-pointer transition-all ${
                  paymentMethod === 'COD'
                    ? 'border-[#004F18] bg-[#F5FBF2]'
                    : 'border-[#DCECD5] bg-white hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-black text-sm text-[#004F18] font-['Hind_Siliguri']">
                    ক্যাশ অন ডেলিভারি
                  </span>
                  <input
                    type="radio"
                    name="payment"
                    value="COD"
                    checked={paymentMethod === 'COD'}
                    onChange={() => setPaymentMethod('COD')}
                    className="w-4 h-4 text-[#004F18]"
                  />
                </div>
                <span className="text-[11px] text-gray-500">পণ্য হাতে পেয়ে চেক করে টাকা দিন</span>
              </label>

              <label
                className={`p-4 rounded-2xl border-2 flex flex-col justify-between cursor-pointer transition-all ${
                  paymentMethod === 'bKash'
                    ? 'border-[#E2136E] bg-pink-50/50'
                    : 'border-[#DCECD5] bg-white hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-black text-sm text-[#E2136E]">বিকাশ (bKash)</span>
                  <input
                    type="radio"
                    name="payment"
                    value="bKash"
                    checked={paymentMethod === 'bKash'}
                    onChange={() => setPaymentMethod('bKash')}
                    className="w-4 h-4 text-[#E2136E]"
                  />
                </div>
                <span className="text-[11px] text-gray-500">বিকাশ মার্চেন্ট পেমেন্ট</span>
              </label>

              <label
                className={`p-4 rounded-2xl border-2 flex flex-col justify-between cursor-pointer transition-all ${
                  paymentMethod === 'Nagad'
                    ? 'border-[#F7941D] bg-amber-50/50'
                    : 'border-[#DCECD5] bg-white hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-black text-sm text-[#F7941D]">নগদ (Nagad)</span>
                  <input
                    type="radio"
                    name="payment"
                    value="Nagad"
                    checked={paymentMethod === 'Nagad'}
                    onChange={() => setPaymentMethod('Nagad')}
                    className="w-4 h-4 text-[#F7941D]"
                  />
                </div>
                <span className="text-[11px] text-gray-500">নগদ অ্যাকাউন্ট পেমেন্ট</span>
              </label>
            </div>
          </div>
        </div>

        {/* Right: Order Summary Review & Final CTA */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-[#DCECD5] shadow-xs sticky top-28">
            <h2 className="text-base font-bold text-[#004F18] font-['Hind_Siliguri'] mb-4 flex items-center justify-between">
              <span>অর্ডারের সারসংক্ষেপ</span>
              <span className="text-xs font-normal text-gray-500">({items.length} টি আইটেম)</span>
            </h2>

            {/* Items List */}
            <div className="divide-y divide-[#DCECD5]/60 max-h-60 overflow-y-auto mb-4 pr-1">
              {items.map((item) => (
                <div key={item.productId} className="py-2.5 flex items-center gap-3">
                  <img
                    src={item.image}
                    alt={item.nameBn}
                    className="w-12 h-12 rounded-lg object-cover border border-[#DCECD5]"
                  />
                  <div className="flex-1 min-w-0 text-xs">
                    <h4 className="font-bold text-[#004F18] truncate font-['Hind_Siliguri']">
                      {item.nameBn}
                    </h4>
                    <span className="text-gray-400">
                      {item.quantity} × ৳{item.price.toLocaleString()}
                    </span>
                  </div>
                  <span className="font-black text-xs text-[#004F18]">
                    ৳{(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-2 text-xs font-medium text-[#102B16]/80 pt-3 border-t border-[#DCECD5]">
              <div className="flex justify-between">
                <span>পণ্যের মোট দাম:</span>
                <span className="font-bold text-[#004F18]">৳{subtotal.toLocaleString()}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-[#004F18] font-bold">
                  <span>কুপন ছাড়:</span>
                  <span>-৳{discount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>ডেলিভারি চার্জ:</span>
                <span className="font-bold text-[#004F18]">
                  {deliveryCharge === 0 ? 'ফ্রি' : `৳${deliveryCharge}`}
                </span>
              </div>

              <div className="flex justify-between text-lg font-black text-[#004F18] pt-3 border-t border-[#DCECD5]">
                <span>সর্বমোট প্রদেয়:</span>
                <span className="text-[#004F18]">৳{grandTotal.toLocaleString()}</span>
              </div>
            </div>

            {/* Final Submission Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-6 min-h-[50px] bg-[#004F18] hover:bg-[#063B14] text-white rounded-2xl font-black text-base flex items-center justify-center gap-2 shadow-lg active:scale-98 transition-all cursor-pointer font-['Hind_Siliguri'] disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>অর্ডার প্রস্তুত হচ্ছে...</span>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5 text-[#5EB809]" />
                  <span>অর্ডার নিশ্চিত করুন (৳{grandTotal.toLocaleString()})</span>
                </>
              )}
            </button>

            <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-gray-500">
              <Lock className="w-3.5 h-3.5 text-[#004F18]" />
              <span>আপনার সমস্ত তথ্য শতভাগ সুরক্ষিত</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
