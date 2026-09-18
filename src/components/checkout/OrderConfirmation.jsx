import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { BUSINESS_CONFIG } from '../../data/businessConfig';
import { CheckCircle, Clock, Package, MessageCircle, ArrowRight, Sparkles } from 'lucide-react';

export default function OrderConfirmation({ order, onTrackOrder, onContinueShopping }) {
  const { isTamil, t } = useLanguage();

  if (!order) return null;

  return (
    <div className="container section-padding animate-fade-in">
      <div className="card-premium" style={{ maxWidth: '640px', margin: '0 auto', textAlign: 'center', padding: 'var(--space-48)' }}>
        {/* Success Icon */}
        <div
          style={{
            width: '72px',
            height: '72px',
            background: 'var(--color-success-bg)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            border: '2px solid var(--color-success)'
          }}
        >
          <CheckCircle size={38} color="var(--color-success)" />
        </div>

        <h1 style={{ fontSize: '2.2rem', color: 'var(--color-primary-dark)', marginBottom: '8px' }}>
          {isTamil ? 'ஆர்டர் வெற்றிகரமாக பெறப்பட்டது!' : 'Order Placed Successfully!'}
        </h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '1rem', maxWidth: '520px', margin: '0 auto 20px' }}>
          {isTamil
            ? 'உங்கள் பிளவுஸ் தையல் மற்றும் ஆரி வேலைப்பாடு பதிவு செய்யப்பட்டுள்ளது. எங்கள் தலைமை டெய்லர் விரைவில் உங்கள் அளவுகளை சரிபார்ப்பார்.'
            : `Thank you for choosing ${BUSINESS_CONFIG.businessName}. Your bespoke blouse order is now entering our artisanal tailoring queue.`}
        </p>

        {/* Order Reference Badge */}
        <div
          style={{
            display: 'inline-flex',
            flexDirection: 'column',
            gap: '4px',
            background: 'var(--color-gold-subtle)',
            border: '1px solid var(--color-border-gold)',
            borderRadius: 'var(--radius-md)',
            padding: '12px 28px',
            marginBottom: 'var(--space-32)'
          }}
        >
          <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-gold-dark)' }}>
            {isTamil ? 'ஆர்டர் குறிப்பு எண்' : 'Official Order Reference'}
          </span>
          <span style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--color-primary-dark)', fontFamily: 'var(--font-heading-en)' }}>
            {order.id}
          </span>
        </div>

        {/* Order Summary Snapshot */}
        <div
          style={{
            background: 'var(--color-bg)',
            borderRadius: 'var(--radius-sm)',
            padding: '20px',
            textAlign: 'left',
            maxWidth: '560px',
            margin: '0 auto 32px'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.88rem' }}>
            <span>{isTamil ? 'வாடிக்கையாளர்' : 'Customer'}:</span>
            <strong>{order.customer?.name}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.88rem' }}>
            <span>{isTamil ? 'கைபேசி' : 'Phone'}:</span>
            <strong>{order.customer?.phone}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.88rem' }}>
            <span>{isTamil ? 'பேமெண்ட் நிலை' : 'Payment Status'}:</span>
            <span className={`badge ${order.paymentStatus === 'paid' ? 'badge-success' : 'badge-gold'}`}>
              {order.paymentStatus === 'paid' ? (isTamil ? 'பணம் உறுதிப்படுத்தப்பட்டது' : 'Paid Online') : (isTamil ? 'சரிபார்ப்பில் உள்ளது' : 'Verification Pending')}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '8px', borderTop: '1px solid var(--color-border)', fontSize: '1rem', fontWeight: 700, color: 'var(--color-primary-dark)' }}>
            <span>{isTamil ? 'மொத்தத் தொகை' : 'Total Amount'}:</span>
            <span>₹{order.totalAmount?.toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '16px' }}>
          <button
            onClick={() => onTrackOrder(order.id)}
            className="btn btn-gold btn-lg"
          >
            <Clock size={18} />
            <span>{isTamil ? 'ஆர்டரை கண்காணியுங்கள்' : 'Track Blouse Live'}</span>
          </button>

          <a
            href={BUSINESS_CONFIG.getWhatsAppUrl(BUSINESS_CONFIG.messages.orderUpdate(order.id, isTamil))}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline-gold btn-lg"
          >
            <MessageCircle size={18} color="#25D366" />
            <span>{isTamil ? 'டெய்லருடன் பேசுக' : 'WhatsApp Tailor'}</span>
          </a>

          <button
            onClick={onContinueShopping}
            className="btn btn-outline"
          >
            <span>{isTamil ? 'முகப்பிற்கு செல்ல' : 'Back to Home'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
