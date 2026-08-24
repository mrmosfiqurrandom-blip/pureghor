import React from 'react';
import { Leaf, Image as ImageIcon } from 'lucide-react';
import { PureGhorLogo } from './PureGhorLogo';

interface PlaceholderProps {
  type?: 'logo' | 'banner' | 'product' | 'category';
  text?: string;
  className?: string;
  aspectRatio?: 'square' | 'video' | 'banner' | 'auto';
  isDark?: boolean;
}

export const PlaceholderImage: React.FC<PlaceholderProps> = ({
  type = 'product',
  text,
  className = '',
  aspectRatio = 'square',
  isDark = false,
}) => {
  const aspectClass =
    aspectRatio === 'square'
      ? 'aspect-square'
      : aspectRatio === 'video'
      ? 'aspect-video'
      : aspectRatio === 'banner'
      ? 'aspect-[21/9]'
      : '';

  if (type === 'logo') {
    return <PureGhorLogo className={className} isDark={isDark} height={40} showSubtitle={false} />;
  }

  if (type === 'banner') {
    return (
      <div
        className={`relative overflow-hidden bg-gradient-to-r from-[#004F18] via-[#0D6224] to-[#004F18] flex items-center justify-center p-8 text-center text-white ${aspectClass} ${className}`}
      >
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#FFFFFF_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="relative z-10 max-w-xl flex flex-col items-center">
          <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center mb-3 text-white">
            <Leaf className="w-7 h-7 text-[#5EB809]" />
          </div>
          <h3 className="text-2xl md:text-4xl font-bold font-['Hind_Siliguri'] text-white mb-2 leading-tight">
            {text || '১০০% খাঁটি ও প্রাকৃতিক খাদ্যপণ্য'}
          </h3>
          <p className="text-sm md:text-base text-white/90 font-medium">
            নির্বাচিত উৎস থেকে সংগৃহীত নিরাপদ ও প্রিমিয়াম খাবার আপনার দোরগোড়ায়
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden bg-[#F5FBF2] flex flex-col items-center justify-center p-4 text-[#102B16]/70 border border-[#DCECD5] ${aspectClass} ${className}`}
    >
      <div className="w-12 h-12 rounded-full bg-[#5EB809]/15 flex items-center justify-center mb-2 text-[#004F18]">
        <ImageIcon className="w-6 h-6" />
      </div>
      <span className="text-xs font-medium text-center line-clamp-1 font-['Hind_Siliguri']">
        {text || 'খাঁটি অর্গানিক পণ্য'}
      </span>
    </div>
  );
};
