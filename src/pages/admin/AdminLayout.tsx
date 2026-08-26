import React, { useState } from 'react';
import {
  LayoutDashboard,
  Package,
  Layers,
  ShoppingBag,
  Sliders,
  Image as ImageIcon,
  Tag,
  MessageSquare,
  Settings,
  Sparkles,
  LogOut,
  Store,
  Menu,
  X,
  History,
  FileText,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { PureGhorLogo } from '../../components/common/PureGhorLogo';

interface AdminLayoutProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onNavigatePublic: (path: string) => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentTab,
  onSelectTab,
  onNavigatePublic,
  children,
}) => {
  const { adminUser, logoutAdmin, settings } = useStore();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'ড্যাশবোর্ড (Overview)', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'wizard', label: 'ব্র্যান্ডিং সেটআপ উইজার্ড', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'orders', label: 'অর্ডার ম্যানেজমেন্ট', icon: <ShoppingBag className="w-4 h-4" /> },
    { id: 'products', label: 'পণ্য তালিকা ও স্টক (Products)', icon: <Package className="w-4 h-4" /> },
    { id: 'categories', label: 'ক্যাটাগরি সমূহ', icon: <Layers className="w-4 h-4" /> },
    { id: 'banners', label: 'ব্যানার ও অফার স্লাইডার', icon: <Sliders className="w-4 h-4" /> },
    { id: 'coupons', label: 'কুপন ও ছাড় কোড', icon: <Tag className="w-4 h-4" /> },
    { id: 'reviews', label: 'গ্রাহক রিভিউ ও রেটিং', icon: <MessageSquare className="w-4 h-4" /> },
    { id: 'media', label: 'মিডিয়া ও ফাইল লাইব্রেরি', icon: <ImageIcon className="w-4 h-4" /> },
    { id: 'settings', label: 'স্টোর ও ডেলিভারি সেটিংস', icon: <Settings className="w-4 h-4" /> },
    { id: 'audit', label: 'অডিট লগ ও হিস্টোরি', icon: <History className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-[#F5FBF2] flex font-['Hind_Siliguri'] text-[#102B16]">
      
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 bg-[#004F18] text-white flex-col justify-between p-4 shrink-0 shadow-xl border-r border-[#003810]">
        <div>
          {/* Brand Header */}
          <div className="px-2 py-3 border-b border-white/15 mb-4">
            <div className="flex items-center justify-between">
              <PureGhorLogo height={32} isDark={true} showSubtitle={false} />
            </div>
            <div className="flex items-center justify-between mt-2 text-xs text-white/70">
              <span>অ্যাডমিন পোর্টাল</span>
              <span className="bg-[#5EB809] text-[#004F18] font-black px-2 py-0.5 rounded text-[10px] uppercase">
                {adminUser?.role || 'Admin'}
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1 text-sm font-medium">
            {menuItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left cursor-pointer ${
                    isActive
                      ? 'bg-[#5EB809] text-[#004F18] font-bold shadow-xs'
                      : 'text-white/80 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <span className={isActive ? 'text-[#004F18]' : 'text-[#5EB809]'}>{item.icon}</span>
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="pt-4 border-t border-white/15 space-y-2 text-xs">
          <button
            onClick={() => onNavigatePublic('/')}
            className="w-full flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white py-2.5 rounded-xl transition-colors cursor-pointer font-bold"
          >
            <Store className="w-4 h-4 text-[#5EB809]" />
            <span>লাইভ শপ ভিউ দেখুন</span>
          </button>

          <button
            onClick={logoutAdmin}
            className="w-full flex items-center justify-center gap-2 bg-red-500/20 hover:bg-red-500/30 text-red-200 py-2.5 rounded-xl transition-colors cursor-pointer font-bold"
          >
            <LogOut className="w-4 h-4" />
            <span>লগআউট করুন</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="bg-white border-b border-[#DCECD5] px-4 sm:px-8 py-4 flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileNavOpen(true)}
              className="p-2 rounded-xl text-[#004F18] hover:bg-[#F5FBF2] lg:hidden"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold text-[#004F18]">
              {menuItems.find((m) => m.id === currentTab)?.label || 'অ্যাডমিন প্যানেল'}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigatePublic('/')}
              className="hidden sm:flex items-center gap-1.5 bg-[#F5FBF2] text-[#004F18] border border-[#DCECD5] px-3.5 py-1.5 rounded-full text-xs font-bold hover:border-[#5EB809] hover:bg-white cursor-pointer transition-colors"
            >
              <Store className="w-3.5 h-3.5 text-[#5EB809]" />
              <span>স্টোর পেজে যান</span>
            </button>
            <div className="text-right text-xs">
              <span className="font-bold text-[#004F18] block">{adminUser?.displayName}</span>
              <span className="text-gray-400">{adminUser?.email}</span>
            </div>
          </div>
        </header>

        {/* Main Body View */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* Mobile Drawer */}
      {isMobileNavOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs lg:hidden flex">
          <div className="w-64 bg-[#004F18] text-white p-4 h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-white/15 mb-4">
                <PureGhorLogo height={28} isDark={true} showSubtitle={false} />
                <button onClick={() => setIsMobileNavOpen(false)}>
                  <X className="w-5 h-5 text-gray-300" />
                </button>
              </div>

              <nav className="space-y-1 text-sm font-medium">
                {menuItems.map((item) => {
                  const isActive = currentTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onSelectTab(item.id);
                        setIsMobileNavOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left cursor-pointer transition-all ${
                        isActive
                          ? 'bg-[#5EB809] text-[#004F18] font-bold shadow-xs'
                          : 'text-white/80 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <span className={isActive ? 'text-[#004F18]' : 'text-[#5EB809]'}>{item.icon}</span>
                      <span className="truncate">{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            <div className="pt-4 border-t border-white/15 space-y-2 text-xs">
              <button
                onClick={() => {
                  setIsMobileNavOpen(false);
                  onNavigatePublic('/');
                }}
                className="w-full py-2.5 text-xs font-bold text-white bg-white/10 rounded-xl"
              >
                স্টোর ভিউ
              </button>
              <button
                onClick={logoutAdmin}
                className="w-full py-2.5 text-xs font-bold text-red-200 bg-red-500/20 rounded-xl"
              >
                লগআউট
              </button>
            </div>
          </div>
          <div className="flex-1" onClick={() => setIsMobileNavOpen(false)} />
        </div>
      )}
    </div>
  );
};
