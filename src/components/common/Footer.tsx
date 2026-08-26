import React from 'react';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Facebook,
  Instagram,
  Youtube,
  ShieldCheck,
  Truck,
  RotateCcw,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { PlaceholderImage } from './PlaceholderImage';
import { PureGhorLogo } from './PureGhorLogo';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { settings, categories } = useStore();

  return (
    <footer className="bg-[#004F18] text-[#F5FBF2] pt-14 pb-8 border-t border-[#0D6224]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-white/15">
          
          {/* Brand & About */}
          <div className="space-y-4">
            {settings.logoUrl && settings.logoUrl !== '/logo.svg' && !settings.logoUrl.includes('1GdN6VsN-EgeAHZ-7MVPfsjsJ9wx7ukjM') ? (
              <img
                src={settings.logoUrl}
                alt={settings.storeNameBn}
                referrerPolicy="no-referrer"
                className="h-10 md:h-12 w-auto object-contain brightness-110"
              />
            ) : (
              <PureGhorLogo height={44} isDark={true} showSubtitle={true} />
            )}
            <p className="text-sm text-white/80 leading-relaxed font-['Hind_Siliguri']">
              {settings.taglineBn || 'সিলেটের বিখ্যাত ব্র্যান্ড — ১০০% খাঁটি ও প্রাকৃতিক খাদ্যের বিশ্বস্ত ঠিকানা।'}
            </p>
            <div className="flex items-center gap-3 pt-2">
              {settings.socialLinks?.facebook && (
                <a
                  href={settings.socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#5EB809] hover:text-[#004F18] text-white flex items-center justify-center transition-all"
                  aria-label="Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </a>
              )}
              {settings.socialLinks?.instagram && (
                <a
                  href={settings.socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#5EB809] hover:text-[#004F18] text-white flex items-center justify-center transition-all"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {settings.socialLinks?.youtube && (
                <a
                  href={settings.socialLinks.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#5EB809] hover:text-[#004F18] text-white flex items-center justify-center transition-all"
                  aria-label="YouTube"
                >
                  <Youtube className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Quick Categories */}
          <div>
            <h4 className="font-bold text-base text-[#5EB809] mb-4 uppercase tracking-wider font-['Hind_Siliguri']">
              পণ্য ক্যাটাগরি
            </h4>
            <ul className="space-y-2.5 text-sm text-white/80 font-medium">
              {categories.slice(0, 6).map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => onNavigate(`/category/${cat.slug}`)}
                    className="hover:text-[#5EB809] hover:translate-x-1 transition-all cursor-pointer text-left"
                  >
                    {cat.nameBn}
                  </button>
                </li>
              ))}
              <li>
                <button
                  onClick={() => onNavigate('/shop')}
                  className="text-[#5EB809] font-bold hover:underline cursor-pointer"
                >
                  সবগুলো পণ্য দেখুন &rarr;
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Service & Policies */}
          <div>
            <h4 className="font-bold text-base text-[#5EB809] mb-4 uppercase tracking-wider font-['Hind_Siliguri']">
              গ্রাহক সেবা ও নীতি
            </h4>
            <ul className="space-y-2.5 text-sm text-white/80 font-medium">
              <li>
                <button
                  onClick={() => onNavigate('/track-order')}
                  className="hover:text-[#5EB809] transition-colors cursor-pointer"
                >
                  অর্ডার ট্র্যাকিং
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/about')}
                  className="hover:text-[#5EB809] transition-colors cursor-pointer"
                >
                  আমাদের সম্পর্কে
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/quality-promise')}
                  className="hover:text-[#5EB809] transition-colors cursor-pointer"
                >
                  কোয়ালিটি প্রমিজ ও সোর্সিং
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/delivery-and-returns')}
                  className="hover:text-[#5EB809] transition-colors cursor-pointer"
                >
                  ডেলিভারি ও রিটার্ন পলিসি
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/privacy-policy')}
                  className="hover:text-[#5EB809] transition-colors cursor-pointer"
                >
                  গোপনীয়তা নীতি (Privacy Policy)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/contact')}
                  className="hover:text-[#5EB809] transition-colors cursor-pointer"
                >
                  যোগাযোগ ও সাপোর্ট
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3.5 text-sm text-white/80 font-medium">
            <h4 className="font-bold text-base text-[#5EB809] mb-4 uppercase tracking-wider font-['Hind_Siliguri']">
              অফিস ও যোগাযোগ
            </h4>
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-[#5EB809] shrink-0 mt-0.5" />
              <span>{settings.addressBn}</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-[#5EB809] shrink-0" />
              <a href={`tel:${settings.phone}`} className="hover:text-[#5EB809]">
                {settings.phone}
              </a>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-[#5EB809] shrink-0" />
              <a href={`mailto:${settings.email}`} className="hover:text-[#5EB809]">
                {settings.email}
              </a>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="w-4 h-4 text-[#5EB809] shrink-0" />
              <span>{settings.businessHours}</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Badges */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/70">
          <p>
            &copy; {new Date().getFullYear()} {settings.storeNameBn} — সর্বস্বত্ব সংরক্ষিত।
          </p>
          <div className="flex items-center gap-4">
            <span className="bg-white/10 px-2.5 py-1 rounded text-white font-semibold">
              💵 ক্যাশ অন ডেলিভারি
            </span>
            <span className="bg-white/10 px-2.5 py-1 rounded text-white font-semibold">
              📱 bKash / Nagad
            </span>
            <span className="bg-[#5EB809]/20 text-[#5EB809] border border-[#5EB809]/30 px-2.5 py-1 rounded font-bold">
              🌿 ১০০% খাঁটি
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
