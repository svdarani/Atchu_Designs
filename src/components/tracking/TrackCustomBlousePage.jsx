import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { BUSINESS_CONFIG } from '../../data/businessConfig';
import {
  Search,
  CheckCircle,
  Clock,
  Package,
  Sparkles,
  Scissors,
  ArrowRight,
  MessageCircle,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  MapPin,
  Eye
} from 'lucide-react';

export default function TrackCustomBlousePage({ initialOrderId = '', onNavigate }) {
  const { user, token, isAuthenticated } = useAuth();
  const { isTamil, t } = useLanguage();

  const [searchQuery, setSearchQuery] = useState(initialOrderId);
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch detailed tracking info for an order ID
  const fetchOrderDetails = async (orderId) => {
    if (!orderId) return;
    setSearchLoading(true);
    setError('');

    try {
      const res = await fetch(`/api/orders/track/${encodeURIComponent(orderId)}`);
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Order not found.');
        setSelectedOrder(null);
      } else {
        setSelectedOrder(data.order);
      }
    } catch (err) {
      setError('Unable to fetch order status. Please check connection.');
      setSelectedOrder(null);
    } finally {
      setSearchLoading(false);
    }
  };

  // Load customer orders from API if logged in
  useEffect(() => {
    async function loadCustomerOrders() {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await fetch('/api/orders/my-orders', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setOrders(data.orders || []);
          // Auto-select initial order or latest active order
          if (initialOrderId) {
            const match = (data.orders || []).find(o => o.id === initialOrderId);
            if (match) {
              fetchOrderDetails(match.id);
            } else {
              fetchOrderDetails(initialOrderId);
            }
          } else if (data.orders && data.orders.length > 0) {
            fetchOrderDetails(data.orders[0].id);
          }
        }
      } catch (err) {
        console.warn('Error fetching orders:', err);
      } finally {
        setLoading(false);
      }
    }

    loadCustomerOrders();
  }, [token, initialOrderId]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    fetchOrderDetails(searchQuery.trim());
  };

  // Helper to format date
  const formatDate = (isoString) => {
    if (!isoString) return '';
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString(isTamil ? 'ta-IN' : 'en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="container section-padding animate-fade-in" style={{ maxWidth: '1120px' }}>
      {/* Header Banner */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 18px', background: 'var(--color-gold-subtle)', borderRadius: '9999px', marginBottom: '14px', border: '1px solid rgba(197, 160, 89, 0.4)' }}>
          <Sparkles size={16} color="var(--color-gold-dark)" />
          <span style={{ fontSize: '0.85rem', color: 'var(--color-gold-dark)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            {isTamil ? 'நேரடி கைவினைத் தையல் கண்காணிப்பு' : 'Atelier Live Tracking'}
          </span>
        </div>
        <h1 style={{ fontSize: '2.6rem', color: 'var(--color-primary-dark)', marginBottom: '10px', fontWeight: 700 }}>
          {isTamil ? 'உங்கள் பிளவுஸ் நிலையை கண்காணிக்க' : 'Track Your Custom Blouse'}
        </h1>
        <p style={{ fontSize: '1.08rem', color: 'var(--color-text-muted)', maxWidth: '640px', margin: '0 auto', lineHeight: 1.6 }}>
          {isTamil
            ? 'ஆர்டர் பதிவு செய்ததிலிருந்து இறுதி டெலிவரி வரை உங்கள் பிளவுஸ் தையல் மற்றும் ஆரி வேலைப்பாட்டின் நிலையை நேரடியாகக் காணுங்கள்.'
            : 'Follow your blouse from order confirmation to final delivery.'}
        </p>
      </div>

      {/* Search by Order Number Bar */}
      <div style={{ maxWidth: '620px', margin: '0 auto 40px' }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px', background: '#FFFFFF', padding: '8px', borderRadius: '9999px', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', alignItems: 'center', flexGrow: 1, paddingLeft: '14px', gap: '10px' }}>
            <Search size={19} color="var(--color-gold-dark)" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={isTamil ? 'ஆர்டர் எண் (எ.கா: BL-2026-000123)' : 'Enter Order Number (e.g. BL-2026-000123)'}
              style={{ width: '100%', border: 'none', outline: 'none', fontSize: '0.94rem', background: 'transparent' }}
            />
          </div>
          <button
            type="submit"
            disabled={searchLoading}
            className="btn btn-primary"
            style={{ borderRadius: '9999px', padding: '10px 24px', flexShrink: 0 }}
          >
            <span>{searchLoading ? '...' : (isTamil ? 'கண்காணி' : 'Track')}</span>
          </button>
        </form>

        {error && (
          <div style={{ marginTop: '14px', padding: '12px 16px', background: '#FFF1F2', border: '1px solid #FECDD3', borderRadius: 'var(--radius-sm)', color: '#9F1239', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* If customer is logged in, show their recent order cards */}
      {isAuthenticated && orders.length > 0 && (
        <div style={{ marginBottom: '44px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--color-primary-dark)', margin: 0, fontWeight: 700 }}>
              {isTamil ? 'உங்கள் ஆர்டர்கள்' : 'Your Blouse Orders'}
            </h3>
            <span style={{ fontSize: '0.84rem', color: 'var(--color-text-muted)' }}>
              {orders.length} {isTamil ? 'ஆர்டர்கள்' : 'Orders'}
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
            {orders.map(o => {
              const item = o.items && o.items[0];
              const isSelected = selectedOrder && selectedOrder.id === o.id;

              return (
                <div
                  key={o.id}
                  onClick={() => fetchOrderDetails(o.id)}
                  style={{
                    background: '#FFFFFF',
                    border: isSelected ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-md)',
                    padding: '18px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: isSelected ? 'var(--shadow-md)' : 'var(--shadow-sm)'
                  }}
                >
                  <div style={{ display: 'flex', gap: '14px' }}>
                    <img
                      src={item?.image || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=200&q=80'}
                      alt={item?.productName_en || 'Blouse'}
                      style={{ width: '70px', height: '70px', objectFit: 'cover', borderRadius: 'var(--radius-sm)', flexShrink: 0 }}
                    />
                    <div style={{ flexGrow: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--color-primary-dark)' }}>
                          {o.id}
                        </div>
                        <span style={{ fontSize: '0.72rem', fontWeight: 600, padding: '2px 8px', borderRadius: '9999px', background: o.stage === 'completed' ? '#ECFDF5' : '#FEF3C7', color: o.stage === 'completed' ? '#065F46' : '#92400E', textTransform: 'uppercase' }}>
                          {o.stage.replace('_', ' ')}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--color-text-main)', marginTop: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {isTamil ? (item?.productName_ta || item?.productName_en) : item?.productName_en}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                        {formatDate(o.created_at)}
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                        <span style={{ fontWeight: 700, color: 'var(--color-primary)', fontSize: '0.95rem' }}>
                          ₹{o.total_amount?.toLocaleString('en-IN')}
                        </span>
                        <span style={{ fontSize: '0.8rem', color: 'var(--color-gold-dark)', fontWeight: 600 }}>
                          {isTamil ? 'விவரங்களை காண்க →' : 'View Details →'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Selected Order Detailed View & 13-Stage Timeline */}
      {selectedOrder ? (
        <div style={{ background: '#FFFFFF', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-md)', overflow: 'hidden' }} className="animate-fade-in">
          {/* Order Header Summary Banner */}
          <div style={{ background: 'linear-gradient(135deg, var(--color-primary-dark) 0%, #2A080E 100%)', color: '#FFFFFF', padding: '28px 32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <span style={{ fontSize: '0.82rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-gold-light)', fontWeight: 600 }}>
                  {isTamil ? 'ஆர்டர் கண்காணிப்பு விவரங்கள்' : 'Order Tracking Dossier'}
                </span>
                <h2 style={{ fontSize: '1.9rem', margin: '4px 0 8px', color: '#FFFFFF', fontWeight: 700 }}>
                  {selectedOrder.id}
                </h2>
                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', fontSize: '0.88rem', color: '#E8DED6' }}>
                  <span>{isTamil ? 'பதிவு தேதி: ' : 'Placed: '} <strong>{formatDate(selectedOrder.created_at)}</strong></span>
                  {selectedOrder.target_date && (
                    <span>• {isTamil ? 'எதிர்பார்க்கும் தேதி: ' : 'Target Delivery: '} <strong>{selectedOrder.target_date}</strong></span>
                  )}
                  <span>• {isTamil ? 'பணம்: ' : 'Payment: '} <strong style={{ color: 'var(--color-gold)' }}>{selectedOrder.payment_status.toUpperCase()}</strong></span>
                </div>
              </div>

              {/* Direct WhatsApp Tailor Action */}
              <a
                href={BUSINESS_CONFIG.getWhatsAppUrl(`Hi, this is regarding my Atchu Designs order ${selectedOrder.id}. Please share latest status.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-gold"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '9999px', fontSize: '0.88rem', fontWeight: 600 }}
              >
                <MessageCircle size={17} />
                <span>{isTamil ? 'டெய்லருடன் பேச' : 'Contact Tailor on WhatsApp'}</span>
              </a>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) minmax(320px, 1.4fr)', gap: '32px', padding: '32px' }}>
            {/* Left: Blouse Details, Customizations & Measurements */}
            <div>
              {/* Product Card */}
              {selectedOrder.items && selectedOrder.items[0] && (
                <div style={{ background: '#FAF7F2', borderRadius: 'var(--radius-sm)', padding: '20px', border: '1px solid #EAE3DC', marginBottom: '24px' }}>
                  <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                    <img
                      src={selectedOrder.items[0].image}
                      alt={selectedOrder.items[0].productName_en}
                      style={{ width: '84px', height: '84px', objectFit: 'cover', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}
                    />
                    <div>
                      <h4 style={{ margin: '0 0 6px', fontSize: '1.05rem', color: 'var(--color-primary-dark)' }}>
                        {isTamil ? (selectedOrder.items[0].productName_ta || selectedOrder.items[0].productName_en) : selectedOrder.items[0].productName_en}
                      </h4>
                      <div style={{ fontSize: '0.84rem', color: 'var(--color-text-muted)' }}>
                        {isTamil ? 'அளவு: ' : 'Qty: '} {selectedOrder.items[0].quantity} • {selectedOrder.items[0].unitPrice ? `₹${selectedOrder.items[0].unitPrice.toLocaleString('en-IN')}` : ''}
                      </div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-primary)', marginTop: '6px' }}>
                        Total: ₹{selectedOrder.total_amount?.toLocaleString('en-IN')}
                      </div>
                    </div>
                  </div>

                  {/* Customization Details */}
                  {selectedOrder.items[0].customization && (
                    <div style={{ borderTop: '1px solid #E5DDD5', paddingTop: '14px', marginTop: '10px' }}>
                      <div style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--color-primary-dark)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        {isTamil ? 'வடிவமைப்பு விவரங்கள்' : 'Selected Customization'}
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.82rem' }}>
                        {Object.entries(selectedOrder.items[0].customization).map(([k, v]) => {
                          if (k === 'addons' && Array.isArray(v)) {
                            return (
                              <div key={k} style={{ gridColumn: '1 / -1' }}>
                                <span style={{ color: '#786F69' }}>Add-ons: </span>
                                <strong>{v.join(', ')}</strong>
                              </div>
                            );
                          }
                          return (
                            <div key={k}>
                              <span style={{ textTransform: 'capitalize', color: '#786F69' }}>{k}: </span>
                              <strong>{String(v)}</strong>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Measurements used */}
                  {selectedOrder.items[0].measurements && (
                    <div style={{ borderTop: '1px solid #E5DDD5', paddingTop: '14px', marginTop: '14px' }}>
                      <div style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--color-primary-dark)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        {isTamil ? 'தையல் அளவுகள்' : 'Bespoke Measurements'} ({selectedOrder.items[0].measurements.unit || 'inches'})
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', fontSize: '0.8rem' }}>
                        {Object.entries(selectedOrder.items[0].measurements).map(([k, v]) => {
                          if (k === 'unit') return null;
                          return (
                            <div key={k} style={{ background: '#FFFFFF', padding: '4px 8px', borderRadius: '4px', border: '1px solid #EFE8E1' }}>
                              <span style={{ textTransform: 'capitalize', color: '#786F69', display: 'block', fontSize: '0.72rem' }}>{k}</span>
                              <strong>{v}"</strong>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Delivery Address */}
              <div style={{ background: '#FAF7F2', borderRadius: 'var(--radius-sm)', padding: '16px', border: '1px solid #EAE3DC', fontSize: '0.86rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, color: 'var(--color-primary-dark)', marginBottom: '6px' }}>
                  <MapPin size={16} color="var(--color-gold-dark)" />
                  <span>{isTamil ? 'டெலிவரி முகவரி' : 'Delivery Destination'}</span>
                </div>
                <div style={{ color: 'var(--color-text-main)', lineHeight: 1.5 }}>
                  <strong>{selectedOrder.customer_name}</strong><br />
                  {selectedOrder.customer_address}<br />
                  Phone: {selectedOrder.customer_phone}
                </div>
              </div>
            </div>

            {/* Right: The 13-Stage Premium Vertical Timeline */}
            <div>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--color-primary-dark)', marginBottom: '20px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Scissors size={20} color="var(--color-gold-dark)" />
                <span>{isTamil ? '13-படி தையல் முன்னேற்ற நிலை' : '13-Stage Artisan Progress Timeline'}</span>
              </h3>

              <div className="vertical-order-timeline" style={{ position: 'relative', paddingLeft: '32px' }}>
                {/* Vertical connecting line */}
                <div
                  style={{
                    position: 'absolute',
                    left: '12px',
                    top: '16px',
                    bottom: '24px',
                    width: '3px',
                    background: '#EAE3DC',
                    zIndex: 1
                  }}
                />

                {(selectedOrder.stages || []).map((stageItem, idx) => {
                  // Determine state: completed, active, upcoming
                  const historyMatch = (selectedOrder.timeline || []).find(h => h.stage === stageItem.stage);
                  const currentStageInfo = (selectedOrder.stages || []).find(s => s.stage === selectedOrder.stage);
                  const isCompleted = historyMatch !== undefined && stageItem.order < (currentStageInfo?.order || 0);
                  const isActive = stageItem.stage === selectedOrder.stage;
                  const isUpcoming = stageItem.order > (currentStageInfo?.order || 0);

                  return (
                    <div
                      key={stageItem.stage}
                      style={{
                        position: 'relative',
                        marginBottom: idx === selectedOrder.stages.length - 1 ? '0' : '22px',
                        zIndex: 2
                      }}
                    >
                      {/* Timeline Node Bullet */}
                      <div
                        style={{
                          position: 'absolute',
                          left: '-32px',
                          top: '2px',
                          width: '26px',
                          height: '26px',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: isCompleted ? 'var(--color-primary)' : (isActive ? 'var(--color-gold)' : '#FFFFFF'),
                          border: isCompleted ? '2px solid var(--color-primary)' : (isActive ? '3px solid #FFFFFF' : '2px solid #D1C7BD'),
                          boxShadow: isActive ? '0 0 0 4px rgba(197, 160, 89, 0.35)' : 'none',
                          color: '#FFFFFF',
                          transition: 'all 0.3s ease'
                        }}
                      >
                        {isCompleted && <span style={{ fontSize: '0.78rem', fontWeight: 800 }}>✓</span>}
                        {isActive && <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#FFFFFF' }} />}
                        {isUpcoming && <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#D1C7BD' }} />}
                      </div>

                      {/* Content Card */}
                      <div
                        style={{
                          background: isActive ? '#FAF5EE' : 'transparent',
                          border: isActive ? '1px solid rgba(197, 160, 89, 0.4)' : 'none',
                          borderRadius: 'var(--radius-sm)',
                          padding: isActive ? '10px 14px' : '2px 4px'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div style={{ fontWeight: isActive ? 700 : (isCompleted ? 600 : 500), color: isActive ? 'var(--color-primary-dark)' : (isCompleted ? '#372722' : '#8C827A'), fontSize: '0.96rem' }}>
                            {isTamil ? stageItem.title_ta : stageItem.title_en}
                          </div>
                          {historyMatch && (
                            <span style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>
                              {formatDate(historyMatch.timestamp)}
                            </span>
                          )}
                        </div>
                        <p style={{ margin: '4px 0 0', fontSize: '0.84rem', color: isActive ? '#52433D' : (isCompleted ? '#6B5E57' : '#9CA3AF'), lineHeight: 1.4 }}>
                          {isTamil ? stageItem.desc_ta : stageItem.desc_en}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      ) : (
        !loading && (
          <div style={{ textAlign: 'center', padding: '40px 20px', background: '#FAF7F2', borderRadius: 'var(--radius-md)', border: '1px dashed #E5D7CD' }}>
            <Package size={42} color="var(--color-gold-dark)" style={{ margin: '0 auto 12px' }} />
            <h3 style={{ fontSize: '1.2rem', color: 'var(--color-primary-dark)', marginBottom: '8px' }}>
              {isTamil ? 'ஆர்டர் எண்ணை உள்ளிடவும்' : 'Enter an Order Number to Track'}
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', maxWidth: '440px', margin: '0 auto 18px' }}>
              {isTamil
                ? 'உங்கள் ரசீதில் உள்ள ஆர்டர் எண்ணை மேலே உள்ள தேடல் பட்டியில் உள்ளிடவும் அல்லது உங்கள் கணக்கில் உள்நுழையவும்.'
                : 'Enter your order tracking number above, or sign in to view all your custom blouse stitching milestones.'}
            </p>
            {!isAuthenticated && (
              <button onClick={() => onNavigate('login')} className="btn btn-primary">
                {isTamil ? 'உள்நுழைக' : 'Sign In to View All Orders'}
              </button>
            )}
          </div>
        )
      )}
    </div>
  );
}
