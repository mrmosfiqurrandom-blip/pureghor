import React from 'react';
import { CheckCircle, Package, Truck, Phone, MessageCircle, Printer, ArrowRight } from 'lucide-react';
import { Order } from '../../types';
import { useStore } from '../../context/StoreContext';

interface OrderConfirmationProps {
  orderNumber: string;
  order?: Order;
  onNavigate: (path: string) => void;
}

export const OrderConfirmationPage: React.FC<OrderConfirmationProps> = ({
  orderNumber,
  order,
  onNavigate,
}) => {
  const { settings } = useStore();

  const handlePrint = () => {
    window.print();
  };

  const whatsappMessage = `আসসালামু আলাইকুম, আমি PureGhor-এ একটি অর্ডার করেছি। আমার অর্ডার নম্বর: ${orderNumber}।`;
  const whatsappUrl = `https://wa.me/88${(settings.whatsapp || '01712345678').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div className="py-12 md:py-16 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E5E0D5] shadow-sm text-center">
        
        {/* Success Icon */}
        <div className="w-20 h-20 rounded-full bg-emerald-100 text-[#1F6B45] flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-12 h-12" />
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-[#123B2A] font-['Hind_Siliguri']">
          আপনার অর্ডারটি সফলভাবে সম্পন্ন হয়েছে!
        </h1>
        <p className="text-sm text-gray-600 mt-2 font-['Hind_Siliguri'] max-w-md mx-auto">
          খাঁটি পণ্য বেছে নেওয়ার জন্য ধন্যবাদ। আমাদের প্রতিনিধি দ্রুত আপনার সাথে যোগাযোগ করে ডেলিভারি নিশ্চিত করবেন।
        </p>

        {/* Order ID badge */}
        <div className="my-6 inline-block bg-[#FFF8EA] border border-[#D99A2B] rounded-2xl px-6 py-3">
          <span className="text-xs text-gray-500 block uppercase font-bold">অর্ডার ট্র্যাকিং নম্বর</span>
          <span className="text-xl font-black text-[#1F6B45] font-mono tracking-wider">
            {orderNumber}
          </span>
        </div>

        {/* Summary Card if order passed */}
        {order && (
          <div className="text-left bg-[#FAF6EE] p-5 rounded-2xl border border-[#E5E0D5] mb-6 text-xs space-y-3 font-['Hind_Siliguri']">
            <div className="flex justify-between border-b border-[#E5E0D5] pb-2">
              <span className="font-bold text-gray-600">গ্রাহকের নাম:</span>
              <span className="font-bold text-[#123B2A]">{order.shippingAddress.fullName}</span>
            </div>
            <div className="flex justify-between border-b border-[#E5E0D5] pb-2">
              <span className="font-bold text-gray-600">মোবাইল নম্বর:</span>
              <span className="font-bold text-[#123B2A]">{order.shippingAddress.phoneNumber}</span>
            </div>
            <div className="flex justify-between border-b border-[#E5E0D5] pb-2">
              <span className="font-bold text-gray-600">ডেলিভারি ঠিকানা:</span>
              <span className="font-bold text-[#123B2A] max-w-xs text-right">
                {order.shippingAddress.fullAddress}, {order.shippingAddress.district}
              </span>
            </div>
            <div className="flex justify-between border-b border-[#E5E0D5] pb-2">
              <span className="font-bold text-gray-600">পেমেন্ট মেথড:</span>
              <span className="font-bold text-[#1F6B45]">
                {order.paymentMethod === 'COD' ? 'ক্যাশ অন ডেলিভারি' : order.paymentMethod}
              </span>
            </div>
            <div className="flex justify-between text-sm pt-1">
              <span className="font-black text-[#123B2A]">সর্বমোট প্রদেয় মূল্য:</span>
              <span className="font-black text-[#1F6B45]">৳{order.grandTotal.toLocaleString()}</span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#25D366] hover:bg-[#1EBE5D] text-white px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-xs"
          >
            <MessageCircle className="w-4 h-4" />
            <span>হোয়াটসঅ্যাপে কনফার্ম করুন</span>
          </a>

          <button
            onClick={() => onNavigate(`/track-order`)}
            className="bg-[#123B2A] text-white px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 hover:bg-[#1F6B45] transition-colors"
          >
            <Truck className="w-4 h-4 text-[#D99A2B]" />
            <span>অর্ডার ট্র্যাক করুন</span>
          </button>

          <button
            onClick={handlePrint}
            className="bg-white border border-gray-300 text-gray-700 px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 hover:bg-gray-50"
          >
            <Printer className="w-4 h-4" />
            <span>রসিদ প্রিন্ট করুন</span>
          </button>
        </div>

        <div className="mt-8">
          <button
            onClick={() => onNavigate('/')}
            className="text-xs font-bold text-[#1F6B45] hover:underline inline-flex items-center gap-1"
          >
            <span>হোমপেজে ফিরে যান</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
