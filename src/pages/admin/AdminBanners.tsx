import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Upload, Link as LinkIcon, Eye, CheckCircle2, XCircle } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { saveBanner, deleteBanner } from '../../services/db';
import { uploadImageFile } from '../../services/storage';
import { Banner } from '../../types';
import { resolveImageUrl } from '../../utils/imageUrl';

export const AdminBanners: React.FC = () => {
  const { banners, refreshData } = useStore();
  const [editingBanner, setEditingBanner] = useState<Partial<Banner> | null>(null);
  const [loading, setLoading] = useState(false);
  const [imageUrlInput, setImageUrlInput] = useState('');

  const handleAddNew = () => {
    setImageUrlInput('');
    setEditingBanner({
      type: 'hero',
      titleBn: 'কাস্টম স্লাইড ব্যানার',
      subtitleBn: '',
      ctaTextBn: '',
      targetUrl: '/shop',
      imageUrl: '',
      altText: 'PureGhor Banner',
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
      alert(err?.message || 'ইমেজ আপলোড ব্যর্থ হয়েছে');
    }
  };

  const handleApplyUrl = () => {
    if (imageUrlInput.trim() && editingBanner) {
      setEditingBanner({ ...editingBanner, imageUrl: imageUrlInput.trim() });
      setImageUrlInput('');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBanner) return;

    if (!editingBanner.imageUrl) {
      alert('অনুগ্রহ করে ব্যানারের জন্য একটি ছবি আপলোড করুন বা লিংক দিন।');
      return;
    }

    setLoading(true);
    try {
      await saveBanner({
        ...editingBanner,
        titleBn: editingBanner.titleBn || 'ব্যানার',
        altText: editingBanner.altText || editingBanner.titleBn || 'Banner',
      } as any);
      await refreshData();
      setEditingBanner(null);
    } catch (e: any) {
      alert('ব্যানার সংরক্ষণ সম্ভব হয়নি।');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('আপনি কি নিশ্চিতভাবে এই ব্যানারটি মুছে ফেলতে চান?')) return;
    await deleteBanner(id);
    await refreshData();
  };

  return (
    <div className="space-y-6 font-['Hind_Siliguri']">
      {/* Header bar */}
      <div className="bg-white p-4 sm:p-6 rounded-3xl border border-[#DCECD5] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
        <div>
          <h2 className="text-base font-bold text-[#004F18]">হোমপেজ স্লাইডার ব্যানার ম্যানেজমেন্ট</h2>
          <p className="text-xs text-gray-500">
            এখানে আপনার তৈরি করা কাস্টম ব্যানার আপলোড করুন। এই ব্যানারগুলো হোমপেজে ডানে-বামে স্লাইড হবে।
          </p>
        </div>

        <button
          onClick={handleAddNew}
          className="bg-[#004F18] hover:bg-[#063B14] text-white px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 cursor-pointer transition-colors shrink-0"
        >
          <Plus className="w-4 h-4 text-[#5EB809]" />
          <span>নতুন ব্যানার যুক্ত করুন</span>
        </button>
      </div>

      {/* Banner Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {banners.map((b) => (
          <div
            key={b.id}
            className="bg-white rounded-3xl border border-[#DCECD5] overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
          >
            <div>
              {/* Banner Preview */}
              <div className="aspect-[2.4/1] bg-[#F5FBF2] relative border-b border-[#DCECD5] overflow-hidden group">
                {b.imageUrl ? (
                  <img
                    src={resolveImageUrl(b.imageUrl)}
                    alt={b.altText || b.titleBn}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-102"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-[#004F18] text-white font-bold text-sm">
                    {b.titleBn}
                  </div>
                )}

                <div className="absolute top-3 left-3 flex gap-2">
                  <span className="bg-[#004F18] text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase shadow-xs">
                    ক্রম: #{b.displayOrder || 1}
                  </span>
                  <span
                    className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase shadow-xs flex items-center gap-1 ${
                      b.isActive ? 'bg-[#5EB809] text-white' : 'bg-red-500 text-white'
                    }`}
                  >
                    {b.isActive ? 'সক্রিয়' : 'বন্ধ'}
                  </span>
                </div>
              </div>

              <div className="p-4">
                <h3 className="font-bold text-sm sm:text-base text-[#004F18]">
                  {b.titleBn || 'কাস্টম স্লাইড ব্যানার'}
                </h3>
                <div className="text-[11px] text-gray-500 mt-1 font-mono break-all">
                  🔗 ক্লিক লিংক: {b.targetUrl || '/shop'}
                </div>
              </div>
            </div>

            <div className="p-4 pt-0 flex justify-between items-center border-t border-[#DCECD5]/60 mt-2">
              <span className="text-xs text-gray-400 font-mono">ID: {b.id.slice(0, 10)}</span>

              <div className="flex gap-1">
                <button
                  onClick={() => {
                    setImageUrlInput('');
                    setEditingBanner(b);
                  }}
                  className="p-2 text-[#004F18] hover:bg-[#F5FBF2] rounded-lg cursor-pointer transition-colors"
                  title="এডিট করুন"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(b.id)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg cursor-pointer transition-colors"
                  title="মুছে ফেলুন"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit/Create Modal */}
      {editingBanner && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 border border-[#DCECD5] shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-3 border-b border-[#DCECD5] mb-4">
              <h3 className="text-base font-bold text-[#004F18]">
                {editingBanner.id ? 'ব্যানার এডিট করুন' : 'নতুন ব্যানার আপলোড করুন'}
              </h3>
              <button
                onClick={() => setEditingBanner(null)}
                className="text-gray-400 hover:text-gray-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs font-['Hind_Siliguri']">
              {/* Image Preview Box */}
              <div>
                <label className="block text-xs font-bold text-[#004F18] mb-1">
                  ব্যানার ছবি প্রিভিউ
                </label>
                <div className="aspect-[2.4/1] w-full rounded-2xl bg-[#F5FBF2] border-2 border-dashed border-[#DCECD5] overflow-hidden flex items-center justify-center relative">
                  {editingBanner.imageUrl ? (
                    <img
                      src={resolveImageUrl(editingBanner.imageUrl)}
                      alt="Banner Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center p-4 text-gray-400">
                      <Eye className="w-6 h-6 mx-auto mb-1 opacity-50" />
                      <p>কোনো ব্যানার ছবি নির্বাচন করা হয়নি</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">সাইজ: 1920x600 বা 1200x400 রেকমেন্ডেড</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Upload Image Section */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <label className="flex items-center justify-center gap-2 border border-[#004F18] bg-[#004F18]/5 hover:bg-[#004F18]/10 p-2.5 rounded-xl cursor-pointer transition-colors text-center">
                  <Upload className="w-4 h-4 text-[#004F18]" />
                  <span className="font-bold text-[#004F18]">ফাইল আপলোড করুন</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </label>

                {/* Direct Image URL input */}
                <div className="flex gap-1">
                  <input
                    type="text"
                    placeholder="ইমেজ URL পেস্ট করুন..."
                    value={imageUrlInput}
                    onChange={(e) => setImageUrlInput(e.target.value)}
                    className="flex-1 bg-[#F5FBF2] border border-[#DCECD5] rounded-xl px-2.5 py-1.5 text-xs outline-none focus:border-[#004F18]"
                  />
                  <button
                    type="button"
                    onClick={handleApplyUrl}
                    className="bg-[#004F18] text-white px-3 py-1.5 rounded-xl font-bold hover:bg-[#063B14] cursor-pointer"
                  >
                    সেট
                  </button>
                </div>
              </div>

              {/* Target Link */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  ব্যানারে ক্লিক করলে কোন পেজে যাবে? (Target URL)
                </label>
                <input
                  type="text"
                  placeholder="/shop অথবা /category/honey-nuts"
                  value={editingBanner.targetUrl || ''}
                  onChange={(e) =>
                    setEditingBanner({ ...editingBanner, targetUrl: e.target.value })
                  }
                  className="w-full bg-[#F5FBF2] border border-[#DCECD5] rounded-xl p-2.5 text-xs outline-none focus:border-[#004F18] font-mono"
                />
              </div>

              {/* Title / Description label for identification */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    ব্যানারের নাম / বিবরণ
                  </label>
                  <input
                    type="text"
                    value={editingBanner.titleBn || ''}
                    onChange={(e) =>
                      setEditingBanner({ ...editingBanner, titleBn: e.target.value })
                    }
                    placeholder="উদা: রমজান স্পেশাল ব্যানার"
                    className="w-full bg-[#F5FBF2] border border-[#DCECD5] rounded-xl p-2.5 text-xs outline-none focus:border-[#004F18]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    স্লাইড ক্রম (Display Order)
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={editingBanner.displayOrder || 1}
                    onChange={(e) =>
                      setEditingBanner({
                        ...editingBanner,
                        displayOrder: Number(e.target.value),
                      })
                    }
                    className="w-full bg-[#F5FBF2] border border-[#DCECD5] rounded-xl p-2.5 text-xs outline-none focus:border-[#004F18]"
                  />
                </div>
              </div>

              {/* Active Toggle */}
              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-gray-800">
                  <input
                    type="checkbox"
                    checked={editingBanner.isActive ?? true}
                    onChange={(e) =>
                      setEditingBanner({ ...editingBanner, isActive: e.target.checked })
                    }
                    className="w-4 h-4 text-[#004F18] rounded focus:ring-0"
                  />
                  <span>হোমপেজ স্লাইডারে দৃশ্যমান রাখুন (Active)</span>
                </label>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2 pt-4 border-t border-[#DCECD5]">
                <button
                  type="button"
                  onClick={() => setEditingBanner(null)}
                  className="px-4 py-2 rounded-xl border border-gray-300 font-bold hover:bg-gray-50 cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 rounded-xl bg-[#004F18] hover:bg-[#063B14] text-white font-bold cursor-pointer transition-colors shadow-xs"
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
