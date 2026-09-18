import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { MessageCircle } from 'lucide-react';

export default function WhatsAppWidget({ contextMessage = '' }) {
  const { t, isTamil } = useLanguage();

  const handleWhatsAppClick = () => {
    const phoneNumber = '919876543210';
    const defaultText = isTamil
      ? 'வணக்கம்! ஆச்சு கௌடூரில் பிளவுஸ் தையல் மற்றும் ஆரி வேலைப்பாடு பற்றி அறிய விரும்புகிறேன்.'
      : 'Hello! I would like to inquire about bridal blouse stitching and Aari embroidery at Aatchu Couture.';
    
    const message = encodeURIComponent(contextMessage || defaultText);
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };

  return (
    <button
      onClick={handleWhatsAppClick}
      className="whatsapp-floating"
      title={isTamil ? 'வாட்ஸ்அப் மூலம் உடனடியாக தொடர்பு கொள்க' : 'Chat with Master Tailor on WhatsApp'}
      aria-label="WhatsApp Chat"
    >
      <MessageCircle size={22} />
      <span>{isTamil ? 'வாட்ஸ்அப் உதவி' : 'WhatsApp Us'}</span>
    </button>
  );
}
