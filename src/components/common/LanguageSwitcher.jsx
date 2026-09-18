import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Globe } from 'lucide-react';

export default function LanguageSwitcher({ className = '' }) {
  const { lang, toggleLang, isTamil } = useLanguage();

  return (
    <button
      onClick={toggleLang}
      className={`lang-switcher-btn ${className}`}
      title={isTamil ? 'Switch to English' : 'தமிழுக்கு மாறவும்'}
      aria-label="Switch Language / மொழி மாற்று"
    >
      <Globe size={15} color="var(--color-gold-dark)" />
      <span className={!isTamil ? 'lang-active-pill' : 'lang-inactive-pill'}>EN</span>
      <span style={{ color: 'var(--color-border)', margin: '0 1px' }}>|</span>
      <span className={isTamil ? 'lang-active-pill' : 'lang-inactive-pill'}>தமிழ்</span>
    </button>
  );
}
