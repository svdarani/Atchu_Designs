import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { BUSINESS_CONFIG } from '../../data/businessConfig';
import { Eye, EyeOff, Lock, Mail, User, Phone, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react';

export default function SignUpPage({ onNavigate, onSignUpSuccess }) {
  const { signup } = useAuth();
  const { isTamil } = useLanguage();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!fullName || !email || !password) {
      setError(isTamil ? 'அனைத்து தேவையான விவரங்களையும் பூர்த்தி செய்யவும்.' : 'Please fill in all required fields.');
      return;
    }

    if (password.length < 6) {
      setError(isTamil ? 'கடவுச்சொல் குறைந்தது 6 எழுத்துகள் கொண்டிருக்க வேண்டும்.' : 'Please choose a stronger password (minimum 6 characters).');
      return;
    }

    if (password !== confirmPassword) {
      setError(isTamil ? 'கடவுச்சொற்கள் பொருந்தவில்லை.' : 'Passwords do not match.');
      return;
    }

    if (!agreeTerms) {
      setError(isTamil ? 'விதிமுறைகள் மற்றும் நிபந்தனைகளை ஒப்புக்கொள்ளவும்.' : 'Please agree to the Terms & Conditions and Privacy Policy.');
      return;
    }

    setLoading(true);
    const result = await signup(fullName, email, mobile, password);
    setLoading(false);

    if (result.success) {
      if (onSignUpSuccess) {
        onSignUpSuccess(result.user);
      } else {
        onNavigate('account');
      }
    } else {
      setError(result.error);
    }
  };

  const handleGoogleSignUp = () => {
    window.location.href = '/api/auth/google/sandbox-callback?email=' + encodeURIComponent(email || 'new.customer@atchudesigns.com') + '&name=' + encodeURIComponent(fullName || 'New Boutique Customer');
  };

  return (
    <div className="auth-page-container animate-fade-in" style={{ padding: '40px 16px' }}>
      <div style={{ maxWidth: '540px', margin: '0 auto', background: '#FFFFFF', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', padding: '36px 32px', boxShadow: 'var(--shadow-md)' }}>
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <img
            src={BUSINESS_CONFIG.logoUrl}
            alt={BUSINESS_CONFIG.businessName}
            style={{ height: '36px', margin: '0 auto 10px', display: 'block', objectFit: 'contain', cursor: 'pointer' }}
            onClick={() => onNavigate('home')}
          />
          <div style={{ fontSize: '0.82rem', color: 'var(--color-gold-dark)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            {isTamil ? BUSINESS_CONFIG.businessSubtitle_ta : BUSINESS_CONFIG.businessSubtitle}
          </div>
          <h1 style={{ fontSize: '1.85rem', color: 'var(--color-primary-dark)', marginTop: '10px', marginBottom: '8px', fontWeight: 700 }}>
            {isTamil ? 'புதிய கணக்கை உருவாக்கவும்' : 'Create Your Account'}
          </h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
            {isTamil
              ? 'உங்கள் பிளவுஸ் ஆர்டர்களைக் கண்காணிக்க, அளவுகளை சேமிக்க மற்றும் தனிப்பயன் டிசைன்களை நிர்வகிக்க கணக்கு தொடங்கவும்.'
              : 'Create an account to track your blouse orders, save measurements and manage your custom designs.'}
          </p>
        </div>

        {/* Error Notification */}
        {error && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#FFF1F2', border: '1px solid #FECDD3', color: '#9F1239', padding: '12px 16px', borderRadius: 'var(--radius-sm)', marginBottom: '20px', fontSize: '0.88rem' }}>
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Full Name */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-main)', marginBottom: '6px' }}>
              {isTamil ? 'முழுப் பெயர் *' : 'Full Name *'}
            </label>
            <div style={{ position: 'relative' }}>
              <User size={18} color="#9CA3AF" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name"
                className="input-styled"
                style={{ paddingLeft: '42px', width: '100%', height: '44px', borderRadius: 'var(--radius-sm)' }}
                required
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-main)', marginBottom: '6px' }}>
              {isTamil ? 'மின்னஞ்சல் முகவரி *' : 'Email Address *'}
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} color="#9CA3AF" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="input-styled"
                style={{ paddingLeft: '42px', width: '100%', height: '44px', borderRadius: 'var(--radius-sm)' }}
                required
              />
            </div>
          </div>

          {/* Mobile Number */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-main)', marginBottom: '6px' }}>
              {isTamil ? 'கைபேசி எண் (WhatsApp)' : 'Mobile Number'}
            </label>
            <div style={{ position: 'relative' }}>
              <Phone size={18} color="#9CA3AF" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="tel"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="Enter your mobile number"
                className="input-styled"
                style={{ paddingLeft: '42px', width: '100%', height: '44px', borderRadius: 'var(--radius-sm)' }}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-main)', marginBottom: '6px' }}>
              {isTamil ? 'கடவுச்சொல் *' : 'Create a Password *'}
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} color="#9CA3AF" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password"
                className="input-styled"
                style={{ paddingLeft: '42px', paddingRight: '42px', width: '100%', height: '44px', borderRadius: 'var(--radius-sm)' }}
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

          {/* Confirm Password */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-main)', marginBottom: '6px' }}>
              {isTamil ? 'கடவுச்சொல்லை மீண்டும் உள்ளிடவும் *' : 'Confirm Password *'}
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} color="#9CA3AF" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                className="input-styled"
                style={{ paddingLeft: '42px', width: '100%', height: '44px', borderRadius: 'var(--radius-sm)' }}
                required
              />
            </div>
          </div>

          {/* Terms Agreement Checkbox */}
          <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.85rem', color: 'var(--color-text-muted)', cursor: 'pointer', marginTop: '4px' }}>
            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              style={{ marginTop: '3px', accentColor: 'var(--color-primary)' }}
            />
            <span>
              {isTamil
                ? 'நான் விதிமுறைகள் மற்றும் நிபந்தனைகள் மற்றும் தனியுரிமைக் கொள்கையை ஏற்றுக்கொள்கிறேன்.'
                : 'I agree to the Terms & Conditions and Privacy Policy.'}
            </span>
          </label>

          {/* Submit Button */}
          <button
            type="submit"
            className="btn btn-primary btn-lg"
            disabled={loading}
            style={{ width: '100%', height: '48px', justifyContent: 'center', gap: '8px', fontSize: '0.98rem', fontWeight: 600, borderRadius: 'var(--radius-sm)', marginTop: '8px' }}
          >
            <span>{loading ? (isTamil ? 'கணக்கு உருவாக்கப்படுகிறது...' : 'Creating Account...') : (isTamil ? 'கணக்கை உருவாக்கு' : 'Create Account')}</span>
            {!loading && <ArrowRight size={17} />}
          </button>
        </form>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', margin: '22px 0', gap: '14px' }}>
          <div style={{ flexGrow: 1, height: '1px', background: 'var(--color-border)' }} />
          <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {isTamil ? 'அல்லது' : 'or'}
          </span>
          <div style={{ flexGrow: 1, height: '1px', background: 'var(--color-border)' }} />
        </div>

        {/* Google Sign Up Button */}
        <button
          type="button"
          onClick={handleGoogleSignUp}
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
            cursor: 'pointer'
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
          </svg>
          <span>{isTamil ? 'கூகிள் மூலம் தொடரவும்' : 'Continue with Google'}</span>
        </button>

        {/* Existing Account Link */}
        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
          <span>{isTamil ? 'ஏற்கனவே கணக்கு உள்ளதா? ' : 'Already have an account? '}</span>
          <button
            type="button"
            onClick={() => onNavigate('login')}
            style={{ background: 'none', border: 'none', color: 'var(--color-primary)', fontWeight: 700, cursor: 'pointer', padding: 0 }}
          >
            {isTamil ? 'உள்நுழைக' : 'Sign In'}
          </button>
        </div>
      </div>
    </div>
  );
}
