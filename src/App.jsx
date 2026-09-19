import React, { useState, useEffect } from 'react';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ShopProvider, useShop } from './context/ShopContext';
import { OrderProvider } from './context/OrderContext';

// Common Components
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import WhatsAppWidget from './components/common/WhatsAppWidget';
import CartDrawer from './components/checkout/CartDrawer';

// Home Views
import HeroSection from './components/home/HeroSection';
import TrustBadges from './components/home/TrustBadges';
import CategoryGrid from './components/home/CategoryGrid';
import CraftsmanshipSection from './components/home/CraftsmanshipSection';
import HowItWorks from './components/home/HowItWorks';
import AboutPage from './components/home/AboutPage';
import ContactPage from './components/home/ContactPage';
import { BUSINESS_CONFIG } from './data/businessConfig';

// Shop & Product Views
import ShopView from './components/shop/ShopView';
import ProductDetailView from './components/product/ProductDetailView';
import ProductCard from './components/shop/ProductCard';
import WishlistView from './components/shop/WishlistView';

// Checkout & Quotes & Tracking
import CheckoutStepper from './components/checkout/CheckoutStepper';
import OrderConfirmation from './components/checkout/OrderConfirmation';
import CustomQuoteForm from './components/custom-quote/CustomQuoteForm';
import OrderTracker from './components/tracking/OrderTracker';
import TrackCustomBlousePage from './components/tracking/TrackCustomBlousePage';

// Authentication & Customer Portal
import LoginPage from './components/auth/LoginPage';
import SignUpPage from './components/auth/SignUpPage';
import ForgotPasswordModal from './components/auth/ForgotPasswordModal';
import AdminLoginPage from './components/auth/AdminLoginPage';
import CustomerDashboard from './components/account/CustomerDashboard';

// Admin Studio
import AdminDashboard from './components/admin/AdminDashboard';

import { Sparkles, ArrowRight, Scissors, ShieldAlert } from 'lucide-react';

function MainApp() {
  const { isTamil, t } = useLanguage();
  const { products, setIsCartOpen } = useShop();
  const { user, isAuthenticated, isAdmin, authRedirect, setAuthRedirect } = useAuth();

  // Navigation State
  const [currentView, setCurrentView] = useState('home');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [confirmedOrder, setConfirmedOrder] = useState(null);
  const [trackingOrderId, setTrackingOrderId] = useState('');
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);

  // Handle OAuth query param callback on mount
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const oauthToken = params.get('token');
      if (oauthToken) {
        localStorage.setItem('atchu_token', oauthToken);
        window.history.replaceState({}, document.title, window.location.pathname);
        window.location.reload();
      }
    } catch (e) {
      console.warn('OAuth query param parse issue', e);
    }
  }, []);

  // Scroll to top on view change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentView]);

  // Route protection guard for account
  useEffect(() => {
    if (currentView === 'account' && !isAuthenticated) {
      setAuthRedirect('account');
      setCurrentView('login');
    }
  }, [currentView, isAuthenticated, setAuthRedirect]);

  // Handle Product Detail Selection
  const handleOpenProduct = (product) => {
    setSelectedProduct(product);
    setCurrentView('product-detail');
  };

  // Handle Category selection from homepage
  const handleCategorySelect = () => {
    setCurrentView('shop');
  };

  // Order Success from Checkout
  const handleOrderSuccess = (order) => {
    setConfirmedOrder(order);
    setCurrentView('order-confirmation');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Universal Responsive Header */}
      <Header
        currentView={currentView}
        setCurrentView={(view) => {
          if (view === 'product-detail' && !selectedProduct) {
            setSelectedProduct(products[0]);
          }
          setCurrentView(view);
        }}
      />

      {/* Main View Router */}
      <main style={{ flexGrow: 1 }}>
        {/* VIEW 1: HOME */}
        {currentView === 'home' && (
          <>
            <HeroSection
              onExplore={() => setCurrentView('shop')}
              onCustomQuote={() => setCurrentView('custom-quote')}
            />

            {/* Prominent Track Your Custom Blouse CTA Bar */}
            <div style={{ background: '#FAF7F2', borderBottom: '1px solid var(--color-border)', padding: '16px 20px' }}>
              <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--color-gold-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Scissors size={18} color="var(--color-gold-dark)" />
                  </div>
                  <div>
                    <strong style={{ color: 'var(--color-primary-dark)', fontSize: '0.96rem' }}>
                      Track Your Custom Blouse
                    </strong>
                    <span style={{ fontSize: '0.84rem', color: 'var(--color-text-muted)', display: 'block' }}>
                      {isTamil ? 'உங்கள் பிளவுஸ் தையல் மற்றும் ஆரி நிலையை நேரலையாக காண்க' : 'Live updates across all 13 artisan milestones from cutting to dispatch'}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setCurrentView('track-blouse')}
                  className="btn btn-sm btn-gold"
                  style={{ borderRadius: '9999px', padding: '8px 20px', gap: '6px' }}
                >
                  <span>Track Blouse</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>

            <TrustBadges />

            <CategoryGrid onSelectCategory={handleCategorySelect} />

            {/* Featured Designs Showcase */}
            <section className="section-padding" style={{ background: '#FFFFFF', borderTop: '1px solid var(--color-border)' }}>
              <div className="container">
                <div className="section-header">
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                    <Sparkles size={16} color="var(--color-gold-dark)" />
                    <span className="section-eyebrow">
                      {isTamil ? 'சிறப்பு வடிவமைப்புக்கள்' : 'Boutique Highlights'}
                    </span>
                  </div>
                  <h2 className="section-title">
                    {isTamil ? 'பிரபலமான பிளவுஸ் மாடல்கள்' : 'Featured Blouse Creations'}
                  </h2>
                  <p className="section-subtitle">
                    {isTamil
                      ? 'மணப்பெண்களுக்காக சிறப்பாக உருவாக்கப்பட்ட தையல் மற்றும் ஆரி வேலைப்பாடுகள்.'
                      : 'Artisanal masterpieces crafted with authentic silk, zardosi, and precision fit.'}
                  </p>
                </div>

                <div className="products-grid">
                  {products.slice(0, 4).map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onSelectProduct={handleOpenProduct}
                    />
                  ))}
                </div>

                <div style={{ textAlign: 'center', marginTop: 'var(--space-48)' }}>
                  <button
                    className="btn btn-outline-gold btn-lg"
                    onClick={() => setCurrentView('shop')}
                  >
                    <span>{isTamil ? 'அனைத்து டிசைன்களையும் பார்க்க' : 'View All Collections'}</span>
                    <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            </section>

            <CraftsmanshipSection />

            <HowItWorks />

            {/* Custom Quote Callout Section */}
            <section
              style={{
                background: 'linear-gradient(135deg, #260A10 0%, #150508 100%)',
                color: '#FFFFFF',
                padding: 'var(--space-64) 0',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <div className="container" style={{ position: 'relative', zIndex: 2, textAlign: 'center', maxWidth: '780px' }}>
                <span className="hero-eyebrow" style={{ color: 'var(--color-gold-light)' }}>
                  {isTamil ? 'உங்கள் விருப்ப வடிவமைப்பு' : 'Have a Dream Saree & Design?'}
                </span>
                <h2 style={{ fontSize: '2.4rem', color: '#FFFFFF', marginBottom: 'var(--space-16)' }}>
                  {isTamil ? 'தனிப்பயன் பிளவுஸ் தைக்க வேண்டுமா?' : 'Request a Custom Blouse Quote'}
                </h2>
                <p style={{ fontSize: '1.05rem', color: '#E8DED6', lineHeight: 1.7, marginBottom: 'var(--space-32)' }}>
                  {isTamil
                    ? 'உங்கள் பட்டுப்புடவையின் போட்டோ அல்லது ஆரி வேலைப்பாடு மாதிரியை எங்களிடம் பகிருங்கள். எங்கள் தலைசிறந்த ஆரி கைவினைஞர்கள் துல்லியமாக மதிப்பிட்டு வழிகாட்டுவார்கள்.'
                    : 'Share your saree photos, sleeve embroidery references, or Pinterest design dreams. Our master artisans will tailor an exact quote with delivery timeline.'}
                </p>
                <div style={{ display: 'flex', gap: 'var(--space-16)', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <button
                    className="btn btn-gold btn-lg"
                    onClick={() => setCurrentView('custom-quote')}
                  >
                    <span>{isTamil ? 'கோரிக்கை அனுப்ப' : 'Submit Design Online'}</span>
                    <ArrowRight size={18} />
                  </button>
                  <a
                    href={BUSINESS_CONFIG.getWhatsAppUrl(BUSINESS_CONFIG.messages.generalOrder(isTamil))}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline btn-lg"
                    style={{ borderColor: 'rgba(255, 255, 255, 0.4)', color: '#FFFFFF' }}
                  >
                    <span>{isTamil ? 'வாட்ஸ்அப் ஆலோசனை' : 'WhatsApp Consultation'}</span>
                  </a>
                </div>
              </div>
            </section>
          </>
        )}

        {/* VIEW 2: SHOP CATALOG */}
        {currentView === 'shop' && (
          <ShopView
            onSelectProduct={handleOpenProduct}
            onExplore={() => setCurrentView('shop')}
          />
        )}

        {/* VIEW 3: BRIDAL CATEGORY */}
        {currentView === 'bridal' && (
          <ShopView
            initialCategory="bridal"
            onSelectProduct={handleOpenProduct}
          />
        )}

        {/* VIEW 4: AARI WORK CATEGORY */}
        {currentView === 'aari' && (
          <ShopView
            initialCategory="aari"
            onSelectProduct={handleOpenProduct}
          />
        )}

        {/* VIEW 5: PRODUCT DETAIL & CUSTOMIZER */}
        {currentView === 'product-detail' && selectedProduct && (
          <ProductDetailView
            product={selectedProduct}
            onBack={() => setCurrentView('shop')}
            onAddToCartSuccess={() => setIsCartOpen(true)}
          />
        )}

        {/* VIEW 6: CHECKOUT STEPPER */}
        {currentView === 'checkout' && (
          <CheckoutStepper
            onOrderSuccess={handleOrderSuccess}
          />
        )}

        {/* VIEW 7: ORDER CONFIRMATION */}
        {currentView === 'order-confirmation' && (
          <OrderConfirmation
            order={confirmedOrder}
            onTrackOrder={(id) => {
              setTrackingOrderId(id);
              setCurrentView('track-blouse');
            }}
            onContinueShopping={() => setCurrentView('home')}
          />
        )}

        {/* VIEW 8: CUSTOM QUOTE */}
        {currentView === 'custom-quote' && (
          <CustomQuoteForm
            onQuoteSubmitted={() => {
              setCurrentView('account');
            }}
          />
        )}

        {/* VIEW 9: TRACK YOUR CUSTOM BLOUSE (13-STAGE VERTICAL TIMELINE) */}
        {(currentView === 'track-blouse' || currentView === 'track-order') && (
          <TrackCustomBlousePage
            initialOrderId={trackingOrderId}
            onNavigate={setCurrentView}
          />
        )}

        {/* VIEW 10: CUSTOMER ACCOUNT DASHBOARD */}
        {currentView === 'account' && (
          <CustomerDashboard
            onNavigate={setCurrentView}
          />
        )}

        {/* VIEW 11: CUSTOMER LOGIN */}
        {currentView === 'login' && (
          <LoginPage
            onNavigate={(view) => {
              if (view === 'forgot-password') {
                setForgotPasswordOpen(true);
              } else {
                setCurrentView(view);
              }
            }}
            onLoginSuccess={(u) => {
              if (authRedirect) {
                const target = authRedirect;
                setAuthRedirect(null);
                setCurrentView(target);
              } else {
                setCurrentView(u.role === 'admin' ? 'admin' : 'account');
              }
            }}
          />
        )}

        {/* VIEW 12: CUSTOMER SIGN UP */}
        {currentView === 'signup' && (
          <SignUpPage
            onNavigate={setCurrentView}
            onSignUpSuccess={() => {
              if (authRedirect) {
                const target = authRedirect;
                setAuthRedirect(null);
                setCurrentView(target);
              } else {
                setCurrentView('account');
              }
            }}
          />
        )}

        {/* VIEW 13: ADMIN DEDICATED LOGIN */}
        {currentView === 'admin-login' && (
          <AdminLoginPage
            onNavigate={setCurrentView}
            onAdminLoginSuccess={() => setCurrentView('admin')}
          />
        )}

        {/* VIEW 14: WISHLIST */}
        {currentView === 'wishlist' && (
          <WishlistView
            onSelectProduct={handleOpenProduct}
            onExplore={() => setCurrentView('shop')}
          />
        )}

        {/* VIEW 15: ABOUT US */}
        {currentView === 'about' && (
          <AboutPage
            onExplore={() => setCurrentView('shop')}
            onCustomQuote={() => setCurrentView('custom-quote')}
          />
        )}

        {/* VIEW 16: CONTACT US */}
        {currentView === 'contact' && (
          <ContactPage />
        )}

        {/* VIEW 17: ADMIN STUDIO (PROTECTED) */}
        {currentView === 'admin' && (
          isAdmin ? (
            <AdminDashboard />
          ) : (
            <div className="container section-padding" style={{ textAlign: 'center', maxWidth: '500px' }}>
              <div style={{ background: '#FFFFFF', padding: '40px 24px', borderRadius: 'var(--radius-md)', border: '1px solid #FECDD3', boxShadow: 'var(--shadow-md)' }}>
                <ShieldAlert size={48} color="#DC2626" style={{ margin: '0 auto 16px' }} />
                <h2 style={{ color: '#991B1B', fontSize: '1.4rem', marginBottom: '10px' }}>
                  {isTamil ? 'அணுகல் மறுக்கப்பட்டது' : 'Access Restricted'}
                </h2>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.92rem', marginBottom: '24px' }}>
                  {isTamil
                    ? 'இந்த நிர்வாக பக்கத்தை அணுக உங்களிடம் அனுமதி இல்லை.'
                    : "You don't have permission to access this administrative workstation."}
                </p>
                <button
                  onClick={() => setCurrentView('admin-login')}
                  className="btn btn-primary"
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  {isTamil ? 'நிர்வாக உள்நுழைவு' : 'Go to Admin Login'}
                </button>
              </div>
            </div>
          )
        )}
      </main>

      {/* Cart Drawer Slideout */}
      <CartDrawer
        onProceedToCheckout={() => setCurrentView('checkout')}
      />

      {/* Persistent Floating WhatsApp Helper */}
      <WhatsAppWidget />

      {/* Universal Footer */}
      <Footer setCurrentView={setCurrentView} />

      {/* Forgot Password Modal */}
      <ForgotPasswordModal
        isOpen={forgotPasswordOpen}
        onClose={() => setForgotPasswordOpen(false)}
        onNavigate={setCurrentView}
      />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <ShopProvider>
          <OrderProvider>
            <MainApp />
          </OrderProvider>
        </ShopProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}
