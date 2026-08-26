import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Upload } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { saveBanner, deleteBanner } from '../../services/db';
import { uploadImageFile } from '../../services/storage';
import { Banner } from '../../types';

export const AdminBanners: React.FC = () => {
  const { banners, refreshData } = useStore();
  const [editingBanner, setEditingBanner] = useState<Partial<Banner> | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAddNew = () => {
    setEditingBanner({
      type: 'hero',
      titleBn: '',
      subtitleBn: '',
      ctaTextBn: 'শপ করুন',
      targetUrl: '/shop',
      imageUrl: '',
      altText: 'Banner',
      isActive: true,
      displayOrder: banners.length + 1,
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingBanner) return;

    try {
      const res = await uploadImageFile(file, 'banners');
      setEditingBanner({ ...editingBanner, imageUrl: res.url });
    } catch (err: any) {
      alert('ইমেজ আপলোড ব্যর্থ');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBanner) return;

    setLoading(true);
    try {
      await saveBanner({
        ...editingBanner,
        altText: editingBanner.altText || editingBanner.titleBn || 'Banner',
      } as any);
      await refreshData();
      setEditingBanner(null);
    } catch (e: any) {
      alert('ব্যানার সংরক্ষণ হয়নি।');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('আপনি কি এই ব্যানারটি মুছে ফেলতে চান?')) return;
    await deleteBanner(id);
    await refreshData();
  };

  return (
    <div className="space-y-6 font-['Hind_Siliguri']">
      <div className="bg-white p-4 sm:p-6 rounded-3xl border border-[#DCECD5] flex items-center justify-between shadow-2xs">
        <div>
          <h2 className="text-base font-bold text-[#004F18]">ব্যানার ও প্রোমোশন স্লাইডার</h2>
          <p className="text-xs text-gray-500">হোমপেজের হিরো ব্যানার এবং স্পেশাল অফার ব্যানার কাস্টমাইজ করুন</p>
        </div>

        <button
          onClick={handleAddNew}
          className="bg-[#004F18] hover:bg-[#063B14] text-white px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 cursor-pointer transition-colors"
        >
          <Plus className="w-4 h-4 text-[#5EB809]" />
          <span>নতুন ব্যানার</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {banners.map((b) => (
          <div key={b.id} className="bg-white rounded-3xl border border-[#DCECD5] overflow-hidden shadow-xs hover:shadow-md transition-shadow">
            <div className="h-40 bg-[#F5FBF2] relative border-b border-[#DCECD5]">
              {b.imageUrl ? (
                <img src={b.imageUrl} alt={b.altText || b.titleBn} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-[#004F18] text-white font-bold text-sm">
                  {b.titleBn}
                </div>
              )}
              <span className="absolute top-3 left-3 bg-[#5EB809] text-[#004F18] text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase shadow-xs">
                {b.type}
              </span>
            </div>

            <div className="p-4 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-base text-[#004F18]">{b.titleBn}</h3>
                <p className="text-xs text-gray-600 mt-1">{b.subtitleBn}</p>
                <div className="text-[11px] text-gray-400 mt-2 font-mono">লিংক: {b.targetUrl}</div>
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-[#DCECD5] mt-4">
                <span className="text-xs font-bold text-[#004F18]">
                  {b.isActive ? 'সক্রিয়' : 'নিষ্ক্রিয়'}
                </span>

                <div className="flex gap-1">
                  <button
                    onClick={() => setEditingBanner(b)}
                    className="p-2 text-[#004F18] hover:bg-[#F5FBF2] rounded-lg cursor-pointer transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(b.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg cursor-pointer transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editingBanner && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 border border-[#DCECD5] shadow-2xl">
            <h3 className="text-lg font-bold text-[#004F18] mb-4">ব্যানার এডিট</h3>
            <form onSubmit={handleSave} className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">টাইপ</label>
                  <select
                    value={editingBanner.type || 'hero'}
                    onChange={(e) => setEditingBanner({ ...editingBanner, type: e.target.value as any })}
                    className="w-full bg-[#F5FBF2] border border-[#DCECD5] rounded-xl p-2 text-xs font-bold outline-none focus:border-[#004F18]"
                  >
                    <option value="hero">হিরো ব্যানার (Hero)</option>
                    <option value="offer">অফার ব্যানার (Offer)</option>
                    <option value="category">ক্যাটাগরি ব্যানার (Category)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">ডিসপ্লে অর্ডার</label>
                  <input
                    type="number"
                    value={editingBanner.displayOrder || 1}
                    onChange={(e) => setEditingBanner({ ...editingBanner, displayOrder: Number(e.target.value) })}
                    className="w-full bg-[#F5FBF2] border border-[#DCECD5] rounded-xl p-2 text-xs outline-none focus:border-[#004F18]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">শিরোনাম (বাংলা) *</label>
                <input
                  type="text"
                  required
                  value={editingBanner.titleBn || ''}
                  onChange={(e) => setEditingBanner({ ...editingBanner, titleBn: e.target.value })}
                  className="w-full bg-[#F5FBF2] border border-[#DCECD5] rounded-xl p-2 text-xs outline-none focus:border-[#004F18]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">উপশিরোনাম (বাংলা)</label>
                <input
                  type="text"
                  value={editingBanner.subtitleBn || ''}
                  onChange={(e) => setEditingBanner({ ...editingBanner, subtitleBn: e.target.value })}
                  className="w-full bg-[#F5FBF2] border border-[#DCECD5] rounded-xl p-2 text-xs outline-none focus:border-[#004F18]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">বাটন টেক্সট</label>
                  <input
                    type="text"
                    value={editingBanner.ctaTextBn || ''}
                    onChange={(e) => setEditingBanner({ ...editingBanner, ctaTextBn: e.target.value })}
                    className="w-full bg-[#F5FBF2] border border-[#DCECD5] rounded-xl p-2 text-xs outline-none focus:border-[#004F18]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">বাটন লিংক</label>
                  <input
                    type="text"
                    value={editingBanner.targetUrl || ''}
                    onChange={(e) => setEditingBanner({ ...editingBanner, targetUrl: e.target.value })}
                    className="w-full bg-[#F5FBF2] border border-[#DCECD5] rounded-xl p-2 text-xs outline-none focus:border-[#004F18]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">ব্যানার ব্যাকগ্রাউন্ড ইমেজ</label>
                <label className="flex items-center justify-center gap-2 border-2 border-dashed border-[#DCECD5] p-3 rounded-xl cursor-pointer hover:border-[#004F18] bg-[#F5FBF2]">
                  <Upload className="w-4 h-4 text-[#004F18]" />
                  <span className="text-xs text-gray-600 font-bold">ইমেজ আপলোড</span>
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingBanner(null)}
                  className="px-4 py-2 rounded-xl border border-gray-300 text-xs font-bold hover:bg-gray-50 cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 rounded-xl bg-[#004F18] hover:bg-[#063B14] text-white text-xs font-bold cursor-pointer transition-colors"
                >
                  {loading ? 'সংরক্ষিত হচ্ছে...' : 'সংরক্ষণ করুন'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
