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
  ShieldCheck,
  Moon,
  Sun,
  ArrowRight
} from 'lucide-react';

export default function Header({ currentView, setCurrentView }) {
  const { t, isTamil } = useLanguage();
  const { cartItemCount, wishlist, setIsCartOpen, searchQuery, setSearchQuery } = useShop();
  const { isAdmin, switchRole } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // Theme Mode (Light by default, can toggle to luxury Dark)
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('atchu_theme') || 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('atchu_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

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
    { id: 'custom-quote', label: t('nav.customOrder') },
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
      {/* Top Boutique Announcement Bar */}
      <div className="announcement-bar">
        <div className="announcement-inner">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>{t('announcement.text')}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <a
              href={BUSINESS_CONFIG.telLink}
              className="announcement-contact"
              title="Call Atchu Designs"
            >
              <Phone size={13} />
              <span>{BUSINESS_CONFIG.phone}</span>
            </a>

            {/* Admin Studio Toggle */}
            <button
              className="announcement-role-btn"
              onClick={() => {
                if (isAdmin) {
                  switchRole('customer');
                  setCurrentView('home');
                } else {
                  switchRole('admin');
                  setCurrentView('admin');
                }
              }}
              title="Switch to Tailor Studio or Customer Boutique"
            >
              <ShieldCheck size={13} />
              <span>
                {isAdmin
                  ? (isTamil ? 'நிர்வாகம் (Admin)' : 'Admin Mode')
                  : (isTamil ? 'டெய்லர் நிர்வாகம்' : 'Tailor Studio')}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Floating 3-Island Header (Segmented Navigation Bar) */}
      <header className={`site-header-floating ${isScrolled ? 'scrolled' : ''}`}>
        <div className="header-islands-row">
          {/* Island 1 (Left): Brand Logo + Circular Theme Toggle Button */}
          <div className="header-island header-island-left">
            <div
              className="island-logo-wrap"
              onClick={() => handleNavClick('home')}
              title="Atchu Designs - Stiching and Aari works"
            >
              <img
                src={BUSINESS_CONFIG.logoUrl}
                alt="Atchu Designs - Stiching and Aari works"
                className="island-logo-img"
              />
            </div>

            {/* Circular Theme Toggle Button (Moon in light mode, Sun in dark mode) */}
            <button
              className="island-circle-btn theme-toggle-btn"
              onClick={toggleTheme}
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
            </button>
          </div>

          {/* Island 2 (Center): Navigation Capsule with Active Pill Highlight */}
          <nav className="header-island header-island-center" aria-label="Main Navigation">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`island-nav-link ${currentView === item.id ? 'active' : ''}`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Island 3 (Right): Utilities & Start Your Project CTA */}
          <div className="header-island header-island-right">
            {/* Search Toggle */}
            <button
              className="island-circle-btn"
              onClick={() => setSearchOpen(!searchOpen)}
              title={t('nav.searchPlaceholder')}
              aria-label="Search"
            >
              <Search size={15} />
            </button>

            {/* Language Switcher Pill */}
            <LanguageSwitcher />

            {/* Wishlist */}
            <button
              className="island-circle-btn"
              onClick={() => handleNavClick('wishlist')}
              title={t('nav.wishlist')}
              aria-label="Wishlist"
            >
              <Heart size={15} color={wishlist.length > 0 ? 'var(--color-primary)' : 'currentColor'} />
              {wishlist.length > 0 && <span className="island-badge">{wishlist.length}</span>}
            </button>

            {/* Cart Button with Count Badge */}
            <button
              className="island-circle-btn"
              onClick={() => setIsCartOpen(true)}
              title={t('nav.cart')}
              aria-label="Shopping Bag"
            >
              <ShoppingBag size={15} color="var(--color-primary-dark)" />
              {cartItemCount > 0 && <span className="island-badge">{cartItemCount}</span>}
            </button>

            {/* Subtle Divider */}
            <div className="island-divider" />

            {/* Start Your Project Button (Matches screenshot's dynamic CTA) */}
            <button
              className="start-project-btn"
              onClick={() => handleNavClick('custom-quote')}
              title={isTamil ? "விருப்ப ஆர்டர் தொடங்க" : "Start Your Project"}
            >
              <div className="sp-badge">
                <div className="sp-top-line">
                  <span className="sp-word-start">{isTamil ? 'ஆர்டர்' : 'Start'}</span>
                  {!isTamil && <span className="sp-your">Your</span>}
                </div>
                <div className="sp-bottom-line">{isTamil ? 'தொடங்க' : 'Project'}</div>
              </div>
              <ArrowRight size={17} className="sp-arrow" />
            </button>

            {/* Mobile Menu Toggle (Visible on smaller viewports) */}
            <button
              className="island-circle-btn mobile-only-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Menu"
              style={{ display: 'none' }}
            >
              {mobileMenuOpen ? <X size={17} /> : <Menu size={17} />}
            </button>
          </div>
        </div>

        {/* Floating Dropdown Search Bar */}
        {searchOpen && (
          <div className="floating-search-wrap animate-fade-in">
            <div className="floating-search-pill">
              <Search size={17} color="var(--color-gold-dark)" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (currentView !== 'shop') setCurrentView('shop');
                }}
                placeholder={t('nav.searchPlaceholder')}
                className="floating-search-input"
                autoFocus
              />
              <button
                className="floating-search-close"
                onClick={() => setSearchOpen(false)}
                aria-label="Close search"
              >
                ✕
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Mobile Drawer Menu Modal */}
      {mobileMenuOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1100,
            background: 'rgba(20, 10, 14, 0.65)',
            backdropFilter: 'blur(8px)',
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
              background: 'var(--color-surface)',
              padding: 'var(--space-24)',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-16)',
              boxShadow: 'var(--shadow-lg)'
            }}
            onClick={(e) => e.stopPropagation()}
            className="animate-fade-in"
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '12px', borderBottom: '1px solid var(--color-border)' }}>
              <img
                src={BUSINESS_CONFIG.logoUrl}
                alt="Atchu Designs"
                style={{ height: '34px', width: 'auto', objectFit: 'contain' }}
              />
              <button
                className="island-circle-btn"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu"
              >
                <X size={16} />
              </button>
            </div>

            <div style={{ padding: '4px 0', display: 'flex', gap: '8px', alignItems: 'center' }}>
              <LanguageSwitcher />
              <button
                className="island-circle-btn"
                onClick={toggleTheme}
                title="Toggle Theme"
              >
                {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
              </button>
            </div>

            <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '10px' }}>
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`island-nav-link ${currentView === item.id ? 'active' : ''}`}
                  style={{
                    textAlign: 'left',
                    padding: '12px 16px',
                    fontSize: '1rem',
                    width: '100%'
                  }}
                >
                  {item.label}
                </button>
              ))}
            </nav>

            <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', paddingTop: '16px', borderTop: '1px solid var(--color-border)' }}>
              <button
                className="btn btn-primary"
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                onClick={() => handleNavClick('custom-quote')}
              >
                <span>{isTamil ? 'விருப்ப ஆர்டர் தொடங்க' : 'Start Your Project'}</span>
                <ArrowRight size={16} />
              </button>

              <button
                className="btn btn-outline"
                style={{ width: '100%', fontSize: '0.84rem' }}
                onClick={() => {
                  switchRole(isAdmin ? 'customer' : 'admin');
                  setCurrentView(isAdmin ? 'home' : 'admin');
                  setMobileMenuOpen(false);
                }}
              >
                {isAdmin
                  ? (isTamil ? 'வாடிக்கையாளர் பக்கம்' : 'Customer Boutique')
                  : (isTamil ? 'டெய்லர் நிர்வாகி பக்கம்' : 'Tailor Admin Studio')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
