import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, MessageSquare, Send, CheckCircle2 } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const ContactUsPage: React.FC = () => {
  const { settings } = useStore();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !message) return;
    setSent(true);
    setName('');
    setPhone('');
    setMessage('');
    setTimeout(() => setSent(false), 5000);
  };

  return (
    <div className="py-10 md:py-16 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 font-['Hind_Siliguri']">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="bg-[#1F6B45]/10 text-[#1F6B45] text-xs font-bold px-3.5 py-1.5 rounded-full uppercase">
          যোগাযোগ
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-[#123B2A] mt-3">
          যেকোনো প্রয়োজনে আমাদের পাশে পাবেন
        </h1>
        <p className="text-sm text-gray-600 mt-2">
          সরাসরি কল করুন অথবা আপনার বার্তা পাঠিয়ে দিন
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Contact Cards */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white p-6 rounded-3xl border border-[#E5E0D5] flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#1F6B45]/10 text-[#1F6B45] flex items-center justify-center shrink-0">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#123B2A]">আমাদের আউটলেট ও ঠিকানা</h3>
              <p className="text-xs text-gray-600 mt-1">{settings.addressBn}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-[#E5E0D5] flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#1F6B45]/10 text-[#1F6B45] flex items-center justify-center shrink-0">
              <Phone className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#123B2A]">হটলাইন ও অর্ডার</h3>
              <a href={`tel:${settings.phone}`} className="text-sm font-bold text-[#1F6B45] mt-1 block">
                {settings.phone}
              </a>
              <span className="text-[11px] text-gray-400">প্রতিদিন সকাল ৯টা - রাত ১০টা</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-[#E5E0D5] flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#1F6B45]/10 text-[#1F6B45] flex items-center justify-center shrink-0">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#123B2A]">ইমেইল সাপোর্ট</h3>
              <a href={`mailto:${settings.email}`} className="text-xs font-bold text-[#1F6B45] mt-1 block">
                {settings.email}
              </a>
            </div>
          </div>
        </div>

        {/* Right Column: Contact Form */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-[#E5E0D5] shadow-xs">
          <h2 className="text-xl font-bold text-[#123B2A] mb-4">আমাদের মেসেজ পাঠান</h2>
          
          {sent ? (
            <div className="p-6 bg-emerald-50 text-emerald-800 rounded-2xl text-center font-bold flex flex-col items-center gap-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-600" />
              <span>আপনার মেসেজটি আমরা পেয়েছি। দ্রুত যোগাযোগ করব ইনশাআল্লাহ!</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">আপনার নাম *</label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: তানভীর আহমেদ"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#FAF6EE] border border-[#E5E0D5] rounded-xl p-3 text-sm outline-none focus:border-[#1F6B45]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">মোবাইল নম্বর *</label>
                <input
                  type="tel"
                  required
                  placeholder="01712345678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-[#FAF6EE] border border-[#E5E0D5] rounded-xl p-3 text-sm outline-none focus:border-[#1F6B45]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">আপনার বার্তা / জিজ্ঞাসা *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="পণ্য বা ডেলিভারি বিষয়ে বিস্তারিত লিখুন..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-[#FAF6EE] border border-[#E5E0D5] rounded-xl p-3 text-sm outline-none focus:border-[#1F6B45]"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#1F6B45] hover:bg-[#123B2A] text-white py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>মেসেজ পাঠান</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
