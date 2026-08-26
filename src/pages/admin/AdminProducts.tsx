import React, { useState } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  Upload,
  Search,
  CheckCircle,
  XCircle,
  Link as LinkIcon,
  X,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { saveProduct, deleteProduct } from '../../services/db';
import { uploadImageFile } from '../../services/storage';
import { Product } from '../../types';
import { resolveImageUrl, DEFAULT_FALLBACK_IMAGE } from '../../utils/imageUrl';

export const AdminProducts: React.FC = () => {
  const { products, categories, refreshData } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageUrlInput, setImageUrlInput] = useState('');

  const filtered = products.filter(
    (p) =>
      p.nameBn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddNew = () => {
    setImageUrlInput('');
    setEditingProduct({
      nameBn: '',
      nameEn: '',
      slug: '',
      sku: `PG-${Date.now().toString().slice(-5)}`,
      categoryId: categories[0]?.id || '',
      price: 500,
      salePrice: undefined,
      weight: 500,
      unit: 'gm',
      stock: 50,
      currency: 'BDT',
      lowStockThreshold: 10,
      shortDescriptionBn: '',
      descriptionBn: '',
      images: [],
      isPublished: true,
      isFeatured: false,
      isSpecialOffer: false,
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingProduct) return;

    try {
      const res = await uploadImageFile(file, 'products');
      const currentImages = editingProduct.images || [];
      setEditingProduct({
        ...editingProduct,
        images: [
          ...currentImages,
          {
            url: res.url,
            alt: editingProduct.nameBn || 'Product',
            isPrimary: currentImages.length === 0,
          },
        ],
      });
    } catch (err: any) {
      alert(err.message || 'ইমেজ আপলোড ব্যর্থ হয়েছে');
    }
  };

  const handleAddImageUrl = () => {
    if (!imageUrlInput.trim() || !editingProduct) return;
    const currentImages = editingProduct.images || [];
    setEditingProduct({
      ...editingProduct,
      images: [
        ...currentImages,
        {
          url: imageUrlInput.trim(),
          alt: editingProduct.nameBn || 'Product',
          isPrimary: currentImages.length === 0,
        },
      ],
    });
    setImageUrlInput('');
  };

  const handleRemoveImage = (index: number) => {
    if (!editingProduct?.images) return;
    const updated = editingProduct.images.filter((_, i) => i !== index);
    if (updated.length > 0 && !updated.some((img) => img.isPrimary)) {
      updated[0].isPrimary = true;
    }
    setEditingProduct({
      ...editingProduct,
      images: updated,
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    setError(null);

    if (!editingProduct.nameBn || !editingProduct.sku || !editingProduct.categoryId) {
      setError('অনুগ্রহ করে পণ্যের নাম, SKU এবং ক্যাটাগরি পূরণ করুন।');
      return;
    }

    setLoading(true);
    try {
      const slug =
        editingProduct.slug ||
        (editingProduct.nameEn || editingProduct.nameBn || '')
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '') ||
        `prod-${Date.now()}`;

      await saveProduct({
        ...editingProduct,
        slug,
      } as any);

      await refreshData();
      setEditingProduct(null);
    } catch (err: any) {
      setError(err.message || 'পণ্য সংরক্ষণ করা সম্ভব হয়নি।');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('আপনি কি নিশ্চিতভাবে এই পণ্যটি ডিলিট করতে চান?')) return;
    await deleteProduct(id);
    await refreshData();
  };

  return (
    <div className="space-y-6 font-['Hind_Siliguri']">
      {/* Top action header */}
      <div className="bg-white p-4 sm:p-6 rounded-3xl border border-[#DCECD5] flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xs">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="পণ্য বা SKU দিয়ে খুঁজুন..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#F5FBF2] border border-[#DCECD5] rounded-xl py-2.5 pl-9 pr-3 text-xs sm:text-sm outline-none focus:border-[#004F18]"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        <button
          onClick={handleAddNew}
          className="bg-[#004F18] hover:bg-[#063B14] text-white px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 shadow-xs cursor-pointer transition-colors"
        >
          <Plus className="w-4 h-4 text-[#5EB809]" />
          <span>নতুন পণ্য যুক্ত করুন</span>
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-[#DCECD5] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-['Hind_Siliguri']">
            <thead>
              <tr className="bg-[#F5FBF2] text-[#102B16]/70 uppercase tracking-wider font-bold border-b border-[#DCECD5]">
                <th className="p-4">ছবি</th>
                <th className="p-4">নাম ও SKU</th>
                <th className="p-4">ক্যাটাগরি</th>
                <th className="p-4">মূল্য</th>
                <th className="p-4">স্টক</th>
                <th className="p-4">স্ট্যাটাস</th>
                <th className="p-4 text-right">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DCECD5]">
              {filtered.map((prod) => {
                const cat = categories.find((c) => c.id === prod.categoryId);
                const isLow = prod.stock <= prod.lowStockThreshold;

                return (
                  <tr key={prod.id} className="hover:bg-[#F5FBF2]/50 transition-colors">
                    <td className="p-4">
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-[#F5FBF2] border border-[#DCECD5]">
                        {prod.images?.[0]?.url ? (
                          <img
                            src={resolveImageUrl(prod.images[0].url)}
                            alt={prod.nameBn}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).src = DEFAULT_FALLBACK_IMAGE;
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[#004F18]/40 font-bold">
                            PG
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-[#004F18] text-sm">{prod.nameBn}</div>
                      <div className="text-[11px] text-gray-400 font-mono">SKU: {prod.sku}</div>
                    </td>
                    <td className="p-4 font-medium text-gray-600">{cat?.nameBn || '—'}</td>
                    <td className="p-4">
                      <div className="font-black text-[#004F18]">৳{prod.salePrice || prod.price}</div>
                      {prod.salePrice && (
                        <span className="text-[10px] text-gray-400 line-through">৳{prod.price}</span>
                      )}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                          isLow
                            ? 'bg-red-50 text-red-600 border border-red-200'
                            : 'bg-[#E8F8D8] text-[#004F18] border border-[#5EB809]/30'
                        }`}
                      >
                        {prod.stock} টি
                      </span>
                    </td>
                    <td className="p-4">
                      {prod.isPublished ? (
                        <span className="text-[#004F18] font-bold flex items-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5 text-[#5EB809]" /> সক্রিয়
                        </span>
                      ) : (
                        <span className="text-gray-400 font-bold flex items-center gap-1">
                          <XCircle className="w-3.5 h-3.5" /> নিষ্ক্রিয়
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right space-x-1">
                      <button
                        onClick={() => {
                          setImageUrlInput('');
                          setEditingProduct(prod);
                        }}
                        className="p-2 text-[#004F18] hover:bg-[#F5FBF2] rounded-lg cursor-pointer transition-colors"
                        title="এডিট"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(prod.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg cursor-pointer transition-colors"
                        title="ডিলিট"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit/Create Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto border border-[#DCECD5] shadow-2xl">
            <div className="flex justify-between items-center pb-4 border-b border-[#DCECD5] mb-6">
              <h3 className="text-xl font-bold text-[#004F18]">
                {editingProduct.id ? 'পণ্য আপডেট করুন' : 'নতুন পণ্য যুক্ত করুন'}
              </h3>
              <button
                onClick={() => setEditingProduct(null)}
                className="text-gray-400 hover:text-gray-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 text-xs font-bold rounded-xl">
                {error}
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4 text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    পণ্যের নাম (বাংলা) *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingProduct.nameBn || ''}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, nameBn: e.target.value })
                    }
                    className="w-full bg-[#F5FBF2] border border-[#DCECD5] rounded-xl p-2.5 outline-none focus:border-[#004F18]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    পণ্যের নাম (English)
                  </label>
                  <input
                    type="text"
                    value={editingProduct.nameEn || ''}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, nameEn: e.target.value })
                    }
                    className="w-full bg-[#F5FBF2] border border-[#DCECD5] rounded-xl p-2.5 outline-none focus:border-[#004F18]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">SKU কোড *</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.sku || ''}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, sku: e.target.value })
                    }
                    className="w-full bg-[#F5FBF2] border border-[#DCECD5] rounded-xl p-2.5 outline-none focus:border-[#004F18] font-mono text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">ক্যাটাগরি *</label>
                  <select
                    value={editingProduct.categoryId || ''}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, categoryId: e.target.value })
                    }
                    className="w-full bg-[#F5FBF2] border border-[#DCECD5] rounded-xl p-2.5 outline-none focus:border-[#004F18] font-bold"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.nameBn} ({c.nameEn})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">নরমাল মূল্য (৳) *</label>
                  <input
                    type="number"
                    required
                    value={editingProduct.price || ''}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, price: Number(e.target.value) })
                    }
                    className="w-full bg-[#F5FBF2] border border-[#DCECD5] rounded-xl p-2.5 outline-none focus:border-[#004F18]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">অফার / সেল মূল্য (৳)</label>
                  <input
                    type="number"
                    placeholder="ডিসকাউন্ট না থাকলে ফাঁকা রাখুন"
                    value={editingProduct.salePrice || ''}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        salePrice: e.target.value ? Number(e.target.value) : undefined,
                      })
                    }
                    className="w-full bg-[#F5FBF2] border border-[#DCECD5] rounded-xl p-2.5 outline-none focus:border-[#004F18]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">স্টক পরিমাণ</label>
                  <input
                    type="number"
                    value={editingProduct.stock ?? 50}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })
                    }
                    className="w-full bg-[#F5FBF2] border border-[#DCECD5] rounded-xl p-2.5 outline-none focus:border-[#004F18]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">ওজন / পরিমাপ</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="500"
                      value={editingProduct.weight || 500}
                      onChange={(e) =>
                        setEditingProduct({ ...editingProduct, weight: Number(e.target.value) })
                      }
                      className="w-full bg-[#F5FBF2] border border-[#DCECD5] rounded-xl p-2.5 outline-none focus:border-[#004F18]"
                    />
                    <select
                      value={editingProduct.unit || 'gm'}
                      onChange={(e) =>
                        setEditingProduct({ ...editingProduct, unit: e.target.value as any })
                      }
                      className="w-28 bg-[#F5FBF2] border border-[#DCECD5] rounded-xl p-2.5 outline-none font-bold"
                    >
                      <option value="gm">গ্রাম (gm)</option>
                      <option value="kg">কেজি (kg)</option>
                      <option value="ml">মিলি (ml)</option>
                      <option value="ltr">লিটার (ltr)</option>
                      <option value="pcs">পিস (pcs)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Descriptions */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">সংক্ষিপ্ত বিবরণ (বাংলা)</label>
                <input
                  type="text"
                  value={editingProduct.shortDescriptionBn || ''}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, shortDescriptionBn: e.target.value })
                  }
                  className="w-full bg-[#F5FBF2] border border-[#DCECD5] rounded-xl p-2.5 outline-none focus:border-[#004F18]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">বিস্তারিত বিবরণ (বাংলা)</label>
                <textarea
                  rows={3}
                  value={editingProduct.descriptionBn || ''}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, descriptionBn: e.target.value })
                  }
                  className="w-full bg-[#F5FBF2] border border-[#DCECD5] rounded-xl p-2.5 outline-none focus:border-[#004F18]"
                />
              </div>

              {/* Images Management */}
              <div className="bg-[#F5FBF2] p-4 rounded-2xl border border-[#DCECD5]">
                <label className="block text-xs font-bold text-[#004F18] mb-2">
                  পণ্যের ছবিসমূহ (Product Images)
                </label>

                {/* Image Thumbnails List */}
                <div className="flex flex-wrap gap-3 mb-3">
                  {editingProduct.images?.map((img, i) => (
                    <div
                      key={i}
                      className="w-20 h-20 rounded-xl border-2 border-[#DCECD5] overflow-hidden relative group bg-white shadow-2xs"
                    >
                      <img
                        src={resolveImageUrl(img.url)}
                        alt={img.alt || 'Product'}
                        className="w-full h-full object-cover"
                      />
                      {img.isPrimary && (
                        <span className="absolute top-1 left-1 bg-[#004F18] text-white text-[9px] font-bold px-1 rounded">
                          প্রধান
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(i)}
                        className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 shadow-sm hover:bg-red-700 opacity-90 hover:opacity-100 cursor-pointer"
                        title="ছবি মুছে ফেলুন"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}

                  {/* Upload button */}
                  <label className="w-20 h-20 rounded-xl border-2 border-dashed border-[#004F18] bg-white flex flex-col items-center justify-center cursor-pointer hover:bg-[#F5FBF2] transition-colors">
                    <Upload className="w-5 h-5 text-[#004F18]" />
                    <span className="text-[10px] font-bold text-[#004F18] mt-1">ফাইল আপলোড</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </label>
                </div>

                {/* Direct Image URL input */}
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder="বা সরাসরি ইমেজ লিংক (URL) পেস্ট করুন..."
                      value={imageUrlInput}
                      onChange={(e) => setImageUrlInput(e.target.value)}
                      className="w-full bg-white border border-[#DCECD5] rounded-xl py-2 pl-3 pr-8 text-xs outline-none focus:border-[#004F18]"
                    />
                    <LinkIcon className="w-3.5 h-3.5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
                  </div>
                  <button
                    type="button"
                    onClick={handleAddImageUrl}
                    className="bg-[#004F18] text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-[#063B14] cursor-pointer"
                  >
                    যোগ করুন
                  </button>
                </div>
              </div>

              {/* Toggles */}
              <div className="flex flex-wrap gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold">
                  <input
                    type="checkbox"
                    checked={editingProduct.isPublished ?? true}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, isPublished: e.target.checked })
                    }
                  />
                  <span>স্টোরে দৃশ্যমান (Published)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold">
                  <input
                    type="checkbox"
                    checked={editingProduct.isFeatured ?? false}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, isFeatured: e.target.checked })
                    }
                  />
                  <span>ফিচার্ড পণ্য (Featured)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold">
                  <input
                    type="checkbox"
                    checked={editingProduct.isSpecialOffer ?? false}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, isSpecialOffer: e.target.checked })
                    }
                  />
                  <span>বিশেষ অফার (Special Offer)</span>
                </label>
              </div>

              {/* Submit buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-[#DCECD5]">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-5 py-2.5 rounded-xl border border-gray-300 text-xs font-bold hover:bg-gray-50 cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 rounded-xl bg-[#004F18] hover:bg-[#063B14] text-white text-xs font-bold cursor-pointer transition-colors shadow-xs"
                >
                  {loading ? 'সংরক্ষিত হচ্ছে...' : 'পণ্য সংরক্ষণ করুন'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
