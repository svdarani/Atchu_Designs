import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useShop } from '../../context/ShopContext';
import { BUSINESS_CONFIG } from '../../data/businessConfig';
import {
  Package,
  Clock,
  Ruler,
  FileText,
  Heart,
  MapPin,
  User,
  Shield,
  LogOut,
  Sparkles,
  Scissors,
  ArrowRight,
  Plus,
  CheckCircle,
  AlertCircle,
  Eye,
  MessageCircle,
  Phone,
  Mail
} from 'lucide-react';

export default function CustomerDashboard({ initialTab = 'overview', onNavigate }) {
  const { user, token, logout } = useAuth();
  const { isTamil, t } = useLanguage();
  const { wishlist } = useShop();

  const [activeTab, setActiveTab] = useState(initialTab);
  const [orders, setOrders] = useState([]);
  const [measurementProfiles, setMeasurementProfiles] = useState([]);
  const [customRequests, setCustomRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Measurement Modal / Form State
  const [showMeasModal, setShowMeasModal] = useState(false);
  const [measForm, setMeasForm] = useState({
    id: '',
    profileName: 'My Bridal Regular Size',
    unit: 'inches',
    bust: '36',
    underBust: '31',
    waist: '30',
    shoulder: '14.5',
    armhole: '16',
    sleeveLength: '10.5',
    sleeveRound: '11',
    blouseLength: '14',
    frontNeck: '7',
    backNeck: '9.5',
    notes: ''
  });
  const [measSaveMsg, setMeasSaveMsg] = useState('');

  // Fetch all user account data
  useEffect(() => {
    async function loadAccountData() {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const [ordersRes, measRes, customRes] = await Promise.all([
          fetch('/api/orders/my-orders', { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch('/api/measurements', { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch('/api/custom-requests/my', { headers: { 'Authorization': `Bearer ${token}` } })
        ]);

        if (ordersRes.ok) {
          const d = await ordersRes.json();
          setOrders(d.orders || []);
        }

        if (measRes.ok) {
          const d = await measRes.json();
          setMeasurementProfiles(d.profiles || []);
        }

        if (customRes.ok) {
          const d = await customRes.json();
          setCustomRequests(d.requests || []);
        }
      } catch (err) {
        console.warn('Account load issue:', err);
      } finally {
        setLoading(false);
      }
    }

    loadAccountData();
  }, [token]);

  // Handle Save Measurement Profile
  const handleSaveMeasurement = async (e) => {
    e.preventDefault();
    setMeasSaveMsg('');

    try {
      const res = await fetch('/api/measurements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(measForm)
      });

      if (res.ok) {
        setMeasSaveMsg(isTamil ? 'அளவுகள் வெற்றிகரமாக சேமிக்கப்பட்டது!' : 'Measurement profile saved successfully!');
        setShowMeasModal(false);
        // Refresh profiles
        const updated = await fetch('/api/measurements', { headers: { 'Authorization': `Bearer ${token}` } });
        if (updated.ok) {
          const d = await updated.json();
          setMeasurementProfiles(d.profiles || []);
        }
      }
    } catch (err) {
      console.warn('Measurement save error', err);
    }
  };

  // KPIs
  const activeOrders = orders.filter(o => o.stage !== 'completed' && o.stage !== 'cancelled');
  const completedOrders = orders.filter(o => o.stage === 'completed');

  const sidebarItems = [
    { id: 'overview', label: isTamil ? 'கண்ணோட்டம்' : 'Overview', icon: Sparkles },
    { id: 'orders', label: isTamil ? 'என் ஆர்டர்கள்' : 'My Orders', icon: Package, badge: orders.length },
    { id: 'track', label: 'Track Your Custom Blouse', icon: Scissors, highlight: true },
    { id: 'custom-requests', label: isTamil ? 'விருப்ப கோரிக்கைகள்' : 'Custom Requests', icon: FileText, badge: customRequests.length },
    { id: 'measurements', label: isTamil ? 'சேமிக்கப்பட்ட அளவுகள்' : 'Saved Measurements', icon: Ruler, badge: measurementProfiles.length },
    { id: 'wishlist', label: isTamil ? 'விருப்பங்கள்' : 'Wishlist', icon: Heart, badge: wishlist.length },
    { id: 'addresses', label: isTamil ? 'முகவரிகள்' : 'Addresses', icon: MapPin },
    { id: 'profile', label: isTamil ? 'சுயவிவரம்' : 'Profile', icon: User },
    { id: 'security', label: isTamil ? 'பாதுகாப்பு' : 'Security', icon: Shield }
  ];

  return (
    <div className="container section-padding animate-fade-in" style={{ maxWidth: '1240px' }}>
      {/* Welcome Banner */}
      <div style={{ background: 'linear-gradient(135deg, #2E0B12 0%, #170509 100%)', borderRadius: 'var(--radius-md)', padding: '32px 36px', color: '#FFFFFF', marginBottom: '32px', border: '1px solid rgba(197, 160, 89, 0.3)', boxShadow: 'var(--shadow-md)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '4px 14px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '9999px', fontSize: '0.8rem', color: 'var(--color-gold-light)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' }}>
              <span>{isTamil ? 'மதிப்பிற்குரிய வாடிக்கையாளர்' : 'Patron of Atchu Designs'}</span>
            </div>
            <h1 style={{ fontSize: '2.2rem', margin: 0, fontWeight: 700, color: '#FFFFFF' }}>
              {isTamil ? 'வணக்கம், ' : 'Welcome, '} {user?.name || 'Valued Patron'}
            </h1>
            <p style={{ margin: '8px 0 0', color: '#D4C4B8', fontSize: '0.94rem' }}>
              {user?.email} • {user?.phone || BUSINESS_CONFIG.phone}
            </p>
          </div>

          <button
            onClick={() => {
              setActiveTab('track');
              onNavigate('track-blouse');
            }}
            className="btn btn-gold btn-lg"
            style={{ borderRadius: '9999px', padding: '14px 28px', gap: '10px', boxShadow: '0 4px 14px rgba(0, 0, 0, 0.3)' }}
          >
            <Scissors size={18} />
            <span>Track Your Custom Blouse</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* Main Account Portal Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(240px, 280px) 1fr', gap: '32px', alignItems: 'start' }}>
        {/* Left Sidebar */}
        <div style={{ background: '#FFFFFF', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', padding: '16px', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {sidebarItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.id === 'track') {
                      onNavigate('track-blouse');
                    } else if (item.id === 'wishlist') {
                      onNavigate('wishlist');
                    } else {
                      setActiveTab(item.id);
                    }
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 16px',
                    borderRadius: 'var(--radius-sm)',
                    border: item.highlight ? '1px solid rgba(197, 160, 89, 0.4)' : 'none',
                    background: isActive ? 'var(--color-primary-subtle)' : (item.highlight ? '#FAF7F2' : 'transparent'),
                    color: isActive ? 'var(--color-primary-dark)' : (item.highlight ? 'var(--color-primary-dark)' : 'var(--color-text-main)'),
                    fontWeight: isActive || item.highlight ? 700 : 500,
                    fontSize: '0.92rem',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Icon size={18} color={isActive || item.highlight ? 'var(--color-gold-dark)' : 'currentColor'} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span style={{ fontSize: '0.74rem', fontWeight: 700, padding: '2px 8px', borderRadius: '9999px', background: isActive ? 'var(--color-primary)' : '#EAE3DC', color: isActive ? '#FFFFFF' : '#4A3F3B' }}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}

            <div style={{ borderTop: '1px solid var(--color-border)', margin: '12px 0 8px' }} />

            {/* Sign Out Button */}
            <button
              onClick={() => {
                logout();
                onNavigate('home');
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '12px 16px',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                background: 'transparent',
                color: '#DC2626',
                fontWeight: 600,
                fontSize: '0.92rem',
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              <LogOut size={18} />
              <span>{isTamil ? 'வெளியேறு' : 'Sign Out'}</span>
            </button>
          </div>
        </div>

        {/* Right Content Area */}
        <div>
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="animate-fade-in">
              {/* 4 KPI Dashboard Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
                <div style={{ background: '#FFFFFF', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', padding: '20px', boxShadow: 'var(--shadow-sm)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--color-gold-dark)', marginBottom: '8px' }}>
                    <Clock size={20} />
                    <span style={{ fontSize: '0.86rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>
                      {isTamil ? 'செயலில் உள்ளவை' : 'Active Orders'}
                    </span>
                  </div>
                  <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-primary-dark)' }}>
                    {activeOrders.length}
                  </div>
                </div>

                <div style={{ background: '#FFFFFF', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', padding: '20px', boxShadow: 'var(--shadow-sm)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#059669', marginBottom: '8px' }}>
                    <CheckCircle size={20} />
                    <span style={{ fontSize: '0.86rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>
                      {isTamil ? 'நிறைவடைந்தவை' : 'Completed Orders'}
                    </span>
                  </div>
                  <div style={{ fontSize: '2rem', fontWeight: 700, color: '#065F46' }}>
                    {completedOrders.length}
                  </div>
                </div>

                <div style={{ background: '#FFFFFF', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', padding: '20px', boxShadow: 'var(--shadow-sm)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--color-primary)', marginBottom: '8px' }}>
                    <FileText size={20} />
                    <span style={{ fontSize: '0.86rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>
                      {isTamil ? 'விருப்ப கோரிக்கைகள்' : 'Custom Requests'}
                    </span>
                  </div>
                  <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-primary-dark)' }}>
                    {customRequests.length}
                  </div>
                </div>

                <div style={{ background: '#FFFFFF', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', padding: '20px', boxShadow: 'var(--shadow-sm)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--color-gold-dark)', marginBottom: '8px' }}>
                    <Ruler size={20} />
                    <span style={{ fontSize: '0.86rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>
                      {isTamil ? 'சேமித்த அளவுகள்' : 'Saved Sizes'}
                    </span>
                  </div>
                  <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-primary-dark)' }}>
                    {measurementProfiles.length}
                  </div>
                </div>
              </div>

              {/* Active Orders Highlight Card */}
              <div style={{ background: '#FFFFFF', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', padding: '24px', marginBottom: '24px', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                  <h3 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--color-primary-dark)', fontWeight: 700 }}>
                    {isTamil ? 'தற்போது தையலில் உள்ளவை' : 'Active In-Progress Blouses'}
                  </h3>
                  <button onClick={() => setActiveTab('orders')} style={{ background: 'none', border: 'none', color: 'var(--color-primary)', fontWeight: 600, fontSize: '0.88rem', cursor: 'pointer' }}>
                    {isTamil ? 'அனைத்தையும் காண்க →' : 'View All Orders →'}
                  </button>
                </div>

                {activeOrders.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {activeOrders.map(o => (
                      <div key={o.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: '#FAF7F2', borderRadius: 'var(--radius-sm)', border: '1px solid #EAE3DC' }}>
                        <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                          <img
                            src={o.items[0]?.image || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=150&q=80'}
                            alt={o.items[0]?.productName_en || 'Blouse'}
                            style={{ width: '56px', height: '56px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }}
                          />
                          <div>
                            <div style={{ fontWeight: 700, color: 'var(--color-primary-dark)', fontSize: '0.94rem' }}>{o.id}</div>
                            <div style={{ fontSize: '0.86rem', color: 'var(--color-text-main)' }}>{o.items[0]?.productName_en}</div>
                            <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                              Current: <span style={{ textTransform: 'capitalize', fontWeight: 600, color: 'var(--color-gold-dark)' }}>{o.stage.replace('_', ' ')}</span>
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            onNavigate('track-blouse');
                          }}
                          className="btn btn-sm btn-outline-gold"
                          style={{ gap: '6px' }}
                        >
                          <Scissors size={14} />
                          <span>Track</span>
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '32px 16px', color: 'var(--color-text-muted)' }}>
                    <Scissors size={32} color="var(--color-gold-dark)" style={{ margin: '0 auto 8px' }} />
                    <p style={{ margin: 0, fontSize: '0.92rem' }}>
                      {isTamil ? 'தற்போது ஆர்டர்கள் எதுவும் இல்லை.' : 'No active orders in progress.'}
                    </p>
                    <button onClick={() => onNavigate('shop')} className="btn btn-sm btn-primary" style={{ marginTop: '12px' }}>
                      {isTamil ? 'புதிய டிசைன்களை பாருங்கள்' : 'Explore Blouses'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: MY ORDERS */}
          {activeTab === 'orders' && (
            <div className="animate-fade-in">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ fontSize: '1.5rem', color: 'var(--color-primary-dark)', margin: 0, fontWeight: 700 }}>
                  {isTamil ? 'என் ஆர்டர்கள்' : 'My Orders'}
                </h2>
                <span style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)' }}>
                  {orders.length} {isTamil ? 'ஆர்டர்கள் மொத்தம்' : 'Total Orders'}
                </span>
              </div>

              {orders.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {orders.map(order => (
                    <div key={order.id} style={{ background: '#FFFFFF', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', padding: '20px', boxShadow: 'var(--shadow-sm)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #EFE8E1', paddingBottom: '12px', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--color-primary-dark)' }}>{order.id}</div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                            Placed on {new Date(order.created_at).toLocaleDateString()}
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <span style={{ fontSize: '0.76rem', fontWeight: 700, padding: '3px 10px', borderRadius: '9999px', background: order.stage === 'completed' ? '#D1FAE5' : '#FEF3C7', color: order.stage === 'completed' ? '#065F46' : '#92400E', textTransform: 'uppercase' }}>
                            {order.stage.replace('_', ' ')}
                          </span>
                          <span style={{ fontSize: '0.76rem', fontWeight: 600, padding: '3px 8px', borderRadius: '4px', background: '#F3F4F6', color: '#374151' }}>
                            {order.payment_status.toUpperCase()}
                          </span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                        <img
                          src={order.items[0]?.image || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=150&q=80'}
                          alt="Blouse"
                          style={{ width: '70px', height: '70px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }}
                        />
                        <div style={{ flexGrow: 1 }}>
                          <h4 style={{ margin: '0 0 4px', fontSize: '1rem', color: 'var(--color-text-main)' }}>
                            {order.items[0]?.productName_en}
                          </h4>
                          <div style={{ fontSize: '0.84rem', color: 'var(--color-text-muted)' }}>
                            Quantity: {order.items[0]?.quantity || 1} • Total: <strong>₹{order.total_amount?.toLocaleString('en-IN')}</strong>
                          </div>
                        </div>

                        <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                          <button
                            onClick={() => onNavigate('track-blouse')}
                            className="btn btn-sm btn-gold"
                            style={{ gap: '6px' }}
                          >
                            <Scissors size={14} />
                            <span>Track Blouse</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '48px', background: '#FFFFFF', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                  <Package size={40} color="var(--color-gold-dark)" style={{ margin: '0 auto 12px' }} />
                  <p style={{ color: 'var(--color-text-muted)' }}>No orders found.</p>
                  <button onClick={() => onNavigate('shop')} className="btn btn-primary" style={{ marginTop: '12px' }}>
                    Browse Blouses
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: SAVED MEASUREMENTS */}
          {activeTab === 'measurements' && (
            <div className="animate-fade-in">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div>
                  <h2 style={{ fontSize: '1.5rem', color: 'var(--color-primary-dark)', margin: 0, fontWeight: 700 }}>
                    {isTamil ? 'சேமிக்கப்பட்ட அளவுகள்' : 'Saved Measurement Profiles'}
                  </h2>
                  <p style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)', margin: '4px 0 0' }}>
                    {isTamil ? 'ஆர்டர் செய்யும் போது இந்த அளவுகளை எளிதில் தேர்ந்தெடுக்கலாம்.' : 'Use your saved tailor profiles for quick checkout and bespoke stitching.'}
                  </p>
                </div>
                <button
                  onClick={() => setShowMeasModal(true)}
                  className="btn btn-primary"
                  style={{ gap: '8px', borderRadius: 'var(--radius-sm)' }}
                >
                  <Plus size={16} />
                  <span>{isTamil ? 'புதிய அளவு சேர்க்க' : 'Add Measurement Profile'}</span>
                </button>
              </div>

              {measSaveMsg && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', background: '#ECFDF5', border: '1px solid #A7F3D0', color: '#065F46', borderRadius: 'var(--radius-sm)', marginBottom: '16px', fontSize: '0.88rem' }}>
                  <CheckCircle size={16} />
                  <span>{measSaveMsg}</span>
                </div>
              )}

              {measurementProfiles.length > 0 ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
                  {measurementProfiles.map(p => (
                    <div key={p.id} style={{ background: '#FFFFFF', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', padding: '20px', boxShadow: 'var(--shadow-sm)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <h4 style={{ margin: 0, fontSize: '1.05rem', color: 'var(--color-primary-dark)' }}>{p.profile_name}</h4>
                        <span style={{ fontSize: '0.72rem', padding: '2px 8px', borderRadius: '9999px', background: 'var(--color-gold-subtle)', color: 'var(--color-primary-dark)', fontWeight: 700 }}>
                          {p.unit.toUpperCase()}
                        </span>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.82rem', background: '#FAF7F2', padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid #EFE8E1' }}>
                        <div>Bust: <strong>{p.bust}"</strong></div>
                        <div>Waist: <strong>{p.waist}"</strong></div>
                        <div>Shoulder: <strong>{p.shoulder}"</strong></div>
                        <div>Armhole: <strong>{p.armhole}"</strong></div>
                        <div>Sleeve Length: <strong>{p.sleeve_length}"</strong></div>
                        <div>Blouse Length: <strong>{p.blouse_length}"</strong></div>
                        <div>Front Neck: <strong>{p.front_neck}"</strong></div>
                        <div>Back Neck: <strong>{p.back_neck}"</strong></div>
                      </div>

                      {p.notes && (
                        <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginTop: '8px', fontStyle: 'italic' }}>
                          Note: {p.notes}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '40px', background: '#FFFFFF', borderRadius: 'var(--radius-md)', border: '1px dashed var(--color-border)' }}>
                  <Ruler size={36} color="var(--color-gold-dark)" style={{ margin: '0 auto 10px' }} />
                  <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                    No saved measurements yet. Save your favorite blouse measurements once for instant checkout.
                  </p>
                  <button onClick={() => setShowMeasModal(true)} className="btn btn-sm btn-outline" style={{ marginTop: '10px' }}>
                    Create Size Profile
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: CUSTOM REQUESTS */}
          {activeTab === 'custom-requests' && (
            <div className="animate-fade-in">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ fontSize: '1.5rem', color: 'var(--color-primary-dark)', margin: 0, fontWeight: 700 }}>
                  {isTamil ? 'என் தனிப்பயன் கோரிக்கைகள்' : 'My Custom Requests'}
                </h2>
                <button onClick={() => onNavigate('custom-quote')} className="btn btn-primary btn-sm">
                  + {isTamil ? 'புதிய கோரிக்கை' : 'New Request'}
                </button>
              </div>

              {customRequests.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {customRequests.map(r => (
                    <div key={r.id} style={{ background: '#FFFFFF', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', padding: '20px', boxShadow: 'var(--shadow-sm)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '0.98rem', color: 'var(--color-primary-dark)' }}>{r.id}</div>
                          <div style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
                            {r.design_category} • {new Date(r.created_at).toLocaleDateString()}
                          </div>
                        </div>
                        <span style={{ fontSize: '0.74rem', fontWeight: 700, padding: '3px 10px', borderRadius: '9999px', background: '#FEF3C7', color: '#92400E', textTransform: 'uppercase' }}>
                          {r.status.replace('_', ' ')}
                        </span>
                      </div>
                      <p style={{ margin: '0 0 10px', fontSize: '0.88rem', color: 'var(--color-text-main)', lineHeight: 1.5 }}>
                        {r.requirements}
                      </p>
                      {r.quote_amount && (
                        <div style={{ fontWeight: 700, color: 'var(--color-primary)', fontSize: '0.96rem' }}>
                          Prepared Quote: ₹{r.quote_amount?.toLocaleString('en-IN')}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '40px', background: '#FFFFFF', borderRadius: 'var(--radius-md)', border: '1px dashed var(--color-border)' }}>
                  <FileText size={36} color="var(--color-gold-dark)" style={{ margin: '0 auto 10px' }} />
                  <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>No custom blouse design inquiries submitted yet.</p>
                  <button onClick={() => onNavigate('custom-quote')} className="btn btn-sm btn-outline" style={{ marginTop: '10px' }}>
                    Request Custom Quote
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 5: ADDRESSES */}
          {activeTab === 'addresses' && (
            <div className="animate-fade-in" style={{ background: '#FFFFFF', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', padding: '24px' }}>
              <h3 style={{ margin: '0 0 16px', fontSize: '1.25rem', color: 'var(--color-primary-dark)' }}>
                {isTamil ? 'சேமிக்கப்பட்ட முகவரிகள்' : 'Delivery Addresses'}
              </h3>
              <div style={{ border: '1px solid #EAE3DC', borderRadius: 'var(--radius-sm)', padding: '16px', background: '#FAF7F2' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <strong>Home (Default)</strong>
                  <span style={{ fontSize: '0.74rem', background: 'var(--color-gold-subtle)', color: 'var(--color-primary-dark)', padding: '2px 8px', borderRadius: '4px', fontWeight: 600 }}>Default</span>
                </div>
                <p style={{ margin: '0 0 4px', fontSize: '0.88rem', color: 'var(--color-text-main)', lineHeight: 1.5 }}>
                  {user?.name}<br />
                  Plot 12, Sri Nagar 2nd Street, Anna Nagar<br />
                  Chennai, Tamil Nadu - 600040<br />
                  Phone: {user?.phone || '+91 94432 18900'}
                </p>
              </div>
            </div>
          )}

          {/* TAB 6: PROFILE */}
          {activeTab === 'profile' && (
            <div className="animate-fade-in" style={{ background: '#FFFFFF', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', padding: '24px', maxWidth: '560px' }}>
              <h3 style={{ margin: '0 0 18px', fontSize: '1.25rem', color: 'var(--color-primary-dark)' }}>
                {isTamil ? 'சுயவிவரம்' : 'Customer Profile'}
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: '4px' }}>Full Name</label>
                  <input type="text" defaultValue={user?.name} className="input-styled" style={{ width: '100%', height: '42px' }} readOnly />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: '4px' }}>Verified Email Address</label>
                  <input type="email" defaultValue={user?.email} className="input-styled" style={{ width: '100%', height: '42px', background: '#F9FAFB' }} readOnly />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: '4px' }}>Mobile Number</label>
                  <input type="tel" defaultValue={user?.phone || '+91 84385 51865'} className="input-styled" style={{ width: '100%', height: '42px' }} />
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: SECURITY */}
          {activeTab === 'security' && (
            <div className="animate-fade-in" style={{ background: '#FFFFFF', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', padding: '24px', maxWidth: '560px' }}>
              <h3 style={{ margin: '0 0 14px', fontSize: '1.25rem', color: 'var(--color-primary-dark)' }}>
                {isTamil ? 'கடவுச்சொல் & பாதுகாப்பு' : 'Security & Password'}
              </h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)', marginBottom: '18px' }}>
                Your account is secured with salted SHA-512 authentication.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: '4px' }}>Current Password</label>
                  <input type="password" placeholder="••••••••" className="input-styled" style={{ width: '100%', height: '42px' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: '4px' }}>New Password</label>
                  <input type="password" placeholder="Enter new password" className="input-styled" style={{ width: '100%', height: '42px' }} />
                </div>
                <button className="btn btn-primary" style={{ alignSelf: 'flex-start', marginTop: '6px' }}>
                  Update Password
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Measurement Builder Modal */}
      {showMeasModal && (
        <div className="admin-modal-backdrop animate-fade-in" onClick={() => setShowMeasModal(false)} style={{ zIndex: 300 }}>
          <div className="admin-modal" style={{ maxWidth: '620px', padding: '28px' }} onClick={e => e.stopPropagation()}>
            <h3 style={{ margin: '0 0 6px', fontSize: '1.25rem', color: 'var(--color-primary-dark)' }}>
              {isTamil ? 'புதிய தையல் அளவு விவரம்' : 'Add Measurement Profile'}
            </h3>
            <p style={{ fontSize: '0.86rem', color: 'var(--color-text-muted)', marginBottom: '20px' }}>
              Enter your exact blouse measurements in inches or centimeters for precision stitching.
            </p>

            <form onSubmit={handleSaveMeasurement}>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '4px' }}>Profile Name</label>
                  <input
                    type="text"
                    value={measForm.profileName}
                    onChange={e => setMeasForm({ ...measForm, profileName: e.target.value })}
                    className="input-styled"
                    style={{ width: '100%', height: '40px' }}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '4px' }}>Unit</label>
                  <select
                    value={measForm.unit}
                    onChange={e => setMeasForm({ ...measForm, unit: e.target.value })}
                    className="input-styled"
                    style={{ width: '100%', height: '40px' }}
                  >
                    <option value="inches">Inches (in)</option>
                    <option value="cm">Centimeters (cm)</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '16px' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 600 }}>Bust</label>
                  <input type="text" value={measForm.bust} onChange={e => setMeasForm({ ...measForm, bust: e.target.value })} className="input-styled" style={{ width: '100%', height: '36px' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 600 }}>Under Bust</label>
                  <input type="text" value={measForm.underBust} onChange={e => setMeasForm({ ...measForm, underBust: e.target.value })} className="input-styled" style={{ width: '100%', height: '36px' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 600 }}>Waist</label>
                  <input type="text" value={measForm.waist} onChange={e => setMeasForm({ ...measForm, waist: e.target.value })} className="input-styled" style={{ width: '100%', height: '36px' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 600 }}>Shoulder</label>
                  <input type="text" value={measForm.shoulder} onChange={e => setMeasForm({ ...measForm, shoulder: e.target.value })} className="input-styled" style={{ width: '100%', height: '36px' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 600 }}>Armhole</label>
                  <input type="text" value={measForm.armhole} onChange={e => setMeasForm({ ...measForm, armhole: e.target.value })} className="input-styled" style={{ width: '100%', height: '36px' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 600 }}>Sleeve Length</label>
                  <input type="text" value={measForm.sleeveLength} onChange={e => setMeasForm({ ...measForm, sleeveLength: e.target.value })} className="input-styled" style={{ width: '100%', height: '36px' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 600 }}>Sleeve Round</label>
                  <input type="text" value={measForm.sleeveRound} onChange={e => setMeasForm({ ...measForm, sleeveRound: e.target.value })} className="input-styled" style={{ width: '100%', height: '36px' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 600 }}>Blouse Length</label>
                  <input type="text" value={measForm.blouseLength} onChange={e => setMeasForm({ ...measForm, blouseLength: e.target.value })} className="input-styled" style={{ width: '100%', height: '36px' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 600 }}>Front Neck</label>
                  <input type="text" value={measForm.frontNeck} onChange={e => setMeasForm({ ...measForm, frontNeck: e.target.value })} className="input-styled" style={{ width: '100%', height: '36px' }} />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                <button type="button" onClick={() => setShowMeasModal(false)} className="btn btn-outline">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
