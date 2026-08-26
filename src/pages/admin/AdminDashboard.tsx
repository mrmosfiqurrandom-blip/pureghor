import React from 'react';
import {
  DollarSign,
  ShoppingBag,
  Package,
  Clock,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  ArrowRight,
  Truck,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

interface AdminDashboardProps {
  onSelectTab: (tab: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onSelectTab }) => {
  const { orders, products, reviews } = useStore();

  const totalRevenue = orders.reduce((sum, o) => sum + (o.orderStatus !== 'Cancelled' ? o.grandTotal : 0), 0);
  const pendingOrders = orders.filter((o) => o.orderStatus === 'Pending');
  const lowStockProducts = products.filter((p) => p.stock <= p.lowStockThreshold);
  const pendingReviews = reviews.filter((r) => r.status === 'pending');

  return (
    <div className="space-y-8">
      {/* Top KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-[#DCECD5] shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-gray-500">মোট বিক্রয় রেভিনিউ</span>
            <div className="w-10 h-10 rounded-2xl bg-[#5EB809]/15 text-[#004F18] flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#004F18] font-mono">
            ৳{totalRevenue.toLocaleString()}
          </div>
          <div className="text-[11px] text-[#5EB809] font-bold mt-1 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>সক্রিয় বিক্রয় রেকর্ড</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#DCECD5] shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-gray-500">পেন্ডিং নতুন অর্ডার</span>
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#004F18] font-mono">
            {pendingOrders.length} টি
          </div>
          <button
            onClick={() => onSelectTab('orders')}
            className="text-[11px] text-[#004F18] font-bold mt-1 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>অর্ডার প্রসেস করুন &rarr;</span>
          </button>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#DCECD5] shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-gray-500">মোট সক্রিয় পণ্য</span>
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-[#004F18] flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#004F18] font-mono">
            {products.length} টি
          </div>
          <div className="text-[11px] text-gray-500 font-medium mt-1">
            ইন-স্টক ও রেডি টু ডেলিভারি
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#DCECD5] shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-gray-500">লো-স্টক অ্যালার্ট</span>
            <div className="w-10 h-10 rounded-2xl bg-red-50 text-red-700 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-red-600 font-mono">
            {lowStockProducts.length} টি
          </div>
          <div className="text-[11px] text-gray-400 font-medium mt-1">
            মওজুদ শেষ হওয়ার ঝুঁকিতে
          </div>
        </div>
      </div>

      {/* Quick Alerts */}
      {lowStockProducts.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-3xl p-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0" />
            <div>
              <h4 className="font-bold text-sm text-[#004F18]">
                স্টক সতর্কবার্তা: {lowStockProducts.length} টি পণ্যের স্টক কম
              </h4>
              <p className="text-xs text-gray-600">
                {lowStockProducts.map((p) => `${p.nameBn} (${p.stock}টি)`).join(', ')}
              </p>
            </div>
          </div>
          <button
            onClick={() => onSelectTab('products')}
            className="bg-[#004F18] hover:bg-[#063B14] text-white text-xs font-bold px-4 py-2 rounded-xl whitespace-nowrap cursor-pointer transition-colors"
          >
            স্টক আপডেট করুন
          </button>
        </div>
      )}

      {/* Recent Orders Section */}
      <div className="bg-white rounded-3xl p-6 border border-[#DCECD5] shadow-xs">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#DCECD5]">
          <h3 className="font-bold text-base text-[#004F18]">সাম্প্রতিক অর্ডারের তালিকা</h3>
          <button
            onClick={() => onSelectTab('orders')}
            className="text-xs font-bold text-[#004F18] hover:text-[#5EB809] flex items-center gap-1 cursor-pointer transition-colors"
          >
            <span>সবগুলো দেখুন</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-['Hind_Siliguri']">
            <thead>
              <tr className="bg-[#F5FBF2] text-[#102B16]/70 uppercase tracking-wider font-bold">
                <th className="p-3 rounded-l-xl">অর্ডার নং</th>
                <th className="p-3">তারিখ</th>
                <th className="p-3">গ্রাহক</th>
                <th className="p-3">ফোন</th>
                <th className="p-3">জেলা</th>
                <th className="p-3">পণ্য সংখ্যা</th>
                <th className="p-3">মোট মূল্য</th>
                <th className="p-3 rounded-r-xl">স্ট্যাটাস</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DCECD5]/60">
              {orders.slice(0, 6).map((order) => (
                <tr key={order.id} className="hover:bg-[#F5FBF2]/60 transition-colors">
                  <td className="p-3 font-mono font-bold text-[#004F18]">{order.orderNumber}</td>
                  <td className="p-3 text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString('bn-BD')}
                  </td>
                  <td className="p-3 font-bold text-[#102B16]">{order.shippingAddress.fullName}</td>
                  <td className="p-3 font-mono">{order.shippingAddress.phoneNumber}</td>
                  <td className="p-3 text-gray-600">{order.shippingAddress.district}</td>
                  <td className="p-3">{order.items.length} টি</td>
                  <td className="p-3 font-black text-[#004F18]">
                    ৳{order.grandTotal.toLocaleString()}
                  </td>
                  <td className="p-3">
                    <span className="bg-[#E8F8D8] text-[#004F18] border border-[#5EB809]/30 px-2.5 py-1 rounded-full text-[11px] font-bold">
                      {order.orderStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
