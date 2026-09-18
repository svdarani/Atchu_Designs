import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useShop } from '../../context/ShopContext';
import { useAuth } from '../../context/AuthContext';
import LanguageSwitcher from './LanguageSwitcher';
import {
  ShoppingBag,
  Heart,
  Search,
  Menu,
  X,
  Sparkles,
  Phone,
  Scissors,
  ShieldCheck,
  UserCheck,
  Type
} from 'lucide-react';

export default function Header({ currentView, setCurrentView }) {
  const { t, isTamil, englishFontPair, toggleEnglishFontPair } = useLanguage();
  const { cartItemCount, wishlist, setIsCartOpen, searchQuery, setSearchQuery } = useShop();
  const { isAdmin, switchRole } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'home', label: t('nav.home') },
    { id: 'shop', label: t('nav.shop') },
    { id: 'bridal', label: t('nav.bridal') },
    { id: 'aari', label: t('nav.aari') },
    { id: 'custom-quote', label: t('nav.customOrder') },
    { id: 'track-order', label: t('nav.trackOrder') },
    { id: 'about', label: t('nav.about') }
  ];

  const handleNavClick = (viewId) => {
    setCurrentView(viewId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Top Announcement Bar */}
      <div className="announcement-bar">
        <div className="announcement-inner">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>{t('announcement.text')}</span>
          </div>
          <a
            href="https://wa.me/919876543210"
            target="_blank"
            rel="noopener noreferrer"
            className="announcement-contact"
          >
            <Phone size={13} />
            <span>+91 98765 43210</span>
          </a>
        </div>
      </div>

      {/* Main Sticky Header */}
      <header className={`site-header ${isScrolled ? 'scrolled' : ''}`}>
        <div className="container">
          <div className="header-inner">
            {/* Left: Brand Logo */}
            <div
              className="brand-logo"
              onClick={() => handleNavClick('home')}
              style={{ cursor: 'pointer' }}
            >
              <div className="brand-emblem">
                <Scissors size={22} />
              </div>
              <div className="brand-text-col">
                <span className="brand-name">
                  {isTamil ? 'ஆச்சு' : 'AATCHU'}
                </span>
                <span className="brand-tagline">
                  {isTamil ? 'மணப்பெண் பிளவுஸ் & ஆரி' : 'BRIDAL COUTURE & AARI'}
                </span>
              </div>
            </div>

            {/* Center: Desktop Navigation Links */}
            <nav className="desktop-nav" aria-label="Main Navigation">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`nav-link ${currentView === item.id ? 'active' : ''}`}
                >
                  {item.label}
                </button>
              ))}
            </nav>

            {/* Right: Actions, Language Switcher, Admin Toggle, Cart */}
            <div className="header-actions">
              {/* Search Toggle */}
              <button
                className="action-icon-btn"
                onClick={() => setSearchOpen(!searchOpen)}
                title={t('nav.searchPlaceholder')}
                aria-label="Search"
              >
                <Search size={19} />
              </button>

              {/* Language Switcher Button */}
              <LanguageSwitcher />

              {/* English Font Pairing Toggle */}
              {!isTamil && (
                <button
                  onClick={toggleEnglishFontPair}
                  className="role-toggle-pill"
                  title="Toggle between Canela Bold + Avenir & Bodoni + Open Sans"
                  style={{
                    fontSize: '0.74rem',
                    padding: '5px 11px',
                    background: 'var(--color-surface-subtle)',
                    border: '1px solid var(--color-border)'
                  }}
                >
                  <Type size={13} color="var(--color-gold-dark)" />
                  <span>{englishFontPair === 'canela-avenir' ? 'Canela + Avenir' : 'Bodoni + Open Sans'}</span>
                </button>
              )}

              {/* Wishlist */}
              <button
                className="action-icon-btn"
                onClick={() => handleNavClick('wishlist')}
                title={t('nav.wishlist')}
                aria-label="Wishlist"
              >
                <Heart size={20} color={wishlist.length > 0 ? 'var(--color-primary)' : 'currentColor'} />
                {wishlist.length > 0 && <span className="action-badge">{wishlist.length}</span>}
              </button>

              {/* Cart Button */}
              <button
                className="action-icon-btn"
                onClick={() => setIsCartOpen(true)}
                title={t('nav.cart')}
                aria-label="Cart"
                style={{ background: 'var(--color-gold-subtle)' }}
              >
                <ShoppingBag size={20} color="var(--color-primary-dark)" />
                {cartItemCount > 0 && <span className="action-badge">{cartItemCount}</span>}
              </button>

              {/* Role Switcher Pill: Customer vs Boutique Owner Studio */}
              <button
                className={`role-toggle-pill ${isAdmin ? 'admin-active' : ''}`}
                onClick={() => {
                  if (isAdmin) {
                    switchRole('customer');
                    setCurrentView('home');
                  } else {
                    switchRole('admin');
                    setCurrentView('admin');
                  }
                }}
                title="Switch between Customer Boutique and Tailor Admin Studio"
              >
                {isAdmin ? (
                  <>
                    <ShieldCheck size={14} />
                    <span>{isTamil ? 'நிர்வாகம்' : 'Admin'}</span>
                  </>
                ) : (
                  <>
                    <UserCheck size={14} />
                    <span>{isTamil ? 'உரிமையாளர்' : 'Tailor Studio'}</span>
                  </>
                )}
              </button>

              {/* Mobile Menu Toggle Button */}
              <button
                className="action-icon-btn mobile-only"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle Menu"
                style={{ display: 'none' }}
              >
                {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>

          {/* Collapsible Search Input Bar */}
          {searchOpen && (
            <div
              style={{
                padding: '12px 0',
                borderTop: '1px solid var(--color-border)',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}
              className="animate-fade-in"
            >
              <Search size={18} color="var(--color-gold-dark)" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (currentView !== 'shop') setCurrentView('shop');
                }}
                placeholder={t('nav.searchPlaceholder')}
                className="input-styled"
                autoFocus
                style={{ flexGrow: 1 }}
              />
              <button
                className="btn btn-sm btn-outline"
                onClick={() => setSearchOpen(false)}
              >
                {t('common.close')}
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99,
            background: 'rgba(32, 26, 24, 0.6)',
            display: 'flex',
            justifyContent: 'flex-start'
          }}
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            style={{
              width: '82%',
              maxWidth: '320px',
              height: '100%',
              background: '#FFFFFF',
              padding: 'var(--space-24)',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-16)',
              boxShadow: 'var(--shadow-lg)'
            }}
            onClick={(e) => e.stopPropagation()}
            className="animate-fade-in"
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="brand-logo">
                <div className="brand-emblem" style={{ width: 36, height: 36 }}>
                  <Scissors size={18} />
                </div>
                <span className="brand-name" style={{ fontSize: '1.2rem' }}>
                  {isTamil ? 'ஆச்சு' : 'AATCHU'}
                </span>
              </div>
              <button onClick={() => setMobileMenuOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <div style={{ padding: '8px 0', borderBottom: '1px solid var(--color-border)', display: 'flex', gap: '8px', alignItems: 'center' }}>
              <LanguageSwitcher />
              {!isTamil && (
                <button
                  onClick={toggleEnglishFontPair}
                  className="role-toggle-pill"
                  style={{ fontSize: '0.74rem', padding: '5px 10px', background: 'var(--color-surface-subtle)' }}
                >
                  <Type size={13} color="var(--color-gold-dark)" />
                  <span>{englishFontPair === 'canela-avenir' ? 'Canela + Avenir' : 'Bodoni + Open Sans'}</span>
                </button>
              )}
            </div>

            <nav style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  style={{
                    textAlign: 'left',
                    padding: '10px 0',
                    fontSize: '1rem',
                    fontWeight: currentView === item.id ? 700 : 500,
                    color: currentView === item.id ? 'var(--color-primary)' : 'var(--color-text-main)',
                    borderBottom: '1px solid var(--color-border-subtle)'
                  }}
                >
                  {item.label}
                </button>
              ))}
            </nav>

            <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid var(--color-border)' }}>
              <button
                className="btn btn-primary"
                style={{ width: '100%' }}
                onClick={() => {
                  switchRole(isAdmin ? 'customer' : 'admin');
                  setCurrentView(isAdmin ? 'home' : 'admin');
                  setMobileMenuOpen(false);
                }}
              >
                {isAdmin ? (isTamil ? 'வாடிக்கையாளர் பக்கம்' : 'Customer Boutique') : (isTamil ? 'டெய்லர் நிர்வாகி பக்கம்' : 'Tailor Admin Studio')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
