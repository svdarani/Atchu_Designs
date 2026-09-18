import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useShop } from '../../context/ShopContext';
import { useOrders, ORDER_STAGES } from '../../context/OrderContext';
import { BUSINESS_CONFIG } from '../../data/businessConfig';
import AdminOfflineOrderModal from './AdminOfflineOrderModal';
import AdminProductModal from './AdminProductModal';
import AdminQuoteModal from './AdminQuoteModal';
import {
  Store,
  Plus,
  Package,
  Clock,
  CheckCircle,
  CreditCard,
  Ruler,
  Calculator,
  MessageCircle,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Sliders,
  Phone,
  Mail,
  MapPin,
  Award
} from 'lucide-react';

export default function AdminDashboard() {
  const { isTamil, t } = useLanguage();
  const { products, deleteProduct } = useShop();
  const { orders, quotes, updateOrderStatus, verifyPayment } = useOrders();

  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'products' | 'quotes' | 'payments' | 'measurements'
  const [offlineModalOpen, setOfflineModalOpen] = useState(false);
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [selectedQuoteForBuild, setSelectedQuoteForBuild] = useState(null);
  const [selectedMeasurementsView, setSelectedMeasurementsView] = useState(null);

  // KPIs
  const todayCount = orders.length;
  const inProductionCount = orders.filter((o) =>
    ['stitching_started', 'aari_work', 'finishing', 'quality_check'].includes(o.productionStatus)
  ).length;
  const pendingPaymentCount = orders.filter((o) => o.paymentStatus !== 'paid').length;
  const pendingQuotesCount = quotes.filter((q) => q.status === 'pending_review').length;
  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  // Order stage progression helper
  const handleAdvanceStatus = (orderId, currentStatus) => {
    const currentIndex = ORDER_STAGES.findIndex((s) => s.id === currentStatus);
    if (currentIndex < ORDER_STAGES.length - 1) {
      const nextStage = ORDER_STAGES[currentIndex + 1].id;
      updateOrderStatus(orderId, nextStage);
    }
  };

  return (
    <div className="admin-wrapper">
      <div className="container">
        {/* Admin Header */}
        <div className="admin-header-row">
          <div className="admin-title-group" style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <div style={{ background: '#FFFFFF', padding: '6px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border-gold)' }}>
              <img
                src={BUSINESS_CONFIG.logoUrl}
                alt="Atchu Designs"
                style={{ height: '40px', width: 'auto', maxWidth: '160px', objectFit: 'contain', display: 'block' }}
              />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="badge badge-gold">{isTamil ? 'உரிமையாளர் ஸ்டுடியோ' : 'Owner Atelier'}</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{BUSINESS_CONFIG.businessSubtitle}</span>
              </div>
              <h1 style={{ fontSize: '1.6rem', margin: '4px 0 0' }}>{t('admin.title')}</h1>
            </div>
          </div>

          <div className="admin-actions-bar">
            <button
              onClick={() => setOfflineModalOpen(true)}
              className="btn btn-gold"
            >
              <Store size={17} />
              <span>{isTamil ? '+ கடை நேரடி ஆர்டர்' : '+ Create Walk-in Order'}</span>
            </button>
            <button
              onClick={() => setProductModalOpen(true)}
              className="btn btn-primary"
            >
              <Plus size={17} />
              <span>{isTamil ? '+ புதிய பிளவுஸ் மாடல்' : '+ Add Product'}</span>
            </button>
          </div>
        </div>

        {/* Top KPI Analytics Cards */}
        <div className="kpi-grid">
          <div className="kpi-card">
            <span className="kpi-label">{t('admin.metrics.todayOrders')}</span>
            <span className="kpi-value">{todayCount}</span>
            <span className="kpi-sub">{isTamil ? 'ஆன்லைன் + கடை நேரடி' : 'Online & In-store'}</span>
          </div>
          <div className="kpi-card">
            <span className="kpi-label">{t('admin.metrics.inProduction')}</span>
            <span className="kpi-value" style={{ color: 'var(--color-warning)' }}>
              {inProductionCount}
            </span>
            <span className="kpi-sub">{isTamil ? 'ஆரி & தையல் நிலையில்' : 'On Wooden Frames'}</span>
          </div>
          <div className="kpi-card">
            <span className="kpi-label">{t('admin.metrics.pendingPayments')}</span>
            <span className="kpi-value" style={{ color: 'var(--color-danger)' }}>
              {pendingPaymentCount}
            </span>
            <span className="kpi-sub">{isTamil ? 'சரிபார்க்க வேண்டியவை' : 'Awaiting Confirmation'}</span>
          </div>
          <div className="kpi-card">
            <span className="kpi-label">{t('admin.metrics.quoteRequests')}</span>
            <span className="kpi-value">{pendingQuotesCount}</span>
            <span className="kpi-sub">{isTamil ? 'மதிப்பீடு அனுப்ப வேண்டியவை' : 'Action Required'}</span>
          </div>
          <div className="kpi-card">
            <span className="kpi-label">{t('admin.metrics.totalRevenue')}</span>
            <span className="kpi-value" style={{ color: 'var(--color-success)' }}>
              ₹{totalRevenue.toLocaleString('en-IN')}
            </span>
            <span className="kpi-sub">{isTamil ? 'மொத்த வருவாய்' : 'Gross Booking Value'}</span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="admin-tabs-nav">
          <button
            onClick={() => setActiveTab('orders')}
            className={`admin-tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
          >
            {t('admin.tabs.orders')} ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('quotes')}
            className={`admin-tab-btn ${activeTab === 'quotes' ? 'active' : ''}`}
          >
            {t('admin.tabs.quotes')} ({quotes.length})
          </button>
          <button
            onClick={() => setActiveTab('payments')}
            className={`admin-tab-btn ${activeTab === 'payments' ? 'active' : ''}`}
          >
            {t('admin.tabs.payments')}
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`admin-tab-btn ${activeTab === 'products' ? 'active' : ''}`}
          >
            {t('admin.tabs.products')} ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('measurements')}
            className={`admin-tab-btn ${activeTab === 'measurements' ? 'active' : ''}`}
          >
            {t('admin.tabs.measurements')}
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`admin-tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
          >
            {isTamil ? 'அமைப்புகள் & முகவரி' : 'Business Settings'}
          </button>
        </div>

        {/* TAB 1: Orders Pipeline Table */}
        {activeTab === 'orders' && (
          <div className="admin-card-surface">
            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Order ID & Type</th>
                    <th>Customer</th>
                    <th>Blouse Design & Customization</th>
                    <th>Event Date</th>
                    <th>Total & Payment</th>
                    <th>Production Stage</th>
                    <th>Quick Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((ord) => (
                    <tr key={ord.id}>
                      <td>
                        <div style={{ fontWeight: 700, color: 'var(--color-primary-dark)' }}>{ord.id}</div>
                        <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>
                          {ord.type === 'offline_walkin' ? (isTamil ? 'நேரடி வாடிக்கையாளர்' : 'Walk-in Store') : (isTamil ? 'ஆன்லைன் ஆர்டர்' : 'Online Store')}
                        </span>
                      </td>

                      <td>
                        <div style={{ fontWeight: 600 }}>{ord.customer.name}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>{ord.customer.phone}</div>
                      </td>

                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <img
                            src={ord.items[0]?.image || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=100&q=80'}
                            alt="thumb"
                            style={{ width: 36, height: 42, objectFit: 'cover', borderRadius: 4 }}
                          />
                          <div>
                            <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>
                              {isTamil ? ord.items[0]?.productName_ta : ord.items[0]?.productName_en}
                            </div>
                            <span style={{ fontSize: '0.72rem', color: 'var(--color-gold-dark)' }}>
                              {ord.items[0]?.customization?.aari || 'Custom Work'}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td>
                        <div style={{ fontWeight: 600, color: 'var(--color-primary-dark)' }}>
                          {ord.targetDate || 'Standard'}
                        </div>
                      </td>

                      <td>
                        <div style={{ fontWeight: 700 }}>₹{ord.totalAmount?.toLocaleString('en-IN')}</div>
                        <span className={`badge ${ord.paymentStatus === 'paid' ? 'badge-success' : 'badge-gold'}`}>
                          {ord.paymentStatus}
                        </span>
                      </td>

                      <td>
                        <span className={`status-badge status-${ord.productionStatus}`}>
                          {t(`tracker.status.${ord.productionStatus}`)}
                        </span>
                      </td>

                      <td>
                        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                          <button
                            onClick={() => handleAdvanceStatus(ord.id, ord.productionStatus)}
                            className="btn btn-sm btn-outline-gold"
                            title="Advance to next production milestone"
                          >
                            <span>Next Stage</span>
                            <ChevronRight size={14} />
                          </button>
                          {ord.items[0]?.measurements && (
                            <button
                              onClick={() => setSelectedMeasurementsView(ord)}
                              className="btn btn-sm btn-outline"
                              title="View Tailor Measurements Slip"
                            >
                              <Ruler size={13} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: Custom Quote Requests */}
        {activeTab === 'quotes' && (
          <div className="admin-card-surface" style={{ padding: 'var(--space-20)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '16px' }}>
              {quotes.map((q) => (
                <div
                  key={q.id}
                  style={{
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                    background: '#FFFFFF'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="badge badge-gold">{q.id}</span>
                    <span className={`badge ${q.status === 'quote_sent' ? 'badge-success' : 'badge-gold'}`}>
                      {q.status === 'quote_sent' ? 'Quote Dispatched' : 'Needs Review'}
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '12px' }}>
                    <img
                      src={q.referenceImages?.[0] || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=200&q=80'}
                      alt="Reference"
                      style={{ width: '90px', height: '110px', objectFit: 'cover', borderRadius: '4px' }}
                    />
                    <div>
                      <h4 style={{ color: 'var(--color-primary-dark)', fontSize: '1.05rem' }}>{q.customerName}</h4>
                      <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>{q.phone}</p>
                      <div style={{ fontSize: '0.8rem', marginTop: 4 }}>
                        Budget: <strong>₹{q.targetBudget}</strong>
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--color-primary)', marginTop: 2 }}>
                        Target: {q.eventDate}
                      </div>
                    </div>
                  </div>

                  <p style={{ fontSize: '0.82rem', color: 'var(--color-text-main)', background: 'var(--color-bg)', padding: '8px', borderRadius: '4px' }}>
                    "{q.requirements}"
                  </p>

                  <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    {q.itemizedQuote ? (
                      <span style={{ fontSize: '0.86rem', color: 'var(--color-success)', fontWeight: 700 }}>
                        Quoted: ₹{q.itemizedQuote.total?.toLocaleString('en-IN')}
                      </span>
                    ) : (
                      <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Pending Estimate</span>
                    )}

                    <button
                      onClick={() => {
                        setSelectedQuoteForBuild(q);
                        setQuoteModalOpen(true);
                      }}
                      className="btn btn-sm btn-gold"
                    >
                      <Calculator size={14} />
                      <span>{q.itemizedQuote ? 'Modify Quote' : 'Build Quote'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: Payment Verification Center */}
        {activeTab === 'payments' && (
          <div className="admin-card-surface">
            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Order Ref</th>
                    <th>Customer</th>
                    <th>Amount</th>
                    <th>Payment Mode</th>
                    <th>UTR / Transaction Ref</th>
                    <th>Screenshot Proof</th>
                    <th>Verification Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((ord) => (
                    <tr key={ord.id}>
                      <td><strong>{ord.id}</strong></td>
                      <td>{ord.customer.name} ({ord.customer.phone})</td>
                      <td><strong>₹{ord.totalAmount?.toLocaleString('en-IN')}</strong></td>
                      <td>{ord.paymentMethod}</td>
                      <td><code>{ord.paymentProof?.utr || 'N/A'}</code></td>
                      <td>
                        {ord.paymentProof?.screenshot ? (
                          <a
                            href={ord.paymentProof.screenshot}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: 'var(--color-primary)', textDecoration: 'underline', fontSize: '0.8rem' }}
                          >
                            View Receipt
                          </a>
                        ) : (
                          <span style={{ color: 'var(--color-text-light)' }}>None</span>
                        )}
                      </td>
                      <td>
                        {ord.paymentStatus === 'paid' ? (
                          <span className="badge badge-success">✓ Verified & Paid</span>
                        ) : (
                          <div style={{ display: 'flex', gap: 6 }}>
                            <button
                              onClick={() => verifyPayment(ord.id, true)}
                              className="btn btn-sm btn-primary"
                              style={{ padding: '4px 10px', fontSize: '0.78rem' }}
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => verifyPayment(ord.id, false)}
                              className="btn btn-sm btn-outline"
                              style={{ padding: '4px 10px', fontSize: '0.78rem' }}
                            >
                              Reject
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: Products Management */}
        {activeTab === 'products' && (
          <div className="admin-card-surface">
            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Product Name (EN / தமிழ்)</th>
                    <th>Category</th>
                    <th>Starting Price</th>
                    <th>Base Stitching</th>
                    <th>Base Aari</th>
                    <th>Turnaround</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p.id}>
                      <td>
                        <img
                          src={p.images[0]}
                          alt={p.name_en}
                          style={{ width: 44, height: 54, objectFit: 'cover', borderRadius: 4 }}
                        />
                      </td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{p.name_en}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{p.name_ta}</div>
                      </td>
                      <td><span className="badge badge-gold">{p.category}</span></td>
                      <td><strong>₹{p.startingPrice?.toLocaleString('en-IN')}</strong></td>
                      <td>₹{p.baseStitchingPrice}</td>
                      <td>₹{p.baseAariPrice}</td>
                      <td>{p.estimatedDays}</td>
                      <td>
                        <button
                          onClick={() => deleteProduct(p.id)}
                          style={{ color: 'var(--color-danger)', fontSize: '0.8rem', textDecoration: 'underline' }}
                        >
                          Archive
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: Measurement Vault for Master Tailor */}
        {activeTab === 'measurements' && (
          <div className="admin-card-surface" style={{ padding: 'var(--space-24)' }}>
            <h3 style={{ fontSize: '1.2rem', color: 'var(--color-primary-dark)', marginBottom: 16 }}>
              {isTamil ? 'தையல் கலைஞர்களுக்கான வாடிக்கையாளர் அளவு சீட்டுகள்' : 'Customer Tailor Measurement Slips'}
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
              {orders.map((ord) => {
                const measure = ord.items[0]?.measurements;
                if (!measure) return null;

                return (
                  <div
                    key={ord.id}
                    style={{
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-sm)',
                      padding: 16,
                      background: '#FAF6F0'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <strong>{ord.customer.name}</strong>
                      <span className="badge badge-gold">{ord.id}</span>
                    </div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', marginBottom: 12 }}>
                      {ord.customer.phone} | Unit: {measure.unit || 'inches'}
                    </div>

                    {measure.measurements ? (
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px 12px', fontSize: '0.84rem' }}>
                        <div>Bust: <strong>{measure.measurements.bust}"</strong></div>
                        <div>Underbust: <strong>{measure.measurements.underBust}"</strong></div>
                        <div>Waist: <strong>{measure.measurements.waist}"</strong></div>
                        <div>Shoulder: <strong>{measure.measurements.shoulder}"</strong></div>
                        <div>Armhole: <strong>{measure.measurements.armhole}"</strong></div>
                        <div>Sleeve Length: <strong>{measure.measurements.sleeveLength}"</strong></div>
                        <div>Sleeve Round: <strong>{measure.measurements.sleeveRound}"</strong></div>
                        <div>Blouse Length: <strong>{measure.measurements.blouseLength}"</strong></div>
                        <div>Front Neck: <strong>{measure.measurements.frontNeck}"</strong></div>
                        <div>Back Neck: <strong>{measure.measurements.backNeck}"</strong></div>
                      </div>
                    ) : (
                      <p style={{ fontSize: '0.84rem', color: 'var(--color-text-muted)' }}>
                        Status: {measure.status || 'Consultation Pending'}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 6: Business Profile & Centralized Settings */}
        {activeTab === 'settings' && (
          <div className="admin-card-surface" style={{ padding: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <h2 style={{ fontSize: '1.4rem', color: 'var(--color-primary-dark)' }}>
                  {isTamil ? 'மையப்படுத்தப்பட்ட வணிக விவரங்கள்' : 'Centralized Business Configuration'}
                </h2>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                  {isTamil ? 'வலைத்தளத்தின் அனைத்துப் பக்கங்களிலும் பயன்படுத்தப்படும் அதிகாரப்பூர்வ தொடர்பு மற்றும் பிராண்டிங் விவரங்கள்.' : 'Global branding, contact, WhatsApp, and location parameters for Atchu Designs.'}
                </p>
              </div>
              <div style={{ background: '#FFFFFF', padding: '8px 16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border-gold)' }}>
                <img
                  src={BUSINESS_CONFIG.logoUrl}
                  alt="Atchu Designs"
                  style={{ height: '36px', width: 'auto', objectFit: 'contain' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
              {/* Company Info */}
              <div style={{ background: 'var(--color-bg)', padding: '20px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}>
                <h4 style={{ color: 'var(--color-primary-dark)', marginBottom: '14px', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Award size={18} color="var(--color-gold-dark)" />
                  <span>Company Identity</span>
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem' }}>
                  <div>
                    <span style={{ color: 'var(--color-text-muted)', display: 'block', fontSize: '0.78rem' }}>Company Name:</span>
                    <strong>{BUSINESS_CONFIG.businessName}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--color-text-muted)', display: 'block', fontSize: '0.78rem' }}>Subtitle / Tagline:</span>
                    <strong style={{ color: 'var(--color-primary)' }}>{BUSINESS_CONFIG.businessSubtitle}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--color-text-muted)', display: 'block', fontSize: '0.78rem' }}>Experience:</span>
                    <strong>{BUSINESS_CONFIG.experience} ({BUSINESS_CONFIG.experienceBadge})</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--color-text-muted)', display: 'block', fontSize: '0.78rem' }}>Boutique UPI ID:</span>
                    <code>{BUSINESS_CONFIG.upiId}</code>
                  </div>
                </div>
              </div>

              {/* Contact & WhatsApp */}
              <div style={{ background: 'var(--color-bg)', padding: '20px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}>
                <h4 style={{ color: 'var(--color-primary-dark)', marginBottom: '14px', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Phone size={18} color="var(--color-gold-dark)" />
                  <span>Contact & Direct WhatsApp</span>
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem' }}>
                  <div>
                    <span style={{ color: 'var(--color-text-muted)', display: 'block', fontSize: '0.78rem' }}>Phone Number:</span>
                    <a href={BUSINESS_CONFIG.telLink} style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
                      {BUSINESS_CONFIG.phone}
                    </a>
                  </div>
                  <div>
                    <span style={{ color: 'var(--color-text-muted)', display: 'block', fontSize: '0.78rem' }}>WhatsApp Direct Number:</span>
                    <a
                      href={BUSINESS_CONFIG.getWhatsAppUrl('Hi Atchu Designs, testing WhatsApp connection from Admin.')}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: '#1E6B42', fontWeight: 600 }}
                    >
                      {BUSINESS_CONFIG.whatsappFormatted} (wa.me/{BUSINESS_CONFIG.whatsapp})
                    </a>
                  </div>
                  <div>
                    <span style={{ color: 'var(--color-text-muted)', display: 'block', fontSize: '0.78rem' }}>Official Business Email:</span>
                    <a href={BUSINESS_CONFIG.emailLink} style={{ color: 'var(--color-primary)', fontWeight: 600, wordBreak: 'break-all' }}>
                      {BUSINESS_CONFIG.email}
                    </a>
                  </div>
                  <div>
                    <span style={{ color: 'var(--color-text-muted)', display: 'block', fontSize: '0.78rem' }}>Instagram Profile:</span>
                    <a
                      href={BUSINESS_CONFIG.instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: 'var(--color-gold-dark)', fontWeight: 600 }}
                    >
                      {BUSINESS_CONFIG.instagramHandle}
                    </a>
                  </div>
                </div>
              </div>

              {/* Physical Location */}
              <div style={{ background: 'var(--color-bg)', padding: '20px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}>
                <h4 style={{ color: 'var(--color-primary-dark)', marginBottom: '14px', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MapPin size={18} color="var(--color-gold-dark)" />
                  <span>Atelier Physical Location</span>
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem' }}>
                  <div>
                    <span style={{ color: 'var(--color-text-muted)', display: 'block', fontSize: '0.78rem' }}>Full Address:</span>
                    <p style={{ margin: '4px 0 0', lineHeight: 1.5, fontWeight: 500 }}>
                      {BUSINESS_CONFIG.address}
                    </p>
                  </div>
                  <div>
                    <span style={{ color: 'var(--color-text-muted)', display: 'block', fontSize: '0.78rem' }}>Operating Hours:</span>
                    <p style={{ margin: '4px 0 0', fontSize: '0.84rem' }}>
                      {BUSINESS_CONFIG.openingHours_en}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {offlineModalOpen && (
        <AdminOfflineOrderModal
          isOpen={offlineModalOpen}
          onClose={() => setOfflineModalOpen(false)}
        />
      )}

      {productModalOpen && (
        <AdminProductModal
          isOpen={productModalOpen}
          onClose={() => setProductModalOpen(false)}
        />
      )}

      {quoteModalOpen && selectedQuoteForBuild && (
        <AdminQuoteModal
          isOpen={quoteModalOpen}
          onClose={() => setQuoteModalOpen(false)}
          quote={selectedQuoteForBuild}
        />
      )}

      {/* Measurement Viewer Slip */}
      {selectedMeasurementsView && (
        <div className="admin-modal-backdrop" onClick={() => setSelectedMeasurementsView(null)}>
          <div className="admin-modal" style={{ maxWidth: '540px' }} onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>Tailor Slip: {selectedMeasurementsView.id}</h3>
              <button onClick={() => setSelectedMeasurementsView(null)}>✕</button>
            </div>
            <div className="admin-modal-body">
              <h4>{selectedMeasurementsView.customer.name} ({selectedMeasurementsView.customer.phone})</h4>
              <p style={{ fontSize: '0.84rem', color: 'var(--color-text-muted)' }}>Notes: {selectedMeasurementsView.notes || 'None'}</p>
              <hr style={{ margin: '12px 0', borderColor: 'var(--color-border)' }} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {Object.entries(selectedMeasurementsView.items[0]?.measurements?.measurements || {}).map(([k, v]) => (
                  <div key={k} style={{ fontSize: '0.9rem' }}>
                    <span style={{ textTransform: 'capitalize', color: 'var(--color-text-muted)' }}>{k}:</span> <strong>{v}"</strong>
                  </div>
                ))}
              </div>
            </div>
            <div className="admin-modal-footer">
              <button onClick={() => window.print()} className="btn btn-outline">
                Print Slip
              </button>
              <button onClick={() => setSelectedMeasurementsView(null)} className="btn btn-primary">
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
