import React, { useState } from 'react';
import {
  Search,
  Filter,
  Eye,
  CheckCircle,
  Truck,
  XCircle,
  Printer,
  FileText,
  Clock,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { updateOrderStatus } from '../../services/db';
import { Order, OrderStatus } from '../../types';

const STATUS_LIST: OrderStatus[] = [
  'Pending',
  'Confirmed',
  'Processing',
  'Shipped',
  'Delivered',
  'Cancelled',
  'Returned',
];

const STATUS_BN: Record<OrderStatus, string> = {
  Pending: 'পেন্ডিং (Pending)',
  Confirmed: 'কনফার্মড (Confirmed)',
  Processing: 'প্যাকেজিং (Processing)',
  Shipped: 'শিপড (Shipped)',
  Delivered: 'ডেলিভার্ড (Delivered)',
  Cancelled: 'বাতিল (Cancelled)',
  Returned: 'রিটার্ন (Returned)',
};

export const AdminOrders: React.FC = () => {
  const { orders, refreshData, adminUser } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [statusNote, setStatusNote] = useState('');
  const [loading, setLoading] = useState(false);

  const filteredOrders = orders.filter((o) => {
    if (filterStatus !== 'all' && o.orderStatus !== filterStatus) return false;
    if (searchTerm.trim()) {
      const clean = searchTerm.toLowerCase();
      if (
        !o.orderNumber.toLowerCase().includes(clean) &&
        !o.shippingAddress.phoneNumber.includes(clean) &&
        !o.shippingAddress.fullName.toLowerCase().includes(clean)
      ) {
        return false;
      }
    }
    return true;
  });

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    setLoading(true);
    try {
      await updateOrderStatus(
        orderId,
        newStatus,
        statusNote || `Status updated by ${adminUser?.displayName || 'Admin'}`
      );
      await refreshData();
      if (selectedOrder && selectedOrder.id === orderId) {
        const updated = orders.find((o) => o.id === orderId);
        if (updated) setSelectedOrder(updated);
      }
      setStatusNote('');
    } catch (err: any) {
      alert(err.message || 'স্ট্যাটাস আপডেট ব্যর্থ হয়েছে।');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="bg-white p-4 sm:p-6 rounded-3xl border border-[#E5E0D5] flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xs">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="অর্ডার নং বা ফোন দিয়ে খুঁজুন..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#FAF6EE] border border-[#E5E0D5] rounded-xl py-2.5 pl-9 pr-3 text-xs sm:text-sm outline-none focus:border-[#1F6B45]"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-xs font-bold text-gray-500">ফিল্টার:</span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-[#FAF6EE] border border-[#E5E0D5] text-xs font-bold rounded-xl py-2 px-3 outline-none"
          >
            <option value="all">সকল অর্ডার ({orders.length})</option>
            {STATUS_LIST.map((st) => (
              <option key={st} value={st}>
                {STATUS_BN[st]} ({orders.filter((o) => o.orderStatus === st).length})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-[#E5E0D5] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-['Hind_Siliguri']">
            <thead>
              <tr className="bg-[#FAF6EE] text-gray-500 uppercase tracking-wider font-bold border-b border-[#E5E0D5]">
                <th className="p-4">অর্ডার নং</th>
                <th className="p-4">তারিখ</th>
                <th className="p-4">গ্রাহক ও ফোন</th>
                <th className="p-4">ডেলিভারি জেলা</th>
                <th className="p-4">আইটেম</th>
                <th className="p-4">মূল্য</th>
                <th className="p-4">পেমেন্ট</th>
                <th className="p-4">স্ট্যাটাস</th>
                <th className="p-4 text-right">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E0D5]">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-[#FAF6EE]/40 transition-colors">
                  <td className="p-4 font-mono font-bold text-[#123B2A]">{order.orderNumber}</td>
                  <td className="p-4 text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString('bn-BD')}
                  </td>
                  <td className="p-4">
                    <div className="font-bold text-[#123B2A]">{order.shippingAddress.fullName}</div>
                    <div className="font-mono text-gray-400">{order.shippingAddress.phoneNumber}</div>
                  </td>
                  <td className="p-4 text-gray-600">{order.shippingAddress.district}</td>
                  <td className="p-4">{order.items.length} টি</td>
                  <td className="p-4 font-black text-[#1F6B45]">
                    ৳{order.grandTotal.toLocaleString()}
                  </td>
                  <td className="p-4 font-bold text-gray-700">{order.paymentMethod}</td>
                  <td className="p-4">
                    <select
                      value={order.orderStatus}
                      onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                      className="bg-[#FAF6EE] border border-[#E5E0D5] rounded-lg px-2 py-1 text-xs font-bold text-[#123B2A] outline-none"
                    >
                      {STATUS_LIST.map((st) => (
                        <option key={st} value={st}>
                          {STATUS_BN[st]}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="bg-[#1F6B45] text-white p-2 rounded-xl hover:bg-[#123B2A] transition-colors cursor-pointer"
                      title="বিস্তারিত চালান দেখুন"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detailed Order Receipt Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto border border-[#E5E0D5] font-['Hind_Siliguri']">
            <div className="flex justify-between items-center pb-4 border-b border-[#E5E0D5] mb-6">
              <div>
                <span className="text-xs text-gray-400">চালান ভিউ</span>
                <h3 className="text-xl font-black text-[#123B2A] font-mono">
                  {selectedOrder.orderNumber}
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-400 hover:text-gray-600 p-2 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6 text-sm">
              {/* Shipping info */}
              <div className="grid grid-cols-2 gap-4 bg-[#FAF6EE] p-4 rounded-2xl border border-[#E5E0D5]">
                <div>
                  <span className="text-xs font-bold text-gray-400 block uppercase">প্রাপক</span>
                  <p className="font-bold text-[#123B2A]">{selectedOrder.shippingAddress.fullName}</p>
                  <p className="text-xs text-gray-600">{selectedOrder.shippingAddress.phoneNumber}</p>
                  {selectedOrder.shippingAddress.alternativePhone && (
                    <p className="text-xs text-gray-500">বিকল্প: {selectedOrder.shippingAddress.alternativePhone}</p>
                  )}
                </div>
                <div>
                  <span className="text-xs font-bold text-gray-400 block uppercase">ঠিকানা</span>
                  <p className="text-xs text-gray-700">{selectedOrder.shippingAddress.fullAddress}</p>
                  <p className="text-xs font-bold text-[#1F6B45]">{selectedOrder.shippingAddress.district}</p>
                </div>
              </div>

              {/* Items Table */}
              <div>
                <h4 className="font-bold text-xs uppercase text-gray-400 mb-2">অর্ডারের আইটেমসমূহ</h4>
                <div className="border border-[#E5E0D5] rounded-2xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#FAF6EE] font-bold text-gray-600 border-b border-[#E5E0D5]">
                      <tr>
                        <th className="p-3">পণ্য</th>
                        <th className="p-3">একক মূল্য</th>
                        <th className="p-3">পরিমাণ</th>
                        <th className="p-3 text-right">মোট</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E5E0D5]">
                      {selectedOrder.items.map((it, idx) => (
                        <tr key={idx}>
                          <td className="p-3 font-bold text-[#123B2A]">{it.nameBn}</td>
                          <td className="p-3">৳{it.price}</td>
                          <td className="p-3">{it.quantity}</td>
                          <td className="p-3 text-right font-black text-[#1F6B45]">
                            ৳{(it.price * it.quantity).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Summary Calculation */}
              <div className="space-y-1.5 text-xs text-right border-t border-[#E5E0D5] pt-4">
                <div className="flex justify-between">
                  <span className="text-gray-500">সাবটোটাল:</span>
                  <span className="font-bold">৳{selectedOrder.subtotal.toLocaleString()}</span>
                </div>
                {selectedOrder.discount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-bold">
                    <span>কুপন ছাড়:</span>
                    <span>-৳{selectedOrder.discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-500">ডেলিভারি ফি:</span>
                  <span className="font-bold">৳{selectedOrder.deliveryCharge}</span>
                </div>
                <div className="flex justify-between text-base font-black text-[#123B2A] pt-2 border-t border-[#E5E0D5]">
                  <span>সর্বমোট প্রদেয়:</span>
                  <span className="text-[#1F6B45]">৳{selectedOrder.grandTotal.toLocaleString()}</span>
                </div>
              </div>

              {/* Action bar */}
              <div className="flex justify-between items-center pt-4 border-t border-[#E5E0D5]">
                <button
                  onClick={() => window.print()}
                  className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 hover:bg-gray-50 cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>চালান প্রিন্ট করুন</span>
                </button>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="bg-[#123B2A] text-white px-5 py-2 rounded-xl text-xs font-bold hover:bg-[#1F6B45]"
                >
                  বন্ধ করুন
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
