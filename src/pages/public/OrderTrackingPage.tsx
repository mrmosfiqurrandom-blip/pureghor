import React, { useState } from 'react';
import { Search, Package, CheckCircle2, Clock, Truck, Home, AlertCircle } from 'lucide-react';
import { getOrderByNumberOrPhone } from '../../services/db';
import { Order, OrderStatus } from '../../types';

interface OrderTrackingPageProps {
  onNavigate: (path: string) => void;
}

const STATUS_STEPS: OrderStatus[] = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered'];

const STATUS_LABELS: Record<OrderStatus, string> = {
  Pending: 'অর্ডার জমা হয়েছে',
  Confirmed: 'কনফার্ম হয়েছে',
  Processing: 'প্যাকেজিং চলছে',
  Shipped: 'কুরিয়ারে হস্তান্তর',
  Delivered: 'ডেলিভারি সম্পন্ন',
  Cancelled: 'অর্ডার বাতিল',
  Returned: 'রিটার্ন সম্পন্ন',
};

export const OrderTrackingPage: React.FC<OrderTrackingPageProps> = ({ onNavigate }) => {
  const [searchInput, setSearchInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Order[] | null>(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) return;

    setLoading(true);
    const orders = await getOrderByNumberOrPhone(searchInput.trim());
    setResults(orders);
    setSearched(true);
    setLoading(false);
  };

  const getStepIndex = (status: OrderStatus) => {
    return STATUS_STEPS.indexOf(status);
  };

  return (
    <div className="py-10 md:py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto mb-8">
        <span className="bg-[#1F6B45]/10 text-[#1F6B45] text-xs font-bold px-3 py-1 rounded-full uppercase">
          লাইভ অর্ডার ট্র্যাকিং
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-[#123B2A] font-['Hind_Siliguri'] mt-2">
          আপনার পার্সেলের অবস্থা জানুন
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1 font-['Hind_Siliguri']">
          অর্ডার নাম্বার (যেমন: PG-123456-789) অথবা আপনার মোবাইল নম্বর দিন
        </p>
      </div>

      {/* Search Input Box */}
      <form onSubmit={handleSearch} className="max-w-xl mx-auto mb-10">
        <div className="flex gap-2 bg-white p-2 rounded-2xl border border-[#E5E0D5] shadow-xs">
          <input
            type="text"
            required
            placeholder="অর্ডার নাম্বার অথবা ফোন নম্বর..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="flex-1 px-4 py-2 text-sm outline-none font-medium"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-[#1F6B45] hover:bg-[#123B2A] text-white px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Search className="w-4 h-4" />
            <span>{loading ? 'খোঁজা হচ্ছে...' : 'ট্র্যাক করুন'}</span>
          </button>
        </div>
      </form>

      {/* Results */}
      {searched && (
        <div className="space-y-6">
          {results && results.length > 0 ? (
            results.map((order) => {
              const currentStep = getStepIndex(order.orderStatus);
              const isCancelled = order.orderStatus === 'Cancelled';

              return (
                <div
                  key={order.id}
                  className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E5E0D5] shadow-sm space-y-6 font-['Hind_Siliguri']"
                >
                  {/* Order Top Banner */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E5E0D5] gap-2">
                    <div>
                      <span className="text-xs text-gray-400">অর্ডার নম্বর</span>
                      <h3 className="text-lg font-black text-[#123B2A] font-mono">{order.orderNumber}</h3>
                    </div>
                    <div className="text-left sm:text-right">
                      <span className="text-xs text-gray-400">বর্তমান অবস্থা</span>
                      <div className="font-bold text-sm text-[#1F6B45]">
                        {STATUS_LABELS[order.orderStatus]}
                      </div>
                    </div>
                  </div>

                  {/* Status Progression Bar */}
                  {!isCancelled && (
                    <div className="py-4">
                      <div className="relative flex justify-between items-center">
                        {/* Background track */}
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-200 z-0" />
                        <div
                          className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-[#1F6B45] z-0 transition-all duration-500"
                          style={{
                            width: `${Math.max(0, (currentStep / (STATUS_STEPS.length - 1)) * 100)}%`,
                          }}
                        />

                        {/* Step checkpoints */}
                        {STATUS_STEPS.map((step, idx) => {
                          const isDone = currentStep >= idx;
                          const isCurrent = currentStep === idx;
                          return (
                            <div key={step} className="relative z-10 flex flex-col items-center">
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                                  isDone
                                    ? 'bg-[#1F6B45] text-white ring-4 ring-emerald-50'
                                    : 'bg-white border-2 border-gray-300 text-gray-400'
                                }`}
                              >
                                {isDone ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                              </div>
                              <span
                                className={`text-[11px] font-bold mt-2 text-center max-w-[80px] hidden sm:block ${
                                  isCurrent ? 'text-[#1F6B45]' : 'text-gray-500'
                                }`}
                              >
                                {STATUS_LABELS[step]}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Address & Items */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs bg-[#FAF6EE] p-4 rounded-2xl border border-[#E5E0D5]">
                    <div>
                      <h4 className="font-bold text-gray-700 mb-1">প্রাপকের ঠিকানা:</h4>
                      <p className="font-bold text-[#123B2A]">{order.shippingAddress.fullName}</p>
                      <p className="text-gray-600">{order.shippingAddress.fullAddress}, {order.shippingAddress.district}</p>
                      <p className="text-gray-600">ফোন: {order.shippingAddress.phoneNumber}</p>
                    </div>

                    <div>
                      <h4 className="font-bold text-gray-700 mb-1">অর্ডারের আইটেম ({order.items.length}):</h4>
                      <ul className="space-y-1 text-gray-700">
                        {order.items.map((it, i) => (
                          <li key={i} className="truncate">
                            • {it.nameBn} ({it.quantity}টি) — ৳{(it.price * it.quantity).toLocaleString()}
                          </li>
                        ))}
                      </ul>
                      <div className="font-black text-[#1F6B45] mt-2 text-sm">
                        সর্বমোট মূল্য: ৳{order.grandTotal.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {/* Status History Log */}
                  {order.statusHistory && order.statusHistory.length > 0 && (
                    <div className="pt-2">
                      <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                        স্ট্যাটাস ইতিহাস:
                      </h4>
                      <div className="space-y-2 text-xs">
                        {order.statusHistory.map((h, hi) => (
                          <div key={hi} className="flex items-start gap-2 text-gray-600">
                            <span className="font-mono text-[11px] text-gray-400 shrink-0">
                              {new Date(h.timestamp).toLocaleDateString('bn-BD')}
                            </span>
                            <span className="font-bold text-[#123B2A]">[{STATUS_LABELS[h.status]}]:</span>
                            <span>{h.note || 'কোনো নোট নেই'}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="bg-white rounded-3xl p-10 text-center border border-[#E5E0D5] text-gray-500">
              <AlertCircle className="w-10 h-10 text-amber-500 mx-auto mb-2" />
              <p className="font-bold text-sm text-[#123B2A]">কোনো অর্ডার পাওয়া যায়নি</p>
              <p className="text-xs text-gray-400 mt-1">
                আপনার দেওয়া অর্ডার নম্বর বা ফোন নম্বরটি সঠিক কি না যাচাই করে আবার চেষ্টা করুন।
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
