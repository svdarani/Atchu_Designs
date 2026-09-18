import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useShop } from '../../context/ShopContext';
import { useOrders } from '../../context/OrderContext';
import { BUSINESS_CONFIG } from '../../data/businessConfig';
import {
  User,
  Ruler,
  Truck,
  CreditCard,
  ShieldCheck,
  CheckCircle,
  ArrowRight,
  Upload,
  Sparkles
} from 'lucide-react';

export default function CheckoutStepper({ onOrderSuccess }) {
  const { t, isTamil } = useLanguage();
  const { cart, cartSubtotal, clearCart } = useShop();
  const { createOrder } = useOrders();

  const [activeStep, setActiveStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    fullName: 'Kavitha Ramachandran',
    phone: '+91 94432 18900',
    email: 'kavitha.r@gmail.com',
    eventDate: '2026-10-12',
    address: 'Plot 12, Sri Nagar 2nd Street, Anna Nagar',
    city: 'Chennai',
    state: 'Tamil Nadu',
    pincode: '600040',
    specialNotes: 'Please keep 2-inch alteration margins inside sleeve and waist.',
    paymentMethod: 'online_upi', // 'online_upi' or 'offline_upi_transfer'
    utrNumber: '',
    paymentProofPhoto: null
  });

  const handleChange = (field, val) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
  };

  const handleProofUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => handleChange('paymentProofPhoto', reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleFinalSubmit = (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);

    const orderPayload = {
      type: 'online',
      customer: {
        name: formData.fullName,
        phone: formData.phone,
        email: formData.email,
        address: `${formData.address}, ${formData.city}, ${formData.state} - ${formData.pincode}`
      },
      items: cart.map((c) => ({
        productName_en: c.product.name_en,
        productName_ta: c.product.name_ta,
        image: c.product.images?.[0] || '',
        unitPrice: c.unitPrice,
        quantity: c.quantity,
        customization: c.customization,
        measurements: c.measurements
      })),
      totalAmount: cartSubtotal,
      paymentMethod: formData.paymentMethod,
      targetDate: formData.eventDate,
      notes: formData.specialNotes,
      paymentProof: formData.paymentMethod === 'offline_upi_transfer' ? {
        utr: formData.utrNumber || 'MANUAL-PENDING',
        screenshot: formData.paymentProofPhoto,
        submittedAt: new Date().toISOString()
      } : null
    };

    setTimeout(() => {
      const newOrder = createOrder(orderPayload);
      clearCart();
      setIsSubmitting(false);
      onOrderSuccess(newOrder);
    }, 900);
  };

  return (
    <div className="container-narrow section-padding">
      <div style={{ textAlign: 'center', marginBottom: 'var(--space-32)' }}>
        <h1 style={{ fontSize: '2.2rem', color: 'var(--color-primary-dark)', marginBottom: '8px' }}>
          {t('checkout.title')}
        </h1>
        <p style={{ color: 'var(--color-text-muted)' }}>
          {isTamil
            ? 'அளவுகள் சரிபார்ப்பு முதல் பாதுகாப்பான பேமெண்ட் வரை'
            : 'Review tailoring measurements, shipping destination and payment security'}
        </p>
      </div>

      {/* Stepper Progress Bar */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '8px',
          marginBottom: 'var(--space-32)',
          background: 'var(--color-surface)',
          padding: '12px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--color-border)'
        }}
      >
        {[
          { step: 1, label: t('checkout.steps.contact'), icon: <User size={16} /> },
          { step: 2, label: t('checkout.steps.measurements'), icon: <Ruler size={16} /> },
          { step: 3, label: t('checkout.steps.delivery'), icon: <Truck size={16} /> },
          { step: 4, label: t('checkout.steps.payment'), icon: <CreditCard size={16} /> }
        ].map((s) => (
          <button
            key={s.step}
            onClick={() => setActiveStep(s.step)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '8px 6px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.8rem',
              fontWeight: activeStep === s.step ? 700 : 500,
              background: activeStep === s.step ? 'var(--color-primary)' : 'transparent',
              color: activeStep === s.step ? '#FFFFFF' : 'var(--color-text-muted)'
            }}
          >
            {s.icon}
            <span style={{ display: 'none', minWidth: '0' }} className="d-sm-inline">
              {s.label}
            </span>
          </button>
        ))}
      </div>

      {/* Main Checkout Form Box */}
      <form onSubmit={handleFinalSubmit} className="card-premium" style={{ padding: 'var(--space-32)' }}>
        {/* STEP 1: Customer Contact */}
        {activeStep === 1 && (
          <div className="animate-fade-in">
            <h3 style={{ fontSize: '1.25rem', color: 'var(--color-primary-dark)', marginBottom: '16px' }}>
              {t('checkout.steps.contact')}
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
              <div className="measurement-field">
                <label className="field-label">{t('checkout.fullName')} *</label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => handleChange('fullName', e.target.value)}
                  className="input-styled"
                />
              </div>
              <div className="measurement-field">
                <label className="field-label">{t('checkout.phone')} *</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  className="input-styled"
                />
              </div>
              <div className="measurement-field">
                <label className="field-label">{t('checkout.email')}</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="input-styled"
                />
              </div>
              <div className="measurement-field">
                <label className="field-label">{t('checkout.weddingDate')}</label>
                <input
                  type="date"
                  value={formData.eventDate}
                  onChange={(e) => handleChange('eventDate', e.target.value)}
                  className="input-styled"
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
              <button
                type="button"
                onClick={() => setActiveStep(2)}
                className="btn btn-primary"
              >
                <span>{isTamil ? 'அடுத்த நிலை: அளவுகள்' : 'Next: Verify Measurements'}</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Measurements Review */}
        {activeStep === 2 && (
          <div className="animate-fade-in">
            <h3 style={{ fontSize: '1.25rem', color: 'var(--color-primary-dark)', marginBottom: '16px' }}>
              {t('checkout.steps.measurements')}
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
              {cart.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '16px',
                    background: 'var(--color-bg)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <strong style={{ color: 'var(--color-primary-dark)' }}>
                      {isTamil ? item.product.name_ta : item.product.name_en}
                    </strong>
                    <span className="badge badge-gold">
                      {item.measurements?.status === 'provided' ? (isTamil ? 'அளவுகள் தயாராக உள்ளன' : 'Ready') : (isTamil ? 'டெய்லர் ஆலோசனை' : 'Consultation')}
                    </span>
                  </div>

                  {item.measurements?.measurements ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '8px', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                      <div>Bust: <strong>{item.measurements.measurements.bust}"</strong></div>
                      <div>Waist: <strong>{item.measurements.measurements.waist}"</strong></div>
                      <div>Shoulder: <strong>{item.measurements.measurements.shoulder}"</strong></div>
                      <div>Armhole: <strong>{item.measurements.measurements.armhole}"</strong></div>
                      <div>Sleeve: <strong>{item.measurements.measurements.sleeveLength}"</strong></div>
                      <div>Front Neck: <strong>{item.measurements.measurements.frontNeck}"</strong></div>
                      <div>Back Neck: <strong>{item.measurements.measurements.backNeck}"</strong></div>
                    </div>
                  ) : (
                    <p style={{ fontSize: '0.84rem', color: 'var(--color-text-muted)' }}>
                      {isTamil
                        ? 'ஆர்டர் உறுதி செய்யப்பட்டதும் எங்கள் தையல் கலைஞர் போன்/வாட்ஸ்அப்பில் பேசி அளவுகளை உறுதி செய்வார்.'
                        : 'Our master tailor will consult via phone/WhatsApp call to finalize exact seam measurements.'}
                    </p>
                  )}
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px' }}>
              <button
                type="button"
                onClick={() => setActiveStep(1)}
                className="btn btn-outline"
              >
                {t('common.back')}
              </button>
              <button
                type="button"
                onClick={() => setActiveStep(3)}
                className="btn btn-primary"
              >
                <span>{isTamil ? 'அடுத்த நிலை: முகவரி' : 'Next: Shipping Address'}</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Delivery Address */}
        {activeStep === 3 && (
          <div className="animate-fade-in">
            <h3 style={{ fontSize: '1.25rem', color: 'var(--color-primary-dark)', marginBottom: '16px' }}>
              {t('checkout.steps.delivery')}
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
              <div className="measurement-field" style={{ gridColumn: '1 / -1' }}>
                <label className="field-label">{t('checkout.address')} *</label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  className="input-styled"
                />
              </div>
              <div className="measurement-field">
                <label className="field-label">{t('checkout.city')} *</label>
                <input
                  type="text"
                  required
                  value={formData.city}
                  onChange={(e) => handleChange('city', e.target.value)}
                  className="input-styled"
                />
              </div>
              <div className="measurement-field">
                <label className="field-label">{t('checkout.state')} *</label>
                <input
                  type="text"
                  required
                  value={formData.state}
                  onChange={(e) => handleChange('state', e.target.value)}
                  className="input-styled"
                />
              </div>
              <div className="measurement-field">
                <label className="field-label">{t('checkout.pincode')} *</label>
                <input
                  type="text"
                  required
                  value={formData.pincode}
                  onChange={(e) => handleChange('pincode', e.target.value)}
                  className="input-styled"
                />
              </div>
              <div className="measurement-field" style={{ gridColumn: '1 / -1' }}>
                <label className="field-label">{t('checkout.specialNotes')}</label>
                <textarea
                  rows={2}
                  value={formData.specialNotes}
                  onChange={(e) => handleChange('specialNotes', e.target.value)}
                  className="input-styled"
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px' }}>
              <button
                type="button"
                onClick={() => setActiveStep(2)}
                className="btn btn-outline"
              >
                {t('common.back')}
              </button>
              <button
                type="button"
                onClick={() => setActiveStep(4)}
                className="btn btn-primary"
              >
                <span>{isTamil ? 'அடுத்த நிலை: பேமெண்ட்' : 'Next: Payment Method'}</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Payment Options */}
        {activeStep === 4 && (
          <div className="animate-fade-in">
            <h3 style={{ fontSize: '1.25rem', color: 'var(--color-primary-dark)', marginBottom: '16px' }}>
              {t('checkout.steps.payment')}
            </h3>

            {/* Payment Method Selector */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
              {/* Option A: Online Simulated Gateway */}
              <div
                onClick={() => handleChange('paymentMethod', 'online_upi')}
                style={{
                  padding: '16px',
                  borderRadius: 'var(--radius-sm)',
                  border: formData.paymentMethod === 'online_upi' ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                  background: formData.paymentMethod === 'online_upi' ? 'var(--color-primary-subtle)' : '#FFFFFF',
                  cursor: 'pointer'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <CreditCard size={20} color="var(--color-primary)" />
                    <strong>{t('checkout.onlinePay')}</strong>
                  </div>
                  <span className="badge badge-success">{isTamil ? 'உடனடி உறுதி' : 'Instant Confirm'}</span>
                </div>
                <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', marginTop: '6px' }}>
                  {isTamil ? 'Google Pay, PhonePe, Paytm, கார்டுகள் மற்றும் நெட்பேங்கிங் மூலம் பாதுகாப்பாக செலுத்தலாம்.' : 'Pay instantly via UPI (GPay, PhonePe, Paytm), Debit/Credit Cards & NetBanking.'}
                </p>
              </div>

              {/* Option B: Offline Direct / Store Payment */}
              <div
                onClick={() => handleChange('paymentMethod', 'offline_upi_transfer')}
                style={{
                  padding: '16px',
                  borderRadius: 'var(--radius-sm)',
                  border: formData.paymentMethod === 'offline_upi_transfer' ? '2px solid var(--color-gold)' : '1px solid var(--color-border)',
                  background: formData.paymentMethod === 'offline_upi_transfer' ? 'var(--color-gold-subtle)' : '#FFFFFF',
                  cursor: 'pointer'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <ShieldCheck size={20} color="var(--color-gold-dark)" />
                    <strong>{t('checkout.offlinePay')}</strong>
                  </div>
                  <span className="badge badge-gold">{isTamil ? 'நேரடி பரிமாற்றம்' : 'Direct Transfer'}</span>
                </div>
                <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', marginTop: '6px' }}>
                  {t('checkout.offlineNotice')}
                </p>
              </div>
            </div>

            {/* If Offline Payment selected: Provide UPI details & UTR upload */}
            {formData.paymentMethod === 'offline_upi_transfer' && (
              <div style={{ background: '#FAF6F0', padding: '16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border-gold)', marginBottom: '24px' }}>
                <div style={{ marginBottom: '12px', fontSize: '0.86rem' }}>
                  <div><strong>{isTamil ? 'கடை UPI ஐடி:' : 'Boutique UPI ID:'}</strong> <code style={{ background: '#FFFFFF', padding: '2px 6px', borderRadius: 4, color: 'var(--color-primary)' }}>{BUSINESS_CONFIG.upiId}</code></div>
                  <div style={{ marginTop: 4 }}>
                    <strong>{isTamil ? 'ஜிபே / போன்பே எண்:' : 'GPay / PhonePe Mobile:'}</strong>{' '}
                    <a href={BUSINESS_CONFIG.telLink} style={{ color: 'var(--color-primary)', fontWeight: 600, textDecoration: 'none' }}>
                      {BUSINESS_CONFIG.phone}
                    </a>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
                  <div className="measurement-field">
                    <label className="field-label">{t('checkout.utrPlaceholder')}</label>
                    <input
                      type="text"
                      placeholder="e.g. 428910024512"
                      value={formData.utrNumber}
                      onChange={(e) => handleChange('utrNumber', e.target.value)}
                      className="input-styled"
                    />
                  </div>

                  <div className="measurement-field">
                    <label className="field-label">{t('checkout.uploadScreenshot')}</label>
                    <input
                      type="file"
                      accept="image/*"
                      id="proof-upload"
                      style={{ display: 'none' }}
                      onChange={handleProofUpload}
                    />
                    <label htmlFor="proof-upload" className="btn btn-sm btn-outline-gold" style={{ cursor: 'pointer', textAlign: 'center' }}>
                      <Upload size={14} />
                      <span>{formData.paymentProofPhoto ? (isTamil ? 'ரசீது இணைக்கப்பட்டது' : 'Screenshot Attached') : (isTamil ? 'ரசீது தேர்ந்தெடுக்கவும்' : 'Upload Receipt')}</span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Total Summary */}
            <div style={{ background: 'var(--color-bg)', padding: '16px', borderRadius: 'var(--radius-sm)', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>{t('cart.total')}:</span>
                <div style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--color-primary-dark)' }}>
                  ₹{cartSubtotal.toLocaleString('en-IN')}
                </div>
              </div>
              <div style={{ textAlign: 'right', fontSize: '0.82rem', color: 'var(--color-success)' }}>
                ✓ {isTamil ? 'இலவச டெலிவரி' : 'Complimentary Express Delivery'}
              </div>
            </div>

            {/* Submit Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button
                type="button"
                onClick={() => setActiveStep(3)}
                className="btn btn-outline"
                disabled={isSubmitting}
              >
                {t('common.back')}
              </button>
              <button
                type="submit"
                className="btn btn-gold btn-lg"
                disabled={isSubmitting}
              >
                <CheckCircle size={18} />
                <span>{isSubmitting ? t('checkout.orderProcessing') : t('checkout.placeOrder')}</span>
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
