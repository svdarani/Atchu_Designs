import React, { useState, useEffect } from 'react';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ShopProvider, useShop } from './context/ShopContext';
import { OrderProvider, useOrders } from './context/OrderContext';

// Components
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

// Admin Studio
import AdminDashboard from './components/admin/AdminDashboard';

import { Sparkles, ArrowRight } from 'lucide-react';

function MainApp() {
  const { isTamil, t } = useLanguage();
  const { products, setIsCartOpen } = useShop();
  const { isAdmin } = useAuth();

  // Navigation State
  const [currentView, setCurrentView] = useState('home');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [confirmedOrder, setConfirmedOrder] = useState(null);
  const [trackingOrderId, setTrackingOrderId] = useState('');

  // Scroll to top on view change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentView]);

  // Handle Product Detail Selection
  const handleOpenProduct = (product) => {
    setSelectedProduct(product);
    setCurrentView('product-detail');
  };

  // Handle Category selection from homepage
  const handleCategorySelect = (catId) => {
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
                    {isTamil ? 'அதிகம் விரும்பப்படும் மணப்பெண் பிளவுஸ்கள்' : 'Cherished Bridal Masterpieces'}
                  </h2>
                  <p className="section-desc">
                    {isTamil
                      ? 'எங்கள் ஸ்டுடியோவில் கைவினைக் கலைஞர்களால் தையல் செய்யப்பட்ட சிறந்த மாடல்கள்.'
                      : 'Handcrafted with antique zardosi, authentic zari wire and tailored for your dream muhurtham.'}
                  </p>
                </div>

                <div className="products-grid">
                  {products.slice(0, 3).map((prod) => (
                    <ProductCard
                      key={prod.id}
                      product={prod}
                      onSelectProduct={handleOpenProduct}
                      onQuickCustomize={handleOpenProduct}
                    />
                  ))}
                </div>

                <div style={{ textAlign: 'center', marginTop: 'var(--space-40)' }}>
                  <button
                    onClick={() => setCurrentView('shop')}
                    className="btn btn-gold btn-lg"
                  >
                    <span>{isTamil ? 'அனைத்து பிளவுஸ்களையும் பார்க்க' : 'Explore All Blouse Designs'}</span>
                    <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            </section>

            <CraftsmanshipSection />

            <HowItWorks />

            {/* Custom Quote Callout Section */}
            <section style={{ background: 'linear-gradient(135deg, var(--color-primary-dark) 0%, var(--color-primary) 100%)', color: '#FFFFFF', padding: 'var(--space-64) 0', textAlign: 'center' }}>
              <div className="container-narrow">
                <span style={{ fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--color-gold-light)' }}>
                  {isTamil ? 'உங்கள் விருப்பப் படம் உள்ளதா?' : 'Have Your Own Reference Image?'}
                </span>
                <h2 style={{ fontSize: '2.5rem', color: '#FFFFFF', margin: '12px 0 16px', lineHeight: 1.25 }}>
                  {isTamil
                    ? 'இன்ஸ்டாகிராம் அல்லது சொந்த புகைப்படத்தின்படி பிளவுஸ் தைக்க வேண்டுமா?'
                    : 'Transform Your Saved Instagram Post into a Bespoke Blouse'}
                </h2>
                <p style={{ color: '#E8DCD4', fontSize: '1.05rem', lineHeight: 1.6, marginBottom: 'var(--space-32)', maxWidth: '640px', margin: '0 auto var(--space-32)' }}>
                  {isTamil
                    ? 'புகைப்படத்தை பதிவேற்றுங்கள். எங்கள் தலைமை ஆரி கலைஞர் 4 மணி நேரத்திற்குள் சரியான மதிப்பீட்டை வழங்குவார்.'
                    : 'Upload your photo. Our master artisan will analyze the zardosi intricacy and send you an itemized tailoring quote.'}
                </p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => setCurrentView('custom-quote')}
                    className="btn btn-gold btn-lg"
                  >
                    <span>{isTamil ? 'படத்தை பதிவேற்றி விலை கேட்க' : 'Request Custom Blouse Quote'}</span>
                    <ArrowRight size={18} />
                  </button>
                  <a
                    href={BUSINESS_CONFIG.getWhatsAppUrl(BUSINESS_CONFIG.messages.customOrder(isTamil))}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline btn-lg"
                    style={{ color: '#FFFFFF', borderColor: 'rgba(255,255,255,0.4)' }}
                  >
                    <span>{isTamil ? 'வாட்ஸ்அப்பில் ஆலோசனை' : 'WhatsApp Consultation'}</span>
                  </a>
                </div>
              </div>
            </section>
          </>
        )}

        {/* VIEW 2: SHOP / CATALOG */}
        {currentView === 'shop' && (
          <ShopView
            initialCategory="all"
            onSelectProduct={handleOpenProduct}
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
              setCurrentView('track-order');
            }}
            onContinueShopping={() => setCurrentView('home')}
          />
        )}

        {/* VIEW 8: CUSTOM QUOTE (FLOW B) */}
        {currentView === 'custom-quote' && (
          <CustomQuoteForm
            onQuoteSubmitted={(newQuote) => {}}
          />
        )}

        {/* VIEW 9: ORDER TRACKER */}
        {currentView === 'track-order' && (
          <OrderTracker initialOrderId={trackingOrderId} />
        )}

        {/* VIEW 10: WISHLIST */}
        {currentView === 'wishlist' && (
          <WishlistView
            onSelectProduct={handleOpenProduct}
            onExplore={() => setCurrentView('shop')}
          />
        )}

        {/* VIEW 11: ABOUT US */}
        {currentView === 'about' && (
          <AboutPage
            onExplore={() => setCurrentView('shop')}
            onCustomQuote={() => setCurrentView('custom-quote')}
          />
        )}

        {/* VIEW 12: CONTACT US */}
        {currentView === 'contact' && (
          <ContactPage />
        )}

        {/* VIEW 13: ADMIN STUDIO */}
        {currentView === 'admin' && (
          <AdminDashboard />
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
