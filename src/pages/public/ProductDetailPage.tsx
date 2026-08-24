import React, { useState } from 'react';
import {
  ChevronRight,
  Star,
  ShoppingBag,
  Zap,
  ShieldCheck,
  Truck,
  RotateCcw,
  Plus,
  Minus,
  CheckCircle,
  Share2,
  Package,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useCart } from '../../context/CartContext';
import { Product, ProductWeightOption } from '../../types';
import { ProductCard } from '../../components/common/ProductCard';
import { PlaceholderImage } from '../../components/common/PlaceholderImage';
import { WhatsAppFloatingButton } from '../../components/common/WhatsAppFloatingButton';

interface ProductDetailPageProps {
  slug: string;
  onNavigate: (path: string) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ slug, onNavigate }) => {
  const { products, categories, reviews } = useStore();
  const { addToCart, setIsCartDrawerOpen } = useCart();

  const product = products.find((p) => p.slug === slug);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedWeight, setSelectedWeight] = useState<ProductWeightOption | null>(
    product?.weightOptions && product.weightOptions.length > 0 ? product.weightOptions[0] : null
  );
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<
    'description' | 'ingredients' | 'source' | 'storage' | 'delivery' | 'reviews' | 'faq'
  >('description');
  const [isCopied, setIsCopied] = useState(false);

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <h2 className="text-2xl font-bold text-[#123B2A] mb-4">পণ্য পাওয়া যায়নি</h2>
        <p className="text-gray-500 mb-6">আপনার খোঁজা পণ্যটি উপলব্ধ নেই বা নাম পরিবর্তন করা হয়েছে।</p>
        <button
          onClick={() => onNavigate('/shop')}
          className="bg-[#1F6B45] text-white px-6 py-3 rounded-full text-sm font-bold"
        >
          শপে ফিরে যান
        </button>
      </div>
    );
  }

  const category = categories.find((c) => c.id === product.categoryId);
  const currentPrice = selectedWeight
    ? selectedWeight.salePrice || selectedWeight.price
    : product.salePrice || product.price;
  const originalPrice = selectedWeight ? selectedWeight.price : product.price;
  const hasDiscount = currentPrice < originalPrice;
  const discountPercent = hasDiscount
    ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
    : 0;

  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= product.lowStockThreshold;

  const productReviews = reviews.filter((r) => r.productId === product.id && r.status === 'approved');

  const relatedProducts = products
    .filter((p) => p.id !== product.id && (p.categoryId === product.categoryId || product.relatedProductIds?.includes(p.id)))
    .slice(0, 4);

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(product, quantity, selectedWeight || undefined);
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    addToCart(product, quantity, selectedWeight || undefined);
    onNavigate('/checkout');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.nameBn,
        text: product.shortDescriptionBn,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    <div className="py-6 md:py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-gray-500 mb-6 font-['Hind_Siliguri']">
        <button onClick={() => onNavigate('/')} className="hover:text-[#1F6B45]">
          হোম
        </button>
        <ChevronRight className="w-3.5 h-3.5" />
        <button onClick={() => onNavigate('/shop')} className="hover:text-[#1F6B45]">
          শপ
        </button>
        {category && (
          <>
            <ChevronRight className="w-3.5 h-3.5" />
            <button
              onClick={() => onNavigate(`/category/${category.slug}`)}
              className="hover:text-[#1F6B45]"
            >
              {category.nameBn}
            </button>
          </>
        )}
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-[#123B2A] font-bold truncate max-w-xs">{product.nameBn}</span>
      </div>

      {/* Main Product Section: Gallery & Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 bg-white rounded-3xl p-5 sm:p-8 border border-[#E5E0D5] shadow-xs">
        
        {/* Left: Image Gallery */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-[#FAF6EE] border border-[#E5E0D5] group">
            {product.images && product.images[activeImageIndex] ? (
              <img
                src={product.images[activeImageIndex].url}
                alt={product.images[activeImageIndex].alt || product.nameBn}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <PlaceholderImage type="product" text={product.nameBn} />
            )}

            {hasDiscount && (
              <div className="absolute top-4 left-4 bg-[#D99A2B] text-[#123B2A] text-xs font-black px-3 py-1.5 rounded-lg shadow-sm font-['Hind_Siliguri']">
                {discountPercent}% মূল্য ছাড়
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                    activeImageIndex === idx
                      ? 'border-[#1F6B45] ring-2 ring-[#1F6B45]/20'
                      : 'border-[#E5E0D5] opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img.url} alt={img.alt} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Buy Box & Product Info */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
          <div>
            {/* SKU and Share */}
            <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
              <span className="font-mono">SKU: {product.sku}</span>
              <button
                onClick={handleShare}
                className="flex items-center gap-1 text-[#1F6B45] font-bold hover:underline cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{isCopied ? 'লিংক কপি হয়েছে!' : 'শেয়ার করুন'}</span>
              </button>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl font-black text-[#123B2A] font-['Hind_Siliguri'] leading-tight">
              {product.nameBn}
            </h1>
            <p className="text-xs text-gray-400 font-medium mt-0.5">{product.nameEn}</p>

            {/* Rating and Reviews */}
            <div className="flex items-center gap-3 mt-3">
              <div className="flex text-[#D99A2B]">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.rating || 5) ? 'fill-current' : 'text-gray-200'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs font-bold text-[#1F6B45]">
                {product.rating || 4.9} ({product.reviewCount || 18} টি রিভিউ)
              </span>
              <span className="text-gray-300">|</span>
              <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                ভেরিফায়েড পিওর পণ্য
              </span>
            </div>

            {/* Short Description */}
            <p className="text-sm text-[#26312B]/80 mt-4 leading-relaxed font-['Hind_Siliguri']">
              {product.shortDescriptionBn}
            </p>

            {/* Price Box */}
            <div className="mt-5 p-4 rounded-2xl bg-[#FFF8EA]/80 border border-[#E5E0D5]">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-black text-[#1F6B45] font-['Hind_Siliguri']">
                  ৳{currentPrice.toLocaleString()}
                </span>
                {hasDiscount && (
                  <>
                    <span className="text-base text-gray-400 line-through font-medium">
                      ৳{originalPrice.toLocaleString()}
                    </span>
                    <span className="text-xs font-bold text-[#B85C38] bg-[#B85C38]/10 px-2 py-0.5 rounded">
                      সাশ্রয় ৳{(originalPrice - currentPrice).toLocaleString()}
                    </span>
                  </>
                )}
              </div>
              <div className="text-[11px] text-gray-500 mt-1">
                প্যাক সাইজ:{' '}
                <span className="font-bold text-[#123B2A]">
                  {selectedWeight ? `${selectedWeight.weight} ${selectedWeight.unit}` : `${product.weight} ${product.unit}`}
                </span>
              </div>
            </div>

            {/* Weight/Size Options */}
            {product.weightOptions && product.weightOptions.length > 1 && (
              <div className="mt-5">
                <label className="block text-xs font-bold text-[#123B2A] uppercase mb-2">
                  প্যাক সাইজ সিলেক্ট করুন:
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.weightOptions.map((opt, idx) => {
                    const isSelected =
                      selectedWeight?.sku === opt.sku || selectedWeight?.weight === opt.weight;
                    return (
                      <button
                        key={idx}
                        onClick={() => setSelectedWeight(opt)}
                        className={`px-4 py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                          isSelected
                            ? 'border-[#1F6B45] bg-[#1F6B45] text-white shadow-xs'
                            : 'border-[#E5E0D5] bg-white text-[#26312B] hover:border-[#1F6B45]'
                        }`}
                      >
                        <div>
                          {opt.weight} {opt.unit}
                        </div>
                        <div className="text-[10px] opacity-90">
                          ৳{opt.salePrice || opt.price}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Stock Status & Quantity Selector */}
            <div className="mt-6 flex items-center gap-4">
              <div className="flex items-center border border-[#E5E0D5] rounded-xl overflow-hidden bg-[#FAF6EE]">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2.5 text-gray-600 hover:bg-[#1F6B45] hover:text-white transition-colors cursor-pointer"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 text-sm font-bold text-[#123B2A] min-w-[2rem] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="px-3 py-2.5 text-gray-600 hover:bg-[#1F6B45] hover:text-white transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <div>
                {isOutOfStock ? (
                  <span className="text-xs font-bold text-red-600 bg-red-50 px-3 py-1.5 rounded-lg border border-red-200">
                    স্টক আউট (Unavailable)
                  </span>
                ) : isLowStock ? (
                  <span className="text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200">
                    মাত্র {product.stock} টি মওজুদ আছে
                  </span>
                ) : (
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                    ইন-স্টক (তাজা স্টক)
                  </span>
                )}
              </div>
            </div>

            {/* Action Buttons: Min 44px height */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className="min-h-[48px] bg-[#FFF8EA] hover:bg-[#1F6B45] text-[#123B2A] hover:text-white border-2 border-[#1F6B45] rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 font-['Hind_Siliguri']"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>কার্টে যোগ করুন</span>
              </button>

              <button
                onClick={handleBuyNow}
                disabled={isOutOfStock}
                className="min-h-[48px] bg-[#1F6B45] hover:bg-[#123B2A] text-white rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-md active:scale-98 transition-all cursor-pointer disabled:opacity-50 font-['Hind_Siliguri']"
              >
                <Zap className="w-4 h-4 text-[#D99A2B] fill-current" />
                <span>এখনই অর্ডার করুন</span>
              </button>
            </div>
          </div>

          {/* Delivery & Trust Microcopy */}
          <div className="pt-6 border-t border-[#E5E0D5] space-y-2 text-xs text-[#26312B]/80">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#1F6B45]" />
              <span>
                <strong>ডেলিভারি:</strong> সিলেট ও ঢাকা ২৪-৪৮ ঘণ্টা, ঢাকার বাইরে ২-৩ দিন।
              </span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#1F6B45]" />
              <span>
                <strong>পেমেন্ট:</strong> ক্যাশ অন ডেলিভারি (পণ্য দেখে মূল্য পরিশোধের সুবিধা)।
              </span>
            </div>
            <div className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-[#1F6B45]" />
              <span>
                <strong>রিটার্ন:</strong> কোনো ত্রুটি পেলে ৪৮ ঘণ্টার মধ্যে সহজ রিপ্লেসমেন্ট।
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Product Information Tabs */}
      <div className="mt-12 bg-white rounded-3xl p-6 sm:p-8 border border-[#E5E0D5]">
        {/* Tabs Bar */}
        <div className="flex overflow-x-auto gap-2 border-b border-[#E5E0D5] pb-4 mb-6 scrollbar-none font-['Hind_Siliguri'] font-bold text-sm">
          {[
            { id: 'description', label: 'বিস্তারিত বিবরণ' },
            { id: 'ingredients', label: 'উপাদান ও পুষ্টিগুণ' },
            { id: 'source', label: 'উৎস ও সোর্সিং' },
            { id: 'storage', label: 'সংরক্ষণ পদ্ধতি' },
            { id: 'delivery', label: 'ডেলিভারি ও রিটার্ন' },
            { id: 'reviews', label: `রিভিউ (${productReviews.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-[#1F6B45] text-white shadow-xs'
                  : 'text-[#26312B]/70 hover:bg-[#FFF8EA] hover:text-[#123B2A]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Contents */}
        <div className="text-sm leading-relaxed text-[#26312B]/90 font-['Hind_Siliguri']">
          {activeTab === 'description' && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-[#123B2A]">{product.nameBn} এর বিস্তারিত</h3>
              <p>{product.descriptionBn}</p>
            </div>
          )}

          {activeTab === 'ingredients' && (
            <div className="space-y-4">
              <div>
                <h4 className="font-bold text-[#123B2A] mb-1">উপাদান:</h4>
                <p>{product.ingredients || '১০০% প্রাকৃতিক ও খাঁটি উপাদান।'}</p>
              </div>
              <div>
                <h4 className="font-bold text-[#123B2A] mb-1">পুষ্টিমান (Nutrition Facts):</h4>
                <p>{product.nutrition || 'স্বাভাবিক প্রাকৃতিক খনিজ ও ভিটামিন সমৃদ্ধ।'}</p>
              </div>
            </div>
          )}

          {activeTab === 'source' && (
            <div className="space-y-3">
              <h4 className="font-bold text-[#123B2A]">সংগ্রহের স্থান ও কৃষক পরিচিতি</h4>
              <p>{product.source || 'সিলেট ও বাংলাদেশের নির্ভরযোগ্য প্রাকৃতিক খামার থেকে সংগৃহীত।'}</p>
            </div>
          )}

          {activeTab === 'storage' && (
            <div className="space-y-3">
              <h4 className="font-bold text-[#123B2A]">সংরক্ষণ নির্দেশিকা ও মেয়াদ</h4>
              <p>{product.storageInstruction || 'স্বাভাবিক তাপমাত্রায় শুষ্ক ও অন্ধকার স্থানে মুখ বন্ধ করে রাখুন।'}</p>
              <p className="text-xs text-gray-500">
                <strong>মেয়াদকাল:</strong> {product.expiryText || 'প্যাকেজিং এর পর থেকে দীর্ঘস্থায়ী নিরাপদ খাদ্য।'}
              </p>
            </div>
          )}

          {activeTab === 'delivery' && (
            <div className="space-y-3">
              <h4 className="font-bold text-[#123B2A]">ডেলিভারি ও ক্যাশ অন ডেলিভারি পলিসি</h4>
              <p>
                সারা বাংলাদেশে সুন্দরবন কুরিয়ার, রেডএক্স এবং পেপারফ্লাই-এর মাধ্যমে হোম ডেলিভারি করা হয়।
                পণ্য হাতে পেয়ে যাচাই করে মূল্য পরিশোধের নিশ্চয়তা।
              </p>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-[#123B2A]">গ্রাহকদের মূল্যায়ন ({productReviews.length})</h4>
              </div>
              {productReviews.length > 0 ? (
                <div className="space-y-4">
                  {productReviews.map((r) => (
                    <div key={r.id} className="p-4 rounded-2xl bg-[#FFF8EA]/40 border border-[#E5E0D5]">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-[#123B2A]">{r.customerName}</span>
                        <div className="flex text-[#D99A2B]">
                          {[...Array(r.rating)].map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-current" />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-gray-700 italic">"{r.comment}"</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-xs">এখনও কোনো রিভিউ যুক্ত হয়নি। প্রথম রিভিউকারী হোন!</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-14">
          <h2 className="text-xl sm:text-2xl font-black text-[#123B2A] font-['Hind_Siliguri'] mb-6">
            সম্পর্কিত অন্যান্য খাঁটি পণ্য
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} onNavigate={onNavigate} />
            ))}
          </div>
        </div>
      )}

      {/* Floating WhatsApp CTA */}
      <WhatsAppFloatingButton productTitle={product.nameBn} />
    </div>
  );
};
