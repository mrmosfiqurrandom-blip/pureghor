import React from 'react';
import { MessageCircle } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

interface WhatsAppButtonProps {
  productTitle?: string;
}

export const WhatsAppFloatingButton: React.FC<WhatsAppButtonProps> = ({ productTitle }) => {
  const { settings } = useStore();
  const cleanNumber = (settings.whatsapp || settings.phone || '01712345678').replace(/[^0-9]/g, '');
  const finalPhone = cleanNumber.startsWith('88') ? cleanNumber : `88${cleanNumber}`;
  
  const text = productTitle
    ? `আসসালামু আলাইকুম, আমি PureGhor থেকে "${productTitle}" সম্পর্কে জানতে/অর্ডার করতে চাই।`
    : `আসসালামু আলাইকুম, আমি PureGhor-এর খাঁটি পণ্য সম্পর্কে জানতে চাই।`;

  const whatsappUrl = `https://wa.me/${finalPhone}?text=${encodeURIComponent(text)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 bg-[#25D366] hover:bg-[#1EBE5D] text-white p-3.5 rounded-full shadow-lg hover:shadow-xl hover:scale-110 active:scale-95 transition-all duration-200 flex items-center gap-2 font-bold text-sm cursor-pointer group"
      aria-label="WhatsApp Support"
    >
      <MessageCircle className="w-6 h-6 fill-current" />
      <span className="hidden sm:inline font-['Hind_Siliguri'] pr-1">হোয়াটসঅ্যাপে অর্ডার</span>
    </a>
  );
};
