import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  ShoppingBag,
  User,
  Menu,
  X,
  Phone,
  LayoutDashboard,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useCart } from '../../context/CartContext';
import { PureGhorLogo } from './PureGhorLogo';
import { resolveImageUrl } from '../../utils/imageUrl';

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
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const categoryDropdownRef = useRef<HTMLDivElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        categoryDropdownRef.current &&
        !categoryDropdownRef.current.contains(e.target as Node)
      ) {
        setIsCategoryDropdownOpen(false);
      }
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target as Node)
      ) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filtered live search items
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
          <span className="font-['Hind_Siliguri']">{settings.announcementBar.textBn}</span>
          <button
            onClick={() => onNavigate('/shop')}
            className="underline hover:text-[#5EB809] transition-colors cursor-pointer hidden sm:inline font-bold font-['Hind_Siliguri']"
          >
            অর্ডার করুন &rarr;
          </button>
        </div>
      )}

      {/* Main Clean Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          
          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl text-[#004F18] hover:bg-[#F5FBF2] transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* PureGhor Brand Logo */}
          <div
            onClick={() => onNavigate('/')}
            className="flex items-center cursor-pointer select-none py-1 group shrink-0"
          >
            {settings.logoUrl &&
            settings.logoUrl !== '/logo.svg' &&
            !settings.logoUrl.includes('1GdN6VsN-EgeAHZ-7MVPfsjsJ9wx7ukjM') ? (
              <img
                src={settings.logoUrl}
                alt={settings.storeNameBn}
                referrerPolicy="no-referrer"
                className="h-10 sm:h-12 w-auto object-contain max-w-[170px] transition-transform group-hover:scale-[1.02]"
                onError={(e) => {
                  (e.currentTarget as HTMLElement).style.display = 'none';
                }}
              />
            ) : (
              <PureGhorLogo height={42} showSubtitle={true} className="transition-transform group-hover:scale-[1.02]" />
            )}
          </div>

          {/* Clean Primary Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-sm font-bold text-[#102B16] font-['Hind_Siliguri']">
            <button
              onClick={() => onNavigate('/')}
              className={`hover:text-[#004F18] transition-colors cursor-pointer py-1 ${
                currentPath === '/' ? 'text-[#004F18] border-b-2 border-[#5EB809] font-black' : 'text-[#2D3748]'
              }`}
            >
              হোম
            </button>

            <button
              onClick={() => onNavigate('/shop')}
              className={`hover:text-[#004F18] transition-colors cursor-pointer py-1 ${
                currentPath === '/shop' ? 'text-[#004F18] border-b-2 border-[#5EB809] font-black' : 'text-[#2D3748]'
              }`}
            >
              সকল পণ্য (Shop)
            </button>

            {/* Clean Categories Dropdown */}
            <div className="relative" ref={categoryDropdownRef}>
              <button
                onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                className={`hover:text-[#004F18] transition-colors cursor-pointer py-1 flex items-center gap-1 ${
                  currentPath.startsWith('/category/')
                    ? 'text-[#004F18] border-b-2 border-[#5EB809] font-black'
                    : 'text-[#2D3748]'
                }`}
              >
                <span>ক্যাটাগরি সমূহ</span>
                <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isCategoryDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {isCategoryDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-[#DCECD5] py-2 z-50 divide-y divide-[#DCECD5]/40 animate-in fade-in slide-in-from-top-2 duration-150">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setIsCategoryDropdownOpen(false);
                        onNavigate(`/category/${cat.slug}`);
                      }}
                      className="w-full text-left px-4 py-2.5 hover:bg-[#F5FBF2] text-[#004F18] hover:text-[#5EB809] text-xs font-bold transition-colors flex items-center justify-between"
                    >
                      <span>{cat.nameBn}</span>
                      <span className="text-[10px] text-gray-400 font-mono uppercase">{cat.nameEn}</span>
                    </button>
                  ))}
                  <button
                    onClick={() => {
                      setIsCategoryDropdownOpen(false);
                      onNavigate('/shop');
                    }}
                    className="w-full text-center px-4 py-2 text-[#004F18] hover:bg-[#F5FBF2] text-xs font-bold block"
                  >
                    সব ক্যাটাগরি দেখুন &rarr;
                  </button>
                </div>
              )}
            </div>

            {/* Special Offers Link with Badge */}
            <button
              onClick={() => onNavigate('/shop')}
              className="inline-flex items-center gap-1.5 text-[#2D3748] hover:text-[#004F18] transition-colors cursor-pointer py-1"
            >
              <span>স্পেশাল অফার</span>
              <span className="bg-[#E89D10] text-white text-[10px] font-black px-1.5 py-0.5 rounded-full uppercase leading-none">
                HOT
              </span>
            </button>

            <button
              onClick={() => onNavigate('/about')}
              className={`hover:text-[#004F18] transition-colors cursor-pointer py-1 ${
                currentPath === '/about' ? 'text-[#004F18] border-b-2 border-[#5EB809] font-black' : 'text-[#2D3748]'
              }`}
            >
              আমাদের কথা
            </button>

            <button
              onClick={() => onNavigate('/quality-promise')}
              className={`hover:text-[#004F18] transition-colors cursor-pointer py-1 ${
                currentPath === '/quality-promise' ? 'text-[#004F18] border-b-2 border-[#5EB809] font-black' : 'text-[#2D3748]'
              }`}
            >
              কোয়ালিটি প্রমিজ
            </button>
          </nav>

          {/* Right Action Area: Clean Search Input & Cart & Admin */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            
            {/* Clean Desktop Search Pill */}
            <div className="hidden md:block relative w-48 lg:w-60" ref={searchContainerRef}>
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  type="text"
                  placeholder="পণ্য খুঁজুন..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setIsSearchOpen(true);
                  }}
                  onFocus={() => setIsSearchOpen(true)}
                  className="w-full bg-[#F5FBF2] hover:bg-white focus:bg-white border border-[#DCECD5] focus:border-[#004F18] focus:ring-2 focus:ring-[#5EB809]/20 rounded-full py-2 pl-3.5 pr-9 text-xs text-[#102B16] placeholder:text-gray-400 transition-all outline-none font-['Hind_Siliguri']"
                />
                <button
                  type="submit"
                  className="absolute right-1 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-[#004F18] hover:bg-[#5EB809] text-white flex items-center justify-center transition-colors cursor-pointer"
                  aria-label="Search"
                >
                  <Search className="w-3.5 h-3.5" />
                </button>
              </form>

              {/* Live Search Suggestions Dropdown */}
              {isSearchOpen && searchQuery.trim() && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-[#DCECD5] overflow-hidden z-50 divide-y divide-[#DCECD5]/60 font-['Hind_Siliguri']">
                  {searchResults.length > 0 ? (
                    searchResults.map((prod) => (
                      <div
                        key={prod.id}
                        onClick={() => handleSearchSelect(prod.slug)}
                        className="p-2.5 hover:bg-[#F5FBF2] cursor-pointer flex items-center gap-2.5 transition-colors"
                      >
                        <img
                          src={resolveImageUrl(prod.images[0]?.url)}
                          alt={prod.nameBn}
                          className="w-9 h-9 rounded-lg object-cover border border-[#DCECD5]"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-bold text-[#004F18] truncate">
                            {prod.nameBn}
                          </h4>
                          <span className="text-[11px] text-[#5EB809] font-bold">
                            ৳{prod.salePrice || prod.price}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-3 text-center text-xs text-gray-500">
                      "{searchQuery}" দিয়ে কোনো পণ্য পাওয়া যায়নি।
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Cart Button */}
            <button
              id="navbar-cart-btn"
              onClick={() => setIsCartDrawerOpen(true)}
              className="flex items-center gap-2 bg-[#004F18] hover:bg-[#063B14] text-white px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-full transition-all duration-200 cursor-pointer shadow-xs active:scale-95 group select-none"
              title="কার্ট দেখুন"
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-[#5EB809] group-hover:scale-105 transition-transform" />
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2.5 bg-[#E89D10] text-white text-[10px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center border-2 border-[#004F18]">
                    {itemCount}
                  </span>
                )}
              </div>
              <span className="font-bold text-xs sm:text-sm font-['Hind_Siliguri']">
                কার্ট
              </span>
              <span className="font-bold text-xs bg-[#5EB809] text-white px-2 py-0.5 rounded-full font-['Hind_Siliguri'] hidden sm:inline">
                ৳{subtotal.toLocaleString()}
              </span>
            </button>

            {/* Admin / Sign In Button */}
            {adminUser ? (
              <button
                onClick={() => onNavigate('/admin')}
                className="flex items-center gap-1.5 text-xs font-bold bg-[#5EB809] hover:bg-[#4ea204] text-white px-3 py-2 rounded-full transition-colors cursor-pointer font-['Hind_Siliguri']"
                title="এডমিন ড্যাশবোর্ড"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">এডমিন</span>
              </button>
            ) : (
              <button
                onClick={() => onNavigate('/admin/login')}
                className="p-2 text-[#004F18] hover:bg-[#F5FBF2] rounded-full transition-colors cursor-pointer text-xs font-bold flex items-center gap-1 border border-[#DCECD5]"
                title="এডমিন লগইন"
              >
                <User className="w-4 h-4 text-[#004F18]" />
              </button>
            )}

          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex font-['Hind_Siliguri']">
          <div className="w-4/5 max-w-sm bg-[#F5FBF2] h-full shadow-2xl p-5 overflow-y-auto flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#DCECD5]">
                <PureGhorLogo height={34} showSubtitle={false} />
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
                  className="w-full bg-white border border-[#DCECD5] focus:border-[#004F18] rounded-xl py-2 pl-3 pr-8 text-xs outline-none"
                />
                <Search className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
              </div>

              {/* Mobile Nav Links */}
              <div className="mt-5 flex flex-col gap-1 text-sm font-bold text-[#004F18]">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onNavigate('/');
                  }}
                  className="text-left py-2.5 px-3 rounded-xl hover:bg-white transition-colors"
                >
                  হোম (Home)
                </button>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onNavigate('/shop');
                  }}
                  className="text-left py-2.5 px-3 rounded-xl hover:bg-white transition-colors"
                >
                  সকল পণ্য (Shop)
                </button>

                <div className="py-2 px-3 text-[11px] font-black uppercase text-gray-400 tracking-wider">
                  ক্যাটাগরি সমূহ
                </div>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      onNavigate(`/category/${cat.slug}`);
                    }}
                    className="text-left py-2 px-4 rounded-xl hover:bg-white text-xs font-semibold text-[#102B16]"
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
                  className="text-left py-2 px-3 rounded-xl hover:bg-white text-xs font-bold"
                >
                  📦 অর্ডার ট্র্যাক করুন
                </button>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onNavigate('/about');
                  }}
                  className="text-left py-2 px-3 rounded-xl hover:bg-white text-xs font-bold"
                >
                  🌿 আমাদের সম্পর্কে
                </button>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onNavigate('/quality-promise');
                  }}
                  className="text-left py-2 px-3 rounded-xl hover:bg-white text-xs font-bold"
                >
                  ⭐ কোয়ালিটি প্রমিজ
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-[#DCECD5]">
              <a
                href={`tel:${settings.phone}`}
                className="w-full flex items-center justify-center gap-2 bg-[#004F18] text-white py-2.5 rounded-xl font-bold text-xs mb-2"
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
