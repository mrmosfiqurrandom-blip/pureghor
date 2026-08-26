import React from 'react';
import { Star, CheckCircle, XCircle, Trash2, MessageSquare } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { updateReviewStatus, deleteReview } from '../../services/db';

export const AdminReviews: React.FC = () => {
  const { reviews, refreshData } = useStore();

  const handleStatus = async (id: string, status: 'approved' | 'rejected') => {
    await updateReviewStatus(id, status);
    await refreshData();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('রিভিউটি ডিলিট করতে চান?')) return;
    await deleteReview(id);
    await refreshData();
  };

  return (
    <div className="space-y-6 font-['Hind_Siliguri']">
      <div className="bg-white p-4 sm:p-6 rounded-3xl border border-[#DCECD5] flex items-center justify-between shadow-2xs">
        <div>
          <h2 className="text-base font-bold text-[#004F18]">গ্রাহক রিভিউ ও মূল্যায়ন</h2>
          <p className="text-xs text-gray-500">অনুমোদিত রিভিউ ওয়েবসাইটে দৃশ্যমান হবে</p>
        </div>
      </div>

      <div className="space-y-4">
        {reviews.map((rev) => (
          <div
            key={rev.id}
            className="bg-white p-5 rounded-3xl border border-[#DCECD5] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:shadow-md transition-shadow"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="flex text-[#5EB809]">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <span className="font-bold text-sm text-[#004F18]">{rev.customerName}</span>
                {rev.isVerifiedBuyer && (
                  <span className="text-[10px] bg-[#E8F8D8] text-[#004F18] border border-[#5EB809]/30 px-2 py-0.5 rounded-full font-bold">
                    ভেরিফায়েড ক্রেতা
                  </span>
                )}
              </div>

              <p className="text-xs text-gray-700 italic">"{rev.comment}"</p>
              <div className="text-[11px] text-gray-400">
                পণ্য: <span className="font-bold text-[#004F18]">{rev.productNameBn}</span> |{' '}
                {new Date(rev.createdAt).toLocaleDateString('bn-BD')}
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              {rev.status === 'pending' && (
                <>
                  <button
                    onClick={() => handleStatus(rev.id, 'approved')}
                    className="bg-[#004F18] hover:bg-[#063B14] text-white px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <CheckCircle className="w-3.5 h-3.5 text-[#5EB809]" />
                    <span>অনুমোদন</span>
                  </button>
                  <button
                    onClick={() => handleStatus(rev.id, 'rejected')}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>বাতিল</span>
                  </button>
                </>
              )}

              {rev.status === 'approved' && (
                <span className="text-xs font-bold text-[#004F18] bg-[#E8F8D8] border border-[#5EB809]/30 px-3 py-1 rounded-xl">
                  অনুমোদিত
                </span>
              )}

              {rev.status === 'rejected' && (
                <span className="text-xs font-bold text-red-600 bg-red-50 border border-red-200 px-3 py-1 rounded-xl">
                  বাতিলকৃত
                </span>
              )}

              <button
                onClick={() => handleDelete(rev.id)}
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg cursor-pointer transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
