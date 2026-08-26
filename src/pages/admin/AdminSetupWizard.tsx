import React, { useState } from 'react';
import {
  Sparkles,
  Upload,
  CheckCircle2,
  Store,
  Palette,
  Truck,
  Phone,
  Image as ImageIcon,
  ArrowRight,
  ArrowLeft,
  Save,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { updateStoreSettings } from '../../services/db';
import { uploadImageFile } from '../../services/storage';

export const AdminSetupWizard: React.FC = () => {
  const { settings, refreshData } = useStore();

  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  // Form State
  const [storeNameBn, setStoreNameBn] = useState(settings.storeNameBn || 'PureGhor - খাঁটি ও প্রাকৃতিক খাবার');
  const [storeNameEn, setStoreNameEn] = useState(settings.storeNameEn || 'PureGhor');
  const [taglineBn, setTaglineBn] = useState(settings.taglineBn || 'সিলেটের খাঁটি প্রাকৃতিক খাদ্য ভাণ্ডার');
  
  // Media State
  const [logoUrl, setLogoUrl] = useState(settings.logoUrl || '');
  const [faviconUrl, setFaviconUrl] = useState(settings.faviconUrl || '');
  
  // Contacts
  const [phone, setPhone] = useState(settings.phone || '01754-991822');
  const [whatsapp, setWhatsapp] = useState(settings.whatsapp || '01754-991822');
  const [email, setEmail] = useState(settings.email || 'pureghornatural@gmail.com');
  const [addressBn, setAddressBn] = useState(settings.addressBn || 'লালাবাজার, দক্ষিণ সুরমা, সিলেট। আল বুরাক শপিং সিটি, বিশ্বনাথ');

  // Delivery & Theme
  const [deliverySylhet, setDeliverySylhet] = useState(settings.deliveryCharges?.insideSylhet ?? 50);
  const [deliveryDhaka, setDeliveryDhaka] = useState(settings.deliveryCharges?.insideDhaka ?? 80);
  const [deliveryOutside, setDeliveryOutside] = useState(settings.deliveryCharges?.outsideDhaka ?? 130);
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(settings.freeDeliveryThreshold ?? 2000);
  const [primaryColor, setPrimaryColor] = useState(settings.themeColors?.primaryGreen || '#5EB809');
  const [secondaryColor, setSecondaryColor] = useState(settings.themeColors?.deepGreen || '#004F18');
  const [accentColor, setAccentColor] = useState(settings.themeColors?.honeyAmber || '#E89D10');

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, target: 'logo' | 'favicon') => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const uploaded = await uploadImageFile(file, 'branding');
      if (target === 'logo') setLogoUrl(uploaded.url);
      if (target === 'favicon') setFaviconUrl(uploaded.url);
    } catch (err: any) {
      alert(err.message || 'ফাইল আপলোডে ত্রুটি');
    }
  };

  const handleSaveAll = async () => {
    setSaving(true);
    try {
      await updateStoreSettings({
        storeNameBn,
        storeNameEn,
        taglineBn,
        logoUrl,
        faviconUrl,
        phone,
        whatsapp,
        email,
        addressBn,
        deliveryCharges: {
          insideSylhet: Number(deliverySylhet),
          insideDhaka: Number(deliveryDhaka),
          outsideDhaka: Number(deliveryOutside),
          outsideSylhet: Number(deliveryOutside),
        },
        freeDeliveryThreshold: Number(freeShippingThreshold),
        themeColors: {
          primaryGreen: primaryColor,
          deepGreen: secondaryColor,
          warmCream: '#FAF6EE',
          honeyAmber: accentColor,
          terracotta: '#9E381E',
          neutralText: '#26312B',
          border: '#E5E0D5',
        },
        isSetupComplete: true,
      });

      setSuccess(true);
      await refreshData();
      setTimeout(() => setSuccess(false), 4000);
    } catch (e: any) {
      alert('সেটিংস সংরক্ষণ ব্যর্থ হয়েছে।');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 font-['Hind_Siliguri']">
      {/* Wizard Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E5E0D5] shadow-xs">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-2xl bg-[#1F6B45]/10 text-[#1F6B45] flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-[#123B2A]">
              ব্র্যান্ড ও স্টোর সেটআপ উইজার্ড
            </h2>
            <p className="text-xs sm:text-sm text-gray-500">
              আপনার অনলাইন শপের নাম, লোগো, ডেলিভারি চার্জ ও কালার থিম কনফিগার করুন
            </p>
          </div>
        </div>

        {/* Steps indicator */}
        <div className="grid grid-cols-4 gap-2 mt-6 pt-6 border-t border-[#E5E0D5]">
          {[
            { id: 1, label: 'ব্র্যান্ড ও লোগো', icon: Store },
            { id: 2, label: 'যোগাযোগ তথ্য', icon: Phone },
            { id: 3, label: 'ডেলিভারি চার্জ', icon: Truck },
            { id: 4, label: 'কালার থিম', icon: Palette },
          ].map((s) => {
            const Icon = s.icon;
            const isDone = step > s.id;
            const isCurr = step === s.id;

            return (
              <button
                key={s.id}
                onClick={() => setStep(s.id)}
                className={`flex flex-col items-center sm:flex-row gap-2 p-3 rounded-2xl transition-all text-center sm:text-left cursor-pointer ${
                  isCurr
                    ? 'bg-[#123B2A] text-white shadow-xs'
                    : isDone
                    ? 'bg-emerald-50 text-emerald-800'
                    : 'bg-[#FAF6EE] text-gray-500'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                    isCurr
                      ? 'bg-[#D99A2B] text-[#123B2A]'
                      : isDone
                      ? 'bg-emerald-600 text-white'
                      : 'bg-white text-gray-400 border border-[#E5E0D5]'
                  }`}
                >
                  {isDone ? '✓' : s.id}
                </div>
                <div className="hidden sm:block truncate">
                  <div className="text-[11px] font-bold leading-tight">{s.label}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {success && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-sm font-bold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span>অভিনন্দন! আপনার ব্র্যান্ড সেটিংস সফলভাবে আপডেট হয়েছে।</span>
        </div>
      )}

      {/* Step Content Forms */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E5E0D5] shadow-xs">
        {step === 1 && (
          <div className="space-y-6">
            <h3 className="text-base font-bold text-[#123B2A] border-b border-[#E5E0D5] pb-3">
              ধাপ ১: স্টোরের নাম ও ভিজ্যুয়াল আইডেন্টিটি
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">স্টোরের নাম (বাংলা) *</label>
                <input
                  type="text"
                  value={storeNameBn}
                  onChange={(e) => setStoreNameBn(e.target.value)}
                  className="w-full bg-[#FAF6EE] border border-[#E5E0D5] rounded-xl p-3 text-sm outline-none focus:border-[#1F6B45]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">স্টোরের নাম (English)</label>
                <input
                  type="text"
                  value={storeNameEn}
                  onChange={(e) => setStoreNameEn(e.target.value)}
                  className="w-full bg-[#FAF6EE] border border-[#E5E0D5] rounded-xl p-3 text-sm outline-none focus:border-[#1F6B45]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">ট্যাগলাইন (বাংলা)</label>
              <input
                type="text"
                value={taglineBn}
                onChange={(e) => setTaglineBn(e.target.value)}
                className="w-full bg-[#FAF6EE] border border-[#E5E0D5] rounded-xl p-3 text-sm outline-none focus:border-[#1F6B45]"
              />
            </div>

            {/* Logo Upload */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-[#E5E0D5]">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2">ব্র্যান্ড লোগো</label>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-2xl bg-[#FAF6EE] border border-[#E5E0D5] overflow-hidden flex items-center justify-center">
                    {logoUrl ? (
                      <img src={logoUrl} alt="Logo" className="w-full h-full object-contain p-2" />
                    ) : (
                      <span className="text-xs font-black text-gray-400">PG</span>
                    )}
                  </div>
                  <label className="bg-[#1F6B45] hover:bg-[#123B2A] text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 cursor-pointer transition-colors">
                    <Upload className="w-4 h-4" />
                    <span>লোগো আপলোড</span>
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, 'logo')} />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2">ব্রাউজার ফেভিকন (Favicon)</label>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#FAF6EE] border border-[#E5E0D5] overflow-hidden flex items-center justify-center">
                    {faviconUrl ? (
                      <img src={faviconUrl} alt="Favicon" className="w-full h-full object-contain p-1" />
                    ) : (
                      <span className="text-xs font-black text-gray-400">F</span>
                    )}
                  </div>
                  <label className="bg-[#FAF6EE] border border-[#E5E0D5] hover:border-[#1F6B45] text-gray-700 text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 cursor-pointer transition-colors">
                    <Upload className="w-4 h-4 text-gray-500" />
                    <span>আইকন আপলোড</span>
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, 'favicon')} />
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <h3 className="text-base font-bold text-[#123B2A] border-b border-[#E5E0D5] pb-3">
              ধাপ ২: কাস্টমার সাপোর্ট ও যোগাযোগের ঠিকানা
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">মোবাইল নম্বর *</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-[#FAF6EE] border border-[#E5E0D5] rounded-xl p-3 text-sm outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">হোয়াটসঅ্যাপ সাপোর্ট নম্বর</label>
                <input
                  type="text"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  className="w-full bg-[#FAF6EE] border border-[#E5E0D5] rounded-xl p-3 text-sm outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">ইমেইল অ্যাড্রেস</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#FAF6EE] border border-[#E5E0D5] rounded-xl p-3 text-sm outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">অফিস ও ফার্মের ঠিকানা (বাংলা)</label>
              <input
                type="text"
                value={addressBn}
                onChange={(e) => setAddressBn(e.target.value)}
                className="w-full bg-[#FAF6EE] border border-[#E5E0D5] rounded-xl p-3 text-sm outline-none"
              />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <h3 className="text-base font-bold text-[#123B2A] border-b border-[#E5E0D5] pb-3">
              ধাপ ৩: জেলাভিত্তিক ডেলিভারি চার্জ ও ফ্রি শিপিং
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-[#FAF6EE] p-4 rounded-2xl border border-[#E5E0D5]">
                <label className="block text-xs font-bold text-gray-700 mb-1">সিলেট জেলা (৳)</label>
                <input
                  type="number"
                  value={deliverySylhet}
                  onChange={(e) => setDeliverySylhet(Number(e.target.value))}
                  className="w-full bg-white border border-[#E5E0D5] rounded-xl p-2.5 text-base font-bold text-[#1F6B45]"
                />
              </div>

              <div className="bg-[#FAF6EE] p-4 rounded-2xl border border-[#E5E0D5]">
                <label className="block text-xs font-bold text-gray-700 mb-1">ঢাকা সিটি (৳)</label>
                <input
                  type="number"
                  value={deliveryDhaka}
                  onChange={(e) => setDeliveryDhaka(Number(e.target.value))}
                  className="w-full bg-white border border-[#E5E0D5] rounded-xl p-2.5 text-base font-bold text-[#1F6B45]"
                />
              </div>

              <div className="bg-[#FAF6EE] p-4 rounded-2xl border border-[#E5E0D5]">
                <label className="block text-xs font-bold text-gray-700 mb-1">ঢাকার বাইরে সারা বাংলাদেশ (৳)</label>
                <input
                  type="number"
                  value={deliveryOutside}
                  onChange={(e) => setDeliveryOutside(Number(e.target.value))}
                  className="w-full bg-white border border-[#E5E0D5] rounded-xl p-2.5 text-base font-bold text-[#1F6B45]"
                />
              </div>
            </div>

            <div className="bg-[#FFF8EA] p-4 rounded-2xl border border-[#E5E0D5]">
              <label className="block text-xs font-bold text-[#123B2A] mb-1">
                ফ্রি ডেলিভারি পেতে নূন্যতম অর্ডার মূল্য (৳)
              </label>
              <input
                type="number"
                value={freeShippingThreshold}
                onChange={(e) => setFreeShippingThreshold(Number(e.target.value))}
                className="w-full sm:w-60 bg-white border border-[#E5E0D5] rounded-xl p-2.5 text-base font-bold text-[#1F6B45]"
              />
              <p className="text-[11px] text-gray-500 mt-1">
                গ্রাহক কার্টে এই টাকার বেশি পণ্য যোগ করলে ডেলিভারি ফি স্বয়ংক্রিয়ভাবে ০ হবে।
              </p>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6">
            <h3 className="text-base font-bold text-[#123B2A] border-b border-[#E5E0D5] pb-3">
              ধাপ ৪: ব্র্যান্ড কালার প্যালেট
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2">প্রাইমারি গ্রিন</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-12 h-12 rounded-xl border border-[#E5E0D5] cursor-pointer"
                  />
                  <input
                    type="text"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="flex-1 bg-[#FAF6EE] border border-[#E5E0D5] rounded-xl p-2.5 font-mono text-xs uppercase"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2">ডিপ ফরেস্ট গ্রিন</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={secondaryColor}
                    onChange={(e) => setSecondaryColor(e.target.value)}
                    className="w-12 h-12 rounded-xl border border-[#E5E0D5] cursor-pointer"
                  />
                  <input
                    type="text"
                    value={secondaryColor}
                    onChange={(e) => setSecondaryColor(e.target.value)}
                    className="flex-1 bg-[#FAF6EE] border border-[#E5E0D5] rounded-xl p-2.5 font-mono text-xs uppercase"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2">হানি অ্যাম্বার অ্যাকসেন্ট</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                    className="w-12 h-12 rounded-xl border border-[#E5E0D5] cursor-pointer"
                  />
                  <input
                    type="text"
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                    className="flex-1 bg-[#FAF6EE] border border-[#E5E0D5] rounded-xl p-2.5 font-mono text-xs uppercase"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Wizard Navigation Bar */}
        <div className="flex items-center justify-between pt-6 border-t border-[#E5E0D5] mt-8">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="bg-[#FAF6EE] hover:bg-gray-200 text-gray-700 px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>পূর্ববর্তী ধাপ</span>
            </button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="bg-[#1F6B45] hover:bg-[#123B2A] text-white px-6 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <span>পরবর্তী ধাপ</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSaveAll}
              disabled={saving}
              className="bg-[#123B2A] hover:bg-[#1F6B45] text-white px-8 py-3 rounded-2xl font-bold text-xs flex items-center gap-2 cursor-pointer shadow-lg active:scale-98 transition-all"
            >
              <Save className="w-4 h-4 text-[#D99A2B]" />
              <span>{saving ? 'সংরক্ষিত হচ্ছে...' : 'সেটআপ সম্পন্ন ও সংরক্ষণ করুন'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
