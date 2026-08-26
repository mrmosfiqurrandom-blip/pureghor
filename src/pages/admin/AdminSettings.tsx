import React, { useState } from 'react';
import { Save, CheckCircle2, Store, Phone, Truck, Shield } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { updateStoreSettings } from '../../services/db';

export const AdminSettings: React.FC = () => {
  const { settings, refreshData } = useStore();
  const [storeNameBn, setStoreNameBn] = useState(settings.storeNameBn || '');
  const [taglineBn, setTaglineBn] = useState(settings.taglineBn || '');
  const [phone, setPhone] = useState(settings.phone || '');
  const [whatsapp, setWhatsapp] = useState(settings.whatsapp || '');
  const [email, setEmail] = useState(settings.email || '');
  const [deliverySylhet, setDeliverySylhet] = useState(settings.deliveryCharges?.insideSylhet ?? 50);
  const [deliveryDhaka, setDeliveryDhaka] = useState(settings.deliveryCharges?.insideDhaka ?? 80);
  const [deliveryOutside, setDeliveryOutside] = useState(settings.deliveryCharges?.outsideDhaka ?? 130);
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(settings.freeDeliveryThreshold ?? 2000);

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateStoreSettings({
        storeNameBn,
        taglineBn,
        phone,
        whatsapp,
        email,
        deliveryCharges: {
          insideSylhet: Number(deliverySylhet),
          insideDhaka: Number(deliveryDhaka),
          outsideDhaka: Number(deliveryOutside),
          outsideSylhet: Number(deliveryOutside),
        },
        freeDeliveryThreshold: Number(freeShippingThreshold),
      });
      await refreshData();
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) {
      alert('সেটিংস সেভ করতে সমস্যা হয়েছে');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 font-['Hind_Siliguri']">
      <div className="bg-white p-6 rounded-3xl border border-[#DCECD5] flex items-center justify-between shadow-2xs">
        <div>
          <h2 className="text-lg font-bold text-[#004F18]">স্টোর সেটিংস ও কনফিগারেশন</h2>
          <p className="text-xs text-gray-500">ডেলিভারি চার্জ, কন্টাক্ট ইনফো এবং পেমেন্ট সেটিংস</p>
        </div>
      </div>

      {saved && (
        <div className="p-4 bg-[#E8F8D8] border border-[#5EB809]/40 text-[#004F18] rounded-2xl text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#5EB809]" />
          <span>সেটিংস সফলভাবে সংরক্ষিত হয়েছে!</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-3xl border border-[#DCECD5] shadow-xs space-y-6">
        {/* Basic store info */}
        <div>
          <h3 className="font-bold text-sm text-[#004F18] mb-3 flex items-center gap-2 border-b border-[#DCECD5] pb-2">
            <Store className="w-4 h-4 text-[#5EB809]" />
            <span>বেসিক তথ্য</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-gray-700 mb-1">স্টোরের নাম (বাংলা)</label>
              <input
                type="text"
                value={storeNameBn}
                onChange={(e) => setStoreNameBn(e.target.value)}
                className="w-full bg-[#F5FBF2] border border-[#DCECD5] rounded-xl p-2.5 outline-none focus:border-[#004F18]"
              />
            </div>
            <div>
              <label className="block font-bold text-gray-700 mb-1">ট্যাগলাইন (বাংলা)</label>
              <input
                type="text"
                value={taglineBn}
                onChange={(e) => setTaglineBn(e.target.value)}
                className="w-full bg-[#F5FBF2] border border-[#DCECD5] rounded-xl p-2.5 outline-none focus:border-[#004F18]"
              />
            </div>
          </div>
        </div>

        {/* Contact info */}
        <div>
          <h3 className="font-bold text-sm text-[#004F18] mb-3 flex items-center gap-2 border-b border-[#DCECD5] pb-2">
            <Phone className="w-4 h-4 text-[#5EB809]" />
            <span>যোগাযোগ ও সাপোর্ট</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-bold text-gray-700 mb-1">ফোন নম্বর</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-[#F5FBF2] border border-[#DCECD5] rounded-xl p-2.5 outline-none focus:border-[#004F18]"
              />
            </div>
            <div>
              <label className="block font-bold text-gray-700 mb-1">হোয়াটসঅ্যাপ</label>
              <input
                type="text"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                className="w-full bg-[#F5FBF2] border border-[#DCECD5] rounded-xl p-2.5 outline-none focus:border-[#004F18]"
              />
            </div>
            <div>
              <label className="block font-bold text-gray-700 mb-1">ইমেইল</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#F5FBF2] border border-[#DCECD5] rounded-xl p-2.5 outline-none focus:border-[#004F18]"
              />
            </div>
          </div>
        </div>

        {/* Delivery Charges */}
        <div>
          <h3 className="font-bold text-sm text-[#004F18] mb-3 flex items-center gap-2 border-b border-[#DCECD5] pb-2">
            <Truck className="w-4 h-4 text-[#5EB809]" />
            <span>ডেলিভারি চার্জ কনফিগারেশন</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <label className="block font-bold text-gray-700 mb-1">সিলেট জেলা (৳)</label>
              <input
                type="number"
                value={deliverySylhet}
                onChange={(e) => setDeliverySylhet(Number(e.target.value))}
                className="w-full bg-[#F5FBF2] border border-[#DCECD5] rounded-xl p-2.5 outline-none focus:border-[#004F18]"
              />
            </div>
            <div>
              <label className="block font-bold text-gray-700 mb-1">ঢাকা সিটি (৳)</label>
              <input
                type="number"
                value={deliveryDhaka}
                onChange={(e) => setDeliveryDhaka(Number(e.target.value))}
                className="w-full bg-[#F5FBF2] border border-[#DCECD5] rounded-xl p-2.5 outline-none focus:border-[#004F18]"
              />
            </div>
            <div>
              <label className="block font-bold text-gray-700 mb-1">ঢাকার বাইরে (৳)</label>
              <input
                type="number"
                value={deliveryOutside}
                onChange={(e) => setDeliveryOutside(Number(e.target.value))}
                className="w-full bg-[#F5FBF2] border border-[#DCECD5] rounded-xl p-2.5 outline-none focus:border-[#004F18]"
              />
            </div>
            <div>
              <label className="block font-bold text-gray-700 mb-1">ফ্রি ডেলিভারি নূন্যতম (৳)</label>
              <input
                type="number"
                value={freeShippingThreshold}
                onChange={(e) => setFreeShippingThreshold(Number(e.target.value))}
                className="w-full bg-[#F5FBF2] border border-[#DCECD5] rounded-xl p-2.5 outline-none focus:border-[#004F18]"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-[#DCECD5]">
          <button
            type="submit"
            disabled={saving}
            className="bg-[#004F18] hover:bg-[#063B14] text-white px-8 py-3 rounded-xl font-bold text-xs flex items-center gap-2 cursor-pointer shadow-md transition-colors"
          >
            <Save className="w-4 h-4 text-[#5EB809]" />
            <span>{saving ? 'সংরক্ষিত হচ্ছে...' : 'সেটিংস আপডেট করুন'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
