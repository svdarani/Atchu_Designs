import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { BUSINESS_CONFIG } from '../../data/businessConfig';
import { MessageCircle } from 'lucide-react';

export default function WhatsAppWidget({ contextMessage = '' }) {
  const { isTamil } = useLanguage();

  const handleWhatsAppClick = () => {
    const text = contextMessage || BUSINESS_CONFIG.messages.generalOrder(isTamil);
    window.open(BUSINESS_CONFIG.getWhatsAppUrl(text), '_blank');
  };

  return (
    <button
      onClick={handleWhatsAppClick}
      className="whatsapp-floating"
      title={isTamil ? 'வாட்ஸ்அப் மூலம் உடனடியாக தொடர்பு கொள்க' : 'Chat with Atchu Designs on WhatsApp'}
      aria-label="WhatsApp Chat"
    >
      <MessageCircle size={22} />
      <span>{isTamil ? 'வாட்ஸ்அப் உதவி' : 'WhatsApp Us'}</span>
    </button>
  );
}
