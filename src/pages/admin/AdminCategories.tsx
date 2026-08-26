import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Upload } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { saveCategory, deleteCategory } from '../../services/db';
import { uploadImageFile } from '../../services/storage';
import { Category } from '../../types';

export const AdminCategories: React.FC = () => {
  const { categories, refreshData } = useStore();
  const [editingCat, setEditingCat] = useState<Partial<Category> | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAddNew = () => {
    setEditingCat({
      nameBn: '',
      nameEn: '',
      slug: '',
      descriptionBn: '',
      imageUrl: '',
      displayOrder: categories.length + 1,
      isActive: true,
      type: 'food',
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingCat) return;

    try {
      const res = await uploadImageFile(file, 'categories');
      setEditingCat({ ...editingCat, imageUrl: res.url });
    } catch (err: any) {
      alert('ইমেজ আপলোড ব্যর্থ');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCat || !editingCat.nameBn) return;

    setLoading(true);
    try {
      const slug =
        editingCat.slug ||
        (editingCat.nameEn || editingCat.nameBn || '')
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '') ||
        `cat-${Date.now()}`;

      await saveCategory({
        ...editingCat,
        slug,
        type: editingCat.type || 'food',
      } as any);

      await refreshData();
      setEditingCat(null);
    } catch (e: any) {
      alert('ক্যাটাগরি সেভ হয়নি।');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('আপনি কি এই ক্যাটাগরি ডিলিট করতে চান?')) return;
    await deleteCategory(id);
    await refreshData();
  };

  return (
    <div className="space-y-6 font-['Hind_Siliguri']">
      <div className="bg-white p-4 sm:p-6 rounded-3xl border border-[#DCECD5] flex items-center justify-between shadow-2xs">
        <div>
          <h2 className="text-base font-bold text-[#004F18]">সকল ক্যাটাগরি তালিকা</h2>
          <p className="text-xs text-gray-500">মোট {categories.length} টি ক্যাটাগরি সক্রিয় রয়েছে</p>
        </div>

        <button
          onClick={handleAddNew}
          className="bg-[#004F18] hover:bg-[#063B14] text-white px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 shadow-xs cursor-pointer transition-colors"
        >
          <Plus className="w-4 h-4 text-[#5EB809]" />
          <span>নতুন ক্যাটাগরি</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="bg-white p-5 rounded-3xl border border-[#DCECD5] shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow"
          >
            <div>
              <div className="flex items-center gap-4 mb-3">
                <div className="w-14 h-14 rounded-2xl bg-[#F5FBF2] border border-[#DCECD5] overflow-hidden shrink-0">
                  {cat.imageUrl ? (
                    <img src={cat.imageUrl} alt={cat.nameBn} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs font-bold text-[#004F18]/40">
                      PG
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-base text-[#004F18] font-['Hind_Siliguri']">
                    {cat.nameBn}
                  </h3>
                  <span className="text-xs text-gray-400 font-mono">/{cat.slug}</span>
                </div>
              </div>
              <p className="text-xs text-gray-600 line-clamp-2">{cat.descriptionBn}</p>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-[#DCECD5] mt-4">
              <span className="text-[11px] font-bold text-[#004F18] bg-[#E8F8D8] border border-[#5EB809]/30 px-2 py-0.5 rounded-md">
                অর্ডার: {cat.displayOrder || 1}
              </span>

              <div className="flex gap-1">
                <button
                  onClick={() => setEditingCat(cat)}
                  className="p-2 text-[#004F18] hover:bg-[#F5FBF2] rounded-lg cursor-pointer transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(cat.id)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg cursor-pointer transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit modal */}
      {editingCat && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-[#DCECD5] shadow-2xl">
            <h3 className="text-lg font-bold text-[#004F18] mb-4">ক্যাটাগরি তথ্য</h3>
            <form onSubmit={handleSave} className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">নাম (বাংলা) *</label>
                <input
                  type="text"
                  required
                  value={editingCat.nameBn || ''}
                  onChange={(e) => setEditingCat({ ...editingCat, nameBn: e.target.value })}
                  className="w-full bg-[#F5FBF2] border border-[#DCECD5] rounded-xl p-2.5 outline-none focus:border-[#004F18]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">নাম (English)</label>
                <input
                  type="text"
                  value={editingCat.nameEn || ''}
                  onChange={(e) => setEditingCat({ ...editingCat, nameEn: e.target.value })}
                  className="w-full bg-[#F5FBF2] border border-[#DCECD5] rounded-xl p-2.5 outline-none focus:border-[#004F18]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">সংক্ষিপ্ত বিবরণ</label>
                <textarea
                  rows={2}
                  value={editingCat.descriptionBn || ''}
                  onChange={(e) => setEditingCat({ ...editingCat, descriptionBn: e.target.value })}
                  className="w-full bg-[#F5FBF2] border border-[#DCECD5] rounded-xl p-2.5 outline-none focus:border-[#004F18]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">ক্যাটাগরি ছবি</label>
                <label className="flex items-center justify-center gap-2 border-2 border-dashed border-[#DCECD5] p-3 rounded-xl cursor-pointer hover:border-[#004F18] bg-[#F5FBF2]">
                  <Upload className="w-4 h-4 text-[#004F18]" />
                  <span className="text-xs text-gray-600 font-bold">ইমেজ ফাইল আপলোড</span>
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingCat(null)}
                  className="px-4 py-2 rounded-xl border border-gray-300 text-xs font-bold cursor-pointer hover:bg-gray-50"
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
