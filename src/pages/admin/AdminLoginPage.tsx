import React, { useState } from 'react';
import { Lock, Mail, ArrowRight, ShieldCheck, Sparkles, Key } from 'lucide-react';
import { loginAdminWithEmail, loginWithGoogle } from '../../services/auth';
import { useStore } from '../../context/StoreContext';
import { PureGhorLogo } from '../../components/common/PureGhorLogo';

interface AdminLoginPageProps {
  onSuccess: () => void;
  onNavigatePublic: () => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ onSuccess, onNavigatePublic }) => {
  const { setAdminUser, settings } = useStore();
  const [email, setEmail] = useState('admin@pureghor.com');
  const [password, setPassword] = useState('Admin@123456');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const user = await loginAdminWithEmail(email.trim(), password);
      setAdminUser(user);
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'লগইনে সমস্যা হয়েছে।');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoSuper = async () => {
    setEmail('admin@pureghor.com');
    setPassword('Admin@123456');
    setLoading(true);
    try {
      const user = await loginAdminWithEmail('admin@pureghor.com', 'Admin@123456');
      setAdminUser(user);
      onSuccess();
    } catch (e) {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoManager = async () => {
    setEmail('manager@pureghor.com');
    setPassword('Manager@123456');
    setLoading(true);
    try {
      const user = await loginAdminWithEmail('manager@pureghor.com', 'Manager@123456');
      setAdminUser(user);
      onSuccess();
    } catch (e) {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#004F18] flex items-center justify-center p-4 font-['Hind_Siliguri']">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#DCECD5]">
        
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <PureGhorLogo height={46} showSubtitle={true} />
          </div>
          <h2 className="text-2xl font-black text-[#004F18] font-['Hind_Siliguri'] mt-2">
            অ্যাডমিন ড্যাশবোর্ড লগইন
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            {settings.storeNameBn} — স্টোর ম্যানেজমেন্ট পোর্টাল
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-bold rounded-xl">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">অ্যাডমিন ইমেইল</label>
            <div className="relative">
              <input
                type="email"
                required
                placeholder="admin@pureghor.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#F5FBF2] border border-[#DCECD5] rounded-xl p-3 pl-9 text-sm outline-none focus:border-[#004F18]"
              />
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">পাসওয়ার্ড</label>
            <div className="relative">
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#F5FBF2] border border-[#DCECD5] rounded-xl p-3 pl-9 text-sm outline-none focus:border-[#004F18]"
              />
              <Key className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#004F18] hover:bg-[#063B14] text-white py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-md active:scale-98 transition-all cursor-pointer disabled:opacity-50"
          >
            <span>{loading ? 'যাচাই করা হচ্ছে...' : 'লগইন করুন'}</span>
            <ArrowRight className="w-4 h-4 text-[#5EB809]" />
          </button>
        </form>

        {/* Quick Demo Access Bar */}
        <div className="mt-6 pt-6 border-t border-[#DCECD5] space-y-2">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block text-center">
            ডেমো দ্রুত প্রবেশাধিকার (Quick Demo Access)
          </span>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleQuickDemoSuper}
              className="p-2.5 rounded-xl bg-[#F5FBF2] hover:bg-[#004F18] hover:text-white border border-[#DCECD5] text-xs font-bold text-[#004F18] transition-colors cursor-pointer text-center"
            >
              👑 সুপার এডমিন
            </button>
            <button
              onClick={handleQuickDemoManager}
              className="p-2.5 rounded-xl bg-[#F5FBF2] hover:bg-[#004F18] hover:text-white border border-[#DCECD5] text-xs font-bold text-[#004F18] transition-colors cursor-pointer text-center"
            >
              🛡️ স্টোর ম্যানেজার
            </button>
          </div>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={onNavigatePublic}
            className="text-xs font-bold text-gray-500 hover:text-[#004F18] transition-colors cursor-pointer"
          >
            &larr; মূল ওয়েবসাইটে ফিরে যান
          </button>
        </div>
      </div>
    </div>
  );
};
