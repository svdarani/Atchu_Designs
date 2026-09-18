/**
 * Centralized Business Configuration for Atchu Designs
 * Single source of truth for branding, contact, social, location and experience info.
 */

export const BUSINESS_CONFIG = {
  businessName: 'Atchu Designs',
  businessSubtitle: 'Stiching and Aari works', // Exact spelling per user requirement
  businessSubtitle_ta: 'தையல் & ஆரி வேலைப்பாடுகள்',
  
  // Phone contact
  phone: '+91 84385 51865',
  phoneRaw: '+918438551865',
  telLink: 'tel:+918438551865',
  
  // WhatsApp direct ordering
  whatsapp: '918438551865',
  whatsappFormatted: '+91 84385 51865',
  
  // Email
  email: 'orders.atchudesigns@gmail.com',
  emailLink: 'mailto:orders.atchudesigns@gmail.com',
  
  // Instagram
  instagramUsername: 'atchu_designs',
  instagramHandle: '@atchu_designs',
  instagramUrl: 'https://www.instagram.com/atchu_designs/?utm_source=ig_web_button_share_sheet',
  
  // Physical Location
  address: 'Near Post Office, Indra Nagar, Balasamuthiram, Thottiyam, Tiruchirappalli district, Tamil Nadu-621203.',
  city: 'Thottiyam',
  district: 'Tiruchirappalli district',
  state: 'Tamil Nadu',
  pincode: '621203',
  landmark: 'Near Post Office, Indra Nagar, Balasamuthiram',
  
  // Experience & Mastery
  experience: '5 years of experience',
  experienceBadge: '5+ Years',
  experienceYears: 5,
  experienceText_en: '5+ Years of Artisanal Tailoring Mastery',
  experienceText_ta: '5+ வருட தையல் & ஆரி அனுபவம்',
  
  // Operational Details
  openingHours_en: 'Mon - Sat: 9:30 AM - 8:30 PM (Sunday by Appointment)',
  openingHours_ta: 'திங்கள் - சனி: காலை 9:30 - இரவு 8:30 (ஞாயிறு அப்பாயின்ட்மென்ட்)',
  upiId: 'atchudesigns@oksbi',
  
  // Logo
  logoUrl: '/logo.png',
  
  // Helper to build WhatsApp direct link
  getWhatsAppUrl(message = '') {
    const cleanNumber = '918438551865';
    if (!message) {
      return `https://wa.me/${cleanNumber}`;
    }
    return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
  },
  
  // Contextual WhatsApp messages
  messages: {
    generalOrder(isTamil = false) {
      return isTamil
        ? 'வணக்கம் Atchu Designs, பிளவுஸ் ஆர்டர் செய்ய விரும்புகிறேன்.'
        : 'Hi Atchu Designs, I would like to place an order for a blouse.';
    },
    customOrder(isTamil = false, quoteId = '') {
      const idStr = quoteId ? ` (Quote ID: ${quoteId})` : '';
      return isTamil
        ? `வணக்கம் Atchu Designs, எனக்கு தனிப்பயன் பிளவுஸ் டிசைன் குறித்து பேச வேண்டும்${idStr}.`
        : `Hi Atchu Designs, I would like to discuss a custom blouse design${idStr}.`;
    },
    productOrder(product, customization = null, isTamil = false) {
      const name = isTamil ? (product.name_ta || product.name_en) : product.name_en;
      const id = product.id ? ` [ID: ${product.id}]` : '';
      const price = product.startingPrice ? ` (₹${product.startingPrice})` : '';
      let customDetails = '';
      if (customization) {
        const neck = typeof customization.neck === 'string' ? customization.neck : customization.neck?.name_en;
        const aari = typeof customization.aari === 'string' ? customization.aari : customization.aari?.name_en;
        if (neck || aari) {
          customDetails = ` with ${[neck, aari].filter(Boolean).join(', ')}`;
        }
      }
      return isTamil
        ? `வணக்கம் Atchu Designs, "${name}"${id}${price}${customDetails} பிளவுஸ் டிசைன் மீது ஆர்வமாக உள்ளேன். ஆர்டர் விவரங்கள் அறிய விரும்புகிறேன்.`
        : `Hi Atchu Designs, I am interested in this blouse design: ${name}${id}${price}${customDetails}. I would like to know more about placing an order.`;
    },
    orderUpdate(orderId, isTamil = false) {
      return isTamil
        ? `வணக்கம் Atchu Designs, என் பிளவுஸ் ஆர்டர் ${orderId} இன் நிலையைத் தெரிந்துகொள்ள விரும்புகிறேன்.`
        : `Hi Atchu Designs, I would like an update on my blouse order ${orderId}.`;
    }
  }
};
