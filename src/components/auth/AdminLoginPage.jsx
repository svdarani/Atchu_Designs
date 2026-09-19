import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { BUSINESS_CONFIG } from '../../data/businessConfig';
import { ShieldCheck, Lock, Mail, Eye, EyeOff, ArrowRight, AlertCircle, ArrowLeft } from 'lucide-react';

export default function AdminLoginPage({ onNavigate, onAdminLoginSuccess }) {
  const { adminLogin } = useAuth();
  const { isTamil } = useLanguage();

  const [email, setEmail] = useState('orders.atchudesigns@gmail.com');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError(isTamil ? 'நிர்வாக மின்னஞ்சல் மற்றும் கடவுச்சொல்லை உள்ளிடவும்.' : 'Please enter admin email and password.');
      return;
    }

    setLoading(true);
    const result = await adminLogin(email, password);
    setLoading(false);

    if (result.success) {
      if (onAdminLoginSuccess) {
        onAdminLoginSuccess(result.user);
      } else {
        onNavigate('admin');
      }
    } else {
      setError(result.error);
    }
  };

  return (
    <div style={{ minHeight: '85vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'radial-gradient(circle at top, #2C0E14 0%, #15060A 100%)', padding: '32px 16px' }}>
      <div style={{ width: '100%', maxWidth: '440px', background: '#1F0B10', border: '1px solid rgba(197, 160, 89, 0.4)', borderRadius: 'var(--radius-md)', padding: '36px 32px', boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)', color: '#FFFFFF' }} className="animate-fade-in">
        {/* Back to Customer Site */}
        <button
          onClick={() => onNavigate('home')}
          style={{ background: 'none', border: 'none', color: '#D4C4B8', display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', cursor: 'pointer', marginBottom: '20px', padding: 0 }}
        >
          <ArrowLeft size={14} />
          <span>{isTamil ? 'வாடிக்கையாளர் வலைத்தளம்' : 'Back to Boutique'}</span>
        </button>

        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'rgba(197, 160, 89, 0.15)', border: '1px solid var(--color-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
            <ShieldCheck size={26} color="var(--color-gold)" />
          </div>
          <h1 style={{ fontSize: '1.75rem', color: '#FFFFFF', margin: 0, fontWeight: 700 }}>
            {isTamil ? 'Atchu Designs நிர்வாகம்' : 'Atchu Designs Admin'}
          </h1>
          <div style={{ fontSize: '0.86rem', color: 'var(--color-gold-light)', marginTop: '6px', letterSpacing: '0.04em' }}>
            {isTamil ? 'உங்கள் பூட்டிக், ஆர்டர்கள் மற்றும் வாடிக்கையாளர்களை நிர்வகிக்கவும்' : 'Manage your boutique, orders and customers'}
          </div>
        </div>

        {/* Error Notification */}
        {error && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(239, 68, 68, 0.2)', border: '1px solid #EF4444', color: '#FCA5A5', padding: '12px 14px', borderRadius: 'var(--radius-sm)', marginBottom: '20px', fontSize: '0.85rem' }}>
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Admin Email */}
          <div>
            <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: '#E8DED6', marginBottom: '6px' }}>
              {isTamil ? 'நிர்வாக மின்னஞ்சல்' : 'Admin Email'}
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={17} color="var(--color-gold-dark)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="orders.atchudesigns@gmail.com"
                style={{ width: '100%', height: '46px', paddingLeft: '42px', background: 'rgba(255, 255, 255, 0.07)', border: '1px solid rgba(197, 160, 89, 0.3)', borderRadius: 'var(--radius-sm)', color: '#FFFFFF', fontSize: '0.92rem', outline: 'none' }}
                required
              />
            </div>
          </div>

          {/* Admin Password */}
          <div>
            <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: '#E8DED6', marginBottom: '6px' }}>
              {isTamil ? 'கடவுச்சொல்' : 'Password'}
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={17} color="var(--color-gold-dark)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter admin password"
                style={{ width: '100%', height: '46px', paddingLeft: '42px', paddingRight: '42px', background: 'rgba(255, 255, 255, 0.07)', border: '1px solid rgba(197, 160, 89, 0.3)', borderRadius: 'var(--radius-sm)', color: '#FFFFFF', fontSize: '0.92rem', outline: 'none' }}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#D4C4B8', padding: '4px' }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Admin Sign In Button */}
          <button
            type="submit"
            disabled={loading}
            className="btn btn-gold"
            style={{ width: '100%', height: '48px', justifyContent: 'center', gap: '8px', fontSize: '0.98rem', fontWeight: 700, borderRadius: 'var(--radius-sm)', marginTop: '8px' }}
          >
            <span>{loading ? (isTamil ? 'சரிபார்க்கிறது...' : 'Authenticating...') : (isTamil ? 'நிர்வாக உள்நுழைவு' : 'Admin Sign In')}</span>
            {!loading && <ArrowRight size={17} />}
          </button>
        </form>

        {/* Security Notice */}
        <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.1)', textAlign: 'center', fontSize: '0.78rem', color: '#9C8E85' }}>
          🔒 Restricted Administrative Access • Secured with SHA-512 Server Tokens
        </div>
      </div>
    </div>
  );
}
