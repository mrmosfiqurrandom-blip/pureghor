import React, { useState } from 'react';
import { Camera, Sparkles, MapPin, ZoomIn, X, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { resolveImageUrl, DEFAULT_FALLBACK_IMAGE } from '../../utils/imageUrl';

interface GalleryItem {
  id: string;
  category: 'all' | 'honey' | 'nuts' | 'oil' | 'oats' | 'fruits' | 'outlets';
  categoryLabelBn: string;
  titleBn: string;
  locationBn: string;
  descriptionBn: string;
  imageUrl: string;
  productSlug?: string;
  badgeBn: string;
}

const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'sg-honey-kalijira',
    category: 'honey',
    categoryLabelBn: 'মধু ও নাটস',
    titleBn: 'কালোজিরা ফুলের মধু বোতলজাতকরণ ও প্রাকৃতিক মান',
    locationBn: 'PureGhor সোর্সিং',
    descriptionBn: 'কালোজিরা ফুলের প্রাকৃতিক মধু কোনো প্রকার হিটিং বা কৃত্রিম চিনি ছাড়াই সরাসরি স্বাস্থ্যসম্মত বোতলজাত করা হয়।',
    imageUrl: '/images/pureghor/722119294_1968026900508945_6535640957699175289_n.jpeg',
    productSlug: 'pure-kalijira-flower-honey',
    badgeBn: '১০০% কাঁচা মধু',
  },
  {
    id: 'sg-honey-nut',
    category: 'honey',
    categoryLabelBn: 'মধু ও নাটস',
    titleBn: 'প্রিমিয়াম হানি নাট জার স্ট্যাকিং ও প্যাকেজিং',
    locationBn: 'PureGhor সিলেট আউটলেট',
    descriptionBn: 'কাঠবাদাম, কাজুবাদাম, পেস্তা, আখরোট, কিসমিস ও মধুর পুষ্টিকর সুষম মেলবন্ধন।',
    imageUrl: '/images/pureghor/731067967_1165096542480498_5504005484939299210_n.jpeg',
    productSlug: 'premium-honey-nut-jar',
    badgeBn: 'সুপার এনার্জি ফুড',
  },
  {
    id: 'sg-4nut-combo',
    category: 'nuts',
    categoryLabelBn: 'বাদাম ও বীজ',
    titleBn: '৪ জার মেগা বাদাম, কিসমিস ও মিষ্টি কুমড়ো বীজ কম্বো',
    locationBn: '১ কেজি মেগা প্যাকেজ',
    descriptionBn: 'কাঠ বাদাম ২৫০ গ্রাম, কাজু বাদাম ২৫০ গ্রাম, গোল্ডেন কিসমিস ২৫০ গ্রাম ও কুমড়ো বীজ ২৫০ গ্রামের প্রিমিয়াম জার।',
    imageUrl: '/images/pureghor/738465049_1960823601232100_4535246048439465719_n.jpeg',
    productSlug: 'four-jar-nut-seed-combo',
    badgeBn: 'মেগা সেভিংস অফার',
  },
  {
    id: 'sg-akhrot',
    category: 'nuts',
    categoryLabelBn: 'বাদাম ও বীজ',
    titleBn: 'প্রিমিয়াম খোসা ছাড়া ফ্রেশ আখরোট (ব্রেন ফুড)',
    locationBn: 'গ্রেড-১ ড্রাইড ফ্রুটস',
    descriptionBn: 'মস্তিষ্কের পুষ্টি ও হার্টের সুস্থতায় ওমেগা-৩ ফ্যাটি অ্যাসিডে ভরপুর ক্রিস্পি আস্ত আখরোট।',
    imageUrl: '/images/pureghor/740259912_853043360933083_8062257320957614052_n.jpeg',
    productSlug: 'premium-walnut-akhrot',
    badgeBn: 'ব্রেন ফুড',
  },
  {
    id: 'sg-balachao',
    category: 'all',
    categoryLabelBn: 'স্পেশাল খাদ্য',
    titleBn: 'হোমমেড স্পেশাল ক্রিস্পি চিংড়ি বালাচাও',
    locationBn: 'কক্সবাজার চিংড়ি ও ঘরোয়া মসলা',
    descriptionBn: 'ঘরোয়া পরিবেশে খাঁটি সরিষার তেলে মুচমুচে করে ভাজা সুস্বাদু ঐতিহ্যবাহী চিংড়ি বালাচাও।',
    imageUrl: '/images/pureghor/757700374_1054100053804163_386722467757915465_n.jpeg',
    productSlug: 'authentic-shrimp-balachao',
    badgeBn: 'ক্রিস্পি ও স্পাইসি',
  },
  {
    id: 'sg-kalijira-oil',
    category: 'oil',
    categoryLabelBn: 'ঘি ও তেল',
    titleBn: 'প্রকৃতির শক্তিতে জয়েন্টের যত্ন — খাঁটি কালোজিরা তেল',
    locationBn: 'কোল্ড-প্রেসড ন্যাচারাল',
    descriptionBn: 'হাঁটুর ব্যথা ও জয়েন্টের ব্যথানাশক খাঁটি কালোজিরার প্রথম চাপের কোল্ড-প্রেসড তেল।',
    imageUrl: '/images/pureghor/732103407_2085145489018609_7477184784061194606_n.jpeg',
    productSlug: 'pure-kalijira-oil-joint-care',
    badgeBn: 'ব্যথানাশক তেল',
  },
  {
    id: 'sg-oats-collection',
    category: 'oats',
    categoryLabelBn: 'ওটস ও সুপারফুড',
    titleBn: 'অস্ট্রেলিয়ান বেবি ওটস ও অর্গানিক ওটস কালেকশন',
    locationBn: 'আমদানিকৃত প্রিমিয়াম গ্রেড',
    descriptionBn: 'শিশু ও পরিবারের জন্য পুষ্টিকর ও দ্রবণীয় ফাইবারসমৃদ্ধ সার্টিফাইড অর্গানিক ওটস।',
    imageUrl: '/images/pureghor/777916124_1726477055273195_4515666685499235866_n.jpeg',
    productSlug: 'ausimex-baby-oats',
    badgeBn: 'হোল গ্রেইন ওটস',
  },
  {
    id: 'sg-fresh-mangoes',
    category: 'fruits',
    categoryLabelBn: 'মৌসুমি ফল',
    titleBn: 'বাগান থেকে সরাসরি বাছাইকৃত রাসায়নিকমুক্ত কাঁচা ও পাকা আম',
    locationBn: 'রাজশাহী ও সাতক্ষীরার বাগান',
    descriptionBn: 'কোনো কার্বাইড বা ক্ষতিকর স্প্রে ছাড়া সরাসরি গাছপাকা ও তাজা আম সংগ্রহ।',
    imageUrl: '/images/pureghor/732597014_2074558540609712_8558507915178937195_n.jpeg',
    productSlug: 'fresh-chemical-free-mangoes',
    badgeBn: 'রাসায়নিক মুক্ত',
  },
  {
    id: 'sg-store-shelves',
    category: 'outlets',
    categoryLabelBn: 'আমাদের আউটলেট',
    titleBn: 'PureGhor শোরুমের অর্গানিক ফুড ডিসপ্লে ও সেলফ',
    locationBn: 'লালাবাজার ও বিশ্বনাথ শাখা',
    descriptionBn: 'চোখের সামনে দেখে পছন্দের খাঁটি পণ্য বাছাই করার উন্মুক্ত ও পরিচ্ছন্ন শোরুম ব্যবস্থা।',
    imageUrl: '/images/pureghor/772513850_1055475870270979_5142302322816849426_n.jpeg',
    badgeBn: 'সরাসরি শোরুম',
  },
];

interface SourcingGallerySectionProps {
  onNavigate?: (path: string) => void;
}

export const SourcingGallerySection: React.FC<SourcingGallerySectionProps> = ({ onNavigate }) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'honey' | 'nuts' | 'oil' | 'oats' | 'fruits' | 'outlets'>('all');
  const [activeItem, setActiveItem] = useState<GalleryItem | null>(null);

  const filterTabs = [
    { id: 'all', labelBn: 'সকল ছবি' },
    { id: 'honey', labelBn: 'মধু ও হানি নাট' },
    { id: 'nuts', labelBn: 'বাদাম ও বীজ' },
    { id: 'oil', labelBn: 'তেল ও জয়েন্ট কেয়ার' },
    { id: 'oats', labelBn: 'ওটস কালেকশন' },
    { id: 'fruits', labelBn: 'মৌসুমি ফল' },
    { id: 'outlets', labelBn: 'শোরুম ও সেলফ' },
  ];

  const filteredItems = selectedCategory === 'all'
    ? GALLERY_ITEMS
    : GALLERY_ITEMS.filter((item) => item.category === selectedCategory);

  return (
    <section className="py-14 md:py-20 bg-white border-y border-[#DCECD5] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 bg-[#F5FBF2] px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold text-[#004F18] border border-[#DCECD5]">
            <Camera className="w-4 h-4 text-[#5EB809]" />
            <span>বাস্তব ছবি অ্যালবাম</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#004F18] font-['Hind_Siliguri'] leading-tight">
            আমাদের পণ্য, সোর্সিং ও শোরুমের <span className="text-[#5EB809]">বাস্তব অ্যালবাম</span>
          </h2>

          <p className="text-sm sm:text-base text-[#102B16]/80 max-w-2xl mx-auto font-['Hind_Siliguri'] leading-relaxed">
            কোনো কৃত্রিম ছবি নয় — PureGhor-এর প্রতিটি পণ্যের খাঁটি রূপ, প্রটেক্টিভ ফুড-গ্রেড প্যাকেজিং এবং শোরুমের সরাসরি আলোকচিত্র।
          </p>
        </div>

        {/* Filter Category Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {filterTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedCategory(tab.id as any)}
              className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer font-['Hind_Siliguri'] ${
                selectedCategory === tab.id
                  ? 'bg-[#004F18] text-white shadow-md'
                  : 'bg-[#F5FBF2] text-[#102B16] hover:bg-[#DCECD5] border border-[#DCECD5]'
              }`}
            >
              {tab.labelBn}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setActiveItem(item)}
              className="group bg-[#F5FBF2] rounded-3xl overflow-hidden border border-[#DCECD5] hover:border-[#5EB809] hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col justify-between"
            >
              {/* Photo Container */}
              <div className="relative aspect-4/3 overflow-hidden bg-stone-100">
                <img
                  src={resolveImageUrl(item.imageUrl)}
                  alt={item.titleBn}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                  onError={(e) => {
                    const target = e.currentTarget as HTMLImageElement;
                    if (target.src !== DEFAULT_FALLBACK_IMAGE) {
                      target.src = DEFAULT_FALLBACK_IMAGE;
                    }
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Badge */}
                <div className="absolute top-3 left-3 bg-[#5EB809] text-white text-[11px] font-black px-2.5 py-1 rounded-full shadow-md">
                  {item.badgeBn}
                </div>

                {/* Zoom prompt */}
                <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-md text-[#004F18] text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-md">
                  <ZoomIn className="w-3.5 h-3.5" />
                  <span>বড় করে দেখুন</span>
                </div>
              </div>

              {/* Card Meta Content */}
              <div className="p-5 space-y-2.5">
                <div className="flex items-center gap-1.5 text-xs text-[#5EB809] font-bold">
                  <MapPin className="w-3.5 h-3.5 shrink-0" />
                  <span className="line-clamp-1">{item.locationBn}</span>
                </div>

                <h3 className="font-bold text-base text-[#004F18] font-['Hind_Siliguri'] line-clamp-1 group-hover:text-[#5EB809] transition-colors">
                  {item.titleBn}
                </h3>

                <p className="text-xs text-[#102B16]/80 font-['Hind_Siliguri'] line-clamp-2 leading-relaxed">
                  {item.descriptionBn}
                </p>

                {item.productSlug && onNavigate && (
                  <div className="pt-2 border-t border-[#DCECD5] flex items-center justify-between">
                    <span className="text-xs font-bold text-[#004F18]">সরাসরি পণ্যটি দেখুন</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onNavigate(`/product/${item.productSlug}`);
                      }}
                      className="text-xs font-black text-[#5EB809] hover:underline flex items-center gap-1"
                    >
                      <span>অর্ডার করুন</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox / Zoom Modal */}
      {activeItem && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setActiveItem(null)}
        >
          <div
            className="relative max-w-3xl w-full bg-[#102B16] rounded-3xl overflow-hidden shadow-2xl border border-white/20"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveItem(null)}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="relative aspect-4/3 max-h-[70vh] bg-black">
              <img
                src={resolveImageUrl(activeItem.imageUrl)}
                alt={activeItem.titleBn}
                className="w-full h-full object-contain"
                onError={(e) => {
                  const target = e.currentTarget as HTMLImageElement;
                  if (target.src !== DEFAULT_FALLBACK_IMAGE) {
                    target.src = DEFAULT_FALLBACK_IMAGE;
                  }
                }}
              />
            </div>

            <div className="p-6 bg-[#004F18] text-white space-y-3">
              <div className="flex items-center gap-2 text-xs text-[#5EB809] font-bold">
                <MapPin className="w-4 h-4" />
                <span>{activeItem.locationBn}</span>
                <span className="bg-[#5EB809] text-white px-2 py-0.5 rounded text-[10px] ml-auto">
                  {activeItem.badgeBn}
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-black font-['Hind_Siliguri'] text-white">
                {activeItem.titleBn}
              </h3>

              <p className="text-sm text-white/90 font-['Hind_Siliguri'] leading-relaxed">
                {activeItem.descriptionBn}
              </p>

              {activeItem.productSlug && onNavigate && (
                <div className="pt-2">
                  <button
                    onClick={() => {
                      const slug = activeItem.productSlug;
                      setActiveItem(null);
                      onNavigate(`/product/${slug}`);
                    }}
                    className="bg-[#5EB809] hover:bg-[#4ea204] text-white px-6 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 shadow-lg transition-transform active:scale-95 cursor-pointer font-['Hind_Siliguri']"
                  >
                    <span>এই পণ্যটি শপ করুন</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
