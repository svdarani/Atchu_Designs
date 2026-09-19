import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useShop } from '../../context/ShopContext';
import { BUSINESS_CONFIG } from '../../data/businessConfig';
import ProductGallery from './ProductGallery';
import CustomizerForm from './CustomizerForm';
import MeasurementModal from './MeasurementModal';
import {
  Sparkles,
  Scissors,
  Share2,
  Clock,
  ShieldCheck,
  Check,
  Heart,
  MessageCircle,
  ArrowLeft
} from 'lucide-react';

export default function ProductDetailView({ product, onBack, onAddToCartSuccess, initialTab = 'customizer' }) {
  const { isTamil, t } = useLanguage();
  const { addToCart, isInWishlist, toggleWishlist } = useShop();

  const [activeTab, setActiveTab] = useState(initialTab || 'customizer'); // 'customizer' | 'specs' | 'care'
  const [measurementModalOpen, setMeasurementModalOpen] = useState(false);
  const [pendingCustomization, setPendingCustomization] = useState(null);
  const [pendingPrice, setPendingPrice] = useState(product?.startingPrice || 0);
  const [linkCopied, setLinkCopied] = useState(false);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab, product]);

  const isFavorited = isInWishlist(product.id);

  const handleCustomizationChange = (customization, updatedPrice) => {
    setPendingCustomization(customization);
    setPendingPrice(updatedPrice);
  };

  // When customer completes customization form and clicks "Proceed to Measurements"
  const handleProceedToMeasurements = (customizationData, calculatedPrice) => {
    setPendingCustomization(customizationData);
    setPendingPrice(calculatedPrice);
    setMeasurementModalOpen(true);
  };

  const handleOpenMeasurementModal = () => {
    setMeasurementModalOpen(true);
  };

  // When customer confirms measurements in modal
  const handleSaveMeasurements = (measurementData) => {
    setMeasurementModalOpen(false);
    addToCart(product, pendingCustomization, measurementData, pendingPrice, 1);
    if (onAddToCartSuccess) onAddToCartSuccess();
  };

  const handleWhatsAppOrder = () => {
    const text = BUSINESS_CONFIG.messages.productOrder(product, pendingCustomization, isTamil);
    window.open(BUSINESS_CONFIG.getWhatsAppUrl(text), '_blank');
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      isTamil
        ? `${BUSINESS_CONFIG.businessName}-ல் இந்த அழகிய பிளவுஸைப் பாருங்கள்: ${product.name_ta || product.name_en} - ₹${product.startingPrice} முதல்`
        : `Check out this handcrafted blouse at ${BUSINESS_CONFIG.businessName}: ${product.name_en} - starting from ₹${product.startingPrice}`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const handleCopyLink = () => {
    navigator.clipboard?.writeText?.(window.location.href);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2500);
  };

  return (
    <div className="container section-padding animate-fade-in">
      {/* Back Button & Breadcrumbs */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-24)' }}>
        <button
          onClick={onBack}
          className="btn btn-sm btn-outline"
          style={{ gap: '6px' }}
        >
          <ArrowLeft size={16} />
          <span>{isTamil ? 'அனைத்து பிளவுஸ்களுக்கும் செல்ல' : 'Back to Catalog'}</span>
        </button>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button
            onClick={handleWhatsAppOrder}
            className="btn btn-sm btn-outline-gold"
            title="Order or Inquire via WhatsApp"
            style={{ gap: '6px' }}
          >
            <MessageCircle size={15} color="#25D366" />
            <span>{isTamil ? 'வாட்ஸ்அப் ஆர்டர்' : 'WhatsApp Order'}</span>
          </button>
          <button
            onClick={handleCopyLink}
            className="btn btn-sm btn-outline"
          >
            <Share2 size={14} />
            <span>{linkCopied ? t('product.linkCopied') : t('product.copyLink')}</span>
          </button>
        </div>
      </div>

      {/* Main 2-Column Product Studio Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 'var(--space-48)', alignItems: 'start' }}>
        {/* Left Column: Media Gallery */}
        <div>
          <ProductGallery
            images={product.images}
            alt={isTamil ? product.name_ta : product.name_en}
          />

          {/* Value Highlights Box */}
          <div style={{ marginTop: 'var(--space-24)', background: '#FAF6F0', padding: '16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border-gold)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-primary-dark)', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
              <ShieldCheck size={18} color="var(--color-gold-dark)" />
              <span>{t('product.includesLabel')}</span>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', lineHeight: 1.45 }}>
              {isTamil
                ? 'உங்கள் வசதிக்கேற்ப அளவுகளை இப்போது உள்ளிடலாம் அல்லது ஆர்டருக்குப் பிறகு எங்கள் டெய்லரிடம் போனில் தெரிவிக்கலாம்.'
                : 'Enter measurements now or opt for a dedicated master tailor call after order placement.'}
            </p>
          </div>
        </div>

        {/* Right Column: Title, Specs & Interactive Customizer */}
        <div>
          {/* Header Info */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span className="badge badge-gold">
              {isTamil ? product.workType_ta : product.workType_en}
            </span>
            <button
              onClick={() => toggleWishlist(product)}
              className="action-icon-btn"
              title="Save to Wishlist"
            >
              <Heart size={20} color={isFavorited ? 'var(--color-primary)' : 'currentColor'} fill={isFavorited ? 'currentColor' : 'none'} />
            </button>
          </div>

          <h1 style={{ fontSize: '2.2rem', color: 'var(--color-primary-dark)', lineHeight: 1.25, marginBottom: '12px' }}>
            {isTamil ? product.name_ta : product.name_en}
          </h1>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: '16px', marginBottom: '16px' }}>
            <div style={{ fontSize: '1.9rem', fontWeight: 700, color: 'var(--color-primary)' }}>
              ₹{product.startingPrice.toLocaleString('en-IN')}
            </div>
            <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
              ({isTamil ? 'தேர்ந்தெடுக்கும் வேலைப்பாட்டைப் பொறுத்து விலை மாறும்' : 'Customized to your choices'})
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '10px 14px', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}>
              <Clock size={16} color="var(--color-gold-dark)" />
              <span>{product.estimatedDays}</span>
            </div>
            <span style={{ color: 'var(--color-border)' }}>|</span>
            <div style={{ fontSize: '0.85rem', color: 'var(--color-success)', fontWeight: 600 }}>
              {t('product.rushAvailable')}
            </div>
          </div>

          {/* Tab Controls */}
          <div style={{ display: 'flex', gap: '8px', borderBottom: '2px solid var(--color-border)', marginBottom: '20px' }}>
            <button
              onClick={() => setActiveTab('customizer')}
              style={{
                padding: '10px 16px',
                fontSize: '0.9rem',
                fontWeight: activeTab === 'customizer' ? 700 : 500,
                color: activeTab === 'customizer' ? 'var(--color-primary)' : 'var(--color-text-muted)',
                borderBottom: activeTab === 'customizer' ? '2px solid var(--color-primary)' : 'none',
                marginBottom: -2
              }}
            >
              {t('product.tabs.customizer')}
            </button>
            <button
              onClick={() => setActiveTab('specs')}
              style={{
                padding: '10px 16px',
                fontSize: '0.9rem',
                fontWeight: activeTab === 'specs' ? 700 : 500,
                color: activeTab === 'specs' ? 'var(--color-primary)' : 'var(--color-text-muted)',
                borderBottom: activeTab === 'specs' ? '2px solid var(--color-primary)' : 'none',
                marginBottom: -2
              }}
            >
              {t('product.tabs.description')}
            </button>
            <button
              onClick={() => setActiveTab('care')}
              style={{
                padding: '10px 16px',
                fontSize: '0.9rem',
                fontWeight: activeTab === 'care' ? 700 : 500,
                color: activeTab === 'care' ? 'var(--color-primary)' : 'var(--color-text-muted)',
                borderBottom: activeTab === 'care' ? '2px solid var(--color-primary)' : 'none',
                marginBottom: -2
              }}
            >
              {t('product.tabs.care')}
            </button>
          </div>

          {/* Tab 1: Interactive Customizer */}
          {activeTab === 'customizer' && (
            <CustomizerForm
              product={product}
              onProceedToMeasurements={handleProceedToMeasurements}
            />
          )}

          {/* Tab 2: Specifications */}
          {activeTab === 'specs' && (
            <div className="card-premium" style={{ padding: '24px' }}>
              <p style={{ lineHeight: 1.7, color: 'var(--color-text-main)', marginBottom: '16px' }}>
                {isTamil ? product.description_ta : product.description_en}
              </p>
              <h4 style={{ color: 'var(--color-primary-dark)', marginBottom: '10px', fontSize: '1rem' }}>
                {isTamil ? 'கைவினை தையல் சிறப்பம்சங்கள்' : 'Atelier Craftsmanship Highlights'}
              </h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {(isTamil ? product.specifications_ta : product.specifications_en)?.map((spec, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.86rem', color: 'var(--color-text-muted)' }}>
                    <Check size={16} color="var(--color-gold-dark)" style={{ flexShrink: 0, marginTop: 2 }} />
                    <span>{spec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Tab 3: Care Instructions */}
          {activeTab === 'care' && (
            <div className="card-premium" style={{ padding: '24px', fontSize: '0.88rem', color: 'var(--color-text-main)', lineHeight: 1.6 }}>
              <h4 style={{ color: 'var(--color-primary-dark)', marginBottom: '10px' }}>
                {isTamil ? 'பராமரிப்பு வழிகாட்டுதல்' : 'Heirloom Fabric Care'}
              </h4>
              <p style={{ marginBottom: '8px' }}>
                • {isTamil ? 'உலர்ந்த சலவை மட்டுமே (Dry clean only). தண்ணீரில் நனைக்கக் கூடாது.' : 'Strictly Dry Clean Only. Avoid direct contact with moisture or water.'}
              </p>
              <p style={{ marginBottom: '8px' }}>
                • {isTamil ? 'ஆரி வேலைப்பாட்டின் மீது நேரடியாக அயர்ன் செய்ய வேண்டாம்; பின்புறமாக குறைந்த வெப்பத்தில் அயர்ன் செய்யவும்.' : 'Do not iron directly over zardosi or beads. Light steam iron from reverse with cotton cloth barrier.'}
              </p>
              <p>
                • {isTamil ? 'பிளவுஸை மஸ்லின் துணியில் சுற்றி வைக்கவும்.' : 'Wrap in unbleached muslin cotton cloth for long-term bridal preservation.'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Measurement Modal Triggered by Customizer */}
      <MeasurementModal
        isOpen={measurementModalOpen}
        onClose={() => setMeasurementModalOpen(false)}
        onSaveMeasurements={handleSaveMeasurements}
      />
    </div>
  );
}
