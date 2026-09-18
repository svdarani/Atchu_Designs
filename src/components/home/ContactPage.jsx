import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { BUSINESS_CONFIG } from '../../data/businessConfig';
import { Phone, MessageCircle, Mail, MapPin, Clock, Sparkles, Send } from 'lucide-react';
import InstagramIcon from '../common/InstagramIcon';

export default function ContactPage() {
  const { isTamil } = useLanguage();

  return (
    <div className="container section-padding animate-fade-in">
      {/* Page Header */}
      <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto var(--space-48)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '8px' }}>
          <Sparkles size={18} color="var(--color-gold-dark)" />
          <span className="section-eyebrow">
            {isTamil ? 'எங்களை தொடர்பு கொள்ள' : 'Get in Touch'}
          </span>
        </div>
        <h1 style={{ fontSize: '2.6rem', color: 'var(--color-primary-dark)', marginBottom: '10px' }}>
          {BUSINESS_CONFIG.businessName}
        </h1>
        <div style={{ fontSize: '1.2rem', color: 'var(--color-gold-dark)', fontWeight: 600, letterSpacing: '0.04em', marginBottom: '16px' }}>
          {BUSINESS_CONFIG.businessSubtitle}
        </div>
        <p style={{ fontSize: '1.05rem', color: 'var(--color-text-muted)', lineHeight: 1.7 }}>
          {isTamil
            ? 'பிளவுஸ் தையல், ஆரி வேலைப்பாடு அல்லது உங்கள் விருப்ப டிசைன் குறித்து நேரடியாக பேச எங்களை தொடர்பு கொள்ளுங்கள்.'
            : 'Have questions about blouse stitching, custom Aari embroidery, or scheduling a consultation? Reach out to our boutique.'}
        </p>
      </div>

      {/* 4 Primary Action Buttons Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 'var(--space-20)',
          maxWidth: '960px',
          margin: '0 auto var(--space-48)'
        }}
      >
        {/* Action 1: Call Now */}
        <a
          href={BUSINESS_CONFIG.telLink}
          className="btn btn-primary btn-lg"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            padding: '16px 20px',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-sm)'
          }}
          title="Call Atchu Designs"
        >
          <Phone size={20} />
          <span>{isTamil ? 'அழைக்க (Call Now)' : 'Call Now'}</span>
        </a>

        {/* Action 2: WhatsApp */}
        <a
          href={BUSINESS_CONFIG.getWhatsAppUrl(BUSINESS_CONFIG.messages.generalOrder(isTamil))}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-gold btn-lg"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            padding: '16px 20px',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-sm)'
          }}
          title="Chat on WhatsApp"
        >
          <MessageCircle size={20} />
          <span>{isTamil ? 'வாட்ஸ்அப் (WhatsApp)' : 'WhatsApp'}</span>
        </a>

        {/* Action 3: Email */}
        <a
          href={BUSINESS_CONFIG.emailLink}
          className="btn btn-outline btn-lg"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            padding: '16px 20px',
            borderRadius: 'var(--radius-md)',
            borderColor: 'var(--color-primary)',
            color: 'var(--color-primary)'
          }}
          title="Email Atchu Designs"
        >
          <Mail size={20} />
          <span>{isTamil ? 'மின்னஞ்சல் (Email)' : 'Email Us'}</span>
        </a>

        {/* Action 4: Instagram */}
        <a
          href={BUSINESS_CONFIG.instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-outline-gold btn-lg"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            padding: '16px 20px',
            borderRadius: 'var(--radius-md)'
          }}
          title="Follow on Instagram"
        >
          <InstagramIcon size={20} />
          <span>{isTamil ? 'இன்ஸ்டாகிராம் (Instagram)' : 'Instagram'}</span>
        </a>
      </div>

      {/* Detailed Info Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 'var(--space-24)',
          maxWidth: '1080px',
          margin: '0 auto'
        }}
      >
        {/* Card 1: Phone & WhatsApp */}
        <div className="card-premium" style={{ padding: 'var(--space-32)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div className="brand-emblem" style={{ width: 44, height: 44 }}>
              <Phone size={22} color="#FFFFFF" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', color: 'var(--color-primary-dark)' }}>
                {isTamil ? 'தொலைபேசி & வாட்ஸ்அப்' : 'Phone & WhatsApp'}
              </h3>
              <span style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
                {isTamil ? 'நேரடி அழைப்பு & ஆர்டர்' : 'Direct calling & quick orders'}
              </span>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '1rem' }}>
            <div>
              <span style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', display: 'block' }}>Mobile:</span>
              <a href={BUSINESS_CONFIG.telLink} style={{ color: 'var(--color-primary)', fontWeight: 700, fontSize: '1.15rem' }}>
                {BUSINESS_CONFIG.phone}
              </a>
            </div>
            <div>
              <span style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', display: 'block' }}>WhatsApp:</span>
              <a
                href={BUSINESS_CONFIG.getWhatsAppUrl(BUSINESS_CONFIG.messages.generalOrder(isTamil))}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#1E6B42', fontWeight: 700, fontSize: '1.15rem' }}
              >
                {BUSINESS_CONFIG.phone}
              </a>
            </div>
          </div>
        </div>

        {/* Card 2: Email & Instagram */}
        <div className="card-premium" style={{ padding: 'var(--space-32)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div className="brand-emblem" style={{ width: 44, height: 44 }}>
              <Mail size={22} color="#FFFFFF" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', color: 'var(--color-primary-dark)' }}>
                {isTamil ? 'மின்னஞ்சல் & சமூக வலைத்தளம்' : 'Email & Social'}
              </h3>
              <span style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
                {isTamil ? 'ஆன்லைன் விசாரணைகள்' : 'Online inquiries & portfolio'}
              </span>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '1rem' }}>
            <div>
              <span style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', display: 'block' }}>Email:</span>
              <a
                href={BUSINESS_CONFIG.emailLink}
                style={{ color: 'var(--color-primary)', fontWeight: 600, wordBreak: 'break-all' }}
              >
                {BUSINESS_CONFIG.email}
              </a>
            </div>
            <div>
              <span style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', display: 'block' }}>Instagram:</span>
              <a
                href={BUSINESS_CONFIG.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'var(--color-gold-dark)', fontWeight: 700 }}
              >
                {BUSINESS_CONFIG.instagramHandle}
              </a>
            </div>
          </div>
        </div>

        {/* Card 3: Physical Location */}
        <div className="card-premium" style={{ padding: 'var(--space-32)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div className="brand-emblem" style={{ width: 44, height: 44 }}>
              <MapPin size={22} color="#FFFFFF" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', color: 'var(--color-primary-dark)' }}>
                {isTamil ? 'கடை முகவரி' : 'Boutique Location'}
              </h3>
              <span style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
                {isTamil ? 'நேரடி வருகை & அளவுகள்' : 'Walk-in fittings & consultation'}
              </span>
            </div>
          </div>
          <p style={{ color: 'var(--color-text-main)', lineHeight: 1.6, fontSize: '0.92rem', marginBottom: '12px' }}>
            {BUSINESS_CONFIG.address}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.84rem', color: 'var(--color-text-muted)' }}>
            <Clock size={16} color="var(--color-gold)" style={{ flexShrink: 0 }} />
            <span>{isTamil ? BUSINESS_CONFIG.openingHours_ta : BUSINESS_CONFIG.openingHours_en}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
