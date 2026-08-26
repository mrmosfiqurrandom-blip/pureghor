import React, { useState } from 'react';
import {
  Search,
  ShoppingBag,
  User,
  Menu,
  X,
  Phone,
  ShieldCheck,
  ChevronDown,
  LayoutDashboard,
  Heart,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useCart } from '../../context/CartContext';
import { PlaceholderImage } from './PlaceholderImage';
import { PureGhorLogo } from './PureGhorLogo';

interface NavbarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPath, onNavigate }) => {
  const { settings, categories, products, adminUser } = useStore();
  const { itemCount, subtotal, setIsCartDrawerOpen } = useCart();

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);

  // Search filtered products
  const searchResults = searchQuery.trim()
    ? products
        .filter(
          (p) =>
            p.nameBn.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.sku.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(0, 5)
    : [];

  const handleSearchSelect = (slug: string) => {
    setSearchQuery('');
    setIsSearchOpen(false);
    onNavigate(`/product/${slug}`);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#F5FBF2]/95 backdrop-blur-md border-b border-[#DCECD5]">
      {/* Top Announcement Bar */}
      {settings.announcementBar?.enabled && (
        <div className="bg-[#004F18] text-white text-xs md:text-sm py-1.5 px-4 text-center font-medium flex items-center justify-center gap-3">
          <span>{settings.announcementBar.textBn}</span>
          <button
            onClick={() => onNavigate('/shop')}
            className="underline hover:text-[#5EB809] transition-colors cursor-pointer hidden sm:inline font-bold"
          >
            অর্ডার করুন &rarr;
          </button>
        </div>
      )}

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 md:h-20 gap-4">
          
          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl text-[#004F18] hover:bg-[#5EB809]/10 transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Logo */}
          <div
            onClick={() => onNavigate('/')}
            className="flex items-center cursor-pointer select-none py-1 group"
          >
            {settings.logoUrl && settings.logoUrl !== '/logo.svg' && !settings.logoUrl.includes('1GdN6VsN-EgeAHZ-7MVPfsjsJ9wx7ukjM') ? (
              <img
                src={settings.logoUrl}
                alt={settings.storeNameBn}
                referrerPolicy="no-referrer"
                className="h-10 md:h-12 w-auto object-contain max-w-[180px] transition-transform group-hover:scale-[1.02]"
                onError={(e) => {
                  (e.currentTarget as HTMLElement).style.display = 'none';
                }}
              />
            ) : (
              <PureGhorLogo height={44} showSubtitle={true} className="transition-transform group-hover:scale-[1.02]" />
            )}
          </div>

          {/* Desktop Search Bar */}
          <div className="hidden lg:flex flex-1 max-w-lg mx-6 relative">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="খাঁটি মধু, সরিষার তেল, খেজুরের গুড় বা চিয়া সিড খুঁজুন..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchOpen(true);
                }}
                onFocus={() => setIsSearchOpen(true)}
                className="w-full bg-white border border-[#DCECD5] focus:border-[#004F18] focus:ring-2 focus:ring-[#5EB809]/25 rounded-full py-2.5 pl-11 pr-4 text-sm text-[#102B16] placeholder:text-[#102B16]/40 transition-all outline-none shadow-xs"
              />
              <Search className="w-5 h-5 text-[#004F18] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Live Search Dropdown */}
            {isSearchOpen && searchQuery.trim() && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-[#DCECD5] overflow-hidden z-50 divide-y divide-[#DCECD5]/60">
                {searchResults.length > 0 ? (
                  searchResults.map((prod) => (
                    <div
                      key={prod.id}
                      onClick={() => handleSearchSelect(prod.slug)}
                      className="p-3 hover:bg-[#F5FBF2] cursor-pointer flex items-center gap-3 transition-colors"
                    >
                      <img
                        src={prod.images[0]?.url || ''}
                        alt={prod.nameBn}
                        className="w-12 h-12 rounded-lg object-cover border border-[#DCECD5]"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-[#004F18] truncate">
                          {prod.nameBn}
                        </h4>
                        <span className="text-xs text-[#5EB809] font-bold">
                          ৳{prod.salePrice || prod.price}
                        </span>
                        {prod.salePrice && (
                          <span className="text-xs text-gray-400 line-through ml-2">
                            ৳{prod.price}
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-sm text-gray-500">
                    "{searchQuery}" দিয়ে কোনো পণ্য পাওয়া যায়নি।
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Action Icons: Phone, Admin, Cart */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Phone hotline */}
            <a
              href={`tel:${settings.phone}`}
              className="hidden sm:flex items-center gap-2 text-xs font-semibold text-[#004F18] bg-white px-3 py-2 rounded-full border border-[#DCECD5] hover:border-[#5EB809] hover:bg-[#F5FBF2] transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-[#5EB809]" />
              <span>{settings.phone}</span>
            </a>

            {/* Admin Dashboard shortcut if logged in */}
            {adminUser ? (
              <button
                onClick={() => onNavigate('/admin')}
                className="flex items-center gap-1.5 text-xs font-semibold bg-[#004F18] text-white px-3 py-2 rounded-full hover:bg-[#063B14] transition-colors cursor-pointer"
                title="এডমিন প্যানেল"
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-[#5EB809]" />
                <span className="hidden sm:inline">এডমিন</span>
              </button>
            ) : (
              <button
                onClick={() => onNavigate('/admin/login')}
                className="p-2 text-[#004F18] hover:bg-white rounded-full transition-colors cursor-pointer text-xs font-medium flex items-center gap-1 border border-transparent hover:border-[#DCECD5]"
                title="এডমিন লগইন"
              >
                <User className="w-5 h-5 text-[#004F18]" />
              </button>
            )}

            {/* Cart Button */}
            <button
              onClick={() => setIsCartDrawerOpen(true)}
              className="flex items-center gap-2 bg-[#004F18] hover:bg-[#063B14] text-white px-3.5 py-2 md:px-4 md:py-2.5 rounded-full transition-all duration-200 cursor-pointer shadow-sm active:scale-95 group"
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5 group-hover:scale-105 transition-transform" />
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#5EB809] text-white text-[10px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center border-2 border-[#004F18]">
                    {itemCount}
                  </span>
                )}
              </div>
              <span className="font-bold text-sm hidden sm:inline">
                ৳{subtotal.toLocaleString()}
              </span>
            </button>
          </div>
        </div>

        {/* Secondary Category Navigation (Desktop) */}
        <nav className="hidden lg:flex items-center justify-between border-t border-[#DCECD5] py-2.5 text-sm font-semibold text-[#102B16]">
          <div className="flex items-center gap-6">
            <button
              onClick={() => onNavigate('/')}
              className={`hover:text-[#5EB809] transition-colors cursor-pointer ${
                currentPath === '/' ? 'text-[#004F18] font-bold border-b-2 border-[#5EB809] pb-0.5' : ''
              }`}
            >
              হোম
            </button>

            <button
              onClick={() => onNavigate('/shop')}
              className={`hover:text-[#5EB809] transition-colors cursor-pointer ${
                currentPath === '/shop' ? 'text-[#004F18] font-bold border-b-2 border-[#5EB809] pb-0.5' : ''
              }`}
            >
              সকল পণ্য
            </button>

            {categories.slice(0, 5).map((cat) => (
              <button
                key={cat.id}
                onClick={() => onNavigate(`/category/${cat.slug}`)}
                className={`hover:text-[#5EB809] transition-colors cursor-pointer ${
                  currentPath === `/category/${cat.slug}` ? 'text-[#004F18] font-bold border-b-2 border-[#5EB809] pb-0.5' : ''
                }`}
              >
                {cat.nameBn}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4 text-xs text-[#102B16]/80">
            <button
              onClick={() => onNavigate('/track-order')}
              className="hover:text-[#004F18] transition-colors cursor-pointer font-medium"
            >
              📦 অর্ডার ট্র্যাকিং
            </button>
            <button
              onClick={() => onNavigate('/quality-promise')}
              className="hover:text-[#004F18] transition-colors cursor-pointer font-medium"
            >
              ✨ কোয়ালিটি প্রমিজ
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Drawer Navigation */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex">
          <div className="w-4/5 max-w-sm bg-[#F5FBF2] h-full shadow-2xl p-6 overflow-y-auto flex flex-col justify-between">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-[#DCECD5]">
                <PureGhorLogo height={36} showSubtitle={false} />
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1.5 rounded-lg text-gray-500 hover:bg-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Search */}
              <div className="mt-4 relative">
                <input
                  type="text"
                  placeholder="পণ্য খুঁজুন..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white border border-[#DCECD5] focus:border-[#004F18] rounded-xl py-2 pl-9 pr-3 text-sm outline-none"
                />
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>

              {/* Navigation Links */}
              <div className="mt-6 flex flex-col gap-1 text-sm font-semibold text-[#004F18]">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onNavigate('/');
                  }}
                  className="text-left py-2.5 px-3 rounded-lg hover:bg-white transition-colors"
                >
                  🏠 হোম
                </button>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onNavigate('/shop');
                  }}
                  className="text-left py-2.5 px-3 rounded-lg hover:bg-white transition-colors"
                >
                  🛍️ সকল পণ্য
                </button>

                <div className="py-2 px-3 text-xs font-bold uppercase text-gray-400">
                  ক্যাটাগরি সমূহ
                </div>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      onNavigate(`/category/${cat.slug}`);
                    }}
                    className="text-left py-2 px-4 rounded-lg hover:bg-white text-sm transition-colors text-[#102B16]"
                  >
                    • {cat.nameBn}
                  </button>
                ))}

                <div className="my-2 border-t border-[#DCECD5]" />
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onNavigate('/track-order');
                  }}
                  className="text-left py-2 px-3 rounded-lg hover:bg-white"
                >
                  📦 অর্ডার ট্র্যাক করুন
                </button>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onNavigate('/about');
                  }}
                  className="text-left py-2 px-3 rounded-lg hover:bg-white"
                >
                  🌿 আমাদের সম্পর্কে
                </button>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onNavigate('/quality-promise');
                  }}
                  className="text-left py-2 px-3 rounded-lg hover:bg-white"
                >
                  ⭐ কোয়ালিটি প্রমিজ
                </button>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onNavigate('/contact');
                  }}
                  className="text-left py-2 px-3 rounded-lg hover:bg-white"
                >
                  📞 যোগাযোগ করুন
                </button>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-6 border-t border-[#DCECD5]">
              <a
                href={`tel:${settings.phone}`}
                className="w-full flex items-center justify-center gap-2 bg-[#004F18] text-white py-3 rounded-xl font-bold text-sm mb-2"
              >
                <Phone className="w-4 h-4 text-[#5EB809]" />
                <span>কল করুন: {settings.phone}</span>
              </a>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onNavigate('/admin/login');
                }}
                className="w-full text-center py-2 text-xs font-semibold text-gray-500 hover:text-[#004F18]"
              >
                এডমিন লগইন প্যানেল
              </button>
            </div>
          </div>
          <div className="flex-1" onClick={() => setIsMobileMenuOpen(false)} />
        </div>
      )}
    </header>
  );
};
