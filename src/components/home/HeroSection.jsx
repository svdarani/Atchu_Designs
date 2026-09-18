import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Sparkles, Scissors, MapPin, ArrowRight } from 'lucide-react';

export default function HeroSection({ onExplore, onCustomQuote }) {
  const { t, isTamil } = useLanguage();

  return (
    <section className="hero-wrapper" aria-label="Hero">
      {/* Cinematic Video Background with Poster Fallback */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="hero-video-bg"
        poster="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1600&q=80"
      >
        <source
          src="https://assets.mixkit.co/videos/preview/mixkit-sewing-machine-working-on-fabric-41804-large.mp4"
          type="video/mp4"
        />
      </video>

      {/* Subtle Warm Overlay */}
      <div className="hero-overlay" />

      {/* Foreground Hero Content */}
      <div className="container">
        <div className="hero-content animate-fade-in">
          {/* Eyebrow */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={16} color="var(--color-gold-light)" />
            <span className="hero-eyebrow">{t('hero.eyebrow')}</span>
          </div>

          {/* Headline */}
          <h1 className="hero-title">{t('hero.title')}</h1>

          {/* Subtitle */}
          <p className="hero-subtitle">{t('hero.subtitle')}</p>

          {/* CTA Buttons */}
          <div className="hero-cta-group">
            <button onClick={onExplore} className="btn btn-gold btn-lg">
              <span>{t('hero.exploreCta')}</span>
              <ArrowRight size={18} />
            </button>
            <button onClick={onCustomQuote} className="btn btn-outline btn-lg" style={{ color: '#FFFFFF', borderColor: 'rgba(255,255,255,0.4)' }}>
              <Scissors size={18} color="var(--color-gold-light)" />
              <span>{t('hero.customCta')}</span>
            </button>
          </div>

          {/* Store Walk-in Callout */}
          <div className="hero-store-callout">
            <MapPin size={16} color="var(--color-gold)" style={{ flexShrink: 0 }} />
            <span>{t('hero.offlineNotice')}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
