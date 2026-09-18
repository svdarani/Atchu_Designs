import React, { createContext, useContext, useState, useEffect } from 'react';
import en from '../locales/en.json';
import ta from '../locales/ta.json';

const LanguageContext = createContext();

const translations = { en, ta };

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(() => {
    try {
      const saved = localStorage.getItem('atchu_lang');
      return saved === 'ta' ? 'ta' : 'en';
    } catch {
      return 'en';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('atchu_lang', lang);
    } catch (e) {
      console.warn('Storage unavailable', e);
    }
    
    // Update HTML attributes and class for typography styling
    document.documentElement.lang = lang;
    if (lang === 'ta') {
      document.body.classList.add('lang-ta');
    } else {
      document.body.classList.remove('lang-ta');
    }
  }, [lang]);

  const [englishFontPair, setEnglishFontPair] = useState(() => {
    try {
      return localStorage.getItem('atchu_en_font') || 'canela-avenir';
    } catch {
      return 'canela-avenir';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('atchu_en_font', englishFontPair);
    } catch (e) {
      console.warn('Storage unavailable', e);
    }
    document.documentElement.setAttribute('data-font-pair', englishFontPair);
  }, [englishFontPair]);

  const toggleEnglishFontPair = () => {
    setEnglishFontPair((prev) => (prev === 'canela-avenir' ? 'bodoni-opensans' : 'canela-avenir'));
  };

  const toggleLang = () => {
    setLangState((prev) => (prev === 'en' ? 'ta' : 'en'));
  };

  const setLang = (newLang) => {
    if (newLang === 'en' || newLang === 'ta') {
      setLangState(newLang);
    }
  };

  // Helper translation function with dot notation & placeholder support
  const t = (path, params = {}) => {
    const keys = path.split('.');
    let current = translations[lang];

    for (const key of keys) {
      if (current && typeof current === 'object' && key in current) {
        current = current[key];
      } else {
        // Fallback to English if translation is missing in Tamil
        let fallback = translations.en;
        for (const fbKey of keys) {
          if (fallback && typeof fallback === 'object' && fbKey in fallback) {
            fallback = fallback[fbKey];
          } else {
            return path;
          }
        }
        current = fallback;
        break;
      }
    }

    if (typeof current === 'string') {
      let result = current;
      Object.entries(params).forEach(([paramKey, value]) => {
        result = result.replace(new RegExp(`{{${paramKey}}}`, 'g'), value);
      });
      return result;
    }

    return current || path;
  };

  return (
    <LanguageContext.Provider value={{ lang, toggleLang, setLang, t, isTamil: lang === 'ta', englishFontPair, setEnglishFontPair, toggleEnglishFontPair }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
