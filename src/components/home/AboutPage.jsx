import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Scissors, Sparkles, MapPin, Award, CheckCircle } from 'lucide-react';

export default function AboutPage({ onExplore, onCustomQuote }) {
  const { isTamil } = useLanguage();

  return (
    <div className="container section-padding animate-fade-in">
      <div style={{ textAlign: 'center', marginBottom: 'var(--space-48)', maxWidth: '720px', margin: '0 auto var(--space-48)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '8px' }}>
          <Sparkles size={18} color="var(--color-gold-dark)" />
          <span className="section-eyebrow">
            {isTamil ? 'எங்கள் தையல் பாரம்பரியம்' : 'The Atelier Heritage'}
          </span>
        </div>
        <h1 style={{ fontSize: '2.6rem', color: 'var(--color-primary-dark)', marginBottom: '16px' }}>
          {isTamil ? 'ஆச்சு மணப்பெண் தையல் & ஆரி கலைக்கூடம்' : 'Aatchu Bridal Blouses & Aari Artistry'}
        </h1>
        <p style={{ fontSize: '1.05rem', color: 'var(--color-text-muted)', lineHeight: 1.7 }}>
          {isTamil
            ? 'பாரம்பரிய கைவினைத் தையலும் நவீன மணப்பெண் அழகியலும் கைகோர்க்கும் இடம்.'
            : 'Where centuries-old South Indian temple zardosi meets modern bespoke couture.'}
        </p>
      </div>

      {/* Story Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 'var(--space-48)', alignItems: 'center', marginBottom: 'var(--space-64)' }}>
        <div style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '2px solid var(--color-gold)', boxShadow: 'var(--shadow-md)' }}>
          <img
            src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=80"
            alt="Atelier Tailoring"
            style={{ width: '100%', height: '420px', objectFit: 'cover' }}
          />
        </div>

        <div>
          <h2 style={{ fontSize: '1.8rem', color: 'var(--color-primary-dark)', marginBottom: '16px' }}>
            {isTamil ? 'மதுரை தம்பூர் ஊசி & அசல் ஜரி பாரம்பரியம்' : 'Authentic Tamboor Embroidery from the Temple City'}
          </h2>
          <p style={{ color: 'var(--color-text-main)', lineHeight: 1.7, marginBottom: '16px' }}>
            {isTamil
              ? 'ஆச்சு கௌடூர் 15 ஆண்டுகளுக்கும் மேலாக மதுரையில் பட்டுப் புடவைகளுக்கான பிரத்யேக தையல் கலைக்கூடமாக செயல்பட்டு வருகிறது. ஆரம்பத்தில் உள்ளூர் வாடிக்கையாளர்களுக்கு மட்டுமே ஆரி வேலைப்பாடுகளை செய்து வந்தோம். இப்போது உலகெங்கும் வாழும் மணப்பெண்களுக்கு எங்கள் கைவினை சேவையை கொண்டு சேர்ப்பதில் பெருமிதம் கொள்கிறோம்.'
              : 'Founded in Madurai over 15 years ago, Aatchu Couture began as a modest walk-in tailoring shop catering to local brides pairing their treasured Kanjivaram silks. Today, we bridge physical in-store consultations with a digital atelier platform.'}
          </p>
          <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.7, marginBottom: '24px' }}>
            {isTamil
              ? 'ஆன்லைனில் ஆர்டர் செய்தாலும் அல்லது எங்கள் கடைக்கு நேரில் வந்தாலும், ஒரே தரமான தையல் மற்றும் நுணுக்கமான ஆரி வேலைப்பாட்டை உறுதி செய்கிறோம்.'
              : 'Whether an order originates digitally from abroad or from a bride stepping into our Madurai workshop, every piece undergoes identical rigorous cutwork, hand-stitched lining, and master fitting.'}
          </p>

          <div style={{ display: 'flex', gap: '16px' }}>
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
