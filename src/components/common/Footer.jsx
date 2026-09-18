import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { BUSINESS_CONFIG } from '../../data/businessConfig';
import { MapPin, Phone, Mail, Clock, Award, Sparkles, MessageCircle } from 'lucide-react';
import InstagramIcon from './InstagramIcon';

export default function Footer({ setCurrentView }) {
  const { t, isTamil } = useLanguage();

  return (
    <footer style={{ background: '#1A080C', color: '#E8DED6', paddingTop: 'var(--space-64)', paddingBottom: 'var(--space-32)', borderTop: '2px solid var(--color-gold)' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 'var(--space-40)', marginBottom: 'var(--space-48)' }}>
          {/* Col 1: Brand & Heritage */}
          <div>
            <div style={{ marginBottom: '16px' }}>
              <div
                style={{
                  background: '#FFFFFF',
                  padding: '8px 14px',
                  borderRadius: 'var(--radius-sm)',
                  display: 'inline-block',
                  cursor: 'pointer',
                  border: '1px solid rgba(197, 160, 89, 0.4)'
                }}
                onClick={() => { setCurrentView('home'); window.scrollTo(0, 0); }}
                title="Atchu Designs - Stiching and Aari works"
              >
                <img
                  src={BUSINESS_CONFIG.logoUrl}
                  alt="Atchu Designs - Stiching and Aari works"
                  style={{
                    height: '42px',
                    width: 'auto',
                    maxWidth: '170px',
                    objectFit: 'contain',
                    display: 'block'
                  }}
                />
              </div>
              <div style={{ marginTop: '10px' }}>
                <div style={{ color: '#FFFFFF', fontSize: '1.25rem', fontWeight: 700, letterSpacing: '0.02em' }}>
                  {BUSINESS_CONFIG.businessName}
                </div>
                <div style={{ color: 'var(--color-gold-light)', fontSize: '0.84rem', letterSpacing: '0.04em' }}>
                  {isTamil ? BUSINESS_CONFIG.businessSubtitle_ta : BUSINESS_CONFIG.businessSubtitle}
                </div>
              </div>
            </div>
            <p style={{ fontSize: '0.86rem', lineHeight: 1.6, color: '#C9BCB3', marginBottom: '18px' }}>
              {isTamil
                ? 'பிரத்யேக மணப்பெண் பிளவுஸ் தையல் மற்றும் கைவினை ஆரி வேலைப்பாடுகள் கலைக்கூடம். ஒவ்வொரு மணப்பெண்ணின் கனவையும் மிகச் சிறந்த தையல் அழகோடு நனவாக்குகிறோம்.'
                : 'Premier boutique for bespoke blouse stitching, custom bridal blouses, and intricate handmade Aari embroidery works.'}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-gold-light)', fontSize: '0.84rem' }}>
              <Award size={16} />
              <span>{isTamil ? BUSINESS_CONFIG.experienceText_ta : BUSINESS_CONFIG.experienceText_en}</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 style={{ color: 'var(--color-gold-light)', fontSize: '1.05rem', marginBottom: '16px', letterSpacing: '0.05em' }}>
              {isTamil ? 'முக்கிய பக்கங்கள்' : 'Quick Navigation'}
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
              <li>
                <button onClick={() => { setCurrentView('about'); window.scrollTo(0, 0); }} style={{ color: '#C9BCB3' }}>
                  {t('nav.about')}
                </button>
              </li>
              <li>
                <button onClick={() => { setCurrentView('contact'); window.scrollTo(0, 0); }} style={{ color: 'var(--color-gold-light)', fontWeight: 600 }}>
                  {t('nav.contact')}
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Direct Tailoring Studio & Hours */}
          <div>
            <h4 style={{ color: 'var(--color-gold-light)', fontSize: '1.05rem', marginBottom: '16px', letterSpacing: '0.05em' }}>
              {isTamil ? 'நேரடி தையல் கடை முகவரி' : 'Boutique Location'}
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.88rem', color: '#C9BCB3' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <MapPin size={18} color="var(--color-gold)" style={{ flexShrink: 0, marginTop: 3 }} />
                <span>{BUSINESS_CONFIG.address}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Phone size={16} color="var(--color-gold)" style={{ flexShrink: 0 }} />
                <a href={BUSINESS_CONFIG.telLink} style={{ color: '#FFFFFF', textDecoration: 'none' }} title="Call Atchu Designs">
                  {BUSINESS_CONFIG.phone}
                </a>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Mail size={16} color="var(--color-gold)" style={{ flexShrink: 0 }} />
                <a href={BUSINESS_CONFIG.emailLink} style={{ color: '#FFFFFF', textDecoration: 'none', wordBreak: 'break-all' }} title="Email Atchu Designs">
                  {BUSINESS_CONFIG.email}
                </a>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Clock size={16} color="var(--color-gold)" style={{ flexShrink: 0 }} />
                <span>{isTamil ? BUSINESS_CONFIG.openingHours_ta : BUSINESS_CONFIG.openingHours_en}</span>
              </div>
            </div>
          </div>

          {/* Col 4: WhatsApp & Social */}
          <div>
            <h4 style={{ color: 'var(--color-gold-light)', fontSize: '1.05rem', marginBottom: '16px', letterSpacing: '0.05em' }}>
              {isTamil ? 'நேரடி ஆர்டர் & தொடர்பு' : 'Direct Orders & Social'}
            </h4>
            
            {/* WhatsApp Direct Order Box */}
            <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '16px', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(197, 160, 89, 0.25)', marginBottom: '16px' }}>
              <div style={{ fontSize: '0.84rem', color: '#DCD3CB', marginBottom: '10px' }}>
                {isTamil ? 'வாட்ஸ்அப் மூலம் உடனடியாக ஆர்டர் செய்யுங்கள்:' : 'Order directly on WhatsApp:'}
              </div>
              <a
                href={BUSINESS_CONFIG.getWhatsAppUrl(BUSINESS_CONFIG.messages.generalOrder(isTamil))}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-sm btn-gold"
                style={{ width: '100%', justifyContent: 'center', gap: '8px' }}
              >
                <MessageCircle size={16} />
                <span>{BUSINESS_CONFIG.phone}</span>
              </a>
            </div>

            {/* Instagram Link */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem' }}>
              <InstagramIcon size={18} color="var(--color-gold-light)" style={{ flexShrink: 0 }} />
              <a
                href={BUSINESS_CONFIG.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#FFFFFF', textDecoration: 'none', transition: 'color 0.2s' }}
                title="Follow Atchu Designs on Instagram"
              >
                {BUSINESS_CONFIG.instagramHandle}
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', fontSize: '0.8rem', color: '#9D9088' }}>
          <span>
            © {new Date().getFullYear()} {BUSINESS_CONFIG.businessName}. {isTamil ? 'அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.' : 'All rights reserved.'}
          </span>
          <div style={{ display: 'flex', gap: '16px' }}>
            <span>{isTamil ? 'தமிழ்நாடு கைவினைத் தையல் கலை' : 'Handcrafted in Tamil Nadu'}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
