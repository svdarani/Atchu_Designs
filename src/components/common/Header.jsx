import React, { useState, useEffect, useRef } from 'react';
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
  Type,
  User,
  Scissors,
  Package,
  Ruler,
  FileText,
  MapPin,
  LogOut,
  ChevronDown,
  ShieldCheck
} from 'lucide-react';

export default function Header({ currentView, setCurrentView }) {
  const { t, isTamil, englishFontPair, toggleEnglishFontPair } = useLanguage();
  const { cartItemCount, wishlist, setIsCartOpen, searchQuery, setSearchQuery } = useShop();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);

  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setAccountDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
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
    { id: 'track-blouse', label: isTamil ? 'பிளவுஸ் கண்காணிப்பு' : 'Track Your Custom Blouse', highlight: true },
    { id: 'bridal', label: t('nav.bridal') },
    { id: 'aari', label: t('nav.aari') },
    { id: 'custom-quote', label: t('nav.customOrder') },
    { id: 'about', label: t('nav.about') },
    { id: 'contact', label: t('nav.contact') }
  ];

  const handleNavClick = (viewId) => {
    setCurrentView(viewId);
    setMobileMenuOpen(false);
    setAccountDropdownOpen(false);
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

          {/* Right: Circle Icons, Divider & Account / Sign In */}
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

            {/* AUTHENTICATION STATE: Logged Out vs Logged In */}
            {isAuthenticated ? (
              <div style={{ position: 'relative' }} ref={dropdownRef} className="desktop-only-action">
                {/* My Account Button */}
                <button
                  className="pill-login-btn logged-in"
                  onClick={() => setAccountDropdownOpen(!accountDropdownOpen)}
                  style={{ gap: '7px', padding: '6px 14px', background: 'var(--color-gold-subtle)' }}
                  aria-expanded={accountDropdownOpen}
                >
                  <User size={15} color="var(--color-primary-dark)" />
                  <span>{isTamil ? 'என் கணக்கு' : 'My Account'}</span>
                  <ChevronDown size={13} />
                </button>

                {/* Account Dropdown Menu */}
                {accountDropdownOpen && (
                  <div
                    style={{
                      position: 'absolute',
                      right: 0,
                      top: 'calc(100% + 12px)',
                      width: '240px',
                      background: '#FFFFFF',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--color-border)',
                      boxShadow: 'var(--shadow-lg)',
                      padding: '10px',
                      zIndex: 150,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px'
                    }}
                    className="animate-fade-in"
                  >
                    {/* User Greeting */}
                    <div style={{ padding: '8px 12px 10px', borderBottom: '1px solid #EFE8E1', marginBottom: '4px' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-primary-dark)' }}>
                        {user?.name}
                      </div>
                      <div style={{ fontSize: '0.76rem', color: 'var(--color-text-muted)', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {user?.email}
                      </div>
                    </div>

                    {/* Prominent Track Your Custom Blouse Item */}
                    <button
                      onClick={() => handleNavClick('track-blouse')}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '10px 12px',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid rgba(197, 160, 89, 0.4)',
                        background: '#FAF7F2',
                        color: 'var(--color-primary-dark)',
                        fontWeight: 700,
                        fontSize: '0.86rem',
                        cursor: 'pointer',
                        textAlign: 'left'
                      }}
                    >
                      <Scissors size={16} color="var(--color-gold-dark)" />
                      <span>Track Your Custom Blouse</span>
                    </button>

                    {/* My Profile */}
                    <button
                      onClick={() => handleNavClick('account')}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '8px 12px',
                        borderRadius: 'var(--radius-sm)',
                        border: 'none',
                        background: 'transparent',
                        color: 'var(--color-text-main)',
                        fontSize: '0.86rem',
                        cursor: 'pointer',
                        textAlign: 'left'
                      }}
                    >
                      <User size={15} color="var(--color-text-muted)" />
                      <span>{isTamil ? 'சுயவிவரம்' : 'My Profile'}</span>
                    </button>

                    {/* My Orders */}
                    <button
                      onClick={() => handleNavClick('account')}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '8px 12px',
                        borderRadius: 'var(--radius-sm)',
                        border: 'none',
                        background: 'transparent',
                        color: 'var(--color-text-main)',
                        fontSize: '0.86rem',
                        cursor: 'pointer',
                        textAlign: 'left'
                      }}
                    >
                      <Package size={15} color="var(--color-text-muted)" />
                      <span>{isTamil ? 'என் ஆர்டர்கள்' : 'My Orders'}</span>
                    </button>

                    {/* Saved Measurements */}
                    <button
                      onClick={() => handleNavClick('account')}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '8px 12px',
                        borderRadius: 'var(--radius-sm)',
                        border: 'none',
                        background: 'transparent',
                        color: 'var(--color-text-main)',
                        fontSize: '0.86rem',
                        cursor: 'pointer',
                        textAlign: 'left'
                      }}
                    >
                      <Ruler size={15} color="var(--color-text-muted)" />
                      <span>{isTamil ? 'சேமிக்கப்பட்ட அளவுகள்' : 'Saved Measurements'}</span>
                    </button>

                    {/* Wishlist */}
                    <button
                      onClick={() => handleNavClick('wishlist')}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '8px 12px',
                        borderRadius: 'var(--radius-sm)',
                        border: 'none',
                        background: 'transparent',
                        color: 'var(--color-text-main)',
                        fontSize: '0.86rem',
                        cursor: 'pointer',
                        textAlign: 'left'
                      }}
                    >
                      <Heart size={15} color="var(--color-text-muted)" />
                      <span>{isTamil ? 'விருப்பங்கள்' : 'Wishlist'}</span>
                    </button>

                    {/* Custom Requests */}
                    <button
                      onClick={() => handleNavClick('account')}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '8px 12px',
                        borderRadius: 'var(--radius-sm)',
                        border: 'none',
                        background: 'transparent',
                        color: 'var(--color-text-main)',
                        fontSize: '0.86rem',
                        cursor: 'pointer',
                        textAlign: 'left'
                      }}
                    >
                      <FileText size={15} color="var(--color-text-muted)" />
                      <span>{isTamil ? 'விருப்ப கோரிக்கைகள்' : 'Custom Requests'}</span>
                    </button>

                    {/* Addresses */}
                    <button
                      onClick={() => handleNavClick('account')}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '8px 12px',
                        borderRadius: 'var(--radius-sm)',
                        border: 'none',
                        background: 'transparent',
                        color: 'var(--color-text-main)',
                        fontSize: '0.86rem',
                        cursor: 'pointer',
                        textAlign: 'left'
                      }}
                    >
                      <MapPin size={15} color="var(--color-text-muted)" />
                      <span>{isTamil ? 'முகவரிகள்' : 'Addresses'}</span>
                    </button>

                    {/* Admin Switcher if role is admin */}
                    {isAdmin && (
                      <button
                        onClick={() => handleNavClick('admin')}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '8px 12px',
                          borderRadius: 'var(--radius-sm)',
                          border: 'none',
                          background: 'var(--color-primary-subtle)',
                          color: 'var(--color-primary-dark)',
                          fontSize: '0.86rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          textAlign: 'left'
                        }}
                      >
                        <ShieldCheck size={15} color="var(--color-primary)" />
                        <span>{isTamil ? 'நிர்வாக பக்கம்' : 'Admin Studio'}</span>
                      </button>
                    )}

                    <div style={{ borderTop: '1px solid #EFE8E1', margin: '4px 0' }} />

                    {/* Sign Out */}
                    <button
                      onClick={() => {
                        logout();
                        setAccountDropdownOpen(false);
                        handleNavClick('home');
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '8px 12px',
                        borderRadius: 'var(--radius-sm)',
                        border: 'none',
                        background: 'transparent',
                        color: '#DC2626',
                        fontSize: '0.86rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        textAlign: 'left'
                      }}
                    >
                      <LogOut size={15} />
                      <span>{isTamil ? 'வெளியேறு' : 'Sign Out'}</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Logged Out State: Sign In Button */
              <button
                className="pill-login-btn desktop-only-action"
                onClick={() => handleNavClick('login')}
                title={isTamil ? 'கணக்கில் உள்நுழைக' : 'Sign In to Your Account'}
              >
                <span>{isTamil ? 'உள்நுழைக' : 'Sign In'}</span>
                <ArrowRight size={14} />
              </button>
            )}

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
              boxShadow: 'var(--shadow-lg)',
              overflowY: 'auto'
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

            {/* Mobile Authentication Summary */}
            {isAuthenticated ? (
              <div style={{ padding: '12px', background: '#FAF7F2', borderRadius: 'var(--radius-sm)', border: '1px solid #EAE3DC' }}>
                <div style={{ fontWeight: 700, color: 'var(--color-primary-dark)', fontSize: '0.9rem' }}>
                  {user?.name}
                </div>
                <div style={{ fontSize: '0.76rem', color: 'var(--color-text-muted)', marginBottom: '8px' }}>
                  {user?.email}
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => handleNavClick('account')}
                    className="btn btn-sm btn-primary"
                    style={{ flexGrow: 1, justifyContent: 'center' }}
                  >
                    {isTamil ? 'என் கணக்கு' : 'My Account'}
                  </button>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="btn btn-sm btn-outline"
                    style={{ color: '#DC2626' }}
                  >
                    {isTamil ? 'வெளியேறு' : 'Exit'}
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => handleNavClick('login')}
                className="btn btn-primary"
                style={{ width: '100%', justifyContent: 'center', gap: '8px' }}
              >
                <User size={16} />
                <span>{isTamil ? 'உள்நுழைக / கணக்கு தொடங்க' : 'Sign In / Register'}</span>
              </button>
            )}

            {/* Mobile Nav Links */}
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {allNavItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  style={{
                    textAlign: 'left',
                    padding: '10px 12px',
                    fontSize: '0.94rem',
                    fontWeight: currentView === item.id || item.highlight ? 700 : 500,
                    color: item.highlight ? 'var(--color-primary-dark)' : (currentView === item.id ? 'var(--color-primary)' : 'var(--color-text-main)'),
                    background: item.highlight ? '#FAF7F2' : (currentView === item.id ? 'var(--color-primary-subtle)' : 'transparent'),
                    borderRadius: 'var(--radius-sm)',
                    border: item.highlight ? '1px solid rgba(197, 160, 89, 0.4)' : 'none',
                    cursor: 'pointer'
                  }}
                >
                  {item.label}
                </button>
              ))}
            </nav>

            {/* Admin Studio Bridge */}
            <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid var(--color-border)' }}>
              <button
                className="btn btn-outline"
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                onClick={() => {
                  if (isAdmin) {
                    handleNavClick('admin');
                  } else {
                    handleNavClick('admin-login');
                  }
                }}
              >
                <ShieldCheck size={15} color="var(--color-gold-dark)" />
                <span>{isTamil ? 'டெய்லர் நிர்வாக பக்கம்' : 'Tailor Admin Studio'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
