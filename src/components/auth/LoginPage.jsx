import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { BUSINESS_CONFIG } from '../../data/businessConfig';
import { Eye, EyeOff, Lock, Mail, ArrowRight, Sparkles, AlertCircle } from 'lucide-react';

export default function LoginPage({ onNavigate, onLoginSuccess }) {
  const { login } = useAuth();
  const { isTamil, t } = useLanguage();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError(isTamil ? 'மின்னஞ்சல் மற்றும் கடவுச்சொல்லை உள்ளிடவும்.' : 'Please enter your email and password.');
      return;
    }

    setLoading(true);
    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      if (onLoginSuccess) {
        onLoginSuccess(result.user);
      } else {
        onNavigate('account');
      }
    } else {
      setError(result.error);
    }
  };

  const handleGoogleSignIn = () => {
    // Redirect to backend Google OAuth or Sandbox simulator
    window.location.href = '/api/auth/google/sandbox-callback?email=' + encodeURIComponent(email || 'customer.google@atchudesigns.com') + '&name=' + encodeURIComponent(email ? email.split('@')[0] : 'Boutique Client');
  };

  return (
    <div className="auth-page-container animate-fade-in">
      <div className="auth-split-wrapper">
        {/* Left Column: Visual Showcase (Desktop) */}
        <div className="auth-visual-col">
          <div className="auth-visual-overlay" />
          <div className="auth-visual-content">
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', background: 'rgba(255, 255, 255, 0.12)', backdropFilter: 'blur(8px)', borderRadius: '9999px', marginBottom: '20px', border: '1px solid rgba(197, 160, 89, 0.3)' }}>
              <Sparkles size={15} color="var(--color-gold-light)" />
              <span style={{ fontSize: '0.82rem', color: 'var(--color-gold-light)', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600 }}>
                {isTamil ? 'நேர்த்தியான தையல் & ஆரி கலை' : 'Artisanal Bridal Heritage'}
              </span>
            </div>
            <h2 style={{ fontSize: '2.4rem', color: '#FFFFFF', marginBottom: '16px', lineHeight: 1.2, fontWeight: 700 }}>
              {isTamil ? 'உங்கள் கனவு பிளவுஸ், நேர்த்தியான வடிவமைப்பில்' : 'Your Dream Blouse, Beautifully Crafted.'}
            </h2>
            <p style={{ color: '#E5D8CF', fontSize: '1.02rem', lineHeight: 1.7, maxWidth: '440px', marginBottom: '28px' }}>
              {isTamil
                ? 'தனிப்பயன் பிளவுஸ் ஆர்டர்களைக் கண்காணிக்க, அளவுகளை சேமிக்க மற்றும் ஆரி வேலைப்பாடுகளை ஆராய உங்கள் கணக்கில் இணையுங்கள்.'
                : 'Sign in to follow your custom stitching timeline, save bespoke measurement profiles, and access tailored bridal embroidery quotes.'}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.15)', paddingTop: '20px' }}>
              <div>
                <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--color-gold)' }}>5+ Years</div>
                <div style={{ fontSize: '0.78rem', color: '#D4C4B8' }}>Bespoke Experience</div>
              </div>
              <div style={{ width: '1px', height: '32px', background: 'rgba(255, 255, 255, 0.15)' }} />
              <div>
                <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--color-gold)' }}>13-Stage</div>
                <div style={{ fontSize: '0.78rem', color: '#D4C4B8' }}>Live Order Tracking</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Authentication Card */}
        <div className="auth-form-col">
          <div className="auth-card">
            {/* Brand Header */}
            <div style={{ textAlign: 'center', marginBottom: '28px' }}>
              <img
                src={BUSINESS_CONFIG.logoUrl}
                alt={BUSINESS_CONFIG.businessName}
                style={{ height: '38px', margin: '0 auto 12px', display: 'block', objectFit: 'contain' }}
              />
              <div style={{ fontSize: '0.84rem', color: 'var(--color-gold-dark)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                {isTamil ? BUSINESS_CONFIG.businessSubtitle_ta : BUSINESS_CONFIG.businessSubtitle}
              </div>
              <h1 style={{ fontSize: '1.8rem', color: 'var(--color-primary-dark)', marginTop: '8px', marginBottom: '6px', fontWeight: 700 }}>
                {isTamil ? 'மீண்டும் வருக!' : 'Welcome Back'}
              </h1>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
                {isTamil
                  ? 'உங்கள் ஆர்டர்கள் மற்றும் பிளவுஸ் விவரங்களை நிர்வகிக்க உள்நுழையவும்.'
                  : 'Sign in to manage your orders and custom blouse details.'}
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#FFF1F2', border: '1px solid #FECDD3', color: '#9F1239', padding: '12px 16px', borderRadius: 'var(--radius-sm)', marginBottom: '20px', fontSize: '0.88rem' }}>
                <AlertCircle size={18} style={{ flexShrink: 0 }} />
                <span>{error}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Email */}
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-main)', marginBottom: '6px' }}>
                  {isTamil ? 'மின்னஞ்சல் முகவரி' : 'Email Address'}
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail size={18} color="#9CA3AF" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="input-styled"
                    style={{ paddingLeft: '42px', width: '100%', height: '46px', borderRadius: 'var(--radius-sm)' }}
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-main)', marginBottom: '6px' }}>
                  {isTamil ? 'கடவுச்சொல்' : 'Password'}
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock size={18} color="#9CA3AF" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="input-styled"
                    style={{ paddingLeft: '42px', paddingRight: '42px', width: '100%', height: '46px', borderRadius: 'var(--radius-sm)' }}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280', padding: '4px' }}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Remember me & Forgot password */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: 'var(--color-text-muted)' }}>
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    style={{ accentColor: 'var(--color-primary)' }}
                  />
                  <span>{isTamil ? 'என்னை நினைவில் கொள்' : 'Remember me'}</span>
                </label>
                <button
                  type="button"
                  onClick={() => onNavigate('forgot-password')}
                  style={{ background: 'none', border: 'none', color: 'var(--color-primary)', fontWeight: 600, cursor: 'pointer', padding: 0 }}
                >
                  {isTamil ? 'கடவுச்சொல் மறந்துவிட்டதா?' : 'Forgot password?'}
                </button>
              </div>

              {/* Primary Sign In Button */}
              <button
                type="submit"
                className="btn btn-primary btn-lg"
                disabled={loading}
                style={{ width: '100%', height: '48px', justifyContent: 'center', gap: '8px', fontSize: '0.98rem', fontWeight: 600, borderRadius: 'var(--radius-sm)', marginTop: '6px' }}
              >
                <span>{loading ? (isTamil ? 'உள்நுழைகிறது...' : 'Signing in...') : (isTamil ? 'உள்நுழைக' : 'Sign In')}</span>
                {!loading && <ArrowRight size={17} />}
              </button>
            </form>

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', margin: '24px 0', gap: '14px' }}>
              <div style={{ flexGrow: 1, height: '1px', background: 'var(--color-border)' }} />
              <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {isTamil ? 'அல்லது' : 'or continue with'}
              </span>
              <div style={{ flexGrow: 1, height: '1px', background: 'var(--color-border)' }} />
            </div>

            {/* Google Authentication Button */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              style={{
                width: '100%',
                height: '46px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                background: '#FFFFFF',
                border: '1px solid #D1D5DB',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.92rem',
                fontWeight: 600,
                color: '#374151',
                cursor: 'pointer',
                transition: 'background 0.2s, border-color 0.2s'
              }}
              title="Sign in securely with your Google Account"
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>{isTamil ? 'கூகிள் மூலம் தொடரவும்' : 'Continue with Google'}</span>
            </button>

            {/* Link to Sign Up */}
            <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
              <span>{isTamil ? 'புதிய வாடிக்கையாளரா? ' : "Don't have an account? "}</span>
              <button
                type="button"
                onClick={() => onNavigate('signup')}
                style={{ background: 'none', border: 'none', color: 'var(--color-primary)', fontWeight: 700, cursor: 'pointer', padding: 0 }}
              >
                {isTamil ? 'கணக்கு தொடங்க' : 'Create Account'}
              </button>
            </div>

            {/* Quick Demo Credentials helper */}
            <div style={{ marginTop: '24px', padding: '12px', background: '#FAF7F2', borderRadius: 'var(--radius-sm)', border: '1px dashed #E5D7CD', fontSize: '0.78rem', color: '#665C54' }}>
              <strong>Demo Customer:</strong> <code>kavitha.r@gmail.com</code> / <code>Kavitha@2026!</code><br />
              <strong>Demo Admin:</strong> <code>orders.atchudesigns@gmail.com</code> / <code>AtchuAdmin@2026!</code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
