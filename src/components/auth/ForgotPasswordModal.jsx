import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { Mail, X, CheckCircle, ArrowRight, AlertCircle, KeyRound } from 'lucide-react';

export default function ForgotPasswordModal({ isOpen, onClose, onNavigate }) {
  const { forgotPassword, resetPassword } = useAuth();
  const { isTamil } = useLanguage();

  const [step, setStep] = useState('request'); // 'request' | 'sent' | 'reset'
  const [email, setEmail] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleRequestReset = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!email) {
      setError(isTamil ? 'மின்னஞ்சல் முகவரியை உள்ளிடவும்.' : 'Please enter your email address.');
      return;
    }

    setLoading(true);
    const res = await forgotPassword(email);
    setLoading(false);

    if (res.success) {
      setMessage(res.message);
      if (res.devResetToken) {
        setResetToken(res.devResetToken);
      }
      setStep('sent');
    } else {
      setError(res.error);
    }
  };

  const handleCompleteReset = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!resetToken || !newPassword || newPassword.length < 6) {
      setError(isTamil ? 'குறைந்தது 6 எழுத்துகள் கொண்ட புதிய கடவுச்சொல்லை உள்ளிடவும்.' : 'Please enter a valid reset token and a new password (min 6 characters).');
      return;
    }

    setLoading(true);
    const res = await resetPassword(resetToken, newPassword);
    setLoading(false);

    if (res.success) {
      setStep('completed');
    } else {
      setError(res.error);
    }
  };

  return (
    <div className="admin-modal-backdrop animate-fade-in" onClick={onClose} style={{ zIndex: 300 }}>
      <div className="admin-modal" style={{ maxWidth: '460px', padding: '32px' }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <KeyRound size={20} color="var(--color-gold-dark)" />
            <h3 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--color-primary-dark)' }}>
              {isTamil ? 'கடவுச்சொல் மீட்டமைப்பு' : 'Reset Your Password'}
            </h3>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
            <X size={20} />
          </button>
        </div>

        {error && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#FFF1F2', border: '1px solid #FECDD3', color: '#9F1239', padding: '10px 14px', borderRadius: 'var(--radius-sm)', marginBottom: '16px', fontSize: '0.85rem' }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {step === 'request' && (
          <form onSubmit={handleRequestReset}>
            <p style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)', lineHeight: 1.6, marginBottom: '18px' }}>
              {isTamil
                ? 'உங்கள் கணக்கில் பதிவு செய்யப்பட்ட மின்னஞ்சல் முகவரியை உள்ளிடவும். கடவுச்சொல்லை மீட்டமைப்பதற்கான இணைப்பு அனுப்பப்படும்.'
                : 'Enter the email address associated with your Atchu Designs account and we will send you a secure password reset link.'}
            </p>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, marginBottom: '6px' }}>
                {isTamil ? 'மின்னஞ்சல் முகவரி' : 'Email Address'}
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} color="#9CA3AF" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="input-styled"
                  style={{ paddingLeft: '40px', width: '100%', height: '44px' }}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button type="button" onClick={onClose} className="btn btn-outline" style={{ padding: '8px 16px' }}>
                {isTamil ? 'ரத்து' : 'Cancel'}
              </button>
              <button type="submit" disabled={loading} className="btn btn-primary" style={{ padding: '8px 20px' }}>
                <span>{loading ? (isTamil ? 'அனுப்பப்படுகிறது...' : 'Sending...') : (isTamil ? 'இணைப்பு அனுப்புக' : 'Send Reset Link')}</span>
              </button>
            </div>
          </form>
        )}

        {step === 'sent' && (
          <div>
            <div style={{ textAlign: 'center', padding: '12px 0 20px' }}>
              <CheckCircle size={48} color="#059669" style={{ margin: '0 auto 12px' }} />
              <h4 style={{ fontSize: '1.1rem', marginBottom: '8px', color: 'var(--color-primary-dark)' }}>
                {isTamil ? 'மின்னஞ்சல் அனுப்பப்பட்டது' : 'Check your email for a password reset link.'}
              </h4>
              <p style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
                {message}
              </p>
            </div>

            {/* Quick dev testing bridge */}
            {resetToken && (
              <div style={{ background: '#FAF7F2', padding: '14px', borderRadius: 'var(--radius-sm)', border: '1px solid #E6D8CE', marginBottom: '18px' }}>
                <div style={{ fontSize: '0.78rem', color: '#786F69', fontWeight: 600, marginBottom: '6px' }}>
                  DEV TEST RESET TOKEN (Local Sandbox):
                </div>
                <button
                  onClick={() => setStep('reset')}
                  className="btn btn-sm btn-gold"
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  Enter New Password Now
                </button>
              </div>
            )}

            <button onClick={onClose} className="btn btn-outline" style={{ width: '100%', justifyContent: 'center' }}>
              {isTamil ? 'முடிந்தது' : 'Done'}
            </button>
          </div>
        )}

        {step === 'reset' && (
          <form onSubmit={handleCompleteReset}>
            <p style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)', marginBottom: '16px' }}>
              {isTamil ? 'உங்கள் புதிய கடவுச்சொல்லை உள்ளிடவும்:' : 'Create your new password:'}
            </p>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, marginBottom: '6px' }}>
                {isTamil ? 'புதிய கடவுச்சொல்' : 'New Password'}
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                placeholder="Enter new password (min 6 chars)"
                className="input-styled"
                style={{ width: '100%', height: '44px' }}
                required
              />
            </div>
            <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
              <span>{loading ? 'Updating...' : (isTamil ? 'கடவுச்சொல்லை மாற்றுக' : 'Update Password')}</span>
            </button>
          </form>
        )}

        {step === 'completed' && (
          <div style={{ textAlign: 'center', padding: '16px 0' }}>
            <CheckCircle size={46} color="#059669" style={{ margin: '0 auto 12px' }} />
            <h4 style={{ fontSize: '1.15rem', color: 'var(--color-primary-dark)', marginBottom: '8px' }}>
              {isTamil ? 'கடவுச்சொல் வெற்றிகரமாக மாற்றப்பட்டது!' : 'Password Successfully Updated!'}
            </h4>
            <p style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)', marginBottom: '20px' }}>
              {isTamil ? 'நீங்கள் இப்போது புதிய கடவுச்சொல் மூலம் உள்நுழையலாம்.' : 'You can now sign in using your new password.'}
            </p>
            <button
              onClick={() => {
                onClose();
                onNavigate('login');
              }}
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center' }}
            >
              {isTamil ? 'உள்நுழைக' : 'Go to Sign In'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
