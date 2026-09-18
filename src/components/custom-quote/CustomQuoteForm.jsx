import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useOrders } from '../../context/OrderContext';
import { Upload, Sparkles, CheckCircle, Calendar, MessageSquare, ShieldCheck } from 'lucide-react';

export default function CustomQuoteForm({ onQuoteSubmitted }) {
  const { t, isTamil } = useLanguage();
  const { submitQuoteRequest } = useOrders();

  const [customerName, setCustomerName] = useState('Priya Dharshini');
  const [phone, setPhone] = useState('+91 98840 12345');
  const [email, setEmail] = useState('priya.dh@gmail.com');
  const [eventDate, setEventDate] = useState('2026-10-25');
  const [targetBudget, setTargetBudget] = useState('3500 - 5000');
  const [fabricSource, setFabricSource] = useState('fabricOwned'); // 'fabricOwned' or 'boutiqueProvides'
  const [workPreference, setWorkPreference] = useState('heavy_bridal');
  const [requirements, setRequirements] = useState('Need peacock motifs on sleeve with kundan stones for wedding silk saree.');
  const [referencePhoto, setReferencePhoto] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [generatedQuoteId, setGeneratedQuoteId] = useState('');

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setReferencePhoto(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const quotePayload = {
      customerName,
      phone,
      email,
      eventDate,
      targetBudget,
      fabricSource,
      workPreference,
      requirements,
      referenceImages: referencePhoto ? [referencePhoto] : [
        'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80'
      ]
    };

    const newQuote = submitQuoteRequest(quotePayload);
    setGeneratedQuoteId(newQuote.id);
    setIsSuccess(true);
    if (onQuoteSubmitted) onQuoteSubmitted(newQuote);
  };

  if (isSuccess) {
    return (
      <div className="container-narrow section-padding animate-fade-in">
        <div className="card-premium" style={{ padding: 'var(--space-48)', textAlign: 'center' }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: '50%',
              background: 'var(--color-success-bg)',
              color: 'var(--color-success)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px'
            }}
          >
            <CheckCircle size={38} />
          </div>

          <h2 style={{ fontSize: '1.8rem', color: 'var(--color-primary-dark)', marginBottom: '8px' }}>
            {t('quote.quoteSubmitted')}
          </h2>

          <div className="badge badge-gold" style={{ fontSize: '0.9rem', padding: '6px 14px', marginBottom: '16px' }}>
            {isTamil ? 'கோரிக்கை எண்' : 'Quote Reference'}: {generatedQuoteId}
          </div>

          <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.6, maxWidth: '560px', margin: '0 auto 24px' }}>
            {t('quote.quoteSuccessDesc')}
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
            <button
              onClick={() => setIsSuccess(false)}
              className="btn btn-outline"
            >
              {isTamil ? 'மற்றொரு டிசைன் கேட்க' : 'Submit Another Request'}
            </button>
            <a
              href={`https://wa.me/919876543210?text=${encodeURIComponent(
                isTamil
                  ? `வணக்கம், என் விருப்ப பிளவுஸ் விலை கோரிக்கை எண் ${generatedQuoteId} பற்றி பேச விரும்புகிறேன்.`
                  : `Hello, I would like an estimate update on my custom blouse quote ${generatedQuoteId}.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-gold"
            >
              <span>{isTamil ? 'வாட்ஸ்அப்பில் உடனடியாக பேச' : 'Chat with Designer on WhatsApp'}</span>
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-narrow section-padding">
      <div style={{ textAlign: 'center', marginBottom: 'var(--space-32)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          <Sparkles size={18} color="var(--color-gold-dark)" />
          <span className="section-eyebrow">
            {isTamil ? 'விருப்ப தையல் ஸ்டுடியோ' : 'Bespoke Atelier Service'}
          </span>
        </div>
        <h1 style={{ fontSize: '2.4rem', color: 'var(--color-primary-dark)', marginBottom: '12px' }}>
          {t('quote.title')}
        </h1>
        <p style={{ color: 'var(--color-text-muted)', maxWidth: '680px', margin: '0 auto' }}>
          {t('quote.subtitle')}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="card-premium" style={{ padding: 'var(--space-32)' }}>
        {/* Step 1: Reference Upload */}
        <div style={{ marginBottom: '28px' }}>
          <h3 style={{ fontSize: '1.15rem', color: 'var(--color-primary-dark)', marginBottom: '12px' }}>
            {t('quote.step1')}
          </h3>
          <div
            style={{
              border: '2px dashed var(--color-border-gold)',
              borderRadius: 'var(--radius-md)',
              padding: '30px 20px',
              textAlign: 'center',
              background: 'var(--color-bg)'
            }}
          >
            <Upload size={36} color="var(--color-gold-dark)" style={{ margin: '0 auto 10px' }} />
            <h4 style={{ fontSize: '0.95rem', color: 'var(--color-primary-dark)', marginBottom: '6px' }}>
              {isTamil ? 'படத்தை இங்கே இழுத்துப் போடவும் அல்லது தேர்ந்தெடுக்கவும்' : 'Drag & drop your reference photo from Instagram or gallery'}
            </h4>
            <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginBottom: '16px' }}>
              PNG, JPG, WEBP up to 10MB
            </p>
            <input
              type="file"
              accept="image/*"
              id="quote-photo-upload"
              style={{ display: 'none' }}
              onChange={handlePhotoUpload}
            />
            <label htmlFor="quote-photo-upload" className="btn btn-sm btn-outline-gold" style={{ cursor: 'pointer' }}>
              <span>{isTamil ? 'புகைப்படம் தேர்ந்தெடுக்கவும்' : 'Select Photo'}</span>
            </label>

            {referencePhoto && (
              <div style={{ marginTop: '16px' }}>
                <img
                  src={referencePhoto}
                  alt="Reference uploaded"
                  style={{ maxHeight: '160px', margin: '0 auto', borderRadius: 'var(--radius-sm)' }}
                />
                <div style={{ color: 'var(--color-success)', fontSize: '0.82rem', fontWeight: 600, marginTop: 6 }}>
                  ✓ {isTamil ? 'படம் வெற்றிகரமாக சேர்க்கப்பட்டது' : 'Image Attached'}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Step 2: Description */}
        <div style={{ marginBottom: '28px' }}>
          <h3 style={{ fontSize: '1.15rem', color: 'var(--color-primary-dark)', marginBottom: '12px' }}>
            {t('quote.step2')}
          </h3>
          <textarea
            rows={3}
            required
            value={requirements}
            onChange={(e) => setRequirements(e.target.value)}
            placeholder={isTamil ? 'உதாரணம்: எனக்கு இந்த படத்தில் உள்ள மயில் மோட்டிஃப் முழங்கை வரை வேண்டும், பின்னால் லட்கன்ஸ் இருக்க வேண்டும்...' : 'e.g. I need the peacock motif from this reference photo along elbow sleeve with cutwork...'}
            className="input-styled"
          />
        </div>

        {/* Step 3: Fabric & Work Preference */}
        <div style={{ marginBottom: '28px' }}>
          <h3 style={{ fontSize: '1.15rem', color: 'var(--color-primary-dark)', marginBottom: '12px' }}>
            {t('quote.step3')}
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px', marginBottom: '16px' }}>
            <button
              type="button"
              onClick={() => setFabricSource('fabricOwned')}
              className={`option-chip ${fabricSource === 'fabricOwned' ? 'selected' : ''}`}
              style={{ padding: '14px' }}
            >
              <strong style={{ fontSize: '0.9rem', color: 'var(--color-primary-dark)' }}>
                {t('quote.fabricOwned')}
              </strong>
            </button>
            <button
              type="button"
              onClick={() => setFabricSource('boutiqueProvides')}
              className={`option-chip ${fabricSource === 'boutiqueProvides' ? 'selected' : ''}`}
              style={{ padding: '14px' }}
            >
              <strong style={{ fontSize: '0.9rem', color: 'var(--color-primary-dark)' }}>
                {t('quote.boutiqueProvides')}
              </strong>
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            <div className="measurement-field">
              <label className="field-label">{t('quote.targetBudget')}</label>
              <input
                type="text"
                placeholder="e.g. 3000 - 4500"
                value={targetBudget}
                onChange={(e) => setTargetBudget(e.target.value)}
                className="input-styled"
              />
            </div>
            <div className="measurement-field">
              <label className="field-label">{isTamil ? 'நிகழ்ச்சி நாள்' : 'Target Event Date'}</label>
              <input
                type="date"
                required
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="input-styled"
              />
            </div>
          </div>
        </div>

        {/* Step 4: Contact Details */}
        <div style={{ marginBottom: '32px' }}>
          <h3 style={{ fontSize: '1.15rem', color: 'var(--color-primary-dark)', marginBottom: '12px' }}>
            {t('quote.step4')}
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            <div className="measurement-field">
              <label className="field-label">{t('checkout.fullName')} *</label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="input-styled"
              />
            </div>
            <div className="measurement-field">
              <label className="field-label">{t('checkout.phone')} *</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="input-styled"
              />
            </div>
            <div className="measurement-field">
              <label className="field-label">{t('checkout.email')}</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-styled"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <button type="submit" className="btn btn-gold btn-lg" style={{ width: '100%' }}>
          <Sparkles size={18} />
          <span>{t('quote.submitQuote')}</span>
        </button>
      </form>
    </div>
  );
}
