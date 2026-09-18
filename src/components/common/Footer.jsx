import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { MapPin, Phone, Mail, Clock, Scissors, Award, Sparkles, Heart } from 'lucide-react';

export default function Footer({ setCurrentView }) {
  const { t, isTamil } = useLanguage();

  return (
    <footer style={{ background: '#1A080C', color: '#E8DED6', paddingTop: 'var(--space-64)', paddingBottom: 'var(--space-32)', borderTop: '2px solid var(--color-gold)' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-40)', marginBottom: 'var(--space-48)' }}>
          {/* Col 1: Brand & Heritage */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div className="brand-emblem" style={{ width: 38, height: 38 }}>
                <Scissors size={20} />
              </div>
              <span className="brand-name" style={{ color: '#FFFFFF', fontSize: '1.4rem' }}>
                {isTamil ? 'ஆச்சு கௌடூர்' : 'AATCHU COUTURE'}
              </span>
            </div>
            <p style={{ fontSize: '0.88rem', lineHeight: 1.6, color: '#C9BCB3', marginBottom: '20px' }}>
              {isTamil
                ? 'மதுரையில் அமைந்துள்ள பிரத்யேக மணப்பெண் பிளவுஸ் தையல் மற்றும் கைவினை ஆரி கலைக்கூடம். ஒவ்வொரு மணப்பெண்ணின் கனவையும் மிகச் சிறந்த தையல் அழகோடு நனவாக்குகிறோம்.'
                : 'Premier bridal blouse tailoring atelier and artisanal Aari embroidery studio in Tamil Nadu. Bringing timeless South Indian bridal grandeur to life with bespoke custom fit.'}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-gold-light)', fontSize: '0.84rem' }}>
              <Award size={16} />
              <span>{isTamil ? '15+ வருட தையல் & ஆரி அனுபவம்' : '15+ Years of Artisanal Tailoring Mastery'}</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 style={{ color: 'var(--color-gold-light)', fontSize: '1.05rem', marginBottom: '16px', letterSpacing: '0.05em' }}>
              {isTamil ? 'முக்கிய பக்கங்கள்' : 'Atelier Collections'}
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem' }}>
              <li>
                <button onClick={() => { setCurrentView('shop'); window.scrollTo(0, 0); }} style={{ color: '#C9BCB3', transition: 'color 0.2s' }}>
                  {t('nav.shop')}
                </button>
              </li>
              <li>
                <button onClick={() => { setCurrentView('bridal'); window.scrollTo(0, 0); }} style={{ color: '#C9BCB3' }}>
                  {t('nav.bridal')}
                </button>
              </li>
              <li>
                <button onClick={() => { setCurrentView('aari'); window.scrollTo(0, 0); }} style={{ color: '#C9BCB3' }}>
                  {t('nav.aari')}
                </button>
              </li>
              <li>
                <button onClick={() => { setCurrentView('custom-quote'); window.scrollTo(0, 0); }} style={{ color: '#C9BCB3' }}>
                  {t('nav.customOrder')}
                </button>
              </li>
              <li>
                <button onClick={() => { setCurrentView('track-order'); window.scrollTo(0, 0); }} style={{ color: '#C9BCB3' }}>
                  {t('nav.trackOrder')}
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Direct Tailoring Studio & Hours */}
          <div>
            <h4 style={{ color: 'var(--color-gold-light)', fontSize: '1.05rem', marginBottom: '16px', letterSpacing: '0.05em' }}>
              {isTamil ? 'நேரடி தையல் கடை முகவரி' : 'Boutique Tailor Studio'}
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.88rem', color: '#C9BCB3' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <MapPin size={18} color="var(--color-gold)" style={{ flexShrink: 0, marginTop: 3 }} />
                <span>No. 42, West Veli Street, Near Sri Meenakshi Temple, Madurai, Tamil Nadu - 625001</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Phone size={16} color="var(--color-gold)" />
                <span>+91 98765 43210 / +91 94432 10020</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Clock size={16} color="var(--color-gold)" />
                <span>{isTamil ? 'திங்கள் - சனி: காலை 9:30 - இரவு 8:30 (ஞாயிறு அப்பாயின்ட்மென்ட்)' : 'Mon - Sat: 9:30 AM - 8:30 PM (Sunday by Appointment)'}</span>
              </div>
            </div>
          </div>

          {/* Col 4: Customer Trust & Alterations */}
          <div>
            <h4 style={{ color: 'var(--color-gold-light)', fontSize: '1.05rem', marginBottom: '16px', letterSpacing: '0.05em' }}>
              {isTamil ? 'தையல் உறுதிப்பாடு' : 'Our Guarantee'}
            </h4>
            <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '16px', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(197, 160, 89, 0.2)' }}>
              <p style={{ fontSize: '0.84rem', color: '#DCD3CB', lineHeight: 1.5, marginBottom: '10px' }}>
                {isTamil
                  ? 'அனைத்து பிளவுஸ்களிலும் 2-இன்ச் தையல் மார்ஜின் விடப்படும். தேவைப்படின் இலவச ஆல்டரேஷன் செய்து தரப்படும்.'
                  : 'Every blouse includes 2-inch side alteration margins, double stitching reinforcement, and complimentary minor fitting adjustments.'}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-gold-light)', fontSize: '0.78rem' }}>
                <Sparkles size={14} />
                <span>{isTamil ? 'ஆன்லைன் & கடை வாடிக்கையாளர் சம உரிமை' : 'Online & Walk-in Customers Welcomed'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', fontSize: '0.8rem', color: '#9D9088' }}>
          <span>
            © {new Date().getFullYear()} Aatchu Bridal Blouses & Aari Artistry. {isTamil ? 'அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.' : 'All rights reserved.'}
          </span>
          <div style={{ display: 'flex', gap: '16px' }}>
            <span>{isTamil ? 'தமிழ்நாடு கைவினைப் பாரம்பரியம்' : 'Crafted with Heritage in Tamil Nadu'}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
