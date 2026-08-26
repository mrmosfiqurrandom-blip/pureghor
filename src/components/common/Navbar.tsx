import React, { useState } from 'react';
import {
  Search,
  ShoppingBag,
  User,
  Menu,
  X,
  Phone,
  LayoutDashboard,
  Sparkles,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useCart } from '../../context/CartContext';
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

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchOpen(false);
      onNavigate('/shop');
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-[#DCECD5] shadow-xs">
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

      {/* Main Navbar: Brand, Navigation Links, Search, and Cart */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18 md:h-20 gap-3 sm:gap-6">
          
          {/* Mobile Hamburger Button */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl text-[#004F18] hover:bg-[#5EB809]/10 transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* PureGhor Logo */}
          <div
            onClick={() => onNavigate('/')}
            className="flex items-center cursor-pointer select-none py-1 group shrink-0"
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
              <PureGhorLogo height={42} showSubtitle={true} className="transition-transform group-hover:scale-[1.02]" />
            )}
          </div>

          {/* Primary Top Nav Items (Desktop) */}
          <nav className="hidden xl:flex items-center gap-5 text-sm font-bold text-[#102B16]">
            <button
              onClick={() => onNavigate('/')}
              className={`hover:text-[#5EB809] transition-colors cursor-pointer ${
                currentPath === '/' ? 'text-[#004F18] border-b-2 border-[#5EB809] pb-0.5' : ''
              }`}
            >
              হোম (Home)
            </button>

            <button
              onClick={() => onNavigate('/shop')}
              className={`hover:text-[#5EB809] transition-colors cursor-pointer ${
                currentPath === '/shop' ? 'text-[#004F18] border-b-2 border-[#5EB809] pb-0.5' : ''
              }`}
            >
              সকল পণ্য (Shop)
            </button>

            <button
              onClick={() => onNavigate('/about')}
              className={`hover:text-[#5EB809] transition-colors cursor-pointer ${
                currentPath === '/about' ? 'text-[#004F18] border-b-2 border-[#5EB809] pb-0.5' : ''
              }`}
            >
              আমাদের কথা (About)
            </button>

            <button
              onClick={() => onNavigate('/quality-promise')}
              className={`hover:text-[#5EB809] transition-colors cursor-pointer ${
                currentPath === '/quality-promise' ? 'text-[#004F18] border-b-2 border-[#5EB809] pb-0.5' : ''
              }`}
            >
              কোয়ালিটি প্রমিজ
            </button>

            {/* Special Offers Badge Button */}
            <button
              onClick={() => onNavigate('/shop')}
              className="inline-flex items-center gap-1 text-[#004F18] hover:text-[#5EB809] transition-colors cursor-pointer"
            >
              <span>অফার</span>
              <span className="bg-[#E89D10] text-[#102B16] text-[10px] font-black px-1.5 py-0.2 rounded-md uppercase">
                NEW
              </span>
            </button>
          </nav>

          {/* Desktop Search Input with Pill Design & Right Search Icon */}
          <div className="hidden md:flex flex-1 max-w-md lg:max-w-lg relative">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <input
                type="text"
                placeholder="খাঁটি মধু, ঘি, খেজুর, সরিষার তেল, ওটস খুঁজুন..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchOpen(true);
                }}
                onFocus={() => setIsSearchOpen(true)}
                className="w-full bg-[#F5FBF2] hover:bg-white focus:bg-white border border-[#DCECD5] focus:border-[#004F18] focus:ring-2 focus:ring-[#5EB809]/25 rounded-full py-2.5 pl-4 pr-11 text-sm text-[#102B16] placeholder:text-[#102B16]/50 transition-all outline-none"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#004F18] hover:bg-[#5EB809] text-white flex items-center justify-center transition-colors cursor-pointer shadow-xs"
                aria-label="Search"
              >
                <Search className="w-4 h-4" />
              </button>
            </form>

            {/* Live Search Suggestions Dropdown */}
            {isSearchOpen && searchQuery.trim() && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-[#DCECD5] overflow-hidden z-50 divide-y divide-[#DCECD5]/60">
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

          {/* Right Action Icons: Cart & User/Admin */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Phone hotline */}
            <a
              href={`tel:${settings.phone}`}
              className="hidden 2xl:flex items-center gap-1.5 text-xs font-bold text-[#004F18] bg-[#F5FBF2] px-3 py-2 rounded-full border border-[#DCECD5] hover:border-[#5EB809] transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-[#5EB809]" />
              <span>{settings.phone}</span>
            </a>

            {/* Cart Button */}
            <button
              onClick={() => setIsCartDrawerOpen(true)}
              className="flex items-center gap-2 bg-[#004F18] hover:bg-[#063B14] text-white px-3.5 py-2 md:px-4 md:py-2.5 rounded-full transition-all duration-200 cursor-pointer shadow-sm active:scale-95 group"
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5 group-hover:scale-105 transition-transform text-[#5EB809]" />
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2.5 bg-[#E89D10] text-[#102B16] text-[10px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center border-2 border-[#004F18]">
                    {itemCount}
                  </span>
                )}
              </div>
              <span className="font-bold text-xs sm:text-sm">
                Cart
              </span>
              <span className="font-bold text-xs bg-[#5EB809] text-white px-2 py-0.5 rounded-full hidden sm:inline">
                ৳{subtotal.toLocaleString()}
              </span>
            </button>

            {/* Admin / Sign In Button */}
            {adminUser ? (
              <button
                onClick={() => onNavigate('/admin')}
                className="flex items-center gap-1.5 text-xs font-semibold bg-[#5EB809] hover:bg-[#4ea204] text-white px-3 py-2 rounded-full transition-colors cursor-pointer"
                title="এডমিন প্যানেল"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">এডমিন</span>
              </button>
            ) : (
              <button
                onClick={() => onNavigate('/admin/login')}
                className="p-2 text-[#004F18] hover:bg-[#F5FBF2] rounded-full transition-colors cursor-pointer text-xs font-medium flex items-center gap-1 border border-[#DCECD5]"
                title="এডমিন লগইন / সাইন ইন"
              >
                <User className="w-5 h-5 text-[#004F18]" />
                <span className="hidden sm:inline text-xs font-bold text-[#004F18]">Sign In</span>
              </button>
            )}
          </div>
        </div>

        {/* Sub-Header Horizontal Category Bar (Matching Screenshot) */}
        <nav className="hidden lg:flex items-center justify-center gap-6 xl:gap-8 border-t border-[#DCECD5] py-2.5 text-xs xl:text-sm font-bold text-[#102B16] overflow-x-auto whitespace-nowrap scrollbar-none">
          <button
            onClick={() => onNavigate('/category/honey-nuts')}
            className={`hover:text-[#5EB809] transition-colors cursor-pointer ${
              currentPath === '/category/honey-nuts' ? 'text-[#004F18] font-black border-b-2 border-[#5EB809] pb-0.5' : ''
            }`}
          >
            Honey (মধু)
          </button>

          <button
            onClick={() => onNavigate('/category/oats-and-superfood')}
            className={`hover:text-[#5EB809] transition-colors cursor-pointer ${
              currentPath === '/category/oats-and-superfood' ? 'text-[#004F18] font-black border-b-2 border-[#5EB809] pb-0.5' : ''
            }`}
          >
            Dry Food & Oats
          </button>

          <button
            onClick={() => onNavigate('/category/nuts-and-seeds')}
            className={`hover:text-[#5EB809] transition-colors cursor-pointer ${
              currentPath === '/category/nuts-and-seeds' ? 'text-[#004F18] font-black border-b-2 border-[#5EB809] pb-0.5' : ''
            }`}
          >
            Nuts & Seeds (বাদাম ও বীজ)
          </button>

          <button
            onClick={() => onNavigate('/category/ghee-and-oils')}
            className={`hover:text-[#5EB809] transition-colors cursor-pointer ${
              currentPath === '/category/ghee-and-oils' ? 'text-[#004F18] font-black border-b-2 border-[#5EB809] pb-0.5' : ''
            }`}
          >
            Pure Ghee & Oil (গাওয়া ঘি ও তেল)
          </button>

          <button
            onClick={() => onNavigate('/category/khejurer-gur')}
            className={`hover:text-[#5EB809] transition-colors cursor-pointer ${
              currentPath === '/category/khejurer-gur' ? 'text-[#004F18] font-black border-b-2 border-[#5EB809] pb-0.5' : ''
            }`}
          >
            Dates & Gur (খেজুর ও গুড়)
          </button>

          <button
            onClick={() => onNavigate('/category/spices-and-balachao')}
            className={`hover:text-[#5EB809] transition-colors cursor-pointer ${
              currentPath === '/category/spices-and-balachao' ? 'text-[#004F18] font-black border-b-2 border-[#5EB809] pb-0.5' : ''
            }`}
          >
            Pickle & Balachao (বালাচাও ও মসলা)
          </button>

          <button
            onClick={() => onNavigate('/shop')}
            className="hover:text-[#5EB809] transition-colors cursor-pointer text-[#004F18]"
          >
            Tea & Combos (চা ও কম্বো)
          </button>
        </nav>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex">
          <div className="w-4/5 max-w-sm bg-[#F5FBF2] h-full shadow-2xl p-6 overflow-y-auto flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#DCECD5]">
                <PureGhorLogo height={36} showSubtitle={false} />
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1.5 rounded-lg text-gray-500 hover:bg-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Search Input */}
              <div className="mt-4 relative">
                <input
                  type="text"
                  placeholder="পণ্য খুঁজুন..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white border border-[#DCECD5] focus:border-[#004F18] rounded-xl py-2 pl-4 pr-9 text-sm outline-none"
                />
                <Search className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
              </div>

              {/* Mobile Links */}
              <div className="mt-6 flex flex-col gap-1 text-sm font-bold text-[#004F18]">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onNavigate('/');
                  }}
                  className="text-left py-2.5 px-3 rounded-lg hover:bg-white transition-colors"
                >
                  🏠 হোম (Home)
                </button>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onNavigate('/shop');
                  }}
                  className="text-left py-2.5 px-3 rounded-lg hover:bg-white transition-colors"
                >
                  🛍️ সকল পণ্য (Shop)
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
              </div>
            </div>

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
