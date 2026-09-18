import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { BUSINESS_CONFIG } from '../../data/businessConfig';
import { Scissors, Sparkles, MapPin, Award, CheckCircle } from 'lucide-react';

export default function AboutPage({ onExplore, onCustomQuote }) {
  const { isTamil } = useLanguage();

  return (
    <div className="container section-padding animate-fade-in">
      <div style={{ textAlign: 'center', marginBottom: 'var(--space-48)', maxWidth: '760px', margin: '0 auto var(--space-48)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '8px' }}>
          <Sparkles size={18} color="var(--color-gold-dark)" />
          <span className="section-eyebrow">
            {isTamil ? 'எங்கள் கைவினைப் பாரம்பரியம்' : 'Our Artisanal Heritage'}
          </span>
        </div>
        <h1 style={{ fontSize: '2.6rem', color: 'var(--color-primary-dark)', marginBottom: '8px' }}>
          {BUSINESS_CONFIG.businessName}
        </h1>
        <div style={{ fontSize: '1.25rem', color: 'var(--color-gold-dark)', fontWeight: 600, letterSpacing: '0.04em', marginBottom: '16px' }}>
          {BUSINESS_CONFIG.businessSubtitle}
        </div>
        <p style={{ fontSize: '1.05rem', color: 'var(--color-text-muted)', lineHeight: 1.7 }}>
          {isTamil
            ? 'பாரம்பரிய கைவினைத் தையலும் நவீன மணப்பெண் அழகியலும் கைகோர்க்கும் ஆடை வடிவமைப்பு கலைக்கூடம்.'
            : 'Where traditional craftsmanship meets contemporary bridal couture and custom blouse stitching.'}
        </p>
      </div>

      {/* Story Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 'var(--space-48)', alignItems: 'center', marginBottom: 'var(--space-64)' }}>
        <div style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '2px solid var(--color-gold)', boxShadow: 'var(--shadow-md)' }}>
          <img
            src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=80"
            alt="Atchu Designs Tailoring Atelier"
            style={{ width: '100%', height: '420px', objectFit: 'cover' }}
          />
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-gold-dark)', fontSize: '0.9rem', fontWeight: 600, marginBottom: '10px' }}>
            <Award size={18} />
            <span>{isTamil ? '5 ஆண்டுகளுக்கும் மேலான தனித்துவ அனுபவம்' : '5 Years of Bespoke Tailoring Experience'}</span>
          </div>
          <h2 style={{ fontSize: '1.8rem', color: 'var(--color-primary-dark)', marginBottom: '16px' }}>
            {isTamil ? 'நேர்த்தியான தையல் கலை & நுணுக்கமான ஆரி வேலைப்பாடுகள்' : 'Precision Stitching & Exquisite Handcrafted Aari Artistry'}
          </h2>
          <p style={{ color: 'var(--color-text-main)', lineHeight: 1.7, marginBottom: '16px' }}>
            {isTamil
              ? `${BUSINESS_CONFIG.businessName} ${BUSINESS_CONFIG.experience} மற்றும் அர்ப்பணிப்புடன் பட்டுப் புடவைகளுக்கான பிரத்யேக தையல் கலைக்கூடமாக செயல்பட்டு வருகிறது. மணப்பெண் பிளவுஸ் தையல், நேர்த்தியான ஆரி எம்ப்ராய்டரி மற்றும் நளினமான நவீன பிளவுஸ் டிசைன்களில் தனி கவனம் செலுத்துகிறோம்.`
              : `Backed by ${BUSINESS_CONFIG.experience}, ${BUSINESS_CONFIG.businessName} specializes in custom blouse designs, bridal blouse embroidery, intricate Aari needlework, and personalized fitting services. Every creation represents our deep passion for meticulous attention to detail and traditional craftsmanship blended with modern blouse silhouettes.`}
          </p>
          <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.7, marginBottom: '24px' }}>
            {isTamil
              ? `திருச்சிராப்பள்ளி மாவட்டம், தொட்டியம், பாலசமுத்திரம் பகுதியில் அமைந்துள்ள எங்கள் ஸ்டுடியோவில் நீங்கள் நேரடியாக வந்தோ அல்லது ஆன்லைன் மூலமாகவோ உங்கள் விருப்ப பிளவுஸ்களை மிகச் சரியான அளவுகளுடன் தைத்துக் கொள்ளலாம்.`
              : `Located at Balasamuthiram, Thottiyam in Tiruchirappalli district, we welcome both walk-in clients for bespoke physical fittings as well as customers ordering custom designer blouses online.`}
          </p>

          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <button onClick={onExplore} className="btn btn-gold">
              <span>{isTamil ? 'வடிவமைப்புகளைப் பாருங்கள்' : 'Explore Collections'}</span>
            </button>
            <button onClick={onCustomQuote} className="btn btn-outline">
              <span>{isTamil ? 'விருப்ப பிளவுஸ் கேட்க' : 'Request Custom Quote'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
