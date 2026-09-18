import { BUSINESS_CONFIG } from './businessConfig';

export const NECK_STYLES = [
  { id: 'same_as_model', name_en: 'Same as Model', name_ta: 'படத்திலுள்ள அதே வடிவம்', price: 0, tag: 'Standard' },
  { id: 'round_neck', name_en: 'Classic Round Neck', name_ta: 'வட்டக் கழுத்து (Round Neck)', price: 0, tag: 'Popular' },
  { id: 'boat_neck', name_en: 'Royal Boat Neck', name_ta: 'போட் நெக் (Boat Neck)', price: 250, tag: 'Trending' },
  { id: 'sweetheart', name_en: 'Sweetheart Neck', name_ta: 'ஸ்வீட்ஹார்ட் நெக்', price: 300, tag: 'Bridal' },
  { id: 'paan_pot', name_en: 'Paan / Pot Neck', name_ta: 'பான் / பானை கழுத்து', price: 350, tag: 'Traditional' },
  { id: 'high_collar', name_en: 'High Collar & Cutwork', name_ta: 'ஹை காலர் & கட்வொர்க்', price: 450, tag: 'Modern' },
  { id: 'deep_v', name_en: 'Deep V-Neck with Zari', name_ta: 'டீப் வி-நெக் (Deep V)', price: 300, tag: 'Bridal' }
];

export const SLEEVE_STYLES = [
  { id: 'same_as_model', name_en: 'Same as Model', name_ta: 'படத்திலுள்ள அதே கை மாடல்', price: 0 },
  { id: 'elbow_aari', name_en: 'Elbow Length + Heavy Aari Border', name_ta: 'முழங்கை வரை + அடர்ந்த ஆரி பார்டர்', price: 750, tag: 'Best for Kanjivaram' },
  { id: 'short_sleeve', name_en: 'Classic Short Sleeve', name_ta: 'குட்டை கை (Short Sleeve)', price: 0 },
  { id: 'puff_sleeve', name_en: 'Traditional Silk Puff Sleeve', name_ta: 'பாரம்பரிய பஃப் ஸ்லீவ் (Puff)', price: 450, tag: 'Festive' },
  { id: 'full_sleeve', name_en: 'Full Length Sheer Aari Sleeve', name_ta: 'முழு கை ஆரி நெட் வேலைப்பாடு', price: 1200, tag: 'Royal' },
  { id: 'sleeveless', name_en: 'Modern Sleeveless', name_ta: 'ஸ்லீவ்லெஸ் (Sleeveless)', price: 0 }
];

export const BACK_STYLES = [
  { id: 'same_as_model', name_en: 'Same as Model', name_ta: 'படத்திலுள்ள அதே பின் மாடல்', price: 0 },
  { id: 'deep_u_dori', name_en: 'Deep U Back with Dori Ties', name_ta: 'டீப் யூ + ரோப் நாட் (Dori)', price: 200 },
  { id: 'pot_neck_latkan', name_en: 'Royal Pot Neck with Latkans', name_ta: 'ராயல் பாட் நெக் + லட்கன்ஸ்', price: 400, tag: 'Bridal Pick' },
  { id: 'keyhole_aari', name_en: 'Keyhole with Aari Peacock Motif', name_ta: 'கீஹோல் + ஆரி மயில் மோட்டிஃப்', price: 550 },
  { id: 'sheer_net_back', name_en: 'Illusion Net with Zardosi Work', name_ta: 'நெட் துணியில் சர்தோசி வேலைப்பாடு', price: 650 },
  { id: 'queen_anne', name_en: 'Traditional Temple Arch Cut', name_ta: 'கோவில் வளைவு வடிவம் (Temple Arch)', price: 450 }
];

export const AARI_WORK_LEVELS = [
  { 
    id: 'minimal', 
    name_en: 'Minimal / Subtle Work', 
    name_ta: 'மிதமான ஆரி வேலைப்பாடு', 
    desc_en: 'Delicate neckline chain stitch, stone line & sleeve piping',
    desc_ta: 'மெல்லிய கழுத்து செயின் தையல் மற்றும் கை விளிம்பு வேலைப்பாடு',
    priceMultiplier: 0, 
    priceAdd: 600 
  },
  { 
    id: 'medium', 
    name_en: 'Festive Medium Aari Work', 
    name_ta: 'நடுத்தர விசேஷ ஆரி வேலை', 
    desc_en: 'Zari buttis across back, pearl moti & 2-inch sleeve border',
    desc_ta: 'முதுகு முழுவதும் ஜரி புட்டாக்கள், முத்துக்கள் & 2-இன்ச் கை பார்டர்',
    priceMultiplier: 1.0, 
    priceAdd: 1400,
    tag: 'Popular'
  },
  { 
    id: 'heavy_bridal', 
    name_en: 'Grand Bridal Zardosi & Cutwork', 
    name_ta: 'கிராண்ட் மணப்பெண் சர்தோசி & கட்வொர்க்', 
    desc_en: 'Heavy antique zari, kundan stones, cutwork sleeves & 3D floral Aari',
    desc_ta: 'அடர்ந்த ஆன்டிக் ஜரி, குந்தன் கற்கள், கட்வொர்க் & 3D மலர் வேலைப்பாடு',
    priceMultiplier: 1.5, 
    priceAdd: 2800,
    tag: 'Bridal Special'
  },
  { 
    id: 'muhurtham_maggam', 
    name_en: 'Royal Muhurtham Heritage Maggam', 
    name_ta: 'ராயல் முகூர்த்த ஹெரிட்டேஜ் மக்கம் ஒர்க்', 
    desc_en: 'Exquisite Peacock/Temple figurine motifs with French knots & real zari',
    desc_ta: 'மயில்/அன்னப்பறவை மோட்டிஃப்கள், பிரெஞ்ச் நாட் மற்றும் அசல் ஜரி வேலைப்பாடு',
    priceMultiplier: 2.2, 
    priceAdd: 4500,
    tag: 'Luxury Couture'
  }
];

export const ADDONS = [
  { id: 'padding', name_en: 'Padded Cups Fitting', name_ta: 'பேடிங் கப்ஸ் பொருத்துதல்', price: 250 },
  { id: 'tassels', name_en: 'Custom Handmade Zari Tassels (Latkans)', name_ta: 'கைவினை ஜரி லட்கன்ஸ் (Tassels)', price: 350 },
  { id: 'double_lining', name_en: 'Pure Cotton Double Lining', name_ta: 'தூய காட்டன் டபுள் லைனிங்', price: 200 }
];

export const DEFAULT_CONFIG = {
  currency: '₹',
  baseStitchingRate: 1100,
  taxRate: 0.05,
  shippingCost: 0, // Free shipping
  expressRushFee: 650,
  whatsappNumber: BUSINESS_CONFIG.phoneRaw,
  shopAddress: BUSINESS_CONFIG.address,
  supportEmail: BUSINESS_CONFIG.email
};
