import React, { useState } from 'react';
import { MapPin, Phone, Clock, Store, CheckCircle2, Navigation, MessageSquare, Sparkles, Eye, X } from 'lucide-react';
import { resolveImageUrl, DEFAULT_FALLBACK_IMAGE } from '../../utils/imageUrl';

interface StoreOutletsSectionProps {
  onNavigate?: (path: string) => void;
}

const OUTLETS = [
  {
    id: 'sylhet-lalabazar',
    nameBn: 'লালাবাজার প্রধান আউটলেট, সিলেট',
    nameEn: 'Lalabazar Main Outlet, Sylhet',
    tag: 'প্রধান শাখা',
    addressBn: 'লালাবাজার পয়েন্ট, দক্ষিণ সুরমা, সিলেট - ৩১০৩',
    phone: '01754-991822',
    hours: 'প্রতিদিন সকাল ৯:০০ - রাত ১০:০০',
    features: ['সম্পূর্ণ অর্গানিক শপ', 'হানি ও ঘি লাইভ টেস্টিং', 'হোম ডেলিভারি হাব'],
    primaryImage: '/images/pureghor/770904230_1361254559313600_8154638867458334584_n.jpeg',
    gallery: [
      { url: '/images/pureghor/770904230_1361254559313600_8154638867458334584_n.jpeg', title: 'শোরুমের সামনের দৃশ্য ও সাইনবোর্ড' },
      { url: '/images/pureghor/772513850_1055475870270979_5142302322816849426_n.jpeg', title: 'অর্গানিক ফুড সেলফ ও প্রোডাক্ট স্টক' },
      { url: '/images/pureghor/701850019_850744534739631_3618294844868527772_n.jpg', title: 'বিলিং কাউন্টার ও সেবা কেন্দ্র' },
      { url: '/images/pureghor/773272133_1401762758532350_450888033961899514_n.jpeg', title: 'আমাদের ফ্রেন্ডলি কাস্টমার সার্ভিস টিম' },
    ],
  },
  {
    id: 'biswanath-branch',
    nameBn: 'বিশ্বনাথ শাখা আউটলেট',
    nameEn: 'Bishwanath Branch Outlet',
    tag: 'নতুন শাখা (১০% ছাড়)',
    addressBn: 'আল বুরাক শপিং সিটি (নিচতলা), বিশ্বনাথ, সিলেট',
    phone: '01754-991822',
    hours: 'প্রতিদিন সকাল ৯:৩০ - রাত ৯:৩০',
    features: ['উদ্বোধনী বিশেষ ছাড়', 'ড্রাই ফ্রুটস ও বাদাম কর্নার', 'সহজ পার্কিং সুবিধা'],
    primaryImage: '/images/pureghor/768372467_1346313220990385_640622947325931991_n.jpeg',
    gallery: [
      { url: '/images/pureghor/768372467_1346313220990385_640622947325931991_n.jpeg', title: 'বিশ্বনাথ শোরুমের প্রবেশদ্বার' },
      { url: '/images/pureghor/767222273_2024587104840457_7840408175303308981_n.jpeg', title: 'মধু, ঘি, ওটস ও খাঁটি তেলের সেলফ' },
      { url: '/images/pureghor/731843570_3182118701988973_854022805183807248_n.jpeg', title: 'উদ্বোধনী অনুষ্ঠানে আমাদের টিম' },
      { url: '/images/pureghor/768371610_1076373458060913_1098257873595053360_n.jpeg', title: 'কাউন্টার ও প্রিমিয়াম অয়েল ডিসপ্লে' },
    ],
  },
];

export const StoreOutletsSection: React.FC<StoreOutletsSectionProps> = ({ onNavigate }) => {
  const [selectedPhoto, setSelectedPhoto] = useState<{ url: string; title: string } | null>(null);

  return (
    <section className="py-12 md:py-16 bg-[#F5FBF2] border-y border-[#DCECD5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Section Title */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 bg-white border border-[#DCECD5] text-[#004F18] px-3.5 py-1.5 rounded-full text-xs font-bold shadow-xs">
            <Store className="w-3.5 h-3.5 text-[#5EB809]" />
            <span>সরাসরি শোরুম ভিজিট</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#004F18] font-['Hind_Siliguri']">
            আমাদের নিজস্ব শোরুম ও আউটলেটসমূহ
          </h2>
          <p className="text-sm sm:text-base text-[#102B16]/80 font-['Hind_Siliguri']">
            সিলেটের লালাবাজার ও বিশ্বনাথ আউটলেটে সরাসরি এসে দেখে, পরখ করে খাঁটি ও অর্গানিক পণ্য কিনুন।
          </p>
        </div>

        {/* Outlets Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {OUTLETS.map((outlet) => (
            <div
              key={outlet.id}
              className="bg-white rounded-3xl p-6 border border-[#DCECD5] shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="space-y-5">
                {/* Header with Tag */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="bg-[#5EB809] text-white text-[11px] font-black px-2.5 py-0.5 rounded-md uppercase">
                      {outlet.tag}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black text-[#004F18] font-['Hind_Siliguri'] mt-1.5">
                      {outlet.nameBn}
                    </h3>
                  </div>
                  <div className="w-10 h-10 rounded-2xl bg-[#F5FBF2] border border-[#DCECD5] flex items-center justify-center text-[#004F18] shrink-0">
                    <Store className="w-5 h-5 text-[#5EB809]" />
                  </div>
                </div>

                {/* Primary Feature Photo */}
                <div
                  onClick={() => setSelectedPhoto({ url: resolveImageUrl(outlet.primaryImage), title: outlet.nameBn })}
                  className="relative aspect-16/9 rounded-2xl overflow-hidden cursor-pointer group bg-[#102B16] border border-[#DCECD5]"
                >
                  <img
                    src={resolveImageUrl(outlet.primaryImage)}
                    alt={outlet.nameBn}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      const target = e.currentTarget as HTMLImageElement;
                      if (target.src !== DEFAULT_FALLBACK_IMAGE) {
                        target.src = DEFAULT_FALLBACK_IMAGE;
                      }
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
                    <span className="font-bold flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-[#5EB809]" /> {outlet.nameBn}
                    </span>
                    <span className="bg-white/25 backdrop-blur-md px-2 py-0.5 rounded flex items-center gap-1 font-semibold text-[11px]">
                      <Eye className="w-3 h-3" /> বড় করে দেখুন
                    </span>
                  </div>
                </div>

                {/* Thumbnails row */}
                <div className="grid grid-cols-4 gap-2">
                  {outlet.gallery.map((photo, pIdx) => (
                    <div
                      key={pIdx}
                      onClick={() => setSelectedPhoto({ url: resolveImageUrl(photo.url), title: photo.title })}
                      className="aspect-square rounded-xl overflow-hidden cursor-pointer border border-[#DCECD5] hover:border-[#5EB809] transition-all hover:scale-105 relative group"
                    >
                      <img
                        src={resolveImageUrl(photo.url)}
                        alt={photo.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.currentTarget as HTMLImageElement;
                          if (target.src !== DEFAULT_FALLBACK_IMAGE) {
                            target.src = DEFAULT_FALLBACK_IMAGE;
                          }
                        }}
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                    </div>
                  ))}
                </div>

                {/* Contact & Address Details */}
                <div className="space-y-2.5 pt-2 text-xs sm:text-sm text-[#102B16] border-t border-[#DCECD5]">
                  <div className="flex items-start gap-2.5">
                    <MapPin className="w-4 h-4 text-[#5EB809] shrink-0 mt-0.5" />
                    <span className="font-medium">{outlet.addressBn}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Clock className="w-4 h-4 text-[#5EB809] shrink-0" />
                    <span>{outlet.hours}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Phone className="w-4 h-4 text-[#5EB809] shrink-0" />
                    <span className="font-mono font-bold text-[#004F18]">{outlet.phone}</span>
                  </div>
                </div>

                {/* Features Badges */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {outlet.features.map((feat, fIdx) => (
                    <span
                      key={fIdx}
                      className="bg-[#F5FBF2] text-[#004F18] border border-[#DCECD5] text-xs font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#5EB809]" />
                      <span>{feat}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-6 border-t border-[#DCECD5] mt-5">
                <a
                  href={`tel:${outlet.phone.replace(/[^0-9]/g, '')}`}
                  className="bg-[#004F18] hover:bg-[#5EB809] text-white py-2.5 px-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  <span>সরাসরি কল করুন</span>
                </a>
                <a
                  href="https://wa.me/8801754991822"
                  target="_blank"
                  rel="noreferrer"
                  className="bg-[#25D366] hover:bg-[#20ba5a] text-white py-2.5 px-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>হোয়াটসঅ্যাপে কথা বলুন</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Photo Zoom Modal */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            className="relative max-w-3xl w-full bg-[#102B16] rounded-3xl overflow-hidden shadow-2xl border border-white/20"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/50 hover:bg-black text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="relative aspect-4/3 max-h-[75vh]">
              <img
                src={selectedPhoto.url}
                alt={selectedPhoto.title}
                className="w-full h-full object-contain bg-black/40"
              />
            </div>
            <div className="p-4 bg-[#004F18] text-white flex items-center justify-between">
              <span className="font-bold text-sm sm:text-base font-['Hind_Siliguri']">
                {selectedPhoto.title}
              </span>
              <span className="text-xs text-[#5EB809] font-medium">PureGhor Official Outlet</span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
