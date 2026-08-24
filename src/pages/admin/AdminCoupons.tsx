import React, { useState } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { saveCoupon, deleteCoupon } from '../../services/db';
import { Coupon } from '../../types';

export const AdminCoupons: React.FC = () => {
  const { coupons, refreshData } = useStore();
  const [editingCoupon, setEditingCoupon] = useState<Partial<Coupon> | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAddNew = () => {
    setEditingCoupon({
      code: 'OFFER10',
      discountType: 'percentage',
      value: 10,
      minOrderAmount: 1000,
      maxDiscount: 300,
      usageLimit: 100,
      usedCount: 0,
      expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      isActive: true,
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCoupon || !editingCoupon.code) return;

    setLoading(true);
    try {
      await saveCoupon({
        ...editingCoupon,
        code: editingCoupon.code.toUpperCase().trim(),
      } as any);

      await refreshData();
      setEditingCoupon(null);
    } catch (err: any) {
      alert('কুপন সংরক্ষণ হয়নি।');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('আপনি কি এই কুপনটি ডিলিট করতে চান?')) return;
    await deleteCoupon(id);
    await refreshData();
  };

  return (
    <div className="space-y-6 font-['Hind_Siliguri']">
      <div className="bg-white p-4 sm:p-6 rounded-3xl border border-[#E5E0D5] flex items-center justify-between shadow-2xs">
        <div>
          <h2 className="text-base font-bold text-[#123B2A]">কুপন ও ডিসকাউন্ট কোড</h2>
          <p className="text-xs text-gray-500">গ্রাহকদের জন্য প্রোমোশনাল ছাড় তৈরি করুন</p>
        </div>

        <button
          onClick={handleAddNew}
          className="bg-[#1F6B45] hover:bg-[#123B2A] text-white px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>নতুন কুপন কোড</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {coupons.map((c) => (
          <div key={c.id} className="bg-white p-5 rounded-3xl border border-[#E5E0D5] shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono font-black text-base text-[#1F6B45] bg-[#FAF6EE] px-3 py-1 rounded-xl border border-[#E5E0D5]">
                  {c.code}
                </span>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  {c.discountType === 'percentage' ? `${c.value}% ছাড়` : `৳${c.value} ছাড়`}
                </span>
              </div>
              <div className="text-[11px] text-gray-500 mt-2 space-y-0.5">
                <div>নূন্যতম অর্ডার: ৳{c.minOrderAmount}</div>
                <div>সর্বোচ্চ ছাড়: ৳{c.maxDiscount || 'আনলিমিটেড'}</div>
                <div>ব্যবহার হয়েছে: {c.usedCount || 0} / {c.usageLimit || '∞'} বার</div>
              </div>
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-[#E5E0D5] mt-4">
              <span className="text-xs font-bold text-gray-400">
                {c.isActive ? 'সক্রিয়' : 'নিষ্ক্রিয়'}
              </span>

              <div className="flex gap-1">
                <button
                  onClick={() => setEditingCoupon(c)}
                  className="p-2 text-[#1F6B45] hover:bg-gray-100 rounded-lg cursor-pointer"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(c.id)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editingCoupon && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-[#E5E0D5]">
            <h3 className="text-lg font-bold text-[#123B2A] mb-4">কুপন তথ্য</h3>
            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">কুপন কোড (যেমন: PURE10) *</label>
                <input
                  type="text"
                  required
                  value={editingCoupon.code || ''}
                  onChange={(e) => setEditingCoupon({ ...editingCoupon, code: e.target.value })}
                  className="w-full bg-[#FAF6EE] border border-[#E5E0D5] rounded-xl p-2.5 font-mono uppercase"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">ছাড়ের ধরন</label>
                  <select
                    value={editingCoupon.discountType || 'percentage'}
                    onChange={(e) => setEditingCoupon({ ...editingCoupon, discountType: e.target.value as any })}
                    className="w-full bg-[#FAF6EE] border border-[#E5E0D5] rounded-xl p-2 font-bold"
                  >
                    <option value="percentage">শতকরা (%)</option>
                    <option value="fixed">নির্দিষ্ট টাকা (৳)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">ছাড়ের পরিমাণ *</label>
                  <input
                    type="number"
                    required
                    value={editingCoupon.value || 0}
                    onChange={(e) => setEditingCoupon({ ...editingCoupon, value: Number(e.target.value) })}
                    className="w-full bg-[#FAF6EE] border border-[#E5E0D5] rounded-xl p-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">নূন্যতম অর্ডার (৳)</label>
                  <input
                    type="number"
                    value={editingCoupon.minOrderAmount || 0}
                    onChange={(e) => setEditingCoupon({ ...editingCoupon, minOrderAmount: Number(e.target.value) })}
                    className="w-full bg-[#FAF6EE] border border-[#E5E0D5] rounded-xl p-2"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">সর্বোচ্চ ছাড় (৳)</label>
                  <input
                    type="number"
                    value={editingCoupon.maxDiscount || ''}
                    onChange={(e) => setEditingCoupon({ ...editingCoupon, maxDiscount: e.target.value ? Number(e.target.value) : undefined })}
                    className="w-full bg-[#FAF6EE] border border-[#E5E0D5] rounded-xl p-2"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setEditingCoupon(null)}
                  className="px-4 py-2 rounded-xl border font-bold"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 rounded-xl bg-[#1F6B45] text-white font-bold"
                >
                  সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
