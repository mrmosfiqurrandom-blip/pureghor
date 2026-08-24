import React, { useState } from 'react';
import { Star, CheckCircle, MessageSquarePlus, Quote, ThumbsUp } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { submitCustomerReview } from '../../services/db';

export const ReviewsSection: React.FC = () => {
  const { reviews, products, refreshData } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(products[0]?.id || '');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const approvedReviews = reviews.filter((r) => r.status === 'approved');

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !comment.trim()) return;

    setIsSubmitting(true);
    try {
      const selectedProd = products.find((p) => p.id === selectedProductId);
      await submitCustomerReview({
        productId: selectedProductId || (products[0]?.id ?? 'general'),
        productNameBn: selectedProd ? selectedProd.nameBn : 'সাধারণ রিভিউ',
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        rating,
        comment: comment.trim(),
        isVerifiedBuyer: true,
      });

      setSuccessMessage('আপনার মূল্যবান পর্যালোচনার জন্য ধন্যবাদ! এটি যুক্ত করা হয়েছে।');
      setCustomerName('');
      setCustomerPhone('');
      setComment('');
      setTimeout(() => {
        setIsModalOpen(false);
        setSuccessMessage(null);
        refreshData();
      }, 2000);
    } catch (err) {
      alert('রিভিউ জমা দিতে সমস্যা হয়েছে।');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-[#5EB809] text-xs font-bold uppercase tracking-wider mb-1">
            <ThumbsUp className="w-3.5 h-3.5" />
            <span>গ্রাহক সন্তুষ্টির অভিজ্ঞতা</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#004F18] font-['Hind_Siliguri']">
            গ্রাহকদের খাঁটি মতামত ও রিভিউ
          </h2>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-[#004F18] hover:bg-[#083F15] text-white px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 shadow-xs active:scale-95 transition-all self-start sm:self-auto cursor-pointer"
        >
          <MessageSquarePlus className="w-4 h-4 text-[#5EB809]" />
          <span>আপনার মতামত দিন</span>
        </button>
      </div>

      {/* Review Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {approvedReviews.slice(0, 6).map((rev) => (
          <div
            key={rev.id}
            className="bg-white rounded-2xl p-6 border border-[#DCECD5] shadow-xs hover:border-[#5EB809] transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex text-[#E89D10]">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < rev.rating ? 'fill-current' : 'text-gray-200'
                      }`}
                    />
                  ))}
                </div>
                {rev.isVerifiedBuyer && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#004F18] bg-[#E8F8D8] px-2 py-0.5 rounded border border-[#DCECD5]">
                    <CheckCircle className="w-3 h-3 text-[#5EB809]" />
                    <span>ভেরিফায়েড ক্রেতা</span>
                  </span>
                )}
              </div>

              <div className="text-xs font-bold text-[#004F18] mb-2 line-clamp-1 font-['Hind_Siliguri']">
                পণ্য: {rev.productNameBn}
              </div>

              <p className="text-sm text-[#102B16]/90 leading-relaxed font-['Hind_Siliguri'] italic">
                "{rev.comment}"
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-[#DCECD5] flex items-center justify-between text-xs text-gray-500">
              <span className="font-bold text-[#004F18]">{rev.customerName}</span>
              <span>{new Date(rev.createdAt).toLocaleDateString('bn-BD')}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Review Submission Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#DCECD5]">
            <div className="flex justify-between items-center pb-3 border-b border-[#DCECD5] mb-4">
              <h3 className="font-bold text-lg text-[#004F18] font-['Hind_Siliguri']">
                আপনার রিভিউ শেয়ার করুন
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                ✕
              </button>
            </div>

            {successMessage ? (
              <div className="p-4 bg-emerald-50 text-emerald-800 rounded-2xl text-center font-bold text-sm font-['Hind_Siliguri']">
                {successMessage}
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">পণ্য সিলেক্ট করুন</label>
                  <select
                    value={selectedProductId}
                    onChange={(e) => setSelectedProductId(e.target.value)}
                    className="w-full bg-[#F5FBF2] border border-[#DCECD5] rounded-xl p-2.5 text-sm font-medium outline-none focus:border-[#004F18]"
                  >
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.nameBn}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">আপনার নাম *</label>
                    <input
                      type="text"
                      required
                      placeholder="যেমন: তানভীর আহমেদ"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full bg-[#F5FBF2] border border-[#DCECD5] rounded-xl p-2.5 text-sm outline-none focus:border-[#004F18]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">মোবাইল নম্বর</label>
                    <input
                      type="text"
                      placeholder="01712345678"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full bg-[#F5FBF2] border border-[#DCECD5] rounded-xl p-2.5 text-sm outline-none focus:border-[#004F18]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">রেটিং দিন</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <button
                        type="button"
                        key={num}
                        onClick={() => setRating(num)}
                        className={`p-2 rounded-lg border transition-all ${
                          rating >= num
                            ? 'bg-[#F5FBF2] border-[#5EB809] text-[#5EB809]'
                            : 'border-[#DCECD5] text-gray-300'
                        }`}
                      >
                        <Star className={`w-5 h-5 ${rating >= num ? 'fill-current' : ''}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">আপনার অভিজ্ঞতা *</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="পণ্যের মান, স্বাদ ও প্যাকেজিং কেমন লেগেছে বিস্তারিত লিখুন..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full bg-[#F5FBF2] border border-[#DCECD5] rounded-xl p-2.5 text-sm outline-none focus:border-[#004F18]"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl border border-gray-300 text-xs font-bold hover:bg-gray-50 cursor-pointer"
                  >
                    বাতিল
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2.5 rounded-xl bg-[#004F18] text-white text-xs font-bold hover:bg-[#083F15] transition-colors cursor-pointer"
                  >
                    {isSubmitting ? 'জমা হচ্ছে...' : 'রিভিউ সাবমিট করুন'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
