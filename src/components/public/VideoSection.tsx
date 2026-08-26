import React, { useState } from 'react';
import { Play, Sparkles, ShieldCheck, ExternalLink, ThumbsUp, Eye, CheckCircle2, Film, Share2, Youtube, Facebook, Video, MessageCircle } from 'lucide-react';

interface VideoSectionProps {
  onNavigate?: (path: string) => void;
}

// Future-ready schema: easily mapped to Firestore collection 'videos' when Firebase is integrated
export interface SocialVideoItem {
  id: string;
  titleBn: string;
  category: 'sourcing' | 'making' | 'reviews' | 'health';
  platform: 'facebook' | 'youtube' | 'instagram';
  videoUrl: string;
  thumbnailUrl: string;
  durationText: string;
  viewsText: string;
  highlightBn: string;
  isFeatured?: boolean;
}

const INITIAL_SOCIAL_VIDEOS: SocialVideoItem[] = [
  {
    id: 'vid-fb-primary',
    titleBn: 'সুন্দরবনের গহিন অরণ্য থেকে মৌচাক কাটা ও মধু সংগ্রহ লাইভ চিত্র',
    category: 'sourcing',
    platform: 'facebook',
    videoUrl: 'https://www.facebook.com/share/v/194qYMqpDL/',
    thumbnailUrl: '/images/pureghor/722119294_1968026900508945_6535640957699175289_n.jpeg',
    durationText: '৩:২৪ মিনিট',
    viewsText: '১২.৫K+ ভিউ',
    highlightBn: 'শতভাগ কাঁচা ও আনহিটেড মধু সরাসরি কাচের জারে বোতলজাতকরণ',
    isFeatured: true,
  },
  {
    id: 'vid-biswanath-opening',
    titleBn: 'PureGhor বিশ্বনাথ আউটলেট উদ্বোধনী উৎসব ও কাস্টমারদের ভালোবাসা',
    category: 'making',
    platform: 'facebook',
    videoUrl: 'https://www.facebook.com/share/v/194qYMqpDL/',
    thumbnailUrl: '/images/pureghor/701370545_844991221981629_1527727780744872160_n.jpg',
    durationText: '২:১৫ মিনিট',
    viewsText: '৮.২K+ ভিউ',
    highlightBn: 'সিলেটের বিখ্যাত ব্র্যান্ডের নতুন বিশ্বনাথ শাখার ঝলক',
  },
  {
    id: 'vid-honey-nut-making',
    titleBn: 'কীভাবে তৈরি হয় প্রিমিয়াম হানি নাট জার? বাদাম ও খাঁটি মধুর সিক্রেট',
    category: 'making',
    platform: 'facebook',
    videoUrl: 'https://www.facebook.com/share/v/194qYMqpDL/',
    thumbnailUrl: '/images/pureghor/731067967_1165096542480498_5504005484939299210_n.jpeg',
    durationText: '৪:১০ মিনিট',
    viewsText: '১৫.১K+ ভিউ',
    highlightBn: 'কাঠবাদাম, কাজুবাদাম, পেস্তা, আখরোট ও খাঁটি মধুর পুষ্টিকর প্রস্তুতি',
  },
  {
    id: 'vid-joint-care-kalijira',
    titleBn: 'জয়েন্টের যত্ন ও ব্যথানাশক খাঁটি কালোজিরা তেল ব্যবহারের সঠিক নিয়ম',
    category: 'health',
    platform: 'facebook',
    videoUrl: 'https://www.facebook.com/share/v/194qYMqpDL/',
    thumbnailUrl: '/images/pureghor/732103407_2085145489018609_7477184784061194606_n.jpeg',
    durationText: '১:৫৮ মিনিট',
    viewsText: '৯.৭K+ ভিউ',
    highlightBn: 'কোল্ড-প্রেসড কালোজিরা তেলের বিস্ময়কর স্বাস্থ্য উপকারিতা',
  },
];

export const VideoSection: React.FC<VideoSectionProps> = ({ onNavigate }) => {
  const [selectedVideo, setSelectedVideo] = useState<SocialVideoItem>(INITIAL_SOCIAL_VIDEOS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'sourcing' | 'making' | 'health'>('all');

  const fbVideoUrl = selectedVideo.videoUrl;
  const encodedFbUrl = encodeURIComponent(fbVideoUrl);
  const fbEmbedUrl = `https://www.facebook.com/plugins/video.php?href=${encodedFbUrl}&show_text=false&width=auto&autoplay=1`;

  const filteredVideos = activeTab === 'all' 
    ? INITIAL_SOCIAL_VIDEOS 
    : INITIAL_SOCIAL_VIDEOS.filter(v => v.category === activeTab);

  const handleSelectVideo = (video: SocialVideoItem) => {
    setSelectedVideo(video);
    setIsPlaying(true);
  };

  return (
    <section id="pureghor-video-section" className="py-14 md:py-20 bg-gradient-to-b from-[#003310] via-[#004F18] to-[#002B0D] text-white relative overflow-hidden">
      {/* Background ambient lighting and pattern */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#5EB809_1.5px,transparent_1.5px)] [background-size:24px_24px] pointer-events-none" />
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#5EB809]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#E89D10]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold text-[#5EB809] border border-white/20 shadow-inner">
            <Film className="w-4 h-4 text-[#5EB809]" />
            <span className="text-white">সোশ্যাল মিডিয়া ভিডিও ও রিলস হাব</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white font-['Hind_Siliguri'] leading-tight tracking-tight">
            চোখে দেখুন আমাদের প্রতিটি পণ্যের <span className="text-[#5EB809]">খাঁটি উৎস ও সোর্সিং</span>
          </h2>

          <p className="text-sm sm:text-base text-white/85 max-w-2xl mx-auto font-['Hind_Siliguri'] font-normal leading-relaxed">
            কোনো কৃত্রিমতা বা লুকোচুরি নয় — সরাসরি মৌচাক কাটা, কাঠের ঘানির তেল প্রস্তুত এবং শোরুমের লাইভ ভিডিও দেখুন।
          </p>

          {/* Video Filter Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            {[
              { id: 'all', label: 'সকল ভিডিও' },
              { id: 'sourcing', label: 'মাঠপর্যায়ের সোর্সিং' },
              { id: 'making', label: 'মেকিং ও শোরুম' },
              { id: 'health', label: 'স্বাস্থ্য টিপস' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-[#5EB809] text-white shadow-md'
                    : 'bg-white/10 text-white/80 hover:bg-white/20 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Video Player & Sourcing Story Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Video Frame (7/12 cols on desktop) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="relative rounded-3xl overflow-hidden bg-black/70 shadow-2xl border-2 border-white/15 backdrop-blur-md group">
              
              {/* Aspect Ratio Container (16:9 / responsive) */}
              <div className="relative aspect-video w-full flex items-center justify-center bg-stone-950">
                {isPlaying ? (
                  <iframe
                    src={fbEmbedUrl}
                    title="PureGhor Facebook Video Player"
                    className="w-full h-full border-0 absolute inset-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                ) : (
                  <div className="relative w-full h-full overflow-hidden">
                    {/* High-craft Video Poster */}
                    <img
                      src={selectedVideo.thumbnailUrl}
                      alt={selectedVideo.titleBn}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-85"
                    />
                    
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />

                    {/* Top Badges */}
                    <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                      <span className="bg-[#5EB809] text-white text-[11px] font-black px-3 py-1 rounded-full flex items-center gap-1.5 shadow-md">
                        <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                        লাইভ ফেসবুক ভিডিও
                      </span>
                      <span className="bg-black/60 backdrop-blur-md text-white/90 text-xs px-2.5 py-1 rounded-full border border-white/20 flex items-center gap-1">
                        <Facebook className="w-3.5 h-3.5 text-[#1877F2]" />
                        <span>PureGhor Official</span>
                      </span>
                    </div>

                    {/* Central Play Button */}
                    <button
                      onClick={() => setIsPlaying(true)}
                      id="play-pureghor-fb-video-btn"
                      className="absolute inset-0 m-auto w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#5EB809] hover:bg-[#4ea204] text-white flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer z-20 group/btn"
                      aria-label="ভিডিওটি চালান"
                    >
                      <Play className="w-8 h-8 sm:w-10 sm:h-10 fill-current translate-x-0.5" />
                    </button>

                    {/* Bottom Caption */}
                    <div className="absolute bottom-4 left-4 right-4 pointer-events-none">
                      <div className="flex items-center gap-2 text-xs text-[#5EB809] font-bold mb-1">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>{selectedVideo.viewsText} • {selectedVideo.durationText}</span>
                      </div>
                      <h3 className="text-base sm:text-lg font-black text-white font-['Hind_Siliguri'] line-clamp-1">
                        {selectedVideo.titleBn}
                      </h3>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Video Controls and Direct Facebook Link Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15">
              <div className="text-left w-full sm:w-auto">
                <p className="text-xs text-white/70 font-medium">বর্তমানে দেখছেন:</p>
                <h4 className="text-sm font-bold text-white font-['Hind_Siliguri'] line-clamp-1">
                  {selectedVideo.titleBn}
                </h4>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <a
                  href={selectedVideo.videoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-[#1877F2] hover:bg-[#1564cf] text-white text-xs sm:text-sm font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-md transition-all active:scale-95 cursor-pointer shrink-0"
                >
                  <Facebook className="w-4 h-4 fill-current" />
                  <span>ফেসবুকে দেখুন</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <a
                  href="https://wa.me/8801754991822?text=PureGhor%20ভিডিও%20দেখে%20যোগাযোগ%20করছি"
                  target="_blank"
                  rel="noreferrer"
                  className="bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs sm:text-sm font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 transition-colors shrink-0"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span className="hidden sm:inline">WhatsApp</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Playlist / Video Cards for Social Media Expansion */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-5 border border-white/15 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="font-bold text-base text-white font-['Hind_Siliguri'] flex items-center gap-2">
                  <Video className="w-4 h-4 text-[#5EB809]" />
                  <span>সোশ্যাল মিডিয়া ভিডিও তালিকা ({filteredVideos.length})</span>
                </h3>
                <span className="text-xs text-[#5EB809] font-semibold">সরাসরি দেখুন</span>
              </div>

              {/* Video List Items */}
              <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                {filteredVideos.map((vid) => {
                  const isCurrent = selectedVideo.id === vid.id;
                  return (
                    <div
                      key={vid.id}
                      onClick={() => handleSelectVideo(vid)}
                      className={`p-3 rounded-2xl transition-all cursor-pointer flex gap-3 items-center border ${
                        isCurrent
                          ? 'bg-[#5EB809]/20 border-[#5EB809] shadow-md'
                          : 'bg-white/5 border-white/10 hover:bg-white/10'
                      }`}
                    >
                      {/* Video Thumbnail */}
                      <div className="relative w-20 h-16 rounded-xl overflow-hidden bg-black shrink-0 border border-white/20">
                        <img src={vid.thumbnailUrl} alt={vid.titleBn} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <Play className={`w-5 h-5 ${isCurrent ? 'text-[#5EB809] fill-[#5EB809]' : 'text-white fill-white'}`} />
                        </div>
                        <span className="absolute bottom-1 right-1 bg-black/70 text-[9px] px-1 rounded text-white font-mono">
                          {vid.durationText}
                        </span>
                      </div>

                      {/* Video Info */}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs sm:text-sm font-bold text-white font-['Hind_Siliguri'] line-clamp-2 leading-snug">
                          {vid.titleBn}
                        </h4>
                        <div className="flex items-center gap-2 mt-1 text-[11px] text-white/70">
                          <span className="text-[#5EB809] font-medium">{vid.viewsText}</span>
                          <span>•</span>
                          <span className="flex items-center gap-0.5">
                            <Facebook className="w-3 h-3 text-[#1877F2]" /> Facebook
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Social Channels Follow Box */}
              <div className="pt-3 border-t border-white/10">
                <p className="text-xs text-white/80 font-medium mb-2.5">আমাদের সাথে যুক্ত থাকুন:</p>
                <div className="grid grid-cols-2 gap-2">
                  <a
                    href="https://facebook.com/pureghor"
                    target="_blank"
                    rel="noreferrer"
                    className="bg-[#1877F2]/20 hover:bg-[#1877F2]/40 border border-[#1877F2]/40 text-white text-xs py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 font-bold transition-colors"
                  >
                    <Facebook className="w-3.5 h-3.5 text-[#1877F2] fill-current" />
                    <span>Facebook পেজ</span>
                  </a>
                  <a
                    href="https://youtube.com/pureghor"
                    target="_blank"
                    rel="noreferrer"
                    className="bg-[#FF0000]/20 hover:bg-[#FF0000]/40 border border-[#FF0000]/40 text-white text-xs py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 font-bold transition-colors"
                  >
                    <Youtube className="w-3.5 h-3.5 text-[#FF0000]" />
                    <span>YouTube চ্যানেল</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
