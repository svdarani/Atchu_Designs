import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useShop } from '../../context/ShopContext';
import { useAuth } from '../../context/AuthContext';
import { BUSINESS_CONFIG } from '../../data/businessConfig';
import LanguageSwitcher from './LanguageSwitcher';
import {
  ShoppingBag,
  Heart,
  Search,
  Menu,
  X,
  Phone,
  ArrowRight,
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

  // 5 primary centered nav items matching design
  const desktopNavItems = [
    { id: 'home', label: t('nav.home') },
    { id: 'shop', label: t('nav.shop') },
    { id: 'custom-quote', label: t('nav.customOrder') },
    { id: 'about', label: t('nav.about') },
    { id: 'contact', label: t('nav.contact') }
  ];

  // Full nav items for mobile drawer
  const allNavItems = [
    { id: 'home', label: t('nav.home') },
    { id: 'shop', label: t('nav.shop') },
    { id: 'bridal', label: t('nav.bridal') },
    { id: 'aari', label: t('nav.aari') },
    { id: 'custom-quote', label: t('nav.customOrder') },
    { id: 'track-order', label: t('nav.trackOrder') },
    { id: 'about', label: t('nav.about') },
    { id: 'contact', label: t('nav.contact') }
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
            href={BUSINESS_CONFIG.telLink}
            className="announcement-contact"
            title="Call Atchu Designs"
          >
            <Phone size={13} />
            <span>{BUSINESS_CONFIG.phone}</span>
          </a>
        </div>
      </div>

      {/* Main Centered Floating Pill Header */}
      <header className={`site-header ${isScrolled ? 'scrolled' : ''}`}>
        <div className="header-pill">
          {/* Left: Brand Logo & Language Switcher Pill */}
          <div className="header-pill-left">
            <div
              className="header-pill-logo"
              onClick={() => handleNavClick('home')}
              title="Atchu Designs - Stiching and Aari works"
            >
              <img
                src={BUSINESS_CONFIG.logoUrl}
                alt="Atchu Designs - Stiching and Aari works"
              />
            </div>
            <LanguageSwitcher />
          </div>

          {/* Center: Navigation Links */}
          <nav className="header-pill-nav" aria-label="Main Navigation">
            {desktopNavItems.map((item) => {
              const isActive =
                currentView === item.id ||
                (item.id === 'shop' && (currentView === 'bridal' || currentView === 'aari' || currentView === 'product-detail'));
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`pill-nav-link ${isActive ? 'active' : ''}`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right: Circle Icons, Divider & Login */}
          <div className="header-pill-actions">
            {/* Search Button */}
            <button
              className="pill-icon-btn"
              onClick={() => setSearchOpen(!searchOpen)}
              title={t('nav.searchPlaceholder')}
              aria-label="Search"
            >
              <Search size={16} />
            </button>

            {/* Wishlist Button */}
            <button
              className="pill-icon-btn"
              onClick={() => handleNavClick('wishlist')}
              title={t('nav.wishlist')}
              aria-label="Wishlist"
            >
              <Heart size={16} color={wishlist.length > 0 ? 'var(--color-primary)' : 'currentColor'} />
              {wishlist.length > 0 && <span className="pill-icon-badge">{wishlist.length}</span>}
            </button>

            {/* Cart Button */}
            <button
              className="pill-icon-btn"
              onClick={() => setIsCartOpen(true)}
              title={t('nav.cart')}
              aria-label="Cart"
            >
              <ShoppingBag size={16} />
              {cartItemCount > 0 && <span className="pill-icon-badge">{cartItemCount}</span>}
            </button>

            {/* Divider */}
            <div className="pill-actions-divider desktop-only-action" />

            {/* Login / Studio Role Button */}
            <button
              className={`pill-login-btn desktop-only-action ${isAdmin ? 'logged-in' : ''}`}
              onClick={() => {
                if (isAdmin) {
                  switchRole('customer');
                  setCurrentView('home');
                } else {
                  switchRole('admin');
                  setCurrentView('admin');
                }
              }}
              title={isAdmin ? (isTamil ? 'வாடிக்கையாளர் பக்கம் மாறவும்' : 'Switch to Customer View') : (isTamil ? 'டெய்லர் லாகின்' : 'Boutique Tailor Login')}
            >
              <span>{isAdmin ? (isTamil ? 'நிர்வாகம்' : 'Studio') : (isTamil ? 'Login' : 'Login')}</span>
              <ArrowRight size={14} />
            </button>

            {/* Mobile Menu Button */}
            <button
              className="pill-icon-btn pill-mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Floating Search Bar */}
        {searchOpen && (
          <div className="header-search-floating animate-fade-in">
            <Search size={16} color="var(--color-gold-dark)" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (currentView !== 'shop') setCurrentView('shop');
              }}
              placeholder={t('nav.searchPlaceholder')}
              className="pill-search-input"
              autoFocus
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888', padding: '2px' }}
                aria-label="Clear search"
              >
                <X size={15} />
              </button>
            )}
            <button
              className="pill-search-close"
              onClick={() => setSearchOpen(false)}
            >
              {t('common.close')}
            </button>
          </div>
        )}
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 199,
            background: 'rgba(32, 26, 24, 0.6)',
            display: 'flex',
            justifyContent: 'flex-start'
          }}
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            style={{
              width: '85%',
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
              <div
                onClick={() => handleNavClick('home')}
                style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                title="Atchu Designs - Stiching and Aari works"
              >
                <img
                  src={BUSINESS_CONFIG.logoUrl}
                  alt="Atchu Designs - Stiching and Aari works"
                  style={{
                    height: '32px',
                    width: 'auto',
                    maxWidth: '140px',
                    objectFit: 'contain',
                    display: 'block'
                  }}
                />
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu"
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ padding: '8px 0', borderBottom: '1px solid var(--color-border)', display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
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

            <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px', overflowY: 'auto' }}>
              {allNavItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  style={{
                    textAlign: 'left',
                    padding: '10px 12px',
                    fontSize: '0.96rem',
                    fontWeight: currentView === item.id ? 700 : 500,
                    color: currentView === item.id ? 'var(--color-primary)' : 'var(--color-text-main)',
                    background: currentView === item.id ? 'var(--color-primary-subtle)' : 'transparent',
                    borderRadius: 'var(--radius-sm)',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  {item.label}
                </button>
              ))}
            </nav>

            <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid var(--color-border)' }}>
              <button
                className="btn btn-primary"
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                onClick={() => {
                  switchRole(isAdmin ? 'customer' : 'admin');
                  setCurrentView(isAdmin ? 'home' : 'admin');
                  setMobileMenuOpen(false);
                }}
              >
                <span>{isAdmin ? (isTamil ? 'வாடிக்கையாளர் பக்கம்' : 'Customer Boutique') : (isTamil ? 'டெய்லர் நிர்வாகி பக்கம்' : 'Login / Tailor Studio')}</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
